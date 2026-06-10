import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/lib/axiosInstance';
import { SEOHead } from '@/components/shared/SEOHead';
import { SkeletonLoader } from '@/components/shared/SkeletonLoader';
import { MENU_CATEGORIES } from '@/constants';
import type { MenuItem } from '@/types';
import { PageHeader } from '@/components/ui/PageHeader';

export default function MenuPage() {
  const [activeCategory, setActiveCategory] = useState<string>(MENU_CATEGORIES[0]);

  const { data: items = [], isLoading } = useQuery({
    queryKey: ['menu', activeCategory],
    queryFn: () =>
      axiosInstance
        .get('/api/v1/menu', { params: { category: activeCategory } })
        .then((r) => r.data.data as MenuItem[]),
  });

  return (
    <>
      <SEOHead
        title="Food Menu"
        description="Explore our authentic Nepali, Newari, Indian, Chinese, BBQ, desserts, and beverages catering menu at Shree Ganesh."
        canonicalUrl="https://shreeganeshsharma.com/menu"
      />
      <div className="bg-zinc-950 pt-24 pb-16 px-4">
        <div className="relative z-10 mx-auto max-w-5xl">
          <PageHeader
            title="Our Menu"
            description="Authentic flavors crafted with love — from traditional Nepali feasts to international cuisines."
            breadcrumb="Menu"
          />

          {/* Category tabs */}
          <div className="mb-8 flex flex-wrap gap-2">
            {MENU_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`rounded-full px-4 py-1.5 text-sm font-medium capitalize transition ${
                  activeCategory === cat ? 'bg-gold-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Items grid */}
          {isLoading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => <SkeletonLoader key={i} className="h-32 rounded-xl" />)}
            </div>
          ) : items.length === 0 ? (
            <div className="py-12 text-center text-gray-400">No items available in this category.</div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((item) => (
                <div key={item._id} className="flex items-center gap-4 rounded-xl bg-white p-4 shadow-sm border border-gray-50">
                  {item.image && (
                    <img src={item.image} alt={item.name} loading="lazy"
                      className="h-16 w-16 rounded-lg object-cover flex-shrink-0" />
                  )}
                  <div>
                    <h3 className="font-semibold text-charcoal">{item.name}</h3>
                    {item.description && <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{item.description}</p>}
                    {item.price && <p className="text-sm font-medium text-gold-600 mt-1">NPR {item.price.toLocaleString()}</p>}
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
