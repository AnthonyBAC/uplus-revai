"use client";

import { useState } from "react";
import { forgotPassword } from "@/lib/auth-client";
import styles from "./forgot-password.module.css";
import AuthLayout from "@/components/auth/AuthLayout";

function RightPanel() {
    return (
    <div className={styles.rightSide}>
        <span className={styles.rightTag}>● SEGURIDAD DE TU CUENTA</span>

        <h2 className={styles.rightTitle}>
          Tu cuenta está <span className={styles.accent}>protegida</span>.
        </h2>

        <ul className={styles.tipList}>
          <li className={styles.tip}>
            <span className={styles.tipIcon}>🔐</span>
            <div>
              <p className={styles.tipTitle}>Enlace de un solo uso</p>
              <p className={styles.tipDesc}>
                El enlace que enviamos expira en 15 minutos y solo funciona una vez.
              </p>
            </div>
          </li>
          <li className={styles.tip}>
            <span className={styles.tipIcon}>📬</span>
            <div>
              <p className={styles.tipTitle}>Revisa tu spam</p>
              <p className={styles.tipDesc}>
                Si no ves el correo en tu bandeja principal, revisa la carpeta de spam.
              </p>
            </div>
          </li>
          <li className={styles.tip}>
            <span className={styles.tipIcon}>🛡️</span>
            <div>
              <p className={styles.tipTitle}>Nunca pedimos tu contraseña</p>
              <p className={styles.tipDesc}>
                U+ Revai jamás te solicitará tu contraseña por correo o chat.
              </p>
            </div>
          </li>
        </ul>
      </div>
      )
}

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
        rightPanel={<RightPanel />}
    >
    <div className={styles.split}>
      <div className={styles.formSide}>
        <span className={styles.badge}>✦ Recupera tu acceso</span>

        <h1 className={styles.title}>
          ¿Olvidaste tu <span className={styles.accent}>contraseña</span>?
        </h1>

        <p className={styles.subtitle}>
          Ingresa tu correo y te enviaremos un enlace para recuperar el acceso.
        </p>

        {success ? (
          <div className={styles.successBox}>
            <p className={styles.successTitle}>¡Correo enviado!</p>
            <p className={styles.successDesc}>
              Revisa tu bandeja de entrada. El enlace expira en 15 minutos.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.field}>
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

            {error && <p className={styles.error}>{error}</p>}

            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? "Enviando..." : "Enviar enlace de recuperación →"}
            </button>
          </form>
        )}
      </div>
    </div>
    </AuthLayout>
  );
}