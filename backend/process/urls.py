from django.urls import path
from .views import ProcessView, ProcessRunView

urlpatterns = [
    path("", ProcessView.as_view({"get": "list", "post": "create"})),
    path(
        "/<str:dag_id>",
        ProcessView.as_view({"get": "retrieve", "put": "update"}),
    ),
    path(
        "/<str:dag_id>/dagRuns",
        ProcessRunView.as_view({"get": "list", "post": "create"}),
    ),
]
