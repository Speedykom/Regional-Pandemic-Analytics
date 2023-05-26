from rest_framework import serializers
from .models import FileUpload


class FileUploadSerializer(serializers.ModelSerializer):
    class Meta:
        model = FileUpload
        fields = "__all__"

    def to_representation(self, instance):
        representation = super(FileUploadSerializer, self).to_representation(instance)
        representation['date_added'] = instance.date_added.strftime("%d %B, %Y")
        return representation
