from rest_framework import generics, permissions
from rest_framework_simplejwt.views import TokenObtainPairView
from .models import User
from .serializers import UserSerializer

# ------------------------
# Custom Permissions
# ------------------------
class IsAdminCustom(permissions.BasePermission):
    """Allow access only to users with role 'ADMIN'"""
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'ADMIN'

class IsAdminOrManager(permissions.BasePermission):
    """Allow access to Admin or Manager"""
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role in ['ADMIN', 'MANAGER']

# ------------------------
# JWT Login
# ------------------------
class LoginView(TokenObtainPairView):
    """Login to get JWT access and refresh tokens"""
    pass

# ------------------------
# Register new user (Admin only)
# ------------------------
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdminCustom]

# ------------------------
# List users (Admin & Manager)
# ------------------------
class UserListView(generics.ListAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAdminOrManager]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'ADMIN':
            return User.objects.all()
        elif user.role == 'MANAGER':
            return User.objects.filter(role='EMPLOYEE')
        return User.objects.none()

# ------------------------
# View own profile
# ------------------------
class ProfileView(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

# ------------------------
# Update user (Admin only)
# ------------------------
class UserUpdateView(generics.RetrieveUpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdminCustom]

# ------------------------
# Delete user (Admin only)
# ------------------------
class UserDeleteView(generics.DestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdminCustom]
