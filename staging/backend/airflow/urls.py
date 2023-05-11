from django.urls import path
from .views import DagView

urlpatterns = [
    path('', DagView.as_view()),
    path('<str:id>/', DagView.as_view()),  
    path('<str:id>/update/', DagView.as_view())  
]