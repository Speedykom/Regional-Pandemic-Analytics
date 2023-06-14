from django.urls import path
from . import views

app_name = 'superset'

urlpatterns = [
    path('/', views.ListDashboardsAPI.as_view()),  # list dashboards
    path('/guest/token', views.GuestTokenApi.as_view()),  # get guest token
]
