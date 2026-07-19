import { Router } from 'express';
import {
  createBooking,
  listBookings,
  getBookingById,
  updateBookingStatus,
  deleteBooking,
} from '../controllers/bookingController';
import { authenticate } from '../middleware/authMiddleware';
import { authorize } from '../middleware/roleMiddleware';
import { bookingLimiter } from '../middleware/rateLimiter';

const router = Router();

const adminOnly = [authenticate, authorize(['super-admin', 'admin'])];

// Public
router.post('/', bookingLimiter, createBooking);

// Admin only
router.get('/', ...adminOnly, listBookings);
router.get('/:id', ...adminOnly, getBookingById);
router.patch('/:id/status', ...adminOnly, updateBookingStatus);
router.delete('/:id', ...adminOnly, deleteBooking);

export default router;
