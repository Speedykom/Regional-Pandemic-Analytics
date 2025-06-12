from django.contrib import admin
from django.urls import path, include
from django.conf.urls.static import static
from django.conf import settings
from api import views
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi


schema_view = get_schema_view(
    openapi.Info(
        title="Repan API",
        default_version="v1",
        description="API documentation for Repan platform",
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
    authentication_classes=[],
)

urlpatterns = [
    path("api/", include("api.urls")),
    path("admin/", admin.site.urls),
    # For swagger
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),

]

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
