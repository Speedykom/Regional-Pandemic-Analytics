
# A XML Schema validation check should be implemented in the future to ensure that the XML data is valid
from .rule import Rule


class ParquetFileOutputRule:
    rules = [
        Rule("filename_ext", "parquet", "InvalidFilenameExtension"),
        Rule("filename_include_copy", "N", "InvalidFilenameIncludeCopy"),
        Rule("filename_include_date", "N", "InvalidFilenameIncludeDate"),
        Rule("filename_include_datetime", "N", "InvalidFilenameIncludeDatetime"),
        Rule("filename_include_split", "N", "InvalidFilenameIncludeSplit"),
        Rule("filename_include_time", "N", "InvalidFilenameIncludeTime")
    ]

    def __init__(self, xml_transform_element):
        self.xml_transform_element = xml_transform_element

    def is_parquet_transform(self):
        # First check if the XML transform element is a ParquetFileOutput element
        xml_transform_element_type = self.xml_transform_element.find("type")
        return xml_transform_element_type is not None and xml_transform_element_type.text == "ParquetFileOutput"

    def is_valid(self):
        valid_pipeline = False
        check_text = "MissingParquetTransform"

        filename_base_element = self.xml_transform_element.find("filename_base")
        if filename_base_element is None or not filename_base_element.text or not filename_base_element.text.strip():
            return valid_pipeline, "InvalidFilenameBase"
        for rule in self.rules:
            element = self.xml_transform_element.find(rule.name)
            if element is None or element.text != rule.value:
                valid_pipeline = False
                check_text = rule.error_text
                break
        else:
            valid_pipeline = True
            check_text = "ValidPipeline"
        return valid_pipeline, check_text
