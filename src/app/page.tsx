import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { FileSignature, CheckCircle2, Zap, Shield } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileSignature className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">SignPDF</span>
          </div>
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <Button variant="ghost" asChild>
                  <Link href="/dashboard">Dashboard</Link>
                </Button>
                <Button asChild>
                  <Link href="/sign">Firmar PDF</Link>
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link href="/sign-in">Iniciar Sesión</Link>
                </Button>
                <Button asChild>
                  <Link href="/sign-up">Registrarse</Link>
                </Button>
              </>
            )}
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Firma tus PDFs de manera{" "}
            <span className="text-blue-600">rápida y segura</span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            La forma más simple de firmar documentos PDF en línea. Sin complicaciones,
            sin instalaciones. Solo carga, firma y descarga.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            {user ? (
              <Button size="lg" asChild>
                <Link href="/sign" className="gap-2">
                  <FileSignature className="h-5 w-5" />
                  Firmar Ahora
                </Link>
              </Button>
            ) : (
              <>
                <Button size="lg" asChild>
                  <Link href="/sign-up">Comenzar Gratis</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/sign-in">Iniciar Sesión</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">
            Todo lo que necesitas para firmar PDFs
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Simple, rápido y seguro
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader>
              <FileSignature className="h-10 w-10 text-blue-600 mb-2" />
              <CardTitle>Firma Digital</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Crea tu firma con el mouse o pantalla táctil y colócala donde quieras en el PDF.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Zap className="h-10 w-10 text-yellow-600 mb-2" />
              <CardTitle>Súper Rápido</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Todo el procesamiento se hace en tu navegador. Sin subidas lentas a servidores.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Shield className="h-10 w-10 text-green-600 mb-2" />
              <CardTitle>100% Seguro</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Tus documentos nunca salen de tu navegador. Total privacidad garantizada.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CheckCircle2 className="h-10 w-10 text-blue-600 mb-2" />
              <CardTitle>Fácil de Usar</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Interfaz intuitiva en 3 pasos: carga, firma y descarga. Así de simple.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">
            Planes sencillos y transparentes
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Elige el plan que mejor se adapte a tus necesidades
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Plan Free</CardTitle>
              <CardDescription className="text-xl font-bold text-gray-900 mt-2">
                $0 <span className="text-sm font-normal text-gray-600">/ mes</span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>1 firma por semana</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Procesamiento en el navegador</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>100% seguro y privado</span>
                </li>
              </ul>
              <Button className="w-full mt-6" variant="outline" asChild>
                <Link href={user ? "/sign" : "/sign-up"}>Comenzar Gratis</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-2 border-blue-600 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                Popular
              </span>
            </div>
            <CardHeader>
              <CardTitle className="text-2xl">Plan Premium</CardTitle>
              <CardDescription className="text-xl font-bold text-gray-900 mt-2">
                $5 <span className="text-sm font-normal text-gray-600">/ mes</span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="font-semibold">50 firmas por mes</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Procesamiento en el navegador</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>100% seguro y privado</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Soporte prioritario</span>
                </li>
              </ul>
              <Button className="w-full mt-6" asChild>
                <Link href={user ? "/upgrade" : "/sign-up"}>Mejorar a Premium</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            ¿Listo para empezar a firmar tus PDFs?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Comienza gratis hoy, sin tarjeta de crédito requerida
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link href={user ? "/sign" : "/sign-up"}>
              Comenzar Ahora
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white py-8">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>&copy; 2026 SignPDF. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
