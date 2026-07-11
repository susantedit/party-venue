import { Link } from 'react-router-dom';
import { BUSINESS_PHONE, BUSINESS_EMAIL, BUSINESS_ADDRESS, WHATSAPP_NUMBER } from '@/constants';

const quickLinks: [string, string][] = [
  ['/', 'Home'], ['/about', 'About'], ['/services', 'Services'],
  ['/gallery', 'Gallery'], ['/packages', 'Packages'], ['/menu', 'Menu'],
  ['/contact', 'Contact'],
];

export default function Footer() {
  return (
    <footer className="bg-[#070707] border-t border-gold/10 text-white">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">

          {/* Brand */}
          <div>
            <div className="mb-4">
              <span className="font-serif text-lg font-bold tracking-[0.15em] text-white uppercase block">Shree Ganesh</span>
              <span className="font-script text-gold text-sm leading-none">Party Venue & Catering</span>
            </div>
            <p className="font-sans text-sm text-zinc-500 leading-relaxed">
              Premium event venue & catering service in Bhaktapur, Nepal. Creating unforgettable celebrations since 2014.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-xs tracking-[0.2em] uppercase text-zinc-400 mb-5">Quick Links</h4>
            <ul className="space-y-2.5">
              {quickLinks.map(([to, label]) => (
                <li key={to}>
                  <Link to={to} className="font-sans text-sm text-zinc-500 hover:text-gold transition-colors duration-150">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-serif text-xs tracking-[0.2em] uppercase text-zinc-400 mb-5">Contact</h4>
            <ul className="space-y-3 font-sans text-sm text-zinc-500">
              <li>
                <a href="tel:+9779851337076" className="hover:text-gold transition-colors">{BUSINESS_PHONE}</a>
              </li>
              <li>
                <a href={`mailto:${BUSINESS_EMAIL}`} className="hover:text-gold transition-colors">{BUSINESS_EMAIL}</a>
              </li>
              <li>{BUSINESS_ADDRESS}</li>
              <li>
                <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[#25D366] hover:opacity-80 transition-opacity">
                  💬 WhatsApp Us
                </a>
              </li>
            </ul>
          </div>

          {/* Book CTA */}
          <div>
            <h4 className="font-serif text-xs tracking-[0.2em] uppercase text-zinc-400 mb-5">Book Your Event</h4>
            <p className="font-sans text-sm text-zinc-500 mb-5 leading-relaxed">
              Dates fill fast. Secure yours today — no payment required now.
            </p>
            <Link to="/booking"
              className="inline-block font-serif tracking-[0.14em] uppercase text-xs px-6 py-3 bg-gold hover:bg-gold/90 text-zinc-950 font-semibold transition-all duration-150 shadow-[0_0_16px_rgba(201,168,76,0.15)]"
              style={{ borderRadius: '2px' }}>
              Book Now
            </Link>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 border-t border-gold/[0.08] pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-sans text-xs text-zinc-600">
            © {new Date().getFullYear()} Shree Ganesh Party Venue & Catering Service. All rights reserved.
          </p>
          <a href="https://www.google.com/maps/place/Shree+Ganesh+Party+Venue+And+Catering+Service/@27.6568609,85.4192105,17z"
            target="_blank" rel="noopener noreferrer"
            className="font-sans text-xs text-zinc-600 hover:text-gold transition-colors">
            📍 Suryabinayak-6, Bhaktapur, Nepal
          </a>
        </div>
      </div>
    </footer>
  );
}
