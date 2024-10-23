from flask import Blueprint, jsonify
import boto3
import os
from dynamodb_helpers import listOfMusicBaskets
from .auth import token_required

dynamodb = boto3.resource('dynamodb', region_name='ap-southeast-2')
s3 = boto3.client('s3', region_name='ap-southeast-2')

catalogue_songs_bp = Blueprint('catalogue_songs', __name__)

@catalogue_songs_bp.route('/catalogue/songs/find/<song_id>', methods=['GET'])
@token_required
def get_song_details(song_id):
    try:
        songs = dynamodb.Table(os.getenv('DYNAMODB_TABLE_SONGS'))

        response = songs.get_item(Key={'id': song_id})

        if 'Item' not in response:
            return jsonify({'error': 'song not found'}), 404

        song_data = response['Item']

        # making sure that everything in the data is jsonifiable
        for key, value in song_data.items():
            if isinstance(value, set):
                song_data[key] = list(value)

        return jsonify(song_data), 200
    except Exception as e:
        return jsonify({
            'error': 'An error occurred while fetching song details',
            'details': str(e)
        }), 500

@catalogue_songs_bp.route('/catalogue/songs/list-all', methods=['GET'])
@token_required
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
