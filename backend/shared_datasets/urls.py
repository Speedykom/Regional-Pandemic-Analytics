from django.urls import path
from .views import (
    TokenManagementView,
    TokenRevokeView,
    SharedDatasetView,
    DatasetDownloadView,
)

app_name = 'shared_datasets'

urlpatterns = [
    path('tokens/', TokenManagementView.as_view(), name='token_management'),
    path('tokens/<str:token_id>/', TokenRevokeView.as_view(), name='token_revoke'),
    path('', SharedDatasetView.as_view(), name='shared_datasets'),
    path('<str:dataset_id>/', DatasetDownloadView.as_view(), name='dataset_download'),
]
