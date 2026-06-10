import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/lib/axiosInstance';
import { SEOHead } from '@/components/shared/SEOHead';
import type { Package } from '@/types';

export default function AdminPackagesPage() {
  const { data } = useQuery({
    queryKey: ['admin-packages'],
    queryFn: () => axiosInstance.get('/api/v1/packages').then(r => r.data.data as Package[]),
  });

  return (
    <>
      <SEOHead title="Packages" noIndex />
      <div className="min-h-screen bg-gray-50 p-6">
        <h1 className="mb-4 font-serif text-2xl font-bold text-charcoal">Packages</h1>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data?.map(pkg => (
            <div key={pkg._id} className="rounded-xl bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <h3 className="font-semibold text-charcoal">{pkg.name}</h3>
                {pkg.isPopular && <span className="rounded-full bg-gold-100 px-2 py-0.5 text-xs font-medium text-gold-700">Popular</span>}
              </div>
              <p className="mt-1 text-sm text-gray-500">{pkg.description}</p>
              <p className="mt-2 text-lg font-bold text-gold-600">NPR {pkg.price.toLocaleString()}</p>
              <p className="text-sm text-gray-500">Capacity: {pkg.capacity} guests</p>
              <span className={`mt-2 inline-block rounded-full px-2 py-0.5 text-xs ${pkg.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {pkg.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
