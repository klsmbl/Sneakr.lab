import json
import base64
import os
import requests
import logging
from pathlib import Path
from datetime import timedelta

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.utils import timezone
from django.contrib.auth.models import User
from django.db.models import Q

from rest_framework import viewsets, status, filters, pagination
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny

from . import serializers
from .models import FAQ, UserProfile, Design, Payment, Order
from .auth_utils import get_tokens_for_user
from .paypal_utils import (
    create_subscription_order_payload,
    create_checkout_order_payload,
    get_paypal_access_token,
)

try:
    from google.auth import default
    from google.oauth2 import service_account
    from google.cloud import aiplatform
    GOOGLE_CLOUD_AVAILABLE = True
except ImportError:
    GOOGLE_CLOUD_AVAILABLE = False

logger = logging.getLogger(__name__)


# ==================== Pagination ====================

class StandardResultsSetPagination(pagination.PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100


# ==================== Custom API Views ====================

@api_view(['GET'])
@permission_classes([AllowAny])
def getRoutes(request):
    """Welcome endpoint - list available routes"""
    routes = {
        'message': 'Welcome to Sneakr API',
        'version': '1.0.0',
        'endpoints': {
            'auth': {
                'signup': 'POST /api/auth/signup/',
                'signin': 'POST /api/auth/signin/',
                'profile': 'GET /api/auth/profile/',
            },
            'faqs': {
                'list': 'GET /api/faqs/',
                'search': 'GET /api/faqs/?search=keyword',
            },
            'designs': {
                'list': 'GET /api/designs/',
                'create': 'POST /api/designs/',
                'detail': 'GET /api/designs/<id>/',
                'update': 'PUT /api/designs/<id>/',
                'delete': 'DELETE /api/designs/<id>/',
            },
            'subscriptions': {
                'status': 'GET /api/subscriptions/status/',
                'create_order': 'POST /api/subscriptions/create-order/',
                'capture_order': 'POST /api/subscriptions/capture-order/',
            },
            'payments': {
                'list': 'GET /api/payments/',
                'history': 'GET /api/payments/history/',
            },
            'orders': {
                'list': 'GET /api/orders/',
                'create': 'POST /api/checkout/create-order/',
                'capture': 'POST /api/checkout/capture-order/',
            },
            'virtual_tryon': {
                'predict': 'POST /api/virtual-tryon/',
            }
        }
    }
    return Response(routes)


@csrf_exempt
@require_http_methods(["POST", "OPTIONS"])
def virtualTryOn(request):
    """Virtual Try-On endpoint using Google Vertex AI"""
    if not GOOGLE_CLOUD_AVAILABLE:
        return JsonResponse({
            'error': 'Google Cloud libraries not installed. Run: pip install google-cloud-aiplatform google-auth'
        }, status=500)
    
    try:
        if request.method == "OPTIONS":
            return JsonResponse({"ok": True}, status=200)

        # Parse request body
        data = json.loads(request.body)
        person_image_b64 = data.get('person_image')
        shoe_image_b64 = data.get('shoe_image')
        
        if not person_image_b64 or not shoe_image_b64:
            return JsonResponse({
                'error': 'Both person_image and shoe_image are required'
            }, status=400)
        
        # Initialize Vertex AI credentials
        BASE_DIR = Path(__file__).resolve().parent.parent.parent
        vertex_api_key = os.getenv('VERTEX_API_KEY', '').strip() or os.getenv('GOOGLE_API_KEY', '').strip()
        env_project_id = os.getenv('VERTEX_PROJECT_ID', '').strip()

        auth_mode = 'service-account'
        access_token = None
        project_id = env_project_id

        if vertex_api_key:
            auth_mode = 'api-key'
            if not project_id:
                return JsonResponse({
                    'error': 'VERTEX_PROJECT_ID is required when using VERTEX_API_KEY/GOOGLE_API_KEY'
                }, status=500)
        else:
            env_credentials_path = os.getenv('GOOGLE_APPLICATION_CREDENTIALS', '').strip()
            default_credentials_path = os.path.join(BASE_DIR, 'service-account.json')
            service_account_path = env_credentials_path or default_credentials_path

            if not os.path.exists(service_account_path):
                return JsonResponse({
                    'error': (
                        'Vertex credentials not found. Provide VERTEX_API_KEY + VERTEX_PROJECT_ID '
                        'or set GOOGLE_APPLICATION_CREDENTIALS/place service-account.json in the project root.'
                    )
                }, status=500)

            credentials = service_account.Credentials.from_service_account_file(
                service_account_path,
                scopes=['https://www.googleapis.com/auth/cloud-platform']
            )

            with open(service_account_path, 'r') as f:
                service_account_info = json.load(f)
                project_id = project_id or service_account_info.get('project_id')

            if not project_id:
                return JsonResponse({
                    'error': 'Project ID not found. Set VERTEX_PROJECT_ID or include it in service-account.json'
                }, status=500)

            from google.auth.transport.requests import Request
            credentials.refresh(Request())
            access_token = credentials.token
        
        # Clean base64 data
        person_image_b64_clean = person_image_b64.split(',')[-1] if ',' in person_image_b64 else person_image_b64
        shoe_image_b64_clean = shoe_image_b64.split(',')[-1] if ',' in shoe_image_b64 else shoe_image_b64
        
        base_url = f"https://us-central1-aiplatform.googleapis.com/v1/projects/{project_id}/locations/us-central1/publishers/google/models/virtual-try-on-001:predict"
        url = f"{base_url}?key={vertex_api_key}" if auth_mode == 'api-key' else base_url

        headers = {
            "Content-Type": "application/json"
        }
        if auth_mode == 'service-account':
            headers["Authorization"] = f"Bearer {access_token}"
        
        payload = {
            "instances": [
                {
                    "personImage": {
                        "image": {
                            "bytesBase64Encoded": person_image_b64_clean
                        }
                    },
                    "productImages": [
                        {
                            "image": {
                                "bytesBase64Encoded": shoe_image_b64_clean
                            }
                        }
                    ]
                }
            ]
        }
        
        try:
            response = requests.post(url, headers=headers, json=payload, timeout=60)
            
            if response.status_code == 200:
                result = response.json()
                
                if "predictions" in result and result["predictions"]:
                    prediction = result["predictions"][0]
                    
                    if "bytesBase64Encoded" in prediction:
                        result_image_b64 = prediction["bytesBase64Encoded"]
                        mime_type = prediction.get("mimeType", "image/png")
                        
                        return JsonResponse({
                            'success': True,
                            'result_image': f"data:{mime_type};base64,{result_image_b64}",
                            'api_used': 'vertex-ai-virtual-try-on'
                        })
                    else:
                        return JsonResponse({
                            'error': 'Expected bytesBase64Encoded in prediction',
                            'debug_info': str(prediction)
                        }, status=500)
                else:
                    return JsonResponse({
                        'error': 'No predictions found in response',
                        'debug_info': str(result)
                    }, status=500)
            else:
                return JsonResponse({
                    'error': f'Vertex AI Virtual Try-On API Error: {response.text}',
                    'status_code': response.status_code,
                }, status=response.status_code)
                
        except requests.exceptions.RequestException as e:
            return JsonResponse({
                'error': f'Network error: {str(e)}'
            }, status=500)
            
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON'}, status=400)
    except Exception as e:
        logger.error(f"Virtual Try-On failed: {str(e)}")
        return JsonResponse({
            'error': f'Virtual Try-On failed: {str(e)}'
        }, status=500)


# ==================== Authentication Views ====================

@api_view(['POST'])
@permission_classes([AllowAny])
def sign_up(request):
    """User signup endpoint"""
    serializer_obj = serializers.SignUpSerializer(data=request.data)
    if serializer_obj.is_valid():
        user = serializer_obj.save()
        tokens = get_tokens_for_user(user)
        return Response(tokens, status=status.HTTP_201_CREATED)
    return Response(serializer_obj.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def sign_in(request):
    """User signin endpoint"""
    serializer_obj = serializers.SignInSerializer(data=request.data)
    if serializer_obj.is_valid():
        email = serializer_obj.validated_data['email']
        password = serializer_obj.validated_data['password']
        
        try:
            # Fetch user by email with profile
            user = User.objects.select_related('profile').get(email=email)
            
            # Verify password
            if not user.check_password(password):
                logger.warning(f"Invalid password for user {email}")
                return Response({'error': 'Invalid email or password'}, status=status.HTTP_401_UNAUTHORIZED)
            
            # Ensure profile exists
            if not hasattr(user, 'profile'):
                logger.error(f"User {email} has no profile, creating one")
                UserProfile.objects.get_or_create(user=user)
                user.refresh_from_db()
            
            # Generate tokens
            tokens = get_tokens_for_user(user)
            logger.info(f"User {email} signed in successfully")
            return Response(tokens, status=status.HTTP_200_OK)
            
        except User.DoesNotExist:
            logger.warning(f"Sign in attempt with non-existent email: {email}")
            return Response({'error': 'Invalid email or password'}, status=status.HTTP_401_UNAUTHORIZED)
        except Exception as e:
            logger.error(f"Sign in error for {email}: {str(e)}")
            return Response({'error': 'An error occurred during sign in'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    return Response(serializer_obj.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_profile(request):
    """Get current user profile"""
    serializer_obj = serializers.UserSerializer(request.user)
    return Response(serializer_obj.data)


# ==================== ViewSets - DRF Best Practices ====================

class FAQViewSet(viewsets.ReadOnlyModelViewSet):
    """FAQ ViewSet - Read-only"""
    queryset = FAQ.objects.all()
    serializer_class = serializers.FAQSerializer
    permission_classes = [AllowAny]
    pagination_class = StandardResultsSetPagination
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['question', 'answer']
    ordering_fields = ['order', 'created_at']
    ordering = ['order']


class DesignViewSet(viewsets.ModelViewSet):
    """Design ViewSet - Full CRUD"""
    serializer_class = serializers.DesignSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = StandardResultsSetPagination
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['created_at']
    ordering = ['-created_at']
    
    def get_queryset(self):
        """Users see only their designs, admins see all"""
        if self.request.user.profile.role == 'admin':
            return Design.objects.all()
        return Design.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        """Attach current user to design"""
        serializer.save(user=self.request.user)


class PaymentViewSet(viewsets.ReadOnlyModelViewSet):
    """Payment ViewSet - Read-only"""
    serializer_class = serializers.PaymentSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = StandardResultsSetPagination
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['created_at', 'status']
    ordering = ['-created_at']
    
    def get_queryset(self):
        """Users see only their payments"""
        if self.request.user.profile.role == 'admin':
            return Payment.objects.all()
        return Payment.objects.filter(user=self.request.user)


class OrderViewSet(viewsets.ReadOnlyModelViewSet):
    """Order ViewSet - Read-only"""
    serializer_class = serializers.OrderSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = StandardResultsSetPagination
    filter_backends = [filters.OrderingFilter, filters.SearchFilter]
    search_fields = ['paypal_order_id', 'full_name']
    ordering_fields = ['created_at', 'status']
    ordering = ['-created_at']
    
    def get_queryset(self):
        """Users see only their orders"""
        if self.request.user.profile.role == 'admin':
            return Order.objects.all()
        return Order.objects.filter(user=self.request.user)


# ==================== PayPal Payment Endpoints ====================

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def subscription_status(request):
    """Get current subscription status"""
    try:
        # Ensure profile exists
        profile, created = UserProfile.objects.get_or_create(user=request.user)
        if created:
            logger.info(f"Created profile for user {request.user.email}")
        
        serializer_obj = serializers.SubscriptionStatusSerializer({
            'tier': profile.subscription,
            'subscription_date': profile.subscription_date,
            'can_upgrade': profile.subscription == 'free'
        })
        return Response(serializer_obj.data)
    except Exception as e:
        logger.error(f"Error getting subscription status: {str(e)}")
        return Response({'error': 'Failed to get subscription status'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_subscription_order(request):
    """Create PayPal subscription order"""
    plan = request.data.get('plan')
    if plan not in ['monthly', 'yearly']:
        return Response({'error': 'Invalid plan'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        PAYPAL_API_BASE = os.getenv('PAYPAL_API_BASE', 'https://api-m.sandbox.paypal.com').rstrip('/')
        access_token = get_paypal_access_token()
        frontend_url = os.getenv('FRONTEND_URL', 'http://localhost:3000')
        
        # Create order
        payload = create_subscription_order_payload(plan, frontend_url)
        headers = {
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {access_token}'
        }
        
        order_response = requests.post(
            f"{PAYPAL_API_BASE}/v2/checkout/orders",
            json=payload,
            headers=headers,
            timeout=20,
        )

        try:
            order_data = order_response.json()
        except ValueError:
            logger.error('PayPal create subscription order returned non-JSON. Status=%s', order_response.status_code)
            return Response({'error': 'Invalid PayPal response while creating order'}, status=status.HTTP_502_BAD_GATEWAY)

        if order_response.status_code != 201:
            message = order_data.get('message') or order_data.get('name') or 'Failed to create PayPal order'
            return Response({'error': message}, status=status.HTTP_400_BAD_REQUEST)

        order_id = order_data['id']
        
        # Store in database
        amount = '9.99' if plan == 'monthly' else '99.99'
        Payment.objects.create(
            user=request.user,
            paypal_order_id=order_id,
            amount=amount,
            status='CREATED',
            subscription_months=1 if plan == 'monthly' else 12
        )
        
        return Response({
            'id': order_id,
            'status': order_data['status']
        })
    except Exception as e:
        logger.error(f"Error creating subscription order: {str(e)}")
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def capture_subscription_order(request):
    """Capture PayPal subscription order"""
    order_id = request.data.get('orderId')
    if not order_id:
        return Response({'error': 'Order ID required'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        PAYPAL_API_BASE = os.getenv('PAYPAL_API_BASE', 'https://api-m.sandbox.paypal.com').rstrip('/')
        access_token = get_paypal_access_token()
        
        # Capture order
        headers = {
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {access_token}'
        }
        
        logger.info(f"Capturing PayPal order {order_id}")
        capture_response = requests.post(
            f"{PAYPAL_API_BASE}/v2/checkout/orders/{order_id}/capture",
            headers=headers,
            timeout=20,
        )

        try:
            capture_data = capture_response.json()
        except ValueError:
            logger.error('PayPal capture subscription returned non-JSON. Status=%s', capture_response.status_code)
            return Response({'error': 'Invalid PayPal response while capturing payment'}, status=status.HTTP_502_BAD_GATEWAY)

        if capture_response.status_code != 201:
            message = capture_data.get('message') or capture_data.get('name') or 'Payment capture failed'
            return Response({'error': message}, status=status.HTTP_400_BAD_REQUEST)
        
        if capture_data.get('status') != 'COMPLETED':
            logger.warning(f"PayPal order not completed: {capture_data.get('status')}")
            return Response({'error': 'Payment not completed'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Ensure profile exists and update subscription
        profile, created = UserProfile.objects.get_or_create(user=request.user)
        if created:
            logger.info(f"Created profile for user {request.user.email}")
        
        profile.subscription = 'premium'
        profile.subscription_date = timezone.now()
        profile.save()
        logger.info(f"User {request.user.email} subscription updated to premium")
        
        # Update payment status
        updated_count = Payment.objects.filter(paypal_order_id=order_id).update(status='COMPLETED')
        logger.info(f"Updated {updated_count} payment records")
        
        return Response({
            'success': True,
            'subscription': 'premium',
            'subscription_date': profile.subscription_date
        })
    except Exception as e:
        logger.error(f"Error capturing subscription order: {str(e)}", exc_info=True)
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_checkout_order(request):
    """Create PayPal checkout order"""
    required_fields = [
        'amount', 'shippingMethod', 'modelName', 'email', 'fullName',
        'address', 'city', 'state', 'postalCode', 'country'
    ]
    
    for field in required_fields:
        if field not in request.data:
            return Response({'error': f'Missing required field: {field}'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        PAYPAL_API_BASE = os.getenv('PAYPAL_API_BASE', 'https://api-m.sandbox.paypal.com').rstrip('/')
        access_token = get_paypal_access_token()
        
        frontend_url = os.getenv('FRONTEND_URL', 'http://localhost:3000')
        amount = str(request.data.get('amount'))
        model_name = request.data.get('modelName')
        
        payload = create_checkout_order_payload(amount, model_name, frontend_url)
        headers = {
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {access_token}'
        }
        
        order_response = requests.post(
            f"{PAYPAL_API_BASE}/v2/checkout/orders",
            json=payload,
            headers=headers,
            timeout=20,
        )

        try:
            order_data = order_response.json()
        except ValueError:
            logger.error('PayPal create checkout order returned non-JSON. Status=%s', order_response.status_code)
            return Response({'error': 'Invalid PayPal response while creating checkout order'}, status=status.HTTP_502_BAD_GATEWAY)

        if order_response.status_code != 201:
            message = order_data.get('message') or order_data.get('name') or 'Failed to create PayPal order'
            return Response({'error': message}, status=status.HTTP_400_BAD_REQUEST)

        order_id = order_data['id']
        
        # Store order
        Order.objects.create(
            user=request.user,
            paypal_order_id=order_id,
            amount=amount,
            status='CREATED',
            shipping_method=request.data.get('shippingMethod'),
            model_name=model_name,
            design_name=request.data.get('designName'),
            design_image=request.data.get('designImage'),
            email=request.data.get('email'),
            full_name=request.data.get('fullName'),
            address=request.data.get('address'),
            city=request.data.get('city'),
            state=request.data.get('state'),
            postal_code=request.data.get('postalCode'),
            country=request.data.get('country')
        )
        
        return Response({
            'id': order_id,
            'status': order_data['status']
        })
    except Exception as e:
        logger.error(f"Error creating checkout order: {str(e)}")
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def capture_checkout_order(request):
    """Capture PayPal checkout order"""
    order_id = request.data.get('orderId')
    if not order_id:
        return Response({'error': 'Order ID required'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        PAYPAL_API_BASE = os.getenv('PAYPAL_API_BASE', 'https://api-m.sandbox.paypal.com').rstrip('/')
        access_token = get_paypal_access_token()
        
        # Capture order
        headers = {
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {access_token}'
        }
        
        logger.info(f"Capturing PayPal checkout order {order_id}")
        capture_response = requests.post(
            f"{PAYPAL_API_BASE}/v2/checkout/orders/{order_id}/capture",
            headers=headers,
            timeout=20,
        )

        try:
            capture_data = capture_response.json()
        except ValueError:
            logger.error('PayPal capture checkout returned non-JSON. Status=%s', capture_response.status_code)
            return Response({'error': 'Invalid PayPal response while capturing checkout payment'}, status=status.HTTP_502_BAD_GATEWAY)

        if capture_response.status_code != 201:
            message = capture_data.get('message') or capture_data.get('name') or 'Payment capture failed'
            return Response({'error': message}, status=status.HTTP_400_BAD_REQUEST)
        
        if capture_data.get('status') != 'COMPLETED':
            logger.warning(f"PayPal order not completed: {capture_data.get('status')}")
            return Response({'error': 'Payment not completed'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Update order status
        updated_count = Order.objects.filter(paypal_order_id=order_id).update(status='COMPLETED')
        logger.info(f"Updated {updated_count} order records to COMPLETED")
        
        # Extract amount
        amount = capture_data.get('purchase_units', [{}])[0].get('payments', {}).get('captures', [{}])[0].get('amount', {}).get('value', '0.00')
        
        logger.info(f"Checkout order {order_id} completed for user {request.user.email}")
        return Response({
            'success': True,
            'orderId': order_id,
            'amount': amount,
            'currency': 'USD'
        })
    except Exception as e:
        logger.error(f"Error capturing checkout order: {str(e)}", exc_info=True)
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
