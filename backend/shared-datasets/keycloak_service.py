import requests

MAX_TOKEN_LIFESPAN_SECONDS = 3153600000  # 100 years

class KeycloakService:
    def __init__(self, settings):
        self.settings = settings
        self.admin_url = f"{settings.KEYCLOAK_CONFIG['KEYCLOAK_SERVER_URL']}/admin/realms/{settings.KEYCLOAK_CONFIG['KEYCLOAK_REALM']}"
        self.token_url = f"{settings.KEYCLOAK_CONFIG['KEYCLOAK_SERVER_URL']}/realms/{settings.KEYCLOAK_CONFIG['KEYCLOAK_REALM']}/protocol/openid-connect/token"
        self.admin_user = settings.KEYCLOAK_CONFIG["KEYCLOAK_ADMIN_USERNAME"]
        self.admin_password = settings.KEYCLOAK_CONFIG["KEYCLOAK_ADMIN_PASSWORD"]
        self.client_id = settings.KEYCLOAK_CONFIG["KEYCLOAK_CLIENT_ID"]
        self.client_secret = settings.KEYCLOAK_CONFIG["KEYCLOAK_CLIENT_SECRET_KEY"]
    
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

    def ensure_client_lifespan(self, client_id):
        headers = {
            "Authorization": f"Bearer {self.get_admin_token()}",
            "Content-Type": "application/json"
        }
        clients_resp = requests.get(
        f"{self.admin_url}/clients?clientId={client_id}",
        headers=headers
    )
        clients_resp.raise_for_status()
        clients = clients_resp.json()
        if not clients:
            raise ValueError("Keycloak client not found")
        client = clients[0]
        current = int(client.get('attributes', {}).get('access.token.lifespan', '0'))
        if current < MAX_TOKEN_LIFESPAN_SECONDS:
            client['attributes'] = {
                **client.get('attributes', {}),
                'access.token.lifespan': str(MAX_TOKEN_LIFESPAN_SECONDS)
            }
            modify_resp = requests.put(
                f"{self.admin_url}/clients/{client['id']}",
                json=client,
                headers=headers
            )
            modify_resp.raise_for_status()

    def create_or_get_service_user(self, username, password):
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
        # Always ensure the client has the max lifespan set
        self.ensure_client_lifespan()

    def get_service_token(self, username, password):
        resp = requests.post(
            self.token_url,
            data={
                "grant_type": "password",
                "client_id": self.client_id,
                "username": username,
                "password": password,
            }
        )
        if resp.status_code != 200:
            raise ValueError("Failed to get service token")
        return resp.json()["access_token"]
