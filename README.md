# SignPDF - PDF Signature SaaS

Aplicación SaaS para firmar documentos PDF en línea de forma rápida y segura.

## Características

- **Firma digital**: Crea tu firma con el mouse o pantalla táctil
- **Procesamiento local**: Todo se procesa en tu navegador, 100% privado
- **Planes flexibles**:
  - Free: 1 firma por semana
  - Premium: 50 firmas por mes - $5 USD/mes
- **Autenticación**: Integración con Clerk
- **Pagos**: Integración con Stripe

## Stack Tecnológico

- **Frontend**: Next.js 14+, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes, Prisma ORM, PostgreSQL
- **Autenticación**: Clerk
- **Pagos**: Stripe
- **PDF**: react-pdf, pdf-lib
- **Firma**: react-signature-canvas

## Configuración Inicial

### 1. Instalar Dependencias

```bash
npm install
```

### 2. Configurar Base de Datos (PostgreSQL)

Necesitas una base de datos PostgreSQL. Puedes usar:
- **Supabase** (gratuito): https://supabase.com
- **Neon** (gratuito): https://neon.tech
- **Railway**: https://railway.app
- PostgreSQL local

#### Opción A: Supabase (Recomendado)

1. Crea una cuenta en https://supabase.com
2. Crea un nuevo proyecto
3. Ve a **Settings** → **Database**
4. Copia la **Connection String** (formato URI)
5. Pégala en tu archivo `.env` como `DATABASE_URL`

#### Opción B: Neon

1. Crea una cuenta en https://neon.tech
2. Crea un nuevo proyecto
3. Copia la **Connection String**
4. Pégala en tu archivo `.env` como `DATABASE_URL`

### 3. Configurar Clerk (Autenticación)

1. Crea una cuenta en https://clerk.com
2. Crea una nueva aplicación
3. En el dashboard de Clerk:
   - Ve a **API Keys**
   - Copia `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - Copia `CLERK_SECRET_KEY`
   - Agrega estas keys a tu archivo `.env`

4. Configurar el Webhook de Clerk:
   - Ve a **Webhooks** en el dashboard de Clerk
   - Haz clic en **Add Endpoint**
   - URL: `https://tu-dominio.com/api/webhooks/clerk` (para desarrollo local usa ngrok)
   - Eventos a suscribir:
     - `user.created`
     - `user.updated`
     - `user.deleted`
   - Copia el **Signing Secret** y agrégalo como `CLERK_WEBHOOK_SECRET` en tu `.env`

5. Configurar redirects en Clerk:
   - Ve a **Paths** en el dashboard
   - Sign-in URL: `/sign-in`
   - Sign-up URL: `/sign-up`
   - After sign-in: `/dashboard`
   - After sign-up: `/dashboard`

### 4. Configurar Stripe (Pagos)

1. Crea una cuenta en https://stripe.com
2. En el dashboard de Stripe (modo Test):

#### Obtener API Keys:
   - Ve a **Developers** → **API keys**
   - Copia `Publishable key` → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - Copia `Secret key` → `STRIPE_SECRET_KEY`

#### Crear Producto Premium:
   1. Ve a **Products** → **Add Product**
   2. Nombre: "Premium Plan"
   3. Descripción: "50 firmas por mes"
   4. Pricing:
      - Type: Recurring
      - Price: $5.00 USD
      - Billing period: Monthly
   5. Guarda el producto
   6. Copia el **Price ID** (empieza con `price_...`) → `STRIPE_PREMIUM_PRICE_ID`

#### Configurar Webhook:
   1. Ve a **Developers** → **Webhooks** → **Add endpoint**
   2. URL: `https://tu-dominio.com/api/webhooks/stripe`
      - Para desarrollo local, usa [Stripe CLI](https://stripe.com/docs/stripe-cli):
        ```bash
        stripe listen --forward-to localhost:3000/api/webhooks/stripe
        ```
   3. Eventos a suscribir:
      - `checkout.session.completed`
      - `customer.subscription.created`
      - `customer.subscription.updated`
      - `customer.subscription.deleted`
      - `customer.subscription.paused`
   4. Copia el **Signing secret** → `STRIPE_WEBHOOK_SECRET`

### 5. Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto (ya existe `.env.example`):

```env
# Database
DATABASE_URL="postgresql://usuario:contraseña@host:5432/nombre_db?schema=public"

# Application
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Clerk Auth
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."
CLERK_WEBHOOK_SECRET="whsec_..."

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_PREMIUM_PRICE_ID="price_..."
```

### 6. Ejecutar Migraciones de Prisma

```bash
# Generar el cliente de Prisma
npx prisma generate

# Ejecutar migraciones
npx prisma migrate dev --name init

# (Opcional) Abrir Prisma Studio para ver la base de datos
npx prisma studio
```

### 7. Ejecutar en Desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## Estructura del Proyecto

```
/app
  /(auth)           # Páginas de autenticación
    /sign-in
    /sign-up
  /(dashboard)      # Páginas protegidas
    /dashboard      # Dashboard del usuario
    /sign           # Página principal de firma
    /upgrade        # Página de upgrade a premium
  /api              # API Routes
    /webhooks
      /clerk        # Webhook de Clerk
      /stripe       # Webhook de Stripe
    /signatures
      /check-limit  # Verificar límites de firma
      /register     # Registrar firma
    /stripe
      /create-checkout-session    # Crear sesión de pago
      /create-portal-session      # Portal de cliente
/components
  /ui               # Componentes de shadcn/ui
  /signature        # Componentes de firma
  /pdf              # Componentes de PDF
/lib
  /db               # Cliente de Prisma
  /utils            # Utilidades
/prisma
  schema.prisma     # Esquema de base de datos
```

## Flujo de Usuario

### Plan Free
1. Usuario se registra
2. Puede firmar 1 PDF por semana
3. Al intentar firmar más, se le muestra opción de upgrade

### Plan Premium
1. Usuario hace clic en "Upgrade to Premium"
2. Es redirigido a Stripe Checkout
3. Completa el pago
4. Webhook de Stripe actualiza el plan del usuario
5. Puede firmar hasta 50 PDFs por mes

## Desarrollo Local con Webhooks

Para probar webhooks en desarrollo local:

### Clerk Webhook (con ngrok)
```bash
# Instalar ngrok
npm install -g ngrok

# Ejecutar ngrok
ngrok http 3000

# Usar la URL de ngrok en el webhook de Clerk
https://tu-id.ngrok.io/api/webhooks/clerk
```

### Stripe Webhook (con Stripe CLI)
```bash
# Instalar Stripe CLI
# https://stripe.com/docs/stripe-cli

# Login
stripe login

# Escuchar webhooks
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Usar el webhook secret que te da el CLI en tu .env
```

## Deploy a Producción

### Vercel (Recomendado)

1. Conecta tu repositorio a Vercel
2. Configura las variables de entorno en Vercel
3. **Importante**: Actualiza las URLs de webhooks a producción:
   - Clerk: `https://tu-dominio.vercel.app/api/webhooks/clerk`
   - Stripe: `https://tu-dominio.vercel.app/api/webhooks/stripe`
4. Cambia Stripe a modo Live (producción)

## Testing

### Probar Autenticación
1. Crea una cuenta de prueba
2. Verifica que se crea en la base de datos con plan FREE
3. Cierra sesión y vuelve a iniciar sesión

### Probar Límites de Firma
1. Con una cuenta FREE, firma 1 PDF
2. Intenta firmar otro - debería mostrar límite alcanzado
3. Espera a la siguiente semana o actualiza manualmente en la BD

### Probar Stripe (Modo Test)
1. Haz clic en "Upgrade to Premium"
2. Usa la tarjeta de prueba de Stripe: `4242 4242 4242 4242`
3. Cualquier fecha futura y CVC
4. Verifica que el plan se actualiza a PREMIUM
5. Prueba firmar múltiples PDFs

Tarjetas de prueba de Stripe:
- **Éxito**: `4242 4242 4242 4242`
- **Requiere autenticación**: `4000 0025 0000 3155`
- **Declinada**: `4000 0000 0000 9995`

## Comandos Útiles

```bash
# Desarrollo
npm run dev

# Build de producción
npm run build
npm start

# Prisma
npx prisma studio          # UI para ver la BD
npx prisma migrate dev     # Crear nueva migración
npx prisma generate        # Regenerar cliente
npx prisma db push         # Push cambios sin migración

# Linting
npm run lint
```

## Solución de Problemas

### Error: "PrismaClient is unable to run in this browser environment"
- Asegúrate de que estás importando `prisma` solo en API routes o server components
- Los componentes client no pueden usar Prisma directamente

### Error: "Clerk is not configured"
- Verifica que las variables de entorno de Clerk estén configuradas
- Asegúrate de reiniciar el servidor después de cambiar `.env`

### Error: "Stripe webhook signature verification failed"
- Verifica que el `STRIPE_WEBHOOK_SECRET` sea correcto
- Para desarrollo local, usa Stripe CLI
- Asegúrate de que la URL del webhook esté configurada correctamente

### PDFs no se visualizan correctamente
- Verifica que `react-pdf` esté configurado en `next.config.ts`
- Asegúrate de que el worker de PDF.js se cargue correctamente

## Recursos

- [Next.js Documentation](https://nextjs.org/docs)
- [Clerk Documentation](https://clerk.com/docs)
- [Stripe Documentation](https://stripe.com/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [pdf-lib Documentation](https://pdf-lib.js.org)

## Licencia

MIT

## Soporte

Para preguntas o soporte, abre un issue en el repositorio.
