import { Router } from 'express';
import { listFAQs, listAllFAQs, createFAQ, updateFAQ, deleteFAQ, reorderFAQs } from '../controllers/faqController';
import { authenticate } from '../middleware/authMiddleware';
import { authorize } from '../middleware/roleMiddleware';
import { globalLimiter } from '../middleware/rateLimiter';

const router = Router();
const adminOnly = [authenticate, authorize(['super-admin', 'admin', 'editor'])];

// Public — returns published FAQs only
router.get('/', globalLimiter, listFAQs);

// Admin routes
router.get('/all', ...adminOnly, listAllFAQs);
router.post('/', ...adminOnly, createFAQ);
router.put('/:id', ...adminOnly, updateFAQ);
router.delete('/:id', ...adminOnly, deleteFAQ);
router.patch('/reorder', ...adminOnly, reorderFAQs);

export default router;
