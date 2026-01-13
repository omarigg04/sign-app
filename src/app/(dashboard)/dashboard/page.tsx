'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileSignature, TrendingUp, Calendar, Settings, ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { checkSignatureLimit } from '@/lib/utils/signatureLimits';

export default function DashboardPage() {
  const [limitInfo, setLimitInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [portalLoading, setPortalLoading] = useState(false);

  useEffect(() => {
    const fetchLimitInfo = async () => {
      try {
        const data = await checkSignatureLimit();
        setLimitInfo(data);
      } catch (error) {
        console.error('Error fetching limit info:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLimitInfo();
  }, []);

  const handleManageSubscription = async () => {
    setPortalLoading(true);

    try {
      const response = await fetch('/api/stripe/create-portal-session', {
        method: 'POST',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error creating portal session');
      }

      const { url } = await response.json();

      // Redirect to the billing portal
      window.location.href = url;
    } catch (error) {
      console.error('Error managing subscription:', error);
      alert('Error al acceder al panel de suscripción. Por favor intenta de nuevo.');
      setPortalLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6">Cargando dashboard...</h1>
        </div>
      </div>
    );
  }

  const firmasUsadas = limitInfo ? (limitInfo.maxSignatures - limitInfo.remaining) : 0;
  const porcentajeUsado = limitInfo ? (firmasUsadas / limitInfo.maxSignatures) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40">
      <div className="container mx-auto px-4 py-8">
        {/* Header con animación */}
        <div className="mb-12 animate-fade-in-up">
          <div className="flex items-center gap-3 mb-4">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">
              Dashboard
            </h1>
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
          </div>
          <p className="text-lg text-gray-600">Gestiona tus firmas y suscripción</p>
        </div>

        {/* Grid de Cards */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Card de Información del Plan */}
          <Card className="group relative overflow-hidden border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 animate-fade-in">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-full blur-3xl"></div>

            <CardHeader className="relative z-10">
              <CardDescription className="text-gray-600 font-medium">Información del Plan</CardDescription>
              <CardTitle className="text-sm text-gray-500 mb-4">Tu plan actual y límites</CardTitle>

              {/* Plan Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/30 mb-6 group-hover:shadow-xl group-hover:shadow-blue-500/40 transition-all duration-300">
                <Sparkles className="h-5 w-5 text-white animate-pulse" />
                <span className="text-2xl font-bold text-white">{limitInfo?.plan || 'FREE'}</span>
              </div>

              {/* Firmas Disponibles */}
              <div className="space-y-2">
                <p className="text-sm font-semibold text-gray-700">Firmas Disponibles</p>
                <div className="flex items-baseline gap-2">
                  <span className={`text-5xl font-bold ${limitInfo?.remaining === 0 ? 'text-red-600' : 'bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent'}`}>
                    {limitInfo?.remaining || 0}
                  </span>
                  <span className="text-2xl text-gray-400">/{limitInfo?.maxSignatures || 1}</span>
                </div>
                <p className="text-xs text-gray-500">
                  {limitInfo?.plan === 'FREE' ? 'Restantes esta semana' : 'Restantes este mes'}
                </p>
              </div>

              {/* Periodo */}
              <div className="mt-6 pt-6 border-t border-gray-100">
                <p className="text-sm font-semibold text-gray-700 mb-1">Periodo</p>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-blue-600" />
                  <span className="text-gray-900 font-medium">
                    {limitInfo?.plan === 'FREE' ? 'Semanal' : 'Mensual'}
                  </span>
                </div>
              </div>

              {/* Botón Upgrade para usuarios FREE */}
              {limitInfo?.plan === 'FREE' && (
                <div className="mt-6">
                  <Button
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300"
                    asChild
                  >
                    <Link href="/upgrade" className="gap-2">
                      Mejorar a Premium
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              )}
            </CardHeader>
          </Card>

          {/* Card de Uso Reciente */}
          <Card
            className="group border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 animate-fade-in"
            style={{ animationDelay: '0.1s' }}
          >
            <CardHeader>
              <div className="flex items-center justify-between mb-4">
                <CardDescription className="text-gray-600 font-medium">Uso Reciente</CardDescription>
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg shadow-amber-500/30">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
              </div>
              <CardTitle className="text-sm text-gray-500 mb-8">Tus firmas más recientes</CardTitle>

              {/* Firmas Este Periodo */}
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-2">Firmas Este Periodo</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                      {firmasUsadas}
                    </span>
                    <span className="text-lg text-gray-400">de {limitInfo?.maxSignatures || 1} permitidas</span>
                  </div>
                </div>

                {/* Barra de progreso */}
                <div className="space-y-2">
                  <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full transition-all duration-1000 ease-out shadow-lg shadow-blue-500/30"
                      style={{ width: `${porcentajeUsado}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 text-right">{porcentajeUsado.toFixed(0)}% utilizado</p>
                </div>
              </div>

              {/* Historial */}
              <div className="mt-8 pt-6 border-t border-gray-100">
                <p className="text-sm font-semibold text-gray-700 mb-2">Historial Reciente</p>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Aquí aparecerá el historial de tus firmas recientes. Esta funcionalidad se puede extender en futuras
                  versiones.
                </p>
              </div>
            </CardHeader>
          </Card>

          {/* Card de Acciones */}
          <Card
            className="group border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 animate-fade-in"
            style={{ animationDelay: '0.2s' }}
          >
            <CardHeader>
              <div className="flex items-center justify-between mb-4">
                <CardDescription className="text-gray-600 font-medium">Acciones</CardDescription>
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg shadow-emerald-500/30">
                  <FileSignature className="h-6 w-6 text-white" />
                </div>
              </div>
              <CardTitle className="text-sm text-gray-500 mb-8">Opciones disponibles</CardTitle>

              <CardContent className="space-y-4 p-0">
                {/* Botón Firmar PDF */}
                <Button
                  asChild
                  size="lg"
                  className="w-full group/btn bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300 hover:-translate-y-1"
                >
                  <Link href="/sign" className="gap-2">
                    <FileSignature className="h-5 w-5" />
                    Firmar un nuevo PDF
                    <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
                  </Link>
                </Button>

                {/* Gestionar Suscripción - Solo para PREMIUM */}
                {limitInfo?.plan === 'PREMIUM' && (
                  <div className="pt-4">
                    <p className="text-sm font-semibold text-gray-700 mb-3">Gestionar Suscripción</p>
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full border-2 hover:border-blue-300 hover:bg-blue-50/50 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md group/settings bg-transparent"
                      onClick={handleManageSubscription}
                      disabled={portalLoading}
                    >
                      <Settings className="h-5 w-5 group-hover/settings:rotate-90 transition-transform duration-500" />
                      {portalLoading ? 'Cargando...' : 'Ir al Panel de Suscripción'}
                    </Button>
                  </div>
                )}

                {/* Info adicional - Solo para usuarios FREE */}
                {limitInfo?.plan === 'FREE' && (
                  <div className="mt-8 pt-6 border-t border-gray-100">
                    <div className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100">
                      <Sparkles className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-gray-900 mb-1">¿Necesitas más firmas?</p>
                        <p className="text-xs text-gray-600 leading-relaxed">
                          Actualiza tu plan para obtener más firmas mensuales y funciones premium.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  );
}