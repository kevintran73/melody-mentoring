from flask import Blueprint, jsonify
import boto3
import os
from s3_bucket_helpers import urlFromBucketObj
from .auth import token_required

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