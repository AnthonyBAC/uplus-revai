"use client";

import { useReducer } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signup } from "@/features/auth/lib/auth-client";
import AuthLayout from "@/features/auth/components/layout/AuthLayout";
import s from "@/features/auth/components/layout/AuthLayout.module.css";
import styles from "./register.module.css";

function RightPanel() {
  return (
    <>
      <h2 className={styles.rightTitle}>
        En 5 minutos, tus reseñas se vuelven un{" "}
        <span className={s.accent}>plan de mejoras</span> semanal.
      </h2>

      <ol className={styles.stepList}>
        <li className={styles.step}>
          <span className={styles.stepNumber}>01</span>
          <div>
            <p className={styles.stepTitle}>Conectas Google Reviews</p>
            <p className={styles.stepDesc}>
              Importamos tu histórico completo. Sin código, OAuth seguro.
            </p>
          </div>
        </li>
        <li className={styles.step}>
          <span className={styles.stepNumber}>02</span>
          <div>
            <p className={styles.stepTitle}>La IA agrupa por temas</p>
            <p className={styles.stepDesc}>
              Tiempos, atención, precio, ambiente. Lo bueno y lo accionable.
            </p>
          </div>
        </li>
        <li className={styles.step}>
          <span className={styles.stepNumber}>03</span>
          <div>
            <p className={styles.stepTitle}>Recibes tu plan cada lunes</p>
            <p className={styles.stepDesc}>
              3 acciones máx, priorizadas por impacto. Con seguimiento.
            </p>
          </div>
        </li>
      </ol>

      <div className={styles.stats}>
        <div className={styles.stat}>
          <span className={styles.statValue}>5 min</span>
          <span className={styles.statLabel}>SETUP</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue}>14 días</span>
          <span className={styles.statLabel}>GRATIS</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue}>0$</span>
          <span className={styles.statLabel}>SIN TARJETA</span>
        </div>
      </div>
    </>
  );
}

export default function RegisterForm() {
  const { push } = useRouter();
  const [state, dispatch] = useReducer(registerReducer, REGISTER_INITIAL_STATE);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    dispatch({ type: 'submit' });
    try {
      await signup(state.email, state.password, state.fullName);
      push("/login");
    } catch (err: unknown) {
      dispatch({ type: 'error', error: err instanceof Error ? err.message : "Error al crear la cuenta" });
    } finally {
      dispatch({ type: 'idle' });
    }
  }

  return (
    <AuthLayout
      topLinkText="¿Ya tienes cuenta?"
      topLinkCta="Inicia sesión →"
      topLinkHref="/login"
      rightPanel={<RightPanel />}
    >
      <span className={s.badge}>
        <span className={s.badgeIcon}>✦</span>
        Crea tu cuenta · 14 días gratis
      </span>

      <h1 className={styles.title}>
        Empieza a convertir reseñas en{" "}
        <span className={s.accent}>mejoras.</span>
      </h1>

      <p className={styles.subtitle}>
        5 minutos de setup. Sin tarjeta. Cancela cuando quieras.
      </p>

      <form onSubmit={handleSubmit} className={s.form}>
        <div className={s.field}>
          <label htmlFor="fullName">Tu nombre</label>
          <input
            id="fullName"
            type="text"
            placeholder="John Doe"
            value={state.fullName}
            onChange={(e) => dispatch({ type: 'field', field: 'fullName', value: e.target.value })}
            required
            disabled={state.loading}
          />
        </div>

        <div className={s.field}>
          <label htmlFor="email">Correo</label>
          <input
            id="email"
            type="email"
            placeholder="tu@negocio.com"
            value={state.email}
            onChange={(e) => dispatch({ type: 'field', field: 'email', value: e.target.value })}
            required
            disabled={state.loading}
          />
        </div>

        <div className={s.field}>
          <label htmlFor="password">Contraseña</label>
          <div className={s.passwordWrapper}>
            <input
              id="password"
                type={state.showPassword ? "text" : "password"}
                placeholder="mín. 8 caracteres"
                value={state.password}
                onChange={(e) => dispatch({ type: 'field', field: 'password', value: e.target.value })}
                required
                minLength={8}
                disabled={state.loading}
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

          <button type="submit" className={s.submitBtn} disabled={state.loading}>
            {state.loading ? "Creando cuenta..." : "Crear cuenta gratis →"}
          </button>
        </form>

      <p className={s.switchLinkMobile}>
        ¿Ya tienes cuenta?{" "}
        <Link href="/login" prefetch={false}>Inicia sesión →</Link>
      </p>
    </AuthLayout>
  );
}

type RegisterState = {
  fullName: string;
  email: string;
  password: string;
  showPassword: boolean;
  error: string;
  loading: boolean;
};

type RegisterAction =
  | { type: 'field'; field: 'fullName' | 'email' | 'password'; value: string }
  | { type: 'togglePassword' }
  | { type: 'submit' }
  | { type: 'idle' }
  | { type: 'error'; error: string };

const REGISTER_INITIAL_STATE: RegisterState = {
  fullName: '',
  email: '',
  password: '',
  showPassword: false,
  error: '',
  loading: false,
};

function registerReducer(state: RegisterState, action: RegisterAction): RegisterState {
  switch (action.type) {
    case 'field':
      return { ...state, [action.field]: action.value };
    case 'togglePassword':
      return { ...state, showPassword: !state.showPassword };
    case 'submit':
      return { ...state, error: '', loading: true };
    case 'idle':
      return { ...state, loading: false };
    case 'error':
      return { ...state, error: action.error, loading: false };
    default:
      return state;
  }
}
