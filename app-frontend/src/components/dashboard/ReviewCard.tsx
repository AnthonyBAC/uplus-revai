'use client';

import { useState } from 'react';
import Card from './ui/Card';
import Btn from './ui/Btn';
import Stars from './primitives/Stars';
import s from './ReviewCard.module.css';

export interface ReviewItem {
  id: string;
  name: string;
  initial: string;
  rating: number;
  date: string;
  source: string;
  text: string;
  tags?: string[];
  reply: string | null;
}

interface ReviewCardProps {
  r: ReviewItem;
  onReply: (text: string) => void;
}

export default function ReviewCard({ r, onReply }: ReviewCardProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState('');

  const submit = () => {
    if (!draft.trim()) return;
    onReply(draft);
    setEditing(false);
    setDraft('');
  };

  const tone = r.rating >= 4 ? 'good' : r.rating >= 3 ? 'warn' : 'bad';
  const bgColor = tone === 'good' ? '#E5EEDD' : tone === 'warn' ? '#F6E9CC' : '#F2D9D2';

  return (
    <Card className={s.card}>
      <div className={s.row}>
        <div className={s.initial} style={{ background: bgColor }}>{r.initial}</div>
        <div className={s.content}>
          <div className={s.nameRow}>
            <div className={s.name}>{r.name}</div>
            <Stars value={r.rating} />
          </div>
          <div className={s.meta}>
            <span>{r.source}</span>
            <span>·</span>
            <span>{r.date}</span>
            {r.tags?.map((t) => <span key={t} className={s.tag}>{t}</span>)}
          </div>
          <div className={s.text}>{r.text}</div>

          {r.reply && !editing && (
            <div className={s.reply}>
              <div className={s.replyLabel}>Tu respuesta</div>
              <div className={s.replyText}>{r.reply}</div>
            </div>
          )}

          {!r.reply && !editing && (
            <div className={s.actions}>
              <Btn kind="outline" size="sm" icon="msg" onClick={() => setEditing(true)}>Responder</Btn>
              <Btn kind="ghost" size="sm" icon="sparkle" disabled title="Próximamente">Sugerir con IA</Btn>
            </div>
          )}

          {editing && (
            <>
              <textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Escribe una respuesta…"
                className={s.textarea}
              />
              <div className={s.editActions}>
                <Btn kind="ghost" size="sm" onClick={() => { setEditing(false); setDraft(''); }}>Cancelar</Btn>
                <Btn kind="primary" size="sm" icon="arrow" onClick={submit}>Enviar</Btn>
              </div>
            </>
          )}
        </div>
      </div>
    </Card>
  );
}
