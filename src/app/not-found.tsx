'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Home, ArrowLeft, FileSignature, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 flex flex-col items-center justify-center px-4">
      {/* Logo */}
      <Link href="/" className="mb-8 block">
        <Image
          src="/logo2.png"
          alt="TuFirma"
          width={250}
          height={90}
          className="h-16 w-auto hover:scale-105 transition-transform duration-300"
          unoptimized
        />
      </Link>

      {/* 404 Content */}
      <div className="w-full max-w-md">
        {/* Error Icon and Number */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-6">
            <div className="relative">
              <div className="text-8xl font-bold bg-gradient-to-br from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                404
              </div>
              <div className="absolute -top-4 -right-4 h-12 w-12 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center shadow-lg shadow-orange-500/30 animate-bounce">
                <Search className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Página no encontrada
          </h1>
          <p className="text-gray-600 text-lg mb-2">
            Ups! Parece que esta página se perdió en el camino...
          </p>
          <p className="text-gray-500 text-sm">
            No te preocupes, aquí te mostramos dónde ir
          </p>
        </div>

        {/* Navigation Cards */}
        <div className="space-y-3 mb-8">
          {/* Home Button */}
          <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
            <CardContent className="p-0">
              <Link
                href="/"
                className="flex items-center justify-between p-4 group-hover:bg-gradient-to-r group-hover:from-blue-50 group-hover:to-indigo-50 transition-colors duration-300"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                    <Home className="h-5 w-5 text-white" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-gray-900">Ir a Inicio</p>
                    <p className="text-xs text-gray-500">Vuelve a la página principal</p>
                  </div>
                </div>
                <ArrowLeft className="h-5 w-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all duration-300" />
              </Link>
            </CardContent>
          </Card>

          {/* Dashboard Button */}
          <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
            <CardContent className="p-0">
              <Link
                href="/dashboard"
                className="flex items-center justify-between p-4 group-hover:bg-gradient-to-r group-hover:from-emerald-50 group-hover:to-green-50 transition-colors duration-300"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                    <FileSignature className="h-5 w-5 text-white" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-gray-900">Ir a Dashboard</p>
                    <p className="text-xs text-gray-500">Accede a tu área de firmas</p>
                  </div>
                </div>
                <ArrowLeft className="h-5 w-5 text-gray-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all duration-300" />
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Help Text */}
        <div className="text-center p-4 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100">
          <p className="text-sm text-gray-600">
            ¿Crees que es un error? Contáctanos o{' '}
            <Link href="/" className="text-blue-600 hover:text-blue-700 font-semibold">
              vuelve a inicio
            </Link>
          </p>
        </div>
      </div>

      {/* Decorative background elements */}
      <div className="fixed top-20 right-10 w-72 h-72 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="fixed bottom-20 left-10 w-72 h-72 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>
    </div>
  );
}
