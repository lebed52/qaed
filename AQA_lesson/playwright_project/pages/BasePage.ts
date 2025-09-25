import { Page, Locator, expect } from '@playwright/test';

export class BasePage {
  readonly page: Page;
  readonly closeModalButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.closeModalButton = page.getByRole('button', { name: 'Закрыть модальное окно' });
  }

  async goto(url: string) {
    await this.page.goto(url);
  }

  async closeModal() {
    await this.closeModalButton.click();
  }

  async waitForModalToBeClosed() {
    await expect(this.closeModalButton).not.toBeVisible();
  }
}