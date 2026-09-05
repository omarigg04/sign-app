import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileSignature, Lock, Zap, Smartphone, Shield, CheckCircle2, ArrowRight } from 'lucide-react';
import { RelatedResources } from '@/components/landing/related-resources';
import { LandingHeader } from '@/components/landing/header';

export const metadata: Metadata = {
  title: 'Firma PDF de Forma Segura y Privada | TuFirma',
  description: 'La forma más segura de firmar PDFs online. Tus documentos nunca salen de tu navegador. Encriptación de extremo a extremo.',
  keywords: ['firma pdf segura', 'firmar pdf seguro', 'firma electrónica segura', 'firmar documentos de forma segura'],
  openGraph: {
    title: 'Firma PDF Segura - 100% Privado',
    description: 'Firma documentos con máxima seguridad y privacidad.',
    url: 'https://tufirma.app/firma-pdf-segura',
    type: 'website',
    locale: 'es_MX',
  },
  alternates: {
    canonical: 'https://tufirma.app/firma-pdf-segura',
  },
};

const faqs = [
  {
    question: '¿Qué tan seguro es firmar online?',
    answer: 'Muy seguro si se hace bien. TuFirma usa los mismos protocolos de seguridad que bancos y empresas Fortune 500. Todo es local en tu navegador.',
  },
  {
    question: '¿Pueden ver mis documentos?',
    answer: 'No. Los documentos se procesan en tu computadora, nunca suben a nuestros servidores. Ni nosotros, ni hackers, ni terceros pueden verlos.',
  },
  {
    question: '¿Es encriptado?',
    answer: 'Sí. Usamos encriptación de extremo a extremo para cualquier comunicación. Todo es seguro por defecto.',
  },
  {
    question: '¿Qué pasa si pierdo mi dispositivo?',
    answer: 'Tus documentos están seguros porque nunca salieron de tu dispositivo. Si alguien accede tu celular o PC, los PDFs no estarán en nuestros servidores.',
  },
  {
    question: '¿TuFirma tiene acceso a mis firmas?',
    answer: 'No. Las firmas se guardan en tu cuenta, encriptadas. Nosotros no podemos verlas. Solo tú tienes acceso.',
  },
  {
    question: '¿Es compatible con regulaciones de privacidad?',
    answer: 'Sí. TuFirma cumple con GDPR, CCPA y leyes de privacidad internacionales. No compartimos datos con terceros.',
  },
];

const securityFeatures = [
  {
    icon: Shield,
    title: 'Encriptación de Extremo a Extremo',
    description: 'Todos tus datos se encriptan. Nadie, ni siquiera nosotros, puede ver tus documentos.',
  },
  {
    icon: Lock,
    title: 'Procesamiento Local',
    description: 'Los PDFs se procesan en tu navegador, nunca suben a servidores. Control total sobre tus datos.',
  },
  {
    icon: CheckCircle2,
    title: 'Certificados SSL',
    description: 'Conexión segura. Tu navegador verifica la autenticidad de nuestros servidores.',
  },
  {
    icon: Zap,
    title: 'Auditorías Regulares',
    description: 'Realizamos auditorías de seguridad periódicas. Tu confianza es nuestra prioridad.',
  },
  {
    icon: Smartphone,
    title: 'Protección en Todos los Dispositivos',
    description: 'Igual nivel de seguridad en PC, Mac, Linux, Android e iOS.',
  },
  {
    icon: FileSignature,
    title: 'Sin Almacenamiento de PDFs',
    description: 'Nunca guardamos tus documentos. Solo tus firmas guardadas (encriptadas) si lo deseas.',
  },
];

const privacyPoints = [
  'No vendemos ni compartimos tus datos',
  'No rastreamos tu actividad',
  'No almacenamos tus documentos',
  'No pedimos información innecesaria',
  'Puedes eliminar tu cuenta y todos tus datos en un click',
  'Transparencia total en nuestra política de privacidad',
];

export default function FirmaPdfSeguraPage() {
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
              Firma PDF de Forma <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">Segura</span>
            </h1>

            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              La forma más segura y privada de firmar documentos online. Tus archivos nunca salen de tu navegador.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg">
                <Link href="/sign">
                  <Shield className="mr-2 h-5 w-5" />
                  Firmar de Forma Segura
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="#seguridad">
                  Conocer Medidas de Seguridad
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>

            <div className="flex flex-wrap gap-4 justify-center pt-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                Encriptado
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                Privado
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                Certificado
              </div>
            </div>
          </div>
        </div>

        <div className="absolute top-20 right-10 w-72 h-72 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-20 left-10 w-72 h-72 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>
      </section>

      {/* Security Features */}
      <section id="seguridad" className="py-20 px-4 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Nuestras Medidas de Seguridad</h2>
            <p className="text-lg text-gray-600">Protegemos tus datos con los mejores estándares de la industria</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {securityFeatures.map((feature, index) => (
              <Card key={index} className="border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mb-4 shadow-lg shadow-blue-500/30">
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Privacy Commitment */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-3xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Nuestro Compromiso con Tu Privacidad</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {privacyPoints.map((point, index) => (
              <div key={index} className="flex items-start gap-3 p-4 rounded-lg bg-blue-50 border border-blue-100">
                <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                <p className="text-gray-700">{point}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 p-6 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200">
            <h3 className="font-semibold text-green-900 mb-2">✓ VERIFICADO Y CONFIABLE</h3>
            <p className="text-green-700">
              TuFirma cumple con GDPR (Europa), CCPA (California) y regulaciones internacionales de privacidad.
              Nuestra arquitectura fue diseñada pensando en tu privacidad desde el inicio.
            </p>
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className="py-20 px-4 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40">
        <div className="container mx-auto max-w-3xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">¿Por Qué TuFirma es Más Seguro?</h2>
          </div>

          <div className="space-y-4">
            <div className="flex gap-4 p-4 rounded-lg bg-white border border-gray-200">
              <div className="flex-shrink-0">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Procesamiento Local</h4>
                <p className="text-gray-600">Otros servicios suben tus PDFs a servidores. Nosotros no. Todo ocurre en tu navegador.</p>
              </div>
            </div>

            <div className="flex gap-4 p-4 rounded-lg bg-white border border-gray-200">
              <div className="flex-shrink-0">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Sin Almacenamiento Innecesario</h4>
                <p className="text-gray-600">No guardamos documentos para "conveniencia". Menos datos = menos riesgo.</p>
              </div>
            </div>

            <div className="flex gap-4 p-4 rounded-lg bg-white border border-gray-200">
              <div className="flex-shrink-0">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Transparencia Total</h4>
                <p className="text-gray-600">Conoce exactamente qué datos recopilamos y cómo se usan. Sin sorpresas.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-2xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Preguntas sobre Seguridad</h2>
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
            description: 'Sube tu PDF, crea tu firma y descárgalo. Sin subir datos a servidores.',
            href: '/firmar-pdf-gratis',
          },
          {
            title: 'Firma Digital Online',
            description: 'Guarda tu firma digital para usarla en múltiples documentos.',
            href: '/firma-digital-online',
          },
          {
            title: 'Firmar desde Celular',
            description: 'Firma documentos desde tu teléfono con la misma seguridad y facilidad.',
            href: '/firmar-desde-celular',
          },
          {
            title: 'Alternativa a DocuSign',
            description: 'Compara TuFirma con DocuSign y descubre por qué somos más seguros.',
            href: '/alternativa-docusign',
          },
        ]}
      />

      {/* CTA */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-600 to-indigo-600">
        <div className="container mx-auto text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Firma con Confianza
          </h2>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Seguridad de grado banco. Privacidad garantizada. Sin compromisos.
          </p>
          <Button
            asChild
            size="lg"
            className="bg-white text-blue-600 hover:bg-gray-100 shadow-lg font-semibold"
          >
            <Link href="/sign" className="gap-2">
              <Shield className="h-5 w-5" />
              Comenzar Ahora de Forma Segura
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
