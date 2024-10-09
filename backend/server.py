from flask import Flask, request, jsonify
from s3_bucket_helpers import urlFromBucketObj
from dynamodb_helpers import listOfMusicBaskets
import boto3
from botocore.exceptions import ClientError
from dotenv import load_dotenv

from flask_cors import CORS

import os
load_dotenv()
bucket_name = os.getenv('BUCKET_NAME')
app = Flask(__name__)
CORS(app)

client = boto3.client('cognito-idp', region_name='ap-southeast-2')

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

        return jsonify({
            'message': 'Login successful!',
            'access_token': response['AuthenticationResult']['AccessToken'],
            'id_token': response['AuthenticationResult']['IdToken'],
            'refresh_token': response['AuthenticationResult']['RefreshToken']
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

@app.route('/catalogue/basket-list', methods=['GET'])
def get_music_basket_list():
    '''GET route which returns a list of music baskets

    music baskets contain additional data about the song
    Leaf key fields just denote typing e.g. SS => String Set
    e.g. the song titled Johann Sebastian Bach might have a basket
    looking like this
    {
        "basket-id": {
            "S": "403deb46-92de-46b5-b271-814ed67867d7"
        },
        "genre-tags": {
            "SS": [
            "baroque",
            "classical",
            "instrument"
            ]
        },
        "instrument": {
            "S": "piano"
        },
        "sheet-file-key": {
            "S": "johann-sebastian-bach"
        },
        "title": {
            "S": "Johann Sebastian Bach"
        }
    }
    '''
    songs = listOfMusicBaskets()
    if songs is not None:
        return jsonify(songs), 200
    else:
        return jsonify({
            'error': 'Music baskets cannot be found'
        }), 500

@app.route('/catalogue/find/<string:filekey>', methods=['GET'])
def get_file_pdf(filekey):
    '''GET route for retrieving a link to the pdf specified by key

    AWS s3's presigned link contains special chars like %2F inside their signature
    This means that the URL will get encoded when this API is called.
    To get around this, this API returns an object with two fields, 'url' and 'signature'
    e.g.
    GET /catalogue/sheetfilekey ...
    {
        "signature": "7GY4IXOmBA2J1pgK%2Bh3ltU2d1OY%3D",
        "url": "https://bucketName.s3.amazonaws.com/sheetfilekey.pdf?AWSAccessKeyId=notTheNormalAccessKey&Signature=INSERTSIGNATURE&Expires=1728212979"
    }
    To retrieve the link you have to piece it back together (replace 'INSERTSIGNATURE' with res.signature)
    '''

    url = urlFromBucketObj(bucket_name, filekey + '.pdf')
    if url is not None:
        return jsonify({
            'url': url[0], 'signature': url[1]
        }), 200
    else:
        return jsonify({
            'error': 'requested file does not exist, please check you\'re using the file key.'
        }), 404

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True, port=5000)
