from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('', include('accounts.urls')),
    path('health/', include('health.urls')),
    path('airflow/', include('airflow.urls')),
    path('api/', include('api.urls')),
    path('admin/', admin.site.urls),
]
