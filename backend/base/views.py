from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.contrib.auth.models import User
from .models import FAQ, UserProfile
import json
import base64
import os
import requests
from pathlib import Path
from dotenv import load_dotenv
import jwt
from datetime import datetime, timedelta

# Load environment variables from .env file (in project root, parent of backend)
env_path = Path(__file__).resolve().parent.parent.parent / '.env'
load_dotenv(dotenv_path=env_path)

try:
    from google.auth import default
    from google.oauth2 import service_account
    from google.cloud import aiplatform
    GOOGLE_CLOUD_AVAILABLE = True
except ImportError:
    GOOGLE_CLOUD_AVAILABLE = False

def getRoutes(request):
    return JsonResponse({'message': 'Welcome to Sneakr API'})

JWT_SECRET = os.getenv('JWT_SECRET', 'django-secret-key-dev')

def get_jwt_token(user_id):
    """Generate JWT token for user"""
    payload = {
        'id': user_id,
        'iat': datetime.utcnow(),
        'exp': datetime.utcnow() + timedelta(hours=24)
    }
    return jwt.encode(payload, JWT_SECRET, algorithm='HS256')

@csrf_exempt
@require_http_methods(["POST"])
def signIn(request):
    """Sign in user and return JWT token"""
    try:
        data = json.loads(request.body)
        email = data.get('email', '').strip()
        password = data.get('password', '')
        
        if not email or not password:
            return JsonResponse({'error': 'Email and password are required'}, status=400)
        
        # Try to find user by email
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return JsonResponse({'error': 'Invalid email or password'}, status=401)
        
        # Check password
        if not user.check_password(password):
            return JsonResponse({'error': 'Invalid email or password'}, status=401)
        
        # Get subscription tier
        try:
            profile = user.userprofile
            subscription = profile.subscription
            subscription_date = profile.subscription_date.isoformat() if profile.subscription_date else None
        except:
            subscription = 'free'
            subscription_date = None
        
        # Generate token
        token = get_jwt_token(user.id)
        
        return JsonResponse({
            'user': {
                'id': user.id,
                'email': user.email,
                'subscription': subscription,
                'subscription_date': subscription_date
            },
            'token': token
        })
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON'}, status=400)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@csrf_exempt
@require_http_methods(["POST"])
def signUp(request):
    """Sign up new user"""
    try:
        data = json.loads(request.body)
        email = data.get('email', '').strip()
        password = data.get('password', '')
        
        if not email or not password:
            return JsonResponse({'error': 'Email and password are required'}, status=400)
        
        # Check if user already exists
        if User.objects.filter(email=email).exists():
            return JsonResponse({'error': 'User already exists'}, status=400)
        
        # Create user
        user = User.objects.create_user(username=email, email=email, password=password)
        
        # Create user profile with free subscription
        UserProfile.objects.create(user=user, subscription='free')
        
        # Generate token
        token = get_jwt_token(user.id)
        
        return JsonResponse({
            'user': {
                'id': user.id,
                'email': user.email,
                'subscription': 'free',
                'subscription_date': None
            },
            'token': token
        }, status=201)
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON'}, status=400)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

def authenticate_token(request):
    """Authenticate JWT token from Authorization header"""
    auth_header = request.headers.get('Authorization', '')
    if not auth_header.startswith('Bearer '):
        return None, JsonResponse({'error': 'Authentication required'}, status=401)
    
    token = auth_header.split(' ')[1]
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=['HS256'])
        return payload['id'], None
    except jwt.ExpiredSignatureError:
        return None, JsonResponse({'error': 'Token expired'}, status=401)
    except jwt.InvalidTokenError:
        return None, JsonResponse({'error': 'Invalid token'}, status=401)

@csrf_exempt
@require_http_methods(["GET"])
def getSubscription(request):
    """Get user subscription status"""
    user_id, error = authenticate_token(request)
    if error:
        return error
    
    try:
        user = User.objects.get(id=user_id)
        profile = user.userprofile
        
        return JsonResponse({
            'tier': profile.subscription,
            'subscription_date': profile.subscription_date.isoformat() if profile.subscription_date else None
        })
    except User.DoesNotExist:
        return JsonResponse({'error': 'User not found'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

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
@require_http_methods(["POST"])
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
        # Parse request body
        data = json.loads(request.body)
        person_image_b64 = data.get('person_image')
        shoe_image_b64 = data.get('shoe_image')
        
        if not person_image_b64 or not shoe_image_b64:
            return JsonResponse({
                'error': 'Both person_image and shoe_image are required'
            }, status=400)
        
        # Initialize Vertex AI with credentials from environment
        service_account_json = os.getenv('GOOGLE_SERVICE_ACCOUNT')
        
        if not service_account_json:
            return JsonResponse({
                'error': 'GOOGLE_SERVICE_ACCOUNT not found in .env file. Please add your Google Cloud service account credentials.'
            }, status=500)
        
        try:
            # Parse the JSON string from environment variable
            service_account_info = json.loads(service_account_json)
        except json.JSONDecodeError:
            return JsonResponse({
                'error': 'Invalid JSON in GOOGLE_SERVICE_ACCOUNT. Please ensure the service account JSON is properly formatted and escaped.'
            }, status=500)
        
        # Set credentials
        credentials = service_account.Credentials.from_service_account_info(
            service_account_info,
            scopes=['https://www.googleapis.com/auth/cloud-platform']
        )
        
        # Read project ID from service account info
        project_id = service_account_info.get('project_id')
        
        if not project_id:
            return JsonResponse({
                'error': 'Project ID not found in GOOGLE_SERVICE_ACCOUNT'
            }, status=500)
        
        # Clean base64 data (remove data URL prefix if present)
        person_image_b64_clean = person_image_b64.split(',')[-1] if ',' in person_image_b64 else person_image_b64
        shoe_image_b64_clean = shoe_image_b64.split(',')[-1] if ',' in shoe_image_b64 else shoe_image_b64
        
        print("[INFO] Virtual Try-On request - using Vertex AI")
        print(f"[INFO] Project ID: {project_id}")
        print(f"[INFO] Person image length: {len(person_image_b64_clean)}")
        print(f"[INFO] Shoe image length: {len(shoe_image_b64_clean)}")
        
        # Get access token from credentials
        from google.auth.transport.requests import Request
        credentials.refresh(Request())
        access_token = credentials.token
        print(f"[DEBUG] Got access token: {access_token[:20]}...")
        
        # QUESTION: Is this the correct endpoint and model name?
        # Based on the documentation you showed, virtual-try-on-001 should be available
        url = f"https://us-central1-aiplatform.googleapis.com/v1/projects/{project_id}/locations/us-central1/publishers/google/models/virtual-try-on-001:predict"
        
        headers = {
            "Authorization": f"Bearer {access_token}",
            "Content-Type": "application/json"
        }
        
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
                    'status_code': response.status_code
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
