from django.urls import path
from .views import PipelineListView, PipelineDetailView

urlpatterns = [
    path("", PipelineListView.as_view()),
    path("/list/", PipelineListView.as_view()),
    path("/list/<str:query>", PipelineListView.as_view()),
    path("/<str:name>", PipelineDetailView.as_view()),
]
