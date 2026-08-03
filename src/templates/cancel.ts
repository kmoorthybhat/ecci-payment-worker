/**
 * HTML Template for the Payment Cancelled Page (/cancel).
 * Pure HTML5, Modern CSS, Vanilla JavaScript.
 * Design Theme: Clean Minimalism.
 */

export interface CancelTemplateConfig {
  siteName: string;
  companyName: string;
  companyEmail: string;
}

export function renderCancelPage(config: CancelTemplateConfig): string {
  const {
    siteName = 'Energize Cult Cafe Inc.',
    companyName = 'Energize Cult Cafe Inc.',
    companyEmail = 'payments@energizecultcafe.com'
  } = config;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Payment Cancelled - ${siteName}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">

  <style>
    :root {
      --bg-main: #f8fafc;
      --bg-card: #ffffff;
      --text-main: #0f172a;
      --text-muted: #64748b;
      --text-subtle: #94a3b8;
      --primary: #f97316;
      --cancel-amber: #d97706;
      --cancel-bg: #fffbeb;
      --border-color: #f1f5f9;
      --border-strong: #e2e8f0;
      --radius-3xl: 24px;
      --font-sans: 'Plus Jakarta Sans', sans-serif;
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

    .cancel-card {
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-3xl);
      max-width: 480px;
      width: 100%;
      padding: 3rem 2.25rem;
      box-shadow: var(--shadow-clean);
      text-align: center;
    }

    .icon-badge {
      width: 64px;
      height: 64px;
      background: var(--cancel-bg);
      color: var(--cancel-amber);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 1.5rem auto;
      box-shadow: 0 4px 12px rgba(217, 119, 6, 0.15);
    }

    .eyebrow {
      font-size: 0.75rem;
      font-weight: 700;
      color: var(--cancel-amber);
      text-transform: uppercase;
      letter-spacing: 0.12em;
      margin-bottom: 0.5rem;
    }

    h1 {
      font-size: 1.65rem;
      font-weight: 800;
      letter-spacing: -0.025em;
      color: var(--text-main);
      margin-bottom: 0.75rem;
    }

    p {
      color: var(--text-muted);
      font-size: 0.925rem;
      line-height: 1.6;
      margin-bottom: 2rem;
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

  <main class="cancel-card" role="main">
    <div class="icon-badge" aria-hidden="true">
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="8" x2="12" y2="12"></line>
        <line x1="12" y1="16" x2="12.01" y2="16"></line>
      </svg>
    </div>

    <div class="eyebrow">Checkout Interrupted</div>
    <h1>Payment Cancelled</h1>
    <p>Your PayPal transaction was safely cancelled. No charges were made to your account. You can return to the store and try again whenever you are ready.</p>

    <div class="actions">
      <a href="/" class="btn-primary">Try Payment Again</a>
    </div>
  </main>

  <footer>
    <p>&copy; ${new Date().getFullYear()} ${companyName}. Questions? <a href="mailto:${companyEmail}">Contact Support</a></p>
  </footer>

</body>
</html>`;
}

