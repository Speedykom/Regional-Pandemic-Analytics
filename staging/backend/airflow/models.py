import uuid
from django.db import models

class Dag(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    dag_name = models.CharField(max_length=200)  
    path = models.CharField(max_length=200)  
    dag_id = models.CharField(max_length=200)  
    schedule_interval = models.CharField(max_length=200)  
  
    def __str__(self):  
        return "Dag(id={}, dag_name={}, dag_id={}, schedule_interval={}, path={})".format(self.id, self.dag_name, self.path, self.dag_id, self.schedule_interval)