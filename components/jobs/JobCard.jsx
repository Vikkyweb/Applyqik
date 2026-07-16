'use client';

import { useState } from 'react';
import { MapPin, Building2, Bookmark, ExternalLink, Check } from 'lucide-react';
import ScoreBadge from '@/components/ui/ScoreBadge';
import { savedJobs as savedApi, applications as appsApi } from '@/lib/api';
import { useToast } from '@/components/ui/Toast';

// One card, reused for plain listings and scored matches.
// `match` is optional — when present we show the score + why-it-fits.
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
      // Duplicate application returns a validation error — treat as already tracked
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
      className="card group cursor-pointer p-5 transition-shadow hover:shadow-card-hover"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate font-display text-[15px] font-semibold text-ink">{job.title}</h3>
            {match && <ScoreBadge score={match.match_score} />}
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-slate">
            <span className="inline-flex items-center gap-1">
              <Building2 className="h-3.5 w-3.5" />
              {job.company_name}
            </span>
            {job.location && (
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                {job.location}
              </span>
            )}
            {job.remote && <span className="pill bg-accent-soft text-accent-ink">Remote</span>}
          </div>
        </div>

        <button
          onClick={toggleSave}
          className={`shrink-0 rounded-lg p-2 transition-colors ${
            saved ? 'text-accent' : 'text-slate-soft hover:bg-line-soft hover:text-ink'
          }`}
          title={saved ? 'Saved' : 'Save'}
        >
          <Bookmark className="h-[18px] w-[18px]" fill={saved ? 'currentColor' : 'none'} />
        </button>
      </div>

      {match?.summary && (
        <p className="mt-3 line-clamp-2 text-[13px] leading-relaxed text-slate">{match.summary}</p>
      )}

      {match?.matched_keywords?.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {match.matched_keywords.slice(0, 4).map((kw) => (
            <span key={kw} className="pill bg-line-soft text-ink-soft">
              {kw}
            </span>
          ))}
        </div>
      )}

      <div className="mt-4 flex items-center gap-2">
        <a
          href={job.apply_url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="btn-accent px-3.5 py-2 text-[13px]"
        >
          Apply
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
        <button
          onClick={markApplied}
          disabled={applied}
          className="btn-outline px-3.5 py-2 text-[13px]"
        >
          {applied ? (
            <>
              <Check className="h-3.5 w-3.5 text-accent" /> Tracked
            </>
          ) : (
            'Track application'
          )}
        </button>
        {job.source && (
          <span className="ml-auto font-mono text-[11px] uppercase tracking-wide text-slate-soft">
            {job.source}
          </span>
        )}
      </div>
    </div>
  );
}
