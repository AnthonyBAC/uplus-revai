'use client';

import SectionHead from '../ui/SectionHead';
import Card from '../ui/Card';
import Icon from '../primitives/Icon';
import type { InsightsData } from '@/features/dashboard/hooks/useInsights';
import s from './InsightsScreen.module.css';

interface InsightsScreenProps {
  data: InsightsData | null;
  loading: boolean;
}

export default function InsightsScreen({ data, loading }: InsightsScreenProps) {
  if (loading) {
    return <div className={s.loading}>Cargando…</div>;
  }

  return (
    <>
      <SectionHead title="Insights" sub="Qué dicen tus clientes · análisis IA" />

      <Card className={s.aiCard}>
        <div className={s.aiRow}>
          <div className={s.aiIcon}>
            <Icon name="sparkle" size={18} stroke={2} />
          </div>
          <div>
            <div className={s.aiLabel}>Análisis IA</div>
            <h3 className={s.aiTitle}>
              {data ? 'Temas detectados en tus reseñas' : 'Aún no hay suficiente data para analizar'}
            </h3>
            <p className={s.aiBody}>
              {data
                ? 'Analysis consolidó sentimiento, volumen y temas repetidos para que veas dónde se concentra la conversación reciente.'
                : 'Cuando tu negocio acumule reseñas, aquí verás los temas más mencionados, su sentimiento y la evolución del volumen.'}
            </p>
          </div>
        </div>
      </Card>

      <div className="grid-split" style={{ marginBottom: 14 }}>
        <PlaceholderCard
          title="Temas mencionados"
          message="Pronto · el análisis IA mostrará tus temas más mencionados con sentimiento."
        />
        <PlaceholderCard
          title="Nube de temas"
          message="Pronto · burbujas con peso según menciones."
        />
      </div>

      <PlaceholderCard
        title="Sentimiento por fuente"
        message="Pronto · distribución positiva/neutra/negativa por Google, TripAdvisor, etc."
        style={{ marginBottom: 14 }}
      />

      <div className="grid-split" style={{ marginBottom: 14 }}>
        <PlaceholderCard
          title="Rating vs industria · 30 días"
          message="Pronto · comparativa con el promedio de tu rubro."
        />
        <PlaceholderCard
          title="Cuándo opinan tus clientes"
          message="Pronto · heatmap por hora y día de la semana."
        />
      </div>

      <PlaceholderCard
        title="NPS estimado"
        message="Pronto · NPS calculado desde encuestas internas."
      />
    </>
  );
}

function PlaceholderCard({
  title,
  message,
  style,
}: {
  title: string;
  message: string;
  style?: React.CSSProperties;
}) {
  return (
    <Card style={style}>
      <div className={s.placeholderHead}>{title}</div>
      <div className={s.placeholderBody}>{message}</div>
    </Card>
  );
}
