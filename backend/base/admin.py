from django.contrib import admin
from .models import FAQ, UserProfile, Design, Payment, Order

@admin.register(FAQ)
class FAQAdmin(admin.ModelAdmin):
    list_display = ['question', 'order', 'created_at']
    list_editable = ['order']
    search_fields = ['question', 'answer']


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'role', 'subscription', 'subscription_date', 'created_at']
    list_filter = ['role', 'subscription', 'created_at']
    search_fields = ['user__email', 'full_name']


@admin.register(Design)
class DesignAdmin(admin.ModelAdmin):
    list_display = ['user', 'created_at']
    list_filter = ['created_at']
    search_fields = ['user__email']


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ['paypal_order_id', 'user', 'amount', 'status', 'created_at']
    list_filter = ['status', 'created_at', 'currency']
    search_fields = ['paypal_order_id', 'user__email']
    readonly_fields = ['created_at', 'updated_at']


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ['paypal_order_id', 'user', 'amount', 'status', 'model_name', 'created_at']
    list_filter = ['status', 'created_at', 'country']
    search_fields = ['paypal_order_id', 'user__email', 'model_name']
    readonly_fields = ['created_at', 'updated_at']
