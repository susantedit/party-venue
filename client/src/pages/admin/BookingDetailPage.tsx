import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '@/lib/axiosInstance';
import { SEOHead } from '@/components/shared/SEOHead';
import { ArrowLeft, Phone, Mail, MessageSquare } from 'lucide-react';
import type { Booking, BookingStatus } from '@/types';

const ALLOWED_TRANSITIONS: Record<BookingStatus, BookingStatus[]> = {
  pending:   ['contacted', 'cancelled'],
  contacted: ['confirmed', 'cancelled'],
  confirmed: ['completed', 'cancelled'],
  completed: [],
  cancelled: [],
};

const STATUS_STYLES: Record<BookingStatus, string> = {
  pending:   'bg-amber-500/10 text-amber-400 border border-amber-500/20',
  contacted: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
  confirmed: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
  completed: 'bg-zinc-500/10 text-zinc-400 border border-zinc-500/20',
  cancelled: 'bg-red-500/10 text-red-400 border border-red-500/20',
};

const TRANSITION_STYLES: Record<BookingStatus, string> = {
  pending:   'border-amber-500/30 text-amber-400 hover:bg-amber-500/10',
  contacted: 'border-blue-500/30 text-blue-400 hover:bg-blue-500/10',
  confirmed: 'border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10',
  completed: 'border-zinc-500/30 text-zinc-400 hover:bg-zinc-500/10',
  cancelled: 'border-red-500/30 text-red-400 hover:bg-red-500/10',
};

function DetailBlock({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <dt className="text-[10px] text-zinc-600 uppercase tracking-[0.12em] font-semibold mb-0.5">{label}</dt>
      <dd className="text-sm text-zinc-200">{value}</dd>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border border-white/[0.06] bg-[#111111] p-5" style={{ borderRadius: '4px' }}>
      <h2 className="text-[10px] text-zinc-600 uppercase tracking-[0.18em] font-semibold mb-4">{title}</h2>
      {children}
    </div>
  );
}

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0f0f0f]">
        <div className="border-b border-white/[0.06] bg-[#111111] px-6 py-5">
          <div className="h-4 w-24 bg-zinc-800 rounded animate-pulse mb-2" />
          <div className="h-6 w-48 bg-zinc-800 rounded animate-pulse" />
        </div>
        <div className="p-6 grid gap-4 sm:grid-cols-2 max-w-4xl">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="border border-white/[0.06] bg-[#111111] p-5 animate-pulse h-36" style={{ borderRadius: '4px' }} />
          ))}
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center">
        <div className="text-center">
          <p className="text-zinc-600 mb-4">Booking not found</p>
          <Link to="/admin/bookings" className="text-gold text-sm hover:underline">← Back to bookings</Link>
        </div>
      </div>
    );
  }

  const allowedNext = ALLOWED_TRANSITIONS[booking.status];
  const whatsappLink = `https://wa.me/977${booking.phone.replace(/^0/, '').replace(/\D/g, '')}?text=${encodeURIComponent('Re: Booking ' + booking.bookingId + ' on ' + new Date(booking.eventDate).toDateString())}`;

  return (
    <>
      <SEOHead title={`Booking ${booking.bookingId} — Admin`} noIndex />
      <div className="min-h-screen bg-[#0f0f0f]">

        {/* Page header */}
        <div className="border-b border-white/[0.06] bg-[#111111] px-6 py-5">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="block h-px w-5 bg-gold/50" />
            <span className="text-[10px] text-gold uppercase tracking-[0.2em] font-semibold">Booking Detail</span>
          </div>
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <Link to="/admin/bookings" className="text-zinc-600 hover:text-zinc-300 transition-colors">
                <ArrowLeft className="h-4 w-4" />
              </Link>
              <h1 className="font-mono text-lg font-bold text-white tracking-wider">{booking.bookingId}</h1>
            </div>
            <span className={`inline-block px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider rounded-full ${STATUS_STYLES[booking.status]}`}>
              {booking.status}
            </span>
          </div>
        </div>

        <div className="p-6 max-w-4xl space-y-4">

          <div className="grid gap-4 sm:grid-cols-2">

            {/* Customer info */}
            <Card title="Customer Info">
              <dl className="space-y-3">
                <DetailBlock label="Name" value={<span className="font-semibold text-white">{booking.customerName}</span>} />
                <DetailBlock label="Phone" value={booking.phone} />
                {booking.email && <DetailBlock label="Email" value={booking.email} />}
              </dl>
            </Card>

            {/* Event details */}
            <Card title="Event Details">
              <dl className="space-y-3">
                <DetailBlock label="Event Type" value={booking.eventType} />
                <DetailBlock label="Date" value={new Date(booking.eventDate).toDateString()} />
                <DetailBlock label="Guests" value={`${booking.guestCount} people`} />
                <DetailBlock label="Catering" value={booking.cateringRequired ? 'Yes' : 'No'} />
                <DetailBlock label="Decoration" value={booking.decorationRequired ? 'Yes' : 'No'} />
              </dl>
            </Card>

            {/* Contact customer */}
            <div className="sm:col-span-2 border border-white/[0.06] bg-[#111111] p-5" style={{ borderRadius: '4px' }}>
              <h2 className="text-[10px] text-zinc-600 uppercase tracking-[0.18em] font-semibold mb-4">Contact Customer</h2>
              <div className="flex flex-wrap gap-2">
                <a
                  href={`tel:${booking.phone}`}
                  className="inline-flex items-center gap-2 border border-white/[0.06] bg-white/[0.02] px-3 py-1.5 text-xs text-zinc-300 hover:border-blue-500/30 hover:text-blue-400 transition-all font-medium"
                  style={{ borderRadius: '4px' }}
                >
                  <Phone className="h-3 w-3" /> Call
                </a>
                <a
                  href={whatsappLink}
                  target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 border border-white/[0.06] bg-white/[0.02] px-3 py-1.5 text-xs text-zinc-300 hover:border-emerald-500/30 hover:text-emerald-400 transition-all font-medium"
                  style={{ borderRadius: '4px' }}
                >
                  <MessageSquare className="h-3 w-3" /> WhatsApp
                </a>
                {booking.email && (
                  <a
                    href={`mailto:${booking.email}?subject=Re: Booking ${booking.bookingId}`}
                    className="inline-flex items-center gap-2 border border-white/[0.06] bg-white/[0.02] px-3 py-1.5 text-xs text-zinc-300 hover:border-gold/30 hover:text-gold transition-all font-medium"
                    style={{ borderRadius: '4px' }}
                  >
                    <Mail className="h-3 w-3" /> Email
                  </a>
                )}
              </div>
            </div>

            {/* Notes */}
            {booking.notes && (
              <div className="sm:col-span-2 border border-white/[0.06] bg-[#111111] p-5" style={{ borderRadius: '4px' }}>
                <h2 className="text-[10px] text-zinc-600 uppercase tracking-[0.18em] font-semibold mb-2">Notes</h2>
                <p className="text-sm text-zinc-400 leading-relaxed">{booking.notes}</p>
              </div>
            )}

            {/* Status update */}
            {allowedNext.length > 0 && (
              <Card title="Update Status">
                <div className="flex flex-wrap gap-2">
                  {allowedNext.map(s => (
                    <button
                      key={s}
                      onClick={() => statusMutation.mutate(s)}
                      disabled={statusMutation.isPending}
                      className={`border px-3 py-1.5 text-xs font-medium capitalize transition disabled:opacity-40 ${TRANSITION_STYLES[s]}`}
                      style={{ borderRadius: '4px' }}
                    >
                      → {s}
                    </button>
                  ))}
                </div>
              </Card>
            )}

            {/* Status history */}
            {booking.statusHistory && booking.statusHistory.length > 0 && (
              <Card title="Status History">
                <ol className="space-y-2">
                  {booking.statusHistory.map((h, i) => (
                    <li key={i} className="flex items-center gap-2.5 text-xs">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium uppercase ${STATUS_STYLES[h.status as BookingStatus]}`}>
                        {h.status}
                      </span>
                      <span className="text-zinc-600">{new Date(h.changedAt).toLocaleString()}</span>
                      {h.changedBy && <span className="text-zinc-700 font-mono">{h.changedBy.slice(0, 8)}…</span>}
                    </li>
                  ))}
                </ol>
              </Card>
            )}
          </div>

          {/* Delete */}
          <div className="pt-2">
            <button
              onClick={() => confirm('Delete this booking permanently?') && deleteMutation.mutate()}
              disabled={deleteMutation.isPending}
              className="px-4 py-2 bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium hover:bg-red-500/20 transition disabled:opacity-40"
              style={{ borderRadius: '4px' }}
            >
              {deleteMutation.isPending ? 'Deleting…' : 'Delete Booking'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
