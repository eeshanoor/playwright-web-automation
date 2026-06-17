# Playwright Web Automation
> **Eesha Noor** | SDET | TypeScript + Playwright

## Tech Stack
- TypeScript
- Playwright
- Page Object Model
- Allure Reports

## Test Coverage (SauceDemo)
- Login: valid/invalid/locked user
- Inventory: sorting, add to cart
- Checkout: full E2E flow

## Run Tests
```bash
npm install
npx playwright install
npx playwright test
npx playwright test --headed
npx playwright test --project=chromium
npx playwright show-report
```

## Project Structure
```
pages/       LoginPage.ts, InventoryPage.ts, CartPage.ts, CheckoutPage.ts
tests/       login.spec.ts, inventory.spec.ts, checkout.spec.ts
playwright.config.ts
```