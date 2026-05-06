from typing import Any, Protocol, runtime_checkable

from pydantic import BaseModel


class ItemAnalysis(BaseModel):
    """Resultado del análisis de un ítem individual (review o respuesta de encuesta)."""

    sentiment: str  # POSITIVE | NEGATIVE | NEUTRAL
    summary: str
    keywords: list[str]


class AggregatedReport(BaseModel):
    """Reporte agregado de todos los ítems del periodo."""

    executive_summary: str
    strengths: list[str]
    weaknesses: list[str]
    recommendations: list[str]
    themes: list[str]


@runtime_checkable
class LLMProvider(Protocol):
    """Abstracción intercambiable para el proveedor de IA."""

    def analyze_item(self, text: str, context: dict[str, Any]) -> ItemAnalysis:
        """Analiza un ítem individual y devuelve sentimiento, resumen y palabras clave."""
        ...

    def aggregate(self, items: list[ItemAnalysis], period: str) -> AggregatedReport:
        """Agrega los análisis individuales en un reporte ejecutivo del periodo."""
        ...
