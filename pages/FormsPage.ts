import { Page, Locator } from "@playwright/test";

/**
 * Page Object для страницы "Формы и Inputs" QA Sandbox
 *
 * Содержит локаторы и методы для работы с формами регистрации
 */
export class FormsPage {
  readonly page: Page;

  // Локаторы для простой формы регистрации
  readonly heading: Locator;
  readonly usernameInput: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly countrySelect: Locator;
  readonly termsCheckbox: Locator;
  readonly submitButton: Locator;
  readonly successMessage: Locator;
  readonly formData: Locator;
  readonly resultBlock: Locator;

  constructor(page: Page) {
    this.page = page;

    // Заголовок формы
    this.heading = page.locator("h1", {
      hasText: /Простая форма регистрации/i,
    });

    // Поля формы (используем data-testid для точного выбора формы регистрации)
    this.usernameInput = page.getByTestId("reg-username");
    this.emailInput = page.getByTestId("reg-email");
    this.passwordInput = page.getByTestId("reg-password");
    this.countrySelect = page.getByTestId("reg-country");

    // Чекбокс согласия с условиями (используем data-testid)
    this.termsCheckbox = page.getByTestId("reg-terms");

    // Кнопка отправки (первая кнопка регистрации на странице)
    this.submitButton = page
      .getByRole("button", { name: /зарегистрироваться/i })
      .first();

    // Сообщение об успехе
    this.successMessage = page.locator("text=Форма отправлена!").first();
    this.formData = page.locator("text=/Данные:.*}/").first();

    // Блок с результатом отправки формы
    this.resultBlock = page.locator("#reg-result");
  }

  /**
   * Открывает страницу с формами
   */
  async goto() {
    await this.page.goto("/forms");
    await this.page.waitForLoadState("networkidle");
  }

  /**
   * Заполняет форму регистрации
   */
  async fillRegistrationForm(data: {
    username: string;
    email: string;
    password: string;
    country: string;
    acceptTerms?: boolean;
  }) {
    // Заполняем имя пользователя
    await this.usernameInput.fill(data.username);

    // Заполняем email
    await this.emailInput.fill(data.email);

    // Заполняем пароль
    await this.passwordInput.fill(data.password);

    // Выбираем страну
    await this.countrySelect.selectOption({ label: data.country });

    // Проставляем чекбокс (по умолчанию true)
    if (data.acceptTerms !== false) {
      await this.termsCheckbox.check();
    }
  }

  /**
   * Отправляет форму
   */
  async submitForm() {
    await this.submitButton.click();
  }

  /**
   * Проверяет, что форма успешно отправлена
   */
  async isFormSubmitted(): Promise<boolean> {
    return await this.successMessage.isVisible();
  }

  /**
   * Получает данные, которые были отправлены (из сообщения на странице)
   */
  async getSubmittedData(): Promise<string> {
    return (await this.formData.textContent()) || "";
  }

  /**
   * Проверяет, что поле Username видно и пустое
   */
  async isUsernameFieldEmpty(): Promise<boolean> {
    const value = await this.usernameInput.inputValue();
    return value === "";
  }

  /**
   * Проверяет валидацию формы (пытается отправить пустую форму)
   */
  async checkValidation() {
    await this.submitButton.click();
  }
}
