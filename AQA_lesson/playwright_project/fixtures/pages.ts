import { test as base } from '@playwright/test';
import { MainPage, AddressDialog, SearchPage } from '../pages';

type PageFixtures = {
  mainPage: MainPage;
  addressDialog: AddressDialog;
  searchPage: SearchPage;
};

export const test = base.extend<PageFixtures>({
  mainPage: async ({ page }, use) => {
    const mainPage = new MainPage(page);
    await use(mainPage);
  },

  addressDialog: async ({ page }, use) => {
    const addressDialog = new AddressDialog(page);
    await use(addressDialog);
  },

  searchPage: async ({ page }, use) => {
    const searchPage = new SearchPage(page);
    await use(searchPage);
  },
});

export { expect } from '@playwright/test';