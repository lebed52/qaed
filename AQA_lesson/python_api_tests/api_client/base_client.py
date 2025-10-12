"""
Базовый API клиент
"""
import requests
from typing import Dict, Any, Optional
from utils.config import config
from utils.logger import logger


class BaseAPIClient:
    """Базовый класс для работы с API"""
    
    def __init__(self, base_url: str = None):
        """
        Инициализация клиента
        
        Args:
            base_url: базовый URL (если None, берётся из config)
        """
        self.base_url = base_url or config.BASE_URL
        self.timeout = config.REQUEST_TIMEOUT
        self.session = requests.Session()
        self.session.headers.update(config.DEFAULT_HEADERS)
    
    def _log_request(self, method: str, url: str, **kwargs):
        """Логирование запроса"""
        logger.info(f"Request: {method} {url}")
        if 'json' in kwargs:
            logger.debug(f"Request body: {kwargs['json']}")
        if 'params' in kwargs:
            logger.debug(f"Request params: {kwargs['params']}")
    
    def _log_response(self, response: requests.Response):
        """Логирование ответа"""
        logger.info(f"Response: {response.status_code} {response.url}")
        logger.debug(f"Response time: {response.elapsed.total_seconds():.3f}s")
        try:
            logger.debug(f"Response body: {response.json()}")
        except Exception:
            logger.debug(f"Response body: {response.text[:200]}")
    
    def get(self, endpoint: str, params: Optional[Dict] = None, **kwargs) -> requests.Response:
        """
        GET запрос
        
        Args:
            endpoint: endpoint API (например, '/posts')
            params: query параметры
            **kwargs: дополнительные параметры для requests
            
        Returns:
            Response объект
        """
        url = f"{self.base_url}{endpoint}"
        self._log_request('GET', url, params=params)
        
        response = self.session.get(
            url,
            params=params,
            timeout=self.timeout,
            **kwargs
        )
        
        self._log_response(response)
        return response
    
    def post(self, endpoint: str, json: Optional[Dict] = None, **kwargs) -> requests.Response:
        """
        POST запрос
        
        Args:
            endpoint: endpoint API
            json: тело запроса в формате JSON
            **kwargs: дополнительные параметры для requests
            
        Returns:
            Response объект
        """
        url = f"{self.base_url}{endpoint}"
        self._log_request('POST', url, json=json)
        
        response = self.session.post(
            url,
            json=json,
            timeout=self.timeout,
            **kwargs
        )
        
        self._log_response(response)
        return response
    
    def put(self, endpoint: str, json: Optional[Dict] = None, **kwargs) -> requests.Response:
        """
        PUT запрос
        
        Args:
            endpoint: endpoint API
            json: тело запроса в формате JSON
            **kwargs: дополнительные параметры для requests
            
        Returns:
            Response объект
        """
        url = f"{self.base_url}{endpoint}"
        self._log_request('PUT', url, json=json)
        
        response = self.session.put(
            url,
            json=json,
            timeout=self.timeout,
            **kwargs
        )
        
        self._log_response(response)
        return response
    
    def patch(self, endpoint: str, json: Optional[Dict] = None, **kwargs) -> requests.Response:
        """
        PATCH запрос
        
        Args:
            endpoint: endpoint API
            json: тело запроса в формате JSON
            **kwargs: дополнительные параметры для requests
            
        Returns:
            Response объект
        """
        url = f"{self.base_url}{endpoint}"
        self._log_request('PATCH', url, json=json)
        
        response = self.session.patch(
            url,
            json=json,
            timeout=self.timeout,
            **kwargs
        )
        
        self._log_response(response)
        return response
    
    def delete(self, endpoint: str, **kwargs) -> requests.Response:
        """
        DELETE запрос
        
        Args:
            endpoint: endpoint API
            **kwargs: дополнительные параметры для requests
            
        Returns:
            Response объект
        """
        url = f"{self.base_url}{endpoint}"
        self._log_request('DELETE', url)
        
        response = self.session.delete(
            url,
            timeout=self.timeout,
            **kwargs
        )
        
        self._log_response(response)
        return response
    
    def close(self):
        """Закрыть сессию"""
        self.session.close()

