'use client';

import { ArrowUpRight, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import EcoIllustration from './EcoIllustration';

// Reference hero design, Applyqik data. Two mini-stat cards on the left (real
// matches/applications), the brand headline, decorative illustration centre,
// and two readouts on the right (jobs today / resume score).
function MiniStat({ label, value, href, sparkline }) {
  return (
    <Link href={href} className="block rounded-2xl bg-white/70 p-4 ring-1 ring-black/5 backdrop-blur-sm transition-colors hover:bg-white/90">
      <div className="mb-6 flex items-start justify-between">
        <p className="text-[13px] font-medium leading-tight text-ink-soft">{label}</p>
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white shadow-sm">
          <ArrowUpRight className="h-3.5 w-3.5 text-slate" />
        </span>
      </div>
      <p className="mb-3 font-display text-2xl font-bold text-ink">{value}</p>
      {sparkline ? (
        <svg viewBox="0 0 140 30" className="w-full" preserveAspectRatio="none">
          <polyline points="0,22 20,22 32,6 46,26 60,10 76,10 92,22 108,22 122,8 140,8" fill="none" stroke="#cbd5c3" strokeWidth="2" />
          <polyline points="76,10 92,22 108,22 122,8 140,8" fill="none" stroke="var(--eco-green)" strokeWidth="2.5" />
        </svg>
      ) : (
        <>
          <div className="flex items-center justify-between text-[10px] text-slate">
            <span>Live</span>
            <span>Feed</span>
          </div>
          <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-line">
            <div className="h-full w-1/2 rounded-full bg-[var(--eco-green)]" />
          </div>
        </>
      )}
    </Link>
  );
}

export default function HeroPanel({ matches, applications, jobsToday, resumeScore, onRun, running }) {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[var(--eco-sage-light)] via-[#e2e9d8] to-[#c9d4bd] p-5 sm:p-7">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr_180px]">
        {/* Left: brand copy + mini stats */}
        <div>
          <h1 className="font-display text-3xl font-extrabold uppercase leading-tight tracking-tight text-ink sm:text-4xl">
            Your Career
            <br />
            Agent
          </h1>
          <p className="mt-2 max-w-xs text-sm text-slate">
            Real jobs, ranked for you — less searching, more landing.
          </p>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <MiniStat label="New matches" value={matches ?? 0} href="/matches" />
            <MiniStat label="Applications" value={applications ?? 0} href="/applications" sparkline />
          </div>

          <button
            onClick={onRun}
            disabled={running}
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-sm font-medium text-white transition-all hover:bg-ink-soft active:scale-[0.98] disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${running ? 'animate-spin' : ''}`} />
            {running ? 'Searching…' : 'Run a fresh search'}
          </button>
        </div>

        {/* Centre: decorative illustration */}
        <div className="hidden items-center justify-center py-2 lg:flex">
          <div className="w-full max-w-md">
            <EcoIllustration />
          </div>
        </div>

        {/* Right: readouts */}
        <div className="flex flex-row items-center gap-6 lg:flex-col lg:items-end lg:justify-center lg:gap-8 lg:text-right">
          <div>
            <p className="font-display text-2xl font-bold text-ink sm:text-3xl">
              {jobsToday ?? 0}
              <span className="text-base font-semibold"> new</span>
            </p>
            <p className="text-xs font-medium text-slate">Jobs Today</p>
          </div>
          <div>
            <p className="font-display text-2xl font-bold text-ink sm:text-3xl">
              {resumeScore != null ? resumeScore : '—'}
              {resumeScore != null && <span className="text-base font-semibold">%</span>}
            </p>
            <p className="text-xs font-medium text-slate">Resume Score</p>
          </div>
        </div>
      </div>
    </div>
  );
}
