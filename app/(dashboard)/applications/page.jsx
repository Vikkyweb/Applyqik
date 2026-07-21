'use client';

// app/(app)/applications/page.jsx
//
// Same visual language as Profile / Matches: soft gray canvas, bold header
// bar with icon, ink-filled pills for the active filter/status. Each
// application sits in its own white rounded card. Responsive -- the status
// row wraps on narrow screens instead of squeezing the select off-card.

import { useEffect, useState, useCallback } from 'react';
import { FileText, Building2, ExternalLink } from 'lucide-react';
import { applications as appsApi } from '@/libs/api';
import { useToast } from '@/components/ui/Toast';
import Skeleton from '@/components/ui/Skeleton';
import EmptyState from '@/components/ui/EmptyState';
import Link from 'next/link';

const STATUSES = ['saved', 'prepared', 'approved', 'applied', 'interview', 'offer', 'rejected'];

const STATUS_STYLES = {
  saved: 'bg-[#b6dbef] text-black',
  prepared: 'bg-[#EEF2FB] text-black',
  approved: 'bg-[#EEF2FB] text-black',
  applied: 'bg-[#a7e0e8] text-black',
  interview: 'bg-[#FBF3E3] text-[#9A6B12]',
  offer: 'bg-[#a7e0e8] text-black',
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
    <div className="min-h-screen">
      {/* Header bar */}
      <div className="border-b border-black/5 px-5 py-6 sm:px-8">
        <div className="mx-auto flex items-center gap-2.5">
          <FileText className="h-6 w-6 text-foreground" strokeWidth={2.25} />
          <h1 className="font-display text-[26px] font-bold leading-none text-foreground sm:text-[30px]">
            Applications
          </h1>
        </div>
      </div>

      <div className="mx-auto space-y-5 py-6 sm:py-8">
        {/* Status filter -- same ink-fill pill treatment as everywhere else */}
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
              <div key={i} className="rounded-[24px] bg-card p-5 sm:p-6">
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="mt-2 h-3 w-1/3" />
              </div>
            ))}
          </div>
        ) : items.length > 0 ? (
          <div className="space-y-3">
            {items.map((app) => (
              <div key={app.id} className="rounded-[24px] bg-card p-5 sm:p-6">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate font-display text-[16px] font-bold leading-snug text-foreground">
                      {app.job?.title ?? 'Job'}
                    </h3>
                    <p className="mt-1.5 inline-flex items-center gap-1.5 text-[13.5px] text-foreground">
                      <Building2 className="h-3.5 w-3.5 shrink-0" />
                      {app.job?.company_name}
                    </p>
                  </div>
                  {app.job?.apply_url && (
                    <a
                      href={app.job.apply_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 p-1 text-slate-soft transition-colors hover:text-foreground"
                    >
                      <ExternalLink className="h-4.5 w-4.5" />
                    </a>
                  )}
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-2.5">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${STATUS_STYLES[app.status]}`}
                  >
                    {app.status}
                  </span>
                  <div className="relative ml-auto">
                    <select
                      value={app.status}
                      onChange={(e) => changeStatus(app.id, e.target.value)}
                      className="cursor-pointer appearance-none rounded-full border border-line bg-card px-4 py-2 pr-9 text-[13px] font-medium capitalize text-foreground outline-none transition-colors focus:border-secondary"
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                    <svg
                      className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-[28px] bg-card p-2 sm:p-4">
            <EmptyState
              icon={FileText}
              title="No applications yet"
              description="When you track a job, it shows up here so you can follow every application from saved to offer."
              action={
                <Link
                  href="/matches"
                  className="inline-flex items-center gap-2 rounded-xl bg-secondary px-6 py-3 text-[15px] font-semibold text-white transition-colors hover:brightness-105"
                >
                  Browse your matches
                </Link>
              }
            />
          </div>
        )}
      </div>
    </div>
  );
}

function FilterPill({ active, onClick, children }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`bg-card rounded-xl ring-1 ring-black/5 px-5 py-2 text-[14px] font-medium capitalize transition-colors duration-150 ${
        active ? 'bg-secondary text-white ring-secondary/5' : 'text-foreground hover:ring-secondary/50 hover:text-secondary'
      }`}
    >
      {children}
    </button>
  );
}