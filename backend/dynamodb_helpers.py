import boto3

import os
from dotenv import load_dotenv
from flask import jsonify
load_dotenv()
aws_access_key_id = os.getenv('AWS_ACCESS_KEY_ID')
aws_secret_access_key = os.getenv('AWS_SECRET_ACCESS_KEY')

def listOfMusicBaskets():
    db = boto3.resource(
        service_name='dynamodb',
        region_name='ap-southeast-2',
        aws_access_key_id=aws_access_key_id,
        aws_secret_access_key=aws_secret_access_key
    )
    table = db.Table('Songs')
    baskets = (table.scan())["Items"]
    def convertGenresToList(basket):
        basket['genreTags'] = list(basket['genreTags'])
        return basket
    return list(map(convertGenresToList, baskets))

def getTrackAttempyDetails(trackAttemptID):
    db = boto3.resource(
        service_name='dynamodb',
        region_name='ap-southeast-2',
        aws_access_key_id=aws_access_key_id,
        aws_secret_access_key=aws_secret_access_key
    )

    table = db.table(os.getenv('DYNAMODB_TABLE_TRACK_ATTEMPTS'))
    
    attempt = table.get_item(Key={'id': trackAttemptID})

    if 'Item' not in attempt:
            return jsonify({'error': 'song not found'}), 404
        
    attemptData = attempt['Item']

    return attemptData