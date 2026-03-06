/**
 * Sneakr.lab - PayPal Sandbox Configuration
 */

import * as paypal from '@paypal/paypal-server-sdk';

// PayPal Sandbox Credentials (Demo Only)
const clientId = process.env.PAYPAL_CLIENT_ID || 'AeZJa8rZozqJ3gQRaKSc8R7Z1ZLK3xyYRNVCE-qb5vJ0uq1zVEGH7z86qVLaRnhS8pS8u6zXjfG1OvWa';
const clientSecret = process.env.PAYPAL_CLIENT_SECRET || 'ED3mD3gEYAKNEYSqr19VQUxVe8fCXvzLQ9VfVBW1uqKtDaVpCEjQTFzKiKJyBGYyHQE9BXXEr0qA-vKHF';

const client = new paypal.PayPalHttpClient(
  new paypal.SandboxEnvironment(clientId, clientSecret)
);

export { client };
