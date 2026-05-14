interface StarsProps {
  value?: number;
  size?: number;
  color?: string;
}

export default function Stars({ value = 5, size = 13, color = '#D9684D' }: StarsProps) {
  const full = Math.floor(value);
  return (
    <span style={{ display: 'inline-flex', gap: 1, color, lineHeight: 1 }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width={size} height={size} viewBox="0 0 24 24"
          fill={i < full ? color : 'transparent'} stroke={color} strokeWidth="1.6">
          <path d="M12 2.5l2.9 6 6.6.8-4.8 4.6 1.2 6.6L12 17.4 6.1 20.5l1.2-6.6L2.5 9.3l6.6-.8z"/>
        </svg>
      ))}
    </span>
  );
}
