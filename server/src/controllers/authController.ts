import { Request, Response, NextFunction } from 'express';
import { adminAuth } from '../config/firebase';
import { UserModel } from '../models/User';
import { z } from 'zod';
import { sendSuccess } from '../utils/apiResponse';
const setRoleSchema = z.object({
  uid: z.string().min(1),
  role: z.enum(['super-admin', 'admin', 'editor']),
});

/** GET /api/v1/auth/me — returns decoded Firebase token + custom claims */
export async function getMe(req: Request, res: Response): Promise<void> {
  sendSuccess(res, req.user, 'Authenticated');
}

/** POST /api/v1/auth/sync — upserts MongoDB User doc from Firebase token */
export async function syncUser(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { uid, email, name, role } = req.user as any;
    const user = await UserModel.findOneAndUpdate(
      { firebaseUid: uid },
      {
        firebaseUid: uid,
        email: email ?? '',
        name: name ?? '',
        role: role ?? 'editor',
        lastLogin: new Date(),
      },
      { upsert: true, new: true },
    );
    sendSuccess(res, user, 'User synced');
  } catch (err) {
    next(err);
  }
}

/** POST /api/v1/auth/set-role — assigns Firebase custom claims (super-admin only) */
export async function setUserRole(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { uid, role } = setRoleSchema.parse(req.body);
    await adminAuth.setCustomUserClaims(uid, { role });
    // Also update MongoDB
    await UserModel.findOneAndUpdate({ firebaseUid: uid }, { role }, { new: true });
    sendSuccess(res, { uid, role }, 'Role assigned successfully');
  } catch (err) {
    next(err);
  }
}
