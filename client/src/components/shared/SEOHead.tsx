import { Helmet } from 'react-helmet-async';

interface SEOHeadProps {
  title: string;
  description?: string;
  ogImage?: string;
  canonicalUrl?: string;
  noIndex?: boolean;
  schema?: object;
}

export function SEOHead({ title, description, ogImage, canonicalUrl, noIndex, schema }: SEOHeadProps) {
  const fullTitle = title.includes('Shree Ganesh') ? title : `${title} | Shree Ganesh Party Venue And Catering Service`;
  const defaultDesc = 'Shree Ganesh Party Venue And Catering Service in Bhaktapur, Nepal. Weddings, receptions, birthdays, Bratabandha, Pasni, corporate events, and catering.';

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description ?? defaultDesc} />
      {noIndex && <meta name="robots" content="noindex,nofollow" />}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description ?? defaultDesc} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Shree Ganesh Party Venue And Catering Service" />
      {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
      {ogImage && <meta property="og:image" content={ogImage} />}

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description ?? defaultDesc} />
      {ogImage && <meta name="twitter:image" content={ogImage} />}

      {/* JSON-LD schema */}
      {schema && (
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      )}
    </Helmet>
  );
}
