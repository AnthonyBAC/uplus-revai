import styles from '../settings.module.css';

interface NameTabProps {
  value: string;
  loading: boolean;
  onChange: (value: string) => void;
}

export default function NameTab({ value, loading, onChange }: NameTabProps) {
  return (
    <div className={styles.field}>
      <label htmlFor="fullName">Nuevo nombre</label>
      <input
        id="fullName"
        type="text"
        placeholder="María Contreras"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
        disabled={loading}
      />
    </div>
  );
}
