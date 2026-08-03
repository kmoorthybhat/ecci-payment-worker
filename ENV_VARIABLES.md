# Environment Variables & Secrets Reference

This document details all environment variables and secrets required by the **Energize Cult Cafe Inc. PayPal Worker API Integration Layer**.

---

## 1. PayPal REST API Credentials (Secrets)

These credentials must **NEVER** be committed to the code repository or exposed in client-side code.

| Variable Name | Required | Default | Description |
| :--- | :---: | :---: | :--- |
| `PAYPAL_CLIENT_ID` | Yes | `sb` | Your PayPal REST API App Client ID (Sandbox or Live). |
| `PAYPAL_CLIENT_SECRET` | Yes | `MY_PAYPAL_CLIENT_SECRET` | Secret key used for server-to-server OAuth 2.0 token generation. |
| `PAYPAL_MERCHANT_ID` | No | `M1234567890` | Optional merchant account identifier for multi-seller routing. |

---

## 2. Server & Environment Variables

| Variable Name | Required | Default | Description |
| :--- | :---: | :---: | :--- |
| `NODE_ENV` | Yes | `development` | Environment mode (`development` or `production`). Controls PayPal API endpoint URL selection. |
| `SITE_NAME` | Yes | `Energize Cult Cafe Inc.` | Display title used across payment pages. |
| `COMPANY_NAME` | Yes | `Energize Cult Cafe Inc.` | Company legal name for receipts and headers. |
| `COMPANY_EMAIL` | Yes | `payments@energizecultcafe.com` | Customer support email address. |

---

## 3. GitHub & Cloudflare Deployment Secrets

Set these inside **GitHub Repo Settings -> Secrets and variables -> Actions**:

| Secret Name | Required | Description |
| :--- | :---: | :--- |
| `CLOUDFLARE_API_TOKEN` | Yes | Cloudflare API Token with Workers deployment scope. |
| `CLOUDFLARE_ACCOUNT_ID` | Yes | Cloudflare Account ID found in your Cloudflare dashboard overview. |
| `PAYPAL_CLIENT_ID` | Yes | Transferred securely during GitHub Actions automated deployment. |
| `PAYPAL_CLIENT_SECRET` | Yes | Transferred securely to Cloudflare Worker Secrets during deployment. |

---

## 4. Setting Secrets via Wrangler CLI

You can manually bind secrets directly to your Cloudflare Worker isolate using Wrangler:

```bash
# Set PayPal Secret Key
npx wrangler secret put PAYPAL_CLIENT_SECRET

# Set PayPal Client ID
npx wrangler secret put PAYPAL_CLIENT_ID
```
