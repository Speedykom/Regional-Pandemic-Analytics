import xml.etree.ElementTree as ET

from .rules.parquet_file_output_rule import ParquetFileOutputRule
# A XML Schema validation check should be implemented in the future to ensure that the XML data is valid
def check_pipeline_validity(name):
    valid_pipeline = False
    check_text = "ValidationFailed"
    # Read the .hpl file
    with open(f"/hop/pipelines/{name}.hpl", "r") as file:
        xml_data = file.read()

    # Parse the XML data
    root = ET.fromstring(xml_data)
    for transform in root.iter("transform"):
        parquet_output_rule = ParquetFileOutputRule(transform)
        valid_pipeline, check_text = parquet_output_rule.is_valid()
        print("##########################")
        print(valid_pipeline, check_text)
        print("##########################")
        # New rules can be added here to check for other types of transforms
        ############################################
    return valid_pipeline, check_text
