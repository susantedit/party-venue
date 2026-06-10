# System Architecture

## Project Name

Shree Ganesh Party Venue & Catering Service

---

# Architecture Overview

Architecture Type:

Full Stack MERN Application

Frontend:

* React
* Vite
* TypeScript
* Tailwind CSS
* Shadcn UI
* Framer Motion

Backend:

* Node.js
* Express.js

Database:

* MongoDB Atlas

Storage:

* Cloudinary

Authentication:

* JWT
* Refresh Tokens

Deployment:

* Frontend → Vercel
* Backend → Render
* Database → MongoDB Atlas

---

# High Level Architecture

User

↓

React Frontend

↓

Express REST API

↓

MongoDB Database

↓

Cloudinary Storage

---

# Folder Structure

## Frontend

src/

├── app/

├── assets/

├── components/

│ ├── ui/

│ ├── layout/

│ ├── sections/

│ ├── forms/

│ └── shared/

│

├── pages/

│ ├── Home/

│ ├── About/

│ ├── Services/

│ ├── Gallery/

│ ├── Packages/

│ ├── Menu/

│ ├── Blog/

│ ├── Contact/

│ └── Booking/

│

├── hooks/

├── services/

├── lib/

├── types/

├── store/

├── routes/

├── constants/

└── utils/

---

## Backend

server/

├── config/

├── middleware/

├── controllers/

├── services/

├── routes/

├── models/

├── validators/

├── utils/

├── uploads/

└── jobs/

---

# Architecture Layers

## Presentation Layer

Responsibilities:

* UI
* Routing
* Forms
* Animations
* Client Validation

Technology:

React

Tailwind

Framer Motion

---

## Business Layer

Responsibilities:

* Booking Logic
* Package Logic
* Gallery Logic
* Authentication Logic

Technology:

Express Services

---

## Data Layer

Responsibilities:

* Database Access
* Data Validation
* Aggregations

Technology:

Mongoose

MongoDB

---

# Authentication Flow

Admin Login

↓

Validate Credentials

↓

Generate JWT

↓

Store Secure Cookie

↓

Access Dashboard

↓

Refresh Token

↓

Logout

---

# State Management

Global State:

* Auth
* User
* Notifications

Technology:

Context API

or

Zustand

---

# API Communication

Technology:

Axios

Pattern:

Page

↓

Hook

↓

Service

↓

API

---

# Image Upload Flow

Admin Upload

↓

Multer

↓

Cloudinary

↓

Store URL in MongoDB

↓

Serve Optimized Images

---

# Booking Flow

Customer

↓

Booking Form

↓

Frontend Validation

↓

Backend Validation

↓

Database

↓

Admin Notification

↓

Dashboard Entry

↓

Customer Follow-up

---

# Availability Checker Flow

User Selects Date

↓

API Check

↓

Search Existing Bookings

↓

Return Available / Unavailable

---

# Blog Flow

Admin Creates Blog

↓

Markdown/Rich Text

↓

Database

↓

SEO Metadata

↓

Published

---

# Security Architecture

Must Use:

* JWT Authentication
* Bcrypt Hashing
* Rate Limiting
* Helmet
* CORS
* Input Validation
* Mongo Sanitization
* XSS Protection

---

# Logging

Request Logs

Error Logs

Authentication Logs

Booking Logs

Admin Activity Logs

---

# Email System

Provider:

Nodemailer

Events:

New Booking

New Inquiry

Admin Alerts

Quotation Requests

---

# Performance Strategy

Lazy Loading

Code Splitting

Image Optimization

Compression

Caching

Pagination

Database Indexing

---

# SEO Architecture

Meta Titles

Meta Descriptions

Open Graph

Twitter Cards

Structured Data

Local Business Schema

XML Sitemap

Robots.txt

Canonical URLs

---

# Deployment Pipeline

GitHub

↓

Vercel Frontend

↓

Render Backend

↓

MongoDB Atlas

↓

Cloudinary

---

# Environment Variables

Frontend

VITE_API_URL

VITE_CLOUDINARY_NAME

VITE_GOOGLE_MAPS_KEY

---

Backend

PORT

NODE_ENV

MONGODB_URI

JWT_SECRET

JWT_REFRESH_SECRET

CLOUDINARY_NAME

CLOUDINARY_KEY

CLOUDINARY_SECRET

EMAIL_USER

EMAIL_PASSWORD

FRONTEND_URL

---

# Scalability Notes

Future Ready For:

* Multi Venue Support
* Online Payments
* CRM Integration
* AI Event Planner
* Mobile Application
* Multi Language Support
* SMS Notifications
* Event Management System

---

# Architecture Principles

* Mobile First
* API First
* Component Driven
* Reusable Modules
* Scalable Structure
* Security First
* SEO Friendly
* Performance Optimized

All features must be designed as reusable modules and should not contain hardcoded business logic inside UI components.
