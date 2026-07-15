import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/lib/axiosInstance';
import { SEOHead } from '@/components/shared/SEOHead';
import { Star, Quote } from 'lucide-react';
import type { Testimonial } from '@/types';

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-3 w-3 ${i < rating ? 'fill-gold text-gold' : 'text-zinc-700'}`}
        />
      ))}
    </div>
  );
}

function TestimonialSkeleton() {
  return (
    <div className="border border-white/[0.06] bg-[#111111] p-5 animate-pulse space-y-3" style={{ borderRadius: '4px' }}>
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-zinc-800" />
        <div className="space-y-1.5">
          <div className="h-3 bg-zinc-800 rounded w-24" />
          <div className="h-2.5 bg-zinc-800 rounded w-16" />
        </div>
      </div>
      <div className="h-2.5 bg-zinc-800 rounded w-full" />
      <div className="h-2.5 bg-zinc-800 rounded w-4/5" />
    </div>
  );
}

export default function AdminTestimonialsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-testimonials'],
    queryFn: () => axiosInstance.get('/api/v1/testimonials').then(r => r.data.data as Testimonial[]),
  });

  return (
    <>
      <SEOHead title="Testimonials — Admin" noIndex />
      <div className="min-h-screen bg-[#0f0f0f]">

        {/* Page header */}
        <div className="border-b border-white/[0.06] bg-[#111111] px-6 py-5">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="block h-px w-5 bg-gold/50" />
            <span className="text-[10px] text-gold uppercase tracking-[0.2em] font-semibold">Content</span>
          </div>
          <div className="flex items-end justify-between">
            <h1 className="font-serif text-xl font-bold text-white tracking-widest uppercase">Testimonials</h1>
            {!isLoading && (
              <span className="text-[11px] text-zinc-600">{data?.length ?? 0} review{(data?.length ?? 0) !== 1 ? 's' : ''}</span>
            )}
          </div>
        </div>

        <div className="p-6">
          {isLoading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => <TestimonialSkeleton key={i} />)}
            </div>
          ) : (data ?? []).length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-zinc-700">
              <Star className="h-10 w-10 mb-3" />
              <p className="text-sm">No testimonials yet</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {(data ?? []).map(t => (
                <div
                  key={t._id}
                  className={`border border-white/[0.06] bg-[#111111] p-5 transition hover:border-white/[0.12] ${t.featured ? 'ring-1 ring-gold/15' : ''}`}
                  style={{ borderRadius: '4px' }}
                >
                  {t.featured && (
                    <div className="flex items-center gap-1 mb-3">
                      <Star className="h-3 w-3 fill-gold text-gold" />
                      <span className="text-[10px] text-gold uppercase tracking-[0.15em] font-semibold">Featured</span>
                    </div>
                  )}

                  {/* Customer */}
                  <div className="flex items-center gap-3 mb-4">
                    {t.image ? (
                      <img
                        src={t.image}
                        alt={t.customerName}
                        className="h-10 w-10 rounded-full object-cover border border-white/[0.08]"
                      />
                    ) : (
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.04] font-serif font-bold text-zinc-400 text-sm">
                        {t.customerName.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-white truncate">{t.customerName}</p>
                      {t.designation && <p className="text-[11px] text-zinc-600 truncate">{t.designation}</p>}
                    </div>
                    <div className="ml-auto shrink-0">
                      <StarRating rating={t.rating} />
                    </div>
                  </div>

                  {/* Review */}
                  <div className="relative">
                    <Quote className="absolute -top-1 -left-0.5 h-4 w-4 text-gold/20" />
                    <p className="text-xs text-zinc-400 leading-relaxed pl-4 line-clamp-4">{t.review}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
