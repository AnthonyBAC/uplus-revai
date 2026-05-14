'use client';

import Link from 'next/link';
import SectionHead from '../ui/SectionHead';
import Kpi from '../ui/Kpi';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Btn from '../ui/Btn';
import Sparkline from '../primitives/Sparkline';
import ReviewCard, { type ReviewItem } from '../ReviewCard';
import type { DashboardResponse } from '@/types/api/dashboard';
import s from './ResumenScreen.module.css';

interface ResumenScreenProps {
  data: DashboardResponse | null;
  loading: boolean;
  reviews: ReviewItem[];
  onReply: (id: string, text: string) => void;
  userName?: string | null;
  businessName?: string | null;
}

export default function ResumenScreen({ data, loading, reviews, onReply, userName, businessName }: ResumenScreenProps) {
  if (loading) {
    return <div style={{ color: 'var(--ink-mute)', padding: 40, textAlign: 'center' }}>Cargando…</div>;
  }

  const totalReviews = data?.reviews ?? 0;
  const totalSurveys = data?.surveys ?? 0;
  const noReply = reviews.filter((r) => !r.reply).length;

  const today = new Date().toLocaleDateString('es-CL', { day: 'numeric', month: 'long' });
  const sub = `Hola ${userName ?? 'Usuario'}, esto pasó en ${businessName ?? 'tu negocio'} · ${today}`;

  const ratingAvg = reviews.length
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : '—';

  const starCounts = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
  }));

  return (
    <>
      <SectionHead
        title="Resumen"
        sub={sub}
        right={
          <div style={{ display: 'flex', gap: 8 }}>
            <Btn kind="outline" size="sm" icon="refresh">Actualizar</Btn>
          </div>
        }
      />

      <div className={s.kpis}>
        <Kpi label="Rating prom." value={ratingAvg} sub="últimas reseñas" accent="var(--accent-deep)" />
        <Kpi label="Reseñas" value={totalReviews} sub="en total" accent="var(--accent-deep)" />
        <Kpi label="Sin responder" value={noReply} sub={noReply > 5 ? 'Atención' : 'Al día'} accent={noReply > 5 ? 'var(--bad)' : 'var(--good)'} />
        <Kpi label="Encuestas" value={totalSurveys} sub="activas" accent="var(--accent-deep)" />
      </div>

      <div className={s.charts}>
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 10 }}>
            <div>
              <div className={s.chartLabel}>Rating · últimos 14 días</div>
              <div className={s.chartValue}>
                {ratingAvg}
                <span className={s.chartDelta}>↑ dato referencial</span>
              </div>
            </div>
            <Badge tone="soft">14d</Badge>
          </div>
          <Sparkline data={Array(14).fill(0)} color="var(--accent)" height={90} />
          <div className={s.chartFooter}>
            <span>Hace 14 días</span>
            <span>Hoy</span>
          </div>
        </Card>

        <Card>
          <div className={s.chartLabel} style={{ marginBottom: 12 }}>Distribución de estrellas</div>
          {starCounts.map(({ star, count }) => {
            const pct = reviews.length ? (count / reviews.length) * 100 : 0;
            const fillColor = star >= 4 ? 'var(--accent)' : star === 3 ? 'var(--warn)' : 'var(--bad)';
            return (
              <div key={star} className={s.starRow}>
                <span className={s.starNum}>{star}</span>
                <svg width={12} height={12} viewBox="0 0 24 24" fill="var(--accent)" stroke="var(--accent)" strokeWidth="1.6">
                  <path d="M12 2.5l2.9 6 6.6.8-4.8 4.6 1.2 6.6L12 17.4 6.1 20.5l1.2-6.6L2.5 9.3l6.6-.8z" />
                </svg>
                <div className={s.starBar}>
                  <div className={s.starFill} style={{ width: `${pct}%`, background: fillColor }} />
                </div>
                <span className={s.starCount}>{count}</span>
              </div>
            );
          })}
        </Card>
      </div>

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
            <Card className={s.empty}>
              Aún no hay reseñas para este negocio.
            </Card>
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
                  {new Date(rep.periodStart).toLocaleDateString('es-CL')} – {new Date(rep.periodEnd).toLocaleDateString('es-CL')} · {rep.status}
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </>
  );
}
