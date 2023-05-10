from django.urls import path
from .views import DagView

urlpatterns = [
    path('airflow/', DagView.as_view()),
    path('airflow/<str:id>/', DagView.as_view()),  
    path('airflow/<str:id>/update/', DagView.as_view())  
]