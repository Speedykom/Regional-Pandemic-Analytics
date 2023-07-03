from rest_framework import serializers  
from .models import ProcessChain, Pipeline

# ProcessChain serializers transferable the model data in JSON format and convert object instances
class ProcessChainSerializer(serializers.ModelSerializer):  
    dag_name = serializers.CharField(required=True)  
    path = serializers.CharField(required=True)  
    dag_id = serializers.CharField(required=True)
    parquet_path = serializers.CharField(required=True)
    data_source_name = serializers.CharField(required=True)
    schedule_interval = serializers.CharField(required=True)  
  
    class Meta:  
        model = ProcessChain  
        fields = ('__all__')


# Pipeline serializers transferable the model data in JSON format and convert object instances
class PipelineSerializer(serializers.ModelSerializer):  
    name = serializers.CharField(required=True)  
    path = serializers.CharField(required=True)  
    user_id = serializers.CharField(required=True)
    parquet_path = serializers.CharField(required=True)
    description = serializers.CharField(required=True)
  
    class Meta:  
        model = Pipeline  
        fields = ('__all__')