import { Request, Response, NextFunction } from 'express';

type Role = 'super-admin' | 'admin' | 'editor';

/**
 * authorize — RBAC middleware factory.
 * Returns a middleware that checks req.user.role against the allowed roles.
 * Must be used after `authenticate`.
 * Logs all 403 events with userId and endpoint.
 */
export function authorize(allowedRoles: Role[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const userRole = req.user?.role as Role | undefined;

    if (!userRole || !allowedRoles.includes(userRole)) {
      // Log 403 event: userId + endpoint, no sensitive data
      console.warn(
        `[auth] Forbidden | userId: ${req.user?.uid ?? 'unknown'} | role: ${userRole ?? 'none'} | endpoint: ${req.method} ${req.originalUrl} | Time: ${new Date().toISOString()}`,
      );
      res.status(403).json({
        success: false,
        message: 'Forbidden: insufficient permissions',
        errors: [],
      });
      return;
    }
    next();
  };
}
