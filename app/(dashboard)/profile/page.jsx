'use client';

// app/(app)/profile/page.jsx
//
// Matches the reference layout exactly: soft gray page background, bold
// black headings, white rounded cards floating on top, pill-style work
// preference selector, full-width fields at the bottom. Fully responsive --
// the two-column grid collapses to one column on small screens.

import { useEffect, useState, useCallback, useRef } from 'react';
import { User, Upload, FileText, Check, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { profile as profileApi, resume as resumeApi } from '@/libs/api';
import { useToast } from '@/components/ui/Toast';
import Button from '@/components/ui/Button';
import Skeleton from '@/components/ui/Skeleton';

const WORK_PREFS = [
  { value: 'remote', label: 'Remote' },
  { value: 'hybrid', label: 'Hybrid' },
  { value: 'onsite', label: 'Onsite' },
  { value: 'any', label: 'Any' },
];

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
        portfolio_url: p.lforegrounds?.portfolio ?? '',
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

  return (
    <div className="min-h-screen">
      {/* Header bar */}
      <div className="border-b border-black/5 py-6">
        <div className="mx-auto flex items-center gap-2.5">
          <User className="h-6 w-6 text-foreground" strokeWidth={2.25} />
          <h1 className="font-display text-[26px] font-bold leading-none text-foreground sm:text-[30px]">
            Profile
          </h1>
        </div>
      </div>

      <div className="mx-auto space-y-5 py-6 sm:py-8">
        {/* Resume card */}
        <ResumeCard />

        {/* About you card */}
        {loading || !form ? (
          <div className="rounded-[28px] bg-card p-6 sm:p-8">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="mt-3 h-4 w-72" />
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <Skeleton className="h-14 w-full" />
              <Skeleton className="h-14 w-full" />
            </div>
          </div>
        ) : (
          <div className="rounded-[28px] bg-card p-6 sm:p-8">
            <h2 className="font-display text-[22px] font-bold leading-none text-foreground sm:text-[24px]">
              About you
            </h2>
            <p className="mt-2 text-[15px] leading-relaxed text-forground">
              The more we know, the sharper your matches. Nothing here is required
              &mdash; fill what you like.
            </p>

            <div className="mt-7 grid gap-5 sm:grid-cols-2">
              <Field label="First name">
                <input
                  value={form.first_name}
                  onChange={set('first_name')}
                  placeholder="Victor"
                  className="field"
                />
              </Field>
              <Field label="Last name">
                <input
                  value={form.last_name}
                  onChange={set('last_name')}
                  placeholder="Madubuko"
                  className="field"
                />
              </Field>

              <Field label="Current title">
                <input
                  value={form.current_job_title}
                  onChange={set('current_job_title')}
                  placeholder="Full Stack Developer"
                  className="field"
                />
              </Field>
              <Field label="Experience">
                <div className="relative">
                  <select
                    value={form.years_experience}
                    onChange={set('years_experience')}
                    className="field appearance-none pr-10"
                  >
                    <option value="">Select&hellip;</option>
                    {EXPERIENCE.map((e) => (
                      <option key={e.value} value={e.value}>
                        {e.label}
                      </option>
                    ))}
                  </select>
                  <svg
                    className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </Field>

              <Field label="Country">
                <input
                  value={form.country}
                  onChange={set('country')}
                  placeholder="Nigeria"
                  className="field"
                />
              </Field>
              <Field label="City">
                <input
                  value={form.city}
                  onChange={set('city')}
                  placeholder="Enugu"
                  className="field"
                />
              </Field>
            </div>

            {/* Work preference -- pill selector, dark-filled when selected */}
            <div className="mt-6">
              <p className="mb-2.5 text-[15px] font-semibold text-foreground">Work preference</p>
              <div className="flex flex-wrap gap-2">
                {WORK_PREFS.map((w) => {
                  const selected = form.work_preference === w.value;
                  return (
                    <button
                      key={w.value}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => setForm((f) => ({ ...f, work_preference: w.value }))}
                      className={`cursor-pointer bg-background rounded-xl ring-1 ring-black/5 px-3 py-2 text-[14px] font-medium transition-colors duration-150 ${
                        selected
                          ? 'bg-secondary text-white ring-secondary/5'
                          : 'text-foreground hover:ring-secondary/50 hover:text-secondary'
                      }`}
                    >
                      {w.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Portfolio -- full width */}
            <div className="mt-6">
              <p className="mb-2 text-[15px] font-semibold text-foreground">Portfolio / website</p>
              <input
                value={form.portfolio_url}
                onChange={set('portfolio_url')}
                placeholder="https://dkingstech.com"
                className="field"
              />
            </div>

            {/* Bio -- full width textarea */}
            <div className="mt-6">
              <p className="mb-2 text-[15px] font-semibold text-foreground">Short bio</p>
              <textarea
                value={form.bio}
                onChange={set('bio')}
                rows={3}
                placeholder="A sentence or two about your experience and what you're looking for."
                className="field resize-none"
              />
            </div>

            <div className="mt-7 flex justify-end">
              <Button
                onClick={save}
                loading={saving}
                className="rounded-xl px-7 py-3 text-[15px] cursor-pointer font-semibold bg-secondary text-white"
              >
                Save changes
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// -- Resume card -------------------------------------------------------
function ResumeCard() {
  const { toast } = useToast();
  const fileRef = useRef(null);
  const [resumes, setResumes] = useState([]);
  const [uploading, setUploading] = useState(false);
  const pollRef = useRef(null);

  const load = useCallback(async () => {
    try {
      const list = await resumeApi.list();
      setResumes(Array.isArray(list) ? list : []);
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
      // resume panel is non-critical to render
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
      toast('Resume uploaded -- parsing now');
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
    <div className="rounded-[28px] bg-card p-6 sm:p-8">
      <h2 className="font-display text-[22px] font-bold leading-none text-foreground sm:text-[24px]">
        Resume
      </h2>
      <p className="mt-2 text-[15px] leading-relaxed text-foreground">
        Upload your CV and Applyqik ranks every job against your real experience.
        PDF or DOCX, up to 5MB.
      </p>

      {latest && (
        <div className="mt-5 flex items-center gap-3 rounded-2xl border-border bg-background p-3.5">
          <div className="flex h-10 w-10 shrforeground-0 items-center justify-center rounded-xl bg-white">
            <FileText className="h-5 w-5 text-secondary" />
          </div>
          <div className="max-w-60 flex-1">
            <p className=" text-sm font-medium text-foreground">{latest.original_filename}</p>
            <ResumeStatus status={latest.status} wordCount={latest.word_count} />
          </div>
        </div>
      )}

      <input ref={fileRef} type="file" accept=".pdf,.docx" onChange={handleFile} className="hidden" />

      <Button
        variant="secondary"
        onClick={() => fileRef.current?.click()}
        loading={uploading}
        className="mt-5 rounded-xl flex gap-2 px-2 py-2 text-white text-[15px] font-semibold cursor-pointer bg-secondary"
      >
        <Upload className="h-[18px] w-[18px]" strokeWidth={2.25} />
        {latest ? 'Replace resume' : 'Upload resume'}
      </Button>
    </div>
  );
}

function ResumeStatus({ status, wordCount }) {
  if (status === 'parsed') {
    return (
      <p className="mt-0.5 inline-flex items-center gap-1 text-xs text-foreground">
        <Check className="h-3.5 w-3.5" />
        Parsed{wordCount ? ` \u00b7 ${wordCount} words` : ''}
      </p>
    );
  }
  if (status === 'failed') {
    return (
      <p className="mt-0.5 inline-flex items-center gap-1 text-xs text-red-500">
        <AlertCircle className="h-3.5 w-3.5" />
        Couldn't read this file -- try a different PDF or DOCX
      </p>
    );
  }
  return (
    <p className="mt-0.5 inline-flex items-center gap-1 text-xs text-foreground">
      <Loader2 className="h-3.5 w-3.5 animate-spin" />
      Parsing&hellip;
    </p>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <p className="mb-2 text-[15px] font-semibold text-foreground">{label}</p>
      {children}
    </div>
  );
}