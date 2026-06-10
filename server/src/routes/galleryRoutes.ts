import { Router } from 'express';
import { listGallery, uploadImage, deleteImage, bulkUpload } from '../controllers/galleryController';
import { authenticate } from '../middleware/authMiddleware';
import { authorize } from '../middleware/roleMiddleware';
import { globalLimiter, uploadLimiter } from '../middleware/rateLimiter';
import { upload, handleMulterError } from '../middleware/uploadMiddleware';

const router = Router();
const adminOnly = [authenticate, authorize(['super-admin', 'admin', 'editor'])];

router.get('/', globalLimiter, listGallery);
router.post('/', uploadLimiter, ...adminOnly, upload.single('image'), handleMulterError, uploadImage);
router.post('/bulk', uploadLimiter, ...adminOnly, upload.array('images', 20), handleMulterError, bulkUpload);
router.delete('/:id', ...adminOnly, deleteImage);

export default router;
