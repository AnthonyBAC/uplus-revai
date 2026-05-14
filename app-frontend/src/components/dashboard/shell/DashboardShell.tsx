'use client';

import { useState } from 'react';
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

  return (
    <div className={s.root}>
      <Sidebar session={session} />
      <div className={s.main}>
        <Topbar />
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
