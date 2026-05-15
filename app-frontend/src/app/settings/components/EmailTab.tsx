import styles from '../settings.module.css';

interface EmailTabProps {
  value: string;
  loading: boolean;
  onChange: (value: string) => void;
}

export default function EmailTab({ value, loading, onChange }: EmailTabProps) {
  return (
    <div className={styles.field}>
      <label htmlFor="email">Nuevo correo</label>
      <input
        id="email"
        type="email"
        placeholder="nuevo@negocio.com"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
        disabled={loading}
      />
      <span className={styles.hint}>
        Te enviaremos un correo de confirmación al nuevo correo.
      </span>
    </div>
  );
}
