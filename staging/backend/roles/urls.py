from django.urls import path

from roles import views

urlpatterns = [
    path('role', views.CreateViewRoles.as_view()),  # create role
    path('role/<str:id>', views.GetEditRole.as_view()),  # get role
]
