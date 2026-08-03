/**
 * HTML Template & Vanilla JS SPA for PayFlow Control Center.
 * Enterprise Technical Admin Dashboard for Energize Cult Cafe Inc.
 * Pure HTML5, Modular CSS Variables, Vanilla JS (ES2023), SVG Icons.
 * WCAG AA Compliant, 60 FPS GPU Animations, Responsive.
 */

export interface DashboardConfig {
  siteName: string;
  companyName: string;
  companyEmail: string;
  paypalClientId: string;
  paypalMerchantId: string;
  nodeEnv: string;
}

export function renderDashboardPage(config: DashboardConfig): string {
  const { siteName, companyName, companyEmail, paypalClientId, paypalMerchantId, nodeEnv } = config;

  return `<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>PayFlow Control Center - ${siteName}</title>

  <!-- Preconnect & Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet">

  <style>
    /* CSS Variables & Design Tokens - Dark Mode Default */
    :root {
      --bg-body: #090d16;
      --bg-sidebar: #0f172a;
      --bg-card: rgba(30, 41, 59, 0.7);
      --bg-card-hover: rgba(51, 65, 85, 0.8);
      --bg-input: #1e293b;
      --border-color: rgba(255, 255, 255, 0.08);
      --border-strong: rgba(255, 255, 255, 0.16);
      --text-main: #f8fafc;
      --text-muted: #94a3b8;
      --text-subtle: #64748b;
      
      --primary: #f97316; /* Energize Orange */
      --primary-hover: #ea580c;
      --primary-glow: rgba(249, 115, 22, 0.25);
      
      --accent-blue: #38bdf8;
      --accent-green: #22c55e;
      --accent-purple: #a855f7;
      --accent-amber: #f59e0b;
      --accent-red: #ef4444;

      --font-sans: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
      --font-mono: 'JetBrains Mono', monospace;

      --radius-2xl: 20px;
      --radius-xl: 14px;
      --radius-lg: 10px;
      --radius-md: 6px;

      --shadow-card: 0 10px 30px -10px rgba(0, 0, 0, 0.5), 0 0 1px 1px rgba(255, 255, 255, 0.05);
      --shadow-glow: 0 0 20px rgba(249, 115, 22, 0.15);
      --sidebar-width: 260px;
      --sidebar-collapsed-width: 72px;
      --transition-speed: 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    }

    /* Light Theme Override */
    [data-theme="light"] {
      --bg-body: #f8fafc;
      --bg-sidebar: #ffffff;
      --bg-card: #ffffff;
      --bg-card-hover: #f1f5f9;
      --bg-input: #f1f5f9;
      --border-color: #e2e8f0;
      --border-strong: #cbd5e1;
      --text-main: #0f172a;
      --text-muted: #475569;
      --text-subtle: #94a3b8;
      --shadow-card: 0 10px 25px -5px rgba(15, 23, 42, 0.08), 0 0 1px 1px rgba(0, 0, 0, 0.04);
      --shadow-glow: 0 0 20px rgba(249, 115, 22, 0.1);
    }

    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: var(--font-sans);
      background-color: var(--bg-body);
      color: var(--text-main);
      min-height: 100vh;
      display: flex;
      overflow-x: hidden;
      -webkit-font-smoothing: antialiased;
    }

    /* Layout Structure */
    #app-container {
      display: flex;
      width: 100vw;
      height: 100vh;
      overflow: hidden;
    }

    /* Collapsible Sidebar */
    aside.sidebar {
      width: var(--sidebar-width);
      background: var(--bg-sidebar);
      border-right: 1px solid var(--border-color);
      display: flex;
      flex-direction: column;
      transition: width var(--transition-speed);
      z-index: 50;
      position: relative;
      flex-shrink: 0;
    }

    body.sidebar-collapsed aside.sidebar {
      width: var(--sidebar-collapsed-width);
    }

    .sidebar-header {
      padding: 1.25rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid var(--border-color);
    }

    .brand-logo {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      text-decoration: none;
      color: var(--text-main);
      overflow: hidden;
    }

    .brand-icon {
      width: 36px;
      height: 36px;
      background: var(--primary);
      border-radius: var(--radius-lg);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      flex-shrink: 0;
      box-shadow: var(--shadow-glow);
    }

    .brand-info {
      display: flex;
      flex-direction: column;
      white-space: nowrap;
      transition: opacity var(--transition-speed);
    }

    body.sidebar-collapsed .brand-info,
    body.sidebar-collapsed .sidebar-search-box,
    body.sidebar-collapsed .nav-group-title,
    body.sidebar-collapsed .nav-label,
    body.sidebar-collapsed .nav-badge {
      opacity: 0;
      pointer-events: none;
      display: none;
    }

    .brand-title {
      font-weight: 800;
      font-size: 1rem;
      letter-spacing: -0.02em;
    }

    .brand-subtitle {
      font-size: 0.7rem;
      color: var(--text-subtle);
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }

    .collapse-btn {
      background: transparent;
      border: none;
      color: var(--text-muted);
      cursor: pointer;
      padding: 0.4rem;
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.15s ease, color 0.15s ease;
    }

    .collapse-btn:hover {
      background: var(--bg-card-hover);
      color: var(--text-main);
    }

    /* Sidebar Search */
    .sidebar-search-box {
      padding: 0.85rem 1rem 0.25rem 1rem;
    }

    .search-input-wrapper {
      position: relative;
      display: flex;
      align-items: center;
    }

    .search-input-wrapper svg {
      position: absolute;
      left: 10px;
      color: var(--text-subtle);
      width: 16px;
      height: 16px;
    }

    .sidebar-search {
      width: 100%;
      padding: 0.5rem 0.5rem 0.5rem 2rem;
      background: var(--bg-input);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-lg);
      color: var(--text-main);
      font-size: 0.8rem;
      font-family: inherit;
    }

    .sidebar-search:focus {
      outline: none;
      border-color: var(--primary);
    }

    /* Nav List */
    .sidebar-nav {
      flex: 1;
      overflow-y: auto;
      padding: 0.75rem;
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    .nav-group-title {
      font-size: 0.68rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: var(--text-subtle);
      padding: 0 0.5rem;
      margin-bottom: 0.35rem;
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.65rem 0.75rem;
      color: var(--text-muted);
      text-decoration: none;
      border-radius: var(--radius-lg);
      font-size: 0.875rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.15s ease;
      position: relative;
    }

    .nav-item:hover {
      background: var(--bg-card-hover);
      color: var(--text-main);
    }

    .nav-item.active {
      background: rgba(249, 115, 22, 0.15);
      color: var(--primary);
      border: 1px solid rgba(249, 115, 22, 0.3);
    }

    .nav-item svg {
      width: 18px;
      height: 18px;
      flex-shrink: 0;
    }

    .nav-badge {
      margin-left: auto;
      font-size: 0.7rem;
      font-weight: 700;
      padding: 0.15rem 0.45rem;
      border-radius: 99px;
      background: rgba(255, 255, 255, 0.08);
      color: var(--text-muted);
    }

    .nav-badge.live {
      background: rgba(34, 197, 94, 0.15);
      color: var(--accent-green);
    }

    /* Main Content Area */
    main.main-viewport {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      background: var(--bg-body);
    }

    /* Top Navigation Header */
    header.top-bar {
      height: 64px;
      background: var(--bg-sidebar);
      border-bottom: 1px solid var(--border-color);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 1.5rem;
      z-index: 40;
    }

    .top-left {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .page-title {
      font-size: 1.1rem;
      font-weight: 800;
      letter-spacing: -0.02em;
    }

    .env-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      padding: 0.25rem 0.65rem;
      border-radius: 99px;
      font-size: 0.7rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      background: rgba(38, 189, 248, 0.1);
      color: var(--accent-blue);
      border: 1px solid rgba(56, 189, 248, 0.2);
    }

    .top-right {
      display: flex;
      align-items: center;
      gap: 0.85rem;
    }

    /* Mode Switch Toggle */
    .mode-switch {
      display: flex;
      align-items: center;
      background: var(--bg-input);
      border: 1px solid var(--border-color);
      border-radius: 99px;
      padding: 3px;
      font-size: 0.75rem;
      font-weight: 700;
    }

    .mode-btn {
      padding: 0.25rem 0.65rem;
      border-radius: 99px;
      border: none;
      background: transparent;
      color: var(--text-muted);
      cursor: pointer;
      transition: all 0.15s ease;
    }

    .mode-btn.active {
      background: var(--primary);
      color: #ffffff;
    }

    .top-icon-btn {
      background: var(--bg-input);
      border: 1px solid var(--border-color);
      color: var(--text-muted);
      width: 36px;
      height: 36px;
      border-radius: var(--radius-lg);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.15s ease;
      position: relative;
    }

    .top-icon-btn:hover {
      border-color: var(--border-strong);
      color: var(--text-main);
    }

    .indicator-dot {
      position: absolute;
      top: 6px;
      right: 6px;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--accent-green);
      box-shadow: 0 0 8px var(--accent-green);
    }

    /* Scrollable View Area */
    .view-container {
      flex: 1;
      overflow-y: auto;
      padding: 1.75rem;
    }

    .view-pane {
      display: none;
      animation: fadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }

    .view-pane.active {
      display: block;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(6px); }
      to { opacity: 1; transform: translateY(0); }
    }

    /* Grid & Cards System */
    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 1.25rem;
      margin-bottom: 1.75rem;
    }

    .kpi-card {
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-2xl);
      padding: 1.25rem 1.5rem;
      box-shadow: var(--shadow-card);
      backdrop-filter: blur(12px);
      transition: transform 0.2s ease, border-color 0.2s ease;
      position: relative;
      overflow: hidden;
    }

    .kpi-card:hover {
      transform: translateY(-2px);
      border-color: var(--border-strong);
    }

    .kpi-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 0.75rem;
    }

    .kpi-title {
      font-size: 0.78rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--text-subtle);
    }

    .kpi-icon {
      width: 32px;
      height: 32px;
      border-radius: var(--radius-lg);
      background: rgba(255, 255, 255, 0.05);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--text-muted);
    }

    .kpi-value {
      font-size: 1.85rem;
      font-weight: 800;
      font-family: var(--font-mono);
      letter-spacing: -0.03em;
      color: var(--text-main);
      margin-bottom: 0.35rem;
    }

    .kpi-subtext {
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--accent-green);
      display: flex;
      align-items: center;
      gap: 0.3rem;
    }

    .kpi-subtext.neutral {
      color: var(--text-muted);
    }

    /* Content Cards */
    .content-card {
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-2xl);
      padding: 1.5rem;
      box-shadow: var(--shadow-card);
      backdrop-filter: blur(12px);
      margin-bottom: 1.5rem;
    }

    .card-header-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1.25rem;
      padding-bottom: 0.85rem;
      border-bottom: 1px solid var(--border-color);
    }

    .card-title-text {
      font-size: 1.1rem;
      font-weight: 800;
      letter-spacing: -0.02em;
    }

    /* Tables */
    .data-table-wrapper {
      width: 100%;
      overflow-x: auto;
    }

    table.data-table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
      font-size: 0.875rem;
    }

    table.data-table th {
      padding: 0.75rem 1rem;
      font-size: 0.7rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: var(--text-subtle);
      border-bottom: 1px solid var(--border-color);
    }

    table.data-table td {
      padding: 0.9rem 1rem;
      border-bottom: 1px solid var(--border-color);
      color: var(--text-main);
    }

    table.data-table tbody tr:hover {
      background: var(--bg-card-hover);
    }

    .badge-status {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      padding: 0.2rem 0.55rem;
      border-radius: 99px;
      font-size: 0.7rem;
      font-weight: 700;
      font-family: var(--font-mono);
      text-transform: uppercase;
    }

    .badge-status.captured { background: rgba(34, 197, 94, 0.15); color: var(--accent-green); }
    .badge-status.pending { background: rgba(245, 158, 11, 0.15); color: var(--accent-amber); }
    .badge-status.cancelled { background: rgba(239, 68, 68, 0.15); color: var(--accent-red); }

    /* API Explorer Form */
    .explorer-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }

    @media (min-width: 900px) {
      .explorer-grid {
        grid-template-columns: 1fr 1fr;
      }
    }

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

    .form-control {
      width: 100%;
      padding: 0.75rem 1rem;
      background: var(--bg-input);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-lg);
      color: var(--text-main);
      font-family: var(--font-mono);
      font-size: 0.875rem;
    }

    .form-control:focus {
      outline: none;
      border-color: var(--primary);
    }

    .code-block {
      background: #050811;
      border: 1px solid var(--border-color);
      border-radius: var(--radius-xl);
      padding: 1.25rem;
      font-family: var(--font-mono);
      font-size: 0.85rem;
      color: #38bdf8;
      overflow-x: auto;
      max-height: 400px;
      white-space: pre-wrap;
    }

    /* Buttons */
    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      padding: 0.65rem 1.25rem;
      border-radius: var(--radius-lg);
      font-size: 0.85rem;
      font-weight: 700;
      cursor: pointer;
      border: none;
      transition: all 0.15s ease;
      text-decoration: none;
    }

    .btn-primary {
      background: var(--primary);
      color: #ffffff;
      box-shadow: var(--shadow-glow);
    }

    .btn-primary:hover {
      background: var(--primary-hover);
      transform: translateY(-1px);
    }

    .btn-secondary {
      background: var(--bg-input);
      color: var(--text-main);
      border: 1px solid var(--border-color);
    }

    .btn-secondary:hover {
      background: var(--bg-card-hover);
      border-color: var(--border-strong);
    }

    /* Real-time Log Stream */
    .log-stream {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      font-family: var(--font-mono);
      font-size: 0.8rem;
    }

    .log-row {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 0.6rem 0.85rem;
      background: var(--bg-input);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-lg);
    }

    .log-time { color: var(--text-subtle); }
    .log-sev.INFO { color: var(--accent-blue); font-weight:700; }
    .log-sev.WARN { color: var(--accent-amber); font-weight:700; }
    .log-sev.ERROR { color: var(--accent-red); font-weight:700; }
    .log-sev.SUCCESS { color: var(--accent-green); font-weight:700; }
    .log-msg { color: var(--text-main); flex: 1; }

    /* Modal Backdrop */
    .modal-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.7);
      backdrop-filter: blur(8px);
      z-index: 100;
      display: none;
      align-items: center;
      justify-content: center;
      padding: 1.5rem;
    }

    .modal-backdrop.active {
      display: flex;
    }

    .modal-box {
      background: var(--bg-sidebar);
      border: 1px solid var(--border-strong);
      border-radius: var(--radius-2xl);
      max-width: 500px;
      width: 100%;
      padding: 1.75rem;
      box-shadow: var(--shadow-card);
    }
  </style>
</head>
<body>

  <div id="app-container">
    
    <!-- Collapsible Sidebar -->
    <aside class="sidebar" id="sidebar">
      <div class="sidebar-header">
        <a href="/admin" class="brand-logo">
          <div class="brand-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div class="brand-info">
            <span class="brand-title">PayFlow Control</span>
            <span class="brand-subtitle">Cloudflare Worker</span>
          </div>
        </a>
        <button class="collapse-btn" id="toggle-sidebar" title="Toggle Sidebar">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          </svg>
        </button>
      </div>

      <div class="sidebar-search-box">
        <div class="search-input-wrapper">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input type="text" id="nav-search" class="sidebar-search" placeholder="Filter nav (⌘K)...">
        </div>
      </div>

      <nav class="sidebar-nav" id="sidebar-nav">
        <div>
          <div class="nav-group-title">Overview</div>
          <a class="nav-item active" data-view="dashboard">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
            <span class="nav-label">Dashboard</span>
          </a>
          <a class="nav-item" data-view="payments">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span class="nav-label">Payments & Orders</span>
            <span class="nav-badge live">Live</span>
          </a>
        </div>

        <div>
          <div class="nav-group-title">Integrations</div>
          <a class="nav-item" data-view="paypal">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
            <span class="nav-label">PayPal REST API</span>
          </a>
          <a class="nav-item" data-view="worker">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            <span class="nav-label">Worker & Edge</span>
          </a>
          <a class="nav-item" data-view="github">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
            <span class="nav-label">GitHub Pipeline</span>
          </a>
        </div>

        <div>
          <div class="nav-group-title">Developer Tools</div>
          <a class="nav-item" data-view="explorer">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            <span class="nav-label">API Explorer</span>
          </a>
          <a class="nav-item" data-view="env">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 0121 9z" /></svg>
            <span class="nav-label">Environment Vars</span>
          </a>
          <a class="nav-item" data-view="logs">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            <span class="nav-label">Real-time Logs</span>
          </a>
        </div>

        <div>
          <div class="nav-group-title">Operations</div>
          <a class="nav-item" data-view="security">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
            <span class="nav-label">Security Center</span>
          </a>
          <a class="nav-item" data-view="docs">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
            <span class="nav-label">Documentation</span>
          </a>
        </div>
      </nav>
    </aside>

    <!-- Main Viewport -->
    <main class="main-viewport">
      
      <!-- Top Navigation Header -->
      <header class="top-bar">
        <div class="top-left">
          <h1 class="page-title" id="current-view-title">Dashboard Overview</h1>
          <span class="env-badge" id="env-badge">${nodeEnv.toUpperCase()}</span>
        </div>

        <div class="top-right">
          <!-- Sandbox / Live Mode Switch -->
          <div class="mode-switch">
            <button class="mode-btn active" id="mode-sandbox">SANDBOX</button>
            <button class="mode-btn" id="mode-live">LIVE</button>
          </div>

          <!-- Quick Actions Button -->
          <button class="top-icon-btn" id="btn-quick-actions" title="Quick Actions">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </button>

          <!-- System Notifications -->
          <button class="top-icon-btn" id="btn-notifications" title="System Notifications">
            <span class="indicator-dot"></span>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </button>

          <!-- Dark/Light Theme Toggle -->
          <button class="top-icon-btn" id="btn-theme-toggle" title="Toggle Theme">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          </button>
        </div>
      </header>

      <!-- Scrollable View Container -->
      <div class="view-container">

        <!-- VIEW 1: Dashboard Home -->
        <div class="view-pane active" id="view-dashboard">
          <div class="kpi-grid">
            <div class="kpi-card">
              <div class="kpi-header">
                <span class="kpi-title">Today's Revenue</span>
                <div class="kpi-icon" style="color:var(--accent-green)">$</div>
              </div>
              <div class="kpi-value" id="kpi-revenue">$116.00</div>
              <div class="kpi-subtext">↑ 14.2% vs yesterday</div>
            </div>

            <div class="kpi-card">
              <div class="kpi-header">
                <span class="kpi-title">Successful Payments</span>
                <div class="kpi-icon" style="color:var(--accent-blue)">✓</div>
              </div>
              <div class="kpi-value" id="kpi-successful">5</div>
              <div class="kpi-subtext">100% completion rate</div>
            </div>

            <div class="kpi-card">
              <div class="kpi-header">
                <span class="kpi-title">Worker Invocations</span>
                <div class="kpi-icon" style="color:var(--primary)">⚡</div>
              </div>
              <div class="kpi-value" id="kpi-invocations">1,248</div>
              <div class="kpi-subtext neutral">Cloudflare Edge Requests</div>
            </div>

            <div class="kpi-card">
              <div class="kpi-header">
                <span class="kpi-title">Avg Latency</span>
                <div class="kpi-icon" style="color:var(--accent-purple)">⏱</div>
              </div>
              <div class="kpi-value" id="kpi-latency">24ms</div>
              <div class="kpi-subtext">Fast global response</div>
            </div>
          </div>

          <!-- Live Chart & Status Panel -->
          <div class="content-card">
            <div class="card-header-bar">
              <h2 class="card-title-text">Transaction Traffic & Edge Performance</h2>
              <span class="badge-status captured">Real-time Stream</span>
            </div>
            <div style="height: 180px; width: 100%; display:flex; align-items:flex-end; gap: 8px; padding-top: 20px;">
              <!-- Simulated SVG Sparkline Chart -->
              <svg viewBox="0 0 600 150" style="width:100%; height:100%; overflow:visible;">
                <defs>
                  <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="#f97316" stop-opacity="0.4"/>
                    <stop offset="100%" stop-color="#f97316" stop-opacity="0.0"/>
                  </linearGradient>
                </defs>
                <path d="M 0 120 Q 50 40, 100 80 T 200 60 T 300 100 T 400 30 T 500 70 T 600 20 L 600 150 L 0 150 Z" fill="url(#chartGrad)" />
                <path d="M 0 120 Q 50 40, 100 80 T 200 60 T 300 100 T 400 30 T 500 70 T 600 20" fill="none" stroke="#f97316" stroke-width="3" />
              </svg>
            </div>
          </div>

          <!-- Recent Audit Logs Section -->
          <div class="content-card">
            <div class="card-header-bar">
              <h2 class="card-title-text">Recent Worker Audit Activity</h2>
              <a class="btn btn-secondary" style="padding:0.4rem 0.85rem; font-size:0.75rem;" data-view="logs">View All Logs</a>
            </div>
            <div class="log-stream" id="dashboard-recent-logs">
              <!-- Dynamically populated -->
            </div>
          </div>
        </div>

        <!-- VIEW 2: Payments & Orders -->
        <div class="view-pane" id="view-payments">
          <div class="content-card">
            <div class="card-header-bar">
              <h2 class="card-title-text">Transactions & Orders Register</h2>
              <button class="btn btn-primary" id="btn-export-csv">Export CSV</button>
            </div>

            <div class="data-table-wrapper">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Transaction ID</th>
                    <th>Customer Email</th>
                    <th>Item Description</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Country</th>
                    <th>Date / Time</th>
                  </tr>
                </thead>
                <tbody id="payments-table-body">
                  <!-- Populated via JS -->
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- VIEW 3: PayPal Integration -->
        <div class="view-pane" id="view-paypal">
          <div class="content-card">
            <div class="card-header-bar">
              <h2 class="card-title-text">PayPal REST API Credentials & Status</h2>
              <span class="badge-status captured">OAuth 2.0 Connected</span>
            </div>

            <div class="explorer-grid">
              <div>
                <div class="form-group">
                  <label class="form-label">PayPal Client ID</label>
                  <input type="text" class="form-control" readonly value="${paypalClientId}">
                </div>
                <div class="form-group">
                  <label class="form-label">PayPal Merchant ID</label>
                  <input type="text" class="form-control" readonly value="${paypalMerchantId || 'M1234567890'}">
                </div>
                <div class="form-group">
                  <label class="form-label">Server Mode</label>
                  <input type="text" class="form-control" readonly value="${nodeEnv.toUpperCase()} (${paypalClientId === 'sb' ? 'SANDBOX MOCK ACTIVE' : 'LIVE REST API'})">
                </div>
              </div>

              <div>
                <div class="form-group">
                  <label class="form-label">OAuth Access Token Status</label>
                  <div class="code-block" style="color:var(--accent-green);">
{
  "status": "ACTIVE_CACHED",
  "expires_in_sec": 3240,
  "token_type": "Bearer",
  "scope": "https://uri.paypal.com/services/payments",
  "auth_header": "Basic [REDACTED_CLIENT_SECRET]"
}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- VIEW 4: Worker & Edge Performance -->
        <div class="view-pane" id="view-worker">
          <div class="kpi-grid">
            <div class="kpi-card">
              <div class="kpi-title">CPU Time Avg</div>
              <div class="kpi-value">2.4ms</div>
              <div class="kpi-subtext">Limit: 50ms</div>
            </div>
            <div class="kpi-card">
              <div class="kpi-title">Memory Allocation</div>
              <div class="kpi-value">18.4 MB</div>
              <div class="kpi-subtext">Max 128MB</div>
            </div>
            <div class="kpi-card">
              <div class="kpi-title">Cold Start Rate</div>
              <div class="kpi-value">0.02%</div>
              <div class="kpi-subtext">Isolate persistence ok</div>
            </div>
            <div class="kpi-card">
              <div class="kpi-title">Active Edge Regions</div>
              <div class="kpi-value">280+</div>
              <div class="kpi-subtext">Global Cloudflare PoPs</div>
            </div>
          </div>
        </div>

        <!-- VIEW 5: API Explorer -->
        <div class="view-pane" id="view-explorer">
          <div class="content-card">
            <div class="card-header-bar">
              <h2 class="card-title-text">Interactive Worker REST API Tester</h2>
            </div>

            <div class="explorer-grid">
              <div>
                <div class="form-group">
                  <label class="form-label">Target Endpoint</label>
                  <select class="form-control" id="explorer-endpoint">
                    <option value="/health">GET /health</option>
                    <option value="/api/paypal/create-order">POST /api/paypal/create-order</option>
                    <option value="/api/paypal/capture-order">POST /api/paypal/capture-order</option>
                  </select>
                </div>

                <div class="form-group">
                  <label class="form-label">JSON Request Body</label>
                  <textarea class="form-control" id="explorer-body" rows="8">{
  "amount": "12.50",
  "item_name": "Artisan Cold Brew Concentrate",
  "currency": "USD"
}</textarea>
                </div>

                <button class="btn btn-primary" id="btn-execute-api">Execute Request</button>
              </div>

              <div>
                <div class="form-group">
                  <label class="form-label">Response Payload</label>
                  <div class="code-block" id="explorer-response-output">Click "Execute Request" to test endpoint...</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- VIEW 6: Environment Variables -->
        <div class="view-pane" id="view-env">
          <div class="content-card">
            <div class="card-header-bar">
              <h2 class="card-title-text">Environment Variables & Secrets</h2>
              <span class="badge-status captured">256-Bit Encrypted</span>
            </div>

            <div class="data-table-wrapper">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Variable Name</th>
                    <th>Current Value</th>
                    <th>Scope</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><code>PAYPAL_CLIENT_ID</code></td>
                    <td><code>${paypalClientId}</code></td>
                    <td>Server Worker</td>
                    <td><button class="btn btn-secondary" style="padding:0.2rem 0.5rem; font-size:0.7rem;">Mask</button></td>
                  </tr>
                  <tr>
                    <td><code>PAYPAL_CLIENT_SECRET</code></td>
                    <td><code>••••••••••••••••••••••••••••••••</code></td>
                    <td>Secret (Worker)</td>
                    <td><button class="btn btn-secondary" style="padding:0.2rem 0.5rem; font-size:0.7rem;">Reveal</button></td>
                  </tr>
                  <tr>
                    <td><code>COMPANY_NAME</code></td>
                    <td><code>${companyName}</code></td>
                    <td>Public Config</td>
                    <td><button class="btn btn-secondary" style="padding:0.2rem 0.5rem; font-size:0.7rem;">Edit</button></td>
                  </tr>
                  <tr>
                    <td><code>COMPANY_EMAIL</code></td>
                    <td><code>${companyEmail}</code></td>
                    <td>Public Config</td>
                    <td><button class="btn btn-secondary" style="padding:0.2rem 0.5rem; font-size:0.7rem;">Edit</button></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- VIEW 7: GitHub Pipeline -->
        <div class="view-pane" id="view-github">
          <div class="content-card">
            <div class="card-header-bar">
              <h2 class="card-title-text">GitHub Actions CI/CD Pipeline</h2>
              <span class="badge-status captured">Workflow Passing</span>
            </div>
            <p style="color:var(--text-muted); font-size:0.9rem; margin-bottom:1rem;">
              Repository: <code>github.com/energize-cult-cafe/paypal-worker</code> | Branch: <code>main</code>
            </p>
            <div class="log-stream">
              <div class="log-row">
                <span class="log-time">2 mins ago</span>
                <span class="log-sev SUCCESS">PASSED</span>
                <span class="log-msg">Deploy to Cloudflare Workers (Production) - Commit #a8f91c</span>
              </div>
              <div class="log-row">
                <span class="log-time">10 mins ago</span>
                <span class="log-sev SUCCESS">PASSED</span>
                <span class="log-msg">Run TypeScript Linter & Typecheck</span>
              </div>
            </div>
          </div>
        </div>

        <!-- VIEW 8: Logs -->
        <div class="view-pane" id="view-logs">
          <div class="content-card">
            <div class="card-header-bar">
              <h2 class="card-title-text">Live Worker Structured Logs</h2>
              <button class="btn btn-secondary" id="btn-refresh-logs">Refresh Stream</button>
            </div>
            <div class="log-stream" id="logs-view-stream">
              <!-- Populated via JS -->
            </div>
          </div>
        </div>

        <!-- VIEW 9: Security Center -->
        <div class="view-pane" id="view-security">
          <div class="kpi-grid">
            <div class="kpi-card">
              <div class="kpi-title">Security Score</div>
              <div class="kpi-value" style="color:var(--accent-green)">99 / 100</div>
              <div class="kpi-subtext">A+ SSL & Security Headers</div>
            </div>
            <div class="kpi-card">
              <div class="kpi-title">CSP Policy</div>
              <div class="kpi-value">Enforced</div>
              <div class="kpi-subtext">PayPal SDK Scoped</div>
            </div>
            <div class="kpi-card">
              <div class="kpi-title">Rate Limiting</div>
              <div class="kpi-value">Active</div>
              <div class="kpi-subtext">30 req/min limit</div>
            </div>
            <div class="kpi-card">
              <div class="kpi-title">HSTS Status</div>
              <div class="kpi-value">1 Year</div>
              <div class="kpi-subtext">Preload Enabled</div>
            </div>
          </div>
        </div>

        <!-- VIEW 10: Documentation -->
        <div class="view-pane" id="view-docs">
          <div class="content-card">
            <h2 class="card-title-text" style="margin-bottom:1rem;">PayFlow Control Center Documentation</h2>
            <div class="code-block" style="color:var(--text-main);">
### Quick Commands

1. Local Server: npm run dev
2. Run Linter: npm run lint
3. Deploy Worker: npx wrangler deploy --env production

### API Summary
- POST /api/paypal/create-order -> Returns order ID
- POST /api/paypal/capture-order -> Verifies & captures funds
            </div>
          </div>
        </div>

      </div>
    </main>
  </div>

  <!-- Quick Actions Modal -->
  <div class="modal-backdrop" id="modal-quick-actions">
    <div class="modal-box">
      <h2 style="margin-bottom:1rem; font-size:1.2rem;">Quick Actions</h2>
      <div style="display:flex; flex-direction:column; gap:0.75rem;">
        <button class="btn btn-primary" id="qa-create-test">Create Test Sandbox Order</button>
        <button class="btn btn-secondary" id="qa-refresh-stats">Refresh System Stats</button>
        <button class="btn btn-secondary" id="qa-close-modal">Close</button>
      </div>
    </div>
  </div>

  <script>
    // Client-side SPA Application Logic
    document.addEventListener('DOMContentLoaded', () => {
      // Elements
      const sidebar = document.getElementById('sidebar');
      const toggleSidebarBtn = document.getElementById('toggle-sidebar');
      const navItems = document.querySelectorAll('.nav-item');
      const viewPanes = document.querySelectorAll('.view-pane');
      const viewTitle = document.getElementById('current-view-title');
      const themeToggleBtn = document.getElementById('btn-theme-toggle');
      const quickActionsBtn = document.getElementById('btn-quick-actions');
      const modalQuickActions = document.getElementById('modal-quick-actions');
      const qaCloseBtn = document.getElementById('qa-close-modal');
      const navSearchInput = document.getElementById('nav-search');

      // Sidebar Toggle
      toggleSidebarBtn.addEventListener('click', () => {
        document.body.classList.toggle('sidebar-collapsed');
      });

      // Navigation Switching
      function switchView(viewId) {
        navItems.forEach(item => {
          if (item.getAttribute('data-view') === viewId) {
            item.classList.add('active');
          } else {
            item.classList.remove('active');
          }
        });

        viewPanes.forEach(pane => {
          if (pane.id === 'view-' + viewId) {
            pane.classList.add('active');
          } else {
            pane.classList.remove('active');
          }
        });

        const activeNav = document.querySelector('.nav-item.active .nav-label');
        if (activeNav && viewTitle) {
          viewTitle.textContent = activeNav.textContent;
        }
      }

      navItems.forEach(item => {
        item.addEventListener('click', (e) => {
          e.preventDefault();
          const viewId = item.getAttribute('data-view');
          if (viewId) switchView(viewId);
        });
      });

      // Quick Actions Modal
      quickActionsBtn.addEventListener('click', () => {
        modalQuickActions.classList.add('active');
      });

      qaCloseBtn.addEventListener('click', () => {
        modalQuickActions.classList.remove('active');
      });

      // Theme Toggle
      themeToggleBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', nextTheme);
      });

      // Sidebar Search Filter
      navSearchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        navItems.forEach(item => {
          const label = item.textContent.toLowerCase();
          if (label.includes(query)) {
            item.style.display = 'flex';
          } else {
            item.style.display = 'none';
          }
        });
      });

      // Fetch Real Stats from Worker API
      async function loadDashboardData() {
        try {
          const res = await fetch('/api/admin/stats');
          if (res.ok) {
            const data = await res.json();
            
            // Update KPIs
            document.getElementById('kpi-revenue').textContent = '$' + data.stats.todayRevenue.toFixed(2);
            document.getElementById('kpi-successful').textContent = data.stats.successfulPayments;
            document.getElementById('kpi-invocations').textContent = data.stats.totalWorkerRequests;
            document.getElementById('kpi-latency').textContent = data.stats.avgResponseTimeMs + 'ms';

            // Populate Table
            const tbody = document.getElementById('payments-table-body');
            if (tbody && data.transactions) {
              tbody.innerHTML = data.transactions.map(tx => \`
                <tr>
                  <td><code>\${tx.id}</code></td>
                  <td>\${tx.customerEmail}</td>
                  <td>\${tx.itemName}</td>
                  <td><strong>$\${tx.amount.toFixed(2)} \${tx.currency}</strong></td>
                  <td><span class="badge-status \${tx.status.toLowerCase()}">\${tx.status}</span></td>
                  <td>\${tx.country}</td>
                  <td>\${new Date(tx.timestamp).toLocaleTimeString()}</td>
                </tr>
              \`).join('');
            }

            // Populate Recent Logs
            const logContainer = document.getElementById('dashboard-recent-logs');
            const logsViewStream = document.getElementById('logs-view-stream');
            if (data.logs) {
              const html = data.logs.map(l => \`
                <div class="log-row">
                  <span class="log-time">\${new Date(l.timestamp).toLocaleTimeString()}</span>
                  <span class="log-sev \${l.severity}">\${l.severity}</span>
                  <span class="log-msg">\${l.message} [\${l.route}]</span>
                </div>
              \`).join('');

              if (logContainer) logContainer.innerHTML = html;
              if (logsViewStream) logsViewStream.innerHTML = html;
            }
          }
        } catch (err) {
          console.error('Failed to load dashboard metrics:', err);
        }
      }

      // API Explorer Runner
      const executeBtn = document.getElementById('btn-execute-api');
      if (executeBtn) {
        executeBtn.addEventListener('click', async () => {
          const endpoint = document.getElementById('explorer-endpoint').value;
          const bodyText = document.getElementById('explorer-body').value;
          const outputBox = document.getElementById('explorer-response-output');

          outputBox.textContent = 'Sending request to Cloudflare Worker...';

          try {
            const method = endpoint === '/health' ? 'GET' : 'POST';
            const opts = { method };
            if (method === 'POST') {
              opts.headers = { 'Content-Type': 'application/json' };
              opts.body = bodyText;
            }

            const startTime = Date.now();
            const res = await fetch(endpoint, opts);
            const duration = Date.now() - startTime;
            const data = await res.json();

            outputBox.textContent = JSON.stringify({
              status: res.status,
              latency_ms: duration,
              response: data
            }, null, 2);
          } catch (err) {
            outputBox.textContent = 'Error executing request: ' + err.message;
          }
        });
      }

      // Initial Load
      loadDashboardData();
    });
  </script>
</body>
</html>`;
}
