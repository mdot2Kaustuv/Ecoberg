from django.shortcuts import render
from account.models import Account , UserManager
from account.serializers import UserSerializer , MyTokenObtainPairSerializer
from rest_framework.decorators import api_view , permission_classes
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.response import Response
from rest_framework import generics , status
from rest_framework.permissions import AllowAny , IsAuthenticated
class MyTokenObtainPairView( TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

class RegisterView(generics.CreateAPIView):
    queryset = Account.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def dashboard(request) :
    if request.method == 'GET' :
        content = {
            'user': str(request.user),
            'auth': str(request.auth),
        }
        return Response(content, status=status.HTTP_200_OK)
    
    elif request.method == 'POST' :
        content = {
            'message': 'This is a POST request',
            'user': str(request.user),
            'auth': str(request.auth),
        }
        return Response(content, status=status.HTTP_200_OK)
    
    else :
        return Response({'message': 'Method not allowed'}, status=status.HTTP_405_BAD_REQUEST)