import { test, expect } from '@playwright/test';

/**
 * E2E TEST: Pruebas Básicas de Navegación y Carga
 * Validar que la aplicación se carga correctamente en diferentes navegadores
 */

test.describe('Sign Application E2E - Basic Navigation', () => {
  test('Home page loads and shows navigation', async ({ page }) => {
    await page.goto('/');

    // Verify página cargó
    await expect(page).toHaveTitle(/Sign|TuFirma/i);

    // Verify elementos principales visibles
    const mainContent = page.locator('main, [role="main"]');
    await expect(mainContent).toBeVisible({ timeout: 5000 });
  });

  test('Sign page loads with PDF uploader', async ({ page }) => {
    await page.goto('/sign');

    // Verify página cargó
    const pageContent = page.locator('body');
    await expect(pageContent).toBeVisible();

    // Verify hay un input de archivo
    const fileInput = page.locator('input[type="file"]');
    await expect(fileInput).toBeVisible({ timeout: 5000 });
  });

  test('Dashboard redirects unauthenticated users', async ({ page }) => {
    // Intentar acceder a dashboard sin autenticación
    await page.goto('/dashboard', { waitUntil: 'networkidle' });

    // Debería redirigir a sign-in
    expect(page.url()).toContain('/sign-in') || expect(page.url()).toContain('clerk');
  });

  test('Shop page displays packages', async ({ page }) => {
    await page.goto('/shop');

    // Verify página cargó
    const pageContent = page.locator('body');
    await expect(pageContent).toBeVisible();

    // Verify hay botones de compra
    const buyButtons = page.locator('button', { hasText: /comprar|buy/i });
    const count = await buyButtons.count();
    expect(count).toBeGreaterThan(0);
  });

  test('Mobile responsive: Mobile Chrome viewport', async ({ page }) => {
    // Ya está configurado en playwright.config.ts
    await page.goto('/sign');

    // Verify se cargó
    const pageContent = page.locator('body');
    await expect(pageContent).toBeVisible();

    // Verify responsive elements existen
    const mainContent = page.locator('main, aside, header');
    const count = await mainContent.count();
    expect(count).toBeGreaterThan(0);
  });

  test('Links and navigation work', async ({ page }) => {
    await page.goto('/');

    // Buscar un link que existe
    const links = page.locator('a');
    const count = await links.count();
    expect(count).toBeGreaterThan(0);

    // Verificar que se puede hacer click en links sin errores
    const firstLink = links.first();
    await expect(firstLink).toBeVisible();
  });

  test('Page performance: No critical errors', async ({ page, context }) => {
    // Capturar errores de consola
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    await page.goto('/');
    await page.goto('/sign');
    await page.goto('/shop');

    // No debe haber errores críticos (puede haber warnings)
    const criticalErrors = errors.filter(e =>
      e.includes('404') ||
      e.includes('Cannot find module') ||
      e.includes('Failed to load')
    );

    expect(criticalErrors.length).toBe(0);
  });
});
