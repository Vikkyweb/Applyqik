'use client';

// app/(app)/jobs/page.jsx
//
// Same visual language as Profile / Matches / Applications: soft gray
// canvas, bold header bar with icon, Sync sources as a white pill button in
// the header, search + remote filter beneath. JobCard already renders as a
// white rounded card, so the list sits directly on the canvas.

import { useEffect, useState, useCallback } from 'react';
import { Briefcase, Search, RefreshCw } from 'lucide-react';
import { jobs as jobsApi } from '@/libs/api';
import { useToast } from '@/components/ui/Toast';
import JobCard from '@/components/jobs/JobCard';
import JobCardSkeleton from '@/components/jobs/JobCardSkeleton';
import EmptyState from '@/components/ui/EmptyState';
import Button from '@/components/ui/Button';

export default function JobsPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [remoteOnly, setRemoteOnly] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await jobsApi.list({
        search: search || undefined,
        remote: remoteOnly ? 1 : undefined,
        per_page: 30,
      });
      setItems(res.jobs ?? []);
      setTotal(res.meta?.total ?? 0);
    } catch (err) {
      toast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  }, [search, remoteOnly, toast]);

  useEffect(() => {
    const t = setTimeout(load, search ? 350 : 0); // debounce search
    return () => clearTimeout(t);
  }, [load, search]);

  async function runSync() {
    setSyncing(true);
    try {
      await jobsApi.sync();
      toast('Pulling fresh jobs from all sources...');
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
      <div className="border-b border-black/5 py-6">
        <div className="mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <Briefcase className="h-6 w-6 text-ink" strokeWidth={2.25} />
            <h1 className="font-display text-[26px] font-bold leading-none text-ink sm:text-[30px]">
              All jobs
            </h1>
            {total > 0 && (
              <span className="rounded-xl bg-background px-2.5 py-1 font-mono text-[13px] font-medium text-foreground">
                {total.toLocaleString()}
              </span>
            )}
          </div>
          <Button
            onClick={runSync}
            loading={syncing}
            className="rounded-xl ring-1 flex gap-2 ring-black/5 bg-card px-4 py-2.5 text-sm font-medium text-foreground hover:ring-secondary/50 hover:text-secondary"
          >
            <RefreshCw className={`h-4 w-4 ${syncing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Sync sources</span>
          </Button>
        </div>
      </div>

      <div className="mx-auto space-y-5 py-6 sm:py-8">
        {/* Search + remote filter */}
        <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search roles, companies, skills..."
              className="w-full rounded-full bg-card py-3 pl-11 pr-4 text-[15px] text-foreground outline-none transition-all ring-1 ring-black/5 placeholder:text-foreground focus:ring-secondary"
            />
          </div>
          <button
            type="button"
            aria-pressed={remoteOnly}
            onClick={() => setRemoteOnly((v) => !v)}
            className={`shrink-0 bg-card rounded-xl ring-1 ring-black/5 px-5 py-3 text-[14px] font-medium transition-colors duration-150 ${
              remoteOnly
                ? 'bg-secondary text-white ring-secondary/5'
                : 'text-foreground hover:ring-secondary/50 hover:text-secondary'
            }`}
          >
            Remote only
          </button>
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
            {items.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        ) : (
          <div className="rounded-[28px] bg-card p-2 sm:p-4">
            <EmptyState
              icon={Briefcase}
              title={search ? 'No jobs match that search' : 'No jobs loaded yet'}
              description={
                search
                  ? 'Try a broader term, or sync sources to pull in the latest roles.'
                  : 'Sync the job sources to bring in live roles from every provider.'
              }
              action={
                <Button
                  onClick={runSync}
                  loading={syncing}
                  className="rounded-xl flex gap-2 bg-secondary text-white px-6 py-3 text-[15px] font-semibold  ring-1 ring-black/5"
                >
                  <RefreshCw className="h-4 w-4" />
                  Sync job sources
                </Button>
              }
            />
          </div>
        )}
      </div>
    </div>
  );
}