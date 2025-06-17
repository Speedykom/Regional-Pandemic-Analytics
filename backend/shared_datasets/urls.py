from django.urls import path
from .views import (
    TokenManagementView,
    TokenRevokeView,
    SharedDatasetView,
    DatasetDownloadView,
    ParquetListView
)

app_name = 'shared_datasets'

urlpatterns = [
    path('tokens/', TokenManagementView.as_view(), name='token_management'),
    path('tokens/<str:token_id>/', TokenRevokeView.as_view(), name='token_revoke'),
    path('parquets/', ParquetListView.as_view(), name='parquet_list'),
    path('download/<str:file_name>/', DatasetDownloadView.as_view(), name='dataset_download'),
    path('', SharedDatasetView.as_view(), name='shared_datasets'),

]
