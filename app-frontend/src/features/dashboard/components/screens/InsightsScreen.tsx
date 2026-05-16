'use client';

import SectionHead from '../ui/SectionHead';
import Card from '../ui/Card';
import Icon from '../primitives/Icon';
import Kpi from '../ui/Kpi';
import type { InsightsData } from '@/features/dashboard/hooks/useInsights';
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

  const maxMentions = Math.max(...data.themes.map((theme) => theme.mentions), 1);
  const averageRating = data.ratingTrend.filter((value) => value > 0);
  const currentRating = averageRating.length > 0 ? averageRating[averageRating.length - 1] : 0;
  const currentVolume = data.volumeTrend[data.volumeTrend.length - 1] ?? 0;
  const strongestTheme = data.themes[0]?.name ?? 'Sin tema dominante';

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
            <p className={s.aiBody}>
              Analysis consolidó sentimiento, volumen y temas repetidos para que veas dónde se concentra la conversación reciente.
            </p>
          </div>
        </div>
      </Card>

      <div className={s.grid}>
        <Kpi label="Rating actual" value={currentRating || '0.0'} sub="promedio reciente" accent="var(--accent-deep)" />
        <Kpi label="Volumen" value={currentVolume} sub="reseñas último mes" accent="var(--accent-deep)" />
        <Kpi label="Tema principal" value={strongestTheme} sub="más repetido" accent="var(--accent-deep)" />
        <Kpi label="Temas" value={data.themes.length} sub="detectados por IA" accent="var(--accent-deep)" />
      </div>

      <div className={s.volumeSection}>
        <SectionHead title="Temas clave" sub="Menciones y tendencia reciente" />
        <div className={s.grid}>
          {data.themes.map((theme) => {
            const tone = theme.sentiment === 'negativo'
              ? { background: '#FCE7E7', fill: '#D84B4B' }
              : theme.sentiment === 'positivo'
                ? { background: '#E7F6EC', fill: '#2E8B57' }
                : { background: '#F3EFE8', fill: '#7D6E5D' };

            return (
              <Card key={theme.name} className={s.themeCard}>
                <div className={s.themeRow}>
                  <div className={s.themeLeft}>
                    <div className={s.themeScore} style={{ background: tone.background }}>
                      {theme.trend > 0 ? `+${theme.trend}` : theme.trend}
                    </div>
                    <div>
                      <div className={s.themeName}>{theme.name}</div>
                      <div className={s.themeCount}>{theme.mentions} menciones · {theme.sentiment}</div>
                    </div>
                  </div>
                  <span className={s.demoBadge}>IA</span>
                </div>
                <div className={s.sentBar}>
                  <div
                    className={s.sentFill}
                    style={{ width: `${Math.max(12, (theme.mentions / maxMentions) * 100)}%`, background: tone.fill }}
                  />
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </>
  );
}
