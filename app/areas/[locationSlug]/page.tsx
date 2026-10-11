import { Metadata } from 'next';
import { locationsFull } from '../../../data/locations_full';
import AreaClient from './AreaClient';

type Props = {
  params: { locationSlug: string };
};

export async function generateStaticParams() {
  return locationsFull.map((l) => ({
    locationSlug: l.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const loc = locationsFull.find((l) => l.slug === params.locationSlug);
  if (!loc) return { title: 'Location Not Found' };

  return {
    title: `Irrigation & Landscaping ${loc.name} ${loc.state}`,
    description: `Professional sprinkler repair, irrigation installation, drainage, and landscaping services in ${loc.name}, ${loc.state}. Free estimates. NC-licensed.`,
    alternates: {
      canonical: `https://eliteirrigation.com/areas/${loc.slug}`,
    },
  };
}

export default function Page({ params }: Props) {
  return <AreaClient />;
}
