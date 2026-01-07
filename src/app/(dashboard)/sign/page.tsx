'use client';

import dynamic from 'next/dynamic';

// Import the client component with SSR disabled
const SignPageClient = dynamic(
  () => import('./sign-client').then(mod => ({ default: mod.SignPageClient })),
  {
    ssr: false,
    loading: () => <div className="flex h-screen items-center justify-center">Cargando...</div>
  }
);

export default function SignPage() {
  return <SignPageClient />;
}
