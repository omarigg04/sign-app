import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileSignature, Lock, Zap, Smartphone, Shield, CheckCircle2, ArrowRight } from 'lucide-react';
import { RelatedResources } from '@/components/landing/related-resources';
import { LandingHeader } from '@/components/landing/header';

export const metadata: Metadata = {
  title: 'Firmar PDF Gratis Online | Sin Subir Archivos – TuFirma',
  description: 'Firma PDF gratis y 100% privado. Procesado en tu navegador sin subir a servidores. 1 firma gratis/semana o créditos desde $5.',
  keywords: ['firmar pdf gratis', 'firma pdf online gratis', 'firmar documentos gratis', 'firma digital gratis'],
  openGraph: {
    title: 'Firmar PDF Gratis Online Sin Subir Archivos',
    description: 'Firma documentos PDF gratis. 100% privado, procesado en tu navegador.',
    url: 'https://tufirma.app/firmar-pdf-gratis',
    type: 'website',
    locale: 'es_MX',
  },
  alternates: {
    canonical: 'https://tufirma.app/firmar-pdf-gratis',
  },
};

const faqs = [
  {
    question: '¿Es realmente gratis?',
    answer: 'Sí, completamente gratis. Puedes firmar PDFs solo registrandote en menos de 10 segundos.',
  },
  {
    question: '¿Dónde van mis archivos?',
    answer: 'Tus archivos nunca salen de tu navegador. Todo el procesamiento ocurre localmente en tu dispositivo. Nosotros no guardamos, vemos ni compartimos tus documentos.',
  },
  {
    question: '¿Necesito instalar algo?',
    answer: 'No. TuFirma funciona desde cualquier navegador web. No requiere instalación ni descargas. Abre la web y comienza a firmar en segundos.',
  },
  {
    question: '¿Funciona en mi celular?',
    answer: 'Sí. TuFirma es completamente responsivo. Funciona perfecto en Android, iPhone, tablet y computadora con el mismo nivel de seguridad.',
  },
  {
    question: '¿Qué formatos de firma soporta?',
    answer: 'Soportamos firmas manuscritas dibujadas en pantalla, firmas guardadas de sesiones anteriores, y pronto soportaremos imágenes de firma personalizadas.',
  },
];

const steps = [
  {
    number: '1',
    title: 'Sube tu PDF',
    description: 'Selecciona el documento PDF que quieres firmar desde tu computadora o celular.',
    image: '/s1.webp',
  },
  {
    number: '2',
    title: 'Crea tu firma',
    description: 'Dibuja tu firma con el mouse, trackpad o dedo. Puedes usar una firma guardada o crear una nueva.',
    image: '/s2.webp',
  },
  {
    number: '3',
    title: 'Coloca la firma',
    description: 'Arrastra y posiciona tu firma en el lugar exacto del documento. Ajusta el tamaño como necesites.',
    image: '/s3.webp',
  },
  {
    number: '4',
    title: 'Descarga firmado',
    description: 'Descarga tu PDF firmado al instante. Listo para enviar, imprimir o archivar.',
    image: '/s4.webp',
  },
];

const benefits = [
  {
    icon: Lock,
    title: '100% Privado',
    description: 'Tus documentos nunca suben a servidores. Todo procesamiento ocurre en tu dispositivo.',
  },
  {
    icon: Zap,
    title: 'Súper Rápido',
    description: 'Procesa archivos al instante. Sin esperas, sin colas, sin limitaciones de velocidad.',
  },
  {
    icon: Smartphone,
    title: 'Funciona en Celular',
    description: 'Firma desde Android, iPhone, tablet o computadora. La misma experiencia en todos lados.',
  },
  {
    icon: Shield,
    title: 'Completamente Seguro',
    description: 'Encriptación de extremo a extremo. Tus datos están protegidos según estándares internacionales.',
  },
  {
    icon: FileSignature,
    title: 'Sin Instalación',
    description: 'No requiere descargas ni instalaciones. Solo abre el navegador y comienza.',
  },
];

export default function FirmarPdfGratisPage() {
  return (
    <div className="w-full">
      <LandingHeader />
      {/* Schema.org FAQPage */}
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
              Firma PDF <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">Gratis Online</span>
            </h1>

            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Sin subir archivos. 100% privado. Procesado en tu navegador. Comienza en segundos.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg">
                <Link href="/sign">
                  <FileSignature className="mr-2 h-5 w-5" />
                  Firmar un PDF Ahora
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="#como-funciona">
                  Ver Cómo Funciona
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-4 justify-center pt-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                Sin registrarse
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                100% Gratis
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                Completamente privado
              </div>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-20 right-10 w-72 h-72 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-20 left-10 w-72 h-72 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>
      </section>

      {/* How It Works */}
      <section id="como-funciona" className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">¿Cómo Funciona?</h2>
            <p className="text-lg text-gray-600">4 pasos simples para firmar tu PDF en menos de un minuto</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <Card className="border-0 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-lg h-full overflow-hidden">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-4">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-lg">
                        {step.number}
                      </div>
                      {index < steps.length - 1 && (
                        <div className="hidden lg:block absolute top-1/2 -right-8 w-8 h-0.5 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
                      )}
                    </div>
                    <CardTitle className="text-xl">{step.title}</CardTitle>
                  </CardHeader>

                  <div className="px-6 mb-4">
                    <div className="relative w-full aspect-video rounded-lg overflow-hidden">
                      <Image
                        src={step.image}
                        alt={step.title}
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div>

                  <CardContent>
                    <p className="text-gray-600">{step.description}</p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Text */}
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold">
                Una Alternativa Honesta a las Grandes Empresas
              </h2>

              <p className="text-lg text-gray-600 leading-relaxed">
                DocuSign, Adobe Sign y otros servicios te ofrecen <span className="font-semibold">planes complicados, trials engorrosos y suscripciones que no necesitas</span> si solo tienes que sacar un trámite de vez en cuando.
              </p>

              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-red-100">
                      <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Sin Suscripción Mensual</h3>
                    <p className="text-gray-600">No pagues mes a mes por algo que usas 1 vez al año.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-green-100">
                      <CheckCircle2 className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">1 Firma Gratuita por Semana</h3>
                    <p className="text-gray-600">Para quienes solo necesitan sacar un trámite puntual. Se regenera automáticamente cada 7 días.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-blue-100">
                      <svg className="h-6 w-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-2-13h4v6h-4z" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Créditos que NUNCA Vencen</h3>
                    <p className="text-gray-600">A diferencia de otros servicios, tus créditos no expiran. Compra hoy y usa en 1 año si quieres.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-purple-100">
                      <svg className="h-6 w-6 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Paga Solo por lo que Usas</h3>
                    <p className="text-gray-600">Sin planes predeterminados. Compra créditos cuando los necesites. Máxima flexibilidad.</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6 mt-8">
                <p className="text-sm font-semibold text-blue-900 mb-2">💡 NUESTRO COMPROMISO</p>
                <p className="text-gray-700">
                  TuFirma existe para que firmes sin complicaciones. Sin sorpresas, sin pruebas de 30 días, sin obligaciones. Solo tu firma, tu privacidad y un precio justo.
                </p>
              </div>
            </div>

            {/* Right side - Comparison visual */}
            <div className="space-y-4">
              <div className="bg-red-50 border-l-4 border-red-500 rounded p-6">
                <h4 className="font-semibold text-red-900 mb-3">Otros Servicios</h4>
                <ul className="space-y-2 text-red-700 text-sm">
                  <li className="flex items-center gap-2">
                    <span className="text-lg">✕</span>
                    <span>Suscripción mensual desde $10</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-lg">✕</span>
                    <span>Créditos que vencen cada mes</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-lg">✕</span>
                    <span>Prueba de 30 días engorrosa</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-lg">✕</span>
                    <span>Planes con más firmas de las que necesitas</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-lg">✕</span>
                    <span>Cancelación complicada</span>
                  </li>
                </ul>
              </div>

              <div className="bg-green-50 border-l-4 border-green-500 rounded p-6">
                <h4 className="font-semibold text-green-900 mb-3">TuFirma</h4>
                <ul className="space-y-2 text-green-700 text-sm">
                  <li className="flex items-center gap-2">
                    <span className="text-lg">✓</span>
                    <span>1 firma gratis por semana</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-lg">✓</span>
                    <span>Créditos sin vencimiento</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-lg">✓</span>
                    <span>Comienza ahora, sin registrarse</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-lg">✓</span>
                    <span>Paga solo lo que usas</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-lg">✓</span>
                    <span>100% privado y seguro</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">¿Por Qué TuFirma?</h2>
            <p className="text-lg text-gray-600">La forma más fácil, rápida y segura de firmar PDFs</p>
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

      {/* FAQ Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-2xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Preguntas Frecuentes</h2>
            <p className="text-lg text-gray-600">Respuestas a las dudas más comunes</p>
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
            title: 'Firma Digital Online',
            description: 'Descubre cómo crear y guardar tu firma digital para usarla en múltiples documentos.',
            href: '/firma-digital-online',
          },
          {
            title: 'Firmar desde Celular',
            description: 'Guía completa para firmar PDFs directamente desde tu teléfono Android o iPhone.',
            href: '/firmar-desde-celular',
          },
          {
            title: 'Firma Segura y Privada',
            description: 'Aprende cómo TuFirma protege tus documentos con encriptación de extremo a extremo.',
            href: '/firma-pdf-segura',
          },
          {
            title: 'Alternativa a DocuSign',
            description: 'Compara TuFirma con DocuSign y descubre por qué es más barato y privado.',
            href: '/alternativa-docusign',
          },
        ]}
      />

      {/* Final CTA */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-600 to-indigo-600">
        <div className="container mx-auto text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            ¿Listo para Firmar tu Primer PDF?
          </h2>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Sin registrarse, sin costo, sin complicaciones. Solo tu PDF y tu firma.
          </p>
          <Button
            asChild
            size="lg"
            className="bg-white text-blue-600 hover:bg-gray-100 shadow-lg font-semibold"
          >
            <Link href="/sign" className="gap-2">
              <FileSignature className="h-5 w-5" />
              Firmar un PDF Ahora
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
