/**
 * Production-ready Cloudflare Worker for Energize Cult Cafe Inc. PayPal Payments.
 * Edge-optimized, lightweight, secure, and compliant with modern worker standards.
 */

import { applySecurityHeaders, applyCorsHeaders, sanitizeString } from './utils/security';
import { checkRateLimit } from './utils/rate-limit';
import { Logger } from './utils/logger';
import { createPayPalOrder, capturePayPalOrder } from './services/paypal';
import { renderLandingPage } from './templates/landing';
import { renderSuccessPage } from './templates/success';
import { renderCancelPage } from './templates/cancel';
import { renderDashboardPage } from './templates/dashboard';
import { getSystemStats, getAuditLogs, getTransactions, recordRequestMetric } from './services/stats';

export interface Env {
  PAYPAL_CLIENT_ID?: string;
  PAYPAL_CLIENT_SECRET?: string;
  PAYPAL_MERCHANT_ID?: string;
  SITE_NAME?: string;
  COMPANY_NAME?: string;
  COMPANY_EMAIL?: string;
  NODE_ENV?: string;
}

export interface ExecutionContext {
  waitUntil(promise: Promise<unknown>): void;
  passThroughOnException(): void;
}

const START_TIME = Date.now();

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const pathname = url.pathname;
    const clientIp = request.headers.get('cf-connecting-ip') || request.headers.get('x-forwarded-for') || '127.0.0.1';
    const userAgent = request.headers.get('user-agent') || 'Unknown';
    const origin = request.headers.get('origin');

    // Structured Audit Logging
    Logger.info(`Incoming ${request.method} request to ${pathname}`, {
      route: pathname,
      method: request.method,
      clientIp,
      userAgent
    });

    // Handle OPTIONS preflight for API routes
    if (request.method === 'OPTIONS' && pathname.startsWith('/api/')) {
      const headers = new Headers();
      applyCorsHeaders(headers, origin);
      applySecurityHeaders(headers, { allowIframePreview: true });
      return new Response(null, { status: 204, headers });
    }

    try {
      // Rate Limit Guard for API endpoints
      if (pathname.startsWith('/api/paypal/')) {
        const rateCheck = checkRateLimit(clientIp, 30, 60000);
        if (!rateCheck.allowed) {
          Logger.warn(`Rate limit exceeded for IP ${clientIp} on ${pathname}`);
          const rateHeaders = new Headers({
            'Content-Type': 'application/json',
            'Retry-After': Math.ceil(rateCheck.resetMs / 1000).toString()
          });
          applyCorsHeaders(rateHeaders, origin);
          applySecurityHeaders(rateHeaders, { allowIframePreview: true });
          return new Response(
            JSON.stringify({
              error: 'Rate limit exceeded',
              message: 'Too many requests. Please try again in a few moments.'
            }),
            { status: 429, headers: rateHeaders }
          );
        }
      }

      // Configuration with robust environment fallbacks
      const siteName = env.SITE_NAME || 'Energize Cult Cafe Inc.';
      const companyName = env.COMPANY_NAME || 'Energize Cult Cafe Inc.';
      const companyEmail = env.COMPANY_EMAIL || 'payments@energizecultcafe.com';
      const paypalClientId = env.PAYPAL_CLIENT_ID || 'sb';
      const paypalMerchantId = env.PAYPAL_MERCHANT_ID || '';

      // ROUTE: Health Check
      if (pathname === '/health' || pathname === '/api/health') {
        const healthStatus = {
          status: 'healthy',
          uptime_seconds: Math.floor((Date.now() - START_TIME) / 1000),
          timestamp: new Date().toISOString(),
          version: '1.1.0',
          company: companyName,
          environment: {
            paypal_client_id_configured: !!env.PAYPAL_CLIENT_ID && env.PAYPAL_CLIENT_ID !== 'sb',
            paypal_secret_configured: !!env.PAYPAL_CLIENT_SECRET && env.PAYPAL_CLIENT_SECRET !== 'MY_PAYPAL_CLIENT_SECRET',
            paypal_merchant_id_present: !!env.PAYPAL_MERCHANT_ID,
            site_name: siteName,
            company_email: companyEmail,
            mode: env.NODE_ENV || 'development'
          }
        };

        const headers = new Headers({
          'Content-Type': 'application/json; charset=utf-8',
          'Cache-Control': 'no-store, max-age=0'
        });
        applyCorsHeaders(headers, origin);
        applySecurityHeaders(headers, { allowIframePreview: true });

        return new Response(JSON.stringify(healthStatus, null, 2), {
          status: 200,
          headers
        });
      }

      // API ROUTE: Create PayPal Order
      if (pathname === '/api/paypal/create-order' && request.method === 'POST') {
        let body: { amount?: string; item_name?: string; custom_note?: string; currency?: string } = {};
        try {
          body = await request.json();
        } catch {
          throw new Error('Invalid JSON request body');
        }

        const rawAmount = body.amount || '8.50';
        const numAmount = parseFloat(rawAmount);
        if (isNaN(numAmount) || numAmount <= 0) {
          const errHeaders = new Headers({ 'Content-Type': 'application/json' });
          applyCorsHeaders(errHeaders, origin);
          return new Response(
            JSON.stringify({ error: 'Invalid parameter', message: 'Amount must be a positive number.' }),
            { status: 400, headers: errHeaders }
          );
        }

        const orderData = await createPayPalOrder(
          {
            amount: numAmount.toFixed(2),
            currency: body.currency ? sanitizeString(body.currency) : 'USD',
            item_name: body.item_name ? sanitizeString(body.item_name) : 'Artisan Cold Brew Concentrate',
            custom_note: body.custom_note ? sanitizeString(body.custom_note) : undefined
          },
          env
        );

        const responseHeaders = new Headers({ 'Content-Type': 'application/json' });
        applyCorsHeaders(responseHeaders, origin);
        applySecurityHeaders(responseHeaders, { allowIframePreview: true });

        return new Response(
          JSON.stringify({ success: true, order: orderData }),
          { status: 200, headers: responseHeaders }
        );
      }

      // API ROUTE: Capture PayPal Order
      if (pathname === '/api/paypal/capture-order' && request.method === 'POST') {
        let body: { orderId?: string } = {};
        try {
          body = await request.json();
        } catch {
          throw new Error('Invalid JSON request body');
        }

        if (!body.orderId || typeof body.orderId !== 'string') {
          const errHeaders = new Headers({ 'Content-Type': 'application/json' });
          applyCorsHeaders(errHeaders, origin);
          return new Response(
            JSON.stringify({ error: 'Missing parameter', message: 'orderId is required.' }),
            { status: 400, headers: errHeaders }
          );
        }

        const captureData = await capturePayPalOrder(sanitizeString(body.orderId), env);

        const responseHeaders = new Headers({ 'Content-Type': 'application/json' });
        applyCorsHeaders(responseHeaders, origin);
        applySecurityHeaders(responseHeaders, { allowIframePreview: true });

        return new Response(
          JSON.stringify({ success: true, capture: captureData }),
          { status: 200, headers: responseHeaders }
        );
      }

      // ROUTE: Payment Landing Page (/)

      if (pathname === '/' || pathname === '/index.html') {
        const html = renderLandingPage({
          siteName,
          companyName,
          companyEmail,
          paypalClientId,
          paypalMerchantId
        });

        const headers = new Headers({
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'public, max-age=0, must-revalidate'
        });
        applySecurityHeaders(headers, { allowIframePreview: true });

        return new Response(html, { status: 200, headers });
      }

      // ROUTE: Payment Success Page (/success)
      if (pathname === '/success') {
        const orderId = url.searchParams.get('orderID') || url.searchParams.get('token') || 'PPL-SUCCESS-DEMO';
        const amount = url.searchParams.get('amount') || '8.50';
        const item = url.searchParams.get('item') || 'Artisan Cold Brew Concentrate (16oz)';
        const note = url.searchParams.get('note') || '';

        const html = renderSuccessPage({
          siteName,
          companyName,
          companyEmail,
          orderId,
          amount,
          item,
          note
        });

        const headers = new Headers({
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'no-store, max-age=0'
        });
        applySecurityHeaders(headers, { allowIframePreview: true });

        return new Response(html, { status: 200, headers });
      }

      // ROUTE: Payment Cancelled Page (/cancel)
      if (pathname === '/cancel') {
        const html = renderCancelPage({
          siteName,
          companyName,
          companyEmail
        });

        const headers = new Headers({
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'no-store, max-age=0'
        });
        applySecurityHeaders(headers, { allowIframePreview: true });

        return new Response(html, { status: 200, headers });
      }

      // ROUTE: Admin Control Center Dashboard (/admin or /dashboard)
      if (pathname === '/admin' || pathname === '/dashboard') {
        recordRequestMetric(12, false);
        const html = renderDashboardPage({
          siteName,
          companyName,
          companyEmail,
          paypalClientId,
          paypalMerchantId,
          nodeEnv: env.NODE_ENV || 'development'
        });

        const headers = new Headers({
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'no-store, max-age=0'
        });
        applySecurityHeaders(headers, { allowIframePreview: true });

        return new Response(html, { status: 200, headers });
      }

      // API ROUTE: Admin Stats Telemetry (/api/admin/stats)
      if (pathname === '/api/admin/stats') {
        const stats = getSystemStats();
        const logs = getAuditLogs();
        const transactions = getTransactions();

        const responseHeaders = new Headers({ 'Content-Type': 'application/json' });
        applyCorsHeaders(responseHeaders, origin);
        applySecurityHeaders(responseHeaders, { allowIframePreview: true });

        return new Response(
          JSON.stringify({ success: true, stats, logs, transactions }),
          { status: 200, headers: responseHeaders }
        );
      }

      // API ROUTE: Admin Audit Logs (/api/admin/logs)
      if (pathname === '/api/admin/logs') {
        const logs = getAuditLogs();

        const responseHeaders = new Headers({ 'Content-Type': 'application/json' });
        applyCorsHeaders(responseHeaders, origin);
        applySecurityHeaders(responseHeaders, { allowIframePreview: true });

        return new Response(
          JSON.stringify({ success: true, logs }),
          { status: 200, headers: responseHeaders }
        );
      }

      // ROUTE: 404 Not Found
      Logger.warn(`Route not found: ${pathname}`, { route: pathname, method: request.method });

      const notFoundHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>404 Not Found - ${siteName}</title>
  <style>
    body { font-family: system-ui, sans-serif; background: #f8fafc; color: #0f172a; text-align: center; padding: 4rem 1rem; }
    h1 { font-size: 2rem; margin-bottom: 0.5rem; }
    p { color: #64748b; margin-bottom: 1.5rem; }
    a { background: #1c1917; color: #fff; text-decoration: none; padding: 0.75rem 1.5rem; border-radius: 20px; font-weight: 600; }
  </style>
</head>
<body>
  <h1>404 - Page Not Found</h1>
  <p>The requested route "${pathname}" does not exist on this worker.</p>
  <a href="/">Return to Payment Page</a>
</body>
</html>`;

      const notFoundHeaders = new Headers({
        'Content-Type': 'text/html; charset=utf-8'
      });
      applySecurityHeaders(notFoundHeaders, { allowIframePreview: true });

      return new Response(notFoundHtml, { status: 404, headers: notFoundHeaders });

    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      Logger.error(`Worker Internal Error: ${errorMessage}`, { route: pathname, error: errorMessage });

      const errorHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>500 Internal Error</title>
  <style>
    body { font-family: system-ui, sans-serif; background: #fff1f2; color: #9f1239; padding: 3rem 1rem; text-align: center; }
    .card { background: #fff; max-width: 500px; margin: 0 auto; padding: 2rem; border-radius: 12px; border: 1px solid #fecdd3; }
    h1 { font-size: 1.5rem; margin-bottom: 0.5rem; }
    a { display: inline-block; margin-top: 1rem; color: #be123c; font-weight: bold; }
  </style>
</head>
<body>
  <div class="card">
    <h1>500 - Internal Server Error</h1>
    <p>An unexpected edge error occurred while processing your request.</p>
    <a href="/">Return Home</a>
  </div>
</body>
</html>`;

      const errorHeaders = new Headers({ 'Content-Type': 'text/html; charset=utf-8' });
      applySecurityHeaders(errorHeaders, { allowIframePreview: true });

      return new Response(errorHtml, { status: 500, headers: errorHeaders });
    }
  }
};
