from rest_framework import viewsets, status, generics
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView
from django.contrib.auth.hashers import make_password
from .models import User, Vessel, Port, VesselHistory, Voyage, Event, Notification
from .serializers import (
    UserSerializer, VesselSerializer, PortSerializer, 
    VesselHistorySerializer, VoyageSerializer, EventSerializer, 
    NotificationSerializer
)

# --- 1. User Registration (Handles PostgreSQL Roles) ---
class RegisterView(APIView):
    permission_classes = [AllowAny] 

    def post(self, request):
        data = request.data
        try:
            if User.objects.filter(username=data['username']).exists():
                return Response({'error': 'Username already taken'}, status=status.HTTP_400_BAD_REQUEST)
            
            user_role = data.get('role', 'operator') 
            
            user = User.objects.create(
                username=data['username'],
                email=data.get('email', ''),
                password=make_password(data['password']),
                role=user_role 
            )
            return Response({'message': f'User created successfully as {user_role}'}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

# --- 2. Password Reset Request ---
class PasswordResetRequestView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        user = User.objects.filter(email=email).first()
        if user:
            return Response({'message': 'Password reset link sent to your email.'}, status=status.HTTP_200_OK)
        return Response({'error': 'Email not found'}, status=status.HTTP_404_NOT_FOUND)


# --- 3. User Management ViewSet (FIX: Added this missing class) ---
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]


# --- 4. Role-Based Data Access (RBAC Filtering) ---
class VesselViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = VesselSerializer
    # FIX: Added queryset back so the router can determine the basename
    queryset = Vessel.objects.all() 

    def get_queryset(self):
        user = self.request.user
        if hasattr(user, 'role') and user.role.lower() == 'admin':
            return Vessel.objects.all()
        return Vessel.objects.filter(status='Active')


# --- 5. Standard ViewSets (Milestones 2-4) ---

class PortViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = Port.objects.all()
    serializer_class = PortSerializer

class VesselHistoryViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = VesselHistory.objects.all()
    serializer_class = VesselHistorySerializer

class VoyageViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = Voyage.objects.all()
    serializer_class = VoyageSerializer

class EventViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = Event.objects.all()
    serializer_class = EventSerializer

class NotificationViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer