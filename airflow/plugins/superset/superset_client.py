from json import JSONEncoder
from keycloak import KeycloakOpenID
import os
import requests
from typing import Union
import urllib.parse

class SupersetClient:
    def __init__(self, base_url: str):
        self._base_url = base_url

    def get_access_token(self) -> str:
        # We assume that the client object is short-lived and that therefore we do not need to
        # bother about the token's lifetime and refresh tokens: simply return the access_token
        if hasattr(self, "_token"):
            return self._token["access_token"]

        keycloak_base_url = os.getenv("AIRFLOW_KEYCLOAK_INTERNAL_URL")
        keycloak_realm = os.getenv("AIRFLOW_KEYCLOAK_APP_REALM")
        keycloak_client_id = os.getenv("AIRFLOW_KEYCLOAK_CLIENT_ID")
        keycloak_client_secret = os.getenv("AIRFLOW_KEYCLOAK_CLIENT_SECRET")

        keycloak = KeycloakOpenID(server_url = keycloak_base_url, client_id = keycloak_client_id, client_secret_key = keycloak_client_secret, realm_name = keycloak_realm)
        self._token = keycloak.token(grant_type = 'client_credentials')
        return self._token['access_token']

    def get_db_ids(self, db_name: Union[str, int]) -> Union[int, None]:
        if isinstance(db_name, int):
            return db_name

        token = self.get_access_token()
        auth_header = "Bearer {}".format(token)
        db_query = urllib.parse.urlencode({ "q": JSONEncoder().encode({ "columns": ["id"], "filters": [{"col": "database_name", "opr": "eq", "value": db_name }] }) })
        get_db_url = urllib.parse.urljoin(self._base_url, "/api/v1/database/?{}".format(db_query))
        lookup_response = requests.get(url = get_db_url, headers = { "Authorization": auth_header })
        if lookup_response.status_code >= 400:
            raise RuntimeError("Unable to retrieve list of databases from Superset with status {}: {} – {}".format(lookup_response.status, lookup_result.text()))
        lookup_result = lookup_response.json()
        if lookup_result["count"] > 0:
            return lookup_result["result"][0]["id"]
        else:
            return None

    def ensure_db_exists(self, name: str, connection: str) -> int:
        db_id = self.get_db_ids(name)
        if db_id is not None:
            return db_id
        else:
            token = self.get_access_token()
            auth_header = "Bearer {}".format(token)
            create_db_url = urllib.parse.urljoin(self._base_url, "/api/v1/database/")
            create_db_body = {
                "database_name": name,
                "sqlalchemy_uri": connection
            }
            create_response = requests.post(url = create_db_url, headers = { "Authorization": auth_header }, json = create_db_body)
            if create_response.status_code >= 400:
                raise RuntimeError("Unable to establish DB link from Superset")
            create_result = create_response.json()
            return create_result["id"]

    def find_dataset(self, name: Union[str, int], db_name: Union[str, int]) -> Union[int, None]:
        if isinstance(name, int):
            return name

        db_id = self.get_db_ids(db_name)
        if db_id is None:
            raise RuntimeError("DB {} does not exist in Superset".format(db_name))
        token = self.get_access_token()
        auth_header = "Bearer {}".format(token)
        dataset_query = urllib.parse.urlencode({ "q": JSONEncoder().encode({ "columns": ["id"], "filters": [{ "col": "database", "opr": "is", "value": db_id }, { "col": "table_name", "opr": "eq", "value": name }] }) })
        get_dataset_url = urllib.parse.urljoin(self._base_url, "/api/v1/dataset/?{}".format(dataset_query))
        dataset_response = requests.get(url = get_dataset_url, headers = { "Authorization": auth_header })
        if dataset_response.status_code >= 400:
            raise RuntimeError("Failed to look up dataset {}".format(name))
        dataset_result = dataset_response.json()
        return dataset_result["result"][0]["id"] if dataset_result["count"] > 0 else None

    def create_dataset(self, name: str, db_name: Union[str, int]):
        db_id = self.get_db_ids(db_name)
        if db_id is None:
            raise RuntimeError("DB {} does not exist in Superset".format(db_name))
        token = self.get_access_token()
        auth_header = "Bearer {}".format(token)
        create_dataset_url = urllib.parse.urljoin(self._base_url, "/api/v1/dataset/")
        create_dataset_body = { "database": db_id, "table_name": name }
        create_response = requests.post(url = create_dataset_url, headers = { "Authorization": auth_header }, json = create_dataset_body)
        if create_response.status_code >= 400:
            raise RuntimeError("Failed to create Superset dataset {}".format(name))

    def update_dataset(self, name: Union[str, int], db_name: Union[str, int]):
        db_id = self.get_db_ids(db_name)
        if db_id is None:
            raise RuntimeError("DB {} does not exist in Superset".format(db_name))
        token = self.get_access_token()
        dataset_id = self.find_dataset(name, db_id)
        if dataset_id is None:
            raise RuntimeError("Dataset {} not found in Superset".format(name))
        auth_header = "Bearer {}".format(token)
        update_dataset_url = urllib.parse.urljoin(self._base_url, "/api/v1/dataset/{}/refresh/".format(dataset_id))
        update_dataset_response = requests.put(url = update_dataset_url, headers = { "Authorization": auth_header })
        if update_dataset_response.status_code >= 400:
            raise RuntimeError("Failed to update dataset {}".format(name))

    def create_or_update_dataset(self, name: str, db_name: Union[str, int]):
        dataset_id = self.find_dataset(name, db_name)
        if dataset_id is None:
            self.create_dataset(name, db_name)
        else:
            self.update_dataset(dataset_id, db_name)
