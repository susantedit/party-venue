import { useState, useEffect } from 'react';
import axiosInstance from '@/lib/axiosInstance';
import { EVENT_TYPES } from '@/constants';

type AvailabilityStatus = 'available' | 'reserved' | 'booked' | null;

function useAvailability(date: string): { status: AvailabilityStatus; loading: boolean } {
  const [status, setStatus] = useState<AvailabilityStatus>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!date) { setStatus(null); return; }
    const t = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get('/api/v1/availability', { params: { date } });
        setStatus(res.data.data.status);
      } catch { setStatus(null); }
      finally { setLoading(false); }
    }, 500);
    return () => clearTimeout(t);
  }, [date]);

  return { status, loading };
}

const statusColor = { available: 'text-green-600', reserved: 'text-yellow-600', booked: 'text-red-600' };
const statusLabel = { available: '✓ Available', reserved: '⚠ Reserved — may be taken', booked: '✗ Already booked' };

interface BookingFormProps {
  prefilledPackageId?: string;
}

export default function BookingForm({ prefilledPackageId }: BookingFormProps) {
  const [form, setForm] = useState({
    customerName: '', phone: '', email: '',
    eventType: EVENT_TYPES[0], eventDate: '',
    guestCount: '', packageId: prefilledPackageId ?? '',
    cateringRequired: false, decorationRequired: false, notes: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState('');

  const { status: avail, loading: availLoading } = useAvailability(form.eventDate);

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
      setErrors({ eventDate: 'This date is already booked. Please choose another date.' });
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
        guestCount: Number(form.guestCount),
        packageId: form.packageId || undefined,
        cateringRequired: form.cateringRequired,
        decorationRequired: form.decorationRequired,
        notes: form.notes || undefined,
      });
      setSuccess(`Booking submitted! Your ID: ${res.data.data.bookingId}. We'll contact you soon.`);
      setForm({ customerName: '', phone: '', email: '', eventType: EVENT_TYPES[0], eventDate: '', guestCount: '', packageId: '', cateringRequired: false, decorationRequired: false, notes: '' });
    } catch (err: any) {
      setErrors({ submit: err?.response?.data?.message ?? 'Submission failed. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  }

  const field = (label: string, key: string, props: React.InputHTMLAttributes<HTMLInputElement> = {}) => (
    <div>
      <label className="mb-1 block text-sm font-medium text-gray-700">{label}{props.required !== false && ' *'}</label>
      <input
        {...props}
        value={(form as any)[key]}
        onChange={(e) => set(key, e.target.value)}
        className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500"
      />
      {errors[key] && <p className="mt-1 text-xs text-red-600">{errors[key]}</p>}
    </div>
  );

  if (success) return (
    <div className="rounded-xl bg-green-50 border border-green-200 p-6 text-center">
      <p className="text-green-700 font-medium">{success}</p>
      <button onClick={() => setSuccess('')} className="mt-4 text-sm text-green-600 underline">Submit another booking</button>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        {field('Full Name', 'customerName', { placeholder: 'Your full name' })}
        {field('Phone', 'phone', { placeholder: '9800000000', type: 'tel' })}
        {field('Email', 'email', { placeholder: 'you@email.com', type: 'email' })}

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Event Type *</label>
          <select value={form.eventType} onChange={(e) => set('eventType', e.target.value)}
            className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500">
            {EVENT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Event Date *</label>
          <input type="date" value={form.eventDate} min={new Date().toISOString().split('T')[0]}
            onChange={(e) => set('eventDate', e.target.value)}
            className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500"
          />
          {form.eventDate && (
            <p className={`mt-1 text-xs font-medium ${avail ? statusColor[avail] : 'text-gray-400'}`}>
              {availLoading ? 'Checking...' : avail ? statusLabel[avail] : ''}
            </p>
          )}
          {errors.eventDate && <p className="mt-1 text-xs text-red-600">{errors.eventDate}</p>}
        </div>

        {field('Number of Guests', 'guestCount', { type: 'number', min: '1', placeholder: '200' })}
      </div>

      <div className="flex gap-6">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.cateringRequired} onChange={(e) => set('cateringRequired', e.target.checked)} />
          Catering Required
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.decorationRequired} onChange={(e) => set('decorationRequired', e.target.checked)} />
          Decoration Required
        </label>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Additional Notes</label>
        <textarea value={form.notes} onChange={(e) => set('notes', e.target.value)} rows={3}
          placeholder="Any special requirements..."
          className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500" />
      </div>

      {errors.submit && <p className="text-sm text-red-600">{errors.submit}</p>}

      <button type="submit" disabled={submitting}
        className="w-full rounded-lg bg-gold-500 py-3 font-semibold text-white transition hover:bg-gold-600 disabled:opacity-50 sm:w-auto sm:px-8">
        {submitting ? 'Submitting...' : 'Submit Booking'}
      </button>
    </form>
  );
}
