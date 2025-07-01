from django.urls import path
from .views import (
    TokenListView,
    TokenCreateView,
    TokenDetailView,
    SharedDatasetView,
    DatasetDownloadView,
    DatasetListView
)

app_name = 'shared_datasets'

urlpatterns = [
    # Token management
    path('tokens/', TokenListView.as_view(), name='token_list'),  # GET=list tokens
    path('tokens/create/', TokenCreateView.as_view(), name='token_create'),  # POST=create token
    path('tokens/<str:token_id>/', TokenDetailView.as_view(), name='token_detail'),  # GET=details, DELETE=revoke
    
    # Dataset management
    path('list/', DatasetListView.as_view(), name='dataset_list'),  # GET=list datasets
    path('<str:file_name>/download/', DatasetDownloadView.as_view(), name='dataset_download'),    
    # Legacy/shared endpoint
    path('', SharedDatasetView.as_view(), name='shared_datasets'),
]
