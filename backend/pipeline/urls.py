from django.urls import path
from .views import PipelineSaveView, PipelineUploadView, PipelineDownloadView, PipelineListView, PipelineDetailView

urlpatterns = [
    path("", PipelineListView.as_view()),
    path("/list/", PipelineListView.as_view()),
    path('/upload/', PipelineUploadView.as_view()),
    path("/list/<str:query>", PipelineListView.as_view()),
    path("/<str:name>", PipelineDetailView.as_view()),
    path("/download/<str:name>", PipelineDownloadView.as_view()),
    path("/save/<str:name>", PipelineSaveView.as_view()),
]
