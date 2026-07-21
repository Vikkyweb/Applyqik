'use client';

// app/(app)/matches/page.jsx
//
// Redesigned to match the Profile page's visual language: soft gray canvas,
// bold header bar with icon, pill filters with a dark fill on the selected
// pill. Job list sits directly on the canvas -- JobCard already renders as
// a white card, so no extra wrapper is needed there.

import { useEffect, useState, useCallback } from 'react';
import { Sparkles, RefreshCw, SlidersHorizontal } from 'lucide-react';
import { matches as matchesApi, jobs as jobsApi } from '@/libs/api';
import { useToast } from '@/components/ui/Toast';
import JobCard from '@/components/jobs/JobCard';
import JobCardSkeleton from '@/components/jobs/JobCardSkeleton';
import EmptyState from '@/components/ui/EmptyState';
import Button from '@/components/ui/Button';

const FILTERS = [
  { label: 'All', value: 0 },
  { label: '60%+', value: 60 },
  { label: '80%+', value: 80 },
];

export default function MatchesPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [items, setItems] = useState([]);
  const [minScore, setMinScore] = useState(0);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await matchesApi.list({ min_score: minScore || undefined, per_page: 30 });
      setItems(res.matches ?? []);
      // NOTE: logging `res.matches` here, not `items` -- state setters are
      // async, so `items` would still hold the previous render's value.
    } catch (err) {
      toast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  }, [minScore, toast]);

  useEffect(() => {
    load();
  }, [load]);

  async function refresh() {
    setSyncing(true);
    try {
      await jobsApi.sync();
      await matchesApi.refresh();
      toast('Re-ranking your matches...');
      setTimeout(load, 2500);
    } catch (err) {
      toast(err.message, 'error');
    } finally {
      setSyncing(false);
    }
  }

  return (
    <div className="min-h-screen">
      {/* Header bar */}
      <div className="border-b border-black/5 px-5 py-6 sm:px-8">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <Sparkles className="h-6 w-6 text-foreground" strokeWidth={2.25} />
            <h1 className="font-display text-[26px] font-bold leading-none text-foreground sm:text-[30px]">
              Matches
            </h1>
          </div>
          <Button
            onClick={refresh}
            loading={syncing}
            className="rounded-xl ring-1 flex gap-2 ring-black/5 bg-card px-4 py-2.5 text-sm font-medium text-foreground hover:bg-white/70"
          >
            <RefreshCw className={`h-4 w-4 ${syncing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </Button>
        </div>
      </div>

      <div className="mx-auto space-y-5 py-6 sm:py-8">
        {/* Score filter -- same pill treatment as Profile's work-preference selector */}
        <div className="flex items-center gap-1">
          <SlidersHorizontal className="h-4 w-4 shrink-0 text-foreground" />
          <div className="flex flex-wrap gap-2">
            {FILTERS.map((f) => {
              const selected = minScore === f.value;
              return (
                <button
                  key={f.value}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => setMinScore(f.value)}
                  className={`bg-card rounded-xl ring-1 ring-black/5 px-5 py-2 text-[14px] font-medium transition-colors duration-150 ${
                    selected
                      ? 'bg-secondary text-white ring-secondary/5'
                      : 'text-foreground hover:ring-secondary/50 hover:text-secondary'
                  }`}
                >
                  {f.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <JobCardSkeleton key={i} />
            ))}
          </div>
        ) : items.length > 0 ? (
          <div className="space-y-3">
            {items.map((m) => (
              <JobCard key={m.id} job={m.job} match={m} />
            ))}
          </div>
        ) : (
          <div className="rounded-[28px] bg-card p-2 sm:p-4">
            <EmptyState
              icon={Sparkles}
              title="No matches at this level yet"
              description="Lower the score filter, run a fresh search, or upload your resume to sharpen ranking."
              action={
                <Button
                  variant="accent"
                  onClick={refresh}
                  loading={syncing}
                  className="rounded-full px-6 py-3 text-[15px] font-semibold"
                >
                  <RefreshCw className="h-4 w-4" />
                  Run a search
                </Button>
              }
            />
          </div>
        )}
      </div>
    </div>
  );
}