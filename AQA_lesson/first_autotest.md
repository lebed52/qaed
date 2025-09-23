# Конспект: Первый автотест с Playwright

## 📋 Введение

**Playwright** - современный инструмент для автоматизации тестирования веб-приложений:
- Поддерживает все популярные браузеры (Chrome, Firefox, Safari)
- Быстрый и надежный
- Имеет встроенный генератор тестов (codegen)
- Отличная документация и активное сообщество

## 🛠 Установка и настройка Playwright

### Шаг 1: Инициализация проекта
```bash
# Создаем новую папку для проекта
mkdir playwright_project
cd playwright_project

# Инициализируем npm проект
npm init -y
```

### Шаг 2: Установка Playwright
```bash
# Устанавливаем Playwright
npm init playwright@latest

# Или альтернативный способ:
npm install -D @playwright/test
npx playwright install
```

### Шаг 3: Структура проекта после установки
```
playwright_project/
├── tests/                    # Папка с тестами
│   └── example.spec.ts      # Пример теста
├── tests-examples/          # Примеры тестов
├── playwright.config.ts     # Конфигурация Playwright
├── package.json            # Зависимости проекта
└── package-lock.json       # Зафиксированные версии
```

## ⚙️ Конфигурация Playwright

### Основные настройки в `playwright.config.ts`:
```typescript
export default defineConfig({
  testDir: './tests',           // Папка с тестами
  fullyParallel: true,         // Параллельное выполнение
  retries: process.env.CI ? 2 : 0,  // Повторы при падении
  reporter: 'html',            // HTML отчет
  use: {
    trace: 'on-first-retry',   // Трейсы для отладки
  },
  projects: [
    {
      name: 'chromium',        // Тестируем в Chrome
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
```

## 🎯 Генерация первого автотеста с codegen

### Команда для запуска генератора:
```bash
npx playwright codegen https://lavka.yandex.ru/
```

### Что происходит при запуске codegen:
1. **Открывается браузер** с указанным сайтом
2. **Запускается Playwright Inspector** - окно для записи действий
3. **Все ваши действия записываются** в код автоматически
4. **Генерируется готовый тест** на TypeScript

### Пример сгенерированного теста:
```typescript
import { test, expect } from "@playwright/test";

test("Сгенерированый тест", async ({ page }) => {
  // Переходим на сайт
  await page.goto("https://lavka.yandex.ru/");
  
  // Закрываем модальное окно
  await page.getByRole("button", { name: "Закрыть модальное окно" }).click();
  
  // Кликаем в поиск
  await page.getByRole("searchbox", { name: "Поиск" }).click();
  
  // Вводим текст для поиска
  await page.getByRole("searchbox", { name: "Поиск" }).fill("ВОДА");
  
  // Кликаем на товар из результатов
  await page
    .getByRole("link", { name: "Вода Святой источник без газа 1,5 л" })
    .click();
    
  // Проверяем, что попали на страницу товара
  await expect(page.locator("ol")).toContainText("Вода");
  await expect(
    page.getByText("Вода «Святой источник» негазированная 1,5 л")
  ).toBeVisible();
});
```

## 🚀 Запуск тестов

### Основные команды:
```bash
# Запустить все тесты
npx playwright test

# Запустить тесты в режиме отладки
npx playwright test --debug

# Запустить конкретный тест
npx playwright test example.spec.ts

# Открыть HTML отчет
npx playwright show-report
```

## 🔧 Что можно доработать в сгенерированном тесте

### ✅ Рекомендации по улучшению:

#### 1. Добавить структуру с test.step()
```typescript
test("Поиск товара", async ({ page }) => {
  await test.step("Открываем главную страницу", async () => {
    await page.goto("https://lavka.yandex.ru/");
  });
  
  await test.step("Закрываем модальное окно", async () => {
    await page.getByRole("button", { name: "Закрыть модальное окно" }).click();
  });
  
  await test.step("Выполняем поиск товара", async () => {
    await page.getByRole("searchbox", { name: "Поиск" }).click();
    await page.getByRole("searchbox", { name: "Поиск" }).fill("ВОДА");
  });
  
  await test.step("Проверяем результаты поиска", async () => {
    await expect(page.locator("ol")).toContainText("Вода");
  });
});
```

#### 2. Использовать более надежные селекторы
```typescript
// Лучше использовать data-testid
await page.locator('[data-testid="search-input"]').fill("ВОДА");

// Или CSS селекторы
await page.locator('.search-input').fill("ВОДА");

// Или XPath для сложных случаев
await page.locator('//input[@placeholder="Поиск"]').fill("ВОДА");
```

#### 3. Параметризовать тестовые данные
```typescript
const testData = {
  searchQuery: "ВОДА",
  expectedProduct: "Вода Святой источник",
  baseUrl: "https://lavka.yandex.ru/"
};

test("Поиск товара", async ({ page }) => {
  await page.goto(testData.baseUrl);
  await page.fill('[data-testid="search"]', testData.searchQuery);
  await expect(page.locator("h1")).toContainText(testData.expectedProduct);
});
```

#### 4. Создать Page Object Model
```typescript
// pages/MainPage.ts
export class MainPage {
  constructor(private page: Page) {}
  
  async goto() {
    await this.page.goto("https://lavka.yandex.ru/");
  }
  
  async closeModal() {
    await this.page.getByRole("button", { name: "Закрыть модальное окно" }).click();
  }
  
  async search(query: string) {
    await this.page.getByRole("searchbox", { name: "Поиск" }).fill(query);
  }
}

// В тесте
test("Поиск товара", async ({ page }) => {
  const mainPage = new MainPage(page);
  await mainPage.goto();
  await mainPage.closeModal();
  await mainPage.search("ВОДА");
});
```

## 🏠 Домашнее задание

### Задание 1: Улучшить существующий тест
Возьмите сгенерированный тест и примените к нему рекомендации:
- Добавьте test.step()
- Улучшите селекторы
- Добавьте явные ожидания

### Задание 2: Создать новый тест
Создайте тест для проверки:
- Добавления товара в корзину
- Перехода в корзину
- Проверки, что товар добавился

### Задание 3: Параметризация
Создайте тест, который проверяет поиск для разных категорий товаров:
- Молочные продукты
- Хлеб и выпечка
- Фрукты и овощи

---
