import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { blogPosts } from '@/lib/blog/posts';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { Footer } from '@/components/footer';

export const metadata: Metadata = {
  title: 'Blog de TuFirma | Guías sobre Firma Digital',
  description: 'Aprende todo sobre firma digital, seguridad online y cómo firmar documentos de forma segura. Guías prácticas y artículos informativos.',
  keywords: ['blog firma digital', 'guía firmar pdf', 'seguridad documentos online', 'docusign alternativa'],
  openGraph: {
    title: 'Blog de TuFirma - Guías de Firma Digital',
    description: 'Artículos y guías sobre firma digital segura y privada.',
    url: 'https://tufirma.app/blog',
    type: 'website',
    locale: 'es_MX',
  },
  alternates: {
    canonical: 'https://tufirma.app/blog',
  },
};

export default function BlogPage() {
  return (
    <div className="w-full">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Blog',
            name: 'TuFirma Blog',
            description: 'Guías y artículos sobre firma digital segura',
            url: 'https://tufirma.app/blog',
            publisher: {
              '@type': 'Organization',
              name: 'TuFirma',
              url: 'https://tufirma.app',
            },
          }),
        }}
      />

      {/* Hero Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Blog de TuFirma</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Guías prácticas, comparativas honestas y respuestas a tus preguntas sobre firma digital segura y privada.
          </p>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <Card
                key={post.id}
                className="border-0 bg-white shadow-lg hover:shadow-xl transition-shadow overflow-hidden flex flex-col"
              >
                <div className="relative w-full h-48 overflow-hidden bg-gray-100">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover"
                  />
                </div>

                <CardHeader className="flex-1">
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(post.date).toLocaleDateString('es-MX', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {post.readTime}
                    </div>
                  </div>
                  <CardTitle className="text-xl mb-2">{post.title}</CardTitle>
                  <CardDescription className="line-clamp-3">{post.description}</CardDescription>
                </CardHeader>

                <CardContent>
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {post.keywords.slice(0, 2).map((keyword) => (
                        <span
                          key={keyword}
                          className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                    <Button asChild variant="outline" className="w-full group">
                      <Link href={`/blog/${post.slug}`}>
                        Leer Artículo
                        <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-blue-600 to-indigo-600">
        <div className="container mx-auto text-center text-white space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold">¿Listo para Firmar?</h2>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Aplicar lo que aprendiste. Comienza con 1 firma gratis cada semana.
          </p>
          <Button
            asChild
            size="lg"
            className="bg-white text-blue-600 hover:bg-gray-100 font-semibold"
          >
            <Link href="/sign">Firmar mi Primer PDF</Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
