import express from 'express';
import dotenv from 'dotenv';
import worker, { ExecutionContext } from './src/index';

dotenv.config();

const app = express();
const PORT = 3000;

// Raw body parser so we can forward request body stream if needed
app.use(express.raw({ type: '*/*' }));

// Bridge all HTTP requests directly into the Cloudflare Worker logic
app.all('*', async (req, res) => {
  try {
    const fullUrl = `${req.protocol}://${req.get('host') || 'localhost:3000'}${req.originalUrl}`;
    
    // Convert Node Express headers to Web Fetch Headers
    const headers = new Headers();
    Object.entries(req.headers).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach(v => headers.append(key, v));
      } else if (value !== undefined) {
        headers.set(key, value);
      }
    });

    // Request init options
    const init: RequestInit = {
      method: req.method,
      headers
    };

    if (req.method !== 'GET' && req.method !== 'HEAD' && req.body && Buffer.isBuffer(req.body) && req.body.length > 0) {
      init.body = req.body;
    }

    const webRequest = new Request(fullUrl, init);

    // Environment Variables passed to Worker
    const env = {
      PAYPAL_CLIENT_ID: process.env.PAYPAL_CLIENT_ID || 'sb',
      PAYPAL_CLIENT_SECRET: process.env.PAYPAL_CLIENT_SECRET || 'MY_PAYPAL_CLIENT_SECRET',
      PAYPAL_MERCHANT_ID: process.env.PAYPAL_MERCHANT_ID || 'M1234567890',
      SITE_NAME: process.env.SITE_NAME || 'Energize Cult Cafe Inc.',
      COMPANY_NAME: process.env.COMPANY_NAME || 'Energize Cult Cafe Inc.',
      COMPANY_EMAIL: process.env.COMPANY_EMAIL || 'payments@energizecultcafe.com',
      NODE_ENV: process.env.NODE_ENV || 'development'
    };

    // Mock Execution Context for Cloudflare Worker
    const ctx = {
      waitUntil: (promise: Promise<unknown>) => {
        promise.catch(err => console.error('[Worker waitUntil error]:', err));
      },
      passThroughOnException: () => {}
    };

    // Call Cloudflare Worker fetch handler
    const response = await worker.fetch(webRequest, env, ctx as unknown as ExecutionContext);

    // Set HTTP status code
    res.status(response.status);

    // Transfer Security Headers and standard headers
    response.headers.forEach((value, key) => {
      res.setHeader(key, value);
    });

    // Send Response Body
    const bodyArrayBuffer = await response.arrayBuffer();
    res.send(Buffer.from(bodyArrayBuffer));

  } catch (err) {
    console.error('Server bridge error:', err);
    res.status(500).send('Internal Server Error in Worker Bridge');
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`====================================================`);
  console.log(`☕ Energize Cult Cafe PayPal Worker running on port ${PORT}`);
  console.log(`🔗 Local Edge URL: http://localhost:${PORT}/`);
  console.log(`🩺 Health Check:   http://localhost:${PORT}/health`);
  console.log(`====================================================`);
});
