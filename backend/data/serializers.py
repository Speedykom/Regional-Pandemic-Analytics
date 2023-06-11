from rest_framework import serializers
from .models import FileUpload


class FileUploadSerializer(serializers.ModelSerializer):
    class Meta:
        model = FileUpload
        fields = ('username','file_name', 'file')

    def to_representation(self, instance):
        representation = super(FileUploadSerializer, self).to_representation(instance)
        representation['date_added'] = instance.date_added.strftime("%d %B, %Y")
        return representation


class FileListSerializer(serializers.Serializer):
    files = serializers.ListField(
        child=serializers.FileField(max_length=100000, allow_empty_file=False, use_url=True, allow_null=True))
    username = serializers.CharField(max_length=50)
    file_name = serializers.CharField(max_length=100)

    def create(self, validated_data):
        files = validated_data.pop('files')
        instance_list = []
        for file in files:
            validated_data['file'] = file
            serializer = FileUploadSerializer(data=validated_data)
            print(serializer)
            if serializer.is_valid():
                instance = serializer.save()
                instance_list.append(instance)
            else:
                raise serializers.ValidationError(serializer.errors)
        return instance_list

