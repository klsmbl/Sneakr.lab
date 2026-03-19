from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

# Create a router and register ViewSets
router = DefaultRouter()
router.register(r'faqs', views.FAQViewSet, basename='faq')
router.register(r'designs', views.DesignViewSet, basename='design')
router.register(r'payments', views.PaymentViewSet, basename='payment')
router.register(r'orders', views.OrderViewSet, basename='order')

urlpatterns = [
    # Custom Routes
    path('', views.getRoutes, name='routes'),
    
    # Authentication
    path('auth/signup/', views.sign_up, name='sign-up'),
    path('auth/signin/', views.sign_in, name='sign-in'),
    path('auth/profile/', views.user_profile, name='user-profile'),
    
    # Virtual Try-On
    path('virtual-tryon/', views.virtualTryOn, name='virtual-try-on'),
    path('tryon/', views.virtualTryOn, name='virtual-try-on-legacy'),
    
    # Subscriptions
    path('subscriptions/status/', views.subscription_status, name='subscription-status'),
    path('subscriptions/create-order/', views.create_subscription_order, name='create-subscription-order'),
    path('subscriptions/capture-order/', views.capture_subscription_order, name='capture-subscription-order'),

    # Backward-compatible subscription routes (used by existing frontend)
    path('subscription/', views.subscription_status, name='subscription-status-legacy'),
    path('subscription/create-order/', views.create_subscription_order, name='create-subscription-order-legacy'),
    path('subscription/capture-order/', views.capture_subscription_order, name='capture-subscription-order-legacy'),

    # Backward-compatible payment history route
    path('payments/history/', views.PaymentViewSet.as_view({'get': 'list'}), name='payment-history-legacy'),
    
    # Checkout/Orders
    path('checkout/create-order/', views.create_checkout_order, name='create-checkout-order'),
    path('checkout/capture-order/', views.capture_checkout_order, name='capture-checkout-order'),

    # Backward-compatible order history route
    path('checkout/orders/', views.OrderViewSet.as_view({'get': 'list'}), name='order-history-legacy'),

    # Router URLs (auto-registered ViewSets)
    path('', include(router.urls)),
]
