/**
 * Structured JSON Logger for Cloudflare Workers.
 * Provides formatted output for monitoring, debugging, and audit logging.
 */

export interface LogContext {
  requestId?: string;
  route?: string;
  method?: string;
  clientIp?: string;
  userAgent?: string;
  [key: string]: unknown;
}

export class Logger {
  private static formatLog(level: 'INFO' | 'WARN' | 'ERROR', message: string, context: LogContext = {}) {
    return JSON.stringify({
      timestamp: new Date().toISOString(),
      level,
      message,
      environment: 'cloudflare-worker',
      ...context
    });
  }

  static info(message: string, context?: LogContext) {
    console.log(this.formatLog('INFO', message, context));
  }

  static warn(message: string, context?: LogContext) {
    console.warn(this.formatLog('WARN', message, context));
  }

  static error(message: string, context?: LogContext) {
    console.error(this.formatLog('ERROR', message, context));
  }
}
