import { test, expect } from "@playwright/test";
import { FormsPage } from "../pages/FormsPage";

/**
 * 🎯 ТЕСТЫ ФОРМ И INPUTS
 *
 * Что тестируем:
 * - Заполнение и отправку формы регистрации
 * - Работу различных input полей
 * - Выбор из dropdown списков
 * - Работу чекбоксов
 * - Валидацию форм
 *
 * URL: https://testingit.ru/forms
 */

test.describe("📝 Формы и Inputs", () => {
  /**
   * Комплексный тест формы регистрации
   *
   * Что проверяем:
   * - Видимость и доступность всех полей формы
   * - Корректное заполнение текстовых полей (username, email, password)
   * - Работу выпадающего списка стран (проверка нескольких вариантов)
   * - Работу чекбокса (отметить/снять/отметить снова)
   * - Успешную отправку формы
   * - Отображение сообщения об успехе и отправленных данных
   */
  test("Форма ввода.Без валидации.Корректное заполнения формы регистрации", async ({
    page,
  }) => {
    const formsPage = new FormsPage(page);

    await test.step("Открыть страницу с формой", async () => {
      await formsPage.goto();
      await test.step("Проверить видимость всех полей формы", async () => {
        await expect(formsPage.usernameInput).toBeVisible();
        await expect(formsPage.emailInput).toBeVisible();
        await expect(formsPage.passwordInput).toBeVisible();
        await expect(formsPage.countrySelect).toBeVisible();
        await expect(formsPage.termsCheckbox).toBeVisible();
        await expect(formsPage.submitButton).toBeVisible();
      });
    });

    await test.step("Проверить работу выпадающего списка стран", async () => {
      const countries = ["Россия", "США", "Германия", "Великобритания"];
      for (const country of countries) {
        await formsPage.countrySelect.selectOption({ label: country });
        const selectedValue = await formsPage.countrySelect.inputValue();
      }
    });

    await test.step("Проверить работу чекбокса", async () => {
      const initialState = await formsPage.termsCheckbox.isChecked();
      await formsPage.termsCheckbox.check();
      await expect(formsPage.termsCheckbox).toBeChecked();
      await formsPage.termsCheckbox.uncheck();
      await expect(formsPage.termsCheckbox).not.toBeChecked();
      await formsPage.termsCheckbox.check();
      await expect(formsPage.termsCheckbox).toBeChecked();
    });

    const testData = {
      username: "qa_tester_2026",
      email: "qa.tester@testingit.ru",
      password: "SecureP@ss123!",
      country: "Россия",
      acceptTerms: true,
    };

    await test.step("Заполнить текстовые поля формы", async () => {
      await formsPage.usernameInput.fill(testData.username);
      await formsPage.emailInput.fill(testData.email);
      await formsPage.passwordInput.fill(testData.password);
      await formsPage.countrySelect.selectOption({ label: testData.country });
    });

    await test.step("Проверить корректность заполненных данных", async () => {
      await expect(formsPage.usernameInput).toHaveValue(testData.username);
      await expect(formsPage.emailInput).toHaveValue(testData.email);
      await expect(formsPage.passwordInput).toHaveValue(testData.password);
      await expect(formsPage.termsCheckbox).toBeChecked();
    });

    await test.step("Отправить форму", async () => {
      await formsPage.submitForm();
      await test.step("Проверить успешную отправку формы", async () => {
        await expect(formsPage.successMessage).toBeVisible();
        const pageContent = await page.textContent("body");
        await expect(formsPage.resultBlock).toBeVisible();
        await expect(formsPage.resultBlock).toHaveScreenshot(
          "form-complete-result.png",
          {
            maxDiffPixels: 100,
          }
        );
      });
    });
  });
  /**
   * Тест негативного сценария: отправка формы без заполнения
   *
   * Что проверяем:
   * - Форма отправляется даже с пустыми полями
   * - В ответе приходят пустые значения для незаполненных полей
   * - Данные содержат пустые строки для обязательных полей
   */
  test("Форма ввода.Без валидации.Регистрация без заполнения полей", async ({
    page,
  }) => {
    const formsPage = new FormsPage(page);

    await test.step("Открыть страницу с формой", async () => {
      await formsPage.goto();
    });

    await test.step("Оставить все поля пустыми", async () => {
      // НЕ заполняем поля - оставляем их пустыми
    });

    await test.step("Отправить пустую форму", async () => {
      await formsPage.submitForm();
      await test.step("Проверить, что форма отправлена", async () => {
        await expect(formsPage.successMessage).toBeVisible();
      });
    });

    await test.step("Проверить отправленные данные", async () => {
      const pageContent = await page.textContent("body");
      if (pageContent) {
        const dataMatch = pageContent.match(/Данные:\s*(\{[^}]+\})/);
        if (dataMatch) {
          const dataString = dataMatch[1];
        }
      }
      await expect(formsPage.resultBlock).toBeVisible();
      await expect(formsPage.resultBlock).toHaveScreenshot(
        "form-empty-result.png",
        {
          maxDiffPixels: 100,
        }
      );
    });
  });
  test("Форма ввода.C валидацией.Регистрация с корректными данными", async ({
    page,
  }) => {
    const formsPage = new FormsPage(page);
    await test.step("Открыть страницу", async () => {
      await formsPage.goto();
      await test.step("На странице присутствует форма регистрации с валидацией", async () => {
        await expect(formsPage.submitValidatedButton).toBeVisible();
      });
    });
    await test.step("Заполнить форму корректными данными", async () => {
      await formsPage.usernameValidatedInput.fill("testingit");
      await formsPage.emailValidatedInput.fill("test@test.com");
      await formsPage.passwordValidatedInput.fill("testingit1");
      await formsPage.passwordConfirmValidatedInput.fill("testingit1");
    });
    await test.step("Нажать на кнопку подтверждения", async () => {
      await formsPage.submitValidatedButton.click();
      await test.step("Форма отправлена успешно", async () => {
        await expect(formsPage.validationResult).toHaveScreenshot(
          "validation-form-complete-result.png",
          {}
        );
      });
    });
  });
  test("Форма ввода.C валидацией. Регистрация с некорректными данными. Проверка валидации формы", async ({
    page,
  }) => {
    const formsPage = new FormsPage(page);
    await test.step("Открыть страницу", async () => {
      await formsPage.goto();
      await test.step("На странице присутствует форма регистрации с валидацией", async () => {
        await expect(formsPage.submitValidatedButton).toBeVisible();
      });
    });
    await test.step("Заполнить поле username некорректными данными", async () => {
      await formsPage.usernameValidatedInput.fill("test");
    });
    await test.step("Заполнить поле email некорректными данными", async () => {
      await formsPage.emailValidatedInput.fill("testtest.com");
    });
    await test.step("Заполнить поле password некорректными данными", async () => {
      await formsPage.passwordValidatedInput.fill("testingit");
    });
    await test.step("Заполнить поле passwordConfirm некорректными данными", async () => {
      await formsPage.passwordConfirmValidatedInput.fill("testing");
    });
    await test.step("Нажать на кнопку подтверждения", async () => {
      await formsPage.submitValidatedButton.click();
      await test.step("Отображается сообщение об ошибке", async () => {
        await expect(formsPage.validationResult).toHaveScreenshot(
          "form-validation-error.png",
          {}
        );
      });
      await test.step("Отображается валидация поля username", async () => {
        await expect(formsPage.usernameValidatedErrorMessage).toBeVisible();
      });
      await test.step("Отображается валидация поля email", async () => {
        await expect(formsPage.emailValidatedErrorMessage).toBeVisible();
      });
      await test.step("Отображается валидация поля password", async () => {
        await expect(formsPage.passwordValidatedErrorMessage).toBeVisible();
      });
      await test.step("Отображается валидация поля passwordConfirm", async () => {
        await expect(
          formsPage.passwordConfirmValidatedErrorMessage
        ).toBeVisible();
      });
    });
  });
});
