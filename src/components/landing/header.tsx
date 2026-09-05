import Link from 'next/link';
import Image from 'next/image';

export function LandingHeader() {
  return (
    <header className="w-full" style={{ backgroundColor: '#FBFAFB' }}>
      <div className="container mx-auto px-4 py-6">
        <Link href="/" className="inline-block">
          <Image
            src="/logo.webp"
            alt="TuFirma - Firma PDF Gratis Online"
            width={240}
            height={80}
            className="h-24 w-auto transition-transform hover:scale-105 duration-300"
            unoptimized
          />
        </Link>
      </div>
    </header>
  );
}
