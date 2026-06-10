import { Router } from 'express';
import { listTestimonials, createTestimonial, updateTestimonial, deleteTestimonial } from '../controllers/testimonialController';
import { authenticate } from '../middleware/authMiddleware';
import { authorize } from '../middleware/roleMiddleware';
import { globalLimiter, uploadLimiter } from '../middleware/rateLimiter';
import { upload, handleMulterError } from '../middleware/uploadMiddleware';

const router = Router();
const editorOrAbove = [authenticate, authorize(['super-admin', 'admin', 'editor'])];

router.get('/', globalLimiter, listTestimonials);
router.post('/', ...editorOrAbove, uploadLimiter, upload.single('image'), handleMulterError, createTestimonial);
router.put('/:id', ...editorOrAbove, updateTestimonial);
router.delete('/:id', ...editorOrAbove, deleteTestimonial);

export default router;
