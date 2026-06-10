import { useSearchParams } from 'react-router-dom';
import { SEOHead } from '@/components/shared/SEOHead';
import BookingForm from '@/components/forms/BookingForm';
import { FAQSection } from '@/components/sections/FAQSection';
import { PageHeader } from '@/components/ui/PageHeader';

export default function Booking() {
  const [searchParams] = useSearchParams();
  const packageId = searchParams.get('package') ?? undefined;

  return (
    <>
      <SEOHead
        title="Book Your Event"
        description="Book Shree Ganesh Party Venue online. Submit your event details and we'll get back to you within 24 hours."
        canonicalUrl="https://shreeganeshsharma.com/booking"
      />
      <div className="bg-zinc-950 pt-24 pb-16 px-4">
        <div className="relative z-10 mx-auto max-w-2xl">
          <PageHeader
            title="Book Your Event"
            description="Fill in your event details and we'll contact you within 24 hours to confirm your booking."
            breadcrumb="Booking"
          />
          <div className="rounded-xl border border-white/5 bg-zinc-900/30 p-6 backdrop-blur-sm">
            <BookingForm prefilledPackageId={packageId} />
          </div>
        </div>
      </div>
      <FAQSection title="Booking FAQs" subtitle="Common questions about booking your event." limit={6} />
    </>
  );
}
