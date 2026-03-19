from django.db import models
from django.contrib.auth.models import User
from django.contrib.postgres.fields import JSONField

class FAQ(models.Model):
    question = models.CharField(max_length=500)
    answer = models.TextField()
    order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return self.question


class UserProfile(models.Model):
    """Extended user profile with subscription and payment info"""
    SUBSCRIPTION_CHOICES = [
        ('free', 'Free'),
        ('premium', 'Premium'),
    ]
    
    ROLE_CHOICES = [
        ('user', 'User'),
        ('admin', 'Admin'),
    ]
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='user')
    subscription = models.CharField(max_length=20, choices=SUBSCRIPTION_CHOICES, default='free')
    subscription_date = models.DateTimeField(null=True, blank=True)
    full_name = models.CharField(max_length=255, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.email} - {self.subscription}"


class Design(models.Model):
    """User design/customization"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='designs')
    design = models.JSONField()  # Stores design configuration
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Design by {self.user.email} - {self.created_at}"


class Payment(models.Model):
    """Payment/Subscription records"""
    PAYMENT_STATUS_CHOICES = [
        ('CREATED', 'Created'),
        ('APPROVED', 'Approved'),
        ('COMPLETED', 'Completed'),
        ('FAILED', 'Failed'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='payments')
    paypal_order_id = models.CharField(max_length=255, unique=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=3, default='USD')
    status = models.CharField(max_length=20, choices=PAYMENT_STATUS_CHOICES, default='CREATED')
    subscription_months = models.IntegerField(default=1)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Payment {self.paypal_order_id} - {self.status}"


class Order(models.Model):
    """Checkout/Purchase orders"""
    PAYMENT_STATUS_CHOICES = [
        ('CREATED', 'Created'),
        ('APPROVED', 'Approved'),
        ('COMPLETED', 'Completed'),
        ('FAILED', 'Failed'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='orders')
    paypal_order_id = models.CharField(max_length=255, unique=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=3, default='USD')
    status = models.CharField(max_length=20, choices=PAYMENT_STATUS_CHOICES, default='CREATED')
    
    # Shipping information
    shipping_method = models.CharField(max_length=255)
    model_name = models.CharField(max_length=255)
    design_name = models.CharField(max_length=255, blank=True, null=True)
    design_image = models.URLField(blank=True, null=True)
    
    email = models.EmailField()
    full_name = models.CharField(max_length=255)
    address = models.CharField(max_length=255)
    city = models.CharField(max_length=255)
    state = models.CharField(max_length=255)
    postal_code = models.CharField(max_length=20)
    country = models.CharField(max_length=255)
    
    tracking_number = models.CharField(max_length=255, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Order {self.paypal_order_id} - {self.status}"
