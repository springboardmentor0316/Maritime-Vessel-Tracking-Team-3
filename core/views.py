from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView
from django.contrib.auth.hashers import make_password
from django.db.models import Q
from .models import User, Vessel, Port, VesselHistory, Voyage, Event, Notification
from .serializers import (
    UserSerializer, VesselSerializer, PortSerializer, 
    VesselHistorySerializer, VoyageSerializer, EventSerializer, 
    NotificationSerializer
)

# --- 1. User Registration (RBAC Handshake) ---
class RegisterView(APIView):
    permission_classes = [AllowAny] 

    def post(self, request):
        data = request.data
        try:
            if User.objects.filter(username=data['username']).exists():
                return Response({'error': 'Operational Identity (Username) already taken'}, status=status.HTTP_400_BAD_REQUEST)
            
            user_role = data.get('role', 'operator').lower() 
            
            user = User.objects.create(
                username=data['username'],
                email=data.get('email', ''),
                password=make_password(data['password']),
                role=user_role 
            )
            return Response({'message': f'Profile Initialized as {user_role.upper()}'}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

# --- 2. Password Reset Request ---
class PasswordResetRequestView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        user = User.objects.filter(email=email).first()
        if user:
            return Response({'message': 'Security reset link dispatched.'}, status=status.HTTP_200_OK)
        return Response({'error': 'Email not recognized in fleet database.'}, status=status.HTTP_404_NOT_FOUND)

# --- 3. Vessel Management (Search & Surveillance Logic) ---
class VesselViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = VesselSerializer

    def get_queryset(self):
        user = self.request.user
        search_query = self.request.query_params.get('search', None)
        
        # Admin Role: Global Surveillance / Operator Role: Active Surveillance
        if hasattr(user, 'role') and user.role.lower() == 'admin':
            queryset = Vessel.objects.all()
        else:
            queryset = Vessel.objects.filter(status='Active')

        # Intelligence Filter: Name or MMSI Identifier
        if search_query:
            queryset = queryset.filter(
                Q(name__icontains=search_query) | Q(mmsi__icontains=search_query)
            )
        return queryset

# --- 4. Voyage & Analytics Logic ---
class VoyageViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = Voyage.objects.all().order_by('-id')
    serializer_class = VoyageSerializer

# --- 5. Risk & Safety Intelligence ---
class EventViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = Event.objects.all().order_by('-timestamp')
    serializer_class = EventSerializer

# --- 6. Identity & Infrastructure Components ---

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Prevent non-admins from browsing the full user list
        if self.request.user.role.lower() == 'admin':
            return User.objects.all()
        return User.objects.filter(id=self.request.user.id)

class PortViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = Port.objects.all()
    serializer_class = PortSerializer

class VesselHistoryViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = VesselHistory.objects.all().order_by('-timestamp')
    serializer_class = VesselHistorySerializer

class NotificationViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = Notification.objects.all().order_by('-created_at')
    serializer_class = NotificationSerializer