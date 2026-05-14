import s from './SectionHead.module.css';

interface SectionHeadProps {
  title: string;
  sub?: string;
  right?: React.ReactNode;
}

export default function SectionHead({ title, sub, right }: SectionHeadProps) {
  return (
    <div className={s.head}>
      <div>
        <h2 className={s.title}>{title}</h2>
        {sub && <div className={s.sub}>{sub}</div>}
      </div>
      {right && <div>{right}</div>}
    </div>
  );
}
