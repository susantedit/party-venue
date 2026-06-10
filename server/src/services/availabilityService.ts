import { AvailabilityModel, AvailabilityStatus } from '../models/Availability';
import { BookingModel } from '../models/Booking';
import { AppError } from '../utils/AppError';
import { logAuditEvent } from '../utils/auditLog';
import mongoose from 'mongoose';

function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

export async function checkDate(dateStr: string): Promise<AvailabilityStatus> {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) throw new AppError(400, 'Invalid date format');

  const today = startOfDay(new Date());
  const queryDate = startOfDay(date);
  if (queryDate < today) throw new AppError(400, 'Past dates are not valid for booking');

  // Check Availability collection first
  const avail = await AvailabilityModel.findOne({ date: queryDate }).lean();
  if (avail) return avail.status as AvailabilityStatus;

  // Fallback: check bookings with confirmed/pending status on that date
  const nextDay = new Date(queryDate);
  nextDay.setDate(nextDay.getDate() + 1);

  const booking = await BookingModel.findOne({
    eventDate: { $gte: queryDate, $lt: nextDay },
    status: { $in: ['pending', 'confirmed'] },
  }).lean();

  if (booking) return booking.status === 'confirmed' ? 'booked' : 'reserved';
  return 'available';
}

export async function markDate(
  date: Date,
  status: AvailabilityStatus,
  bookingId?: mongoose.Types.ObjectId,
): Promise<void> {
  const queryDate = startOfDay(date);
  await AvailabilityModel.findOneAndUpdate(
    { date: queryDate },
    { date: queryDate, status, ...(bookingId ? { bookingId } : {}) },
    { upsert: true },
  );
}

export async function blockDate(dateStr: string, firebaseUid: string): Promise<void> {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) throw new AppError(400, 'Invalid date format');

  const today = startOfDay(new Date());
  const queryDate = startOfDay(date);
  if (queryDate < today) throw new AppError(400, 'Cannot block past dates');

  await AvailabilityModel.findOneAndUpdate(
    { date: queryDate },
    { date: queryDate, status: 'reserved', blockedBy: firebaseUid },
    { upsert: true },
  );

  logAuditEvent('availability.blocked', firebaseUid, 'Availability', dateStr);
}
