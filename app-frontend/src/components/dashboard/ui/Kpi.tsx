import Card from './Card';
import s from './Kpi.module.css';

interface KpiProps {
  label: string;
  value: string | number;
  sub?: string;
  accent?: string;
}

export default function Kpi({ label, value, sub, accent }: KpiProps) {
  return (
    <Card style={{ padding: '16px 18px' }}>
      <div className={s.label}>{label}</div>
      <div className={s.value}>{value}</div>
      {sub && <div className={s.sub} style={accent ? { color: accent } : undefined}>{sub}</div>}
    </Card>
  );
}
