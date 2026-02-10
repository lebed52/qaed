# Playwright: Работа с размером окна, скроллом и свайпами

Руководство по управлению viewport, скроллингу и жестам в Playwright тестах.

---

## 📐 Управление размером окна (Viewport)

### Получение текущего размера

```typescript
const currentViewport = page.viewportSize();
const width = currentViewport?.width || 1920;
const height = currentViewport?.height || 1080;
```

### Установка размера окна

```typescript
// Базовый синтаксис
await page.setViewportSize({ width: 1920, height: 1080 });

// Сохранение оригинальной высоты при изменении ширины
const originalHeight = page.viewportSize()?.height || 1080;
await page.setViewportSize({ width: 900, height: originalHeight });
```

### Типичные разрешения

```typescript
// Desktop
await page.setViewportSize({ width: 1920, height: 1080 }); // Full HD
await page.setViewportSize({ width: 1366, height: 768 });  // Laptop
await page.setViewportSize({ width: 1280, height: 720 });  // HD

// Tablet
await page.setViewportSize({ width: 768, height: 1024 });  // iPad Portrait
await page.setViewportSize({ width: 1024, height: 768 });  // iPad Landscape

// Mobile
await page.setViewportSize({ width: 375, height: 667 });   // iPhone SE
await page.setViewportSize({ width: 414, height: 896 });   // iPhone XR
```

### Проверка адаптивности

```typescript
test('Адаптивный дизайн', async ({ page }) => {
    const originalHeight = page.viewportSize()?.height || 1080;
    
    // Широкий экран - 5 колонок
    await page.setViewportSize({ width: 1920, height: originalHeight });
    await page.waitForFunction(() => {
        const grid = document.querySelector('.responsive-grid');
        if (!grid) return false;
        const styles = window.getComputedStyle(grid);
        return styles.getPropertyValue('--grid-columns').trim() === '5';
    });
    
    // Средний экран - 4 колонки
    await page.setViewportSize({ width: 900, height: originalHeight });
    await page.waitForFunction(() => {
        const grid = document.querySelector('.responsive-grid');
        if (!grid) return false;
        const styles = window.getComputedStyle(grid);
        return styles.getPropertyValue('--grid-columns').trim() === '4';
    });
});
```

---

## 🖱️ Скроллинг страницы

### Скролл колесом мыши

```typescript
// Скролл вниз на 1500 пикселей
await page.mouse.wheel(0, 1500);

// Скролл вверх
await page.mouse.wheel(0, -1500);

// Горизонтальный скролл вправо
await page.mouse.wheel(1500, 0);
```

### Скролл к элементу

```typescript
const element = page.locator('.target-element');

// Прокрутить элемент в видимую область
await element.scrollIntoViewIfNeeded();

// Альтернатива через evaluate
await element.evaluate(el => el.scrollIntoView());

// С параметрами выравнивания
await element.evaluate(el => el.scrollIntoView({ 
    behavior: 'smooth', 
    block: 'center' 
}));
```

### Скролл до конца страницы

```typescript
// До низа страницы
await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

// До верха страницы
await page.evaluate(() => window.scrollTo(0, 0));

// До определенной позиции
await page.evaluate(() => window.scrollTo(0, 1000));
```

### Скролл внутри контейнера

```typescript
const scrollableContainer = page.locator('.scrollable-container');

// Скролл внутри элемента
await scrollableContainer.evaluate(el => {
    el.scrollTop = 500;
});

// Скролл до конца контейнера
await scrollableContainer.evaluate(el => {
    el.scrollTop = el.scrollHeight;
});
```

### Ожидание подгрузки контента при скролле

```typescript
test('Бесконечный скролл', async ({ page }) => {
    const items = page.locator('.list-item');
    const initialItemsCount = await items.count();
    
    // Скроллим
    await page.mouse.wheel(0, 1500);
    
    // Ждем подгрузки новых элементов
    await page.waitForFunction(
        initialCount => {
            const currentItems = document.querySelectorAll('.list-item');
            return currentItems.length > initialCount;
        },
        initialItemsCount
    );
    
    const newItemsCount = await items.count();
    expect(newItemsCount).toBeGreaterThan(initialItemsCount);
});
```

### Проверка наличия скролла

```typescript
// Проверка вертикального скролла
const hasVerticalScroll = await page.evaluate(() => {
    return document.body.scrollHeight > document.body.clientHeight;
});

// Проверка горизонтального скролла
const hasHorizontalScroll = await page.evaluate(() => {
    return document.body.scrollWidth > document.body.clientWidth;
});

expect(hasHorizontalScroll, 'Нет горизонтального скролла').toBe(false);
```

---

## 👆 Свайпы (Touch gestures)

### Базовый свайп

```typescript
// Свайп вправо
await page.touchscreen.tap(100, 300);
await page.touchscreen.swipe({ x: 100, y: 300 }, { x: 400, y: 300 });

// Свайп влево
await page.touchscreen.swipe({ x: 400, y: 300 }, { x: 100, y: 300 });

// Свайп вверх
await page.touchscreen.swipe({ x: 200, y: 500 }, { x: 200, y: 200 });

// Свайп вниз
await page.touchscreen.swipe({ x: 200, y: 200 }, { x: 200, y: 500 });
```

### Свайп на элементе

```typescript
const carousel = page.locator('.carousel');

// Получаем координаты элемента
const box = await carousel.boundingBox();
if (box) {
    const startX = box.x + box.width * 0.8;  // 80% от левого края
    const endX = box.x + box.width * 0.2;    // 20% от левого края
    const y = box.y + box.height / 2;        // Середина по высоте
    
    // Свайп влево на карусели
    await page.touchscreen.swipe({ x: startX, y }, { x: endX, y });
}
```

### Использование кастомной фикстуры swipe

Если в проекте есть кастомная фикстура для свайпов:

```typescript
import { test } from '@/fixtures/test';

test('Свайп в карусели', async ({ page, swipe }) => {
    const carousel = page.locator('.carousel');
    
    // Свайп влево
    await swipe(carousel, 'left');
    
    // Свайп вправо
    await swipe(carousel, 'right');
    
    // Свайп вверх
    await swipe(carousel, 'up');
    
    // Свайп вниз
    await swipe(carousel, 'down');
});
```

### Длинный свайп (для прокрутки)

```typescript
async function longSwipe(page: Page, direction: 'up' | 'down') {
    const viewport = page.viewportSize();
    if (!viewport) return;
    
    const centerX = viewport.width / 2;
    const startY = direction === 'up' ? viewport.height * 0.8 : viewport.height * 0.2;
    const endY = direction === 'up' ? viewport.height * 0.2 : viewport.height * 0.8;
    
    await page.touchscreen.swipe(
        { x: centerX, y: startY },
        { x: centerX, y: endY }
    );
}

// Использование
await longSwipe(page, 'up');   // Скролл вверх
await longSwipe(page, 'down'); // Скролл вниз
```

---

## 🔍 Zoom (Увеличение/Уменьшение)

### Эмуляция zoom через deviceScaleFactor

```typescript
// При создании контекста
const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 2, // 200% zoom
});

// Или в конфигурации проекта
export default defineConfig({
    projects: [
        {
            name: 'desktop-zoomed',
            use: {
                viewport: { width: 1920, height: 1080 },
                deviceScaleFactor: 1.5, // 150% zoom
            },
        },
    ],
});
```

### Изменение zoom через CSS

```typescript
// Установить zoom для body
await page.evaluate(() => {
    document.body.style.zoom = '1.5'; // 150%
});

// Установить zoom для конкретного элемента
await page.locator('.content').evaluate(el => {
    (el as HTMLElement).style.zoom = '0.8'; // 80%
});
```

### Pinch-to-zoom (жест двумя пальцами)

```typescript
// Эмуляция pinch-to-zoom
async function pinchZoom(page: Page, scale: number) {
    await page.evaluate((scaleValue) => {
        const event = new WheelEvent('wheel', {
            deltaY: scaleValue > 1 ? -100 : 100,
            ctrlKey: true,
            bubbles: true,
        });
        document.dispatchEvent(event);
    }, scale);
}

// Увеличить
await pinchZoom(page, 1.5);

// Уменьшить
await pinchZoom(page, 0.8);
```

---

## 🎯 Практические примеры

### Пример 1: Тест адаптивной сетки с ресайзом

```typescript
test('Адаптивная сетка при изменении размера окна', async ({ page }) => {
    await page.goto('/products');
    
    const originalHeight = page.viewportSize()?.height || 1080;
    const gridContainer = page.locator('.product-grid');
    const grid = page.locator('.grid-layout');
    
    // Шаг 1: Широкий экран
    await page.setViewportSize({ width: 1920, height: originalHeight });
    await expect(gridContainer).toBeVisible();
    
    const columnsWide = await grid.evaluate(el => {
        const styles = window.getComputedStyle(el);
        return styles.getPropertyValue('--grid-columns').trim();
    });
    expect(columnsWide).toBe('5');
    
    // Шаг 2: Сузить окно
    await page.setViewportSize({ width: 900, height: originalHeight });
    await page.waitForFunction(() => {
        const grid = document.querySelector('.grid-layout');
        if (!grid) return false;
        const styles = window.getComputedStyle(grid);
        return styles.getPropertyValue('--grid-columns').trim() === '4';
    });
    
    // Проверка отсутствия горизонтального скролла
    const hasHorizontalScroll = await page.evaluate(() => {
        return document.body.scrollWidth > document.body.clientWidth;
    });
    expect(hasHorizontalScroll).toBe(false);
});
```

### Пример 2: Бесконечный скролл с подгрузкой

```typescript
test('Бесконечный скролл списка товаров', async ({ page }) => {
    await page.goto('/catalog');
    
    const products = page.locator('.product-card');
    const initialCount = await products.count();
    
    // Скроллим несколько раз
    for (let i = 0; i < 3; i++) {
        const currentCount = await products.count();
        
        // Скролл вниз
        await page.mouse.wheel(0, 1500);
        
        // Ждем подгрузки
        await page.waitForFunction(
            count => {
                const items = document.querySelectorAll('.product-card');
                return items.length > count;
            },
            currentCount,
            { timeout: 10000 }
        );
        
        // Небольшая пауза между скроллами
        await page.waitForTimeout(500);
    }
    
    const finalCount = await products.count();
    expect(finalCount).toBeGreaterThan(initialCount);
});
```

### Пример 3: Свайп в карусели

```typescript
test('Свайп по карусели изображений', async ({ page }) => {
    await page.goto('/gallery');
    
    const carousel = page.locator('.image-carousel');
    const images = carousel.locator('.carousel-item');
    
    // Получаем первое видимое изображение
    const firstImage = await images.first().getAttribute('data-image-id');
    
    // Свайп влево
    const box = await carousel.boundingBox();
    if (box) {
        await page.touchscreen.swipe(
            { x: box.x + box.width * 0.8, y: box.y + box.height / 2 },
            { x: box.x + box.width * 0.2, y: box.y + box.height / 2 }
        );
    }
    
    // Ждем анимации
    await page.waitForTimeout(500);
    
    // Проверяем, что первое изображение изменилось
    const newFirstImage = await images.first().getAttribute('data-image-id');
    expect(newFirstImage).not.toBe(firstImage);
});
```

### Пример 4: Проверка ширины элементов после ресайза

```typescript
test('Ширина контейнеров совпадает после ресайза', async ({ page }) => {
    await page.goto('/dashboard');
    
    const contentContainer = page.locator('.content-wrapper');
    const sidebarContainer = page.locator('.sidebar-wrapper');
    
    // Увеличиваем окно
    await page.setViewportSize({ width: 2560, height: 1080 });
    
    // Ждем перестроения layout
    await page.waitForTimeout(300);
    
    // Получаем ширины
    const contentWidth = await contentContainer.evaluate(el => (el as HTMLElement).offsetWidth);
    const sidebarWidth = await sidebarContainer.evaluate(el => (el as HTMLElement).offsetWidth);
    
    // Проверяем, что общая ширина соответствует viewport
    const totalWidth = contentWidth + sidebarWidth;
    const viewportWidth = page.viewportSize()?.width || 0;
    const widthDifference = Math.abs(totalWidth - viewportWidth);
    expect(widthDifference).toBeLessThan(10);
});
```

---

## ⚠️ Важные замечания

### 1. Ожидание после ресайза

После изменения размера окна дайте время на перестроение layout:

```typescript
await page.setViewportSize({ width: 900, height: 1080 });
await page.waitForTimeout(300); // Или используйте waitForFunction
```

### 2. Проверка элемента перед использованием

В `page.waitForFunction()` всегда проверяйте существование элемента:

```typescript
await page.waitForFunction(() => {
    const element = document.querySelector('.target');
    if (!element) {
        return false; // Продолжаем ждать
    }
    // Работаем с element
    return true;
});
```

### 3. Сохранение оригинальных размеров

Сохраняйте оригинальные размеры для восстановления:

```typescript
const originalViewport = page.viewportSize();
// ... тесты с изменением размера ...
if (originalViewport) {
    await page.setViewportSize(originalViewport);
}
```

### 4. Touch vs Mouse

Для мобильных тестов используйте `touchscreen`, для desktop — `mouse`:

```typescript
// Desktop
await page.mouse.wheel(0, 1500);

// Mobile
await page.touchscreen.swipe({ x: 200, y: 500 }, { x: 200, y: 200 });
```

---

## 📚 Полезные ссылки

- [Playwright Viewport API](https://playwright.dev/docs/api/class-page#page-set-viewport-size)
- [Playwright Mouse API](https://playwright.dev/docs/api/class-mouse)
- [Playwright Touchscreen API](https://playwright.dev/docs/api/class-touchscreen)
- [Emulation Guide](https://playwright.dev/docs/emulation)
