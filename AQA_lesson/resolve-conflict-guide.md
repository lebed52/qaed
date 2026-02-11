# Подробный гайд по решению конфликтов в коде для автоматизаторов

## Содержание
1. [Что такое конфликты и почему они возникают](#что-такое-конфликты)
2. [Типичные сценарии конфликтов в автоматизации](#типичные-сценарии)
3. [Решение конфликтов в Visual Studio](#решение-в-vs)
4. [Продвинутые техники](#продвинутые-техники)
5. [Лайфхак: решение через AI-агента](#ai-агент)
6. [Профилактика конфликтов](#профилактика)

---

## Что такое конфликты и почему они возникают {#что-такое-конфликты}

### Механизм возникновения конфликта

```
Исходное состояние (main):
─────────────────────────
public void Login(string user, string pass)
{
    driver.FindElement(By.Id("username")).SendKeys(user);
}

Ветка feature-1 (Разработчик А):        Ветка feature-2 (Разработчик Б):
────────────────────────────────        ────────────────────────────────
public void Login(string user,          public async Task LoginAsync(
    string pass, bool remember)              string user, string pass)
{                                       {
    driver.FindElement(                     await Task.Run(() =>
        By.CssSelector("#user"))                driver.FindElement(
        .SendKeys(user);                            By.XPath("//input[@id='user']"))
}                                                   .SendKeys(user));
                                        }

                    ↓ При слиянии ↓
                    
            ⚠️ КОНФЛИКТ! Git не знает:
            - Какую сигнатуру метода использовать?
            - Какой локатор правильный?
            - Нужна ли асинхронность?
```

### Типы конфликтов в автоматизации тестов

| Тип конфликта | Пример | Сложность |
|--------------|--------|-----------|
| **Локаторы** | Разные селекторы для одного элемента | 🟡 Средняя |
| **Page Objects** | Изменение структуры классов | 🔴 Высокая |
| **Конфигурации** | appsettings.json, .env файлы | 🟢 Низкая |
| **Test Data** | JSON/XML с тестовыми данными | 🟡 Средняя |
| **Framework код** | Base классы, утилиты | 🔴 Высокая |

---

## Типичные сценарии конфликтов в автоматизации {#типичные-сценарии}

### Сценарий 1: Конфликт в Page Object

```csharp
// <<<<<<< HEAD (ваши изменения)
public class LoginPage : BasePage
{
    private By UsernameField => By.CssSelector("[data-testid='username']");
    private By PasswordField => By.CssSelector("[data-testid='password']");
    private By LoginButton => By.CssSelector("[data-testid='login-btn']");
    
    public void Login(string username, string password)
    {
        EnterText(UsernameField, username);
        EnterText(PasswordField, password);
        Click(LoginButton);
    }
}
// =======
public class LoginPage : BasePage
{
    private readonly By _usernameInput = By.Id("username");
    private readonly By _passwordInput = By.Id("password");  
    private readonly By _submitButton = By.XPath("//button[@type='submit']");
    
    public HomePage PerformLogin(string user, string pass)
    {
        Driver.FindElement(_usernameInput).SendKeys(user);
        Driver.FindElement(_passwordInput).SendKeys(pass);
        Driver.FindElement(_submitButton).Click();
        return new HomePage(Driver);
    }
}
// >>>>>>> feature/new-login-flow
```

### Сценарий 2: Конфликт в конфигурации

```json
// <<<<<<< HEAD
{
  "BaseUrl": "https://staging.example.com",
  "Browser": "Chrome",
  "Timeout": 30,
  "Headless": false
}
// =======
{
  "BaseUrl": "https://dev.example.com",
  "Browser": "Firefox",
  "ImplicitWait": 10,
  "Screenshots": true
}
// >>>>>>> feature/firefox-support
```

---

## Решение конфликтов в Visual Studio {#решение-в-vs}

### Шаг 1: Обнаружение конфликта

После выполнения `git pull` или `git merge`:

```bash
git pull origin main
# Auto-merging Tests/Pages/LoginPage.cs
# CONFLICT (content): Merge conflict in Tests/Pages/LoginPage.cs
# Automatic merge failed; fix conflicts and then commit the result.
```

### Шаг 2: Открытие Merge Editor в Visual Studio

```
┌─────────────────────────────────────────────────────────────────────┐
│  Visual Studio 2022                                                  │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  Git Changes (Ctrl+0, Ctrl+G)                                       │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │ 📁 Merge in Progress                                          │  │
│  │                                                                │  │
│  │ ⚠️ Unmerged Changes (2)                                       │  │
│  │   └── 📄 LoginPage.cs          [Щелкните правой кнопкой]     │  │
│  │   └── 📄 appsettings.json      ────────────────────────────  │  │
│  │                                 │ Open Merge Editor...    │  │  │
│  │                                 │ Take Current (HEAD)     │  │  │
│  │                                 │ Take Incoming           │  │  │
│  │                                 │ Compare with Base       │  │  │
│  │                                 └─────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

### Шаг 3: Работа в Merge Editor

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ Merge: LoginPage.cs                                                    [X]  │
├────────────────────────────┬────────────────────────────────────────────────┤
│   INCOMING (main)          │    CURRENT (your branch)                       │
│   Левая панель             │    Правая панель                               │
├────────────────────────────┴────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────┐    ┌─────────────────────────────────────────┐ │
│  │ ☑️ Checkbox для выбора  │    │ ☑️ Checkbox для выбора                  │ │
│  │                         │    │                                         │ │
│  │ public class LoginPage  │    │ public class LoginPage : BasePage      │ │
│  │ {                       │    │ {                                       │ │
│  │   private readonly By   │    │   private By UsernameField =>          │ │
│  │     _usernameInput =    │    │     By.CssSelector(                    │ │
│  │     By.Id("username");  │    │       "[data-testid='username']");     │ │
│  │                         │    │                                         │ │
│  └─────────────────────────┘    └─────────────────────────────────────────┘ │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│   RESULT (нижняя панель) - здесь формируется итоговый код                   │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ public class LoginPage : BasePage  // Можно редактировать вручную     │  │
│  │ {                                                                     │  │
│  │     // Ваш объединённый код                                          │  │
│  │ }                                                                     │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  [Accept Merge]  [Cancel]                                                   │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Шаг 4: Стратегии выбора

#### Кнопки быстрого выбора:

```
┌────────────────────────────────────────────────────────────────────┐
│  Toolbar в Merge Editor:                                           │
│                                                                    │
│  [Take Incoming] - Взять версию из main (левая панель)            │
│  [Take Current]  - Оставить вашу версию (правая панель)           │
│  [Take Both]     - Объединить оба варианта                        │
│                                                                    │
│  Для каждого конфликтного блока:                                  │
│  ☑️ Отметить чекбокс слева  = включить в результат                │
│  ☑️ Отметить чекбокс справа = включить в результат                │
│  ☑️☑️ Отметить оба         = объединить (порядок настраивается)   │
└────────────────────────────────────────────────────────────────────┘
```

### Шаг 5: Практический пример решения

**Исходный конфликт:**
```csharp
// Incoming (main) - коллега добавил async
public async Task<bool> LoginAsync(string user, string pass)
{
    await _usernameField.SendKeysAsync(user);
    await _passwordField.SendKeysAsync(pass);
    await _loginButton.ClickAsync();
    return await IsLoggedInAsync();
}

// Current (ваша ветка) - вы добавили remember me
public void Login(string user, string pass, bool rememberMe = false)
{
    _usernameField.SendKeys(user);
    _passwordField.SendKeys(pass);
    if (rememberMe) _rememberCheckbox.Click();
    _loginButton.Click();
}
```

**Правильное решение (редактируем Result вручную):**
```csharp
public async Task<bool> LoginAsync(
    string user, 
    string pass, 
    bool rememberMe = false)  // Объединяем: async + remember me
{
    await _usernameField.SendKeysAsync(user);
    await _passwordField.SendKeysAsync(pass);
    
    if (rememberMe)
    {
        await _rememberCheckbox.ClickAsync();  // Добавляем async версию
    }
    
    await _loginButton.ClickAsync();
    return await IsLoggedInAsync();
}

// Оставляем синхронную версию для обратной совместимости
[Obsolete("Use LoginAsync instead")]
public void Login(string user, string pass, bool rememberMe = false)
{
    LoginAsync(user, pass, rememberMe).GetAwaiter().GetResult();
}
```

### Шаг 6: Завершение merge

```
Git Changes панель:

┌───────────────────────────────────────────────────────────────┐
│ Staged Changes (2)                                            │
│   ✅ LoginPage.cs                                             │
│   ✅ appsettings.json                                         │
│                                                               │
│ Commit Message:                                               │
│ ┌───────────────────────────────────────────────────────────┐ │
│ │ Merge branch 'main' into feature/remember-me              │ │
│ │                                                           │ │
│ │ Resolved conflicts:                                       │ │
│ │ - LoginPage.cs: Combined async pattern with rememberMe   │ │
│ │ - appsettings.json: Merged configuration options         │ │
│ └───────────────────────────────────────────────────────────┘ │
│                                                               │
│ [Commit Staged]                                               │
└───────────────────────────────────────────────────────────────┘
```

---

## Продвинутые техники {#продвинутые-техники}

### Git команды для сложных случаев

```bash
# Посмотреть все конфликтные файлы
git diff --name-only --diff-filter=U

# Посмотреть базовую версию (до изменений обоих)
git show :1:Tests/Pages/LoginPage.cs > base.cs
git show :2:Tests/Pages/LoginPage.cs > ours.cs  
git show :3:Tests/Pages/LoginPage.cs > theirs.cs

# Отменить merge и начать заново
git merge --abort

# Принять все изменения из определённой ветки
git checkout --ours Tests/Pages/LoginPage.cs   # Ваша версия
git checkout --theirs Tests/Pages/LoginPage.cs # Их версия

# Интерактивный rebase для "чистой" истории
git rebase -i main
```

### Настройка Visual Studio для лучшего diff

```
Tools → Options → Source Control → Git Global Settings

┌─────────────────────────────────────────────────────────────┐
│ Diff & Merge Tools                                          │
│                                                             │
│ Diff Tool:  [Visual Studio]  ▼                             │
│ Merge Tool: [Visual Studio]  ▼                             │
│                                                             │
│ ☑️ Enable Git Line-staging                                  │
│ ☑️ Enable push --force-with-lease                          │
│ ☑️ Prune remote branches during fetch                      │
│                                                             │
│ Default merge strategy: [Recursive] ▼                      │
└─────────────────────────────────────────────────────────────┘
```

---

## Лайфхак: решение через AI-агента {#ai-агент}

### Способ 1: Интеграция GitHub Copilot Chat

```
┌─────────────────────────────────────────────────────────────────────┐
│ Visual Studio 2022 → View → GitHub Copilot Chat                     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  💬 Copilot Chat                                              [X]   │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │                                                               │  │
│  │  You: Resolve this merge conflict. Keep async pattern from   │  │
│  │       incoming, but add rememberMe parameter from current:   │  │
│  │                                                               │  │
│  │  ```csharp                                                    │  │
│  │  <<<<<<< HEAD                                                 │  │
│  │  public async Task<bool> LoginAsync(string user, string pass) │  │
│  │  =======                                                      │  │
│  │  public void Login(string user, string pass, bool rememberMe) │  │
│  │  >>>>>>> feature/remember-me                                  │  │
│  │  ```                                                          │  │
│  │                                                               │  │
│  │  🤖 Copilot: Here's the resolved version combining both:     │  │
│  │                                                               │  │
│  │  ```csharp                                                    │  │
│  │  public async Task<bool> LoginAsync(                          │  │
│  │      string user,                                             │  │
│  │      string pass,                                             │  │
│  │      bool rememberMe = false)                                 │  │
│  │  {                                                            │  │
│  │      // Implementation combining both changes...              │  │
│  │  }                                                            │  │
│  │  ```                                                          │  │
│  │                                                               │  │
│  │  [Copy] [Insert at Cursor] [Apply to File]                   │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  [Message Copilot...                                          📤]  │
└─────────────────────────────────────────────────────────────────────┘
```

### Способ 2: Скрипт автоматического резолва через Claude API

```python
# merge_resolver.py
import anthropic
import subprocess
import re
from pathlib import Path

class AIConflictResolver:
    def __init__(self):
        self.client = anthropic.Anthropic()
        self.model = "claude-sonnet-4-20250514"
    
    def find_conflicts(self) -> list[Path]:
        """Находит все файлы с конфликтами"""
        result = subprocess.run(
            ["git", "diff", "--name-only", "--diff-filter=U"],
            capture_output=True, text=True
        )
        return [Path(f) for f in result.stdout.strip().split('\n') if f]
    
    def extract_conflict_blocks(self, content: str) -> list[dict]:
        """Извлекает блоки конфликтов из файла"""
        pattern = r'<<<<<<< (.*?)\n(.*?)=======\n(.*?)>>>>>>> (.*?)\n'
        matches = re.findall(pattern, content, re.DOTALL)
        
        return [{
            'ours_branch': m[0],
            'ours_code': m[1],
            'theirs_code': m[2],
            'theirs_branch': m[3]
        } for m in matches]
    
    def resolve_with_ai(self, file_path: Path, context: str = "") -> str:
        """Отправляет конфликт на разрешение AI"""
        content = file_path.read_text()
        conflicts = self.extract_conflict_blocks(content)
        
        prompt = f"""You are an expert test automation engineer. 
Resolve the following Git merge conflict in a C# test automation file.

File: {file_path.name}
Context: {context or 'Selenium/Playwright test automation framework'}

CONFLICT CONTENT:
```
{content}
```

RULES FOR RESOLUTION:
1. Preserve all functionality from both versions
2. Follow C# best practices and naming conventions
3. Keep the code DRY - don't duplicate logic
4. If there are conflicting locators, prefer data-testid > CSS > XPath > ID
5. Maintain backward compatibility where possible
6. Add [Obsolete] attribute if deprecating methods

Return ONLY the resolved file content, no explanations."""

        response = self.client.messages.create(
            model=self.model,
            max_tokens=4096,
            messages=[{"role": "user", "content": prompt}]
        )
        
        return response.content[0].text
    
    def resolve_all_conflicts(self, auto_commit: bool = False):
        """Разрешает все конфликты в репозитории"""
        conflicts = self.find_conflicts()
        
        if not conflicts:
            print("✅ No conflicts found!")
            return
        
        print(f"🔍 Found {len(conflicts)} files with conflicts")
        
        for file_path in conflicts:
            print(f"\n📄 Resolving: {file_path}")
            
            try:
                resolved = self.resolve_with_ai(file_path)
                
                # Создаём backup
                backup_path = file_path.with_suffix(file_path.suffix + '.backup')
                backup_path.write_text(file_path.read_text())
                
                # Записываем разрешённый код
                file_path.write_text(resolved)
                
                print(f"   ✅ Resolved! Backup: {backup_path}")
                
                # Показываем diff для review
                subprocess.run(["git", "diff", str(file_path)])
                
                if auto_commit:
                    subprocess.run(["git", "add", str(file_path)])
                    
            except Exception as e:
                print(f"   ❌ Error: {e}")
        
        if auto_commit:
            subprocess.run([
                "git", "commit", "-m", 
                "AI-assisted merge conflict resolution"
            ])
            print("\n✅ All conflicts resolved and committed!")

# Использование
if __name__ == "__main__":
    resolver = AIConflictResolver()
    resolver.resolve_all_conflicts(auto_commit=False)  # False для review
```

### Способ 3: VS Code Extension + Claude

Создайте Task в VS Code:

```json
// .vscode/tasks.json
{
    "version": "2.0.0",
    "tasks": [
        {
            "label": "AI Resolve Conflict",
            "type": "shell",
            "command": "python",
            "args": [
                "${workspaceFolder}/tools/merge_resolver.py",
                "--file", "${file}"
            ],
            "problemMatcher": [],
            "presentation": {
                "echo": true,
                "reveal": "always",
                "focus": false,
                "panel": "shared"
            }
        }
    ]
}
```

### Способ 4: Git Hooks с AI

```bash
#!/bin/bash
# .git/hooks/prepare-commit-msg

# Проверяем, это merge commit?
if [ -f .git/MERGE_HEAD ]; then
    # Получаем список конфликтов
    CONFLICTS=$(git diff --name-only --diff-filter=U)
    
    if [ -n "$CONFLICTS" ]; then
        echo "🤖 AI Merge Assistant detected conflicts:"
        echo "$CONFLICTS"
        echo ""
        echo "Running AI resolver..."
        
        python tools/merge_resolver.py --interactive
    fi
fi
```

### Способ 5: Промпт-шаблон для ручного использования

```markdown
# Скопируйте в Claude/ChatGPT/Copilot:

## Контекст
Я работаю над автоматизацией тестов на C# + Selenium/Playwright.
Нужно разрешить конфликт слияния.

## Конфликтный файл
```
[Вставьте содержимое файла с маркерами конфликта]
```

## Требования к решению
1. Объединить функциональность обеих версий
2. Использовать приоритет локаторов: data-testid > CSS > XPath
3. Сохранить async/await если есть хотя бы в одной версии
4. Добавить XML-документацию к публичным методам
5. Следовать паттерну Page Object

## Дополнительный контекст
- Наш фреймворк: [NUnit/xUnit/MSTest]
- Версия .NET: [6/7/8]
- Есть базовый класс: BasePage с методами Click(), EnterText()

Верни только разрешённый код без объяснений.
```

### Пример реального диалога с AI

```
👤 User:
Resolve this Selenium Page Object conflict. We're using .NET 8 and NUnit.

<<<<<<< HEAD
public class CheckoutPage : BasePage
{
    private By _promoCodeInput = By.Id("promo");
    private By _applyButton = By.CssSelector(".apply-promo");
    
    public void ApplyPromoCode(string code)
    {
        driver.FindElement(_promoCodeInput).SendKeys(code);
        driver.FindElement(_applyButton).Click();
        WaitForAjax();
    }
}
=======
public class CheckoutPage : BasePage  
{
    public IWebElement PromoInput => FindElement(By.CssSelector("[data-test='promo-input']"));
    public IWebElement ApplyPromoBtn => FindElement(By.CssSelector("[data-test='apply-promo']"));
    
    public CheckoutPage EnterPromoCode(string code)
    {
        PromoInput.Clear();
        PromoInput.SendKeys(code);
        return this;
    }
    
    public CheckoutPage ClickApplyPromo()
    {
        ApplyPromoBtn.Click();
        return this;
    }
}
>>>>>>> feature/fluent-api

🤖 Claude:
```csharp
/// <summary>
/// Page Object для страницы оформления заказа
/// </summary>
public class CheckoutPage : BasePage
{
    #region Locators
    // Используем data-test атрибуты как приоритетные (более стабильные)
    private static By PromoCodeInputLocator => By.CssSelector("[data-test='promo-input']");
    private static By ApplyPromoButtonLocator => By.CssSelector("[data-test='apply-promo']");
    #endregion

    #region Elements  
    public IWebElement PromoCodeInput => FindElement(PromoCodeInputLocator);
    public IWebElement ApplyPromoButton => FindElement(ApplyPromoButtonLocator);
    #endregion

    #region Actions (Fluent API)
    /// <summary>
    /// Вводит промокод в поле ввода
    /// </summary>
    public CheckoutPage EnterPromoCode(string code)
    {
        PromoCodeInput.Clear();
        PromoCodeInput.SendKeys(code);
        return this;
    }

    /// <summary>
    /// Нажимает кнопку применения промокода
    /// </summary>
    public CheckoutPage ClickApplyPromo()
    {
        ApplyPromoButton.Click();
        WaitForAjax(); // Сохраняем ожидание из первой версии
        return this;
    }

    /// <summary>
    /// Применяет промокод (комбинированный метод для обратной совместимости)
    /// </summary>
    public CheckoutPage ApplyPromoCode(string code)
    {
        return EnterPromoCode(code).ClickApplyPromo();
    }
    #endregion
}
```

---

## Профилактика конфликтов {#профилактика}

### 1. Структура проекта, минимизирующая конфликты

```
TestAutomation/
├── Core/                          # Редко меняется
│   ├── Base/
│   │   ├── BasePage.cs
│   │   └── BaseTest.cs
│   └── Utilities/
│       ├── WaitHelpers.cs
│       └── ScreenshotHelper.cs
├── Pages/                         # Часто меняется - разделяйте!
│   ├── Auth/
│   │   └── LoginPage.cs          # Один разработчик
│   ├── Checkout/
│   │   └── CheckoutPage.cs       # Другой разработчик
│   └── Catalog/
│       └── ProductPage.cs
├── Tests/                         # Тесты - по feature
│   ├── Auth/
│   ├── Checkout/
│   └── Catalog/
├── TestData/                      # Отдельные файлы
│   ├── users.json
│   └── products.json
└── Configs/                       # Один файл = один environment
    ├── appsettings.dev.json
    ├── appsettings.staging.json
    └── appsettings.prod.json
```

### 2. Правила работы в команде

```markdown
## Git Workflow для автоматизаторов

### Правило мелких коммитов
❌ Плохо: "Added all page objects and tests for sprint 15"
✅ Хорошо: "Add LoginPage with basic authentication flow"

### Правило частого pull
```bash
# Начало рабочего дня
git fetch origin
git rebase origin/main

# Перед созданием PR
git fetch origin
git rebase origin/main
```

### Правило раздельных PR
❌ Один PR: 50 файлов, 3000 строк
✅ PR #1: Новые Page Objects (5 файлов)
✅ PR #2: Тесты для Login (3 файла)
✅ PR #3: Тесты для Checkout (4 файла)
```

### 3. Lock файлы для критичных конфигов

```bash
# .gitattributes
appsettings.json merge=ours
TestData/users.json merge=ours
*.csproj merge=union
```

---

## Чек-лист решения конфликта

```markdown
## Перед началом
- [ ] Прочитал оба варианта кода полностью
- [ ] Понял намерение изменений в обеих ветках
- [ ] Связался с автором конфликтующих изменений (если нужно)

## Во время решения
- [ ] Сохранил функциональность обеих версий
- [ ] Код компилируется без ошибок
- [ ] Нет дублирования логики
- [ ] Следую code style проекта

## После решения  
- [ ] Запустил тесты локально
- [ ] Проверил git diff перед коммитом
- [ ] Написал понятный commit message
- [ ] Удалил все маркеры конфликтов (<<<, ===, >>>)
```

---

## Полезные горячие клавиши VS

| Действие | Комбинация |
|----------|------------|
| Открыть Git Changes | `Ctrl+0, Ctrl+G` |
| Следующий конфликт | `F8` |
| Предыдущий конфликт | `Shift+F8` |
| Принять текущий | `Alt+1` |
| Принять входящий | `Alt+2` |
| Принять оба | `Alt+3` |
| Сравнить с base | `Ctrl+\, Ctrl+B` |
