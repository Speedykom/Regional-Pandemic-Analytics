import json
from django.core import serializers


def serialize_any_data(data_to_serialize: any):
    # serialize the data
    serialize_data = serializers.serialize('json', data_to_serialize)

    # get serialize_data to python list
    serialize_data_list = json.loads(serialize_data)

    # iterate through the serialize data and get the field property which is the visitation
    return [serialize_data['fields'] for serialize_data in serialize_data_list]