import { test, expect } from '@playwright/test';

/**
 * E2E TEST: Pruebas Básicas de Página de Tienda
 * Validar que la tienda se carga y muestra productos
 */

test.describe('Shop Page E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/shop');
  });

  test('Shop page loads successfully', async ({ page }) => {
    // Verify: Página cargó
    const pageContent = page.locator('body');
    await expect(pageContent).toBeVisible({ timeout: 5000 });

    // Verify: No tiene errores de carga
    expect(page.url()).toContain('/shop');
  });

  test('Shop displays pricing information', async ({ page }) => {
    // Verify: Hay contenido en la página
    const content = page.locator('main, [role="main"], section');
    const count = await content.count();
    expect(count).toBeGreaterThan(0);

    // Verify: Hay precios mostrados (números con $ o MXN)
    const pageText = await page.textContent('body');
    const hasPrices = pageText?.includes('$') || pageText?.includes('MXN');
    expect(hasPrices).toBeTruthy();
  });

  test('Shop has purchase buttons', async ({ page }) => {
    // Verify: Hay botones de compra
    const buttons = page.locator('button');
    const count = await buttons.count();
    expect(count).toBeGreaterThan(0);

    // Verify: Al menos un botón es clickeable
    const firstButton = buttons.first();
    await expect(firstButton).toBeEnabled();
  });

  test('Mobile responsive: Shop page on mobile', async ({ page }) => {
    // Ya configurado en playwright.config.ts para ejecutar en múltiples viewports

    // Verify: Página se carga en móvil
    const pageContent = page.locator('body');
    await expect(pageContent).toBeVisible();

    // Verify: Elementos responsivos
    const buttons = page.locator('button');
    const count = await buttons.count();
    expect(count).toBeGreaterThan(0);
  });

  test('Links and navigation from shop', async ({ page }) => {
    // Verify: Hay links de navegación
    const links = page.locator('a');
    const count = await links.count();
    expect(count).toBeGreaterThan(0);

    // Verify: Links son clickeables
    const firstLink = links.first();
    await expect(firstLink).toBeVisible();
  });

  test('No critical console errors on shop', async ({ page }) => {
    const errors: string[] = [];

    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    // Cargar la página
    await page.reload();

    // Esperar un poco para que se cargue
    await page.waitForTimeout(2000);

    // Verificar que no hay errores críticos
    const criticalErrors = errors.filter(e =>
      e.includes('404') ||
      e.includes('Cannot find') ||
      e.includes('Uncaught')
    );

    expect(criticalErrors.length).toBe(0);
  });

  test('Shop page accessibility: Elements are visible', async ({ page }) => {
    // Verify: Página tiene elementos principales
    const mainContent = page.locator('main, [role="main"]');
    const hasMain = await mainContent.count() > 0;

    const sections = page.locator('section');
    const hasSections = await sections.count() > 0;

    // Al menos uno debe existir
    expect(hasMain || hasSections).toBeTruthy();
  });
});
