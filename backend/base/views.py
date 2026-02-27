from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from .models import FAQ
import json
import base64
import os
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
@require_http_methods(["POST"])
def virtualTryOn(request):
    """
    Virtual Try-On endpoint using Google Vertex AI
    Expects JSON with base64 encoded person_image and shoe_image
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
        
        # Initialize Vertex AI
        BASE_DIR = Path(__file__).resolve().parent.parent.parent
        service_account_path = os.path.join(BASE_DIR, 'service-account.json')
        
        if not os.path.exists(service_account_path):
            return JsonResponse({
                'error': 'service-account.json not found in project root. Please add your Google Cloud service account credentials.'
            }, status=500)
        
        # Set credentials
        credentials = service_account.Credentials.from_service_account_file(
            service_account_path,
            scopes=['https://www.googleapis.com/auth/cloud-platform']
        )
        
        # Read project ID from service account file
        with open(service_account_path, 'r') as f:
            service_account_info = json.load(f)
            project_id = service_account_info.get('project_id')
        
        if not project_id:
            return JsonResponse({
                'error': 'Project ID not found in service-account.json'
            }, status=500)
        
        # Initialize Vertex AI client
        aiplatform.init(
            project=project_id,
            location='us-central1',
            credentials=credentials
        )
        
        # Decode base64 images
        person_image_bytes = base64.b64decode(person_image_b64.split(',')[-1] if ',' in person_image_b64 else person_image_b64)
        shoe_image_bytes = base64.b64decode(shoe_image_b64.split(',')[-1] if ',' in shoe_image_b64 else shoe_image_b64)
        
        # Call Vertex AI Virtual Try-On API
        # Note: As of now, you'll need to use the REST API or specific client library
        # The exact implementation depends on the API structure
        # This is a placeholder for the actual API call
        
        from google.cloud import aiplatform_v1
        from google.protobuf import struct_pb2
        
        client = aiplatform_v1.PredictionServiceClient(credentials=credentials)
        endpoint = f"projects/{project_id}/locations/us-central1/publishers/google/models/virtual-try-on-001"
        
        # Prepare instances
        instance = struct_pb2.Struct()
        instance.update({
            "personImage": {
                "bytesBase64Encoded": base64.b64encode(person_image_bytes).decode('utf-8')
            },
            "garmentImage": {
                "bytesBase64Encoded": base64.b64encode(shoe_image_bytes).decode('utf-8')
            }
        })
        
        instances = [instance]
        
        # Make prediction request
        response = client.predict(
            endpoint=endpoint,
            instances=instances
        )
        
        # Extract result image
        if response.predictions:
            result_image_b64 = response.predictions[0].get('bytesBase64Encoded', '')
            return JsonResponse({
                'success': True,
                'result_image': f"data:image/png;base64,{result_image_b64}"
            })
        else:
            return JsonResponse({
                'error': 'No predictions returned from API'
            }, status=500)
            
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON'}, status=400)
    except Exception as e:
        return JsonResponse({
            'error': f'Virtual Try-On failed: {str(e)}'
        }, status=500)
