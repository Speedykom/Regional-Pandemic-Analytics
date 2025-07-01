import requests

class KeycloakService:
    """
    Service for interacting with Keycloak for shared datasets module.
    Handles service user creation, and token exchange for offline access.
    """
    def __init__(self, settings):
        self.settings = settings
        self.admin_url = f"{settings.KEYCLOAK_CONFIG['KEYCLOAK_ADMIN_SERVER_URL']}/admin/realms/{settings.KEYCLOAK_CONFIG['KEYCLOAK_REALM']}"
        self.token_url = f"{settings.KEYCLOAK_CONFIG['KEYCLOAK_ADMIN_SERVER_URL']}/realms/{settings.KEYCLOAK_CONFIG['KEYCLOAK_REALM']}/protocol/openid-connect/token"
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
    )
        if resp.status_code != 200:
            raise ValueError("Failed to authenticate as Keycloak admin")
        return resp.json()["access_token"]


    def create_or_get_service_user(self, username, password):
        headers = {"Authorization": f"Bearer {self.get_admin_token()}", "Content-Type": "application/json"}

        # Check if user exists
        resp = requests.get(f"{self.admin_url}/users?username={username}", headers=headers, )
        resp.raise_for_status()
        if resp.status_code != 200:
            raise ValueError("Failed to get service user")
        users = resp.json()
        if not users:
            # Create the user (without credentials)
            create_resp = requests.post(
                f"{self.admin_url}/users",
                json={
                    "username": username,
                    "enabled": True
                },
                headers=headers,
            )
            if create_resp.status_code not in [201, 204]:
                raise ValueError("Failed to create service user")
            # Get the user ID
            user_id = None
            if create_resp.status_code == 201 and 'Location' in create_resp.headers:
                user_id = create_resp.headers['Location'].rstrip('/').split('/')[-1]
            else:
                # fallback: search for the user
                users = requests.get(f"{self.admin_url}/users?username={username}", headers=headers).json()
                if users:
                    user_id = users[0]['id']
            if user_id:
                # Set the password
                pw_resp = requests.put(
                    f"{self.admin_url}/users/{user_id}/reset-password",
                    json={
                        "type": "password",
                        "value": password,
                        "temporary": False
                    },
                    headers=headers,
                )
                if pw_resp.status_code not in [204]:
                    # Delete the user to avoid inconsistent state
                    del_resp = requests.delete(f"{self.admin_url}/users/{user_id}", headers=headers)
                    if del_resp.status_code not in [204, 200]:
                        raise ValueError("Failed to set user password; user deleted to avoid inconsistent state")
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
            )
            if resp.status_code != 200:
                raise ValueError("Failed to get service token")
            return resp.json()
    

    def get_access_token_from_refresh(self, refresh_token):
        data = {
            "grant_type": "refresh_token",
            "client_id": self.client_id,
            "client_secret": self.settings.KEYCLOAK_CONFIG["KEYCLOAK_CLIENT_SECRET_KEY"],
            "refresh_token": refresh_token,
        }
        resp = requests.post(self.token_url, data=data)
        if resp.status_code != 200:
            raise ValueError("Failed to get access token from refresh token")
        return resp.json()["access_token"]

