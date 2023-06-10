from django.contrib import admin
from .models import FileUpload


@admin.register(FileUpload)
class FileUploadAdmin(admin.ModelAdmin):
    list_display = ("username", "file_name", "file", "date_added")
