import { Link } from 'react-router-dom';
import { SEOHead } from '@/components/shared/SEOHead';
import { FAQSection } from '@/components/sections/FAQSection';
import { SITE_URL } from '@/constants';

const BREADCRUMB_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
    { '@type': 'ListItem', position: 2, name: 'Wedding Venue in Bhaktapur', item: `${SITE_URL}/wedding-venue-bhaktapur` },
  ],
};

const stats = [
  { label: 'Guest Capacity', value: '700-1000' },
  { label: 'Event Type', value: 'Wedding & Reception' },
  { label: 'Location', value: 'Bhaktapur' },
];

export default function WeddingVenuePage() {
  return (
    <>
      <SEOHead
        title="Wedding Venue in Bhaktapur, Nepal | Shree Ganesh Party Venue"
        description="Verified wedding venue near Suryabinayak Ganesh Mandir with capacity for up to 1000 guests."
        canonicalUrl={`${SITE_URL}/wedding-venue-bhaktapur`}
        schema={[BREADCRUMB_SCHEMA]}
      />

      {/* ── HERO SECTION ── */}
      <section className="bg-[#0a0a0a] pt-28 pb-20 px-4">
        <div className="mx-auto max-w-4xl">

          {/* Breadcrumb */}
          <nav className="mb-8" aria-label="Breadcrumb">
            <ol className="flex items-center gap-2 font-sans text-xs text-zinc-400">
              <li><Link to="/" className="hover:text-gold transition-colors">Home</Link></li>
              <li aria-hidden="true" className="text-zinc-600">/</li>
              <li className="text-zinc-300">Wedding Venue in Bhaktapur</li>
            </ol>
          </nav>

          {/* Heading */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <span className="block h-px w-14 bg-gradient-to-r from-transparent to-gold/60" />
              <span className="font-script text-gold text-2xl leading-none">Premium Wedding Venue</span>
              <span className="block h-px w-14 bg-gradient-to-l from-transparent to-gold/60" />
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl font-bold text-white tracking-widest uppercase mt-2">
              Wedding Venue in Bhaktapur, Nepal
            </h1>
          </div>

          {/* Lead paragraph */}
          <p className="font-sans text-lg text-zinc-300 leading-relaxed mb-8 italic">
            Celebrate your most important day at Shree Ganesh Party Venue — Bhaktapur's premier wedding destination near Suryabinayak Ganesh Mandir, with verified capacity for up to 1000 guests.
          </p>

          {/* Body copy */}
          <div className="space-y-5 font-sans text-base text-zinc-400 leading-relaxed mb-10">
            <p>
              Shree Ganesh Party Venue And Catering Service is a <strong className="text-white">wedding venue in Bhaktapur, Nepal</strong> located near Suryabinayak Ganesh Mandir. Our verified capacity is 700–1000 guests depending on setup, and we support full wedding and reception planning with catering and coordination.
            </p>
            <p>
              Our wedding packages include décor, menu selection, seating layout, and full event coordination. Every detail is confirmed with our team before your date is locked in — no surprises on the day.
            </p>
            <p>
              The venue is conveniently accessible for guests coming from Bhaktapur, Suryabinayak, Kathmandu, and Lalitpur.{' '}
              <Link to="/location" className="text-gold hover:opacity-80 transition-opacity underline underline-offset-2">
                View the full location and directions
              </Link>
              . We also offer{' '}
              <Link to="/catering-service-bhaktapur" className="text-gold hover:opacity-80 transition-opacity underline underline-offset-2">
                professional catering services in Bhaktapur
              </Link>{' '}
              for weddings and other events.
            </p>
          </div>

          {/* Stat blocks */}
          <div className="grid grid-cols-1 gap-px sm:grid-cols-3 border border-gold/10 mb-10">
            {stats.map((s) => (
              <div key={s.label} className="text-center p-7 border border-gold/15 bg-[rgba(255,255,255,0.02)]">
                <p className="font-serif text-3xl font-bold text-gold">{s.value}</p>
                <p className="mt-1 text-xs font-sans font-semibold uppercase tracking-widest text-zinc-500">{s.label}</p>
              </div>
            ))}
          </div>

          {/* CTA buttons */}
          <div className="flex flex-wrap gap-4 mb-12">
            <Link
              to="/booking?event=Wedding"
              className="font-serif tracking-[0.14em] uppercase text-xs px-8 py-3.5 bg-gold hover:bg-gold/90 text-zinc-950 font-semibold transition-all duration-150 shadow-[0_0_16px_rgba(201,168,76,0.2)]"
              style={{ borderRadius: '2px' }}
            >
              Book Wedding Venue
            </Link>
            <Link
              to="/packages"
              className="font-serif tracking-[0.14em] uppercase text-xs px-8 py-3.5 border border-gold/40 hover:border-gold text-gold hover:bg-gold/5 transition-all duration-150"
              style={{ borderRadius: '2px' }}
            >
              View Packages
            </Link>
          </div>
        </div>
      </section>

      {/* ── FAQ SECTION ── */}
      <FAQSection title="Wedding Venue FAQs" subtitle="Common questions about wedding bookings and venue details." limit={5} showSchema />

      {/* ── BOTTOM CTA STRIP ── */}
      <section className="bg-[#0a0a0a] border-t border-gold/15 py-16 px-4 text-center">
        <div className="mx-auto max-w-xl">
          <span className="font-script text-gold text-2xl block mb-2">Ready to Book?</span>
          <h2 className="font-serif text-3xl font-bold text-white tracking-widest uppercase mb-4">
            Secure Your Wedding Date
          </h2>
          <p className="font-sans text-zinc-400 italic mb-8">
            Popular dates fill fast. Reserve your date today — no payment required upfront.
          </p>
          <Link
            to="/booking?event=Wedding"
            className="inline-block font-serif tracking-[0.14em] uppercase text-sm px-10 py-4 bg-gold hover:bg-gold/90 text-zinc-950 font-semibold shadow-[0_0_24px_rgba(201,168,76,0.25)] transition-all duration-150"
            style={{ borderRadius: '2px' }}
          >
            Book Now
          </Link>
        </div>
      </section>
    </>
  );
}
