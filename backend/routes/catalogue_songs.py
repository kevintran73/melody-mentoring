from flask import Blueprint, json, jsonify, request
import boto3
import os
from dynamodb_helpers import listOfMusicBaskets
from boto3.dynamodb.conditions import Attr, Or
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

@catalogue_songs_bp.route('/catalague/user-catalogue/<userId>', methods=['GET'])
@token_required
def get_user_catalogue(userId):
    try:
        songs = dynamodb.Table(os.getenv("DYNAMODB_TABLE_SONGS"))
        response = songs.scan(
            FilterExpression=Attr('private').eq(False) | Attr('uploaderId').eq(userId)
        )

        return jsonify(response['Items']),
    except Exception as e:
        return jsonify({
            "error": str(e)
        })


@catalogue_songs_bp.route('/catalogue/query', methods=['GET'])
@token_required
def query_songs_and_playlists():
    '''
    GET route for songs that match a search string
    query args should be as follows
    {
        query: str                 query string
        last_key: str              id pointing to the last song returned for dynamodb for pagination (optional)
    }

    returns
    {
        songs : list[songs]        a list of song objects
        
    }
    When this route is called for the first time, last_key is not required, however each subsequent time
    you call this route it should be put in to ensure that return results are paginated
    '''
    query_string = request.args.get('query', '')
    last_key = request.args.get('last_key')

    if not query_string:
        return jsonify({'error': 'query string is required'}), 400
    
    songs = dynamodb.Table(os.getenv('DYNAMODB_TABLE_SONGS'))

    params = {
        "FilterExpression": (
            Attr('title').contains(query_string) |
            Attr('composer').contains(query_string) |
            Attr('genreTags').contains(query_string)
        ),
    }

    if last_key:
        params["ExclusiveStartKey"] = json.loads(last_key)
    
    songs_response = songs.scan(**params)

    songs_matches = songs_response.get('Items', [])
    last_key = songs_response.get("LastEvaluatedKey")

    response = {
        "songs": songs_matches
    }

    if last_key:
        response["last_key"] = json.dumps(last_key)

    return jsonify(response)