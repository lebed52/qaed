# 🚀 Быстрый старт

## Что уже сделано

✅ Проект настроен и готов к работе!
✅ Все зависимости установлены
✅ 17 тестов написаны и работают
✅ Первые тесты успешно прошли

---

## Запуск проекта

### 1. Активировать виртуальное окружение

```bash
cd /Users/s-lebedev/qaed/AQA_lesson/python_api_tests
source venv/bin/activate
```

После активации в терминале появится `(venv)` перед командной строкой.

### 2. Запустить тесты

```bash
# Все тесты
pytest

# Конкретный файл
pytest tests/test_posts.py

# Конкретный тест
pytest tests/test_posts.py::TestPostsGet::test_get_all_posts

# С подробным выводом
pytest -v

# Только smoke тесты
pytest -m smoke

# Только GET запросы
pytest -m get

# Остановиться на первой ошибке
pytest -x

# Показать print() в выводе
pytest -s
```

### 3. Посмотреть отчёт

После запуска тестов откройте в браузере:

```
reports/report.html
```

---

## Структура проекта

```
python_api_tests/
├── tests/              # Тесты
│   ├── test_posts.py  # 17 готовых тестов
│   └── conftest.py    # Fixtures
├── api_client/         # API клиенты
│   └── base_client.py # Базовый клиент
├── utils/              # Утилиты
│   ├── config.py      # Конфигурация
│   └── logger.py      # Логирование
├── data/               # Тестовые данные
├── reports/            # HTML отчёты
└── venv/               # Виртуальное окружение
```

---

## Что делать дальше?

### Шаг 1: Изучи существующие тесты

Открой `tests/test_posts.py` и посмотри:

- Как делаются запросы
- Как проверяются ответы
- Какие есть типы тестов

### Шаг 2: Запусти тесты разными способами

```bash
# Smoke тесты
pytest -m smoke -v

# Негативные тесты
pytest -m negative -v

# Тесты производительности
pytest -m performance -v

# Параметризованные тесты
pytest -k "test_get_multiple_posts_by_id" -v
```

### Шаг 3: Изучи API в Postman

1. Открой Postman
2. Протестируй эти endpoints руками:
   - `GET https://jsonplaceholder.typicode.com/posts`
   - `GET https://jsonplaceholder.typicode.com/posts/1`
   - `POST https://jsonplaceholder.typicode.com/posts`
3. Посмотри на структуру ответов

### Шаг 4: Напиши свои тесты

Создай файл `tests/test_comments.py` и напиши тесты для:

- `GET /comments` - получить все комментарии
- `GET /comments/1` - получить конкретный комментарий
- `GET /comments?postId=1` - комментарии к посту

**Шаблон теста:**

```python
import pytest
from api_client.base_client import BaseAPIClient

class TestComments:

    @pytest.mark.smoke
    @pytest.mark.get
    def test_get_all_comments(self, api_client: BaseAPIClient):
        """Получить все комментарии"""
        response = api_client.get('/comments')

        assert response.status_code == 200

        comments = response.json()
        assert len(comments) > 0

        # Проверяем структуру
        first_comment = comments[0]
        assert 'postId' in first_comment
        assert 'id' in first_comment
        assert 'email' in first_comment
        assert '@' in first_comment['email']
```

### Шаг 5: Следуй плану обучения

Открой файл `LEARNING_PLAN.md` и следуй урокам по порядку.

---

## Полезные команды

### Форматирование кода

```bash
# Автоформатирование
black tests/

# Проверка стиля
flake8 tests/
```

### Работа с виртуальным окружением

```bash
# Активировать
source venv/bin/activate

# Деактивировать
deactivate

# Установить новую библиотеку
pip install <package_name>

# Обновить requirements.txt
pip freeze > requirements.txt
```

### Параллельный запуск

```bash
# Запустить на 4 ядрах
pytest -n 4

# Показать самые медленные тесты
pytest --durations=10
```

---

## Документация API

**JSONPlaceholder API:**

- URL: https://jsonplaceholder.typicode.com
- Документация: https://jsonplaceholder.typicode.com/guide/

**Доступные ресурсы:**

- `/posts` - 100 постов
- `/comments` - 500 комментариев
- `/albums` - 100 альбомов
- `/photos` - 5000 фотографий
- `/todos` - 200 задач
- `/users` - 10 пользователей

**HTTP методы:**

- `GET` - получить данные
- `POST` - создать данные
- `PUT` - обновить данные (полностью)
- `PATCH` - обновить данные (частично)
- `DELETE` - удалить данные

---

## Примеры запросов

### GET - Получить данные

```python
# Все посты
response = api_client.get('/posts')

# Конкретный пост
response = api_client.get('/posts/1')

# С параметрами
response = api_client.get('/posts', params={'userId': 1})
```

### POST - Создать данные

```python
new_post = {
    'title': 'Test Post',
    'body': 'Test Body',
    'userId': 1
}
response = api_client.post('/posts', json=new_post)
```

### PUT - Обновить данные

```python
updated_post = {
    'id': 1,
    'title': 'Updated Title',
    'body': 'Updated Body',
    'userId': 1
}
response = api_client.put('/posts/1', json=updated_post)
```

### DELETE - Удалить данные

```python
response = api_client.delete('/posts/1')
```

---

## Проверки (Assertions)

### Статус коды

```python
assert response.status_code == 200  # OK
assert response.status_code == 201  # Created
assert response.status_code == 404  # Not Found
```

### JSON данные

```python
data = response.json()

# Проверка типа
assert isinstance(data, list)
assert isinstance(data, dict)

# Проверка длины
assert len(data) == 100
assert len(data) > 0

# Проверка наличия ключа
assert 'id' in data
assert 'title' in data

# Проверка значения
assert data['id'] == 1
assert data['title'] == 'Expected Title'

# Проверка типа поля
assert isinstance(data['id'], int)
assert isinstance(data['title'], str)
```

### Email валидация

```python
assert '@' in data['email']
assert '.' in data['email']
```

---

## Маркеры (Markers)

В проекте настроены следующие маркеры:

```python
@pytest.mark.smoke       # Быстрые smoke тесты
@pytest.mark.regression  # Полный набор тестов
@pytest.mark.get         # GET запросы
@pytest.mark.post        # POST запросы
@pytest.mark.put         # PUT запросы
@pytest.mark.delete      # DELETE запросы
@pytest.mark.negative    # Негативные тесты
@pytest.mark.performance # Тесты производительности
```

**Использование:**

```bash
pytest -m smoke
pytest -m "get and not negative"
pytest -m "smoke or regression"
```

---

## Troubleshooting

### Тесты не запускаются

1. Проверь, активировано ли виртуальное окружение:

```bash
which python
# Должно показать путь с venv
```

2. Переустанови зависимости:

```bash
pip install -r requirements.txt
```

### Импорты не работают

Запускай тесты из корня проекта:

```bash
cd /Users/s-lebedev/qaed/AQA_lesson/python_api_tests
pytest
```

### API не отвечает

Проверь интернет соединение и доступность API:

```bash
curl https://jsonplaceholder.typicode.com/posts
```

---

## Следующие шаги

1. ✅ **Запусти все существующие тесты** - убедись что всё работает
2. 📖 **Прочитай код** - изучи `test_posts.py` и `base_client.py`
3. 🧪 **Протестируй в Postman** - потрогай API руками
4. ✍️ **Напиши свои тесты** - начни с `/comments`
5. 📚 **Следуй плану** - открой `LEARNING_PLAN.md`

---

**Вопросы?** Спрашивай! Удачи! 🚀
