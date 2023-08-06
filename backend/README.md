## IGAD Application Backend

## Scope Based Permissions using keycloak

The way the backend API is protected through Keycloak scope-based permissions. When the app is started,
the middleware will request Keycloak for the authorization config to get all roles and scopes defined in Keycloak from the begining.

References :

- https://www.keycloak.org/docs/latest/authorization_services/index.html
- https://sairamkrish.medium.com/keycloak-integration-part-3-integration-with-python-django-backend-5dac3b4a8e4e

The `KeycloakMiddleware` middleware located in `core/middleware.py` is responsible to verifying that 
each incoming request is authenticated and that the user has permission to access the API endpoint. The bearer
token sent in the HTTP `Authorization` header gets checked with a token introspection with Keycloak. Once,
the token is validated (is valid and not expired), then the permission scope is verified.

Therefore, each API view needs to define a class attribute called `keycloak_scopes`, a dictionnary that defines the authorization scope for each HTTP action/verb. The following is an example :

```python
class ProcessDetailView(APIView):
    keycloak_scopes = {
        'GET': 'process:read',
    }

    def get(self, request, id=None):
        route = "{}/dags/{}/dagRuns".format(api, id)
        client = requests.get(route, json={}, auth=(username, password))

        res_status = client.status_code

        if (res_status == 404):
            return Response({'status': 'success', "message": client.json()['detail']}, status=res_status)
        else:
            return Response({'status': 'success', "message": client.json()['dag_runs'].format(id)}, status=200)

```
