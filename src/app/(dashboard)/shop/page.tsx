'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';

interface CreditPackage {
  id: string;
  name: string;
  price: string;
  creditAmount: number;
  description?: string;
}

export default function ShopPage() {
  const [packages, setPackages] = useState<CreditPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const response = await fetch('/api/credits/packages');
      const data = await response.json();
      setPackages(data.packages);
    } catch (error) {
      console.error('Error fetching packages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBuyCredits = async (packageId: string) => {
    setCheckoutLoading(packageId);
    try {
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ packageId }),
      });

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert('Error al crear sesión de compra');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al procesar compra');
    } finally {
      setCheckoutLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40">
        <div className="container mx-auto px-4 py-20 text-center">
          <p className="text-gray-600">Cargando paquetes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Logo */}
        <div className="mb-8">
          <Link href="/">
            <Image
              src="/logo2.png"
              alt="Logo"
              width={250}
              height={90}
              className="h-24 w-auto cursor-pointer hover:scale-105 transition-transform duration-300"
              unoptimized
            />
          </Link>
        </div>

        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-br from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4">
            Comprar Firmas
          </h1>
          <p className="text-lg text-gray-600">
            Selecciona el paquete que mejor se adapte a ti. Los créditos nunca vencen.
          </p>
        </div>

        {/* Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {packages.map((pkg) => (
            <Card
              key={pkg.id}
              className={`relative flex flex-col border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 ${pkg.name === 'Bolsa Popular'
                ? 'border-2 border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50'
                : 'bg-white/80 backdrop-blur-sm'
                }`}
            >
              {/* Popular Badge */}
              {pkg.name === 'Bolsa Popular' && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/30">
                    <Sparkles className="h-4 w-4 text-white" />
                    <span className="text-sm font-bold text-white">Más Popular</span>
                  </div>
                </div>
              )}

              <CardHeader className={pkg.name === 'Bolsa Popular' ? 'pt-8' : ''}>
                <CardTitle className="text-3xl font-bold">{pkg.name}</CardTitle>
                <CardDescription className="text-base">{pkg.description}</CardDescription>
              </CardHeader>

              <CardContent className="flex-1">
                <div className="space-y-6">
                  {/* Price */}
                  <div>
                    <div className="text-5xl font-bold text-gray-900 mb-2">
                      ${pkg.price}
                      <span className="text-xl text-gray-600 ml-2">MXN</span>
                    </div>
                    <p className="text-sm text-gray-600">Compra única, sin suscripción</p>
                  </div>

                  {/* Credits */}
                  <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100">
                    {/* <p className="text-sm text-gray-600 mb-1">Incluye:</p> */}
                    <p className="text-2xl font-bold text-gray-900">{pkg.creditAmount} Firmas</p>
                    <p className="text-xs text-gray-500 mt-2">
                      ${(parseFloat(pkg.price) / pkg.creditAmount).toFixed(2)} MXN por firma
                    </p>
                  </div>

                  {/* Benefits */}
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-gray-700">Beneficios:</p>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-center gap-2">
                        <span className="text-blue-600">✓</span> Créditos que nunca vencen
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-blue-600">✓</span> Sin suscripción
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-blue-600">✓</span> Cancela cuando quieras
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>

              <CardFooter>
                <Button
                  onClick={() => handleBuyCredits(pkg.id)}
                  disabled={checkoutLoading === pkg.id}
                  className={`w-full py-6 text-base font-semibold ${pkg.name === 'Bolsa Popular'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/30'
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
                    }`}
                >
                  {checkoutLoading === pkg.id ? 'Procesando...' : 'Comprar'}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Info Section */}
        <div className="mt-16">
          <div className="p-8 rounded-2xl bg-white/80 backdrop-blur-sm shadow-lg border border-gray-200">
            <h2 className="text-2xl font-bold mb-4">¿Por qué FlashSign?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="font-semibold text-gray-900 mb-2">⚡ Ultra Rápido</p>
                <p className="text-sm text-gray-600">Firma y descarga en segundos, sin complicaciones.</p>
              </div>
              <div>
                <p className="font-semibold text-gray-900 mb-2">🔒 100% Seguro</p>
                <p className="text-sm text-gray-600">Todo se procesa en tu navegador, tus datos están seguros.</p>
              </div>
              <div>
                <p className="font-semibold text-gray-900 mb-2">💰 Sin Sorpresas</p>
                <p className="text-sm text-gray-600">Paga solo lo que usas, sin suscripción obligatoria.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
