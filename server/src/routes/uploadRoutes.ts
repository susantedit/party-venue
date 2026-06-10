import { Router } from 'express';
import { uploadImage } from '../controllers/uploadController';
import { authenticate } from '../middleware/authMiddleware';
import { authorize } from '../middleware/roleMiddleware';
import { uploadLimiter } from '../middleware/rateLimiter';
import { upload, handleMulterError } from '../middleware/uploadMiddleware';

const router = Router();

router.post(
  '/',
  uploadLimiter,
  authenticate,
  authorize(['super-admin', 'admin', 'editor']),
  upload.single('image'),
  handleMulterError,
  uploadImage,
);

export default router;
