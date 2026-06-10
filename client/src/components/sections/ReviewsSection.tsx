import { useQuery } from '@tanstack/react-query';
import { motion, useReducedMotion } from 'framer-motion';
import axiosInstance from '@/lib/axiosInstance';
import type { Testimonial } from '@/types';

// AggregateRating + Review JSON-LD schema helper
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

  if (testimonials.length === 0) return null;

  const avgRating = testimonials.reduce((s, t) => s + t.rating, 0) / testimonials.length;
  const schema = buildReviewSchema(testimonials);

  return (
    <section className="py-24 px-4 bg-zinc-950 border-t border-white/5">
      {schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      )}
      <div className="mx-auto max-w-6xl">
        {/* Header + rating summary */}
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl font-bold text-white mb-4">What Our Customers Say</h2>
          <div className="flex items-center justify-center gap-3">
            <div className="flex text-gold text-lg">
              {'★'.repeat(Math.round(avgRating))}{'☆'.repeat(5 - Math.round(avgRating))}
            </div>
            <span className="text-lg font-bold text-white">{avgRating.toFixed(1)}</span>
            <span className="text-zinc-400 text-sm">({testimonials.length} reviews)</span>
          </div>
        </div>

        {/* Review cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.slice(0, 6).map((t, i) => (
            <motion.div
              key={t._id}
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ 
                delay: shouldReduceMotion ? 0 : i * 0.04, 
                duration: 0.22, 
                ease: [0.2, 0.8, 0.2, 1] 
              }}
              whileHover={{ y: shouldReduceMotion ? 0 : -2 }}
              className="rounded-xl bg-zinc-900/30 p-6 border border-white/5 hover:border-gold/30 hover:shadow-[0_0_20px_rgba(201,162,39,0.03)] transition-all duration-140 flex flex-col justify-between"
            >
              <div>
                {/* Stars */}
                <div className="flex text-gold mb-3 text-sm">
                  {'★'.repeat(t.rating)}{'☆'.repeat(5 - t.rating)}
                </div>

                {/* Review text */}
                <p className="text-sm text-zinc-300 leading-relaxed mb-6 italic">"{t.review}"</p>
              </div>

              {/* Author */}
              <div className="flex items-center gap-3 border-t border-white/5 pt-4">
                {t.image ? (
                  <img src={t.image} alt={t.customerName}
                    className="h-9 w-9 rounded-full object-cover border border-white/10" />
                ) : (
                  <div className="h-9 w-9 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center text-gold font-bold text-xs">
                    {t.customerName.charAt(0)}
                  </div>
                )}
                <div>
                  <p className="font-semibold text-sm text-white">{t.customerName}</p>
                  {t.designation && (
                    <p className="text-xs text-zinc-400">{t.designation}</p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Google Reviews CTA */}
        <div className="mt-12 text-center">
          <a
            href="https://g.page/r/shreeganeshsharma/review"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-gold/40 hover:border-gold hover:bg-gold/5 px-6 py-2.5 text-sm font-medium text-gold transition-all duration-120 ease-out focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-zinc-950"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Write a Review on Google
          </a>
        </div>
      </div>
    </section>
  );
}
