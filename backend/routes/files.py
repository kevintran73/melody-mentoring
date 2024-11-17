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

        if url:
            return jsonify({
                'url': url
            }), 200
        else:
            return jsonify({
                'error': 'song not found'
            }), 404

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
    }
    Gets the url for the audio of a users attempt to play a song
    '''
    try:
        url = urlFromBucketObj(os.getenv('S3_BUCKET_USER_AUDIO'), trackAttemptId)

        if url:
            return jsonify({
                'url': url
            }), 200
        else:
            return jsonify({
                'error': 'track attempt not found'
            }), 404

    except Exception as e:
        return jsonify({
            'error': str(e)
        }), 500

# Gets either the audio or video from a users previous experiment on a song
@files_bp.route('/files/user/<trackAttemptId>', methods=['GET'])
@token_required
def get_presigned_url_user_experiment(trackAttemptId):
    '''GET route to access the video or audio of a users experiment
    Route parameters must be of the following format:
    {
        trackAttemptId: str                 # id of the the track attempt
    }
    Gets the url for the video or audio of a users attempt to play a song
    '''
    try:
        videoUrl = urlFromBucketObj(os.getenv('S3_BUCKET_USER_VIDEO'), trackAttemptId)

        if videoUrl:
            return jsonify({
                'videoUrl': videoUrl
            }), 200

        audioUrl = urlFromBucketObj(os.getenv('S3_BUCKET_USER_AUDIO'), trackAttemptId)

        if audioUrl:
            return jsonify({
                'audioUrl': audioUrl
            }), 200
        
        return jsonify({
            'error': 'track attempt not found'
        }), 404

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
    }
    Gets the url for the video of a users attempt to play a song
    '''
    try:
        url = urlFromBucketObj(os.getenv('S3_BUCKET_USER_VIDEO'), trackAttemptId)

        if url:
            return jsonify({
                'url': url
            }), 200
        else:
            return jsonify({
                'error': 'track attempt not found'
            }), 404

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
    }

    Creates a song in the Songs table (dynamodb)
    Appends this song in Users[userid].private_songs

    The track/sheet audio has to be uploaded separately,
    This request returns an additional object under field 'audioUploader' and 'sheetUploader' which can be
    used to upload the files for this creation. See post below,
    https://stackoverflow.com/questions/54076283/how-to-upload-a-file-to-s3-using-presigned-url-with-react-js
    '''
    try:
        data = request.json
        songId = addSongtoSongs(data, True)
        audioUploader = createUploadHelper(os.getenv('S3_BUCKET_TRACKS'), songId)
        sheetUploader = createUploadHelper(os.getenv('S3_BUCKET_TRACK_SHEET'), songId)
        return jsonify({
            'message': f'New song created by user: {data["userId"]} under the title: {data["title"]}',
            'audioUploader': audioUploader,
            'sheetUploader': sheetUploader,
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

@files_bp.route('/files/user/new-track-attempt', methods=['POST'])
@token_required
def user_attempts_track():
    '''POST route when a user attempts a track
    Body of request must be in the format:
    {
        userId: str
        songId: str
    }

    Creates TrackAttempt object added to TrackAttempts table
    Appends this song in Users[userid].track_attempts

    The audio and video files have to be uploaded separately,
    This request returns an additional object under field '<type>Uploader' which can be
    used to upload the file for this submission. See post below,
    https://stackoverflow.com/questions/54076283/how-to-upload-a-file-to-s3-using-presigned-url-with-react-js
    '''
    try:
        data = request.json
        attemptId = addAttemptToTrackAttempt(data['userId'], data['songId'])

        audioUploader = createUploadHelper(os.getenv('S3_BUCKET_USER_AUDIO'), attemptId)
        videoUploader = createUploadHelper(os.getenv('S3_BUCKET_USER_VIDEO'), attemptId)
        return jsonify({
            'message': f'Submitted track attempt for user: {data["userId"]}, track-attempt: {attemptId}',
            'audioUploader': audioUploader,
            'videoUploader': videoUploader,
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
            'error': 'Missing required fields (userId, songId)'
        }), 400
    except Exception as e:
        return jsonify({
            'error': str(e)
        }), 500
