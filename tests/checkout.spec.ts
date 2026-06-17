import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';

test.describe('Checkout E2E Flow', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login('standard_user', 'secret_sauce');
  });

  test('complete checkout flow end-to-end', async ({ page }) => {
    const inventory = new InventoryPage(page);
    await inventory.addToCartByIndex(0);
    await inventory.addToCartByIndex(1);
    expect(await inventory.getCartCount()).toBe(2);

    await page.click('.shopping_cart_link');
    expect(page.url()).toContain('/cart.html');
    await page.click('[data-test="checkout"]');

    await page.fill('[data-test="firstName"]', 'Eesha');
    await page.fill('[data-test="lastName"]', 'Noor');
    await page.fill('[data-test="postalCode"]', '12345');
    await page.click('[data-test="continue"]');

    expect(page.url()).toContain('/checkout-step-two.html');
    await expect(page.locator('.summary_info')).toBeVisible();

    await page.click('[data-test="finish"]');
    expect(page.url()).toContain('/checkout-complete.html');
    await expect(page.locator('.complete-header')).toContainText('Thank you');
  });

  test('cart persists after page refresh', async ({ page }) => {
    const inventory = new InventoryPage(page);
    await inventory.addToCartByIndex(0);
    await page.reload();
    expect(await inventory.getCartCount()).toBe(1);
  });

  test('remove item from cart', async ({ page }) => {
    const inventory = new InventoryPage(page);
    await inventory.addToCartByIndex(0);
    await page.click('.shopping_cart_link');
    await page.click('[data-test^="remove"]');
    await expect(page.locator('.cart_item')).toHaveCount(0);
  });
});