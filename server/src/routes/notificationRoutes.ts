import { Router } from 'express';
import { getNotifications, markAllRead, markOneRead } from '../controllers/notificationController';
import { authenticate } from '../middleware/authMiddleware';
import { authorize } from '../middleware/roleMiddleware';

const router = Router();

const adminOnly = [authenticate, authorize(['super-admin', 'admin'])];

// Admin only
router.get('/', ...adminOnly, getNotifications);
router.patch('/read-all', ...adminOnly, markAllRead);
router.patch('/:id/read', ...adminOnly, markOneRead);

export default router;
