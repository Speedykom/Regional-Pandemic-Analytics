from django.contrib import admin
from django.urls import path, include
from django.conf.urls.static import static
from django.conf import settings

urlpatterns = [
    path('', include('auth.urls')),
    path('', include('roles.urls')),
    path('', include('accounts.urls')),
    path('', include('superset.urls')),
    path('api/', include('api.urls')),
    path('admin/', admin.site.urls),
]


if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

