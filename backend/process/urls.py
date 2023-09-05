from django.urls import path
from .views import ProcessView, ProcessRunView

urlpatterns = [
    path("", ProcessView.as_view({"get": "list", "post": "create"})),
    path(
        "/<str:dag_id>",
        ProcessView.as_view(
            {"get": "retrieve", "post": "update", "put": "partial_update"}
        ),
    ),
    path(
        "/<str:dag_id>/dagRuns",
        ProcessRunView.as_view({"get": "list", "post": "create"}),
    ),
    path(
        "/<str:dag_id>/dagRuns/<str:dag_run_id>/taskInstances",
        ProcessRunView.as_view({"get": "retrieve"}),
    ),
]
