import { useSearchParams } from 'react-router-dom';
import { SEOHead } from '@/components/shared/SEOHead';
import BookingForm from '@/components/forms/BookingForm';
import { FAQSection } from '@/components/sections/FAQSection';

export default function Booking() {
  const [searchParams] = useSearchParams();
  const packageId = searchParams.get('package') ?? undefined;

  return (
    <>
      <SEOHead
        title="Book Your Event"
        description="Book Shree Ganesh Party Venue online. No payment required. We confirm only after mutual discussion."
        canonicalUrl="https://shreeganeshsharma.com/booking"
      />
      <div className="bg-[#0a0a0a] pt-28 pb-20 px-4">
        <div className="mx-auto max-w-2xl">
          {/* Section header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-1">
              <span className="block h-px w-14 bg-gradient-to-r from-transparent to-gold/60" />
              <span className="font-script text-gold text-2xl leading-none">Reserve Your Date</span>
              <span className="block h-px w-14 bg-gradient-to-l from-transparent to-gold/60" />
            </div>
            <h1 className="font-serif text-4xl font-bold text-white tracking-widest uppercase mt-2">Book Your Event</h1>
            <p className="mt-4 font-sans text-base italic text-zinc-400">
              Fill in your details and we'll contact you within 30 minutes to confirm.
            </p>
          </div>

          <div className="border border-gold/15 bg-[rgba(255,255,255,0.02)] p-6 sm:p-8">
            <BookingForm prefilledPackageId={packageId} />
          </div>
        </div>
      </div>
      <FAQSection title="Booking FAQs" subtitle="Common questions about booking your event." limit={6} />
    </>
  );
}
