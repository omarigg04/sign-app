import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileSignature, Lock, Zap, Smartphone, Shield, CheckCircle2, ArrowRight } from 'lucide-react';
import { RelatedResources } from '@/components/landing/related-resources';
import { LandingHeader } from '@/components/landing/header';

export const metadata: Metadata = {
  title: 'Firmar Documentos desde Celular - Gratis y Seguro | TuFirma',
  description: 'Firma PDF desde tu celular en 3 pasos. Android, iPhone, tablet. Sin app, 100% privado, procesado en tu dispositivo. Rápido y seguro.',
  keywords: ['firmar desde celular', 'firmar pdf desde celular', 'firmar desde móvil', 'firmar en el celular gratis'],
  openGraph: {
    title: 'Firmar Documentos desde Celular - Gratis',
    description: 'Firma PDFs desde tu teléfono sin límites.',
    url: 'https://tufirma.app/firmar-desde-celular',
    type: 'website',
    locale: 'es_MX',
  },
  alternates: {
    canonical: 'https://tufirma.app/firmar-desde-celular',
  },
};

const faqs = [
  {
    question: '¿Funciona en Android y iPhone?',
    answer: 'Sí, completamente. TuFirma funciona en cualquier navegador móvil. Prueba en Chrome, Firefox, Safari o cualquier otro navegador.',
  },
  {
    question: '¿Necesito instalar una app?',
    answer: 'No. TuFirma es 100% web. Solo abre tu navegador y comienza. Opcionalmente, puedes agregar TuFirma como app a tu pantalla de inicio.',
  },
  {
    question: '¿Puedo firmar con el dedo?',
    answer: 'Sí. Dibuja tu firma directamente con tu dedo en la pantalla. Si tienes un stylus o S Pen, también funciona perfectamente.',
  },
  {
    question: '¿Qué tamaño de archivos puedo cargar?',
    answer: 'Archivos de hasta 100MB. Todo se procesa en tu teléfono, así que depende de la memoria disponible en tu dispositivo.',
  },
  {
    question: '¿Necesito conexión a internet?',
    answer: 'Para cargar el PDF necesitas internet. Una vez cargado y mientras firmas, puedes trabajar sin conexión (depende del navegador).',
  },
  {
    question: '¿Se ve bien en pantalla pequeña?',
    answer: 'Totalmente. TuFirma está diseñado específicamente para móviles. El layout se adapta perfectamente a cualquier tamaño de pantalla.',
  },
];

const benefits = [
  {
    icon: Smartphone,
    title: 'Funciona en Cualquier Celular',
    description: 'Android, iPhone, Windows Phone o cualquier dispositivo con navegador web.',
  },
  {
    icon: Lock,
    title: '100% Privado en Tu Celular',
    description: 'Tus documentos se procesan en tu teléfono, nunca en nuestros servidores.',
  },
  {
    icon: Zap,
    title: 'Rápido y Fluido',
    description: 'Interfaz optimizada para móviles. Todo funciona sin lag ni demoras.',
  },
  {
    icon: Shield,
    title: 'Seguridad de Grado Banco',
    description: 'Encriptación y protocolos de seguridad como si estuvieras usando un cajero.',
  },
  {
    icon: FileSignature,
    title: 'Firmas Naturales',
    description: 'Dibuja con tu dedo como si estuvieras en papel. Tu firma se ve natural y válida.',
  },
];

export default function FirmarDesdeCelularPage() {
  return (
    <div className="w-full">
      <LandingHeader />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faqs.map((faq) => ({
              '@type': 'Question',
              name: faq.question,
              acceptedAnswer: {
                '@type': 'Answer',
                text: faq.answer,
              },
            })),
          }),
        }}
      />

      {/* Hero Section */}
      <section
        className="relative min-h-[600px] pt-20 pb-32 px-4"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(255,255,255,1) 0%, rgba(219,234,254,0.6) 40%, rgba(199,210,254,0.4) 100%)',
        }}
      >
        <div className="container mx-auto">
          <div className="text-center space-y-6 animate-fade-in-up">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold max-w-3xl mx-auto leading-tight">
              Firmar desde <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">tu Celular</span>
            </h1>

            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Firma documentos PDF desde Android o iPhone sin instalar apps. Gratis, seguro y en segundos.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg">
                <Link href="/sign">
                  <FileSignature className="mr-2 h-5 w-5" />
                  Firmar Desde Mi Celular
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="#caracteristicas">
                  Ver Características
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>

            <div className="flex flex-wrap gap-4 justify-center pt-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                iOS y Android
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                Sin Apps
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                100% Gratis
              </div>
            </div>
          </div>
        </div>

        <div className="absolute top-20 right-10 w-72 h-72 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-20 left-10 w-72 h-72 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>
      </section>

      {/* Why Mobile */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">¿Por Qué Firmar desde tu Celular?</h2>
            <p className="text-lg text-gray-600">La forma más cómoda de firmar en cualquier momento</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            <div className="space-y-4">
              <h3 className="font-semibold text-xl text-gray-900">Libertad Total</h3>
              <p className="text-gray-600">Firma mientras viajas, en la reunión, en casa, en la oficina. Tu celular, tu libertad.</p>
            </div>
            <div className="space-y-4">
              <h3 className="font-semibold text-xl text-gray-900">Sin Instalaciones</h3>
              <p className="text-gray-600">No ocupas espacio en tu teléfono. Solo abre el navegador y listo.</p>
            </div>
            <div className="space-y-4">
              <h3 className="font-semibold text-xl text-gray-900">Siempre Disponible</h3>
              <p className="text-gray-600">Cuando necesites firmar un documento urgente, TuFirma está ahí en tu bolsillo.</p>
            </div>
            <div className="space-y-4">
              <h3 className="font-semibold text-xl text-gray-900">Experiencia Optimizada</h3>
              <p className="text-gray-600">Diseñado desde cero para pantallas móviles. Rápido, fluido y fácil de usar.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="caracteristicas" className="py-20 px-4 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Características Móviles</h2>
            <p className="text-lg text-gray-600">Optimizado para tu teléfono</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mb-4 shadow-lg shadow-blue-500/30">
                    <benefit.icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle>{benefit.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-2xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Preguntas sobre Móviles</h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <details
                key={index}
                className="group border border-gray-200 rounded-lg hover:border-blue-200 transition-colors"
              >
                <summary className="flex items-center justify-between p-6 cursor-pointer font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                  {faq.question}
                  <span className="ml-4 transform group-open:rotate-180 transition-transform">
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 14l-7 7m0 0l-7-7m7 7V3"
                      />
                    </svg>
                  </span>
                </summary>
                <div className="px-6 pb-6 text-gray-600 border-t border-gray-100">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Related Resources */}
      <RelatedResources
        resources={[
          {
            title: 'Firmar PDF Gratis',
            description: 'Guía completa para firmar documentos PDF sin límites ni restricciones.',
            href: '/firmar-pdf-gratis',
          },
          {
            title: 'Firma Digital Online',
            description: 'Crea y guarda tu firma digital para usarla en múltiples documentos.',
            href: '/firma-digital-online',
          },
          {
            title: 'Alternativa a DocuSign',
            description: 'Compara TuFirma con DocuSign y ahorra hasta el 80% en costos.',
            href: '/alternativa-docusign',
          },
          {
            title: 'Privacidad y Seguridad',
            description: 'Aprende cómo TuFirma protege tus documentos con encriptación avanzada.',
            href: '/firma-pdf-segura',
          },
        ]}
      />

      {/* CTA */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-600 to-indigo-600">
        <div className="container mx-auto text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Comienza a Firmar desde tu Celular
          </h2>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Sin apps, sin instalaciones, sin complicaciones. Solo tu celular y TuFirma.
          </p>
          <Button
            asChild
            size="lg"
            className="bg-white text-blue-600 hover:bg-gray-100 shadow-lg font-semibold"
          >
            <Link href="/sign" className="gap-2">
              <Smartphone className="h-5 w-5" />
              Abrir en Mi Celular
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
