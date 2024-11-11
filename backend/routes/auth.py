from flask import Blueprint, request, jsonify
import boto3
from botocore.exceptions import ClientError
import os
from functools import wraps
import uuid

client = boto3.client('cognito-idp', region_name='ap-southeast-2')
dynamodb = boto3.resource('dynamodb', region_name='ap-southeast-2')

auth_bp = Blueprint('auth', __name__)

#Authentication

# A helper function that checks whether a token is valid
def validate_token_helper(token):
    try:
        response = client.get_user(AccessToken=token)
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
        user = validate_token_helper(token)

        if user is None:
            return jsonify({'error': 'Invalid or expired token'}), 403

        try:
            userIdFromRequest = kwargs.get('userId') or request.json.get('userId')
        except Exception as e:
            print("Error accessing request.json or route parameter:", e)
            userIdFromRequest = None

        if userIdFromRequest:
            print(userIdFromRequest)
            users = dynamodb.Table(os.getenv('DYNAMODB_TABLE_USERS'))
            response = users.get_item(Key={'id': userIdFromRequest})
            user_data = response['Item']

            if user['Username'].lower() != user_data['username'].lower():
                return jsonify({'error': 'Unauthorized access to this user\'s data'}), 403

        request.user = user
        return f(*args, **kwargs)

    return decorated


@auth_bp.route('/auth/validate-token', methods=['GET'])
def validateToken():
    '''GET route to return whether or not a token is valid
    Header must contain the following things:
    {
        Authorization: "Bearer <token:str>"                 # accessToken of the user
    }

    Returns basic info on the user aswell as if their token is valid or not
    '''
    try:
        auth_header = request.headers.get('Authorization', None)

        if not auth_header:
            return jsonify({'error': 'Missing Authorization header'}), 400

        token = auth_header.split(" ")[1]
        user = validate_token_helper(token)

        if user is None:
            return jsonify({'message': 'Invalid or expired token'}), 403

        # If token is valid, return user information
        return jsonify({
            'message': 'Token is valid',
            'user': user
        }), 200

    except ClientError as e:
        return jsonify({
            'error': str(e)
        }), 400


@auth_bp.route('/auth/signup', methods=['POST'])
def sign_up():
    '''POST route to sign a user up to the service
    Body must contain the following things:
    {
        username: str                 # username of the new user
        email: str                    # email of the new user
        password: str                 # password of the new user
        role: str                     # either 'student' or 'lecturer'
    }

    Returns basic info on the user aswell as if the sign up was successful
    '''
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
                }
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

@auth_bp.route('/auth/confirm-signup', methods=['POST'])
def confirmSignup():
    '''POST route to confirm the users sign up and add them into the db
    Body must contain the following things:
    {
        username: str                 # username of the new user
        code: str                     # confirmation code
    }
    '''
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

        email, role = ''

        # Users account is recorded in dynamodb only after it is confirmed
        for attribute in response['UserAttributes']:
            if attribute['Name'] == 'email':
                email = attribute['Value']
            if attribute['Name'] == 'role':
                role = attribute['Value']

        users = dynamodb.Table(os.getenv('DYNAMODB_TABLE_USERS'))

        user = {
            'id': str(uuid.uuid4()),
            'username': username,
            'email': email,
            'role': role,
            'profile_picture': f'https://{os.getenv("S3_BUCKET_USER_PICTURE")}.s3.amazonaws.com/default-avatar-icon-of-social-media-user-vector.jpg',
            'instrument': '',
            'miniTestsProgress': [],
            'track_attempts': [],
            'private_songs': [],
            'favourite_songs': [],
            'level': '1'
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

@auth_bp.route('/auth/resend-confirmation', methods=['POST'])
def resendConfirmation():
    '''POST route to resend the confirmation code if the user needs one
    Body must contain the following things:
    {
        username: str                 # username of the new user
    }
    '''
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

@auth_bp.route('/auth/login', methods=['POST'])
def login():
    '''POST route to log the user in
    Body must contain the following things:
    {
        email: str                 # email of the user
        password: str              # password of the user
    }
    Returns an access_token for the users session aswell as their userId
    '''
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

@auth_bp.route('/auth/logout', methods=['POST'])
def logout():
    '''POST route to log the user out of all sessions
    Body must contain the following things:
    {
        access_token: str                 # current access_token of the user
    }
    '''
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
