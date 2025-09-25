import { Page, Locator, expect } from '@playwright/test';

export class AddressDialog {
  readonly page: Page;
  readonly dialog: Locator;
  readonly searchInput: Locator;
  readonly clearButton: Locator;
  readonly confirmButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.dialog = page.getByRole('dialog', { name: 'Укажите ваш адрес' });
    this.searchInput = page.getByRole('combobox', { name: 'Поиск' });
    this.clearButton = page.getByRole('button', { name: 'Очистить' });
    this.confirmButton = page.getByRole('button', { name: 'Подтвердить адрес' });
  }

  async expectDialogVisible() {
    await expect(this.dialog).toBeVisible();
    await expect(this.searchInput).toBeVisible();
  }

  async expectDialogNotVisible() {
    await expect(this.dialog).not.toBeVisible();
  }

  async clearSearchField() {
    await this.clearButton.click();
    await expect(this.searchInput).toHaveValue('');
  }

  async searchAddress(address: string) {
    await this.searchInput.fill(address);
    await expect(this.searchInput).toHaveValue(address);
  }

  async selectAddressFromList(addressText: string) {
    await this.page.getByText(addressText).click();
    await expect(this.confirmButton).toBeEnabled();
  }

  async confirmAddress() {
    await this.confirmButton.click();
  }

  async expectAddressInResults(addressText: string) {
    await expect(this.page.getByText(addressText)).toBeVisible();
  }
}