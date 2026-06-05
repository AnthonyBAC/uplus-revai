'use client';

import { useTooltip } from '../../hooks/useTooltip';
import s from './BarChart.module.css';

export interface BarDatum {
  label: string;
  value: number;
  color?: string;
}

interface BarChartProps {
  data: BarDatum[];
  height?: number;
  color?: string;
  horizontal?: boolean;
  formatY?: (v: number) => string | number;
}

export default function BarChart({
  data,
  height = 200,
  color = 'var(--accent)',
  horizontal = false,
  formatY = (v) => v,
}: BarChartProps) {
  const { setTip, Tip } = useTooltip();
  const W = 600;
  const H = 200;
  const padL = 40;
  const padR = 14;
  const padT = 14;
  const padB = 28;
  const max = Math.max(...data.map((d) => d.value)) * 1.1 || 1;

  if (horizontal) {
    const rowH = 24;
    const gap = 8;
    const realH = data.length * (rowH + gap);
    return (
      <div className={s.wrap}>
        <svg
          viewBox={`0 0 ${W} ${realH + 10}`}
          preserveAspectRatio="none"
          style={{ width: '100%', height: realH + 10, display: 'block' }}
        >
          {data.map((d, i) => {
            const w = (d.value / max) * (W - 120);
            return (
              <g key={i} transform={`translate(0 ${i * (rowH + gap)})`}>
                <text x="0" y={rowH / 2 + 4} fontSize="11.5" fill="var(--ink-soft)">
                  {d.label}
                </text>
                <rect x="100" y="2" width={W - 120} height={rowH - 4} fill="#F4ECE2" rx="4" />
                <rect
                  x="100"
                  y="2"
                  width={w}
                  height={rowH - 4}
                  fill={d.color ?? color}
                  rx="4"
                  onMouseMove={(e) =>
                    setTip({ x: e.clientX, y: e.clientY, text: `${d.label}: ${formatY(d.value)}` })
                  }
                  onMouseLeave={() => setTip(null)}
                />
                <text
                  x={W - 14}
                  y={rowH / 2 + 4}
                  fontSize="11"
                  textAnchor="end"
                  fill="var(--ink-mute)"
                >
                  {formatY(d.value)}
                </text>
              </g>
            );
          })}
        </svg>
        <Tip />
      </div>
    );
  }

  const bw = (W - padL - padR) / data.length;
  return (
    <div className={s.wrap}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
        style={{ width: '100%', height, display: 'block' }}
      >
        {[0, 0.25, 0.5, 0.75, 1].map((t, i) => {
          const yv = padT + t * (H - padT - padB);
          return (
            <g key={i}>
              <line
                x1={padL}
                x2={W - padR}
                y1={yv}
                y2={yv}
                stroke="#ECE3D9"
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
              />
              <text x={padL - 6} y={yv + 3} fontSize="9" textAnchor="end" fill="#8E827A">
                {formatY(Math.round(max * (1 - t)))}
              </text>
            </g>
          );
        })}
        {data.map((d, i) => {
          const h = (d.value / max) * (H - padT - padB);
          const xv = padL + i * bw + bw * 0.18;
          const w = bw * 0.64;
          return (
            <g key={i}>
              <rect
                x={xv}
                y={H - padB - h}
                width={w}
                height={h}
                fill={d.color ?? color}
                rx="3"
                onMouseMove={(e) =>
                  setTip({ x: e.clientX, y: e.clientY, text: `${d.label}: ${formatY(d.value)}` })
                }
                onMouseLeave={() => setTip(null)}
                style={{ cursor: 'pointer' }}
              />
              <text
                x={xv + w / 2}
                y={H - 10}
                fontSize="9.5"
                textAnchor="middle"
                fill="#8E827A"
              >
                {d.label}
              </text>
            </g>
          );
        })}
      </svg>
      <Tip />
    </div>
  );
}
