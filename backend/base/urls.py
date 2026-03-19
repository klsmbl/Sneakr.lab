from django.urls import path
from . import views

urlpatterns = [
    path('', views.getRoutes, name='routes'),
    path('faqs/', views.getFAQs, name='faqs'),
    path('tryon/', views.virtualTryOn, name='virtual-try-on'),
    
    # Authentication
    path('auth/signup/', views.sign_up, name='sign-up'),
    path('auth/signin/', views.sign_in, name='sign-in'),
    path('auth/profile/', views.user_profile, name='user-profile'),
    
    # Designs
    path('designs/', views.design_list, name='design-list'),
    path('designs/<int:design_id>/', views.design_detail, name='design-detail'),
    
    # Subscriptions
    path('subscription/', views.subscription_status, name='subscription-status'),
    path('subscription/create-order/', views.create_subscription_order, name='create-subscription-order'),
    path('subscription/capture-order/', views.capture_subscription_order, name='capture-subscription-order'),
    
    # Payments
    path('payments/history/', views.payment_history, name='payment-history'),
    
    # Orders/Checkout
    path('checkout/create-order/', views.create_checkout_order, name='create-checkout-order'),
    path('checkout/capture-order/', views.capture_checkout_order, name='capture-checkout-order'),
    path('checkout/orders/', views.order_history, name='order-history'),
]
