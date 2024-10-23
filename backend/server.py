from flask import Flask, request, jsonify
from s3_bucket_helpers import urlFromBucketObj, uploadFileToBucket
from dynamodb_helpers import listOfMusicBaskets, addExperimentalFileUpload
import boto3
from botocore.exceptions import ClientError
from dotenv import load_dotenv
from flask_cors import CORS
import uuid
from functools import wraps

import os
load_dotenv()
app = Flask(__name__)
CORS(app)
client = boto3.client('cognito-idp', region_name='ap-southeast-2')
dynamodb = boto3.resource('dynamodb', region_name='ap-southeast-2')
s3 = boto3.client('s3', region_name='ap-southeast-2')


#Authentication
def validate_token(token):
    try:
        response = client.get_user(AccessToken=token)
        print(response)
        return response
    except ClientError as e:
        return None

# An authentication wrapping function to ensure that the user has a valid token before accessing a route
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get('Authorization', None)
        if not auth_header:
            return jsonify({'error': 'Missing Authorization header'}), 401

        token = auth_header.split(" ")[1]
        user = validate_token(token)

        if user is None:
            return jsonify({'error': 'Invalid or expired token'}), 403

        request.user = user
        return f(*args, **kwargs)

    return decorated

@app.route('/signup', methods=['POST'])
def sign_up():
    try:
        data = request.json
        username = data['username']
        email = data['email']
        password = data['password']
        response = client.sign_up(
            ClientId=os.getenv('AWS_COGNITO_CLIENTID'),
            Username=username,
            Password=password,
            UserAttributes=[
                {
                    'Name': 'email',
                    'Value': email
                },
            ]
        )

        return jsonify({
            'message': 'Sign up successful!',
            'user_sub': response['UserSub']
        }), 200

    except ClientError as e:
        return jsonify({
            'error': str(e)
        }), 400

    except KeyError:
        return jsonify({
            'error': 'Missing required fields (username, email, password)'
        }), 400

@app.route('/confirmSignup', methods=['POST'])
def confirmSignup():
    try:
        data = request.json
        code = data['code']
        username = data['username']

        client.confirm_sign_up(
            ClientId=os.getenv('AWS_COGNITO_CLIENTID'),
            Username=username,
            ConfirmationCode=code
        )

        response = client.admin_get_user(
            UserPoolId=os.getenv('AWS_COGNITO_USERPOOLID'),
            Username=username
        )

        email = ''

        # Users account is recorded in dynamodb only after it is confirmed
        for attribute in response['UserAttributes']:
            if attribute['Name'] == 'email':
                email = attribute['Value']

        users = dynamodb.Table(os.getenv('DYNAMODB_TABLE_USERS'))

        user = {
            'id': str(uuid.uuid4()),
            'username': username,
            'email': email,
            'profile_picture': f'https://{os.getenv("S3_BUCKET_USER_PICTURE")}.s3.amazonaws.com/default-avatar-icon-of-social-media-user-vector.jpg',
            'instrument': '',
            'miniTestsProgress': [],
            'history': [],
            'level': '1',
            'experimental_upload_videos': [],
            'experimental_upload_audios': []
        }

        users.put_item(Item=user)


        return jsonify({
            'message': 'Confirmation successful!',
        }), 200

    except ClientError as e:
        return jsonify({
            'error': str(e)
        }), 400

    except KeyError:
        return jsonify({
            'error': 'Missing required fields (code)'
        }), 400

@app.route('/resendConfirmation', methods=['POST'])
def resendConfirmation():
    try:
        data = request.json
        username = data['username']

        client.resend_confirmation_code(
            ClientId=os.getenv('AWS_COGNITO_CLIENTID'),
            Username=username,
        )

        return jsonify({
            'message': 'New Code has been sent',
        }), 200

    except ClientError as e:
        return jsonify({
            'error': str(e)
        }), 400

    except KeyError:
        return jsonify({
            'error': 'Missing required fields (username)'
        }), 400

@app.route('/login', methods=['POST'])
def login():
    try:
        data = request.json
        email = data['email']
        password = data['password']

        response = client.initiate_auth(
            ClientId=os.getenv('AWS_COGNITO_CLIENTID'),
            AuthFlow='USER_PASSWORD_AUTH',
            AuthParameters={
                    'USERNAME': email,
                    'PASSWORD': password
                },
        )

        # The user id is returned to allow the front end to make queries in the future
        users = dynamodb.Table(os.getenv('DYNAMODB_TABLE_USERS'))
        result = users.query(
            IndexName='email-index',
            KeyConditionExpression=boto3.dynamodb.conditions.Key('email').eq(email)
        )

        user = result['Items'][0]
        user_id = user['id']

        return jsonify({
            'message': 'Login successful!',
            'access_token': response['AuthenticationResult']['AccessToken'],
            'id_token': response['AuthenticationResult']['IdToken'],
            'refresh_token': response['AuthenticationResult']['RefreshToken'],
            'user_id': user_id
        }), 200

    except ClientError as e:
        return jsonify({
            'error': str(e)
        }), 400

    except KeyError:
        return jsonify({
            'error': 'Missing required fields (email, password)'
        }), 400

@app.route('/logout', methods=['POST'])
def logout():
    try:
        data = request.json
        access_token = data['access_token']

        client.global_sign_out(
            AccessToken=access_token
        )

        return jsonify({
            'message': 'Logout successful!'
        }), 200

    except ClientError as e:
        return jsonify({
            'error': str(e)
        }), 400

    except KeyError:
        return jsonify({
            'error': 'Missing required fields (access_token)'
        }), 400

# User routes
@app.route('/getUserDetails/<user_id>', methods=['GET'])
@token_required
def getUserDetails(user_id):
    try:
        # Must first make sure that the user has the correct permissions to view this user data
        user = request.user

        users = dynamodb.Table(os.getenv('DYNAMODB_TABLE_USERS'))
        response = users.get_item(Key={'id': user_id})

        if 'Item' not in response:
            return jsonify({'error': 'User not found'}), 404

        user_data = response['Item']
        print(user['Username'])
        print(user_data['username'])
        if user['Username'].lower() != user_data['username'].lower():
            return jsonify({'error': 'Unauthorized access to this user\'s data'}), 403

        return jsonify(user_data), 200

    except Exception as e:
        return jsonify({
            'error': 'An error occurred while fetching user details',
            'details': str(e)
        }), 500


@app.route('/updateProfilePicture', methods=['POST'])
@token_required
def updateProfilePicture():
    try:
        data = request.form
        user_id = data['id']
        file = request.files['file']

        file_extension = file.filename.split('.')[-1]
        filename = f"{user_id}-profile-picture.{file_extension}"

        s3.upload_fileobj(
            file,
            os.getenv('S3_BUCKET_USER_PICTURE'),
            f'profile-pictures/{filename}',
        )

        file_url = f"https://{os.getenv('S3_BUCKET_USER_PICTURE')}.s3.amazonaws.com/profile-pictures/{filename}"

        users = dynamodb.Table(os.getenv('DYNAMODB_TABLE_USERS'))
        users.update_item(
            Key={'id': user_id},
            UpdateExpression='SET profile_picture = :url',
            ExpressionAttributeValues={':url': file_url}
        )

        return jsonify({
            'message': 'Profile picture updated successfully!',
            'profile_picture_url': file_url
        }), 200

    except ClientError as e:
        return jsonify({
            'error': str(e)
        }), 400

    except KeyError:
        return jsonify({
            'error': 'Missing required fields (user_id, file)'
        }), 400

# Route that will help to request the profile picture of a user.
# file key should be as such "{user_id}-profile-picture.{file_extension}""
@app.route('/get-presigned-url-picture/<file_key>', methods=['GET'])
@token_required
def get_presigned_url_picture(file_key):
    try:
        presigned_url = s3.generate_presigned_url(
            'get_object',
            Params={'Bucket': os.getenv('S3_BUCKET_USER_PICTURE'), 'Key': f'profile-pictures/{file_key}'},
            ExpiresIn=604800
        )

        return jsonify({
            'url': presigned_url
        }), 200

    except Exception as e:
        return jsonify({
            'error': str(e)
        }), 500

# Route that will help to request the audio relating to a specic song
@app.route('/get-presigned-url-track-audio/<song_id>', methods=['GET'])
@token_required
def get_presigned_url_track_audio(song_id):
    try:
        presigned_url = s3.generate_presigned_url(
            'get_object',
            Params={'Bucket': os.getenv('S3_BUCKET_TRACKS'), 'Key': f'{song_id}'},
            ExpiresIn=604800
        )

        return jsonify({
            'url': presigned_url
        }), 200

    except Exception as e:
        return jsonify({
            'error': str(e)
        }), 500

# Route that will help to get the audio from a users previous experiment on a song
@app.route('/get-presigned-url-user-experiment-audio/<user_id>/<song_id>/<track_attempt_id>', methods=['GET'])
@token_required
def get_presigned_url_user_experiment_audio(song_id, user_id, track_attempt_id):
    try:
        presigned_url = s3.generate_presigned_url(
            'get_object',
            Params={'Bucket': os.getenv('S3_BUCKET_USER_AUDIO'), 'Key': f'{user_id}/{song_id}/{track_attempt_id}'},
            ExpiresIn=604800
        )

        return jsonify({
            'url': presigned_url
        }), 200

    except Exception as e:
        return jsonify({
            'error': str(e)
        }), 500

# Route that will help to get the video from a users previous experiment on a song
@app.route('/get-presigned-url-user-experiment-video/<user_id>/<song_id>/<track_attempt_id>', methods=['GET'])
@token_required
def get_presigned_url_user_experiment_video(song_id, user_id, track_attempt_id):
    try:
        presigned_url = s3.generate_presigned_url(
            'get_object',
            Params={'Bucket': os.getenv('S3_BUCKET_USER_VIDEO'), 'Key': f'{user_id}/{song_id}/{track_attempt_id}'},
            ExpiresIn=604800
        )

        return jsonify({
            'url': presigned_url
        }), 200

    except Exception as e:
        return jsonify({
            'error': str(e)
        }), 500

@app.route('/catalogue/songs/list-all', methods=['GET'])
@token_required
def get_music_basket_list():
    '''GET route which returns a list of "music baskets", which contain additional
    info about a song.
    returns:
    {
        "songs": List[Song]
    },

    where
    Song: {
        id: str
        thumbnail: str
        genreTags: list[str]
        instrument: str
        title: str
        difficulty: float       # assigned a float value from [1, 5]
    }
    '''
    songs = listOfMusicBaskets()
    if songs is not None:
        return jsonify({
            'songs': songs
        }), 200
    else:
        return jsonify({
            'error': 'Music baskets cannot be found'
        }), 500

@app.route('/catalogue/songs/find/<string:id>', methods=['GET'])
@token_required
def get_file_pdf(id):
    '''GET route for retrieving a link to the pdf specified by key
    returns:
    {
        "url": "https://bucketName.s3.amazonaws.com/id?AWSAccessKeyId=notTheNorm
                alAccessKey&Signature=INSERTSIGNATURE&Expires=1728212979"
    }
    '''

    url = urlFromBucketObj(os.getenv('S3_BUCKET_TRACKS_SHEETS'), id)
    if url is not None:
        return jsonify({
            'url': url
        }), 200
    else:
        return jsonify({
            'error': 'requested file does not exist, please check you\'re using the file key.'
        }), 404

@app.route('/files/user/audio/upload', methods=['POST'])
@token_required
def upload_experimental_audio():
    '''POST route for uploading experimental audio
    Body requires a json with the keys: userId, uploadName, filePath
    returns:
    {
        "message": "Upload successful, file under key: {uploadName}, for user: {userId}"
    }
    '''
    try:
        data = request.json
        userId = data['userId']
        uploadName = data['uploadName']
        filePath = data['filePath']

        uploadFileToBucket('user-experiment-audio', filePath, uploadName)
        addExperimentalFileUpload(userId, 'audio', uploadName)

        return jsonify({
            'message': f'Upload successful, file under key: {uploadName}, for user: {userId}',
        }), 200

    except FileNotFoundError as e:
        return jsonify({
            'error': str(e)
        }), 404

    except ClientError as e:
        return jsonify({
            'error': str(e)
        }), 400

    except KeyError:
        return jsonify({
            'error': 'Missing required fields (userId, uploadName, filePath)'
        }), 400

@app.route('/files/user/video/upload', methods=['POST'])
@token_required
def upload_experimental_video():
    '''POST route for uploading experimental video
    Body requires a json with the keys: userId, uploadName, filePath
    returns:
    {
        "message": "Upload successful, file under key: {uploadName}, for user: {userId}"
    }
    '''
    try:
        data = request.json
        userId = data['userId']
        uploadName = data['uploadName']
        filePath = data['filePath']

        uploadFileToBucket('user-experiment-video', filePath, uploadName)
        addExperimentalFileUpload(userId, 'video', uploadName)

        return jsonify({
            'message': f'Upload successful, file under key: {uploadName}, for user: {userId}',
        }), 200

    except FileNotFoundError as e:
        return jsonify({
            'error': str(e)
        }), 404

    except ClientError as e:
        return jsonify({
            'error': str(e)
        }), 400

    except KeyError:
        return jsonify({
            'error': 'Missing required fields (userId, uploadName, filePath)'
        }), 400

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True, port=5001)
