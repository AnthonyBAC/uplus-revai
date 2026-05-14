'use client';

import SectionHead from '../ui/SectionHead';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Icon from '../primitives/Icon';
import Sparkline from '../primitives/Sparkline';
import type { InsightsData } from '@/hooks/useInsights';
import s from './InsightsScreen.module.css';

const DAY_LABELS = ['L', 'M', 'M', 'J', 'V', 'S', 'D', 'L', 'M', 'M', 'J', 'V', 'S', 'D'];

interface InsightsScreenProps {
  insights: InsightsData;
}

export default function InsightsScreen({ insights }: InsightsScreenProps) {
  const { themes, volumeTrend } = insights;

  return (
    <>
      <SectionHead
        title="Insights"
        sub={<>Qué dicen tus clientes · últimas 4 semanas <span className={s.demoBadge}>demo</span></>}
      />

      <Card className={s.aiCard}>
        <div className={s.aiRow}>
          <div className={s.aiIcon}>
            <Icon name="sparkle" size={18} stroke={2} />
          </div>
          <div>
            <div className={s.aiLabel}>Resumen de IA</div>
            <h3 className={s.aiTitle}>El servicio en hora punta es tu mayor oportunidad</h3>
            <p className={s.aiBody}>
              Tus clientes destacan la <b>terraza</b> (91% positivo) y los <b>postres</b>. Pero las menciones sobre{' '}
              <b>espera</b> aumentaron 64% en la última semana, concentradas entre las 13:00 y 14:00 los días hábiles.
            </p>
          </div>
        </div>
      </Card>

      <SectionHead title="Temas mencionados" sub="Volumen y sentimiento" />
      <div className={s.grid}>
        {themes.map((t) => {
          const scoreBg = t.sentiment > 0.6 ? '#E5EEDD' : t.sentiment > 0.4 ? '#F6E9CC' : '#F2D9D2';
          const fillColor = t.sentiment > 0.6 ? 'var(--good)' : t.sentiment > 0.4 ? 'var(--warn)' : 'var(--bad)';
          const badgeTone = t.trend === 'up' ? 'good' : t.trend === 'down' ? 'bad' : 'soft';
          return (
            <Card key={t.id} className={s.themeCard} hover>
              <div className={s.themeRow}>
                <div className={s.themeLeft}>
                  <div className={s.themeScore} style={{ background: scoreBg }}>
                    {Math.round(t.sentiment * 100)}
                  </div>
                  <div>
                    <div className={s.themeName}>{t.label}</div>
                    <div className={s.themeCount}>{t.count} menciones</div>
                  </div>
                </div>
                <Badge tone={badgeTone}>
                  {t.trend === 'up' ? '↑' : t.trend === 'down' ? '↓' : '–'} {t.trend}
                </Badge>
              </div>
              <div className={s.sentBar}>
                <div className={s.sentFill} style={{ width: `${t.sentiment * 100}%`, background: fillColor }} />
              </div>
            </Card>
          );
        })}
      </div>

      <div className={s.volumeSection}>
        <SectionHead title="Volumen de reseñas" sub="Últimos 14 días" />
        <Card>
          <Sparkline data={volumeTrend} color="var(--accent)" height={120} />
          <div className={s.volumeFooter}>
            {DAY_LABELS.map((d, i) => <span key={i}>{d}</span>)}
          </div>
        </Card>
      </div>
    </>
  );
}
