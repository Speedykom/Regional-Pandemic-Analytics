import xml.etree.ElementTree as ET
from utils.minio import client

from .rules.parquet_file_output_rule import ParquetFileOutputRule
# A XML Schema validation check should be implemented in the future to ensure that the XML data is valid
def check_pipeline_validity(name, user_id=None):
    valid_pipeline = False
    check_text = "ValidationFailed"
    # Download the pipeline in /tmp
    f = client.fget_object("pipelines", f"/pipelines-created/{user_id}/{name}.hpl", file_path=f"/tmp/{name}.hpl")
    # Read the .hpl file
    with open(f"/tmp/{name}.hpl", "r") as file:
        xml_data = file.read()

    # Parse the XML data
    root = ET.fromstring(xml_data)
    for transform in root.iter("transform"):
        parquet_output_rule = ParquetFileOutputRule(transform)
        # Ensure to run the validation only for ParquetFileOutput transforms
        if(parquet_output_rule.is_parquet_transform()):
            valid_pipeline, check_text = parquet_output_rule.is_valid()
        # New rules can be added here to check for other types of transforms
        ############################################
    return valid_pipeline, check_text
