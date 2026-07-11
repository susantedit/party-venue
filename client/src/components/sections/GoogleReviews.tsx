import { useQuery } from '@tanstack/react-query';
import { motion, useReducedMotion } from 'framer-motion';
import axiosInstance from '@/lib/axiosInstance';

interface GoogleReview {
  author: string;
  photo: string;
  rating: number;
  relativeTime: string;
  text: string;
}

interface GoogleReviewsData {
  rating: number;
  userRatingsTotal: number;
  reviews: GoogleReview[];
  placeUrl: string;
}

const GOOGLE_PLACE_URL =
  'https://www.google.com/maps/place/Shree+Ganesh+Party+Venue+And+Catering+Service/@27.6568609,85.4192105,17z';

const WRITE_REVIEW_URL =
  'https://search.google.com/local/writereview?placeid=ChIJNd9nIgwR6zkRlZUH1V0MvH4';

const MAPS_EMBED_URL =
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3534.1635!2d85.4192105!3d27.6568609!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb110c2267df35%3A0x7ebc0c5dd5079595!2sShree%20Ganesh%20Party%20Venue%20And%20Catering%20Service!5e0!3m2!1sen!2snp!4v1690000000000!5m2!1sen!2snp';

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
    <span aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={i < rating ? 'text-yellow-400' : 'text-zinc-700'}>★</span>
      ))}
    </span>
  );
}

function ReviewSkeleton() {
  return (
    <div className="p-6 bg-[rgba(255,255,255,0.02)] animate-pulse space-y-3">
      <div className="flex gap-3">
        <div className="h-10 w-10 rounded-full bg-zinc-800 shrink-0" />
        <div className="flex-1 space-y-1.5 pt-1">
          <div className="h-3 bg-zinc-800 rounded w-1/2" />
          <div className="h-2.5 bg-zinc-800 rounded w-1/3" />
        </div>
      </div>
      <div className="h-2.5 bg-zinc-800 rounded w-1/4" />
      <div className="h-2.5 bg-zinc-800 rounded" />
      <div className="h-2.5 bg-zinc-800 rounded w-5/6" />
      <div className="h-2.5 bg-zinc-800 rounded w-4/6" />
    </div>
  );
}

export function GoogleReviews() {
  const shouldReduceMotion = useReducedMotion();

  const { data, isLoading, isError } = useQuery<GoogleReviewsData>({
    queryKey: ['google-reviews'],
    queryFn: () =>
      axiosInstance.get('/api/v1/google-reviews').then((r) => r.data.data),
    staleTime: 10 * 60 * 1000,
    retry: 1,
  });

  return (
    <section className="py-20 px-4 bg-[#0a0a0a] border-t border-gold/10">
      <div className="mx-auto max-w-6xl">

        {/* Section header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-1">
            <span className="block h-px w-14 bg-gradient-to-r from-transparent to-gold/60" />
            <span className="font-script text-gold text-2xl leading-none">What They Say</span>
            <span className="block h-px w-14 bg-gradient-to-l from-transparent to-gold/60" />
          </div>
          <h2 className="font-serif text-4xl font-bold text-white tracking-widest uppercase mt-2">
            Google Reviews
          </h2>
          <p className="mt-3 font-sans text-base italic text-zinc-400 max-w-lg mx-auto">
            Real verified reviews from our customers on Google Maps.
          </p>
        </div>

        {/* Aggregate badge — shown when data loaded */}
        {data && (
          <div className="flex items-center justify-center gap-4 mb-10">
            <div className="flex items-center gap-3 border border-gold/20 bg-[rgba(201,168,76,0.04)] px-6 py-4">
              <GoogleG className="h-7 w-7" />
              <div>
                <span className="font-serif text-4xl font-bold text-white leading-none">
                  {data.rating.toFixed(1)}
                </span>
                <div className="text-lg mt-0.5">
                  <StarRow rating={Math.round(data.rating)} />
                </div>
                <p className="font-sans text-xs text-zinc-500 mt-0.5">
                  Based on {data.userRatingsTotal}+ Google reviews
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Loading */}
        {isLoading && (
          <div className="grid gap-px sm:grid-cols-2 lg:grid-cols-3 border border-gold/10">
            {Array.from({ length: 3 }).map((_, i) => <ReviewSkeleton key={i} />)}
          </div>
        )}

        {/* Error / not configured fallback */}
        {isError && !isLoading && (
          <div className="border border-gold/10 bg-[rgba(255,255,255,0.02)] p-10 text-center">
            <GoogleG className="h-8 w-8 mx-auto mb-4" />
            <p className="font-sans text-zinc-400 italic mb-6">
              Read what our guests are saying on Google Maps.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href={GOOGLE_PLACE_URL} target="_blank" rel="noopener noreferrer"
                className="inline-block font-serif tracking-[0.14em] uppercase text-xs px-7 py-3 border border-gold/40 hover:border-gold text-gold hover:bg-gold/5 transition-all duration-150"
                style={{ borderRadius: '2px' }}>
                View All Reviews on Google
              </a>
              <a href={WRITE_REVIEW_URL} target="_blank" rel="noopener noreferrer"
                className="inline-block font-serif tracking-[0.14em] uppercase text-xs px-7 py-3 bg-gold hover:bg-gold/90 text-zinc-950 font-semibold transition-all duration-150"
                style={{ borderRadius: '2px' }}>
                ✏ Write a Review
              </a>
            </div>
            {/* Fallback: show the map embed so the page isn't empty */}
            <div className="mt-8 h-64 border border-gold/10 overflow-hidden">
              <iframe title="Shree Ganesh Party Venue" src={MAPS_EMBED_URL}
                className="w-full h-full border-0" allowFullScreen loading="lazy"
                referrerPolicy="no-referrer-when-downgrade" />
            </div>
          </div>
        )}

        {/* Live review cards */}
        {!isLoading && !isError && data && data.reviews.length > 0 && (
          <>
            <div className="grid gap-px sm:grid-cols-2 lg:grid-cols-3 border border-gold/10">
              {data.reviews.map((review, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: shouldReduceMotion ? 0 : i * 0.07, duration: 0.24, ease: [0.2, 0.8, 0.2, 1] }}
                  className="p-6 bg-[rgba(255,255,255,0.02)] hover:bg-[rgba(201,168,76,0.04)] transition-colors duration-200 flex flex-col gap-4">

                  {/* Author */}
                  <div className="flex items-start gap-3">
                    {review.photo ? (
                      <img src={review.photo} alt={review.author} loading="lazy"
                        className="h-10 w-10 rounded-full border border-gold/15 shrink-0 object-cover"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center font-serif font-bold text-gold text-sm shrink-0">
                        {review.author.charAt(0)}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="font-serif text-sm font-semibold text-white tracking-wide truncate">
                        {review.author}
                      </p>
                      <p className="text-xs font-sans text-zinc-500">{review.relativeTime}</p>
                    </div>
                    <GoogleG className="h-4 w-4 shrink-0 mt-0.5" />
                  </div>

                  {/* Stars */}
                  <div className="text-base"><StarRow rating={review.rating} /></div>

                  {/* Text */}
                  <p className="font-sans text-sm text-zinc-300 leading-relaxed italic line-clamp-4 flex-1">
                    "{review.text}"
                  </p>
                </motion.div>
              ))}
            </div>

            {/* CTAs */}
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <a href={GOOGLE_PLACE_URL} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-serif tracking-[0.12em] uppercase text-xs px-7 py-3 border border-gold/40 hover:border-gold text-gold hover:bg-gold/5 transition-all duration-150"
                style={{ borderRadius: '2px' }}>
                <GoogleG className="h-3.5 w-3.5 shrink-0" />
                See All {data.userRatingsTotal}+ Reviews
              </a>
              <a href={WRITE_REVIEW_URL} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-serif tracking-[0.12em] uppercase text-xs px-7 py-3 bg-gold hover:bg-gold/90 text-zinc-950 font-semibold transition-all duration-150"
                style={{ borderRadius: '2px' }}>
                ✏ Write a Review
              </a>
            </div>
          </>
        )}

      </div>
    </section>
  );
}
