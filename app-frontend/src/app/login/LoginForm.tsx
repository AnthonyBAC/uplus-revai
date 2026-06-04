"use client";

import { useReducer } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { login } from "@/features/auth/lib/auth-client";
import { saveSession } from "@/features/auth/lib/session";
import AuthLayout from "@/features/auth/components/layout/AuthLayout";
import s from "@/features/auth/components/layout/AuthLayout.module.css";
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
  const { replace } = useRouter();
  const [state, dispatch] = useReducer(loginReducer, LOGIN_INITIAL_STATE);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    dispatch({ type: 'submit' });
    try {
      const session = await login(state.email, state.password);
      saveSession(session.accessToken, session.refreshToken, session.profile);
      dispatch({ type: 'navigating' });
      replace(session.profile.isOnboarded ? "/dashboard" : "/onboarding");
    } catch (err: unknown) {
      dispatch({ type: 'error', error: err instanceof Error ? err.message : "Error al iniciar sesión" });
    }
  }

  return (
    <AuthLayout
      topLinkText="¿Aún no tienes cuenta?"
      topLinkCta="Crear cuenta →"
      topLinkHref="/register"
      rightPanel={<RightPanel />}
    >
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
            placeholder="tu@correo.com"
            value={state.email}
            onChange={(e) => dispatch({ type: 'field', field: 'email', value: e.target.value })}
            required
            disabled={state.loading || state.navigating}
          />
        </div>

        <div className={s.field}>
          <div className={styles.passwordLabel}>
            <label htmlFor="password">Contraseña</label>
            <Link href="/forgot-password" prefetch={false} className={styles.forgotLink}>
              ¿La olvidaste?
            </Link>
          </div>
          <div className={s.passwordWrapper}>
            <input
              id="password"
                type={state.showPassword ? "text" : "password"}
                value={state.password}
                onChange={(e) => dispatch({ type: 'field', field: 'password', value: e.target.value })}
                required
                disabled={state.loading || state.navigating}
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

          <button type="submit" className={s.submitBtn} disabled={state.loading || state.navigating}>
            {state.loading || state.navigating ? "Entrando..." : "Entrar al panel →"}
          </button>
        </form>

      <p className={s.switchLinkMobile}>
        ¿Aún no tienes cuenta?{" "}
          <Link href="/register" prefetch={false}>Crear cuenta →</Link>
      </p>
    </AuthLayout>
  );
}

type LoginState = {
  email: string;
  password: string;
  showPassword: boolean;
  error: string;
  loading: boolean;
  navigating: boolean;
};

type LoginAction =
  | { type: 'field'; field: 'email' | 'password'; value: string }
  | { type: 'togglePassword' }
  | { type: 'submit' }
  | { type: 'navigating' }
  | { type: 'error'; error: string };

const LOGIN_INITIAL_STATE: LoginState = {
  email: '',
  password: '',
  showPassword: false,
  error: '',
  loading: false,
  navigating: false,
};

function loginReducer(state: LoginState, action: LoginAction): LoginState {
  switch (action.type) {
    case 'field':
      return { ...state, [action.field]: action.value };
    case 'togglePassword':
      return { ...state, showPassword: !state.showPassword };
    case 'submit':
      return { ...state, error: '', loading: true };
    case 'navigating':
      return { ...state, navigating: true };
    case 'error':
      return { ...state, error: action.error, loading: false };
    default:
      return state;
  }
}
