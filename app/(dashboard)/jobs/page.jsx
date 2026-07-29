'use client';

// app/(app)/jobs/page.jsx
//
// FIX: this page previously ran a blind, unfiltered query regardless of who
// was logged in -- a graphic designer and a warehouse worker saw the exact
// same first screen. That's not a bug in the search filter itself (verified
// correct against the real controller), it's that personalization was never
// applied by default at all. "Browse everything" should be an explicit
// choice, not the first thing anyone sees.
//
// NEW BEHAVIOR:
//   - On load, fetch the user's preferences (Phase 3) and pick the
//     highest-priority one as the default search term.
//   - Falls back to profile.preferences.roles[0] if no preference row exists.
//   - If neither exists, shows an honest banner pointing to /preferences
//     instead of silently showing an unfiltered feed with no explanation.
//   - A visible toggle lets the user deliberately see everything unfiltered
//     -- "Relevant to me" is the default state, not the only state.

import { useEffect, useState, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { Briefcase, Search, RefreshCw, Target, ArrowRight } from 'lucide-react';
import { jobs as jobsApi, preferences as prefsApi, profile as profileApi } from '@/libs/api';
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

  // Personalization state -- resolved once on mount, before the first job
  // fetch, so the very first screen a user sees is already relevant.
  const [primaryRole, setPrimaryRole] = useState(null); // string | null
  const [resolvingPrefs, setResolvingPrefs] = useState(true);
  const [relevantMode, setRelevantMode] = useState(true); // the default state

  // Step 1: figure out what "relevant" means for this user, BEFORE loading
  // any jobs -- this is what was missing entirely before.
  useEffect(() => {
    let active = true;
    async function resolvePrimaryRole() {
      try {
        const prefs = await prefsApi.list().catch(() => []);
        const list = Array.isArray(prefs) ? prefs : prefs?.preferences ?? [];

        if (list.length > 0) {
          // Highest priority = lowest number (1 is highest, matches the
          // Preferences page's own convention).
          const top = [...list].sort((a, b) => (a.priority ?? 99) - (b.priority ?? 99))[0];
          if (active) setPrimaryRole(top.desired_title ?? null);
          return;
        }

        // No preference rows yet -- fall back to whatever role the profile
        // (or onboarding) captured, rather than treating "no preferences"
        // as "show everything with no explanation."
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

  // Step 2: once we know the primary role, seed the search box with it --
  // but only on first resolution, so it doesn't fight the user if they've
  // since typed their own search term.
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
        per_page: 25,
      });
      setItems(res ?? []);
      setTotal(res.meta?.total ?? 0);
      
    } catch (err) {
      toast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  }, [search, remoteOnly, toast]);

  useEffect(() => {
    // Wait for preference resolution before the first fetch, so we never
    // fire one unfiltered request and then immediately replace it.
    if (resolvingPrefs) return;
    const t = setTimeout(load, search ? 350 : 0); // debounce search
    return () => clearTimeout(t);
  }, [load, search, resolvingPrefs]);

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

  // The toggle: switching OFF relevant mode clears the search so the raw,
  // unranked feed shows -- an explicit, visible choice. Switching back ON
  // restores the primary role if one exists.
  function toggleRelevantMode() {
    setRelevantMode((wasRelevant) => {
      const nowRelevant = !wasRelevant;
      setSearch(nowRelevant ? (primaryRole ?? '') : '');
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
              className="rounded-xl ring-1 flex gap-2 ring-black/5 bg-card px-4 py-2.5 text-sm font-medium text-foreground hover:ring-secondary/50 hover:text-secondary"
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
        {/* Honest banner when there's nothing to personalize against yet --
            never silently fall back to an unexplained unfiltered feed. */}
        {hasNoPreference && (
          <Link
            href="/preferences"
            className="flex items-center gap-4 rounded-xl ring-1 ring-black/5 bg-accent-soft/40 p-4 transition-colors hover:bg-accent-soft/70"
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
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search roles, companies, skills..."
              className="w-full rounded-xl ring-1 ring-black/5 bg-card py-3 pl-11 pr-4 text-[15px] text-foreground outline-none transition-all placeholder:text-foreground focus:ring-secondary"
            />
          </div>
          <button
            type="button"
            aria-pressed={remoteOnly}
            onClick={() => setRemoteOnly((v) => !v)}
            className={`shrink-0 rounded-xl ring-1 ring-black/5 px-5 py-3 text-[14px] font-medium transition-colors duration-150 ${
              remoteOnly
                ? 'bg-secondary text-white ring-secondary/5'
                : 'text-foreground hover:ring-secondary/50 hover:text-secondary'
            }`}
          >
            Remote only
          </button>
        </div>

        {/* Relevant-to-me toggle -- explicit, visible, on by default */}
        {primaryRole && (
          <div className="flex items-center justify-between rounded-xl ring-1 ring-black/5 bg-card px-4 py-3">
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
                relevantMode ? "bg-secondary" : "bg-gray-300"
              }`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform duration-200 ${
                  relevantMode ? "translate-x-5" : "translate-x-0.5"
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
          <div className="space-y-3">
            {items.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
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