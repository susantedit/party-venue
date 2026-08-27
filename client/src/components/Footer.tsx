import { Link } from 'react-router-dom';
import { BUSINESS_PHONE, BUSINESS_EMAIL, BUSINESS_ADDRESS, WHATSAPP_NUMBER, MAP_URL } from '@/constants';
import { trackPhoneClick, trackWhatsAppClick } from '@/lib/analytics';

const quickLinks: [string, string][] = [
  ['/', 'Home'], ['/about', 'About'], ['/services', 'Services'],
  ['/gallery', 'Gallery'], ['/menu', 'Menu'], ['/contact', 'Contact'],
  ['/location', 'Location'], ['/faq', 'FAQ'],
];


export default function Footer() {
  return (
    <footer className="bg-[#070707] border-t border-gold/10 text-white">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">

          {/* Brand */}
          <div>
            <Link to="/" aria-label="Shree Ganesh Party Venue And Catering Service — go to home page" className="inline-block mb-4">
              <img
                src="/shreeganeshpartyvenue(withbg-of-white).png"
                alt="Shree Ganesh Party Venue And Catering Service"
                width={160}
                height={64}
                loading="lazy"
                decoding="async"
                className="h-16 w-auto object-contain"
              />
            </Link>
            <p className="font-sans text-sm text-zinc-500 leading-relaxed">
              Premium event venue and catering service in Bhaktapur, Nepal. Weddings, receptions, birthdays, Bratabandha, Pasni, corporate events, and catering.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-serif text-xs tracking-[0.2em] uppercase text-zinc-400 mb-5">Quick Links</h3>
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
            <h3 className="font-serif text-xs tracking-[0.2em] uppercase text-zinc-400 mb-5">Contact</h3>
            <ul className="space-y-3 font-sans text-sm text-zinc-500">
              <li>
                <a href="tel:+9779851337076" onClick={() => trackPhoneClick('footer')} className="hover:text-gold transition-colors">{BUSINESS_PHONE}</a>
              </li>
              <li>
                <a href={`mailto:${BUSINESS_EMAIL}`} className="hover:text-gold transition-colors">{BUSINESS_EMAIL}</a>
              </li>
              <li>{BUSINESS_ADDRESS}</li>
              <li>
                <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer"
                  onClick={() => trackWhatsAppClick('footer')}
                  className="inline-flex items-center gap-1.5 text-[#25D366] hover:opacity-80 transition-opacity">
                  💬 WhatsApp Us
                </a>
              </li>
            </ul>
          </div>

          {/* Services + Book CTA */}
          <div>
            <h3 className="font-serif text-xs tracking-[0.2em] uppercase text-zinc-400 mb-5">Services & Venues</h3>
            <ul className="space-y-2.5 mb-6">
              <li><Link to="/party-venue-in-bhaktapur" className="font-sans text-sm text-zinc-500 hover:text-gold transition-colors">Party Venue in Bhaktapur</Link></li>
              <li><Link to="/wedding-venue-bhaktapur" className="font-sans text-sm text-zinc-500 hover:text-gold transition-colors">Wedding & Reception Venue</Link></li>
              <li><Link to="/catering-service-bhaktapur" className="font-sans text-sm text-zinc-500 hover:text-gold transition-colors">Catering Services</Link></li>
              <li><Link to="/services" className="font-sans text-sm text-zinc-500 hover:text-gold transition-colors">Bratabandha & Pasni Ceremonies</Link></li>
              <li><Link to="/services" className="font-sans text-sm text-zinc-500 hover:text-gold transition-colors">Birthday & Corporate Events</Link></li>
            </ul>
            <h3 className="font-serif text-xs tracking-[0.2em] uppercase text-zinc-400 mb-3">Book Your Event</h3>
            <p className="font-sans text-sm text-zinc-500 mb-4 leading-relaxed">
              Dates fill fast. Secure yours today — no payment required now.
            </p>
            <Link to="/booking"
              className="inline-block font-serif tracking-[0.14em] uppercase text-xs px-6 py-3 bg-gold hover:bg-gold/90 text-zinc-950 font-semibold transition-all duration-150 shadow-[0_0_16px_rgba(201,168,76,0.15)] rounded-sm">
              Book Now
            </Link>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 border-t border-gold/[0.08] pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-sans text-xs text-zinc-600">
            © {new Date().getFullYear()} Shree Ganesh Party Venue & Catering Service. All rights reserved.
          </p>
          <a href={MAP_URL}
            target="_blank" rel="noopener noreferrer"
            className="font-sans text-xs text-zinc-600 hover:text-gold transition-colors">
            📍 Near Suryabinayak Ganesh Mandir, Bhaktapur 44800, Nepal
          </a>
        </div>
      </div>
    </footer>
  );
}
