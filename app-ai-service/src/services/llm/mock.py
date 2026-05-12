from collections import Counter
from typing import Any

from src.services.llm.base import AggregatedReport, ItemAnalysis


class MockLLMProvider:
    """
    Proveedor LLM determinístico para desarrollo local.

    Se activa automáticamente cuando AI_API_KEY="" en el .env,
    permitiendo probar el flujo completo sin gastar tokens.

    Lógica de sentimiento:
      - rating >= 4  → POSITIVE
      - rating == 3  → NEUTRAL
      - rating < 3   → NEGATIVE
      - sin rating   → NEUTRAL
    """

    def analyze_item(self, text: str, context: dict[str, Any]) -> ItemAnalysis:
        rating = context.get("rating")

        if rating is not None:
            if rating >= 4:
                sentiment = "POSITIVE"
            elif rating < 3:
                sentiment = "NEGATIVE"
            else:
                sentiment = "NEUTRAL"
        else:
            sentiment = "NEUTRAL"

        summary = f"[mock] {text[:140]}..." if len(text) > 140 else f"[mock] {text}"
        keywords = list({w.lower() for w in text.split() if len(w) > 5})[:5]

        return ItemAnalysis(sentiment=sentiment, summary=summary, keywords=keywords)

    def aggregate(self, items: list[ItemAnalysis], period: str) -> AggregatedReport:
        by_sentiment = Counter(i.sentiment for i in items)
        all_keywords = list({kw for item in items for kw in item.keywords})[:10]

        positive = by_sentiment.get("POSITIVE", 0)
        negative = by_sentiment.get("NEGATIVE", 0)
        neutral = by_sentiment.get("NEUTRAL", 0)

        return AggregatedReport(
            executive_summary=(
                f"[mock] Periodo {period}: {len(items)} ítems analizados — "
                f"{positive} positivos, {neutral} neutrales, {negative} negativos."
            ),
            strengths=[
                "[mock] Fortaleza 1: Atención al cliente destacada",
                "[mock] Fortaleza 2: Calidad del producto/servicio",
            ],
            weaknesses=[
                "[mock] Debilidad 1: Tiempos de respuesta mejorables",
            ],
            recommendations=[
                "[mock] Recomendación 1: Reducir tiempos de espera en horas pico",
                "[mock] Recomendación 2: Implementar seguimiento post-servicio",
            ],
            themes=all_keywords,
        )
