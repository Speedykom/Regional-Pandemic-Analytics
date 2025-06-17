from rest_framework import serializers
from .models import AccessToken


class AccessTokenListSerializer(serializers.ModelSerializer):
    class Meta:
        model = AccessToken
        exclude = ['token_id']  # Exclude the actual token value from the list
