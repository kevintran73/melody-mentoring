import boto3
import botocore
import logging
import re

import os

from dotenv import load_dotenv
load_dotenv()
aws_access_key_id = os.getenv('AWS_ACCESS_KEY_ID')
aws_secret_access_key = os.getenv('AWS_SECRET_ACCESS_KEY')

def urlFromBucketObj(bucket_name, object_name, expiration=60):
    """Generate a presigned URL to share an S3 object

    :param bucket_name: string
    :param object_name: string
    :param expiration: Time in seconds for the presigned URL to remain valid
    :return: Presigned URL with it's signature and URL separated. If error, returns None.
    """

    # Generate a presigned URL for the S3 object
    s3_client = boto3.client(
        service_name='s3',
        region_name='ap-southeast-2',
        aws_access_key_id=aws_access_key_id,
        aws_secret_access_key=aws_secret_access_key
    )
    try:
        s3_client.head_object(Bucket=bucket_name, Key=object_name)
        response = s3_client.generate_presigned_url('get_object',
                                                    Params={'Bucket': bucket_name,
                                                            'Key': object_name},
                                                    ExpiresIn=expiration)
    except botocore.exceptions.ClientError as e:
        logging.error(e)
        return None

    # The response contains the presigned URL
    # but we need to extract and wrap it to protect it from URL encoding

    match = re.search(r'Signature=(.*)&Expires', response)
    signature = match.group(1)

    remainingLink = re.sub(r'Signature=(.*)&Expires', 'Signature=INSERTSIGNATURE&Expires', response)

    return (remainingLink, signature)
