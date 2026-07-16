import { useState, useEffect } from 'react';
import axiosInstance from '@/lib/axiosInstance';
import { EVENT_TYPES, BOOKING_SHIFTS } from '@/constants';
import { trackBookingFormSubmit } from '@/lib/analytics';

type AvailabilityStatus = 'available' | 'reserved' | 'booked' | null;
type ShiftType = typeof BOOKING_SHIFTS[number];

function useAvailability(date: string, shift: ShiftType): { status: AvailabilityStatus; loading: boolean } {
  const [status, setStatus] = useState<AvailabilityStatus>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!date) { setStatus(null); return; }
    const t = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get('/api/v1/availability', { params: { date, shift } });
        setStatus(res.data.data.status);
      } catch { setStatus(null); }
      finally { setLoading(false); }
    }, 500);
    return () => clearTimeout(t);
  }, [date, shift]);

  return { status, loading };
}

const statusColor = { available: 'text-green-400', reserved: 'text-yellow-400', booked: 'text-red-400' };
const statusLabel = { available: '✓ Available', reserved: '⚠ Reserved — may be taken', booked: '✗ Already booked' };

const SHIFT_DESCRIPTIONS: Record<ShiftType, string> = {
  Morning: 'Morning (6 AM – 2 PM)',
  Evening: 'Evening (3 PM – 11 PM)',
  Whole_Day: 'Whole Day (6 AM – 11 PM)',
};

const inputCls = 'w-full border border-gold/20 bg-[#0a0a0a] text-zinc-200 px-4 py-3 text-base font-sans focus:outline-none focus:border-gold transition-colors placeholder:text-zinc-600';
const labelCls = 'block mb-1.5 text-xs font-sans font-semibold uppercase tracking-widest text-zinc-500';

interface BookingFormProps {
  prefilledPackageId?: string;
}

export default function BookingForm({ prefilledPackageId }: BookingFormProps) {
  const [form, setForm] = useState({
    customerName: '', phone: '', email: '',
    eventType: EVENT_TYPES[0],
    eventDate: '',
    shift: 'Whole_Day' as ShiftType,
    guestCount: '',
    packageId: prefilledPackageId ?? '',
    cateringRequired: false,
    decorationRequired: false,
    notes: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState('');

  const { status: avail, loading: availLoading } = useAvailability(form.eventDate, form.shift);

  function set(key: string, value: unknown) {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => { const n = { ...e }; delete n[key]; return n; });
  }

  function validate() {
    const e: Record<string, string> = {};
    if (!form.customerName.trim()) e.customerName = 'Full name is required';
    if (!form.phone.trim()) e.phone = 'Phone is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Valid email is required';
    if (!form.eventDate) e.eventDate = 'Event date is required';
    if (!form.guestCount || Number(form.guestCount) < 1) e.guestCount = 'At least 1 guest required';
    return e;
  }

  async function handleSubmit(evt: React.FormEvent) {
    evt.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;
    if (avail === 'booked') {
      setErrors({ eventDate: 'This shift is already booked. Please choose a different date or shift.' });
      return;
    }
    setSubmitting(true);
    try {
      const res = await axiosInstance.post('/api/v1/bookings', {
        customerName: form.customerName,
        phone: form.phone,
        email: form.email,
        eventType: form.eventType,
        eventDate: form.eventDate,
        shift: form.shift,
        guestCount: Number(form.guestCount),
        packageId: form.packageId || undefined,
        cateringRequired: form.cateringRequired,
        decorationRequired: form.decorationRequired,
        notes: form.notes || undefined,
      });
      setSuccess(`Booking submitted! Your ID: ${res.data.data.bookingId}. We'll contact you within 30 minutes.`);
      trackBookingFormSubmit('booking_page');
      setForm({ customerName: '', phone: '', email: '', eventType: EVENT_TYPES[0], eventDate: '', shift: 'Whole_Day', guestCount: '', packageId: '', cateringRequired: false, decorationRequired: false, notes: '' });
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setErrors({ submit: msg ?? 'Submission failed. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  }

  if (success) return (
    <div className="border border-gold/20 bg-gold/5 p-8 text-center">
      <p className="font-serif text-xl text-white tracking-wider mb-2">✓ Booking Submitted!</p>
      <p className="font-sans text-zinc-300 text-sm">{success}</p>
      <button onClick={() => setSuccess('')}
        className="mt-6 text-xs font-sans text-gold underline underline-offset-2">
        Submit another booking
      </button>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        {/* Name */}
        <div>
          <label htmlFor="bf-name" className={labelCls}>Full Name *</label>
          <input id="bf-name" type="text" value={form.customerName} onChange={(e) => set('customerName', e.target.value)}
            placeholder="Your full name" className={inputCls} aria-required="true"
            aria-describedby={errors.customerName ? 'bf-name-err' : undefined} />
          {errors.customerName && <p id="bf-name-err" className="mt-1 text-xs text-red-400 font-sans" role="alert">{errors.customerName}</p>}
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="bf-phone" className={labelCls}>Phone *</label>
          <input id="bf-phone" type="tel" value={form.phone} onChange={(e) => set('phone', e.target.value)}
            placeholder="98XXXXXXXX" className={inputCls} aria-required="true"
            aria-describedby={errors.phone ? 'bf-phone-err' : undefined} />
          {errors.phone && <p id="bf-phone-err" className="mt-1 text-xs text-red-400 font-sans" role="alert">{errors.phone}</p>}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="bf-email" className={labelCls}>Email *</label>
          <input id="bf-email" type="email" value={form.email} onChange={(e) => set('email', e.target.value)}
            placeholder="you@email.com" className={inputCls} aria-required="true"
            aria-describedby={errors.email ? 'bf-email-err' : undefined} />
          {errors.email && <p id="bf-email-err" className="mt-1 text-xs text-red-400 font-sans" role="alert">{errors.email}</p>}
        </div>

        {/* Event Type */}
        <div>
          <label htmlFor="bf-event-type" className={labelCls}>Event Type *</label>
          <select id="bf-event-type" value={form.eventType} onChange={(e) => set('eventType', e.target.value)} className={inputCls} aria-required="true">
            {EVENT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        {/* Event Date */}
        <div>
          <label htmlFor="bf-date" className={labelCls}>Event Date *</label>
          <input id="bf-date" type="date" value={form.eventDate} min={new Date().toISOString().split('T')[0]}
            onChange={(e) => set('eventDate', e.target.value)} className={inputCls} aria-required="true"
            aria-describedby={errors.eventDate ? 'bf-date-err' : 'bf-date-hint'} />
          {form.eventDate && (
            <p id="bf-date-hint" className={`mt-1 text-xs font-sans font-medium ${avail ? statusColor[avail] : 'text-zinc-500'}`}>
              {availLoading ? 'Checking availability...' : avail ? statusLabel[avail] : ''}
            </p>
          )}
          {errors.eventDate && <p id="bf-date-err" className="mt-1 text-xs text-red-400 font-sans" role="alert">{errors.eventDate}</p>}
        </div>

        {/* Shift */}
        <div>
          <label htmlFor="bf-shift" className={labelCls}>Shift *</label>
          <select id="bf-shift" value={form.shift} onChange={(e) => set('shift', e.target.value as ShiftType)} className={inputCls} aria-required="true" aria-describedby="bf-shift-hint">
            {BOOKING_SHIFTS.map((s) => (
              <option key={s} value={s}>{SHIFT_DESCRIPTIONS[s]}</option>
            ))}
          </select>
          <p id="bf-shift-hint" className="mt-1 text-xs font-sans text-zinc-500">
            Whole Day blocks both Morning &amp; Evening slots.
          </p>
        </div>

        {/* Guest Count */}
        <div>
          <label htmlFor="bf-guests" className={labelCls}>Number of Guests *</label>
          <input id="bf-guests" type="number" min="1" value={form.guestCount}
            onChange={(e) => set('guestCount', e.target.value)} placeholder="e.g. 200" className={inputCls} aria-required="true"
            aria-describedby={errors.guestCount ? 'bf-guests-err' : undefined} />
          {errors.guestCount && <p id="bf-guests-err" className="mt-1 text-xs text-red-400 font-sans" role="alert">{errors.guestCount}</p>}
        </div>
      </div>

      {/* Checkboxes */}
      <div className="flex gap-6 font-sans text-sm text-zinc-300">
        <label className="flex items-center gap-2 cursor-pointer">
          <input id="bf-catering" type="checkbox" checked={form.cateringRequired} onChange={(e) => set('cateringRequired', e.target.checked)}
            className="accent-gold" />
          Catering Required
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input id="bf-decoration" type="checkbox" checked={form.decorationRequired} onChange={(e) => set('decorationRequired', e.target.checked)}
            className="accent-gold" />
          Decoration Required
        </label>
      </div>

      {/* Notes */}
      <div>
        <label htmlFor="bf-notes" className={labelCls}>Additional Notes</label>
        <textarea id="bf-notes" value={form.notes} onChange={(e) => set('notes', e.target.value)} rows={3}
          placeholder="Any special requirements, theme preferences, dietary needs..."
          className={inputCls + ' resize-none'} />
      </div>

      {/* Disclaimer */}
      <div className="border border-gold/15 bg-gold/[0.03] p-4 font-sans text-xs text-zinc-400 space-y-1">
        <p className="text-gold font-semibold">✓ No payment required now.</p>
        <p>We confirm only after mutual discussion. Advance collected only after agreement.</p>
      </div>

      {errors.submit && <p className="text-sm text-red-400 font-sans">{errors.submit}</p>}

      <button type="submit" disabled={submitting}
        className="w-full font-serif tracking-[0.14em] uppercase text-sm py-4 bg-gold hover:bg-gold/90 text-zinc-950 font-semibold transition-all duration-150 disabled:opacity-50 shadow-[0_0_20px_rgba(201,168,76,0.2)]"
        style={{ borderRadius: '2px' }}>
        {submitting ? 'Submitting...' : 'Submit Booking Request'}
      </button>
    </form>
  );
}
