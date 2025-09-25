import { Page, Locator, expect } from '@playwright/test';

export class SearchPage {
  readonly page: Page;
  readonly productCards: Locator;
  readonly breadcrumbs: Locator;

  constructor(page: Page) {
    this.page = page;
    this.productCards = page.locator('[data-type="product-card-link"]');
    this.breadcrumbs = page.locator('ol');
  }

  async expectSearchUrl() {
    await expect(this.page).toHaveURL(/\/search\?/);
  }

  async expectNotSearchUrl() {
    await expect(this.page).not.toHaveURL(/\/search\?/);
  }

  async expectProductCardsVisible() {
    await expect(this.productCards.first()).toBeVisible();
  }

  async expectProductCardsNotVisible() {
    await expect(this.productCards).not.toBeVisible();
  }

  async expectBreadcrumbsContainText(text: string) {
    await expect(this.breadcrumbs).toContainText(text);
  }

  async expectProductVisible(productName: string) {
    await expect(this.page.getByText(productName)).toBeVisible();
  }
}