# CLAUDE.md

## Project Name

Shree Ganesh Party Venue & Catering Service

## Project Type

Full Stack MERN Business Website with Admin Dashboard

---

# Project Goal

Build a modern, premium, conversion-focused website for Shree Ganesh Party Venue & Catering Service.

The primary objective is generating venue bookings, catering inquiries, and customer leads.

The website must feel like a luxury event management brand rather than a simple local business website.

---

# Tech Stack

## Frontend

* React 19
* Vite
* TypeScript
* Tailwind CSS
* Shadcn UI
* Framer Motion
* React Router DOM
* React Hook Form
* Zod Validation
* Axios
* TanStack Query

## Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* Bcrypt
* Multer
* Cloudinary
* Nodemailer

## Deployment

Frontend:

* Vercel

Backend:

* Render

Database:

* MongoDB Atlas

Images:

* Cloudinary

---

# User Roles

## Guest User

Can:

* View website
* Browse gallery
* View packages
* Contact business
* Request quotation
* Submit booking inquiry

## Admin

Can:

* Login securely
* Manage gallery
* Manage packages
* Manage blogs
* Manage testimonials
* Manage bookings
* Manage inquiries
* Manage homepage content

---

# Website Pages

## Home Page

Sections:

### Hero Section

Large venue background video

Headline:

"Premium Party Venue & Catering Services in Bhaktapur"

Buttons:

* Book Venue
* Get Quote
* Contact Us

---

### Statistics

Display:

* Events Completed
* Years Experience
* Happy Clients
* Capacity

---

### Services Section

Cards:

* Wedding Venue
* Reception
* Birthday Parties
* Bratabandha
* Pasni
* Corporate Events
* Catering
* Decoration

---

### Why Choose Us

Features:

* Spacious Hall
* Quality Catering
* Parking Facility
* Experienced Staff
* Affordable Packages
* Event Management

---

### Featured Gallery

Latest Event Images

Button:

View Full Gallery

---

### Testimonials

Customer Reviews

Google Reviews Integration

---

### Call To Action

Book Your Event Today

---

# About Page

Sections:

* Company Story
* Mission
* Vision
* Venue Overview
* Team Introduction

---

# Services Page

Wedding Venue

Reception Venue

Birthday Events

Corporate Events

Pasni

Bratabandha

Outdoor Catering

Food Catering

Decoration Service

Event Management

---

# Gallery Page

Categories:

* Weddings
* Reception
* Birthday
* Catering
* Decoration
* Venue

Features:

* Category Filter
* Image Lightbox
* Infinite Scroll
* Lazy Loading

---

# Packages Page

Packages:

## Silver

Features
Price
Capacity

## Gold

Features
Price
Capacity

## Platinum

Features
Price
Capacity

---

Each package includes:

* Food
* Decoration
* Hall
* Seating
* Staff

Button:

Request Custom Package

---

# Menu Page

Food Categories:

* Nepali
* Newari
* Indian
* Chinese
* BBQ
* Desserts
* Beverages

Each Item:

* Image
* Description
* Category

---

# Booking Page

Form Fields:

* Full Name
* Email
* Phone
* Event Type
* Guest Count
* Event Date
* Catering Required
* Decoration Required
* Additional Notes

Submit to database.

Admin receives email notification.

---

# Contact Page

Contact Form

Business Information

Google Map

Business Hours

Call Button

WhatsApp Button

---

# Blog System

Blog Listing

Blog Details

Categories

SEO Optimized URLs

Examples:

/blog/wedding-planning-guide

/blog/catering-cost-nepal

/blog/event-decoration-ideas

---

# Premium Features

## Event Cost Calculator

User Selects:

* Event Type
* Guests
* Package

Instant Estimated Cost

---

## Availability Checker

Select Date

Check Availability

---

## WhatsApp Integration

Floating Button

Direct Contact

---

## AI Event Planner

User enters:

Event Type

Guest Count

Budget

AI suggests:

* Package
* Decoration
* Food Menu

---

# Admin Dashboard

## Dashboard Overview

Cards:

* Total Bookings
* Pending Inquiries
* Packages
* Blog Posts
* Revenue Estimate

---

## Booking Management

View Bookings

Approve Booking

Reject Booking

Update Status

Delete Booking

---

## Gallery Management

Upload Images

Delete Images

Update Categories

Cloudinary Integration

---

## Package Management

Create Package

Update Package

Delete Package

---

## Blog Management

Create Blog

Edit Blog

Delete Blog

Rich Text Editor

Image Upload

---

## Testimonial Management

Add Review

Edit Review

Delete Review

---

## Contact Inquiry Management

View Messages

Mark As Read

Delete

---

# Database Collections

## Users

name

email

password

role

createdAt

---

## Bookings

name

email

phone

eventType

guestCount

eventDate

package

status

notes

createdAt

---

## Packages

name

price

capacity

features

image

createdAt

---

## Gallery

title

image

category

createdAt

---

## Testimonials

name

message

rating

image

createdAt

---

## Blogs

title

slug

content

featuredImage

category

author

createdAt

---

## Inquiries

name

email

phone

message

createdAt

---

# API Routes

/api/auth

/api/bookings

/api/packages

/api/gallery

/api/blogs

/api/testimonials

/api/inquiries

/api/dashboard

---

# Security

JWT Authentication

Password Hashing

Rate Limiting

Helmet

CORS Protection

Input Validation

XSS Protection

Sanitize Mongo Queries

---

# SEO Requirements

Meta Tags

Open Graph

Twitter Cards

Schema Markup

XML Sitemap

Robots.txt

Canonical URLs

SEO Friendly URLs

---

# Performance

Lazy Loading

Image Optimization

Code Splitting

Caching

CDN Images

Lighthouse Score Above 90

---

# Design Requirements

Theme:

Luxury Event Venue

Colors:

Primary:
#C9A227

Secondary:
#111827

Background:
#FFFFFF

Accent:
#F8F5EE

Typography:

Poppins

Playfair Display

---

# Animations

Framer Motion

Fade In

Slide Up

Gallery Hover Effects

Smooth Scrolling

Counter Animations

---

# Mobile Responsiveness

Mobile First

Tablet Support

Desktop Support

Cross Browser Compatible

---

# Deliverables

1. Production Ready Frontend

2. Production Ready Backend

3. MongoDB Database

4. Admin Dashboard

5. Booking System

6. Gallery CMS

7. Blog CMS

8. Contact System

9. SEO Optimization

10. Deployment Ready Application

The website should look comparable to premium wedding venue and event management websites rather than a typical local business website.
