'use client';

import { useEffect, useState, useCallback } from 'react';
import { Sparkles, RefreshCw, SlidersHorizontal } from 'lucide-react';
import { matches as matchesApi, jobs as jobsApi } from '@/lib/api';
import { useToast } from '@/components/ui/Toast';
import JobCard from '@/components/jobs/JobCard';
import JobCardSkeleton from '@/components/jobs/JobCardSkeleton';
import EmptyState from '@/components/ui/EmptyState';
import Button from '@/components/ui/Button';

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
      toast('Re-ranking your matches…');
      setTimeout(load, 2500);
    } catch (err) {
      toast(err.message, 'error');
    } finally {
      setSyncing(false);
    }
  }

  const filters = [
    { label: 'All', value: 0 },
    { label: '60%+', value: 60 },
    { label: '80%+', value: 80 },
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="flex items-center gap-2 font-display text-2xl font-semibold text-ink">
          <Sparkles className="h-5 w-5 text-accent" />
          Matches
        </h1>
        <Button variant="outline" onClick={refresh} loading={syncing} className="text-sm">
          <RefreshCw className={`h-4 w-4 ${syncing ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">Refresh</span>
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <SlidersHorizontal className="h-4 w-4 text-slate" />
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => setMinScore(f.value)}
            className={`pill border transition-colors ${
              minScore === f.value
                ? 'border-ink bg-ink text-white'
                : 'border-line bg-surface text-slate hover:text-ink'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

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
        <EmptyState
          icon={Sparkles}
          title="No matches at this level yet"
          description="Lower the score filter, run a fresh search, or upload your resume to sharpen ranking."
          action={
            <Button variant="accent" onClick={refresh} loading={syncing}>
              <RefreshCw className="h-4 w-4" />
              Run a search
            </Button>
          }
        />
      )}
    </div>
  );
}
