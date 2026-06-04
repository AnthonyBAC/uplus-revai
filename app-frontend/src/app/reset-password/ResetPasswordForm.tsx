"use client";

import { useMemo, useReducer } from "react";
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
  const { push } = useRouter();
  const { accessToken, refreshToken, valid } = useMemo(() => parseRecoveryHash(), []);
  const [state, dispatch] = useReducer(resetPasswordReducer, createResetPasswordInitialState(valid));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    dispatch({ type: 'submit' });

    try {
      await resetPassword(accessToken, refreshToken, state.newPassword);
      dispatch({ type: 'success' });
      setTimeout(() => push("/login"), 3000);
    } catch (err: unknown) {
      dispatch({ type: 'error', error: err instanceof Error ? err.message : "Error al restablecer la contraseña" });
    } finally {
      dispatch({ type: 'idle' });
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

      {state.success ? (
        <div className={styles.successCard}>
          <p className={styles.successTitle}>¡Contraseña actualizada!</p>
          <p className={styles.successDesc}>
            Serás redirigido al login en unos segundos.
          </p>
          <Link href="/login" prefetch={false} className={styles.successLink}>
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
                type={state.showPassword ? "text" : "password"}
                placeholder="mín. 8 caracteres"
                value={state.newPassword}
                onChange={(e) => dispatch({ type: 'password', value: e.target.value })}
                required
                minLength={8}
                disabled={state.loading || !valid}
              />
              <button
                type="button"
                className={s.showBtn}
                onClick={() => dispatch({ type: 'togglePassword' })}
              >
                {state.showPassword ? "OCULTAR" : "VER"}
              </button>
            </div>
          </div>

          {state.error && <p className={s.error}>{state.error}</p>}

          <button type="submit" className={s.submitBtn} disabled={state.loading || !valid}>
            {state.loading ? "Guardando..." : "Guardar nueva contraseña →"}
          </button>
        </form>
      )}
    </AuthLayout>
  );
}

type ResetPasswordState = {
  newPassword: string;
  showPassword: boolean;
  error: string;
  success: boolean;
  loading: boolean;
};

type ResetPasswordAction =
  | { type: 'password'; value: string }
  | { type: 'togglePassword' }
  | { type: 'submit' }
  | { type: 'success' }
  | { type: 'idle' }
  | { type: 'error'; error: string };

function createResetPasswordInitialState(valid: boolean): ResetPasswordState {
  return {
    newPassword: '',
    showPassword: false,
    error: valid ? '' : 'El enlace de recuperación es inválido o ya fue usado.',
    success: false,
    loading: false,
  };
}

function resetPasswordReducer(state: ResetPasswordState, action: ResetPasswordAction): ResetPasswordState {
  switch (action.type) {
    case 'password':
      return { ...state, newPassword: action.value };
    case 'togglePassword':
      return { ...state, showPassword: !state.showPassword };
    case 'submit':
      return { ...state, error: '', loading: true };
    case 'success':
      return { ...state, success: true };
    case 'idle':
      return { ...state, loading: false };
    case 'error':
      return { ...state, error: action.error, loading: false };
    default:
      return state;
  }
}
