'use client';

import SectionHead from '../ui/SectionHead';
import Card from '../ui/Card';
import Icon from '../primitives/Icon';
import type { InsightsData } from '@/hooks/useInsights';
import s from './InsightsScreen.module.css';

interface InsightsScreenProps {
  data: InsightsData | null;
  loading: boolean;
}

export default function InsightsScreen({ data, loading }: InsightsScreenProps) {
  if (loading) {
    return <div style={{ color: 'var(--ink-mute)', padding: 40, textAlign: 'center' }}>Cargando…</div>;
  }

  if (!data || data.themes.length === 0) {
    return (
      <>
        <SectionHead title="Insights" sub="Qué dicen tus clientes" />
        <Card className={s.aiCard}>
          <div className={s.aiRow}>
            <div className={s.aiIcon}>
              <Icon name="sparkle" size={18} stroke={2} />
            </div>
            <div>
              <div className={s.aiLabel}>Sin datos suficientes</div>
              <h3 className={s.aiTitle}>Aún no hay suficiente data para analizar</h3>
              <p className={s.aiBody}>
                Cuando tu negocio acumule reseñas, aquí verás los temas más mencionados, su sentimiento y la evolución del volumen.
              </p>
            </div>
          </div>
        </Card>
      </>
    );
  }

  return (
    <>
      <SectionHead title="Insights" sub="Qué dicen tus clientes" />
      <Card className={s.aiCard}>
        <div className={s.aiRow}>
          <div className={s.aiIcon}>
            <Icon name="sparkle" size={18} stroke={2} />
          </div>
          <div>
            <div className={s.aiLabel}>Resumen</div>
            <h3 className={s.aiTitle}>Temas detectados en tus reseñas</h3>
          </div>
        </div>
      </Card>
    </>
  );
}
