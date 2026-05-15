import styles from '../settings.module.css';

interface PasswordTabProps {
  currentPassword: string;
  newPassword: string;
  showCurrent: boolean;
  showNew: boolean;
  loading: boolean;
  onCurrentPasswordChange: (value: string) => void;
  onNewPasswordChange: (value: string) => void;
  onToggleCurrent: () => void;
  onToggleNew: () => void;
}

export default function PasswordTab({
  currentPassword,
  newPassword,
  showCurrent,
  showNew,
  loading,
  onCurrentPasswordChange,
  onNewPasswordChange,
  onToggleCurrent,
  onToggleNew,
}: PasswordTabProps) {
  return (
    <>
      <div className={styles.field}>
        <label htmlFor="currentPassword">Contraseña actual</label>
        <div className={styles.passwordWrapper}>
          <input
            id="currentPassword"
            type={showCurrent ? 'text' : 'password'}
            value={currentPassword}
            onChange={(e) => onCurrentPasswordChange(e.target.value)}
            required
            disabled={loading}
          />
          <button type="button" className={styles.showBtn} onClick={onToggleCurrent}>
            {showCurrent ? 'OCULTAR' : 'VER'}
          </button>
        </div>
      </div>

      <div className={styles.field}>
        <label htmlFor="newPassword">Nueva contraseña</label>
        <div className={styles.passwordWrapper}>
          <input
            id="newPassword"
            type={showNew ? 'text' : 'password'}
            placeholder="mín. 8 caracteres"
            value={newPassword}
            onChange={(e) => onNewPasswordChange(e.target.value)}
            required
            minLength={8}
            disabled={loading}
          />
          <button type="button" className={styles.showBtn} onClick={onToggleNew}>
            {showNew ? 'OCULTAR' : 'VER'}
          </button>
        </div>
      </div>
    </>
  );
}
