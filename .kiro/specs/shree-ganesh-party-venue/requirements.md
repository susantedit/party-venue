# Requirements Document

## Introduction

Shree Ganesh Party Venue & Catering Service is a full production-grade MERN stack platform for a premium event venue and catering business located in Bhaktapur, Nepal. The platform serves as a lead generation system, booking engine, event management platform, and marketing website simultaneously.

The system comprises a public-facing marketing website, an online booking and inquiry system, a media gallery with CMS, a blog and content system, a packages and menu management system, and a secure admin dashboard for managing all business operations.

The primary business goal is to convert website visitors into paying customers by generating qualified venue booking inquiries and catering leads. The system must communicate luxury, reliability, and professionalism while remaining fast, accessible, and SEO-optimized.

---

## Glossary

- **Platform**: The complete Shree Ganesh Party Venue & Catering Service web application including the marketing website, booking system, and admin dashboard.
- **Frontend**: The React/Vite/TypeScript client-side application served to visitors and admins.
- **Backend**: The Node.js/Express.js REST API server providing all data and business logic.
- **Database**: The MongoDB Atlas instance storing all Platform data.
- **Booking_System**: The module that collects, stores, and manages venue booking requests from customers.
- **Gallery_CMS**: The content management system for uploading, categorizing, and displaying event photos.
- **Blog_System**: The module for creating, publishing, and displaying SEO-optimized blog articles.
- **Package_System**: The module for defining, managing, and displaying event packages with pricing.
- **Menu_System**: The module for managing and displaying food menu items by category.
- **Inquiry_System**: The contact form module that collects and manages general customer inquiries.
- **Admin_Dashboard**: The protected management interface for business operations accessible only to authorized admins.
- **Availability_Checker**: The feature that allows users to query whether the venue is available on a given date.
- **Cost_Calculator**: The feature that provides an estimated event cost based on guest count, package, and event type.
- **Admin**: A user with the role of `super-admin`, `admin`, or `editor` who has authenticated access to the Admin_Dashboard.
- **Customer**: A public visitor who browses the marketing website and may submit bookings or inquiries.
- **API**: The versioned REST API at base path `/api/v1` that connects Frontend to Backend.
- **Cloudinary**: The external cloud storage service used for all image uploads and delivery.
- **JWT**: The JSON Web Token used for Admin authentication and session management.
- **Nodemailer**: The email delivery service used for booking and inquiry notifications.
- **Booking**: A venue reservation request submitted by a Customer containing event details.
- **Inquiry**: A general contact form submission from a Customer.
- **Package**: A predefined event bundle (Silver, Gold, Platinum, or Custom) with pricing, capacity, and feature list.
- **SEO_Manager**: The subsystem responsible for meta tags, Open Graph, structured data, sitemap, and canonical URLs.
- **Rate_Limiter**: The middleware that restricts the number of API requests per IP within a time window.
- **Validator**: The server-side input validation layer using Zod or Joi.
- **Sanitizer**: The middleware that prevents MongoDB injection and XSS attacks.

---

## Requirements

---

### Requirement 1: Marketing Website – Public Pages

**User Story:** As a Customer, I want to browse a professional marketing website, so that I can learn about the venue, services, and offerings before deciding to make a booking.

#### Acceptance Criteria

1. THE Frontend SHALL render the following public pages: Home, About, Services, Gallery, Packages, Menu, Blog, Contact, and Booking.
2. WHEN a Customer navigates to the root URL, THE Frontend SHALL display the Home page with a Hero Section containing a venue background video or image, a headline, primary CTA buttons (Book Venue, Get Quote, Contact Us), and trust badges.
3. THE Frontend SHALL display a statistics section on the Home page showing events completed, years of experience, happy clients count, and venue capacity.
4. THE Frontend SHALL display a Services section on the Home page with cards for Wedding Venue, Reception, Birthday Parties, Bratabandha, Pasni, Corporate Events, Catering, and Decoration.
5. THE Frontend SHALL display a featured gallery section on the Home page showing recent event images with a "View Full Gallery" button.
6. THE Frontend SHALL display a testimonials section on the Home page showing customer reviews with ratings.
7. THE Frontend SHALL include a sticky Header component containing the logo, navigation links, a "Book Now" CTA button, and a responsive mobile hamburger menu.
8. THE Frontend SHALL include a floating WhatsApp button that is always visible on all public pages.
9. WHILE a Customer navigates between pages, THE Frontend SHALL preserve scroll position reset and update the browser title and meta tags for each page.
10. IF a Customer navigates to a URL that does not match any defined route, THEN THE Frontend SHALL display a 404 Not Found page with a link back to the Home page.

---

### Requirement 2: Booking System

**User Story:** As a Customer, I want to submit a venue booking inquiry online, so that I can reserve the venue for my event without needing to visit in person.

#### Acceptance Criteria

1. THE Frontend SHALL render a Booking page with a form containing the following required fields: Full Name, Phone, Email, Event Type, Event Date, and Guest Count.
2. THE Frontend SHALL render optional fields on the Booking form: Package selection, Catering Required toggle, Decoration Required toggle, and Additional Notes.
3. WHEN a Customer submits the Booking form, THE Frontend SHALL validate all required fields before sending the request to the API.
4. IF a required field is empty or contains invalid data when the Customer submits the form, THEN THE Frontend SHALL display a field-level error message without submitting the request.
5. WHEN a Customer submits a valid Booking form, THE Booking_System SHALL store the booking in the Database with a `pending` status and a generated booking ID.
6. WHEN a new Booking is created, THE Backend SHALL send an email notification to the admin via Nodemailer within 60 seconds of submission.
7. WHEN a new Booking is created, THE Frontend SHALL display a success confirmation message to the Customer.
8. WHEN a Customer selects an Event Date on the Booking form, THE Availability_Checker SHALL query the API and indicate whether the selected date is available, reserved, or booked.
9. IF the selected Event Date is already booked, THEN THE Frontend SHALL display an availability warning to the Customer before form submission.
10. THE Booking_System SHALL accept event type values from the following set: Wedding, Reception, Birthday, Bratabandha, Pasni, Corporate, Catering, Decoration, Other.
11. THE Validator SHALL reject any Booking submission where Guest Count is less than 1.
12. THE Booking_System SHALL store the booking source field with value `website` for all bookings submitted through the Booking form.

---

### Requirement 3: Availability Checker

**User Story:** As a Customer, I want to check whether the venue is available on my desired event date, so that I can choose a date that is not already taken.

#### Acceptance Criteria

1. WHEN a Customer queries the Availability_Checker with a specific date, THE API SHALL return an availability status of `available`, `reserved`, or `booked` for that date.
2. THE Availability_Checker SHALL check all Bookings in the Database with status `confirmed` or `pending` before returning the availability result.
3. THE Frontend SHALL display the availability result with a color-coded indicator: green for available, yellow for reserved, and red for booked.
4. IF the queried date is in the past, THEN THE API SHALL return an error response indicating that past dates are not valid for booking.
5. THE Availability_Checker SHALL respond to availability queries within 2 seconds under normal load conditions.

---

### Requirement 4: Event Cost Calculator

**User Story:** As a Customer, I want to estimate the cost of my event based on my requirements, so that I can budget appropriately before making a formal inquiry.

#### Acceptance Criteria

1. THE Frontend SHALL render an Event Cost Calculator component that accepts inputs for Event Type, Guest Count, and Package selection.
2. WHEN a Customer provides valid inputs to the Cost_Calculator, THE Frontend SHALL compute and display an estimated cost without requiring an API call.
3. THE Frontend SHALL display the estimated cost range based on the selected Package's pricing and Guest Count.
4. IF a Customer selects a Guest Count that exceeds the capacity of the selected Package, THEN THE Frontend SHALL display a warning indicating the capacity limit.
5. THE Cost_Calculator SHALL update the displayed estimate in real time as the Customer changes input values.

---

### Requirement 5: Gallery System

**User Story:** As a Customer, I want to browse photos from past events organized by category, so that I can visualize the venue and services before booking.

#### Acceptance Criteria

1. THE Frontend SHALL display the Gallery page with a responsive masonry grid layout showing event photos.
2. THE Frontend SHALL provide category filter buttons on the Gallery page for the following categories: Wedding, Reception, Birthday, Catering, Decoration, Venue.
3. WHEN a Customer selects a category filter, THE Frontend SHALL display only gallery images matching the selected category without a full page reload.
4. WHEN a Customer clicks a gallery image, THE Frontend SHALL open a Lightbox overlay displaying the full image with keyboard navigation and swipe support.
5. THE Frontend SHALL lazy load gallery images as the Customer scrolls to improve page load performance.
6. THE Gallery_CMS SHALL support infinite scroll or pagination to load additional images beyond the initial set.
7. THE Gallery_CMS SHALL retrieve gallery images from the API endpoint `GET /api/v1/gallery` with optional `?category=` filter parameter.

---

### Requirement 6: Packages System

**User Story:** As a Customer, I want to view and compare event packages with clear pricing and feature lists, so that I can select the package that best suits my event needs and budget.

#### Acceptance Criteria

1. THE Frontend SHALL display the Packages page with a pricing grid showing Silver, Gold, Platinum, and Custom packages.
2. THE Package_System SHALL display for each package: Package Name, Price, Capacity, Features list, and a CTA button.
3. THE Frontend SHALL visually highlight the most popular package on the Packages page.
4. WHEN a Customer clicks the CTA on a package card, THE Frontend SHALL navigate the Customer to the Booking page with the selected package pre-filled.
5. THE Frontend SHALL display a "Request Custom Package" button on the Packages page that navigates to the Contact or Booking page.
6. THE Package_System SHALL retrieve active packages from the API endpoint `GET /api/v1/packages` and display only packages where `isActive` is `true`.

---

### Requirement 7: Menu System

**User Story:** As a Customer, I want to browse the available food menu by category, so that I can understand the catering options available for my event.

#### Acceptance Criteria

1. THE Frontend SHALL display the Menu page with food items organized by the following categories: Nepali, Newari, Indian, Chinese, BBQ, Desserts, Beverages.
2. THE Frontend SHALL display for each menu item: Name, Description, Image, and Category.
3. WHEN a Customer selects a category on the Menu page, THE Frontend SHALL filter and display only the items belonging to that category.
4. THE Menu_System SHALL retrieve menu items from the API endpoint `GET /api/v1/menu` with optional `?category=` filter parameter.
5. THE Menu_System SHALL display only items where `available` is `true`.

---

### Requirement 8: Blog System

**User Story:** As a Customer, I want to read blog articles about events and venue planning, so that I can gain information and trust in the business before booking.

#### Acceptance Criteria

1. THE Frontend SHALL display a Blog listing page showing blog cards with Featured Image, Title, Excerpt, Category, and publication date.
2. THE Frontend SHALL support category filtering and keyword search on the Blog listing page.
3. THE Frontend SHALL support pagination on the Blog listing page displaying a configurable number of posts per page.
4. WHEN a Customer clicks a blog card, THE Frontend SHALL navigate to the Blog detail page for that article using the blog slug as the URL path.
5. THE SEO_Manager SHALL generate unique meta title, meta description, and Open Graph tags for each blog detail page using the blog's `seoTitle` and `seoDescription` fields.
6. THE Blog_System SHALL retrieve published blog posts from the API endpoint `GET /api/v1/blogs` and display only blogs where `published` is `true`.
7. WHEN a Customer visits a blog detail page, THE Blog_System SHALL retrieve the blog content from `GET /api/v1/blogs/:slug`.

---

### Requirement 9: Inquiry System

**User Story:** As a Customer, I want to send a general inquiry to the business, so that I can ask questions or request information without committing to a booking.

#### Acceptance Criteria

1. THE Frontend SHALL display a Contact page with a contact form containing the following required fields: Name, Email, Phone, and Message.
2. THE Frontend SHALL display business contact information on the Contact page: Phone number, Email address, Physical address, Business hours, and an embedded Google Map.
3. WHEN a Customer submits a valid Contact form, THE Inquiry_System SHALL store the inquiry in the Database with status `unread`.
4. WHEN a new Inquiry is created, THE Backend SHALL send an email notification to the admin via Nodemailer within 60 seconds of submission.
5. IF a required field is empty or contains an invalid email format when the Customer submits the Contact form, THEN THE Frontend SHALL display a field-level error message without submitting the request.
6. WHEN a Customer submits the Contact form successfully, THE Frontend SHALL display a success confirmation message.
7. THE Rate_Limiter SHALL restrict the Inquiry submission endpoint to a maximum of 5 requests per IP address per 10-minute window.

---

### Requirement 10: SEO and Performance

**User Story:** As a business owner, I want the website to rank highly on local search results, so that potential customers in Bhaktapur and surrounding areas can find the venue organically.

#### Acceptance Criteria

1. THE SEO_Manager SHALL generate a unique meta title and meta description for every public page.
2. THE SEO_Manager SHALL include Open Graph and Twitter Card meta tags on every public page.
3. THE SEO_Manager SHALL include Local Business schema markup (JSON-LD) on the Home page containing business name, address, phone, URL, and event type information.
4. THE Frontend SHALL generate and serve an XML sitemap at `/sitemap.xml` listing all public pages and blog posts.
5. THE Frontend SHALL serve a `robots.txt` file at `/robots.txt` that allows all public pages and disallows `/admin`.
6. THE Frontend SHALL include canonical URL tags on all public pages.
7. THE Frontend SHALL achieve a Lighthouse performance score of 90 or above on the Home page.
8. THE Frontend SHALL lazy load all images and routes to minimize initial bundle size.
9. THE Frontend SHALL serve all images in WebP format via Cloudinary's URL transformation API.
10. WHEN a blog post is fetched via slug, THE Frontend SHALL display the correct `seoTitle` and `seoDescription` in the page `<head>` tag.

---

### Requirement 11: Admin Authentication

**User Story:** As an Admin, I want to securely log into the Admin_Dashboard, so that I can manage business operations without unauthorized access.

#### Acceptance Criteria

1. THE Admin_Dashboard SHALL be accessible only to users who have authenticated via the `POST /api/v1/auth/login` endpoint with valid credentials.
2. WHEN an Admin provides correct email and password credentials, THE Backend SHALL return a signed JWT access token and set a refresh token in an HTTP-only cookie.
3. IF an Admin provides incorrect credentials, THEN THE Backend SHALL return a 401 Unauthorized response without revealing whether the email or the password was incorrect.
4. WHILE an Admin session is active, THE Frontend SHALL include the JWT access token in the `Authorization: Bearer <token>` header of all protected API requests.
5. WHEN the JWT access token expires, THE Frontend SHALL automatically attempt to refresh the session using the stored refresh token before prompting the Admin to log in again.
6. WHEN an Admin logs out, THE Backend SHALL invalidate the refresh token and THE Frontend SHALL clear the stored token.
7. THE Backend SHALL hash all Admin passwords using bcrypt with a minimum cost factor of 10 before storing them in the Database.
8. THE Rate_Limiter SHALL restrict the login endpoint to a maximum of 10 failed attempts per IP address per 15-minute window.
9. THE Admin_Dashboard SHALL implement role-based access control supporting three roles: `super-admin` (full access), `admin` (bookings, gallery, packages, blogs, testimonials, inquiries), and `editor` (blogs, gallery, testimonials only).

---

### Requirement 12: Admin Dashboard – Overview and Analytics

**User Story:** As an Admin, I want to view a dashboard overview with key business metrics and charts, so that I can monitor performance at a glance.

#### Acceptance Criteria

1. WHEN an authenticated Admin navigates to the Admin_Dashboard home, THE Admin_Dashboard SHALL display summary cards for: Total Bookings, Pending Bookings, Confirmed Bookings, Total Inquiries, Total Packages, Total Blogs, and an estimated revenue figure.
2. THE Admin_Dashboard SHALL display a monthly bookings trend line chart, an event type distribution pie chart, and a packages performance bar chart.
3. THE Admin_Dashboard SHALL retrieve dashboard metrics from `GET /api/v1/dashboard/overview`.
4. THE Admin_Dashboard sidebar SHALL contain navigation links to: Dashboard Overview, Bookings, Packages, Gallery, Menu, Blogs, Testimonials, Inquiries, Calendar, and Settings.
5. THE Admin_Dashboard top bar SHALL include a global search input, a notification bell, a profile menu, and a logout button.

---

### Requirement 13: Admin Dashboard – Booking Management

**User Story:** As an Admin, I want to view, filter, search, and update all venue bookings, so that I can efficiently manage the booking pipeline and follow up with customers.

#### Acceptance Criteria

1. THE Admin_Dashboard SHALL display a Bookings table with the following columns: Booking ID, Customer Name, Phone, Event Type, Event Date, Guest Count, Package, Status, and Actions.
2. THE Admin_Dashboard Bookings table SHALL support search by customer name or phone number.
3. THE Admin_Dashboard Bookings table SHALL support filtering by booking status: pending, contacted, confirmed, completed, cancelled.
4. THE Admin_Dashboard Bookings table SHALL support pagination displaying up to 10 bookings per page by default.
5. WHEN an Admin opens a booking detail view, THE Admin_Dashboard SHALL display: Customer Info, Event Details, Package Info, Notes, Status Update Panel, and a Communication Log section.
6. WHEN an Admin updates a booking status, THE Backend SHALL update the booking record in the Database and record the timestamp of the status change.
7. THE Booking_System status transitions SHALL follow the allowed flow: pending → contacted → confirmed → completed or cancelled.
8. WHEN an Admin deletes a booking, THE Admin_Dashboard SHALL display a confirmation modal before executing the delete operation.
9. THE Admin_Dashboard Bookings table SHALL support sorting by Event Date and Created Date.

---

### Requirement 14: Admin Dashboard – Gallery Management

**User Story:** As an Admin, I want to upload, categorize, and delete gallery images, so that the public gallery stays up to date with recent event photos.

#### Acceptance Criteria

1. THE Admin_Dashboard SHALL provide a Gallery management page where an Admin can upload images using a drag-and-drop interface.
2. WHEN an Admin uploads an image, THE Backend SHALL process the file through Multer, upload it to Cloudinary, and store the returned image URL and Cloudinary public ID in the Database.
3. THE Backend SHALL reject image uploads where the file type is not one of: jpg, jpeg, png, or webp.
4. THE Backend SHALL reject image uploads where the file size exceeds 10 MB.
5. WHEN an Admin assigns a category to a gallery image, THE Admin_Dashboard SHALL store the category value from the set: wedding, reception, birthday, catering, decoration, venue.
6. WHEN an Admin deletes a gallery image, THE Backend SHALL delete the image from Cloudinary using the stored Cloudinary public ID and remove the record from the Database.
7. THE Admin_Dashboard SHALL support bulk image upload allowing an Admin to upload multiple images in a single operation.
8. THE Admin_Dashboard SHALL allow an Admin to mark a gallery image as featured, which causes it to appear in the Home page featured gallery section.

---

### Requirement 15: Admin Dashboard – Package Management

**User Story:** As an Admin, I want to create, update, and delete event packages, so that the Packages page always reflects current offerings and pricing.

#### Acceptance Criteria

1. THE Admin_Dashboard SHALL provide a Package management page where an Admin can create, edit, and delete packages.
2. WHEN an Admin creates a Package, THE Package_System SHALL require the following fields: Name, Description, Price, Capacity, and at least one Feature.
3. WHEN an Admin creates a Package, THE Backend SHALL automatically generate a URL-safe slug from the package name.
4. THE Admin_Dashboard SHALL allow an Admin to mark a package as `isPopular`, which causes the package to display a "Popular" badge on the Packages page.
5. THE Admin_Dashboard SHALL allow an Admin to set a package as active or inactive. THE Package_System SHALL exclude inactive packages from the public Packages page.
6. WHEN an Admin deletes a Package that is referenced by existing Bookings, THE Backend SHALL return a 409 Conflict response and SHALL NOT delete the Package.

---

### Requirement 16: Admin Dashboard – Blog Management

**User Story:** As an Admin, I want to create, edit, publish, and delete blog articles with SEO fields, so that the website attracts organic traffic through content marketing.

#### Acceptance Criteria

1. THE Admin_Dashboard SHALL provide a Blog management page with a rich text editor for creating and editing blog content.
2. WHEN an Admin creates a Blog post, THE Blog_System SHALL require the following fields: Title, Content, Excerpt, and Featured Image.
3. WHEN an Admin saves a Blog post, THE Backend SHALL automatically generate a URL-safe slug from the blog title if no custom slug is provided.
4. THE Admin_Dashboard SHALL provide SEO fields for each blog post: SEO Title, SEO Description, Tags, and Category.
5. THE Admin_Dashboard SHALL support a draft/publish workflow. WHEN a blog post has `published` set to `false`, THE Blog_System SHALL exclude it from the public Blog listing.
6. WHEN an Admin publishes a Blog post, THE Backend SHALL record the publication timestamp.
7. THE Admin_Dashboard Blog editor SHALL support featured image upload via Cloudinary.

---

### Requirement 17: Admin Dashboard – Testimonials Management

**User Story:** As an Admin, I want to manage customer testimonials displayed on the website, so that I can showcase positive reviews and build trust with potential customers.

#### Acceptance Criteria

1. THE Admin_Dashboard SHALL provide a Testimonials management page where an Admin can add, edit, and delete customer testimonials.
2. WHEN an Admin creates a Testimonial, THE Admin_Dashboard SHALL require: Customer Name, Rating (1–5), and Review text.
3. THE Admin_Dashboard SHALL allow an Admin to upload a customer photo for each Testimonial via Cloudinary.
4. THE Admin_Dashboard SHALL allow an Admin to mark a Testimonial as featured. THE Frontend SHALL display only featured Testimonials in the Home page testimonials section when there are more than 6 testimonials in the Database.
5. THE Backend SHALL reject Testimonial creation requests where the Rating value is not an integer between 1 and 5 inclusive.

---

### Requirement 18: Admin Dashboard – Inquiry Management

**User Story:** As an Admin, I want to view and manage customer inquiries, so that I can respond promptly and convert inquiries into bookings.

#### Acceptance Criteria

1. THE Admin_Dashboard SHALL display all Inquiries in a table with columns: Customer Name, Phone, Email, Message, Status, and Date.
2. THE Admin_Dashboard Inquiries table SHALL support filtering by status: unread, read, replied.
3. WHEN an Admin opens an Inquiry, THE Inquiry_System SHALL update the inquiry status from `unread` to `read`.
4. THE Admin_Dashboard SHALL allow an Admin to update the status of an Inquiry to `replied`.
5. THE Admin_Dashboard SHALL allow an Admin to delete an Inquiry. THE Admin_Dashboard SHALL display a confirmation modal before executing the delete.
6. THE Admin_Dashboard SHALL provide a "Convert to Booking" action on the Inquiry detail view that pre-populates the Booking creation form with the Inquiry's customer details.

---

### Requirement 19: Admin Dashboard – Menu Management

**User Story:** As an Admin, I want to manage food menu items by category, so that the Menu page always displays accurate and up-to-date catering options.

#### Acceptance Criteria

1. THE Admin_Dashboard SHALL provide a Menu management page where an Admin can add, edit, and delete menu items.
2. WHEN an Admin creates a Menu item, THE Menu_System SHALL require: Name and Category.
3. THE Admin_Dashboard SHALL allow an Admin to set a menu item as available or unavailable. THE Frontend SHALL display only available menu items on the public Menu page.
4. THE Admin_Dashboard SHALL allow an Admin to assign each Menu item to one of the following categories: Nepali, Newari, Indian, Chinese, BBQ, Dessert, Beverage.
5. THE Admin_Dashboard SHALL support uploading an image for each Menu item via Cloudinary.

---

### Requirement 20: Availability Calendar

**User Story:** As an Admin, I want to view a visual calendar of booked and blocked dates, so that I can manage venue availability and avoid scheduling conflicts.

#### Acceptance Criteria

1. THE Admin_Dashboard SHALL display a Calendar page showing all booked and blocked dates for the venue.
2. THE Admin_Dashboard Calendar SHALL use color coding to indicate date status: green for available, yellow for pending/reserved, and red for confirmed/booked.
3. WHEN a Booking with status `confirmed` or `pending` is created, THE Availability_Checker SHALL automatically reflect the booked date in the Calendar.
4. THE Admin_Dashboard SHALL allow an Admin to manually block a date on the Calendar, which creates an availability record with status `reserved` in the Database.
5. WHEN an Admin blocks a date, THE Availability_Checker SHALL return `reserved` status for that date in all public availability queries.

---

### Requirement 21: Notification System

**User Story:** As an Admin, I want to receive in-app and email notifications for new bookings and inquiries, so that I can respond to customers promptly.

#### Acceptance Criteria

1. WHEN a new Booking is submitted through the Booking form, THE Backend SHALL trigger an email notification to the configured admin email address via Nodemailer.
2. WHEN a new Inquiry is submitted through the Contact form, THE Backend SHALL trigger an email notification to the configured admin email address via Nodemailer.
3. THE Admin_Dashboard SHALL display an in-app notification badge on the notification bell icon showing the count of unread bookings and inquiries.
4. WHEN an Admin clicks the notification bell, THE Admin_Dashboard SHALL display a dropdown listing recent unread bookings and inquiries with navigation links to each item.
5. IF the Nodemailer email delivery fails for a booking or inquiry notification, THEN THE Backend SHALL log the failure and SHALL NOT block the booking or inquiry creation response to the customer.

---

### Requirement 22: Security and Input Validation

**User Story:** As a system operator, I want all API endpoints to be secured against common web vulnerabilities, so that customer data and admin operations are protected from unauthorized access and attacks.

#### Acceptance Criteria

1. THE Backend SHALL apply Helmet.js middleware to all API routes to set secure HTTP response headers.
2. THE Backend SHALL apply CORS middleware configured to allow requests only from the registered Frontend origin URL.
3. THE Rate_Limiter SHALL restrict all public API endpoints to a maximum of 100 requests per IP address per 15-minute window.
4. THE Sanitizer SHALL apply MongoDB injection protection on all request bodies before reaching controllers.
5. THE Sanitizer SHALL apply XSS sanitization on all user-supplied string inputs before they are stored in the Database.
6. THE Validator SHALL validate all incoming request bodies for the Bookings, Inquiries, Auth, Packages, Blogs, Gallery, Testimonials, and Menu endpoints using Zod or Joi schemas.
7. IF a request body fails Validator schema checks, THEN THE API SHALL return a 400 Bad Request response with a structured list of validation errors.
8. THE Backend SHALL never expose internal error stack traces in API responses. THE Backend SHALL log full error details server-side only.
9. THE Backend SHALL apply bcrypt password hashing with a minimum cost factor of 10 for all Admin passwords stored in the Database.

---

### Requirement 23: Image Upload System

**User Story:** As an Admin, I want to upload images for gallery, packages, blogs, testimonials, and menu items, so that all visual content is stored securely and served efficiently.

#### Acceptance Criteria

1. THE Backend SHALL process all image uploads through Multer middleware before forwarding the file to Cloudinary.
2. THE Backend SHALL validate that each uploaded file has a MIME type of `image/jpeg`, `image/png`, or `image/webp` before processing.
3. THE Backend SHALL reject image uploads that exceed 10 MB in size and return a 422 Unprocessable Entity response.
4. WHEN an image upload succeeds, THE Backend SHALL store the Cloudinary secure URL and Cloudinary public ID in the corresponding Database record.
5. THE Frontend SHALL display an image preview to the Admin before the upload is submitted.
6. WHEN an image is deleted from the Gallery, Packages, Testimonials, Menu, or Blog, THE Backend SHALL also delete the corresponding file from Cloudinary using the stored public ID.
7. THE Backend SHALL serve Cloudinary image URLs with auto format and quality transformation parameters to deliver optimized images to the Frontend.

---

### Requirement 24: API Design and Communication Standards

**User Story:** As a developer, I want all API endpoints to follow consistent design standards, so that the Frontend can reliably integrate with the Backend and the system can be extended in the future.

#### Acceptance Criteria

1. THE API SHALL use the base path `/api/v1` for all endpoints.
2. THE API SHALL return all successful responses in the format: `{ "success": true, "message": string, "data": object }`.
3. THE API SHALL return all error responses in the format: `{ "success": false, "message": string, "errors": array }`.
4. THE API SHALL return the HTTP status code 200 for successful GET requests, 201 for successful POST creation requests, 400 for validation errors, 401 for unauthenticated requests, 403 for unauthorized role access, 404 for not found resources, 409 for conflict errors, and 500 for internal server errors.
5. THE API SHALL support pagination on all list endpoints via `?page=` and `?limit=` query parameters, returning a `pagination` object in the response with `page`, `limit`, `total`, and `pages` fields.
6. THE API SHALL support search and filter query parameters on the Bookings, Gallery, Blog, and Menu list endpoints.

---

### Requirement 25: Responsive Design and Accessibility

**User Story:** As a Customer, I want to use the website seamlessly on any device and assistive technology, so that I can access venue information and book events regardless of how I access the web.

#### Acceptance Criteria

1. THE Frontend SHALL render correctly and without horizontal overflow on viewport widths of 320px, 768px, 1024px, and 1440px.
2. THE Frontend SHALL apply a mobile-first responsive layout using Tailwind CSS breakpoints.
3. THE Frontend components SHALL support keyboard-only navigation with visible focus indicators on all interactive elements.
4. THE Frontend SHALL use semantic HTML5 elements throughout all pages, including `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, and `<footer>`.
5. THE Frontend SHALL include ARIA labels on all form inputs, icon-only buttons, and navigation landmarks.
6. THE Frontend SHALL maintain a color contrast ratio of at least 4.5:1 between text and background across all components.
7. THE Frontend forms SHALL associate every input with a visible `<label>` element using the `for` attribute or `aria-labelledby`.
8. THE Frontend SHALL display loading skeleton screens during API data fetch operations rather than blank content areas.
