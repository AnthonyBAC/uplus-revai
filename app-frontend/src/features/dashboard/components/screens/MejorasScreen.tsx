'use client';

import { useState } from 'react';
import SectionHead from '../ui/SectionHead';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Btn from '../ui/Btn';
import Kpi from '../ui/Kpi';
import Icon from '../primitives/Icon';
import ImpactDot from '../ui/ImpactDot';
import ActionDetailModal from '../shell/ActionDetailModal';
import type { Action } from '@/features/dashboard/hooks/useActions';
import s from './MejorasScreen.module.css';

interface MejorasScreenProps {
  actions: Action[];
  onUpdate: (id: string, patch: Partial<Action>) => void;
  totalReviews: number;
  loading: boolean;
  error: string | null;
}

export default function MejorasScreen({ actions, onUpdate, totalReviews, loading, error }: MejorasScreenProps) {
  const [filter, setFilter] = useState<'todas' | 'sugerida' | 'en-curso' | 'completada'>('todas');
  const [openAction, setOpenAction] = useState<Action | null>(null);

  const visible = actions.filter((a) => filter === 'todas' || a.status === filter);
  const counts = {
    todas:      actions.length,
    sugerida:   actions.filter((a) => a.status === 'sugerida').length,
    'en-curso': actions.filter((a) => a.status === 'en-curso').length,
    completada: actions.filter((a) => a.status === 'completada').length,
  };
  const priorit = actions.filter((a) => a.impact === 'alto' && a.status !== 'completada').length;

  const FILTER_OPTS = [
    ['todas', 'Todas'],
    ['sugerida', 'Sugeridas'],
    ['en-curso', 'En curso'],
    ['completada', 'Completadas'],
  ] as const;

  if (loading) {
    return <div style={{ color: 'var(--ink-mute)', padding: 40, textAlign: 'center' }}>Cargando…</div>;
  }

  if (error) {
    return (
      <>
        <SectionHead title="Tus mejoras" />
        <Card style={{ textAlign: 'center', color: 'var(--ink-mute)', padding: 40, fontSize: 14 }}>
          {error}
        </Card>
      </>
    );
  }

  if (actions.length === 0) {
    return (
      <>
        <SectionHead title="Tus mejoras" />
        <Card style={{ textAlign: 'center', color: 'var(--ink-mute)', padding: 40, fontSize: 14 }}>
          Cuando tengas reseñas, la IA generará acciones de mejora aquí.
        </Card>
      </>
    );
  }

  return (
    <>
      <SectionHead
        title="Tus mejoras esta semana"
        right={<Badge tone="accent">+ {totalReviews} reseñas</Badge>}
      />

      <div className={s.kpis}>
        <Kpi label="Reseñas" value={totalReviews} sub="en total" accent="var(--accent-deep)" />
        <Kpi label="Acciones" value={actions.filter((a) => a.status !== 'completada').length} sub={`${priorit} prioritarias`} accent="var(--accent-deep)" />
        <Kpi label="Completadas" value={counts.completada} sub="esta semana" accent="var(--good)" />
      </div>

      <div className={s.chips}>
        {FILTER_OPTS.map(([id, label]) => (
          <button
            key={id}
            onClick={() => setFilter(id)}
            className={[s.chip, filter === id ? s.chipActive : ''].join(' ')}
          >
            {label} <span className={s.chipCount}>{counts[id]}</span>
          </button>
        ))}
      </div>

      <div className={s.list}>
        {visible.map((a) => (
          <Card
            key={a.id}
            className={s.actionCard}
            hover
            style={{
              borderLeft: a.status === 'completada' ? '3px solid var(--good)' :
                          a.status === 'en-curso'   ? '3px solid var(--warn)' :
                          '3px solid var(--accent)',
            }}
          >
            <div className={s.actionHeader}>
              <Badge tone="soft" size="sm">
                {a.status === 'completada' ? '✓ COMPLETADA' : a.status === 'en-curso' ? 'EN CURSO' : 'ACCIÓN SUGERIDA'}
              </Badge>
              <Badge tone="ink" size="sm">IA</Badge>
            </div>
            <h3 className={s.actionTitle}>{a.title}</h3>
            <p className={s.actionBody}>{a.why}</p>

            {a.status === 'en-curso' && (
              <div className={s.progress}>
                <div className={s.progressMeta}>
                  <span>Progreso</span><span>{a.progress}%</span>
                </div>
                <div className={s.progressBar}>
                  <div className={s.progressFill} style={{ width: `${a.progress}%` }} />
                </div>
              </div>
            )}

            <div className={s.actionFooter}>
              <Badge tone={a.impact === 'alto' ? 'accent' : a.impact === 'medio' ? 'warn' : 'good'}>
                <ImpactDot impact={a.impact} /> Impacto {a.impact}
              </Badge>
              <Badge tone="soft"><Icon name="check" size={12} stroke={2.2} /> {a.steps} {a.steps === 1 ? 'paso' : 'pasos'}</Badge>
              <Badge tone="soft"><Icon name="clock" size={12} stroke={2.2} /> {a.eta}</Badge>
              <div className={s.spacer} />
              <Btn kind="ghost" size="sm" onClick={() => setOpenAction(a)}>
                Ver detalle <Icon name="arrow" size={13} stroke={2} />
              </Btn>
              {a.status === 'sugerida' && (
                <Btn kind="ink" size="sm" onClick={() => onUpdate(a.id, { status: 'en-curso', progress: 10 })}>Aceptar</Btn>
              )}
              {a.status === 'en-curso' && (
                <Btn kind="primary" size="sm" onClick={() => onUpdate(a.id, { status: 'completada', progress: 100 })}>Marcar lista</Btn>
              )}
            </div>
          </Card>
        ))}

        {visible.length === 0 && (
          <Card style={{ textAlign: 'center', color: 'var(--ink-mute)', padding: 28 }}>
            No hay acciones en este filtro.
          </Card>
        )}
      </div>

      <ActionDetailModal action={openAction} onClose={() => setOpenAction(null)} onUpdate={onUpdate} />
    </>
  );
}
