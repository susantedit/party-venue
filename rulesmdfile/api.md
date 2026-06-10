# API Specification

## Project Name

Shree Ganesh Party Venue & Catering Service

---

# API Overview

Architecture:
REST API

Base URL:

```text
/api/v1
```

Response Format:

```json
{
  "success": true,
  "message": "Request successful",
  "data": {}
}
```

Error Format:

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": []
}
```

---

# Authentication

Authentication Method:

JWT Access Token

Authorization Header:

```text
Authorization: Bearer <token>
```

Protected Routes:

* Admin Dashboard
* Gallery Management
* Blog Management
* Package Management
* Booking Management
* Testimonial Management

---

# Auth Routes

## Login

POST

```text
/api/v1/auth/login
```

Request:

```json
{
  "email": "admin@example.com",
  "password": "password"
}
```

Response:

```json
{
  "success": true,
  "token": "jwt_token",
  "user": {}
}
```

---

## Logout

POST

```text
/api/v1/auth/logout
```

---

## Get Current User

GET

```text
/api/v1/auth/me
```

---

# Booking Routes

## Create Booking

POST

```text
/api/v1/bookings
```

Request:

```json
{
  "customerName": "John Doe",
  "email": "john@gmail.com",
  "phone": "9800000000",
  "eventType": "Wedding",
  "eventDate": "2026-08-20",
  "guestCount": 300,
  "packageId": "package_id",
  "notes": "Need decoration"
}
```

Validation:

* Name required
* Phone required
* Event date required
* Guest count > 0

---

## Get All Bookings

GET

```text
/api/v1/bookings
```

Query:

```text
?page=1
&limit=10
&status=pending
&search=john
```

Admin Only

---

## Get Booking By ID

GET

```text
/api/v1/bookings/:id
```

Admin Only

---

## Update Booking Status

PATCH

```text
/api/v1/bookings/:id/status
```

Request:

```json
{
  "status": "confirmed"
}
```

Allowed Status:

* pending
* contacted
* confirmed
* completed
* cancelled

---

## Delete Booking

DELETE

```text
/api/v1/bookings/:id
```

Admin Only

---

# Package Routes

## Get Packages

GET

```text
/api/v1/packages
```

Public

---

## Get Package Details

GET

```text
/api/v1/packages/:slug
```

Public

---

## Create Package

POST

```text
/api/v1/packages
```

Admin Only

---

## Update Package

PUT

```text
/api/v1/packages/:id
```

Admin Only

---

## Delete Package

DELETE

```text
/api/v1/packages/:id
```

Admin Only

---

# Gallery Routes

## Get Gallery

GET

```text
/api/v1/gallery
```

Filters:

```text
?category=wedding
```

Public

---

## Upload Gallery Image

POST

```text
/api/v1/gallery
```

Multipart Form Data

Admin Only

---

## Delete Gallery Image

DELETE

```text
/api/v1/gallery/:id
```

Admin Only

---

# Blog Routes

## Get Blogs

GET

```text
/api/v1/blogs
```

Public

---

## Get Blog By Slug

GET

```text
/api/v1/blogs/:slug
```

Public

---

## Create Blog

POST

```text
/api/v1/blogs
```

Admin Only

---

## Update Blog

PUT

```text
/api/v1/blogs/:id
```

Admin Only

---

## Delete Blog

DELETE

```text
/api/v1/blogs/:id
```

Admin Only

---

# Testimonial Routes

## Get Testimonials

GET

```text
/api/v1/testimonials
```

Public

---

## Create Testimonial

POST

```text
/api/v1/testimonials
```

Admin Only

---

## Update Testimonial

PUT

```text
/api/v1/testimonials/:id
```

Admin Only

---

## Delete Testimonial

DELETE

```text
/api/v1/testimonials/:id
```

Admin Only

---

# Menu Routes

## Get Menu Items

GET

```text
/api/v1/menu
```

Filters:

```text
?category=nepali
```

Public

---

## Create Menu Item

POST

```text
/api/v1/menu
```

Admin Only

---

## Update Menu Item

PUT

```text
/api/v1/menu/:id
```

Admin Only

---

## Delete Menu Item

DELETE

```text
/api/v1/menu/:id
```

Admin Only

---

# Inquiry Routes

## Create Inquiry

POST

```text
/api/v1/inquiries
```

Request:

```json
{
  "name": "Customer",
  "phone": "9800000000",
  "email": "customer@email.com",
  "message": "Need venue for wedding"
}
```

Public

---

## Get All Inquiries

GET

```text
/api/v1/inquiries
```

Admin Only

---

## Update Inquiry Status

PATCH

```text
/api/v1/inquiries/:id
```

Admin Only

---

# Availability Routes

## Check Date Availability

GET

```text
/api/v1/availability
```

Query:

```text
?date=2026-10-10
```

Response:

```json
{
  "available": true
}
```

Public

---

# Dashboard Routes

## Dashboard Analytics

GET

```text
/api/v1/dashboard/overview
```

Returns:

```json
{
  "totalBookings": 250,
  "pendingBookings": 15,
  "totalPackages": 4,
  "totalBlogs": 20,
  "totalInquiries": 40
}
```

Admin Only

---

# Upload Routes

## Upload Image

POST

```text
/api/v1/upload
```

Storage:

Cloudinary

Accepted Types:

* jpg
* jpeg
* png
* webp

Max Size:

10 MB

---

# Pagination Standard

All list endpoints must support:

```text
?page=1
&limit=10
```

Response:

```json
{
  "success": true,
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "pages": 10
  }
}
```

---

# Validation Rules

Must Use:

* Zod
  or
* Joi

Validation Required For:

* Auth
* Bookings
* Packages
* Blogs
* Gallery
* Testimonials
* Inquiries

---

# Security Requirements

Must Implement:

* JWT Authentication
* Rate Limiting
* Helmet
* CORS
* Input Sanitization
* Mongo Injection Protection
* XSS Protection
* File Upload Validation

---

# Error Codes

200 Success

201 Created

400 Validation Error

401 Unauthorized

403 Forbidden

404 Not Found

409 Conflict

422 Unprocessable Entity

500 Internal Server Error

---

# Future APIs

eSewa Payment API

Khalti Payment API

SMS API

Google Reviews API

Google Calendar API

AI Event Planner API

CRM Integration API

API design must remain RESTful, scalable, secure, versioned, and suitable for future integrations.
