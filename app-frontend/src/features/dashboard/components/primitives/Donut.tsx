'use client';

import { useTooltip } from '../../hooks/useTooltip';
import s from './Donut.module.css';

export interface DonutDatum {
  label: string;
  value: number;
  color: string;
}

interface DonutProps {
  data: DonutDatum[];
  size?: number;
  thickness?: number;
  center?: { value: string | number; label: string };
}

export default function Donut({ data, size = 160, thickness = 24, center }: DonutProps) {
  const { setTip, Tip } = useTooltip();
  const total = data.reduce((sum, d) => sum + d.value, 0) || 1;
  const r = size / 2 - 2;
  const ri = r - thickness;
  const cx = size / 2;
  const cy = size / 2;
  let acc = -Math.PI / 2;

  const arc = (a1: number, a2: number) => {
    const x1 = cx + r * Math.cos(a1);
    const y1 = cy + r * Math.sin(a1);
    const x2 = cx + r * Math.cos(a2);
    const y2 = cy + r * Math.sin(a2);
    const xi1 = cx + ri * Math.cos(a1);
    const yi1 = cy + ri * Math.sin(a1);
    const xi2 = cx + ri * Math.cos(a2);
    const yi2 = cy + ri * Math.sin(a2);
    const large = a2 - a1 > Math.PI ? 1 : 0;
    return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} L ${xi2} ${yi2} A ${ri} ${ri} 0 ${large} 0 ${xi1} ${yi1} Z`;
  };

  const hasData = data.some((d) => d.value > 0);

  return (
    <div className={s.wrap}>
      <div className={s.ringWrap} style={{ width: size, height: size }}>
        <svg width={size} height={size}>
          {hasData ? (
            data.map((d, i) => {
              if (d.value === 0) return null;
              const a2 = acc + (d.value / total) * Math.PI * 2;
              const path = arc(acc, a2 - 0.01);
              const pct = Math.round((d.value / total) * 100);
              const el = (
                <path
                  key={i}
                  d={path}
                  fill={d.color}
                  onMouseMove={(e) =>
                    setTip({
                      x: e.clientX,
                      y: e.clientY,
                      text: `${d.label}: ${d.value} (${pct}%)`,
                    })
                  }
                  onMouseLeave={() => setTip(null)}
                  className={s.slice}
                />
              );
              acc = a2;
              return el;
            })
          ) : (
            <circle
              cx={cx}
              cy={cy}
              r={(r + ri) / 2}
              fill="none"
              stroke="#F2EAE1"
              strokeWidth={thickness}
            />
          )}
        </svg>
        {center && (
          <div className={s.center}>
            <div className={s.centerValue}>{center.value}</div>
            <div className={s.centerLabel}>{center.label}</div>
          </div>
        )}
      </div>

      <div className={s.legend}>
        {data.map((d, i) => {
          const pct = Math.round((d.value / total) * 100);
          return (
            <div key={i} className={s.row}>
              <div className={s.dot} style={{ background: d.color }} />
              <div className={s.rowLabel}>{d.label}</div>
              <div className={s.rowVal}>{d.value}</div>
              <div className={s.rowPct}>{pct}%</div>
            </div>
          );
        })}
      </div>
      <Tip />
    </div>
  );
}
