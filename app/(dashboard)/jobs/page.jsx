'use client';

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
      toast('Pulling fresh jobs from all sources…');
      setTimeout(load, 2500);
    } catch (err) {
      toast(err.message, 'error');
    } finally {
      setSyncing(false);
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="flex items-center gap-2 font-display text-2xl font-semibold text-ink">
          <Briefcase className="h-5 w-5" />
          All jobs
          {total > 0 && <span className="font-mono text-sm font-normal text-slate">{total.toLocaleString()}</span>}
        </h1>
        <Button variant="outline" onClick={runSync} loading={syncing} className="text-sm">
          <RefreshCw className={`h-4 w-4 ${syncing ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">Sync sources</span>
        </Button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-soft" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search roles, companies, skills…"
            className="input pl-10"
          />
        </div>
        <button
          onClick={() => setRemoteOnly((v) => !v)}
          className={`pill shrink-0 border px-4 py-2.5 ${
            remoteOnly ? 'border-ink bg-ink text-white' : 'border-line bg-surface text-slate hover:text-ink'
          }`}
        >
          Remote only
        </button>
      </div>

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
        <EmptyState
          icon={Briefcase}
          title={search ? 'No jobs match that search' : 'No jobs loaded yet'}
          description={
            search
              ? 'Try a broader term, or sync sources to pull in the latest roles.'
              : 'Sync the job sources to bring in live roles from every provider.'
          }
          action={
            <Button variant="accent" onClick={runSync} loading={syncing}>
              <RefreshCw className="h-4 w-4" />
              Sync job sources
            </Button>
          }
        />
      )}
    </div>
  );
}
