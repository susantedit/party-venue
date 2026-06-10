import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/lib/axiosInstance';
import { SEOHead } from '@/components/shared/SEOHead';
import { SkeletonLoader } from '@/components/shared/SkeletonLoader';

export default function DashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => axiosInstance.get('/api/v1/dashboard/overview').then(r => r.data.data),
  });

  const stats = [
    { label: 'Total Bookings', value: data?.totalBookings ?? 0 },
    { label: 'Pending', value: data?.pendingBookings ?? 0 },
    { label: 'Confirmed', value: data?.confirmedBookings ?? 0 },
    { label: 'Inquiries', value: data?.totalInquiries ?? 0 },
    { label: 'Packages', value: data?.totalPackages ?? 0 },
    { label: 'Blogs', value: data?.totalBlogs ?? 0 },
    { label: 'Revenue (NPR)', value: data?.revenueEstimate?.toLocaleString() ?? 0 },
  ];

  return (
    <>
      <SEOHead title="Dashboard" noIndex />
      <div className="min-h-screen bg-gray-50 p-6">
        <h1 className="mb-6 font-serif text-2xl font-bold text-charcoal">Dashboard Overview</h1>
        {isLoading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 7 }).map((_, i) => <SkeletonLoader key={i} className="h-24 rounded-xl" />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="rounded-xl bg-white p-5 shadow-sm">
                <p className="text-sm text-gray-500">{s.label}</p>
                <p className="mt-1 text-2xl font-bold text-charcoal">{s.value}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
