# Основы программирования для тестировщика

## 📚 Введение

Этот конспект предназначен для тестировщиков, которые никогда не писали код. Вы научитесь базовым концепциям программирования на JavaScript - языке, который можно сразу попробовать в браузере!

## ✅ Чек-лист: Что вы должны знать после этой лекции

- [ ] Что такое переменные (let, const) и как их создавать
- [ ] Основные типы данных (string, number, boolean)
- [ ] Арифметические операторы (+, -, \*, /, %)
- [ ] Операторы сравнения (===, !==, <, >)
- [ ] Условные конструкции (if, else if, else)
- [ ] Циклы (for, while)
- [ ] Как создавать и вызывать функции
- [ ] Работа с массивами (создание, доступ, методы)
- [ ] Работа с объектами (создание, свойства, методы)
- [ ] Основы отладки с console.log()

### Как запускать примеры?

1. Откройте любой браузер (Chrome, Firefox, Safari)
2. Нажмите `F12` или `Ctrl+Shift+I` (Mac: `Cmd+Option+I`)
3. Перейдите во вкладку **Console**
4. Копируйте примеры и нажимайте `Enter`

---

## 1. Переменные - хранилище данных

**Переменная** - это контейнер для хранения данных. Представьте коробку с ярлыком.

### Как создать переменную?

```javascript
// let - для изменяемых данных
let userName = "Алексей";
console.log(userName); // Выведет: Алексей

// const - для неизменяемых данных
const PI = 3.14;
console.log(PI); // Выведет: 3.14

// var - старый способ (не рекомендуется)
var age = 25;
```

### 💡 Попробуйте в консоли:

```javascript
let greeting = "Привет, мир!";
console.log(greeting);

greeting = "Hello, World!"; // Можем изменить
console.log(greeting);

const APP_NAME = "Test App";
console.log(APP_NAME);
// APP_NAME = "New Name"; // Ошибка! const нельзя изменить
```

---

## 2. Типы данных

JavaScript имеет несколько основных типов данных:

### 2.1 String (строка) - текст

```javascript
let firstName = "Иван";
let lastName = "Петров"; // Можно одинарные или двойные кавычки
let fullName = `${firstName} ${lastName}`; // Шаблонная строка
console.log(fullName); // Выведет: Иван Петров
```

### 2.2 Number (число)

```javascript
let price = 100;
let discount = 10.5;
let total = price - discount;
console.log(total); // Выведет: 89.5
```

### 2.3 Boolean (логический тип)

```javascript
let isTestPassed = true;
let hasErrors = false;
console.log(isTestPassed); // Выведет: true
```

### 2.4 Undefined и Null

```javascript
let notDefined; // undefined - переменная объявлена, но не присвоено значение
console.log(notDefined); // Выведет: undefined

let emptyValue = null; // null - явно указано "пустое значение"
console.log(emptyValue); // Выведет: null
```

### 💡 Проверка типа данных:

```javascript
console.log(typeof "Hello"); // string
console.log(typeof 42); // number
console.log(typeof true); // boolean
console.log(typeof undefined); // undefined
console.log(typeof null); // object (это баг JavaScript!)
```

---

## 3. Операторы

### 3.1 Арифметические операторы

```javascript
let a = 10;
let b = 3;

console.log(a + b); // 13 (сложение)
console.log(a - b); // 7 (вычитание)
console.log(a * b); // 30 (умножение)
console.log(a / b); // 3.333... (деление)
console.log(a % b); // 1 (остаток от деления)
console.log(a ** b); // 1000 (возведение в степень)
```

### 3.2 Операторы сравнения

```javascript
let x = 5;
let y = "5";

console.log(x == y); // true (сравнение значений)
console.log(x === y); // false (строгое сравнение: значение И тип)
console.log(x != y); // false (не равно)
console.log(x !== y); // true (строго не равно)
console.log(x > 3); // true (больше)
console.log(x < 10); // true (меньше)
console.log(x >= 5); // true (больше или равно)
console.log(x <= 5); // true (меньше или равно)
```

**⚠️ Важно:** Всегда используйте `===` вместо `==` для избежания неожиданных результатов!

### 3.3 Логические операторы

```javascript
let isLoggedIn = true;
let hasPermission = false;

console.log(isLoggedIn && hasPermission); // false (И - оба должны быть true)
console.log(isLoggedIn || hasPermission); // true (ИЛИ - хотя бы одно true)
console.log(!isLoggedIn); // false (НЕ - инверсия)
```

### 💡 Практический пример:

```javascript
let userAge = 25;
let hasLicense = true;

// Может ли пользователь арендовать авто?
let canRentCar = userAge >= 21 && hasLicense;
console.log("Может арендовать авто:", canRentCar); // true
```

---

## 4. Условия (if/else) - принятие решений

Условия позволяют выполнять разный код в зависимости от условий.

### 4.1 Базовый if

```javascript
let temperature = 25;

if (temperature > 20) {
  console.log("Тепло!");
}
```

### 4.2 if-else

```javascript
let testResult = 85;

if (testResult >= 90) {
  console.log("Отлично!");
} else {
  console.log("Хорошо!");
}
```

### 4.3 if-else if-else

```javascript
let score = 75;

if (score >= 90) {
  console.log("Оценка: A");
} else if (score >= 80) {
  console.log("Оценка: B");
} else if (score >= 70) {
  console.log("Оценка: C");
} else {
  console.log("Оценка: D");
}
```

### 4.4 Тернарный оператор (короткая форма)

```javascript
let age = 18;
let status = age >= 18 ? "Взрослый" : "Несовершеннолетний";
console.log(status); // Взрослый
```

### 💡 Попробуйте:

```javascript
let statusCode = 200;

if (statusCode === 200) {
  console.log("✅ Успех");
} else if (statusCode === 404) {
  console.log("❌ Не найдено");
} else if (statusCode === 500) {
  console.log("⚠️ Ошибка сервера");
} else {
  console.log("🤔 Неизвестный статус");
}
```

---

## 5. Циклы - повторение действий

Циклы позволяют выполнять код многократно.

### 5.1 Цикл for

```javascript
// Вывести числа от 1 до 5
for (let i = 1; i <= 5; i++) {
  console.log("Число:", i);
}
```

**Разбор:**

- `let i = 1` - начальное значение
- `i <= 5` - условие продолжения
- `i++` - увеличение на 1 после каждой итерации

### 5.2 Цикл while

```javascript
let count = 1;

while (count <= 3) {
  console.log("Попытка:", count);
  count++;
}
```

### 5.3 Цикл do-while

```javascript
let attempts = 0;

do {
  attempts++;
  console.log("Попытка подключения:", attempts);
} while (attempts < 3);
```

### 💡 Практический пример:

```javascript
// Запуск теста 5 раз
for (let testRun = 1; testRun <= 5; testRun++) {
  console.log(`🧪 Запуск теста #${testRun}`);
  let passed = Math.random() > 0.3; // Случайный результат
  console.log(passed ? "✅ Passed" : "❌ Failed");
}
```

---

## 6. Функции - переиспользуемые блоки кода

Функция - это именованный блок кода, который можно вызывать многократно.

### 6.1 Объявление функции

```javascript
// Функция без параметров
function sayHello() {
  console.log("Привет!");
}

sayHello(); // Вызов функции
```

### 6.2 Функция с параметрами

```javascript
function greet(name) {
  console.log("Привет, " + name + "!");
}

greet("Анна"); // Привет, Анна!
greet("Иван"); // Привет, Иван!
```

### 6.3 Функция с возвращаемым значением

```javascript
function add(a, b) {
  return a + b;
}

let result = add(5, 3);
console.log(result); // 8
```

### 6.4 Функция с значениями по умолчанию

```javascript
function createUser(name, role = "user") {
  return `${name} (${role})`;
}

console.log(createUser("Алексей")); // Алексей (user)
console.log(createUser("Мария", "admin")); // Мария (admin)
```

### 6.5 Стрелочные функции (современный синтаксис)

```javascript
// Классическая функция
function multiply(a, b) {
  return a * b;
}

// Стрелочная функция
const multiplyArrow = (a, b) => a * b;

console.log(multiply(4, 5)); // 20
console.log(multiplyArrow(4, 5)); // 20
```

### 💡 Практический пример для тестирования:

```javascript
// Функция проверки статус кода
function checkStatusCode(code) {
  if (code >= 200 && code < 300) {
    return "✅ Success";
  } else if (code >= 400 && code < 500) {
    return "❌ Client Error";
  } else if (code >= 500) {
    return "⚠️ Server Error";
  } else {
    return "🤔 Unknown";
  }
}

console.log(checkStatusCode(200)); // ✅ Success
console.log(checkStatusCode(404)); // ❌ Client Error
console.log(checkStatusCode(500)); // ⚠️ Server Error
```

---

## 7. Массивы - списки данных

Массив - это упорядоченная коллекция элементов.

### 7.1 Создание массива

```javascript
let fruits = ["яблоко", "банан", "апельсин"];
console.log(fruits);

// Доступ к элементам (индексация с 0)
console.log(fruits[0]); // яблоко
console.log(fruits[1]); // банан
console.log(fruits[2]); // апельсин
```

### 7.2 Свойства и методы массивов

```javascript
let numbers = [1, 2, 3, 4, 5];

// Длина массива
console.log(numbers.length); // 5

// Добавить элемент в конец
numbers.push(6);
console.log(numbers); // [1, 2, 3, 4, 5, 6]

// Удалить последний элемент
numbers.pop();
console.log(numbers); // [1, 2, 3, 4, 5]

// Добавить элемент в начало
numbers.unshift(0);
console.log(numbers); // [0, 1, 2, 3, 4, 5]

// Удалить первый элемент
numbers.shift();
console.log(numbers); // [1, 2, 3, 4, 5]
```

### 7.3 Перебор массива

```javascript
let testCases = ["TC001", "TC002", "TC003"];

// С помощью for
for (let i = 0; i < testCases.length; i++) {
  console.log("Выполнение теста:", testCases[i]);
}

// С помощью forEach (современный способ)
testCases.forEach(function (testCase) {
  console.log("Выполнение теста:", testCase);
});

// forEach со стрелочной функцией
testCases.forEach((testCase) => console.log("Тест:", testCase));
```

### 7.4 Полезные методы массивов

```javascript
let scores = [75, 82, 90, 68, 95];

// map - преобразует каждый элемент
let doubled = scores.map((score) => score * 2);
console.log(doubled); // [150, 164, 180, 136, 190]

// filter - фильтрует элементы
let highScores = scores.filter((score) => score >= 80);
console.log(highScores); // [82, 90, 95]

// find - находит первый подходящий элемент
let firstHigh = scores.find((score) => score >= 80);
console.log(firstHigh); // 82

// includes - проверяет наличие элемента
console.log(scores.includes(90)); // true
console.log(scores.includes(100)); // false
```

### 💡 Практический пример:

```javascript
// Результаты тестов
let testResults = [
  { name: "Login Test", passed: true },
  { name: "Search Test", passed: true },
  { name: "Checkout Test", passed: false },
  { name: "Payment Test", passed: true },
];

// Сколько тестов прошло?
let passedTests = testResults.filter((test) => test.passed);
console.log(`Passed: ${passedTests.length}/${testResults.length}`);

// Список упавших тестов
let failedTests = testResults.filter((test) => !test.passed);
failedTests.forEach((test) => console.log("❌ Failed:", test.name));
```

---

## 8. Объекты - структурированные данные

Объект - это коллекция свойств (пар ключ-значение).

### 8.1 Создание объекта

```javascript
let user = {
  name: "Иван",
  age: 30,
  email: "ivan@example.com",
  isActive: true,
};

// Доступ к свойствам
console.log(user.name); // Иван
console.log(user["email"]); // ivan@example.com
```

### 8.2 Изменение и добавление свойств

```javascript
let product = {
  id: 1,
  name: "Ноутбук",
  price: 1000,
};

// Изменение свойства
product.price = 950;

// Добавление нового свойства
product.inStock = true;

console.log(product);
// { id: 1, name: "Ноутбук", price: 950, inStock: true }
```

### 8.3 Методы объекта

```javascript
let calculator = {
  value: 0,

  add: function (num) {
    this.value += num;
    return this;
  },

  subtract: function (num) {
    this.value -= num;
    return this;
  },

  getResult: function () {
    return this.value;
  },
};

calculator.add(10).add(5).subtract(3);
console.log(calculator.getResult()); // 12
```

### 8.4 Массив объектов

```javascript
let users = [
  { id: 1, name: "Алексей", role: "admin" },
  { id: 2, name: "Мария", role: "user" },
  { id: 3, name: "Иван", role: "user" },
];

// Найти всех пользователей с ролью "user"
let regularUsers = users.filter((user) => user.role === "user");
console.log(regularUsers);

// Найти пользователя по ID
let user = users.find((u) => u.id === 2);
console.log(user.name); // Мария
```

### 💡 Практический пример для API тестирования:

```javascript
// Моделируем ответ от API
let apiResponse = {
  status: 200,
  statusText: "OK",
  data: {
    user: {
      id: 123,
      username: "testuser",
      email: "test@example.com",
    },
    token: "abc123xyz",
  },
  timestamp: "2024-01-15T10:30:00Z",
};

// Проверки (assertions)
console.log("Status is 200:", apiResponse.status === 200);
console.log("Has token:", apiResponse.data.token !== undefined);
console.log("User email:", apiResponse.data.user.email);
```

---

## 9. Полезные встроенные объекты

### 9.1 Math - математические операции

```javascript
console.log(Math.PI); // 3.141592653589793
console.log(Math.round(4.7)); // 5
console.log(Math.ceil(4.1)); // 5 (округление вверх)
console.log(Math.floor(4.9)); // 4 (округление вниз)
console.log(Math.random()); // Случайное число от 0 до 1
console.log(Math.max(1, 5, 3, 9, 2)); // 9
console.log(Math.min(1, 5, 3, 9, 2)); // 1
```

### 9.2 String - работа со строками

```javascript
let text = "Hello, World!";

console.log(text.length); // 13
console.log(text.toLowerCase()); // hello, world!
console.log(text.toUpperCase()); // HELLO, WORLD!
console.log(text.includes("World")); // true
console.log(text.startsWith("Hello")); // true
console.log(text.endsWith("!")); // true
console.log(text.replace("World", "JavaScript")); // Hello, JavaScript!
console.log(text.split(", ")); // ["Hello", "World!"]
```

### 9.3 Date - работа с датами

```javascript
let now = new Date();
console.log(now);

let specificDate = new Date("2024-01-15");
console.log(specificDate);

console.log(now.getFullYear()); // Год
console.log(now.getMonth()); // Месяц (0-11)
console.log(now.getDate()); // День месяца
console.log(now.getHours()); // Часы
console.log(now.getMinutes()); // Минуты
```

### 💡 Практический пример:

```javascript
// Генерация случайного email для тестов
function generateTestEmail() {
  let randomNum = Math.floor(Math.random() * 10000);
  let timestamp = Date.now();
  return `test_${randomNum}_${timestamp}@example.com`;
}

console.log(generateTestEmail());
console.log(generateTestEmail());
```

---

## 10. Обработка ошибок

### 10.1 try-catch

```javascript
try {
  // Код, который может вызвать ошибку
  let result = someUndefinedFunction();
} catch (error) {
  console.log("Произошла ошибка:", error.message);
} finally {
  console.log("Этот блок выполнится в любом случае");
}
```

### 💡 Практический пример:

```javascript
function parseJSON(jsonString) {
  try {
    let data = JSON.parse(jsonString);
    console.log("✅ JSON валиден:", data);
    return data;
  } catch (error) {
    console.log("❌ Ошибка парсинга JSON:", error.message);
    return null;
  }
}

parseJSON('{"name": "Test"}'); // ✅ JSON валиден
parseJSON("{name: Test}"); // ❌ Ошибка парсинга
```

---

## 📝 Шпаргалка: Основные команды console

```javascript
console.log("Обычный вывод");
console.error("Ошибка");
console.warn("Предупреждение");
console.table([{ name: "Test1" }, { name: "Test2" }]); // Таблица
console.clear(); // Очистить консоль
```

---


### Советы для тестировщиков:

1. **Практикуйтесь каждый день** - даже 15 минут в день дадут результат
2. **Пишите код в консоли** - это быстрый способ попробовать 
3. **Решайте задачи на практике** - автоматизируйте рутинные проверки
4. **Не бойтесь ошибок** - они часть обучения
5. **Используйте console.log()** - это ваш лучший друг при отладке

## 🎓 Дополнительные ресурсы

### Для практики:

- **MDN Web Docs** (русский) - https://developer.mozilla.org/ru/docs/Web/JavaScript
- **JavaScript.info** (русский) - https://learn.javascript.ru/

---

## 🎯 Домашние задания

### Задание 1: Переменные и типы данных (легкое)

Создайте переменные для следующих данных о тестовом пользователе:

- Имя (строка)
- Возраст (число)
- Email (строка)
- Активен ли аккаунт (boolean)

Выведите все значения в консоль и проверьте типы данных с помощью `typeof`.

<details>
<summary>Решение</summary>

```javascript
let userName = "Алексей";
let userAge = 25;
let userEmail = "alexey@test.com";
let isActive = true;

console.log("Имя:", userName, "- Тип:", typeof userName);
console.log("Возраст:", userAge, "- Тип:", typeof userAge);
console.log("Email:", userEmail, "- Тип:", typeof userEmail);
console.log("Активен:", isActive, "- Тип:", typeof isActive);
```

</details>

---

### Задание 2: Операторы и условия (легкое)

Напишите функцию `checkPassword`, которая принимает пароль и:

- Возвращает "Strong", если длина >= 8 символов
- Возвращает "Weak", если длина < 8 символов

Проверьте на примерах: "12345", "SecurePass123"

<details>
<summary>Решение</summary>

```javascript
function checkPassword(password) {
  if (password.length >= 8) {
    return "Strong";
  } else {
    return "Weak";
  }
}

console.log(checkPassword("12345")); // Weak
console.log(checkPassword("SecurePass123")); // Strong

// Или короткий вариант:
const checkPasswordShort = (password) =>
  password.length >= 8 ? "Strong" : "Weak";
```

</details>

---

### Задание 3: Циклы (среднее)

Напишите цикл, который выводит числа от 1 до 10, но:

- Для чисел, кратных 3, выводит "Fizz"
- Для чисел, кратных 5, выводит "Buzz"
- Для чисел, кратных и 3, и 5, выводит "FizzBuzz"
- Для остальных выводит само число

<details>
<summary>Решение</summary>

```javascript
for (let i = 1; i <= 10; i++) {
  if (i % 3 === 0 && i % 5 === 0) {
    console.log("FizzBuzz");
  } else if (i % 3 === 0) {
    console.log("Fizz");
  } else if (i % 5 === 0) {
    console.log("Buzz");
  } else {
    console.log(i);
  }
}
```

</details>

---

### Задание 4: Функции (среднее)

Создайте функцию `calculateDiscount`, которая:

- Принимает цену товара и процент скидки
- Возвращает финальную цену со скидкой
- Если скидка больше 50%, возвращает ошибку "Invalid discount"

Примеры: calculateDiscount(1000, 10) → 900, calculateDiscount(1000, 60) → "Invalid discount"

<details>
<summary>Решение</summary>

```javascript
function calculateDiscount(price, discountPercent) {
  if (discountPercent > 50) {
    return "Invalid discount";
  }

  let discount = price * (discountPercent / 100);
  let finalPrice = price - discount;
  return finalPrice;
}

console.log(calculateDiscount(1000, 10)); // 900
console.log(calculateDiscount(1000, 25)); // 750
console.log(calculateDiscount(1000, 60)); // Invalid discount
```

</details>

---

### Задание 5: Массивы (среднее)

У вас есть массив результатов тестов:

```javascript
let testResults = [85, 92, 78, 95, 88, 73, 90];
```

Напишите код, который:

1. Выведет все результаты больше или равно 80
2. Посчитает средний балл
3. Найдет максимальный результат

<details>
<summary>Решение</summary>

```javascript
let testResults = [85, 92, 78, 95, 88, 73, 90];

// 1. Результаты >= 80
let highScores = testResults.filter((score) => score >= 80);
console.log("Высокие баллы:", highScores);

// 2. Средний балл
let sum = testResults.reduce((total, score) => total + score, 0);
let average = sum / testResults.length;
console.log("Средний балл:", average);

// 3. Максимальный результат
let maxScore = Math.max(...testResults);
console.log("Максимальный балл:", maxScore);
```

</details>

---

### Задание 6: Объекты (среднее)

Создайте объект `testCase` с полями:

- id (число)
- title (строка)
- status ("passed" или "failed")
- executionTime (число в мс)

Создайте массив из 3-х таких объектов и напишите функцию `getFailedTests`, которая возвращает только провалившиеся тесты.

<details>
<summary>Решение</summary>

```javascript
let testCases = [
  { id: 1, title: "Login Test", status: "passed", executionTime: 1200 },
  { id: 2, title: "Search Test", status: "failed", executionTime: 800 },
  { id: 3, title: "Checkout Test", status: "passed", executionTime: 2500 },
  { id: 4, title: "Payment Test", status: "failed", executionTime: 1500 },
];

function getFailedTests(tests) {
  return tests.filter((test) => test.status === "failed");
}

let failedTests = getFailedTests(testCases);
console.log("Провалившиеся тесты:");
failedTests.forEach((test) => {
  console.log(`- ${test.title} (ID: ${test.id})`);
});
```

</details>

---

### Задание 7: Комплексное задание (сложное)

Создайте систему для управления тест-кейсами:

1. Создайте объект `TestSuite` с методами:

   - `addTest(test)` - добавить тест
   - `runAll()` - запустить все тесты (имитация: случайно passed/failed)
   - `getReport()` - вывести отчет (всего, прошло, провалилось)

2. Тест - это объект с полями: id, name, status

<details>
<summary>Решение</summary>

```javascript
let TestSuite = {
  tests: [],

  addTest: function (test) {
    this.tests.push(test);
    console.log(`✅ Добавлен тест: ${test.name}`);
  },

  runAll: function () {
    console.log("🚀 Запуск всех тестов...\n");
    this.tests.forEach((test) => {
      // Имитация выполнения теста
      let passed = Math.random() > 0.3;
      test.status = passed ? "passed" : "failed";
      let icon = passed ? "✅" : "❌";
      console.log(`${icon} ${test.name}: ${test.status}`);
    });
    console.log("\n");
  },

  getReport: function () {
    let total = this.tests.length;
    let passed = this.tests.filter((t) => t.status === "passed").length;
    let failed = total - passed;

    console.log("📊 ОТЧЕТ О ТЕСТИРОВАНИИ");
    console.log("=".repeat(30));
    console.log(`Всего тестов: ${total}`);
    console.log(`✅ Прошло: ${passed}`);
    console.log(`❌ Провалилось: ${failed}`);
    console.log(`Процент успеха: ${((passed / total) * 100).toFixed(1)}%`);
  },
};

// Использование
TestSuite.addTest({ id: 1, name: "Login Test", status: null });
TestSuite.addTest({ id: 2, name: "Search Test", status: null });
TestSuite.addTest({ id: 3, name: "Checkout Test", status: null });
TestSuite.addTest({ id: 4, name: "Payment Test", status: null });

TestSuite.runAll();
TestSuite.getReport();
```

</details>

---
