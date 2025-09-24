import { test, expect } from "@playwright/test";

test.describe("Лавка.Поиск", () => {
  test("Работоспособность поля поиска", async ({ page }) => {
    await test.step("Открываем главную страницу Яндекс Лавки", async () => {
      await page.goto("https://lavka.yandex.ru/");
    });

    await test.step("Закрываем модальное окно", async () => {
      await page
        .getByRole("button", { name: "Закрыть модальное окно" })
        .click();
    });

    await test.step("Блок поискового окна отображается", async () => {
      await expect(
        page.getByRole("searchbox", { name: "Поиск" })
      ).toHaveScreenshot("search-box.png");
    });

    await test.step("Нажимаем на поисковое окно", async () => {
      await page.getByRole("searchbox", { name: "Поиск" }).click();
    });

    await test.step("Вводим 'во'", async () => {
      await page.getByRole("searchbox", { name: "Поиск" }).fill("во");
    });

    await test.step("Проверяем отсутствие поисковой выдачи", async () => {
      await expect(
        page.locator('[data-type="product-card-link"]')
      ).not.toBeVisible();
    });

    await test.step("Добавляем 'д'", async () => {
      await page.getByRole("searchbox", { name: "Поиск" }).fill("вод");
    });

    await test.step("Открылась страница поиска", async () => {
      await expect(page).toHaveURL(/\/search\?/);
    });

    await test.step("Поисковая выдача отображается", async () => {
      await expect(
        page.locator('[data-type="product-card-link"]').first()
      ).toBeVisible();
    });

    await test.step("Удаляем 'д'", async () => {
      await page.getByRole("searchbox", { name: "Поиск" }).fill("во");
    });

    await test.step("Поисковая выдача отображается", async () => {
      await expect(
        page.locator('[data-type="product-card-link"]').first()
      ).toBeVisible();
    });

    await test.step("Нажимаем на крестик очистки поиска", async () => {
      await page.getByRole("button", { name: "Очистить" }).click();
    });

    await test.step("Страница поиска закрылась", async () => {
      await expect(page).not.toHaveURL(/\/search\?/);
    });

    await test.step("Поисковая выдача отсутствует", async () => {
      await expect(
        page.locator('[data-type="product-card-link"]')
      ).not.toBeVisible();
    });

    await test.step("Плейсхолдер отображается в поле поиска", async () => {
      await expect(
        page.getByRole("searchbox", { name: "Поиск" })
      ).toHaveAttribute("placeholder", "Найти в Лавке");
    });
  });

  test("Переход к товару через поиск", async ({ page }) => {
    await test.step("Открываем главную страницу Яндекс Лавки", async () => {
      await page.goto("https://lavka.yandex.ru/");
    });

    await test.step("Страница загрузилась корректно", async () => {
      await expect(page).toHaveURL(/lavka\.yandex\.ru/);
    });

    await test.step("Нажимаем закрыть модальное окно", async () => {
      await page
        .getByRole("button", { name: "Закрыть модальное окно" })
        .click();
    });

    await test.step("Модальное окно закрылось", async () => {
      await expect(
        page.getByRole("button", { name: "Закрыть модальное окно" })
      ).not.toBeVisible();
    });

    await test.step("Кликаем на поисковую строку", async () => {
      await page.getByRole("searchbox", { name: "Поиск" }).click();
    });

    await test.step("Вводим поисковый запрос", async () => {
      await page.getByRole("searchbox", { name: "Поиск" }).fill("ВОДА");
    });

    await test.step("Текст введен в поисковую строку", async () => {
      await expect(page.getByRole("searchbox", { name: "Поиск" })).toHaveValue(
        "ВОДА"
      );
    });

    await test.step("Товар отображается в результатах поиска", async () => {
      await expect(
        page.locator('[data-type="product-card-link"]').first()
      ).toHaveScreenshot("product-card.png");
    });

    await test.step("Нажимаем на товар из результатов поиска", async () => {
      await page
        .getByRole("link", { name: "Вода Святой источник без газа 1,5 л" })
        .click();
    });

    await test.step("Перешли на страницу товара", async () => {
      await expect(page.locator("ol")).toContainText("Вода");
    });

    await test.step("Отображается названия товара на странице", async () => {
      await expect(
        page.getByText("Вода «Святой источник» негазированная 1,5 л")
      ).toBeVisible();
    });
  });
});
