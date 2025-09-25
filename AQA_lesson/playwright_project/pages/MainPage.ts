import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class MainPage extends BasePage {
  readonly searchBox: Locator;
  readonly addressButton: Locator;
  readonly productCardLinks: Locator;
  readonly clearSearchButton: Locator;

  constructor(page: Page) {
    super(page);
    this.searchBox = page.getByRole('searchbox', { name: 'Поиск' });
    this.addressButton = page.getByRole('button', { 
      name: 'Ваше местоположение Укажите адрес доставки' 
    });
    this.productCardLinks = page.locator('[data-type="product-card-link"]');
    this.clearSearchButton = page.getByRole('button', { name: 'Очистить' });
  }

  async open() {
    await this.goto('https://lavka.yandex.ru/');
    await expect(this.page).toHaveURL(/lavka\.yandex\.ru/);
    await expect(this.page).toHaveTitle('Купить продукты с доставкой на дом из Яндекс Лавки');
  }

  async openAndCloseModal() {
    await this.open();
    await this.closeModal();
    await expect(this.addressButton).toBeVisible();
  }

  async clickAddressButton() {
    await this.addressButton.click();
  }

  async searchFor(query: string) {
    await this.searchBox.click();
    await this.searchBox.fill(query);
  }

  async clearSearch() {
    await this.clearSearchButton.click();
  }

  async expectSearchBoxValue(value: string) {
    await expect(this.searchBox).toHaveValue(value);
  }

  async expectSearchBoxPlaceholder(placeholder: string) {
    await expect(this.searchBox).toHaveAttribute('placeholder', placeholder);
  }

  async expectProductCardsVisible() {
    await expect(this.productCardLinks.first()).toBeVisible();
  }

  async expectProductCardsNotVisible() {
    await expect(this.productCardLinks).not.toBeVisible();
  }

  async expectSearchBoxScreenshot(name: string) {
    await expect(this.searchBox).toHaveScreenshot(name);
  }

  async expectProductCardScreenshot(name: string) {
    await expect(this.productCardLinks.first()).toHaveScreenshot(name);
  }

  async clickProductByName(productName: string) {
    await this.page.getByRole('link', { name: productName }).click();
  }
}