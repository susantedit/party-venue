import { Link } from 'react-router-dom';
import { SEOHead } from '@/components/shared/SEOHead';
import { FAQSection } from '@/components/sections/FAQSection';
import { SITE_URL } from '@/constants';

export default function CateringPage() {
  return (
    <>
      <SEOHead
        title="Catering Service in Bhaktapur, Nepal | Shree Ganesh Catering"
        description="Professional catering service in Bhaktapur near Suryabinayak Ganesh Mandir for weddings, receptions, birthdays, corporate events, and more. Nepali, Newari, Indian, Chinese, and BBQ menus."
        canonicalUrl={`${SITE_URL}/catering-service-bhaktapur`}
      />
      <div className="pt-24 pb-16 px-4">
        <div className="mx-auto max-w-4xl">
          <nav className="text-xs text-gray-400 mb-6">
            <Link to="/" className="hover:text-gold-500">Home</Link> / <span>Catering Service in Bhaktapur</span>
          </nav>
          <h1 className="font-serif text-4xl font-bold text-charcoal mb-4">
            Catering Service in Bhaktapur, Nepal
          </h1>
          <p className="text-lg text-gray-500 mb-8">
            Authentic multi-cuisine catering for every occasion. Our experienced kitchen team delivers exceptional flavors for events of all sizes.
          </p>
          <div className="prose prose-lg max-w-none text-gray-600 space-y-4 mb-10">
            <p>
              Shree Ganesh Party Venue And Catering Service offers authentic <strong>Nepali, Newari, Indian, Chinese, and BBQ catering</strong> in Bhaktapur and surrounding areas. Event-specific menu choices should be confirmed with the team before booking.
            </p>
            <p>
              Menu offerings include traditional Nepali thali sets, Newari samaybaji, Indian buffet selections, Chinese family-style platters, and BBQ options. The exact menu depends on the event type, guest count, and available ingredients.
            </p>
          </div>
          <div className="flex gap-4 mb-12">
            <Link to="/contact" className="rounded-lg bg-gold-500 px-6 py-3 font-semibold text-white hover:bg-gold-600 transition">
              Request Catering Quote
            </Link>
            <Link to="/menu" className="rounded-lg border border-gold-500 px-6 py-3 font-semibold text-gold-600 hover:bg-gold-50 transition">
              View Full Menu
            </Link>
          </div>
        </div>
      </div>
      <FAQSection title="Catering FAQs" limit={5} />
    </>
  );
}
