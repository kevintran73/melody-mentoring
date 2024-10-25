import boto3

import uuid
from pprint import pprint
from datetime import datetime

import os
from dotenv import load_dotenv
from flask import jsonify
load_dotenv()
aws_access_key_id = os.getenv('AWS_ACCESS_KEY_ID')
aws_secret_access_key = os.getenv('AWS_SECRET_ACCESS_KEY')

db = boto3.resource(
    service_name='dynamodb',
    region_name='ap-southeast-2',
    aws_access_key_id=aws_access_key_id,
    aws_secret_access_key=aws_secret_access_key
)

def appendStrToTableItemsAttribute(tableName: str, attr: str, itemId: str, strToAppend: str):
    table = db.Table(tableName)
    result = table.update_item(
        Key={
            'id': itemId
        },
        UpdateExpression=f'SET {attr} = list_append({attr}, :i)',
        ExpressionAttributeValues={
            ':i': [strToAppend]
        },
        ReturnValues="UPDATED_NEW"
    )
    if result['ResponseMetadata']['HTTPStatusCode'] == 200 and 'Attributes' in result:
        return result['Attributes'][attr]

def addSongtoSongs(songDetails, isPrivate=False):
    '''
    Adds a song to Songs table
    If isPrivate is true:
        then also updates the User[uploader].private_songs list too

    songDetails: {
        uploader: str
        thumbnail: str          # base64 encoding
        genreTags: list[str]
        instrument: str
        title: str
        difficulty: str (but interpreted as a float)
        composer: str
    }

    returns: the created song's id
    '''
    table = db.Table(os.getenv('DYNAMODB_TABLE_SONGS'))
    songId = str(uuid.uuid4())
    userId = None
    if isPrivate:
        userId = songDetails['userId']
    response = table.put_item(
        Item={
            'id': songId,
            'uploaderId': userId,
            'thumbnail': songDetails['thumbnail'],
            'genreTags': songDetails['genreTags'],
            'instrument': songDetails['instrument'],
            'title': songDetails['title'],
            'difficulty': songDetails['difficulty'],
            'composer': songDetails['composer'],
            'private': True,
        }
    )
    pprint(response)
    # track audio s3 key is just this song's id
    if isPrivate:
        appendStrToTableItemsAttribute(os.getenv('DYNAMODB_TABLE_USERS'), 'private_songs', userId, songId)
    if response['ResponseMetadata']['HTTPStatusCode'] == 200:
        return songId
    else:
        raise Exception('DynamoDB: internal server error')

def addAttemptToTrackAttempt(userId, songId):
    '''
    Records a track attempt for a user trying a song
    returns trackAttemptId
    '''
    trackAttempId = str(uuid.uuid4())
    isoDate = datetime.now().isoformat()
    table = db.Table('TrackAttempts')
    res = table.put_item(
        Item={
            'id': trackAttempId,
            'userId': userId,
            'songId': songId,
            'isoUploadTime': isoDate,
            'reviews': [],
        }
    )
    appendStrToTableItemsAttribute(os.getenv('DYNAMODB_TABLE_USERS'), 'track_attempts', userId, trackAttempId)

    if res['ResponseMetadata']['HTTPStatusCode'] == 200:
        return trackAttempId
    else:
        raise Exception('DynamoDB: internal server error')

def listOfMusicBaskets():
    table = db.Table(os.getenv('DYNAMODB_TABLE_SONGS'))
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
