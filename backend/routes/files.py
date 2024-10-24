from flask import Blueprint, jsonify
import boto3
import os
from s3_bucket_helpers import urlFromBucketObj
from dynamodb_helpers import getTrackAttempyDetails
from .auth import token_required

s3 = boto3.client('s3', region_name='ap-southeast-2')

files_bp = Blueprint('media', __name__)

# media routes

# Route that will help to request the profile picture of a user.
# file key should be as such "{user_id}-profile-picture.{file_extension}""
@files_bp.route('/files/user/profile-picture/<user_id>', methods=['GET'])
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
@files_bp.route('/files/audio/<song_id>', methods=['GET'])
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
@files_bp.route('/files/sheets/<song_id>', methods=['GET'])
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
@files_bp.route('/files/user/audio/<track_attempt_id>', methods=['GET'])
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
@files_bp.route('/files/user/video/<track_attempt_id>', methods=['GET'])
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
    
@files_bp.route('/catalogue/find/<string:id>', methods=['GET'])
def get_file_pdf(id):
    '''GET route for retrieving a link to the pdf specified by key

    AWS s3's presigned link contains special chars like %2F inside their signature
    This means that the URL will get encoded when this API is called.
    To get around this, this API returns an object with two fields, 'url' and 'signature'
    e.g.
    GET /catalogue/id ...
    {
        "signature": "7GY4IXOmBA2J1pgK%2Bh3ltU2d1OY%3D",
        "url": "https://bucketName.s3.amazonaws.com/id?AWSAccessKeyId=notTheNormalAccessKey&Signature=INSERTSIGNATURE&Expires=1728212979"
    }
    To retrieve the link you have to piece it back together (replace 'INSERTSIGNATURE' with res.signature)
    '''

    url = urlFromBucketObj(os.getenv('S3_BUCKET_TRACKS_SHEETS'), id)
    if url is not None:
        return jsonify({
            'url': url
        }), 200
    else:
        return jsonify({
            'error': 'requested file does not exist, please check you\'re using the file key.'
        }), 404