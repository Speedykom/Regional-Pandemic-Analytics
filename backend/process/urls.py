from django.urls import path, re_path
from .views import ProcessView, ProcessRunView

urlpatterns = [
    re_path(r"(?P<query>.+)/$", ProcessView.as_view({"get": "list"})),

    path("", ProcessView.as_view({"get": "list", "post": "create"})),

    path(
        "datasource/<str:datasource_id>/",
        ProcessView.as_view({"get": "get_datasource_info"}),
    ),
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
    path(
        "/<str:dag_id>/dataset",
        ProcessView.as_view({"get": "get_dataset_info"})
    )
]
