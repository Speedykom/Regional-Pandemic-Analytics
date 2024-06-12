import logging
import re
import requests
import os
from rest_framework.response import Response
from django.http import StreamingHttpResponse
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.permissions import AllowAny
from keycloak import KeycloakPostError
from core.keycloak_impersonation import get_auth_token
log = logging.getLogger("SupersetAPI")

class SupersetAPI(APIView):
    def authorize(self, headers):
        token = get_auth_token()
        headers['Authorization'] = f"Bearer {token['access_token']}"
        log.debug("Added authorization header to Superset request")
        return headers

class ListDashboardsAPI(SupersetAPI):
    """
    API view to superset dashboards
    """

    keycloak_scopes = {
        "GET": "dashboard:read",
    }

    def get(self, request, query=None):
        """
        Endpoint for listing superset dashboards 
        """
        log.debug("Listing Superset dashboards with query %s", query)
        url = f"{os.getenv('SUPERSET_BASE_URL')}/dashboard/"
        headers = self.authorize({
            "Content-Type": "application/json",
        })
        if query:
            params = {
                "q": '{"filters": [{"col": "dashboard_title", "opr": "ct", "value": "'+query+'"}]}'
            }
            superset_response = requests.get(url=url, headers=headers, params=params)
        else:
            params = {}
            superset_response = requests.get(url=url, headers=headers, params=params)

        if superset_response.status_code != 200:
            log.error("Listing of Superset dashboards failed with code %d: %s", superset_response.status_code, superset_response.text)
            return Response(
                {"errorMessage": superset_response.text},
                status=superset_response.status_code,
            )

        result = superset_response.json()
        log.debug("Successfully listed %d dashboards from Superset", result["count"])
        return Response(result, status=status.HTTP_200_OK)


class ListChartsAPI(SupersetAPI):
    """
    API view to superset charts
    """

    keycloak_scopes = {
        "GET": "chart:read",
    }

    def get(self, request, query=None):
        """
        Endpoint for listing superset charts
        """
        url = f"{os.getenv('SUPERSET_BASE_URL')}/chart/"
        headers = self.authorize({
            "Content-Type": "application/json",
        })

        if query:
            params = {
                "q": '{"filters": [{"col": "slice_name", "opr": "ct", "value": "'+query+'"}], "columns": ["slice_url", "slice_name", "viz_type", "datasource_name_text", "created_by", "created_on_delta_humanized", "changed_by"], "page_size": 1000000}'
            }
            response = requests.get(url=url, headers=headers, params=params)
        else:
            response = requests.get(url=url, headers=headers)


        if response.status_code != 200:
            return Response(
                {"errorMessage": response.json()}, status=response.status_code
            )

        return Response(response.json(), status=status.HTTP_200_OK)


class EnableEmbed(SupersetAPI):
    """
    API view to enable superset dashboard embed
    """

    keycloak_scopes = {
        "POST": "dashboard:read",
    }

    def post(self, request):
        """
        Endpoint for enabling superset dashboard embed 
        """
        uid = request.data.get("uid", None)

        url = f"{os.getenv('SUPERSET_BASE_URL')}/dashboard/{uid}/embedded"

        headers = self.authorize({
            "Content-Type": "application/json",
        })

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


class GetEmbeddable(SupersetAPI):
    """
    API view to get embedable superset dashboard
    """

    keycloak_scopes = {
        "GET": "dashboard:read",
    }

    def get(self, request, *args, **kwargs):
        """
        Endpoint for listing embedable superset dashboard
        """
        url = f"{os.getenv('SUPERSET_BASE_URL')}/dashboard/{kwargs['id']}/embedded"

        headers = self.authorize({})

        response = requests.get(url, headers=headers)

        return Response(response.json(), status=response.status_code)  # result.uuid

class GetThumbnail(SupersetAPI):
    keycloak_scopes = {
        "GET": "dashboard:read",
    }

    def get(self, request, *args, **kwargs):
        """
        Endpoint for getting dashboard thumbnail 
        """
        superset_base_url = os.getenv('SUPERSET_BASE_URL')
        dashboardMetaUrl = f"{superset_base_url}/dashboard/{kwargs['id']}"
        headers = self.authorize({})
        metaDataResponse = requests.get(dashboardMetaUrl, headers=headers)
        if metaDataResponse.ok:
            thumbnail_url = metaDataResponse.json()['result']['thumbnail_url']
        if thumbnail_url == None:
            logging.error("Failed to identify thumbnail URL (status code %d)", metaDataResponse.status_code)
            return Response({ "errorMessage": "Dashboard not found or no thumbnail available" }, status=metaDataResponse.status_code)

        superset_root_url = re.search(r"^(.*?)(?:/api/v\d+)?$", superset_base_url).group(1)
        thumbnail_response = requests.get(f"{superset_root_url}{thumbnail_url}", headers=headers, stream=True)
        if not thumbnail_response.ok:
            logging.error("Failed to read thumbnail (status code %d)", thumbnail_response.status_code)
            return Response({ "errorMessage": "Failed to read thumbnail from Superset" }, status=thumbnail_response.status_code)

        return StreamingHttpResponse(thumbnail_response.iter_content(chunk_size=None), status=thumbnail_response.status_code, content_type=thumbnail_response.headers.get('Content-Type'))

class GetFavoriteStatus(SupersetAPI):
    """
    API view to get dashboard favorite status for the current user
    """

    keycloak_scopes = {
        "GET": "dashboard:read",
    }

    def get(self, request, query=None):
        """
        Endpoint for getting dashboard favorite status for the current user
        """
        if query == '[]' or query == None:
            return Response({"result": "No favorite dashboard were provided"}, status=status.HTTP_400_BAD_REQUEST)

        url = f"{os.getenv('SUPERSET_BASE_URL')}/dashboard/favorite_status/?q={query}"
        headers = self.authorize({})

        response = requests.get(url, headers=headers)
        return Response(response.json(), status=response.status_code)  # result.uuid

class AddFavorite(SupersetAPI):
    """
    API view to add a superset dashboard to favorites
    """

    keycloak_scopes = {
        "POST": "dashboard:read",
    }

    def post(self, request):
        """
        Endpoint for adding superset dashboard to favorites 
        """
        id = request.data.get("id", None)

        url = f"{os.getenv('SUPERSET_BASE_URL')}/dashboard/{id}/favorites/"
        headers = self.authorize({
            "Content-Type": "application/json",
        })

        response = requests.post(
            url,
            json={},
            headers=headers,
        )

        if response.status_code != 200:
            return Response(
                {"errorMessage": response.json()}, status=response.status_code
            )

        return Response(response.json(), status=status.HTTP_200_OK)

class RemoveFavorite(SupersetAPI):
    """
    API view to remove a superset dashboard from favorites
    """

    keycloak_scopes = {
        "DELETE": "dashboard:read",
    }

    def delete(self, request):
        """
        Endpoint for removing a superset dashboard from favorites
        """
        id = request.data.get("id", None)

        url = f"{os.getenv('SUPERSET_BASE_URL')}/dashboard/{id}/favorites/"
        headers = self.authorize({
            "Content-Type": "application/json",
        })

        response = requests.delete(
            url,
            json={},
            headers=headers,
        )
        if response.status_code != 200:
            return Response(
                {"errorMessage": response.json()}, status=response.status_code
            )

        return Response(response.json(), status=status.HTTP_200_OK)

class GuestTokenApi(SupersetAPI):
    """
    API view to get superset guest token
    """

    keycloak_scopes = {
        "POST": "dashboard:read",
    }

    def post(self, request):
        """
        Endpoint for getting superset guest token 
        """
        url = f"{os.getenv('SUPERSET_BASE_URL')}/security/guest_token/"
        headers = self.authorize({
            "Content-Type": "application/json",
        })

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


class CsrfTokenApi(SupersetAPI):
    """
    API view to get superset csrf token
    """

    permission_classes = [
        AllowAny,
    ]

    def get(self, request):
        """
        Endpoint for getting superset CSRF token
        """
        url = f"{os.getenv('SUPERSET_BASE_URL')}/security/csrf_token/"

        try:
            auth_token = get_auth_token()
        except KeycloakPostError as err:
            return {
                "status": err.response_code,
                "message": err.error_message
            }

        headers = {
            "Authorization": f"Bearer {auth_token['access_token']}",
        }

        response = requests.get(url=url, headers=headers)

        if response.status_code != 200:
            return Response(
                {"errorMessage": response.json()}, status=response.status_code
            )

        return Response({"data": response.json()}, status=status.HTTP_200_OK)
