import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { GoogleTagManager } from "@/components/google-tag-manager";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: 'TuFirma | Firmar PDF Gratis Online',
  description: 'Firma PDF gratis y seguro en 3 pasos. 100% privado, sin subir archivos a servidores. Rápido, fácil y sin suscripción. ¡Comienza ahora!',
  keywords: ['firmar pdf gratis', 'firma digital online', 'firmar desde celular', 'firma pdf segura'],
  robots: {
    index: true,
    follow: true,
    'max-image-preview': 'large',
    'max-snippet': -1,
    'max-video-preview': -1,
  },
  alternates: {
    canonical: 'https://tufirma.app',
    languages: {
      'es': 'https://tufirma.app',
    },
  },
  openGraph: {
    title: 'TuFirma | Firma PDF Online Gratis',
    description: 'Firma PDF desde cualquier dispositivo, REALMENTE GRATIS',
    url: 'https://tufirma.app',
    siteName: 'TuFirma',
    locale: 'es_MX',
    type: 'website',
    images: [{
      url: 'https://tufirma.app/og-image.png',
      width: 1200,
      height: 630,
      alt: 'TuFirma - Firmar PDF Gratis Online',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TuFirma | Firmar PDF Gratis',
    description: 'Firma PDF desde cualquier dispositivo, REALMENTE GRATIS',
    images: ['https://tufirma.app/og-image.png'],
  },
  icons: {
    icon: [
      { url: '/favicon.png', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
  formatDetection: {
    telephone: false,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="google-site-verification" content="19Q22Hme156JFxPeVMtH8fjHiUrYFOHawf0pa-Ii4tE" />

        {/* Google Analytics 4 */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-SX53277YE0"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-SX53277YE0');
            `,
          }}
        />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'TuFirma',
              url: 'https://tufirma.app',
              logo: 'https://tufirma.app/logo2.png',
              description: 'Firma documentos PDF gratis, rápido y 100% privado.',
              sameAs: [
                'https://twitter.com/tufirma',
                'https://linkedin.com/company/tufirma',
              ],
              contactPoint: {
                '@type': 'ContactPoint',
                contactType: 'Customer Service',
                url: 'https://tufirma.app',
              },
            }),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <GoogleTagManager />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
