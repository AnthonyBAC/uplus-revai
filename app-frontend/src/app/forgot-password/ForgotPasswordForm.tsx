"use client";

import { useState } from "react";
import { forgotPassword } from "@/lib/auth-client";
import AuthLayout from "@/components/auth/AuthLayout";
import s from "@/components/auth/AuthLayout.module.css";

function RightPanel() {
  return (
    <>
      <span className={s.rightTag}>● SEGURIDAD DE TU CUENTA</span>

      <h2 style={{ fontSize: "1.9rem", fontWeight: 700, lineHeight: 1.3, fontFamily: "var(--font-title)" }}>
        Tu cuenta está <span style={{ color: "var(--color-accent-primary)" }}>protegida</span>.
      </h2>

      <ul style={{ display: "flex", flexDirection: "column", gap: "1.5rem", listStyle: "none", padding: 0, margin: 0 }}>
        <li style={{ display: "flex", alignItems: "flex-start", gap: "1.2rem" }}>
          <span style={{ fontSize: "1.4rem", flexShrink: 0 }}>🔐</span>
          <div>
            <p style={{ fontWeight: 600, fontSize: "0.95rem", color: "var(--color-bg-white)", margin: "0 0 0.2rem" }}>Enlace de un solo uso</p>
            <p style={{ fontSize: "0.85rem", color: "var(--color-gray-500)", margin: 0, lineHeight: 1.5 }}>
              El enlace que enviamos expira en 15 minutos y solo funciona una vez.
            </p>
          </div>
        </li>
        <li style={{ display: "flex", alignItems: "flex-start", gap: "1.2rem" }}>
          <span style={{ fontSize: "1.4rem", flexShrink: 0 }}>📬</span>
          <div>
            <p style={{ fontWeight: 600, fontSize: "0.95rem", color: "var(--color-bg-white)", margin: "0 0 0.2rem" }}>Revisa tu spam</p>
            <p style={{ fontSize: "0.85rem", color: "var(--color-gray-500)", margin: 0, lineHeight: 1.5 }}>
              Si no ves el correo en tu bandeja principal, revisa la carpeta de spam.
            </p>
          </div>
        </li>
        <li style={{ display: "flex", alignItems: "flex-start", gap: "1.2rem" }}>
          <span style={{ fontSize: "1.4rem", flexShrink: 0 }}>🛡️</span>
          <div>
            <p style={{ fontWeight: 600, fontSize: "0.95rem", color: "var(--color-bg-white)", margin: "0 0 0.2rem" }}>Nunca pedimos tu contraseña</p>
            <p style={{ fontSize: "0.85rem", color: "var(--color-gray-500)", margin: 0, lineHeight: 1.5 }}>
              U+ Revai jamás te solicitará tu contraseña por correo o chat.
            </p>
          </div>
        </li>
      </ul>
    </>
  );
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
      <span className={s.badge}>
        <span className={s.badgeIcon}>✦</span>
        Recupera tu acceso
      </span>

      <h1 style={{ fontSize: "2.1rem", fontWeight: 800, lineHeight: 1.2, color: "var(--color-text-primary)", maxWidth: 380 }}>
        ¿Olvidaste tu <span style={{ color: "var(--color-accent-primary)" }}>contraseña</span>?
      </h1>

      <p style={{ fontSize: "0.92rem", color: "var(--color-text-secondary)", maxWidth: 380 }}>
        Ingresa tu correo y te enviaremos un enlace para recuperar el acceso.
      </p>

      {success ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", background: "#edf7ed", borderRadius: 10, padding: "1.5rem", maxWidth: 400 }}>
          <p style={{ fontSize: "1rem", fontWeight: 700, color: "#2e7d32", margin: 0 }}>¡Correo enviado!</p>
          <p style={{ fontSize: "0.88rem", color: "#388e3c", margin: 0 }}>
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
    </AuthLayout>
  );
}