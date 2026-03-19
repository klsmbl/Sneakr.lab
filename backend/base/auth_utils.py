from rest_framework.authtoken.models import Token
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import User
from datetime import timedelta
from django.utils import timezone


def get_tokens_for_user(user):
    """Generate JWT tokens for user"""
    refresh = RefreshToken.for_user(user)
    
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
        'user': {
            'id': user.id,
            'email': user.email,
            'role': user.profile.role if hasattr(user, 'profile') else 'user',
            'subscription': user.profile.subscription if hasattr(user, 'profile') else 'free',
            'full_name': user.profile.full_name if hasattr(user, 'profile') else '',
        }
    }


def get_user_from_request(request):
    """Extract user from request"""
    if hasattr(request, 'user'):
        return request.user
    return None
