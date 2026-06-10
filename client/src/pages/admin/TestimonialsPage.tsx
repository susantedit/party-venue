import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/lib/axiosInstance';
import { SEOHead } from '@/components/shared/SEOHead';
import type { Testimonial } from '@/types';

export default function AdminTestimonialsPage() {
  const { data } = useQuery({
    queryKey: ['admin-testimonials'],
    queryFn: () => axiosInstance.get('/api/v1/testimonials').then(r => r.data.data as Testimonial[]),
  });

  return (
    <>
      <SEOHead title="Testimonials" noIndex />
      <div className="min-h-screen bg-gray-50 p-6">
        <h1 className="mb-4 font-serif text-2xl font-bold text-charcoal">Testimonials</h1>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data?.map(t => (
            <div key={t._id} className="rounded-xl bg-white p-4 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                {t.image && <img src={t.image} alt={t.customerName} className="h-10 w-10 rounded-full object-cover" />}
                <div>
                  <p className="font-medium text-sm">{t.customerName}</p>
                  <p className="text-xs text-gray-400">{t.designation}</p>
                </div>
                <div className="ml-auto flex text-gold-500">
                  {'★'.repeat(t.rating)}{'☆'.repeat(5 - t.rating)}
                </div>
              </div>
              <p className="text-sm text-gray-600">{t.review}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
