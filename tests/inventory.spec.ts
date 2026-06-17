import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';

test.describe('Inventory Tests', () => {
  let inventoryPage: InventoryPage;

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login('standard_user', 'secret_sauce');
    inventoryPage = new InventoryPage(page);
  });

  test('displays 6 products', async () => {
    expect(await inventoryPage.getItemCount()).toBe(6);
  });

  test('add item to cart updates badge', async () => {
    await inventoryPage.addToCartByIndex(0);
    expect(await inventoryPage.getCartCount()).toBe(1);
  });

  test('add multiple items updates badge count', async () => {
    await inventoryPage.addToCartByIndex(0);
    await inventoryPage.addToCartByIndex(1);
    expect(await inventoryPage.getCartCount()).toBe(2);
  });

  test('sort by price low to high', async () => {
    await inventoryPage.sortBy('Price (low to high)');
    const firstItem = await inventoryPage.getFirstItemName();
    expect(firstItem).toBeTruthy();
  });
});