from flask import Blueprint, request, jsonify
import boto3
import os
from .auth import token_required
from botocore.exceptions import ClientError

dynamodb = boto3.resource('dynamodb', region_name='ap-southeast-2')
s3 = boto3.client('s3', region_name='ap-southeast-2')

profile_bp = Blueprint('user', __name__)

# User routes
@profile_bp.route('/profile/<user_id>', methods=['GET'])
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


@profile_bp.route('/profile/profile-picture', methods=['PUT'])
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