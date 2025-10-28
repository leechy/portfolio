import { expect, test } from '@playwright/test';

test.describe('Homepage', () => {
  test('should load and display basic content', async ({ page }) => {
    await page.goto('/');

    // Check that the page loads
    await expect(page).toHaveTitle(/Leechy/);

    // Check for basic navigation
    const nav = page.locator('nav');
    await expect(nav).toBeVisible();
  });

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Page should still be accessible on mobile
    await expect(page.locator('body')).toBeVisible();
  });
});

test.describe('Navigation', () => {
  test('should navigate between pages', async ({ page }) => {
    await page.goto('/');

    // Test navigation to projects page (when it exists)
    // await page.click('a[href*="/projects"]');
    // await expect(page).toHaveURL(/.*projects/);
  });
});
