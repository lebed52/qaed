# Конспект лекции: Основы JavaScript

## 📋 Введение

**JavaScript** - самый популярный язык программирования в мире:
- Используется почти на всех веб-сайтах
- Средняя зарплата JavaScript разработчика: от 100 000 рублей
- Необходим в QA для написания автотестов
- Обеспечивает интерактивность сайтов: всплывающие окна, сложная логика

## 📚 Краткая история

- **Создан**: 1995 год, за 10 дней
- **Автор**: Брендан Эйх (Netscape)
- **Первоначальное название**: LiveScript → JavaScript
- **Современное применение**: 
  - Веб-браузеры
  - Мобильные приложения
  - Серверы
  - Десктопные программы
  - Игры

## 🛠 Настройка рабочей среды

1. Открыть Google Chrome (или любой современный браузер)
2. Нажать **F12** или ПКМ → "Посмотреть код"
3. Найти вкладку **"Console"** или **"Консоль"**

## 🚀 Первые шаги

### Первая программа
```javascript
alert("Привет, мир!");
```

### Вывод в консоль
```javascript
console.log("Я программирую на JavaScript!");
```

## 📦 Переменные

### Способы объявления переменных:
- `var` - **НЕ ИСПОЛЬЗУЕМ** (устаревший, создает ошибки)
- `let` - если значение будет меняться
- `const` - если значение не меняется

### Примеры:
```javascript
let name = "Алексей";
console.log(name);

let age = 25;
console.log(age);

const city = "Москва";
console.log(city);
```

### 💡 Практическое задание
Создать переменную со своим именем и вывести приветственное сообщение:
```javascript
let myName = "Сергей";
console.log("Привет, " + myName);
```

## 🔢 Типы данных

### Основные типы (90% случаев):
```javascript
let number = 42;           // Число
let text = "Привет";       // Строка
let isActive = true;       // Булево значение
```

### Проверка типа данных:
```javascript
console.log(typeof 42);        // "number"
console.log(typeof "Привет");  // "string"
console.log(typeof true);      // "boolean"
```

## 🎯 Практический пример: Инспектор элементов

Скрипт для QA - показывает размеры элементов при наведении мыши:

```javascript
document.addEventListener('mouseover', function(e) {
    const rect = e.target.getBoundingClientRect();
    e.target.title = `${Math.round(rect.width)}×${Math.round(rect.height)}px`;
    e.target.style.outline = '1px solid red';
});

document.addEventListener('mouseout', function(e) {
    e.target.style.outline = '';
});
```

### Разбор кода:
- `document.addEventListener()` - добавляет "слушатель событий"
- `mouseover/mouseout` - события наведения/убирания мыши
- `e.target` - элемент, на который навели мышь
- `getBoundingClientRect()` - получает размеры элемента
- `Math.round()` - округляет числа

## ⚙️ Функции

### Обычный синтаксис:
```javascript
function helloFunction(name) {
    return "Привет, " + name + "!";
}

let message = helloFunction("Сергей");
console.log(message);
```

### Современный синтаксис (стрелочные функции):
```javascript
const helloFunction = name => "Привет, " + name + "!";
let message = helloFunction("Сергей");
console.log(message);
```

## 🧮 Практический пример: Калькулятор

```javascript
function calculator() {
    let num1 = parseInt(prompt("Первое число:"));
    let operation = prompt("Операция (+, -, *, /):");
    let num2 = parseInt(prompt("Второе число:"));
    
    let result;
    
    if (operation === '+') result = num1 + num2;
    else if (operation === '-') result = num1 - num2;
    else if (operation === '*') result = num1 * num2;
    else if (operation === '/') result = num1 / num2;
    else {
        alert("Неизвестная операция!");
        return;
    }
    
    alert(`Результат: ${result}`);
}

calculator();
```

## 🔍 Операторы сравнения

```javascript
// = - присваивание (НЕ сравнение!)
// == - нестрогое равенство (преобразует типы)
"5" == 5     // true ✅

// === - строгое равенство (без преобразования типов)
"5" === 5    // false ❌
```

## 🔄 Условия и логика

### Проверка возраста:
```javascript
function ageChecker() {
    let age = parseInt(prompt("Введите возраст:"));
    
    if (age >= 18) {
        console.log("Совершеннолетний");
    } else {
        console.log("Несовершеннолетний");
    }
}

ageChecker();
```

## 📝 Массивы и циклы

### Практический пример: Todo-лист
```javascript
function createTodoList() {
    let todos = [];
    
    // Цикл для ввода задач
    for (let i = 0; i < 3; i++) {
        let todo = prompt(`Введи задачу ${i + 1}:`);
        todos.push(todo);
    }
    
    // Вывод списка дел
    console.log("Твой список дел:");
    for (let i = 0; i < todos.length; i++) {
        console.log(`${i + 1}. ${todos[i]}`);
    }
}

createTodoList();
```

### Методы массивов:
```javascript
let nums = [1, 2, 3, 4, 5];

// forEach - выполнить для каждого элемента
nums.forEach(num => console.log(num * 2));

// filter - отфильтровать элементы
let evenNumbers = nums.filter(num => num % 2 === 0);
console.log(evenNumbers); // [2, 4]

// map - преобразовать элементы
let doubled = nums.map(num => num * 2);
console.log(doubled); // [2, 4, 6, 8, 10]
```

## 🤖 Автоматизация: Автокликер

```javascript
function autoClicker() {
    // Найти все кнопки на странице
    let buttons = document.querySelectorAll('button');
    
    if (buttons.length === 0) {
        alert("Кнопки не найдены!");
        return;
    }
    
    console.log(`Найдено кнопок: ${buttons.length}`);
    
    // Нажать на каждую кнопку с интервалом
    buttons.forEach((button, index) => {
        setTimeout(() => {
            button.click();
            console.log(`Нажата кнопка ${index + 1}: ${button.textContent}`);
        }, index * 1000); // Задержка в 1 секунду между кликами
    });
}

autoClicker();
```

## 📚 Что изучили:

✅ **Переменные** (`let`, `const`) и типы данных  
✅ **Функции** (обычные и стрелочные)  
✅ **Условия** (`if`, `else`) и операторы сравнения  
✅ **Циклы** (`for`) и работа с массивами  
✅ **Методы массивов** (`forEach`, `filter`, `map`)  
✅ **Работа с DOM** и браузером  
✅ **Практические примеры** для QA автоматизации  

## 🏠 Домашнее задание

### Задание 1: Улучшить автокликер
Доработать автокликер так, чтобы он выводил в консоль все ссылки, на которые кликали.

### Задание 2: Генератор паролей
**Техническое задание:**
- Генерировать пароль из заглавных и строчных букв латинского алфавита + цифры
- Длину пароля вводит пользователь
- Результат выводится в консоль браузера

**Подсказка для реализации:**
```javascript
function generatePassword() {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    // Ваш код здесь...
}
```

## 🎯 Что дальше?

1. **Практикуйтесь** - открывайте разные сайты, экспериментируйте в консоли
2. **Создавайте проекты** - генераторы, автоматизация, игры
3. **Изучайте дальше** - фреймворки, библиотеки, серверная разработка

---
