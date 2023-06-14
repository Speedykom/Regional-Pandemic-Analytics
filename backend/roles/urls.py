from django.urls import path

from . import views

app_name = 'role'

urlpatterns = [
    path('/', views.CreateViewRoles.as_view()),  # create role
    path('/<str:id>', views.GetEditRole.as_view()),  # get role
]
