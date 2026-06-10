import { logInfo } from './logger';

/**
 * Logs a structured audit event for all sensitive operations.
 * Called from: auth middleware, booking service, and all DELETE handlers.
 * Always includes: action, userId, resourceType, resourceId, timestamp.
 */
export function logAuditEvent(
  action: string,
  userId: string | undefined,
  resourceType: string,
  resourceId: string,
  metadata?: Record<string, unknown>,
): void {
  logInfo('AUDIT_EVENT', {
    action,
    userId: userId ?? 'anonymous',
    resourceType,
    resourceId,
    ...(metadata ? { metadata } : {}),
  });
}
