'use client';

import { MoreHorizontal } from 'lucide-react';

// Reference "Asset Health" card frame, real Applyqik job-source sync data inside.
export default function SourceHealth({ sources }) {
  const list = sources?.length ? sources : [];
  const anyActive = list.some((s) => s.status === 'active');

  return (
    <div className="flex flex-col rounded-2xl bg-white p-5 ring-1 ring-black/5">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-base font-bold text-ink">Source Health</h3>
        <button aria-label="More options" className="text-slate-soft">
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>

      <div className="relative mt-4 flex-1 overflow-hidden rounded-xl bg-gradient-to-br from-ink via-ink-soft to-accent-ink/70 px-4 py-5">
        {list.length === 0 ? (
          <p className="py-6 text-center text-xs text-white/70">
            No sources synced yet. Run a search to pull jobs in.
          </p>
        ) : (
          <div className="space-y-2.5">
            {list.slice(0, 5).map((s) => (
              <div key={s.source} className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span
                    className={`h-2 w-2 rounded-full ${
                      s.status === 'active' ? 'bg-[var(--eco-green)]' : s.status === 'error' ? 'bg-red-400' : 'bg-white/40'
                    }`}
                  />
                  <span className="text-sm font-medium capitalize text-white">{s.source}</span>
                </div>
                <span className="font-mono text-xs text-white/70">
                  {s.listings?.toLocaleString?.() ?? s.listings ?? 0}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between">
        <span className="text-xs font-medium text-slate">Status</span>
        <span className="flex items-center gap-2 rounded-full bg-line-soft px-3 py-1.5 text-xs font-semibold text-ink-soft">
          {anyActive ? 'Active' : 'Idle'}
          <span className="relative inline-flex h-4 w-7 items-center rounded-full bg-[var(--eco-green)]">
            <span className="ml-3 h-3 w-3 rounded-full bg-white shadow" />
          </span>
        </span>
      </div>
    </div>
  );
}
