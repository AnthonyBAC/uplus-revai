import s from './Card.module.css';

interface CardProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
}

export default function Card({ children, style, className, onClick, hover }: CardProps) {
  const classes = [
    s.card,
    hover ? s.hover : '',
    onClick ? s.clickable : '',
    className ?? '',
  ].join(' ');

  if (onClick) {
    return (
      <button type="button" onClick={onClick} style={style} className={classes}>
        {children}
      </button>
    );
  }

  return (
    <div
      style={style}
      className={classes}
    >
      {children}
    </div>
  );
}
