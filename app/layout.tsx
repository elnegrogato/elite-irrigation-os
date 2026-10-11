import './globals.css';
import ConvexClientProvider from './ConvexClientProvider';
import type { Metadata } from 'next';

const siteUrl = new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://eliteirrigation.com');
const socialProfiles = [
  'https://www.facebook.com/profile.php?id=100063566473826',
  'https://www.linkedin.com/company/elite-irrigation-llc/',
];
const openingHoursSpecification = [
  {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    opens: '07:00',
    closes: '17:00',
  },
  {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Saturday', 'Sunday'],
    opens: '07:30',
    closes: '16:00',
  },
];
const businessName = 'Elite Irrigation & Landscaping';
const title = 'Elite Irrigation & Landscaping | Charlotte Irrigation, Drainage & Landscaping';
const description =
  'Elite Irrigation & Landscaping helps Charlotte-area homeowners, HOAs, commercial sites, and estate properties repair irrigation, solve drainage, improve landscapes, build hardscapes, add lighting, and maintain outdoor spaces.';

export const metadata: Metadata = {
  metadataBase: siteUrl,
  applicationName: businessName,
  title: {
    default: title,
    template: `%s | ${businessName}`,
  },
  description,
  keywords: [
    'Charlotte irrigation repair',
    'Charlotte landscaping company',
    'sprinkler repair Charlotte',
    'drainage contractor Charlotte',
    'commercial landscape maintenance',
    'HOA grounds maintenance',
    'estate maintenance Charlotte',
    'landscape design and installation',
    'irrigation and water management services',
    'patio installs',
    'retaining walls',
    'drainage fixes',
    'commercial grounds',
    'Elite Irrigation and Landscaping',
  ],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: businessName,
    title,
    description,
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Elite Irrigation & Landscaping Charlotte outdoor services',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: ['/og-image.png'],
  },
  icons: {
    icon: '/favicon.svg',
    apple: '/apple-touch-icon.svg',
  },
  manifest: '/site.webmanifest',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
};

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: businessName,
  url: siteUrl.toString(),
  logo: new URL('/Elite-Irrigation-and-Landscaping-optimized.png', siteUrl).toString(),
  sameAs: socialProfiles,
  contactPoint: [
    {
      '@type': 'ContactPoint',
      telephone: '+1-704-886-4240',
      contactType: 'customer service',
      areaServed: 'US-NC',
      availableLanguage: 'English',
    },
  ],
};

const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'HomeAndConstructionBusiness',
  name: businessName,
  url: siteUrl.toString(),
  image: new URL('/og-image.png', siteUrl).toString(),
  logo: new URL('/Elite-Irrigation-and-Landscaping-optimized.png', siteUrl).toString(),
  sameAs: socialProfiles,
  telephone: '+1-704-886-4240',
  openingHours: ['Mo-Fr 07:00-17:00', 'Sa-Su 07:30-16:00'],
  openingHoursSpecification,
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Harrisburg',
    addressRegion: 'NC',
    addressCountry: 'US',
  },
  areaServed: ['Charlotte', 'Harrisburg', 'Concord', 'Huntersville', 'Cornelius', 'Matthews'],
  priceRange: '$$',
};

const serviceCatalogSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Charlotte Landscaping, Irrigation, Drainage and Outdoor Services',
  description,
  provider: {
    '@type': 'HomeAndConstructionBusiness',
    name: businessName,
    telephone: '+1-704-886-4240',
    url: siteUrl.toString(),
  },
  areaServed: ['Charlotte', 'Harrisburg', 'Concord', 'Huntersville', 'Cornelius', 'Matthews'],
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Elite Outdoor Property Services',
    itemListElement: [
      'Irrigation',
      'Drainage',
      'Hardscapes',
      'Outdoor Living',
      'Lighting',
      'Maintenance',
      'Landscaping',
      'Turf & Grading',
      'Seasonal Services',
      'Commercial Grounds',
      'HOA Grounds',
      'Estate Maintenance',
      'Design',
      'Tree & Brush',
      'Landscape Design and Installation',
      'Irrigation Systems',
      'Drainage Fixes',
      'Patio Installs',
      'Retaining Walls',
      'Outdoor Lighting',
      'Commercial Grounds',
      'Property Maintenance',
    ].map((name) => ({
      '@type': 'Offer',
      itemOffered: {
        '@type': 'Service',
        name,
      },
    })),
  },
};

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: businessName,
  url: siteUrl.toString(),
  potentialAction: {
    '@type': 'SearchAction',
    target: `${siteUrl.toString().replace(/\/$/, '')}/services?search={search_term_string}`,
    'query-input': 'required name=search_term_string',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="font-sans antialiased selection:bg-forest-200">
        {[organizationSchema, localBusinessSchema, serviceCatalogSchema, websiteSchema].map((schema, index) => (
          <script
            key={index}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
          />
        ))}
        <ConvexClientProvider>
          {children}
        </ConvexClientProvider>
      </body>
    </html>
  );
}
