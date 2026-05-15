interface SparklineProps {
  data: number[];
  color?: string;
  height?: number;
  fill?: boolean;
}

export default function Sparkline({ data, color = 'var(--accent)', height = 36, fill = true }: SparklineProps) {
  if (!data.length) return <div style={{ height }} />;
  const w = 100, h = 100;
  const max = Math.max(...data), min = Math.min(...data);
  const span = max - min || 1;
  const pts = data.map((v, i) => [
    i * (w / (data.length - 1)),
    h - ((v - min) / span) * (h - 10) - 5,
  ]);
  const line = pts.map((p, i) => (i === 0 ? 'M' : 'L') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ');
  const area = line + ` L${w} ${h} L0 ${h} Z`;
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ width: '100%', height, display: 'block' }}>
      {fill && <path d={area} fill={color} opacity="0.10" />}
      <path d={line} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}
