import styles from '../settings.module.css';

export default function SettingsTipsPanel() {
  return (
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
  );
}
