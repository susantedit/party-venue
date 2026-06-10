# Requirements Document

## Booking Notification & CRM System
### Shree Ganesh Party Venue & Catering Service

---

## Introduction

This feature extends the existing booking system of Shree Ganesh Party Venue with a comprehensive notification pipeline and a lightweight CRM (Customer Relationship Management) layer. When a customer submits a booking request, three parallel actions are triggered: an admin email alert via Resend, a WhatsApp deep-link notification mechanism for the admin's phone, and a confirmation email to the customer. The admin dashboard gains a live notification feed (polling-based) and an enriched Bookings page with CRM-style lead management: each booking carries a status (New → Contacted → Confirmed → Rejected → Completed) and quick-action buttons (📞 Call, 💬 WhatsApp, ✉️ Email Reply) so the admin can reach customers in one click. The system is designed for Nepal's business context where WhatsApp is the primary communication channel.

---

## Glossary

- **Notification_Service**: The backend module responsible for triggering all post-booking notification actions (email to admin, email to customer, WhatsApp link generation).
- **Email_Service**: The existing Resend-based email service (`emailService.ts`) that sends transactional emails.
- **Booking_Controller**: The Express controller that receives `POST /api/v1/bookings` requests and delegates to `bookingService.createBooking`.
- **Booking_Service**: The backend service layer (`bookingService.ts`) that handles booking creation, status transitions, and CRM state management.
- **Notification_Endpoint**: The new `GET /api/v1/notifications` REST endpoint that returns recent unread notifications for the admin dashboard.
- **Notification_Store**: The existing Zustand store (`notificationStore.ts`) that holds in-memory notification state on the frontend.
- **Notification_Bell**: The existing React component (`NotificationDropdown.tsx`) that renders the notification bell icon and dropdown in the admin top bar.
- **CRM_Status**: The booking status pipeline used for lead management. Valid values are `pending`, `contacted`, `confirmed`, `completed`, and `cancelled`.
- **WhatsApp_Link**: A URL of the form `https://wa.me/977{phone}?text={encodedMessage}` that opens a pre-filled WhatsApp chat on any device.
- **Admin_Dashboard**: The JWT-protected admin panel served at `/admin/*`.
- **Polling_Interval**: The 30-second client-side interval at which the Admin_Dashboard fetches new notifications from the Notification_Endpoint.
- **Auto_Reply**: The automated booking confirmation email sent to the customer immediately after a booking is saved to the database.
- **Lead**: A booking record treated as a sales lead within the CRM workflow.

---

## Requirements

---

### Requirement 1: Admin Email Notification on New Booking

**User Story:** As an admin of Shree Ganesh Party Venue, I want to receive an email immediately when a customer submits a booking request, so that I can respond even when I am not actively watching the dashboard.

#### Acceptance Criteria

1. WHEN a customer submits a valid booking form and THE Booking_Service saves the record to the database, THE Email_Service SHALL send an HTML email to the address stored in `ADMIN_NOTIFICATION_EMAIL`.
2. THE Email_Service SHALL set the email subject to `[New Booking] {bookingId} — {eventType} on {eventDate}`.
3. THE Email_Service SHALL include the following fields in the email body: `bookingId`, `customerName`, `phone`, `email`, `eventType`, `eventDate`, `guestCount`, and `notes` (when present).
4. THE Email_Service SHALL include a CTA button linking to `{FRONTEND_URL}/admin/bookings/{bookingId}` in the email body.
5. IF the email delivery attempt fails, THEN THE Email_Service SHALL retry up to 2 times with exponential back-off before logging the failure.
6. IF all retry attempts fail, THEN THE Booking_Service SHALL NOT block or roll back the booking creation — the failure SHALL be logged only.
7. THE Email_Service SHALL complete the email dispatch asynchronously so that THE Booking_Controller responds to the customer within 3 seconds regardless of email delivery latency.

---

### Requirement 2: Customer Auto-Reply Confirmation Email

**User Story:** As a customer who has submitted a booking request, I want to receive an immediate confirmation email, so that I know my request was received and feel confident that the venue will follow up.

#### Acceptance Criteria

1. WHEN a booking is saved and THE Email_Service sends the admin notification, THE Email_Service SHALL also send a confirmation email to the `email` address stored on the booking record.
2. THE Email_Service SHALL set the confirmation email subject to `Booking Received — {bookingId} | Shree Ganesh Party Venue`.
3. THE Email_Service SHALL include the following in the confirmation email body: `bookingId`, `eventType`, `eventDate`, `guestCount`, and the message "Our team will contact you within 30 minutes."
4. THE Email_Service SHALL include a CTA button linking to `{FRONTEND_URL}/contact` in the confirmation email body.
5. IF the customer confirmation email fails, THEN THE Email_Service SHALL log the failure without affecting the admin notification or the booking record.
6. WHERE the booking record contains a valid `email` address, THE Email_Service SHALL dispatch the confirmation email even if the admin notification fails independently.

---

### Requirement 3: WhatsApp Admin Notification

**User Story:** As an admin in Nepal, I want to receive a WhatsApp message when a new booking arrives, so that I can act on leads immediately from my phone since WhatsApp is my primary communication tool.

#### Acceptance Criteria

1. WHEN a booking is saved AND (`guestCount` is greater than 0 OR `phone` is a non-empty string that passes basic format validation), THE Notification_Service SHALL generate a WhatsApp_Link targeting the admin's WhatsApp number configured in the environment variable `ADMIN_WHATSAPP_NUMBER`.
2. IF a booking has `guestCount` equal to 0 AND `phone` is empty or fails validation, THEN THE Notification_Service SHALL skip WhatsApp link generation, store the booking in the database only, and send the admin notification email instead.
3. THE Notification_Service SHALL encode the WhatsApp message with the following content: booking ID, customer name, event type, event date, guest count, and customer phone number.
4. THE Notification_Service SHALL store the generated WhatsApp_Link as a `whatsappAlertLink` field on the in-app notification record so the Admin_Dashboard can render it as a clickable button.
5. THE Notification_Service SHALL construct the WhatsApp_Link in the format `https://wa.me/977{phoneDigits}?text={urlEncodedMessage}` where `phoneDigits` is the admin phone without the leading `0` or country code prefix.
6. IF `ADMIN_WHATSAPP_NUMBER` is not configured or fails the `^977\d{9,10}$` validation pattern, THEN THE Notification_Service SHALL skip WhatsApp link generation and log a warning without failing the booking creation flow.
7. IF the WhatsApp API or link generation fails more than 3 times within a 10-minute window (rate limit threshold), THEN THE Notification_Service SHALL disable WhatsApp link generation for subsequent requests in that window and log the threshold breach.

---

### Requirement 4: In-App Notification Feed (Admin Dashboard)

**User Story:** As an admin, I want to see a live notification feed in the dashboard with recent bookings and inquiries, so that I never miss a lead even if I did not receive the email.

#### Acceptance Criteria

1. WHEN a booking is saved, THE Notification_Service SHALL create a notification record in the database with fields: `type` (`booking`), `title`, `message`, `link` (to the booking detail page), `whatsappAlertLink`, `isRead` (`false`), and `createdAt`.
2. WHEN an inquiry is submitted, THE Notification_Service SHALL create a notification record with `type` set to `inquiry`, a `link` to `/admin/inquiries`, and `isRead` set to `false`.
3. THE Notification_Endpoint SHALL expose `GET /api/v1/notifications` (admin-only) that returns the 20 most recent notification records sorted by `createdAt` descending.
4. THE Notification_Endpoint SHALL expose `PATCH /api/v1/notifications/read-all` (admin-only) that sets `isRead` to `true` on all notification records.
5. THE Notification_Endpoint SHALL expose `PATCH /api/v1/notifications/:id/read` (admin-only) that sets `isRead` to `true` on a single notification record.
6. WHILE the admin is logged into the Admin_Dashboard, THE Notification_Bell component SHALL poll THE Notification_Endpoint every 30 seconds to fetch new notifications.
7. WHEN new unread notifications are returned by the poll, THE Notification_Store SHALL update the `unreadCount` and prepend the new items to the `notifications` array.
8. THE Notification_Bell component SHALL display the `unreadCount` as a red badge when `unreadCount` is greater than zero, capped at `9+`.
9. WHEN the admin clicks "Mark all read", THE Notification_Bell component SHALL call `PATCH /api/v1/notifications/read-all` and set `unreadCount` to zero in THE Notification_Store.
10. WHERE a notification has `type` equal to `booking` and a non-null `whatsappAlertLink`, THE Notification_Bell dropdown SHALL render a WhatsApp icon button linking to the `whatsappAlertLink`.

---

### Requirement 5: Notification Database Model

**User Story:** As a developer, I want a dedicated Notification model in MongoDB, so that notification state persists across admin sessions and server restarts.

#### Acceptance Criteria

1. THE Notification_Service SHALL store notifications in a `Notification` MongoDB collection with the following fields: `type` (enum: `booking` | `inquiry`), `title` (String), `message` (String), `link` (String), `whatsappAlertLink` (String, optional), `isRead` (Boolean, default `false`), `createdAt` (Date).
2. THE Notification_Service SHALL create a database index on `isRead` and a compound index on `(isRead, createdAt)` to support fast unread queries.
3. THE Notification_Service SHALL automatically delete notification records older than 90 days using a MongoDB TTL index on `createdAt` with `expireAfterSeconds: 7776000`.
4. THE Notification_Service SHALL cap the active notification records in the collection at 500 by deleting the oldest records when the count exceeds that limit.

---

### Requirement 6: CRM Lead Status Management

**User Story:** As an admin, I want each booking to have a clear CRM status that I can update, so that I can track the full sales pipeline from new lead to completed event.

#### Acceptance Criteria

1. THE Booking_Service SHALL enforce the following CRM_Status transition rules: `pending` → `contacted` or `cancelled`; `contacted` → `confirmed` or `cancelled`; `confirmed` → `completed` or `cancelled`; `completed` → no further transitions; `cancelled` → no further transitions.
2. IF an admin requests a status transition not permitted by the state machine, THEN THE Booking_Service SHALL return HTTP 400 with the message `"Invalid status transition: {currentStatus} → {requestedStatus}"`.
3. WHEN a status transition is applied, THE Booking_Service SHALL append an entry to the `statusHistory` array on the booking document containing `{ status, changedAt, changedBy }`.
4. THE Booking_Service SHALL set `changedBy` to the Firebase UID of the authenticated admin making the request.
5. THE Bookings page SHALL display each booking's CRM_Status as a color-coded badge: `pending` = yellow, `contacted` = blue, `confirmed` = green, `completed` = gray, `cancelled` = red.
6. THE Bookings page SHALL render a status filter dropdown allowing the admin to filter the booking list by exactly one CRM_Status value at a time, or view all bookings when no filter is selected.
7. WHEN the admin updates a booking's status on the Booking Detail page, THE Booking_Service SHALL return the updated booking record and THE Admin_Dashboard SHALL optimistically reflect the new status without a full page reload.

---

### Requirement 7: CRM Quick-Action Contact Buttons

**User Story:** As an admin, I want one-click contact buttons on each booking, so that I can call, WhatsApp, or email a customer without copying numbers or switching apps.

#### Acceptance Criteria

1. THE Booking Detail page SHALL render a "📞 Call" button as an `<a href="tel:{phone}">` link using the booking's `phone` field.
2. THE Booking Detail page SHALL render a "💬 WhatsApp" button as an `<a href="{WhatsApp_Link}">` link where `WhatsApp_Link` is `https://wa.me/977{phone}?text={encodedMessage}` and `encodedMessage` is a pre-filled message containing the booking ID and event date.
3. WHERE the booking record contains a non-empty `email` field, THE Booking Detail page SHALL render an "✉️ Email" button as an `<a href="mailto:{email}?subject=Re: Booking {bookingId}">` link.
4. THE Booking Detail page SHALL render all three contact buttons in a dedicated "Contact Customer" section above the status update panel. THE "Contact Customer" section SHALL always be visible even when the booking record lacks some contact fields. WHERE the booking record contains a `notes` field that is non-empty, THE Booking Detail page SHALL render a "Notes" section below the contact buttons. WHERE `notes` is absent or empty, THE "Notes" section SHALL be hidden.
5. THE Bookings list page SHALL render a "💬 WhatsApp" icon button in the Actions column of each booking row linking to the corresponding WhatsApp_Link.
6. THE Bookings list page SHALL render a "📞" icon button in the Actions column of each booking row as a `tel:` link.

---

### Requirement 8: Booking List Page CRM Enhancements

**User Story:** As an admin, I want the bookings list page to show CRM-relevant information and actions inline, so that I can manage the pipeline without opening every booking individually.

#### Acceptance Criteria

1. THE Bookings page SHALL display an "Actions" column in the bookings table containing: a link to the Booking Detail page, a quick WhatsApp button, and a quick Call button.
2. THE Bookings page SHALL display the booking's `source` field (website / whatsapp / phone / referral) as a small tag in the table row.
3. WHEN the admin changes the status filter or search query, THE Bookings page SHALL reset the pagination to page 1, where page numbering is user-facing and starts from 1.
4. THE Bookings page SHALL show the total count of bookings matching the current filter above the table.
5. THE Bookings page SHALL highlight rows where `status` is `pending` with a subtle left border accent to draw attention to new leads.

---

### Requirement 9: WhatsApp Environment Configuration

**User Story:** As a developer deploying this system, I want all WhatsApp and notification configuration to be driven by environment variables, so that the system is portable and secrets are not hardcoded.

#### Acceptance Criteria

1. THE Notification_Service SHALL read the admin WhatsApp number from the environment variable `ADMIN_WHATSAPP_NUMBER`.
2. THE server `env.ts` configuration validator SHALL validate that `ADMIN_WHATSAPP_NUMBER` is a string matching the pattern `^977\d{9,10}$` (Nepal country code + number).
3. IF `ADMIN_WHATSAPP_NUMBER` fails validation, THEN THE server startup SHALL log a warning and treat WhatsApp link generation as disabled for all subsequent requests without throwing a startup error.
4. THE server `.env.example` file SHALL include `ADMIN_WHATSAPP_NUMBER=977XXXXXXXXXX` with a comment explaining the format.

---

### Requirement 10: Email Template Quality

**User Story:** As an admin and customer, I want notification emails to be professional and mobile-responsive, so that they look credible on any device including smartphones commonly used in Nepal.

#### Acceptance Criteria

1. THE Email_Service SHALL use the existing `baseTemplate` HTML wrapper for all notification emails to maintain consistent branding.
2. THE Email_Service SHALL render the admin booking alert email with a gold CTA button linking to the booking detail page in the Admin_Dashboard.
3. THE Email_Service SHALL render the customer confirmation email with the message "Our team will contact you within 30 minutes." prominently visible.
4. THE Email_Service SHALL include the venue's name ("Shree Ganesh Party Venue"), location ("Bhaktapur, Nepal"), and the current year in the email footer.
5. WHEN `booking.notes` is present and non-empty, THE Email_Service SHALL include the notes field in both the admin alert email and the customer confirmation email. WHEN `booking.notes` is absent or empty, THE Email_Service SHALL omit the notes section entirely from the email body rather than rendering an empty block.

---

### Requirement 11: Notification Polling Lifecycle

**User Story:** As a developer, I want the frontend notification polling to start and stop correctly with the admin session, so that it does not leak timers or make unnecessary API calls when the admin is not logged in.

#### Acceptance Criteria

1. WHEN the admin navigates to any page within the Admin_Dashboard, THE Notification_Bell component SHALL verify that a valid authentication token exists in the Notification_Store or local session before starting the 30-second polling interval. IF no valid token is present, THE component SHALL NOT initiate polling.
2. WHEN the admin logs out or the session expires, THE Notification_Bell component SHALL clear the polling interval and abort any pending in-flight requests to prevent unauthenticated API calls and memory leaks.
3. WHEN the Notification_Endpoint returns a 401 response during polling, THE Notification_Bell component SHALL stop polling and clear the interval without displaying an error to the user.
4. THE Notification_Bell component SHALL load the initial notification list with a single fetch on mount before the polling interval begins, and this initial fetch SHALL also be gated on the presence of a valid authentication token.
5. IF the Notification_Endpoint returns an error (non-401), THEN THE Notification_Bell component SHALL silently ignore the error and retry on the next polling cycle without resetting the existing notification list.

