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
