'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { User, Upload, FileText, Check, Loader2, AlertCircle, X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { profile as profileApi, resume as resumeApi } from '@/libs/api';
import { useToast } from '@/components/ui/Toast';
import Button from '@/components/ui/Button';
import Skeleton from '@/components/ui/Skeleton';

const WORK_PREFS = ['remote', 'hybrid', 'onsite', 'any'];
const EXPERIENCE = [
  { value: 0, label: 'Entry' },
  { value: 2, label: '2 years' },
  { value: 5, label: '5 years' },
  { value: 8, label: '8+ years' },
];

export default function ProfilePage() {
  const { refreshProfile } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const p = await profileApi.get();
      setForm({
        first_name: p.first_name ?? '',
        last_name: p.last_name ?? '',
        current_job_title: p.current_job_title ?? '',
        years_experience: p.years_experience ?? '',
        bio: p.bio ?? '',
        country: p.location?.country ?? '',
        city: p.location?.city ?? '',
        work_preference: p.preferences?.work_preference ?? 'any',
        portfolio_url: p.links?.portfolio ?? '',
        preferred_roles: p.preferences?.roles ?? [],
      });
    } catch (err) {
      toast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    load();
  }, [load]);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function save() {
    setSaving(true);
    try {
      const payload = {
        ...form,
        years_experience: form.years_experience === '' ? null : Number(form.years_experience),
      };
      await profileApi.update(payload);
      await refreshProfile();
      toast('Profile saved');
    } catch (err) {
      toast(err.message, 'error');
    } finally {
      setSaving(false);
    }
  }

  if (loading || !form) {
    return (
      <div className="space-y-5">
        <Skeleton className="h-8 w-40" />
        <div className="card p-6 space-y-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="flex items-center gap-2 font-display text-2xl font-semibold text-ink">
        <User className="h-5 w-5" />
        Profile
      </h1>

      {/* Resume — the highest-value action, so it's first */}
      <ResumePanel />

      {/* Profile fields */}
      <div className="card p-6">
        <h2 className="font-display text-lg font-semibold text-ink">About you</h2>
        <p className="mt-1 text-sm text-slate">
          The more we know, the sharper your matches. Nothing here is required — fill what you like.
        </p>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <Field label="First name">
            <input value={form.first_name} onChange={set('first_name')} className="input" placeholder="Victor" />
          </Field>
          <Field label="Last name">
            <input value={form.last_name} onChange={set('last_name')} className="input" placeholder="Madubuko" />
          </Field>
          <Field label="Current title">
            <input value={form.current_job_title} onChange={set('current_job_title')} className="input" placeholder="Full Stack Developer" />
          </Field>
          <Field label="Experience">
            <select value={form.years_experience} onChange={set('years_experience')} className="input">
              <option value="">Select…</option>
              {EXPERIENCE.map((e) => (
                <option key={e.value} value={e.value}>
                  {e.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Country">
            <input value={form.country} onChange={set('country')} className="input" placeholder="Nigeria" />
          </Field>
          <Field label="City">
            <input value={form.city} onChange={set('city')} className="input" placeholder="Enugu" />
          </Field>
        </div>

        <div className="mt-4">
          <Field label="Work preference">
            <div className="flex flex-wrap gap-2">
              {WORK_PREFS.map((w) => (
                <button
                  key={w}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, work_preference: w }))}
                  className={`pill border capitalize transition-colors ${
                    form.work_preference === w
                      ? 'border-ink bg-ink text-white'
                      : 'border-line bg-surface text-slate hover:text-ink'
                  }`}
                >
                  {w}
                </button>
              ))}
            </div>
          </Field>
        </div>

        <div className="mt-4">
          <Field label="Portfolio / website">
            <input value={form.portfolio_url} onChange={set('portfolio_url')} className="input" placeholder="https://dkingstech.com" />
          </Field>
        </div>

        <div className="mt-4">
          <Field label="Short bio">
            <textarea
              value={form.bio}
              onChange={set('bio')}
              rows={3}
              className="input resize-none"
              placeholder="A sentence or two about your experience and what you're looking for."
            />
          </Field>
        </div>

        <div className="mt-6 flex justify-end">
          <Button variant="accent" onClick={save} loading={saving}>
            Save changes
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── Resume upload with status polling ───────────────────────────────
function ResumePanel() {
  const { toast } = useToast();
  const fileRef = useRef(null);
  const [resumes, setResumes] = useState([]);
  const [uploading, setUploading] = useState(false);
  const pollRef = useRef(null);

  const load = useCallback(async () => {
    try {
      const list = await resumeApi.list();
      setResumes(Array.isArray(list) ? list : []);
      // If anything is still parsing, poll until it settles.
      const stillParsing = (list ?? []).some((r) => r.status === 'uploaded' || r.status === 'parsing');
      if (stillParsing && !pollRef.current) {
        pollRef.current = setInterval(async () => {
          const fresh = await resumeApi.list().catch(() => null);
          if (fresh) {
            setResumes(fresh);
            if (!fresh.some((r) => r.status === 'uploaded' || r.status === 'parsing')) {
              clearInterval(pollRef.current);
              pollRef.current = null;
            }
          }
        }, 2500);
      }
    } catch {
      // silent — resume panel is not critical to render
    }
  }, []);

  useEffect(() => {
    load();
    return () => pollRef.current && clearInterval(pollRef.current);
  }, [load]);

  async function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      await resumeApi.upload(file);
      toast('Resume uploaded — parsing now');
      load();
    } catch (err) {
      toast(err.message, 'error');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  }

  const latest = resumes[0];

  return (
    <div className="card p-6">
      <h2 className="font-display text-lg font-semibold text-ink">Resume</h2>
      <p className="mt-1 text-sm text-slate">
        Upload your CV and Applyqik ranks every job against your real experience. PDF or DOCX, up to 5MB.
      </p>

      {latest && (
        <div className="mt-4 flex items-center gap-3 rounded-xl border border-line bg-canvas p-3.5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-surface">
            <FileText className="h-5 w-5 text-slate" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-ink">{latest.original_filename}</p>
            <ResumeStatus status={latest.status} wordCount={latest.word_count} />
          </div>
        </div>
      )}

      <input
        ref={fileRef}
        type="file"
        accept=".pdf,.docx"
        onChange={handleFile}
        className="hidden"
      />
      <Button
        variant={latest ? 'outline' : 'accent'}
        onClick={() => fileRef.current?.click()}
        loading={uploading}
        className="mt-4"
      >
        <Upload className="h-4 w-4" />
        {latest ? 'Replace resume' : 'Upload resume'}
      </Button>
    </div>
  );
}

function ResumeStatus({ status, wordCount }) {
  if (status === 'parsed') {
    return (
      <p className="mt-0.5 inline-flex items-center gap-1 text-xs text-accent-ink">
        <Check className="h-3.5 w-3.5" />
        Parsed{wordCount ? ` · ${wordCount} words` : ''}
      </p>
    );
  }
  if (status === 'failed') {
    return (
      <p className="mt-0.5 inline-flex items-center gap-1 text-xs text-danger">
        <AlertCircle className="h-3.5 w-3.5" />
        Couldn't read this file — try a different PDF or DOCX
      </p>
    );
  }
  return (
    <p className="mt-0.5 inline-flex items-center gap-1 text-xs text-slate">
      <Loader2 className="h-3.5 w-3.5 animate-spin" />
      Parsing…
    </p>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-ink-soft">{label}</label>
      {children}
    </div>
  );
}
