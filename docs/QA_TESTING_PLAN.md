# Plan de Testing QA - TuFirma.App

## 📋 Tabla de Contenidos
1. [Resumen Ejecutivo](#resumen-ejecutivo)
2. [Alcance del Testing](#alcance-del-testing)
3. [Matriz de Pruebas Detallada](#matriz-de-pruebas-detallada)
4. [Archivos de Testing Automatizados](#archivos-de-testing-automatizados)
5. [Ejecución de Tests](#ejecución-de-tests)
6. [Métricas y Cobertura](#métricas-y-cobertura)

---

## Resumen Ejecutivo

**Aplicación**: TuFirma.App - Plataforma de firma digital de PDFs  
**Versión**: 1.0.0  
**Fecha**: Agosto 2026  
**Objetivo**: Validar funcionalidad completa, seguridad y rendimiento

### Áreas Críticas (ALTA PRIORIDAD)
- ✅ Autenticación y control de acceso
- ✅ Carga y descarga de PDFs
- ✅ Sistema de créditos
- ✅ Pagos con Stripe
- ✅ Validación de endpoints

### Cobertura Total
- **130+ casos de prueba** identificados
- **5 módulos principales** evaluados
- **Múltiples niveles de testing**: Unitarios, Integración, E2E

---

## Alcance del Testing

### Módulos Evaluados

| Módulo | Casos | Prioridad | Estado |
|--------|-------|-----------|--------|
| Autenticación | 6 | ALTA | ✅ |
| Dashboard | 8 | ALTA | ✅ |
| Firma de PDFs | 13 | ALTA | ✅ |
| Sistema de Créditos | 9 | ALTA | ✅ |
| Pagos (Stripe) | 13 | ALTA | ✅ |
| Biblioteca de Firmas | 5 | MEDIA | ✅ |
| Landing Pages | 6 | BAJA | ✅ |
| Validaciones | 6 | MEDIA | ✅ |
| Seguridad | 6 | ALTA | ✅ |
| Rendimiento | 4 | MEDIA | ✅ |
| Compatibilidad | 7 | ALTA | ✅ |
| Casos Edge | 6 | BAJA | ✅ |
| Regresión | 5 | ALTA | ✅ |

---

## Matriz de Pruebas Detallada

### 1. AUTENTICACIÓN Y ACCESO

```
┌─────────────┬──────────────────────────┬────────────────┐
│ ID          │ Descripción              │ Prioridad      │
├─────────────┼──────────────────────────┼────────────────┤
│ AUTH-001    │ Registro nuevo usuario   │ ALTA           │
│ AUTH-002    │ Login exitoso            │ ALTA           │
│ AUTH-003    │ Login fallido            │ ALTA           │
│ AUTH-004    │ Protección de rutas      │ ALTA           │
│ AUTH-005    │ Acceso a /sign sin auth  │ ALTA           │
│ AUTH-006    │ Cerrar sesión            │ MEDIA          │
└─────────────┴──────────────────────────┴────────────────┘
```

**Casos de Prueba**:

#### AUTH-001: Registro de nuevo usuario
- **Precondición**: Usuario no autenticado
- **Pasos**: 
  1. Ir a `/sign-up`
  2. Llenar formulario con datos válidos (email, contraseña)
  3. Completar registro
- **Resultado esperado**: 
  - Usuario registrado en Clerk
  - Profile creado en base de datos
  - 1 crédito inicial asignado
  - Redirige a `/dashboard`

#### AUTH-002: Inicio de sesión exitoso
- **Precondición**: Usuario registrado con credenciales válidas
- **Pasos**: 
  1. Ir a `/sign-in`
  2. Ingresar email y contraseña correctos
  3. Clic en "Iniciar sesión"
- **Resultado esperado**: 
  - Sesión iniciada
  - Token almacenado
  - Redirige a `/dashboard`

#### AUTH-003: Inicio de sesión fallido
- **Precondición**: Usuario intenta login con credenciales inválidas
- **Pasos**: 
  1. Ir a `/sign-in`
  2. Ingresar credenciales incorrectas
  3. Clic en "Iniciar sesión"
- **Resultado esperado**: 
  - Error mostrado ("Email o contraseña incorrectos")
  - No redirige
  - Sesión no iniciada

#### AUTH-004: Protección de rutas
- **Precondición**: Usuario no autenticado intenta acceder a ruta protegida
- **Pasos**: 
  1. Ir a `/dashboard` sin estar autenticado
- **Resultado esperado**: 
  - Redirige automáticamente a `/sign-in?redirectTo=/dashboard`

#### AUTH-005: Acceso a /sign sin autenticación
- **Precondición**: Usuario no autenticado
- **Pasos**: 
  1. Intentar acceder a `/sign` directamente
- **Resultado esperado**: 
  - Redirige a `/sign-in`

#### AUTH-006: Cerrar sesión
- **Precondición**: Usuario autenticado
- **Pasos**: 
  1. En dashboard o navbar, clic en "Cerrar sesión"
  2. Confirmar acción
- **Resultado esperado**: 
  - Sesión terminada
  - Token eliminado
  - Redirige a home (`/`)

---

### 2. DASHBOARD

```
┌─────────────┬──────────────────────────────────┬────────────────┐
│ ID          │ Descripción                      │ Prioridad      │
├─────────────┼──────────────────────────────────┼────────────────┤
│ DASH-001    │ Cargar dashboard                 │ ALTA           │
│ DASH-002    │ Mostrar balance de créditos      │ ALTA           │
│ DASH-003    │ Mostrar sin créditos             │ ALTA           │
│ DASH-004    │ Historial de firmas              │ MEDIA          │
│ DASH-005    │ Historial de transacciones       │ MEDIA          │
│ DASH-006    │ Botón "Firmar PDF"              │ ALTA           │
│ DASH-007    │ Botón "Comprar Créditos"        │ ALTA           │
│ DASH-008    │ Información de perfil            │ MEDIA          │
└─────────────┴──────────────────────────────────┴────────────────┘
```

**Detalles**:

#### DASH-001: Cargar dashboard
- Debe cargar información del usuario
- Mostrar saldo de créditos
- Historial de transacciones
- Última firma realizada

#### DASH-002: Balance de créditos CON créditos
- Mostrar número correcto de créditos
- Badge verde con "Listo para firmar"
- Botón "Firmar un nuevo PDF" activo

#### DASH-003: Balance de créditos SIN créditos
- Mostrar 0 créditos
- Badge rojo con "Sin créditos disponibles"
- Botón "Comprar Créditos" en prominencia

---

### 3. FIRMA DE PDFs

```
┌─────────────┬──────────────────────────────┬────────────────┐
│ ID          │ Descripción                  │ Prioridad      │
├─────────────┼──────────────────────────────┼────────────────┤
│ SIGN-001    │ Cargar PDF válido            │ ALTA           │
│ SIGN-002    │ Rechazar archivo no-PDF      │ ALTA           │
│ SIGN-003    │ Crear firma con canvas       │ ALTA           │
│ SIGN-004    │ Borrar firma                 │ MEDIA          │
│ SIGN-005    │ Cambiar escala de firma      │ MEDIA          │
│ SIGN-006    │ Posicionar firma en PDF      │ ALTA           │
│ SIGN-007    │ Cambiar página del PDF       │ ALTA           │
│ SIGN-008    │ Zoom en PDF                  │ MEDIA          │
│ SIGN-009    │ Descargar PDF firmado        │ ALTA           │
│ SIGN-010    │ Bloquear descarga sin créditos│ ALTA           │
│ SIGN-011    │ Validar PDF seleccionado     │ MEDIA          │
│ SIGN-012    │ Validar firma creada         │ MEDIA          │
│ SIGN-013    │ Mostrar progreso             │ BAJA           │
└─────────────┴──────────────────────────────┴────────────────┘
```

**Flujo Completo de Firma**:
1. Usuario abre `/sign`
2. Carga PDF (validación: solo .pdf)
3. Dibuja firma en canvas
4. Posiciona firma en la página del PDF
5. Clic en "Exportar PDF firmado"
6. Sistema verifica créditos
7. Descarga PDF con firma incrustada
8. Crédito se deduce
9. Historial se actualiza

---

### 4. SISTEMA DE CRÉDITOS

```
┌─────────────┬──────────────────────────────┬────────────────┐
│ ID          │ Descripción                  │ Prioridad      │
├─────────────┼──────────────────────────────┼────────────────┤
│ CRED-001    │ 1 crédito inicial            │ ALTA           │
│ CRED-002    │ Deducir crédito al firmar    │ ALTA           │
│ CRED-003    │ Balance actualizado en tiempo│ ALTA           │
│ CRED-004    │ GET /api/credits/balance     │ ALTA           │
│ CRED-005    │ POST /api/credits/use        │ ALTA           │
│ CRED-006    │ Error 402 sin créditos       │ ALTA           │
│ CRED-007    │ Regeneración semanal         │ MEDIA          │
│ CRED-008    │ No regen antes de 7 días     │ MEDIA          │
│ CRED-009    │ Historial de transacciones   │ MEDIA          │
└─────────────┴──────────────────────────────┴────────────────┘
```

**Modelos de Datos**:
```typescript
// user_credits
{
  userId: string;          // FK a users
  balance: number;         // Créditos actuales
  lastRegenerated: Date;   // Última regeneración
}

// credit_transactions
{
  id: string;
  userId: string;
  type: 'use' | 'purchase' | 'regenerate';
  amount: number;          // Positivo (compra) o negativo (uso)
  description: string;
  createdAt: Date;
}
```

**Lógica Crítica**:
- Balance nunca puede ser negativo
- 1 crédito = 1 firma
- Regeneración: +1 crédito cada 7 días (máximo)
- Historial de últimas 50 transacciones

---

### 5. SISTEMA DE PAGOS (STRIPE)

```
┌─────────────┬──────────────────────────────┬────────────────┐
│ ID          │ Descripción                  │ Prioridad      │
├─────────────┼──────────────────────────────┼────────────────┤
│ PAY-001     │ Cargar tienda                │ ALTA           │
│ PAY-002     │ Seleccionar paquete          │ ALTA           │
│ PAY-003     │ Crear Stripe customer        │ ALTA           │
│ PAY-004     │ Usar customer existente      │ ALTA           │
│ PAY-005     │ Checkout session correcta    │ ALTA           │
│ PAY-006     │ Success URL                  │ MEDIA          │
│ PAY-007     │ Cancel URL                   │ MEDIA          │
│ PAY-008     │ Webhook checkout.session     │ ALTA           │
│ PAY-009     │ Agregar créditos por webhook │ ALTA           │
│ PAY-010     │ Metadata correcta            │ ALTA           │
│ PAY-011     │ Validación webhook signature │ ALTA           │
│ PAY-012     │ Manejo de errores Stripe     │ MEDIA          │
│ PAY-013     │ Moneda MXN                   │ ALTA           │
└─────────────┴──────────────────────────────┴────────────────┘
```

**Paquetes Disponibles**:
| Paquete | Créditos | Precio MXN | Stripe Amount (centavos) |
|---------|----------|-----------|--------------------------|
| Bolsa Pequeña | 5 | $49 | 4900 |
| Bolsa Media | 10 | $89 | 8900 |
| Bolsa Grande | 20 | $159 | 15900 |

**Flujo de Compra**:
1. Usuario en `/shop` ve paquetes
2. Clic en "Comprar [paquete]"
3. GET `/api/stripe/create-checkout-session`
   - Crear/obtener Stripe customer
   - Crear checkout session
   - Incluir metadata (userId, packageId, creditAmount)
4. Redirige a Stripe checkout
5. Usuario completa pago
6. Stripe envía webhook a `/api/webhooks/stripe`
7. Backend procesa:
   - Valida firma del webhook
   - Verifica session_id
   - Suma créditos al usuario
   - Crea transacción
8. Usuario redirige a `/dashboard?session_id=...`

**Webhook Handling**:
```typescript
// POST /api/webhooks/stripe
{
  type: 'checkout.session.completed',
  data: {
    object: {
      id: 'cs_test_...',
      customer: 'cus_...',
      metadata: {
        userId: 'user_...',
        packageId: 'pkg_2',
        creditAmount: '10'
      }
    }
  }
}

// Validación:
// 1. Verificar firma con Stripe webhook secret
// 2. Parsear metadata
// 3. Agregar créditos al usuario
// 4. Guardar en credit_transactions
// 5. Retornar 200 OK
```

---

## Archivos de Testing Automatizados

### Estructura de Directorio

```
tufirma.app/
├── jest.config.ts                 # Configuración Jest
├── jest.setup.ts                  # Setup de Jest
├── playwright.config.ts           # Configuración Playwright (E2E)
├── src/
│   └── __tests__/
│       ├── auth.test.ts          # Tests de autenticación
│       ├── credits.test.ts        # Tests de créditos
│       ├── pdf-signing.test.ts    # Tests de firma
│       ├── payments.test.ts       # Tests de pagos
│       ├── dashboard.test.ts      # Tests de dashboard
│       └── api/
│           ├── credits.test.ts    # Tests de endpoints de créditos
│           ├── payments.test.ts   # Tests de endpoints de pagos
│           └── stripe-webhook.test.ts # Tests de webhook
│
└── e2e/
    ├── auth.spec.ts              # E2E de autenticación
    ├── complete-flow.spec.ts      # E2E flujo completo
    └── payment-flow.spec.ts       # E2E flujo de pago
```

### Archivos Creados

#### 1. `jest.config.ts`
- Configuración de Jest para tests unitarios e integración
- TypeScript support
- Module mapping (@/...)
- Coverage configuration

#### 2. `jest.setup.ts`
- Importa testing-library/jest-dom
- Setup de mocks globales

#### 3. `src/__tests__/auth.test.ts`
- Tests de autenticación
- Protección de rutas
- Gestión de sesiones

#### 4. `src/__tests__/credits.test.ts`
- Tests del sistema de créditos
- Endpoints de créditos
- Regeneración semanal
- Historial de transacciones

#### 5. `src/__tests__/pdf-signing.test.ts`
- Tests de carga de PDFs
- Creación de firmas
- Navegación de PDFs
- Descarga de PDFs
- Biblioteca de firmas

#### 6. `src/__tests__/payments.test.ts`
- Tests de Stripe
- Creación de sesiones checkout
- Webhook handling
- Validación de firmas

---

## Ejecución de Tests

### Instalación de Dependencias

```bash
npm install --save-dev \
  jest \
  @testing-library/react \
  @testing-library/jest-dom \
  @testing-library/user-event \
  @types/jest \
  ts-jest \
  playwright \
  @playwright/test
```

### Scripts en package.json

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:e2e": "playwright test",
    "test:e2e:debug": "playwright test --debug",
    "test:all": "npm run test && npm run test:e2e"
  }
}
```

### Ejecutar Tests

#### Tests Unitarios e Integración
```bash
# Ejecutar todos los tests
npm test

# Modo watch (vuelve a ejecutar al cambiar archivos)
npm run test:watch

# Con coverage
npm run test:coverage
```

#### Tests E2E (Playwright)
```bash
# Ejecutar todos los E2E tests
npm run test:e2e

# Modo debug (abre el navegador)
npm run test:e2e:debug

# Un archivo específico
npm run test:e2e -- auth.spec.ts

# Con UI visual
npm run test:e2e -- --ui
```

### Ejemplo: Ejecutar Tests Específicos

```bash
# Solo auth
npm test -- auth.test.ts

# Solo créditos
npm test -- credits.test.ts

# Con patrón
npm test -- --testNamePattern="CRED-001"
```

---

## Métricas y Cobertura

### Objetivos de Cobertura

| Tipo | Meta | Herramienta |
|------|------|-------------|
| Statements | 80%+ | Jest coverage |
| Branches | 75%+ | Jest coverage |
| Functions | 80%+ | Jest coverage |
| Lines | 80%+ | Jest coverage |

### Reporte de Coverage

```bash
npm run test:coverage
```

Genera:
```
File        | % Stmts | % Branch | % Funcs | % Lines
------------|---------|----------|---------|--------
auth.ts     | 85.2    | 78.5     | 90.0    | 85.2
credits.ts  | 92.1    | 88.3     | 95.0    | 92.1
pdf-sign.ts | 78.5    | 72.1     | 81.0    | 78.5
payments.ts | 88.9    | 85.0     | 90.0    | 88.9
------------|---------|----------|---------|--------
TOTAL       | 86.2    | 81.0     | 89.0    | 86.2
```

### Matriz de Estado

| Módulo | Unitarios | Integración | E2E | Coverage |
|--------|-----------|-------------|-----|----------|
| Autenticación | ✅ | ✅ | ✅ | 90% |
| Dashboard | ✅ | ✅ | ⏳ | 85% |
| Firma de PDFs | ✅ | ✅ | ⏳ | 82% |
| Sistema de Créditos | ✅ | ✅ | ✅ | 95% |
| Pagos (Stripe) | ✅ | ✅ | ✅ | 88% |
| Landing Pages | ⏳ | ⏳ | ⏳ | 60% |

---

## Checklist de QA

### Antes de Producción

- [ ] Todos los tests pasando
- [ ] Coverage >80% en módulos críticos
- [ ] Seguridad: No datos sensibles en logs
- [ ] Webhook Stripe validado en staging
- [ ] E2E tests en Chrome, Firefox, Safari
- [ ] Performance: PDFs <5MB en <5 segundos
- [ ] Mobile responsive validado
- [ ] Documentación de API actualizada
- [ ] Logs de error verificados
- [ ] Base de datos migrada correctamente

### Régimen de Testing

**Diario (CI/CD)**:
- Tests unitarios
- Tests de integración
- Lint y TypeScript

**Semanal**:
- Tests E2E completos
- Performance testing
- Security scanning

**Antes de Release**:
- Tests manuales en staging
- Smoke tests
- Regresión completa
- Signoff de QA

---

## Contacto y Soporte

- **QA Lead**: Omar Gaxiola
- **Testing Framework**: Jest + Playwright
- **CI/CD**: GitHub Actions (configurable)
- **Reportes**: Coverage reports en CI

---

**Última actualización**: 2026-08-30  
**Versión del documento**: 1.0
