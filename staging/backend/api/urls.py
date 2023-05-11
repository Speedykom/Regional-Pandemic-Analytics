from django.urls import path
from .import views
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from django.urls import re_path, path
from airflow.views import DagView

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
    path('auth/', views.LoginAPI.as_view()),

    path('airflow/', DagView.as_view()),
    path('airflow/<str:id>/', DagView.as_view()),  
    path('airflow/<str:id>/update/', DagView.as_view())
]