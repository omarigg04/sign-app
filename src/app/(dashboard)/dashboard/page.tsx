'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Cargando dashboard...</h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Plan Card */}
        <Card>
          <CardHeader>
            <CardTitle>Información del Plan</CardTitle>
            <CardDescription>Tu plan actual y límites</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium">Plan Actual</h3>
                <p className="text-2xl font-bold text-blue-600">{limitInfo?.plan || 'FREE'}</p>
              </div>

              <div>
                <h3 className="text-lg font-medium">Firmas Disponibles</h3>
                <p className="text-2xl font-bold">
                  <span className={limitInfo?.remaining === 0 ? 'text-red-600' : 'text-green-600'}>
                    {limitInfo?.remaining || 0}
                  </span>
                  <span className="text-gray-600 text-base">/{limitInfo?.maxSignatures || 1}</span>
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {limitInfo?.plan === 'FREE'
                    ? `Restantes esta semana`
                    : `Restantes este mes`}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium">Periodo</h3>
                <p className="text-gray-800">
                  {limitInfo?.plan === 'FREE'
                    ? 'Semanal'
                    : 'Mensual'}
                </p>
              </div>
            </div>

            {limitInfo?.plan === 'FREE' && (
              <Button className="w-full mt-4" asChild>
                <a href="/upgrade">Mejorar a Premium</a>
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Usage Card */}
        <Card>
          <CardHeader>
            <CardTitle>Uso Reciente</CardTitle>
            <CardDescription>Tus firmas más recientes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium">Firmas Este Periodo</h3>
                <p className="text-2xl font-bold">
                  {limitInfo ? (limitInfo.maxSignatures - limitInfo.remaining) : 0}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  De {limitInfo?.maxSignatures || 1} permitidas
                </p>
              </div>

              <div className="mt-4">
                <h3 className="text-lg font-medium mb-2">Historial Reciente</h3>
                <p className="text-gray-500 text-sm">
                  Aquí aparecerá el historial de tus firmas recientes.
                  Esta funcionalidad se puede extender en futuras versiones.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions Card */}
        <Card>
          <CardHeader>
            <CardTitle>Acciones</CardTitle>
            <CardDescription>Opciones disponibles</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button className="w-full" asChild>
                <a href="/sign">Firmar un nuevo PDF</a>
              </Button>

              {limitInfo?.plan === 'PREMIUM' && (
                <div className="pt-4">
                  <h3 className="text-lg font-medium mb-2">Gestionar Suscripción</h3>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={handleManageSubscription}
                    disabled={portalLoading}
                  >
                    {portalLoading ? 'Cargando...' : 'Ir al Panel de Suscripción'}
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}