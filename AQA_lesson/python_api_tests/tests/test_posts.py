"""
Тесты для /posts endpoint

API Documentation: https://jsonplaceholder.typicode.com/guide/
"""
import pytest
from api_client.base_client import BaseAPIClient


class TestPostsGet:
    """Тесты GET запросов для /posts"""
    
    @pytest.mark.smoke
    @pytest.mark.get
    def test_get_all_posts(self, api_client: BaseAPIClient):
        """
        Тест: Получить все посты
        
        Проверяем:
        - Статус код 200
        - Ответ - это список
        - В списке есть посты
        - Каждый пост имеет нужные поля
        """
        # Отправляем GET запрос
        response = api_client.get('/posts')
        
        # Проверяем статус код
        assert response.status_code == 200, f"Ожидали 200, получили {response.status_code}"
        
        # Парсим JSON
        posts = response.json()
        
        # Проверяем, что это список
        assert isinstance(posts, list), "Ответ должен быть списком"
        
        # Проверяем, что список не пустой
        assert len(posts) > 0, "Список постов не должен быть пустым"
        
        # Проверяем количество постов (должно быть 100)
        assert len(posts) == 100, f"Ожидали 100 постов, получили {len(posts)}"
        
        # Проверяем структуру первого поста
        first_post = posts[0]
        assert 'userId' in first_post, "Post должен содержать userId"
        assert 'id' in first_post, "Post должен содержать id"
        assert 'title' in first_post, "Post должен содержать title"
        assert 'body' in first_post, "Post должен содержать body"
        
        print(f"\n✅ Получено {len(posts)} постов")
        print(f"Первый пост: {first_post['title']}")
    
    @pytest.mark.smoke
    @pytest.mark.get
    def test_get_single_post(self, api_client: BaseAPIClient):
        """
        Тест: Получить конкретный пост по ID
        
        Проверяем:
        - Статус код 200
        - ID поста соответствует запрошенному
        - Все поля присутствуют
        """
        post_id = 1
        response = api_client.get(f'/posts/{post_id}')
        
        assert response.status_code == 200
        
        post = response.json()
        
        # Проверяем, что это словарь (объект)
        assert isinstance(post, dict), "Ответ должен быть объектом"
        
        # Проверяем ID
        assert post['id'] == post_id, f"ID поста должен быть {post_id}"
        
        # Проверяем наличие всех полей
        required_fields = ['userId', 'id', 'title', 'body']
        for field in required_fields:
            assert field in post, f"Поле {field} должно быть в ответе"
            assert post[field] is not None, f"Поле {field} не должно быть пустым"
        
        print(f"\n✅ Получен пост #{post_id}: {post['title']}")
    
    @pytest.mark.get
    @pytest.mark.parametrize('post_id', [1, 5, 10, 50, 100])
    def test_get_multiple_posts_by_id(self, api_client: BaseAPIClient, post_id: int):
        """
        Параметризованный тест: Получить несколько постов по разным ID
        
        Этот тест запустится 5 раз с разными post_id
        """
        response = api_client.get(f'/posts/{post_id}')
        
        assert response.status_code == 200
        post = response.json()
        assert post['id'] == post_id
        
        print(f"\n✅ Пост #{post_id} получен успешно")
    
    @pytest.mark.get
    def test_get_posts_by_user_id(self, api_client: BaseAPIClient):
        """
        Тест: Получить посты конкретного пользователя
        
        Используем query параметры: /posts?userId=1
        """
        user_id = 1
        response = api_client.get('/posts', params={'userId': user_id})
        
        assert response.status_code == 200
        
        posts = response.json()
        
        assert len(posts) > 0, "У пользователя должны быть посты"
        
        # Проверяем, что все посты принадлежат этому пользователю
        for post in posts:
            assert post['userId'] == user_id, \
                f"Все посты должны быть от userId={user_id}, но получили userId={post['userId']}"
        
        print(f"\n✅ У пользователя {user_id} найдено {len(posts)} постов")
    
    @pytest.mark.get
    def test_get_comments_for_post(self, api_client: BaseAPIClient):
        """
        Тест: Получить комментарии к посту
        
        Используем вложенный endpoint: /posts/1/comments
        """
        post_id = 1
        response = api_client.get(f'/posts/{post_id}/comments')
        
        assert response.status_code == 200
        
        comments = response.json()
        
        assert len(comments) > 0, "У поста должны быть комментарии"
        
        # Проверяем структуру первого комментария
        first_comment = comments[0]
        required_fields = ['postId', 'id', 'name', 'email', 'body']
        for field in required_fields:
            assert field in first_comment, f"Комментарий должен содержать {field}"
        
        # Проверяем, что все комментарии для нашего поста
        for comment in comments:
            assert comment['postId'] == post_id
        
        print(f"\n✅ Для поста #{post_id} найдено {len(comments)} комментариев")


class TestPostsCreate:
    """Тесты POST запросов (создание постов)"""
    
    @pytest.mark.smoke
    @pytest.mark.post
    def test_create_post(self, api_client: BaseAPIClient):
        """
        Тест: Создать новый пост
        
        Проверяем:
        - Статус код 201 (Created)
        - В ответе есть ID
        - Данные сохранились правильно
        """
        new_post = {
            'title': 'Мой тестовый пост',
            'body': 'Это содержимое моего тестового поста',
            'userId': 1
        }
        
        response = api_client.post('/posts', json=new_post)
        
        # Проверяем статус код 201 (Created)
        assert response.status_code == 201, f"Ожидали 201, получили {response.status_code}"
        
        created_post = response.json()
        
        # Проверяем, что вернулся ID
        assert 'id' in created_post, "Созданный пост должен иметь ID"
        assert created_post['id'] is not None
        
        # Проверяем, что данные совпадают
        assert created_post['title'] == new_post['title']
        assert created_post['body'] == new_post['body']
        assert created_post['userId'] == new_post['userId']
        
        print(f"\n✅ Создан пост с ID: {created_post['id']}")
        print(f"Заголовок: {created_post['title']}")
    
    @pytest.mark.post
    def test_create_post_minimal_data(self, api_client: BaseAPIClient):
        """
        Тест: Создать пост с минимальными данными
        """
        minimal_post = {
            'title': 'Только заголовок',
            'userId': 1
        }
        
        response = api_client.post('/posts', json=minimal_post)
        
        assert response.status_code == 201
        created_post = response.json()
        assert 'id' in created_post
        
        print(f"\n✅ Создан минимальный пост с ID: {created_post['id']}")


class TestPostsUpdate:
    """Тесты PUT/PATCH запросов (обновление постов)"""
    
    @pytest.mark.put
    def test_update_post_put(self, api_client: BaseAPIClient):
        """
        Тест: Обновить пост полностью (PUT)
        
        PUT заменяет весь ресурс
        """
        post_id = 1
        updated_post = {
            'id': post_id,
            'title': 'Обновлённый заголовок',
            'body': 'Обновлённое содержимое',
            'userId': 1
        }
        
        response = api_client.put(f'/posts/{post_id}', json=updated_post)
        
        assert response.status_code == 200
        
        result = response.json()
        
        assert result['id'] == post_id
        assert result['title'] == updated_post['title']
        assert result['body'] == updated_post['body']
        
        print(f"\n✅ Пост #{post_id} обновлён (PUT)")
    
    @pytest.mark.put
    def test_update_post_patch(self, api_client: BaseAPIClient):
        """
        Тест: Обновить часть поста (PATCH)
        
        PATCH обновляет только указанные поля
        """
        post_id = 1
        partial_update = {
            'title': 'Только новый заголовок'
        }
        
        response = api_client.patch(f'/posts/{post_id}', json=partial_update)
        
        assert response.status_code == 200
        
        result = response.json()
        
        assert result['id'] == post_id
        assert result['title'] == partial_update['title']
        # body и userId должны остаться (хотя в JSONPlaceholder это не работает реально)
        
        print(f"\n✅ Пост #{post_id} частично обновлён (PATCH)")


class TestPostsDelete:
    """Тесты DELETE запросов (удаление постов)"""
    
    @pytest.mark.delete
    def test_delete_post(self, api_client: BaseAPIClient):
        """
        Тест: Удалить пост
        
        Проверяем:
        - Статус код 200
        """
        post_id = 1
        response = api_client.delete(f'/posts/{post_id}')
        
        assert response.status_code == 200
        
        print(f"\n✅ Пост #{post_id} удалён")


class TestPostsNegative:
    """Негативные тесты для /posts"""
    
    @pytest.mark.negative
    @pytest.mark.get
    def test_get_nonexistent_post(self, api_client: BaseAPIClient):
        """
        Негативный тест: Попытка получить несуществующий пост
        
        Проверяем, что API возвращает 404
        """
        non_existent_id = 99999
        response = api_client.get(f'/posts/{non_existent_id}')
        
        assert response.status_code == 404, \
            f"Для несуществующего поста ожидали 404, получили {response.status_code}"
        
        print(f"\n✅ Корректно вернулся 404 для несуществующего поста")
    
    @pytest.mark.negative
    @pytest.mark.get
    def test_get_post_with_invalid_id(self, api_client: BaseAPIClient):
        """
        Негативный тест: Попытка получить пост с невалидным ID
        """
        invalid_id = 'abc'
        response = api_client.get(f'/posts/{invalid_id}')
        
        # JSONPlaceholder возвращает 404 для невалидных ID
        assert response.status_code == 404
        
        print(f"\n✅ Корректно обработан невалидный ID")


class TestPostsPerformance:
    """Тесты производительности"""
    
    @pytest.mark.performance
    def test_response_time(self, api_client: BaseAPIClient):
        """
        Тест: Проверка времени ответа
        
        API должен отвечать быстро (менее 2 секунд)
        """
        response = api_client.get('/posts')
        
        response_time = response.elapsed.total_seconds()
        
        assert response_time < 2.0, \
            f"Время ответа слишком долгое: {response_time:.3f}s"
        
        print(f"\n✅ Время ответа: {response_time:.3f}s")

