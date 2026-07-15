import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/lib/axiosInstance';
import { SEOHead } from '@/components/shared/SEOHead';
import { UtensilsCrossed } from 'lucide-react';
import type { MenuItem } from '@/types';
import { MENU_CATEGORIES } from '@/constants';

const CAT_COLORS: Record<string, string> = {
  nepali:   'bg-amber-500/10 text-amber-400 border-amber-500/20',
  newari:   'bg-orange-500/10 text-orange-400 border-orange-500/20',
  indian:   'bg-red-500/10 text-red-400 border-red-500/20',
  chinese:  'bg-rose-500/10 text-rose-400 border-rose-500/20',
  bbq:      'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  dessert:  'bg-pink-500/10 text-pink-400 border-pink-500/20',
  beverage: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
};

function ItemSkeleton() {
  return (
    <div className="flex items-center gap-3 border border-white/[0.04] bg-[#161616] p-3 animate-pulse" style={{ borderRadius: '4px' }}>
      <div className="h-12 w-12 shrink-0 bg-zinc-800 rounded" />
      <div className="flex-1 space-y-1.5">
        <div className="h-3 bg-zinc-800 rounded w-32" />
        <div className="h-2.5 bg-zinc-800 rounded w-16" />
      </div>
    </div>
  );
}

export default function AdminMenuPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-menu'],
    queryFn: () => axiosInstance.get('/api/v1/menu').then(r => r.data.data as MenuItem[]),
  });

  const totalItems = data?.length ?? 0;

  return (
    <>
      <SEOHead title="Menu — Admin" noIndex />
      <div className="min-h-screen bg-[#0f0f0f]">

        {/* Page header */}
        <div className="border-b border-white/[0.06] bg-[#111111] px-6 py-5">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="block h-px w-5 bg-gold/50" />
            <span className="text-[10px] text-gold uppercase tracking-[0.2em] font-semibold">Content</span>
          </div>
          <div className="flex items-end justify-between">
            <h1 className="font-serif text-xl font-bold text-white tracking-widest uppercase">Menu</h1>
            {!isLoading && (
              <span className="text-[11px] text-zinc-600">{totalItems} item{totalItems !== 1 ? 's' : ''}</span>
            )}
          </div>
        </div>

        <div className="p-6 space-y-8">
          {isLoading ? (
            <div className="space-y-6">
              {Array.from({ length: 3 }).map((_, gi) => (
                <div key={gi}>
                  <div className="h-3 bg-zinc-800 rounded w-24 mb-3 animate-pulse" />
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {Array.from({ length: 3 }).map((_, i) => <ItemSkeleton key={i} />)}
                  </div>
                </div>
              ))}
            </div>
          ) : totalItems === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-zinc-700">
              <UtensilsCrossed className="h-10 w-10 mb-3" />
              <p className="text-sm">No menu items yet</p>
            </div>
          ) : (
            MENU_CATEGORIES.map(cat => {
              const items = (data ?? []).filter(i => i.category === cat);
              if (items.length === 0) return null;
              const catStyle = CAT_COLORS[cat] ?? 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20';
              return (
                <div key={cat}>
                  <div className="flex items-center gap-3 mb-3">
                    <span className={`border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider rounded-full ${catStyle}`}>
                      {cat}
                    </span>
                    <span className="text-[11px] text-zinc-700">{items.length} item{items.length !== 1 ? 's' : ''}</span>
                    <span className="flex-1 h-px bg-white/[0.04]" />
                  </div>
                  <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                    {items.map(item => (
                      <div
                        key={item._id}
                        className="flex items-center gap-3 border border-white/[0.06] bg-[#111111] p-3 hover:border-white/[0.1] transition"
                        style={{ borderRadius: '4px' }}
                      >
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-12 w-12 shrink-0 object-cover border border-white/[0.04]"
                            style={{ borderRadius: '4px' }}
                            loading="lazy"
                          />
                        ) : (
                          <div className="h-12 w-12 shrink-0 flex items-center justify-center border border-white/[0.04] bg-white/[0.02]" style={{ borderRadius: '4px' }}>
                            <UtensilsCrossed className="h-4 w-4 text-zinc-700" />
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-zinc-200 truncate">{item.name}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            {item.price != null && (
                              <p className="text-xs text-gold/80">NPR {item.price.toLocaleString()}</p>
                            )}
                            <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${item.available !== false ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-400'}`}>
                              {item.available !== false ? 'Available' : 'Unavailable'}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
}
