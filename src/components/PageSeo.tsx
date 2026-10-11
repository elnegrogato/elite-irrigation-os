interface PageSeoProps {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  ogType?: string;
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
}

export default function PageSeo({ title, description, canonical, ogImage, ogType, jsonLd }: PageSeoProps) {
  void title;
  void description;
  void canonical;
  void ogImage;
  void ogType;
  return (
    <>
      {jsonLd && (
        Array.isArray(jsonLd)
          ? jsonLd.map((schema, i) => (
              <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
            ))
          : <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      )}
    </>
  );
}

export function makeServiceSchema(name: string, description: string, url: string, area?: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    provider: {
      "@type": "LocalBusiness",
      name: "Elite Irrigation & Landscaping",
      telephone: "+1-704-886-4240",
      logo: "https://eliteirrigation.com/Elite-Irrigation-and-Landscaping-optimized.png",
      openingHours: ["Mo-Fr 07:00-17:00", "Sa-Su 07:30-16:00"],
      openingHoursSpecification: [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          opens: "07:00",
          closes: "17:00",
        },
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Saturday", "Sunday"],
          opens: "07:30",
          closes: "16:00",
        },
      ],
      sameAs: [
        "https://www.facebook.com/profile.php?id=100063566473826",
        "https://www.linkedin.com/company/elite-irrigation-llc/",
      ],
      address: {
        "@type": "PostalAddress",
        streetAddress: "4502 Rocky River Rd",
        addressLocality: "Harrisburg",
        addressRegion: "NC",
        postalCode: "28075",
      },
    },
    areaServed: area || {
      "@type": "GeoCircle",
      geoMidpoint: { "@type": "GeoCoordinates", latitude: 35.3245, longitude: -80.6447 },
      geoRadius: "32186",
    },
    url: `https://eliteirrigation.com${url}`,
  };
}

export function makeFaqSchema(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };
}

export function makeBreadcrumbSchema(items: { name: string; url?: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      ...(item.url ? { item: `https://eliteirrigation.com${item.url}` } : {}),
    })),
  };
}

export function makeHowToSchema(name: string, description: string, steps: { name: string; text: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name,
    description,
    step: steps.map((step, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: step.name,
      text: step.text,
    })),
  };
}
