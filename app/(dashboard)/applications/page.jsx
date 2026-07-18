'use client';

import { useEffect, useState, useCallback } from 'react';
import { FileText, Building2, ExternalLink } from 'lucide-react';
import { applications as appsApi } from '@/libs/api';
import { useToast } from '@/components/ui/Toast';
import Skeleton from '@/components/ui/Skeleton';
import EmptyState from '@/components/ui/EmptyState';
import Link from 'next/link';

const STATUSES = ['saved', 'prepared', 'approved', 'applied', 'interview', 'offer', 'rejected'];

const STATUS_STYLES = {
  saved: 'bg-line-soft text-slate',
  prepared: 'bg-[#EEF2FB] text-info',
  approved: 'bg-[#EEF2FB] text-info',
  applied: 'bg-accent-soft text-accent-ink',
  interview: 'bg-[#FBF3E3] text-[#9A6B12]',
  offer: 'bg-accent-soft text-accent-ink',
  rejected: 'bg-[#FBECEA] text-danger',
};

export default function ApplicationsPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await appsApi.list({ status: filter || undefined, per_page: 50 });
      setItems(res.applications ?? []);
    } catch (err) {
      toast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  }, [filter, toast]);

  useEffect(() => {
    load();
  }, [load]);

  async function changeStatus(id, status) {
    try {
      await appsApi.updateStatus(id, status);
      setItems((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
      toast('Status updated');
    } catch (err) {
      toast(err.message, 'error');
    }
  }

  return (
    <div className="space-y-5">
      <h1 className="flex items-center gap-2 font-display text-2xl font-semibold text-ink">
        <FileText className="h-5 w-5" />
        Applications
      </h1>

      {/* Status filter */}
      <div className="flex flex-wrap gap-2">
        <FilterPill active={filter === ''} onClick={() => setFilter('')}>
          All
        </FilterPill>
        {STATUSES.map((s) => (
          <FilterPill key={s} active={filter === s} onClick={() => setFilter(s)}>
            {s}
          </FilterPill>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="card p-5">
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="mt-2 h-3 w-1/3" />
            </div>
          ))}
        </div>
      ) : items.length > 0 ? (
        <div className="space-y-3">
          {items.map((app) => (
            <div key={app.id} className="card p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <h3 className="truncate font-display text-[15px] font-semibold text-ink">
                    {app.job?.title ?? 'Job'}
                  </h3>
                  <p className="mt-1 inline-flex items-center gap-1 text-[13px] text-slate">
                    <Building2 className="h-3.5 w-3.5" />
                    {app.job?.company_name}
                  </p>
                </div>
                {app.job?.apply_url && (
                  <a
                    href={app.job.apply_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 rounded-lg p-2 text-slate-soft hover:bg-line-soft hover:text-ink"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
              </div>

              <div className="mt-4 flex items-center gap-2">
                <span className={`pill ${STATUS_STYLES[app.status]}`}>{app.status}</span>
                <select
                  value={app.status}
                  onChange={(e) => changeStatus(app.id, e.target.value)}
                  className="ml-auto rounded-lg border border-line bg-surface px-3 py-1.5 text-[13px] text-ink focus:border-accent focus:outline-none"
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={FileText}
          title="No applications yet"
          description="When you track a job, it shows up here so you can follow every application from saved to offer."
          action={
            <Link href="/matches" className="btn-accent px-5 py-3">
              Browse your matches
            </Link>
          }
        />
      )}
    </div>
  );
}

function FilterPill({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`pill border capitalize transition-colors ${
        active ? 'border-ink bg-ink text-white' : 'border-line bg-surface text-slate hover:text-ink'
      }`}
    >
      {children}
    </button>
  );
}
