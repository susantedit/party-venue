# Database Design

## Project Name

Shree Ganesh Party Venue & Catering Service

---

# Database Overview

Database:
MongoDB Atlas

ODM:
Mongoose

Principles:

* Normalized where necessary
* Fast read operations
* Optimized for dashboard analytics
* SEO-friendly content storage
* Soft delete support
* Audit timestamps enabled

---

# Collections

## Users

Purpose:

Admin authentication and dashboard access.

Schema:

```js
{
  _id: ObjectId,

  name: String,

  email: String,

  password: String,

  role: String,

  avatar: String,

  isActive: Boolean,

  lastLogin: Date,

  createdAt: Date,

  updatedAt: Date
}
```

Indexes:

* email (unique)

Roles:

* super-admin
* admin
* editor

---

# Bookings

Purpose:

Store all venue booking requests.

Schema:

```js
{
  _id: ObjectId,

  bookingId: String,

  customerName: String,

  email: String,

  phone: String,

  eventType: String,

  eventDate: Date,

  guestCount: Number,

  packageId: ObjectId,

  cateringRequired: Boolean,

  decorationRequired: Boolean,

  notes: String,

  estimatedPrice: Number,

  status: String,

  source: String,

  createdAt: Date,

  updatedAt: Date
}
```

Status Values:

* pending
* contacted
* confirmed
* completed
* cancelled

Source Values:

* website
* whatsapp
* phone
* referral

Indexes:

* eventDate
* status
* createdAt

---

# Packages

Purpose:

Store event packages.

Schema:

```js
{
  _id: ObjectId,

  name: String,

  slug: String,

  description: String,

  category: String,

  price: Number,

  capacity: Number,

  features: [String],

  image: String,

  isPopular: Boolean,

  isActive: Boolean,

  createdAt: Date,

  updatedAt: Date
}
```

Categories:

* silver
* gold
* platinum
* custom

Indexes:

* slug
* category

---

# Gallery

Purpose:

Store event photos.

Schema:

```js
{
  _id: ObjectId,

  title: String,

  imageUrl: String,

  cloudinaryId: String,

  category: String,

  eventType: String,

  altText: String,

  featured: Boolean,

  createdAt: Date,

  updatedAt: Date
}
```

Categories:

* wedding
* reception
* birthday
* catering
* decoration
* venue

Indexes:

* category
* featured

---

# Testimonials

Purpose:

Store customer reviews.

Schema:

```js
{
  _id: ObjectId,

  customerName: String,

  designation: String,

  rating: Number,

  review: String,

  image: String,

  featured: Boolean,

  createdAt: Date,

  updatedAt: Date
}
```

Rating Range:

1–5

Indexes:

* featured

---

# Blogs

Purpose:

SEO and content marketing.

Schema:

```js
{
  _id: ObjectId,

  title: String,

  slug: String,

  excerpt: String,

  content: String,

  featuredImage: String,

  category: String,

  tags: [String],

  author: String,

  seoTitle: String,

  seoDescription: String,

  published: Boolean,

  views: Number,

  createdAt: Date,

  updatedAt: Date
}
```

Indexes:

* slug
* category
* published

---

# Inquiries

Purpose:

Contact form submissions.

Schema:

```js
{
  _id: ObjectId,

  name: String,

  email: String,

  phone: String,

  subject: String,

  message: String,

  status: String,

  createdAt: Date,

  updatedAt: Date
}
```

Status:

* unread
* read
* replied

Indexes:

* status

---

# Menus

Purpose:

Food menu management.

Schema:

```js
{
  _id: ObjectId,

  name: String,

  description: String,

  category: String,

  image: String,

  price: Number,

  available: Boolean,

  createdAt: Date,

  updatedAt: Date
}
```

Categories:

* nepali
* newari
* indian
* chinese
* bbq
* dessert
* beverage

Indexes:

* category

---

# Availability Calendar

Purpose:

Track booked dates.

Schema:

```js
{
  _id: ObjectId,

  date: Date,

  bookingId: ObjectId,

  status: String,

  createdAt: Date
}
```

Status:

* available
* reserved
* booked

Indexes:

* date

---

# SEO Pages

Purpose:

Dynamic SEO management.

Schema:

```js
{
  _id: ObjectId,

  pageName: String,

  metaTitle: String,

  metaDescription: String,

  ogImage: String,

  canonicalUrl: String,

  updatedAt: Date
}
```

Indexes:

* pageName

```

---

# Collection Relationships

Users

↓

Blogs

---

Packages

↓

Bookings

---

Bookings

↓

Availability Calendar

---

Gallery

Independent Collection

---

Testimonials

Independent Collection

---

Menus

Independent Collection

---

# Required Database Features

Must Include:

- createdAt timestamps
- updatedAt timestamps
- schema validation
- indexes
- pagination support
- search support
- filtering support

---

# Search Requirements

Bookings:

- customer name
- phone
- event type

Blogs:

- title
- tags
- category

Gallery:

- category
- event type

Packages:

- package name

---

# Backup Strategy

Daily Automated Backup

Weekly Snapshot

Monthly Archive

MongoDB Atlas Backup Enabled

---

# Future Expansion

Ready For:

- Multiple Venues
- Online Payments
- CRM Integration
- Loyalty Program
- Event Management
- SMS Notifications
- AI Event Planner
- Vendor Management

Database design must prioritize scalability, reporting, filtering, and admin dashboard analytics.
```
