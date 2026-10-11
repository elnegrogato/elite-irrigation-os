import { Metadata } from 'next';
import ServicesClient from './ServicesClient';

export const metadata: Metadata = {
  title: 'Outdoor Services Charlotte NC',
  description: 'Full-service outdoor property care: landscape design and installation, irrigation systems, drainage fixes, patio installs, retaining walls, hardscapes, outdoor lighting, commercial grounds, seasonal cleanup, sod / grading, and property maintenance in the Charlotte metro area.',
  alternates: {
    canonical: 'https://eliteirrigation.com/services',
  },
};

export default function ServicesPage() {
  return <ServicesClient />;
}
