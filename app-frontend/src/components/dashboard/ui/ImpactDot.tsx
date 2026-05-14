type Impact = 'alto' | 'medio' | 'bajo';

const COLOR_MAP: Record<Impact, string> = {
  alto:  'var(--bad)',
  medio: 'var(--warn)',
  bajo:  'var(--good)',
};

export default function ImpactDot({ impact }: { impact: Impact }) {
  return (
    <span style={{
      width: 7, height: 7, borderRadius: 4,
      background: COLOR_MAP[impact],
      display: 'inline-block',
    }} />
  );
}
