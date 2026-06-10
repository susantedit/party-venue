import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '@/lib/axiosInstance';
import { SEOHead } from '@/components/shared/SEOHead';

export default function AdminCalendarPage() {
  const qc = useQueryClient();
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  const { data: bookings } = useQuery({
    queryKey: ['calendar-bookings', year, month],
    queryFn: () => axiosInstance.get('/api/v1/bookings', { params: { limit: 100 } }).then(r => r.data.data),
  });

  const blockMutation = useMutation({
    mutationFn: (date: string) => axiosInstance.post('/api/v1/availability/block', { date }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['calendar-bookings'] }),
  });

  const getDateStatus = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const booking = bookings?.find((b: any) => b.eventDate?.startsWith(dateStr));
    if (!booking) return 'available';
    return booking.status === 'confirmed' ? 'booked' : 'reserved';
  };

  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  return (
    <>
      <SEOHead title="Availability Calendar" noIndex />
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="font-serif text-2xl font-bold text-charcoal">Calendar</h1>
          <div className="flex gap-2">
            <button onClick={() => setCurrentDate(new Date(year, month - 1, 1))} className="rounded-lg border px-3 py-1">‹</button>
            <span className="px-4 py-1 font-medium">{monthName}</span>
            <button onClick={() => setCurrentDate(new Date(year, month + 1, 1))} className="rounded-lg border px-3 py-1">›</button>
          </div>
        </div>

        <div className="mb-2 flex gap-3 text-sm">
          <span className="flex items-center gap-1"><span className="h-3 w-3 rounded-full bg-green-400" /> Available</span>
          <span className="flex items-center gap-1"><span className="h-3 w-3 rounded-full bg-yellow-400" /> Reserved</span>
          <span className="flex items-center gap-1"><span className="h-3 w-3 rounded-full bg-red-400" /> Booked</span>
        </div>

        <div className="rounded-xl bg-white p-4 shadow-sm">
          <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-gray-400 mb-2">
            {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => <div key={d}>{d}</div>)}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: firstDayOfMonth }).map((_, i) => <div key={`e-${i}`} />)}
            {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
              const status = getDateStatus(day);
              const color = status === 'booked' ? 'bg-red-100 text-red-700' : status === 'reserved' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-50 text-green-700 hover:bg-green-100';
              const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
              return (
                <button
                  key={day}
                  className={`rounded-lg py-2 text-sm font-medium transition ${color}`}
                  onClick={() => status === 'available' && confirm(`Block ${dateStr}?`) && blockMutation.mutate(dateStr)}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
