"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateFullName, updateEmail, updatePassword } from "@/features/auth/lib/auth-client";
import { getAccessToken } from "@/features/auth/lib/session";
import SettingsTabs from "./components/SettingsTabs";
import NameTab from "./components/NameTab";
import EmailTab from "./components/EmailTab";
import PasswordTab from "./components/PasswordTab";
import SettingsTipsPanel from "./components/SettingsTipsPanel";
import type { SettingsTab } from "./components/types";
import styles from "./settings.module.css";

export default function SettingsForm() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<SettingsTab>("name");

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

  return (
    <div className={styles.split}>
      <div className={styles.formSide}>
        <span className={styles.badge}>✦ Configuración de cuenta</span>
        <h1 className={styles.title}>
          Actualiza tu <span className={styles.accent}>información.</span>
        </h1>

        <SettingsTabs
          activeTab={activeTab}
          onChange={(tab) => {
            setActiveTab(tab);
            reset();
          }}
        />

        <form onSubmit={handleSubmit} className={styles.form}>
          {activeTab === "name" && (
            <NameTab value={fullName} loading={loading} onChange={setFullName} />
          )}

          {activeTab === "email" && (
            <EmailTab value={email} loading={loading} onChange={setEmail} />
          )}

          {activeTab === "password" && (
            <PasswordTab
              currentPassword={currentPassword}
              newPassword={newPassword}
              showCurrent={showCurrent}
              showNew={showNew}
              loading={loading}
              onCurrentPasswordChange={setCurrentPassword}
              onNewPasswordChange={setNewPassword}
              onToggleCurrent={() => setShowCurrent((v) => !v)}
              onToggleNew={() => setShowNew((v) => !v)}
            />
          )}

          {error && <p className={styles.error}>{error}</p>}
          {success && <p className={styles.successMsg}>{success}</p>}

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? "Guardando..." : "Guardar cambios →"}
          </button>
        </form>
      </div>

      <SettingsTipsPanel />
    </div>
  );
}
