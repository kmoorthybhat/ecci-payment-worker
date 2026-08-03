# ☕ Energize Cult Cafe Inc. - PayPal API Integration Layer (Cloudflare Worker)

A production-grade **API Integration Layer** deployed on Cloudflare Workers using GitHub integration that securely connects the payment landing page with PayPal REST APIs.

---

## 🏗️ Architecture & Security Model

```
GitHub Repository (main / PRs)
       │
       ▼
GitHub Actions CI/CD Pipeline
       │
       ▼
Cloudflare Workers (Edge API Integration Layer)
  ├── Server-Side OAuth 2.0 Token Management & Cache
  ├── POST /api/paypal/create-order
  ├── POST /api/paypal/capture-order
  ├── Security Headers (CSP, HSTS, Rate Limiting, CORS)
  └── Static Landing & Receipt Page Renderer
       │
       ▼
PayPal v2 REST APIs (api-m.paypal.com)
```

> **Security Rule**: The browser client NEVER sees or handles PayPal secret keys, merchant credentials, or access tokens. All sensitive transactions execute server-to-server inside the Cloudflare Worker.

---

## 📁 Repository Structure

```
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions CI/CD Deployment Pipeline
├── wrangler.jsonc              # Cloudflare Worker Configuration
├── package.json                # Dependencies & Build Scripts
├── .env.example                # Environment Variable Template
├── ENV_VARIABLES.md            # Detailed Environment Variable Reference
├── README.md                   # System Documentation
├── server.ts                   # Local Express Edge Server Bridge
└── src/
    ├── index.ts                # Cloudflare Worker Request Router
    ├── services/
    │   ├── paypal.ts           # Server-side PayPal OAuth 2.0 & REST API Integration
    │   └── stats.ts            # Admin Telemetry & Real-time Audit Service
    ├── utils/
    │   ├── rate-limit.ts       # Edge Sliding-Window Rate Limiter
    │   ├── security.ts         # CSP, HSTS, CORS & Input Sanitization
    │   └── logger.ts           # Structured Audit JSON Logger
    └── templates/
        ├── landing.ts          # Payment Landing Page
        ├── success.ts          # Payment Receipt Page
        ├── cancel.ts           # Payment Cancelled Page
        └── dashboard.ts        # PayFlow Control Center SPA Dashboard
```

---

## 🌐 Complete API Endpoints

| Endpoint | Method | Description | Security / Guards |
| :--- | :---: | :--- | :--- |
| `GET /` | `GET` | Serve the clean payment landing page with PayPal buttons | CSP, HSTS, X-Frame-Options |
| `GET /admin` | `GET` | PayFlow Control Center Technical SPA Dashboard | CSP, HSTS, Security Headers |
| `GET /api/admin/stats` | `GET` | Real-time telemetry, transaction registry, and audit log feed | CORS, Security Headers |
| `GET /health` | `GET` | Return service status, uptime, and configuration state | Security headers |
| `POST /api/paypal/create-order` | `POST` | Server-to-server request to PayPal v2 Create Order API | Rate limited (30 req/min), CORS, Sanitized |
| `POST /api/paypal/capture-order` | `POST` | Server-to-server request to PayPal v2 Capture Order API | Rate limited (30 req/min), CORS, Sanitized |
| `GET /success` | `GET` | Serve payment receipt page with transaction summary | Security headers |
| `GET /cancel` | `GET` | Serve payment cancellation page with easy retry | Security headers |

---

## 🔒 Security & Enterprise Compliance

1. **OAuth 2.0 Token Management**:
   - Automated client credentials authentication with PayPal token endpoint (`/v1/oauth2/token`).
   - In-memory token caching with expiration buffers to minimize auth overhead.
2. **Rate Limiting**:
   - Edge sliding-window rate limiter protecting `/api/paypal/*` endpoints against brute force and DDoS.
3. **HTTP Security Headers**:
   - Strict Content Security Policy (CSP) scoped to PayPal SDKs and Google Fonts.
   - HSTS (`max-age=31536000; includeSubDomains; preload`).
   - `X-Frame-Options` (`SAMEORIGIN`), `nosniff`, `Permissions-Policy`.
4. **Input Sanitization**:
   - Strict type checks and input sanitization on amount, currency, order notes, and order IDs.

---

## 🤖 GitHub CI/CD Automated Deployments

Automated deployment is configured via `.github/workflows/deploy.yml`:

- **Main Branch Push**: Automatically builds, tests, and deploys to **Cloudflare Production**.
- **Pull Requests**: Automatically builds, tests, and deploys to **Cloudflare Preview Environment**.

### Required GitHub Repository Secrets

Navigate to `Settings -> Secrets and variables -> Actions` in your GitHub repository and add:

- `CLOUDFLARE_API_TOKEN`: Cloudflare API token with Workers permission.
- `CLOUDFLARE_ACCOUNT_ID`: Your Cloudflare Account ID.
- `PAYPAL_CLIENT_ID`: Your PayPal Client ID.
- `PAYPAL_CLIENT_SECRET`: Your PayPal REST API Secret.

---

## 💻 Local Development & Testing

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the local dev server:
   ```bash
   npm run dev
   ```
3. Test health check:
   ```bash
   curl -i http://localhost:3000/health
   ```
4. Verify TypeScript compilation:
   ```bash
   npm run lint
   ```

---

## 📄 License

Apache-2.0 © Energize Cult Cafe Inc.

