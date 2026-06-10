import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '@/lib/axiosInstance';
import { SEOHead } from '@/components/shared/SEOHead';
import { SkeletonLoader } from '@/components/shared/SkeletonLoader';
import type { Booking, BookingStatus } from '@/types';

const ALLOWED_TRANSITIONS: Record<BookingStatus, BookingStatus[]> = {
  pending: ['contacted', 'cancelled'],
  contacted: ['confirmed', 'cancelled'],
  confirmed: ['completed', 'cancelled'],
  completed: [],
  cancelled: [],
};

const statusColors: Record<BookingStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  contacted: 'bg-blue-100 text-blue-700',
  confirmed: 'bg-green-100 text-green-700',
  completed: 'bg-gray-100 text-gray-700',
  cancelled: 'bg-red-100 text-red-700',
};

export default function BookingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const qc = useQueryClient();

  const { data: booking, isLoading } = useQuery({
    queryKey: ['booking', id],
    queryFn: () => axiosInstance.get(`/api/v1/bookings/${id}`).then(r => r.data.data as Booking),
    enabled: !!id,
  });

  const statusMutation = useMutation({
    mutationFn: (status: BookingStatus) =>
      axiosInstance.patch(`/api/v1/bookings/${id}/status`, { status }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['booking', id] });
      qc.invalidateQueries({ queryKey: ['bookings'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => axiosInstance.delete(`/api/v1/bookings/${id}`),
    onSuccess: () => navigate('/admin/bookings'),
  });

  if (isLoading) return (
    <div className="p-6 space-y-3">
      <SkeletonLoader className="h-8 w-48" />
      <SkeletonLoader className="h-32 w-full rounded-xl" />
    </div>
  );

  if (!booking) return (
    <div className="p-6 text-center text-gray-400">Booking not found</div>
  );

  const allowedNext = ALLOWED_TRANSITIONS[booking.status];

  return (
    <>
      <SEOHead title={`Booking ${booking.bookingId}`} noIndex />
      <div className="p-6 max-w-4xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm text-gray-400">Booking ID</p>
            <h1 className="font-mono text-xl font-bold text-charcoal">{booking.bookingId}</h1>
          </div>
          <span className={`rounded-full px-3 py-1 text-sm font-medium ${statusColors[booking.status]}`}>
            {booking.status}
          </span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {/* Customer info */}
          <div className="rounded-xl bg-white p-5 shadow-sm">
            <h2 className="mb-3 font-semibold text-charcoal">Customer Info</h2>
            <dl className="space-y-2 text-sm">
              <div><dt className="text-gray-400">Name</dt><dd className="font-medium">{booking.customerName}</dd></div>
              <div><dt className="text-gray-400">Email</dt><dd>{booking.email}</dd></div>
              <div><dt className="text-gray-400">Phone</dt><dd>{booking.phone}</dd></div>
            </dl>
          </div>

          {/* Event details */}
          <div className="rounded-xl bg-white p-5 shadow-sm">
            <h2 className="mb-3 font-semibold text-charcoal">Event Details</h2>
            <dl className="space-y-2 text-sm">
              <div><dt className="text-gray-400">Event Type</dt><dd className="font-medium">{booking.eventType}</dd></div>
              <div><dt className="text-gray-400">Date</dt><dd>{new Date(booking.eventDate).toDateString()}</dd></div>
              <div><dt className="text-gray-400">Guests</dt><dd>{booking.guestCount}</dd></div>
              <div><dt className="text-gray-400">Catering</dt><dd>{booking.cateringRequired ? 'Yes' : 'No'}</dd></div>
              <div><dt className="text-gray-400">Decoration</dt><dd>{booking.decorationRequired ? 'Yes' : 'No'}</dd></div>
            </dl>
          </div>

          {/* Contact Customer — Req 7.1, 7.2, 7.3, 7.4 */}
          <div className="rounded-xl bg-white p-5 shadow-sm sm:col-span-2">
            <h2 className="mb-3 font-semibold text-charcoal">Contact Customer</h2>
            <div className="flex flex-wrap gap-2">
              {/* Req 7.1 — Call button, always rendered */}
              <a href={`tel:${booking.phone}`}
                 className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium hover:bg-gray-50 transition">
                📞 Call
              </a>
              {/* Req 7.2 — WhatsApp button */}
              <a href={`https://wa.me/977${booking.phone.replace(/^0/, '').replace(/\D/g, '')}?text=${encodeURIComponent('Re: Booking ' + booking.bookingId + ' on ' + new Date(booking.eventDate).toDateString())}`}
                 target="_blank" rel="noopener noreferrer"
                 className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium hover:bg-gray-50 transition">
                💬 WhatsApp
              </a>
              {/* Req 7.3 — Email button, only when email is non-empty */}
              {booking.email && (
                <a href={`mailto:${booking.email}?subject=Re: Booking ${booking.bookingId}`}
                   className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium hover:bg-gray-50 transition">
                  ✉️ Email
                </a>
              )}
            </div>
          </div>

          {/* Notes — moved below Contact Customer per Req 7.4 */}
          {booking.notes && (
            <div className="rounded-xl bg-white p-5 shadow-sm sm:col-span-2">
              <h2 className="mb-2 font-semibold text-charcoal">Notes</h2>
              <p className="text-sm text-gray-600">{booking.notes}</p>
            </div>
          )}

          {/* Status update */}
          {allowedNext.length > 0 && (
            <div className="rounded-xl bg-white p-5 shadow-sm">
              <h2 className="mb-3 font-semibold text-charcoal">Update Status</h2>
              <div className="flex flex-wrap gap-2">
                {allowedNext.map(s => (
                  <button key={s} onClick={() => statusMutation.mutate(s)}
                    disabled={statusMutation.isPending}
                    className={`rounded-lg px-3 py-1 text-sm font-medium capitalize transition ${statusColors[s]} hover:opacity-80 disabled:opacity-50`}>
                    → {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Status history */}
          {booking.statusHistory && booking.statusHistory.length > 0 && (
            <div className="rounded-xl bg-white p-5 shadow-sm">
              <h2 className="mb-3 font-semibold text-charcoal">Communication Log</h2>
              <ol className="space-y-2">
                {booking.statusHistory.map((h, i) => (
                  <li key={i} className="flex items-center gap-2 text-xs text-gray-500">
                    <span className={`rounded-full px-2 py-0.5 ${statusColors[h.status as BookingStatus]}`}>{h.status}</span>
                    <span>{new Date(h.changedAt).toLocaleString()}</span>
                    {h.changedBy && <span className="text-gray-400">by {h.changedBy.slice(0, 8)}...</span>}
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>

        <div className="mt-6">
          <button
            onClick={() => confirm('Delete this booking?') && deleteMutation.mutate()}
            disabled={deleteMutation.isPending}
            className="rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-600 disabled:opacity-50"
          >
            Delete Booking
          </button>
        </div>
      </div>
    </>
  );
}
