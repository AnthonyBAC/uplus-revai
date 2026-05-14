interface PlaceholderProps {
  label?: string;
  width?: string | number;
  height?: number;
  style?: React.CSSProperties;
}

export default function Placeholder({ label = 'image', width = '100%', height = 120, style = {} }: PlaceholderProps) {
  return (
    <div style={{
      width, height,
      background: 'repeating-linear-gradient(45deg, #ECE3D9 0 8px, #F4ECE2 8px 16px)',
      border: '1px dashed #C9BBAA',
      color: '#8E827A',
      fontFamily: 'monospace',
      fontSize: 11,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      borderRadius: 8, ...style,
    }}>
      {label}
    </div>
  );
}
