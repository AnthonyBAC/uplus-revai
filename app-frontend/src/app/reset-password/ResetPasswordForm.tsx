"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { resetPassword } from "@/lib/auth-client";
import styles from "./reset-password.module.css";
import AuthLayout from "@/components/auth/AuthLayout";

function parseRecoveryHash() {
  if (typeof window === "undefined") return { accessToken: "", refreshToken: "", valid: false };
  const params = new URLSearchParams(window.location.hash.replace("#", ""));
  const accessToken = params.get("access_token") ?? "";
  const refreshToken = params.get("refresh_token") ?? "";
  const type = params.get("type");
  return { accessToken, refreshToken, valid: type === "recovery" && !!accessToken };
}

function RightPanel() {
  return (
    <div className={styles.rightSide}>
      <span className={styles.rightTag}>● CREA UNA CONTRASEÑA SEGURA</span>
      <h2 className={styles.rightTitle}>
        Una buena contraseña es tu{" "}
        <span className={styles.accent}>primera línea</span> de defensa.
      </h2>
      <ul className={styles.tipList}>
        <li className={styles.tip}>
          <span className={styles.tipIcon}>🔤</span>
          <div>
            <p className={styles.tipTitle}>Mínimo 8 caracteres</p>
            <p className={styles.tipDesc}>Mientras más larga, más difícil de adivinar.</p>
          </div>
        </li>
        <li className={styles.tip}>
          <span className={styles.tipIcon}>🔢</span>
          <div>
            <p className={styles.tipTitle}>Mezcla letras y números</p>
            <p className={styles.tipDesc}>Combina mayúsculas, minúsculas, números y símbolos.</p>
          </div>
        </li>
        <li className={styles.tip}>
          <span className={styles.tipIcon}>🚫</span>
          <div>
            <p className={styles.tipTitle}>No reutilices contraseñas</p>
            <p className={styles.tipDesc}>Usa una contraseña única para cada servicio que uses.</p>
          </div>
        </li>
      </ul>
    </div>
  );
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
      rightPanel={<RightPanel />}
    >
      <div className={styles.split}>
        <div className={styles.formSide}>
          <span className={styles.badge}>✦ Restablece tu contraseña</span>

          <h1 className={styles.title}>
            Crea una nueva{" "}
            <span className={styles.accent}>contraseña</span>.
          </h1>

          <p className={styles.subtitle}>
            Usa al menos 8 caracteres combinando letras, números y símbolos.
          </p>

          {success ? (
            <div className={styles.successBox}>
              <p className={styles.successTitle}>¡Contraseña actualizada!</p>
              <p className={styles.successDesc}>
                Serás redirigido al login en unos segundos.
              </p>
              <Link href="/login" className={styles.backLink}>
                Ir al login ahora →
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.field}>
                <label htmlFor="newPassword">Nueva contraseña</label>
                <div className={styles.passwordWrapper}>
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
                    className={styles.showBtn}
                    onClick={() => setShowPassword((v) => !v)}
                  >
                    {showPassword ? "OCULTAR" : "VER"}
                  </button>
                </div>
              </div>

              {error && <p className={styles.error}>{error}</p>}

              <button
                type="submit"
                className={styles.submitBtn}
                disabled={loading || !valid}
              >
                {loading ? "Guardando..." : "Guardar nueva contraseña →"}
              </button>
            </form>
          )}
        </div>
      </div>
    </AuthLayout>
  );
}