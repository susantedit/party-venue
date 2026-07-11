# Shree Ganesh Party Venue & Catering Service Design System

## Mission

Create a premium, conversion-focused, implementation-ready design system that helps visitors quickly discover venue information, explore services, build trust, and submit booking inquiries.

The design must communicate luxury, reliability, celebration, and professionalism while maintaining fast performance and accessibility.

---

# Brand

Product: Shree Ganesh Party Venue & Catering Service

Audience:

* Wedding planners
* Families
* Corporate clients
* Event organizers
* Catering customers

Surface:

* Marketing Website
* Booking Portal
* Admin Dashboard

---

# Design Intent

The website must feel like a premium event venue and catering company rather than a traditional local business website.

Design should prioritize:

* Trust
* Elegance
* Hospitality
* Luxury
* Conversion

---

# Foundations

## Typography

Primary Font:

DM Sans

Secondary Font:

Playfair Display

### Scale

xs = 12px

sm = 14px

md = 16px

lg = 18px

xl = 20px

2xl = 24px

3xl = 32px

4xl = 48px

5xl = 64px

---

# Colors

## Primary

Gold

#C9A227

## Secondary

Dark Charcoal

#111827

## Background

#FFFFFF

## Surface

#F8F5EE

## Accent

#8B0000

## Success

#22C55E

## Warning

#F59E0B

## Error

#EF4444

---

# Border Radius

Small = 8px

Medium = 16px

Large = 24px

Extra Large = 40px

---

# Shadows

Card Shadow

0 10px 30px rgba(0,0,0,0.08)

Elevated Shadow

0 20px 60px rgba(0,0,0,0.12)

---

# Motion

Fast = 150ms

Normal = 300ms

Slow = 600ms

---

# Layout System

Container

Max Width = 1280px

Content Width = 720px

Grid = 12 Columns

Section Padding:

Desktop = 120px

Tablet = 80px

Mobile = 60px

---

# Components

## Buttons

Variants:

### Primary

Gold Background

White Text

Used for:

* Book Venue
* Get Quote
* Contact Us

States:

Default

Hover

Focus Visible

Active

Disabled

Loading

Error

---

### Secondary

Dark Background

Light Text

---

### Outline

Transparent Background

Border Only

---

## Navigation

Desktop:

* Sticky Header
* Transparent to Solid Scroll Transition

Mobile:

* Fullscreen Menu

Required Items:

Home

About

Services

Gallery

Packages

Blog

Contact

Book Now

---

## Hero Section

Must Include:

* Venue Image or Video
* Headline
* CTA Buttons
* Quick Contact

Height:

100vh Desktop

80vh Mobile

---

## Service Cards

Display:

* Icon
* Title
* Description
* CTA

Hover:

Lift Animation

Shadow Increase

---

## Gallery

Must Support:

* Masonry Grid
* Lightbox
* Category Filters

Categories:

Wedding

Reception

Birthday

Pasni

Bratabandha

Corporate

Food

Decoration

---

## Package Cards

Must Display:

* Package Name
* Price
* Capacity
* Features
* CTA

Recommended Packages:

Silver

Gold

Platinum

Custom

---

## Testimonials

Display:

* Client Photo
* Rating
* Message

Support:

* Google Reviews
* Video Reviews

---

## Booking Form

Fields:

Name

Phone

Email

Event Type

Date

Guest Count

Package

Notes

Validation Required

---

## Contact Section

Must Include:

* Phone
* Email
* Address
* Google Map
* WhatsApp Button

---

# Responsive Rules

Desktop

1440+

Laptop

1024+

Tablet

768+

Mobile

320+

No horizontal scrolling allowed.

---

# Accessibility

Target:

WCAG 2.2 AA

Requirements:

* Keyboard navigation
* Visible focus states
* Proper form labels
* Semantic HTML
* Screen reader compatibility
* Contrast ratio above 4.5:1

---

# Content Standards

Headlines:

Short and benefit-driven

Example:

"Create Unforgettable Celebrations"

Good CTA:

"Book Your Event"

Bad CTA:

"Click Here"

---

# Anti Patterns

Do Not:

* Use stock wedding photos only
* Overload pages with animations
* Use auto-playing audio
* Hide booking buttons
* Use multiple accent colors
* Create cluttered galleries

---

# SEO Requirements

Schema Markup

Local Business Schema

Open Graph

Meta Tags

Canonical URLs

XML Sitemap

Robots.txt

Google Business Integration

---

# Performance

Lighthouse Score > 90

Lazy Loading

Optimized Images

WebP Support

Code Splitting

Caching

---

# QA Checklist

✓ Mobile Responsive

✓ Booking Form Working

✓ Gallery Filters Working

✓ Contact Form Working

✓ SEO Metadata Added

✓ Accessibility Validated

✓ Lighthouse Above 90

✓ Fast Page Load

✓ Cross Browser Tested

✓ WhatsApp Integration Working

✓ Google Maps Embedded

✓ Admin Dashboard Connected

---

# Queens-Palace-Inspired Design System (v2 — Implemented July 2026)

## Reference
Inspired by queenspalaceevents.com — partySewa platform design language.

## Typography (3-Font System)

| Role | Font | Usage |
|---|---|---|
| Display / Heading | **Cinzel** (serif) | h1–h6, nav links, buttons, section titles. All-caps roman. `tracking-widest` |
| Body / Description | **Cormorant Garamond** (sans in Tailwind) | Paragraphs, card descriptions, form labels. Elegant editorial serif |
| Script Accent | **Great Vibes** (script) | Decorative label above section titles: "Welcome to", "What We Offer", etc |

### Google Fonts import (in index.html)
```
Cinzel:wght@400;500;600;700
Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500
Great+Vibes
```

### Tailwind config
```ts
fontFamily: {
  sans: ['"Cormorant Garamond"', 'Georgia', 'serif'],
  serif: ['Cinzel', 'serif'],
  script: ['"Great Vibes"', 'cursive'],
}
```

---

## Color Palette

| Token | Hex | Notes |
|---|---|---|
| Background | `#0a0a0a` | Warmer near-black than zinc-950 |
| Gold | `#c9a84c` | Primary brand gold — brighter than old `#C9A227` |
| Gold hover | `#d9b84f` | Button hover state |
| Card surface | `rgba(255,255,255,0.02)` | Almost invisible tint |
| Card hover | `rgba(201,168,76,0.04)` | Warm gold tint on hover |
| Border default | `rgba(201,168,76,0.10–0.15)` | Subtle gold borders |
| Border hover | `rgba(201,168,76,0.40)` | Gold border on hover |
| Divider | 1px `border-gold/10` | Section separators |

---

## Section Header Pattern (Mandatory for all sections)

3-layer stack:
1. **Great Vibes** gold script: contextual label ("Welcome to", "What We Offer")
2. **Thin gold horizontal rules** (60px wide, gradient fade) flanking the script
3. **Cinzel** uppercase: the section title (large, `tracking-widest`)
4. **Cormorant Garamond** italic: subtitle/description

```tsx
<div className="flex items-center justify-center gap-3 mb-1">
  <span className="block h-px w-14 bg-gradient-to-r from-transparent to-gold/60" />
  <span className="font-script text-gold text-2xl leading-none">{script}</span>
  <span className="block h-px w-14 bg-gradient-to-l from-transparent to-gold/60" />
</div>
<h2 className="font-serif text-4xl font-bold text-white tracking-widest uppercase mt-2">{title}</h2>
<p className="mt-4 font-sans text-lg italic text-zinc-400 max-w-xl mx-auto">{subtitle}</p>
```

---

## Button System

| Variant | Classes |
|---|---|
| Primary | `font-serif tracking-[0.14em] uppercase text-sm px-8 py-3.5 bg-gold hover:bg-gold/90 text-zinc-950 font-semibold` + `border-radius: 2px` |
| Outline | `font-serif tracking-[0.14em] uppercase text-sm px-8 py-3.5 border border-gold/50 hover:border-gold hover:bg-gold/5 text-gold` + `border-radius: 2px` |

**Critical**: Border-radius is `2px` (nearly square) — NOT `rounded-lg`. More formal/regal.

---

## Card Pattern

```
border border-gold/10 (default)
bg-[rgba(255,255,255,0.02)]
hover:bg-[rgba(201,168,76,0.04)]
hover:border-gold/40
transition-colors duration-200
```

No backdrop-blur on cards. Keep it clean.

---

## Grid Layout

Use `gap-px` + `border border-gold/10` on the container to create a connected grid with thin gold separator lines between cells — matches partySewa platform aesthetic.

---

## Shift-Based Availability (Booking)

The booking form includes a **Shift** selector:
- Morning (6 AM – 2 PM)
- Evening (3 PM – 11 PM)
- Whole Day (6 AM – 11 PM) — blocks both shifts

Backend enforces a partial unique index: `{ eventDate, shift }` where status is `pending` or `confirmed`, preventing double-booking.

---

## Pages Redesigned (v2)

- `Home.tsx` — Full redesign: hero with Great Vibes + Cinzel, video CTA section (split-screen meatmaking + vegies), stats, services, gallery, reviews, Google Maps, FAQs
- `Packages.tsx` — Cinzel card grid + call-for-discount disclaimer banner
- `Contact.tsx` — Info panel + form + full-width Google Maps iframe
- `Booking.tsx` — Clean form wrapper with disclaimer
- `BookingForm.tsx` — Added shift selector (Morning/Evening/Whole Day)
- `MenuPage.tsx` — Tab-based category filter with connected grid
- `Header.tsx` — Cinzel nav links, Great Vibes script subtitle in logo
- `Footer.tsx` — Clean 4-col layout with WhatsApp link
- `ReviewsSection.tsx` — Google aggregate score + card grid + review/write-review CTAs
