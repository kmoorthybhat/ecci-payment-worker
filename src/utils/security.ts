/**
 * Security headers utility for Cloudflare Worker responses.
 * Enforces production security standards (CSP, HSTS, Frame Options, Referrer Policy, Content Type Options).
 */

export interface SecurityHeaderOptions {
  paypalClientId?: string;
  allowIframePreview?: boolean;
}

export function applySecurityHeaders(headers: Headers, options: SecurityHeaderOptions = {}): Headers {
  // Content Security Policy
  const cspDirectives = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.paypal.com https://*.paypal.com https://*.paypalobjects.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://*.paypal.com",
    "font-src 'self' https://fonts.gstatic.com data:",
    "img-src 'self' data: blob: https://*.paypal.com https://*.paypalobjects.com https://images.unsplash.com",
    "connect-src 'self' https://*.paypal.com https://*.paypal.cn https://*.paypalobjects.com",
    "frame-src 'self' https://*.paypal.com https://*.cardinalcommerce.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self' https://*.paypal.com"
  ];

  headers.set("Content-Security-Policy", cspDirectives.join("; "));

  // HTTP Strict Transport Security (HSTS)
  headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");

  // X-Frame-Options (Allow SAMEORIGIN so preview / parent iframe functions while preventing clickjacking)
  headers.set("X-Frame-Options", options.allowIframePreview ? "SAMEORIGIN" : "DENY");

  // Prevent MIME type sniffing
  headers.set("X-Content-Type-Options", "nosniff");

  // Referrer Policy
  headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  // Permissions Policy
  headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=(), payment=(self 'https://*.paypal.com')");

  // Cross-Origin policies
  headers.set("X-XSS-Protection", "1; mode=block");

  return headers;
}

/**
 * Apply CORS headers for API endpoints
 */
export function applyCorsHeaders(headers: Headers, requestOrigin?: string | null): Headers {
  headers.set("Access-Control-Allow-Origin", requestOrigin || "*");
  headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
  headers.set("Access-Control-Max-Age", "86400");
  return headers;
}

/**
 * Sanitize text inputs against XSS/script injection
 */
export function sanitizeString(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .trim();
}

