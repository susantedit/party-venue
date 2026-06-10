import { Router } from 'express';
import { getOverview } from '../controllers/dashboardController';
import { authenticate } from '../middleware/authMiddleware';
import { authorize } from '../middleware/roleMiddleware';

const router = Router();

router.get('/overview', authenticate, authorize(['super-admin', 'admin']), getOverview);

export default router;
