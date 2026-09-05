import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { marked } from 'marked';
import { blogPosts } from '@/lib/blog/posts';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock, User, ArrowLeft, ArrowRight } from 'lucide-react';
import { Footer } from '@/components/footer';
import { Breadcrumbs } from '@/components/blog/breadcrumbs';
import { LandingHeader } from '@/components/landing/header';
import '../blog-content.css';

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);

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
      url: `https://tufirma.app/blog/${slug}`,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
      locale: 'es_MX',
    },
    alternates: {
      canonical: `https://tufirma.app/blog/${slug}`,
    },
  };
}

export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  const currentIndex = blogPosts.findIndex((p) => p.slug === slug);
  const prevPost = currentIndex > 0 ? blogPosts[currentIndex - 1] : null;
  const nextPost = currentIndex < blogPosts.length - 1 ? blogPosts[currentIndex + 1] : null;

  return (
    <div className="w-full">
      <LandingHeader />
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
            mainEntityOfPage: `https://tufirma.app/blog/${slug}`,
          }),
        }}
      />

      {/* Header */}
      <section className="py-12 px-4 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 border-b">
        <div className="container mx-auto max-w-3xl">
          <Breadcrumbs
            items={[
              { label: 'Blog', href: '/blog' },
              { label: post.title, href: `/blog/${slug}` },
            ]}
          />

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

      {/* Hero Image */}
      <section className="px-4 bg-white">
        <div className="container mx-auto max-w-3xl">
          <div className="relative w-full h-96 rounded-lg overflow-hidden shadow-lg">
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-3xl">
          <article className="prose prose-lg max-w-none">
            <div
              className="blog-content space-y-6 text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: marked(post.content, {
                  breaks: true,
                  gfm: true,
                }) as string,
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

      <Footer />
    </div>
  );
}
