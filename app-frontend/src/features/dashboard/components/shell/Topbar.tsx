'use client';

import { useState, useRef, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Icon from '../primitives/Icon';
import { useBusiness } from '../BusinessContext';
import { logout } from '@/features/auth/lib/auth-client';
import { getAccessToken, clearSession } from '@/features/auth/lib/session';
import s from './Topbar.module.css';

const PAGE_LABELS: Record<string, string> = {
  '/dashboard':          'Resumen',
  '/dashboard/resenas':  'Reseñas',
  '/dashboard/mejoras':  'Mejoras',
  '/dashboard/insights': 'Insights',
  '/dashboard/local':    'Local',
};

interface TopbarProps {
  noReply?: number;
  highActions?: number;
}

export default function Topbar({ noReply = 0, highActions = 0 }: TopbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { memberships, activeBusinessId, activeMembership, setActiveBusinessId } = useBusiness();
  const [openNotif, setOpenNotif] = useState(false);
  const [period, setPeriod] = useState('7d');
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setOpenNotif(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const pageLabel = PAGE_LABELS[pathname] ?? '';

  const handleLogout = async () => {
    const token = getAccessToken();
    if (token) await logout(token).catch(() => {});
    clearSession();
    router.replace('/login');
  };

  return (
    <div className={s.topbar}>
      <div className={s.breadcrumb}>
        <span className={s.bizName}>{activeMembership?.businessName ?? '—'}</span>
        <span className={s.sep}>/</span>
        <span className={s.page}>{pageLabel}</span>
      </div>

      <div className={s.right}>
        {memberships.length > 1 && (
          <select
            value={activeBusinessId ?? ''}
            onChange={(e) => setActiveBusinessId(e.target.value)}
            className={s.bizSelector}
          >
            {memberships.map((m) => (
              <option key={m.businessId} value={m.businessId}>
                {m.businessName}
              </option>
            ))}
          </select>
        )}

        <div className={s.periodPicker}>
          {(['7d', '30d', '90d'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={[s.periodBtn, period === p ? s.periodActive : ''].join(' ')}
            >
              {p}
            </button>
          ))}
        </div>

        <button className={s.iconBtn}>
          <Icon name="search" size={16} />
        </button>

        <div style={{ position: 'relative' }} ref={notifRef}>
          <button className={s.iconBtn} onClick={() => setOpenNotif((o) => !o)}>
            <Icon name="bell" size={16} />
            {(noReply + highActions) > 0 && <span className={s.dot} />}
          </button>
          {openNotif && (
            <div className={s.dropdown}>
              <div className={s.dropdownHead}>Notificaciones</div>
              {noReply > 0 && (
                <button className={s.notifItem} onClick={() => { router.push('/dashboard/resenas'); setOpenNotif(false); }}>
                  <span className={s.notifDot} style={{ background: 'var(--accent)' }} />
                  <div>
                    <div className={s.notifTitle}>{noReply} reseñas sin responder</div>
                    <div className={s.notifSub}>Responder mejora tu ranking en Google.</div>
                  </div>
                </button>
              )}
              {highActions > 0 && (
                <button className={s.notifItem} onClick={() => { router.push('/dashboard/mejoras'); setOpenNotif(false); }}>
                  <span className={s.notifDot} style={{ background: 'var(--warn)' }} />
                  <div>
                    <div className={s.notifTitle}>{highActions} acciones de alto impacto sugeridas</div>
                    <div className={s.notifSub}>Generadas con IA a partir de tus últimas reseñas.</div>
                  </div>
                </button>
              )}
              <div className={s.notifItem} style={{ cursor: 'default' }}>
                <span className={s.notifDot} style={{ background: '#C8B89E' }} />
                <div>
                  <div className={s.notifTitle} style={{ fontWeight: 500 }}>Reporte semanal listo</div>
                  <div className={s.notifSub}>Resumen de la última semana.</div>
                </div>
              </div>
            </div>
          )}
        </div>

        <button className={s.logoutBtn} onClick={handleLogout}>
          Salir
        </button>
      </div>
    </div>
  );
}
