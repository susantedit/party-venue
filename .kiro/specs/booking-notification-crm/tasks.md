# Implementation Plan: Booking Notification & CRM System

## Overview

Extends the existing MERN booking system with a three-channel notification pipeline (admin email alert, customer auto-reply, in-app WhatsApp-linked notification) and a lightweight CRM layer. Implementation follows a backend-first approach: Mongoose model → service → controller → routes → env config → bookingService integration → emailService fixes → app.ts mount → frontend types → Zustand store → polling hook → NotificationDropdown → BookingsPage CRM enhancements → BookingDetailPage contact panel.

All notification side-effects are non-blocking fire-and-forget. The `Booking` model and state machine already exist and are not replaced. Polling is client-side only (30-second `setInterval`) gated on `isAuthenticated` from `authStore`.

---

## Tasks

- [x] 1. Create the Notification Mongoose model
  - [x] 1.1 Create `server/src/models/Notification.ts` with schema, indexes, and TTL
    - Define `INotification` interface extending `Document` with fields: `type` (enum `'booking' | 'inquiry'`), `title` (String, required), `message` (String, required), `link` (String, required), `whatsappAlertLink` (String, optional), `isRead` (Boolean, default `false`), `createdAt` (Date, default `Date.now`)
    - Set `{ timestamps: false }` on the schema — `createdAt` is managed manually so the TTL index name matches exactly
    - Add TTL index: `{ createdAt: 1 }, { expireAfterSeconds: 7776000, name: 'ttl_createdAt' }` (90-day auto-delete per Requirement 5.3)
    - Add single-field index `{ isRead: 1 }` named `idx_isRead` and compound index `{ isRead: 1, createdAt: -1 }` named `idx_isRead_createdAt` for fast unread queries (Requirement 5.2)
    - Export `NotificationModel` using the safe `mongoose.models.Notification || mongoose.model(...)` pattern to avoid OverwriteModelError in hot-reload environments
    - Export `NotificationType = 'booking' | 'inquiry'`
    - _Requirements: 5.1, 5.2, 5.3_

- [x] 2. Implement `notificationService.ts`
  - [x] 2.1 Create `server/src/services/notificationService.ts` with WhatsApp link generation and cap enforcement
    - Import `NotificationModel` and `env` from their respective modules; import `logError` and `logInfo` from `utils/logger`
    - Implement `generateWhatsAppLink(booking: any): string | null`:
      - Return `null` if `env.ADMIN_WHATSAPP_NUMBER` is falsy or fails the pattern `^977\d{9,10}$` (log warning instead of throwing — Requirement 9.6)
      - Construct message: `"New Booking: {bookingId} | {customerName} | {eventType} on {eventDate} | Guests: {guestCount} | Phone: {phone}"` (Requirement 3.3)
      - Return URL `https://wa.me/${env.ADMIN_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}` (Requirement 3.5)
    - Implement `enforceCollectionCap(limit = 500): Promise<void>`:
      - Count total documents with `NotificationModel.countDocuments()`
      - If count exceeds `limit`, delete the oldest `(count - limit)` records by sorting `createdAt: 1` and using `_id` `$in` delete (Requirement 5.4)
    - Implement `createBookingNotification(booking: any): Promise<void>`:
      - Generate `whatsappAlertLink` via `generateWhatsAppLink(booking)` (null if unconfigured — Requirement 3.6)
      - Create notification record: `{ type: 'booking', title: 'New Booking', message: "{customerName} — {eventType} on {eventDate}", link: "/admin/bookings/{booking._id}", whatsappAlertLink, isRead: false, createdAt: new Date() }` (Requirement 4.1)
      - Call `enforceCollectionCap(500)` after creation
      - Wrap entire function body in try/catch; log error and return without throwing (must never fail booking creation — Requirement 4.6 / design constraint)
    - Implement `createInquiryNotification(inquiry: any): Promise<void>`:
      - Create notification: `{ type: 'inquiry', title: 'New Inquiry', message: "{inquiry.name} — {inquiry.subject || inquiry.message.slice(0,60)}", link: "/admin/inquiries", isRead: false, createdAt: new Date() }` (Requirement 4.2)
      - Call `enforceCollectionCap(500)` after creation
      - Wrap in try/catch; never throw
    - _Requirements: 3.1, 3.3, 3.4, 3.5, 3.6, 4.1, 4.2, 5.4_

- [x] 3. Implement `notificationController.ts` and `notificationSchema.ts`
  - [x] 3.1 Create `server/src/validators/notificationSchema.ts`
    - Export `notificationIdSchema = z.object({ id: z.string().min(1) })` for the `:id/read` route param (validates MongoDB ObjectId is a non-empty string)
    - _Requirements: 4.3, 4.4, 4.5_
  - [x] 3.2 Create `server/src/controllers/notificationController.ts` with three handlers
    - `getNotifications`: query `NotificationModel.find({}).sort({ createdAt: -1 }).limit(20).lean()`; return `sendSuccess(res, notifications)` (Requirement 4.3)
    - `markAllRead`: `NotificationModel.updateMany({}, { $set: { isRead: true } })`; return `sendSuccess(res, null, 'All notifications marked as read')` (Requirement 4.4)
    - `markOneRead`: parse `:id` param via `notificationIdSchema`; `NotificationModel.findByIdAndUpdate(id, { $set: { isRead: true } }, { new: true })`; return 404 via `AppError` if not found; return updated doc on success (Requirement 4.5)
    - All handlers must be `async` and let errors propagate to the global error handler via `next(error)` or throw `AppError`
    - _Requirements: 4.3, 4.4, 4.5_

- [x] 4. Create `notificationRoutes.ts` and mount in `app.ts`
  - [x] 4.1 Create `server/src/routes/notificationRoutes.ts`
    - Import `authenticate` from `authMiddleware` and `authorize` from `roleMiddleware`
    - Define `adminOnly = [authenticate, authorize(['super-admin', 'admin'])]` (matches pattern in `bookingRoutes.ts`)
    - Register:
      - `GET /` → `...adminOnly, getNotifications`
      - `PATCH /read-all` → `...adminOnly, markAllRead`
      - `PATCH /:id/read` → `...adminOnly, markOneRead`
    - Export default router
    - _Requirements: 4.3, 4.4, 4.5_
  - [x] 4.2 Mount notification routes in `server/src/app.ts`
    - Import `notificationRoutes` from `./routes/notificationRoutes`
    - Add `app.use('/api/v1/notifications', notificationRoutes)` after the existing `dashboardRoutes` line
    - No other changes to `app.ts`
    - _Requirements: 4.3_

- [x] 5. Update `env.ts` with `ADMIN_WHATSAPP_NUMBER` validation
  - [x] 5.1 Add optional `ADMIN_WHATSAPP_NUMBER` field to the Zod schema in `server/src/config/env.ts`
    - Add `ADMIN_WHATSAPP_NUMBER: z.string().regex(/^977\d{9,10}$/, 'ADMIN_WHATSAPP_NUMBER must match ^977\\d{9,10}$').optional()` to the `envSchema` object
    - Because this field is optional, `envSchema.parse(process.env)` must not throw when it is absent — **do not change `envSchema.parse` to `.safeParse`**
    - After `export const env = envSchema.parse(process.env)`, add a startup warning block:
      ```typescript
      if (!env.ADMIN_WHATSAPP_NUMBER) {
        console.warn('[env] ADMIN_WHATSAPP_NUMBER is not set — WhatsApp link generation is disabled');
      }
      ```
    - _Requirements: 9.1, 9.2, 9.3_

- [x] 6. Update `server/.env.example` with `ADMIN_WHATSAPP_NUMBER`
  - [x] 6.1 Add the new variable to `server/.env.example`
    - Append after the `ADMIN_NOTIFICATION_EMAIL` line:
      ```
      # Admin WhatsApp number for booking alerts (Nepal format: 977 + 9-10 digits, no leading 0)
      # Example: 97798XXXXXXXX — leave empty to disable WhatsApp link generation
      ADMIN_WHATSAPP_NUMBER=977XXXXXXXXXX
      ```
    - _Requirements: 9.4_

- [x] 7. Update `bookingService.ts` to fire notification and fix email call
  - [x] 7.1 Add fire-and-forget `createBookingNotification` call in `createBooking`
    - In `server/src/services/bookingService.ts`, import `notificationService` from `'./notificationService'`
    - In `createBooking`, after the existing fire-and-forget `emailService.sendBookingNotification(booking).catch(...)` call, add:
      ```typescript
      notificationService.createBookingNotification(booking).catch((err) =>
        logError('Booking notification creation failed', { message: err.message }),
      );
      ```
    - The notification call must be fire-and-forget (non-blocking) identical to the email call pattern already present (Requirement 1.7 / design constraint)
    - Do not modify any other logic in `bookingService.ts`
    - _Requirements: 4.1_

- [x] 8. Update `emailService.ts`: fix subjects, CTA links, conditional notes, and customer message
  - [x] 8.1 Fix admin notification email subject and CTA link
    - In `sendBookingNotification`, update the subject to match Requirement 1.2:
      `\`[New Booking] ${booking.bookingId} — ${booking.eventType} on ${new Date(booking.eventDate).toDateString()}\``
      _(already correct — verify and leave unchanged if so)_
    - Update the admin email CTA `href` from `${env.FRONTEND_URL}/admin/bookings` to `${env.FRONTEND_URL}/admin/bookings/${booking._id}` (Requirement 1.4 — links to specific booking detail page, not the list)
    - _Requirements: 1.2, 1.4_
  - [x] 8.2 Fix customer confirmation email subject and CTA, add "30 minutes" message
    - In `sendBookingConfirmation`, update the subject to exactly `\`Booking Received — ${booking.bookingId} | Shree Ganesh Party Venue\`` (Requirement 2.2)
    - Replace the existing `<p>` body copy with: `"Our team will contact you within 30 minutes."` displayed prominently (Requirement 2.3, 10.3)
    - Confirm the CTA links to `${env.FRONTEND_URL}/contact` (Requirement 2.4 — already set, verify)
    - _Requirements: 2.2, 2.3, 2.4, 10.3_
  - [x] 8.3 Add conditional `notes` rendering in both admin and customer email templates
    - In `sendBookingNotification` HTML body: the notes block `${booking.notes ? ...notes block... : ''}` is already present — verify it renders nothing (no empty `<div>`) when `booking.notes` is falsy (Requirement 10.5)
    - In `sendBookingConfirmation` HTML body: add the same conditional notes block after the `guestCount` field — only rendered when `booking.notes` is a non-empty string (Requirement 10.5)
    - Pattern: `${booking.notes ? \`<div class="field"><div class="label">Notes</div><div class="value">${booking.notes}</div></div>\` : ''}`
    - _Requirements: 10.5_

- [x] 9. Add `Notification` interface to frontend types
  - [x] 9.1 Add `Notification` interface and `NotificationType` to `client/src/types/index.ts`
    - Append at the bottom of the file (after the `PaginatedApiResponse` interface):
      ```typescript
      // ─── Notification ─────────────────────────────────────────────────────────────
      export type NotificationType = 'booking' | 'inquiry';

      export interface Notification {
        _id: string;
        type: NotificationType;
        title: string;
        message: string;
        link: string;
        whatsappAlertLink?: string;
        isRead: boolean;
        createdAt: string;
      }
      ```
    - _Requirements: 4.1, 4.7_

- [ ] 10. Update `notificationStore.ts` with new type fields and actions
  - [x] 10.1 Rewrite `client/src/store/notificationStore.ts` to match the new `Notification` type
    - Replace the local `Notification` interface with an import: `import type { Notification } from '@/types'`
    - Add `title` and `isRead` usage to the store (the interface already lives in types now)
    - Expand `NotificationState` with:
      - `setNotifications(notifications: Notification[]): void` — replace the entire `notifications` array and recalculate `unreadCount` as `notifications.filter(n => !n.isRead).length`
      - `markOneRead(id: string): void` — find the notification by `_id`, set its `isRead` to `true`, decrement `unreadCount` by 1 (floor 0)
    - Update `addNotification` to use `n._id` as the key (the existing store uses `n.id` but the API returns `_id`); keep the 20-item cap
    - Update `markAllRead` to also set `isRead: true` on all items in the `notifications` array (not just reset `unreadCount`)
    - Keep `setUnreadCount` action unchanged
    - _Requirements: 4.7, 4.8, 4.9_

- [ ] 11. Create `useNotificationPolling.ts` custom hook
  - [~] 11.1 Create `client/src/hooks/useNotificationPolling.ts`
    - The hook must:
      1. Read `isAuthenticated` and `idToken` from `useAuthStore` to gate all fetching (Requirement 11.1)
      2. On mount (when `isAuthenticated` is `true`), perform an initial fetch of `GET /api/v1/notifications` via `axiosInstance` and call `setNotifications` on the store (Requirement 11.4)
      3. After the initial fetch, start a `setInterval` with a 30-second interval that re-fetches and calls `setNotifications` (Requirement 4.6)
      4. On fetch, calculate `unreadCount` from the response and call `setUnreadCount` on the store
      5. If `isAuthenticated` changes to `false` (logout), clear the interval and abort any in-flight requests using `AbortController` (Requirement 11.2)
      6. If the fetch returns a 401 (`axios.isAxiosError(err) && err.response?.status === 401`), stop polling and clear the interval without displaying an error (Requirement 11.3)
      7. For any other non-401 error, log silently and retry on the next interval tick — do not reset the existing notifications array (Requirement 11.5)
      8. Return `void` (no return value needed — store is the source of truth)
    - Cleanup: return a cleanup function from `useEffect` that clears the interval and calls `controller.abort()`
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5_

- [ ] 12. Update `NotificationDropdown.tsx` to integrate polling, WhatsApp button, and read states
  - [~] 12.1 Update `client/src/components/shared/NotificationDropdown.tsx`
    - Import and call `useNotificationPolling()` at the top of the `NotificationBell` component (this starts/stops polling with auth lifecycle — Requirement 4.6)
    - Import `setNotifications`, `markOneRead`, `markAllRead` from the updated store
    - Update the `markAllRead` button: on click call `PATCH /api/v1/notifications/read-all` via `axiosInstance`, then call `markAllRead()` on the store (Requirement 4.9)
    - For each notification item in the dropdown:
      - Apply visual dimming when `n.isRead` is `true`: add `opacity-50` to the container className
      - On click of the notification row, call `axiosInstance.patch(\`/api/v1/notifications/${n._id}/read\`)` and then `markOneRead(n._id)` (Requirement 4.5)
      - Render the notification `title` (e.g., "New Booking") as a small bold label above the `message` text
      - When `n.type === 'booking'` and `n.whatsappAlertLink` is a non-empty string, render a WhatsApp icon button (`<a href={n.whatsappAlertLink} target="_blank" rel="noopener noreferrer">`) with a 💬 icon, positioned to the right of the notification content (Requirement 4.10)
    - The unread badge already renders `{unreadCount > 9 ? '9+' : unreadCount}` — verify this is unchanged (Requirement 4.8)
    - Keep existing `formatDistanceToNow` timestamp rendering
    - _Requirements: 4.6, 4.7, 4.8, 4.9, 4.10_

- [ ] 13. Update `BookingsPage.tsx` with CRM enhancements
  - [~] 13.1 Add Actions column, source tag, total count display, pending row highlight, and pagination reset
    - Add "Actions" as the last column header in the `<thead>` row (after "Status") — Requirement 8.1
    - In each `<tbody>` row, add a `<td>` with three action items:
      1. A `<Link to={\`/admin/bookings/${b._id}\`}>` "View" icon/button (📋 or eye icon)
      2. A `<a href={whatsAppLink} target="_blank" rel="noopener noreferrer">` WhatsApp button (💬) where `whatsAppLink = \`https://wa.me/977${b.phone.replace(/^0/, '').replace(/\D/g, '')}?text=${encodeURIComponent('Re: Booking ' + b.bookingId)}\`` (Requirement 8.1)
      3. A `<a href={\`tel:${b.phone}\`}>` Call button (📞) (Requirement 8.1)
    - Add `source` column next to the "Status" column — render `b.source` as a small `<span>` tag with neutral styling `bg-gray-100 text-gray-500 rounded px-1.5 py-0.5 text-xs` (Requirement 8.2)
    - Show total count above the table: `<p className="mb-2 text-sm text-gray-500">{pagination?.total ?? 0} booking{pagination?.total !== 1 ? 's' : ''} found</p>` (Requirement 8.4)
    - Highlight `pending` rows: apply `border-l-4 border-yellow-400` to the `<tr>` when `b.status === 'pending'` (Requirement 8.5)
    - Pagination already resets to page 1 on filter/search change (existing `onChange` handlers already call `setPage(1)`) — verify this is working for both `status` and `search` inputs
    - Add `'contacted'` → blue and `'completed'` → gray status badge colors which are missing from the current `statusColors` ternary (Requirement 6.5)
    - _Requirements: 6.5, 8.1, 8.2, 8.3, 8.4, 8.5_

- [ ] 14. Update `BookingDetailPage.tsx` with "Contact Customer" section and CRM status panel
  - [~] 14.1 Add "Contact Customer" section with Call, WhatsApp, and Email buttons
    - Add a new card `<div className="rounded-xl bg-white p-5 shadow-sm sm:col-span-2">` before the "Update Status" card in the grid
    - Card heading: `<h2 className="mb-3 font-semibold text-charcoal">Contact Customer</h2>` — always visible even when some contact fields are missing (Requirement 7.4)
    - Render three buttons in a flex row:
      1. `<a href={\`tel:${booking.phone}\`} className="...">📞 Call</a>` — always render (Requirement 7.1)
      2. `<a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="...">💬 WhatsApp</a>` where `whatsappLink = \`https://wa.me/977${booking.phone.replace(/^0/, '').replace(/\D/g, '')}?text=${encodeURIComponent('Re: Booking ' + booking.bookingId + ' on ' + new Date(booking.eventDate).toDateString())}\`` (Requirement 7.2)
      3. Only render the Email button when `booking.email` is non-empty: `<a href={\`mailto:${booking.email}?subject=Re: Booking ${booking.bookingId}\`} className="...">✉️ Email</a>` (Requirement 7.3)
    - Button styling: `rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium hover:bg-gray-50 transition`
    - Move the `notes` section: conditionally render it below the "Contact Customer" card (not inside the grid section as currently done) — render only when `booking.notes` is non-empty (Requirement 7.4)
    - _Requirements: 7.1, 7.2, 7.3, 7.4_
  - [~] 14.2 Add CRM status colour-coding to the status badge on the detail page
    - The `statusColors` map already includes all five statuses (`pending`, `contacted`, `confirmed`, `completed`, `cancelled`) — verify the `contacted` = blue mapping is present; add it if missing (Requirement 6.5)
    - The status badge in the page header and the "Update Status" button colours should use this same map — already implemented, verify correctness
    - _Requirements: 6.5, 6.7_

- [ ] 15. Wire `createInquiryNotification` into `inquiryService.ts`
  - [~] 15.1 Add fire-and-forget notification call in inquiry creation
    - In `server/src/services/inquiryService.ts`, import `notificationService` from `'./notificationService'`
    - In `createInquiry`, after the existing `emailService.sendInquiryNotification(inquiry).catch(...)` call, add:
      ```typescript
      notificationService.createInquiryNotification(inquiry).catch((err) =>
        logError('Inquiry notification creation failed', { message: err.message }),
      );
      ```
    - Do not modify any other logic in `inquiryService.ts`
    - _Requirements: 4.2_

---

## Task Dependency Graph

```json
{
  "waves": [
    { "wave": 1, "tasks": ["1", "5", "6", "8", "9"] },
    { "wave": 2, "tasks": ["2", "10"] },
    { "wave": 3, "tasks": ["3", "11", "13"] },
    { "wave": 4, "tasks": ["4", "7", "12", "14", "15"] }
  ]
}
```

**Wave rationale:**
- Wave 1 — Foundations with no cross-feature dependencies: Notification model, env config, .env.example update, emailService fixes, frontend Notification type.
- Wave 2 — Services that depend on Wave 1: notificationService (needs model + env), notificationStore update (needs Notification type).
- Wave 3 — Controller/hook layer: notificationController+schema (needs service), polling hook (needs updated store), BookingsPage enhancements (standalone).
- Wave 4 — Integration and wiring: routes+app.ts mount (needs controller), bookingService update (needs notificationService), NotificationDropdown (needs hook+store), BookingDetailPage (standalone), inquiryService update (needs notificationService).

**Recommended linear order within waves:**
1 → 5 → 6 → 8 → 9 → 2 → 10 → 3 → 11 → 13 → 4 → 7 → 12 → 14 → 15

---

## Notes

- **Non-blocking constraint**: Every notification side-effect (email, in-app notification) must use fire-and-forget `.catch(logError)` pattern. Never `await` these inside the booking/inquiry creation flow.
- **WhatsApp degradation**: If `ADMIN_WHATSAPP_NUMBER` is absent or invalid, `generateWhatsAppLink` returns `null`. The notification record is still created (without `whatsappAlertLink`). No error is surfaced to the user.
- **Phone normalisation for WhatsApp links on the frontend**: Strip leading `0` and non-digits from `booking.phone` before building the `wa.me/977{digits}` URL. The backend number (stored in DB) may have a leading `0` or spaces.
- **Existing email retry logic**: `sendWithRetry` in `emailService.ts` already implements 2-retry with exponential back-off. No changes are needed to the retry mechanism — only the subject, CTA link, and notes rendering need to be updated.
- **`notificationStore` key change**: The existing store uses `n.id` as the React key. The API returns `_id`. Update the store and all downstream usage to use `_id` consistently.
- **No new Mongoose model for Booking**: The `Booking` model already includes `statusHistory`, `source`, and all CRM fields. No schema migration is required.
- **Test framework**: The project uses **Vitest** on the frontend (`vitest.config.ts` present). The backend uses **Jest** with `ts-jest`. No new testing frameworks should be introduced.
