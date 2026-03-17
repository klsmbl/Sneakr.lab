/**
 * Sneakr.lab - PayPal Sandbox Configuration
 */

import * as paypal from '@paypal/paypal-server-sdk';

const clientId = process.env.PAYPAL_CLIENT_ID;
const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

if (!clientId || !clientSecret) {
  throw new Error('PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET must be set in server environment');
}

const client = new paypal.PayPalHttpClient(
  new paypal.SandboxEnvironment(clientId, clientSecret)
);

export { client };
