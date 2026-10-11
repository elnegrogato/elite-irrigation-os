import { Metadata } from 'next';
import { services } from '../../../data/services';
import ServiceClient from './ServiceClient';

type Props = {
  params: { slug: string };
};

export async function generateStaticParams() {
  return services.map((s) => ({
    slug: s.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const svc = services.find((s) => s.slug === params.slug);
  if (!svc) return { title: 'Service Not Found' };
  const url = `https://eliteirrigation.com/services/${svc.slug}`;
  const title = `${svc.name} Charlotte NC`;
  const description = `${svc.quickSummary} Request clear guidance, photo-ready intake, and scheduling help from Elite Irrigation & Landscaping in the Charlotte area.`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      type: "website",
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: `${svc.name} by Elite Irrigation & Landscaping in Charlotte NC`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/og-image.png"],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default function Page({ params }: Props) {
  return <ServiceClient />;
}
