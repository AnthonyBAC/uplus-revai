"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { resetPassword } from "@/lib/auth-client";
import AuthLayout from "@/components/auth/AuthLayout";
import s from "@/components/auth/AuthLayout.module.css";

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
    <>
      <span className={s.rightTag}>● CREA UNA CONTRASEÑA SEGURA</span>
      <h2 style={{ fontSize: "1.9rem", fontWeight: 700, lineHeight: 1.3, fontFamily: "var(--font-title)" }}>
        Una buena contraseña es tu{" "}
        <span style={{ color: "var(--color-accent-primary)" }}>primera línea</span> de defensa.
      </h2>
      <ul style={{ display: "flex", flexDirection: "column", gap: "1.5rem", listStyle: "none", padding: 0, margin: 0 }}>
        <li style={{ display: "flex", alignItems: "flex-start", gap: "1.2rem" }}>
          <span style={{ fontSize: "1.4rem", flexShrink: 0 }}>🔤</span>
          <div>
            <p style={{ fontWeight: 600, fontSize: "0.95rem", color: "var(--color-bg-white)", margin: "0 0 0.2rem" }}>Mínimo 8 caracteres</p>
            <p style={{ fontSize: "0.85rem", color: "var(--color-gray-500)", margin: 0, lineHeight: 1.5 }}>Mientras más larga, más difícil de adivinar.</p>
          </div>
        </li>
        <li style={{ display: "flex", alignItems: "flex-start", gap: "1.2rem" }}>
          <span style={{ fontSize: "1.4rem", flexShrink: 0 }}>🔢</span>
          <div>
            <p style={{ fontWeight: 600, fontSize: "0.95rem", color: "var(--color-bg-white)", margin: "0 0 0.2rem" }}>Mezcla letras y números</p>
            <p style={{ fontSize: "0.85rem", color: "var(--color-gray-500)", margin: 0, lineHeight: 1.5 }}>Combina mayúsculas, minúsculas, números y símbolos.</p>
          </div>
        </li>
        <li style={{ display: "flex", alignItems: "flex-start", gap: "1.2rem" }}>
          <span style={{ fontSize: "1.4rem", flexShrink: 0 }}>🚫</span>
          <div>
            <p style={{ fontWeight: 600, fontSize: "0.95rem", color: "var(--color-bg-white)", margin: "0 0 0.2rem" }}>No reutilices contraseñas</p>
            <p style={{ fontSize: "0.85rem", color: "var(--color-gray-500)", margin: 0, lineHeight: 1.5 }}>Usa una contraseña única para cada servicio que uses.</p>
          </div>
        </li>
      </ul>
    </>
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
      <span className={s.badge}>
        <span className={s.badgeIcon}>✦</span>
        Restablece tu contraseña
      </span>

      <h1 style={{ fontSize: "2.1rem", fontWeight: 800, lineHeight: 1.2, color: "var(--color-text-primary)", maxWidth: 380 }}>
        Crea una nueva <span style={{ color: "var(--color-accent-primary)" }}>contraseña</span>.
      </h1>

      <p style={{ fontSize: "0.92rem", color: "var(--color-text-secondary)", maxWidth: 380 }}>
        Usa al menos 8 caracteres combinando letras, números y símbolos.
      </p>

      {success ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", background: "#edf7ed", borderRadius: 10, padding: "1.5rem", maxWidth: 400 }}>
          <p style={{ fontSize: "1rem", fontWeight: 700, color: "#2e7d32", margin: 0 }}>¡Contraseña actualizada!</p>
          <p style={{ fontSize: "0.88rem", color: "#388e3c", margin: 0 }}>
            Serás redirigido al login en unos segundos.
          </p>
          <Link href="/login" style={{ fontSize: "0.88rem", fontWeight: 600, color: "var(--color-accent-primary)", marginTop: "0.4rem" }}>
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