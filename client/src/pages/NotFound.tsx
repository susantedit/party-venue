import { Link } from 'react-router-dom';
import { SEOHead } from '@/components/shared/SEOHead';
import { SectionReveal } from '@/components/ui/SectionReveal';

export default function NotFound() {
  return (
    <>
      <SEOHead title="404 — Page Not Found" noIndex />
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a] px-4 py-24 text-center">
        <SectionReveal className="max-w-lg w-full">
          {/* Decorative top ornament */}
          <div className="flex items-center justify-center gap-3 mb-10" aria-hidden="true">
            <span className="block h-px w-14 bg-gradient-to-r from-transparent to-gold/60" />
            <span className="block h-1.5 w-1.5 rotate-45 bg-gold/50" />
            <span className="block h-px w-14 bg-gradient-to-l from-transparent to-gold/60" />
          </div>

          {/* 404 */}
          <p
            className="font-serif text-[9rem] sm:text-[11rem] font-bold leading-none text-gold tracking-tight"
            style={{ textShadow: '0 0 60px rgba(201,168,76,0.35), 0 0 20px rgba(201,168,76,0.2)' }}
          >
            404
          </p>

          {/* Venue name */}
          <p className="mt-2 text-[10px] uppercase tracking-[0.3em] text-gold/60 font-sans font-semibold">
            Shree Ganesh Party Venue
          </p>

          {/* Heading */}
          <h1 className="mt-4 font-serif text-2xl sm:text-3xl font-bold text-white tracking-widest uppercase">
            Page Not Found
          </h1>

          {/* Message */}
          <p className="mt-3 font-sans text-base italic text-zinc-400 max-w-sm mx-auto">
            The page you're looking for doesn't exist or may have moved. Let us guide you back.
          </p>

          {/* Decorative mid-ornament */}
          <div className="flex items-center justify-center gap-3 mt-8 mb-8" aria-hidden="true">
            <span className="block h-px w-14 bg-gradient-to-r from-transparent to-gold/60" />
            <span className="block h-1.5 w-1.5 rotate-45 bg-gold/40" />
            <span className="block h-px w-14 bg-gradient-to-l from-transparent to-gold/60" />
          </div>

          {/* Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/"
              aria-label="Go back to home page"
              className="font-serif tracking-[0.14em] uppercase text-sm px-8 py-3.5 bg-gold hover:bg-gold/90 active:scale-95 text-zinc-950 font-semibold shadow-[0_0_20px_rgba(201,168,76,0.25)] transition-all duration-150 focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-zinc-950 min-h-[44px] inline-flex items-center"
              style={{ borderRadius: '2px' }}
            >
              Back to Home
            </Link>
            <Link
              to="/booking"
              aria-label="Book an event"
              className="font-serif tracking-[0.14em] uppercase text-sm px-8 py-3.5 border border-gold/50 hover:border-gold hover:bg-gold/5 active:scale-95 text-gold font-medium transition-all duration-150 min-h-[44px] inline-flex items-center"
              style={{ borderRadius: '2px' }}
            >
              Book an Event
            </Link>
          </div>
        </SectionReveal>
      </div>
    </>
  );
}
