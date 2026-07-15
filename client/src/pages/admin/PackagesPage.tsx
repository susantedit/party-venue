import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/lib/axiosInstance';
import { SEOHead } from '@/components/shared/SEOHead';
import { Package as PackageIcon, Users, Sparkles } from 'lucide-react';
import type { Package } from '@/types';

const CAT_STYLES: Record<string, string> = {
  silver:   'bg-zinc-500/10 text-zinc-400 border-zinc-500/20',
  gold:     'bg-gold/10 text-gold border-gold/20',
  platinum: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
  custom:   'bg-blue-500/10 text-blue-400 border-blue-500/20',
};

function PackageSkeleton() {
  return (
    <div className="border border-white/[0.06] bg-[#111111] p-5 animate-pulse space-y-3" style={{ borderRadius: '4px' }}>
      <div className="h-3 bg-zinc-800 rounded w-20" />
      <div className="h-5 bg-zinc-800 rounded w-36" />
      <div className="h-3 bg-zinc-800 rounded w-full" />
      <div className="h-3 bg-zinc-800 rounded w-4/5" />
      <div className="h-6 bg-zinc-800 rounded w-28" />
    </div>
  );
}

export default function AdminPackagesPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-packages'],
    queryFn: () => axiosInstance.get('/api/v1/packages').then(r => r.data.data as Package[]),
  });

  return (
    <>
      <SEOHead title="Packages — Admin" noIndex />
      <div className="min-h-screen bg-[#0f0f0f]">

        {/* Page header */}
        <div className="border-b border-white/[0.06] bg-[#111111] px-6 py-5">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="block h-px w-5 bg-gold/50" />
            <span className="text-[10px] text-gold uppercase tracking-[0.2em] font-semibold">Content</span>
          </div>
          <div className="flex items-end justify-between">
            <h1 className="font-serif text-xl font-bold text-white tracking-widest uppercase">Packages</h1>
            {!isLoading && (
              <span className="text-[11px] text-zinc-600">{data?.length ?? 0} package{(data?.length ?? 0) !== 1 ? 's' : ''}</span>
            )}
          </div>
        </div>

        <div className="p-6">
          {isLoading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 4 }).map((_, i) => <PackageSkeleton key={i} />)}
            </div>
          ) : (data ?? []).length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-zinc-700">
              <PackageIcon className="h-10 w-10 mb-3" />
              <p className="text-sm">No packages found</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {(data ?? []).map(pkg => (
                <div
                  key={pkg._id}
                  className={`relative border border-white/[0.06] bg-[#111111] p-5 transition hover:border-white/[0.12] ${pkg.isPopular ? 'ring-1 ring-gold/20' : ''}`}
                  style={{ borderRadius: '4px' }}
                >
                  {/* Popular badge */}
                  {pkg.isPopular && (
                    <div className="absolute -top-px left-4 inline-flex items-center gap-1 bg-gold/90 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#0d0d0d]" style={{ borderRadius: '0 0 4px 4px' }}>
                      <Sparkles className="h-2.5 w-2.5" /> Most Popular
                    </div>
                  )}

                  {/* Category + Active */}
                  <div className="flex items-center gap-2 mb-4 mt-1">
                    <span className={`border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide rounded-full ${CAT_STYLES[pkg.category] ?? CAT_STYLES.custom}`}>
                      {pkg.category}
                    </span>
                    <span className={`px-2 py-0.5 text-[10px] font-medium rounded-full ${pkg.isActive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                      {pkg.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>

                  <h3 className="font-serif font-bold text-white text-base mb-1">{pkg.name}</h3>
                  <p className="text-xs text-zinc-500 mb-4 leading-relaxed line-clamp-2">{pkg.description}</p>

                  <div className="flex items-end justify-between">
                    <div>
                      <p className="font-serif text-xl font-bold text-gold">NPR {pkg.price.toLocaleString()}</p>
                      <p className="flex items-center gap-1 text-[11px] text-zinc-600 mt-0.5">
                        <Users className="h-3 w-3" /> {pkg.capacity} guests
                      </p>
                    </div>
                  </div>

                  {/* Features */}
                  {pkg.features && pkg.features.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-white/[0.04]">
                      <p className="text-[10px] text-zinc-700 uppercase tracking-[0.12em] mb-2">Includes</p>
                      <ul className="space-y-1">
                        {pkg.features.slice(0, 4).map((f, i) => (
                          <li key={i} className="flex items-center gap-1.5 text-xs text-zinc-500">
                            <span className="text-gold/60">✓</span> {f}
                          </li>
                        ))}
                        {pkg.features.length > 4 && (
                          <li className="text-xs text-zinc-700">+{pkg.features.length - 4} more</li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
