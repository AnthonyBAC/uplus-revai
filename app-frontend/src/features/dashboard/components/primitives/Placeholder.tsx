import styles from './Placeholder.module.css';

interface PlaceholderProps {
  label?: string;
  width?: string | number;
  height?: number;
  style?: React.CSSProperties;
}

const EMPTY_STYLE: React.CSSProperties = {};

export default function Placeholder({ label = 'image', width = '100%', height = 120, style = EMPTY_STYLE }: PlaceholderProps) {
  return (
    <div className={styles.root} style={{ width, height, ...style }}>
      {label}
    </div>
  );
}
