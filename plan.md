# Plan de Implementación - PDF Signature SaaS

## Información del Proyecto

**Objetivo**: Desarrollar una aplicación SaaS que permita cargar PDFs, firmarlos con un canvas de dibujo, y exportarlos con la firma posicionada.

**Modelo de Negocio**:
- **Free Plan**: 1 firma por semana
- **Premium Plan**: 50 firmas por mes - $5 USD/mes

---

## Stack Tecnológico

### Frontend
- Next.js 14+ (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui
- react-pdf
- pdf-lib
- react-signature-canvas
- react-dnd

### Backend
- Next.js API Routes
- Prisma ORM
- PostgreSQL

### Servicios
- **Auth**: Clerk / NextAuth.js
- **Pagos**: Stripe
- **Storage**: Supabase Storage / AWS S3
- **Hosting**: Vercel

---

## FASE 1: Setup Inicial del Proyecto

### 1.1 Configuración Base
- [ ] Inicializar proyecto Next.js 14 con TypeScript
- [ ] Configurar Tailwind CSS
- [ ] Instalar y configurar shadcn/ui
- [ ] Configurar estructura de carpetas:
  ```
  /app
    /(auth)
    /(dashboard)
    /api
  /components
    /ui (shadcn)
    /signature
    /pdf
  /lib
    /db
    /utils
  /prisma
  ```

### 1.2 Base de Datos
- [ ] Instalar Prisma
- [ ] Configurar conexión a PostgreSQL (Supabase/Neon)
- [ ] Crear schema inicial:
  ```prisma
  model User {
    id               String      @id @default(cuid())
    email            String      @unique
    name             String?
    plan             Plan        @default(FREE)
    stripeCustomerId String?     @unique
    signatures       Signature[]
    createdAt        DateTime    @default(now())
    updatedAt        DateTime    @updatedAt
  }

  enum Plan {
    FREE
    PREMIUM
  }

  model Signature {
    id         String   @id @default(cuid())
    userId     String
    user       User     @relation(fields: [userId], references: [id], onDelete: Cascade)
    fileName   String
    signedAt   DateTime @default(now())
    weekNumber Int
    monthYear  String

    @@index([userId, weekNumber])
    @@index([userId, monthYear])
  }
  ```
- [ ] Ejecutar migraciones: `npx prisma migrate dev`
- [ ] Generar Prisma Client

### 1.3 Configuración de Variables de Entorno
- [ ] Crear `.env` y `.env.example`
- [ ] Configurar variables:
  ```env
  DATABASE_URL=
  NEXT_PUBLIC_APP_URL=
  # Auth (a configurar en Fase 2)
  # Stripe (a configurar en Fase 4)
  # Storage (a configurar en Fase 3)
  ```

**Entregable Fase 1**: Proyecto base con Next.js + Tailwind + Prisma configurado

---

## FASE 2: Autenticación

### 2.1 Instalación de Clerk/NextAuth
- [ ] Instalar dependencias de autenticación
- [ ] Configurar provider de autenticación
- [ ] Crear páginas de auth:
  - `/sign-in`
  - `/sign-up`
- [ ] Configurar middleware de protección de rutas

### 2.2 Integración con Base de Datos
- [ ] Configurar webhooks de Clerk/NextAuth
- [ ] Crear API route `/api/webhooks/clerk` o similar
- [ ] Sincronizar usuarios en BD al registrarse
- [ ] Asignar plan FREE por defecto

### 2.3 UI de Autenticación
- [ ] Crear layout para páginas de auth
- [ ] Implementar botones de login/logout
- [ ] Crear componente de perfil de usuario

**Entregable Fase 2**: Sistema de autenticación funcional con usuarios en BD

---

## FASE 3: Componente de Firma y Visualización de PDF

### 3.1 Instalación de Librerías
- [ ] Instalar `react-pdf`: `npm install react-pdf`
- [ ] Instalar `pdf-lib`: `npm install pdf-lib`
- [ ] Instalar `react-signature-canvas`: `npm install react-signature-canvas @types/react-signature-canvas`
- [ ] Configurar webpack para react-pdf en `next.config.js`

### 3.2 Componente de Canvas de Firma
- [ ] Crear `components/signature/SignatureCanvas.tsx`
- [ ] Implementar funcionalidades:
  - Dibujar firma con mouse/touch
  - Botón "Limpiar"
  - Botón "Guardar firma"
  - Preview de la firma
  - Exportar como imagen base64/PNG
- [ ] Agregar estilos responsive

### 3.3 Componente de Visualización de PDF
- [ ] Crear `components/pdf/PDFViewer.tsx`
- [ ] Implementar funcionalidades:
  - Cargar PDF desde archivo local
  - Mostrar todas las páginas o navegación por página
  - Zoom in/out
  - Renderizar en canvas

### 3.4 Componente de Drag & Drop de Firma
- [ ] Crear `components/signature/DraggableSignature.tsx`
- [ ] Implementar funcionalidades:
  - Arrastrar firma sobre el PDF
  - Posicionar firma en coordenadas específicas
  - Redimensionar firma (opcional)
  - Visualizar preview de firma sobre PDF
  - Guardar posición (x, y, width, height, página)

### 3.5 Página Principal de Firma
- [ ] Crear `/app/(dashboard)/sign/page.tsx`
- [ ] Layout con 3 secciones:
  1. Upload de PDF
  2. Canvas de firma
  3. Visualizador de PDF con firma arrastrable
- [ ] Flujo de usuario:
  1. Subir PDF → mostrar en viewer
  2. Dibujar firma → guardar en estado
  3. Arrastrar firma sobre PDF
  4. Botón "Exportar PDF firmado"

**Entregable Fase 3**: Interfaz completa para firmar PDFs (sin backend aún)

---

## FASE 4: Lógica de Exportación de PDF

### 4.1 Implementación de pdf-lib
- [ ] Crear utilidad `lib/pdf/signPDF.ts`
- [ ] Función para:
  - Cargar PDF original
  - Obtener dimensiones de la página
  - Convertir coordenadas del canvas a coordenadas del PDF
  - Insertar imagen de firma en posición específica
  - Retornar PDF modificado como Blob/ArrayBuffer

### 4.2 Integración en Frontend
- [ ] Al hacer clic en "Exportar":
  - Llamar función `signPDF()`
  - Generar PDF firmado en el navegador
  - Descargar automáticamente
- [ ] Manejo de errores
- [ ] Loading states

**Entregable Fase 4**: Funcionalidad de exportar PDF firmado (100% client-side)

---

## FASE 5: Sistema de Límites de Uso

### 5.1 API de Verificación de Límites
- [ ] Crear `/api/signatures/check-limit`
- [ ] Implementar lógica:
  ```typescript
  - Obtener plan del usuario
  - Si FREE: verificar 1 firma en la semana actual
  - Si PREMIUM: verificar 50 firmas en el mes actual
  - Retornar: { canSign: boolean, remaining: number }
  ```
- [ ] Usar `date-fns` para cálculos de fecha

### 5.2 API de Registro de Firma
- [ ] Crear `/api/signatures/register`
- [ ] Implementar lógica:
  - Verificar límite
  - Si puede firmar: crear registro en BD
  - Retornar confirmación

### 5.3 Integración en Frontend
- [ ] Antes de exportar: llamar `check-limit`
- [ ] Si no puede firmar: mostrar modal de upgrade
- [ ] Después de exportar: llamar `register`
- [ ] Actualizar UI con firmas restantes

### 5.4 Dashboard de Usuario
- [ ] Crear `/app/(dashboard)/dashboard/page.tsx`
- [ ] Mostrar:
  - Plan actual
  - Firmas utilizadas este período
  - Firmas restantes
  - Historial de firmas (últimas 10)
  - Botón "Upgrade to Premium"

**Entregable Fase 5**: Sistema completo de límites de uso funcionando

---

## FASE 6: Integración de Stripe

### 6.1 Configuración de Stripe
- [ ] Crear cuenta en Stripe
- [ ] Instalar `npm install stripe @stripe/stripe-js`
- [ ] Configurar API keys en `.env`
- [ ] Crear productos en Stripe Dashboard:
  - **Premium Plan**: $5 USD/mes, recurring

### 6.2 Checkout de Suscripción
- [ ] Crear `/api/stripe/create-checkout-session`
- [ ] Implementar lógica:
  - Crear Checkout Session para suscripción
  - Retornar URL de checkout
- [ ] Crear página `/app/(dashboard)/upgrade/page.tsx`
- [ ] Botón "Suscribirse a Premium" → redirige a Stripe Checkout

### 6.3 Webhooks de Stripe
- [ ] Crear `/api/webhooks/stripe`
- [ ] Configurar webhook en Stripe Dashboard
- [ ] Manejar eventos:
  - `checkout.session.completed`: actualizar plan a PREMIUM
  - `customer.subscription.updated`: sincronizar estado
  - `customer.subscription.deleted`: downgrade a FREE
- [ ] Actualizar `stripeCustomerId` en User

### 6.4 Portal de Cliente
- [ ] Crear `/api/stripe/create-portal-session`
- [ ] Agregar botón "Gestionar suscripción" en dashboard
- [ ] Redirigir a Stripe Customer Portal (cancelar, actualizar pago)

### 6.5 Testing
- [ ] Probar con Stripe Test Mode
- [ ] Simular suscripción exitosa
- [ ] Simular cancelación
- [ ] Verificar sincronización de BD

**Entregable Fase 6**: Sistema de pagos completo con Stripe

---

## FASE 7: Almacenamiento (Opcional)

> Nota: Si decides NO almacenar PDFs (más económico), puedes saltar esta fase

### 7.1 Configuración de Storage
- [ ] Configurar Supabase Storage o AWS S3
- [ ] Crear bucket `pdf-uploads`
- [ ] Configurar políticas de seguridad

### 7.2 API de Upload
- [ ] Crear `/api/upload`
- [ ] Implementar:
  - Recibir PDF vía FormData
  - Validar tamaño (max 10MB)
  - Subir a storage
  - Retornar URL temporal (TTL 24h)

### 7.3 Integración en Frontend
- [ ] Al subir PDF: enviar a `/api/upload`
- [ ] Cargar PDF desde URL remota en viewer

**Entregable Fase 7**: Sistema de storage (si se requiere)

---

## FASE 8: UI/UX y Pulido

### 8.1 Mejoras de UI
- [ ] Diseñar landing page `/`
- [ ] Agregar pricing page `/pricing`
- [ ] Mejorar responsive design
- [ ] Agregar animaciones con Framer Motion (opcional)
- [ ] Dark mode (opcional)

### 8.2 Optimizaciones
- [ ] Lazy loading de componentes pesados
- [ ] Optimizar carga de PDFs grandes
- [ ] Implementar skeleton loaders
- [ ] Manejar errores globalmente

### 8.3 Accesibilidad
- [ ] Agregar atributos ARIA
- [ ] Navegación por teclado
- [ ] Contraste de colores (WCAG)

**Entregable Fase 8**: Aplicación con UI pulida y profesional

---

## FASE 9: Testing y QA

### 9.1 Testing Funcional
- [ ] Probar flujo completo de firma (FREE)
- [ ] Probar límites de uso:
  - FREE: 1 firma/semana
  - PREMIUM: 50 firmas/mes
- [ ] Probar upgrade/downgrade de plan
- [ ] Probar exportación en diferentes navegadores
- [ ] Probar con PDFs de diferentes tamaños

### 9.2 Testing de Integración
- [ ] Webhooks de Stripe
- [ ] Webhooks de Auth
- [ ] Sincronización de BD

### 9.3 Performance
- [ ] Lighthouse audit
- [ ] Core Web Vitals
- [ ] Optimizar bundle size

**Entregable Fase 9**: Aplicación testeada y optimizada

---

## FASE 10: Deploy y Producción

### 10.1 Preparación
- [ ] Configurar variables de entorno en Vercel
- [ ] Configurar dominio personalizado
- [ ] Configurar SSL/HTTPS

### 10.2 Deploy
- [ ] Conectar repositorio a Vercel
- [ ] Configurar build settings
- [ ] Deploy a producción
- [ ] Verificar webhooks en producción

### 10.3 Configuración Post-Deploy
- [ ] Cambiar Stripe a modo Live
- [ ] Configurar URLs de webhooks en producción
- [ ] Configurar CORS si es necesario
- [ ] Configurar redirects de auth

### 10.4 Monitoreo
- [ ] Configurar Sentry/LogRocket para error tracking (opcional)
- [ ] Configurar analytics (Google Analytics/Plausible)
- [ ] Monitorear uso de BD

**Entregable Fase 10**: Aplicación en producción y funcionando

---

## FASE 11: Marketing y Lanzamiento

### 11.1 Contenido
- [ ] Crear página de términos de servicio
- [ ] Crear página de política de privacidad
- [ ] Crear FAQs
- [ ] Escribir documentación de uso

### 11.2 SEO
- [ ] Configurar meta tags
- [ ] Agregar sitemap.xml
- [ ] Configurar robots.txt
- [ ] Optimizar para búsquedas

### 11.3 Lanzamiento
- [ ] Soft launch con usuarios beta
- [ ] Recopilar feedback
- [ ] Ajustar según feedback
- [ ] Lanzamiento público

**Entregable Fase 11**: Aplicación lista para usuarios

---

## Estimación de Tiempo por Fase

| Fase | Descripción | Estimación |
|------|-------------|-----------|
| 1 | Setup Inicial | 1 día |
| 2 | Autenticación | 1 día |
| 3 | Firma y PDF Viewer | 3 días |
| 4 | Exportación PDF | 1 día |
| 5 | Límites de Uso | 1 día |
| 6 | Stripe | 2 días |
| 7 | Storage (Opcional) | 1 día |
| 8 | UI/UX | 2 días |
| 9 | Testing | 1 día |
| 10 | Deploy | 1 día |
| 11 | Marketing | Continuo |

**Total estimado**: 14 días de desarrollo

---

## Prioridades

### MVP (Mínimo Producto Viable)
- Fases 1-6: Core funcionalidad
- Sin storage (procesamiento 100% client-side)

### Nice to Have
- Fase 7: Storage
- Fase 8: Animaciones, dark mode
- Fase 11: Marketing avanzado

---

## Métricas de Éxito

- [ ] Usuarios pueden registrarse
- [ ] Usuarios FREE pueden firmar 1 PDF/semana
- [ ] Usuarios PREMIUM pueden firmar 50 PDFs/mes
- [ ] Stripe procesa pagos correctamente
- [ ] PDFs exportados tienen la firma en la posición correcta
- [ ] Aplicación carga en < 3 segundos
- [ ] Tasa de conversión FREE → PREMIUM > 5%

---

## Próximos Pasos

1. ✅ Aprobar este plan
2. Comenzar con Fase 1: Setup Inicial
3. Iterar fase por fase
4. Hacer demos después de Fase 3, 6 y 10