/**
 * HTML Template for the Payment Success Page (/success).
 * Pure HTML5, Modern CSS, Vanilla JavaScript.
 * Design Theme: Clean Minimalism.
 */

export interface SuccessTemplateConfig {
  siteName: string;
  companyName: string;
  companyEmail: string;
  orderId?: string;
  amount?: string;
  item?: string;
  note?: string;
}

export function renderSuccessPage(config: SuccessTemplateConfig): string {
  const {
    siteName = 'Energize Cult Cafe Inc.',
    companyName = 'Energize Cult Cafe Inc.',
    companyEmail = 'payments@energizecultcafe.com',
    orderId = 'PPL-SUCCESS-DEMO',
    amount = '0.00',
    item = 'Cult Cafe Order',
    note = ''
  } = config;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Payment Successful - ${siteName}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;700&display=swap" rel="stylesheet">

  <style>
    :root {
      --bg-main: #f8fafc;
      --bg-card: #ffffff;
      --text-main: #0f172a;
      --text-muted: #64748b;
      --text-subtle: #94a3b8;
      --primary: #f97316;
      --success-green: #16a34a;
      --success-bg: #f0fdf4;
      --border-color: #f1f5f9;
      --border-strong: #e2e8f0;
      --radius-3xl: 24px;
      --radius-xl: 16px;
      --font-sans: 'Plus Jakarta Sans', sans-serif;
      --font-mono: 'JetBrains Mono', monospace;
      --shadow-clean: 0 20px 40px -15px rgba(15, 23, 42, 0.05), 0 0 1px 1px rgba(15, 23, 42, 0.02);
    }

    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: var(--font-sans);
      background-color: var(--bg-main);
      color: var(--text-main);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 2rem 1rem;
    }

    .success-card {
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-3xl);
      max-width: 520px;
      width: 100%;
      padding: 3rem 2.25rem;
      box-shadow: var(--shadow-clean);
      text-align: center;
    }

    .icon-badge {
      width: 64px;
      height: 64px;
      background: var(--success-bg);
      color: var(--success-green);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 1.5rem auto;
      box-shadow: 0 4px 12px rgba(22, 163, 74, 0.15);
    }

    .eyebrow {
      font-size: 0.75rem;
      font-weight: 700;
      color: var(--success-green);
      text-transform: uppercase;
      letter-spacing: 0.12em;
      margin-bottom: 0.5rem;
    }

    h1 {
      font-size: 1.75rem;
      font-weight: 800;
      letter-spacing: -0.025em;
      color: var(--text-main);
      margin-bottom: 0.5rem;
    }

    p.subtitle {
      color: var(--text-muted);
      font-size: 0.9rem;
      margin-bottom: 2rem;
      line-height: 1.5;
    }

    .receipt-details {
      background: rgba(248, 250, 252, 0.7);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-xl);
      padding: 1.5rem;
      text-align: left;
      margin-bottom: 2rem;
    }

    .receipt-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.5rem 0;
      border-bottom: 1px solid var(--border-color);
      font-size: 0.875rem;
    }

    .receipt-row:last-child {
      border-bottom: none;
    }

    .receipt-label {
      color: var(--text-muted);
      font-weight: 600;
    }

    .receipt-val {
      font-weight: 700;
      color: var(--text-main);
      text-align: right;
    }

    .receipt-val.mono {
      font-family: var(--font-mono);
    }

    .actions {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .btn-primary {
      background: var(--text-main);
      color: #ffffff;
      padding: 0.9rem 1.5rem;
      border-radius: 99px;
      text-decoration: none;
      font-weight: 700;
      font-size: 0.9rem;
      transition: all 0.15s ease;
      display: inline-block;
      letter-spacing: 0.02em;
    }

    .btn-primary:hover {
      background: #1e293b;
      transform: translateY(-1px);
    }

    .btn-secondary {
      background: transparent;
      color: var(--text-muted);
      padding: 0.75rem 1.25rem;
      border: 1px solid var(--border-strong);
      border-radius: 99px;
      text-decoration: none;
      font-weight: 700;
      font-size: 0.85rem;
      cursor: pointer;
      transition: all 0.15s ease;
    }

    .btn-secondary:hover {
      background: #ffffff;
      color: var(--text-main);
    }

    footer {
      margin-top: 2rem;
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--text-subtle);
      text-transform: uppercase;
      letter-spacing: 0.08em;
      text-align: center;
    }

    footer a {
      color: var(--text-muted);
      text-decoration: none;
    }

    footer a:hover {
      color: var(--text-main);
    }
  </style>
</head>
<body>

  <main class="success-card" role="main">
    <div class="icon-badge" aria-hidden="true">
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
    </div>

    <div class="eyebrow">Transaction Approved</div>
    <h1>Payment Confirmed</h1>
    <p class="subtitle">Thank you for ordering with ${siteName}. Your PayPal order has been securely processed.</p>

    <div class="receipt-details">
      <div class="receipt-row">
        <span class="receipt-label">Order Reference</span>
        <span class="receipt-val mono">${orderId}</span>
      </div>
      <div class="receipt-row">
        <span class="receipt-label">Item / Description</span>
        <span class="receipt-val">${item}</span>
      </div>
      ${note ? `
      <div class="receipt-row">
        <span class="receipt-label">Order Note</span>
        <span class="receipt-val">${note}</span>
      </div>` : ''}
      <div class="receipt-row">
        <span class="receipt-label">Amount Paid</span>
        <span class="receipt-val mono" style="color:var(--success-green); font-size:1.1rem;">$${amount} USD</span>
      </div>
      <div class="receipt-row">
        <span class="receipt-label">Payment Method</span>
        <span class="receipt-val">PayPal Verified</span>
      </div>
      <div class="receipt-row">
        <span class="receipt-label">Merchant</span>
        <span class="receipt-val">${companyName}</span>
      </div>
    </div>

    <div class="actions">
      <a href="/" class="btn-primary">Return to Cafe Storefront</a>
      <button onclick="window.print()" class="btn-secondary">Print / Save Receipt</button>
    </div>
  </main>

  <footer>
    <p>&copy; ${new Date().getFullYear()} ${companyName}. Questions? <a href="mailto:${companyEmail}">Contact Support</a></p>
  </footer>

</body>
</html>`;
}

