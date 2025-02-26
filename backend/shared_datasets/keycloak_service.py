import requests

class KeycloakService:
    """
    Service for interacting with Keycloak for shared datasets module.
    Handles service user creation, and token exchange for offline access.
    """
    def __init__(self, settings):
        self.settings = settings
        self.admin_url = f"{settings.KEYCLOAK_CONFIG['KEYCLOAK_SERVER_URL']}/admin/realms/{settings.KEYCLOAK_CONFIG['KEYCLOAK_REALM']}"
        self.token_url = f"{settings.KEYCLOAK_CONFIG['KEYCLOAK_SERVER_URL']}/realms/{settings.KEYCLOAK_CONFIG['KEYCLOAK_REALM']}/protocol/openid-connect/token"
        self.admin_user = settings.KEYCLOAK_CONFIG["KEYCLOAK_ADMIN_USERNAME"]
        self.admin_password = settings.KEYCLOAK_CONFIG["KEYCLOAK_ADMIN_PASSWORD"]
        self.client_id = settings.KEYCLOAK_CONFIG["KEYCLOAK_CLIENT_ID"]
   
    def get_admin_token(self):
        admin_token_url = self.token_url.replace(
            f"/realms/{self.settings.KEYCLOAK_CONFIG['KEYCLOAK_REALM']}/",
            "/realms/master/"
        )
        resp = requests.post(
            admin_token_url,
        data={
            "grant_type": "password",
            "client_id": "admin-cli",
            "username": self.admin_user,
            "password": self.admin_password,
        },
        verify=False
    )
        if resp.status_code != 200:
            raise ValueError("Failed to authenticate as Keycloak admin")
        return resp.json()["access_token"]

    def ensure_role_exists(self, role_name):
        """
        Ensure the given role exists in Keycloak. If not, create it.
        """
        headers = {"Authorization": f"Bearer {self.get_admin_token()}", "Content-Type": "application/json"}
        # Check if role exists
        resp = requests.get(f"{self.admin_url}/roles/{role_name}", headers=headers, verify=False)
        if resp.status_code == 404:
            # Create the role
            create_resp = requests.post(
                f"{self.admin_url}/roles",
                json={"name": role_name, "description": f"Role for {role_name} scope"},
                headers=headers,
                verify=False
            )
            create_resp.raise_for_status()
        elif resp.status_code != 200:
            raise ValueError(f"Failed to check or create role {role_name}")

    def create_or_get_service_user(self, username, password):
        headers = {"Authorization": f"Bearer {self.get_admin_token()}", "Content-Type": "application/json"}

        # Ensure the 'shared_datasets:read' role exists
        self.ensure_role_exists("shared_datasets:read")

        # Check if user exists
        resp = requests.get(f"{self.admin_url}/users?username={username}", headers=headers, verify=False)
        resp.raise_for_status()
        users = resp.json()
        if not users:
            # Create the user
            create_resp = requests.post(
                f"{self.admin_url}/users",
                json={
                    "username": username,
                    "enabled": True,
                    "credentials": [{
                        "type": "password",
                        "value": password,
                        "temporary": False
                    }]
                },
                headers=headers,
                verify=False
            )
            if create_resp.status_code not in [201, 204]:
                raise ValueError("Failed to create service user")
        # Always ensure client has offline_access
        self.ensure_client_has_offline_access()
        # Always get and return the offline token
        result = self.get_service_token(username, password)
        return result["refresh_token"]

    def ensure_client_has_offline_access(self):
        """
        Ensure the client has the offline_access scope enabled,
        which is required for issuing offline tokens.
        """
        headers = {
            "Authorization": f"Bearer {self.get_admin_token()}",
            "Content-Type": "application/json"
        }
        
        # Get the client
        clients_resp = requests.get(
            f"{self.admin_url}/clients?clientId={self.client_id}",
            headers=headers,
            verify=False
        )
        clients_resp.raise_for_status()
        clients = clients_resp.json()
        if not clients:
            raise ValueError(f"Keycloak client {self.client_id} not found")
        
        client = clients[0]
        
        # Check if offline_access is already enabled
        if not client.get('attributes', {}).get('oauth2.device.authorization.grant.enabled'):
            # Update client to enable offline_access
            client['attributes'] = {
                **client.get('attributes', {}),
                'oauth2.device.authorization.grant.enabled': 'true'
            }
            
            # Ensure web origins are properly set
            if 'webOrigins' not in client or not client['webOrigins']:
                client['webOrigins'] = ['+']
                
            # Enable service accounts if not already
            client['serviceAccountsEnabled'] = True
            
            # Update the client
            modify_resp = requests.put(
                f"{self.admin_url}/clients/{client['id']}",
                json=client,
                headers=headers,
                verify=False
            )
            modify_resp.raise_for_status()

    def get_service_token(self, username, password):
            """
            Get an offline token for a service user using a confidential client.
            """
            data = {
                "grant_type": "password",
                "client_id": self.client_id,
            "client_secret": self.settings.KEYCLOAK_CONFIG["KEYCLOAK_CLIENT_SECRET_KEY"],
            "username": username,
            "password": password,
            "scope": "offline_access"
        }
            resp = requests.post(
                self.token_url,
                data=data,
                verify=False
            )
            if resp.status_code != 200:
                print("Status code:", resp.status_code)
                print("Response text:", resp.text)
                try:
                    print("JSON error:", resp.json())
                except Exception:
                    pass
                raise ValueError("Failed to get service token")
            return resp.json()
    

    def get_access_token_from_refresh(self, refresh_token):
        data = {
            "grant_type": "refresh_token",
            "client_id": self.client_id,
            "client_secret": self.settings.KEYCLOAK_CONFIG["KEYCLOAK_CLIENT_SECRET_KEY"],
            "refresh_token": refresh_token,
        }
        resp = requests.post(self.token_url, data=data, verify=False)
        if resp.status_code != 200:
            raise ValueError("Failed to get access token from refresh token")
        return resp.json()["access_token"]

