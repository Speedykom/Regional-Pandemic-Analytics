from datetime import timedelta
from minio import Minio
import os

class MinioInstance:
    url=os.getenv("MINIO_URL")
    access_key=os.getenv("MINIO_ACCESS_KEY")
    secret_key=os.getenv("MINIO_SECRET_KEY")
    
client = Minio(
    MinioInstance.url,
    access_key=MinioInstance.access_key,
    secret_key=MinioInstance.secret_key,
    secure=False
)