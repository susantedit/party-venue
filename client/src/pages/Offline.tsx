import { WifiOff } from 'lucide-react';
import { SEOHead } from '@/components/shared/SEOHead';
import { SectionReveal } from '@/components/ui/SectionReveal';
import { BUSINESS_PHONE } from '@/constants';

export default function Offline() {
  return (
    <>
      <SEOHead title="You're Offline — Shree Ganesh Party Venue" noIndex />
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a] px-4 py-24 text-center">
        <SectionReveal className="max-w-md w-full">
          {/* Top ornament */}
          <div className="flex items-center justify-center gap-3 mb-10" aria-hidden="true">
            <span className="block h-px w-14 bg-gradient-to-r from-transparent to-gold/60" />
            <span className="block h-1.5 w-1.5 rotate-45 bg-gold/50" />
            <span className="block h-px w-14 bg-gradient-to-l from-transparent to-gold/60" />
          </div>

          {/* Venue name */}
          <p className="font-serif text-lg font-bold text-white tracking-widest uppercase">
            Shree Ganesh Party Venue
          </p>

          {/* WiFi off icon */}
          <div
            className="mx-auto mt-8 mb-6 flex items-center justify-center h-20 w-20 border border-gold/20 bg-gold/5"
            style={{ borderRadius: '50%' }}
            aria-hidden="true"
          >
            <WifiOff className="h-9 w-9 text-gold/70" strokeWidth={1.5} />
          </div>

          {/* Heading */}
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-widest uppercase">
            You're Offline
          </h1>

          {/* Message */}
          <p className="mt-4 font-sans text-base text-zinc-400 max-w-sm mx-auto leading-relaxed">
            It looks like you've lost your connection. Check your internet and try again — we'll be here when you're back.
          </p>

          {/* Mid ornament */}
          <div className="flex items-center justify-center gap-3 mt-8 mb-8" aria-hidden="true">
            <span className="block h-px w-14 bg-gradient-to-r from-transparent to-gold/60" />
            <span className="block h-1.5 w-1.5 rotate-45 bg-gold/40" />
            <span className="block h-px w-14 bg-gradient-to-l from-transparent to-gold/60" />
          </div>

          {/* Try Again button */}
          <button
            onClick={() => window.location.reload()}
            className="font-serif tracking-[0.14em] uppercase text-sm px-8 py-3.5 bg-gold hover:bg-gold/90 active:scale-95 text-zinc-950 font-semibold shadow-[0_0_20px_rgba(201,168,76,0.25)] transition-all duration-150 focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-zinc-950 min-h-[44px] inline-flex items-center"
            style={{ borderRadius: '2px' }}
          >
            Try Again
          </button>

          {/* Contact info */}
          <p className="mt-8 font-sans text-sm text-zinc-600">
            Meanwhile, call us at{' '}
            <a
              href={`tel:${BUSINESS_PHONE}`}
              className="text-gold hover:text-gold/80 transition-colors underline underline-offset-2"
            >
              {BUSINESS_PHONE}
            </a>
          </p>
        </SectionReveal>
      </div>
    </>
  );
}
