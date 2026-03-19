import os
import logging
from typing import Dict, Any

import requests

logger = logging.getLogger(__name__)

PAYPAL_API_BASE = os.getenv('PAYPAL_API_BASE', 'https://api-m.sandbox.paypal.com').rstrip('/')


def get_paypal_access_token() -> str:
    """Get PayPal access token and raise descriptive errors when auth fails."""
    paypal_client_id = os.getenv('PAYPAL_CLIENT_ID', '').strip()
    paypal_client_secret = os.getenv('PAYPAL_CLIENT_SECRET', '').strip()

    if not paypal_client_id or not paypal_client_secret:
        raise ValueError('PayPal credentials are missing. Set PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET.')

    logger.info('Requesting PayPal access token')

    try:
        token_response = requests.post(
            f"{PAYPAL_API_BASE}/v1/oauth2/token",
            auth=(paypal_client_id, paypal_client_secret),
            data={'grant_type': 'client_credentials'},
            timeout=20,
        )
    except requests.RequestException as exc:
        logger.error('PayPal auth request failed: %s', str(exc))
        raise ValueError('Unable to connect to PayPal authentication endpoint.') from exc

    try:
        token_payload = token_response.json()
    except ValueError as exc:
        logger.error('PayPal auth returned non-JSON response. Status=%s Body=%s', token_response.status_code, token_response.text)
        raise ValueError('PayPal authentication returned an invalid response.') from exc

    if token_response.status_code != 200:
        logger.error('PayPal auth failed. Status=%s Payload=%s', token_response.status_code, token_payload)
        error_description = token_payload.get('error_description') or token_payload.get('error') or 'Unknown PayPal auth error'
        raise ValueError(f'PayPal authentication failed: {error_description}')

    access_token = token_payload.get('access_token')
    if not access_token:
        logger.error('PayPal auth response missing access_token. Payload=%s', token_payload)
        raise ValueError('PayPal authentication succeeded but no access token was returned.')

    return access_token


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
