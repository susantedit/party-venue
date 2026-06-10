import { Router } from 'express';
import { checkAvailability, blockDate } from '../controllers/availabilityController';
import { authenticate } from '../middleware/authMiddleware';
import { authorize } from '../middleware/roleMiddleware';
import { globalLimiter } from '../middleware/rateLimiter';

const router = Router();

// Public
router.get('/', globalLimiter, checkAvailability);

// Admin only
router.post('/block', authenticate, authorize(['super-admin', 'admin']), blockDate);

export default router;
