import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import { SEOHead } from '@/components/shared/SEOHead';
import { SectionReveal } from '@/components/ui/SectionReveal';

export default function NotFound() {
  return (
    <>
      <SEOHead title="404 — Page Not Found" noIndex />
      <div className="flex min-h-[70vh] items-center justify-center px-4 py-24 text-center">
        <SectionReveal className="max-w-md">
          <p className="font-mono text-8xl font-bold text-gold tracking-tight">404</p>
          <h1 className="mt-4 font-serif text-2xl font-bold text-white">Page Not Found</h1>
          <p className="mt-2 text-zinc-400">
            Sorry, we couldn&apos;t find what you were looking for.
          </p>
          <Link
            to="/"
            aria-label="Go to home page"
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-gold px-6 py-3 text-sm font-semibold text-zinc-950 shadow-md transition-all duration-120 ease-out hover:bg-gold/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 min-h-[44px]"
          >
            <Home className="h-4 w-4" aria-hidden="true" />
            Back to Home
          </Link>
        </SectionReveal>
      </div>
    </>
  );
}
