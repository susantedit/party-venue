# Development Rules & Standards

## Project Name

Shree Ganesh Party Venue & Catering Service

---

# Purpose

Define strict development conventions for building a scalable, production-ready MERN stack application.

These rules ensure:

* Consistent code quality
* Maintainability
* Scalability
* Team collaboration readiness
* Production-grade reliability

---

# General Principles

* Code must be modular and reusable
* Business logic must never live inside UI components
* All API calls must be centralized
* Every feature must be fully typed (TypeScript)
* Every module must be independently testable
* Avoid duplication at all costs
* Prefer clarity over clever code

---

# Folder Structure Rules

## Frontend (React)

```text id="fe1"
src/
├── components/        # Reusable UI components
├── pages/             # Route pages
├── hooks/             # Custom hooks
├── services/          # API calls
├── store/             # Global state
├── utils/             # Helper functions
├── types/             # TypeScript types
├── constants/         # Static values
├── layouts/           # Page layouts
├── routes/            # Routing config
└── assets/            # Images, icons
```

## Backend (Express)

```text id="be1"
server/
├── controllers/       # Request handlers
├── routes/            # API routes
├── models/            # MongoDB schemas
├── services/          # Business logic
├── middleware/        # Auth, validation, error handling
├── utils/             # Helper functions
├── config/            # DB, env config
└── validations/       # Request validation schemas
```

---

# Naming Conventions

## Frontend

Components → PascalCase

```text id="n1"
BookingForm.tsx
ServiceCard.tsx
GalleryGrid.tsx
```

Hooks → camelCase with prefix "use"

```text id="n2"
useBookings.ts
useAuth.ts
useGallery.ts
```

Variables → camelCase

Constants → UPPER_SNAKE_CASE

---

## Backend

Controllers:

```text id="n3"
bookingController.js
authController.js
```

Models:

```text id="n4"
Booking.js
User.js
Package.js
```

Routes:

```text id="n5"
bookingRoutes.js
authRoutes.js
```

---

# API Design Rules

* Must follow REST principles
* Use versioning: `/api/v1`
* Use consistent response format
* Always return status codes properly
* Never expose internal errors to client

---

## Standard Response

Success:

```json id="r1"
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

Error:

```json id="r2"
{
  "success": false,
  "message": "Something went wrong",
  "errors": []
}
```

---

# State Management Rules

Preferred:

* Zustand (recommended)
* OR Context API (small state only)

Rules:

* Do NOT use Redux unless necessary
* Keep global state minimal
* API state should be handled by React Query (TanStack Query)

---

# API Handling Rules

All API calls must be inside:

```text id="a1"
services/
```

Example:

```ts id="a2"
bookingService.ts
authService.ts
galleryService.ts
```

Never call fetch/axios directly inside components.

---

# Error Handling Rules

Frontend:

* Use toast notifications
* Show user-friendly messages only

Backend:

* Use centralized error middleware
* Log internal errors separately
* Never expose stack traces to client

---

# Authentication Rules

* JWT Access Token required for protected routes
* Store token in HTTP-only cookies
* Refresh token mechanism required
* Passwords must be hashed using bcrypt

---

# Validation Rules

Must use:

* Zod (preferred)
  OR
* Joi

Validation required for:

* Booking forms
* Login forms
* Admin inputs
* API requests

---

# File Upload Rules

* Use Multer for upload handling
* Store images in Cloudinary only
* Never store raw files in backend
* Validate file type and size

Allowed formats:

* jpg
* jpeg
* png
* webp

Max size:

10MB

---

# Security Rules

Mandatory:

* Helmet.js
* CORS configuration
* Rate limiting
* Input sanitization
* MongoDB injection protection
* XSS prevention
* Secure headers

---

# Performance Rules

* Lazy load all routes
* Lazy load images
* Use code splitting
* Optimize bundle size
* Avoid unnecessary re-renders
* Use pagination for all lists

---

# Git Workflow

Branches:

main → production

dev → development

feature/* → new features

hotfix/* → urgent fixes

---

Commit Style:

```text id="g1"
feat: add booking system
fix: resolve gallery upload bug
refactor: improve API structure
chore: update dependencies
```

---

# Testing Strategy

Frontend:

* Component testing (optional)
* Form validation testing

Backend:

* API testing required
* Service layer testing preferred

Tools:

* Jest
* Supertest

---

# Logging Rules

Must log:

* API requests
* Errors
* Auth events
* Booking events

Do NOT log:

* Passwords
* JWT tokens
* Sensitive user data

---

# Environment Rules

Use `.env` only

Never hardcode:

* API URLs
* Secrets
* Database credentials
* Cloudinary keys

---

# Deployment Rules

Frontend:

* Vercel

Backend:

* Render

Database:

* MongoDB Atlas

Images:

* Cloudinary

---

# Code Quality Rules

* No unused variables
* No console.logs in production
* Must pass lint checks
* Must follow Prettier formatting
* TypeScript strict mode enabled

---

# Scalability Rules

System must be ready for:

* Multiple venues
* Multi-admin system
* Payment integration
* SMS notifications
* AI event assistant
* CRM integration

---

# Prohibited Practices

* Inline API calls in UI
* Hardcoded secrets
* Unvalidated user input
* Duplicate components
* Large monolithic files
* Non-typed API responses

---

# Final Rule

If a feature is unclear:

→ Ask before implementing
→ Never assume business logic
→ Always prioritize scalability and maintainability
