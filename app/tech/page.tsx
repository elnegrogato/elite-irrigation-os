import { Metadata } from 'next';
import TechJobsClient from './TechJobsClient';

export const metadata: Metadata = {
  title: 'My Jobs | Elite Tech',
  robots: { index: false, follow: false },
};

export default function TechPage() {
  return <TechJobsClient />;
}
