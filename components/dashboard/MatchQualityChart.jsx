'use client';

import { ChevronRight } from 'lucide-react';

// Reference "Power Efficiency" stacked-bar design, reframed as Applyqik's weekly
// match-quality breakdown (strong / fair / weak bands per day).
const FALLBACK = [
  { day: 'Mo', strong: 30, fair: 45, weak: 25 },
  { day: 'Tu', strong: 28, fair: 55, weak: 32 },
  { day: 'We', strong: 26, fair: 38, weak: 22 },
  { day: 'Th', strong: 24, fair: 40, weak: 20 },
  { day: 'Fr', strong: 32, fair: 48, weak: 26 },
  { day: 'Sa', strong: 27, fair: 42, weak: 24 },
  { day: 'Su', strong: 34, fair: 46, weak: 27 },
];

const legend = [
  { label: 'Strong', color: 'bg-ink' },
  { label: 'Fair', color: 'bg-[var(--eco-green)]' },
  { label: 'Weak', color: 'bg-line-strong' },
];

export default function MatchQualityChart({ data }) {
  const rows = data?.length ? data : FALLBACK;

  return (
    <div className="rounded-2xl bg-card p-5 ring-1 ring-black/5 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <h3 className="font-display text-lg font-bold text-ink">Match Quality</h3>
        <button className="flex shrink-0 items-center gap-1 rounded-full border border-line px-3 py-1.5 text-xs font-medium text-slate">
          Week
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
        {legend.map(({ label, color }) => (
          <span key={label} className="flex items-center gap-1.5 text-xs text-slate">
            <span className={`h-2 w-2 rounded-full ${color}`} />
            {label}
          </span>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-7 items-end gap-2 sm:gap-4" style={{ height: 180 }}>
        {rows.map(({ day, strong, fair, weak }) => (
          <div key={day} className="flex h-full flex-col justify-end gap-1">
            <div className="rounded-full bg-line-strong" style={{ height: weak }} />
            <div className="rounded-full bg-[var(--eco-green)]" style={{ height: fair }} />
            <div className="rounded-full bg-ink" style={{ height: strong }} />
          </div>
        ))}
      </div>

      <div className="mt-3 grid grid-cols-7 gap-2 sm:gap-4">
        {rows.map(({ day }) => (
          <div key={day} className="text-center text-xs font-medium text-slate-soft">
            {day}
          </div>
        ))}
      </div>
    </div>
  );
}
