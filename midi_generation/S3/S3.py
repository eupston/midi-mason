import sys
import os
import logging
from botocore.exceptions import ClientError
import boto3

sys.path.append(os.path.join(os.path.dirname(__file__)))
from settings import *

def initialize():
    """Start the S3 client with the AWS creds"""
    client = boto3.client(
        's3',
        aws_access_key_id=AWS_ACCESS_KEY_ID,
        aws_secret_access_key=AWS_SECRET_ACCESS_KEY
    )

def upload_file(file_name, bucket="midi-mason", object_name=None):
    """Upload a file to an S3 bucket

    :param file_name: File to upload
    :param bucket: Bucket to upload to
    :param object_name: S3 object name. If not specified then file_name is used
    :return: True if file was uploaded, else False
    """

    # If S3 object_name was not specified, use file_name
    if object_name is None:
        object_name = file_name

    # Upload the file
    s3_client = boto3.client('s3')
    try:
        response = s3_client.upload_file(file_name, bucket, object_name)
    except ClientError as e:
        logging.error(e)
        return False
    return S3_URL + object_name


if __name__ == '__main__':
    print(upload_file("../output/client.mid", object_name='midi_test/{}'.format("client4.mid")))