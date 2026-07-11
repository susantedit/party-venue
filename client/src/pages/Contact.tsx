import { useState } from 'react';
import axiosInstance from '@/lib/axiosInstance';
import { SEOHead } from '@/components/shared/SEOHead';
import { BUSINESS_PHONE, BUSINESS_EMAIL, BUSINESS_ADDRESS } from '@/constants';
import { FAQSection } from '@/components/sections/FAQSection';

function SectionHeader({ script, title, subtitle }: { script: string; title: string; subtitle?: string }) {
  return (
    <div className="text-center mb-14">
      <div className="flex items-center justify-center gap-3 mb-1">
        <span className="block h-px w-14 bg-gradient-to-r from-transparent to-gold/60" />
        <span className="font-script text-gold text-2xl leading-none">{script}</span>
        <span className="block h-px w-14 bg-gradient-to-l from-transparent to-gold/60" />
      </div>
      <h1 className="font-serif text-4xl sm:text-5xl font-bold text-white tracking-widest uppercase mt-2">{title}</h1>
      {subtitle && <p className="mt-4 font-sans text-lg italic text-zinc-400 max-w-xl mx-auto">{subtitle}</p>}
    </div>
  );
}

const inputCls = 'w-full border border-gold/20 bg-[#0a0a0a] text-zinc-200 px-4 py-3 text-base font-sans focus:outline-none focus:border-gold transition-colors placeholder:text-zinc-600';

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
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setErrors({ submit: msg ?? 'Submission failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <SEOHead title="Contact Us" description="Get in touch with Shree Ganesh Party Venue. Call, email, or send us a message." />
      <div className="bg-[#0a0a0a] pt-28 pb-16 px-4">
        <div className="mx-auto max-w-6xl">
          <SectionHeader script="Get in Touch" title="Contact Us"
            subtitle="We'd love to hear from you. Send us a message and we'll get back to you shortly." />

          <div className="grid gap-8 lg:grid-cols-2 mb-16">
            {/* Info panel */}
            <div className="border border-gold/15 bg-[rgba(255,255,255,0.02)] p-8 flex flex-col justify-between">
              <div>
                <span className="font-script text-gold text-xl block mb-2">Reach Us</span>
                <h2 className="font-serif text-2xl font-bold text-white tracking-wider uppercase mb-6">Our Details</h2>
                <div className="space-y-5 font-sans text-zinc-400">
                  {[
                    { icon: '📞', label: 'Phone', value: BUSINESS_PHONE, href: 'tel:+9779851337076' },
                    { icon: '✉️', label: 'Email', value: BUSINESS_EMAIL, href: `mailto:${BUSINESS_EMAIL}` },
                    { icon: '📍', label: 'Address', value: BUSINESS_ADDRESS },
                    { icon: '⏰', label: 'Hours', value: 'Sun – Sat: 9:00 AM – 7:00 PM' },
                  ].map(({ icon, label, value, href }) => (
                    <div key={label} className="flex gap-3">
                      <span className="text-xl mt-0.5">{icon}</span>
                      <div>
                        <p className="text-xs font-sans font-semibold uppercase tracking-widest text-zinc-500 mb-0.5">{label}</p>
                        {href ? (
                          <a href={href} className="text-base text-zinc-300 hover:text-gold transition-colors">{value}</a>
                        ) : (
                          <p className="text-base text-zinc-300">{value}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-8 pt-6 border-t border-gold/10">
                <a href="https://wa.me/9779851337076?text=Hi%20Shree%20Ganesh%20Party%20Venue%2C%20I%20have%20an%20enquiry."
                  target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 font-serif tracking-[0.12em] uppercase text-xs px-6 py-3 bg-[#25D366] hover:bg-[#20bb5a] text-white font-semibold transition-all duration-150"
                  style={{ borderRadius: '2px' }}>
                  💬 WhatsApp Us
                </a>
              </div>
            </div>

            {/* Form */}
            <div className="border border-gold/15 bg-[rgba(255,255,255,0.02)] p-8">
              {success ? (
                <div className="flex flex-col items-center justify-center h-full text-center gap-4 py-12">
                  <span className="text-4xl">✓</span>
                  <p className="font-serif text-xl text-white tracking-wider">Message Sent!</p>
                  <p className="font-sans text-zinc-400">Thank you — we'll get back to you soon.</p>
                  <button onClick={() => setSuccess(false)}
                    className="mt-4 text-sm font-sans text-gold underline underline-offset-2">
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {[
                    { key: 'name', label: 'Full Name', type: 'text', placeholder: 'Your name' },
                    { key: 'email', label: 'Email Address', type: 'email', placeholder: 'you@email.com' },
                    { key: 'phone', label: 'Phone Number', type: 'tel', placeholder: '98XXXXXXXX' },
                  ].map(({ key, label, type, placeholder }) => (
                    <div key={key}>
                      <label className="block mb-1.5 text-xs font-sans font-semibold uppercase tracking-widest text-zinc-500">{label} *</label>
                      <input type={type} value={(form as Record<string, string>)[key]}
                        onChange={(e) => set(key, e.target.value)} placeholder={placeholder} className={inputCls} />
                      {errors[key] && <p className="mt-1 text-xs text-red-400 font-sans">{errors[key]}</p>}
                    </div>
                  ))}
                  <div>
                    <label className="block mb-1.5 text-xs font-sans font-semibold uppercase tracking-widest text-zinc-500">Message *</label>
                    <textarea value={form.message} onChange={(e) => set('message', e.target.value)} rows={4}
                      placeholder="Tell us about your event..." className={inputCls + ' resize-none'} />
                    {errors.message && <p className="mt-1 text-xs text-red-400 font-sans">{errors.message}</p>}
                  </div>
                  {errors.submit && <p className="text-sm text-red-400 font-sans">{errors.submit}</p>}
                  <button type="submit" disabled={loading}
                    className="w-full font-serif tracking-[0.14em] uppercase text-xs py-3.5 bg-gold hover:bg-gold/90 text-zinc-950 font-semibold transition-all duration-150 disabled:opacity-50"
                    style={{ borderRadius: '2px' }}>
                    {loading ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Google Map */}
          <div className="h-[380px] border border-gold/15 overflow-hidden">
            <iframe title="Shree Ganesh Party Venue Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3534.1635!2d85.4192105!3d27.6568609!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb110c2267df35%3A0x7ebc0c5dd5079595!2sShree%20Ganesh%20Party%20Venue%20And%20Catering%20Service!5e0!3m2!1sen!2snp!4v1690000000000!5m2!1sen!2snp"
              className="w-full h-full border-0 grayscale-[50%] hover:grayscale-0 transition-all duration-500"
              allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
          </div>
        </div>
      </div>
      <FAQSection title="Common Questions" subtitle="Quick answers before you reach out." limit={6} />
    </>
  );
}
