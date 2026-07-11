import { Router } from 'express';
import { createInquiry, listInquiries, updateInquiryStatus, deleteInquiry } from '../controllers/inquiryController';
import { authenticate } from '../middleware/authMiddleware';
import { authorize } from '../middleware/roleMiddleware';
import { inquiryLimiter } from '../middleware/rateLimiter';

const router = Router();
const adminOnly = [authenticate, authorize(['super-admin', 'admin'])];

router.post('/', inquiryLimiter, createInquiry);
router.get('/', ...adminOnly, listInquiries);
router.patch('/:id', ...adminOnly, updateInquiryStatus);
router.delete('/:id', ...adminOnly, deleteInquiry);

export default router;
