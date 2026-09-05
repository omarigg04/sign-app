import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface RelatedResource {
  title: string;
  description: string;
  href: string;
}

interface RelatedResourcesProps {
  resources: RelatedResource[];
}

export function RelatedResources({ resources }: RelatedResourcesProps) {
  return (
    <section className="py-16 px-4 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Recursos Relacionados</h2>
          <p className="text-lg text-gray-600">Descubre más sobre firmas digitales y cómo TuFirma puede ayudarte</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {resources.map((resource) => (
            <Link key={resource.href} href={resource.href}>
              <Card className="h-full border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl hover:scale-105 transition-all cursor-pointer">
                <CardHeader>
                  <CardTitle className="text-lg text-blue-600">{resource.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col justify-between">
                  <p className="text-gray-600 mb-4">{resource.description}</p>
                  <div className="flex items-center gap-2 text-blue-600 font-semibold">
                    Leer más
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
