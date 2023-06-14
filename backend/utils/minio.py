from datetime import timedelta
from minio import Minio
from minio.error import S3Error
import os
import io

def upload_file_to_minio(bucket_name, uploaded_file):
    try:
        # Create a client with the MinIO server and credentials.
        client = Minio(
            os.getenv('MINIO_URL'),
            access_key=os.getenv("MINIO_ACCESS_KEY"),
            secret_key=os.getenv("MINIO_SECRET_KEY"),
            secure=False
        )
        
        # Make bucket if it does not exist.
        found = client.bucket_exists(bucket_name)
        if not found:
            client.make_bucket(bucket_name)
        else:
            print(f"Bucket {bucket_name} already exists")

        # Get the file contents as bytes
        file_contents = uploaded_file.read()

        # Create a BytesIO object to hold the file contents
        file_data = io.BytesIO(file_contents).getvalue()

        # Set the file pointer to the beginning
        uploaded_file.seek(0)

        # Upload the file to the bucket.
        file_upload = client.put_object(
            bucket_name,uploaded_file.name, uploaded_file, length=uploaded_file.size
        )

        # Return True to indicate successful upload
        return True

    except S3Error as exc:

        print("An error occurred:", exc)

        # Return False to indicate upload failure
        return False

def download_file (bucket_name: str, filename: str):
    try:
        client = Minio(
            os.getenv('MINIO_URL'),
            access_key=os.getenv("MINIO_ACCESS_KEY"),
            secret_key=os.getenv("MINIO_SECRET_KEY"),
            secure=False
        )
        
        response = client.get_object(bucket_name, filename)
        return response
    except S3Error as exc:
        print("An error occurred:", exc)
        return exc
    finally:
        response.close()
        response.release_conn()

def get_download_url (bucket_name: str, filename: str):
    try:
        client = Minio(
            os.getenv('MINIO_URL'),
            access_key=os.getenv("MINIO_ACCESS_KEY"),
            secret_key=os.getenv("MINIO_SECRET_KEY"),
            secure=False
        )
        
        url = client.get_presigned_url(
            "GET",
            bucket_name,
            filename,
            expires=timedelta(hours=5),
        )
        
        return url
    except S3Error as exc:
        print("An error occurred:", exc)
        return exc
