import { Page, Locator } from "@playwright/test";

/**
 * Page Object для главной страницы QA Sandbox (https://testingit.ru/)
 *
 * QA Sandbox - это песочница для практики автоматизации тестирования
 * Содержит различные разделы для тренировки навыков автотестирования
 */
export class QASandboxPage {
  readonly page: Page;

  // Локаторы для навигации по разделам
  readonly heading: Locator;
  readonly formsLink: Locator;
  readonly tablesLink: Locator;
  readonly modalsLink: Locator;
  readonly dragDropLink: Locator;
  readonly dynamicContentLink: Locator;
  readonly alertsLink: Locator;
  readonly controlsLink: Locator;
  readonly advancedLink: Locator;
  readonly uiLink: Locator;
  readonly specialLink: Locator;

  constructor(page: Page) {
    this.page = page;

    // Главный заголовок
    this.heading = page.locator("h1");

    // Ссылки на разделы (по тексту)
    this.formsLink = page.getByRole("link", { name: /формы и inputs/i });
    this.tablesLink = page.getByRole("link", { name: /таблицы/i });
    this.modalsLink = page.getByRole("link", { name: /модальные окна/i });
    this.dragDropLink = page.getByRole("link", { name: /drag & drop/i });
    this.dynamicContentLink = page.getByRole("link", {
      name: /динамический контент/i,
    });
    this.alertsLink = page.getByRole("link", { name: /alerts & dialogs/i });
    this.controlsLink = page.getByRole("link", { name: /form controls/i });
    this.advancedLink = page.getByRole("link", { name: /продвинутые/i });
    this.uiLink = page.getByRole("link", { name: /ui компоненты/i });
    this.specialLink = page.getByRole("link", { name: /особые сценарии/i });
  }

  /**
   * Открывает главную страницу QA Sandbox
   * Использует baseURL из playwright.config.ts
   */
  async goto() {
    await this.page.goto("/");
    await this.page.waitForLoadState("networkidle");
  }

  /**
   * Получает текст заголовка страницы
   */
  async getHeadingText(): Promise<string> {
    return (await this.heading.textContent()) || "";
  }

  /**
   * Проверяет, что главная страница загрузилась
   */
  async isLoaded(): Promise<boolean> {
    return await this.heading.isVisible();
  }

  /**
   * Переходит в раздел "Формы"
   */
  async goToForms() {
    await this.formsLink.click();
    await this.page.waitForURL(/.*forms.*/);
  }

  /**
   * Переходит в раздел "Таблицы"
   */
  async goToTables() {
    await this.tablesLink.click();
    await this.page.waitForURL(/.*tables.*/);
  }

  /**
   * Переходит в раздел "Модальные окна"
   */
  async goToModals() {
    await this.modalsLink.click();
    await this.page.waitForURL(/.*modals.*/);
  }

  /**
   * Переходит в раздел "Alerts & Dialogs"
   */
  async goToAlerts() {
    await this.alertsLink.click();
    await this.page.waitForURL(/.*alerts.*/);
  }

  /**
   * Переходит в раздел "Drag & Drop"
   */
  async goToDragDrop() {
    await this.dragDropLink.click();
    await this.page.waitForURL(/.*drag.*drop.*/);
  }

  /**
   * Переходит в раздел "Динамический контент"
   */
  async goToDynamicContent() {
    await this.dynamicContentLink.click();
    await this.page.waitForURL(/.*dynamic.*/);
  }

  /**
   * Переходит в раздел "Form Controls"
   */
  async goToControls() {
    await this.controlsLink.click();
    await this.page.waitForURL(/.*controls.*/);
  }

  /**
   * Переходит в раздел "Продвинутые"
   */
  async goToAdvanced() {
    await this.advancedLink.click();
    await this.page.waitForURL(/.*advanced.*/);
  }

  /**
   * Переходит в раздел "UI Компоненты"
   */
  async goToUI() {
    await this.uiLink.click();
    await this.page.waitForURL(/.*ui.*/);
  }

  /**
   * Переходит в раздел "Особые сценарии"
   */
  async goToSpecial() {
    await this.specialLink.click();
    await this.page.waitForURL(/.*special.*/);
  }

  /**
   * Считает количество доступных разделов на главной странице
   */
  async countSections(): Promise<number> {
    const sections = this.page.locator(".section-card");
    return await sections.count();
  }
}
