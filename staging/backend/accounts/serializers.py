from rest_framework.serializers import ModelSerializer
from .models import AvatarUpload

class UploadedFileSerializer(ModelSerializer):
    class Meta:
        model = AvatarUpload
        fields = ("id"  , "file" , "size" , "type" )
        
    def __init__(self, *args, **kwargs):
        super(UploadedFileSerializer, self).__init__(*args, **kwargs)
        self.fields['size'].required = False
        self.fields['type'].required = False