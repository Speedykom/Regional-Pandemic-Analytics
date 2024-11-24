from django.contrib import admin
from django.urls import path, include
from django.conf.urls.static import static
from django.conf import settings
from api import views
from rest_framework_swagger.views import get_swagger_view


schema_view = get_swagger_view(title='d-OHP API')


urlpatterns = [
    path("api/", include("api.urls")),
    path("admin/", admin.site.urls),
    # For swagger
    path('swagger/', schema_view),
]

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
