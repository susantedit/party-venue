import { Link } from 'react-router-dom';
import { SEOHead } from '@/components/shared/SEOHead';
import { BUSINESS_ADDRESS, BUSINESS_PHONE, MAP_EMBED_URL, SITE_URL, WHATSAPP_NUMBER } from '@/constants';

const BREADCRUMB_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
    { '@type': 'ListItem', position: 2, name: 'Location', item: `${SITE_URL}/location` },
  ],
};

export default function Location() {
  return (
    <>
      <SEOHead
        title="Venue Location in Suryabinayak, Bhaktapur | Shree Ganesh Party Venue"
        description="Find Shree Ganesh Party Venue near Suryabinayak Ganesh Mandir in Bhaktapur. View the map, address, phone number, and directions before booking."
        canonicalUrl={`${SITE_URL}/location`}
        schema={BREADCRUMB_SCHEMA}
      />

      <div className="bg-[#0a0a0a] pt-28 pb-20 px-4">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-1">
              <span className="block h-px w-14 bg-gradient-to-r from-transparent to-gold/60" />
              <span className="font-script text-gold text-2xl leading-none">Find Us</span>
              <span className="block h-px w-14 bg-gradient-to-l from-transparent to-gold/60" />
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl font-bold text-white tracking-widest uppercase mt-2">
              Venue Location
            </h1>
            <p className="mt-4 font-sans text-lg italic text-zinc-400 max-w-2xl mx-auto">
              Near Suryabinayak Ganesh Mandir in Bhaktapur, with easy access for guests coming from Bhaktapur, Suryabinayak, Kathmandu, and Lalitpur.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="border border-gold/15 bg-[rgba(255,255,255,0.02)] p-8">
              <h2 className="font-serif text-2xl font-bold text-white tracking-widest uppercase mb-6">Address & Contact</h2>
              <div className="space-y-4 font-sans text-zinc-400">
                <p><strong className="text-white">Address:</strong> {BUSINESS_ADDRESS}</p>
                <p><strong className="text-white">Phone:</strong> <a className="text-gold hover:opacity-80" href="tel:+9779860117006">{BUSINESS_PHONE}</a></p>
                <p><strong className="text-white">WhatsApp:</strong> <a className="text-gold hover:opacity-80" href={`https://wa.me/${WHATSAPP_NUMBER}`}>{WHATSAPP_NUMBER}</a></p>
                <p><strong className="text-white">Hours:</strong> Any time as customers wish</p>
              </div>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link to="/contact" className="inline-block font-serif tracking-[0.14em] uppercase text-xs px-6 py-3 bg-gold hover:bg-gold/90 text-zinc-950 font-semibold transition-all duration-150">Contact Us</Link>
                <Link to="/booking" className="inline-block font-serif tracking-[0.14em] uppercase text-xs px-6 py-3 border border-gold/40 hover:border-gold text-gold hover:bg-gold/5 transition-all duration-150">Book a Visit</Link>
              </div>
            </div>

            <div className="h-[380px] border border-gold/15 overflow-hidden">
              <iframe
                title="Shree Ganesh Party Venue Location"
                src={MAP_EMBED_URL}
                className="w-full h-full border-0 grayscale-[60%] hover:grayscale-0 transition-all duration-500"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
