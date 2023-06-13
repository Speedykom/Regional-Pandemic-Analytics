import uuid
from django.db import models


class ProcessChain(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    dag_name = models.CharField(max_length=200)
    path = models.CharField(max_length=200)
    data_source_name = models.CharField(max_length=200)
    parquet_path = models.CharField(max_length=200)
    dag_id = models.CharField(max_length=200)
    schedule_interval = models.CharField(max_length=200)

    def __str__(self):
        return "ProcessChain(id={}, dag_name={}, dag_id={}, parquet_path={}, data_source_name={}, schedule_interval={}, path={})".format(
            self.id, self.dag_name, self.dag_id, self.parquet_path, self.data_source_name, self.schedule_interval,
            self.path)
