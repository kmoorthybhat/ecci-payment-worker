/**
 * HTML Template for the Energize Cult Cafe Inc. Payment Landing Page.
 * Pure HTML5, Modern CSS, Vanilla JavaScript. Zero frameworks.
 * WCAG AA Compliant, Mobile-First, Optimized for Performance.
 * Design Theme: Clean Minimalism.
 */

export interface LandingTemplateConfig {
  siteName: string;
  companyName: string;
  companyEmail: string;
  paypalClientId: string;
  paypalMerchantId: string;
}

export function renderLandingPage(config: LandingTemplateConfig): string {
  const {
    siteName = 'Energize Cult Cafe Inc.',
    companyName = 'Energize Cult Cafe Inc.',
    companyEmail = 'payments@energizecultcafe.com',
    paypalClientId = 'sb',
    paypalMerchantId = ''
  } = config;

  const isDemoClientId = !paypalClientId || paypalClientId === 'sb' || paypalClientId === 'MY_PAYPAL_CLIENT_ID';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Secure PayPal Checkout for ${siteName}">
  <title>${siteName} - Secure PayPal Payment</title>

  <!-- Preconnect & Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;700&display=swap" rel="stylesheet">

  <style>
    /* CSS Reset & Clean Minimalism Variables */
    :root {
      --bg-main: #f8fafc; /* slate-50 */
      --bg-card: #ffffff;
      --bg-card-subtle: rgba(248, 250, 252, 0.6); /* slate-50/60 */
      --text-main: #0f172a; /* slate-900 */
      --text-muted: #64748b; /* slate-500 */
      --text-subtle: #94a3b8; /* slate-400 */
      --primary: #f97316; /* Energize Orange */
      --primary-hover: #ea580c;
      --primary-light: #fff7ed;
      --accent-dark: #0f172a;
      --border-color: #f1f5f9; /* slate-100 */
      --border-strong: #e2e8f0; /* slate-200 */
      --focus-ring: 0 0 0 3px rgba(249, 115, 22, 0.25);
      --radius-3xl: 24px;
      --radius-xl: 16px;
      --radius-lg: 12px;
      --radius-md: 8px;
      --shadow-clean: 0 20px 40px -15px rgba(15, 23, 42, 0.05), 0 0 1px 1px rgba(15, 23, 42, 0.02);
      --font-sans: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
      --font-mono: 'JetBrains Mono', monospace;
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
      line-height: 1.5;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      -webkit-font-smoothing: antialiased;
    }

    .skip-link {
      position: absolute;
      top: -40px;
      left: 0;
      background: var(--text-main);
      color: #fff;
      padding: 8px 16px;
      z-index: 100;
      transition: top 0.2s;
      border-radius: 0 0 8px 0;
      text-decoration: none;
      font-weight: 600;
      font-size: 0.85rem;
    }
    .skip-link:focus {
      top: 0;
    }

    /* Clean Minimalist Header */
    header {
      width: 100%;
      max-width: 1024px;
      margin: 0 auto;
      padding: 2rem 1.5rem 1rem 1.5rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 0.85rem;
    }

    .brand-logo-badge {
      width: 40px;
      height: 40px;
      background: var(--primary);
      color: #ffffff;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 12px rgba(249, 115, 22, 0.25);
    }

    .brand-title {
      font-size: 1.15rem;
      font-weight: 800;
      letter-spacing: -0.025em;
      text-transform: uppercase;
      color: var(--text-main);
    }

    .header-badge {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.75rem;
      font-weight: 700;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.1em;
    }

    .status-dot {
      width: 8px;
      height: 8px;
      background-color: #22c55e;
      border-radius: 50%;
      box-shadow: 0 0 8px rgba(34, 197, 94, 0.4);
    }

    /* Main Container */
    main {
      flex: 1;
      width: 100%;
      max-width: 1024px;
      margin: 0 auto 2.5rem auto;
      padding: 0 1.5rem;
    }

    .eyebrow {
      font-size: 0.75rem;
      font-weight: 700;
      color: var(--text-subtle);
      text-transform: uppercase;
      letter-spacing: 0.12em;
      margin-bottom: 1.25rem;
    }

    /* Main Modern Minimal Card */
    .card-container {
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-3xl);
      box-shadow: var(--shadow-clean);
      overflow: hidden;
      display: grid;
      grid-template-columns: 1fr;
    }

    @media (min-width: 800px) {
      .card-container {
        grid-template-columns: 1fr 1fr;
      }
    }

    /* Panel Left: Item Selection */
    .panel-left {
      padding: 2.5rem 2rem;
      background: var(--bg-card-subtle);
      border-bottom: 1px solid var(--border-color);
    }

    @media (min-width: 800px) {
      .panel-left {
        border-bottom: none;
        border-right: 1px solid var(--border-color);
      }
    }

    /* Panel Right: Payment & Summary */
    .panel-right {
      padding: 2.5rem 2rem;
      background: #ffffff;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    .section-title {
      font-size: 1.35rem;
      font-weight: 800;
      letter-spacing: -0.02em;
      color: var(--text-main);
      margin-bottom: 0.25rem;
    }

    .section-subtitle {
      font-size: 0.875rem;
      color: var(--text-muted);
      margin-bottom: 1.5rem;
    }

    /* Item Options */
    .items-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      margin-bottom: 1.5rem;
    }

    .item-option {
      position: relative;
      background: #ffffff;
      border: 1px solid var(--border-strong);
      border-radius: var(--radius-xl);
      padding: 1rem 1.15rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: space-between;
      transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .item-option:hover {
      border-color: #cbd5e1;
      transform: translateY(-1px);
    }

    .item-option.active {
      border-color: var(--primary);
      background: #ffffff;
      box-shadow: 0 4px 14px rgba(249, 115, 22, 0.08), 0 0 0 2px var(--primary);
    }

    .item-radio {
      accent-color: var(--primary);
      width: 18px;
      height: 18px;
      margin-right: 0.85rem;
    }

    .item-info {
      flex: 1;
    }

    .item-name {
      font-weight: 700;
      font-size: 0.95rem;
      color: var(--text-main);
      line-height: 1.3;
    }

    .item-desc {
      font-size: 0.8rem;
      color: var(--text-muted);
      margin-top: 0.15rem;
    }

    .item-price {
      font-family: var(--font-mono);
      font-weight: 700;
      font-size: 1rem;
      color: var(--text-main);
      white-space: nowrap;
      margin-left: 0.5rem;
    }

    /* Form Fields */
    .form-group {
      margin-bottom: 1.25rem;
    }

    .form-label {
      display: block;
      font-size: 0.75rem;
      font-weight: 700;
      color: var(--text-subtle);
      text-transform: uppercase;
      letter-spacing: 0.08em;
      margin-bottom: 0.4rem;
    }

    .input-wrapper {
      position: relative;
      display: flex;
      align-items: center;
    }

    .currency-symbol {
      position: absolute;
      left: 14px;
      font-family: var(--font-mono);
      font-weight: 700;
      color: var(--text-muted);
    }

    .form-input {
      width: 100%;
      padding: 0.75rem 0.85rem 0.75rem 2.2rem;
      font-size: 0.95rem;
      font-family: inherit;
      border: 1px solid var(--border-strong);
      border-radius: var(--radius-lg);
      background: #ffffff;
      color: var(--text-main);
      transition: all 0.15s ease;
    }

    .form-input:focus {
      outline: none;
      border-color: var(--primary);
      box-shadow: var(--focus-ring);
    }

    textarea.form-input {
      padding: 0.75rem 0.85rem;
      resize: vertical;
      min-height: 65px;
    }

    /* Tip Grid */
    .tip-grid {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 0.4rem;
    }

    .tip-btn {
      background: #ffffff;
      border: 1px solid var(--border-strong);
      border-radius: var(--radius-md);
      padding: 0.5rem 0.2rem;
      font-size: 0.8rem;
      font-weight: 700;
      color: var(--text-main);
      cursor: pointer;
      transition: all 0.15s ease;
      text-align: center;
    }

    .tip-btn:hover {
      border-color: var(--primary);
      color: var(--primary);
    }

    .tip-btn.active {
      background: var(--text-main);
      color: #ffffff;
      border-color: var(--text-main);
    }

    /* Summary Component */
    .summary-card {
      background: var(--bg-card-subtle);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-xl);
      padding: 1.25rem 1.5rem;
      margin-bottom: 1.5rem;
    }

    .summary-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.4rem 0;
      font-size: 0.875rem;
      color: var(--text-muted);
    }

    .summary-row .price-val {
      font-family: var(--font-mono);
      font-weight: 600;
      color: var(--text-main);
    }

    .summary-row.total {
      border-top: 1px solid var(--border-strong);
      margin-top: 0.75rem;
      padding-top: 0.85rem;
    }

    .summary-row.total .total-label {
      font-size: 0.8rem;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: var(--text-main);
    }

    .summary-row.total .total-amount {
      font-family: var(--font-mono);
      font-size: 1.85rem;
      font-weight: 800;
      color: var(--text-main);
      letter-spacing: -0.03em;
    }

    /* PayPal & Simulator */
    #paypal-button-container {
      min-height: 140px;
      margin-top: 1rem;
    }

    .simulator-box {
      background: #fffbeb;
      border: 1px solid #fef3c7;
      border-radius: var(--radius-xl);
      padding: 1.25rem;
      margin-bottom: 1.25rem;
      font-size: 0.85rem;
      color: #92400e;
    }

    .simulator-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      background: #ffc439;
      color: #003087;
      font-weight: 800;
      font-style: italic;
      font-size: 1.1rem;
      padding: 0.85rem;
      border: none;
      border-radius: var(--radius-lg);
      cursor: pointer;
      text-align: center;
      margin-top: 0.85rem;
      transition: transform 0.15s ease, background 0.15s ease;
      text-decoration: none;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    }

    .simulator-btn:hover {
      background: #f2ba32;
      transform: translateY(-1px);
    }

    .alert-banner {
      display: none;
      padding: 0.85rem 1rem;
      border-radius: var(--radius-lg);
      margin-bottom: 1.25rem;
      font-size: 0.875rem;
      font-weight: 600;
    }

    .alert-banner.error {
      display: block;
      background: #fef2f2;
      border: 1px solid #fecaca;
      color: #991b1b;
    }

    .alert-banner.info {
      display: block;
      background: #eff6ff;
      border: 1px solid #bfdbfe;
      color: #1e40af;
    }

    /* Security Badges */
    .security-row {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      font-size: 0.7rem;
      font-weight: 700;
      color: var(--text-subtle);
      text-transform: uppercase;
      letter-spacing: 0.1em;
      margin-top: 1.25rem;
      opacity: 0.75;
    }

    /* Minimalist Footer */
    footer {
      width: 100%;
      max-width: 1024px;
      margin: 0 auto;
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      border-top: 1px solid var(--border-color);
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--text-subtle);
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }

    @media (min-width: 640px) {
      footer {
        flex-direction: row;
      }
    }

    footer a {
      color: var(--text-muted);
      text-decoration: none;
      transition: color 0.15s ease;
    }

    footer a:hover {
      color: var(--text-main);
    }
  </style>
</head>
<body>
  <a href="#main-content" class="skip-link">Skip to main content</a>

  <header role="banner">
    <div class="brand">
      <div class="brand-logo-badge" aria-hidden="true">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      </div>
      <span class="brand-title">${siteName}</span>
    </div>
    <div class="header-badge">
      <div class="status-dot" aria-hidden="true"></div>
      <span>Secure Checkout</span>
    </div>
  </header>

  <main id="main-content" role="main">
    <div id="alert-box" class="alert-banner" role="alert"></div>

    <div class="card-container">
      <!-- Panel Left: Selection -->
      <section class="panel-left" aria-labelledby="select-order-title">
        <h2 class="eyebrow" id="select-order-title">01. Order Summary</h2>

        <div class="items-list" role="radiogroup" aria-label="Cafe Payment Options">
          <label class="item-option active" id="option-coldbrew">
            <input type="radio" name="order_item" value="coldbrew" data-price="8.50" data-name="Artisan Cold Brew Concentrate (16oz)" class="item-radio" checked>
            <div class="item-info">
              <div class="item-name">Artisan Cold Brew Concentrate (16oz)</div>
              <div class="item-desc">Slow-steeped 24hr single origin batch</div>
            </div>
            <div class="item-price">$8.50</div>
          </label>

          <label class="item-option" id="option-espresso">
            <input type="radio" name="order_item" value="espresso" data-price="18.00" data-name="Energize Espresso Tasting Box" class="item-radio">
            <div class="item-info">
              <div class="item-name">Energize Espresso Tasting Box</div>
              <div class="item-desc">3x 250g seasonal roasts with tasting notes</div>
            </div>
            <div class="item-price">$18.00</div>
          </label>

          <label class="item-option" id="option-beans">
            <input type="radio" name="order_item" value="beans" data-price="24.00" data-name="Cult Reserve Whole Beans (12oz)" class="item-radio">
            <div class="item-info">
              <div class="item-name">Cult Reserve Whole Beans (12oz)</div>
              <div class="item-desc">High-altitude Ethiopian Yirgacheffe</div>
            </div>
            <div class="item-price">$24.00</div>
          </label>

          <label class="item-option" id="option-catering">
            <input type="radio" name="order_item" value="catering" data-price="100.00" data-name="Cafe Event & Catering Deposit" class="item-radio">
            <div class="item-info">
              <div class="item-name">Cafe Event & Catering Deposit</div>
              <div class="item-desc">Hold date for mobile espresso bar service</div>
            </div>
            <div class="item-price">$100.00</div>
          </label>

          <label class="item-option" id="option-custom">
            <input type="radio" name="order_item" value="custom" data-price="0.00" data-name="Custom Quick Tab / Invoice" class="item-radio">
            <div class="item-info">
              <div class="item-name">Custom Quick Tab / Invoice</div>
              <div class="item-desc">Enter custom invoice amount below</div>
            </div>
            <div class="item-price">Custom</div>
          </label>
        </div>

        <div id="custom-amount-group" class="form-group" style="display:none;">
          <label for="custom-amount-input" class="form-label">Custom Invoice Amount (USD)</label>
          <div class="input-wrapper">
            <span class="currency-symbol">$</span>
            <input type="number" id="custom-amount-input" class="form-input" min="1.00" step="0.50" value="15.00" placeholder="0.00">
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Barista Tip</label>
          <div class="tip-grid">
            <button type="button" class="tip-btn active" data-tip="0">0%</button>
            <button type="button" class="tip-btn" data-tip="15">15%</button>
            <button type="button" class="tip-btn" data-tip="18">18%</button>
            <button type="button" class="tip-btn" data-tip="20">20%</button>
            <button type="button" class="tip-btn" data-tip="custom">Custom</button>
          </div>
        </div>

        <div class="form-group" style="margin-bottom:0;">
          <label for="order-note" class="form-label">Special Instructions</label>
          <textarea id="order-note" class="form-input" placeholder="Grind size, table number, or pickup instructions..."></textarea>
        </div>
      </section>

      <!-- Panel Right: Payment -->
      <section class="panel-right" aria-labelledby="payment-title">
        <div>
          <h2 class="eyebrow" id="payment-title">02. Secure Payment</h2>
          <h1 class="section-title">PayPal Checkout</h1>
          <p class="section-subtitle">Complete your transaction safely via PayPal edge integration</p>

          <div class="summary-card">
            <div class="summary-row">
              <span id="summary-item-name">Artisan Cold Brew Concentrate</span>
              <span id="summary-item-price" class="price-val">$8.50</span>
            </div>
            <div class="summary-row">
              <span>Barista Tip</span>
              <span id="summary-tip" class="price-val">$0.00</span>
            </div>
            <div class="summary-row total">
              <span class="total-label">Total Due</span>
              <span id="summary-total" class="total-amount">$8.50</span>
            </div>
          </div>

          <div id="paypal-section">
            ${isDemoClientId ? `
              <div class="simulator-box">
                <strong style="display:block; margin-bottom:0.25rem;">⚡ Demo Sandbox Active</strong>
                <span>Testing mode enabled. Click below to simulate instant PayPal order approval!</span>
                <a href="#" id="simulate-paypal-btn" class="simulator-btn" role="button">
                  PayPal Demo Checkout
                </a>
              </div>
            ` : ''}

            <div id="paypal-button-container"></div>
          </div>
        </div>

        <div class="security-row">
          <span>256-bit SSL</span>
          <span>&middot;</span>
          <span>PCI-DSS Compliant</span>
          <span>&middot;</span>
          <span>PayPal Verified</span>
        </div>
      </section>
    </div>
  </main>

  <footer role="contentinfo">
    <div>&copy; ${new Date().getFullYear()} ${companyName}. ALL RIGHTS RESERVED.</div>
    <div style="display:flex; gap:1.25rem;">
      <a href="mailto:${companyEmail}">Support</a>
      <a href="/health">Edge Health</a>
    </div>
  </footer>

  <!-- Conditional PayPal JS SDK Loading -->
  ${!isDemoClientId ? `
    <script src="https://www.paypal.com/sdk/js?client-id=${paypalClientId}&currency=USD&components=buttons" async></script>
  ` : ''}

  <script>
    (function() {
      // DOM Elements
      const radios = document.querySelectorAll('input[name="order_item"]');
      const itemOptions = document.querySelectorAll('.item-option');
      const customGroup = document.getElementById('custom-amount-group');
      const customInput = document.getElementById('custom-amount-input');
      const tipBtns = document.querySelectorAll('.tip-btn');
      const orderNote = document.getElementById('order-note');

      const summaryItemName = document.getElementById('summary-item-name');
      const summaryItemPrice = document.getElementById('summary-item-price');
      const summaryTip = document.getElementById('summary-tip');
      const summaryTotal = document.getElementById('summary-total');
      const alertBox = document.getElementById('alert-box');

      // State
      let selectedPrice = 8.50;
      let selectedItemName = "Artisan Cold Brew Concentrate (16oz)";
      let tipPercentage = 0;
      let calculatedTip = 0.00;
      let calculatedTotal = 8.50;

      function showAlert(msg, type = 'info') {
        alertBox.textContent = msg;
        alertBox.className = 'alert-banner ' + type;
      }

      function recalculate() {
        const selectedRadio = document.querySelector('input[name="order_item"]:checked');
        if (!selectedRadio) return;

        if (selectedRadio.value === 'custom') {
          customGroup.style.display = 'block';
          selectedPrice = parseFloat(customInput.value) || 0.00;
          selectedItemName = "Custom Quick Tab / Invoice";
        } else {
          customGroup.style.display = 'none';
          selectedPrice = parseFloat(selectedRadio.getAttribute('data-price')) || 0.00;
          selectedItemName = selectedRadio.getAttribute('data-name');
        }

        // Calculate Tip
        calculatedTip = (selectedPrice * (tipPercentage / 100));
        calculatedTotal = selectedPrice + calculatedTip;

        // Update UI
        summaryItemName.textContent = selectedItemName;
        summaryItemPrice.textContent = '$' + selectedPrice.toFixed(2);
        summaryTip.textContent = '$' + calculatedTip.toFixed(2);
        summaryTotal.textContent = '$' + calculatedTotal.toFixed(2);
      }

      // Radio Selection Handlers
      radios.forEach(radio => {
        radio.addEventListener('change', (e) => {
          itemOptions.forEach(opt => opt.classList.remove('active'));
          e.target.closest('.item-option').classList.add('active');
          recalculate();
        });
      });

      customInput.addEventListener('input', recalculate);

      // Tip Selection Handlers
      tipBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
          tipBtns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');

          const tipVal = btn.getAttribute('data-tip');
          if (tipVal === 'custom') {
            const userTip = prompt("Enter custom tip amount ($):", "2.00");
            if (userTip !== null) {
              const parsed = parseFloat(userTip);
              if (!isNaN(parsed) && parsed >= 0) {
                tipPercentage = 0;
                calculatedTip = parsed;
                calculatedTotal = selectedPrice + calculatedTip;
                summaryTip.textContent = '$' + calculatedTip.toFixed(2);
                summaryTotal.textContent = '$' + calculatedTotal.toFixed(2);
                return;
              }
            }
            tipPercentage = 0;
          } else {
            tipPercentage = parseInt(tipVal, 10);
          }
          recalculate();
        });
      });

      // Demo Simulator Handler
      const simBtn = document.getElementById('simulate-paypal-btn');
      if (simBtn) {
        simBtn.addEventListener('click', (e) => {
          e.preventDefault();
          const demoOrderId = 'DEMO-PPL-' + Math.floor(100000 + Math.random() * 900000);
          const redirectUrl = '/success?orderID=' + demoOrderId + 
            '&amount=' + calculatedTotal.toFixed(2) + 
            '&item=' + encodeURIComponent(selectedItemName) +
            '&note=' + encodeURIComponent(orderNote.value);
          window.location.href = redirectUrl;
        });
      }

      // Initialize PayPal Buttons using worker backend endpoints
      function initPayPalButtons() {
        if (typeof paypal !== 'undefined' && paypal.Buttons) {
          paypal.Buttons({
            style: {
              layout: 'vertical',
              color: 'gold',
              shape: 'rect',
              label: 'paypal'
            },
            createOrder: async function() {
              try {
                const response = await fetch('/api/paypal/create-order', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    amount: calculatedTotal.toFixed(2),
                    item_name: selectedItemName,
                    custom_note: orderNote.value,
                    currency: 'USD'
                  })
                });

                if (!response.ok) {
                  const errorData = await response.json();
                  throw new Error(errorData.message || 'Failed to create order via backend');
                }

                const resData = await response.json();
                return resData.order.id;
              } catch (err) {
                console.error('Error creating PayPal order via API:', err);
                showAlert('Could not initialize payment order. Please try again.', 'error');
                throw err;
              }
            },
            onApprove: async function(data) {
              try {
                showAlert('Capturing payment via secure edge worker...', 'info');
                const response = await fetch('/api/paypal/capture-order', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ orderId: data.orderID })
                });

                if (!response.ok) {
                  const errorData = await response.json();
                  throw new Error(errorData.message || 'Failed to capture order via backend');
                }

                const resData = await response.json();
                const capturedId = resData.capture.id || data.orderID;
                window.location.href = '/success?orderID=' + capturedId + 
                  '&amount=' + calculatedTotal.toFixed(2) + 
                  '&item=' + encodeURIComponent(selectedItemName) +
                  '&note=' + encodeURIComponent(orderNote.value);
              } catch (err) {
                console.error('Error capturing PayPal order via API:', err);
                showAlert('Payment authorization succeeded, but capture failed. Please contact support.', 'error');
              }
            },
            onCancel: function() {
              window.location.href = '/cancel';
            },
            onError: function(err) {
              console.error('PayPal Buttons Error:', err);
              showAlert('A payment error occurred. Please try again or choose another payment method.', 'error');
            }
          }).render('#paypal-button-container');
        }
      }

      // Check for window load to render PayPal buttons
      window.addEventListener('load', () => {
        recalculate();
        initPayPalButtons();
      });

    })();
  </script>
</body>
</html>`;
}

