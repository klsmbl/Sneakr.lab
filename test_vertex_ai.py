#!/usr/bin/env python3
"""
Test if Vertex AI API is enabled in the Google Cloud project
"""
import os
import json
from google.cloud import aiplatform
from google.oauth2 import service_account
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Set up credentials from environment variable
service_account_json = os.getenv('GOOGLE_SERVICE_ACCOUNT')

if not service_account_json:
    print("❌ GOOGLE_SERVICE_ACCOUNT not found in .env file")
    print("Please add your service account JSON to the .env file")
    exit(1)

try:
    service_account_info = json.loads(service_account_json)
    credentials = service_account.Credentials.from_service_account_info(
        service_account_info,
        scopes=['https://www.googleapis.com/auth/cloud-platform']
    )
except json.JSONDecodeError as e:
    print(f"❌ Invalid JSON in GOOGLE_SERVICE_ACCOUNT: {e}")
    print("Please ensure the service account JSON is properly formatted")
    exit(1)

# Project details from service account
PROJECT_ID = service_account_info.get('project_id')
LOCATION = 'us-central1'

if not PROJECT_ID:
    print("❌ project_id not found in service account credentials")
    exit(1)

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
