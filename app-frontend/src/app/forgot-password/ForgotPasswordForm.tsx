"use client";

import { useState } from "react";
import Link from "next/link";
import { forgotPassword } from "@/features/auth/lib/auth-client";
import AuthLayout from "@/features/auth/components/layout/AuthLayout";
import ForgotPasswordPanel from "@/features/auth/components/panels/ForgotPasswordPanel";
import s from "@/features/auth/components/layout/AuthLayout.module.css";
import styles from "./forgot-password.module.css";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await forgotPassword(email);
      setSuccess(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al enviar el correo");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      topLinkText="¿Recordaste tu contraseña?"
      topLinkCta="Inicia sesión →"
      topLinkHref="/login"
      rightPanel={<ForgotPasswordPanel />}
    >
      <span className={s.badge}>
        <span className={s.badgeIcon}>✦</span>
        Recupera tu acceso
      </span>

      <h1 className={styles.title}>
        ¿Olvidaste tu <span className={styles.accent}>contraseña</span>?
      </h1>

      <p className={styles.subtitle}>
        Ingresa tu correo y te enviaremos un enlace para recuperar el acceso.
      </p>

      {success ? (
        <div className={styles.successCard}>
          <p className={styles.successTitle}>¡Correo enviado!</p>
          <p className={styles.successDesc}>
            Revisa tu bandeja de entrada. El enlace expira en 15 minutos.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className={s.form}>
          <div className={s.field}>
            <label htmlFor="email">Correo</label>
            <input
              id="email"
              type="email"
              placeholder="tu@negocio.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          {error && <p className={s.error}>{error}</p>}

          <button type="submit" className={s.submitBtn} disabled={loading}>
            {loading ? "Enviando..." : "Enviar enlace de recuperación →"}
          </button>
        </form>
      )}

      <p className={s.switchLinkMobile}>
        ¿Recordaste tu contraseña? <Link href="/login" prefetch={false}>Inicia sesión →</Link>
      </p>
    </AuthLayout>
  );
}
