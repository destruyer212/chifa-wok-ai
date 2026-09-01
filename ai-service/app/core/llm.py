'''Fabrica del modelo de lenguaje segun el proveedor configurado.'''
from __future__ import annotations
from app.config import get_settings


def build_llm():
    '''Devuelve un chat model de LangChain, o None si el proveedor es "fake".'''
    s = get_settings()
    provider = s.llm_provider.lower()

    if provider == "openai":
        from langchain_openai import ChatOpenAI
        return ChatOpenAI(model=s.llm_model, temperature=s.llm_temperature,
                          api_key=s.openai_api_key)

    if provider == "anthropic":
        from langchain_anthropic import ChatAnthropic
        return ChatAnthropic(model=s.llm_model, temperature=s.llm_temperature,
                             api_key=s.anthropic_api_key)

    return None  # modo "fake": se usa el extractor por reglas


def nombre_modelo() -> str:
    s = get_settings()
    return "fake-rules" if s.llm_provider.lower() == "fake" else f"{s.llm_provider}:{s.llm_model}"
