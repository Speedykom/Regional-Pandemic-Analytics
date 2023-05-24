from . import views
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from django.urls import re_path, path
from airflow.views.gdag import DagView
from airflow.views.process import GetProcessChain, RunProcessChain
from airflow.views.gdag import DagView
from data.views import DataUploadAPI
from accounts.views import (
    LoginAPI, KeyCloakLoginAPI, KeycloakRefreshTokenAPI, CreateUserAPI, ListUsersAPI, ListRolesAPI, GetUserAPI, DeleteUserAPI, AssignRolesAPI, ResetPasswordAPI
)


app_name = 'api'

schema_view = get_schema_view(
    openapi.Info(
        title="IGAD APIs",
        default_version='v1',
        description="IGAD - API Endpoints",
        terms_of_service="#",
        contact=openapi.Contact(email="info@speedykom.de"),
        license=openapi.License(name="BSD License"),
    ),
    public=True,
    permission_classes=[permissions.IsAuthenticated],
)

urlpatterns = [
    re_path(r'^swagger(?P<format>\.json|\.yaml)$', schema_view.without_ui(cache_timeout=0), name='schema-json'),
    re_path(r'^docs/$', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    re_path(r'^redoc/$', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),

    # Login Endpoint
    path('accounts/login/', LoginAPI.as_view()),

    # ---------------------- Keycloak Endpoints ------------------------------------------
    path('accounts/auth/', KeyCloakLoginAPI.as_view()), # Keycloak login
    path('accounts/refresh/', KeycloakRefreshTokenAPI.as_view()), # Keycloak refresh token

    # ---------------------- End of Keycloak Endpoints -----------------------------------

    # ---------------------- Keycloak User Management Endpoints --------------------------
    path('account/user', CreateUserAPI.as_view()), #Create User
    path('account/users', ListUsersAPI.as_view()), #get users
    path('account/roles', ListRolesAPI.as_view()), #keycloak roles
    path('account/user/<str:id>/', GetUserAPI.as_view()), #get user
    path('account/user/<str:id>/delete', DeleteUserAPI.as_view()), #delete user
    path('account/user/<str:id>/assign-roles', AssignRolesAPI.as_view()), #assign user
    path('account/user/<str:id>/rest-password', ResetPasswordAPI.as_view()), #reset user password
    # ---------------------- End of User Management Endpoints ----------------------------

    # ---------------------- Process Chain  Endpoints ------------------------------------------
    path('airflow/', DagView.as_view()),
    path('airflow/<str:id>/', DagView.as_view()),
    path('airflow/<str:id>/update/', DagView.as_view()),

    # ---------------------- Airflow  Endpoints ------------------------------------------
    path('process/', GetProcessChain.as_view()),
    path('process/run/<str:id>', RunProcessChain.as_view()),
    path('process/<str:id>/', GetProcessChain.as_view()),

    # ---------------------- Data upload Endpoints ------------------------------------------

    # endpoint for uploading data
    path('data/upload/', DataUploadAPI.as_view()),

    # ---------------------- End of Data Upload Endpoints -----------------------------------

]
