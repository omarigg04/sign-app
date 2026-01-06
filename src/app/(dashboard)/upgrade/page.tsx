'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { UserAccountNav } from '@/components/ui/user-account-nav';

export default function UpgradePage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleUpgrade = async () => {
    setLoading(true);
    
    try {
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error creating checkout session');
      }
      
      const { sessionId } = await response.json();
      
      // Redirect to Stripe checkout
      window.location.href = `https://checkout.stripe.com/pay/${sessionId}`;
    } catch (error) {
      console.error('Error upgrading:', error);
      alert('Error al procesar la actualización. Por favor intenta de nuevo.');
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Mejorar a Premium</h1>
        <div>
          <UserAccountNav />
        </div>
      </div>
      
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Free Plan Card */}
          <Card>
            <CardHeader>
              <CardTitle>Free</CardTitle>
              <CardDescription>Plan básico</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-2xl font-bold">$0<span className="text-sm text-gray-500">/semana</span></p>
                <ul className="space-y-1 mt-4">
                  <li className="flex items-center">
                    <span className="mr-2">✓</span> 1 firma por semana
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">✓</span> Funcionalidad básica
                  </li>
                  <li className="flex items-center text-gray-400">
                    <span className="mr-2">✗</span> Soporte prioritario
                  </li>
                </ul>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" disabled>
                Plan actual
              </Button>
            </CardFooter>
          </Card>
          
          {/* Premium Plan Card */}
          <Card className="border-2 border-blue-500">
            <CardHeader>
              <CardTitle className="text-blue-600">Premium</CardTitle>
              <CardDescription>Plan avanzado</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-2xl font-bold">$5<span className="text-sm text-gray-500">/mes</span></p>
                <ul className="space-y-1 mt-4">
                  <li className="flex items-center">
                    <span className="mr-2">✓</span> 50 firmas por mes
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">✓</span> Funcionalidad completa
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">✓</span> Soporte prioritario
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">✓</span> Acceso a nuevas características
                  </li>
                </ul>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700" 
                onClick={handleUpgrade}
                disabled={loading}
              >
                {loading ? 'Procesando...' : 'Mejorar a Premium'}
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        <div className="mt-12">
          <h2 className="text-2xl font-semibold mb-4">¿Por qué mejorar a Premium?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">Más firmas</h3>
              <p>Realiza hasta 50 firmas por mes en lugar de solo 1 firma por semana.</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">Sin límites semanales</h3>
              <p>Accede a un límite mensual más flexible que se adapta a tus necesidades.</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">Soporte prioritario</h3>
              <p>Recibe respuestas más rápidas a tus consultas y problemas.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}