from django.db import models
from django_minio_backend import MinioBackend, iso_date_prefix


# class AvatarUpload(models.Model):
#     type = models.CharField(max_length=5)
#     size = models.BigIntegerField()
#     file = models.FileField(storage=MinioBackend(bucket_name='avatars'), upload_to=iso_date_prefix)
