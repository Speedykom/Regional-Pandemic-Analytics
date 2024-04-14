import xml.etree.ElementTree as ET

def check_pipeline_validity(name):
    # Read the .hpl file
    with open(f"/hop/pipelines/{name}.hpl", "r") as file:
        xml_data = file.read()

    # Parse the XML data
    root = ET.fromstring(xml_data)
    # Check if the pipeline has a <transform> tag with <type> equal to "ParquetOutput"
    valid_pipeline = False
    for transform in root.iter("transform"):
        type_element = transform.find("type")
        if type_element is not None and type_element.text == "ParquetFileOutput":
            valid_pipeline = True
            break

    return valid_pipeline
