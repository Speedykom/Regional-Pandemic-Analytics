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

# Set up logging
logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)
handler = logging.FileHandler('/var/log/backend/backend.log')
handler.setLevel(logging.INFO)
formatter = logging.Formatter('%(asctime)s:%(levelname)s:%(message)s')
handler.setFormatter(formatter)
logger.addHandler(handler)

class SupersetAPI(APIView):
    def authorize(self, headers):
        try:
            token = get_auth_token()
            headers['Authorization'] = f"Bearer {token['access_token']}"
            logger.debug("Added authorization header to Superset request")
        except Exception as e:
            logger.error("Failed to authorize Superset request: %s", str(e))
            raise
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
        logger.debug("Listing Superset dashboards with query %s", query)
        url = f"{os.getenv('SUPERSET_BASE_URL')}/dashboard/"
        try:
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
                logger.error("Listing of Superset dashboards failed with code %d: %s", superset_response.status_code, superset_response.text)
                return Response(
                    {"errorMessage": superset_response.text},
                    status=superset_response.status_code,
                )

            result = superset_response.json()
            logger.debug("Successfully listed %d dashboards from Superset", result["count"])
            return Response(result, status=status.HTTP_200_OK)
        except Exception as e:
            logger.error("Exception occurred while listing Superset dashboards: %s", str(e))
            return Response(
                {"errorMessage": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


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
        logger.debug("Listing Superset charts with query %s", query)
        url = f"{os.getenv('SUPERSET_BASE_URL')}/chart/"
        try:
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
                logger.error("Listing of Superset charts failed with code %d: %s", response.status_code, response.text)
                return Response(
                    {"errorMessage": response.json()}, status=response.status_code
                )

            logger.debug("Successfully listed charts from Superset")
            return Response(response.json(), status=status.HTTP_200_OK)
        except Exception as e:
            logger.error("Exception occurred while listing Superset charts: %s", str(e))
            return Response(
                {"errorMessage": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


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
        logger.debug("Enabling embed for Superset dashboard with UID %s", uid)

        url = f"{os.getenv('SUPERSET_BASE_URL')}/dashboard/{uid}/embedded"

        try:
            headers = self.authorize({
                "Content-Type": "application/json",
            })

            response = requests.post(
                url,
                json={"allowed_domains": [os.getenv("SUPERSET_ALLOWED_DOMAINS")]},
                headers=headers,
            )

            if response.status_code != 200:
                logger.error("Enabling embed for Superset dashboard failed with code %d: %s", response.status_code, response.text)
                return Response(
                    {"errorMessage": response.json()}, status=response.status_code
                )

            logger.debug("Successfully enabled embed for Superset dashboard")
            return Response(response.json(), status=status.HTTP_200_OK)  # result.uuid
        except Exception as e:
            logger.error("Exception occurred while enabling embed for Superset dashboard: %s", str(e))
            return Response(
                {"errorMessage": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


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
        logger.debug("Fetching embeddable Superset dashboard with ID %s", kwargs['id'])
        url = f"{os.getenv('SUPERSET_BASE_URL')}/dashboard/{kwargs['id']}/embedded"

        try:
            headers = self.authorize({})

            response = requests.get(url, headers=headers)

            if response.status_code != 200:
                logger.error("Failed to fetch embeddable Superset dashboard with code %d: %s", response.status_code, response.text)

            return Response(response.json(), status=response.status_code)  # result.uuid
        except Exception as e:
            logger.error("Exception occurred while fetching embeddable Superset dashboard: %s", str(e))
            return Response(
                {"errorMessage": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

class GetThumbnail(SupersetAPI):
    keycloak_scopes = {
        "GET": "dashboard:read",
    }

    def get(self, request, *args, **kwargs):
        """
        Endpoint for getting dashboard thumbnail 
        """
        logger.debug("Fetching thumbnail for Superset dashboard with ID %s", kwargs['id'])
        try:
            superset_base_url = os.getenv('SUPERSET_BASE_URL')
            dashboardMetaUrl = f"{superset_base_url}/dashboard/{kwargs['id']}"
            headers = self.authorize({})
            metaDataResponse = requests.get(dashboardMetaUrl, headers=headers)

            if metaDataResponse.ok:
                thumbnail_url = metaDataResponse.json()['result']['thumbnail_url']
            else:
                logger.error("Failed to fetch dashboard metadata with code %d: %s", metaDataResponse.status_code, metaDataResponse.text)
                return Response({"errorMessage": "Dashboard not found or no thumbnail available"}, status=metaDataResponse.status_code)

            if not thumbnail_url:
                logger.error("Thumbnail URL is None")
                return Response({"errorMessage": "Dashboard not found or no thumbnail available"}, status=metaDataResponse.status_code)

            superset_root_url = re.search(r"^(.*?)(?:/api/v\d+)?$", superset_base_url).group(1)
            thumbnail_response = requests.get(f"{superset_root_url}{thumbnail_url}", headers=headers, stream=True)

            if not thumbnail_response.ok:
                logger.error("Failed to read thumbnail with code %d: %s", thumbnail_response.status_code, thumbnail_response.text)
                return Response({ "errorMessage": "Failed to read thumbnail from Superset" }, status=thumbnail_response.status_code)

            return StreamingHttpResponse(thumbnail_response.iter_content(chunk_size=None), status=thumbnail_response.status_code, content_type=thumbnail_response.headers.get('Content-Type'))
        except Exception as e:
            logger.error("Exception occurred while fetching thumbnail: %s", str(e))
            return Response(
                {"errorMessage": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

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
        logger.debug("Fetching favorite status for Superset dashboards with query %s", query)
        if query == '[]' or query == None:
            return Response({"result": "No favorite dashboard were provided"}, status=status.HTTP_400_BAD_REQUEST)

        url = f"{os.getenv('SUPERSET_BASE_URL')}/dashboard/favorite_status/?q={query}"

        try:
            headers = self.authorize({})

            response = requests.get(url, headers=headers)

            if response.status_code != 200:
                logger.error("Failed to fetch favorite status with code %d: %s", response.status_code, response.text)

            return Response(response.json(), status=response.status_code)  # result.uuid
        except Exception as e:
            logger.error("Exception occurred while fetching favorite status: %s", str(e))
            return Response(
                {"errorMessage": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

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
        logger.debug("Adding Superset dashboard to favorites with ID %s", request.data.get("id"))
        id = request.data.get("id", None)

        url = f"{os.getenv('SUPERSET_BASE_URL')}/dashboard/{id}/favorites/"
        headers = self.authorize({
            "Content-Type": "application/json",
        })

        try:
            response = requests.post(
                url,
                json={},
                headers=headers,
            )

            if response.status_code != 200:
                logger.error("Failed to add dashboard to favorites with code %d: %s", response.status_code, response.text)
                return Response(
                    {"errorMessage": response.json()}, status=response.status_code
                )

            logger.debug("Successfully added dashboard to favorites")
            return Response(response.json(), status=status.HTTP_200_OK)
        except Exception as e:
            logger.error("Exception occurred while adding dashboard to favorites: %s", str(e))
            return Response(
                {"errorMessage": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

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
        logger.debug("Removing Superset dashboard from favorites with ID %s", request.data.get("id"))
        id = request.data.get("id", None)

        url = f"{os.getenv('SUPERSET_BASE_URL')}/dashboard/{id}/favorites/"
        headers = self.authorize({
            "Content-Type": "application/json",
        })

        try:
            response = requests.delete(
                url,
                json={},
                headers=headers,
            )

            if response.status_code != 200:
                logger.error("Failed to remove dashboard from favorites with code %d: %s", response.status_code, response.text)
                return Response(
                    {"errorMessage": response.json()}, status=response.status_code
                )

            logger.debug("Successfully removed dashboard from favorites")
            return Response(response.json(), status=status.HTTP_200_OK)
        except Exception as e:
            logger.error("Exception occurred while removing dashboard from favorites: %s", str(e))
            return Response(
                {"errorMessage": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

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
        logger.debug("Requesting Superset guest token for dashboard ID %s", request.data.get("id"))
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

        try:
            response = requests.post(url, json=payload, headers=headers)

            if response.status_code != 200:
                logger.error("Failed to get Superset guest token with code %d: %s", response.status_code, response.text)
                return Response(
                    {"errorMessage": response.json()}, status=response.status_code
                )

            logger.debug("Successfully obtained Superset guest token")
            return Response(response.json(), status=status.HTTP_200_OK)
        except Exception as e:
            logger.error("Exception occurred while obtaining Superset guest token: %s", str(e))
            return Response(
                {"errorMessage": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


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
        logger.debug("Requesting Superset CSRF token")
        url = f"{os.getenv('SUPERSET_BASE_URL')}/security/csrf_token/"

        try:
            auth_token = get_auth_token()
        except KeycloakPostError as err:
            logger.error("Failed to get auth token: %s", err.error_message)
            return {
                "status": err.response_code,
                "message": err.error_message
            }

        headers = {
            "Authorization": f"Bearer {auth_token['access_token']}",
        }

        try:
            response = requests.get(url=url, headers=headers)

            if response.status_code != 200:
                logger.error("Failed to get CSRF token with code %d: %s", response.status_code, response.text)
                return Response(
                    {"errorMessage": response.json()}, status=response.status_code
                )

            logger.debug("Successfully obtained CSRF token")
            return Response({"data": response.json()}, status=status.HTTP_200_OK)
        except Exception as e:
            logger.error("Exception occurred while obtaining CSRF token: %s", str(e))
            return Response(
                {"errorMessage": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
