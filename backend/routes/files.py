from flask import Blueprint, jsonify, request
import boto3
import os
from .auth import token_required
from s3_bucket_helpers import createUploadHelper, urlFromBucketObj, uploadFileToBucket
from dynamodb_helpers import addSongtoSongs, addAttemptToTrackAttempt, getTrackAttempyDetails
from botocore.exceptions import ClientError

s3 = boto3.client('s3', region_name='ap-southeast-2')

files_bp = Blueprint('files', __name__)

# media routes

# Route that will help to request the profile picture of a user.
# file key should be as such "{user_id}-profile-picture.{file_extension}""
@files_bp.route('/files/user/profile-picture/<userId>', methods=['GET'])
@token_required
def get_presigned_url_picture(userId):
    '''GET route to access a users profile picture
    Route parameters must be of the following format:
    {
        userId: str                 # id of the uploading user
    }

    Gets the profile pictures stored in profile-pictures/{user_id}
    '''
    try:
        url = urlFromBucketObj(os.getenv('S3_BUCKET_USER_PICTURE'), f'profile-pictures/{userId}')

        return jsonify({
            'url': url
        }), 200

    except Exception as e:
        return jsonify({
            'error': str(e)
        }), 500

# Route that will help to request the audio relating to a specic song
@files_bp.route('/files/audio/<songId>', methods=['GET'])
@token_required
def get_presigned_url_track_audio(songId):
    '''GET route to access the audio of a particular song
    Route parameters must be of the following format:
    {
        songId: str                 # id of the song being accessed
    }

    Gets the url for the audio of the particular song stored in the s3 bucket
    '''
    try:
        url = urlFromBucketObj(os.getenv('S3_BUCKET_TRACKS'), songId)
        return jsonify({
            'url': url
        }), 200

    except Exception as e:
        return jsonify({
            'error': str(e)
        }), 500

# Route that will help to request the sheet music for a specigic song
@files_bp.route('/files/sheets/<songId>', methods=['GET'])
@token_required
def get_presigned_url_track_sheet(songId):
    '''GET route to access the music sheet of a particular song
    Route parameters must be of the following format:
    {
        songId: str                 # id of the song being accessed
    }

    Gets the url for the music sheet of the particular song stored in the s3 bucket
    '''
    try:
        url = urlFromBucketObj(os.getenv('S3_BUCKET_TRACK_SHEET'), songId)

        return jsonify({
            'url': url
        }), 200

    except Exception as e:
        return jsonify({
            'error': str(e)
        }), 500

# Route that will help to get the audio from a users previous experiment on a song
@files_bp.route('/files/user/audio/<trackAttemptId>', methods=['GET'])
@token_required
def get_presigned_url_user_experiment_audio(trackAttemptId):
    '''GET route to access the audio of a users attempt at playing a song
    Route parameters must be of the following format:
    {
        trackAttemptId: str                 # id of the the track attempt

    Gets the url for the audio of a users attempt to play a song
    '''
    try:
        trackAttemptDetails = getTrackAttempyDetails(trackAttemptId)
        userId = trackAttemptDetails['userId']
        songId = trackAttemptDetails['songId']

        url = urlFromBucketObj(os.getenv('S3_BUCKET_USER_AUDIO'), f'{userId}/{songId}/{trackAttemptId}')

        return jsonify({
            'url': url
        }), 200

    except Exception as e:
        return jsonify({
            'error': str(e)
        }), 500

# Route that will help to get the video from a users previous experiment on a song
@files_bp.route('/files/user/video/<trackAttemptId>', methods=['GET'])
@token_required
def get_presigned_url_user_experiment_video(trackAttemptId):
    '''GET route to access the video of a users attempt at playing a song
    Route parameters must be of the following format:
    {
        trackAttemptId: str                 # id of the the track attempt

    Gets the url for the video of a users attempt to play a song
    '''
    try:
        trackAttemptDetails = getTrackAttempyDetails(trackAttemptId)
        userId = trackAttemptDetails['userId']
        songId = trackAttemptDetails['songId']

        url = urlFromBucketObj(os.getenv('S3_BUCKET_USER_VIDEO'), f'{userId}/{songId}/{trackAttemptId}')

        return jsonify({
            'url': url
        }), 200

    except Exception as e:
        return jsonify({
            'error': str(e)
        }), 500

from werkzeug.utils import secure_filename

@files_bp.route('/files/user/create-private-song', methods=['POST'])
@token_required
def user_creates_private_song():
    ''' POST route for when users want to "create" their own song to practise
    Body of request must be in the format:
    {
        userId: str                 # id of the uploading user
        composer: str               # name of the composer
        thumbnail: str
        genreTags: list[str]
        instrument: str
        title: str
        difficulty: float           # assigned a float value from [1, 5]

        # deprecated, dont add this
        # trackAudio: str             # filepath to the audio of the track
    }

    Creates a song in the Songs table (dynamodb)
    Appends this song in Users[userid].private_songs
    uploads the trackaudio to s3 "track-audio" bucket
    '''
    try:
        data = request.json
        songId = addSongtoSongs(data, True)
        uploader = createUploadHelper((os.getenv('S3_BUCKET_TRACKS'), songId))

        # uploadFileToBucket(os.getenv('S3_BUCKET_TRACKS'), data['trackAudio'], songId)
        return jsonify({
            'message': f'New song created by user: {data["userId"]} under the title: {data["title"]}',
            'uploader': uploader
        }), 200

    except FileNotFoundError as e:
        return jsonify({
            'error': str(e)
        }), 404
    except ClientError as e:
        return jsonify({
            'error': str(e)
        }), 400
    except KeyError:
        return jsonify({
            'error': 'Missing required fields (userId, composer, thumbnail, genreTags, instrument, title, difficulty, trackAudio)'
        }), 400
    except Exception as e:
        return jsonify({
            'error': 'DynamoDB: coudn\'t add item to table'
        }), 500

@files_bp.route('/files/user/new-track-attempt', methods=['POST'])
@token_required
def user_attempts_track():
    '''POST route when a user attempts a track
    Body of request must be in the format:
    {
        userId: str
        songId: str
        audioFilePath: str      # file path to the user's uploaded audio
        videoFilePath: str      # OPTIONAL file path to the user's uploaded video
    }

    Creates TrackAttempt object added to TrackAttempts table
    Appends this song in Users[userid].track_attempts
    Uploads audio file to s3 users-experiment-audio
    Uploads video file to s3 users-experiment-video
    '''
    try:
        data = request.json
        # audio files are of course, mandatory for files
        if not os.path.exists(data['audioFilePath']):
            raise FileNotFoundError('audio file not found')

        attemptId = addAttemptToTrackAttempt(data['userId'], data['songId'])
        uploadFileToBucket(os.getenv('S3_BUCKET_USER_AUDIO'), data['audioFilePath'], attemptId)
        # adding a video is optional
        if 'videoFilePath' in data and data['videoFilePath'] is not None:
            uploadFileToBucket(os.getenv('S3_BUCKET_USER_VIDEO'), data['videoFilePath'], attemptId)

        return jsonify({
            'message': f'Submitted track attempt for user: {data["userId"]}'
        }), 200

    except FileNotFoundError as e:
        return jsonify({
            'error': str(e)
        }), 404
    except ClientError as e:
        return jsonify({
            'error': str(e)
        }), 400
    except KeyError:
        return jsonify({
            'error': 'Missing required fields (userId, composer, thumbnail, genreTags, instrument, title, difficulty, trackAudio)'
        }), 400
    except Exception as e:
        return jsonify({
            'error': str(e)
        }), 500
