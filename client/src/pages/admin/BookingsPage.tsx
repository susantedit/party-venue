import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/lib/axiosInstance';
import { SEOHead } from '@/components/shared/SEOHead';
import { SkeletonLoader } from '@/components/shared/SkeletonLoader';
import type { Booking } from '@/types';

export default function BookingsPage() {
  const [page, setPage] = useState(1);
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
      <SEOHead title="Bookings" noIndex />
      <div className="min-h-screen bg-gray-50 p-6">
        <h1 className="mb-4 font-serif text-2xl font-bold text-charcoal">Bookings</h1>
        <div className="mb-4 flex gap-3">
          <input
            placeholder="Search name or phone..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            className="rounded-lg border px-3 py-2 text-sm"
          />
          <select value={status} onChange={e => { setStatus(e.target.value); setPage(1); }}
            className="rounded-lg border px-3 py-2 text-sm">
            <option value="">All Status</option>
            {['pending','contacted','confirmed','completed','cancelled'].map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        {!isLoading && (
          <p className="mb-2 text-sm text-gray-500">
            {pagination?.total ?? 0} booking{(pagination?.total ?? 0) !== 1 ? 's' : ''} found
          </p>
        )}
        {isLoading ? (
          <div className="space-y-3">{Array.from({length:5}).map((_,i) => <SkeletonLoader key={i} className="h-12 rounded-lg" />)}</div>
        ) : (
          <div className="overflow-x-auto rounded-xl bg-white shadow-sm">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left text-xs uppercase text-gray-500">
                <tr>{['ID','Customer','Phone','Event','Date','Guests','Status','Source','Actions'].map(h => <th key={h} className="px-4 py-3">{h}</th>)}</tr>
              </thead>
              <tbody className="divide-y">
                {bookings.map(b => (
                  <tr key={b._id} className={`hover:bg-gray-50${b.status === 'pending' ? ' border-l-4 border-yellow-400' : ''}`}>
                    <td className="px-4 py-3 font-mono text-xs">{b.bookingId}</td>
                    <td className="px-4 py-3">{b.customerName}</td>
                    <td className="px-4 py-3">{b.phone}</td>
                    <td className="px-4 py-3">{b.eventType}</td>
                    <td className="px-4 py-3">{new Date(b.eventDate).toLocaleDateString()}</td>
                    <td className="px-4 py-3">{b.guestCount}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        b.status === 'confirmed'  ? 'bg-green-100 text-green-700' :
                        b.status === 'pending'    ? 'bg-yellow-100 text-yellow-700' :
                        b.status === 'contacted'  ? 'bg-blue-100 text-blue-700' :
                        b.status === 'completed'  ? 'bg-gray-100 text-gray-700' :
                        b.status === 'cancelled'  ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                      }`}>{b.status}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="bg-gray-100 text-gray-500 rounded px-1.5 py-0.5 text-xs">{b.source}</span>
                    </td>
                    <td className="px-4 py-3">
                      <Link to={`/admin/bookings/${b._id}`} className="text-blue-600 hover:underline text-xs mr-2">View</Link>
                      <a
                        href={`https://wa.me/977${b.phone.replace(/^0/, '').replace(/\D/g, '')}?text=${encodeURIComponent('Re: Booking ' + b.bookingId)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mr-2 text-lg"
                        title="WhatsApp"
                      >💬</a>
                      <a href={`tel:${b.phone}`} className="text-lg" title="Call">📞</a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {pagination && (
          <div className="mt-4 flex items-center gap-3 text-sm">
            <button disabled={page <= 1} onClick={() => setPage(p => p-1)} className="rounded-lg border px-3 py-1 disabled:opacity-40">Prev</button>
            <span>Page {page} of {pagination.pages}</span>
            <button disabled={page >= pagination.pages} onClick={() => setPage(p => p+1)} className="rounded-lg border px-3 py-1 disabled:opacity-40">Next</button>
          </div>
        )}
      </div>
    </>
  );
}
