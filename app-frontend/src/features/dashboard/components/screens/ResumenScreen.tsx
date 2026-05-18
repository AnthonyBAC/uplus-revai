'use client';

import Link from 'next/link';
import SectionHead from '../ui/SectionHead';
import Kpi from '../ui/Kpi';
import Card from '../ui/Card';
import Btn from '../ui/Btn';
import BarChart from '../primitives/BarChart';
import Donut from '../primitives/Donut';
import ReviewCard, { type ReviewItem } from '../ReviewCard';
import {
  getStarDistribution,
  getSourceDistribution,
  getSentimentFromRatings,
  getPositiveRate,
} from '../../mappers/charts';
import type { DashboardResponse } from '@/types/api/dashboard';
import s from './ResumenScreen.module.css';

interface ResumenScreenProps {
  data: DashboardResponse | null;
  loading: boolean;
  reviews: ReviewItem[];
  onReply: (id: string, text: string) => void;
  onRefresh: () => void;
  userName?: string | null;
  businessName?: string | null;
}

export default function ResumenScreen({
  data,
  loading,
  reviews,
  onReply,
  onRefresh,
  userName,
  businessName,
}: ResumenScreenProps) {
  if (loading) {
    return <div className={s.loading}>Cargando…</div>;
  }

  const rawReviews = data?.data.reviews ?? [];
  const totalReviews = data?.reviews ?? 0;
  const totalSurveys = data?.surveys ?? 0;
  const noReply = reviews.filter((r) => !r.reply).length;

  const today = new Date().toLocaleDateString('es-CL', { day: 'numeric', month: 'long' });
  const sub = `Hola ${userName ?? 'Usuario'}, esto pasó en ${businessName ?? 'tu negocio'} · ${today}`;

  const ratingAvg = reviews.length
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : '—';

  const starDist = getStarDistribution(rawReviews);
  const sourceDist = getSourceDistribution(rawReviews);
  const sentiment = getSentimentFromRatings(rawReviews);
  const positiveRate = getPositiveRate(rawReviews);

  return (
    <>
      <SectionHead
        title="Resumen"
        sub={sub}
        right={<Btn kind="outline" size="sm" icon="refresh" onClick={onRefresh}>Actualizar</Btn>}
      />

      <div className="grid-kpi" style={{ marginBottom: 16 }}>
        <Kpi label="Rating prom." value={ratingAvg} sub="últimas reseñas" accent="var(--accent-deep)" />
        <Kpi label="Reseñas" value={totalReviews} sub="en total" accent="var(--accent-deep)" />
        <Kpi label="Sin responder" value={noReply} sub={noReply > 5 ? 'Atención' : 'Al día'} accent={noReply > 5 ? 'var(--bad)' : 'var(--good)'} />
        <Kpi label="Encuestas" value={totalSurveys} sub="activas" accent="var(--accent-deep)" />
      </div>

      <div className="grid-split" style={{ marginBottom: 14 }}>
        <Card>
          <div className={s.chartHead}>
            <div className={s.chartLabel}>Distribución de estrellas</div>
          </div>
          <BarChart data={starDist} height={160} />
        </Card>

        <Card>
          <div className={s.chartHead}>
            <div className={s.chartLabel}>Sentimiento</div>
          </div>
          <Donut
            data={sentiment}
            size={140}
            thickness={22}
            center={{ value: `${positiveRate}%`, label: 'positivas' }}
          />
        </Card>
      </div>

      {sourceDist.length > 0 && (
        <Card style={{ marginBottom: 14 }}>
          <div className={s.chartHead}>
            <div className={s.chartLabel}>Reseñas por fuente</div>
          </div>
          <Donut data={sourceDist} size={140} thickness={22} center={{ value: rawReviews.length, label: 'muestra' }} />
        </Card>
      )}

      <div className={s.section}>
        <SectionHead
          title="Últimas reseñas"
          right={
            <Btn kind="ghost" size="sm" icon="arrow">
              <Link href="/dashboard/resenas" style={{ color: 'inherit', textDecoration: 'none' }}>Ver todas</Link>
            </Btn>
          }
        />
        <div className={s.list}>
          {reviews.length === 0 ? (
            <Card className={s.empty}>Aún no hay reseñas para este negocio.</Card>
          ) : (
            reviews.slice(0, 3).map((r) => (
              <ReviewCard key={r.id} r={r} onReply={(text) => onReply(r.id, text)} />
            ))
          )}
        </div>
      </div>

      <div className={s.section}>
        <SectionHead title="Reportes recientes" />
        <div className={s.list}>
          {(data?.data.reports ?? []).length === 0 ? (
            <Card className={s.empty}>No hay reportes generados aún.</Card>
          ) : (
            data!.data.reports.map((rep) => (
              <Card key={rep.id} style={{ padding: '14px 18px' }}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{rep.title}</div>
                <div style={{ fontSize: 12, color: 'var(--ink-mute)', marginTop: 4 }}>
                  {formatReportPeriod(rep.periodStart, rep.periodEnd)} · {rep.status}
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </>
  );
}

function formatReportPeriod(periodStart: string, periodEnd: string): string {
  return `${new Date(periodStart).toLocaleDateString('es-CL')} – ${new Date(periodEnd).toLocaleDateString('es-CL')}`;
}
