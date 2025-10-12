"""
Логирование для API тестов
"""
import logging
from utils.config import config


def setup_logger(name: str = __name__) -> logging.Logger:
    """
    Настройка логгера
    
    Args:
        name: имя логгера
        
    Returns:
        Настроенный логгер
    """
    logger = logging.getLogger(name)
    logger.setLevel(getattr(logging, config.LOG_LEVEL))
    
    # Если у логгера уже есть обработчики, не добавляем новые
    if not logger.handlers:
        # Создаём обработчик для вывода в консоль
        console_handler = logging.StreamHandler()
        console_handler.setLevel(getattr(logging, config.LOG_LEVEL))
        
        # Формат сообщений
        formatter = logging.Formatter(
            '%(asctime)s - %(name)s - %(levelname)s - %(message)s',
            datefmt='%Y-%m-%d %H:%M:%S'
        )
        console_handler.setFormatter(formatter)
        
        logger.addHandler(console_handler)
    
    return logger


# Создаём основной логгер
logger = setup_logger('api_tests')

