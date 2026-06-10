import { NotificationModel } from '../models/Notification';
import { logError, logWarn } from '../utils/logger';

const WHATSAPP_NUMBER_PATTERN = /^977\d{9,10}$/;

/**
 * Generates a WhatsApp deep-link for the admin to open a chat about a new booking.
 * Returns null if ADMIN_WHATSAPP_NUMBER is absent or does not match the Nepal pattern.
 * Never throws — logs a warning instead.
 *
 * Note: reads from process.env directly because env.ts does not yet declare
 * ADMIN_WHATSAPP_NUMBER (added in task 5.1).  Once task 5.1 lands, switch to
 * `import { env } from '../config/env'` and use `env.ADMIN_WHATSAPP_NUMBER`.
 */
export function generateWhatsAppLink(booking: any): string | null {
  const number: string | undefined = process.env['ADMIN_WHATSAPP_NUMBER'];

  if (!number) {
    logWarn('generateWhatsAppLink: ADMIN_WHATSAPP_NUMBER is not configured — skipping WhatsApp link');
    return null;
  }

  if (!WHATSAPP_NUMBER_PATTERN.test(number)) {
    logWarn('generateWhatsAppLink: ADMIN_WHATSAPP_NUMBER does not match ^977\\d{9,10}$ — skipping WhatsApp link', {
      value: number,
    });
    return null;
  }

  const message =
    `New Booking: ${booking.bookingId} | ${booking.customerName} | ` +
    `${booking.eventType} on ${booking.eventDate} | ` +
    `Guests: ${booking.guestCount} | Phone: ${booking.phone}`;

  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

/**
 * Deletes the oldest records when the Notification collection exceeds `limit`.
 * Keeps exactly `limit` most-recent documents (by createdAt).
 */
export async function enforceCollectionCap(limit = 500): Promise<void> {
  const count = await NotificationModel.countDocuments();
  if (count <= limit) return;

  const excess = count - limit;
  const oldest = await NotificationModel.find({})
    .sort({ createdAt: 1 })
    .limit(excess)
    .select('_id')
    .lean();

  const ids = oldest.map((doc) => doc._id);
  await NotificationModel.deleteMany({ _id: { $in: ids } });
}

/**
 * Creates an in-app notification record for a new booking.
 * Wrapped in try/catch — NEVER throws so it can never fail booking creation.
 */
export async function createBookingNotification(booking: any): Promise<void> {
  try {
    const whatsappAlertLink = generateWhatsAppLink(booking);

    await NotificationModel.create({
      type: 'booking',
      title: 'New Booking',
      message: `${booking.customerName} — ${booking.eventType} on ${booking.eventDate}`,
      link: `/admin/bookings/${booking._id}`,
      whatsappAlertLink,
      isRead: false,
      createdAt: new Date(),
    });

    await enforceCollectionCap(500);
  } catch (err: any) {
    logError('createBookingNotification failed', { message: err?.message });
  }
}

/**
 * Creates an in-app notification record for a new inquiry.
 * Wrapped in try/catch — NEVER throws so it can never fail inquiry creation.
 */
export async function createInquiryNotification(inquiry: any): Promise<void> {
  try {
    const subject: string = inquiry.subject || inquiry.message?.slice(0, 60) || '';

    await NotificationModel.create({
      type: 'inquiry',
      title: 'New Inquiry',
      message: `${inquiry.name} — ${subject}`,
      link: '/admin/inquiries',
      isRead: false,
      createdAt: new Date(),
    });

    await enforceCollectionCap(500);
  } catch (err: any) {
    logError('createInquiryNotification failed', { message: err?.message });
  }
}

export const notificationService = {
  generateWhatsAppLink,
  enforceCollectionCap,
  createBookingNotification,
  createInquiryNotification,
};
