"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { resetPassword } from "@/features/auth/lib/auth-client";
import AuthLayout from "@/features/auth/components/layout/AuthLayout";
import ResetPasswordPanel from "@/features/auth/components/panels/ResetPasswordPanel";
import s from "@/features/auth/components/layout/AuthLayout.module.css";
import styles from "./reset-password.module.css";

function parseRecoveryHash() {
  if (typeof window === "undefined") return { accessToken: "", refreshToken: "", valid: false };
  const params = new URLSearchParams(window.location.hash.replace("#", ""));
  const accessToken = params.get("access_token") ?? "";
  const refreshToken = params.get("refresh_token") ?? "";
  const type = params.get("type");
  return { accessToken, refreshToken, valid: type === "recovery" && !!accessToken };
}

export default function ResetPasswordForm() {
  const router = useRouter();
  const { accessToken, refreshToken, valid } = useMemo(() => parseRecoveryHash(), []);

  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(() => valid ? "" : "El enlace de recuperación es inválido o ya fue usado.");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => router.push("/login"), 3000);
      return () => clearTimeout(timer);
    }
  }, [success, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await resetPassword(accessToken, refreshToken, newPassword);
      setSuccess(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al restablecer la contraseña");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      topLinkText="¿Recordaste tu contraseña?"
      topLinkCta="Inicia sesión →"
      topLinkHref="/login"
      rightPanel={<ResetPasswordPanel />}
    >
      <span className={s.badge}>
        <span className={s.badgeIcon}>✦</span>
        Restablece tu contraseña
      </span>

      <h1 className={styles.title}>
        Crea una nueva <span className={styles.accent}>contraseña</span>.
      </h1>

      <p className={styles.subtitle}>
        Usa al menos 8 caracteres combinando letras, números y símbolos.
      </p>

      {success ? (
        <div className={styles.successCard}>
          <p className={styles.successTitle}>¡Contraseña actualizada!</p>
          <p className={styles.successDesc}>
            Serás redirigido al login en unos segundos.
          </p>
          <Link href="/login" className={styles.successLink}>
            Ir al login ahora →
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className={s.form}>
          <div className={s.field}>
            <label htmlFor="newPassword">Nueva contraseña</label>
            <div className={s.passwordWrapper}>
              <input
                id="newPassword"
                type={showPassword ? "text" : "password"}
                placeholder="mín. 8 caracteres"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={8}
                disabled={loading || !valid}
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

          <button type="submit" className={s.submitBtn} disabled={loading || !valid}>
            {loading ? "Guardando..." : "Guardar nueva contraseña →"}
          </button>
        </form>
      )}
    </AuthLayout>
  );
}
