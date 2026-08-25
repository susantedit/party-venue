# Schema & Structured Data Specialist Analysis (`/seo-schema`)

## 1. Implemented Schema Inventory

| Page | Schema Type | Status | Context |
|---|---|---|---|
| `index.html` | `@type: Organization` | **PASS** | Brand identity, phone, logo, social links |
| `index.html` | `@type: WebSite` | **PASS** | Site search potentialAction graph |
| `Home.tsx` | `@type: EventVenue` | **PASS** | GeoCoordinates, address, areaServed |
| `WeddingVenuePage.tsx` | `@type: EventVenue` | **PASS** | Specialized wedding venue schema |
| `CateringPage.tsx` | `@type: CateringService` | **PASS** | Service offering graph |

## 2. 2026 Policy Update Alert: FAQ Schema
> [!IMPORTANT]  
> Google retired FAQ rich results for all websites globally on May 7, 2026. `FAQPage` schema no longer produces collapsible rich accordion snippets on Google Search results.  
> Existing `FAQPage` schema on `FAQPage.tsx` and `FAQSection.tsx` should be retained for AI search engine (GEO) consumption, but should NOT be relied upon for Google SERP rich feature gains.

## 3. Schema Recommendations
1. **Dual Schema Graph on Homepage:** Combine `@type: EventVenue` and `@type: CateringService` using `@graph` notation.
2. **AggregateRating Integration:** When client testimonial/review data is rendered, append structured `aggregateRating` to the venue graph:
   ```json
   "aggregateRating": {
     "@type": "AggregateRating",
     "ratingValue": "4.8",
     "reviewCount": "45"
   }
   ```
