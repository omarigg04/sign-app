import Link from 'next/link';
import { Mail, Github, Linkedin, Twitter } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white/80 backdrop-blur-sm py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4">TuFirma</h3>
            <p className="text-sm text-gray-600">
              La forma más simple de firmar PDFs en línea. Rápido, seguro y privado.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Producto</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/sign" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Firmar PDF
                </Link>
              </li>
              <li>
                <Link href="/shop" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Comprar Créditos
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Recursos</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/blog" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/firmar-pdf-gratis" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Guías
                </Link>
              </li>
              <li>
                <Link href="/alternativa-docusign" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Alternativa a DocuSign
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Soporte</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/contacto" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Contacto
                </Link>
              </li>
              <li>
                <a href="mailto:support@tufirma.app" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Email
                </a>
              </li>
              <li>
                <Link href="/" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Privacidad
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <p className="text-sm text-gray-600">
              &copy; 2026 TuFirma. Todos los derechos reservados.
            </p>
            <div className="flex items-center gap-4 mt-4 md:mt-0">
              <a
                href="https://twitter.com/tufirma"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-blue-600 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="https://linkedin.com/company/tufirma"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-blue-600 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="mailto:hello@tufirma.app"
                className="text-gray-600 hover:text-blue-600 transition-colors"
                aria-label="Email"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
