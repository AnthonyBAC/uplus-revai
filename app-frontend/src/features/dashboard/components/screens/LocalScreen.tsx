'use client';

import { useReducer, useState } from 'react';
import SectionHead from '../ui/SectionHead';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Btn from '../ui/Btn';
import Icon from '../primitives/Icon';
import Placeholder from '../primitives/Placeholder';
import Field from '../ui/Field';
import type { LocalData } from '@/features/dashboard/hooks/useLocal';
import s from './LocalScreen.module.css';

interface LocalScreenProps {
  data: LocalData;
  onUpdateField: (field: 'name' | 'hours' | 'phone', value: string) => void;
  onToggleIntegration: (id: string) => void;
}

type DraftState = Partial<Pick<LocalData, 'name' | 'hours' | 'phone'>>;

type DraftAction =
  | { type: 'set'; field: keyof DraftState; value: string }
  | { type: 'reset' };

function reducer(state: DraftState, action: DraftAction): DraftState {
  switch (action.type) {
    case 'set':
      return { ...state, [action.field]: action.value };
    case 'reset':
      return {};
    default:
      return state;
  }
}

export default function LocalScreen({ data, onUpdateField, onToggleIntegration }: LocalScreenProps) {
  const [draft, dispatch] = useReducer(reducer, {});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const name = draft.name ?? data.name;
  const hours = draft.hours ?? data.hours;
  const phone = draft.phone ?? data.phone;

  const dirty = name !== data.name || hours !== data.hours || phone !== data.phone;

  const save = () => {
    setSaving(true);
    setTimeout(() => {
      onUpdateField('name', name);
      onUpdateField('hours', hours);
      onUpdateField('phone', phone);
      dispatch({ type: 'reset' });
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 1800);
    }, 600);
  };

  return (
    <>
      <SectionHead title="Mi local" sub="Datos públicos y conexiones" />

      <Card className={s.profileCard}>
        <Placeholder label="foto de portada · 1600×600" height={160} style={{ borderRadius: 0, border: 'none', borderBottom: '1px solid var(--line)' }} />
        <div className={s.fields}>
          <Field label="Nombre" value={name} onChange={(value) => dispatch({ type: 'set', field: 'name', value })} />
          <Field label="Teléfono" value={phone} onChange={(value) => dispatch({ type: 'set', field: 'phone', value })} />
          <Field label="Horario" value={hours} onChange={(value) => dispatch({ type: 'set', field: 'hours', value })} full />
          <div className={s.saveRow}>
            {saved && (
              <Badge tone="good">
                <Icon name="check" size={12} stroke={2.5} /> Guardado
              </Badge>
            )}
            <Btn kind="primary" disabled={!dirty || saving} onClick={save} icon={saving ? undefined : 'check'}>
              {saving ? 'Guardando…' : 'Guardar cambios'}
            </Btn>
          </div>
        </div>
      </Card>

      <SectionHead title="Conexiones" />
      <div className={s.integGrid}>
        {data.integrations.map((c) => (
          <Card key={c.id} className={s.integCard}>
            <div className={s.integRow}>
              <div className={s.integLogo} style={{ background: c.color }}>{c.name[0]}</div>
              <div>
                <div className={s.integName}>{c.name}</div>
                <div className={s.integNote}>{c.note}</div>
              </div>
            </div>
            <Btn
              kind={c.connected ? 'outline' : 'ink'}
              size="sm"
              className={s.integBtn}
              onClick={() => onToggleIntegration(c.id)}
              style={{ width: '100%', justifyContent: 'center' }}
            >
              {c.connected ? 'Conectado ✓' : 'Conectar'}
            </Btn>
          </Card>
        ))}
      </div>

      <div style={{ marginTop: 18 }}>
        <SectionHead title="Equipo" />
        <Card className={s.teamCard}>
          {data.team.length === 0 ? (
            <div style={{ padding: '20px 0', color: 'var(--ink-mute)', fontSize: 13.5 }}>
              No hay miembros del equipo registrados.
            </div>
          ) : (
            data.team.map((m) => (
              <div key={m.email} className={s.teamRow}>
                <div className={s.teamAvatar}>{m.name[0]}</div>
                <div className={s.teamInfo}>
                  <div className={s.teamName}>{m.name}</div>
                  {m.email && <div className={s.teamEmail}>{m.email}</div>}
                </div>
                <Badge tone="soft">{m.role}</Badge>
              </div>
            ))
          )}
          <div className={s.inviteRow}>
            <Btn kind="outline" size="sm" icon="plus">Invitar persona</Btn>
          </div>
        </Card>
      </div>
    </>
  );
}
