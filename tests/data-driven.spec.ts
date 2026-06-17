import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';

const validUsers = [
  { username: 'standard_user',          password: 'secret_sauce', scenario: 'standard user' },
  { username: 'performance_glitch_user', password: 'secret_sauce', scenario: 'performance glitch user' },
  { username: 'error_user',             password: 'secret_sauce', scenario: 'error user' },
];

const invalidUsers = [
  { username: 'locked_out_user', password: 'secret_sauce',  error: 'locked out' },
  { username: 'invalid_user',    password: 'wrong_pass',    error: 'Username and password do not match' },
  { username: '',                password: 'secret_sauce',  error: 'Username is required' },
  { username: 'standard_user',   password: '',              error: 'Password is required' },
];

test.describe('Data-Driven Login Tests', () => {
  for (const user of validUsers) {
    test(`valid login: ${user.scenario}`, async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.navigate();
      await loginPage.login(user.username, user.password);
      const inventory = new InventoryPage(page);
      expect(await inventory.isLoaded()).toBeTruthy();
    });
  }

  for (const user of invalidUsers) {
    test(`invalid login: "${user.username || 'empty'}" shows error`, async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.navigate();
      await loginPage.login(user.username, user.password);
      expect(await loginPage.isErrorVisible()).toBeTruthy();
      expect(await loginPage.getErrorMessage()).toContain(user.error);
    });
  }
});

const sortOptions = [
  { label: 'Name (A to Z)',         expectedFirst: 'Sauce Labs Backpack' },
  { label: 'Name (Z to A)',         expectedFirst: 'Test.allTheThings() T-Shirt (Red)' },
  { label: 'Price (low to high)',   expectedFirst: 'Sauce Labs Onesie' },
  { label: 'Price (high to low)',   expectedFirst: 'Sauce Labs Fleece Jacket' },
];

test.describe('Data-Driven Sorting Tests', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login('standard_user', 'secret_sauce');
  });

  for (const sort of sortOptions) {
    test(`sort by "${sort.label}" shows "${sort.expectedFirst}" first`, async ({ page }) => {
      const inventory = new InventoryPage(page);
      await inventory.sortBy(sort.label);
      const firstName = await inventory.getFirstItemName();
      expect(firstName).toBe(sort.expectedFirst);
    });
  }
});