import requests
import os
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.permissions import AllowAny
from . import auths


class ListDashboardsAPI(APIView):
    """
    API view to superset dashboards
    """

    keycloak_scopes = {
        "GET": "dashboard:read",
    }

    def get(self, request, query=None):
        url = f"{os.getenv('SUPERSET_BASE_URL')}/dashboard/"
        headers = {
            "Content-Type": "application/json",
            "X-KeycloakToken": request.META["HTTP_AUTHORIZATION"].replace(
                "Bearer ", ""
            ),
        }
        if query:
            params = {
                "q": '{"filters": [{"col": "published", "opr": "eq", "value": "true"},{"col": "dashboard_title", "opr": "ct", "value": "'+query+'"}]}'
            }
            superset_response = requests.get(url=url, headers=headers, params=params)
        else:
            params = {
                "q": '{"filters": [{"col": "published", "opr": "eq", "value": "true"}]}'
            }
            superset_response = requests.get(url=url, headers=headers, params=params)

        if superset_response.status_code != 200:
            return Response(
                {"errorMessage": superset_response.json()},
                status=superset_response.status_code,
            )

        return Response(superset_response.json(), status=status.HTTP_200_OK)


class ListChartsAPI(APIView):
    """
    API view to superset charts
    """

    keycloak_scopes = {
        "GET": "chart:read",
    }

    def get(self, request, query=None):
        url = f"{os.getenv('SUPERSET_BASE_URL')}/chart/"
        headers = {
            "Content-Type": "application/json",
            "X-KeycloakToken": request.META["HTTP_AUTHORIZATION"].replace(
                "Bearer ", ""
            ),
        }

        if query:
            params = {
                "q": '{"filters": [{"col": "slice_name", "opr": "ct", "value": "'+query+'"}]}'
            }
            response = requests.get(url=url, headers=headers, params=params)
        else:
            response = requests.get(url=url, headers=headers)


        if response.status_code != 200:
            return Response(
                {"errorMessage": response.json()}, status=response.status_code
            )

        return Response(response.json(), status=status.HTTP_200_OK)


class EnableEmbed(APIView):
    """
    API view to enable superset dashboard embed
    """

    keycloak_scopes = {
        "POST": "dashboard:read",
    }

    def post(self, request):
        uid = request.data.get("uid", None)

        url = f"{os.getenv('SUPERSET_BASE_URL')}/dashboard/{uid}/embedded"

        headers = {
            "Content-Type": "application/json",
            "X-KeycloakToken": request.META["HTTP_AUTHORIZATION"].replace(
                "Bearer ", ""
            ),
        }

        response = requests.post(
            url,
            json={"allowed_domains": [os.getenv("SUPERSET_ALLOWED_DOMAINS")]},
            headers=headers,
        )

        if response.status_code != 200:
            return Response(
                {"errorMessage": response.json()}, status=response.status_code
            )

        return Response(response.json(), status=status.HTTP_200_OK)  # result.uuid


class GetEmbeddable(APIView):
    """
    API view to get embedable superset dashboard
    """

    keycloak_scopes = {
        "GET": "dashboard:read",
    }

    def get(self, request, *args, **kwargs):
        url = f"{os.getenv('SUPERSET_BASE_URL')}/dashboard/{kwargs['id']}/embedded"

        headers = {
            "Content-Type": "application/json",
            "X-KeycloakToken": request.META["HTTP_AUTHORIZATION"].replace(
                "Bearer ", ""
            ),
        }

        response = requests.get(url, headers=headers)

        return Response(response.json(), status=response.status_code)  # result.uuid

class GetThumbnail(APIView):
    """
    API view to get superset dashboard thumbnail
    """
    keycloak_scopes = {
        'GET': 'dashboard:read',
    }

    def get(self, request, *args, **kwargs):
        url = f"{os.getenv('SUPERSET_BASE_URL')}/dashboard/{kwargs['thumbnail_url']}"

        headers = {
            "Content-Type": "application/json",
            "X-KeycloakToken": request.META["HTTP_AUTHORIZATION"].replace("Bearer ", '')
        }

        response = requests.get(url, headers=headers)

        if not response.ok :
            return Response({'errorMessage': response.json()}, status=response.status_code)
        return Response({ 'thumbnail': response.json()}, status=response.status_code)

class GuestTokenApi(APIView):
    """
    API view to get superset guest token
    """

    keycloak_scopes = {
        "POST": "dashboard:read",
    }

    def post(self, request):
        url = f"{os.getenv('SUPERSET_BASE_URL')}/security/guest_token/"
        headers = {
            "Content-Type": "application/json",
            "X-KeycloakToken": request.META["HTTP_AUTHORIZATION"].replace(
                "Bearer ", ""
            ),
        }

        payload = {
            "user": {
                "username": os.getenv("SUPERSET_GUEST_USERNAME"),
                "first_name": os.getenv("SUPERSET_GUEST_FIRSTNAME"),
                "last_name": os.getenv("SUPERSET_GUEST_LASTNAME"),
            },
            "resources": [{"type": "dashboard", "id": request.data.get("id", str)}],
            "rls": [],
        }

        response = requests.post(url, json=payload, headers=headers)

        if response.status_code != 200:
            return Response(
                {"errorMessage": response.json()}, status=response.status_code
            )

        return Response(response.json(), status=status.HTTP_200_OK)


class CsrfTokenApi(APIView):
    """
    API view to get superset csrf token
    """

    permission_classes = [
        AllowAny,
    ]

    def get(self, request):
        url = f"{os.getenv('SUPERSET_BASE_URL')}/security/csrf_token/"

        auth_response = auths.get_auth_token()

        if auth_response["status"] != 200:
            return {
                "status": auth_response["status"],
                "message": auth_response["message"],
            }

        headers = {
            "Authorization": f"Bearer {auth_response['token']['access_token']}",
        }

        response = requests.get(url=url, headers=headers)

        if response.status_code != 200:
            return Response(
                {"errorMessage": response.json()}, status=response.status_code
            )

        return Response({"data": response.json()}, status=status.HTTP_200_OK)
