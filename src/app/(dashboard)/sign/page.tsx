'use client';

import dynamic from 'next/dynamic';
import { SignPageSkeleton } from '@/components/skeleton/sign-page-skeleton';

// Import the client component with SSR disabled
const SignPageClient = dynamic(
  () => import('./sign-client').then(mod => ({ default: mod.SignPageClient })),
  {
    ssr: false,
    loading: () => <SignPageSkeleton />
  }
);

export default function SignPage() {
  return <SignPageClient />;
}
