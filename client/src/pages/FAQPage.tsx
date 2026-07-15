import { SEOHead } from '@/components/shared/SEOHead';
import { FAQSection } from '@/components/sections/FAQSection';
import { SITE_URL } from '@/constants';

const BREADCRUMB_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
    { '@type': 'ListItem', position: 2, name: 'FAQ', item: `${SITE_URL}/faq` },
  ],
};

export default function FAQPage() {
  return (
    <>
      <SEOHead
        title="FAQ | Shree Ganesh Party Venue And Catering Service"
        description="Frequently asked questions about booking, capacity, catering, location, parking, and event types at Shree Ganesh Party Venue in Bhaktapur."
        canonicalUrl={`${SITE_URL}/faq`}
        schema={BREADCRUMB_SCHEMA}
      />

      <div className="bg-[#0a0a0a] pt-28 pb-20 px-4">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-3 mb-1">
              <span className="block h-px w-14 bg-gradient-to-r from-transparent to-gold/60" />
              <span className="font-script text-gold text-2xl leading-none">Quick Answers</span>
              <span className="block h-px w-14 bg-gradient-to-l from-transparent to-gold/60" />
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl font-bold text-white tracking-widest uppercase mt-2">Frequently Asked Questions</h1>
          </div>
          <FAQSection title="Venue FAQs" subtitle="Answers to common questions before you book." limit={12} showSchema />
        </div>
      </div>
    </>
  );
}
