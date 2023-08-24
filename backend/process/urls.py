from django.urls import path
from .views import ProcessListView, ProcessDetailView

urlpatterns = [
    path("", ProcessListView.as_view()),
    path("list", ProcessListView.as_view()),
    path("run/<str:id>", ProcessDetailView.as_view()),
    path("delete/<str:dag_id>", ProcessDetailView.as_view()),
    path("one/<str:dag_id>", ProcessDetailView.as_view()),
]
