import { Link } from 'react-router-dom';
import { SEOHead } from '@/components/shared/SEOHead';
import { FAQSection } from '@/components/sections/FAQSection';
import { SITE_URL } from '@/constants';

const BREADCRUMB_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
    { '@type': 'ListItem', position: 2, name: 'Catering Service in Bhaktapur', item: `${SITE_URL}/catering-service-bhaktapur` },
  ],
};

const cuisines = [
  { name: 'Nepali', desc: 'Traditional dal bhat, thali sets, and authentic Nepali dishes.' },
  { name: 'Newari', desc: 'Samaybaji, bara, chatamari, and ceremonial Newari feasts.' },
  { name: 'Indian', desc: 'Buffet selections with curries, breads, and tandoor specialties.' },
  { name: 'Chinese', desc: 'Family-style platters, noodles, stir-fries, and soups.' },
  { name: 'BBQ', desc: 'Grilled meats, skewers, and live BBQ station options.' },
];

export default function CateringPage() {
  return (
    <>
      <SEOHead
        title="Catering Service in Bhaktapur, Nepal | Shree Ganesh Catering"
        description="Nepali, Newari, Indian, Chinese, and BBQ catering for events in Bhaktapur."
        canonicalUrl={`${SITE_URL}/catering-service-bhaktapur`}
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
              <li className="text-zinc-300">Catering Service in Bhaktapur</li>
            </ol>
          </nav>

          {/* Heading */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <span className="block h-px w-14 bg-gradient-to-r from-transparent to-gold/60" />
              <span className="font-script text-gold text-2xl leading-none">Multi-Cuisine Catering</span>
              <span className="block h-px w-14 bg-gradient-to-l from-transparent to-gold/60" />
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl font-bold text-white tracking-widest uppercase mt-2">
              Catering Service in Bhaktapur, Nepal
            </h1>
          </div>

          {/* Lead paragraph */}
          <p className="font-sans text-lg text-zinc-300 leading-relaxed mb-8 italic">
            Authentic multi-cuisine catering for every occasion. Our experienced kitchen team delivers exceptional flavours for events of all sizes in Bhaktapur and the Kathmandu Valley.
          </p>

          {/* Body copy */}
          <div className="space-y-5 font-sans text-base text-zinc-400 leading-relaxed mb-10">
            <p>
              Shree Ganesh Party Venue And Catering Service offers authentic{' '}
              <strong className="text-white">Nepali, Newari, Indian, Chinese, and BBQ</strong>{' '}
              catering in Bhaktapur and surrounding areas. Event-specific menu choices are confirmed with our team before your event date.
            </p>
            <p>
              Whether you are planning a wedding, reception, Bratabandha, Pasni, birthday, or corporate event, our kitchen team customises the menu to match your guest count, preferences, and budget.
            </p>
            <p>
              We are conveniently located near Suryabinayak Ganesh Mandir.{' '}
              <Link to="/location" className="text-gold hover:opacity-80 transition-opacity underline underline-offset-2">
                View our location and directions
              </Link>
              . We also offer a dedicated{' '}
              <Link to="/wedding-venue-bhaktapur" className="text-gold hover:opacity-80 transition-opacity underline underline-offset-2">
                wedding venue in Bhaktapur
              </Link>{' '}
              for full event packages.
            </p>
          </div>

          {/* Cuisine type cards */}
          <div className="grid grid-cols-1 gap-px sm:grid-cols-5 border border-gold/10 mb-10">
            {cuisines.map((c) => (
              <div key={c.name} className="p-5 text-center border border-gold/15 bg-[rgba(255,255,255,0.02)]">
                <p className="font-serif text-base font-bold text-gold tracking-wider uppercase mb-2">{c.name}</p>
                <p className="font-sans text-xs text-zinc-500 leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>

          {/* CTA buttons */}
          <div className="flex flex-wrap gap-4 mb-12">
            <Link
              to="/contact"
              className="font-serif tracking-[0.14em] uppercase text-xs px-8 py-3.5 bg-gold hover:bg-gold/90 text-zinc-950 font-semibold transition-all duration-150 shadow-[0_0_16px_rgba(201,168,76,0.2)]"
              style={{ borderRadius: '2px' }}
            >
              Request Catering Quote
            </Link>
            <Link
              to="/menu"
              className="font-serif tracking-[0.14em] uppercase text-xs px-8 py-3.5 border border-gold/40 hover:border-gold text-gold hover:bg-gold/5 transition-all duration-150"
              style={{ borderRadius: '2px' }}
            >
              View Full Menu
            </Link>
          </div>
        </div>
      </section>

      {/* ── FAQ SECTION ── */}
      <FAQSection title="Catering FAQs" subtitle="Common questions about our catering services." limit={5} showSchema />

      {/* ── BOTTOM CTA STRIP ── */}
      <section className="bg-[#0a0a0a] border-t border-gold/15 py-16 px-4 text-center">
        <div className="mx-auto max-w-xl">
          <span className="font-script text-gold text-2xl block mb-2">Get a Quote</span>
          <h2 className="font-serif text-3xl font-bold text-white tracking-widest uppercase mb-4">
            Plan Your Catering Today
          </h2>
          <p className="font-sans text-zinc-400 italic mb-8">
            Tell us about your event and guest count — we'll put together a custom menu and quote.
          </p>
          <Link
            to="/contact"
            className="inline-block font-serif tracking-[0.14em] uppercase text-sm px-10 py-4 bg-gold hover:bg-gold/90 text-zinc-950 font-semibold shadow-[0_0_24px_rgba(201,168,76,0.25)] transition-all duration-150"
            style={{ borderRadius: '2px' }}
          >
            Request Catering Quote
          </Link>
        </div>
      </section>
    </>
  );
}
