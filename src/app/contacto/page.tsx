import type { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import { Footer } from '@/components/footer';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contacto | TuFirma',
  description: 'Ponte en contacto con nuestro equipo de soporte. Responderemos dentro de 24 horas.',
  keywords: ['contacto tufirma', 'soporte', 'ayuda'],
  alternates: {
    canonical: 'https://tufirma.app/contacto',
  },
};

export default function ContactPage() {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="py-12 px-4 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 border-b">
        <div className="container mx-auto max-w-3xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Ponte en Contacto</h1>
          <p className="text-xl text-gray-600">
            ¿Tienes preguntas? Nuestro equipo está aquí para ayudarte.
          </p>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {/* Email */}
            <div className="text-center">
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
                <Mail className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Email</h3>
              <p className="text-gray-600">hello@tufirma.app</p>
              <p className="text-sm text-gray-500 mt-1">Responderemos en 24 horas</p>
            </div>

            {/* Phone */}
            <div className="text-center">
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
                <Phone className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Teléfono</h3>
              <p className="text-gray-600">+52 XXX XXX XXXX</p>
              <p className="text-sm text-gray-500 mt-1">Lun-Vie 9am-6pm</p>
            </div>

            {/* Hours */}
            <div className="text-center">
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Horario</h3>
              <p className="text-gray-600">Lunes a Viernes</p>
              <p className="text-sm text-gray-500 mt-1">9:00 AM - 6:00 PM (GMT-6)</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto max-w-2xl">
          <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
            <h2 className="text-3xl font-bold mb-8 text-center">Envíanos un Mensaje</h2>

            <form className="space-y-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre Completo
                </label>
                <input
                  type="text"
                  placeholder="Tu nombre"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="tu@email.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Teléfono (Opcional)
                </label>
                <input
                  type="tel"
                  placeholder="+52 XXX XXX XXXX"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Subject */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Asunto
                </label>
                <input
                  type="text"
                  placeholder="¿En qué podemos ayudarte?"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categoría
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                  <option value="">Selecciona una categoría</option>
                  <option value="support">Soporte Técnico</option>
                  <option value="billing">Facturación</option>
                  <option value="sales">Ventas</option>
                  <option value="feedback">Feedback</option>
                  <option value="other">Otro</option>
                </select>
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mensaje
                </label>
                <textarea
                  placeholder="Cuéntanos tu pregunta o comentario..."
                  className="w-full min-h-32 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 rounded-lg transition-all duration-300"
              >
                Enviar Mensaje
              </Button>

              <p className="text-xs text-gray-500 text-center">
                Respetamos tu privacidad. Lee nuestra <a href="#" className="text-blue-600 hover:underline">Política de Privacidad</a>
              </p>
            </form>
          </div>
        </div>
      </section>

      {/* FAQ Quick Links */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-3xl">
          <h2 className="text-3xl font-bold mb-8 text-center">Preguntas Frecuentes</h2>

          <div className="space-y-6">
            <details className="group border border-gray-200 rounded-lg p-6 cursor-pointer">
              <summary className="flex items-center justify-between font-semibold text-gray-900 group-open:text-blue-600">
                ¿Cuál es el tiempo de respuesta promedio?
                <span className="transition group-open:rotate-180">▼</span>
              </summary>
              <p className="text-gray-600 mt-4">
                Nos esforzamos por responder todos los correos dentro de 24 horas hábiles. Para asuntos urgentes, puedes llamarnos directamente.
              </p>
            </details>

            <details className="group border border-gray-200 rounded-lg p-6 cursor-pointer">
              <summary className="flex items-center justify-between font-semibold text-gray-900 group-open:text-blue-600">
                ¿Ofrecen soporte por chat en vivo?
                <span className="transition group-open:rotate-180">▼</span>
              </summary>
              <p className="text-gray-600 mt-4">
                Actualmente respondemos por email y teléfono. Estamos trabajando en agregar soporte por chat en vivo pronto.
              </p>
            </details>

            <details className="group border border-gray-200 rounded-lg p-6 cursor-pointer">
              <summary className="flex items-center justify-between font-semibold text-gray-900 group-open:text-blue-600">
                ¿Puedo contactarlos fuera del horario de oficina?
                <span className="transition group-open:rotate-180">▼</span>
              </summary>
              <p className="text-gray-600 mt-4">
                Puedes enviar un email en cualquier momento. Nos pondremos en contacto cuando volvamos a estar disponibles durante el horario de oficina.
              </p>
            </details>

            <details className="group border border-gray-200 rounded-lg p-6 cursor-pointer">
              <summary className="flex items-center justify-between font-semibold text-gray-900 group-open:text-blue-600">
                ¿Cómo reporto un problema de seguridad?
                <span className="transition group-open:rotate-180">▼</span>
              </summary>
              <p className="text-gray-600 mt-4">
                Si encuentras una vulnerabilidad de seguridad, por favor contacta a security@tufirma.app. No lo publiques públicamente para mantener a nuestros usuarios seguros.
              </p>
            </details>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-blue-600 to-indigo-600">
        <div className="container mx-auto text-center text-white space-y-6 max-w-2xl">
          <h2 className="text-3xl font-bold">¿Aún tienes preguntas?</h2>
          <p className="text-blue-100">
            Revisa nuestro blog para encontrar guías, tutoriales y respuestas a preguntas comunes.
          </p>
          <Button
            asChild
            size="lg"
            className="bg-white text-blue-600 hover:bg-gray-100 font-semibold"
          >
            <a href="/blog">Ir al Blog</a>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
