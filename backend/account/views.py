from django.conf import settings
from account.models import Account, UserManager
from account.serializers import UserSerializer, RegisterSerializer, MyTokenObtainPairSerializer, ForgotPasswordSerializer, ResetPasswordSerializer
from rest_framework.decorators import api_view, permission_classes
from rest_framework.views import APIView  # ✅ added
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.response import Response
from rest_framework import generics, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.core.mail import send_mail
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from .models import ContactMessage, UserRating, CompanyOTP
import random


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
            fail_silently=False,
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


class ContactMessageView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        subject = request.data.get('subject', '').strip()
        message = request.data.get('message', '').strip()

        if not subject or not message:
            return Response({'error': 'Subject and message are required.'}, status=400)

        ContactMessage.objects.create(
            user=request.user,
            subject=subject,
            message=message,
        )
        return Response({'success': 'Message sent successfully.'}, status=201)


class UserRatingView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        rating = request.data.get('rating')
        feedback = request.data.get('feedback', '').strip()

        if not rating or not (1 <= int(rating) <= 5):
            return Response({'error': 'Rating must be between 1 and 5.'}, status=400)

        UserRating.objects.create(
            user=request.user,
            rating=int(rating),
            feedback=feedback,
        )
        return Response({'success': 'Rating submitted successfully.'}, status=201)
    
class VerifyPasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        password = request.data.get('password', '')
        if not password:
            return Response({'error': 'Password is required.'}, status=status.HTTP_400_BAD_REQUEST)
        if request.user.check_password(password):
            return Response({'ok': True}, status=status.HTTP_200_OK)
        return Response({'ok': False}, status=status.HTTP_200_OK)


class SendCompanyOTPView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        code = f"{random.randint(0, 999999):06d}"
        CompanyOTP.objects.create(user=request.user, code=code)
        send_mail(
            subject='Your EcoBerg Company Verification Code',
            message=f'''Hi {request.user.username},

Your one-time verification code to register your company is:

{code}

This code expires in 10 minutes. If you didn't request this, you can ignore this email.

The EcoBerg Team 🌍
''',
            from_email=settings.EMAIL_HOST_USER,
            recipient_list=[request.user.email],
            fail_silently=False,
        )
        return Response({'message': 'OTP sent to your email.'}, status=status.HTTP_200_OK)


class VerifyCompanyOTPView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        code = request.data.get('code', '').strip()
        if not code:
            return Response({'error': 'Code is required.'}, status=status.HTTP_400_BAD_REQUEST)
        otp = CompanyOTP.objects.filter(
            user=request.user, code=code, is_used=False
        ).order_by('-created_at').first()
        if not otp:
            return Response({'ok': False, 'error': 'Invalid code.'}, status=status.HTTP_200_OK)
        if otp.is_expired():
            return Response({'ok': False, 'error': 'Code has expired. Please request a new one.'}, status=status.HTTP_200_OK)
        otp.is_used = True
        otp.save()
        return Response({'ok': True}, status=status.HTTP_200_OK)