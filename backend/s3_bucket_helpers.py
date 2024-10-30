import boto3
import botocore
import logging
import re

import os
from dotenv import load_dotenv
load_dotenv()
aws_access_key_id = os.getenv('AWS_ACCESS_KEY_ID')
aws_secret_access_key = os.getenv('AWS_SECRET_ACCESS_KEY')

def uploadFileToBucket(bucketName, filename, key):
    s3_client = boto3.client(
        service_name='s3',
        region_name='ap-southeast-2',
        aws_access_key_id=aws_access_key_id,
        aws_secret_access_key=aws_secret_access_key
    )
    with open(filename, 'rb') as f:
        s3_client.upload_fileobj(f, bucketName, key)
    # s3_client.upload_file(Filename=filePath, Bucket=bucketName, Key=key)
    return

def urlFromBucketObj(bucketName, objectName, expiration=60):
    '''Generate a presigned URL to share an S3 object

    :param bucketName: string
    :param objectName: string
    :param expiration: Time in seconds for the presigned URL to remain valid
    :return: Presigned URL with it's signature and URL separated. If error, returns None.
    '''

    # Generate a presigned URL for the S3 object
    s3_client = boto3.client(
        service_name='s3',
        region_name='ap-southeast-2',
        aws_access_key_id=aws_access_key_id,
        aws_secret_access_key=aws_secret_access_key
    )
    try:
        s3_client.head_object(Bucket=bucketName, Key=objectName)
        response = s3_client.generate_presigned_url('get_object',
                                                    Params={'Bucket': bucketName,
                                                            'Key': objectName},
                                                    ExpiresIn=expiration)
        return response

    except botocore.exceptions.ClientError as e:
        logging.error(e)
        return None
