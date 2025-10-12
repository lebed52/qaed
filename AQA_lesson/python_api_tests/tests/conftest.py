"""
Pytest fixtures для API тестов
"""
import pytest
from api_client.base_client import BaseAPIClient


@pytest.fixture(scope='session')
def api_client():
    """
    Фикстура для создания API клиента
    Scope='session' означает, что клиент создаётся один раз на всю сессию тестов
    """
    client = BaseAPIClient()
    yield client
    client.close()


@pytest.fixture(scope='function')
def api_client_per_test():
    """
    Фикстура для создания API клиента для каждого теста отдельно
    Scope='function' означает, что для каждого теста создаётся новый клиент
    """
    client = BaseAPIClient()
    yield client
    client.close()

