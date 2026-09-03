import React from 'react';

export type StatusTone = 'positive' | 'pending' | 'neutral';

export interface StatusBadgeProps {
  label: string;
  tone?: StatusTone;
  /** Show a small dot instead of relying on color alone. */
  dot?: boolean;
}

const toneClasses: Record<StatusTone, string> = {
  positive: 'bg-kolo-currency/10 text-kolo-currency',
  pending: 'bg-kolo-stamp/10 text-kolo-stamp',
  neutral: 'bg-kolo-hairline/40 text-kolo-muted',
};

const dotClasses: Record<StatusTone, string> = {
  positive: 'bg-kolo-currency',
  pending: 'bg-kolo-stamp',
  neutral: 'bg-kolo-muted-light',
};

export function StatusBadge({ label, tone = 'neutral', dot = false }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[10px] font-bold ${toneClasses[tone]}`}
    >
      {dot && <span className={`h-1.5 w-1.5 rounded-full ${dotClasses[tone]}`} aria-hidden="true" />}
      {label}
    </span>
  );
}