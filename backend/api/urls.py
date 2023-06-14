from . import views
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from django.urls import include, re_path, path
from process.views.process import GetProcess, RunProcess, RequestEditProcess, CreateProcess, EditProcess, DeleteProcess
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
    re_path(r'^swagger(?P<format>\.json|\.yaml)$',
            schema_view.without_ui(cache_timeout=0), name='schema-json'),
    re_path(r'^docs/$', schema_view.with_ui('swagger',
            cache_timeout=0), name='schema-swagger-ui'),
    re_path(r'^redoc/$', schema_view.with_ui('redoc',
            cache_timeout=0), name='schema-redoc'),

    ## ---------------------- Auth Endpoints -----------------------------------
    path('', include('auth.urls')),

    # ---------------------- User Management Endpoints --------------------------
    path('account/user', views.CreateUserAPI.as_view()),  # Create User
    path('account/users', views.ListUsersAPI.as_view()),  # get users
    path('account/user/<str:id>/', views.GetUserAPI.as_view()),  # get user
    path('account/user/<str:id>/delete', views.DeleteUserAPI.as_view()),  # delete user
    path('account/user/<str:id>/update',  views.UpdateUserAPI.as_view()),  # update user
    path('account/user/<str:id>/assign-roles', views.AssignRolesAPI.as_view()),  # assign user
    path('account/user/<str:id>/avatar-upload1', views.AvatarUploadApI.as_view()),  # update avatar
    path('account/user/avatar/get', views.AvatarDownload.as_view()), # download avatar
    
    # ---------------------- API Role Endpoints --------------------------
    path('', include('roles.urls')),
    
    # ---------------------- API Superset Endpoints --------------------------
    path('', include('superset.urls')),

    # ---------------------- Process Chain  Endpoints ------------------------------------------
    path('process', CreateProcess.as_view()),
    path('process/list', GetProcess.as_view()),
    path('process/run/<str:id>', RunProcess.as_view()),
    path('process/access/<str:dag_id>', RequestEditProcess.as_view()),
    path('process/<str:id>', EditProcess.as_view()),
    path('process/one/<str:dag_id>', GetProcess.as_view()),

    # ---------------------- Data upload Endpoints ------------------------------------------

    # endpoint for uploading data
    path('data/upload/', DataUploadAPI.as_view()),

    # ---------------------- Hop Endpoints ------------------------------------------

    # endpoint for uploading data
    path('hop/', ListHopAPIView.as_view()),
    path('hop/new/', NewHopAPIView.as_view()),
    path('hop/<str:filename>/', GetSingleHopAPIView.as_view()),
]
