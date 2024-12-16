from django.urls import path
from .views import TemplateView, PipelineDeleteView, PipelineUploadView, PipelineUploadExternalFilesView, PipelineDownloadView, PipelineListView, PipelineDetailView, PipelineTagView

urlpatterns = [
    path("", PipelineListView.as_view()),
    path("/list/", PipelineListView.as_view()),
    path("/upload/", PipelineUploadView.as_view()),
    path("/upload-external-files/", PipelineUploadExternalFilesView.as_view()),
    path("/list/<str:query>", PipelineListView.as_view()),
    path("/<str:name>", PipelineDetailView.as_view()),
    path("/cancel/<str:name>", PipelineDetailView.as_view()),
    path("/download/<str:name>", PipelineDownloadView.as_view()),
    path("/delete/<str:name>", PipelineDeleteView.as_view()),
    path("/template/", TemplateView.as_view()),
    path("/template/<str:query>", TemplateView.as_view()),
    path("tags/", PipelineDetailView.as_view()),
]
