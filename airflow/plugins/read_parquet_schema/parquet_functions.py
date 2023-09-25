from airflow.models import Variable
import json
from pyarrow import fs, parquet as pq
from typing import Dict, List, Tuple, Union

minio_url = Variable.get("minio_url")
minio_access_key = Variable.get("minio_access_key")
minio_secret_key = Variable.get("minio_secret_key")

def read_parquet_schema(key: str) -> pq.ParquetSchema:
    s3 = fs.S3FileSystem(
        access_key=minio_access_key,
        secret_key=minio_secret_key,
        endpoint_override=minio_url,
        region="us-east-2",
        scheme="http"
    )
    file = pq.ParquetFile('parquets/{}'.format(key), filesystem=s3)
    return file.schema

def identify_timestamp_column(schema: pq.ParquetSchema) -> Dict:
    date_cols = list(filter(
        lambda col: col.logical_type is not None and hasattr(col.logical_type, 'type') and col.logical_type.type == 'TIMESTAMP',
        schema
    ))
    if len(date_cols) == 0:
        return {
            "column": "Date",
            "format": "millis",
            "missingValue": 0
        }
    # The selection logic is currently rather simple: If there is a column called “date” (case
    # insensitive) it comes first. Otherwise take the first timestamp column.
    col = next((c for c in date_cols if c.name.lower() == 'date'), date_cols[0])
    return {
        "column": col.name,
        "format": ("millis" if json.loads(col.logical_type.to_json())["timeUnit"] == "milliseconds" else "nano"),
        "missingValue": 0
    }


def convert_parquet_schema_to_druid_dimensions(schema: pq.ParquetSchema, exclude: Union[List[str], None]) -> List[Union[str, Dict[str, str]]]:
    return list(
        map(
            lambda col:
                { "name": col.name, "type": "long" } if col.physical_type in ("INT32", "INT64", "BOOLEAN")
                else { "name": col.name, "type": "double" } if col.physical_type == "DOUBLE"
                else { "name": col.name, "type": "float" } if col.physical_type == "FLOAT"
                # Otherwise use default type “string”
                else col.name,
            filter(
                lambda col:
                    exclude is None or len(exclude) == 0 or col.name not in exclude,
                    schema
            )
        )
    )

def read_parquet_schema_for_druid(file: str, path: str = '') -> Tuple[Dict, List[Union[str, Dict[str, str]]]]:
    schema = read_parquet_schema(
        '{}/{}'.format(path, file) if len(path) > 0
        else file
    )
    timestamp_spec = identify_timestamp_column(schema)
    return [
        timestamp_spec,
        convert_parquet_schema_to_druid_dimensions(schema, [timestamp_spec["column"]])
    ]
