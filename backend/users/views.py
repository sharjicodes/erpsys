from rest_framework import generics, permissions
from rest_framework_simplejwt.views import TokenObtainPairView
from .models import User
from .serializers import UserSerializer, RegisterSerializer, MyTokenObtainPairSerializer

# ------------------------
# JWT Login
# ------------------------
class LoginView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


# ------------------------
# Register new user (Admin only)
# ------------------------
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        if self.request.user.role != "ADMIN":
            raise permissions.PermissionDenied("Only Admins can create users.")
        serializer.save()


# ------------------------
# List users (Admin & Manager)
# ------------------------
class UserListView(generics.ListAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'ADMIN':
            return User.objects.all()
        elif user.role == 'MANAGER':
            return User.objects.filter(role='EMPLOYEE')
        return User.objects.none()


# ------------------------
# Update user (Admin only)
# ------------------------
class UserUpdateView(generics.RetrieveUpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_update(self, serializer):
        if self.request.user.role != "ADMIN":
            raise permissions.PermissionDenied("Only Admins can update users.")
        serializer.save()


# ------------------------
# Delete user (Admin only)
# ------------------------
class UserDeleteView(generics.DestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_destroy(self, instance):
        if self.request.user.role != "ADMIN":
            raise permissions.PermissionDenied("Only Admins can delete users.")
        instance.delete()


# ------------------------
# View own profile
# ------------------------
class ProfileView(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user
