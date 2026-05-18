'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import Toast from './Toast';
import type { SessionResponse } from '@/types/api/session';
import s from './DashboardShell.module.css';

interface DashboardShellProps {
  session: SessionResponse;
  children: React.ReactNode;
}

export default function DashboardShell({ session, children }: DashboardShellProps) {
  const [toast, setToast] = useState('');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const pathname = usePathname();

  // Cierra el drawer al navegar en móvil
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMobileNavOpen(false);
  }, [pathname]);

  return (
    <div className={s.root}>
      <Sidebar session={session} open={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />
      {mobileNavOpen && <div className={s.backdrop} onClick={() => setMobileNavOpen(false)} />}
      <div className={s.main}>
        <Topbar onOpenMobileNav={() => setMobileNavOpen(true)} />
        <div className={s.scroll}>
          <div className={s.inner}>
            {children}
          </div>
        </div>
      </div>
      <Toast msg={toast} onClose={() => setToast('')} />
    </div>
  );
}
