import { BookingModel, BOOKING_STATUSES, BookingStatus } from '../models/Booking';
import { AvailabilityModel } from '../models/Availability';
import { generateBookingId } from '../utils/generateBookingId';
import { logAuditEvent } from '../utils/auditLog';
import { logError } from '../utils/logger';
import { AppError } from '../utils/AppError';
import { emailService } from './emailService';
import { notificationService } from './notificationService';

/** Valid state machine transitions */
const ALLOWED_TRANSITIONS: Record<BookingStatus, BookingStatus[]> = {
  pending: ['contacted', 'cancelled'],
  contacted: ['confirmed', 'cancelled'],
  confirmed: ['completed', 'cancelled'],
  completed: [],
  cancelled: [],
};

export async function createBooking(data: any, userId?: string) {
  const bookingId = await generateBookingId();

  const booking = await BookingModel.create({
    ...data,
    bookingId,
    status: 'pending',
    source: 'website',
    statusHistory: [{ status: 'pending', changedAt: new Date(), changedBy: userId }],
  });

  // Mark date as reserved in availability
  const eventDate = new Date(data.eventDate);
  eventDate.setHours(0, 0, 0, 0);
  await AvailabilityModel.findOneAndUpdate(
    { date: eventDate },
    { date: eventDate, status: 'reserved', bookingId: booking._id },
    { upsert: true },
  );

  // Send email notification async — never block response
  emailService.sendBookingNotification(booking).catch((err) =>
    logError('Booking email failed', { message: err.message }),
  );

  notificationService.createBookingNotification(booking).catch((err) =>
    logError('Booking notification creation failed', { message: err.message }),
  );

  logAuditEvent('booking.created', userId, 'Booking', bookingId);
  return booking;
}

export async function listBookings(query: {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
}) {
  const page = query.page ?? 1;
  const limit = query.limit ?? 10;
  const skip = (page - 1) * limit;

  const filter: Record<string, any> = {};
  if (query.status) filter.status = query.status;
  if (query.search) filter.$text = { $search: query.search };

  const [docs, total] = await Promise.all([
    BookingModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    BookingModel.countDocuments(filter),
  ]);

  return { docs, total, page, limit, pages: Math.ceil(total / limit) };
}

export async function getBookingById(id: string) {
  const booking = await BookingModel.findById(id).lean();
  if (!booking) throw new AppError(404, 'Booking not found');
  return booking;
}

export async function updateBookingStatus(
  id: string,
  newStatus: BookingStatus,
  adminUid: string,
) {
  const booking = await BookingModel.findById(id);
  if (!booking) throw new AppError(404, 'Booking not found');

  const allowed = ALLOWED_TRANSITIONS[booking.status];
  if (!allowed.includes(newStatus)) {
    throw new AppError(
      400,
      `Invalid status transition: ${booking.status} → ${newStatus}`,
    );
  }

  const oldStatus = booking.status;
  booking.status = newStatus;
  booking.statusHistory.push({ status: newStatus, changedAt: new Date(), changedBy: adminUid });
  await booking.save();

  logAuditEvent('booking.status_changed', adminUid, 'Booking', id, {
    from: oldStatus,
    to: newStatus,
  });

  return booking;
}

export async function deleteBooking(id: string, adminUid: string) {
  const booking = await BookingModel.findById(id);
  if (!booking) throw new AppError(404, 'Booking not found');

  logAuditEvent('booking.deleted', adminUid, 'Booking', id);
  await BookingModel.findByIdAndDelete(id);
}
