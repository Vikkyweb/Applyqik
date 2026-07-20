'use client';

import { ChevronRight } from 'lucide-react';

// Reference "Energy Production" dot-plot design, repurposed as Applyqik's weekly
// job-activity chart. Accepts real per-day data; falls back to representative
// shape when the backend doesn't yet expose daily aggregates.
const statusColor = {
  peak: 'var(--eco-green)',
  steady: 'var(--eco-blue)',
  limited: 'var(--eco-orange)',
  standby: 'var(--eco-standby)',
};

const legend = [
  { label: 'Peak', status: 'peak' },
  { label: 'Steady', status: 'steady' },
  { label: 'Limited', status: 'limited' },
  { label: 'Standby', status: 'standby' },
];

const FALLBACK = [
  { day: 'Mo', value: 1180, status: 'limited' },
  { day: 'Tu', value: 1720, status: 'steady' },
  { day: 'We', value: 2345, status: 'peak' },
  { day: 'Th', value: 640, status: 'standby' },
  { day: 'Fr', value: 1260, status: 'limited' },
  { day: 'Sa', value: 1780, status: 'steady' },
  { day: 'Su', value: 1240, status: 'limited' },
];

const CHART_H = 220;

export default function ActivityChart({ data }) {
  const rows = data?.length ? data : FALLBACK;
  const maxVal = Math.max(...rows.map((r) => r.value), 1);

  return (
    <div className="rounded-2xl bg-card p-5 ring-1 ring-black/5 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-display text-lg font-bold text-ink">Job Activity</h3>
          <p className="mt-1 max-w-xs text-xs text-slate">
            Weekly overview of new roles found across your sources.
          </p>
        </div>
        <button className="flex shrink-0 items-center gap-1 rounded-full border border-line px-3 py-1.5 text-xs font-medium text-slate">
          Week
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2">
        {legend.map(({ label, status }) => (
          <span key={label} className="flex items-center gap-1.5 text-xs text-slate">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: statusColor[status] }} />
            {label}
          </span>
        ))}
      </div>

      <div className="mt-6 flex items-end gap-2 pl-8 sm:gap-4">
        <div className="relative hidden shrink-0 text-[10px] text-slate-soft sm:block" style={{ height: CHART_H }}>
          <span className="absolute -left-1 top-0">{Math.round(maxVal / 1000) || 1}k</span>
          <span className="absolute -left-1" style={{ top: CHART_H * 0.44 }}>
            {Math.round(maxVal / 2000) || 1}k
          </span>
          <span className="absolute -left-1 bottom-0">0</span>
        </div>

        <div className="grid flex-1 grid-cols-7 items-end gap-1 sm:gap-3" style={{ height: CHART_H }}>
          {rows.map(({ day, value, status }) => {
            const h = (value / maxVal) * (CHART_H - 40);
            const isPeak = status === 'peak';
            return (
              <div key={day} className="relative flex h-full flex-col items-center justify-end">
                {isPeak && (
                  <div className="mb-1 rounded-full bg-ink px-2.5 py-1 text-[11px] font-semibold text-white">
                    {value.toLocaleString()}
                  </div>
                )}
                <div
                  className={isPeak ? '' : 'bg-line'}
                  style={{ height: h, width: isPeak ? 6 : 1 }}
                >
                  {isPeak && (
                    <div
                      className="h-full w-full rounded-full"
                      style={{ background: 'linear-gradient(to top, rgba(15,185,129,0.05), rgba(15,185,129,0.35))' }}
                    />
                  )}
                </div>
                <div
                  className="rounded-full"
                  style={{
                    width: isPeak ? 16 : 10,
                    height: isPeak ? 16 : 10,
                    backgroundColor: statusColor[status],
                    marginTop: isPeak ? -8 : -5,
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2 pl-8 sm:gap-4">
        <span className="hidden w-6 shrink-0 text-[10px] font-medium text-slate-soft sm:block">Date</span>
        <div className="grid flex-1 grid-cols-7 gap-1 sm:gap-3">
          {rows.map(({ day, status }) => (
            <div key={day} className="flex justify-center">
              <span
                className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-medium ${
                  status === 'peak' ? 'bg-[var(--eco-green)] text-white' : 'bg-line-soft text-slate'
                }`}
              >
                {day}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
