import { Page, Locator } from '@playwright/test';

export class InventoryPage {
  private readonly inventoryContainer: Locator;
  private readonly inventoryItems: Locator;
  private readonly sortDropdown: Locator;
  private readonly cartBadge: Locator;

  constructor(private page: Page) {
    this.inventoryContainer = page.locator('#inventory_container');
    this.inventoryItems     = page.locator('.inventory_item');
    this.sortDropdown       = page.locator('.product_sort_container');
    this.cartBadge          = page.locator('.shopping_cart_badge');
  }

  async isLoaded(): Promise<boolean> {
    return this.inventoryContainer.isVisible();
  }

  async getItemCount(): Promise<number> {
    return this.inventoryItems.count();
  }

  async sortBy(option: string) {
    await this.sortDropdown.selectOption({ label: option });
  }

  async addToCartByIndex(index: number) {
    await this.page.locator('[data-test^="add-to-cart"]').nth(index).click();
  }

  async getCartCount(): Promise<number> {
    const badge = this.cartBadge;
    if (await badge.isVisible()) {
      return parseInt(await badge.textContent() ?? '0');
    }
    return 0;
  }

  async getFirstItemName(): Promise<string> {
    return this.page.locator('.inventory_item_name').first().textContent() ?? '';
  }
}