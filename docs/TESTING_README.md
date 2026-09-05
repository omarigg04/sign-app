# 🧪 Testing Guide - TuFirma.App

## 📚 Documentación de Testing Completa

Este proyecto incluye una estrategia de testing completa con:
- **130+ casos de prueba** definidos en matriz de QA
- **Tests unitarios e integración** con Jest
- **Tests end-to-end** con Playwright
- **Coverage tracking** y reportes

---

## 📂 Archivos de Testing Creados

### Documentación
- **`QA_TESTING_PLAN.md`** ← 📋 Plan completo de QA con matriz de 130+ casos
- **`TESTING_README.md`** ← Este archivo

### Configuración
- **`jest.config.ts`** - Configuración Jest
- **`jest.setup.ts`** - Setup de Jest
- **`playwright.config.ts`** - Configuración Playwright

### Tests Unitarios e Integración
```
src/__tests__/
├── auth.test.ts              # 6 casos de autenticación
├── credits.test.ts           # 9 casos de créditos
├── pdf-signing.test.ts       # 13 casos de firma
├── payments.test.ts          # 13 casos de pagos
└── dashboard.test.ts         # (por crear)
```

### Tests E2E
```
e2e/
├── complete-flow.spec.ts     # Flujo completo de firma
├── payment-flow.spec.ts      # Flujo de pagos
└── auth.spec.ts              # (por crear)
```

---

## 🚀 Quick Start

### 1. Instalar Dependencias de Testing

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

### 2. Ejecutar Tests

```bash
# Tests unitarios e integración
npm test

# Tests E2E
npm run test:e2e

# Todos los tests
npm run test:all

# Con coverage report
npm run test:coverage
```

---

## 📊 Matriz de Pruebas QA

### Resumen de Cobertura

| Módulo | Casos | Prioridad | Archivo |
|--------|-------|-----------|---------|
| Autenticación | 6 | 🔴 ALTA | `auth.test.ts` |
| Dashboard | 8 | 🔴 ALTA | `dashboard.test.ts` |
| Firma de PDFs | 13 | 🔴 ALTA | `pdf-signing.test.ts` |
| Sistema de Créditos | 9 | 🔴 ALTA | `credits.test.ts` |
| Pagos (Stripe) | 13 | 🔴 ALTA | `payments.test.ts` |
| Biblioteca de Firmas | 5 | 🟡 MEDIA | `pdf-signing.test.ts` |
| Landing Pages | 6 | 🟢 BAJA | (por crear) |
| Validaciones | 6 | 🟡 MEDIA | (por crear) |
| Seguridad | 6 | 🔴 ALTA | (por crear) |
| Rendimiento | 4 | 🟡 MEDIA | (por crear) |
| Compatibilidad | 7 | 🔴 ALTA | `playwright.config.ts` |
| Casos Edge | 6 | 🟢 BAJA | (por crear) |
| Regresión | 5 | 🔴 ALTA | (por crear) |

**Total: 130+ casos de prueba**

---

## 🧪 Descripción de Tests

### 1. Autenticación (`auth.test.ts`)

```typescript
// Casos probados:
AUTH-001  ✅ Registro de nuevo usuario
AUTH-002  ✅ Inicio de sesión exitoso
AUTH-003  ✅ Inicio de sesión fallido
AUTH-004  ✅ Protección de rutas
AUTH-005  ✅ Acceso a /sign sin auth
AUTH-006  ✅ Cerrar sesión
```

**Ejecutar:**
```bash
npm test -- auth.test.ts
```

---

### 2. Sistema de Créditos (`credits.test.ts`)

```typescript
// Casos probados:
CRED-001  ✅ Nuevo usuario obtiene 1 crédito
CRED-002  ✅ Usar firma deduce 1 crédito
CRED-003  ✅ Balance actualizado en tiempo real
CRED-004  ✅ GET /api/credits/balance
CRED-005  ✅ POST /api/credits/use
CRED-006  ✅ Error 402 sin créditos
CRED-007  ✅ Regeneración semanal
CRED-008  ✅ No regenerar antes de 7 días
CRED-009  ✅ Historial de transacciones
```

**Lógica Crítica:**
- Balance nunca puede ser negativo
- 1 crédito = 1 firma
- Regeneración: +1 crédito cada 7 días

**Ejecutar:**
```bash
npm test -- credits.test.ts
npm test -- --testNamePattern="CRED-001"  # Caso específico
```

---

### 3. Firma de PDFs (`pdf-signing.test.ts`)

```typescript
// Casos probados:
SIGN-001  ✅ Cargar PDF válido
SIGN-002  ✅ Rechazar archivo no-PDF
SIGN-003  ✅ Crear firma con canvas
SIGN-004  ✅ Borrar firma
SIGN-005  ✅ Cambiar escala de firma
SIGN-006  ✅ Posicionar firma en PDF
SIGN-007  ✅ Cambiar página del PDF
SIGN-008  ✅ Zoom en PDF
SIGN-009  ✅ Descargar PDF firmado
SIGN-010  ✅ Bloquear descarga sin créditos
SIGN-011  ✅ Validar PDF seleccionado
SIGN-012  ✅ Validar firma creada
SIGN-013  ✅ Mostrar progreso
```

**Flujo Completo:**
1. Cargar PDF
2. Dibujar firma
3. Posicionar en página
4. Exportar
5. Descargar

**Ejecutar:**
```bash
npm test -- pdf-signing.test.ts
```

---

### 4. Pagos Stripe (`payments.test.ts`)

```typescript
// Casos probados:
PAY-001   ✅ Cargar tienda
PAY-002   ✅ Seleccionar paquete
PAY-003   ✅ Crear Stripe customer
PAY-004   ✅ Usar customer existente
PAY-005   ✅ Checkout session correcta
PAY-006   ✅ Success URL
PAY-007   ✅ Cancel URL
PAY-008   ✅ Webhook checkout.session.completed
PAY-009   ✅ Agregar créditos por webhook
PAY-010   ✅ Metadata correcta
PAY-011   ✅ Validación webhook signature
PAY-012   ✅ Manejo de errores Stripe
PAY-013   ✅ Moneda MXN correcta
```

**Paquetes Disponibles:**
| Paquete | Créditos | Precio |
|---------|----------|--------|
| Bolsa Pequeña | 5 | $49 MXN |
| Bolsa Media | 10 | $89 MXN |
| Bolsa Grande | 20 | $159 MXN |

**Ejecutar:**
```bash
npm test -- payments.test.ts
```

---

## 🌐 Tests End-to-End (E2E)

### Antes de Ejecutar E2E

1. **Asegúrate que el servidor esté disponible:**
```bash
npm run dev
# El servidor debe estar en http://localhost:3000
```

2. **O déjalo que Playwright lo inicie:**
```bash
npm run test:e2e
# Playwright iniciará automáticamente el servidor si está configurado
```

### Flujo Completo (`complete-flow.spec.ts`)

Prueba end-to-end completo:
1. Registro de usuario
2. Carga de PDF
3. Creación de firma
4. Posicionamiento en PDF
5. Exportación y descarga
6. Verificación de créditos deducidos

```bash
npm run test:e2e -- complete-flow.spec.ts
```

### Flujo de Pagos (`payment-flow.spec.ts`)

Prueba end-to-end de pagos:
1. Visualizar tienda
2. Seleccionar paquete
3. Ir a checkout
4. Verificar créditos agregados

```bash
npm run test:e2e -- payment-flow.spec.ts
```

### Modo Debug (Abre Navegador)

```bash
npm run test:e2e:debug
```

Permite:
- Ver qué hace el test en tiempo real
- Pausar y ejecutar paso a paso
- Inspeccionar elementos

### Modo UI Visual

```bash
npm run test:e2e -- --ui
```

Abre interfaz visual donde puedes:
- Ejecutar tests individualmente
- Ver videos de ejecución
- Inspeccionar timeline

---

## 📈 Coverage Reports

### Generar Reporte

```bash
npm run test:coverage
```

Genera carpeta `coverage/` con reporte HTML.

### Ver Reporte

```bash
open coverage/lcov-report/index.html
```

### Metas de Coverage

| Métrica | Meta |
|---------|------|
| Statements | 80%+ |
| Branches | 75%+ |
| Functions | 80%+ |
| Lines | 80%+ |

---

## 🔧 Configuración de Tests

### Jest Setup

**`jest.config.ts`:**
- TypeScript support
- Module mapping (@/...)
- Test environment: jsdom
- Coverage configuration

**`jest.setup.ts`:**
- Testing library setup
- Global mocks

### Playwright Setup

**`playwright.config.ts`:**
- Navegadores: Chrome, Firefox, Safari
- Mobile: Pixel 5, iPhone 12
- Base URL: http://localhost:3000
- Screenshots on failure
- Trace on first retry

---

## 📋 Scripts Disponibles

```json
{
  "test": "jest",
  "test:watch": "jest --watch",
  "test:coverage": "jest --coverage",
  "test:e2e": "playwright test",
  "test:e2e:debug": "playwright test --debug",
  "test:e2e:ui": "playwright test --ui",
  "test:all": "npm run test && npm run test:e2e"
}
```

### Ejemplos

```bash
# Ejecutar todos los tests unitarios
npm test

# Modo watch (vuelve a ejecutar al cambiar archivos)
npm run test:watch

# Tests con coverage
npm run test:coverage

# E2E en Chrome solo
npm run test:e2e -- --project=chromium

# E2E en modo debug
npm run test:e2e:debug

# E2E con UI
npm run test:e2e:ui

# Todos los tests
npm run test:all
```

---

## ✅ Checklist Pre-Producción

- [ ] Todos los tests unitarios pasando
- [ ] Coverage >80% en módulos críticos
- [ ] Tests E2E en Chrome, Firefox, Safari
- [ ] Tests E2E en móvil (Pixel 5, iPhone 12)
- [ ] Webhook Stripe validado en staging
- [ ] No datos sensibles en logs
- [ ] Performance: PDFs <5MB en <5 segundos
- [ ] Mobile responsive validado
- [ ] Documentación actualizada

---

## 🐛 Troubleshooting

### Jest no reconoce TypeScript

```bash
npm install --save-dev ts-jest @types/jest
```

### Playwright no encuentra Chrome

```bash
npx playwright install
```

### Tests fallan con "Cannot find module"

```bash
# Limpiar caché
npm run test -- --clearCache

# O reinstalar node_modules
rm -rf node_modules
npm install
```

### E2E timeout

Aumentar timeout en `playwright.config.ts`:
```typescript
use: {
  navigationTimeout: 30000,  // 30 segundos
}
```

---

## 📚 Recursos

- **Jest**: https://jestjs.io/
- **Testing Library**: https://testing-library.com/
- **Playwright**: https://playwright.dev/
- **Stripe Testing**: https://stripe.com/docs/testing

---

## 👤 Contacto

**QA Lead**: Omar Gaxiola  
**Email**: gaxiolaomar04@gmail.com

---

**Última actualización**: 2026-08-30  
**Versión**: 1.0
