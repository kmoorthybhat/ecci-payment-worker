/**
 * Telemetry and Audit Stats Service for PayFlow Control Center.
 * In-memory state tracking for request metrics, order statistics, system health, and structured audit logs.
 */

export interface SystemStats {
  todayPayments: number;
  todayRevenue: number;
  successfulPayments: number;
  failedPayments: number;
  pendingOrders: number;
  totalWorkerRequests: number;
  avgResponseTimeMs: number;
  apiErrors: number;
  cacheHitRatePct: number;
  systemHealthScore: number;
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  severity: 'INFO' | 'WARN' | 'ERROR' | 'SUCCESS';
  route: string;
  method: string;
  clientIp: string;
  message: string;
  details?: Record<string, unknown>;
}

export interface TransactionRecord {
  id: string;
  timestamp: string;
  customerEmail: string;
  itemName: string;
  amount: number;
  currency: string;
  status: 'CAPTURED' | 'PENDING' | 'CANCELLED' | 'REFUNDED';
  country: string;
  paypalOrderId: string;
  note?: string;
}

// In-memory data store for edge isolate analytics
let workerRequestCount = 1248;
let totalDurationMs = 29952;
let apiErrorCount = 2;

const recentAuditLogs: AuditLogItem[] = [
  {
    id: 'log-101',
    timestamp: new Date(Date.now() - 1000 * 30).toISOString(),
    severity: 'INFO',
    route: '/api/paypal/create-order',
    method: 'POST',
    clientIp: '162.158.12.44',
    message: 'PayPal v2 Order created successfully',
    details: { orderId: 'DEMO-PPL-98124', amount: '12.50', currency: 'USD' }
  },
  {
    id: 'log-102',
    timestamp: new Date(Date.now() - 1000 * 90).toISOString(),
    severity: 'SUCCESS',
    route: '/api/paypal/capture-order',
    method: 'POST',
    clientIp: '162.158.12.44',
    message: 'PayPal v2 Order captured & verified',
    details: { captureId: 'CAP-789012', payer: 'customer@energize.com' }
  },
  {
    id: 'log-103',
    timestamp: new Date(Date.now() - 1000 * 240).toISOString(),
    severity: 'INFO',
    route: '/health',
    method: 'GET',
    clientIp: '108.162.219.12',
    message: 'Cloudflare Edge health check ping ok',
    details: { status: 'healthy', worker: 'v1.1.0' }
  },
  {
    id: 'log-104',
    timestamp: new Date(Date.now() - 1000 * 600).toISOString(),
    severity: 'WARN',
    route: '/api/paypal/create-order',
    method: 'POST',
    clientIp: '198.51.100.82',
    message: 'Rate limit threshold warning reached',
    details: { ip: '198.51.100.82', currentWindow: 28 }
  }
];

const mockTransactions: TransactionRecord[] = [
  {
    id: 'TXN-9081',
    timestamp: new Date(Date.now() - 1000 * 180).toISOString(),
    customerEmail: 'alex.dev@gmail.com',
    itemName: 'Artisan Cold Brew Concentrate (16oz)',
    amount: 8.50,
    currency: 'USD',
    status: 'CAPTURED',
    country: 'United States',
    paypalOrderId: 'PPL-89210-US',
    note: 'Coarse grind, delivery before 10 AM'
  },
  {
    id: 'TXN-9082',
    timestamp: new Date(Date.now() - 1000 * 850).toISOString(),
    customerEmail: 'sara.m@techcorp.io',
    itemName: 'Espresso Tasting Flight Box',
    amount: 18.00,
    currency: 'USD',
    status: 'CAPTURED',
    country: 'Canada',
    paypalOrderId: 'PPL-89211-CA',
    note: 'Express shipping'
  },
  {
    id: 'TXN-9083',
    timestamp: new Date(Date.now() - 1000 * 1900).toISOString(),
    customerEmail: 'jordan.cafe@gmail.com',
    itemName: 'Single Origin Whole Bean (1lb)',
    amount: 14.50,
    currency: 'USD',
    status: 'CAPTURED',
    country: 'United Kingdom',
    paypalOrderId: 'PPL-89212-UK'
  },
  {
    id: 'TXN-9084',
    timestamp: new Date(Date.now() - 1000 * 3400).toISOString(),
    customerEmail: 'events@startup.co',
    itemName: 'Cafe Event & Catering Deposit',
    amount: 50.00,
    currency: 'USD',
    status: 'PENDING',
    country: 'United States',
    paypalOrderId: 'PPL-89213-US',
    note: 'Invoice ref #2026-08A'
  },
  {
    id: 'TXN-9085',
    timestamp: new Date(Date.now() - 1000 * 5200).toISOString(),
    customerEmail: 'sam.o@yahoo.com',
    itemName: 'Custom Invoice Payment',
    amount: 25.00,
    currency: 'USD',
    status: 'CANCELLED',
    country: 'Germany',
    paypalOrderId: 'PPL-89214-DE'
  }
];

export function recordRequestMetric(durationMs: number, isError = false): void {
  workerRequestCount++;
  totalDurationMs += durationMs;
  if (isError) apiErrorCount++;
}

export function recordAuditLog(severity: 'INFO' | 'WARN' | 'ERROR' | 'SUCCESS', route: string, method: string, clientIp: string, message: string, details?: Record<string, unknown>): void {
  const logItem: AuditLogItem = {
    id: 'log-' + Math.random().toString(36).substring(2, 9),
    timestamp: new Date().toISOString(),
    severity,
    route,
    method,
    clientIp,
    message,
    details
  };
  recentAuditLogs.unshift(logItem);
  if (recentAuditLogs.length > 50) {
    recentAuditLogs.pop();
  }
}

export function recordTransaction(tx: Omit<TransactionRecord, 'id' | 'timestamp'>): TransactionRecord {
  const newTx: TransactionRecord = {
    ...tx,
    id: 'TXN-' + Math.floor(1000 + Math.random() * 9000),
    timestamp: new Date().toISOString()
  };
  mockTransactions.unshift(newTx);
  return newTx;
}

export function getSystemStats(): SystemStats {
  const avgResponseTimeMs = Math.round(totalDurationMs / (workerRequestCount || 1));
  const capturedList = mockTransactions.filter(t => t.status === 'CAPTURED');
  const todayRevenue = capturedList.reduce((acc, curr) => acc + curr.amount, 0);

  return {
    todayPayments: mockTransactions.length,
    todayRevenue: Math.round(todayRevenue * 100) / 100,
    successfulPayments: capturedList.length,
    failedPayments: mockTransactions.filter(t => t.status === 'CANCELLED').length,
    pendingOrders: mockTransactions.filter(t => t.status === 'PENDING').length,
    totalWorkerRequests: workerRequestCount,
    avgResponseTimeMs,
    apiErrors: apiErrorCount,
    cacheHitRatePct: 98.4,
    systemHealthScore: 99.8
  };
}

export function getAuditLogs(): AuditLogItem[] {
  return recentAuditLogs;
}

export function getTransactions(): TransactionRecord[] {
  return mockTransactions;
}
