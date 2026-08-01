'use client';

// app/(app)/matches/page.jsx
//
// ADDED: pagination. Previously fetched a flat per_page:30 with no way to
// see anything beyond that -- now tracks current/last page and resets to
// page 1 whenever the score filter changes (a stale page number surviving
// a filter change could silently land past the new, shorter result set).

import { useEffect, useState, useCallback } from 'react';
import { Sparkles, RefreshCw, SlidersHorizontal } from 'lucide-react';
import { matches as matchesApi, jobs as jobsApi } from '@/libs/api';
import { useToast } from '@/components/ui/Toast';
import JobCard from '@/components/jobs/JobCard';
import JobCardSkeleton from '@/components/jobs/JobCardSkeleton';
import EmptyState from '@/components/ui/EmptyState';
import Button from '@/components/ui/Button';
import Pagination from '@/components/ui/Pagination';
import ReadyToApplyPanel from '@/components/dashboard/ReadyToApplyPanel';

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
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [preparingJob, setPreparingJob] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await matchesApi.list({ min_score: minScore || undefined, page, per_page: 30 });
      setItems(res.matches ?? []);
      setLastPage(res.meta?.last_page ?? 1);
    } catch (err) {
      toast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  }, [minScore, page, toast]);

  useEffect(() => {
    load();
  }, [load]);

  // A stale page number from a previous, longer result set could silently
  // point past the end of a newly-filtered one -- reset to page 1 whenever
  // the filter itself changes.
  function selectFilter(value) {
    setMinScore(value);
    setPage(1);
  }

  function changePage(next) {
    setPage(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

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
            className="flex gap-2 rounded-xl bg-card px-4 py-2.5 text-sm font-medium text-foreground ring-1 ring-black/5 hover:bg-white/70"
          >
            <RefreshCw className={`h-4 w-4 ${syncing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </Button>
        </div>
        <p className="mt-1.5 block text-[13.5px] text-slate">
          Ranked for you, based on your profile and resume.
        </p>
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
                  onClick={() => selectFilter(f.value)}
                  className={`rounded-xl bg-card px-5 py-2 text-[14px] font-medium ring-1 ring-black/5 transition-colors duration-150 ${
                    selected
                      ? 'bg-secondary text-white ring-secondary/5'
                      : 'text-foreground hover:text-secondary hover:ring-secondary/50'
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
          <>
            <div className="space-y-3">
              {items.map((m) => (
                <JobCard key={m.id} job={m.job} match={m} onPrepare={() => setPreparingJob(m.job)} />
              ))}
            </div>

            <Pagination currentPage={page} lastPage={lastPage} onPageChange={changePage} className="pt-2" />

            {preparingJob && (
              <ReadyToApplyPanel
                job={preparingJob}
                applicationId={null}
                onClose={() => setPreparingJob(null)}
                onApplied={() => setPreparingJob(null)}
              />
            )}
          </>
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
                  className="flex gap-2 rounded-xl bg-secondary px-6 py-3 text-[15px] font-semibold text-white ring-secondary/5"
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