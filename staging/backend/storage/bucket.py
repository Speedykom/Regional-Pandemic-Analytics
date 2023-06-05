## All operations realting to minio bucket operations

from minio.error import S3Error
from storage.config import MinioClient


class BucketService:
    def create_bucket (bucket_name: str, location: str, object_lock: bool):
        try:
            MinioClient.make_bucket(bucket_name, location)
            return {'message': 'Bucket created successfully', 'bucketDetails': {'bucketName': bucket_name, 'location': location, 'objectLock': object_lock}}
        except S3Error as err:
            return err
        

    def bucket_exist (bucket_name: str):
        try:
            if MinioClient.bucket_exists(bucket_name):
                return True
            return False
        except S3Error as err:
            return err