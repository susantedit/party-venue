import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '@/lib/axiosInstance';
import { SEOHead } from '@/components/shared/SEOHead';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

type DayStatus = 'available' | 'reserved' | 'booked';

const STATUS_CONFIG: Record<DayStatus, { dot: string; cell: string; label: string }> = {
  available: {
    dot:   'bg-emerald-400',
    cell:  'text-zinc-300 hover:bg-emerald-500/10 hover:border-emerald-500/20 hover:text-emerald-300 cursor-pointer',
    label: 'Available',
  },
  reserved: {
    dot:   'bg-amber-400',
    cell:  'text-amber-400 bg-amber-500/10 border-amber-500/15 hover:bg-amber-500/20 cursor-pointer',
    label: 'Reserved (blocked)',
  },
  booked: {
    dot:   'bg-red-400',
    cell:  'text-red-400 bg-red-500/10 border-red-500/15 cursor-default',
    label: 'Booked',
  },
};

export default function AdminCalendarPage() {
  const qc = useQueryClient();
  const [currentDate, setCurrentDate] = useState(new Date());

  const year  = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth    = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  const { data: bookings } = useQuery({
    queryKey: ['calendar-bookings', year, month],
    queryFn: () => axiosInstance.get('/api/v1/bookings', { params: { limit: 100 } }).then(r => r.data.data),
  });

  const blockMutation = useMutation({
    mutationFn: (date: string) => axiosInstance.post('/api/v1/availability/block', { date }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['calendar-bookings'] }),
  });

  const unblockMutation = useMutation({
    mutationFn: (date: string) => axiosInstance.post('/api/v1/availability/unblock', { date }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['calendar-bookings'] }),
  });

  const getDateStatus = (day: number): DayStatus => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const booking = bookings?.find((b: any) => b.eventDate?.startsWith(dateStr));
    if (!booking) return 'available';
    return booking.status === 'confirmed' ? 'booked' : 'reserved';
  };

  const getBookingInfo = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return bookings?.find((b: any) => b.eventDate?.startsWith(dateStr));
  };

  const today = new Date();
  const isToday = (day: number) =>
    today.getFullYear() === year && today.getMonth() === month && today.getDate() === day;
  const isPast = (day: number) =>
    new Date(year, month, day) < new Date(today.getFullYear(), today.getMonth(), today.getDate());

  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  return (
    <>
      <SEOHead title="Calendar — Admin" noIndex />
      <div className="min-h-screen bg-[#0f0f0f]">

        {/* Page header */}
        <div className="border-b border-white/[0.06] bg-[#111111] px-6 py-5">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="block h-px w-5 bg-gold/50" />
            <span className="text-[10px] text-gold uppercase tracking-[0.2em] font-semibold">Schedule</span>
          </div>
          <div className="flex items-end justify-between">
            <h1 className="font-serif text-xl font-bold text-white tracking-widest uppercase">Calendar</h1>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentDate(new Date(year, month - 1, 1))}
                className="p-1.5 border border-white/[0.06] bg-white/[0.02] text-zinc-500 hover:text-zinc-200 hover:border-white/[0.12] transition"
                style={{ borderRadius: '4px' }}
                aria-label="Previous month"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="px-3 text-sm font-medium text-zinc-300 min-w-[140px] text-center">{monthName}</span>
              <button
                onClick={() => setCurrentDate(new Date(year, month + 1, 1))}
                className="p-1.5 border border-white/[0.06] bg-white/[0.02] text-zinc-500 hover:text-zinc-200 hover:border-white/[0.12] transition"
                style={{ borderRadius: '4px' }}
                aria-label="Next month"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="p-6 max-w-3xl">

          {/* Legend */}
          <div className="flex items-center gap-5 mb-5">
            {(Object.entries(STATUS_CONFIG) as [DayStatus, typeof STATUS_CONFIG[DayStatus]][]).map(([key, cfg]) => (
              <span key={key} className="flex items-center gap-1.5 text-xs text-zinc-500">
                <span className={`h-2 w-2 rounded-full ${cfg.dot}`} />
                {cfg.label}
              </span>
            ))}
            <span className="flex items-center gap-1.5 text-xs text-zinc-600 ml-auto">
              Click available to block · Click reserved to unblock
            </span>
          </div>

          {/* Calendar grid */}
          <div className="border border-white/[0.06] bg-[#111111] p-4" style={{ borderRadius: '4px' }}>
            {/* Day labels */}
            <div className="grid grid-cols-7 mb-2">
              {DAY_LABELS.map(d => (
                <div key={d} className="text-center text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-700 py-1">
                  {d}
                </div>
              ))}
            </div>

            {/* Day cells */}
            <div className="grid grid-cols-7 gap-1">
              {/* Empty cells for first week offset */}
              {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                <div key={`empty-${i}`} />
              ))}

              {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
                const status = getDateStatus(day);
                const booking = getBookingInfo(day);
                const cfg = STATUS_CONFIG[status];
                const past = isPast(day);
                const today = isToday(day);
                const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

                return (
                  <button
                    key={day}
                    title={
                      booking ? `${booking.customerName} — ${booking.eventType}` :
                      status === 'available' ? 'Click to block this date' :
                      status === 'reserved' ? 'Click to unblock this date' : undefined
                    }
                    disabled={status === 'booked' || past}
                    onClick={() => {
                      if (past || status === 'booked') return;
                      if (status === 'available' && confirm(`Block ${dateStr}?`)) {
                        blockMutation.mutate(dateStr);
                      } else if (status === 'reserved' && confirm(`Unblock ${dateStr}?`)) {
                        unblockMutation.mutate(dateStr);
                      }
                    }}
                    className={`
                      relative flex flex-col items-center justify-center aspect-square border transition
                      ${past ? 'border-transparent opacity-30 cursor-default text-zinc-700' : `border-white/[0.04] ${cfg.cell}`}
                      ${today ? 'ring-1 ring-gold/40' : ''}
                    `}
                    style={{ borderRadius: '4px' }}
                  >
                    <span className={`text-sm font-medium ${today ? 'text-gold' : ''}`}>{day}</span>
                    {!past && status !== 'available' && (
                      <span className={`absolute bottom-1 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full ${cfg.dot}`} />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* This month summary */}
          {bookings && (
            <div className="mt-4 border border-white/[0.06] bg-[#111111] p-4" style={{ borderRadius: '4px' }}>
              <p className="text-[10px] text-zinc-600 uppercase tracking-[0.15em] font-semibold mb-3">This Month's Bookings</p>
              {bookings.filter((b: any) => {
                const d = new Date(b.eventDate);
                return d.getFullYear() === year && d.getMonth() === month;
              }).length === 0 ? (
                <p className="text-xs text-zinc-700">No bookings this month</p>
              ) : (
                <div className="space-y-2">
                  {bookings
                    .filter((b: any) => {
                      const d = new Date(b.eventDate);
                      return d.getFullYear() === year && d.getMonth() === month;
                    })
                    .sort((a: any, b: any) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime())
                    .map((b: any) => (
                      <div key={b._id} className="flex items-center gap-3 text-xs">
                        <span className="w-6 text-center font-mono text-zinc-600">
                          {new Date(b.eventDate).getDate()}
                        </span>
                        <span className="text-zinc-300 font-medium">{b.customerName}</span>
                        <span className="text-zinc-600">{b.eventType}</span>
                        <span className={`ml-auto px-2 py-0.5 rounded-full text-[10px] ${
                          b.status === 'confirmed' ? 'bg-red-500/10 text-red-400' : 'bg-amber-500/10 text-amber-400'
                        }`}>
                          {b.status}
                        </span>
                      </div>
                    ))
                  }
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
