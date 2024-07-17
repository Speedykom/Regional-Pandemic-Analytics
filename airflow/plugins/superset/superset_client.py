from json import JSONEncoder
from keycloak import KeycloakOpenID
import logging
import os
import requests
from typing import Dict, Tuple, Union
import urllib.parse

logger = logging.getLogger('SupersetClient')

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

    def authorize(self, headers: Dict, with_csrf: bool = False) -> Dict:
        token = self.get_access_token()
        auth_header = "Bearer {}".format(token)
        headers['Authorization'] = auth_header
        if with_csrf:
            headers['X-CSRF-TOKEN'] = self.get_csrf_token()
        return headers

    def get_csrf_token(self) -> str:
        get_csrf_url = urllib.parse.urljoin(self._base_url, "/api/v1/security/csrf_token/")
        csrf_response = requests.get(get_csrf_url, headers = self.authorize({})).json()
        return csrf_response['result']

    def get_db_ids(self, db_name: Union[str, int]) -> Union[int, None]:
        if isinstance(db_name, int):
            return db_name

        db_query = urllib.parse.urlencode({ "q": JSONEncoder().encode({ "columns": ["id"], "filters": [{"col": "database_name", "opr": "eq", "value": db_name }] }) })
        get_db_url = urllib.parse.urljoin(self._base_url, "/api/v1/database/?{}".format(db_query))
        lookup_response = requests.get(url = get_db_url, headers = self.authorize({}))
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
            create_db_url = urllib.parse.urljoin(self._base_url, "/api/v1/database/")
            create_db_body = {
                "database_name": name,
                "sqlalchemy_uri": connection
            }
            create_response = requests.post(url = create_db_url, headers = self.authorize({}, True), json = create_db_body)
            if create_response.status_code >= 400:
                raise RuntimeError("Unable to establish DB link from Superset")
            create_result = create_response.json()
            return create_result["id"]

    def find_dataset(self, name: str, db_name: Union[str, int]) -> Union[Tuple[int, str], None]:
        db_id = self.get_db_ids(db_name)
        if db_id is None:
            raise RuntimeError("DB {} does not exist in Superset".format(db_name))
        dataset_query = urllib.parse.urlencode({ "q": JSONEncoder().encode({ "columns": ["id", "explore_url"], "filters": [{ "col": "database", "opr": "is", "value": db_id }, { "col": "table_name", "opr": "eq", "value": name }] }) })
        get_dataset_url = urllib.parse.urljoin(self._base_url, "/api/v1/dataset/?{}".format(dataset_query))
        dataset_response = requests.get(url = get_dataset_url, headers = self.authorize({}))
        if dataset_response.status_code >= 400:
            raise RuntimeError("Failed to look up dataset {}".format(name))
        dataset_result = dataset_response.json()
        return [
            dataset_result["result"][0]["id"],
            dataset_result["result"][0]["explore_url"]

        ] if dataset_result["count"] > 0 else None

    def create_dataset(self, name: str, db_name: Union[str, int], owner_id: int) -> Tuple[int, str]:
        logger.debug("Creating new dataset %s in database %s", name, db_name)
        db_id = self.get_db_ids(db_name)
        if db_id is None:
            logger.error("DB %s does not exist in Superset", db_name)
            raise RuntimeError("DB {} does not exist in Superset".format(db_name))

        create_dataset_url = urllib.parse.urljoin(self._base_url, "/api/v1/dataset/")
        create_dataset_body = {
            "database": db_id,
            "table_name": name,
            "schema": "druid",
            "owners": [owner_id]
        }
        create_response = requests.post(url=create_dataset_url, headers=self.authorize({}, True), json=create_dataset_body)
        if create_response.status_code >= 400:
            logger.error("Failed to create dataset %s in database %s with status %d and message: %s", name, db_name, create_response.status_code, create_response.text)
            raise RuntimeError("Failed to create Superset dataset {}".format(name))
        logger.info("Dataset %s in database %s successfully created", name, db_name)
        return self.find_dataset(name, db_name)

    def update_dataset(self, name: Union[str, int], db_name: Union[str, int]):
        logger.debug("Updating dataset %s in database %s", name, db_name)
        db_id = self.get_db_ids(db_name)
        if db_id is None:
            logger.error("DB %s does not exist in Superset", db_name)
            raise RuntimeError("DB {} does not exist in Superset".format(db_name))
        dataset_id = name if isinstance(name, int) else self.find_dataset(name, db_id)[0]
        if dataset_id is None:
            logger.error("Dataset %s not found in Superset", name)
            raise RuntimeError("Dataset {} not found in Superset".format(name))
        update_dataset_url = urllib.parse.urljoin(self._base_url, "/api/v1/dataset/{}/refresh".format(dataset_id))
        update_dataset_response = requests.put(url = update_dataset_url, headers = self.authorize({}))
        if update_dataset_response.status_code >= 400:
            logger.error("Failed to update dataset %s", name)
            raise RuntimeError("Failed to update dataset {}".format(name))
        logger.info("Dataset %s in database %s updated", name, db_name)

    def create_or_update_dataset(self, name: str, db_name: Union[str, int], owner_id: int) -> Tuple[int, str]:
        found = self.find_dataset(name, db_name)
        if found is None:
            return self.create_dataset(name, db_name, owner_id)
        else:
            dataset_id, explore_url = found
            self.update_dataset(dataset_id, db_name)
            return [dataset_id, explore_url]

    def get_current_user_id(self) -> int:
        """Fetch the current user ID."""
        get_user_url = urllib.parse.urljoin(self._base_url, "/api/v1/me/")
        user_response = requests.get(url=get_user_url, headers=self.authorize({}))

        if user_response.status_code >= 400:
            raise RuntimeError("Unable to retrieve current user ID from Superset")
        
        user_result = user_response.json()
        return user_result["result"]["id"]
