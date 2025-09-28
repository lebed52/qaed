import { test, expect } from "../fixtures/api";
import { Pet, Order } from "../src/api/petstore-client";

test.describe("Petstore API", () => {
  test.describe("Управление питомцами", () => {
    test("Создание питомца с валидными данными", async ({ petstoreApi }) => {
      const petId = petstoreApi.generateRandomPetId();

      const newPet: Pet = {
        id: petId,
        category: {
          id: 1,
          name: "Dogs",
        },
        name: "Test Dog",
        photoUrls: ["https://example.com/dog.jpg"],
        tags: [
          {
            id: 1,
            name: "friendly",
          },
        ],
        status: "available",
      };

      const { response, data } = await petstoreApi.createPet(newPet);

      await test.step("Проверка успешного создания питомца", async () => {
        expect(response.status()).toBe(200);
        expect(data.name).toBe(newPet.name);
        expect(data.status).toBe("available");
        expect(data.category?.name).toBe("Dogs");
        expect(data.photoUrls).toContain("https://example.com/dog.jpg");
      });

      await petstoreApi.deletePet(petId);
    });

    test("Обновление информации о питомце", async ({ petstoreApi }) => {
      const petId = petstoreApi.generateRandomPetId();

      const initialPet: Pet = {
        id: petId,
        name: "Initial Dog",
        photoUrls: ["https://example.com/initial.jpg"],
        status: "available",
      };

      await petstoreApi.createPet(initialPet);

      const updatedPet: Pet = {
        id: petId,
        category: {
          id: 2,
          name: "Cats",
        },
        name: "Updated Cat",
        photoUrls: ["https://example.com/updated.jpg"],
        tags: [
          {
            id: 1,
            name: "updated",
          },
        ],
        status: "pending",
      };

      const { response, data } = await petstoreApi.updatePet(updatedPet);

      await test.step("Проверка успешного обновления питомца", async () => {
        expect(response.status()).toBe(200);
        expect(data.name).toBe("Updated Cat");
        expect(data.status).toBe("pending");
        expect(data.category?.name).toBe("Cats");
      });

      await petstoreApi.deletePet(petId);
    });
  });

  test.describe("Поиск питомцев", () => {
    test('Поиск питомцев по статусу "available"', async ({ petstoreApi }) => {
      const { response, data } = await petstoreApi.findPetsByStatus(
        "available"
      );

      await test.step("Проверка результатов поиска по статусу available", async () => {
        expect(response.status()).toBe(200);
        expect(Array.isArray(data)).toBe(true);
        expect(data.length).toBeGreaterThan(0);

        data.forEach((pet) => {
          expect(pet.status).toBe("available");
        });
      });
    });

    test('Поиск питомцев по статусу "pending"', async ({ petstoreApi }) => {
      const { response, data } = await petstoreApi.findPetsByStatus("pending");

      await test.step("Проверка результатов поиска по статусу pending", async () => {
        expect(response.status()).toBe(200);
        expect(Array.isArray(data)).toBe(true);

        data.forEach((pet) => {
          expect(pet.status).toBe("pending");
        });
      });
    });

    test('Поиск питомцев по статусу "sold"', async ({ petstoreApi }) => {
      const { response, data } = await petstoreApi.findPetsByStatus("sold");

      await test.step("Проверка результатов поиска по статусу sold", async () => {
        expect(response.status()).toBe(200);
        expect(Array.isArray(data)).toBe(true);

        data.forEach((pet) => {
          expect(pet.status).toBe("sold");
        });
      });
    });

    test("Поиск по нескольким статусам одновременно", async ({
      petstoreApi,
    }) => {
      const { response, data } = await petstoreApi.findPetsByStatus(
        "available,pending"
      );

      await test.step("Проверка результатов поиска по множественным статусам", async () => {
        expect(response.status()).toBe(200);
        expect(Array.isArray(data)).toBe(true);
        expect(data.length).toBeGreaterThan(0);

        data.forEach((pet) => {
          expect(["available", "pending"]).toContain(pet.status);
        });
      });
    });
  });

  test.describe("Управление заказами", () => {
    test("Создание заказа с валидными данными", async ({ petstoreApi }) => {
      const orderId = petstoreApi.generateRandomOrderId();
      const petId = petstoreApi.generateRandomPetId();

      const newOrder: Order = {
        id: orderId,
        petId: petId,
        quantity: 2,
        shipDate: petstoreApi.getCurrentISODate(),
        status: "placed",
        complete: false,
      };

      const { response, data } = await petstoreApi.createOrder(newOrder);

      await test.step("Проверка успешного создания заказа", async () => {
        expect(response.status()).toBe(200);
        expect(data.petId).toBe(petId);
        expect(data.quantity).toBe(2);
        expect(data.status).toBe("placed");
        expect(data.complete).toBe(false);
      });

      await petstoreApi.deleteOrder(orderId);
    });
  });

  test.describe("Негативные тесты", () => {
    test("Получение несуществующего питомца", async ({ petstoreApi }) => {
      const nonExistentId = 999999999;
      const { response } = await petstoreApi.getPetById(nonExistentId);

      await test.step("Проверка ошибки 404 для несуществующего питомца", async () => {
        expect(response.status()).toBe(404);
      });
    });

    test("Получение несуществующего заказа", async ({ petstoreApi }) => {
      const nonExistentOrderId = 999999999;
      const { response } = await petstoreApi.getOrderById(nonExistentOrderId);

      await test.step("Проверка ошибки 404 для несуществующего заказа", async () => {
        expect(response.status()).toBe(404);
      });
    });

    test("Поиск питомцев с невалидным статусом", async ({ petstoreApi }) => {
      const { response, data } = await petstoreApi.findPetsByStatus(
        "invalid_status"
      );

      await test.step("Проверка обработки невалидного статуса", async () => {
        expect([200, 400]).toContain(response.status());

        if (response.status() === 200) {
          expect(Array.isArray(data)).toBe(true);
        }
      });
    });

    test("Создание питомца без обязательных полей", async ({ petstoreApi }) => {
      const incompletePet = {
        photoUrls: [],
        status: "available",
      } as unknown as Pet;

      const { response } = await petstoreApi.createPet(incompletePet);

      await test.step("Проверка обработки неполных данных питомца", async () => {
        expect([200, 400, 405]).toContain(response.status());
      });
    });

    test("Создание заказа с отрицательным количеством", async ({
      petstoreApi,
    }) => {
      const orderId = petstoreApi.generateRandomOrderId();

      const invalidOrder: Order = {
        id: orderId,
        petId: 1,
        quantity: -1,
        status: "placed",
      };

      const { response } = await petstoreApi.createOrder(invalidOrder);

      await test.step("Проверка обработки отрицательного количества", async () => {
        expect([200, 400]).toContain(response.status());
      });

      if (response.status() === 200) {
        await petstoreApi.deleteOrder(orderId);
      }
    });

    test("Удаление несуществующего питомца", async ({ petstoreApi }) => {
      const nonExistentId = 999999999;
      const { response } = await petstoreApi.deletePet(nonExistentId);

      await test.step("Проверка удаления несуществующего питомца", async () => {
        expect([200, 404]).toContain(response.status());
      });
    });

    test("Удаление несуществующего заказа", async ({ petstoreApi }) => {
      const nonExistentOrderId = 999999999;
      const { response } = await petstoreApi.deleteOrder(nonExistentOrderId);

      await test.step("Проверка удаления несуществующего заказа", async () => {
        expect([200, 404]).toContain(response.status());
      });
    });
  });

  test.describe("Валидация данных", () => {
    test("Создание питомца с максимально длинным именем", async ({
      petstoreApi,
    }) => {
      const petId = petstoreApi.generateRandomPetId();
      const longName = "A".repeat(1000);

      const pet: Pet = {
        id: petId,
        name: longName,
        photoUrls: ["https://example.com/long-name.jpg"],
        status: "available",
      };

      const { response, data } = await petstoreApi.createPet(pet);

      await test.step("Проверка создания питомца с длинным именем", async () => {
        expect(response.status()).toBe(200);
        expect(data.name).toBe(longName);
      });

      await petstoreApi.deletePet(petId);
    });

    test("Создание питомца со специальными символами в имени", async ({
      petstoreApi,
    }) => {
      const petId = petstoreApi.generateRandomPetId();
      const specialName = "Тест-Питомец_123!@#$%^&*()";

      const pet: Pet = {
        id: petId,
        name: specialName,
        photoUrls: ["https://example.com/special.jpg"],
        status: "available",
      };

      const { response, data } = await petstoreApi.createPet(pet);

      await test.step("Проверка создания питомца со специальными символами", async () => {
        expect(response.status()).toBe(200);
        expect(data.name).toBe(specialName);
      });

      await petstoreApi.deletePet(petId);
    });

    test("Создание заказа с большим количеством", async ({ petstoreApi }) => {
      const orderId = petstoreApi.generateRandomOrderId();
      const largeQuantity = 999999;

      const order: Order = {
        id: orderId,
        petId: 1,
        quantity: largeQuantity,
        status: "placed",
      };

      const { response, data } = await petstoreApi.createOrder(order);

      await test.step("Проверка создания заказа с большим количеством", async () => {
        expect(response.status()).toBe(200);
        expect(data.quantity).toBe(largeQuantity);
      });

      await petstoreApi.deleteOrder(orderId);
    });
  });
});
