import boto3

import os
from dotenv import load_dotenv
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
    table = db.Table('music-basket')
    baskets = (table.scan())["Items"]
    def convertGenresToList(basket):
        basket['genre-tags'] = list(basket['genre-tags'])
        return basket
    return list(map(convertGenresToList, baskets))
