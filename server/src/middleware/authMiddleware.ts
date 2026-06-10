import { Request, Response, NextFunction } from 'express';
import { adminAuth } from '../config/firebase';
import { DecodedIdToken } from 'firebase-admin/auth';

// Extend Express Request to include decoded Firebase token
declare global {
  namespace Express {
    interface Request {
      user?: DecodedIdToken & { role?: string };
    }
  }
}

/**
 * authenticate — verifies the Firebase ID token from the Authorization header.
 * Attaches decoded token (including custom claims like `role`) to req.user.
 * Returns 401 for missing, invalid, or expired tokens.
 * Logs failed attempts with IP and timestamp — NEVER logs the token value.
 */
export async function authenticate(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({
      success: false,
      message: 'Unauthorized: missing or malformed Authorization header',
      errors: [],
    });
    return;
  }

  const idToken = authHeader.split(' ')[1];

  try {
    const decoded = await adminAuth.verifyIdToken(idToken);
    // Attach decoded token; custom claims (role) are included in the token
    req.user = {
      ...decoded,
      role: (decoded as any).role as string | undefined,
    };
    next();
  } catch (error: any) {
    // Log failed verification: IP + timestamp only, never the token
    console.warn(
      `[auth] Token verification failed | IP: ${req.ip} | Time: ${new Date().toISOString()} | Reason: ${error?.code ?? 'unknown'}`,
    );
    res.status(401).json({
      success: false,
      message: 'Unauthorized: invalid or expired token',
      errors: [],
    });
  }
}
