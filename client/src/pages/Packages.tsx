import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import axiosInstance from '@/lib/axiosInstance';
import { SEOHead } from '@/components/shared/SEOHead';
import { SkeletonLoader } from '@/components/shared/SkeletonLoader';
import { EVENT_TYPES } from '@/constants';
import type { Package } from '@/types';
import { PageHeader } from '@/components/ui/PageHeader';

function calculateCost(pkg: Package, guests: number) {
  const perHead = pkg.price / pkg.capacity;
  return {
    min: Math.round(perHead * guests * 0.9),
    max: Math.round(perHead * guests * 1.1),
    warning: guests > pkg.capacity,
  };
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
      <div className="bg-zinc-950 pt-24 pb-16 px-4">
        <div className="relative z-10 mx-auto max-w-6xl">
          <PageHeader
            title="Event Packages"
            description="Choose the package that fits your celebration. All packages include venue, setup, and coordination."
            breadcrumb="Packages"
          />

          {/* Package grid */}
          {isLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => <SkeletonLoader key={i} className="h-80 rounded-2xl" />)}
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {packages.map((pkg) => (
                <div
                  key={pkg._id}
                  className={`relative rounded-2xl bg-white p-6 shadow-sm flex flex-col ${
                    pkg.isPopular ? 'ring-2 ring-gold-500 shadow-lg' : 'border border-gray-100'
                  }`}
                >
                  {pkg.isPopular && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gold-500 px-3 py-0.5 text-xs font-bold text-white">
                      Most Popular
                    </span>
                  )}
                  <h3 className="font-serif text-xl font-bold text-charcoal capitalize">{pkg.name}</h3>
                  <p className="mt-1 text-sm text-gray-400 capitalize">{pkg.category} Package</p>
                  <p className="mt-3 text-2xl font-bold text-gold-600">
                    NPR {pkg.price.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-400">Up to {pkg.capacity} guests</p>
                  <p className="mt-2 text-sm text-gray-500">{pkg.description}</p>
                  <ul className="mt-4 space-y-1 flex-1">
                    {pkg.features.map((f) => (
                      <li key={f} className="flex items-start gap-1 text-xs text-gray-600">
                        <span className="text-gold-500 mt-0.5">✓</span> {f}
                      </li>
                    ))}
                  </ul>
                  <Link
                    to={`/booking?package=${pkg._id}`}
                    className={`mt-6 block rounded-lg py-2 text-center text-sm font-semibold transition ${
                      pkg.isPopular
                        ? 'bg-gold-500 text-white hover:bg-gold-600'
                        : 'border border-gold-500 text-gold-600 hover:bg-gold-50'
                    }`}
                  >
                    Book This Package
                  </Link>
                </div>
              ))}
            </div>
          )}

          <div className="mt-6 text-center">
            <Link to="/contact" className="text-sm text-gold-600 underline hover:text-gold-700">
              Need a custom package? Contact us →
            </Link>
          </div>

          {/* Cost Calculator */}
          {packages.length > 0 && (
            <div className="mt-16 rounded-2xl bg-surface p-8">
              <h2 className="font-serif text-2xl font-bold text-charcoal mb-2">Event Cost Calculator</h2>
              <p className="text-sm text-gray-500 mb-6">Get an instant cost estimate based on your requirements.</p>
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Event Type</label>
                  <select value={calcEvent} onChange={(e) => setCalcEvent(e.target.value as typeof EVENT_TYPES[number])}
                    className="w-full rounded-lg border bg-white px-3 py-2 text-sm">
                    {EVENT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Package</label>
                  <select value={calcPkg} onChange={(e) => setCalcPkg(e.target.value)}
                    className="w-full rounded-lg border bg-white px-3 py-2 text-sm">
                    <option value="">Select a package</option>
                    {packages.map((p) => <option key={p._id} value={p._id}>{p.name} — NPR {p.price.toLocaleString()}</option>)}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Number of Guests</label>
                  <input type="number" min="1" value={calcGuests} onChange={(e) => setCalcGuests(e.target.value)}
                    placeholder="e.g. 300"
                    className="w-full rounded-lg border bg-white px-3 py-2 text-sm" />
                </div>
              </div>
              {estimate && (
                <div className={`mt-6 rounded-xl p-4 ${estimate.warning ? 'bg-yellow-50 border border-yellow-200' : 'bg-green-50 border border-green-200'}`}>
                  {estimate.warning && (
                    <p className="text-xs text-yellow-700 mb-2">⚠ Guest count exceeds package capacity ({selectedPkg?.capacity}). Consider upgrading.</p>
                  )}
                  <p className="text-sm text-gray-600">Estimated cost for <strong>{calcGuests} guests</strong>:</p>
                  <p className="text-2xl font-bold text-charcoal mt-1">
                    NPR {estimate.min.toLocaleString()} – {estimate.max.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">Final pricing depends on specific requirements. Contact us for an exact quote.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
