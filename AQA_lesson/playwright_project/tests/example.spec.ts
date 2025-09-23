import { test, expect } from "@playwright/test";

test.describe("Главная страница", () => {
  test("Присутстствует заголовок", async ({ page }) => {
    await test.step("Открываем главную страницу", async () => {
      await page.goto("https://lavka.yandex.ru/");
    });
    await test.step("Заголовок есть", async () => {
      await expect(page).toHaveTitle(
        "Купить продукты с доставкой на дом из Яндекс Лавки"
      );
    });
  });
  test("Сгенерированый тест", async ({ page }) => {
    await page.goto("https://lavka.yandex.ru/");
    await page.getByRole("button", { name: "Закрыть модальное окно" }).click();
    await page.getByRole("searchbox", { name: "Поиск" }).click();
    await page.getByRole("searchbox", { name: "Поиск" }).fill("ВОДА");
    await page
      .getByRole("link", { name: "Вода Святой источник без газа 1,5 л" })
      .click();
    await expect(page.locator("ol")).toContainText("Вода");
    await expect(
      page.getByText("Вода «Святой источник» негазированная 1,5 л")
    ).toBeVisible();
    await page.getByRole("link", { name: "Вода", exact: true }).click();
    await expect(page.locator("h1")).toContainText("Вода");
  });
});
