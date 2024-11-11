from flask import Blueprint, jsonify
import boto3
import os
from dynamodb_helpers import listOfMusicBaskets
from .auth import token_required

dynamodb = boto3.resource('dynamodb', region_name='ap-southeast-2')
s3 = boto3.client('s3', region_name='ap-southeast-2')

catalogue_songs_bp = Blueprint('catalogue_songs', __name__)

@catalogue_songs_bp.route('/catalogue/songs/find/<songId>', methods=['GET'])
@token_required
def get_song_details(songId):
    '''GET route which returns the details for a specific song
    Route parameters must be of the following format:
    {
        songId: str                 # id of the song you need the details for
    }

    Pulls the information from dynamodb and returns all the information for the fronte end to access
    The set is changed to a list to allow jsonifying
    '''
    try:
        songs = dynamodb.Table(os.getenv('DYNAMODB_TABLE_SONGS'))

        response = songs.get_item(Key={'id': songId})

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
    '''GET route which returns a list of all PUBLIC (song.private == False) songs
    returns
    {
        songs: [
            song1: Song,
            song2: Song,
            .
            .
            .
        ]
    }
    '''
    songs = listOfMusicBaskets()
    if songs is not None:
        return jsonify(songs), 200
    else:
        return jsonify({
            'error': 'Songs cannot be found'
        }), 500
