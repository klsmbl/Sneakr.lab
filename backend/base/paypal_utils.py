import os
import logging
from typing import Optional, Dict, Any

logger = logging.getLogger(__name__)

PAYPAL_CLIENT_ID = os.getenv('PAYPAL_CLIENT_ID')
PAYPAL_CLIENT_SECRET = os.getenv('PAYPAL_CLIENT_SECRET')
PAYPAL_API_BASE = 'https://api-m.sandbox.paypal.com'


async def get_paypal_access_token() -> str:
    """Get PayPal access token"""
    import asyncio
    
    if not PAYPAL_CLIENT_ID or not PAYPAL_CLIENT_SECRET:
        raise ValueError('PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET must be set')
    
    auth = f"{PAYPAL_CLIENT_ID}:{PAYPAL_CLIENT_SECRET}"
    import base64
    auth_b64 = base64.b64encode(auth.encode()).decode()
    
    logger.info('Getting PayPal access token...')
    
    try:
        import urllib.request
        import json
        
        req = urllib.request.Request(
            f"{PAYPAL_API_BASE}/v1/oauth2/token",
            data=b'grant_type=client_credentials',
            headers={
                'Authorization': f'Basic {auth_b64}',
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            method='POST'
        )
        
        with urllib.request.urlopen(req) as response:
            data = json.loads(response.read().decode())
            logger.info('PayPal auth successful')
            return data['access_token']
    except Exception as err:
        logger.error(f'PayPal auth error: {err}')
        raise


def create_subscription_order_payload(plan: str, frontend_url: str) -> Dict[str, Any]:
    """Create PayPal order payload for subscription"""
    amount = '9.99' if plan == 'monthly' else '99.99'
    description = 'Sneakr.lab Premium - 1 Month' if plan == 'monthly' else 'Sneakr.lab Premium - 1 Year'
    
    return {
        'intent': 'CAPTURE',
        'purchase_units': [
            {
                'amount': {
                    'currency_code': 'USD',
                    'value': amount
                },
                'description': description
            }
        ],
        'application_context': {
            'brand_name': 'Sneakr.lab',
            'user_action': 'PAY_NOW',
            'return_url': f"{frontend_url}/subscription/success",
            'cancel_url': f"{frontend_url}/subscription/cancel"
        }
    }


def create_checkout_order_payload(amount: str, model_name: str, frontend_url: str) -> Dict[str, Any]:
    """Create PayPal order payload for checkout"""
    return {
        'intent': 'CAPTURE',
        'purchase_units': [
            {
                'amount': {
                    'currency_code': 'USD',
                    'value': str(amount)
                },
                'description': f"Custom Sneaker - {model_name}"
            }
        ],
        'application_context': {
            'brand_name': 'Sneakr.lab',
            'user_action': 'PAY_NOW',
            'return_url': f"{frontend_url}/checkout/success",
            'cancel_url': f"{frontend_url}/checkout"
        }
    }
