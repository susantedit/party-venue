import mongoose from 'mongoose';

/**
 * Generates a unique booking ID in the format: SGP-YYYYMMDD-XXXX
 * XXXX = zero-padded 4-digit count of bookings created today.
 */
export async function generateBookingId(): Promise<string> {
  const now = new Date();
  const datePart = now.toISOString().slice(0, 10).replace(/-/g, ''); // YYYYMMDD

  const startOfDay = new Date(now);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(now);
  endOfDay.setHours(23, 59, 59, 999);

  // Use the Booking model if registered, otherwise fallback to 0001
  let count = 0;
  try {
    const Booking = mongoose.model('Booking');
    count = await Booking.countDocuments({
      createdAt: { $gte: startOfDay, $lte: endOfDay },
    });
  } catch {
    count = 0;
  }

  const sequence = String(count + 1).padStart(4, '0');
  return `SGP-${datePart}-${sequence}`;
}
