from rest_framework import serializers
from .models import ProcessChain

# ProcessChain serializers transferable the model data in JSON format and convert object instances


class ProcessChainSerializer(serializers.ModelSerializer):
    name = serializers.CharField(required=True)
    pipeline = serializers.CharField(required=True)
    user_id = serializers.CharField(required=True)
    schedule_interval = serializers.CharField(required=True)

    class Meta:
        model = ProcessChain
        fields = ('__all__')
