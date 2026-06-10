// Structured logger — never log passwords, tokens, or MONGODB_URI values

function formatEntry(level: string, message: string, meta?: Record<string, unknown>): string {
  return JSON.stringify({
    timestamp: new Date().toISOString(),
    level,
    message,
    ...(meta ? { meta } : {}),
  });
}

export function logInfo(message: string, meta?: Record<string, unknown>): void {
  console.log(formatEntry('INFO', message, meta));
}

export function logError(message: string, meta?: Record<string, unknown>): void {
  console.error(formatEntry('ERROR', message, meta));
}

export function logWarn(message: string, meta?: Record<string, unknown>): void {
  console.warn(formatEntry('WARN', message, meta));
}

export function logAuthEvent(
  event: 'login_failed' | 'token_invalid' | 'role_denied' | 'logout',
  meta: { ip?: string; uid?: string; endpoint?: string },
): void {
  logWarn(`AUTH_EVENT:${event}`, meta);
}
