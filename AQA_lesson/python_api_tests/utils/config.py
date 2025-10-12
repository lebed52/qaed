"""
Конфигурация для API тестов
"""
import os
from dotenv import load_dotenv

# Загружаем переменные из .env файла
load_dotenv()


class Config:
    """Класс для хранения конфигурации"""
    
    # Base URL API
    BASE_URL = os.getenv('BASE_URL', 'https://jsonplaceholder.typicode.com')
    
    # Timeout для запросов
    REQUEST_TIMEOUT = int(os.getenv('REQUEST_TIMEOUT', '10'))
    
    # Уровень логирования
    LOG_LEVEL = os.getenv('LOG_LEVEL', 'INFO')
    
    # Headers по умолчанию
    DEFAULT_HEADERS = {
        'Content-Type': 'application/json; charset=utf-8'
    }


# Создаём экземпляр конфигурации
config = Config()

