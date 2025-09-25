# Конспект: Page Object Model в Playwright

## 📋 Введение

**Page Object Model (POM)** - это паттерн проектирования для автотестов, который помогает:
- Убрать дублирование кода между тестами
- Сделать тесты более читаемыми и поддерживаемыми
- Централизовать селекторы и методы работы со страницами
- Упростить изменения при обновлении UI

## 🔧 Что было сделано сегодня

### Проблемы в исходных тестах:
1. **Дублирование кода** - оба теста открывали страницу и закрывали модальное окно одинаково
2. **Селекторы разбросаны по тестам** - сложно поддерживать при изменениях UI
3. **Отсутствие переиспользования** - каждый тест писал свою логику заново
4. **Неправильная структура steps** - проверки результатов не были вложены в действия

### Решение: Внедрение Page Object Model

## 🏗 Структура созданных Page Objects

### 1. BasePage - базовый класс
```typescript
// pages/BasePage.ts
export class BasePage {
  readonly page: Page;
  readonly closeModalButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.closeModalButton = page.getByRole('button', { name: 'Закрыть модальное окно' });
  }

  async goto(url: string) {
    await this.page.goto(url);
  }

  async closeModal() {
    await this.closeModalButton.click();
  }
}
```

**Что содержит:**
- Общие элементы для всех страниц (модальное окно)
- Базовые методы навигации
- Конструктор для инициализации page

### 2. MainPage - главная страница
```typescript
// pages/MainPage.ts
export class MainPage extends BasePage {
  readonly searchBox: Locator;
  readonly addressButton: Locator;
  readonly productCardLinks: Locator;

  async openAndCloseModal() {
    await this.open();
    await this.closeModal();
    await expect(this.addressButton).toBeVisible();
  }

  async searchFor(query: string) {
    await this.searchBox.click();
    await this.searchBox.fill(query);
  }
}
```

**Что содержит:**
- Поисковая строка и методы работы с ней
- Кнопка выбора адреса
- Карточки товаров
- Методы для проверки состояния элементов

### 3. AddressDialog - диалог выбора адреса
```typescript
// pages/AddressDialog.ts
export class AddressDialog {
  readonly dialog: Locator;
  readonly searchInput: Locator;
  readonly confirmButton: Locator;

  async searchAddress(address: string) {
    await this.searchInput.fill(address);
    await expect(this.searchInput).toHaveValue(address);
  }

  async selectAddressFromList(addressText: string) {
    await this.page.getByText(addressText).click();
    await expect(this.confirmButton).toBeEnabled();
  }
}
```

**Что содержит:**
- Элементы диалога выбора адреса
- Методы для поиска и выбора адреса
- Проверки состояния диалога

### 4. SearchPage - страница поиска
```typescript
// pages/SearchPage.ts
export class SearchPage {
  readonly productCards: Locator;
  readonly breadcrumbs: Locator;

  async expectSearchUrl() {
    await expect(this.page).toHaveURL(/\/search\?/);
  }

  async expectProductCardsVisible() {
    await expect(this.productCards.first()).toBeVisible();
  }
}
```

**Что содержит:**
- Элементы страницы поиска
- Методы для проверки URL и результатов поиска
- Проверки отображения товаров

## 🔧 Фикстуры для автоматической инициализации

### Создание фикстур:
```typescript
// fixtures/pages.ts
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
  // ... остальные фикстуры
});
```

**Преимущества фикстур:**
- Автоматическая инициализация Page Objects
- Нет необходимости создавать объекты в каждом тесте
- Единообразное использование во всех тестах

## 📝 Рефакторинг тестов

### Было (address.spec.ts - 93 строки):
```typescript
test("Выбор адреса новичком", async ({ page }) => {
  await page.goto("https://lavka.yandex.ru/");
  await expect(page).toHaveURL(/lavka\.yandex\.ru/);
  await page.getByRole("button", { name: "Закрыть модальное окно" }).click();
  await expect(page.getByRole("button", { name: "Ваше местоположение Укажите адрес доставки" })).toBeVisible();
  // ... много повторяющегося кода
});
```

### Стало (address.spec.ts - 39 строк):
```typescript
test("Выбор адреса новичком", async ({ mainPage, addressDialog }) => {
  await test.step("Открываем главную страницу Яндекс Лавки", async () => {
    await mainPage.openAndCloseModal();
  });

  await test.step("Открываем диалог выбора адреса", async () => {
    await mainPage.clickAddressButton();
    await addressDialog.expectDialogVisible();
  });
  // ... чистый и понятный код
});
```

### Исправление структуры steps:
**Было:**
```typescript
await test.step("Вводим 'во'", async () => {
  await mainPage.searchFor("во");
});

await test.step("Проверяем отсутствие поисковой выдачи", async () => {
  await mainPage.expectProductCardsNotVisible();
});
```

**Стало:**
```typescript
await test.step("Вводим 'во'", async () => {
  await mainPage.searchFor("во");
  
  await test.step("Проверяем отсутствие поисковой выдачи", async () => {
    await mainPage.expectProductCardsNotVisible();
  });
});
```

## 📊 Результаты рефакторинга

### Количественные улучшения:
- **address.spec.ts**: с 93 до 39 строк (-58%)
- **search.spec.ts**: с 137 до 89 строк (-35%)
- **Убрано дублирование**: общие действия вынесены в Page Objects
- **Добавлено 4 Page Object класса** и **1 файл фикстур**

### Качественные улучшения:
- ✅ **Читаемость**: тесты стали понятнее
- ✅ **Поддерживаемость**: изменения UI требуют правок только в Page Objects
- ✅ **Переиспользование**: Page Objects можно использовать в новых тестах
- ✅ **Структура**: правильная вложенность steps
- ✅ **Централизация**: все селекторы в одном месте


## 🏠 Домашнее задание

### Задание 1: Создание нового Page Object
Создайте Page Object для корзины товаров:
1. Создайте файл `pages/CartPage.ts`
2. Добавьте селекторы для:
   - Список товаров в корзине
   - Кнопка "Оформить заказ"
   - Счетчик количества товаров
   - Общая сумма заказа
3. Создайте методы:
   - `addProductToCart(productName: string)`
   - `removeProductFromCart(productName: string)`
   - `getTotalAmount(): Promise<string>`
   - `getProductCount(): Promise<number>`

### Задание 2: Расширение существующих Page Objects
Добавьте в MainPage новые методы:
1. `selectCategory(categoryName: string)` - выбор категории товаров
2. `applyFilter(filterName: string)` - применение фильтра
3. `sortProducts(sortType: string)` - сортировка товаров
4. `expectProductsCount(expectedCount: number)` - проверка количества товаров

### Задание 3: Параметризация тестов
Создайте параметризованный тест для проверки поиска разных категорий:
```typescript
const searchQueries = [
  { query: "молоко", expectedCategory: "Молочные продукты" },
  { query: "хлеб", expectedCategory: "Хлеб и выпечка" },
  { query: "яблоки", expectedCategory: "Фрукты и овощи" }
];

searchQueries.forEach(({ query, expectedCategory }) => {
  test(`Поиск товаров: ${query}`, async ({ mainPage, searchPage }) => {
    // Ваш код теста
  });
});
```