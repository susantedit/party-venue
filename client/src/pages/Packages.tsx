import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import axiosInstance from '@/lib/axiosInstance';
import { SEOHead } from '@/components/shared/SEOHead';
import { SkeletonLoader } from '@/components/shared/SkeletonLoader';
import { EVENT_TYPES } from '@/constants';
import type { Package } from '@/types';

function calculateCost(pkg: Package, guests: number) {
  const perHead = pkg.price / pkg.capacity;
  return {
    min: Math.round(perHead * guests * 0.9),
    max: Math.round(perHead * guests * 1.1),
    warning: guests > pkg.capacity,
  };
}

function SectionHeader({ script, title, subtitle }: { script: string; title: string; subtitle?: string }) {
  return (
    <div className="text-center mb-16">
      <div className="flex items-center justify-center gap-3 mb-1">
        <span className="block h-px w-14 bg-gradient-to-r from-transparent to-gold/60" />
        <span className="font-script text-gold text-2xl leading-none">{script}</span>
        <span className="block h-px w-14 bg-gradient-to-l from-transparent to-gold/60" />
      </div>
      <h1 className="font-serif text-4xl sm:text-5xl font-bold text-white tracking-widest uppercase mt-2">{title}</h1>
      {subtitle && <p className="mt-4 font-sans text-lg italic text-zinc-400 max-w-xl mx-auto">{subtitle}</p>}
    </div>
  );
}

export default function Packages() {
  const { data: packages = [], isLoading } = useQuery({
    queryKey: ['packages'],
    queryFn: () => axiosInstance.get('/api/v1/packages').then((r) => r.data.data as Package[]),
  });

  const [calcPkg, setCalcPkg] = useState('');
  const [calcGuests, setCalcGuests] = useState('');
  const [calcEvent, setCalcEvent] = useState<typeof EVENT_TYPES[number]>(EVENT_TYPES[0]);

  const selectedPkg = packages.find((p) => p._id === calcPkg);
  const estimate = selectedPkg && Number(calcGuests) > 0
    ? calculateCost(selectedPkg, Number(calcGuests))
    : null;

  return (
    <>
      <SEOHead
        title="Event Packages & Pricing"
        description="View Silver, Gold, Platinum, and Custom event packages at Shree Ganesh Party Venue. Transparent pricing for every budget."
        canonicalUrl="https://shreeganeshsharma.com/packages"
      />
      <div className="bg-[#0a0a0a] pt-28 pb-20 px-4">
        <div className="relative z-10 mx-auto max-w-6xl">
          <SectionHeader script="Pricing Tiers" title="Event Packages"
            subtitle="Choose the package that fits your celebration. All packages include venue, setup, and coordination." />

          {/* Package grid */}
          {isLoading ? (
            <div className="grid gap-px sm:grid-cols-2 lg:grid-cols-4 border border-gold/10">
              {Array.from({ length: 4 }).map((_, i) => <SkeletonLoader key={i} className="h-80" />)}
            </div>
          ) : (
            <div className="grid gap-px sm:grid-cols-2 lg:grid-cols-4 border border-gold/10">
              {packages.map((pkg) => (
                <div key={pkg._id}
                  className={`relative p-7 bg-[rgba(255,255,255,0.02)] flex flex-col transition-all duration-200 hover:bg-[rgba(201,168,76,0.04)] ${
                    pkg.isPopular ? 'ring-1 ring-inset ring-gold/40' : ''
                  }`}>
                  {pkg.isPopular && (
                    <span className="absolute top-4 right-4 text-[10px] font-serif tracking-[0.18em] uppercase bg-gold text-zinc-950 px-2 py-0.5 font-semibold">
                      Popular
                    </span>
                  )}
                  <h3 className="font-serif text-lg font-bold text-white tracking-wider uppercase capitalize mb-1">{pkg.name}</h3>
                  <p className="text-xs font-sans text-zinc-500 uppercase tracking-widest capitalize mb-4">{pkg.category} Package</p>
                  <p className="font-serif text-3xl font-bold text-gold mb-1">
                    NPR {pkg.price.toLocaleString()}
                  </p>
                  <p className="text-xs font-sans text-zinc-500 mb-4">Up to {pkg.capacity} guests</p>
                  <p className="text-sm font-sans text-zinc-400 leading-relaxed mb-5">{pkg.description}</p>
                  <ul className="space-y-2 flex-1 mb-6">
                    {pkg.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-xs font-sans text-zinc-400">
                        <span className="text-gold mt-0.5 flex-shrink-0">✓</span> {f}
                      </li>
                    ))}
                  </ul>
                  <Link to={`/booking?package=${pkg._id}`}
                    className={`block text-center font-serif tracking-[0.12em] uppercase text-xs py-2.5 transition-all duration-150 ${
                      pkg.isPopular
                        ? 'bg-gold text-zinc-950 hover:bg-gold/90 shadow-[0_0_16px_rgba(201,168,76,0.2)]'
                        : 'border border-gold/40 text-gold hover:border-gold hover:bg-gold/5'
                    }`}
                    style={{ borderRadius: '2px' }}>
                    Book This Package
                  </Link>
                </div>
              ))}
            </div>
          )}

          {/* ── Call-for-Discount Disclaimer ── */}
          <div className="mt-10 border border-gold/25 bg-[rgba(201,168,76,0.04)] p-8 text-center">
            <p className="font-sans text-base text-zinc-300 mb-2">
              💡 <strong className="text-gold font-semibold">Planning a large event or flexible with weekdays?</strong>
            </p>
            <p className="font-sans text-zinc-400 mb-5">
              Rates vary based on guest count and season. Get in touch <strong className="text-white">directly via phone</strong> to secure exclusive discounts and tailored pricing.
            </p>
            <a href="tel:+9779851337076"
              className="inline-block font-serif tracking-[0.14em] uppercase text-xs px-8 py-3 bg-gold hover:bg-gold/90 text-zinc-950 font-semibold transition-all duration-150 shadow-[0_0_16px_rgba(201,168,76,0.2)]"
              style={{ borderRadius: '2px' }}>
              📞 Call for Discount — +977 9851337076
            </a>
          </div>

          {/* ── Cost Calculator ── */}
          {packages.length > 0 && (
            <div className="mt-12 border border-gold/15 bg-[rgba(255,255,255,0.02)] p-8">
              <div className="mb-6">
                <span className="font-script text-gold text-xl block mb-1">Estimate</span>
                <h2 className="font-serif text-2xl font-bold text-white tracking-widest uppercase">Event Cost Calculator</h2>
                <p className="font-sans text-sm text-zinc-500 mt-1">Get an instant estimate based on your requirements.</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  { label: 'Event Type', el: (
                    <select value={calcEvent} onChange={(e) => setCalcEvent(e.target.value as typeof EVENT_TYPES[number])}
                      className="w-full border border-gold/20 bg-[#0a0a0a] text-zinc-300 px-3 py-2.5 text-sm font-sans focus:outline-none focus:border-gold transition-colors">
                      {EVENT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                  )},
                  { label: 'Package', el: (
                    <select value={calcPkg} onChange={(e) => setCalcPkg(e.target.value)}
                      className="w-full border border-gold/20 bg-[#0a0a0a] text-zinc-300 px-3 py-2.5 text-sm font-sans focus:outline-none focus:border-gold transition-colors">
                      <option value="">Select a package</option>
                      {packages.map((p) => <option key={p._id} value={p._id}>{p.name} — NPR {p.price.toLocaleString()}</option>)}
                    </select>
                  )},
                  { label: 'Number of Guests', el: (
                    <input type="number" min="1" value={calcGuests} onChange={(e) => setCalcGuests(e.target.value)}
                      placeholder="e.g. 300"
                      className="w-full border border-gold/20 bg-[#0a0a0a] text-zinc-300 px-3 py-2.5 text-sm font-sans focus:outline-none focus:border-gold transition-colors" />
                  )},
                ].map(({ label, el }) => (
                  <div key={label}>
                    <label className="block mb-1.5 text-xs font-sans font-semibold uppercase tracking-widest text-zinc-500">{label}</label>
                    {el}
                  </div>
                ))}
              </div>
              {estimate && (
                <div className={`mt-6 p-5 border ${estimate.warning ? 'border-yellow-500/30 bg-yellow-500/5' : 'border-gold/20 bg-gold/5'}`}>
                  {estimate.warning && (
                    <p className="text-xs font-sans text-yellow-400 mb-2">⚠ Guest count exceeds package capacity ({selectedPkg?.capacity}). Consider upgrading.</p>
                  )}
                  <p className="text-sm font-sans text-zinc-400">Estimated cost for <strong className="text-white">{calcGuests} guests</strong>:</p>
                  <p className="font-serif text-3xl font-bold text-gold mt-1">
                    NPR {estimate.min.toLocaleString()} – {estimate.max.toLocaleString()}
                  </p>
                  <p className="text-xs font-sans text-zinc-500 mt-2">Final pricing depends on specific requirements. Contact us for an exact quote.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
