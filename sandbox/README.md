# 🧪 QA Sandbox - Песочница для автоматизации тестирования

**Live Demo:** https://testingit.ru

Интерактивная песочница для практики автоматизации тестирования на Playwright. Содержит 60+ упражнений различной сложности.

---

## 📋 Содержание

### 📝 [Формы и Inputs](./forms.html)
- Простая форма регистрации
- Форма с валидацией
- Динамическая форма с добавлением полей

### 📊 [Таблицы](./tables.html)
- Статическая таблица
- Таблица с сортировкой
- Таблица с фильтрацией
- Таблица с пагинацией

### 🪟 [Модальные окна](./modals.html)
- Простое модальное окно
- Вложенные модальные окна
- Динамические модальные окна

### 🔄 [Drag & Drop](./dragdrop.html)
- Простой Drag & Drop
- Сортировка списка
- Kanban доска

### ⚡ [Динамический контент](./dynamic.html)
- Появление элементов с задержкой
- AJAX загрузка данных
- Infinite Scroll

### 🔔 [Alerts & Dialogs](./alerts.html)
- JavaScript Alert
- Confirm
- Prompt

### 🎛️ [Form Controls](./controls.html)
- Чекбоксы
- Радио кнопки
- Дропдауны (select)
- Загрузка файлов
- Слайдеры и Toggle
- Color Picker

### 🚀 [Продвинутые](./advanced.html)
- Frames & iFrames
- Hovers & Tooltips
- Context Menu (Right Click)
- Multiple Windows & Tabs
- Keyboard Events

### 🎨 [UI Компоненты](./ui.html)
- Accordion
- Tabs
- Carousel
- Autocomplete
- Rating
- OTP / Code Input
- Double Click
- Copy to Clipboard
- Shadow DOM
- Date Picker

### 🎭 [Особые сценарии](./special.html)
- A/B Testing
- Form Authentication
- Broken Images
- Challenging DOM (динамические ID)
- Disappearing Elements
- Entry Ad / Exit Intent
- Floating Menu
- Geolocation
- Notification Messages
- Status Codes
- Typos
- Nested Frames

---

## 🎯 Особенности

- ✅ **60+ упражнений** различной сложности (Easy, Medium, Hard)
- ✅ **data-testid** атрибуты для всех интерактивных элементов
- ✅ **Современный дизайн** с тёмной темой
- ✅ **Адаптивная вёрстка** для всех устройств
- ✅ **Никаких зависимостей** - чистый HTML/CSS/JS
- ✅ **Открытый исходный код** на GitHub

---

## 🚀 Быстрый старт

### Локально

```bash
# Клонируйте репозиторий
git clone https://github.com/ваш-username/qaed.git

# Перейдите в директорию песочницы
cd qaed/sandbox

# Запустите локальный сервер
python3 -m http.server 8080

# Откройте в браузере
open http://localhost:8080
```

### Playwright тесты

```bash
# Установите Playwright
npm install -D @playwright/test

# Пример теста
npx playwright test
```

**Пример теста:**

```typescript
import { test, expect } from '@playwright/test';

test('форма регистрации работает', async ({ page }) => {
  await page.goto('https://testingit.ru/forms.html');
  
  // Заполняем форму
  await page.getByTestId('reg-username').fill('testuser');
  await page.getByTestId('reg-email').fill('test@example.com');
  await page.getByTestId('reg-password').fill('Password123');
  await page.getByTestId('reg-country').selectOption('ru');
  await page.getByTestId('reg-terms').check();
  
  // Отправляем
  await page.getByTestId('reg-submit').click();
  
  // Проверяем результат
  await expect(page.locator('#reg-result')).toBeVisible();
});
```

---

## 📚 Примеры использования

### Python + Pytest

```python
import pytest
from playwright.sync_api import Page, expect

def test_table_sorting(page: Page):
    page.goto("https://testingit.ru/tables.html")
    
    # Кликаем на заголовок для сортировки
    page.get_by_test_id("sort-name").click()
    
    # Проверяем, что таблица отсортирована
    rows = page.locator("#sortable-table tbody tr")
    first_name = rows.nth(0).locator("td").nth(1).text_content()
    assert first_name == "Анна Волкова"
```

### JavaScript + Playwright

```javascript
const { test, expect } = require('@playwright/test');

test('drag and drop работает', async ({ page }) => {
  await page.goto('https://testingit.ru/dragdrop.html');
  
  // Перетаскиваем элемент
  const source = page.getByTestId('drag-item-1');
  const target = page.getByTestId('selected-items');
  
  await source.dragTo(target);
  
  // Проверяем, что элемент переместился
  await expect(target.locator('[data-testid="drag-item-1"]')).toBeVisible();
});
```

---

## 🔧 Технологии

- **HTML5** - семантическая разметка
- **CSS3** - современные стили, анимации
- **JavaScript (ES6+)** - интерактивность
- **No frameworks** - чистый vanilla JS

---

## 🌐 Полезные ссылки

- 📺 **YouTube канал:** https://www.youtube.com/@qabigtech
- 📱 **Telegram канал:** https://t.me/qabigtech
- 💬 **Чат взаимопомощи:** https://t.me/+NT-IOeLALxszN2Zi

---

## 📝 Лицензия

MIT License - используйте свободно для обучения и практики

---

## 👨‍💻 Автор

**Сергей Лебедев | QA**
- Telegram: https://t.me/qabigtech
- GitHub: https://github.com/ваш-username

---

## 🙏 Благодарности

Песочница создана на основе элементов из:
- https://the-internet.herokuapp.com/
- https://demoqa.com/
- https://aqa-proka4.org/sandbox/

---

## 🤝 Вклад

Pull requests приветствуются! Если вы хотите добавить новые упражнения:

1. Fork репозитория
2. Создайте feature branch (`git checkout -b feature/new-exercise`)
3. Commit изменения (`git commit -am 'Add new exercise'`)
4. Push в branch (`git push origin feature/new-exercise`)
5. Создайте Pull Request

---

**Приятной практики! 🚀**

