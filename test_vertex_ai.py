#!/usr/bin/env python3
"""
Test if Vertex AI API is enabled in the Google Cloud project
"""
import os
from google.cloud import aiplatform
from google.oauth2 import service_account
import os

# Set up credentials
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
SERVICE_ACCOUNT_FILE = os.path.join(BASE_DIR, 'service-account.json')
credentials = service_account.Credentials.from_service_account_file(SERVICE_ACCOUNT_FILE)

# Project details
PROJECT_ID = 'sneakr-lab-488702'
LOCATION = 'us-central1'

try:
    # Initialize Vertex AI
    aiplatform.init(
        project=PROJECT_ID,
        location=LOCATION,
        credentials=credentials
    )
    
    print(f"✓ Successfully initialized Vertex AI")
    print(f"  Project: {PROJECT_ID}")
    print(f"  Location: {LOCATION}")
    
    # Try to access the API
    from google.cloud.aiplatform_v1 import PredictionServiceClient
    client = PredictionServiceClient(credentials=credentials)
    
    print(f"✓ Vertex AI API is ENABLED")
    print(f"  Prediction Service Client created successfully")
    print(f"\nYour Virtual Try-On feature should work!")
    
except Exception as e:
    error_str = str(e)
    print(f"✗ Error accessing Vertex AI API:")
    print(f"  {error_str}")
    
    if "403" in error_str or "SERVICE_DISABLED" in error_str:
        print(f"\n❌ Vertex AI API is NOT ENABLED")
        print(f"\nTo enable it:")
        print(f"1. Go to: https://console.cloud.google.com/apis/library/aiplatform.googleapis.com?project={PROJECT_ID}")
        print(f"2. Click 'ENABLE'")
        print(f"3. Wait a few minutes for activation")
    elif "PERMISSION_DENIED" in error_str:
        print(f"\n❌ Service account lacks permissions")
        print(f"\nGrant the service account these roles:")
        print(f"  - Vertex AI User")
        print(f"  - Vertex AI Service Agent")
