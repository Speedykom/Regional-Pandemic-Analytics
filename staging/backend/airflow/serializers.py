from rest_framework import serializers  
from .models import Dag  

# Dag serializers transferable the model data in JSON format and convert object instances
class DagSerializer(serializers.ModelSerializer):  
    dag_name = serializers.CharField(required=True)  
    path = serializers.CharField(required=True)  
    dag_id = serializers.CharField(required=True)
    schedule_interval = serializers.CharField(required=True)  
  
    class Meta:  
        model = Dag  
        fields = ('__all__')