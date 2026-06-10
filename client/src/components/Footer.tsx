import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import { BUSINESS_PHONE, BUSINESS_EMAIL, BUSINESS_ADDRESS } from '@/constants';

export default function Footer() {
  return (
    <footer className="bg-zinc-950 border-t border-white/5 text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <Link
              to="/"
              aria-label="Go to home page"
              className="inline-flex items-center gap-2 font-serif text-xl font-bold text-gold transition-colors duration-120 ease-out hover:text-gold/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold min-h-[44px]"
            >
              <Home className="h-5 w-5" aria-hidden="true" />
              Shree Ganesh
            </Link>
            <p className="mt-2 text-sm text-zinc-400 leading-relaxed">
              Premium party venue & catering service in Bhaktapur, Nepal. Creating unforgettable celebrations.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-zinc-300">Quick Links</h4>
            <ul className="space-y-2 text-sm text-zinc-400">
              {([
                ['/', 'Home'],
                ['/about', 'About'],
                ['/services', 'Services'],
                ['/gallery', 'Gallery'],
                ['/packages', 'Packages'],
                ['/menu', 'Menu'],
                ['/blog', 'Blog'],
              ] as [string, string][]).map(([to, label]) => (
                <li key={to}>
                  <Link 
                    to={to} 
                    className="hover:text-gold transition-colors duration-120 ease-out focus:outline-none focus:text-gold"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-zinc-300">Contact</h4>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li>{BUSINESS_PHONE}</li>
              <li>{BUSINESS_EMAIL}</li>
              <li>{BUSINESS_ADDRESS}</li>
            </ul>
          </div>

          {/* CTA */}
          <div>
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-zinc-300">Book Your Event</h4>
            <p className="mb-4 text-sm text-zinc-400">Ready to create an unforgettable celebration?</p>
            <Link
              to="/booking"
              className="inline-block rounded-lg bg-gold hover:bg-gold/90 text-zinc-950 px-5 py-2.5 text-sm font-semibold shadow-md transition-all duration-120 ease-out focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-zinc-950"
            >
              Book Now
            </Link>
          </div>
        </div>

        <div className="mt-8 border-t border-white/5 pt-6 text-center text-xs text-zinc-500">
          © {new Date().getFullYear()} Shree Ganesh Party Venue & Catering Service. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
