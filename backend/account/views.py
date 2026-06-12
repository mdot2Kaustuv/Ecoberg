from django.shortcuts import render
from account.models import Account, UserManager
from account.serializers import UserSerializer, RegisterSerializer, MyTokenObtainPairSerializer, ForgotPasswordSerializer, ResetPasswordSerializer
from rest_framework.decorators import api_view, permission_classes
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.response import Response
from rest_framework import generics, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.core.mail import send_mail
from django.conf import settings
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


class RegisterView(generics.CreateAPIView):
    queryset = Account.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

    def perform_create(self, serializer):
        user = serializer.save()
        send_mail(
            subject='Welcome to EcoBerg 🌿',
            message=f'''Hi {user.username},

Welcome to EcoBerg! We're excited to have you on board.

EcoBerg helps you understand your carbon footprint and take steps toward a more sustainable lifestyle.

Here's what you can do:
- Take the Carbon Footprint Quiz
- Get personalized recommendations
- Track your progress over time

Start your journey here: http://localhost:5173/quiz

If you have any questions, feel free to reach out.

The EcoBerg Team 🌍
''',
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email],
            fail_silently=True,
        )


class ForgotPasswordView(generics.GenericAPIView):
    permission_classes = [AllowAny]
    serializer_class = ForgotPasswordSerializer

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data['email']

        try:
            user = Account.objects.get(email=email)
            token = default_token_generator.make_token(user)
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            reset_link = f'http://localhost:5173/reset-password/{uid}/{token}/'

            send_mail(
                subject='Reset Your EcoBerg Password',
                message=f'''Hi {user.username},

We received a request to reset your EcoBerg password.

Click the link below to reset your password:
{reset_link}

This link will expire in 24 hours.

If you did not request a password reset, please ignore this email.

The EcoBerg Team 🌍
''',
                from_email=settings.EMAIL_HOST_USER,
                recipient_list=[user.email],
                fail_silently=False,
            )
        except Account.DoesNotExist:
            pass  

        return Response(
            {'message': 'If an account with that email exists, a password reset link has been sent.'},
            status=status.HTTP_200_OK
        )


class ResetPasswordView(generics.GenericAPIView):
    permission_classes = [AllowAny]
    serializer_class = ResetPasswordSerializer

    def post(self, request, uid, token):
        try:
            user_id = force_str(urlsafe_base64_decode(uid))
            user = Account.objects.get(pk=user_id)
        except (Account.DoesNotExist, ValueError, TypeError):
            return Response({'error': 'Invalid reset link.'}, status=status.HTTP_400_BAD_REQUEST)

        if not default_token_generator.check_token(user, token):
            return Response({'error': 'Reset link is invalid or has expired.'}, status=status.HTTP_400_BAD_REQUEST)

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user.set_password(serializer.validated_data['password'])
        user.save()

        return Response({'message': 'Password reset successful. You can now log in.'}, status=status.HTTP_200_OK)


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def dashboard(request):
    if request.method == 'GET':
        content = {
            'user': str(request.user),
            'auth': str(request.auth),
        }
        return Response(content, status=status.HTTP_200_OK)

    elif request.method == 'POST':
        content = {
            'message': 'This is a POST request',
            'user': str(request.user),
            'auth': str(request.auth),
        }
        return Response(content, status=status.HTTP_200_OK)

    else:
        return Response({'message': 'Method not allowed'}, status=status.HTTP_405_BAD_REQUEST) 