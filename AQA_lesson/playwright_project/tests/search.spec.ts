import { test, expect } from "../fixtures/pages";

test.describe("Лавка.Поиск", () => {
  test("Работоспособность поля поиска", async ({ mainPage, searchPage }) => {
    await test.step("Открываем главную страницу Яндекс Лавки", async () => {
      await mainPage.openAndCloseModal();
    });

    await test.step("Блок поискового окна отображается", async () => {
      await mainPage.expectSearchBoxScreenshot("search-box.png");
    });

    await test.step("Нажимаем на поисковое окно", async () => {
      await mainPage.searchBox.click();
    });

    await test.step("Вводим 'во'", async () => {
      await mainPage.searchFor("во");
      
      await test.step("Проверяем отсутствие поисковой выдачи", async () => {
        await mainPage.expectProductCardsNotVisible();
      });
    });

    await test.step("Добавляем 'д'", async () => {
      await mainPage.searchFor("вод");
      
      await test.step("Открылась страница поиска", async () => {
        await searchPage.expectSearchUrl();
      });
      
      await test.step("Поисковая выдача отображается", async () => {
        await searchPage.expectProductCardsVisible();
      });
    });

    await test.step("Удаляем 'д'", async () => {
      await mainPage.searchFor("во");
      
      await test.step("Поисковая выдача отображается", async () => {
        await searchPage.expectProductCardsVisible();
      });
    });

    await test.step("Нажимаем на крестик очистки поиска", async () => {
      await mainPage.clearSearch();
      
      await test.step("Страница поиска закрылась", async () => {
        await searchPage.expectNotSearchUrl();
      });
      
      await test.step("Поисковая выдача отсутствует", async () => {
        await mainPage.expectProductCardsNotVisible();
      });
      
      await test.step("Плейсхолдер отображается в поле поиска", async () => {
        await mainPage.expectSearchBoxPlaceholder("Найти в Лавке");
      });
    });
  });

  test("Переход к товару через поиск", async ({ mainPage, searchPage }) => {
    await test.step("Открываем главную страницу Яндекс Лавки", async () => {
      await mainPage.open();
    });

    await test.step("Нажимаем закрыть модальное окно", async () => {
      await mainPage.closeModal();
      
      await test.step("Модальное окно закрылось", async () => {
        await mainPage.waitForModalToBeClosed();
      });
    });

    await test.step("Кликаем на поисковую строку", async () => {
      await mainPage.searchBox.click();
    });

    await test.step("Вводим поисковый запрос", async () => {
      await mainPage.searchFor("ВОДА");
      
      await test.step("Текст введен в поисковую строку", async () => {
        await mainPage.expectSearchBoxValue("ВОДА");
      });
      
      await test.step("Товар отображается в результатах поиска", async () => {
        await mainPage.expectProductCardScreenshot("product-card.png");
      });
    });

    await test.step("Нажимаем на товар из результатов поиска", async () => {
      await mainPage.clickProductByName("Вода Святой источник без газа 1,5 л");
      
      await test.step("Перешли на страницу товара", async () => {
        await searchPage.expectBreadcrumbsContainText("Вода");
      });
      
      await test.step("Отображается названия товара на странице", async () => {
        await searchPage.expectProductVisible("Вода «Святой источник» негазированная 1,5 л");
      });
    });
  });
});
