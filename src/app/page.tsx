import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import { FileSignature, CheckCircle2, Zap, Shield, Sparkles, ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 backdrop-blur-sm">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/">
              <Image
                src="/logo1.png"
                alt="SignPDF Logo"
                width={240}
                height={80}
                className="h-25 w-auto transition-transform hover:scale-105 duration-300"
                unoptimized
              />
            </Link>
          </div>
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <Button variant="ghost" asChild className="hover:bg-blue-50/50 transition-colors">
                  <Link href="/dashboard">Dashboard</Link>
                </Button>
                <Button
                  asChild
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/40 hover:-translate-y-0.5"
                >
                  <Link href="/sign">Firmar PDF</Link>
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" asChild className="hover:bg-blue-50/50 transition-colors">
                  <Link href="/sign-in">Iniciar Sesión</Link>
                </Button>
                <Button
                  asChild
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/40 hover:-translate-y-0.5"
                >
                  <Link href="/sign-up">Registrarse</Link>
                </Button>
              </>
            )}
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="mx-auto max-w-4xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 border border-blue-200/50 mb-8 animate-fade-in">
            <Sparkles className="h-4 w-4 text-blue-600 animate-pulse" />
            <span className="text-sm font-medium text-blue-900">La mejor app para firmar PDFs en línea</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-balance animate-fade-in-up">
            <span className="bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">
              Firma tus PDFs de manera
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent animate-gradient-x">
              rápida y segura
            </span>
          </h1>

          <p
            className="mt-8 text-lg md:text-xl leading-relaxed text-gray-600 max-w-2xl mx-auto text-pretty animate-fade-in-up"
            style={{ animationDelay: "0.1s" }}
          >
            La forma más simple de firmar documentos PDF en línea. Sin complicaciones, sin instalaciones. Solo carga,
            firma y descarga.
          </p>

          <div
            className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up"
            style={{ animationDelay: "0.2s" }}
          >
            {user ? (
              <Button
                size="lg"
                asChild
                className="group bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-xl shadow-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/40 transition-all duration-300 hover:-translate-y-1"
              >
                <Link href="/sign" className="gap-2">
                  <FileSignature className="h-5 w-5" />
                  Firmar Ahora
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              </Button>
            ) : (
              <>
                <Button
                  size="lg"
                  asChild
                  className="group bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-xl shadow-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/40 transition-all duration-300 hover:-translate-y-1"
                >
                  <Link href="/sign-up" className="gap-2">
                    Comenzar Gratis
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  asChild
                  className="border-2 hover:border-blue-300 hover:bg-blue-50/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg bg-transparent"
                >
                  <Link href="/sign-in">Iniciar Sesión</Link>
                </Button>
              </>
            )}
          </div>

          <div
            className="mt-16 flex flex-wrap items-center justify-center gap-8 text-sm text-gray-600 animate-fade-in"
            style={{ animationDelay: "0.3s" }}
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <span>100% Seguro</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <span>Sin instalación</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <span>Gratis para empezar</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-br from-gray-900 to-gray-700 bg-clip-text text-transparent text-balance">
            Todo lo que necesitas para firmar PDFs
          </h2>
          <p className="mt-4 text-lg md:text-xl text-gray-600">Simple, rápido y seguro</p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="group border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:bg-white">
            <CardHeader>
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg shadow-blue-500/30">
                <FileSignature className="h-7 w-7 text-white" />
              </div>
              <CardTitle className="text-xl">Firma Digital</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 leading-relaxed">
                Crea tu firma con el mouse o pantalla táctil y colócala donde quieras en el PDF.
              </p>
            </CardContent>
          </Card>

          <Card className="group border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:bg-white">
            <CardHeader>
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg shadow-amber-500/30">
                <Zap className="h-7 w-7 text-white" />
              </div>
              <CardTitle className="text-xl">Súper Rápido</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 leading-relaxed">
                Todo el procesamiento se hace en tu navegador. Sin subidas lentas a servidores.
              </p>
            </CardContent>
          </Card>

          <Card className="group border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:bg-white">
            <CardHeader>
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg shadow-emerald-500/30">
                <Shield className="h-7 w-7 text-white" />
              </div>
              <CardTitle className="text-xl">100% Seguro</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 leading-relaxed">
                Tus documentos nunca salen de tu navegador. Total privacidad garantizada.
              </p>
            </CardContent>
          </Card>

          <Card className="group border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:bg-white">
            <CardHeader>
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg shadow-indigo-500/30">
                <CheckCircle2 className="h-7 w-7 text-white" />
              </div>
              <CardTitle className="text-xl">Fácil de Usar</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 leading-relaxed">
                Interfaz intuitiva en 3 pasos: carga, firma y descarga. Así de simple.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-br from-gray-900 to-gray-700 bg-clip-text text-transparent text-balance">
            Planes sencillos y transparentes
          </h2>
          <p className="mt-4 text-lg md:text-xl text-gray-600">Elige el plan que mejor se adapte a tus necesidades</p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 max-w-5xl mx-auto">
          <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
            <CardHeader className="space-y-4">
              <CardTitle className="text-3xl">Plan Free</CardTitle>
              <CardDescription className="space-y-1">
                <div className="text-5xl font-bold text-gray-900">$0</div>
                <div className="text-base text-gray-600">por mes</div>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                  </div>
                  <span className="text-gray-700">1 firma por semana</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                  </div>
                  <span className="text-gray-700">Procesamiento en el navegador</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                  </div>
                  <span className="text-gray-700">100% seguro y privado</span>
                </li>
              </ul>
              <Button className="w-full bg-transparent" variant="outline" asChild size="lg">
                <Link href={user ? "/sign" : "/sign-up"}>Comenzar Gratis</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="relative border-0 bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-2xl shadow-blue-500/30 hover:shadow-3xl hover:shadow-blue-500/40 transition-all duration-500 hover:-translate-y-2 overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-400/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

            <CardHeader className="space-y-4 relative z-10">
              <div className="flex items-center justify-between gap-3">
                <CardTitle className="text-3xl text-white">Plan Premium</CardTitle>
                <span className="bg-gradient-to-r from-amber-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg flex items-center gap-1 whitespace-nowrap">
                  <Sparkles className="h-3 w-3" />
                  Popular
                </span>
              </div>
              <CardDescription className="space-y-1">
                <div className="text-5xl font-bold text-white">$5</div>
                <div className="text-base text-blue-100">por mes</div>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 relative z-10">
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="h-4 w-4 text-white" />
                  </div>
                  <span className="font-semibold text-white">50 firmas por mes</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-blue-50">Procesamiento en el navegador</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-blue-50">100% seguro y privado</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-blue-50">Soporte prioritario</span>
                </li>
              </ul>
              <Button
                className="w-full bg-white text-blue-600 hover:bg-blue-50 hover:shadow-lg transition-all duration-300"
                asChild
                size="lg"
              >
                <Link href={user ? "/upgrade" : "/sign-up"}>Mejorar a Premium</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-700 py-24 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-indigo-400/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl"></div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 text-balance">
            ¿Listo para empezar a firmar tus PDFs?
          </h2>
          <p className="text-xl md:text-2xl text-blue-100 mb-10 max-w-2xl mx-auto text-pretty">
            Comienza gratis hoy, sin tarjeta de crédito requerida
          </p>
          <Button
            size="lg"
            variant="secondary"
            asChild
            className="group bg-white text-blue-600 hover:bg-blue-50 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:-translate-y-1 text-lg px-8"
          >
            <Link href={user ? "/sign" : "/sign-up"} className="gap-2">
              Comenzar Ahora
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white/80 backdrop-blur-sm py-12">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p className="text-sm">&copy; 2026 SignPDF. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
