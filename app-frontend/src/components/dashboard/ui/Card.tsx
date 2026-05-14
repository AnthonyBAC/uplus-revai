import s from './Card.module.css';

interface CardProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
}

export default function Card({ children, style, className, onClick, hover }: CardProps) {
  return (
    <div
      onClick={onClick}
      style={style}
      className={[
        s.card,
        hover ? s.hover : '',
        onClick ? s.clickable : '',
        className ?? '',
      ].join(' ')}
    >
      {children}
    </div>
  );
}
