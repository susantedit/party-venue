import { useState } from 'react';
import axiosInstance from '@/lib/axiosInstance';
import { SEOHead } from '@/components/shared/SEOHead';
import { BUSINESS_PHONE, BUSINESS_EMAIL, BUSINESS_ADDRESS } from '@/constants';
import { FAQSection } from '@/components/sections/FAQSection';
import { PageHeader } from '@/components/ui/PageHeader';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  function set(key: string, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => { const n = { ...e }; delete n[key]; return n; });
  }

  function validate() {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Valid email is required';
    if (!form.phone.trim()) e.phone = 'Phone is required';
    if (!form.message.trim()) e.message = 'Message is required';
    return e;
  }

  async function handleSubmit(evt: React.FormEvent) {
    evt.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;
    setLoading(true);
    try {
      await axiosInstance.post('/api/v1/inquiries', form);
      setSuccess(true);
      setForm({ name: '', email: '', phone: '', message: '' });
    } catch (err: any) {
      setErrors({ submit: err?.response?.data?.message ?? 'Submission failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <SEOHead title="Contact Us" description="Get in touch with Shree Ganesh Party Venue. Call, email, or send us a message." />
      <div className="bg-zinc-950 pt-24 pb-16 px-4">
        <div className="relative z-10 mx-auto max-w-5xl">
          <PageHeader
            title="Contact Us"
            description="We'd love to hear from you. Send us a message and we'll get back to you shortly."
            breadcrumb="Contact"
          />

          <div className="grid gap-10 lg:grid-cols-2">
            {/* Info */}
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-white mb-1">Phone</h3>
                <p className="text-gray-600">{BUSINESS_PHONE}</p>
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1">Email</h3>
                <p className="text-gray-600">{BUSINESS_EMAIL}</p>
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1">Address</h3>
                <p className="text-gray-600">{BUSINESS_ADDRESS}</p>
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1">Business Hours</h3>
                <p className="text-gray-600">Sunday – Friday: 9:00 AM – 7:00 PM<br />Saturday: 10:00 AM – 5:00 PM</p>
              </div>
            </div>

            {/* Form */}
            <div className="rounded-xl border border-white/5 bg-zinc-900/30 p-6 backdrop-blur-sm">
              {success ? (
                <div className="rounded-lg bg-green-50 p-6 text-center">
                  <p className="font-medium text-green-700">Thank you! Your message has been sent. We'll get back to you soon.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {[['name','Name','text'],['email','Email','email'],['phone','Phone','tel']].map(([key, label, type]) => (
                    <div key={key}>
                      <label className="mb-1 block text-sm font-medium text-gray-700">{label} *</label>
                      <input type={type} value={(form as any)[key]} onChange={e => set(key, e.target.value)}
                        className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500" />
                      {errors[key] && <p className="mt-1 text-xs text-red-600">{errors[key]}</p>}
                    </div>
                  ))}
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Message *</label>
                    <textarea value={form.message} onChange={e => set('message', e.target.value)} rows={4}
                      className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500" />
                    {errors.message && <p className="mt-1 text-xs text-red-600">{errors.message}</p>}
                  </div>
                  {errors.submit && <p className="text-sm text-red-600">{errors.submit}</p>}
                  <button type="submit" disabled={loading}
                    className="w-full rounded-lg bg-gold-500 py-2 font-semibold text-white transition hover:bg-gold-600 disabled:opacity-50">
                    {loading ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
      <FAQSection title="Common Questions" subtitle="Quick answers before you reach out." limit={6} />
    </>
  );
}
