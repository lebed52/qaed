import { test, expect } from "../fixtures/pages";

test.describe("Лавка.Адрес", () => {
  test("Выбор адреса новичком", async ({ mainPage, addressDialog }) => {
    await test.step("Открываем главную страницу Яндекс Лавки", async () => {
      await mainPage.openAndCloseModal();
    });

    await test.step("Открываем диалог выбора адреса", async () => {
      await mainPage.clickAddressButton();
      
      await test.step("Диалог выбора адреса открылся", async () => {
        await addressDialog.expectDialogVisible();
      });
    });

    await test.step("Очищаем поле поиска", async () => {
      await addressDialog.clearSearchField();
    });

    await test.step("Вводим адрес в поле поиска", async () => {
      await addressDialog.searchAddress("каменщики 1");
      
      await test.step("Текст введен и появились варианты адресов", async () => {
        await addressDialog.expectAddressInResults("улица Большие Каменщики, 1Москва");
      });
    });

    await test.step("Выбираем адрес из списка", async () => {
      await addressDialog.selectAddressFromList("улица Большие Каменщики, 1Москва");
    });

    await test.step("Подтверждаем выбранный адрес", async () => {
      await addressDialog.confirmAddress();
      
      await test.step("Диалог закрылся и адрес отображается в кнопке", async () => {
        await addressDialog.expectDialogNotVisible();
        await expect(
          mainPage.page.getByRole("button", {
            name: "Ваше местоположение ",
          })
        ).toHaveScreenshot("product-card.png");
      });
    });
  });
});
