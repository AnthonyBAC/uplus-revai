"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateFullName, updateEmail, updatePassword } from "@/lib/auth-client";
import { getAccessToken } from "@/lib/session";
import styles from "./settings.module.css";

type Tab = "name" | "email" | "password";

export default function SettingsForm() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("name");

  // Nombre
  const [fullName, setFullName] = useState("");

  // Email
  const [email, setEmail] = useState("");

  // Contraseña
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  function reset() {
    setError("");
    setSuccess("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    reset();

    const token = getAccessToken();
    if (!token) {
      router.push("/login");
      return;
    }

    setLoading(true);
    try {
      if (activeTab === "name") {
        await updateFullName(token, fullName);
        setSuccess("Nombre actualizado correctamente.");
        setFullName("");
      } else if (activeTab === "email") {
        await updateEmail(token, email);
        setSuccess("Correo actualizado. Revisa tu bandeja para confirmar.");
        setEmail("");
      } else {
        await updatePassword(token, currentPassword, newPassword);
        setSuccess("Contraseña cambiada correctamente.");
        setCurrentPassword("");
        setNewPassword("");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al guardar los cambios");
    } finally {
      setLoading(false);
    }
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: "name", label: "Nombre" },
    { id: "email", label: "Correo" },
    { id: "password", label: "Contraseña" },
  ];

  return (
    <div className={styles.split}>
      {/* Lado izquierdo */}
      <div className={styles.formSide}>
        <span className={styles.badge}>✦ Configuración de cuenta</span>
        <h1 className={styles.title}>
          Actualiza tu <span className={styles.accent}>información.</span>
        </h1>

        {/* Tabs */}
        <div className={styles.tabs}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`${styles.tabBtn} ${activeTab === tab.id ? styles.tabActive : ""}`}
              onClick={() => { setActiveTab(tab.id); reset(); }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Tab: Nombre */}
          {activeTab === "name" && (
            <div className={styles.field}>
              <label htmlFor="fullName">Nuevo nombre</label>
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
          )}

          {/* Tab: Correo */}
          {activeTab === "email" && (
            <div className={styles.field}>
              <label htmlFor="email">Nuevo correo</label>
              <input
                id="email"
                type="email"
                placeholder="nuevo@negocio.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
              <span className={styles.hint}>
                Te enviaremos un correo de confirmación al nuevo correo.
              </span>
            </div>
          )}

          {/* Tab: Contraseña */}
          {activeTab === "password" && (
            <>
              <div className={styles.field}>
                <label htmlFor="currentPassword">Contraseña actual</label>
                <div className={styles.passwordWrapper}>
                  <input
                    id="currentPassword"
                    type={showCurrent ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className={styles.showBtn}
                    onClick={() => setShowCurrent((v) => !v)}
                  >
                    {showCurrent ? "OCULTAR" : "VER"}
                  </button>
                </div>
              </div>

              <div className={styles.field}>
                <label htmlFor="newPassword">Nueva contraseña</label>
                <div className={styles.passwordWrapper}>
                  <input
                    id="newPassword"
                    type={showNew ? "text" : "password"}
                    placeholder="mín. 8 caracteres"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength={8}
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className={styles.showBtn}
                    onClick={() => setShowNew((v) => !v)}
                  >
                    {showNew ? "OCULTAR" : "VER"}
                  </button>
                </div>
              </div>
            </>
          )}

          {error && <p className={styles.error}>{error}</p>}
          {success && <p className={styles.successMsg}>{success}</p>}

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? "Guardando..." : "Guardar cambios →"}
          </button>
        </form>
      </div>

      {/* Lado derecho */}
      <div className={styles.rightSide}>
        <span className={styles.rightTag}>● TU CUENTA</span>

        <h2 className={styles.rightTitle}>
          Mantén tu perfil <span className={styles.accent}>actualizado</span>.
        </h2>

        <ul className={styles.tipList}>
          <li className={styles.tip}>
            <span className={styles.tipIcon}>👤</span>
            <div>
              <p className={styles.tipTitle}>Nombre visible</p>
              <p className={styles.tipDesc}>
                Tu nombre aparece en los reportes y en el panel de administración.
              </p>
            </div>
          </li>
          <li className={styles.tip}>
            <span className={styles.tipIcon}>📧</span>
            <div>
              <p className={styles.tipTitle}>Confirma tu nuevo correo</p>
              <p className={styles.tipDesc}>
                Al cambiar tu correo recibirás un enlace de confirmación antes de que el cambio sea efectivo.
              </p>
            </div>
          </li>
          <li className={styles.tip}>
            <span className={styles.tipIcon}>🔑</span>
            <div>
              <p className={styles.tipTitle}>Contraseña segura</p>
              <p className={styles.tipDesc}>
                Usa al menos 8 caracteres combinando letras, números y símbolos.
              </p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
}