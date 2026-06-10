import { Link } from 'react-router-dom';
import { SEOHead } from '@/components/shared/SEOHead';
import { FAQSection } from '@/components/sections/FAQSection';

export default function CateringPage() {
  return (
    <>
      <SEOHead
        title="Catering Service in Bhaktapur, Nepal | Shree Ganesh Catering"
        description="Professional catering service in Bhaktapur for weddings, receptions, corporate events and more. Authentic Nepali, Newari, Indian, and Chinese cuisine. Contact us for a custom menu."
        canonicalUrl="https://shreeganeshsharma.com/catering-service-in-bhaktapur"
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
              Shree Ganesh Catering Service offers authentic <strong>Nepali, Newari, Indian, Chinese, and BBQ catering</strong> in Bhaktapur and surrounding areas. Whether you need catering for a 50-person birthday party or a 1,000-guest wedding reception, our team delivers consistent quality and presentation.
            </p>
            <p>
              Our menu offerings include traditional Nepali thali sets, Newari samaybaji, Indian buffet selections, Chinese family-style platters, and live BBQ stations. We accommodate dietary preferences and custom menu requests.
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
