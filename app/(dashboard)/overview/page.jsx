'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { Search, Bell, Sparkles, Target, FileCheck2, CalendarClock, ChevronRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { matches as matchesApi, jobs as jobsApi, applications as appsApi, resume as resumeApi } from '@/libs/api';
import { useToast } from '@/components/ui/Toast';
import HeroPanel from '@/components/dashboard/HeroPanel';
import StatCard from '@/components/dashboard/StatCard';
import ActivityChart from '@/components/dashboard/ActivityChart';
import SourceHealth from '@/components/dashboard/SourceHealth';
import MatchQualityChart from '@/components/dashboard/MatchQualityChart';
import JobCard from '@/components/jobs/JobCard';
import JobCardSkeleton from '@/components/jobs/JobCardSkeleton';

export default function DashboardPage() {
  const { user } = useAuth();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [topMatches, setTopMatches] = useState([]);
  const [stats, setStats] = useState({ matches: 0, applications: 0, interviews: 0, jobsToday: 0, totalJobs: 0 });
  const [sources, setSources] = useState([]);
  const [resumeScore, setResumeScore] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [matchRes, appRes, jobStats, resumes] = await Promise.all([
        matchesApi.list({ per_page: 4 }).catch(() => ({ matches: [], meta: { total: 0 } })),
        appsApi.list({ per_page: 50 }).catch(() => ({ applications: [], meta: { total: 0 } })),
        jobsApi.stats().catch(() => ({ added_today: 0, total_listings: 0, sources: [] })),
        resumeApi.list().catch(() => []),
      ]);

      const apps = appRes.applications ?? [];
      const interviews = apps.filter((a) => a.status === 'interview').length;

      setTopMatches(matchRes.matches ?? []);
      setStats({
        matches: matchRes.meta?.total ?? 0,
        applications: appRes.meta?.total ?? apps.length,
        interviews,
        jobsToday: jobStats.added_today ?? 0,
        totalJobs: jobStats.total_listings ?? 0,
      });
      setSources(jobStats.sources ?? []);

      const best = (matchRes.matches ?? [])[0]?.match_score ?? null;
      const parsed = Array.isArray(resumes) && resumes.some((r) => r.status === 'parsed');
      setResumeScore(parsed ? best : null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function runHunt() {
    setSyncing(true);
    try {
      await jobsApi.sync();
      await matchesApi.refresh().catch(() => null);
      toast('Search started — new matches arrive in a moment');
      setTimeout(load, 2500);
    } catch (err) {
      toast(err.message, 'error');
    } finally {
      setSyncing(false);
    }
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Top bar: Dashboard label · search · bell */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-sm font-medium text-slate">
          <span className="grid h-4 w-4 grid-cols-2 gap-0.5">
            <span className="rounded-[1px] bg-slate-soft" />
            <span className="rounded-[1px] bg-slate-soft" />
            <span className="rounded-[1px] bg-slate-soft" />
            <span className="rounded-[1px] bg-slate-soft" />
          </span>
          Dashboard
        </div>

        <div className="relative ml-auto hidden w-full max-w-sm sm:block">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-soft" />
          <Link
            href="/jobs"
            className="block truncate rounded-full border border-line bg-surface py-2.5 pl-11 pr-4 text-sm text-slate-soft hover:border-line-strong"
          >
            Search…
          </Link>
        </div>

        <button className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line bg-surface text-slate hover:text-ink">
          <Bell className="h-[18px] w-[18px]" />
        </button>
      </div>

      {/* Hero */}
      <HeroPanel
        matches={stats.matches}
        applications={stats.applications}
        jobsToday={stats.jobsToday}
        resumeScore={resumeScore}
        onRun={runHunt}
        running={syncing}
      />

      {/* Main grid — reference proportions: wide left, narrow right */}
      <div className="grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-3">
        {/* Left column */}
        <div className="flex flex-col gap-4 md:gap-6 lg:col-span-2">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <StatCard icon={Target} value={stats.matches} label="Matches Found" change={stats.jobsToday ? `${stats.jobsToday} today` : '—'} positive />
            <StatCard icon={FileCheck2} value={stats.applications} label="Applications" change={stats.applications ? 'tracked' : '—'} positive />
            <StatCard icon={CalendarClock} value={stats.interviews} label="Interviews" change={stats.interviews ? 'scheduled' : '—'} positive />
          </div>

          <ActivityChart />
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-4 md:gap-6 lg:col-span-1">
          <SourceHealth sources={sources} />
          <MatchQualityChart />
        </div>
      </div>

      {/* Top matches — Applyqik's real content */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="flex items-center gap-2 font-display text-base font-semibold text-ink">
            <Sparkles className="h-4 w-4 text-accent" />
            Top matches
          </h2>
          <Link href="/matches" className="inline-flex items-center gap-0.5 text-sm font-medium text-accent-ink hover:underline">
            View all
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        {loading ? (
          <div className="space-y-3">
            <JobCardSkeleton />
            <JobCardSkeleton />
          </div>
        ) : topMatches.length > 0 ? (
          <div className="space-y-3">
            {topMatches.map((m) => (
              <JobCard key={m.id} job={m.job} match={m} />
            ))}
          </div>
        ) : (
          <div className="card p-8 text-center">
            <p className="font-medium text-ink">No matches yet</p>
            <p className="mt-1 text-sm text-slate">
              Run a search to pull in fresh roles, or upload your resume to unlock AI ranking.
            </p>
            <button onClick={runHunt} disabled={syncing} className="btn-accent mt-4 px-5 py-3">
              Run your first search
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
