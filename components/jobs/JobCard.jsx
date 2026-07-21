'use client';

// components/jobs/JobCard.jsx
//
// Redesigned to match the reference: fully-rounded (pill) buttons, generous
// card padding, plain outline bookmark icon (no button chrome), source label
// tucked to the far right. Responsive -- the action row wraps on narrow
// screens instead of overflowing or squeezing the source label off-card.

import { useState } from 'react';
import { MapPin, Building2, Bookmark, ExternalLink, Check } from 'lucide-react';
import ScoreBadge from '@/components/ui/ScoreBadge';
import { savedJobs as savedApi, applications as appsApi } from '@/libs/api';
import { useToast } from '@/components/ui/Toast';

// One card, reused for plain listings and scored matches.
// `match` is optional -- when present we show the score + why-it-fits.
export default function JobCard({ job, match, saved: initialSaved = false, onOpen }) {
  const { toast } = useToast();
  const [saved, setSaved] = useState(initialSaved);
  const [saving, setSaving] = useState(false);
  const [applied, setApplied] = useState(false);

  async function toggleSave(e) {
    e.stopPropagation();
    if (saving) return;
    setSaving(true);
    try {
      if (!saved) {
        await savedApi.save(job.id);
        setSaved(true);
        toast('Saved to your list');
      }
    } catch (err) {
      toast(err.message, 'error');
    } finally {
      setSaving(false);
    }
  }

  async function markApplied(e) {
    e.stopPropagation();
    try {
      await appsApi.create(job.id, {});
      await appsApi.list().catch(() => null);
      setApplied(true);
      toast('Added to your applications');
    } catch (err) {
      // Duplicate application returns a validation error -- treat as already tracked
      if (err.status === 422) {
        setApplied(true);
        toast('Already in your applications');
      } else {
        toast(err.message, 'error');
      }
    }
  }

  return (
    <div
      onClick={onOpen}
      className="group rounded-[24px] bg-card p-5 transition-shadow hover:shadow-card-hover sm:p-6"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <h3 className="font-display text-[16px] font-bold leading-snug text-foreground sm:text-[17px]">
              {job.title}
            </h3>
            {match && <ScoreBadge score={match.match_score} size="lg" />}
          </div>
          <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13.5px] text-foreground">
            <span className="inline-flex items-center gap-1.5">
              <Building2 className="h-3.5 w-3.5 shrink-0" />
              {job.company_name}
            </span>
            {job.location && (
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 shrink-0" />
                {job.location}
              </span>
            )}
            {job.remote && (
              <span className="rounded-full bg-accent-soft px-2.5 py-0.5 text-xs font-medium text-accent-ink">
                Remote
              </span>
            )}
          </div>
        </div>

        <button
          onClick={toggleSave}
          className={`shrink-0 cursor-pointer p-1 transition-colors ${
            saved ? 'text-ink' : 'text-slate-soft hover:text-ink'
          }`}
          title={saved ? 'Saved' : 'Save'}
        >
          <Bookmark className="h-5 w-5" fill={saved ? 'currentColor' : 'none'} strokeWidth={1.75} />
        </button>
      </div>

      {match?.summary && (
        <p className="mt-3 line-clamp-2 text-[14px] leading-relaxed text-slate">{match.summary}</p>
      )}

      {match?.matched_keywords?.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {match.matched_keywords.slice(0, 4).map((kw) => (
            <span key={kw} className="rounded-full bg-[#F1F0EB] px-2.5 py-1 text-xs text-ink-soft">
              {kw}
            </span>
          ))}
        </div>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-2.5">
        <a
          href={job.apply_url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="inline-flex items-center gap-2 rounded-full bg-secondary px-5 py-2.5 text-[14px] font-semibold text-white transition-colors hover:brightness-105"
        >
          Apply
          <ExternalLink className="h-4 w-4" />
        </a>
        <button
          onClick={markApplied}
          disabled={applied}
          className="inline-flex items-center gap-2 rounded-full ring-1 ring-black/5 bg-background px-5 py-2.5 text-[14px] font-semibold text-ink transition-colors hover:border-gray-300 disabled:opacity-70"
        >
          {applied ? (
            <>
              <Check className="h-4 w-4 text-foreground" /> Tracked
            </>
          ) : (
            'Track application'
          )}
        </button>
        {job.source && (
          <span className="ml-auto font-mono text-[11px] font-medium uppercase tracking-wide text-slate-soft">
            {job.source}
          </span>
        )}
      </div>
    </div>
  );
}