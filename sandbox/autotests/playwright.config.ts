import { defineConfig, devices } from "@playwright/test";

/**
 * Конфигурация Playwright для проекта QA Sandbox
 * Документация: https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  // Папка с тестами
  testDir: "./tests",

  // Настройка имен скриншотов (убираем платформу darwin/linux)
  snapshotPathTemplate: "{testDir}/{testFile}-snapshots/{arg}{-projectName}{ext}",

  // Таймаут для каждого теста (30 секунд)
  timeout: 30 * 1000,

  // Количество попыток перезапуска упавших тестов
  retries: 1,

  // Количество параллельных воркеров
  workers: 1,

  // Репортеры (отчёты о выполнении)
  reporter: [
    ["html", { outputFolder: "playwright-report" }],
    ["list"], // Вывод в консоль
  ],

  // Настройки для всех тестов
  use: {
    // Базовый URL для тестов - QA Sandbox
    // Можно переопределить через переменную окружения BASE_URL
    baseURL: process.env.BASE_URL || "http://localhost:8000",

    // Записывать trace ВСЕГДА (для обучения)
    // Варианты: 'on' | 'off' | 'retain-on-failure' | 'on-first-retry'
    trace: "on",

    // Скриншот всегда (для обучения)
    screenshot: "on",

    // Видео всегда (для обучения)
    video: "on",

    // Таймаут для action (клик, ввод и т.д.)
    actionTimeout: 10 * 1000,
  },

  // Конфигурация для разных браузеров
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    // Раскомментируй, если нужны другие браузеры
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
  ],

  /* Запуск локального сервера перед тестами */
  webServer: {
    command: "npx http-server .. -p 8000",
    url: "http://localhost:8000",
    reuseExistingServer: !process.env.CI,
    stdout: "pipe",
    stderr: "pipe",
  },
});
