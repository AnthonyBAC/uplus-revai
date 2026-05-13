"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signup } from "@/lib/auth-client";
import styles from "./register.module.css";

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
    <div className={styles.split}>
      {/* Lado izquierdo — formulario */}
      <div className={styles.formSide}>
        <span className={styles.badge}>✦ Crea tu cuenta · 14 días gratis</span>

        <h1 className={styles.title}>
          Empieza a convertir reseñas en{" "}
          <span className={styles.accent}>mejoras.</span>
        </h1>

        <p className={styles.subtitle}>
          5 minutos de setup. Sin tarjeta. Cancela cuando quieras.
        </p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label htmlFor="fullName">Tu nombre</label>
            <input
              id="fullName"
              type="text"
              placeholder="María Contreras"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              disabled={loading}
            />
          </div>

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

          <div className={styles.field}>
            <label htmlFor="password">Contraseña</label>
            <div className={styles.passwordWrapper}>
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
                className={styles.showBtn}
                onClick={() => setShowPassword((v) => !v)}
              >
                {showPassword ? "OCULTAR" : "VER"}
              </button>
            </div>
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? "Creando cuenta..." : "Crear cuenta gratis →"}
          </button>
        </form>

        <p className={styles.switchLink}>
          ¿Ya tienes cuenta?{" "}
          <Link href="/login">Inicia sesión →</Link>
        </p>
      </div>

      {/* Lado derecho — copy */}
      <div className={styles.rightSide}>
        <h2 className={styles.rightTitle}>
          En 5 minutos, tus reseñas se vuelven un{" "}
          <span className={styles.accent}>plan de mejoras</span> semanal.
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
      </div>
    </div>
  );
}