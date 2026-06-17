import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';

test.describe('Login Tests - SauceDemo', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.navigate();
  });

  test('valid login navigates to inventory', async ({ page }) => {
    await loginPage.login('standard_user', 'secret_sauce');
    const inventoryPage = new InventoryPage(page);
    expect(await inventoryPage.isLoaded()).toBeTruthy();
    expect(page.url()).toContain('/inventory.html');
  });

  test('invalid credentials show error', async () => {
    await loginPage.login('wrong_user', 'wrong_pass');
    expect(await loginPage.isErrorVisible()).toBeTruthy();
    expect(await loginPage.getErrorMessage()).toContain('Username and password do not match');
  });

  test('locked out user gets error', async () => {
    await loginPage.login('locked_out_user', 'secret_sauce');
    expect(await loginPage.getErrorMessage()).toContain('locked out');
  });

  test('empty username shows error', async () => {
    await loginPage.login('', 'secret_sauce');
    expect(await loginPage.getErrorMessage()).toContain('Username is required');
  });
});