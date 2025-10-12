# 📚 План обучения API автоматизации на Python

## ✅ Этап 1: Подготовка (ЗАВЕРШЁН!)

Мы уже сделали:

- [x] Установили Python 3.13.3
- [x] Создали структуру проекта
- [x] Настроили виртуальное окружение
- [x] Установили все зависимости
- [x] Написали и запустили первые 17 тестов
- [x] Все тесты прошли успешно! ✨

---

## 🎯 Этап 2: Изучаем основы (Урок 1-2)

### Урок 1: Анализ существующих тестов

**Задание 1.1:** Открой файл `tests/test_posts.py` и изучи его

**Что посмотреть:**

```python
# 1. Как создаётся GET запрос
response = api_client.get('/posts')

# 2. Как проверяется статус код
assert response.status_code == 200

# 3. Как парсится JSON
posts = response.json()

# 4. Как проверяются данные
assert len(posts) == 100
assert 'title' in first_post
```

**Практика:**

- Запусти тесты разными способами (см. README.md)
- Посмотри на HTML отчёт в `reports/report.html`
- Попробуй запустить только smoke тесты: `pytest -m smoke`

---

### Урок 2: Изучаем API в Postman

**Задание 2.1:** Открой Postman и протестируй руками

**Endpoints для тестирования:**

```
1. GET    https://jsonplaceholder.typicode.com/posts
2. GET    https://jsonplaceholder.typicode.com/posts/1
3. POST   https://jsonplaceholder.typicode.com/posts
   Body: {"title": "Test", "body": "Test body", "userId": 1}
4. PUT    https://jsonplaceholder.typicode.com/posts/1
5. DELETE https://jsonplaceholder.typicode.com/posts/1
```

**Задание 2.2:** Создай коллекцию в Postman

- Сохрани все 5 запросов
- Добавь тесты в Postman (вкладка Tests)
- Запусти всю коллекцию (Collection Runner)

---

## 🚀 Этап 3: Пишем свои тесты (Урок 3-4)

### Урок 3: Тесты для /comments

**Задание 3.1:** Создай файл `tests/test_comments.py`

**Что протестировать:**

```
Endpoint: https://jsonplaceholder.typicode.com/comments

1. GET /comments - получить все комментарии (500 штук)
2. GET /comments/1 - получить конкретный комментарий
3. GET /comments?postId=1 - комментарии к конкретному посту
4. POST /comments - создать комментарий
5. DELETE /comments/1 - удалить комментарий
```

**Структура комментария:**

```json
{
  "postId": 1,
  "id": 1,
  "name": "comment name",
  "email": "test@test.com",
  "body": "comment text"
}
```

**Пример теста:**

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

        assert len(comments) == 500

        # Проверяем структуру первого комментария
        first_comment = comments[0]
        assert 'postId' in first_comment
        assert 'id' in first_comment
        assert 'name' in first_comment
        assert 'email' in first_comment
        assert 'body' in first_comment

        # Email должен быть валидным
        assert '@' in first_comment['email']
```

---

### Урок 4: Тесты для /users

**Задание 4.1:** Создай файл `tests/test_users.py`

**Что протестировать:**

```
Endpoint: https://jsonplaceholder.typicode.com/users

1. GET /users - получить всех пользователей (10 штук)
2. GET /users/1 - получить конкретного пользователя
3. GET /users/1/posts - посты пользователя
4. GET /users/1/albums - альбомы пользователя
5. GET /users/1/todos - задачи пользователя
```

**Структура пользователя:**

```json
{
  "id": 1,
  "name": "Leanne Graham",
  "username": "Bret",
  "email": "Sincere@april.biz",
  "address": {
    "street": "Kulas Light",
    "suite": "Apt. 556",
    "city": "Gwenborough",
    "zipcode": "92998-3874",
    "geo": {
      "lat": "-37.3159",
      "lng": "81.1496"
    }
  },
  "phone": "1-770-736-8031 x56442",
  "website": "hildegard.org",
  "company": {
    "name": "Romaguera-Crona",
    "catchPhrase": "Multi-layered client-server neural-network",
    "bs": "harness real-time e-markets"
  }
}
```

**Особенности:**

- Вложенные объекты (address, company)
- Проверка email формата
- Проверка всех связанных ресурсов

---

## 🎓 Этап 4: Продвинутые техники (Урок 5-7)

### Урок 5: Параметризация тестов

**Задание 5.1:** Параметризуй тесты

**Пример:**

```python
@pytest.mark.parametrize('user_id, expected_posts_count', [
    (1, 10),
    (2, 10),
    (3, 10)
])
def test_user_posts_count(self, api_client, user_id, expected_posts_count):
    """Проверить количество постов у разных пользователей"""
    response = api_client.get(f'/users/{user_id}/posts')
    posts = response.json()
    assert len(posts) == expected_posts_count
```

**Задание 5.2:** Параметризация с CSV

Создай файл `data/users_test_data.csv`:

```csv
user_id,username,expected_posts
1,Bret,10
2,Antonette,10
3,Samantha,10
```

---

### Урок 6: Fixtures и Setup/Teardown

**Задание 6.1:** Улучши `conftest.py`

**Добавь фикстуры для:**

```python
@pytest.fixture
def create_post(api_client):
    """Создать тестовый пост и вернуть его ID"""
    post_data = {
        'title': 'Test Post',
        'body': 'Test Body',
        'userId': 1
    }
    response = api_client.post('/posts', json=post_data)
    post_id = response.json()['id']

    yield post_id

    # Cleanup - удалить пост после теста
    api_client.delete(f'/posts/{post_id}')
```

**Использование:**

```python
def test_update_created_post(self, api_client, create_post):
    """Тест использует созданный пост"""
    post_id = create_post

    # Обновляем пост
    response = api_client.put(f'/posts/{post_id}', json={
        'id': post_id,
        'title': 'Updated Title',
        'body': 'Updated Body',
        'userId': 1
    })

    assert response.status_code == 200
```

---

### Урок 7: Валидация JSON Schema

**Задание 7.1:** Создай JSON схему

Создай файл `data/schemas/post_schema.json`:

```json
{
  "type": "object",
  "properties": {
    "userId": { "type": "integer" },
    "id": { "type": "integer" },
    "title": { "type": "string" },
    "body": { "type": "string" }
  },
  "required": ["userId", "id", "title", "body"]
}
```

**Задание 7.2:** Используй схему в тесте

```python
import json
from jsonschema import validate

def test_post_schema(self, api_client):
    """Проверить, что пост соответствует схеме"""
    response = api_client.get('/posts/1')
    post = response.json()

    # Загружаем схему
    with open('data/schemas/post_schema.json') as f:
        schema = json.load(f)

    # Валидируем
    validate(instance=post, schema=schema)
```

---

## 📦 Этап 5: Архитектура проекта (Урок 8-9)

### Урок 8: API Client Pattern

**Задание 8.1:** Создай специализированный клиент

Создай файл `api_client/posts_client.py`:

```python
from api_client.base_client import BaseAPIClient
from typing import List, Dict, Any

class PostsClient(BaseAPIClient):
    """Клиент для работы с постами"""

    def get_all_posts(self) -> List[Dict[str, Any]]:
        """Получить все посты"""
        response = self.get('/posts')
        return response.json()

    def get_post_by_id(self, post_id: int) -> Dict[str, Any]:
        """Получить пост по ID"""
        response = self.get(f'/posts/{post_id}')
        return response.json()

    def get_posts_by_user(self, user_id: int) -> List[Dict[str, Any]]:
        """Получить посты пользователя"""
        response = self.get('/posts', params={'userId': user_id})
        return response.json()

    def create_post(self, title: str, body: str, user_id: int) -> Dict[str, Any]:
        """Создать новый пост"""
        post_data = {
            'title': title,
            'body': body,
            'userId': user_id
        }
        response = self.post('/posts', json=post_data)
        return response.json()

    def update_post(self, post_id: int, title: str, body: str, user_id: int) -> Dict[str, Any]:
        """Обновить пост"""
        post_data = {
            'id': post_id,
            'title': title,
            'body': body,
            'userId': user_id
        }
        response = self.put(f'/posts/{post_id}', json=post_data)
        return response.json()

    def delete_post(self, post_id: int) -> bool:
        """Удалить пост"""
        response = self.delete(f'/posts/{post_id}')
        return response.status_code == 200
```

**Использование в тестах:**

```python
from api_client.posts_client import PostsClient

def test_posts_with_client():
    client = PostsClient()

    # Создать пост
    post = client.create_post('Test Title', 'Test Body', 1)

    # Получить пост
    fetched_post = client.get_post_by_id(post['id'])

    # Обновить пост
    updated_post = client.update_post(post['id'], 'New Title', 'New Body', 1)

    # Удалить пост
    success = client.delete_post(post['id'])

    client.close()
```

---

### Урок 9: Test Data Management

**Задание 9.1:** Создай файл с тестовыми данными

Создай файл `data/test_data.py`:

```python
from faker import Faker

fake = Faker()

class TestData:
    """Тестовые данные"""

    @staticmethod
    def generate_post_data(user_id: int = 1):
        """Генерировать данные для поста"""
        return {
            'title': fake.sentence(nb_words=5),
            'body': fake.text(max_nb_chars=200),
            'userId': user_id
        }

    @staticmethod
    def generate_comment_data(post_id: int = 1):
        """Генерировать данные для комментария"""
        return {
            'postId': post_id,
            'name': fake.name(),
            'email': fake.email(),
            'body': fake.text(max_nb_chars=100)
        }

    # Готовые данные для тестов
    VALID_POST = {
        'title': 'Valid Test Post',
        'body': 'This is a valid test post',
        'userId': 1
    }

    INVALID_POST_NO_TITLE = {
        'body': 'Post without title',
        'userId': 1
    }

    INVALID_POST_NO_USER = {
        'title': 'Post without user',
        'body': 'Body text'
    }
```

**Использование:**

```python
from data.test_data import TestData

def test_create_post_with_generated_data(api_client):
    """Создать пост с сгенерированными данными"""
    post_data = TestData.generate_post_data()
    response = api_client.post('/posts', json=post_data)
    assert response.status_code == 201
```

---

## 📊 Этап 6: Reporting (Урок 10)

### Урок 10: Allure отчёты

**Задание 10.1:** Добавь Allure аннотации

```python
import allure

@allure.feature('Posts')
@allure.story('Get posts')
@allure.severity(allure.severity_level.CRITICAL)
def test_get_all_posts(api_client):
    """Получить все посты"""
    with allure.step('Отправить GET запрос'):
        response = api_client.get('/posts')

    with allure.step('Проверить статус код'):
        assert response.status_code == 200

    with allure.step('Проверить количество постов'):
        posts = response.json()
        assert len(posts) == 100
        allure.attach(
            json.dumps(posts[0], indent=2),
            name='Первый пост',
            attachment_type=allure.attachment_type.JSON
        )
```

**Задание 10.2:** Сгенерируй Allure отчёт

```bash
# Запустить тесты с генерацией результатов
pytest --alluredir=allure-results

# Открыть отчёт
allure serve allure-results
```

---

## 🔥 Этап 7: Дополнительные задания

### Задание 7.1: Протестируй все ресурсы

Создай тесты для:

- [ ] `/albums` - 100 альбомов
- [ ] `/photos` - 5000 фотографий
- [ ] `/todos` - 200 задач

### Задание 7.2: E2E сценарии

Напиши комплексные тесты:

```python
def test_full_blog_scenario(api_client):
    """
    Полный сценарий работы с блогом:
    1. Создать пользователя (или взять существующего)
    2. Создать пост от этого пользователя
    3. Добавить комментарии к посту
    4. Получить все комментарии поста
    5. Обновить пост
    6. Удалить комментарии
    7. Удалить пост
    """
```

### Задание 7.3: Негативные тесты

Протестируй граничные случаи:

- Невалидные ID (отрицательные, строки, слишком большие)
- Отсутствующие обязательные поля
- Неправильные типы данных
- SQL инъекции
- XSS атаки в текстовых полях

### Задание 7.4: Performance тесты

```python
import time

def test_response_time_under_load(api_client):
    """Проверить время ответа при множественных запросах"""
    start_time = time.time()

    # 100 запросов
    for i in range(100):
        response = api_client.get(f'/posts/{i+1}')
        assert response.status_code == 200

    end_time = time.time()
    total_time = end_time - start_time
    avg_time = total_time / 100

    assert avg_time < 0.5  # В среднем меньше 500ms на запрос
```

---

## 🎯 Финальный проект

**Создай полноценный фреймворк для тестирования JSONPlaceholder API:**

✅ Чек-лист готовности:

- [ ] Все ресурсы покрыты тестами (posts, comments, users, albums, photos, todos)
- [ ] Используется Page Object (API Client) паттерн
- [ ] Есть позитивные и негативные тесты
- [ ] Используется параметризация
- [ ] Настроены fixtures
- [ ] Валидация через JSON Schema
- [ ] Генерация тестовых данных через Faker
- [ ] Allure отчёты
- [ ] README с инструкциями
- [ ] Покрытие > 80%
- [ ] CI/CD (GitHub Actions) - опционально

---

## 📚 Дополнительные ресурсы

### Документация

- [JSONPlaceholder Guide](https://jsonplaceholder.typicode.com/guide/)
- [Pytest Documentation](https://docs.pytest.org/)
- [Requests Library](https://requests.readthedocs.io/)
- [Allure Framework](https://allurereport.org/)

### Видео уроки

- YouTube: "Python API Testing Tutorial"
- YouTube: "Pytest Tutorial"

### Практика

- [Postman Public APIs](https://www.postman.com/explore)
- [RapidAPI](https://rapidapi.com/) - тысячи API для практики

---

## 💡 Советы

1. **Делай по порядку** - не пропускай этапы
2. **Пиши чистый код** - используй black для форматирования
3. **Коммить часто** - git commit после каждого выполненного задания
4. **Читай ошибки** - они подсказывают, что не так
5. **Экспериментируй** - пробуй разные подходы
6. **Задавай вопросы** - не застревай на одном месте

---

**Удачи в обучении! 🚀**

_Если возникнут вопросы - спрашивай!_
