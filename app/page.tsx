import { PublicHome } from '../src/components/PublicPages';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  alternates: { canonical: 'https://eliteirrigation.com/' },
};

export default function HomePage() {
  return <PublicHome />;
}
