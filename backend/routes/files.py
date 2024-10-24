from flask import Blueprint, jsonify, request
import boto3
import os
from .auth import token_required
from s3_bucket_helpers import urlFromBucketObj, uploadFileToBucket
from dynamodb_helpers import addSongtoSongs, addAttemptToTrackAttempt
from botocore.exceptions import ClientError

s3 = boto3.client('s3', region_name='ap-southeast-2')

files_bp = Blueprint('media', __name__)

# media routes

# Route that will help to request the profile picture of a user.
# file key should be as such "{user_id}-profile-picture.{file_extension}""
@files_bp.route('/files/user/profile-picture/<file_key>', methods=['GET'])
@token_required
def get_presigned_url_picture(file_key):
    try:
        presigned_url = s3.generate_presigned_url(
            'get_object',
            Params={'Bucket': os.getenv('S3_BUCKET_USER_PICTURE'), 'Key': f'profile-pictures/{file_key}'},
            ExpiresIn=604800
        )

        return jsonify({
            'url': presigned_url
        }), 200

    except Exception as e:
        return jsonify({
            'error': str(e)
        }), 500

# Route that will help to request the audio relating to a specic song
@files_bp.route('/files/audio/<song_id>', methods=['GET'])
@token_required
def get_presigned_url_track_audio(song_id):
    try:
        presigned_url = s3.generate_presigned_url(
            'get_object',
            Params={'Bucket': os.getenv('S3_BUCKET_TRACKS'), 'Key': f'{song_id}'},
            ExpiresIn=604800
        )

        return jsonify({
            'url': presigned_url
        }), 200

    except Exception as e:
        return jsonify({
            'error': str(e)
        }), 500

# Route that will help to request the sheet music for a specigic song
@files_bp.route('/files/sheets/<song_id>', methods=['GET'])
@token_required
def get_presigned_url_track_sheet(song_id):
    try:
        presigned_url = s3.generate_presigned_url(
            'get_object',
            Params={'Bucket': os.getenv('S3_BUCKET_TRACK_SHEET'), 'Key': f'{song_id}'},
            ExpiresIn=604800
        )

        return jsonify({
            'url': presigned_url
        }), 200

    except Exception as e:
        return jsonify({
            'error': str(e)
        }), 500

# Route that will help to get the audio from a users previous experiment on a song
@files_bp.route('/files/user/audio/<track_attempt_id>', methods=['GET'])
@token_required
def get_presigned_url_user_experiment_audio(song_id, user_id, track_attempt_id):
    try:
        presigned_url = s3.generate_presigned_url(
            'get_object',
            Params={'Bucket': os.getenv('S3_BUCKET_USER_AUDIO'), 'Key': f'{user_id}/{song_id}/{track_attempt_id}'},
            ExpiresIn=604800
        )

        return jsonify({
            'url': presigned_url
        }), 200

    except Exception as e:
        return jsonify({
            'error': str(e)
        }), 500

# Route that will help to get the video from a users previous experiment on a song
@files_bp.route('/files/user/video/<track_attempt_id>', methods=['GET'])
@token_required
def get_presigned_url_user_experiment_video(song_id, user_id, track_attempt_id):
    try:
        presigned_url = s3.generate_presigned_url(
            'get_object',
            Params={'Bucket': os.getenv('S3_BUCKET_USER_VIDEO'), 'Key': f'{user_id}/{song_id}/{track_attempt_id}'},
            ExpiresIn=604800
        )

        return jsonify({
            'url': presigned_url
        }), 200

    except Exception as e:
        return jsonify({
            'error': str(e)
        }), 500

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
        trackAudio: str             # filepath to the audio of the track
    }

    Creates a song in the Songs table (dynamodb)
    Appends this song in Users[userid].private_songs
    uploads the trackaudio to s3 "track-audio" bucket
    '''
    try:
        data = request.json
        songId = addSongtoSongs(data, True)
        uploadFileToBucket('track-audio', data['trackAudio'], songId)
        return jsonify({
            'message': f'New song created by user: {data["userId"]} under the title: {data["title"]}',
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
        videoFilePath: str      # file path to the user's uploaded video
    }

    Creates TrackAttempt object added to TrackAttempts table
    Appends this song in Users[userid].track_attempts
    Uploads audio file to s3 users-experiment-audio
    Uploads video file to s3 users-experiment-video
    '''
    try:
        data = request.json
        if not os.path.exists(data['audioFilePath']) or not os.path.exists(data['videoFilePath']):
            raise FileNotFoundError('audio or video file not found')
        attemptId = addAttemptToTrackAttempt(data['userId'], data['songId'])
        uploadFileToBucket('user-experiment-audio', data['audioFilePath'], attemptId)
        uploadFileToBucket('user-experiment-video', data['videoFilePath'], attemptId)

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
