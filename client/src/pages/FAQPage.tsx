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

const FAQ_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Where is Shree Ganesh Party Venue located?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Shree Ganesh Party Venue is located at Ganesthan, Suryabinayak, Bhaktapur, Nepal, with easy access from Kathmandu, Lalitpur, and surrounding areas.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the venue capacity?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The venue can accommodate events ranging from 50 to 1,000 guests, suitable for intimate gatherings as well as large weddings, receptions, and corporate events.',
      },
    },
    {
      '@type': 'Question',
      name: 'What event types do you host?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'We host weddings, receptions, birthday parties, Bratabandha, Pasni ceremonies, corporate events, engagements, seminars, and catering-only engagements.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is parking available?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. We provide parking for up to 100 cars and 200 motorcycles.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the price range?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Our standard menu package starts from NPR 1,200 per plate (VAT included). Prices vary by event type and menu selection.',
      },
    },
  ],
};

export default function FAQPage() {
  return (
    <>
      <SEOHead
        title="Frequently Asked Questions | Shree Ganesh Party Venue"
        description="Answers about booking, capacity, catering, location, and event types."
        canonicalUrl={`${SITE_URL}/faq`}
        schema={[BREADCRUMB_SCHEMA, FAQ_SCHEMA]}
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
