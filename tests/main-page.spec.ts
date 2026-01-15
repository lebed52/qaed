import { test, expect } from "@playwright/test";
import { QASandboxPage } from "../pages/QASandboxPage";

/**
 * 🎯 ТЕСТЫ ГЛАВНОЙ СТРАНИЦЫ QA SANDBOX
 *
 * Что тестируем:
 * - Открытие и загрузка главной страницы
 * - Доступность всех разделов сайта
 * - Навигацию между разделами
 * - Адаптивность (мобильная версия)
 * - Производительность загрузки
 *
 * URL: https://testingit.ru/
 */

test.describe("🎭 Главная страница QA Sandbox", () => {
  /**
   * TEST #1: Проверка открытия главной страницы
   *
   * Что проверяем:
   * - Страница открывается
   * - Заголовок виден
   * - URL корректный
   */
  test("Открытие главной страницы QA Sandbox", async ({ page }) => {
    const sandboxPage = new QASandboxPage(page);

    await test.step("Открыть главную страницу", async () => {
      await sandboxPage.goto();
    });

    await test.step("Проверить загрузку страницы", async () => {
      const isLoaded = await sandboxPage.isLoaded();
      expect(isLoaded).toBe(true);
    });

    await test.step("Проверить URL страницы", async () => {
      expect(page.url()).toContain("testingit.ru");
    });

    await test.step("Проверить заголовок страницы", async () => {
      await expect(page).toHaveTitle(/QA Sandbox|Песочница|testingit/i);
    });

    await test.step("Проверить наличие заголовка на странице", async () => {
      const headingText = await sandboxPage.getHeadingText();
      expect(headingText.length).toBeGreaterThan(0);
    });
  });

  /**
   * TEST #2: Проверка навигации по разделам
   *
   * Что проверяем:
   * - Все основные разделы доступны
   * - Ссылки кликабельны
   */
  test("Проверка доступности разделов на главной странице", async ({
    page,
  }) => {
    const sandboxPage = new QASandboxPage(page);

    await test.step("Открыть главную страницу", async () => {
      await sandboxPage.goto();
    });

    await test.step("Проверить видимость всех разделов", async () => {
      await expect(sandboxPage.formsLink).toBeVisible();
      await expect(sandboxPage.tablesLink).toBeVisible();
      await expect(sandboxPage.modalsLink).toBeVisible();
      await expect(sandboxPage.dragDropLink).toBeVisible();
      await expect(sandboxPage.dynamicContentLink).toBeVisible();
      await expect(sandboxPage.alertsLink).toBeVisible();
      await expect(sandboxPage.controlsLink).toBeVisible();
      await expect(sandboxPage.advancedLink).toBeVisible();
      await expect(sandboxPage.uiLink).toBeVisible();
      await expect(sandboxPage.specialLink).toBeVisible();
    });

    await test.step("Сделать скриншот главной страницы", async () => {
      await page.screenshot({
        path: "test-results/qa-sandbox-main-page.png",
        fullPage: true,
      });
    });
  });

  /**
   * TEST #3: Проверка перехода в раздел "Alerts"
   *
   * Демонстрирует переход между страницами
   */
  test("Переход в раздел Alerts & Dialogs", async ({ page }) => {
    const sandboxPage = new QASandboxPage(page);

    await test.step("Открыть главную страницу", async () => {
      await sandboxPage.goto();
    });

    await test.step("Перейти в раздел Alerts & Dialogs", async () => {
      await sandboxPage.goToAlerts();
    });

    await test.step("Проверить URL раздела Alerts", async () => {
      expect(page.url()).toContain("alerts");
    });

    await test.step("Проверить наличие кнопки Alert", async () => {
      const alertButton = page.getByRole("button", { name: /alert/i }).first();
      await expect(alertButton).toBeVisible();
    });
  });

  /**
   * TEST #4: Базовая проверка адаптивности (viewport)
   *
   * Демонстрирует тестирование на разных разрешениях
   */
  test("Проверка отображения на мобильном устройстве", async ({ page }) => {
    const sandboxPage = new QASandboxPage(page);

    await test.step("Установить мобильный viewport", async () => {
      await page.setViewportSize({ width: 390, height: 844 });
    });

    await test.step("Открыть главную страницу", async () => {
      await sandboxPage.goto();
    });

    await test.step("Проверить загрузку страницы на мобильном устройстве", async () => {
      const isLoaded = await sandboxPage.isLoaded();
      expect(isLoaded).toBe(true);
    });

    await test.step("Сделать скриншот мобильной версии", async () => {
      await page.screenshot({
        path: "test-results/qa-sandbox-mobile.png",
        fullPage: true,
      });
    });

    await test.step("Вернуть desktop viewport", async () => {
      await page.setViewportSize({ width: 1280, height: 720 });
    });
  });

  /**
   * TEST #5: Проверка производительности загрузки
   */
  test("Проверка времени загрузки страницы", async ({ page }) => {
    let loadTime: number;

    await test.step("Измерить время загрузки страницы", async () => {
      const startTime = Date.now();
      await page.goto("/");
      await page.waitForLoadState("networkidle");
      loadTime = Date.now() - startTime;
    });

    await test.step("Проверить, что страница загружается быстро", async () => {
      expect(loadTime).toBeLessThan(5000);
    });
  });
});
