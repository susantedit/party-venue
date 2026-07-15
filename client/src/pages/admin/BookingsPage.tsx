import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/lib/axiosInstance';
import { SEOHead } from '@/components/shared/SEOHead';
import { Search, Filter, Phone, MessageSquare } from 'lucide-react';
import type { Booking } from '@/types';

const STATUS_STYLES: Record<string, string> = {
  pending:   'bg-amber-500/10 text-amber-400 border border-amber-500/20',
  contacted: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
  confirmed: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
  completed: 'bg-zinc-500/10 text-zinc-400 border border-zinc-500/20',
  cancelled: 'bg-red-500/10 text-red-400 border border-red-500/20',
};

function RowSkeleton() {
  return (
    <tr className="border-b border-white/[0.04]">
      {Array.from({ length: 8 }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-3 bg-zinc-800 rounded animate-pulse w-16" />
        </td>
      ))}
    </tr>
  );
}

export default function BookingsPage() {
  const [page, setPage]     = useState(1);
  const [status, setStatus] = useState('');
  const [search, setSearch] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['bookings', page, status, search],
    queryFn: () =>
      axiosInstance
        .get('/api/v1/bookings', { params: { page, limit: 10, status: status || undefined, search: search || undefined } })
        .then(r => r.data),
  });

  const bookings: Booking[] = data?.data ?? [];
  const pagination = data?.pagination;

  return (
    <>
      <SEOHead title="Bookings — Admin" noIndex />
      <div className="min-h-screen bg-[#0f0f0f]">

        {/* Page header */}
        <div className="border-b border-white/[0.06] bg-[#111111] px-6 py-5">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="block h-px w-5 bg-gold/50" />
            <span className="text-[10px] text-gold uppercase tracking-[0.2em] font-semibold">Management</span>
          </div>
          <h1 className="font-serif text-xl font-bold text-white tracking-widest uppercase">Bookings</h1>
        </div>

        <div className="p-6 space-y-5">

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-600" />
              <input
                placeholder="Search name or phone..."
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1); }}
                className="h-9 pl-8 pr-3 bg-[#161616] border border-white/[0.06] text-sm text-zinc-300 placeholder-zinc-700 focus:outline-none focus:border-gold/30 transition-colors"
                style={{ borderRadius: '4px' }}
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-600" />
              <select
                value={status}
                onChange={e => { setStatus(e.target.value); setPage(1); }}
                className="h-9 pl-8 pr-8 bg-[#161616] border border-white/[0.06] text-sm text-zinc-300 focus:outline-none focus:border-gold/30 transition-colors appearance-none"
                style={{ borderRadius: '4px' }}
              >
                <option value="">All Status</option>
                {['pending', 'contacted', 'confirmed', 'completed', 'cancelled'].map(s => (
                  <option key={s} value={s} className="bg-[#1a1a1a]">{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                ))}
              </select>
            </div>
            {!isLoading && (
              <span className="text-[11px] text-zinc-600 ml-auto">
                {pagination?.total ?? 0} booking{(pagination?.total ?? 0) !== 1 ? 's' : ''}
              </span>
            )}
          </div>

          {/* Table */}
          <div className="border border-white/[0.06] bg-[#111111] overflow-hidden" style={{ borderRadius: '4px' }}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/[0.06]">
                    {['ID', 'Customer', 'Phone', 'Event', 'Date', 'Guests', 'Status', 'Actions'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-[10px] uppercase tracking-[0.12em] text-zinc-600 font-semibold whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {isLoading
                    ? Array.from({ length: 5 }).map((_, i) => <RowSkeleton key={i} />)
                    : bookings.map(b => (
                        <tr
                          key={b._id}
                          className={`border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors ${b.status === 'pending' ? 'border-l-2 border-l-amber-500/60' : ''}`}
                        >
                          <td className="px-4 py-3 font-mono text-[11px] text-zinc-500">{b.bookingId}</td>
                          <td className="px-4 py-3 text-zinc-200 font-medium">{b.customerName}</td>
                          <td className="px-4 py-3 text-zinc-400">{b.phone}</td>
                          <td className="px-4 py-3 text-zinc-400">{b.eventType}</td>
                          <td className="px-4 py-3 text-zinc-400 whitespace-nowrap">{new Date(b.eventDate).toLocaleDateString()}</td>
                          <td className="px-4 py-3 text-zinc-400">{b.guestCount}</td>
                          <td className="px-4 py-3">
                            <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide ${STATUS_STYLES[b.status] ?? STATUS_STYLES.completed}`}>
                              {b.status}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <Link to={`/admin/bookings/${b._id}`} className="text-[11px] text-gold/70 hover:text-gold transition-colors font-medium">
                                View
                              </Link>
                              <a
                                href={`https://wa.me/977${b.phone.replace(/^0/, '').replace(/\D/g, '')}?text=${encodeURIComponent('Re: Booking ' + b.bookingId)}`}
                                target="_blank" rel="noopener noreferrer" title="WhatsApp"
                                className="text-zinc-600 hover:text-emerald-400 transition-colors"
                              >
                                <MessageSquare className="h-3.5 w-3.5" />
                              </a>
                              <a href={`tel:${b.phone}`} title="Call" className="text-zinc-600 hover:text-blue-400 transition-colors">
                                <Phone className="h-3.5 w-3.5" />
                              </a>
                            </div>
                          </td>
                        </tr>
                      ))
                  }
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {pagination && (
            <div className="flex items-center gap-3 text-xs text-zinc-500">
              <button
                disabled={page <= 1}
                onClick={() => setPage(p => p - 1)}
                className="px-3 py-1.5 border border-white/[0.06] bg-[#161616] hover:bg-[#1a1a1a] disabled:opacity-30 transition-colors"
                style={{ borderRadius: '4px' }}
              >
                ← Prev
              </button>
              <span>Page {page} of {pagination.pages}</span>
              <button
                disabled={page >= pagination.pages}
                onClick={() => setPage(p => p + 1)}
                className="px-3 py-1.5 border border-white/[0.06] bg-[#161616] hover:bg-[#1a1a1a] disabled:opacity-30 transition-colors"
                style={{ borderRadius: '4px' }}
              >
                Next →
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
