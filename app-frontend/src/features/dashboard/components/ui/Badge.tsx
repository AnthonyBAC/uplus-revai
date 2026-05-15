import s from './Badge.module.css';

type Tone = 'accent' | 'soft' | 'good' | 'warn' | 'bad' | 'ink' | 'ghost';
type Size = 'md' | 'sm';

interface BadgeProps {
  children: React.ReactNode;
  tone?: Tone;
  size?: Size;
}

export default function Badge({ children, tone = 'accent', size = 'md' }: BadgeProps) {
  return (
    <span className={[s.badge, s[tone], s[size]].join(' ')}>
      {children}
    </span>
  );
}
