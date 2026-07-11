import { motion, useReducedMotion } from 'framer-motion';

// ── Hardcoded real Google reviews — no API key needed ──────────────────────
const REVIEWS = [
  {
    author: 'Kishore Pariyar',
    badge: 'Local Guide · 8 reviews',
    rating: 5,
    relativeTime: '2 years ago',
    text: 'Great service. Good communication. Owner is very humble.',
  },
  {
    author: 'Suresh Rai',
    badge: '5 reviews',
    rating: 5,
    relativeTime: '10 months ago',
    text: 'Feeling Good',
  },
  {
    author: 'Nandan Rajthala',
    badge: '1 review',
    rating: 5,
    relativeTime: '8 months ago',
    text: 'Awesome',
  },
];

// Correct Google Maps listing URL
const PLACE_URL =
  'https://www.google.com/maps?ll=27.658006,85.416876&z=15&t=m&hl=en&gl=NP&mapclient=embed&cid=9132187741546059157';

// Direct write-review URL for the place
const WRITE_REVIEW_URL = PLACE_URL;

function GoogleG({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

function StarRow({ rating }: { rating: number }) {
  return (
    <span aria-label={`${rating} out of 5 stars`} className="text-base">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={i < rating ? 'text-yellow-400' : 'text-zinc-700'}>★</span>
      ))}
    </span>
  );
}

export function GoogleReviews() {
  const shouldReduceMotion = useReducedMotion();

  const enter = (i: number) => ({
    initial: { opacity: 0, y: shouldReduceMotion ? 0 : 14 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { delay: shouldReduceMotion ? 0 : i * 0.08, duration: 0.24, ease: [0.2, 0.8, 0.2, 1] as [number,number,number,number] },
  });

  return (
    <section className="py-20 px-4 bg-[#0a0a0a] border-t border-gold/10">
      <div className="mx-auto max-w-6xl">

        {/* Section header */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-1">
            <span className="block h-px w-14 bg-gradient-to-r from-transparent to-gold/60" aria-hidden="true" />
            <span className="font-script text-gold text-2xl leading-none">What They Say</span>
            <span className="block h-px w-14 bg-gradient-to-l from-transparent to-gold/60" aria-hidden="true" />
          </div>
          <h2 className="font-serif text-4xl font-bold text-white tracking-widest uppercase mt-2">
            Google Reviews
          </h2>
          <p className="mt-3 font-sans text-base italic text-zinc-400 max-w-lg mx-auto">
            Real verified reviews from our customers on Google Maps.
          </p>
        </div>

        {/* Aggregate badge */}
        <div className="flex items-center justify-center mb-10">
          <div className="flex items-center gap-3 border border-gold/20 bg-[rgba(201,168,76,0.04)] px-6 py-4">
            <GoogleG className="h-7 w-7" />
            <div>
              <span className="font-serif text-4xl font-bold text-white leading-none">5.0</span>
              <div className="mt-0.5"><StarRow rating={5} /></div>
              <p className="font-sans text-xs text-zinc-500 mt-0.5">Based on Google reviews</p>
            </div>
          </div>
        </div>

        {/* Review cards */}
        <div className="grid gap-px sm:grid-cols-2 lg:grid-cols-3 border border-gold/10">
          {REVIEWS.map((review, i) => (
            <motion.div
              key={review.author}
              {...enter(i)}
              className="p-6 bg-[rgba(255,255,255,0.02)] hover:bg-[rgba(201,168,76,0.04)] transition-colors duration-200 flex flex-col gap-4"
            >
              {/* Author row */}
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center font-serif font-bold text-gold text-sm shrink-0">
                  {review.author.charAt(0)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-serif text-sm font-semibold text-white tracking-wide truncate">
                    {review.author}
                  </p>
                  <p className="text-xs font-sans text-zinc-500">{review.badge}</p>
                  <p className="text-xs font-sans text-zinc-600">{review.relativeTime}</p>
                </div>
                <GoogleG className="h-4 w-4 shrink-0 mt-0.5" />
              </div>

              {/* Stars */}
              <StarRow rating={review.rating} />

              {/* Review text */}
              <p className="font-sans text-sm text-zinc-300 leading-relaxed italic flex-1">
                "{review.text}"
              </p>
            </motion.div>
          ))}
        </div>

        {/* CTAs */}
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <a
            href={PLACE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-serif tracking-[0.12em] uppercase text-xs px-7 py-3 border border-gold/40 hover:border-gold text-gold hover:bg-gold/5 transition-all duration-150"
            style={{ borderRadius: '2px' }}
          >
            <GoogleG className="h-3.5 w-3.5 shrink-0" />
            View All Reviews on Google
          </a>
          <a
            href={WRITE_REVIEW_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-serif tracking-[0.12em] uppercase text-xs px-7 py-3 bg-gold hover:bg-gold/90 text-zinc-950 font-semibold transition-all duration-150"
            style={{ borderRadius: '2px' }}
          >
            ✏ Write a Review
          </a>
        </div>

      </div>
    </section>
  );
}
