import boto3

import os
from dotenv import load_dotenv
load_dotenv()
aws_access_key_id = os.getenv('AWS_ACCESS_KEY_ID')
aws_secret_access_key = os.getenv('AWS_SECRET_ACCESS_KEY')

def addExperimentalFileUpload(userId, type, key):
    attr = None
    if type is 'audio':
        attr = 'experimental_upload_audios'
    elif type is 'video':
        attr = 'experimental_upload_videos'
    else:
        raise Exception('type must be audio or video')

    db = boto3.resource(
        service_name='dynamodb',
        region_name='ap-southeast-2',
        aws_access_key_id=aws_access_key_id,
        aws_secret_access_key=aws_secret_access_key
    )
    table = db.Table('Users')
    result = table.update_item(
        Key={
            'id': userId
        },
        UpdateExpression=f'SET {attr} = list_append({attr}, :i)',
        ExpressionAttributeValues={
            ':i': [key]
        },
        ReturnValues="UPDATED_NEW"
    )
    if result['ResponseMetadata']['HTTPStatusCode'] == 200 and 'Attributes' in result:
        return result['Attributes']['some_attr']

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
