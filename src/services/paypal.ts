/**
 * PayPal API Integration Module for Cloudflare Workers.
 * Handles OAuth 2.0 authentication token generation, order creation, and capture.
 * All operations execute server-side to keep secrets hidden from browser clients.
 */

import { Logger } from '../utils/logger';

export interface PayPalEnv {
  PAYPAL_CLIENT_ID?: string;
  PAYPAL_CLIENT_SECRET?: string;
  PAYPAL_MERCHANT_ID?: string;
  NODE_ENV?: string;
}

export interface CreateOrderPayload {
  amount: string; // e.g., "8.50"
  currency?: string; // default "USD"
  description?: string;
  item_name?: string;
  custom_note?: string;
}

interface OAuthTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

// In-memory token cache for worker isolates
let cachedToken: { token: string; expiresAt: number } | null = null;

function getPayPalBaseUrl(env: PayPalEnv): string {
  if (env.NODE_ENV === 'production' && env.PAYPAL_CLIENT_ID && env.PAYPAL_CLIENT_ID !== 'sb') {
    return 'https://api-m.paypal.com';
  }
  return 'https://api-m.sandbox.paypal.com';
}

/**
 * Retrieve server-to-server OAuth 2.0 access token from PayPal
 */
export async function getPayPalAccessToken(env: PayPalEnv): Promise<string> {
  const clientId = env.PAYPAL_CLIENT_ID;
  const clientSecret = env.PAYPAL_CLIENT_SECRET;

  // Sandbox fallback if missing credentials
  if (!clientId || !clientSecret || clientId === 'sb' || clientSecret === 'MY_PAYPAL_CLIENT_SECRET') {
    Logger.warn('PayPal Client ID or Secret missing/demo. Utilizing sandbox mock auth token.');
    return 'MOCK_SANDBOX_ACCESS_TOKEN';
  }

  // Check cache (with 60 second safety buffer)
  const now = Date.now();
  if (cachedToken && cachedToken.expiresAt > now + 60000) {
    Logger.info('Reusing cached PayPal OAuth 2.0 access token');
    return cachedToken.token;
  }

  const baseUrl = getPayPalBaseUrl(env);
  const authHeader = 'Basic ' + btoa(`${clientId}:${clientSecret}`);

  const startTime = Date.now();
  Logger.info('Requesting fresh OAuth 2.0 token from PayPal API', { baseUrl });

  const response = await fetch(`${baseUrl}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Authorization': authHeader,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: 'grant_type=client_credentials'
  });

  const durationMs = Date.now() - startTime;

  if (!response.ok) {
    const errorText = await response.text();
    Logger.error('PayPal OAuth token request failed', { status: response.status, durationMs, errorText });
    throw new Error(`PayPal OAuth authentication failed (${response.status}): ${errorText}`);
  }

  const data = (await response.json()) as OAuthTokenResponse;
  cachedToken = {
    token: data.access_token,
    expiresAt: Date.now() + data.expires_in * 1000
  };

  Logger.info('PayPal OAuth token retrieved successfully', { durationMs, expiresIn: data.expires_in });
  return cachedToken.token;
}

/**
 * Create a PayPal v2 Checkout Order
 */
export async function createPayPalOrder(payload: CreateOrderPayload, env: PayPalEnv): Promise<{ id: string; status: string; links?: unknown[] }> {
  const { amount, currency = 'USD', description = 'Energize Cult Cafe Order', item_name, custom_note } = payload;

  const accessToken = await getPayPalAccessToken(env);

  if (accessToken === 'MOCK_SANDBOX_ACCESS_TOKEN') {
    const mockOrderId = 'MOCK-ORDER-' + Math.floor(100000 + Math.random() * 900000);
    Logger.info('Generated mock PayPal order for sandbox testing', { mockOrderId, amount });
    return {
      id: mockOrderId,
      status: 'CREATED'
    };
  }

  const baseUrl = getPayPalBaseUrl(env);
  const startTime = Date.now();

  const orderRequestBody = {
    intent: 'CAPTURE',
    purchase_units: [
      {
        description: `${item_name || 'Cafe Order'}${custom_note ? ' - Note: ' + custom_note : ''}`,
        amount: {
          currency_code: currency,
          value: parseFloat(amount).toFixed(2)
        },
        ...(env.PAYPAL_MERCHANT_ID ? { payee: { merchant_id: env.PAYPAL_MERCHANT_ID } } : {})
      }
    ],
    application_context: {
      brand_name: 'Energize Cult Cafe Inc.',
      landing_page: 'NO_PREFERENCE',
      user_action: 'PAY_NOW',
      shipping_preference: 'NO_SHIPPING'
    }
  };

  Logger.info('Sending create order request to PayPal REST API', { amount, currency, item_name });

  const response = await fetch(`${baseUrl}/v2/checkout/orders`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    },
    body: JSON.stringify(orderRequestBody)
  });

  const durationMs = Date.now() - startTime;

  if (!response.ok) {
    const errorData = await response.text();
    Logger.error('PayPal create order failed', { status: response.status, durationMs, errorData });
    throw new Error(`Failed to create PayPal order: ${errorData}`);
  }

  const orderData = (await response.json()) as { id: string; status: string; links?: unknown[] };
  Logger.info('PayPal order created successfully', { orderId: orderData.id, status: orderData.status, durationMs });

  return orderData;
}

/**
 * Capture an approved PayPal v2 Checkout Order
 */
export async function capturePayPalOrder(orderId: string, env: PayPalEnv): Promise<{ id: string; status: string; payer?: unknown }> {
  const accessToken = await getPayPalAccessToken(env);

  if (accessToken === 'MOCK_SANDBOX_ACCESS_TOKEN' || orderId.startsWith('MOCK-ORDER-') || orderId.startsWith('DEMO-PPL-')) {
    Logger.info('Mock capturing sandbox order', { orderId });
    return {
      id: orderId,
      status: 'COMPLETED',
      payer: { name: { given_name: 'Valued', surname: 'Customer' }, email_address: 'guest@energizecultcafe.com' }
    };
  }

  const baseUrl = getPayPalBaseUrl(env);
  const startTime = Date.now();

  Logger.info('Capturing order via PayPal REST API', { orderId });

  const response = await fetch(`${baseUrl}/v2/checkout/orders/${orderId}/capture`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    }
  });

  const durationMs = Date.now() - startTime;

  if (!response.ok) {
    const errorData = await response.text();
    Logger.error('PayPal capture order failed', { orderId, status: response.status, durationMs, errorData });
    throw new Error(`Failed to capture PayPal order (${orderId}): ${errorData}`);
  }

  const captureData = (await response.json()) as { id: string; status: string; payer?: unknown };
  Logger.info('PayPal order captured successfully', { orderId: captureData.id, status: captureData.status, durationMs });

  return captureData;
}
