from django.urls import path
from . import views

urlpatterns = [
    path('superset/', views.ListDashboardsAPI.as_view()),  # list dashboards
    path('superset/guest/token', views.GuestTokenApi.as_view()),  # get guest token
]
