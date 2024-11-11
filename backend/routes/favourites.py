from flask import Blueprint, request, jsonify
import boto3
import os
from .auth import token_required
from botocore.exceptions import ClientError

dynamodb = boto3.resource('dynamodb', region_name='ap-southeast-2')
s3 = boto3.client('s3', region_name='ap-southeast-2')

favourites_bp = Blueprint('favourites', __name__)

# Favourites routes
@favourites_bp.route('/favourites-add/<userId>/<songId>', methods=['POST'])
@token_required
def favouriteSong(userId, songId):
    '''POST route for a user to favourite a song
    Route parameters must be of the following format:
    {
        songId: str                 # id of song to add to favourites
    }

    Adds a song to a users favourite songs
    Makes sure that the song exists
    '''
    try:
        users = dynamodb.Table(os.getenv('DYNAMODB_TABLE_USERS'))
        songs = dynamodb.Table(os.getenv('DYNAMODB_TABLE_SONGS'))

        songValidation = songs.get_item(Key={'id': songId})

        if 'Item' not in songValidation:
            return jsonify({'error': 'Song not found'}), 404

        response = users.get_item(Key={'id': userId})

        if 'Item' not in response:
            return jsonify({'error': 'User not found'}), 404

        users.update_item(
            Key={'id': userId},
            UpdateExpression='SET favourite_songs = list_append(if_not_exists(favourite_songs, :empty_list), :songId)',
            ExpressionAttributeValues={
                ':songId': [songId],
                ':empty_list': []
            }
        )

        return jsonify({'message': 'Song added to favourites'}), 200

    except Exception as e:
        return jsonify({
            'error': 'An error occurred while favouriting this song',
            'details': str(e)
        }), 500


@favourites_bp.route('/favourites-remove/<userId>/<songId>', methods=['POST'])
@token_required
def unfavouriteSong(userId, songId):
    '''POST route to remove a song from a users favourites
    Route parameters must be of the following format:
    {
        userId: str                 # id of song we remove from a users favourites
    }

    Ensures the song exists in favourites
    Removes the validated song from a users favourites
    '''
    try:
        users = dynamodb.Table(os.getenv('DYNAMODB_TABLE_USERS'))
        response = users.get_item(Key={'id': userId})
        if 'Item' not in response:
            return jsonify({'error': 'User not found'}), 404

        user_data = response['Item']

        favourite_songs = user_data.get('favourite_songs', [])
        if songId not in favourite_songs:
            return jsonify({'error': 'Song not found in favourites'}), 404

        updated_favourites = [song for song in favourite_songs if song != songId]

        users.update_item(
            Key={'id': userId},
            UpdateExpression='SET favourite_songs = :updated_favourites',
            ExpressionAttributeValues={
                ':updated_favourites': updated_favourites
            }
        )

        return jsonify({'message': 'Song removed from favourites'}), 200

    except Exception as e:
        return jsonify({
            'error': 'An error occurred while removing this song from favourites',
            'details': str(e)
        }), 500