import boto3
import os

def lambda_handler(event, context):
  s3 = boto3.resource('s3')
  for rec in event['Records']:
    filename = rec['s3']['object']['key']
    print(filename)

    # read the obj which was put.
    obj = s3.Object(rec['s3']['bucket']['name'], filename)
    response = obj.get()
    print(response)

    # upload to the other bucket.
    obj = s3.Object('', filename)
    print('obj is',obj)
    response = obj.put(
      Body=response['Body'].read(),Bucket='yourbucketname'
    )