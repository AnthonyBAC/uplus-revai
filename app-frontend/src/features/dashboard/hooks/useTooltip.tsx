'use client';

import { useState } from 'react';

interface TipState {
  x: number;
  y: number;
  text: string;
}

export function useTooltip() {
  const [tip, setTip] = useState<TipState | null>(null);

  const Tip = () => {
    if (!tip) return null;
    return (
      <div
        style={{
          position: 'fixed',
          left: tip.x + 12,
          top: tip.y - 8,
          transform: 'translateY(-100%)',
          background: 'var(--ink)',
          color: '#fff',
          padding: '7px 10px',
          borderRadius: 8,
          fontSize: 11.5,
          pointerEvents: 'none',
          zIndex: 1000,
          whiteSpace: 'nowrap',
          boxShadow: '0 8px 18px rgba(0,0,0,0.25)',
          fontFamily: 'var(--font-ui)',
        }}
      >
        {tip.text}
      </div>
    );
  };

  return { setTip, Tip };
}
