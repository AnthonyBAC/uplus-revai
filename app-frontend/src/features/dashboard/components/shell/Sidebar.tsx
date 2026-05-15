'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Icon from '../primitives/Icon';
import { useBusiness } from '../BusinessContext';
import type { SessionResponse } from '@/types/api/session';
import BrandLogo from '@/components/layout/BrandLogo';
import s from './Sidebar.module.css';

const NAV = [
  { id: 'resumen',  label: 'Resumen',  icon: 'bar'   as const, href: '/dashboard' },
  { id: 'resenas',  label: 'Reseñas',  icon: 'star'  as const, href: '/dashboard/resenas' },
  { id: 'mejoras',  label: 'Mejoras',  icon: 'trend' as const, href: '/dashboard/mejoras' },
  { id: 'insights', label: 'Insights', icon: 'eye'   as const, href: '/dashboard/insights' },
  { id: 'local',    label: 'Local',    icon: 'home'  as const, href: '/dashboard/local' },
];

interface SidebarProps {
  session: SessionResponse;
  counts?: Partial<Record<string, number>>;
}

export default function Sidebar({ session, counts = {} }: SidebarProps) {
  const pathname = usePathname();
  const { activeMembership } = useBusiness();

  const initial = (session.fullName ?? session.email ?? '?')[0].toUpperCase();

  return (
    <aside className={s.sidebar}>
      <div className={s.brand}>
        <BrandLogo variant="pastel" />
      </div>

      <nav className={s.nav}>
        {NAV.map((n) => {
          const active = n.href === '/dashboard'
            ? pathname === '/dashboard'
            : pathname.startsWith(n.href);
          const count = counts[n.id] ?? 0;
          return (
            <Link
              key={n.id}
              href={n.href}
              className={[s.navBtn, active ? s.active : ''].join(' ')}
            >
              {active && <span className={s.activeBar} />}
              <Icon
                name={n.icon}
                size={17}
                stroke={1.8}
                style={{ color: active ? 'var(--accent)' : 'var(--sidebar-mute)', flexShrink: 0 }}
              />
              <span style={{ flex: 1 }}>{n.label}</span>
              {count > 0 && (
                <span className={[s.count, active ? s.countActive : ''].join(' ')}>
                  {count}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className={s.promo}>
        <div className={s.promoBox}>
          <Icon name="sparkle" size={16} stroke={2} style={{ color: 'var(--accent)' }} />
          <div className={s.promoTitle}>Plan Pro</div>
          <div className={s.promoSub}>Acciones IA ilimitadas y respuestas automáticas.</div>
          <button className={s.promoBtn}>Probar 14 días</button>
        </div>
      </div>

      <div className={s.user}>
        <div className={s.avatar}>{initial}</div>
        <div className={s.userInfo}>
          <div className={s.userName}>{session.fullName ?? session.email}</div>
          <div className={s.userBiz}>{activeMembership?.businessName ?? '—'}</div>
        </div>
        <button className={s.settingsBtn}>
          <Icon name="settings" size={15} />
        </button>
      </div>
    </aside>
  );
}
