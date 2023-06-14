from django.urls import path
from auth import views

urlpatterns = [
    path('auth/login', views.LoginAPI.as_view()),  # app login
    path('auth/key-auth', views.KeyCloakLoginAPI.as_view()),  # Keycloak login and refresh token
    path('auth/password', views.PasswordAPI.as_view()), # create and change password
    path('auth/request-verify', views.ResetPasswordAPI.as_view()) # Reset password and verify reset password token
]
