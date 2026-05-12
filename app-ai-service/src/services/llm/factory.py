import logging

from src.services.llm.base import LLMProvider
from src.services.llm.mock import MockLLMProvider

logger = logging.getLogger(__name__)


def get_llm_provider(settings: object) -> LLMProvider:  # type: ignore[type-arg]
    """
    Retorna el proveedor LLM según configuración.

    - AI_API_KEY=""  → MockLLMProvider (flujo dev/test sin tokens)
    - AI_API_KEY!=[] y AI_PROVIDER="gemini"/"openai"/etc → NotImplementedError
      (crear src/services/llm/<provider>.py cuando se elija el proveedor real)
    """
    api_key: str = getattr(settings, "ai_api_key", "")
    provider_name: str = getattr(settings, "ai_provider", "mock")

    if not api_key:
        logger.info("AI_API_KEY vacío — usando MockLLMProvider (modo desarrollo)")
        return MockLLMProvider()

    raise NotImplementedError(
        f"El proveedor '{provider_name}' aún no está implementado. "
        f"Crea src/services/llm/{provider_name}.py con una clase que implemente LLMProvider, "
        "o establece AI_API_KEY='' en tu .env para usar MockLLMProvider."
    )
