import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/lib/axiosInstance';
import { SEOHead } from '@/components/shared/SEOHead';
import type { MenuItem } from '@/types';
import { MENU_CATEGORIES } from '@/constants';

export default function AdminMenuPage() {
  const { data } = useQuery({
    queryKey: ['admin-menu'],
    queryFn: () => axiosInstance.get('/api/v1/menu').then(r => r.data.data as MenuItem[]),
  });

  return (
    <>
      <SEOHead title="Menu Management" noIndex />
      <div className="min-h-screen bg-gray-50 p-6">
        <h1 className="mb-4 font-serif text-2xl font-bold text-charcoal">Menu Items</h1>
        {MENU_CATEGORIES.map(cat => {
          const items = data?.filter(i => i.category === cat) ?? [];
          if (items.length === 0) return null;
          return (
            <div key={cat} className="mb-6">
              <h2 className="mb-2 text-lg font-semibold capitalize text-charcoal">{cat}</h2>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {items.map(item => (
                  <div key={item._id} className="flex items-center gap-3 rounded-xl bg-white p-3 shadow-sm">
                    {item.image && <img src={item.image} alt={item.name} className="h-12 w-12 rounded-lg object-cover" />}
                    <div>
                      <p className="font-medium text-sm">{item.name}</p>
                      {item.price && <p className="text-xs text-gray-500">NPR {item.price}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
