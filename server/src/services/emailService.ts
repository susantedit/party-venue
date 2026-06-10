import { Resend } from 'resend';
import { env } from '../config/env';
import { logError, logInfo } from '../utils/logger';

const resend = new Resend(env.RESEND_API_KEY);

const MAX_RETRIES = 2;
const RETRY_DELAY_MS = 1000;

async function sendWithRetry(payload: {
  from: string;
  to: string;
  subject: string;
  html: string;
}, retries = 0): Promise<void> {
  try {
    const { error } = await resend.emails.send(payload);
    if (error) throw new Error(error.message);
    logInfo('Email sent', { to: payload.to, subject: payload.subject });
  } catch (err: any) {
    if (retries < MAX_RETRIES) {
      await new Promise(r => setTimeout(r, RETRY_DELAY_MS * (retries + 1)));
      return sendWithRetry(payload, retries + 1);
    }
    // Log failure but never throw — email must not block booking/inquiry creation
    logError('Email delivery failed after retries', {
      to: payload.to,
      subject: payload.subject,
      message: err.message,
    });
  }
}

// ─── Responsive HTML template ─────────────────────────────────────────────────
function baseTemplate(title: string, body: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
  <style>
    body { margin: 0; padding: 0; background: #f8f5ee; font-family: 'DM Sans', Arial, sans-serif; }
    .wrapper { max-width: 600px; margin: 0 auto; padding: 24px 16px; }
    .card { background: #ffffff; border-radius: 12px; padding: 32px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
    .header { background: #111827; border-radius: 12px 12px 0 0; padding: 24px 32px; text-align: center; }
    .header h1 { color: #C9A227; font-size: 20px; margin: 0; }
    .header p { color: #9ca3af; font-size: 14px; margin: 4px 0 0; }
    .body { padding: 24px 0; }
    .field { margin-bottom: 12px; }
    .label { font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; }
    .value { font-size: 15px; color: #111827; font-weight: 500; margin-top: 2px; }
    .badge { display: inline-block; background: #fef3c7; color: #92400e; border-radius: 20px; padding: 3px 12px; font-size: 13px; font-weight: 600; }
    .cta { display: block; background: #C9A227; color: #ffffff; text-decoration: none; text-align: center; padding: 12px 24px; border-radius: 8px; font-weight: 600; font-size: 15px; margin: 24px 0 0; }
    .footer { text-align: center; font-size: 12px; color: #9ca3af; margin-top: 16px; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <h1>Shree Ganesh Party Venue</h1>
      <p>Premium Event Venue & Catering · Bhaktapur, Nepal</p>
    </div>
    <div class="card">
      <div class="body">${body}</div>
    </div>
    <div class="footer">
      © ${new Date().getFullYear()} Shree Ganesh Party Venue & Catering Service · Bhaktapur, Nepal
    </div>
  </div>
</body>
</html>`;
}

// ─── Email Service ─────────────────────────────────────────────────────────────
export const emailService = {

  /** Customer booking confirmation */
  async sendBookingConfirmation(booking: any): Promise<void> {
    const html = baseTemplate('Booking Confirmation', `
      <h2 style="color:#111827;margin:0 0 16px;">Your Booking is Received ✓</h2>
      <p style="color:#374151;margin:0 0 20px;font-size:16px;font-weight:600;">Our team will contact you within 30 minutes.</p>
      <div class="field"><div class="label">Booking ID</div><div class="value"><span class="badge">${booking.bookingId}</span></div></div>
      <div class="field"><div class="label">Event Type</div><div class="value">${booking.eventType}</div></div>
      <div class="field"><div class="label">Event Date</div><div class="value">${new Date(booking.eventDate).toDateString()}</div></div>
      <div class="field"><div class="label">Guests</div><div class="value">${booking.guestCount}</div></div>
      ${booking.notes ? `<div class="field"><div class="label">Notes</div><div class="value">${booking.notes}</div></div>` : ''}
      <a href="${env.FRONTEND_URL}/contact" class="cta">Contact Us</a>
    `);

    await sendWithRetry({
      from: env.EMAIL_FROM,
      to: booking.email,
      subject: `Booking Received — ${booking.bookingId} | Shree Ganesh Party Venue`,
      html,
    });
  },

  /** Admin booking alert */
  async sendBookingNotification(booking: any): Promise<void> {
    // Customer confirmation (non-blocking chain)
    this.sendBookingConfirmation(booking).catch(() => {});

    const html = baseTemplate('New Booking Alert', `
      <h2 style="color:#111827;margin:0 0 16px;">🔔 New Booking Received</h2>
      <div class="field"><div class="label">Booking ID</div><div class="value">${booking.bookingId}</div></div>
      <div class="field"><div class="label">Customer</div><div class="value">${booking.customerName}</div></div>
      <div class="field"><div class="label">Phone</div><div class="value">${booking.phone}</div></div>
      <div class="field"><div class="label">Email</div><div class="value">${booking.email}</div></div>
      <div class="field"><div class="label">Event Type</div><div class="value">${booking.eventType}</div></div>
      <div class="field"><div class="label">Event Date</div><div class="value">${new Date(booking.eventDate).toDateString()}</div></div>
      <div class="field"><div class="label">Guests</div><div class="value">${booking.guestCount}</div></div>
      ${booking.notes ? `<div class="field"><div class="label">Notes</div><div class="value">${booking.notes}</div></div>` : ''}
      <a href="${env.FRONTEND_URL}/admin/bookings/${booking._id}" class="cta">View in Dashboard</a>
    `);

    await sendWithRetry({
      from: env.EMAIL_FROM,
      to: env.ADMIN_NOTIFICATION_EMAIL,
      subject: `[New Booking] ${booking.bookingId} — ${booking.eventType} on ${new Date(booking.eventDate).toDateString()}`,
      html,
    });
  },

  /** Customer inquiry confirmation */
  async sendInquiryConfirmation(inquiry: any): Promise<void> {
    const html = baseTemplate('Inquiry Received', `
      <h2 style="color:#111827;margin:0 0 16px;">We received your message ✓</h2>
      <p style="color:#374151;margin:0 0 20px;">Thank you for contacting Shree Ganesh Party Venue. We will get back to you as soon as possible.</p>
      <div class="field"><div class="label">Name</div><div class="value">${inquiry.name}</div></div>
      <div class="field"><div class="label">Your Message</div><div class="value" style="color:#6b7280;">${inquiry.message}</div></div>
      <a href="${env.FRONTEND_URL}/contact" class="cta">Visit Our Website</a>
    `);

    await sendWithRetry({
      from: env.EMAIL_FROM,
      to: inquiry.email,
      subject: `We received your inquiry | Shree Ganesh Party Venue`,
      html,
    });
  },

  /** Admin inquiry alert */
  async sendInquiryNotification(inquiry: any): Promise<void> {
    // Customer confirmation (non-blocking chain)
    this.sendInquiryConfirmation(inquiry).catch(() => {});

    const html = baseTemplate('New Inquiry Alert', `
      <h2 style="color:#111827;margin:0 0 16px;">✉️ New Inquiry Received</h2>
      <div class="field"><div class="label">Name</div><div class="value">${inquiry.name}</div></div>
      <div class="field"><div class="label">Email</div><div class="value">${inquiry.email}</div></div>
      <div class="field"><div class="label">Phone</div><div class="value">${inquiry.phone}</div></div>
      ${inquiry.subject ? `<div class="field"><div class="label">Subject</div><div class="value">${inquiry.subject}</div></div>` : ''}
      <div class="field"><div class="label">Message</div><div class="value">${inquiry.message}</div></div>
      <a href="${env.FRONTEND_URL}/admin/inquiries" class="cta">View in Dashboard</a>
    `);

    await sendWithRetry({
      from: env.EMAIL_FROM,
      to: env.ADMIN_NOTIFICATION_EMAIL,
      subject: `[New Inquiry] From ${inquiry.name} — ${inquiry.phone}`,
      html,
    });
  },
};
