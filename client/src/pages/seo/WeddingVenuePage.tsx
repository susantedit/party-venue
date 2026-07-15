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

export default function WeddingVenuePage() {
  return (
    <>
      <SEOHead
        title="Wedding Venue in Bhaktapur, Nepal | Shree Ganesh Party Venue"
        description="Looking for a wedding venue in Bhaktapur? Shree Ganesh Party Venue near Suryabinayak Ganesh Mandir offers verified capacity for 700-800 guests, catering, and event coordination."
        canonicalUrl={`${SITE_URL}/wedding-venue-bhaktapur`}
        schema={BREADCRUMB_SCHEMA}
      />
      <div className="pt-24 pb-16 px-4">
        <div className="mx-auto max-w-4xl">
          {/* Breadcrumb */}
          <nav className="text-xs text-gray-400 mb-6" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-gold-500">Home</Link> / <span>Wedding Venue in Bhaktapur</span>
          </nav>

          <h1 className="font-serif text-4xl font-bold text-charcoal mb-4">
            Wedding Venue in Bhaktapur, Nepal
          </h1>
          <p className="text-lg text-gray-500 mb-8">
            Celebrate your most important day at Shree Ganesh Party Venue — Bhaktapur's premier wedding destination with elegant halls, authentic catering, and expert event coordination.
          </p>

          <div className="prose prose-lg max-w-none text-gray-600 space-y-4 mb-10">
            <p>
              Shree Ganesh Party Venue And Catering Service is a <strong>wedding venue in Bhaktapur, Nepal</strong> near Suryabinayak Ganesh Mandir. The verified capacity is 700-800 guests depending on setup, and we support wedding and reception planning with catering and coordination.
            </p>
            <p>
              Our wedding packages can be confirmed by the team for décor, menu selection, seating layout, and booking method. Please verify any setup-specific details before finalising the date.
            </p>
            <p>
              The venue is convenient for guests coming from Bhaktapur, Suryabinayak, Kathmandu, and Lalitpur. Use the map, phone, or WhatsApp to confirm availability.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3 mb-12">
            {[
              { label: 'Guest Capacity', value: '700-800' },
              { label: 'Event Types', value: 'Wedding & Reception' },
              { label: 'Location', value: 'Bhaktapur' },
            ].map(s => (
              <div key={s.label} className="rounded-xl bg-surface p-5 text-center">
                <p className="font-serif text-2xl font-bold text-gold-600">{s.value}</p>
                <p className="text-sm text-gray-500 mt-1">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="flex gap-4 mb-12">
            <Link to="/booking?event=Wedding"
              className="rounded-lg bg-gold-500 px-6 py-3 font-semibold text-white hover:bg-gold-600 transition">
              Book Wedding Venue
            </Link>
            <Link to="/packages"
              className="rounded-lg border border-gold-500 px-6 py-3 font-semibold text-gold-600 hover:bg-gold-50 transition">
              View Packages
            </Link>
          </div>
        </div>
      </div>
      <FAQSection title="Wedding Venue FAQs" limit={5} showSchema />
    </>
  );
}
