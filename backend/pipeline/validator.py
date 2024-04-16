import xml.etree.ElementTree as ET

def check_pipeline_validity(name):
    # Read the .hpl file
    with open(f"/hop/pipelines/{name}.hpl", "r") as file:
        xml_data = file.read()

    # Parse the XML data
    root = ET.fromstring(xml_data)
    # Check if the pipeline has a <transform> tag with <type> equal to "ParquetOutput"
    return is_parquet_output_transform_available_and_valid(root)

def is_parquet_output_transform_available_and_valid(xml_document_root):
    valid_pipeline = False
    check_text = "MissingParquetTransform"
    for transform in xml_document_root.iter("transform"):
        element = transform.find(rules[0][0])

        # Check the other rules only a ParquetFileOutput transform is found
        if element is not None and element.text == rules[0][1]:
            for rule in rules:
                element = transform.find(rule[0])
                if element is None or element.text != rule[1]:
                    valid_pipeline = False
                    check_text = rule[2]
                    break
            else:
                valid_pipeline = True
                check_text = "ValidPipeline"
    return valid_pipeline, check_text

rules = [("type", "ParquetFileOutput", "MissingParquetTransform"), ("filename_base", "ftp://${minio_ftp}/parquets/${user_id}/${dag_id}", "InvalidFilenameBase"), 
         ("filename_ext", "parquet", "InvalidFilenameExtension"), ("filename_include_copy", "N", "InvalidFilenameIncludeCopy"), ("filename_include_date", "N", "InvalidFilenameIncludeDate"), 
         ("filename_include_datetime", "N", "InvalidFilenameIncludeDatetime"), ("filename_include_split", "N", "InvalidFilenameIncludeSplit"), ("filename_include_time", "N", "InvalidFilenameIncludeTime"),]
