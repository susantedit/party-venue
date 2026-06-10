import { Router } from 'express';
import { listPackages, getPackageBySlug, createPackage, updatePackage, deletePackage } from '../controllers/packageController';
import { authenticate } from '../middleware/authMiddleware';
import { authorize } from '../middleware/roleMiddleware';
import { globalLimiter } from '../middleware/rateLimiter';

const router = Router();
const adminOnly = [authenticate, authorize(['super-admin', 'admin'])];

router.get('/', globalLimiter, listPackages);
router.get('/:slug', globalLimiter, getPackageBySlug);
router.post('/', ...adminOnly, createPackage);
router.put('/:id', ...adminOnly, updatePackage);
router.delete('/:id', ...adminOnly, deletePackage);

export default router;
