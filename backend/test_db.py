#!/usr/bin/env python
import os
import django
import sys

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
sys.path.insert(0, os.path.dirname(__file__))
django.setup()

from django.contrib.auth.models import User
from base.models import UserProfile, Payment, Order

print("=== Database Debug Test ===\n")

# Test 1: User Creation
print("1. Testing User Creation...")
try:
    user, created = User.objects.get_or_create(
        email='test@example.com',
        defaults={'username': 'test@example.com'}
    )
    print(f"   ✓ User exists: {user.email} (created={created})")
except Exception as e:
    print(f"   ✗ Error: {e}")

# Test 2: UserProfile Creation
print("\n2. Testing UserProfile Creation...")
try:
    profile, created = UserProfile.objects.get_or_create(user=user)
    print(f"   ✓ Profile exists: {profile.user.email} (created={created})")
    print(f"   ✓ Subscription: {profile.subscription}")
except Exception as e:
    print(f"   ✗ Error: {e}")

# Test 3: Query with select_related
print("\n3. Testing select_related Query...")
try:
    user_with_profile = User.objects.select_related('profile').get(email='test@example.com')
    print(f"   ✓ User: {user_with_profile.email}")
    print(f"   ✓ Profile: {user_with_profile.profile.subscription}")
except Exception as e:
    print(f"   ✗ Error: {e}")

# Test 4: Payment Creation
print("\n4. Testing Payment Creation...")
try:
    payment, created = Payment.objects.get_or_create(
        paypal_order_id='TEST123',
        defaults={
            'user': user,
            'amount': '9.99',
            'status': 'CREATED',
            'subscription_months': 1
        }
    )
    print(f"   ✓ Payment exists: {payment.paypal_order_id} (created={created})")
    print(f"   ✓ Status: {payment.status}")
except Exception as e:
    print(f"   ✗ Error: {e}")

# Test 5: Order Creation
print("\n5. Testing Order Creation...")
try:
    order, created = Order.objects.get_or_create(
        paypal_order_id='ORDER123',
        defaults={
            'user': user,
            'amount': '150.00',
            'status': 'CREATED',
            'shipping_method': 'standard',
            'model_name': 'Air Jordan',
            'email': user.email,
            'full_name': 'Test User',
            'address': '123 Main St',
            'city': 'NYC',
            'state': 'NY',
            'postal_code': '10001',
            'country': 'USA'
        }
    )
    print(f"   ✓ Order exists: {order.paypal_order_id} (created={created})")
    print(f"   ✓ Status: {order.status}")
except Exception as e:
    print(f"   ✗ Error: {e}")

# Test 6: Count Records
print("\n6. Record Counts...")
try:
    user_count = User.objects.count()
    profile_count = UserProfile.objects.count()
    payment_count = Payment.objects.count()
    order_count = Order.objects.count()
    
    print(f"   ✓ Users: {user_count}")
    print(f"   ✓ Profiles: {profile_count}")
    print(f"   ✓ Payments: {payment_count}")
    print(f"   ✓ Orders: {order_count}")
except Exception as e:
    print(f"   ✗ Error: {e}")

print("\n=== Test Complete ===")
