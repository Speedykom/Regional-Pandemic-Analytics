from . import views
from rest_framework import permissions
from django.urls import re_path, path, include
from data.views import DataUploadAPIView
from accounts import views

from hop.views import GetSingleHopAPIView, NewHopAPIView

from auth import views as auth_view
from roles import views as role_view
from supersets import views as superset_view
from shared_datasets.views import (
    TokenManagementView,
    TokenRevokeView,
    SharedDatasetView,
    DatasetDownloadView,
)


urlpatterns = [
    
    ## ---------------------- Auth Endpoints -----------------------------------
    path("auth/login", auth_view.LoginAPI.as_view()),  # app login
    path(
        "auth/key-auth", auth_view.KeyCloakLoginAPI.as_view()
    ),  # Keycloak login and refresh token
    path(
        "auth/password", auth_view.PasswordAPI.as_view()
    ),  # create and change password
    path(
        "auth/request-verify", auth_view.ResetPasswordAPI.as_view()
    ),  # Reset password and verify reset password token
    path("auth/me", auth_view.Authorization.as_view()),  # get my details
    path("auth/logout", auth_view.Logout.as_view()),  # logout
    # ---------------------- User Management Endpoints --------------------------
    path("account/user", views.UserListView.as_view()),  # Create User
    path("account/users", views.UserListView.as_view()),  # get users
    path("account/user/<str:id>/", views.UserDetailView.as_view()),  # get user
    path("account/user/<str:id>/delete", views.UserDetailView.as_view()),  # delete user
    path("account/user/<str:id>/update", views.UserDetailView.as_view()),  # update user
    path("account/user/<str:id>/roles", views.UserRolesView.as_view()),  # assign user
    path("account/user/<str:id>/avatar", views.UserAvatarView.as_view()),  # get or update avatar
    # ---------------------- API Role Endpoints --------------------------
    path("role/", role_view.RoleApiView.as_view()),  # create role
    path("role/<str:name>/update", role_view.RoleApiView.as_view()),  # get role
    # ---------------------- API Superset Endpoints --------------------------
    path("superset/list/", superset_view.ListDashboardsAPI.as_view()),  # list dashboards
        path("superset/list/<str:query>", superset_view.ListDashboardsAPI.as_view()),  # list dashboards
    path("superset/list/charts/", superset_view.ListChartsAPI.as_view()),  # list charts
        path("superset/list/charts/<str:query>", superset_view.ListChartsAPI.as_view()),  # list charts
    path(
        "superset/guest/token", superset_view.GuestTokenApi.as_view()
    ),  # get guest token
    path("superset/csrf/token", superset_view.CsrfTokenApi.as_view()),  # get csrf token
    path(
        "superset/dashboard/enable-embed", superset_view.EnableEmbed.as_view()
    ),  # enable embed
    path(
        "superset/dashboard/embed/<str:id>", superset_view.GetEmbeddable.as_view()
    ),  # get embedded dashboard
    path(
        "superset/dashboard/<str:id>/thumbnail", superset_view.GetThumbnail.as_view()
    ),
    path(
        "superset/dashboard/favorite-status/<str:query>", superset_view.GetFavoriteStatus.as_view()
    ),  # get dashboard favorite status for current user
    path(
        "superset/dashboard/add-favorite", superset_view.AddFavorite.as_view()
    ),  # add dashboard to favorites
    path(
        "superset/dashboard/remove-favorite", superset_view.RemoveFavorite.as_view()
    ),  # remove dashboard from favorites
    # ---------------------- Piepline  Endpoints ------------------------------------------
    path("pipeline", include("pipeline.urls")),
    # ---------------------- Process Chain  Endpoints ------------------------------------------
    path("process", include("process.urls")),
    # ---------------------- Data upload Endpoints ------------------------------------------
    # endpoint for uploading data
    path("data/upload/", DataUploadAPIView.as_view()),
    # ---------------------- Hop Endpoints ------------------------------------------
    # endpoint for uploading data
    path("hop/new/", NewHopAPIView.as_view()),
    path("hop/<str:filename>/", GetSingleHopAPIView.as_view()),
    
    
    # endpoints for speedymesh integration
    path('tokens/', TokenManagementView.as_view(), name='token_management'),
    path('tokens/<str:token_id>/', TokenRevokeView.as_view(), name='token_revoke'),
    path('shared_datasets/', SharedDatasetView.as_view(), name='shared_datasets'),
    path('shared_datasets/<str:dataset_id>/', DatasetDownloadView.as_view(), name='dataset_download'),
]
