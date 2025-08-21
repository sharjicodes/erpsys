from django.urls import path
from .views import (
    LoginView, RegisterView, UserListView,
    UserUpdateView, UserDeleteView, ProfileView
)

urlpatterns = [
    path('login/', LoginView.as_view(), name='login'),
    path('profile/', ProfileView.as_view(), name='profile'),
    path('users/', UserListView.as_view(), name='user-list'),
    path('users/create/', RegisterView.as_view(), name='user-create'),
    path('users/<int:pk>/', UserUpdateView.as_view(), name='user-update'),
    path('users/<int:pk>/delete/', UserDeleteView.as_view(), name='user-delete'),
]
