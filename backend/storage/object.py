from minio.error import S3Error
from storage.config import MinioClient
from storage.bucket import BucketService

class ObjectService:
    def put_object (bucket_name: str, filename: str, file: any):
        try:
            BucketService.bucket_exist(bucket_name)
            MinioClient.fput_object(bucket_name, filename, file)
            return {'message': 'Object upload was successfully', 'objectData': {'bucketName': bucket_name, 'fileName': filename}}
        except S3Error as err:
            return err
        

        
