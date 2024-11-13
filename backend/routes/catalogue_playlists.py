from flask import Blueprint, json, jsonify, request
import boto3
import os
from dynamodb_helpers import listOfPlaylists
from boto3.dynamodb.conditions import Attr, Or
from .auth import token_required

dynamodb = boto3.resource('dynamodb', region_name='ap-southeast-2')
s3 = boto3.client('s3', region_name='ap-southeast-2')

catalogue_playlists_bp = Blueprint('catalogue_playlists', __name__)

@catalogue_playlists_bp.route('/catalogue/playlists/find/<playlistId>', methods=['GET'])
@token_required
def get_playlist_details(playlistId):
    '''GET route which returns the details for a playlist
    Route parameters must be of the following format:
    {
        playlistId: str                 # id of the song you need the details for
    }

    Pulls the information from dynamodb and returns all the information for the frontend to access
    The set is changed to a list to allow jsonifying
    '''
    try:
        playlists = dynamodb.Table(os.getenv('DYNAMODB_TABLE_PLAYLISTS'))

        response = playlists.get_item(Key={'id': playlistId})

        if 'Item' not in response:
            return jsonify({'error': 'song not found'}), 404

        playlist_data = response['Item']

        # making sure that everything in the data is jsonifiable
        for key, value in playlist_data.items():
            if isinstance(value, set):
                playlist_data[key] = list(value)

        return jsonify(playlist_data), 200
    except Exception as e:
        return jsonify({
            'error': 'An error occurred while fetching playlist details',
            'details': str(e)
        }), 500

@catalogue_playlists_bp.route('/catalogue/songs/list-all', methods=['GET'])
@token_required
def get_music_basket_list():
    '''GET route which returns a list of all PUBLIC playlists
    returns
    {
        playlists: [
            playlist1: Playlist,
            playlist2: Playlist,
            .
            .
            .
        ]
    }
    '''
    playlists = listOfPlaylists()
    if playlists is not None:
        return jsonify(playlists), 200
    else:
        return jsonify({
            'error': 'Songs cannot be found'
        }), 500
