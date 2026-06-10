# Implementation Plan: Shree Ganesh Party Venue & Catering Service

## Overview

Full production-grade MERN stack platform with comprehensive security hardening. Implementation follows a backend-first approach: project scaffolding → backend infrastructure (security middleware, rate limiting, sanitization) → database models → Zod schemas → Firebase Authentication (replacing custom JWT) → backend API modules → frontend infrastructure → public pages → admin dashboard → property-based tests → SEO/performance → security hardening → deployment configuration.

The design uses **TypeScript** throughout (frontend: React + Vite + Tailwind + Shadcn UI; backend: Node + Express + Mongoose). Authentication is handled by **Firebase** (Firebase Admin SDK server-side + Firebase Auth client-side) replacing custom JWT/bcrypt. All 24 correctness properties from the design document are covered by property-based tests using **fast-check** with `numRuns: 100`.

**Security Architecture Note:** Firebase Authentication replaces the custom JWT+bcrypt login system. Admin users are created via Firebase Console (not seed scripts). Firebase ID tokens expire in 1 hour and are refreshed automatically by the Firebase SDK. Firebase custom claims carry role information (`super-admin`, `admin`, `editor`) for RBAC. Password hashing, email verification, and password reset are handled entirely by Firebase — no bcrypt required on the application layer.

---

## Tasks

- [x] 1. Scaffold monorepo and configure environments
  - [x] 1.1 Initialize monorepo root with `/client` and `/server` subdirectories
    - Run `npm create vite@latest client -- --template react-ts` and `npm init` in `/server`
    - Add root-level `package.json` with workspaces, a `.gitignore` (include `.env`, `*.local`, `service-account.json`, `firebase-adminsdk*.json`), and a `README.md`
    - Configure TypeScript strict mode (`tsconfig.json`) in both packages
    - _Requirements: 1.1_
  - [x] 1.2 Configure frontend toolchain: Tailwind CSS, Shadcn UI, Framer Motion, and path aliases
    - Install and configure `tailwindcss`, `postcss`, `autoprefixer`; run `npx shadcn-ui@latest init`
    - Add `@` alias to `vite.config.ts` and `tsconfig.json` paths
    - Install `framer-motion`, `react-helmet-async`, `react-router-dom@6`, `@tanstack/react-query`, `zustand`, `axios`, `react-dropzone`, `recharts`, `@tiptap/react`, `@tiptap/starter-kit`
    - Install Firebase client SDK: `firebase` (exact version, e.g. `^10.x.x`)
    - _Requirements: 1.1, 19.1_
  - [x] 1.3 Configure backend dependencies and dev toolchain
    - Install production deps (exact versions): `express`, `mongoose`, `helmet`, `cors`, `express-rate-limit`, `firebase-admin`, `zod`, `multer`, `nodemailer`, `cloudinary`, `morgan`, `express-mongo-sanitize`, `xss-clean`, `dotenv`
    - Install dev deps: `ts-node-dev`, `@types/express`, `@types/node`, `@types/multer`, `@types/nodemailer`, `@types/cors`, `@types/morgan`, `typescript`, `jest`, `supertest`, `fast-check`, `@types/jest`, `@types/supertest`, `ts-jest`
    - Create `server/tsconfig.json` with `module: commonjs`, `target: ES2020`, strict mode enabled
    - **Do NOT install `bcryptjs` or `jsonwebtoken` — Firebase handles all authentication**
    - _Requirements: 22.1, 22.2, 22.3_
  - [x] 1.4 Create environment variable files, startup validation, and pre-commit hook
    - Create `client/.env.example`: `VITE_API_URL`, `VITE_CLOUDINARY_NAME`, `VITE_GOOGLE_MAPS_KEY`, `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID`, `VITE_FIREBASE_STORAGE_BUCKET`, `VITE_FIREBASE_MESSAGING_SENDER_ID`, `VITE_FIREBASE_APP_ID`
    - Create `server/.env.example`: `PORT`, `NODE_ENV`, `MONGODB_URI`, `CLOUDINARY_NAME`, `CLOUDINARY_KEY`, `CLOUDINARY_SECRET`, `EMAIL_USER`, `EMAIL_PASSWORD`, `EMAIL_TO`, `FRONTEND_URL`, `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY` (the service account fields — never commit the JSON file)
    - Implement `server/config/env.ts` that validates all required env vars on startup using Zod and throws on missing values; log only key names, never values
    - Create `.husky/pre-commit` hook that runs `git diff --cached --name-only | grep -E '\.(env|json)$'` and blocks commits containing `.env` files or Firebase service account JSON; add `husky` and `lint-staged` as devDependencies
    - Add `.env`, `*.env.*`, `*service-account*.json`, `*firebase-adminsdk*.json` to `.gitignore`
    - _Requirements: 22.2_

- [ ] 2. Build backend infrastructure and middleware
  - [x] 2.1 Create Express app entry point with all global security middleware
    - Create `server/app.ts`: apply `helmet()` with full config (CSP, X-Frame-Options DENY, X-Content-Type-Options nosniff, Referrer-Policy same-origin, HSTS maxAge 31536000 in production), `cors({ origin: FRONTEND_URL, credentials: true })`, `express.json({ limit: '10mb' })`, `express.urlencoded({ extended: true })`, `morgan('combined')`, `express-mongo-sanitize()`, `xss-clean()`
    - In production (`NODE_ENV === 'production'`): add middleware that redirects HTTP requests to HTTPS and sets `Strict-Transport-Security` header
    - Register the centralized error handler as the last middleware in `app.ts`
    - Create `server/server.ts` that imports `app`, connects to MongoDB via `connectDB()`, then listens on `PORT`
    - _Requirements: 22.1, 22.2, 22.4, 22.5_
  - [x] 2.2 Implement database and Cloudinary configuration modules
    - Create `server/config/db.ts`: Mongoose connect with `useNewUrlParser`, retry logic (3 attempts with 5s delay) and event logging (`connected`, `error`, `disconnected`); never log the `MONGODB_URI` value; use `lean()` reminder comment for read-only queries
    - Create `server/config/cloudinary.ts`: call `v2.config(...)` using validated env vars; export a typed `cloudinaryUpload` helper
    - _Requirements: 14.2_
  - [x] 2.3 Implement rate limiters for all endpoint categories
    - Create `server/middleware/rateLimiter.ts` with four exportable limiters:
      - `globalLimiter`: 100 req / 15 min per IP
      - `authLimiter`: 10 req / 15 min per IP (applied to Firebase token verification endpoint)
      - `inquiryLimiter`: 5 req / 10 min per IP
      - `uploadLimiter`: 20 req / 1 hour per IP
    - All limiters use `standardHeaders: true`, `legacyHeaders: false`, and return `{ success: false, message: 'Too many requests' }` on limit exceed
    - _Requirements: 22.3, 9.7, 11.8_
  - [x] 2.4 Implement Firebase Admin SDK initialization and token verification middleware
    - Create `server/config/firebase.ts`: initialize Firebase Admin SDK using service account credentials from env vars (`FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`); export `adminAuth` instance; never import Firebase client SDK in server code
    - Create `server/middleware/authMiddleware.ts`: extract `Authorization: Bearer <idToken>` from header; call `adminAuth.verifyIdToken(token)`; attach decoded token (including custom claims `role`) to `req.user`; return `401` for missing or invalid/expired tokens; log failed verification attempts with IP and timestamp (not the token value)
    - Create `server/middleware/roleMiddleware.ts`: factory function accepting array of allowed roles; read `req.user.role` from Firebase custom claims; return `403` if role not in allowed list; log all 403 events with `userId` and endpoint
    - _Requirements: 11.1, 11.4, 11.9_
  - [x] 2.5 Implement centralized error handler and AppError utility
    - Create `server/utils/AppError.ts`: class with `statusCode: number`, `isOperational: boolean` fields
    - Create `server/middleware/errorMiddleware.ts`: handle `AppError`, `ZodError` (→ 400 with `errors[]`), Mongoose duplicate key code `11000` (→ 409), and generic 500; never expose stack traces in production; log all 5xx errors with full context
    - Create `server/utils/apiResponse.ts` with `sendSuccess(res, data, message, statusCode)` and `sendError` helpers matching standard envelope `{ success, message, data/errors }`
    - _Requirements: 22.8, 22.6, 22.7_
  - [x] 2.6 Implement Multer upload middleware with server-side MIME validation
    - Create `server/middleware/uploadMiddleware.ts`: Multer with `memoryStorage`; MIME type filter that checks `file.mimetype` (NOT extension) against allowlist `['image/jpeg', 'image/png', 'image/webp']`; 10 MB size limit (`limits: { fileSize: 10 * 1024 * 1024 }`); return `422` on type rejection with message `'Unsupported file type'`; validate buffer magic bytes as secondary check before sending to Cloudinary
    - Confirm `express-mongo-sanitize` and `xss-clean` are applied globally in `app.ts`
    - _Requirements: 14.3, 14.4, 22.4, 22.5_
  - [x] 2.7 Implement utility functions: logger, slugify, generateBookingId, auditLog
    - Create `server/utils/logger.ts`: structured logger using `morgan` + custom formatter; log auth events (login, logout, failed attempts), booking status changes, data deletions, admin actions — always include `userId` + `timestamp`; never log passwords, tokens, or `MONGODB_URI`
    - Create `server/utils/auditLog.ts`: `logAuditEvent(action, userId, resourceType, resourceId, metadata)` writes structured JSON audit entries; called from auth middleware, booking service, and all DELETE operations
    - Create `server/utils/slugify.ts`: convert string to lowercase-hyphenated URL-safe slug
    - Create `server/utils/generateBookingId.ts`: produce IDs in format `SGP-YYYYMMDD-XXXX` where XXXX is zero-padded sequence
    - _Requirements: 2.5, 2.12, 15.3, 16.3_
  - [ ]* 2.8 Write property test for slug generation (Property 20)
    - **Property 20: Package slug auto-generation is URL-safe and derived from the name**
    - Test file: `server/__tests__/unit/slugify.test.ts`
    - Use `fc.string({ minLength: 1, maxLength: 100 })` as arbitrary; assert output matches `/^[a-z0-9-]+$/` and is non-empty; `numRuns: 200`
    - **Validates: Requirements 15.3, 16.3**

- [ ] 3. Create all nine Mongoose models
  - [x] 3.1 Implement User and Booking models
    - Create `server/models/User.ts`: fields `name`, `email` (unique index, lowercase), `firebaseUid` (unique index — links to Firebase Auth user), `role` enum (`super-admin/admin/editor`), `avatar`, `isActive` (default true), `lastLogin`; timestamps enabled; **no `password` or `refreshToken` fields** — Firebase handles authentication
    - Create `server/models/Booking.ts`: all fields per design schema; `statusHistory` subdocument array `[{ status, changedAt, changedBy }]`; text index on `customerName + phone`; separate indexes on `eventDate`, `status`, `createdAt -1`
    - _Requirements: 11.7, 2.5, 2.10, 2.11, 2.12, 13.7_
  - [x] 3.2 Implement Package, Gallery, and Availability models
    - Create `server/models/Package.ts`: unique `slug` index, `isActive` index; `features` array with validator `v.length > 0`; `category` enum `silver/gold/platinum/custom`
    - Create `server/models/Gallery.ts`: `category` enum `wedding/reception/birthday/catering/decoration/venue`; indexes on `category` and `featured`
    - Create `server/models/Availability.ts`: unique `date` index; optional `bookingId` ref to `Booking`; optional `blockedBy` storing Firebase UID string; `status` enum `available/reserved/booked`
    - _Requirements: 6.6, 15.2, 15.3, 20.3, 20.4_
  - [x] 3.3 Implement Blog, Testimonial, Inquiry, and MenuItem models
    - Create `server/models/Blog.ts`: unique `slug`; compound index `published + createdAt -1`; text index on `title + tags`; `publishedAt` Date field; `views` default 0
    - Create `server/models/Testimonial.ts`: `rating` min 1 max 5 with `Number.isInteger` validator; `cloudinaryId` field for cleanup; index on `featured`
    - Create `server/models/Inquiry.ts`: `status` enum `unread/read/replied` default `unread`; indexes on `status` and `createdAt -1`
    - Create `server/models/MenuItem.ts`: `category` enum `nepali/newari/indian/chinese/bbq/dessert/beverage`; `cloudinaryId` field; indexes on `category` and `available`
    - _Requirements: 8.6, 16.5, 17.5, 9.3, 7.5_

- [ ] 4. Implement Zod validation schemas (server-side — all endpoints)
  - [ ] 4.1 Write Auth token verification, Booking, and Inquiry validation schemas
    - Create `server/validators/bookingSchema.ts`: require `customerName` (string, min 1, max 100), `phone` (string, matches `/^[0-9+\-\s]{7,20}$/`), `email` (valid email), `eventType` (enum of 9 values), `eventDate` (ISO date string that is future date), `guestCount` (integer ≥ 1); optional `packageId`, `cateringRequired`, `decorationRequired`, `notes` (max 1000), `estimatedPrice`; use `.strict()` to reject unexpected fields
    - Create `server/validators/inquirySchema.ts`: require `name`, `email` (email), `phone`, `message`; optional `subject`; use `.strict()`
    - Create `server/validators/setRoleSchema.ts`: require `uid` (string), `role` (enum `super-admin/admin/editor`) — for Firebase custom claims assignment endpoint
    - _Requirements: 2.3, 2.11, 9.5, 22.6, 22.7_
  - [ ] 4.2 Write Package, Blog, Testimonial, and MenuItem validation schemas
    - Create `server/validators/packageSchema.ts`: require `name`, `description`, `price` (≥ 0), `capacity` (integer ≥ 1), `features` (array min 1 item), `category` enum; optional fields; use `.strict()`
    - Create `server/validators/blogSchema.ts`: require `title`, `content`, `excerpt` (max 300), `featuredImage`, `category`, `author`; optional `seoTitle` (max 60), `seoDescription` (max 160), `tags`, `published`; use `.strict()`
    - Create `server/validators/testimonialSchema.ts`: require `customerName`, `rating` (integer 1–5 using `z.number().int().min(1).max(5)`), `review`; optional fields; use `.strict()`
    - Create `server/validators/menuSchema.ts`: require `name`, `category` enum; optional `description`, `image`, `price`, `available`; use `.strict()`
    - _Requirements: 15.2, 16.2, 17.2, 17.5, 19.2, 22.6_
  - [ ]* 4.3 Write property test for Zod validation rejection (Property 16)
    - **Property 16: Zod validation rejects malformed request bodies with 400 and structured errors**
    - Test file: `server/__tests__/integration/booking.api.test.ts`
    - Use `fc.integer({ max: 0 })` for guestCount; assert `status === 400`, `body.success === false`, `body.errors.length > 0`; `numRuns: 100`
    - **Validates: Requirements 22.6, 22.7, 2.11, 17.5**

- [x] 5. Implement Firebase Authentication setup and RBAC with custom claims
  - [x] 5.1 Initialize Firebase Admin SDK and create role-assignment controller
    - Confirm `server/config/firebase.ts` exports `adminAuth` (from Task 2.4)
    - Create `server/controllers/authController.ts`: `verifyToken` action that calls `adminAuth.verifyIdToken(idToken)` and returns decoded user info including custom claims; `setUserRole` action (super-admin only) that calls `adminAuth.setCustomUserClaims(uid, { role })` to assign roles; `getMe` action returns `req.user` (decoded Firebase token with custom claims)
    - Create `server/controllers/userController.ts`: `syncUser` action that upserts a `User` document from Firebase token claims (creates or updates `firebaseUid`, `email`, `name`, `role`, `lastLogin`); called after first login to sync Firebase user with MongoDB
    - _Requirements: 11.1, 11.4, 11.9_
  - [x] 5.2 Create auth routes (Firebase-based, no login endpoint needed)
    - Create `server/routes/authRoutes.ts`:
      - `GET /me` with `authLimiter` + `authenticate` — returns current user info
      - `POST /sync` with `authLimiter` + `authenticate` — syncs Firebase user to MongoDB User model
      - `POST /set-role` with `authenticate` + `authorize(['super-admin'])` — assigns Firebase custom claims role to a user UID
    - Register under `/api/v1/auth`
    - **No `/login` endpoint needed** — Firebase client SDK handles sign-in; server only verifies tokens
    - Document in `README.md`: admin users must be created in Firebase Console → Authentication → Users, then call `POST /api/v1/auth/set-role` to assign their role
    - _Requirements: 11.1, 11.9_
  - [x] 5.3 Configure Firebase client SDK for frontend sign-in
    - Create `client/src/lib/firebase.ts`: initialize Firebase app using `VITE_FIREBASE_*` env vars; export `auth` (getAuth), `signInWithEmailAndPassword`, `signOut`, `onAuthStateChanged`
    - Create `client/src/hooks/useFirebaseAuth.ts`: wraps `onAuthStateChanged`; on auth state change calls `POST /api/v1/auth/sync`; exposes `user`, `idToken`, `loading`, `signIn(email, password)`, `logOut()` functions; `signIn` triggers `sendEmailVerification` if `!user.emailVerified`
    - Create `client/src/store/authStore.ts`: state `{ user, idToken, isAuthenticated, role }`; actions `setAuth(user, idToken, role)`, `clearAuth()`; token stored only in memory (Zustand), NOT in localStorage/sessionStorage — Firebase SDK manages token refresh automatically
    - _Requirements: 11.1, 11.2, 11.4, 11.5_
  - [x] 5.4 Implement Axios interceptor to attach Firebase ID tokens
    - Create `client/src/lib/axiosInstance.ts`: base URL from `VITE_API_URL`; request interceptor calls `auth.currentUser?.getIdToken()` (Firebase refreshes the token automatically if it has expired — 1-hour expiry); attaches as `Authorization: Bearer <idToken>`; response interceptor handles 401 by redirecting to `/admin/login`; handles 403 with unauthorized message; displays toast on network error
    - Create `client/src/lib/queryClient.ts`: configure `QueryClient` with `staleTime: 60_000`, `retry: 1`
    - _Requirements: 11.4, 11.5_
  - [ ]* 5.5 Write property test for RBAC (Property 13)
    - **Property 13: Editor role is denied access to admin-only endpoints**
    - Test file: `server/__tests__/integration/auth.api.test.ts`
    - Mock `adminAuth.verifyIdToken` to return decoded token with `role: 'editor'`; assert 403 on `POST /api/v1/packages`, `PATCH /api/v1/bookings/:id/status`; assert 200 on `GET /api/v1/gallery`; `numRuns: 100`
    - **Validates: Requirements 11.9**

- [x] 6. Implement backend Booking API
  - [x] 6.1 Implement booking service with business logic and audit logging
    - Create `server/services/bookingService.ts`: `createBooking(data)` generates bookingId via `generateBookingId`, sets `status: 'pending'` and `source: 'website'`, saves to DB, then calls `availabilityService.markDate(eventDate, 'reserved', bookingId)` and triggers `emailService.sendBookingNotification()` asynchronously (non-blocking, log failures); call `logAuditEvent('booking.created', userId, 'Booking', bookingId)`
    - Implement `getBookings(query)` with pagination, status filter, text search on `customerName + phone`; use `.lean()` for read-only queries
    - Implement `updateBookingStatus(id, newStatus, adminUid)`: enforce state machine (pending→contacted→confirmed→completed|cancelled); append to `statusHistory`; call `logAuditEvent('booking.status_changed', adminUid, 'Booking', id, { from, to })`
    - Implement `deleteBooking(id, adminUid)`: call `logAuditEvent('booking.deleted', adminUid, 'Booking', id)` before deletion
    - _Requirements: 2.5, 2.6, 2.12, 13.1, 13.2, 13.3, 13.4_
  - [x] 6.2 Implement booking controller and routes
    - Create `server/controllers/bookingController.ts`: `createBooking` (public, validate bookingSchema → call service → 201); `listBookings` (admin); `getBookingById` (admin, IDOR check: verify resource exists); `updateBookingStatus` (admin, enforce state machine); `deleteBooking` (admin with audit log)
    - Create `server/routes/bookingRoutes.ts`: apply `globalLimiter` on public POST; apply `authenticate` + `authorize(['super-admin','admin'])` on admin routes
    - Register under `/api/v1/bookings`
    - _Requirements: 13.5, 13.6, 13.7, 13.8, 13.9_
  - [ ]* 6.3 Write property tests for booking creation and status machine (Properties 1 and 15)
    - **Property 1: Booking creation round-trip preserves status='pending' and source='website'**
    - **Property 15: Booking status transitions follow the allowed state machine**
    - Test file: `server/__tests__/integration/booking.api.test.ts`
    - Property 1: use `fc.record({ customerName: fc.string({minLength:1, maxLength:50}), phone: fc.string({minLength:7, maxLength:20}), email: fc.emailAddress(), eventType: fc.constantFrom(...EVENT_TYPES), eventDate: fc.date({ min: new Date() }), guestCount: fc.integer({min:1}) })` for valid payloads; assert `status==='pending'` and `source==='website'` and `bookingId` matches `/^SGP-\d{8}-\d{4}$/`; `numRuns: 100`
    - Property 15: enumerate all invalid transitions (e.g., pending→completed, confirmed→pending); assert 400/409 response; `numRuns: 100`
    - **Validates: Requirements 2.5, 2.12, 13.7**

- [x] 7. Implement backend Availability API
  - [x] 7.1 Implement availability service and controller
    - Create `server/services/availabilityService.ts`: `checkDate(date)` queries both `Availability` and `Booking` collections for `confirmed/pending` entries; returns `'available'|'reserved'|'booked'`; reject past dates with `AppError(400)`; use `.lean()` for both queries
    - `markDate(date, status, bookingId?)` upserts `Availability` record; `blockDate(date, firebaseUid)` creates manual block with `status: 'reserved'`, `blockedBy: firebaseUid`; call `logAuditEvent('availability.blocked', firebaseUid, 'Availability', date)`
    - Create `server/controllers/availabilityController.ts`: `checkAvailability` (public); `blockDate` (admin only)
    - _Requirements: 3.1, 3.2, 3.4, 20.3, 20.4, 20.5_
  - [x] 7.2 Create availability routes
    - Create `server/routes/availabilityRoutes.ts`: `GET /` with `globalLimiter` (public); `POST /block` with `authenticate + authorize(['super-admin','admin'])`
    - Register under `/api/v1/availability`
    - _Requirements: 3.1, 3.4, 20.4_
  - [ ]* 7.3 Write property tests for availability (Properties 2, 3, and 22)
    - **Property 2: Availability response is always a valid status enum**
    - **Property 3: Confirmed/pending bookings mark their dates as non-available**
    - **Property 22: Manually blocked dates return reserved status**
    - Test file: `server/__tests__/integration/availability.api.test.ts`; `numRuns: 100` for each property
    - **Validates: Requirements 3.1, 3.2, 20.3, 20.4, 20.5**

- [x] 8. Implement backend Package API
  - [x] 8.1 Implement package service and controller
    - Create `server/services/packageService.ts`: `createPackage(data)` auto-generates slug via `slugify(name)`, ensures uniqueness; `deletePackage(id, adminUid)` checks for existing Bookings referencing `packageId`; throws `AppError(409)` if found; `getActivePackages()` filters `isActive: true`; use `.lean()` for public read queries; log audit event on delete
    - Create `server/controllers/packageController.ts`: `listPackages` (public, active only), `getPackageBySlug` (public), `createPackage` (admin), `updatePackage` (admin), `deletePackage` (admin)
    - _Requirements: 6.6, 15.2, 15.3, 15.5, 15.6_
  - [x] 8.2 Create package routes
    - Create `server/routes/packageRoutes.ts`: public `GET /` and `GET /:slug`; admin `POST /`, `PUT /:id`, `DELETE /:id` with auth middleware
    - Register under `/api/v1/packages`
    - _Requirements: 6.6, 15.1_
  - [ ]* 8.3 Write property tests for packages (Properties 6, 7, 8, and 21)
    - **Property 6: Active package records always include required fields**
    - **Property 7: isPopular flag is preserved through storage round-trip**
    - **Property 8: Only active packages returned by public endpoint**
    - **Property 21: Referenced packages cannot be deleted (conflict protection)**
    - Test file: `server/__tests__/integration/packages.api.test.ts`; `numRuns: 100` each
    - **Validates: Requirements 6.2, 6.3, 6.6, 15.2, 15.5, 15.6**

- [x] 9. Implement backend Gallery API
  - [x] 9.1 Implement gallery service and controller
    - Create `server/services/galleryService.ts`: `uploadImage(file, category, meta)` validates buffer magic bytes (MIME sniffing) before upload; uploads buffer to Cloudinary via `uploader.upload_stream` with `folder: 'shree-ganesh/gallery'`; stores `{ imageUrl: secure_url, cloudinaryId: public_id, category, ... }` in DB; `deleteImage(id, adminUid)` calls `uploader.destroy(cloudinaryId)` then removes DB record; call `logAuditEvent('gallery.deleted', adminUid, 'Gallery', id)`
    - Create `server/controllers/galleryController.ts`: `listGallery` (public, optional `?category=` filter, use `.lean()`), `uploadImage` (admin, uses `uploadMiddleware`), `deleteImage` (admin), `bulkUpload` (admin, `upload.array('images', 20)` with `uploadLimiter`)
    - _Requirements: 14.1, 14.2, 14.3, 14.4, 14.5, 14.6, 14.7_
  - [x] 9.2 Create gallery routes
    - Create `server/routes/galleryRoutes.ts`: public `GET /`; admin `POST /` with `uploadLimiter + upload.single('image')`, `DELETE /:id`, `POST /bulk` with `uploadLimiter + upload.array('images', 20)`; all admin routes require auth
    - Register under `/api/v1/gallery`
    - _Requirements: 5.7, 14.1, 14.7_
  - [ ]* 9.3 Write property test for gallery category filter (Property 5)
    - **Property 5: Gallery category filter returns only matching items**
    - Test file: `server/__tests__/integration/gallery.api.test.ts`
    - Seed multiple categories; use `fc.constantFrom(...GALLERY_CATEGORIES)` to pick a category; assert every returned image has matching category; `numRuns: 100`
    - **Validates: Requirements 5.2, 5.3, 5.7**

- [x] 10. Implement backend Blog API
  - [x] 10.1 Implement blog service and controller
    - Create `server/services/blogService.ts`: `createBlog(data)` auto-generates slug if not provided; `publishBlog(id, adminUid)` sets `published: true`, `publishedAt: new Date()`; call `logAuditEvent('blog.published', adminUid, 'Blog', id)`; `getPublishedBlogs(query)` filters `published: true` with pagination; use `.lean()` for public queries
    - Create `server/controllers/blogController.ts`: `listBlogs` (public, published only), `getBlogBySlug` (public, increments `views`), `createBlog` (admin), `updateBlog` (admin), `deleteBlog` (admin with audit log)
    - _Requirements: 8.1, 8.4, 8.6, 16.1, 16.2, 16.3, 16.5, 16.6_
  - [x] 10.2 Create blog routes
    - Create `server/routes/blogRoutes.ts`: public `GET /` and `GET /:slug`; admin `POST /`, `PUT /:id`, `DELETE /:id` with auth
    - Register under `/api/v1/blogs`
    - _Requirements: 8.6, 16.1_
  - [ ]* 10.3 Write property tests for blogs (Properties 9 and 10)
    - **Property 9: Blog SEO fields match stored seoTitle and seoDescription**
    - **Property 10: Only published blogs returned by public endpoint**
    - Test file: `server/__tests__/integration/blog.api.test.ts`; `numRuns: 100` each
    - **Validates: Requirements 8.5, 8.6, 8.7, 16.5**

- [x] 11. Implement backend Testimonial API
  - [x] 11.1 Implement testimonial controller and routes
    - Create `server/controllers/testimonialController.ts`: `listTestimonials` (public, use `.lean()`, returns all or featured only with `?featured=true`); `createTestimonial` (admin, validate with testimonialSchema, upload image to Cloudinary via `uploadMiddleware` if provided, store `cloudinaryId`); `updateTestimonial` (admin); `deleteTestimonial` (admin, delete Cloudinary image if `cloudinaryId` present, call audit log)
    - Create `server/routes/testimonialRoutes.ts`: public `GET /`; admin `POST /`, `PUT /:id`, `DELETE /:id` with auth middleware
    - Register under `/api/v1/testimonials`
    - _Requirements: 17.1, 17.2, 17.3, 17.4, 17.5_

- [x] 12. Implement backend Inquiry API
  - [x] 12.1 Implement inquiry service and controller
    - Create `server/services/inquiryService.ts`: `createInquiry(data)` sets `status: 'unread'`, saves to DB, triggers `emailService.sendInquiryNotification()` asynchronously (non-blocking, log failures but do not throw)
    - Create `server/controllers/inquiryController.ts`: `createInquiry` (public); `listInquiries` (admin, filter by status, paginated, use `.lean()`); `updateInquiryStatus` (admin, IDOR check); `deleteInquiry` (admin, with audit log)
    - Create `server/routes/inquiryRoutes.ts`: `POST /` with `inquiryLimiter` (public); admin routes with auth middleware
    - Register under `/api/v1/inquiries`
    - _Requirements: 9.3, 9.4, 9.7, 18.1, 18.2, 18.3, 18.4, 18.5, 21.5_
  - [ ]* 12.2 Write property tests for inquiry (Properties 11 and 24)
    - **Property 11: Inquiry creation always stores status as 'unread'**
    - **Property 24: Email notification failure does not block booking or inquiry creation**
    - Test file: `server/__tests__/integration/inquiry.api.test.ts`
    - Property 24: mock Nodemailer transport to throw; assert 201 still returned; `numRuns: 100`
    - **Validates: Requirements 9.3, 21.5**

- [x] 13. Implement backend Menu API
  - [x] 13.1 Implement menu controller and routes
    - Create `server/controllers/menuController.ts`: `listMenuItems` (public, filter `available: true`, optional `?category=`, use `.lean()`); `createMenuItem` (admin, validate with menuSchema, upload image to Cloudinary if provided); `updateMenuItem` (admin); `deleteMenuItem` (admin, delete Cloudinary image if `cloudinaryId` present, audit log)
    - Create `server/routes/menuRoutes.ts`: public `GET /`; admin `POST /`, `PUT /:id`, `DELETE /:id` with auth
    - Register under `/api/v1/menu`
    - _Requirements: 7.4, 7.5, 19.1, 19.2, 19.3, 19.4, 19.5_
  - [ ]* 13.2 Write property test for menu availability filter (Property 23)
    - **Property 23: Only available menu items are returned by the public menu endpoint**
    - Test file: `server/__tests__/integration/menu.api.test.ts`
    - Seed items with mixed `available` values; assert public `GET /api/v1/menu` never returns `available: false` items; `numRuns: 100`
    - **Validates: Requirements 7.5, 19.3**

- [x] 14. Implement backend Dashboard API
  - [x] 14.1 Implement dashboard controller and routes
    - Create `server/controllers/dashboardController.ts`: `getOverview` performs MongoDB aggregations using `.lean()`: count bookings by status (pending, contacted, confirmed, completed, cancelled), sum `estimatedPrice` for confirmed/completed for revenue estimate, count total inquiries, packages, blogs; compute `monthlyTrend[]` (last 12 months), `eventTypeDistribution[]`, `packagePerformance[]`
    - Return `{ totalBookings, pendingBookings, contactedBookings, confirmedBookings, completedBookings, cancelledBookings, totalInquiries, totalPackages, totalBlogs, revenueEstimate, monthlyTrend[], eventTypeDistribution[], packagePerformance[] }`
    - Create `server/routes/dashboardRoutes.ts`: `GET /overview` with auth; register under `/api/v1/dashboard`
    - _Requirements: 12.1, 12.2, 12.3_
  - [ ]* 14.2 Write property test for dashboard metric consistency (Property 14)
    - **Property 14: Dashboard totalBookings equals sum of all status counts**
    - Test file: `server/__tests__/integration/dashboard.api.test.ts`
    - Seed N bookings with random statuses; assert `totalBookings === pending + contacted + confirmed + completed + cancelled`; `numRuns: 100`
    - **Validates: Requirements 12.1**

- [x] 15. Implement backend Upload API and email service
  - [x] 15.1 Implement generic upload endpoint and email service
    - Create `server/controllers/uploadController.ts`: `uploadImage` receives single file via `uploadMiddleware`, validates MIME type server-side, uploads buffer to Cloudinary with folder `'shree-ganesh/uploads'`, returns `{ imageUrl, cloudinaryId }`; apply auth + `uploadLimiter`
    - Create `server/routes/uploadRoutes.ts`: `POST /` with `uploadLimiter + upload.single('image') + authenticate`; register under `/api/v1/upload`
    - Create `server/services/emailService.ts`: `sendBookingNotification(booking)` and `sendInquiryNotification(inquiry)` using Nodemailer SMTP transport configured from env vars; wrap in try/catch, call `logger.error` on failure, never throw to caller; never log email credentials
    - _Requirements: 2.6, 9.4, 14.2, 21.1, 21.2, 21.5_
  - [ ]* 15.2 Write property test for image upload validation (Property 17)
    - **Property 17: Image upload rejects invalid MIME types and oversized files**
    - Test file: `server/__tests__/integration/gallery.api.test.ts`
    - Use `fc.constantFrom('application/pdf', 'text/plain', 'video/mp4')` for MIME types; assert 422; test file size > 10 MB returns 422; `numRuns: 100`
    - **Validates: Requirements 14.3, 14.4, 22.3**

- [x] 16. Checkpoint — Backend API complete
  - Ensure all backend routes are registered in `app.ts`, all tests pass (`jest --runInBand`), and TypeScript compiles without errors (`tsc --noEmit`)
  - Verify: Firebase token verification middleware returns 401 for missing token; `GET /api/v1/packages` returns data; error middleware returns standard envelope; rate limiters respond with 429 after limit exceeded
  - Verify all Helmet headers are present in responses: `Content-Security-Policy`, `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`
  - Ask the user if any questions arise before proceeding to frontend

- [x] 17. Build frontend infrastructure (Axios + React Query + stores + routing + layouts)
  - [x] 17.1 Configure Axios instance with Firebase token interceptors and React Query client
    - Complete `client/src/lib/axiosInstance.ts` from Task 5.4: base URL from `VITE_API_URL`; request interceptor calls `auth.currentUser?.getIdToken(true)` to get fresh Firebase ID token (SDK auto-refreshes if within 5-minute window of expiry); attaches as `Authorization: Bearer <token>`; response interceptor handles 401 → redirect to `/admin/login`; handles 403 → show unauthorized toast; displays toast on network error
    - Complete `client/src/lib/queryClient.ts`: `QueryClient` with `staleTime: 60_000`, `retry: 1`, `onError` global handler
    - _Requirements: 11.4, 11.5_
  - [x] 17.2 Implement Zustand stores
    - Complete `client/src/store/authStore.ts` from Task 5.3: state `{ user, idToken, isAuthenticated, role }`; actions `setAuth`, `clearAuth`; **no token persistence to localStorage** — Firebase manages persistence via its own IndexedDB; use `auth.onAuthStateChanged` listener to sync store
    - Create `client/src/store/notificationStore.ts`: state `{ unreadCount, notifications[] }`; actions `setUnreadCount`, `markAllRead`, `addNotification`
    - _Requirements: 11.4, 21.3, 21.4_
  - [x] 17.3 Set up React Router with lazy-loaded routes and layouts
    - Create `client/src/routes/router.tsx` using React Router v6 `createBrowserRouter`; wrap all public routes in `PublicLayout`, all `/admin/*` routes in `AdminLayout` behind `ProtectedRoute` guard
    - Lazy-load every page component with `React.lazy()` and `Suspense` fallback (skeleton loader)
    - Register all routes: `/`, `/about`, `/services`, `/gallery`, `/packages`, `/menu`, `/blog`, `/blog/:slug`, `/contact`, `/booking`, `/admin/login`, `/admin`, `/admin/bookings`, `/admin/bookings/:id`, `/admin/gallery`, `/admin/packages`, `/admin/blogs`, `/admin/blogs/new`, `/admin/blogs/:id/edit`, `/admin/testimonials`, `/admin/inquiries`, `/admin/menu`, `/admin/calendar`; `*` → `NotFoundPage`
    - _Requirements: 1.1, 1.9, 1.10, 10.8_
  - [x] 17.4 Create PublicLayout, AdminLayout, and ProtectedRoute components
    - Create `client/src/components/layout/PublicLayout.tsx`: renders `<Header />`, `<Outlet />`, `<Footer />`; `<WhatsAppButton />` always visible; resets scroll on route change; updates document title
    - Create `client/src/components/layout/AdminLayout.tsx`: renders sidebar navigation (all admin sections), top bar with search/notifications/profile, `<Outlet />`; sidebar collapses on mobile with hamburger toggle
    - Create `client/src/components/layout/ProtectedRoute.tsx`: uses `useFirebaseAuth` hook; shows spinner during Firebase auth loading state; redirects to `/admin/login` if `!isAuthenticated`; also checks `user.emailVerified` — redirect to verification notice if not verified
    - _Requirements: 1.7, 1.8, 11.1, 12.4, 12.5_

- [x] 18. Define frontend TypeScript types and constants
  - [x] 18.1 Create all TypeScript interface files
    - Create `client/src/types/Booking.ts`: `Booking`, `EventType`, `BookingStatus`, `BookingSource` as defined in design
    - Create `client/src/types/Package.ts`: `Package` interface
    - Create `client/src/types/Gallery.ts`: `GalleryImage`, `GalleryCategory`
    - Create `client/src/types/Blog.ts`: `Blog` interface
    - Create `client/src/types/Availability.ts`: `AvailabilityStatus`, `AvailabilityResponse`
    - Create `client/src/types/User.ts`: `AdminUser`, `UserRole` types (from Firebase custom claims)
    - Create `client/src/types/ApiResponse.ts`: `ApiResponse<T>`, `PaginatedApiResponse<T>`
    - Create `client/src/types/index.ts` barrel export
    - _Requirements: 1.1_
  - [x] 18.2 Create constants files
    - Create `client/src/constants/index.ts`: export `EVENT_TYPES` (9 values), `GALLERY_CATEGORIES` (6 values), `MENU_CATEGORIES` (7 values), `BOOKING_STATUSES` (5 values), `PACKAGE_CATEGORIES` (4 values)
    - _Requirements: 2.10, 5.2, 7.1_

- [x] 19. Create frontend shared components
  - [x] 19.1 Implement SEOHead, WhatsAppButton, and SkeletonLoader
    - Create `client/src/components/shared/SEOHead.tsx`: use `react-helmet-async` to set `<title>`, `<meta name="description">`, `<meta property="og:*">`, `<meta name="twitter:*">`, `<link rel="canonical">` from props; accept `noIndex` boolean prop for 404/admin pages
    - Create `client/src/components/shared/WhatsAppButton.tsx`: fixed-position floating button linking to `https://wa.me/{PHONE}`; visible on all public pages; `aria-label` for accessibility
    - Create `client/src/components/shared/SkeletonLoader.tsx`: reusable skeleton accepting `width`, `height`, `className` props
    - _Requirements: 1.8, 10.1, 10.2, 10.6_
  - [x] 19.2 Implement Lightbox component and Toast/Provider setup
    - Create `client/src/components/shared/Lightbox.tsx`: overlay displaying full image; keyboard navigation (arrow keys, Escape); swipe support on mobile via touch events; backdrop click to close; focus trap for accessibility
    - Configure Shadcn `Toaster` in `client/src/app/App.tsx`; wrap app with `HelmetProvider` from `react-helmet-async`; wrap app with `QueryClientProvider` and `AuthProvider`
    - _Requirements: 5.4_

- [x] 20. Implement design system and base UI components
  - [x] 20.1 Configure design tokens and Tailwind theme
    - Extend `tailwind.config.ts` with custom colors: `gold: '#C9A227'`, `charcoal: '#111827'`, `surface: '#F8F5EE'`, `accent: '#8B0000'`; add custom font families (serif for headings, sans-serif for body); configure `content` paths
    - Create Shadcn `Button` variants: `primary` (gold background), `secondary` (charcoal), `outline` (gold border)
    - _Requirements: 19.1_
  - [x] 20.2 Build Header component
    - Create `client/src/components/layout/Header.tsx`: sticky header with scroll-triggered background transition (transparent → white/charcoal); logo on left; nav links for all 9 public pages; "Book Now" CTA button; hamburger menu for mobile with animated open/close via Framer Motion; active link highlight using `NavLink`
    - _Requirements: 1.7_
  - [x] 20.3 Build Footer component
    - Create `client/src/components/layout/Footer.tsx`: business name, tagline, navigation links, contact info (phone, email, address), social media links, copyright; responsive grid layout
    - _Requirements: 1.1_

- [x] 21. Build Home page (Hero, Stats, Services, Gallery preview, Testimonials, CTA sections)
  - [x] 21.1 Implement HeroSection
    - Create `client/src/components/sections/HeroSection.tsx`: full-viewport background (video or high-quality image); headline "Shree Ganesh Party Venue"; subheadline; three CTA buttons (Book Venue → `/booking`, Get Quote → `/contact`, Contact Us → `/contact`); trust badges; Framer Motion fade-in animation on load
    - _Requirements: 1.2_
  - [x] 21.2 Implement StatisticsSection, ServicesSection, FeaturedGallerySection, TestimonialsSection, and CTASection
    - Create `client/src/components/sections/StatisticsSection.tsx`: animated counters for events completed, years experience, happy clients, venue capacity using Framer Motion `useInView` trigger
    - Create `client/src/components/sections/ServicesSection.tsx`: 8 service cards (Wedding Venue, Reception, Birthday Parties, Bratabandha, Pasni, Corporate Events, Catering, Decoration) with icon + title + brief description; Framer Motion stagger animation
    - Create `client/src/components/sections/FeaturedGallerySection.tsx`: fetch from `GET /api/v1/gallery?featured=true`; masonry preview grid; "View Full Gallery" button → `/gallery`
    - Create `client/src/components/sections/TestimonialsSection.tsx`: fetch featured testimonials; carousel or grid with star ratings
    - Create `client/src/components/sections/CTASection.tsx`: prominent booking CTA with background and button
    - _Requirements: 1.3, 1.4, 1.5, 1.6_
  - [x] 21.3 Assemble HomePage with SEO
    - Create `client/src/pages/Home/HomePage.tsx`: compose all sections with `SEOHead` (title "Shree Ganesh Party Venue | Bhaktapur Nepal", meta description, Local Business JSON-LD schema with businessName, address, phone, url, eventTypes)
    - _Requirements: 1.2, 10.1, 10.3_

- [x] 22. Build About, Services, and Contact pages
  - [x] 22.1 Create AboutPage and ServicesPage
    - Create `client/src/pages/About/AboutPage.tsx`: static content — business story, team, venue photos, mission statement; `SEOHead` with unique meta title/description
    - Create `client/src/pages/Services/ServicesPage.tsx`: detailed cards for all 8 services with images and descriptions; `SEOHead`
    - _Requirements: 1.1_
  - [x] 22.2 Implement ContactPage with ContactForm and Zod validation
    - Create `client/src/pages/Contact/ContactPage.tsx` and `client/src/components/forms/ContactForm.tsx`
    - Required fields: Name, Email, Phone, Message; optional Subject; Zod schema validates all fields client-side showing field-level errors; submit to `POST /api/v1/inquiries`; show success confirmation on 201; display business info (phone, email, address, hours); embedded Google Map via `VITE_GOOGLE_MAPS_KEY`
    - `SEOHead` with canonical URL and Open Graph tags
    - _Requirements: 9.1, 9.2, 9.3, 9.5, 9.6, 10.1, 10.2_

- [x] 23. Build Gallery page (masonry grid + filters + lightbox + lazy load + pagination)
  - [x] 23.1 Implement GalleryPage with masonry grid, category filters, and infinite scroll
    - Create `client/src/pages/Gallery/GalleryPage.tsx`: category filter buttons (All, Wedding, Reception, Birthday, Catering, Decoration, Venue); masonry grid via CSS columns; lazy-loaded images with `loading="lazy"` and WebP Cloudinary URL transform (`f_auto,q_auto`); TanStack Query `useInfiniteQuery` for infinite scroll/pagination; click image → opens `Lightbox`; skeleton loaders during fetch
    - Create `client/src/hooks/useGallery.ts`: wraps `GET /api/v1/gallery` with category param and pagination
    - `SEOHead` with unique meta
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7_

- [x] 24. Build Packages page (pricing grid + popular badge + CTA to booking)
  - [x] 24.1 Implement PackagesPage with pricing grid and EventCostCalculator
    - Create `client/src/pages/Packages/PackagesPage.tsx`: fetch from `GET /api/v1/packages`; display Silver, Gold, Platinum, Custom in responsive pricing grid; highlight `isPopular` package with "Most Popular" badge and visual border; each card shows name, price, capacity, features list, CTA button
    - CTA click navigates to `/booking?package={id}` with package pre-filled; "Request Custom Package" button → `/contact`
    - Create `client/src/utils/calculateEventCost.ts`: `perHeadRate = price/capacity`, `estimatedMin = round(perHeadRate * guestCount * 0.9)`, `estimatedMax = round(perHeadRate * guestCount * 1.1)`, `capacityWarning: guestCount > capacity`
    - Create `client/src/components/sections/EventCostCalculator.tsx`: inputs for Event Type, Guest Count, Package; calls `calculateEventCost()` on every change; displays NPR range; shows capacity warning; integrates into PackagesPage or BookingPage
    - `SEOHead` with unique meta
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 4.1, 4.2, 4.3, 4.4, 4.5_
  - [ ]* 24.2 Write property test for cost calculator (Property 4)
    - **Property 4: calculateEventCost returns valid positive estimates for any valid input**
    - Test file: `client/src/__tests__/utils/calculateEventCost.test.ts`
    - Use `fc.integer({ min: 1, max: 5000 })` for guestCount, `fc.float({ min: 1000, max: 10000000 })` for price, `fc.integer({ min: 1, max: 5000 })` for capacity; assert `estimatedMin > 0 && estimatedMax > 0 && estimatedMin <= estimatedMax`; `numRuns: 100`
    - **Validates: Requirements 4.2, 4.3**

- [x] 25. Build Menu page (category tabs + filter)
  - [x] 25.1 Implement MenuPage with category tabs and available items filter
    - Create `client/src/pages/Menu/MenuPage.tsx`: tabbed interface for Nepali, Newari, Indian, Chinese, BBQ, Desserts, Beverages; fetch from `GET /api/v1/menu` (available only); display item name, description, image (WebP via Cloudinary URL transform), category badge; skeleton loader during fetch
    - `SEOHead` with unique meta
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

- [x] 26. Build Blog list page and Blog detail page (with SEO head)
  - [x] 26.1 Implement BlogListPage
    - Create `client/src/pages/Blog/BlogListPage.tsx`: grid of blog cards showing featured image, title, excerpt, category, date; category filter tabs; debounced keyword search input; pagination controls; fetch from `GET /api/v1/blogs?published=true&page=P&limit=9&search=Q&category=C`; skeleton loaders; `SEOHead` with blog listing meta
    - _Requirements: 8.1, 8.2, 8.3_
  - [x] 26.2 Implement BlogDetailPage
    - Create `client/src/pages/Blog/BlogDetailPage.tsx`: fetch by slug from `GET /api/v1/blogs/:slug`; render sanitized HTML content (use `DOMPurify`); `SEOHead` with `seoTitle`, `seoDescription`, Open Graph image from `featuredImage`, canonical URL; related posts section; back to blog link
    - _Requirements: 8.4, 8.5, 8.7, 10.10_

- [x] 27. Build Booking page (form + availability checker + cost calculator + validation)
  - [x] 27.1 Implement BookingForm with real-time availability check and Zod validation
    - Create `client/src/pages/Booking/BookingPage.tsx` and `client/src/components/forms/BookingForm.tsx`
    - Form fields: Full Name*, Phone*, Email*, Event Type* (dropdown), Event Date* (date picker), Guest Count*; Package (pre-filled from `?package=` query param), Catering Required toggle, Decoration Required toggle, Additional Notes
    - On event date change: debounced call to `GET /api/v1/availability?date=X`; show color-coded indicator (green/yellow/red) within 2 seconds; warn if date is booked before submit
    - Zod schema validates all required fields client-side before submission; show field-level errors
    - On success: show confirmation with booking ID; clear form
    - Create `client/src/hooks/useAvailability.ts` and `client/src/hooks/useBookings.ts`
    - `SEOHead` with unique meta
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.7, 2.8, 2.9, 3.3_
  - [ ]* 27.2 Write unit tests for BookingForm validation
    - Test file: `client/src/__tests__/components/BookingForm.test.tsx`
    - Assert required fields show errors on empty submit; assert availability indicator renders correct color for each status; test cost calculator updates on input change
    - _Requirements: 2.3, 2.4, 3.3_

- [x] 28. Build Admin Login page (Firebase sign-in UI)
  - [x] 28.1 Implement AdminLoginPage with Firebase email/password sign-in
    - Create `client/src/pages/Admin/LoginPage.tsx` and `client/src/components/forms/LoginForm.tsx`
    - Form: Email and Password fields with Zod validation (email format, password non-empty); on submit call `signInWithEmailAndPassword(auth, email, password)` from Firebase SDK; on success: Firebase `onAuthStateChanged` fires → `useFirebaseAuth` calls `POST /api/v1/auth/sync` → sets `authStore` → redirect to `/admin`
    - Handle Firebase error codes: `auth/invalid-credential` → generic "Invalid email or password" message (do not reveal which field is wrong); `auth/too-many-requests` → "Too many login attempts. Try again later."
    - Check `user.emailVerified` after sign-in; if not verified, show notice and call `sendEmailVerification(user)`
    - _Requirements: 11.1, 11.2, 11.3_

- [x] 29. Build Admin Dashboard overview page (stats cards + charts)
  - [x] 29.1 Implement DashboardPage with summary cards and charts
    - Create `client/src/pages/Admin/DashboardPage.tsx`: fetch from `GET /api/v1/dashboard/overview`; render summary cards for Total Bookings, Pending Bookings, Confirmed Bookings, Total Inquiries, Total Packages, Total Blogs, Revenue Estimate (NPR)
    - Install `recharts`; render `LineChart` for monthly bookings trend, `PieChart` for event type distribution, `BarChart` for packages performance; all charts responsive with `<ResponsiveContainer>`; skeleton loaders during fetch
    - _Requirements: 12.1, 12.2, 12.3_

- [x] 30. Build Admin Bookings management (table + search + filter + detail view + status update)
  - [x] 30.1 Implement AdminBookingsPage with DataTable
    - Create `client/src/pages/Admin/BookingsPage.tsx`: DataTable with columns: Booking ID, Customer Name, Phone, Event Type, Event Date, Guest Count, Package, Status (colored badge), Actions; server-side search (name/phone), status filter dropdown, date sort, pagination (10/page default); skeleton loader
    - TanStack Query `useQuery` with debounced search params; invalidate on status change
    - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.9_
  - [x] 30.2 Implement BookingDetailPage with status update panel and communication log
    - Create `client/src/pages/Admin/BookingDetailPage.tsx`: display all Customer Info, Event Details, Package Info, Notes sections; Status Update Panel showing only allowed next-status options based on current state machine; Communication Log showing `statusHistory` with timestamp and changed-by; Delete button with confirmation `AlertDialog` modal
    - On status update: call `PATCH /api/v1/bookings/:id/status`; invalidate React Query cache; show toast confirmation
    - _Requirements: 13.5, 13.6, 13.7, 13.8_

- [x] 31. Build Admin Gallery management (drag-drop upload + bulk upload + featured toggle + delete)
  - [x] 31.1 Implement AdminGalleryPage with drag-and-drop upload
    - Create `client/src/pages/Admin/GalleryPage.tsx`: image grid with delete button and featured toggle per image; drag-and-drop upload zone using `react-dropzone`; category select before upload; bulk upload (`multiple` input); preview thumbnails before submit; progress indicator during upload (Cloudinary upload progress); on delete: call `DELETE /api/v1/gallery/:id` then invalidate query
    - Validate file type and size client-side before upload (match server rules: jpg/png/webp, max 10MB)
    - _Requirements: 14.1, 14.2, 14.5, 14.6, 14.7, 14.8_

- [x] 32. Build Admin Packages management (CRUD form)
  - [x] 32.1 Implement AdminPackagesPage with create/edit modal
    - Create `client/src/pages/Admin/PackagesPage.tsx`: packages table with Edit/Delete actions; Shadcn `Dialog` modal form for create/edit: Name, Description, Price, Capacity, Features (dynamic add/remove with `+` button), Category dropdown, Image upload via `POST /api/v1/upload`, `isPopular` toggle, `isActive` toggle; Zod validation client-side
    - Delete button → `AlertDialog` confirmation; on 409 Conflict from API show error toast "This package has existing bookings and cannot be deleted"
    - _Requirements: 15.1, 15.2, 15.3, 15.4, 15.5, 15.6_

- [x] 33. Build Admin Blog management (rich text editor + SEO fields + draft/publish)
  - [x] 33.1 Implement AdminBlogsPage and BlogEditorPage with TipTap
    - Create `client/src/pages/Admin/BlogsPage.tsx`: blogs table with publish status badge and Edit/Delete/Publish action buttons; skeleton loader
    - Create `client/src/pages/Admin/BlogEditorPage.tsx`: Title, TipTap rich text editor for Content (install `@tiptap/react`, `@tiptap/starter-kit`, `@tiptap/extension-image`), Excerpt textarea (max 300 chars with counter), Featured Image upload → `POST /api/v1/upload`, Category, Tags (comma-separated input), Author, SEO Title (max 60 chars with live counter), SEO Description (max 160 chars with live counter), Draft/Publish toggle
    - On publish: `PUT /api/v1/blogs/:id` with `{ published: true }`; `publishedAt` set by backend; invalidate query; show toast
    - _Requirements: 16.1, 16.2, 16.3, 16.4, 16.5, 16.6, 16.7_

- [x] 34. Build Admin Testimonials management
  - [x] 34.1 Implement AdminTestimonialsPage
    - Create `client/src/pages/Admin/TestimonialsPage.tsx`: testimonials grid/table with featured badge; Shadcn `Dialog` modal form for add/edit: Customer Name, Designation, Rating (1–5 star selector using radio buttons), Review text, Photo upload → `POST /api/v1/upload`, Featured toggle
    - Delete with `AlertDialog` confirmation; on `featured` toggle: call `PUT /api/v1/testimonials/:id` and invalidate query; Zod client validation on Rating (must be 1–5 integer)
    - _Requirements: 17.1, 17.2, 17.3, 17.4, 17.5_

- [x] 35. Build Admin Inquiries management (convert to booking action)
  - [x] 35.1 Implement AdminInquiriesPage with status management
    - Create `client/src/pages/Admin/InquiriesPage.tsx`: inquiries table (Customer Name, Phone, Email, Message preview, Status badge, Date); status filter (unread/read/replied); click row to view full message in side panel; auto-mark as read on open via `PATCH /api/v1/inquiries/:id`; "Mark Replied" button; delete with `AlertDialog` confirmation
    - "Convert to Booking" button: use `useNavigate` to navigate to `/admin/bookings/new?name={name}&email={email}&phone={phone}` pre-populating the booking form
    - _Requirements: 18.1, 18.2, 18.3, 18.4, 18.5, 18.6_

- [x] 36. Build Admin Menu management
  - [x] 36.1 Implement AdminMenuPage with category grouped table
    - Create `client/src/pages/Admin/MenuPage.tsx`: menu items table grouped by category; Shadcn `Dialog` modal form for add/edit: Name* (required), Category* (dropdown of 7 values), Description, Price, Image upload → `POST /api/v1/upload`, Available toggle; delete with `AlertDialog` confirmation; Zod client validation
    - _Requirements: 19.1, 19.2, 19.3, 19.4, 19.5_

- [x] 37. Build Admin Calendar page (color-coded availability + manual block)
  - [x] 37.1 Implement AdminCalendarPage with color-coded availability and manual date blocking
    - Create `client/src/pages/Admin/CalendarPage.tsx`: monthly calendar grid showing all days; color code: green = available, yellow = pending/reserved, red = confirmed/booked; fetch booked/blocked dates from `GET /api/v1/bookings` and `GET /api/v1/availability`
    - Click on a future available date → `AlertDialog` "Block this date?" confirmation → calls `POST /api/v1/availability/block`; click on booked date → show booking summary tooltip with customer name and event type
    - _Requirements: 20.1, 20.2, 20.3, 20.4, 20.5_

- [x] 38. Build in-app notification system (bell badge + dropdown)
  - [x] 38.1 Implement notification bell with unread count and dropdown
    - Add notification bell icon in `AdminLayout.tsx` top bar showing `unreadCount` from `notificationStore` as badge
    - Create `client/src/components/shared/NotificationDropdown.tsx`: dropdown listing recent unread bookings (status `pending`) and unread inquiries (status `unread`); each item shows type icon, customer name, relative time (`date-fns`), and link to detail page; "Mark all read" button calls relevant APIs and updates store
    - On admin dashboard mount and on window focus: call `GET /api/v1/dashboard/overview` to refresh `pendingBookings` + unread inquiry count; update `notificationStore`
    - _Requirements: 21.3, 21.4_

- [x] 39. Implement SEO features (sitemap, robots.txt, local business schema, Open Graph)
  - [x] 39.1 Add XML sitemap generation, robots.txt, and JSON-LD schema
    - Create `client/public/robots.txt`: allow all public paths, `Disallow: /admin`, `Sitemap: {VITE_API_URL}/sitemap.xml`
    - Create `server/routes/sitemapRoutes.ts`: `GET /sitemap.xml` generates XML dynamically with all public page URLs and all published blog slugs from DB; Content-Type `application/xml`; register in `app.ts` without `/api/v1` prefix; `GET /api/v1/health` → `{ success: true, message: 'OK' }` (no auth)
    - `LocalBusiness` JSON-LD: businessName "Shree Ganesh Party Venue", addressLocality "Bhaktapur", addressCountry "NP", phone, url, event types — injected via `SEOHead` props on `HomePage.tsx`
    - _Requirements: 10.3, 10.4, 10.5_
  - [x] 39.2 Ensure canonical URLs and Open Graph on all public pages
    - Confirm every public page component passes `canonicalUrl`, `ogTitle`, `ogDescription`, `ogImage` to `SEOHead`
    - Add unique `seoTitle` (≤60 chars) and `seoDescription` (≤160 chars) to all 9 public page `SEOHead` calls
    - _Requirements: 10.1, 10.2, 10.6_

- [x] 40. Performance optimization (lazy loading, WebP via Cloudinary, code splitting, Lighthouse ≥ 90)
  - [x] 40.1 Implement lazy loading, WebP delivery, and code splitting
    - Confirm all routes use `React.lazy()` + `Suspense` in `router.tsx`
    - Create `client/src/utils/cloudinaryUrl.ts`: `buildCloudinaryUrl(publicId, width?, quality?)` helper that generates URL with `f_auto,q_auto,w_{width}` transform params for automatic WebP delivery
    - Replace all direct `<img src>` with Cloudinary URL transform pattern; add `loading="lazy"` to all gallery/blog images; use `fetchpriority="high"` on Hero image; add `width` and `height` attributes to all images to prevent CLS
    - Verify Vite's code splitting produces separate chunks per lazy-loaded route; run `vite build --analyze` (install `rollup-plugin-visualizer`)
    - _Requirements: 10.7, 10.8, 10.9_
  - [ ]* 40.2 Verify Lighthouse score ≥ 90 on Home page
    - Run `npx lighthouse {FRONTEND_URL} --output=json` after deployment; assert `performance >= 0.9`; fix LCP, CLS, and render-blocking issues if score is below threshold
    - _Requirements: 10.7_

- [x] 41. Security hardening (HTTPS redirect, HSTS, CSP, secrets audit, pre-commit hooks, audit logging)
  - [x] 41.1 Enforce HTTPS, HSTS, and Content Security Policy
    - In `server/app.ts` (production only): add HTTPS redirect middleware — if `req.headers['x-forwarded-proto'] !== 'https'` redirect to `https://${req.hostname}${req.url}`
    - Configure Helmet CSP via `helmet.contentSecurityPolicy({ directives: { defaultSrc: ["'self'"], scriptSrc: ["'self'", 'https://www.googletagmanager.com', 'https://apis.google.com'], styleSrc: ["'self'", "'unsafe-inline'"], imgSrc: ["'self'", 'data:', 'https://res.cloudinary.com'], connectSrc: ["'self'", VITE_API_URL], frameSrc: ["'none'"], upgradeInsecureRequests: [] } })`
    - Configure `helmet.hsts({ maxAge: 31536000, includeSubDomains: true, preload: true })`
    - Verify on Render: configure HTTPS-only in service settings; configure Vercel for HTTPS (automatic with Vercel)
    - _Requirements: 22.1_
  - [x] 41.2 Perform secrets audit and pre-commit hook verification
    - Audit all source files using `grep -r "VITE_FIREBASE\|MONGODB_URI\|CLOUDINARY_KEY\|CLOUDINARY_SECRET\|FIREBASE_PRIVATE_KEY" server/src client/src` — assert zero matches in committed code (only `.env` files)
    - Verify `.husky/pre-commit` hook from Task 1.4 is active and blocks `.env` files from commit
    - Add `detect-secrets` or `gitleaks` configuration file to repo root to scan for accidental secret commits in CI
    - Confirm `server/.env` and `client/.env` are in `.gitignore` and verify with `git check-ignore -v server/.env`
    - _Requirements: 22.2_
  - [x] 41.3 Verify audit logging is complete for all sensitive operations
    - Review all DELETE controller handlers to confirm `logAuditEvent` is called with `userId`, `resourceType`, `resourceId`, `timestamp`
    - Review auth middleware to confirm failed token verification attempts are logged with IP address and timestamp (no token value)
    - Review booking status change handler to confirm `statusHistory` subdocument is appended on every status update
    - Create `server/__tests__/unit/auditLog.test.ts`: verify `logAuditEvent` produces correct JSON structure for each event type
    - _Requirements: (Security: audit logging requirement)_
  - [x] 41.4 IDOR prevention audit — verify all admin routes have ownership/permission checks
    - Review every admin controller that accepts a resource ID parameter (`/bookings/:id`, `/gallery/:id`, `/packages/:id`, `/blogs/:id`, `/testimonials/:id`, `/inquiries/:id`, `/menu/:id`)
    - Confirm each performs a DB existence check (`findById`) and returns 404 if not found before operating
    - Confirm role middleware is applied on all admin routes — no admin route should be reachable without `authenticate` + `authorize` middleware
    - Add `server/__tests__/integration/idor.test.ts`: test that accessing nonexistent resource returns 404, not 500; test that `editor` role cannot modify bookings; `numRuns: 100` for role-based property
    - _Requirements: (Security: IDOR prevention requirement)_

- [x] 42. Property-based tests — all 24 properties from design.md using fast-check (numRuns: 100)
  - [x] 42.1 Write PBT for API response envelope format and pagination (Properties 18 and 19)
    - **Property 18: API success responses always conform to standard envelope `{ success: true, message, data }`**
    - **Property 19: Pagination response always includes correct `pagination` object**
    - Test file: `server/__tests__/integration/api-format.test.ts`
    - Property 18: use `fc.constantFrom(...PUBLIC_ENDPOINTS)` to call each endpoint; assert `body.success === true && typeof body.message === 'string' && 'data' in body`; `numRuns: 100`
    - Property 19: use `fc.integer({ min: 1, max: 50 })` for `limit` and `fc.integer({ min: 1 })` for `page`; assert `pagination.pages === Math.ceil(pagination.total / limit)`; `numRuns: 100`
    - **Validates: Requirements 24.2, 24.3, 24.5**
  - [x] 42.2 Write PBT for frontend PackageCard component (Properties 6, 7, 8 — frontend)
    - **Property 6 (frontend): Package card renders all required fields for any valid Package object**
    - **Property 7 (frontend): isPopular flag controls "Most Popular" badge visibility exactly**
    - **Property 8 (frontend): Only isActive packages render in PackagesPage given mixed dataset**
    - Test file: `client/src/__tests__/components/PackageCard.test.tsx`
    - Arbitrary: `fc.record({ name: fc.string({minLength:1}), price: fc.nat(), capacity: fc.integer({min:1}), features: fc.array(fc.string({minLength:1}), {minLength:1}), isPopular: fc.boolean(), isActive: fc.boolean(), slug: fc.string({minLength:1}), _id: fc.string({minLength:1}) })`; `numRuns: 100`
    - **Validates: Requirements 6.2, 6.3, 6.6, 15.2, 15.5**

- [x] 43. Integration and smoke tests
  - [x] 43.1 Write backend integration tests for critical flows
    - Test file: `server/__tests__/integration/smoke.test.ts`: `GET /api/v1/packages` → 200; `GET /api/v1/gallery` → 200; `GET /api/v1/menu` → 200; `GET /api/v1/blogs` → 200; `GET /api/v1/availability?date=2027-01-01` → 200; `GET /api/v1/health` → 200; `GET /api/v1/auth/me` without token → 401; `POST /api/v1/packages` without token → 401
    - Test file: `server/__tests__/integration/auth.api.test.ts`: mock Firebase `verifyIdToken` to return valid/invalid/expired tokens; assert 401 for invalid token, 403 for wrong role, 200 for correct role
    - Test file: `server/__tests__/integration/idor.test.ts`: accessing `GET /api/v1/bookings/nonexistent-id` → 404; editor role on `PATCH /api/v1/bookings/:id/status` → 403
    - _Requirements: 11.1, 11.9, 22.1_
  - [x] 43.2 Write frontend component tests for critical public pages
    - Test file: `client/src/__tests__/components/BookingForm.test.tsx`: all required fields show validation errors on empty submit; availability indicator renders green/yellow/red for correct status values
    - Test file: `client/src/__tests__/components/GalleryPage.test.tsx`: category filter shows only matching images
    - Test file: `client/src/__tests__/components/BlogCard.test.tsx`: renders title, excerpt, category, date for any valid blog object
    - Test file: `client/src/__tests__/utils/calculateEventCost.test.ts`: boundary cases (guestCount=1, guestCount=capacity+1)
    - _Requirements: 2.3, 2.4, 3.3, 5.2, 8.1_

- [x] 44. Deployment configuration (Vercel frontend, Render backend, MongoDB Atlas, Cloudinary, env vars)
  - [x] 44.1 Configure Vercel for frontend deployment
    - Create `client/vercel.json`: `"rewrites": [{ "source": "/((?!api).*)", "destination": "/index.html" }]` for SPA routing; build command `npm run build`, output directory `dist`
    - Add all `VITE_*` environment variables in Vercel project settings; document in `client/.env.example`
    - Vercel automatically provisions HTTPS/SSL — no additional configuration needed
    - _Requirements: 25.1_
  - [x] 44.2 Configure Render for backend deployment
    - Create `server/render.yaml` (or document Render service settings): build command `npm run build`, start command `node dist/server.js`, environment `Node`; set health check path `/api/v1/health`
    - Create `server/controllers/healthController.ts` and route `GET /api/v1/health` returning `{ success: true, message: 'OK', timestamp: new Date() }` — no auth required
    - Add all backend environment variables (`MONGODB_URI`, `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`, `CLOUDINARY_*`, `EMAIL_*`, `FRONTEND_URL`) in Render environment settings; never commit these values
    - _Requirements: 25.1_
  - [x] 44.3 Configure MongoDB Atlas IP allowlist and CORS for production
    - Document in `DEPLOYMENT.md`: configure MongoDB Atlas IP Access List to allow only Render's outbound IP addresses (not `0.0.0.0/0`); enable Atlas backups; use Atlas connection string with `authSource=admin`
    - Update `server/app.ts` CORS config to use `FRONTEND_URL` env var (Vercel production URL); ensure `credentials: true` for cookie compatibility
    - Create `DEPLOYMENT.md` at monorepo root: all required env vars for both packages, step-by-step Vercel/Render/Atlas/Cloudinary/Firebase setup, Firebase Console user creation instructions (add user → copy UID → call `POST /api/v1/auth/set-role`)
    - _Requirements: 22.2, 25.1_
  - [x] 44.4 Configure Firebase project for production
    - Document in `DEPLOYMENT.md`: create Firebase project, enable Email/Password authentication provider, enable Email Verification in Firebase Auth settings, enable Password Reset flow
    - Add Vercel production domain to Firebase Auth authorized domains
    - Document Firebase custom claims setup: after creating admin user in Firebase Console, call `POST /api/v1/auth/set-role` with the user's UID and desired role to assign custom claims
    - _Requirements: (Security: Firebase Auth requirements)_

- [x] 45. Final QA checklist
  - [x] 45.1 Run complete test suite and verify all 24 property-based tests pass
    - Run `jest --runInBand` in `/server`; run `vitest --run` in `/client`
    - Confirm all 24 property-based tests execute with ≥ 100 iterations each
    - Run `tsc --noEmit` in both packages; fix all TypeScript errors
    - _Requirements: (all)_
  - [x] 45.2 Security QA checklist
    - Confirm no secrets in client bundle: run `vite build` and `grep -r "FIREBASE_PRIVATE_KEY\|MONGODB_URI\|CLOUDINARY_SECRET" client/dist` — must return 0 results
    - Verify Helmet headers in production response: `Content-Security-Policy`, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Strict-Transport-Security` present
    - Verify all admin routes return 401 without Firebase token and 403 for wrong role
    - Verify rate limiters: send 11 rapid requests to `POST /api/v1/bookings` from same IP → 12th request gets 429
    - Verify Zod `.strict()` rejects unexpected fields: send booking body with extra `__proto__` field → 400
    - Confirm `robots.txt` disallows `/admin`; confirm `/admin` route redirects to `/admin/login` for unauthenticated users
    - _Requirements: 22.1, 22.2, 22.3, 22.4, 22.5_
  - [x] 45.3 Performance and accessibility QA checklist
    - Run Lighthouse on Home page (production URL); assert score ≥ 90 for Performance, ≥ 85 for Accessibility, ≥ 90 for Best Practices, ≥ 90 for SEO
    - Verify all images have `alt` attributes; verify all form fields have associated `<label>` elements; verify focus management in modals and Lightbox
    - Verify `/sitemap.xml` returns 200 with valid XML containing all 9 public pages and all published blog URLs
    - Verify `/robots.txt` returns 200 with correct `Disallow: /admin` directive
    - Ask the user if any questions arise before considering the implementation complete


---

## Notes

- Tasks marked with `*` are optional and can be skipped for a faster MVP build
- Each task references specific requirements for traceability
- Checkpoints (tasks 16 and 45.1) enforce incremental validation before advancing phases
- All 24 property-based tests use **fast-check** with a minimum of 100 iterations each (`numRuns: 100`)
- Property test tasks are sub-tasks under the feature they test — not standalone tasks — to catch regressions early
- Unit tests validate specific examples and edge cases; property tests validate universal invariants
- **Firebase replaces custom JWT entirely:** no bcrypt, no `jsonwebtoken` package, no `/auth/login` endpoint, no seed scripts for admin users. Admins are created in Firebase Console → Email/Password sign-in → UID copied → `POST /api/v1/auth/set-role` assigns role via custom claims
- Firebase ID tokens expire in 1 hour; Firebase SDK automatically refreshes them — the `auth.currentUser.getIdToken()` call in the Axios interceptor handles silent refresh transparently
- All Cloudinary image URLs must use transformation parameters (`f_auto,q_auto`) for WebP delivery and performance
- MongoDB Atlas IP allowlist must be restricted to Render outbound IPs in production — never `0.0.0.0/0`
- Audit log events must include `userId`, `action`, `resourceType`, `resourceId`, and `timestamp` — stored in server logs (or a separate `AuditLog` collection if required in future)
- TipTap rich text editor for blogs requires `@tiptap/react`, `@tiptap/starter-kit`; rendered HTML must be sanitized with `DOMPurify` on the frontend before display
- The pre-commit hook (`husky`) must be installed and active on every developer machine: run `npx husky install` after cloning

---

## Task Dependency Graph

```json
{
  "waves": [
    {
      "id": 0,
      "tasks": ["1.1", "1.2", "1.3", "1.4"]
    },
    {
      "id": 1,
      "tasks": ["2.1", "2.2", "2.3", "2.4", "2.5", "2.6", "2.7"]
    },
    {
      "id": 2,
      "tasks": ["3.1", "3.2", "3.3", "2.8"]
    },
    {
      "id": 3,
      "tasks": ["4.1", "4.2"]
    },
    {
      "id": 4,
      "tasks": ["4.3", "5.1", "5.2"]
    },
    {
      "id": 5,
      "tasks": ["5.3", "5.4", "6.1", "7.1", "8.1"]
    },
    {
      "id": 6,
      "tasks": ["5.5", "6.2", "7.2", "8.2", "9.1", "10.1", "11.1", "12.1", "13.1", "14.1", "15.1"]
    },
    {
      "id": 7,
      "tasks": ["6.3", "7.3", "8.3", "9.3", "10.3", "12.2", "13.2", "14.2", "15.2"]
    },
    {
      "id": 8,
      "tasks": ["17.1", "17.2", "17.3", "17.4", "18.1", "18.2"]
    },
    {
      "id": 9,
      "tasks": ["19.1", "19.2", "20.1", "20.2", "20.3"]
    },
    {
      "id": 10,
      "tasks": ["21.1", "21.2", "21.3", "22.1", "22.2", "23.1", "24.1", "25.1", "26.1", "29.1"]
    },
    {
      "id": 11,
      "tasks": ["24.2", "25.2", "26.2", "27.1", "28.1"]
    },
    {
      "id": 12,
      "tasks": ["27.2", "30.1", "31.1", "32.1", "33.1", "34.1", "35.1", "36.1"]
    },
    {
      "id": 13,
      "tasks": ["30.2", "37.1", "38.1", "39.1", "39.2"]
    },
    {
      "id": 14,
      "tasks": ["40.1", "41.1", "41.2", "41.3", "41.4", "42.1", "42.2"]
    },
    {
      "id": 15,
      "tasks": ["40.2", "43.1", "43.2"]
    },
    {
      "id": 16,
      "tasks": ["44.1", "44.2", "44.3", "44.4"]
    },
    {
      "id": 17,
      "tasks": ["45.1", "45.2", "45.3"]
    }
  ]
}
```
