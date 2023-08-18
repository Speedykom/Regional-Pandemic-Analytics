# -*- coding: utf-8 -*-
#
# Copyright (C) 2017 Marcos Pereira <marcospereira.mpj@gmail.com>
# Modified by Sairam Krish <haisairam@gmail.com>
#
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU Lesser General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU Lesser General Public License for more details.
#
# You should have received a copy of the GNU Lesser General Public License
# along with this program.  If not, see <http://www.gnu.org/licenses/>.

import re
import logging
from django.conf import settings
from django.http.response import JsonResponse
from django.utils.deprecation import MiddlewareMixin
from keycloak.exceptions import KeycloakInvalidTokenError
from rest_framework.exceptions import PermissionDenied, AuthenticationFailed, NotAuthenticated
from utils.keycloak_auth import get_keycloak_admin, get_keycloak_openid

logger = logging.getLogger(__name__)

class KeycloakMiddleware(MiddlewareMixin):

    def __init__(self, get_response):
        """
        :param get_response:
        """
        # Initialize Keycloak
        config = settings.KEYCLOAK_CONFIG
        client_id = config['KEYCLOAK_CLIENT_ID']
        keycloak_admin = get_keycloak_admin()
        client_id = keycloak_admin.get_client_id(client_id)
        self.client_authz_settings = keycloak_admin.get_client_authz_settings(client_id=client_id)
        # Django
        self.get_response = get_response

    def __call__(self, request):
        """
        :param request:
        :return:
        """
        return self.get_response(request)

    def process_view(self, request, view_func, view_args, view_kwargs):
        """
        Validate only the token introspect.
        :param request: django request
        :param view_func:
        :param view_args: view args
        :param view_kwargs: view kwargs
        :return:
        """
        
        if hasattr(settings, 'KEYCLOAK_BEARER_AUTHENTICATION_EXEMPT_PATHS'):
            path = request.path_info.lstrip('/')
 
            if any(re.match(m, path) for m in
                   settings.KEYCLOAK_BEARER_AUTHENTICATION_EXEMPT_PATHS):
                logger.debug('** exclude path found, skipping')
                return None

        try:
            view_scopes = view_func.cls.keycloak_scopes
        except AttributeError as e:
            logger.debug('Allowing free acesss, since no authorization configuration (keycloak_scopes) found for this request route :%s',request)
            return None

        if 'HTTP_AUTHORIZATION' not in request.META:
            return JsonResponse({"detail": NotAuthenticated.default_detail},
                                status=NotAuthenticated.status_code)

        keycloak = get_keycloak_openid(request)
        keycloak.authorization.load_config(self.client_authz_settings)
        config = settings.KEYCLOAK_CONFIG
        default_access = config.get('KEYCLOAK_DEFAULT_ACCESS', "DENY")
        method_validate_token = config.get('KEYCLOAK_METHOD_VALIDATE_TOKEN', "INTROSPECT")
        client_public_key = "-----BEGIN PUBLIC KEY-----\n" + keycloak.public_key() + "\n-----END PUBLIC KEY-----"

        auth_header = request.META.get('HTTP_AUTHORIZATION').split()
        token = auth_header[1] if len(auth_header) == 2 else auth_header[0]

        # Get default if method is not defined.
        required_scope = view_scopes.get(request.method, None) \
            if view_scopes.get(request.method, None) else view_scopes.get('DEFAULT', None)

        # DEFAULT scope not found and DEFAULT_ACCESS is DENY
        if not required_scope and default_access == 'DENY':
            return JsonResponse({"detail": PermissionDenied.default_detail},
                                status=PermissionDenied.status_code)

        try:
            user_permissions = keycloak.get_permissions(token,
                                                             method_token_info=method_validate_token.lower(),
                                                             key=client_public_key,
                                                             options={"verify_aud": False})
        except:
            return JsonResponse({"detail": AuthenticationFailed.default_detail},
                                status=AuthenticationFailed.status_code)

        has_scope_permission = False
        for perm in user_permissions:
            if required_scope in perm.scopes:
                has_scope_permission = True

        if has_scope_permission:
            # Add to userinfo to the view
            try:
                request.userinfo = keycloak.userinfo(token)
            except Exception as e:
                return JsonResponse({"detail": AuthenticationFailed.default_detail},
                                    status=AuthenticationFailed.status_code)
        else:
            # User Permission Denied
            return JsonResponse({"detail": PermissionDenied.default_detail},
                                status=PermissionDenied.status_code)
