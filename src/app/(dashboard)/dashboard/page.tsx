'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileSignature, TrendingUp, Calendar, Settings, ArrowRight, Sparkles, Mail, User } from 'lucide-react';
import Link from 'next/link';
import { checkSignatureLimit } from '@/lib/utils/signatureLimits';
import { DashboardSkeleton } from '@/components/skeleton/dashboard-skeleton';
import { createClient } from '@/lib/supabase/client';
import { fetchUserHistory } from './actions';

interface UserInfo {
  canSign: boolean;
  remaining: number;
}

interface AuthUser {
  id: string;
  email?: string;
  user_metadata?: {
    name?: string;
  };
  created_at?: string;
}

interface Transaction {
  id: string;
  type: 'purchase' | 'use' | 'refund';
  amount: number;
  description: string;
  createdAt: Date;
  balance: number;
}

interface Signature {
  id: string;
  fileName: string;
  signedAt: Date;
}

export default function DashboardPage() {
  const [creditInfo, setCreditInfo] = useState<UserInfo | null>(null);
  const [userInfo, setUserInfo] = useState<AuthUser | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [signatureHistory, setSignatureHistory] = useState<Signature[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const supabase = createClient();

        // Get user info
        const { data: { user } } = await supabase.auth.getUser();
        setUserInfo(user as AuthUser);

        if (user?.id) {
          // Get credit info
          const creditData = await checkSignatureLimit();
          setCreditInfo(creditData);

          // Get history using Server Action
          const history = await fetchUserHistory(user.id);
          setTransactions(history.transactions as unknown as Transaction[]);
          setSignatureHistory(history.signatures as unknown as Signature[]);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);


  if (loading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40">
      <div className="container mx-auto px-4 py-8">
        {/* Header con Logo y Status indicator */}
        <div className="mb-12 animate-fade-in-up">
          <div className="flex items-center">
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
            {/* <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div> */}
          </div>
        </div>

        {/* Grid de Cards */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Card de Información del Plan */}
          <Card className="group relative overflow-hidden border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all duration-500 animate-fade-in">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-full blur-3xl"></div>

            <CardHeader className="relative z-10">
              <CardDescription className="text-gray-600 font-medium">Tu Balance de Créditos</CardDescription>
              <CardTitle className="text-sm text-gray-500 mb-4">Créditos disponibles para firmar</CardTitle>

              {/* Credits Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/30 mb-6 group-hover:shadow-xl group-hover:shadow-blue-500/40 transition-all duration-300">
                <Sparkles className="h-5 w-5 text-white animate-pulse" />
                <span className="text-2xl font-bold text-white">Créditos</span>
              </div>

              {/* Créditos Disponibles */}
              <div className="space-y-2">
                <p className="text-sm font-semibold text-gray-700">Créditos Disponibles</p>
                <div className="flex items-baseline gap-2">
                  <span className={`text-5xl font-bold ${creditInfo?.remaining === 0 ? 'text-red-600' : 'bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent'}`}>
                    {creditInfo?.remaining || 0}
                  </span>
                  <span className="text-sm text-gray-600">firmas disponibles</span>
                </div>
                <p className="text-xs text-gray-500">
                  {creditInfo?.remaining === 0 ? 'Sin créditos disponibles' : 'Puedes firmar PDFs'}
                </p>
              </div>

              {/* Status */}
              <div className="mt-6 pt-6 border-t border-gray-100">
                <p className="text-sm font-semibold text-gray-700 mb-1">Estado</p>
                <div className="flex items-center gap-2">
                  <div className={`h-3 w-3 rounded-full ${creditInfo?.canSign ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                  <span className="text-gray-900 font-medium">
                    {creditInfo?.canSign ? 'Listo para firmar' : 'Sin créditos'}
                  </span>
                </div>
              </div>

              {/* Botón Comprar Firmas */}
              <div className="mt-6">
                <Button
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300"
                  asChild
                >
                  <Link href="/shop" className="gap-2">
                    Comprar Créditos
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardHeader>
          </Card>

          {/* Card de Información del Usuario */}
          <Card
            className="group border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all duration-500 animate-fade-in"
            style={{ animationDelay: '0.1s' }}
          >
            <CardHeader>
              <div className="flex items-center justify-between mb-4">
                <CardDescription className="text-gray-600 font-medium">Tu Perfil</CardDescription>
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg shadow-purple-500/30">
                  <User className="h-6 w-6 text-white" />
                </div>
              </div>
              <CardTitle className="text-sm text-gray-500 mb-8">Información de tu cuenta</CardTitle>

              {/* Información del Usuario */}
              <div className="space-y-6">
                {/* Nombre o Email */}
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-2">Nombre de Usuario</p>
                  <div className="flex items-center gap-2">
                    <User className="h-5 w-5 text-blue-600" />
                    <p className="text-lg font-bold text-gray-900">
                      {userInfo?.user_metadata?.name || userInfo?.email?.split('@')[0] || 'Usuario'}
                    </p>
                  </div>
                </div>

                {/* Email */}
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-2">Email</p>
                  <div className="flex items-center gap-2">
                    <Mail className="h-5 w-5 text-indigo-600" />
                    <p className="text-sm text-gray-600">{userInfo?.email || 'No disponible'}</p>
                  </div>
                </div>

                {/* Fecha de registro */}
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-2">Miembro desde</p>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-emerald-600" />
                    <p className="text-sm text-gray-600">
                      {userInfo?.created_at
                        ? new Date(userInfo.created_at).toLocaleDateString('es-MX', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })
                        : 'No disponible'}
                    </p>
                  </div>
                </div>

                {/* ID de Usuario */}
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-2">ID de Cuenta</p>
                  <p className="text-xs text-gray-500 font-mono break-all bg-gray-50 p-2 rounded">
                    {userInfo?.id}
                  </p>
                </div>
              </div>

              {/* Botón de configuración */}
              <div className="mt-8 pt-6 border-t border-gray-100">
                <Button
                  variant="outline"
                  className="w-full border-gray-300 hover:bg-gray-50"
                  asChild
                >
                  <Link href="/settings" className="gap-2">
                    <Settings className="h-4 w-4" />
                    Editar Perfil
                  </Link>
                </Button>
              </div>
            </CardHeader>
          </Card>

          {/* Card de Historial y Acciones */}
          <Card
            className="group border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all duration-500 animate-fade-in"
            style={{ animationDelay: '0.2s' }}
          >
            <CardHeader>
              <div className="flex items-center justify-between mb-4">
                <CardDescription className="text-gray-600 font-medium">Historial</CardDescription>
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg shadow-emerald-500/30">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
              </div>
              <CardTitle className="text-sm text-gray-500 mb-6">Firmas realizadas y transacciones</CardTitle>

              {/* Historial de Firmas */}
              {signatureHistory.length > 0 ? (
                <div className="space-y-3 mb-8">
                  <p className="text-xs font-semibold text-gray-700 uppercase">Firmas Recientes</p>
                  {signatureHistory.map((sig) => (
                    <div key={sig.id} className="flex items-start justify-between p-3 bg-blue-50 rounded-lg border border-blue-100">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{sig.fileName}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(sig.signedAt).toLocaleDateString('es-MX', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                      <FileSignature className="h-4 w-4 text-blue-600 flex-shrink-0 mt-1" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mb-8 p-4 bg-gray-50 rounded-lg text-center">
                  <p className="text-sm text-gray-500">Aún no has firmado ningún PDF</p>
                </div>
              )}

              {/* Historial de Transacciones */}
              {transactions.length > 0 ? (
                <div className="space-y-3 mb-8 pt-6 border-t border-gray-200">
                  <p className="text-xs font-semibold text-gray-700 uppercase">Transacciones Recientes</p>
                  {transactions.map((trans) => (
                    <div
                      key={trans.id}
                      className={`flex items-start justify-between p-3 rounded-lg border ${
                        trans.type === 'use'
                          ? 'bg-red-50 border-red-100'
                          : 'bg-green-50 border-green-100'
                      }`}
                    >
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{trans.description}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(trans.createdAt).toLocaleDateString('es-MX', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className={`text-sm font-bold ${trans.type === 'use' ? 'text-red-600' : 'text-green-600'}`}>
                          {trans.type === 'use' ? '-' : '+'}{Math.abs(trans.amount)}
                        </p>
                        <p className="text-xs text-gray-500">Saldo: {trans.balance}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mb-8 pt-6 border-t border-gray-200">
                  <p className="text-sm text-gray-500 text-center">Sin transacciones registradas</p>
                </div>
              )}

              {/* Acciones - Al final */}
              <div className="pt-6 border-t border-gray-200 space-y-3">
                <p className="text-xs font-semibold text-gray-700 uppercase mb-4">Acciones</p>
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

                {/* Info adicional - Mostrar si no hay créditos */}
                {!creditInfo?.canSign && (
                  <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-orange-50 to-red-50 border border-orange-100">
                    <div className="flex items-start gap-3">
                      <Sparkles className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-gray-900 mb-1">Sin créditos disponibles</p>
                        <p className="text-xs text-gray-600 leading-relaxed">
                          Compra créditos para poder firmar PDFs nuevamente.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  );
}