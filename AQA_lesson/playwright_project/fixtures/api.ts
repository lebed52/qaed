import { test as base } from '@playwright/test';
import { PetstoreApiClient } from '../src/api/petstore-client';

type ApiFixtures = {
  petstoreApi: PetstoreApiClient;
};

export const test = base.extend<ApiFixtures>({
  petstoreApi: async ({ request }, use) => {
    const apiClient = new PetstoreApiClient(request);
    await use(apiClient);
  },
});

export { expect } from '@playwright/test';