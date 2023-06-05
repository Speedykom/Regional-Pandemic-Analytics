from . import views
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from django.urls import re_path, path
from airflow.views.process import GetProcess, RunProcess, RequestEditProcess, CreateProcess, EditProcess, DeleteProcess
from data.views import DataUploadAPI
from accounts import views

from hop.views import (
    ListHopAPIView, GetSingleHopAPIView, NewHopAPIView
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
    path('accounts/login/', views.LoginAPI.as_view()),

    # ---------------------- Keycloak Endpoints ------------------------------------------
    path('accounts/auth/', views.KeyCloakLoginAPI.as_view()), # Keycloak login
    path('accounts/refresh/', views.KeycloakRefreshTokenAPI.as_view()), # Keycloak refresh token

    # ---------------------- End of Keycloak Endpoints -----------------------------------

    # ---------------------- Keycloak User Management Endpoints --------------------------
    path('account/user', views.CreateUserAPI.as_view()), #Create User
    path('account/users', views.ListUsersAPI.as_view()), #get users
    path('account/roles', views.ListRolesAPI.as_view()), #keycloak roles
    path('account/user/<str:id>/', views.GetUserAPI.as_view()), #get user
    path('account/user/<str:id>/delete', views.DeleteUserAPI.as_view()), #delete user
    path('account/user/<str:id>/update', views.UpdateUserAPI.as_view()), #update user
    path('account/user/<str:id>/assign-roles', views.AssignRolesAPI.as_view()), #assign user
    path('account/user/reset/password', views.ResetPasswordAPI.as_view()), #reset user password
    path('account/user/reset/password-request', views.ResetPasswordRequestAPI.as_view()), #reset user password request
    path('account/roles/create', views.CreateRolesAPI.as_view()), #create role
    path('account/roles/<str:id>/update', views.UpdateRolesAPI.as_view()), #update role
    path('account/roles/<str:id>/delete', views.DeleteRolesAPI.as_view()), #delete role
    path('account/verify-token', views.VerifyResetTokenAPI.as_view()), #verify token
    path('account/create-password', views.CreatePasswordAPI.as_view()), #create password
    # ---------------------- End of User Management Endpoints ----------------------------

    # ---------------------- Process Chain  Endpoints ------------------------------------------
    path('process', CreateProcess.as_view()),
    path('process/list', GetProcess.as_view()),
    path('process/run/<str:id>', RunProcess.as_view()),
    path('process/access/<str:dag_id>', RequestEditProcess.as_view()),
    path('process/<str:id>', EditProcess.as_view()),
    path('process/one/<str:dag_id>', GetProcess.as_view()),
    # path('process/<str:id>', DeleteProcess.as_view()),

    # ---------------------- Data upload Endpoints ------------------------------------------

    # endpoint for uploading data
    path('data/upload/', DataUploadAPI.as_view()),

    # ---------------------- End of Data Upload Endpoints -----------------------------------

    # ---------------------- Hop Endpoints ------------------------------------------

    # endpoint for uploading data
    path('hop/', ListHopAPIView.as_view()),
    path('hop/new/', NewHopAPIView.as_view()),
    path('hop/<str:filename>/', GetSingleHopAPIView.as_view()),

    # ---------------------- End of Hop Endpoints -----------------------------------
]
