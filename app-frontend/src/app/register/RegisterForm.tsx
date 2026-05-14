"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signup } from "@/lib/auth-client";
import AuthLayout from "@/components/auth/AuthLayout";
import s from "@/components/auth/AuthLayout.module.css";
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
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signup(email, password, fullName);
      router.push("/login");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al crear la cuenta");
    } finally {
      setLoading(false);
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
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            disabled={loading}
          />
        </div>

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

        <div className={s.field}>
          <label htmlFor="password">Contraseña</label>
          <div className={s.passwordWrapper}>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="mín. 8 caracteres"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
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
          {loading ? "Creando cuenta..." : "Crear cuenta gratis →"}
        </button>
      </form>

      <p className={s.switchLinkMobile}>
        ¿Ya tienes cuenta?{" "}
        <Link href="/login">Inicia sesión →</Link>
      </p>
    </AuthLayout>
  );
}
