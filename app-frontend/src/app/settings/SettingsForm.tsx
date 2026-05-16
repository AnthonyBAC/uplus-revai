"use client";

import { useReducer } from "react";
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
  const { push } = useRouter();
  const [state, dispatch] = useReducer(settingsReducer, SETTINGS_INITIAL_STATE);

  function reset() {
    dispatch({ type: 'messages', error: '', success: '' });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    reset();

    const token = getAccessToken();
    if (!token) {
      push("/login");
      return;
    }

    dispatch({ type: 'loading', value: true });
    try {
      if (state.activeTab === "name") {
        await updateFullName(token, state.fullName);
        dispatch({ type: 'afterSubmit', success: "Nombre actualizado correctamente.", fields: { fullName: '' } });
      } else if (state.activeTab === "email") {
        await updateEmail(token, state.email);
        dispatch({ type: 'afterSubmit', success: "Correo actualizado. Revisa tu bandeja para confirmar.", fields: { email: '' } });
      } else {
        await updatePassword(token, state.currentPassword, state.newPassword);
        dispatch({
          type: 'afterSubmit',
          success: "Contraseña cambiada correctamente.",
          fields: { currentPassword: '', newPassword: '' },
        });
      }
    } catch (err: unknown) {
      dispatch({ type: 'messages', error: err instanceof Error ? err.message : "Error al guardar los cambios", success: '' });
    } finally {
      dispatch({ type: 'loading', value: false });
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
          activeTab={state.activeTab}
          onChange={(tab) => {
            dispatch({ type: 'tab', value: tab });
            reset();
          }}
        />

        <form onSubmit={handleSubmit} className={styles.form}>
          {state.activeTab === "name" && (
            <NameTab value={state.fullName} loading={state.loading} onChange={(value) => dispatch({ type: 'field', field: 'fullName', value })} />
          )}

          {state.activeTab === "email" && (
            <EmailTab value={state.email} loading={state.loading} onChange={(value) => dispatch({ type: 'field', field: 'email', value })} />
          )}

          {state.activeTab === "password" && (
            <PasswordTab
              currentPassword={state.currentPassword}
              newPassword={state.newPassword}
              showCurrent={state.showCurrent}
              showNew={state.showNew}
              loading={state.loading}
              onCurrentPasswordChange={(value) => dispatch({ type: 'field', field: 'currentPassword', value })}
              onNewPasswordChange={(value) => dispatch({ type: 'field', field: 'newPassword', value })}
              onToggleCurrent={() => dispatch({ type: 'toggle', field: 'showCurrent' })}
              onToggleNew={() => dispatch({ type: 'toggle', field: 'showNew' })}
            />
          )}

          {state.error && <p className={styles.error}>{state.error}</p>}
          {state.success && <p className={styles.successMsg}>{state.success}</p>}

          <button type="submit" className={styles.submitBtn} disabled={state.loading}>
            {state.loading ? "Guardando..." : "Guardar cambios →"}
          </button>
        </form>
      </div>

      <SettingsTipsPanel />
    </div>
  );
}

type SettingsState = {
  activeTab: SettingsTab;
  fullName: string;
  email: string;
  currentPassword: string;
  newPassword: string;
  showCurrent: boolean;
  showNew: boolean;
  error: string;
  success: string;
  loading: boolean;
};

type SettingsAction =
  | { type: 'tab'; value: SettingsTab }
  | { type: 'field'; field: 'fullName' | 'email' | 'currentPassword' | 'newPassword'; value: string }
  | { type: 'toggle'; field: 'showCurrent' | 'showNew' }
  | { type: 'messages'; error: string; success: string }
  | { type: 'loading'; value: boolean }
  | { type: 'afterSubmit'; success: string; fields: Partial<Pick<SettingsState, 'fullName' | 'email' | 'currentPassword' | 'newPassword'>> };

const SETTINGS_INITIAL_STATE: SettingsState = {
  activeTab: 'name',
  fullName: '',
  email: '',
  currentPassword: '',
  newPassword: '',
  showCurrent: false,
  showNew: false,
  error: '',
  success: '',
  loading: false,
};

function settingsReducer(state: SettingsState, action: SettingsAction): SettingsState {
  switch (action.type) {
    case 'tab':
      return { ...state, activeTab: action.value };
    case 'field':
      return { ...state, [action.field]: action.value };
    case 'toggle':
      return { ...state, [action.field]: !state[action.field] };
    case 'messages':
      return { ...state, error: action.error, success: action.success };
    case 'loading':
      return { ...state, loading: action.value };
    case 'afterSubmit':
      return { ...state, ...action.fields, error: '', success: action.success };
    default:
      return state;
  }
}
