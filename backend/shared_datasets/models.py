from django.db import models
from django.contrib.postgres.fields import ArrayField

class AccessToken(models.Model):
    token_id = models.CharField(max_length=1024, primary_key=True)  # JWT token itself
    user_id = models.CharField(max_length=255)  # Keycloak user ID
    allowed_objects = ArrayField(models.CharField(max_length=255))  # Array of MinIO object IDs
    created_at = models.DateTimeField(auto_now_add=True)
    is_revoked = models.BooleanField(default=False)

    class Meta:
        db_table = 'shared_datasets_access_tokens'
