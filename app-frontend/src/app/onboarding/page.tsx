'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '@/hooks/useSession';
import { getAccessToken, getRefreshToken, saveSession } from '@/lib/session';
import { registerBusiness, refresh } from '@/lib/auth-client';
import AuthLayout from '@/components/auth/AuthLayout';
import s from '@/components/auth/AuthLayout.module.css';
import styles from './onboarding.module.css';

function RightPanel() {
  return (
    <>
      <h2 className={styles.rightTitle}>
        Centraliza tus reseñas en <span className={s.accent}>un solo lugar</span>.
      </h2>

      <ol className={styles.stepList}>
        <li className={styles.step}>
          <span className={styles.stepNumber}>01</span>
          <div>
            <p className={styles.stepTitle}>Creas tu negocio aquí</p>
            <p className={styles.stepDesc}>
              Solo necesitas el nombre. El resto lo hacemos nosotros.
            </p>
          </div>
        </li>
        <li className={styles.step}>
          <span className={styles.stepNumber}>02</span>
          <div>
            <p className={styles.stepTitle}>Conectas Google Reviews</p>
            <p className={styles.stepDesc}>
              Importamos tu histórico completo en minutos.
            </p>
          </div>
        </li>
        <li className={styles.step}>
          <span className={styles.stepNumber}>03</span>
          <div>
            <p className={styles.stepTitle}>Recibes tu plan de mejoras</p>
            <p className={styles.stepDesc}>
              Cada lunes, 3 acciones priorizadas por impacto.
            </p>
          </div>
        </li>
      </ol>
    </>
  );
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export default function OnboardingPage() {
  const router = useRouter();
  const { status, session } = useSession();
  const [businessName, setBusinessName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [navigating, setNavigating] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/login');
    }
    if (status === 'authenticated' && session?.isOnboarded) {
      router.replace('/dashboard');
    }
  }, [status, session, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const token = getAccessToken();
    if (!token) {
      setError('Sesión expirada. Vuelve a iniciar sesión.');
      setLoading(false);
      return;
    }

    const slug = slugify(businessName);

    try {
      await registerBusiness(
        {
          fullName: session?.fullName ?? '',
          businessName: businessName.trim(),
          businessSlug: slug,
        },
        token
      );

      const refreshToken = getRefreshToken();
      if (refreshToken) {
        try {
          const renewed = await refresh(refreshToken);
          saveSession(renewed.accessToken, renewed.refreshToken);
        } catch {
        }
      }

      setNavigating(true);
      router.replace('/dashboard');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al crear el negocio');
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      topLinkText=""
      topLinkCta="Cerrar sesión"
      topLinkHref="/login"
      rightPanel={<RightPanel />}
    >
      <span className={s.badge}>
        <span className={s.badgeIcon}>✦</span>
        Configura tu negocio
      </span>

      <h1 className={styles.title}>
        ¿Cómo se llama tu <span className={s.accent}>negocio</span>?
      </h1>

      <p className={styles.subtitle}>
        Crea tu primer negocio para empezar a analizar reseñas.
      </p>

      <form onSubmit={handleSubmit} className={s.form}>
        <div className={s.field}>
          <label htmlFor="businessName">Nombre del negocio</label>
          <input
            id="businessName"
            type="text"
            placeholder="Mi Negocio"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            required
            disabled={loading || navigating}
          />
        </div>

{businessName.trim() && (
              <p className={styles.slugPreview}>
                Tu espacio: <strong>{slugify(businessName)}</strong>
              </p>
            )}

        {error && <p className={s.error}>{error}</p>}

        <button type="submit" className={s.submitBtn} disabled={loading || navigating}>
          {loading || navigating ? "Creando negocio..." : "Crear negocio →"}
        </button>
      </form>
    </AuthLayout>
  );
}