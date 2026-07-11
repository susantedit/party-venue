import { useQuery } from '@tanstack/react-query';
import { motion, useReducedMotion } from 'framer-motion';
import axiosInstance from '@/lib/axiosInstance';
import type { Testimonial } from '@/types';

export function buildReviewSchema(reviews: Testimonial[]) {
  if (reviews.length === 0) return null;
  const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Shree Ganesh Party Venue & Catering Service',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: avg.toFixed(1),
      reviewCount: reviews.length,
      bestRating: '5',
      worstRating: '1',
    },
    review: reviews.slice(0, 5).map(r => ({
      '@type': 'Review',
      author: { '@type': 'Person', name: r.customerName },
      reviewRating: { '@type': 'Rating', ratingValue: r.rating },
      reviewBody: r.review,
    })),
  };
}

export function ReviewsSection() {
  const shouldReduceMotion = useReducedMotion();

  const { data: testimonials = [] } = useQuery({
    queryKey: ['featured-testimonials'],
    queryFn: () =>
      axiosInstance.get('/api/v1/testimonials', { params: { featured: 'true' } })
        .then(r => r.data.data as Testimonial[]),
    staleTime: 5 * 60 * 1000,
  });

  if (testimonials.length === 0) {
    // No DB reviews yet — show the Google Business Profile link so users can still read real reviews
    return (
      <section className="py-20 px-4 bg-[#0a0a0a] border-t border-gold/10">
        <div className="mx-auto max-w-6xl text-center">
          <div className="flex items-center justify-center gap-3 mb-1">
            <span className="block h-px w-10 bg-gradient-to-r from-transparent to-gold/60" />
            <span className="font-script text-gold text-2xl leading-none">What They Say</span>
            <span className="block h-px w-10 bg-gradient-to-l from-transparent to-gold/60" />
          </div>
          <h2 className="font-serif text-4xl font-bold text-white tracking-widest uppercase mt-2 mb-4">Our Guests</h2>
          <p className="font-sans text-zinc-400 italic mb-8">
            Read verified reviews from our customers on Google Maps.
          </p>
          <a href="https://www.google.com/maps/place/Shree+Ganesh+Party+Venue+And+Catering+Service/@27.6568609,85.4192105,17z"
            target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-serif tracking-[0.12em] uppercase text-xs px-8 py-3.5 bg-gold hover:bg-gold/90 text-zinc-950 font-semibold transition-all duration-150"
            style={{ borderRadius: '2px' }}>
            Read All Google Reviews
          </a>
        </div>
      </section>
    );
  }

  const avgRating = testimonials.reduce((s, t) => s + t.rating, 0) / testimonials.length;
  const schema = buildReviewSchema(testimonials);

  return (
    <section className="py-28 px-4 bg-[#0a0a0a] border-t border-gold/10">
      {schema && (
        <script type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      )}
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-14 gap-6">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="block h-px w-10 bg-gradient-to-r from-transparent to-gold/60" />
              <span className="font-script text-gold text-2xl leading-none">What They Say</span>
            </div>
            <h2 className="font-serif text-4xl font-bold text-white tracking-widest uppercase">Our Guests</h2>
            <p className="font-sans text-base italic text-zinc-400 mt-2">
              Real reviews from our Google Business Profile.
            </p>
          </div>

          {/* Aggregate score */}
          <div className="flex items-center gap-4 border border-gold/20 bg-[rgba(201,168,76,0.04)] px-6 py-4 shrink-0">
            <div className="text-center">
              <div className="font-serif text-5xl font-bold text-white leading-none">{avgRating.toFixed(1)}</div>
              <div className="text-gold text-lg mt-1">{'★'.repeat(Math.round(avgRating))}</div>
            </div>
            <div className="border-l border-gold/15 pl-4">
              <div className="flex items-center gap-1 text-sm mb-1">
                <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" aria-hidden="true">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                <span className="font-sans text-xs font-semibold text-zinc-300">Google Reviews</span>
              </div>
              <p className="font-sans text-xs text-zinc-500">See all reviews on Google</p>
            </div>
          </div>
        </div>

        {/* Review cards */}
        <div className="grid gap-px sm:grid-cols-2 lg:grid-cols-3 border border-gold/10">
          {testimonials.slice(0, 6).map((t, i) => (
            <motion.div key={t._id}
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: shouldReduceMotion ? 0 : i * 0.06, duration: 0.24, ease: [0.2, 0.8, 0.2, 1] }}
              className="p-7 bg-[rgba(255,255,255,0.02)] hover:bg-[rgba(201,168,76,0.04)] transition-colors duration-200 flex flex-col justify-between">
              <div>
                <div className="text-gold text-sm mb-4">
                  {'★'.repeat(t.rating)}{'☆'.repeat(5 - t.rating)}
                </div>
                <p className="font-sans text-zinc-300 leading-relaxed text-base italic mb-6">
                  "{t.review}"
                </p>
              </div>
              <div className="flex items-center gap-3 border-t border-gold/[0.08] pt-5">
                {t.image ? (
                  <img src={t.image} alt={t.customerName}
                    className="h-9 w-9 object-cover border border-gold/20 shrink-0" />
                ) : (
                  <div className="h-9 w-9 bg-gold/10 border border-gold/20 flex items-center justify-center text-gold font-serif font-bold text-xs shrink-0">
                    {t.customerName.charAt(0)}
                  </div>
                )}
                <div>
                  <p className="font-serif text-sm font-semibold text-white tracking-wide">{t.customerName}</p>
                  {t.designation && <p className="text-xs font-sans text-zinc-500">{t.designation}</p>}
                </div>
                <div className="ml-auto">
                  <span className="text-[10px] font-sans font-bold text-gold bg-gold/10 px-2 py-0.5">G</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a href="https://www.google.com/maps/place/Shree+Ganesh+Party+Venue+And+Catering+Service/@27.6568609,85.4192105,17z"
            target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-serif tracking-[0.12em] uppercase text-xs px-7 py-3 border border-gold/40 hover:border-gold text-gold hover:bg-gold/5 transition-all duration-150"
            style={{ borderRadius: '2px' }}>
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 shrink-0" aria-hidden="true">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            View All Google Reviews
          </a>
          <a href="https://www.google.com/maps/place/Shree+Ganesh+Party+Venue+And+Catering+Service/@27.6568609,85.4192105,17z"
            target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-serif tracking-[0.12em] uppercase text-xs px-7 py-3 bg-gold hover:bg-gold/90 text-zinc-950 font-semibold transition-all duration-150"
            style={{ borderRadius: '2px' }}>
            ✏ Write a Review
          </a>
        </div>
      </div>
    </section>
  );
}
