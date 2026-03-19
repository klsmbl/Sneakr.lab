from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from .models import FAQ
import json
import base64
import os
import requests
from pathlib import Path

try:
    from google.auth import default
    from google.oauth2 import service_account
    from google.cloud import aiplatform
    GOOGLE_CLOUD_AVAILABLE = True
except ImportError:
    GOOGLE_CLOUD_AVAILABLE = False

def getRoutes(request):
    return JsonResponse({'message': 'Welcome to Sneakr API'})

def getFAQs(request):
    faqs = FAQ.objects.all()
    faq_list = [
        {
            'id': faq.id,
            'question': faq.question,
            'answer': faq.answer,
            'order': faq.order
        }
        for faq in faqs
    ]
    return JsonResponse({'faqs': faq_list})

@csrf_exempt
@require_http_methods(["POST", "OPTIONS"])
def virtualTryOn(request):
    """
    Virtual Try-On endpoint using Google Vertex AI
    Uses the official API format: personImage + productImages with nested bytesBase64Encoded
    """
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
        
        # Initialize Vertex AI credentials.
        # Supports either:
        # 1) API key mode: VERTEX_API_KEY (or GOOGLE_API_KEY) + VERTEX_PROJECT_ID
        # 2) Service account mode: GOOGLE_APPLICATION_CREDENTIALS or ./service-account.json
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
        
        # Clean base64 data (remove data URL prefix if present)
        person_image_b64_clean = person_image_b64.split(',')[-1] if ',' in person_image_b64 else person_image_b64
        shoe_image_b64_clean = shoe_image_b64.split(',')[-1] if ',' in shoe_image_b64 else shoe_image_b64
        
        print("[INFO] Virtual Try-On request - using Vertex AI")
        print(f"[INFO] Auth mode: {auth_mode}")
        print(f"[INFO] Project ID: {project_id}")
        print(f"[INFO] Person image length: {len(person_image_b64_clean)}")
        print(f"[INFO] Shoe image length: {len(shoe_image_b64_clean)}")

        # QUESTION: Is this the correct endpoint and model name?
        # Based on the documentation you showed, virtual-try-on-001 should be available
        base_url = f"https://us-central1-aiplatform.googleapis.com/v1/projects/{project_id}/locations/us-central1/publishers/google/models/virtual-try-on-001:predict"
        url = f"{base_url}?key={vertex_api_key}" if auth_mode == 'api-key' else base_url

        headers = {
            "Content-Type": "application/json"
        }
        if auth_mode == 'service-account':
            headers["Authorization"] = f"Bearer {access_token}"
        
        print(f"[DEBUG] API Endpoint: {url}")
        
        # CORRECT PAYLOAD FORMAT from the official documentation:
        # The API expects "personImage" and "productImages" (not "person_image" and "garment_image")
        # Images must be nested under "image.bytesBase64Encoded"
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
        
        print(f"[INFO] Using CORRECT API format: personImage + productImages")
        
        try:
            response = requests.post(url, headers=headers, json=payload, timeout=60)
            print(f"[DEBUG] Response Status: {response.status_code}")
            print(f"[DEBUG] Response Headers: {dict(response.headers)}")
            
            if response.status_code == 200:
                result = response.json()
                print("[SUCCESS] Virtual Try-On API call successful!")
                print(f"[DEBUG] Response keys: {result.keys()}")
                
                if "predictions" in result and result["predictions"]:
                    prediction = result["predictions"][0]
                    print(f"[DEBUG] Prediction keys: {prediction.keys()}")
                    
                    # According to the official docs, response format is:
                    # {"bytesBase64Encoded": "BASE64_IMG_BYTES", "mimeType": "image/png"}
                    if "bytesBase64Encoded" in prediction:
                        result_image_b64 = prediction["bytesBase64Encoded"]
                        mime_type = prediction.get("mimeType", "image/png")
                        
                        return JsonResponse({
                            'success': True,
                            'result_image': f"data:{mime_type};base64,{result_image_b64}",
                            'api_used': 'vertex-ai-virtual-try-on'
                        })
                    else:
                        print(f"[ERROR] Expected 'bytesBase64Encoded' in prediction, got: {prediction.keys()}")
                        return JsonResponse({
                            'error': 'API succeeded but no bytesBase64Encoded found in response',
                            'debug_info': str(prediction)
                        }, status=500)
                else:
                    print("[ERROR] No predictions in API response")
                    return JsonResponse({
                        'error': 'API succeeded but no predictions found in response',
                        'debug_info': str(result)
                    }, status=500)
            else:
                error_text = response.text
                print(f"[ERROR] API Error {response.status_code}: {error_text}")
                
                return JsonResponse({
                    'error': f'Vertex AI Virtual Try-On API Error: {error_text}',
                    'status_code': response.status_code,
                    'auth_mode': auth_mode
                }, status=response.status_code)
                
        except requests.exceptions.RequestException as e:
            print(f"[ERROR] Request failed: {str(e)}")
            return JsonResponse({
                'error': f'Network error: {str(e)}'
            }, status=500)
            
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON'}, status=400)
    except Exception as e:
        print("[ERROR] Virtual Try-On failed:", str(e))
        return JsonResponse({
            'error': f'Virtual Try-On failed: {str(e)}'
        }, status=500)


# ==================== REST API Endpoints ====================

from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth.models import User
from .models import UserProfile, Design, Payment, Order
from .serializers import (
    UserSerializer, DesignSerializer, PaymentSerializer, OrderSerializer,
    SignUpSerializer, SignInSerializer, SubscriptionStatusSerializer
)
from .auth_utils import get_tokens_for_user
import requests


@api_view(['POST'])
@permission_classes([AllowAny])
def sign_up(request):
    """User signup endpoint"""
    serializer = SignUpSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        tokens = get_tokens_for_user(user)
        return Response(tokens, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def sign_in(request):
    """User signin endpoint"""
    serializer = SignInSerializer(data=request.data)
    if serializer.is_valid():
        email = serializer.validated_data['email']
        password = serializer.validated_data['password']
        
        try:
            user = User.objects.get(email=email)
            if user.check_password(password):
                tokens = get_tokens_for_user(user)
                return Response(tokens, status=status.HTTP_200_OK)
            else:
                return Response({'error': 'Invalid email or password'}, status=status.HTTP_401_UNAUTHORIZED)
        except User.DoesNotExist:
            return Response({'error': 'Invalid email or password'}, status=status.HTTP_401_UNAUTHORIZED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_profile(request):
    """Get current user profile"""
    serializer = UserSerializer(request.user)
    return Response(serializer.data)


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def design_list(request):
    """List and create designs"""
    if request.method == 'POST':
        design_data = request.data
        design = Design.objects.create(
            user=request.user,
            design=design_data
        )
        serializer = DesignSerializer(design)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    # GET
    designs = Design.objects.filter(user=request.user)
    if request.user.profile.role == 'admin':
        designs = Design.objects.all()
    
    serializer = DesignSerializer(designs, many=True)
    return Response(serializer.data)


@api_view(['GET', 'DELETE'])
@permission_classes([IsAuthenticated])
def design_detail(request, design_id):
    """Get or delete specific design"""
    try:
        if request.user.profile.role == 'admin':
            design = Design.objects.get(id=design_id)
        else:
            design = Design.objects.get(id=design_id, user=request.user)
    except Design.DoesNotExist:
        return Response({'error': 'Design not found'}, status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':
        serializer = DesignSerializer(design)
        return Response(serializer.data)
    
    # DELETE
    design.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def subscription_status(request):
    """Get current subscription status"""
    profile = request.user.profile
    data = {
        'tier': profile.subscription,
        'subscription_date': profile.subscription_date,
        'can_upgrade': profile.subscription == 'free'
    }
    return Response(data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_subscription_order(request):
    """Create PayPal subscription order"""
    from .paypal_utils import create_subscription_order_payload, get_paypal_access_token
    
    plan = request.data.get('plan')
    if plan not in ['monthly', 'yearly']:
        return Response({'error': 'Invalid plan'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        # Get PayPal access token (sync call for now)
        import base64
        PAYPAL_CLIENT_ID = os.getenv('PAYPAL_CLIENT_ID')
        PAYPAL_CLIENT_SECRET = os.getenv('PAYPAL_CLIENT_SECRET')
        PAYPAL_API_BASE = 'https://api-m.sandbox.paypal.com'
        
        if not PAYPAL_CLIENT_ID or not PAYPAL_CLIENT_SECRET:
            return Response({'error': 'PayPal not configured'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        auth = f"{PAYPAL_CLIENT_ID}:{PAYPAL_CLIENT_SECRET}"
        auth_b64 = base64.b64encode(auth.encode()).decode()
        
        # Get access token
        token_response = requests.post(
            f"{PAYPAL_API_BASE}/v1/oauth2/token",
            auth=(PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET),
            data={'grant_type': 'client_credentials'}
        )
        
        if token_response.status_code != 200:
            return Response({'error': 'Failed to authenticate with PayPal'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        access_token = token_response.json()['access_token']
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
            headers=headers
        )
        
        if order_response.status_code != 201:
            return Response({'error': 'Failed to create PayPal order'}, status=status.HTTP_400_BAD_REQUEST)
        
        order_data = order_response.json()
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
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def capture_subscription_order(request):
    """Capture PayPal subscription order"""
    order_id = request.data.get('orderId')
    if not order_id:
        return Response({'error': 'Order ID required'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        PAYPAL_CLIENT_ID = os.getenv('PAYPAL_CLIENT_ID')
        PAYPAL_CLIENT_SECRET = os.getenv('PAYPAL_CLIENT_SECRET')
        PAYPAL_API_BASE = 'https://api-m.sandbox.paypal.com'
        
        # Get access token
        token_response = requests.post(
            f"{PAYPAL_API_BASE}/v1/oauth2/token",
            auth=(PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET),
            data={'grant_type': 'client_credentials'}
        )
        access_token = token_response.json()['access_token']
        
        # Capture order
        headers = {
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {access_token}'
        }
        
        capture_response = requests.post(
            f"{PAYPAL_API_BASE}/v2/checkout/orders/{order_id}/capture",
            headers=headers
        )
        
        if capture_response.status_code != 201:
            return Response({'error': 'Payment capture failed'}, status=status.HTTP_400_BAD_REQUEST)
        
        capture_data = capture_response.json()
        
        if capture_data['status'] != 'COMPLETED':
            return Response({'error': 'Payment not completed'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Update user subscription
        from django.utils import timezone
        profile = request.user.profile
        profile.subscription = 'premium'
        profile.subscription_date = timezone.now()
        profile.save()
        
        # Update payment status
        Payment.objects.filter(paypal_order_id=order_id).update(status='COMPLETED')
        
        return Response({
            'success': True,
            'subscription': 'premium',
            'subscription_date': profile.subscription_date
        })
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def payment_history(request):
    """Get payment history"""
    payments = Payment.objects.filter(user=request.user).order_by('-created_at')[:50]
    serializer = PaymentSerializer(payments, many=True)
    return Response(serializer.data)


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
        PAYPAL_CLIENT_ID = os.getenv('PAYPAL_CLIENT_ID')
        PAYPAL_CLIENT_SECRET = os.getenv('PAYPAL_CLIENT_SECRET')
        PAYPAL_API_BASE = 'https://api-m.sandbox.paypal.com'
        
        # Get access token
        token_response = requests.post(
            f"{PAYPAL_API_BASE}/v1/oauth2/token",
            auth=(PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET),
            data={'grant_type': 'client_credentials'}
        )
        access_token = token_response.json()['access_token']
        
        frontend_url = os.getenv('FRONTEND_URL', 'http://localhost:3000')
        from .paypal_utils import create_checkout_order_payload
        
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
            headers=headers
        )
        
        if order_response.status_code != 201:
            return Response({'error': 'Failed to create PayPal order'}, status=status.HTTP_400_BAD_REQUEST)
        
        order_data = order_response.json()
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
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def capture_checkout_order(request):
    """Capture PayPal checkout order"""
    order_id = request.data.get('orderId')
    if not order_id:
        return Response({'error': 'Order ID required'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        PAYPAL_CLIENT_ID = os.getenv('PAYPAL_CLIENT_ID')
        PAYPAL_CLIENT_SECRET = os.getenv('PAYPAL_CLIENT_SECRET')
        PAYPAL_API_BASE = 'https://api-m.sandbox.paypal.com'
        
        # Get access token
        token_response = requests.post(
            f"{PAYPAL_API_BASE}/v1/oauth2/token",
            auth=(PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET),
            data={'grant_type': 'client_credentials'}
        )
        access_token = token_response.json()['access_token']
        
        # Capture order
        headers = {
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {access_token}'
        }
        
        capture_response = requests.post(
            f"{PAYPAL_API_BASE}/v2/checkout/orders/{order_id}/capture",
            headers=headers
        )
        
        if capture_response.status_code != 201:
            return Response({'error': 'Payment capture failed'}, status=status.HTTP_400_BAD_REQUEST)
        
        capture_data = capture_response.json()
        
        if capture_data['status'] != 'COMPLETED':
            return Response({'error': 'Payment not completed'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Update order status
        Order.objects.filter(paypal_order_id=order_id).update(status='COMPLETED')
        
        # Extract amount
        amount = capture_data.get('purchase_units', [{}])[0].get('payments', {}).get('captures', [{}])[0].get('amount', {}).get('value', '0.00')
        
        return Response({
            'success': True,
            'orderId': order_id,
            'amount': amount,
            'currency': 'USD'
        })
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def order_history(request):
    """Get order history"""
    orders = Order.objects.filter(user=request.user).order_by('-created_at')[:50]
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)
