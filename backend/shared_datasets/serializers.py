from rest_framework import serializers
from .models import AccessToken

class AccessTokenSerializer(serializers.ModelSerializer):
    class Meta:
        model = AccessToken
        fields = ['token_id', 'allowed_objects', 'created_at']
        read_only_fields = ['token_id', 'created_at']
