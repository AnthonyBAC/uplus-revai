"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { login } from "@/lib/auth-client";
import { saveSession } from "@/lib/session";
import AuthLayout from "@/components/auth/AuthLayout";
import s from "@/components/auth/AuthLayout.module.css";
import styles from "./login.module.css";

function RightPanel() {
  return (
    <>
      <span className={s.rightTag}>● LO QUE TE ESPERA HOY</span>

      <blockquote className={styles.quote}>
        &ldquo;Antes leía las reseñas los domingos. Ahora U+ Revai me dice qué hacer
        el <span className={s.accent}>lunes en la mañana</span>.&rdquo;
      </blockquote>

      <div className={styles.author}>
        <div className={styles.avatar}>M</div>
        <div>
          <p className={styles.authorName}>María Contreras</p>
          <p className={styles.authorSub}>Café del Barrio · Providencia</p>
        </div>
      </div>

      <div className={styles.actionCard}>
        <span className={s.rightTag}>✦ TU ACCIÓN DE ESTA SEMANA</span>
        <p className={styles.actionTitle}>
          Mejorar tiempos de espera en el almuerzo
        </p>
        <div className={styles.tags}>
          <span className={styles.tagOrange}>Impacto alto</span>
          <span className={styles.tagGray}>3 pasos</span>
          <span className={styles.tagGray}>~2 semanas</span>
        </div>
      </div>
    </>
  );
}

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [navigating, setNavigating] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const session = await login(email, password);
      saveSession(session.accessToken, session.refreshToken);
      setNavigating(true);
      router.replace(session.user.isOnboarded ? "/dashboard" : "/onboarding");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al iniciar sesión");
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      topLinkText="¿Aún no tienes cuenta?"
      topLinkCta="Crear cuenta →"
      topLinkHref="/register"
      rightPanel={<RightPanel />}
    >
      {loading || navigating ? (
        <div className={styles.loadingWrap}>
          <p className={styles.loadingText}>Cargando...</p>
        </div>
      ) : (
        <>
          <span className={s.badge}>
            <span className={s.badgeIcon}>✦</span>
            Bienvenido de vuelta
          </span>

          <h1 className={styles.title}>
            Entra a ver tus <span className={s.accent}>mejoras</span> de la semana.
          </h1>

          <form onSubmit={handleSubmit} className={s.form}>
            <div className={s.field}>
              <label htmlFor="email">Correo</label>
              <input
                id="email"
                type="email"
                placeholder="maria@cafedelbarrio.cl"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className={s.field}>
              <div className={styles.passwordLabel}>
                <label htmlFor="password">Contraseña</label>
                <span className={styles.forgotLink}>
                  ¿La olvidaste?
                </span>
              </div>
              <div className={s.passwordWrapper}>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  className={s.showBtn}
                  onClick={() => setShowPassword((v) => !v)}
                >
                  {showPassword ? "OCULTAR" : "VER"}
                </button>
              </div>
            </div>

            {error && <p className={s.error}>{error}</p>}

            <button type="submit" className={s.submitBtn} disabled={loading}>
              Entrar al panel →
            </button>
          </form>

          <p className={s.switchLinkMobile}>
            ¿Aún no tienes cuenta?{" "}
            <Link href="/register">Crear cuenta →</Link>
          </p>
        </>
      )}
    </AuthLayout>
  );
}
