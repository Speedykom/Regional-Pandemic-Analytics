from django.urls import path
from superset import views

urlpatterns = [
    path('superset/', views.ListDashboardsAPI.as_view()),  # dashboards
]
