import Icon, { type IconName } from '../primitives/Icon';
import s from './Btn.module.css';

type Kind = 'primary' | 'ink' | 'outline' | 'ghost' | 'soft';
type Size = 'sm' | 'md' | 'lg';

interface BtnProps {
  children?: React.ReactNode;
  kind?: Kind;
  size?: Size;
  icon?: IconName;
  onClick?: () => void;
  disabled?: boolean;
  style?: React.CSSProperties;
  type?: 'button' | 'submit' | 'reset';
}

export default function Btn({ children, kind = 'ghost', size = 'md', icon, onClick, disabled, style, type = 'button' }: BtnProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={style}
      className={[s.btn, s[kind], s[size]].join(' ')}
    >
      {icon && <Icon name={icon} size={size === 'sm' ? 13 : 15} stroke={2} />}
      {children}
    </button>
  );
}
