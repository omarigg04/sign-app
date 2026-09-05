import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { blogPosts } from '@/lib/blog/posts';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock, User, ArrowLeft, ArrowRight } from 'lucide-react';

interface Props {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = blogPosts.find((p) => p.slug === params.slug);

  if (!post) {
    return {
      title: 'Post no encontrado',
    };
  }

  return {
    title: `${post.title} | TuFirma Blog`,
    description: post.description,
    keywords: post.keywords,
    openGraph: {
      title: post.title,
      description: post.description,
      url: `https://tufirma.app/blog/${post.slug}`,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
      locale: 'es_MX',
    },
    alternates: {
      canonical: `https://tufirma.app/blog/${post.slug}`,
    },
  };
}

export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

export default function BlogPostPage({ params }: Props) {
  const post = blogPosts.find((p) => p.slug === params.slug);

  if (!post) {
    notFound();
  }

  const currentIndex = blogPosts.findIndex((p) => p.slug === params.slug);
  const prevPost = currentIndex > 0 ? blogPosts[currentIndex - 1] : null;
  const nextPost = currentIndex < blogPosts.length - 1 ? blogPosts[currentIndex + 1] : null;

  return (
    <div className="w-full">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: post.title,
            description: post.description,
            image: post.image,
            datePublished: post.date,
            author: {
              '@type': 'Organization',
              name: post.author,
            },
            publisher: {
              '@type': 'Organization',
              name: 'TuFirma',
              url: 'https://tufirma.app',
            },
            mainEntityOfPage: `https://tufirma.app/blog/${post.slug}`,
          }),
        }}
      />

      {/* Header */}
      <section className="py-12 px-4 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 border-b">
        <div className="container mx-auto max-w-3xl">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al Blog
          </Link>

          <h1 className="text-4xl md:text-5xl font-bold mb-4">{post.title}</h1>
          <p className="text-xl text-gray-600 mb-6">{post.description}</p>

          <div className="flex flex-wrap gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              {post.author}
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {new Date(post.date).toLocaleDateString('es-MX', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              {post.readTime}
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {post.keywords.map((keyword) => (
              <span key={keyword} className="text-xs px-3 py-1 rounded-full bg-blue-100 text-blue-700">
                {keyword}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-3xl">
          <article className="prose prose-lg max-w-none">
            <div
              className="space-y-6 text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: post.content
                  .split('\n')
                  .map((line) => {
                    if (line.startsWith('# ')) {
                      return `<h1 class="text-4xl font-bold mt-12 mb-4">${line.replace('# ', '')}</h1>`;
                    }
                    if (line.startsWith('## ')) {
                      return `<h2 class="text-3xl font-bold mt-10 mb-3">${line.replace('## ', '')}</h2>`;
                    }
                    if (line.startsWith('### ')) {
                      return `<h3 class="text-2xl font-semibold mt-8 mb-3">${line.replace('### ', '')}</h3>`;
                    }
                    if (line.startsWith('- ')) {
                      return `<li class="ml-6">${line.replace('- ', '')}</li>`;
                    }
                    if (line.startsWith('| ')) {
                      return `<div class="overflow-x-auto"><table class="w-full border-collapse">${line}</table></div>`;
                    }
                    if (line.trim() === '') {
                      return '<br />';
                    }
                    if (line.startsWith('**')) {
                      return `<p class="font-semibold">${line}</p>`;
                    }
                    if (line.startsWith('```')) {
                      return '<pre class="bg-gray-100 p-4 rounded overflow-x-auto"><code>';
                    }
                    if (line.trim().startsWith('✅') || line.trim().startsWith('❌')) {
                      return `<li>${line}</li>`;
                    }
                    return line ? `<p>${line}</p>` : '';
                  })
                  .join('\n'),
              }}
            />
          </article>
        </div>
      </section>

      {/* Navigation */}
      <section className="py-16 px-4 bg-gray-50 border-t">
        <div className="container mx-auto max-w-3xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {prevPost ? (
              <Link href={`/blog/${prevPost.slug}`}>
                <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer h-full">
                  <CardHeader>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                      <ArrowLeft className="h-4 w-4" />
                      Artículo Anterior
                    </div>
                    <CardTitle className="text-lg">{prevPost.title}</CardTitle>
                  </CardHeader>
                </Card>
              </Link>
            ) : (
              <div />
            )}

            {nextPost ? (
              <Link href={`/blog/${nextPost.slug}`}>
                <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer h-full">
                  <CardHeader>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                      Siguiente Artículo
                      <ArrowRight className="h-4 w-4" />
                    </div>
                    <CardTitle className="text-lg">{nextPost.title}</CardTitle>
                  </CardHeader>
                </Card>
              </Link>
            ) : (
              <div />
            )}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-gradient-to-br from-blue-600 to-indigo-600">
        <div className="container mx-auto text-center text-white space-y-6 max-w-2xl">
          <h2 className="text-3xl font-bold">¿Listo para Firmar tu Primer PDF?</h2>
          <p className="text-blue-100">1 firma gratis cada semana. Sin registrarse, sin complicaciones.</p>
          <Button
            asChild
            size="lg"
            className="bg-white text-blue-600 hover:bg-gray-100 font-semibold"
          >
            <Link href="/sign">Comienza Ahora</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
