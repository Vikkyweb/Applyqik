'use client';

// app/(app)/jobs/page.jsx
//
// FIXED (real bug, independent of pagination): `setItems(res ?? [])` was
// assigning the ENTIRE response envelope ({jobs, meta}) to `items`, not
// the jobs array inside it. `items.map(...)` further down expects an array
// of job objects -- this would have rendered nothing or crashed depending
// on the exact shape. Corrected to `setItems(res.jobs ?? [])`.
//
// ADDED: pagination. Resets to page 1 whenever the search term or the
// remote-only toggle changes, same reasoning as Matches -- a stale page
// number from a longer result set could silently land past a shorter one.

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { Briefcase, Search, RefreshCw, Target, ArrowRight } from 'lucide-react';
import { jobs as jobsApi, preferences as prefsApi, profile as profileApi } from '@/libs/api';
import { useToast } from '@/components/ui/Toast';
import JobCard from '@/components/jobs/JobCard';
import JobCardSkeleton from '@/components/jobs/JobCardSkeleton';
import EmptyState from '@/components/ui/EmptyState';
import Button from '@/components/ui/Button';
import Pagination from '@/components/ui/Pagination';

export default function JobsPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  const [primaryRole, setPrimaryRole] = useState(null);
  const [resolvingPrefs, setResolvingPrefs] = useState(true);
  const [relevantMode, setRelevantMode] = useState(true);

  useEffect(() => {
    let active = true;
    async function resolvePrimaryRole() {
      try {
        const prefs = await prefsApi.list().catch(() => []);
        const list = Array.isArray(prefs) ? prefs : prefs?.preferences ?? [];

        if (list.length > 0) {
          const top = [...list].sort((a, b) => (a.priority ?? 99) - (b.priority ?? 99))[0];
          if (active) setPrimaryRole(top.desired_title ?? null);
          return;
        }

        const prof = await profileApi.get().catch(() => null);
        const fallbackRole = prof?.preferences?.roles?.[0] ?? null;
        if (active) setPrimaryRole(fallbackRole);
      } finally {
        if (active) setResolvingPrefs(false);
      }
    }
    resolvePrimaryRole();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!resolvingPrefs && primaryRole && relevantMode && search === '') {
      setSearch(primaryRole);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resolvingPrefs, primaryRole]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await jobsApi.list({
        search: search || undefined,
        remote: remoteOnly ? 1 : undefined,
        page,
        per_page: 25,
      });
      // FIX: your real JobListingController returns `data` as the BARE
      // array of jobs directly, with `meta` as a SIBLING key -- not nested
      // as `{ jobs: [...] }`. Combined with the apiFetch fix (which now
      // attaches `meta` onto the returned array), `res` IS the jobs array,
      // and `res.meta` carries pagination info.
      setItems(Array.isArray(res) ? res : []);
      setTotal(res.meta?.total ?? 0);
      setLastPage(res.meta?.last_page ?? 1);
    } catch (err) {
      toast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  }, [search, remoteOnly, page, toast]);

  useEffect(() => {
    if (resolvingPrefs) return;
    const t = setTimeout(load, search ? 350 : 0);
    return () => clearTimeout(t);
  }, [load, search, resolvingPrefs]);

  // Reset to page 1 whenever the search term changes -- otherwise a page
  // number from a longer previous result set can silently point past the
  // end of a new, shorter one.
  function updateSearch(value) {
    setSearch(value);
    setPage(1);
  }

  function toggleRemoteOnly() {
    setRemoteOnly((v) => !v);
    setPage(1);
  }

  function changePage(next) {
    setPage(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

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

  function toggleRelevantMode() {
    setRelevantMode((wasRelevant) => {
      const nowRelevant = !wasRelevant;
      setSearch(nowRelevant ? (primaryRole ?? '') : '');
      setPage(1);
      return nowRelevant;
    });
  }

  const hasNoPreference = !resolvingPrefs && !primaryRole;

  return (
    <div className="min-h-screen">
      {/* Header bar */}
      <div className="border-b border-black/5 py-6">
        <div className="mx-auto">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <Briefcase className="h-6 w-6 text-foreground" strokeWidth={2.25} />
              <h1 className="font-display text-[26px] font-bold leading-none text-foreground sm:text-[30px]">
                All jobs
              </h1>
              {total > 0 && (
                <span className="rounded-xl bg-background px-2.5 py-1 font-mono text-[13px] font-medium text-slate">
                  {total.toLocaleString()}
                </span>
              )}
            </div>
            <Button
              variant="outline"
              onClick={runSync}
              loading={syncing}
              className="flex gap-2 rounded-xl bg-card px-4 py-2.5 text-sm font-medium text-foreground ring-1 ring-black/5 hover:text-secondary hover:ring-secondary/50"
            >
              <RefreshCw className={`h-4 w-4 ${syncing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Sync sources</span>
            </Button>
          </div>
          <p className="mt-1.5 text-[13.5px] text-slate">
            {relevantMode && primaryRole
              ? `Showing roles related to "${primaryRole}". Switch off to browse everything.`
              : "Everything we've found, unranked."}
          </p>
        </div>
      </div>

      <div className="mx-auto space-y-5 py-6 sm:py-8">
        {hasNoPreference && (
          <Link
            href="/preferences"
            className="flex items-center gap-4 rounded-xl bg-accent-soft/40 p-4 ring-1 ring-black/5 transition-colors hover:bg-accent-soft/70"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-soft">
              <Target className="h-5 w-5 text-accent" />
            </div>
            <div className="flex-1">
              <p className="text-[14px] font-semibold text-ink">Set a role to personalize this feed</p>
              <p className="text-[13px] text-slate">Without one, you're seeing every job we've found, unfiltered.</p>
            </div>
            <ArrowRight className="h-4 w-4 shrink-0 text-accent" />
          </Link>
        )}

        {/* Search + filters */}
        <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-soft" />
            <input
              value={search}
              onChange={(e) => updateSearch(e.target.value)}
              placeholder="Search roles, companies, skills..."
              className="w-full rounded-xl bg-card py-3 pl-11 pr-4 text-[15px] text-foreground outline-none ring-1 ring-black/5 transition-all placeholder:text-foreground focus:ring-secondary"
            />
          </div>
          <button
            type="button"
            aria-pressed={remoteOnly}
            onClick={toggleRemoteOnly}
            className={`shrink-0 rounded-xl px-5 py-3 text-[14px] font-medium ring-1 ring-black/5 transition-colors duration-150 ${
              remoteOnly
                ? 'bg-secondary text-white ring-secondary/5'
                : 'text-foreground hover:text-secondary hover:ring-secondary/50'
            }`}
          >
            Remote only
          </button>
        </div>

        {/* Relevant-to-me toggle */}
        {primaryRole && (
          <div className="flex items-center justify-between rounded-xl bg-card px-4 py-3 ring-1 ring-black/5">
            <div className="flex items-center gap-2.5">
              <Target className="h-4 w-4 text-foreground" />
              <span className="text-[13.5px] font-medium text-foreground">
                Relevant to me{' '}
                <span className="font-normal text-slate-soft">&middot; based on &ldquo;{primaryRole}&rdquo;</span>
              </span>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={relevantMode}
              onClick={toggleRelevantMode}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                relevantMode ? 'bg-secondary' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform duration-200 ${
                  relevantMode ? 'translate-x-5' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>
        )}

        {/* Results */}
        {loading || resolvingPrefs ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <JobCardSkeleton key={i} />
            ))}
          </div>
        ) : items.length > 0 ? (
          <>
            <div className="space-y-3">
              {items.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>

            <Pagination currentPage={page} lastPage={lastPage} onPageChange={changePage} className="pt-2" />
          </>
        ) : (
          <div className="rounded-xl bg-card p-2 sm:p-4">
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
                  variant="accent"
                  onClick={runSync}
                  loading={syncing}
                  className="rounded-xl px-6 py-3 text-[15px] font-semibold"
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