'use client';

import { useState, useMemo } from 'react';
import SectionHead from '../ui/SectionHead';
import Card from '../ui/Card';
import Btn from '../ui/Btn';
import Icon from '../primitives/Icon';
import BarChart from '../primitives/BarChart';
import Donut from '../primitives/Donut';
import ReviewCard, { type ReviewItem } from '../ReviewCard';
import s from './ResenasScreen.module.css';

interface ResenasScreenProps {
  reviews: ReviewItem[];
  loading: boolean;
  error: string | null;
  onReply: (id: string, text: string) => void;
}

export default function ResenasScreen({ reviews, loading, error, onReply }: ResenasScreenProps) {
  const [filter, setFilter] = useState('todas');
  const [source, setSource] = useState('Todas');
  const [query, setQuery] = useState('');

  const starDist = useMemo(
    () =>
      [5, 4, 3, 2, 1].map((star) => ({
        label: `${star}★`,
        value: reviews.filter((r) => r.rating === star).length,
        color: star >= 4 ? 'var(--good)' : star === 3 ? 'var(--warn)' : 'var(--bad)',
      })),
    [reviews],
  );

  const sourceDist = useMemo(() => {
    const counts = new Map<string, number>();
    reviews.forEach((r) => counts.set(r.source, (counts.get(r.source) ?? 0) + 1));
    const palette = ['#D9684D', '#4F7A4A', '#C28427', '#1877F2', '#8E827A', '#34E0A1'];
    return Array.from(counts.entries()).map(([label, value], i) => ({
      label,
      value,
      color: palette[i % palette.length],
    }));
  }, [reviews]);

  if (loading) return <div className={s.loading}>Cargando…</div>;

  const list = reviews.filter((r) => {
    if (filter === 'sin-respuesta' && r.reply) return false;
    if (filter === 'negativas' && r.rating > 3) return false;
    if (filter === 'positivas' && r.rating < 4) return false;
    if (source !== 'Todas' && r.source !== source) return false;
    if (
      query &&
      !r.text.toLowerCase().includes(query.toLowerCase()) &&
      !r.name.toLowerCase().includes(query.toLowerCase())
    )
      return false;
    return true;
  });

  const noReply = reviews.filter((r) => !r.reply).length;

  return (
    <>
      <SectionHead
        title="Reseñas"
        sub={`${reviews.length} reseñas · ${noReply} sin respuesta`}
        right={<Btn kind="outline" icon="download" size="sm">Exportar</Btn>}
      />

      {error && (
        <Card style={{ padding: 20, color: 'var(--ink-mute)', textAlign: 'center', marginBottom: 14 }}>
          {error === 'not-implemented' ? 'El listado de reseñas estará disponible próximamente.' : error}
        </Card>
      )}

      {!error && reviews.length > 0 && (
        <div className="grid-split" style={{ marginBottom: 14 }}>
          <Card>
            <div className={s.chartLabel} style={{ marginBottom: 12 }}>Distribución por estrellas</div>
            <BarChart data={starDist} height={140} />
          </Card>
          <Card>
            <div className={s.chartLabel} style={{ marginBottom: 12 }}>Por fuente</div>
            <Donut data={sourceDist} size={130} thickness={20} center={{ value: reviews.length, label: 'reseñas' }} />
          </Card>
        </div>
      )}

      {!error && (
        <>
          <Card style={{ padding: 10, marginBottom: 14, display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            <div className={s.searchWrap}>
              <Icon name="search" size={16} stroke={2} style={{ color: 'var(--ink-mute)', marginLeft: 4 }} />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar en reseñas…"
                className={s.searchInput}
              />
            </div>
            <select value={source} onChange={(e) => setSource(e.target.value)} className={s.sourceSelect}>
              <option>Todas</option>
              <option>Google</option>
              <option>TripAdvisor</option>
            </select>
          </Card>

          <div className={s.chips}>
            {([['todas', 'Todas'], ['sin-respuesta', 'Sin respuesta'], ['negativas', '≤3 ★'], ['positivas', '≥4 ★']] as const).map(([id, label]) => (
              <button
                key={id}
                onClick={() => setFilter(id)}
                className={[s.chip, filter === id ? s.chipActive : ''].join(' ')}
              >
                {label}
              </button>
            ))}
          </div>

          <div className={s.list}>
            {list.map((r) => (
              <ReviewCard key={r.id} r={r} onReply={(text) => onReply(r.id, text)} />
            ))}
            {list.length === 0 && (
              <Card style={{ textAlign: 'center', color: 'var(--ink-mute)', padding: 30 }}>
                {reviews.length === 0 ? 'Aún no hay reseñas para este negocio.' : 'Sin resultados para este filtro.'}
              </Card>
            )}
          </div>
        </>
      )}
    </>
  );
}
