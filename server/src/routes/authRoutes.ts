import { Router } from 'express';
import { getMe, syncUser, setUserRole } from '../controllers/authController';
import { authenticate } from '../middleware/authMiddleware';
import { authorize } from '../middleware/roleMiddleware';
import { authLimiter } from '../middleware/rateLimiter';

const router = Router();

// GET /api/v1/auth/me
router.get('/me', authLimiter, authenticate, getMe);

// POST /api/v1/auth/sync
router.post('/sync', authLimiter, authenticate, syncUser);

// POST /api/v1/auth/set-role (super-admin only)
router.post('/set-role', authenticate, authorize(['super-admin']), setUserRole);

export default router;
