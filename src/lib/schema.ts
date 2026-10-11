// src/lib/schema.ts
type Faq = { q: string; a: string };

export function localBusinessJsonLd(opts: {
  name: string;
  url: string;
  telephone?: string;
  areaServed: string[];
  address?: { street?: string; city: string; region: string; postalCode?: string };
}) {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: opts.name,
    url: opts.url,
    telephone: opts.telephone,
    areaServed: opts.areaServed.map(a => ({ "@type": "Place", name: a })),
    address: opts.address
      ? {
          "@type": "PostalAddress",
          streetAddress: opts.address.street,
          addressLocality: opts.address.city,
          addressRegion: opts.address.region,
          postalCode: opts.address.postalCode,
        }
      : undefined,
  };
}

export function serviceJsonLd(opts: { serviceName: string; providerName: string; url: string; areaServed: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: opts.serviceName,
    provider: { "@type": "LocalBusiness", name: opts.providerName },
    areaServed: opts.areaServed,
    url: opts.url,
  };
}

export function faqJsonLd(faq: Faq[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map(item => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}