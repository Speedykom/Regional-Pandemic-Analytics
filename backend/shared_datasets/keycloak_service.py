import requests

class KeycloakService:
    def __init__(self, settings):
        self.settings = settings
        self.admin_url = f"{settings.KEYCLOAK_CONFIG['KEYCLOAK_SERVER_URL']}/admin/realms/{settings.KEYCLOAK_CONFIG['KEYCLOAK_REALM']}"
        self.token_url = f"{settings.KEYCLOAK_CONFIG['KEYCLOAK_SERVER_URL']}/realms/{settings.KEYCLOAK_CONFIG['KEYCLOAK_REALM']}/protocol/openid-connect/token"
        self.admin_user = settings.KEYCLOAK_CONFIG["KEYCLOAK_ADMIN_USERNAME"]
        self.admin_password = settings.KEYCLOAK_CONFIG["KEYCLOAK_ADMIN_PASSWORD"]
        self.client_id = settings.KEYCLOAK_CONFIG["KEYCLOAK_CLIENT_ID"]
    
    def get_admin_token(self):
        resp = requests.post(
            self.token_url,
            data={
                "grant_type": "password",
                "client_id": "admin-cli",
                "username": self.admin_user,
                "password": self.admin_password,
            },
        )
        if resp.status_code != 200:
            raise ValueError("Failed to authenticate as Keycloak admin")
        return resp.json()["access_token"]

    def create_or_get_service_user(self, username, password):
        """
        Create a service user if it doesn't exist.
        Service users are used for generating offline tokens for dataset sharing.
        """
        headers = {"Authorization": f"Bearer {self.get_admin_token()}", "Content-Type": "application/json"}
        resp = requests.get(f"{self.admin_url}/users?username={username}", headers=headers)
        resp.raise_for_status()
        users = resp.json()
        if not users:
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
                headers=headers
            )
            if create_resp.status_code not in [201, 204]:
                raise ValueError("Failed to create service user")
        
        # Ensure the client has offline_access scope enabled
        self.ensure_client_has_offline_access()

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
            headers=headers
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
                headers=headers
            )
            modify_resp.raise_for_status()

    def get_service_token(self, username, password):
        """
        Get an offline token for a service user.
        Offline tokens don't expire and are perfect for long-term API access.
        """
        resp = requests.post(
            self.token_url,
            data={
                "grant_type": "password",
                "client_id": self.client_id,
                "username": username,
                "password": password,
                "scope": "offline_access"  # Request an offline token
            }
        )
        if resp.status_code != 200:
            raise ValueError("Failed to get service token")
        
        # Return the refresh token (offline token) instead of the access token
        # Offline tokens don't expire and can be used for long-term access
        return resp.json()["refresh_token"]
