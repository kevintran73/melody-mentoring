from flask import Flask, request, jsonify
import boto3
from botocore.exceptions import ClientError
from dotenv import load_dotenv
import os
load_dotenv()

app = Flask(__name__)

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

        print(code)
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

if __name__ == '__main__':
    app.run(debug=True, port=5000)