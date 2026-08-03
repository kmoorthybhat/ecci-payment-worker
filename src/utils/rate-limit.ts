/**
 * Lightweight In-Memory Sliding Window Rate Limiter for Cloudflare Workers.
 * Protects endpoints like /api/paypal/create-order against abuse.
 */

interface RateLimitStore {
  [ip: string]: number[];
}

const store: RateLimitStore = {};

/**
 * Clean up old window entries every minute
 */
setInterval(() => {
  const now = Date.now();
  for (const ip in store) {
    store[ip] = store[ip].filter(timestamp => now - timestamp < 60000);
    if (store[ip].length === 0) {
      delete store[ip];
    }
  }
}, 60000);

/**
 * Check if client IP is within rate limits
 * @param ip Client IP address
 * @param limit Maximum allowed requests in window
 * @param windowMs Time window in milliseconds (default: 60000ms / 1 min)
 */
export function checkRateLimit(ip: string, limit = 30, windowMs = 60000): { allowed: boolean; remaining: number; resetMs: number } {
  const now = Date.now();
  if (!store[ip]) {
    store[ip] = [];
  }

  // Filter timestamps within current window
  store[ip] = store[ip].filter(timestamp => now - timestamp < windowMs);

  if (store[ip].length >= limit) {
    const oldest = store[ip][0];
    const resetMs = windowMs - (now - oldest);
    return {
      allowed: false,
      remaining: 0,
      resetMs
    };
  }

  store[ip].push(now);

  return {
    allowed: true,
    remaining: limit - store[ip].length,
    resetMs: windowMs
  };
}
