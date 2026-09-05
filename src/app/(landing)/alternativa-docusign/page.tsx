import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileSignature, Lock, DollarSign, Zap, Shield, CheckCircle2, ArrowRight, X } from 'lucide-react';
import { RelatedResources } from '@/components/landing/related-resources';
import { LandingHeader } from '@/components/landing/header';

export const metadata: Metadata = {
  title: 'Alternativa a DocuSign - Más Barata y Privada | TuFirma',
  description: 'Alternativa a DocuSign: más barata y privada. Créditos desde $5, sin suscripción, sin contrato. Compara y ahorra hasta 80% en costos.',
  keywords: ['alternativa docusign', 'alternativa a docusign', 'docusign gratis', 'docusign barato'],
  openGraph: {
    title: 'Alternativa a DocuSign - Más Barata',
    description: 'Firma documentos por una fracción del precio de DocuSign.',
    url: 'https://tufirma.app/alternativa-docusign',
    type: 'website',
    locale: 'es_MX',
  },
  alternates: {
    canonical: 'https://tufirma.app/alternativa-docusign',
  },
};

const comparisonData = [
  {
    feature: 'Precio Base',
    docusign: '$10-40/mes',
    tufirma: 'Gratis (1 firma/semana) o $5-15/mes',
    winner: 'tufirma',
  },
  {
    feature: 'Créditos que Vencen',
    docusign: 'Sí, cada mes',
    tufirma: 'No, nunca vencen',
    winner: 'tufirma',
  },
  {
    feature: 'Contrato Mínimo',
    docusign: 'Sí, generalmente anual',
    tufirma: 'No, cancela cuando quieras',
    winner: 'tufirma',
  },
  {
    feature: 'Prueba Gratuita',
    docusign: '30 días con límites',
    tufirma: 'Gratis para siempre (1 firma/semana)',
    winner: 'tufirma',
  },
  {
    feature: 'Privacidad',
    docusign: 'Documentos en servidores DocuSign',
    tufirma: 'Documentos en tu navegador',
    winner: 'tufirma',
  },
  {
    feature: 'Facilidad de Uso',
    docusign: 'Interfaz compleja',
    tufirma: 'Simple e intuitiva',
    winner: 'tufirma',
  },
  {
    feature: 'Soporte Móvil',
    docusign: 'App (requiere instalación)',
    tufirma: 'Web (sin instalación)',
    winner: 'tufirma',
  },
  {
    feature: 'Sin Cancelación Automática',
    docusign: 'Te cobran al renovarse',
    tufirma: 'Pagas solo cuando compras créditos',
    winner: 'tufirma',
  },
];

const faqs = [
  {
    question: '¿TuFirma es completamente gratis?',
    answer: 'Tienes 1 firma gratis cada 7 días. Si necesitas más, compra créditos a partir de $5. No hay suscripción obligatoria.',
  },
  {
    question: '¿Cómo es más barato que DocuSign?',
    answer: 'DocuSign cuesta $10-40/mes mínimo. TuFirma es gratis para trámites ocasionales. Si firmas mucho, los créditos son más baratos que cualquier plan de DocuSign.',
  },
  {
    question: '¿Puedo importar mis documentos de DocuSign?',
    answer: 'No necesitas importar. Solo descarga tus firmas de DocuSign y úsalas en TuFirma. Es más simple.',
  },
  {
    question: '¿TuFirma es legalmente válido como DocuSign?',
    answer: 'Sí, con las mismas limitaciones. Las firmas digitales son válidas en la mayoría de contextos. Revisa regulaciones locales si es documento legal.',
  },
  {
    question: '¿Cómo migro de DocuSign?',
    answer: '1) Descarga tus firmas de DocuSign, 2) Sube un PDF a TuFirma, 3) Crea tu firma o importa la anterior, 4) Descarga firmado. Listo.',
  },
  {
    question: '¿Pierdo mis documentos si cancelo?',
    answer: 'Con TuFirma no hay "cancelación". Dejas de comprar créditos. Tus firmas guardadas quedan en tu cuenta.',
  },
];

export default function AlternativaDocuSignPage() {
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
            <div className="inline-block px-4 py-2 rounded-full bg-green-100 text-green-800 font-semibold text-sm">
              Ahorra hasta 80% vs DocuSign
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold max-w-3xl mx-auto leading-tight">
              Alternativa a <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">DocuSign</span>
            </h1>

            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Más barata, más simple y más privada. Firma documentos sin pagar $10+/mes por algo que casi no usas.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg">
                <Link href="/sign">
                  <FileSignature className="mr-2 h-5 w-5" />
                  Cambiar de DocuSign Ahora
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="#comparacion">
                  Ver Comparativa
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>

            <div className="flex flex-wrap gap-4 justify-center pt-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                80% más barato
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                Sin contrato
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                100% Privado
              </div>
            </div>
          </div>
        </div>

        <div className="absolute top-20 right-10 w-72 h-72 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-20 left-10 w-72 h-72 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>
      </section>

      {/* Comparison Table */}
      <section id="comparacion" className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">TuFirma vs DocuSign</h2>
            <p className="text-lg text-gray-600">Comparativa detallada</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-300">
                  <th className="text-left py-4 px-4 font-semibold text-gray-900">Característica</th>
                  <th className="text-center py-4 px-4 font-semibold text-red-600">DocuSign</th>
                  <th className="text-center py-4 px-4 font-semibold text-green-600">TuFirma</th>
                </tr>
              </thead>
              <tbody>
                {comparisonData.map((row, index) => (
                  <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-4 px-4 font-medium text-gray-900">{row.feature}</td>
                    <td className="py-4 px-4 text-center text-gray-600">{row.docusign}</td>
                    <td className={`py-4 px-4 text-center font-semibold ${row.winner === 'tufirma' ? 'text-green-600 bg-green-50' : 'text-gray-600'}`}>
                      {row.tufirma}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Price Comparison */}
      <section className="py-20 px-4 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Calculadora de Ahorro</h2>
            <p className="text-lg text-gray-600">¿Cuánto ahorras con TuFirma?</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: 'Usuario Ocasional',
                docusignCost: '$120/año',
                tufirmaCost: 'Gratis',
                saves: '100% ahorro',
                description: '1 firma por semana',
              },
              {
                title: 'Usuario Frecuente',
                docusignCost: '$240/año',
                tufirmaCost: '$60/año',
                saves: '75% ahorro',
                description: '2-3 firmas por semana',
              },
              {
                title: 'Usuario Heavy',
                docusignCost: '$480/año',
                tufirmaCost: '$200/año',
                saves: '58% ahorro',
                description: '5+ firmas por semana',
              },
            ].map((plan, index) => (
              <Card key={index} className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
                <CardHeader>
                  <CardTitle>{plan.title}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">DocuSign cuesta:</p>
                    <p className="text-2xl font-bold text-red-600">{plan.docusignCost}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">TuFirma cuesta:</p>
                    <p className="text-2xl font-bold text-green-600">{plan.tufirmaCost}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-green-50 border border-green-200">
                    <p className="text-green-700 font-semibold">{plan.saves}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Switch */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-3xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">¿Por Qué Cambiar de DocuSign?</h2>
          </div>

          <div className="space-y-4">
            {[
              {
                icon: DollarSign,
                title: 'Precio Justo',
                description: 'DocuSign es caro para usuarios ocasionales. TuFirma cobra solo por lo que usas.',
              },
              {
                icon: CheckCircle2,
                title: 'Sin Contratos',
                description: 'DocuSign requiere contrato anual. TuFirma: cancela cuando quieras.',
              },
              {
                icon: Lock,
                title: 'Más Privacidad',
                description: 'Tus documentos se procesan en tu navegador, no en servidores de terceros.',
              },
              {
                icon: Zap,
                title: 'Más Simple',
                description: 'DocuSign es complejo. TuFirma es intuitivo: 3 clicks y listo.',
              },
            ].map((item, index) => (
              <div key={index} className="flex gap-4 p-6 rounded-lg border border-gray-200 hover:border-blue-200 hover:bg-blue-50 transition-colors">
                <item.icon className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Preguntas sobre Migración</h2>
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
            title: 'Firma PDF Gratis',
            description: 'Sube tu PDF y firma sin límites. Procesado 100% en tu navegador, sin enviar datos.',
            href: '/firmar-pdf-gratis',
          },
          {
            title: 'Firma Digital Online',
            description: 'Crea tu firma digital y guárdala para usarla en múltiples documentos.',
            href: '/firma-digital-online',
          },
          {
            title: 'Firmar desde Celular',
            description: 'Firma documentos directamente desde tu teléfono. Android, iPhone o tablet.',
            href: '/firmar-desde-celular',
          },
          {
            title: 'Seguridad Garantizada',
            description: 'Descubre por qué TuFirma es más seguro y privado que otros servicios.',
            href: '/firma-pdf-segura',
          },
        ]}
      />

      {/* CTA */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-600 to-indigo-600">
        <div className="container mx-auto text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Ahorra Dinero Hoy
          </h2>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Desde $5 por créditos o 1 firma gratis cada semana. Nada que perder, todo que ganar.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-white text-blue-600 hover:bg-gray-100 shadow-lg font-semibold"
            >
              <Link href="/sign" className="gap-2">
                <FileSignature className="h-5 w-5" />
                Prueba TuFirma Gratis
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-blue-700"
            >
              <Link href="/firmar-pdf-gratis">
                Conocer Más
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
