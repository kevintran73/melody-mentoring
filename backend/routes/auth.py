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

@auth_bp.route('/auth/signup', methods=['POST'])
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

@auth_bp.route('/auth/confirm-signup', methods=['POST'])
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
            'trackAttempts': [],
            'privateSongs': [],
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
