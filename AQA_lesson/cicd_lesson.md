# Урок: Настройка CI/CD для автотестов (Playwright + GitHub Actions)

В этом уроке мы разберем, как превратить локальные автотесты в полноценный процесс непрерывной интеграции (CI), с какими "подводными камнями" мы столкнулись на практике и как их избежать.

---

## 1. Что такое CI/CD?

**CI (Continuous Integration)** — Непрерывная интеграция. Это практика автоматического запуска тестов при каждом изменении кода (`git push`). Если тест упал — мы узнаем об этом сразу, а не перед релизом.

**CD (Continuous Deployment/Delivery)** — Непрерывная доставка. Автоматизация процесса деплоя (публикации) приложения после успешного прохождения всех тестов.

---

## 2. Как настроить GitHub Actions

GitHub Actions — это инструмент, который позволяет запускать скрипты на серверах GitHub.

### Шаг 1: Создание Workflow файла
В корне проекта создается папка `.github/workflows/`, а в ней файл (например, `playwright.yml`).

### Пример конфигурации:
```yaml
name: Playwright Tests
on:
  push:
    branches: [ main, master ]
  pull_request:
    branches: [ main, master ]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: lts/*
      - name: Install dependencies
        run: npm ci
        working_directory: path/to/tests
      - name: Install Playwright Browsers
        run: npx playwright install --with-deps
        working_directory: path/to/tests
      - name: Run Playwright tests
        run: npx playwright test
        working_directory: path/to/tests
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report
          path: path/to/tests/playwright-report/
```

---

## 3. Проблемы, с которыми мы столкнулись (Наш опыт)

### ❌ Проблема №1: Рассинхрон lock-файла
**Ошибка:** `npm error code EUSAGE ... npm ci can only install packages when your package.json and package-lock.json are in sync`.
**Почему:** Ручная правка ссылок в `package-lock.json` нарушает его целостность.
**Решение:** Всегда обновляйте зависимости через `npm install`, а не вручную в текстовом редакторе.

### ❌ Проблема №2: Сайт недоступен в CI
**Ошибка:** Тесты падают, так как пытаются открыться по адресу `localhost`, которого в облаке нет.
**Решение:** Настройка `webServer` в `playwright.config.ts`. Playwright сам поднимет ваш сайт перед тестами:
```typescript
webServer: {
  command: 'npx http-server .. -p 8000',
  url: 'http://localhost:8000',
  reuseExistingServer: !process.env.CI,
}
```

### ❌ Проблема №3: Разница в скриншотах (Darwin vs Linux)
**Ошибка:** Скриншоты, сделанные на Mac (Darwin), не совпадают с Linux.
**Почему:** Разный рендеринг шрифтов, теней и сглаживания.
**Решение:**
1. Унифицировать имена файлов в `playwright.config.ts`, убрав суффикс платформы:
   `snapshotPathTemplate: "{testDir}/{testFileName}-snapshots/{arg}{-projectName}{ext}"`
2. Добавить допустимый порог расхождения:
   `maxDiffPixelRatio: 0.05` (разрешить до 5% отличий).

---

## 4. Советы и предостережения

1. **Проверяйте .gitignore**: Часто скриншоты (`*.png`) добавлены в игнор. Используйте `!tests/**/*-snapshots/*.png`, чтобы разрешить хранение эталонных скриншотов в Git.
2. **Используйте `npm ci` вместо `npm install` в CI**: Это гарантирует установку именно тех версий, которые зафиксированы в lock-файле.
3. **Артефакты**: Всегда настраивайте `upload-artifact` для папки с отчетами. Если тест упадет в CI, отчет — это единственный способ увидеть скриншоты и трейсы ошибки.
4. **Обновление скриншотов**: Если вы намеренно изменили дизайн, используйте `npx playwright test --update-snapshots` локально, а затем запушьте обновленные файлы.

---

**Поздравляем!** Теперь ваши тесты — это не просто скрипты на компьютере, а надежный страж качества вашего проекта в облаке!
