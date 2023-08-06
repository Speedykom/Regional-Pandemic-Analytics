from . import views
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from django.urls import re_path, path
from process.views import process as process_views, pipeline as pipeline_views
from data.views import DataUploadAPIView
from accounts import views

from hop.views import (
    ListHopAPIView, GetSingleHopAPIView, NewHopAPIView
)

from auth import views as auth_view
from roles import views as role_view
from supersets import views as superset_view

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
    re_path(r'^swagger(?P<format>\.json|\.yaml)$',
            schema_view.without_ui(cache_timeout=0), name='schema-json'),
    re_path(r'^docs/$', schema_view.with_ui('swagger',
            cache_timeout=0), name='schema-swagger-ui'),
    re_path(r'^redoc/$', schema_view.with_ui('redoc',
            cache_timeout=0), name='schema-redoc'),

    ## ---------------------- Auth Endpoints -----------------------------------
    path('auth/login', auth_view.LoginAPI.as_view()),  # app login
    path('auth/key-auth', auth_view.KeyCloakLoginAPI.as_view()),  # Keycloak login and refresh token
    path('auth/password', auth_view.PasswordAPI.as_view()), # create and change password
    path('auth/request-verify', auth_view.ResetPasswordAPI.as_view()), # Reset password and verify reset password token
    path('auth/me', auth_view.Authorization.as_view()), # get my details
    path('auth/logout', auth_view.Logout.as_view()), # logout

    # ---------------------- User Management Endpoints --------------------------
    path('account/user', views.UserListView.as_view()),  # Create User
    path('account/users', views.UserListView.as_view()),  # get users
    path('account/user/<str:id>/', views.UserDetailView.as_view()),  # get user
    path('account/user/<str:id>/delete', views.UserDetailView.as_view()),  # delete user
    path('account/user/<str:id>/update',  views.UserDetailView.as_view()),  # update user
    path('account/user/<str:id>/roles', views.UserRolesView.as_view()),  # assign user
    path('account/user/<str:id>/avatar-upload1', views.UserAvatarView.as_view()),  # update avatar
    path('account/user/avatar/get', views.UserAvatarView.as_view()), # download avatar
    
    # ---------------------- API Role Endpoints --------------------------
    path('role/', role_view.RoleApiView.as_view()),  # create role
    path('role/<str:name>/update', role_view.RoleApiView.as_view()),  # get role
    
    # ---------------------- API Superset Endpoints --------------------------
    path('superset/list', superset_view.ListDashboardsAPI.as_view()),  # list dashboards
    path('superset/list/charts', superset_view.ListChartsAPI.as_view()),  # list charts
    path('superset/guest/token', superset_view.GuestTokenApi.as_view()),  # get guest token
    path('superset/csrf/token', superset_view.CsrfTokenApi.as_view()),  # get csrf token
    path('superset/dashboard/enable-embed', superset_view.EnableEmbed.as_view()),  # enable embed
    path('superset/dashboard/embed/<str:id>', superset_view.GetEmbeddable.as_view()),  # get embedded dashboard
    
    # ---------------------- Piepline  Endpoints ------------------------------------------
    path('pipeline', pipeline_views.PipelineListView.as_view()),
    path('pipeline/list', pipeline_views.PipelineListView.as_view()),
    path('pipeline/access/<str:id>', pipeline_views.PipelineDetailView.as_view()),

    # ---------------------- Process Chain  Endpoints ------------------------------------------
    path('process', process_views.ProcessListView.as_view()),
    path('process/list', process_views.ProcessListView.as_view()),
    path('process/run/<str:id>', process_views.ProcessDetailView.as_view()),
    path('process/delete/<str:dag_id>', process_views.ProcessDetailView.as_view()),
    path('process/one/<str:dag_id>', process_views.ProcessDetailView.as_view()),

    # ---------------------- Data upload Endpoints ------------------------------------------

    # endpoint for uploading data
    path('data/upload/', DataUploadAPIView.as_view()),

    # ---------------------- Hop Endpoints ------------------------------------------

    # endpoint for uploading data
    path('hop/', ListHopAPIView.as_view()),
    path('hop/new/', NewHopAPIView.as_view()),
    path('hop/<str:filename>/', GetSingleHopAPIView.as_view()),
]
