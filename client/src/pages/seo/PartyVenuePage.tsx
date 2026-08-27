import { Link } from 'react-router-dom';
import { SEOHead } from '@/components/shared/SEOHead';
import { FAQSection } from '@/components/sections/FAQSection';
import { BUSINESS_ADDRESS, BUSINESS_PHONE, MAP_EMBED_URL, MAP_URL, SITE_URL, WHATSAPP_NUMBER } from '@/constants';
import { trackDirectionsClick } from '@/lib/analytics';

const BREADCRUMB_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
    { '@type': 'ListItem', position: 2, name: 'Party Venue in Bhaktapur', item: `${SITE_URL}/party-venue-in-bhaktapur` },
  ],
};

const VENUE_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': ['EventVenue', 'LocalBusiness'],
  '@id': `${SITE_URL}/party-venue-in-bhaktapur#venue`,
  name: 'Shree Ganesh Party Venue And Catering Service',
  alternateName: [
    'Party Venue Near Suryabinayak Bhaktapur',
    'Best Party Palace in Bhaktapur',
    'Shree Ganesh Party Palace Bhaktapur'
  ],
  description: 'Premier party venue and banquet palace near Suryabinayak Ganesh Mandir in Bhaktapur. 700-1000 guest capacity, multi-cuisine catering, dedicated parking for 50+ cars and 200+ bikes.',
  url: `${SITE_URL}/party-venue-in-bhaktapur`,
  telephone: BUSINESS_PHONE,
  priceRange: '$$',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Near Suryabinayak Ganesh Mandir',
    addressLocality: 'Bhaktapur',
    postalCode: '44800',
    addressRegion: 'Bagmati Province',
    addressCountry: 'NP',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 27.6568562,
    longitude: 85.4217854,
  },
  hasMap: 'https://www.google.com/maps/place/Shree+Ganesh+Party+Venue+And+Catering+Service/@27.6568496,85.4216766',
  openingHours: 'Mo,Tu,We,Th,Fr,Sa,Su 06:00-23:00',
};

const stats = [
  { label: 'Guest Capacity', value: '700-1000' },
  { label: 'Parking Spaces', value: '250+' },
  { label: 'Location', value: 'Suryabinayak, Bhaktapur' },
];

const highlights = [
  {
    title: 'Prime Suryabinayak Location',
    desc: 'Located just steps away from the sacred Suryabinayak Ganesh Mandir with quick, direct access from Arniko Highway.',
  },
  {
    title: 'Spacious Banquet & Lawn',
    desc: 'Grand weatherproof indoor banquet hall plus elegant open-air outdoor lawns accommodating 700 to 1000 guests comfortably.',
  },
  {
    title: 'Multi-Cuisine In-House Catering',
    desc: 'Master chefs preparing authentic Newari feasts (Bhoj), traditional Nepali thali, rich Indian curries, and live BBQ stations.',
  },
  {
    title: 'Ample Free Parking',
    desc: 'Dedicated private secure parking space accommodating over 50 cars and 200+ two-wheelers effortlessly.',
  },
  {
    title: 'Power Backup & Amenities',
    desc: '100% standby silent diesel generator, private AC bridal suite, modern clean restrooms, and customizable theme lighting.',
  },
  {
    title: 'All Ceremonies Supported',
    desc: 'Perfect for Grand Weddings, Receptions, Bratabandha, Pasni, Birthday Celebrations, Anniversaries, and Corporate Conferences.',
  },
];

export default function PartyVenuePage() {
  return (
    <>
      <SEOHead
        title="Party Venue Near Suryabinayak Bhaktapur | Shree Ganesh Party Palace"
        description="Looking for the best party venue near Suryabinayak, Bhaktapur? Shree Ganesh Party Venue offers 700-1000 guest capacity, spacious banquet hall, delicious catering & ample parking."
        keywords="party venue near suryabinayak bhaktapur, party venue in bhaktapur, party palace in bhaktapur, party venue near suryabinayak, party palace near suryabinayak, best party venue in bhaktapur, shree ganesh party venue"
        canonicalUrl={`${SITE_URL}/party-venue-in-bhaktapur`}
        schema={[BREADCRUMB_SCHEMA, VENUE_SCHEMA]}
      />

      {/* ── HERO SECTION ── */}
      <section className="bg-[#0a0a0a] pt-28 pb-16 px-4">
        <div className="mx-auto max-w-4xl">

          {/* Breadcrumb */}
          <nav className="mb-8" aria-label="Breadcrumb">
            <ol className="flex items-center gap-2 font-sans text-xs text-zinc-400">
              <li><Link to="/" className="hover:text-gold transition-colors">Home</Link></li>
              <li aria-hidden="true" className="text-zinc-600">/</li>
              <li className="text-zinc-300">Party Venue in Bhaktapur</li>
            </ol>
          </nav>

          {/* Heading */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <span className="block h-px w-14 bg-gradient-to-r from-transparent to-gold/60" />
              <span className="font-script text-gold text-2xl leading-none">Premier Event Palace</span>
              <span className="block h-px w-14 bg-gradient-to-l from-transparent to-gold/60" />
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl font-bold text-white tracking-widest uppercase mt-2">
              Party Venue Near Suryabinayak, Bhaktapur
            </h1>
          </div>

          {/* Lead paragraph */}
          <p className="font-sans text-lg text-zinc-300 leading-relaxed mb-8 italic">
            Welcome to <strong className="text-gold">Shree Ganesh Party Venue And Catering Service</strong> — the top-rated party venue and banquet palace in Suryabinayak, Bhaktapur, delivering unforgettable celebrations for up to 1000 guests.
          </p>

          {/* Body copy */}
          <div className="space-y-5 font-sans text-base text-zinc-400 leading-relaxed mb-10">
            <p>
              If you are searching for a premier <strong className="text-white">party venue near Suryabinayak Bhaktapur</strong> or a grand <strong className="text-white">party palace in Bhaktapur</strong>, Shree Ganesh Party Venue offers the ideal blend of luxury, traditional warmth, accessibility, and exceptional food.
            </p>
            <p>
              Conveniently located near the revered <strong className="text-white">Suryabinayak Ganesh Mandir</strong>, our venue provides a sacred, peaceful ambience with wide access roads connecting directly to Arniko Highway. We serve families and organizations across Bhaktapur, Suryabinayak, Katunje, Jagati, Sallaghari, Thimi, Kamalbinayak, Lokanthali, Kathmandu, and Lalitpur.
            </p>
            <p>
              Whether you are hosting a wedding ceremony, reception, Bratabandha, Pasni (rice feeding), birthday party, or corporate event, our experienced team manages every detail — from custom stage decoration and seating layouts to authentic multi-cuisine catering.
            </p>
          </div>

          {/* Stat blocks */}
          <div className="grid grid-cols-1 gap-px sm:grid-cols-3 border border-gold/10 mb-12">
            {stats.map((s) => (
              <div key={s.label} className="text-center p-7 border border-gold/15 bg-[rgba(255,255,255,0.02)]">
                <p className="font-serif text-3xl font-bold text-gold">{s.value}</p>
                <p className="mt-1 text-xs font-sans font-semibold uppercase tracking-widest text-zinc-500">{s.label}</p>
              </div>
            ))}
          </div>

          {/* CTA buttons */}
          <div className="flex flex-wrap gap-4 mb-16">
            <Link
              to="/booking"
              className="font-serif tracking-[0.14em] uppercase text-xs px-8 py-3.5 bg-gold hover:bg-gold/90 text-zinc-950 font-semibold transition-all duration-150 shadow-[0_0_16px_rgba(201,168,76,0.2)]"
              style={{ borderRadius: '2px' }}
            >
              Book Venue Online
            </Link>
            <Link
              to="/contact"
              className="font-serif tracking-[0.14em] uppercase text-xs px-8 py-3.5 border border-gold/40 hover:border-gold text-gold hover:bg-gold/5 transition-all duration-150"
              style={{ borderRadius: '2px' }}
            >
              Get Custom Quote
            </Link>
            <a
              href={MAP_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackDirectionsClick('party_venue_seo_page')}
              className="font-serif tracking-[0.14em] uppercase text-xs px-8 py-3.5 border border-gold/40 hover:border-gold text-gold hover:bg-gold/5 transition-all duration-150"
              style={{ borderRadius: '2px' }}
            >
              Get Directions
            </a>
          </div>

          {/* Highlights Grid */}
          <div className="border-t border-gold/15 pt-12 mb-16">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-widest uppercase mb-8 text-center">
              Why Choose Shree Ganesh Party Venue?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {highlights.map((h) => (
                <div key={h.title} className="p-6 border border-gold/15 bg-[rgba(255,255,255,0.02)] hover:border-gold/40 transition-colors">
                  <h3 className="font-serif text-lg font-bold text-gold tracking-wide mb-2">{h.title}</h3>
                  <p className="font-sans text-sm text-zinc-400 leading-relaxed">{h.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Location & Map Embed */}
          <div className="border-t border-gold/15 pt-12 mb-12">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-widest uppercase mb-6 text-center">
              Venue Location &amp; Contact
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="border border-gold/15 bg-[rgba(255,255,255,0.02)] p-8">
                <div className="space-y-4 font-sans text-sm text-zinc-300">
                  <p><strong className="text-white">Venue Name:</strong> Shree Ganesh Party Venue And Catering Service</p>
                  <p><strong className="text-white">Address:</strong> {BUSINESS_ADDRESS}</p>
                  <p><strong className="text-white">Phone:</strong> <a className="text-gold hover:underline" href={`tel:${BUSINESS_PHONE}`}>{BUSINESS_PHONE}</a></p>
                  <p><strong className="text-white">WhatsApp:</strong> <a className="text-gold hover:underline" href={`https://wa.me/${WHATSAPP_NUMBER}`}>+977 {WHATSAPP_NUMBER}</a></p>
                  <p><strong className="text-white">Opening Hours:</strong> 7 Days a Week (06:00 AM – 11:00 PM)</p>
                  <p><strong className="text-white">Nearby Landmarks:</strong> Suryabinayak Ganesh Mandir, Arniko Highway, Pandu Bazaar</p>
                </div>
                <div className="mt-6 flex gap-4">
                  <Link to="/booking" className="inline-block font-serif tracking-[0.14em] uppercase text-xs px-6 py-3 bg-gold hover:bg-gold/90 text-zinc-950 font-semibold transition-all">
                    Book Visit
                  </Link>
                  <Link to="/wedding-venue-bhaktapur" className="inline-block font-serif tracking-[0.14em] uppercase text-xs px-6 py-3 border border-gold/40 text-gold hover:bg-gold/5 transition-all">
                    Wedding Packages
                  </Link>
                </div>
              </div>
              <div className="h-[320px] border border-gold/15 overflow-hidden">
                <iframe
                  title="Shree Ganesh Party Venue Map Location"
                  src={MAP_EMBED_URL}
                  className="w-full h-full border-0 grayscale-[50%] hover:grayscale-0 transition-all duration-500"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ── FAQ SECTION ── */}
      <FAQSection
        title="Party Venue FAQs"
        subtitle="Common questions about party venue booking, catering, and parking in Suryabinayak, Bhaktapur."
        limit={6}
        showSchema
      />

      {/* ── BOTTOM CTA STRIP ── */}
      <section className="bg-[#0a0a0a] border-t border-gold/15 py-16 px-4 text-center">
        <div className="mx-auto max-w-xl">
          <span className="font-script text-gold text-2xl block mb-2">Book Today</span>
          <h2 className="font-serif text-3xl font-bold text-white tracking-widest uppercase mb-4">
            Plan Your Event at Bhaktapur's Best Venue
          </h2>
          <p className="font-sans text-zinc-400 italic mb-8">
            Dates fill fast during wedding and festive seasons. Reserve your preferred date risk-free today.
          </p>
          <Link
            to="/booking"
            className="inline-block font-serif tracking-[0.14em] uppercase text-sm px-10 py-4 bg-gold hover:bg-gold/90 text-zinc-950 font-semibold shadow-[0_0_24px_rgba(201,168,76,0.25)] transition-all duration-150"
            style={{ borderRadius: '2px' }}
          >
            Book Venue Now
          </Link>
        </div>
      </section>
    </>
  );
}
