import os
from minio import Minio

MINIO_ENDPOINT = os.getenv("MINIO_URL")
MINIO_PORT = os.getenv("MINIO_PORT")
MINIO_ACCESS_KEY = os.getenv("MINIO_ACCESS_KEY")
MINIO_SECRET_KEY = os.getenv("MINIO_SECRET_KEY")

MinioClient = Minio (
    endpoint = "localhost:9000/",
    access_key = "yMo0TxrsTQD9GhrJCwMN",
    secret_key = "Edb6wK4WKDK4Od5veO4YeF3m9B4xnI2tfhPihvqb",
    secure=False
)