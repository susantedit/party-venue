import { Router } from 'express';
import { listMenuItems, createMenuItem, updateMenuItem, deleteMenuItem } from '../controllers/menuController';
import { authenticate } from '../middleware/authMiddleware';
import { authorize } from '../middleware/roleMiddleware';
import { globalLimiter, uploadLimiter } from '../middleware/rateLimiter';
import { upload, handleMulterError } from '../middleware/uploadMiddleware';

const router = Router();
const adminOnly = [authenticate, authorize(['super-admin', 'admin'])];

router.get('/', globalLimiter, listMenuItems);
router.post('/', ...adminOnly, uploadLimiter, upload.single('image'), handleMulterError, createMenuItem);
router.put('/:id', ...adminOnly, updateMenuItem);
router.delete('/:id', ...adminOnly, deleteMenuItem);

export default router;
