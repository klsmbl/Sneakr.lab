from rest_framework import serializers
from django.contrib.auth.models import User
from .models import UserProfile, Design, Payment, Order, FAQ


class FAQSerializer(serializers.ModelSerializer):
    class Meta:
        model = FAQ
        fields = ['id', 'question', 'answer', 'order', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']


class UserProfileSerializer(serializers.ModelSerializer):
    email = serializers.SerializerMethodField()
    
    class Meta:
        model = UserProfile
        fields = ['id', 'email', 'role', 'subscription', 'subscription_date', 'full_name', 'created_at']
    
    def get_email(self, obj):
        return obj.user.email


class UserSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer(source='profile', read_only=True)
    
    class Meta:
        model = User
        fields = ['id', 'email', 'username', 'first_name', 'last_name', 'profile']


class SignUpSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, min_length=8)
    full_name = serializers.CharField(required=False, allow_blank=True)
    role = serializers.ChoiceField(choices=['user', 'admin'], default='user')

    def validate_email(self, value):
        """Ensure email is unique"""
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("User with this email already exists.")
        return value

    def create(self, validated_data):
        email = validated_data['email']
        password = validated_data['password']
        full_name = validated_data.get('full_name', '')
        role = validated_data.get('role', 'user')

        # Create Django User
        user = User.objects.create_user(
            username=email,
            email=email,
            password=password
        )

        # Create UserProfile
        profile = UserProfile.objects.create(
            user=user,
            role=role,
            full_name=full_name
        )

        return user


class SignInSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)


class DesignSerializer(serializers.ModelSerializer):
    class Meta:
        model = Design
        fields = ['id', 'design', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']


class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = ['id', 'paypal_order_id', 'amount', 'currency', 'status', 'subscription_months', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']


class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = [
            'id', 'paypal_order_id', 'amount', 'currency', 'status',
            'shipping_method', 'model_name', 'design_name', 'design_image',
            'email', 'full_name', 'address', 'city', 'state', 'postal_code', 'country',
            'tracking_number', 'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']


class SubscriptionStatusSerializer(serializers.Serializer):
    tier = serializers.CharField()
    subscription_date = serializers.DateTimeField()
    can_upgrade = serializers.BooleanField()
