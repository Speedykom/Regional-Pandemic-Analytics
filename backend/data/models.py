from django.db import models


class FileUpload(models.Model):
    username = models.CharField("Username", max_length=50)
    file_name = models.CharField("File Name", max_length=100)
    file_type = models.CharField("File Type", max_length=20, null=True, blank=True)
    file = models.FileField("File", upload_to="data/%Y/%m/%d/", max_length=100000)
    date_added = models.DateTimeField("Date Added", auto_now_add=True)

    def __str__(self):
        return self.username
