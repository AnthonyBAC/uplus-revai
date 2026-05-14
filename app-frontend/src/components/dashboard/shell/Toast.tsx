'use client';

import { useEffect } from 'react';
import Icon from '../primitives/Icon';
import s from './Toast.module.css';

interface ToastProps {
  msg: string;
  onClose: () => void;
}

export default function Toast({ msg, onClose }: ToastProps) {
  useEffect(() => {
    if (!msg) return;
    const t = setTimeout(onClose, 2400);
    return () => clearTimeout(t);
  }, [msg, onClose]);

  if (!msg) return null;
  return (
    <div className={s.toast}>
      <Icon name="check" size={14} stroke={2.5} style={{ color: 'var(--accent)' }} />
      {msg}
    </div>
  );
}
