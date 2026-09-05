import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileSignature, Lock, Zap, Smartphone, Shield, CheckCircle2, ArrowRight } from 'lucide-react';
import { RelatedResources } from '@/components/landing/related-resources';
import { LandingHeader } from '@/components/landing/header';

export const metadata: Metadata = {
  title: 'Firma Digital Online - Segura y Completamente Privada | TuFirma',
  description: 'Crea y guarda tu firma digital online. Encriptada, privada, sin subir documentos. Úsala en múltiples PDFs. Gratis para probar. Sin suscripción.',
  keywords: ['firma digital online', 'firma digital', 'crear firma digital', 'firma electrónica online'],
  openGraph: {
    title: 'Firma Digital Online - Segura y Privada',
    description: 'Crea tu firma digital online sin compartir tus datos.',
    url: 'https://tufirma.app/firma-digital-online',
    type: 'website',
    locale: 'es_MX',
  },
  alternates: {
    canonical: 'https://tufirma.app/firma-digital-online',
  },
};

const faqs = [
  {
    question: '¿Qué es una firma digital online?',
    answer: 'Una firma digital online es tu firma manuscrita capturada digitalmente que puedes usar para firmar documentos PDF. Es legalmente válida y mucho más práctica que imprimir, firmar y escanear.',
  },
  {
    question: '¿Mi firma digital es legalmente válida?',
    answer: 'En la mayoría de jurisdicciones, sí. Las firmas digitales capturadas en pantalla son válidas para muchos documentos. Consulta con autoridades locales para documentos legales específicos.',
  },
  {
    question: '¿Puedo guardar varias firmas diferentes?',
    answer: 'Sí. TuFirma te permite guardar múltiples firmas (formal, rúbrica, iniciales, etc.) en tu biblioteca personal y usarlas cuando necesites.',
  },
  {
    question: '¿Dónde se guardan mis firmas digitales?',
    answer: 'En tu navegador y en tu cuenta de TuFirma (si lo deseas). Siempre bajo tu control. Nosotros no compartimos ni vendemos tus datos.',
  },
  {
    question: '¿Puedo cambiar mi firma digital después?',
    answer: 'Sí. Puedes crear nuevas firmas, editar las existentes o eliminar las antiguas en cualquier momento desde tu perfil.',
  },
];

const benefits = [
  {
    icon: Shield,
    title: 'Completamente Seguro',
    description: 'Tu firma nunca sale de tu dispositivo. Encriptación de extremo a extremo en todas las transferencias.',
  },
  {
    icon: Lock,
    title: 'Privacidad Total',
    description: 'No pedimos datos personales innecesarios. Tu firma es solo tuya, siempre bajo tu control.',
  },
  {
    icon: Zap,
    title: 'Instantáneo',
    description: 'Crea tu firma en segundos. Sin esperas, sin tramites complicados, sin verificaciones lentas.',
  },
  {
    icon: Smartphone,
    title: 'Funciona en Cualquier Dispositivo',
    description: 'Dibuja con el mouse, trackpad, stylus o dedo en tablet. La misma facilidad en todos lados.',
  },
  {
    icon: FileSignature,
    title: 'Firma Desde Cualquier Lugar',
    description: 'Online, offline (cuando ya tienes tu firma guardada), en la oficina o desde casa.',
  },
];

export default function FirmaDigitalOnlinePage() {
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
              Firma Digital <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">Online Segura</span>
            </h1>

            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Crea tu firma digital en segundos. Privacidad garantizada, sin subir datos a servidores.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg">
                <Link href="/sign">
                  <FileSignature className="mr-2 h-5 w-5" />
                  Crear Mi Firma Digital
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="#beneficios">
                  Ver Beneficios
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>

            <div className="flex flex-wrap gap-4 justify-center pt-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                Válida legalmente
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                100% Privada
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                Gratis
              </div>
            </div>
          </div>
        </div>

        <div className="absolute top-20 right-10 w-72 h-72 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-20 left-10 w-72 h-72 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>
      </section>

      {/* Benefits Section */}
      <section id="beneficios" className="py-20 px-4 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">¿Por Qué Crear Tu Firma Digital en TuFirma?</h2>
            <p className="text-lg text-gray-600">Lo más fácil, seguro y privado</p>
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

      {/* How to Use */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-3xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Cómo Usar Tu Firma Digital</h2>
            <p className="text-lg text-gray-600">3 pasos simples</p>
          </div>

          <div className="space-y-6">
            {[
              {
                number: '1',
                title: 'Crea tu firma digital',
                description: 'Dibuja tu firma en el canvas de TuFirma. Puedes hacer una firma formal, una rúbrica o tus iniciales.'
              },
              {
                number: '2',
                title: 'Guárdala en tu biblioteca',
                description: 'Una vez creada, guarda tu firma con un nombre. Podrás usarla siempre que lo necesites.'
              },
              {
                number: '3',
                title: 'Úsala para firmar PDFs',
                description: 'Carga un PDF, selecciona tu firma guardada y colócala donde necesites. Listo para descargar.'
              },
            ].map((step, index) => (
              <div key={index} className="flex gap-6">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-bold">
                    {step.number}
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-4 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40">
        <div className="container mx-auto max-w-2xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Preguntas Frecuentes</h2>
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
            description: 'Sube tu PDF y firma al instante sin complicaciones. Procesado 100% en tu navegador.',
            href: '/firmar-pdf-gratis',
          },
          {
            title: 'Firmar desde Celular',
            description: 'Firma documentos directamente desde tu teléfono. Android, iPhone, tablet o computadora.',
            href: '/firmar-desde-celular',
          },
          {
            title: 'Seguridad de Datos',
            description: 'Descubre cómo protegemos tus documentos con encriptación de extremo a extremo.',
            href: '/firma-pdf-segura',
          },
          {
            title: 'Blog de TuFirma',
            description: 'Guías, consejos y comparativas sobre firmas digitales.',
            href: '/blog',
          },
        ]}
      />

      {/* CTA */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-600 to-indigo-600">
        <div className="container mx-auto text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Crea Tu Firma Digital Ahora
          </h2>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Gratis, seguro y en segundos. Sin datos personales, sin complicaciones.
          </p>
          <Button
            asChild
            size="lg"
            className="bg-white text-blue-600 hover:bg-gray-100 shadow-lg font-semibold"
          >
            <Link href="/sign" className="gap-2">
              <FileSignature className="h-5 w-5" />
              Empezar Ahora
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
