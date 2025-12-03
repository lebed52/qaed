// ========================================
// ПРАКТИКА: ФУНКЦИИ И ПЕРЕМЕННЫЕ
// ========================================

console.log("=== 1. ПРОСТЫЕ ФУНКЦИИ БЕЗ ПАРАМЕТРОВ ===\n");

// Функция, которая просто выводит текст
function sayHello() {
  console.log("Привет, мир!");
}

sayHello();
sayHello();
sayHello();

console.log("\n=== 2. ФУНКЦИИ С ОДНИМ ПАРАМЕТРОМ ===\n");

// Функция с одним параметром
function greet(name) {
  console.log("Привет, " + name + "!");
}

greet("Александр");
greet("Мария");
greet("QA Engineer");

console.log("\n=== 3. ФУНКЦИИ С НЕСКОЛЬКИМИ ПАРАМЕТРАМИ ===\n");

// Функция сложения двух чисел
function add(a, b) {
  let result = a + b;
  console.log(a + " + " + b + " = " + result);
}

add(5, 3);
add(10, 20);
add(100, 50);

console.log("\n=== 4. ФУНКЦИИ С RETURN (возврат значения) ===\n");

// Функция, которая возвращает результат
function multiply(x, y) {
  return x * y;
}

let result1 = multiply(5, 4);
console.log("5 * 4 = " + result1);

let result2 = multiply(10, 3);
console.log("10 * 3 = " + result2);

console.log("\n=== 5. РАБОТА СО СТРОКАМИ ===\n");

// Функция создания email
function createEmail(name, domain) {
  return name + "@" + domain;
}

let email1 = createEmail("ivan", "yandex.ru");
let email2 = createEmail("maria", "gmail.com");

console.log("Email 1: " + email1);
console.log("Email 2: " + email2);

console.log("\n=== 6. ФУНКЦИЯ ВЫЗЫВАЕТ ДРУГУЮ ФУНКЦИЮ ===\n");

// Функция умножения на 2
function double(num) {
  return num * 2;
}

// Функция умножения на 4 (использует double)
function quadruple(num) {
  let doubled = double(num);
  return double(doubled);
}

let number = 5;
console.log(number + " * 2 = " + double(number));
console.log(number + " * 4 = " + quadruple(number));

console.log("\n=== 7. ВЫЧИСЛЕНИЕ ПЛОЩАДИ ===\n");

// Площадь прямоугольника
function calculateArea(width, height) {
  return width * height;
}

let width = 10;
let height = 5;
let area = calculateArea(width, height);

console.log("Ширина: " + width);
console.log("Высота: " + height);
console.log("Площадь: " + area);

console.log("\n=== 8. РАБОТА С ЦЕНАМИ ===\n");

// Функция расчёта скидки
function applyDiscount(price, discount) {
  return price - discount;
}

let originalPrice = 1000;
let discountAmount = 150;
let finalPrice = applyDiscount(originalPrice, discountAmount);

console.log("Исходная цена: " + originalPrice + " руб.");
console.log("Скидка: " + discountAmount + " руб.");
console.log("Итоговая цена: " + finalPrice + " руб.");

console.log("\n=== 9. КОНКАТЕНАЦИЯ СТРОК ===\n");

// Функция создания полного имени
function createFullName(firstName, lastName) {
  return firstName + " " + lastName;
}

let fullName1 = createFullName("Иван", "Петров");
let fullName2 = createFullName("Мария", "Сидорова");

console.log("Пользователь 1: " + fullName1);
console.log("Пользователь 2: " + fullName2);

console.log("\n=== 10. ПРАКТИКА ДЛЯ ТЕСТИРОВАНИЯ ===\n");

// Функция создания тестового сообщения
function createTestMessage(testName, testNumber) {
  return "Тест '" + testName + "' #" + testNumber;
}

let message1 = createTestMessage("Авторизация", 1);
let message2 = createTestMessage("Регистрация", 2);
let message3 = createTestMessage("Поиск товара", 3);

console.log(message1);
console.log(message2);
console.log(message3);

console.log("\n=== 11. ТЕМПЕРАТУРА ===\n");

// Конвертация Цельсия в Фаренгейт
function celsiusToFahrenheit(celsius) {
  return celsius * 1.8 + 32;
}

let tempC = 25;
let tempF = celsiusToFahrenheit(tempC);

console.log(tempC + "°C = " + tempF + "°F");

console.log("\n=== 12. ВОЗРАСТ В ДНЯХ ===\n");

// Функция расчёта возраста в днях (примерно)
function yearsTodays(years) {
  return years * 365;
}

let age = 25;
let ageInDays = yearsTodays(age);

console.log("Возраст: " + age + " лет");
console.log("Это примерно " + ageInDays + " дней");

console.log("\n✅ ВСЕ ПРИМЕРЫ ВЫПОЛНЕНЫ!");

