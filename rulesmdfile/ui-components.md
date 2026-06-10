# UI Components Specification

## Project Name

Shree Ganesh Party Venue & Catering Service

---

# Purpose

Define all reusable UI components used throughout the website and admin dashboard.

Goals:

* Consistency
* Reusability
* Accessibility
* Scalability
* Mobile First Design

Every component must support:

* Default State
* Hover State
* Focus State
* Active State
* Disabled State
* Loading State
* Error State

---

# Design Tokens

Typography:

* DM Sans (Primary)
* Playfair Display (Headings)

Spacing Scale:

* 4px
* 8px
* 12px
* 16px
* 24px
* 32px
* 48px
* 64px

Border Radius:

* 8px
* 16px
* 24px

Animation:

* 150ms
* 300ms
* 600ms

---

# Buttons

## Primary Button

Purpose:

Primary conversion action.

Examples:

* Book Venue
* Get Quote
* Contact Us

Props:

```ts
interface ButtonProps {
  children: ReactNode;
  variant: "primary";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  disabled?: boolean;
}
```

States:

Default

Hover

Focus

Loading

Disabled

---

## Secondary Button

Purpose:

Secondary actions.

Examples:

* Learn More
* View Gallery

---

## Outline Button

Purpose:

Alternative CTA.

Examples:

* View Packages
* Explore Services

---

# Navigation

## Header

Components:

* Logo
* Nav Links
* CTA Button
* Mobile Menu

Features:

* Sticky
* Responsive
* Scroll Effects

---

## Mobile Navigation

Behavior:

Hamburger Menu

Fullscreen Drawer

Close On Navigation

---

# Hero Components

## Hero Section

Elements:

* Background Image/Video
* Heading
* Description
* CTA Buttons
* Trust Badges

Responsive:

Desktop

Tablet

Mobile

---

# Cards

## Service Card

Displays:

* Icon
* Title
* Description
* CTA

Hover:

Lift Animation

Shadow Increase

---

## Package Card

Displays:

* Package Name
* Price
* Features
* Capacity
* CTA

Supports:

* Popular Badge
* Featured Package

---

## Testimonial Card

Displays:

* Customer Name
* Photo
* Rating
* Review

Supports:

* Video Testimonial

---

## Gallery Card

Displays:

* Image
* Category
* Title

Supports:

* Lightbox

---

# Forms

## Booking Form

Fields:

* Name
* Phone
* Email
* Event Type
* Event Date
* Guest Count
* Package
* Notes

Validation:

Required Fields

Real-Time Errors

Success State

---

## Contact Form

Fields:

* Name
* Email
* Phone
* Message

Validation Required

---

## Newsletter Form

Fields:

* Email

Simple Validation

---

# Inputs

## Text Input

Variants:

* Default
* Error
* Disabled

Features:

* Label
* Helper Text
* Error Message

---

## Select Input

Use For:

* Event Type
* Package Selection

---

## Date Picker

Use For:

* Booking Date

Must:

* Disable Past Dates
* Support Availability Checking

---

## Textarea

Use For:

* Notes
* Messages

Supports:

Character Limits

---

# Gallery Components

## Gallery Grid

Features:

* Responsive Masonry Layout
* Lazy Loading
* Infinite Scroll

---

## Gallery Filter

Filters:

* Wedding
* Reception
* Birthday
* Catering
* Decoration

---

## Lightbox

Features:

* Zoom
* Keyboard Navigation
* Swipe Support

---

# Pricing Components

## Pricing Grid

Displays:

* Silver
* Gold
* Platinum
* Custom

Supports:

* Popular Package Highlight

---

# Testimonials Components

## Review Slider

Features:

* Auto Scroll
* Manual Navigation

Accessibility:

Pause On Hover

---

# Blog Components

## Blog Card

Displays:

* Featured Image
* Title
* Excerpt
* Category

---

## Blog List

Supports:

* Search
* Category Filter
* Pagination

---

# Contact Components

## Contact Information Card

Displays:

* Phone
* Email
* Address

---

## Map Component

Displays:

Embedded Google Map

Responsive

---

## WhatsApp Floating Button

Features:

Always Visible

Mobile Friendly

---

# Dashboard Components

## Dashboard Stats Card

Displays:

* Total Bookings
* Revenue
* Inquiries
* Packages

---

## Data Table

Supports:

* Search
* Sort
* Pagination
* Filters

---

## Modal

Use Cases:

* Delete Confirmation
* Edit Forms
* Quick View

Accessibility:

Focus Trap

Escape Close

---

## Drawer

Use Cases:

* Mobile Navigation
* Quick Booking Details

---

# Feedback Components

## Toast Notifications

Types:

* Success
* Error
* Warning
* Info

---

## Loading Spinner

Variants:

* Small
* Medium
* Large

---

## Skeleton Loader

Use During:

* API Requests
* Page Loading

---

# Empty States

## No Bookings

Message:

"No bookings found."

Action:

"Create Booking"

---

## No Gallery Images

Message:

"No gallery items available."

---

## No Blogs

Message:

"No articles available."

---

# Accessibility Rules

All Components Must:

* Support keyboard navigation
* Have visible focus states
* Use semantic HTML
* Include ARIA labels where necessary
* Meet WCAG 2.2 AA

---

# Responsive Rules

Mobile:

320px+

Tablet:

768px+

Desktop:

1024px+

Large Desktop:

1440px+

Components must never overflow viewport width.

---

# Animation Guidelines

Use Framer Motion.

Allowed:

* Fade
* Slide
* Scale
* Stagger

Avoid:

* Excessive motion
* Flashing effects
* Continuous animations

---

# Performance Rules

Must:

* Lazy Load Images
* Lazy Load Routes
* Optimize Assets
* Minimize Re-renders

---

# Component Naming Convention

Buttons:

Button.tsx

Forms:

BookingForm.tsx

Cards:

ServiceCard.tsx

Sections:

HeroSection.tsx

Layout:

Header.tsx

Dashboard:

DashboardStatsCard.tsx

Use PascalCase for all React components.

---

# Component Development Principles

Every component must be:

* Reusable
* Accessible
* Responsive
* Typed with TypeScript
* Fully documented
* Easily maintainable

Components should never contain business logic.

Business logic must remain inside hooks, services, or state management layers.
