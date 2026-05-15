'use client';

import Icon from '../primitives/Icon';
import Badge from '../ui/Badge';
import Btn from '../ui/Btn';
import ImpactDot from '../ui/ImpactDot';
import type { Action } from '@/features/dashboard/hooks/useActions';
import s from './ActionDetailModal.module.css';

interface ActionDetailModalProps {
  action: Action | null;
  onClose: () => void;
  onUpdate: (id: string, patch: Partial<Action>) => void;
}

export default function ActionDetailModal({ action, onClose, onUpdate }: ActionDetailModalProps) {
  if (!action) return null;

  return (
    <div className={s.overlay} onClick={onClose}>
      <div className={s.panel} onClick={(e) => e.stopPropagation()}>
        <div className={s.header}>
          <Badge tone="ink">IA · {action.tag}</Badge>
          <button className={s.closeBtn} onClick={onClose}>
            <Icon name="x" size={20} />
          </button>
        </div>

        <h2 className={s.title}>{action.title}</h2>
        <p className={s.body}>{action.why}</p>

        <div className={s.badges}>
          <Badge tone={action.impact === 'alto' ? 'accent' : action.impact === 'medio' ? 'warn' : 'good'}>
            <ImpactDot impact={action.impact} /> Impacto {action.impact}
          </Badge>
          <Badge tone="soft">
            <Icon name="clock" size={12} stroke={2.2} /> {action.eta}
          </Badge>
        </div>

        <div className={s.stepsLabel}>Pasos sugeridos</div>
        <ol className={s.stepsList}>
          {action.detail.map((step, i) => <li key={i}>{step}</li>)}
        </ol>

        <div className={s.footer}>
          {action.status === 'sugerida' && (
            <Btn kind="outline" onClick={() => { onUpdate(action.id, { status: 'descartada' }); onClose(); }}>
              Descartar
            </Btn>
          )}
          {action.status !== 'completada' && (
            <Btn
              kind="primary"
              icon="check"
              onClick={() => {
                onUpdate(action.id, {
                  status: action.status === 'sugerida' ? 'en-curso' : 'completada',
                  progress: action.status === 'sugerida' ? 10 : 100,
                });
                onClose();
              }}
            >
              {action.status === 'sugerida' ? 'Aceptar acción' : 'Marcar lista'}
            </Btn>
          )}
        </div>
      </div>
    </div>
  );
}
