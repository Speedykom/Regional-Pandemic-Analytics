import uuid
from django.db import models


class ProcessChain(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=200)
    data_source_name = models.CharField(max_length=200)
    pipeline = models.CharField(max_length=200)
    dag_id = models.CharField(max_length=200)
    user_id = models.CharField(max_length=200, default='')
    state = models.CharField(max_length=200, default='active')
    schedule_interval = models.CharField(max_length=200)

    def __str__(self):
        return "ProcessChain(id={}, name={}, dag_id={}, pipeline={}, data_source_name={}, schedule_interval={}, user_id={}, status={})".format(
            self.id, self.name, self.dag_id, self.pipeline, self.data_source_name, self.schedule_interval, self.user_id, self.state)
