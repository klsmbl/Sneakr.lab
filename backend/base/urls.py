from django.urls import path
from . import views

urlpatterns = [
    path('', views.getRoutes, name='routes'),
    path('faqs/', views.getFAQs, name='faqs'),
    path('tryon/', views.virtualTryOn, name='virtual-try-on'),
    path('auth/signin', views.signIn, name='signin'),
    path('auth/signup', views.signUp, name='signup'),
    path('subscription', views.getSubscription, name='subscription'),
]
