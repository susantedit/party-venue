import { Helmet } from 'react-helmet-async';
import { SITE_URL } from '@/constants';

const DEFAULT_OG_IMAGE = `${SITE_URL}/shreeganeshpartyvenue(withbg-of-white).png`;

interface SEOHeadProps {
  title: string;
  description?: string;
  ogImage?: string;
  ogImageAlt?: string;
  canonicalUrl?: string;
  noIndex?: boolean;
  schema?: object | object[];
}

export function SEOHead({
  title,
  description,
  ogImage,
  ogImageAlt,
  canonicalUrl,
  noIndex,
  schema,
}: SEOHeadProps) {
  const fullTitle = title.includes('Shree Ganesh')
    ? title
    : `${title} | Shree Ganesh Party Venue And Catering Service`;

  const defaultDesc =
    'Shree Ganesh Party Venue And Catering Service in Bhaktapur, Nepal. Weddings, receptions, birthdays, Bratabandha, Pasni, corporate events, and catering.';

  const activeCanonical = canonicalUrl || (typeof window !== 'undefined' ? `${SITE_URL}${window.location.pathname}` : SITE_URL);
  const resolvedImage = ogImage && ogImage !== '' ? ogImage : DEFAULT_OG_IMAGE;
  const resolvedImageAlt = ogImageAlt ?? fullTitle;

  // Normalise schema to array for uniform rendering
  const schemas: object[] = schema
    ? Array.isArray(schema)
      ? schema
      : [schema]
    : [];

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description ?? defaultDesc} />
      {noIndex ? (
        <meta name="robots" content="noindex,nofollow" />
      ) : (
        <meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1" />
      )}
      <link rel="canonical" href={activeCanonical} />
      <link rel="alternate" hrefLang="en" href={activeCanonical} />
      <link rel="alternate" hrefLang="x-default" href={activeCanonical} />

      {/* Open Graph */}
      <meta property="og:locale" content="en_US" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description ?? defaultDesc} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Shree Ganesh Party Venue And Catering Service" />
      <meta property="og:url" content={activeCanonical} />
      <meta property="og:image" content={resolvedImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={resolvedImageAlt} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description ?? defaultDesc} />
      <meta name="twitter:image" content={resolvedImage} />

      {/* JSON-LD schema — one script tag per schema object */}
      {schemas.map((s, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(s)}
        </script>
      ))}
    </Helmet>
  );
}
