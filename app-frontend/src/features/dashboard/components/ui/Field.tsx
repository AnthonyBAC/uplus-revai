import s from './Field.module.css';

interface FieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  full?: boolean;
}

export default function Field({ label, value, onChange, full }: FieldProps) {
  return (
    <label className={[s.label, full ? s.full : ''].join(' ')}>
      <span className={s.labelText}>{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={s.input}
      />
    </label>
  );
}
