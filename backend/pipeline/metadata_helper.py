from minio.error import S3Error
import json
from io import BytesIO


def save_pipeline_metadata(minio_client, user_id, pipeline_name: str, metadata: dict):
    """Saves metadata as a JSON file in MinIO."""
    json_data = json.dumps(metadata, indent=4)
    json_bytes = json_data.encode("utf-8")
    json_buffer = BytesIO(json_bytes)
    json_object_name = f"pipelines-created/{user_id}/{pipeline_name}.json"
    
    try:
        minio_client.put_object(
            "pipelines", json_object_name, json_buffer, len(json_bytes), content_type="application/json"
        )
        print(f"Metadata saved for {pipeline_name}")
    except S3Error as e:
        print(f"Error saving metadata: {e}")

def get_pipeline_metadata(minio_client, user_id: str, pipeline_name: str):
    """Retrieves metadata JSON file from MinIO."""
    json_object_name = f"pipelines-created/{user_id}/{pipeline_name}.json"
    try:
        ## optimize this by using stat_object instead of get_object to check if the file exists
        ## as get_objects tries to download the file first
        minio_client.stat_object("pipelines", json_object_name)
        response = minio_client.get_object("pipelines", json_object_name)
        metadata = json.loads(response.read().decode("utf-8"))
        response.close()
        response.release_conn()
        return metadata

    except S3Error as e:
        # If the metadata file does not exist, return an empty dictionary
        metadata = {
                    "description": "",
                    "check_status": "failed",
                    "check_text": "",
                    "created": ""
                }
        return metadata

def update_pipeline_metadata(client, user_id, pipeline_name: str, new_metadata: dict):
    """Updates the metadata JSON file in MinIO."""
    existing_metadata = get_pipeline_metadata(client, user_id, pipeline_name) or {}
    existing_metadata.update(new_metadata)
    save_pipeline_metadata(client, user_id, pipeline_name, existing_metadata)
