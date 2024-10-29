from flask import Blueprint, request, jsonify
import boto3
import os
from .auth import token_required
from botocore.exceptions import ClientError

dynamodb = boto3.resource('dynamodb', region_name='ap-southeast-2')
s3 = boto3.client('s3', region_name='ap-southeast-2')

profile_bp = Blueprint('user', __name__)

# User routes
@profile_bp.route('/profile/<userId>', methods=['GET'])
@token_required
def getUserDetails(userId):
    '''GET route to access the details of a particular user
    Route parameters must be of the following format:
    {
        userId: str                 # id of user we need the details from
    }

    Gets the details of the user from dynamodb
    Makes sure that the details are being retrieved from the actual user
    '''
    try:
        users = dynamodb.Table(os.getenv('DYNAMODB_TABLE_USERS'))
        response = users.get_item(Key={'id': userId})

        if 'Item' not in response:
            return jsonify({'error': 'User not found'}), 404

        user_data = response['Item']

        return jsonify(user_data), 200

    except Exception as e:
        return jsonify({
            'error': 'An error occurred while fetching user details',
            'details': str(e)
        }), 500


@profile_bp.route('/profile/profile-picture', methods=['PUT'])
@token_required
def updateProfilePicture():
    '''PUT route to update the profile picture of a user
    Body must be of the following format:
    {
        userId: str                 # id of user whose profile picture we want to update
        file: (IMAGE FILE TYPE)     # file of the new profile picture
    }

    Updates the users profile picture
    '''
    try:
        data = request.form
        userId = data['userId']
        file = request.files['file']

        s3.upload_fileobj(
            file,
            os.getenv('S3_BUCKET_USER_PICTURE'),
            f'profile-pictures/{userId}',
        )

        file_url = f"https://{os.getenv('S3_BUCKET_USER_PICTURE')}.s3.amazonaws.com/profile-pictures/{userId}"

        users = dynamodb.Table(os.getenv('DYNAMODB_TABLE_USERS'))
        users.update_item(
            Key={'id': userId},
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