from rest_framework import serializers  
from .models import ProcessChain  

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