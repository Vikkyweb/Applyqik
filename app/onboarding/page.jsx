'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ArrowRight, Sparkles, Upload, Check, Loader2, MapPin, Globe, Briefcase } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { jobs as jobsApi, preferences as prefsApi, profile as profileApi, resume as resumeApi } from '@/libs/api';
import Button from '@/components/ui/Button';
import "./onboardingToDashboard.css";

// Progressive onboarding: earn trust before asking for it.
// role -> searching -> results -> (offer resume) -> refine -> account -> done
const ROLE_SUGGESTIONS = [
  'Backend Engineer', 'Laravel Developer', 'Frontend Developer',
  'Full Stack Developer', 'Product Designer', 'Data Analyst',
  'DevOps Engineer', 'Mobile Developer',
];

export default function OnboardingPage() {
  const router = useRouter();
  const { user, isAuthenticated, register, refreshProfile } = useAuth();
  const [step, setStep] = useState('role');

  // If already logged in, skip straight to the dashboard.
  // useEffect(() => {
  //   if (isAuthenticated) router.replace('/dashboard');
  // }, [isAuthenticated, router]);

  const [role, setRole] = useState('');
  const [jobCount, setJobCount] = useState(null);

  return (
    <div className="mx-auto flex min-h-screen max-w-xl flex-col px-5 py-10">
      <StepHeader step={step} />

      <div className="flex flex-1 flex-col justify-center">
        {step === 'role' && (
          <RoleStep
            role={role}
            setRole={setRole}
            onContinue={() => setStep('searching')}
          />
        )}
        {step === 'searching' && (
          <SearchingStep role={role} onDone={(count) => { setJobCount(count); setStep('results'); }} />
        )}
        {step === 'results' && (
          <ResultsStep role={role} count={jobCount} onContinue={() => setStep('account')} />
        )}
        {step === 'account' && (
          <AccountStep role={role} register={register} refreshProfile={refreshProfile} onDone={() => router.push('/dashboard')} />
        )}
      </div>
    </div>
  );
}

// ─── Progress header — "Build your career agent" ─────────────────────
function StepHeader({ step }) {
  const order = ['role', 'searching', 'results', 'account'];
  const labels = { role: 'Target role', searching: 'Searching', results: 'Your matches', account: 'Save progress' };
  const activeIndex = order.indexOf(step);

  return (
    <div className="mb-8">
      <div className="mb-3 flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-ink">
          <span className="font-display text-sm font-bold text-accent">A</span>
        </div>
        <span className="font-display text-sm font-semibold text-ink">Build your career agent</span>
      </div>
      <div className="flex gap-1.5">
        {order.map((s, i) => (
          <div
            key={s}
            className={`h-1 flex-1 rounded-full transition-colors duration-500 ${
              i <= activeIndex ? 'bg-accent' : 'bg-line'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Screen 1: the single question ───────────────────────────────────
function RoleStep({ role, setRole, onContinue }) {
  const [focused, setFocused] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const filtered = role
    ? ROLE_SUGGESTIONS.filter((s) => s.toLowerCase().includes(role.toLowerCase()) && s.toLowerCase() !== role.toLowerCase())
    : ROLE_SUGGESTIONS.slice(0, 5);

  return (
    <div className="animate-fade-up">
      <p className="text-sm font-medium text-accent-ink">👋 Welcome to Applyqik</p>
      <h1 className="mt-2 font-display text-[32px] font-semibold leading-tight text-ink">
        What job are you looking for?
      </h1>
      <p className="mt-2 text-[15px] text-slate">
        Just the role. We'll handle the searching — no forms, no resume yet.
      </p>

      <div className="relative mt-7">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-soft" />
          <input
            ref={inputRef}
            value={role}
            onChange={(e) => setRole(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setTimeout(() => setFocused(false), 150)}
            onKeyDown={(e) => e.key === 'Enter' && role.trim() && onContinue()}
            placeholder="e.g. Backend Engineer"
            className="input pl-12 text-base"
          />
        </div>

        {focused && filtered.length > 0 && (
          <div className="absolute z-10 mt-2 w-full overflow-hidden rounded-xl border border-line bg-surface shadow-card-hover animate-scale-in">
            {filtered.map((s) => (
              <button
                key={s}
                onMouseDown={() => setRole(s)}
                className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-ink hover:bg-line-soft"
              >
                <Search className="h-4 w-4 text-slate-soft" />
                {s}
              </button>
            ))}
          </div>
        )}
      </div>

      <Button
        variant="accent"
        onClick={onContinue}
        disabled={!role.trim()}
        className="mt-5 w-full"
      >
        Continue
        <ArrowRight className="h-4 w-4" />
      </Button>
    </div>
  );
}

// ─── Screen 2: searching theater (real sync kicked off underneath) ───
function SearchingStep({ role, onDone }) {
  const messages = [
    'Searching trusted job sources…',
    'Scanning thousands of live roles…',
    `Finding ${role} opportunities…`,
    'Ranking by relevance…',
  ];
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    let count = null;
    let cancelled = false;

    // Kick the real sync + fetch a count in parallel with the animation,
    // so the "searching" moment is real work, not a fake timer.
    async function run() {
      try {
        // Trigger a manual sync (Phase 5) so listings are fresh.
        await jobsApi.sync().catch(() => null);
        const res = await jobsApi.list({ search: role, per_page: 5 });
        count = res?.meta?.total ?? 0;
      } catch {
        count = 0;
      }
    }
    run();

    const msgTimer = setInterval(() => {
      setMsgIndex((i) => (i < messages.length - 1 ? i + 1 : i));
    }, 900);

    // Minimum 3.4s of theater so it feels substantial, then reveal.
    const doneTimer = setTimeout(() => {
      if (!cancelled) onDone(count ?? 0);
    }, 3600);

    return () => {
      cancelled = true;
      clearInterval(msgTimer);
      clearTimeout(doneTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role]);

  return (
    <div className="flex flex-col items-center py-10 text-center animate-fade-in">
      <div className="relative flex h-20 w-20 items-center justify-center">
        <div className="absolute inset-0 animate-ping rounded-full bg-accent/20" />
        <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-accent-soft">
          <Search className="h-7 w-7 text-accent" />
        </div>
      </div>
      <h2 className="mt-7 font-display text-xl font-semibold text-ink">Searching for you</h2>
      <p className="mt-2 h-5 text-[15px] text-slate transition-all">{messages[msgIndex]}</p>
    </div>
  );
}

// ─── Screen 3: proof — jobs exist ────────────────────────────────────
function ResultsStep({ role, count, onContinue }) {
  return (
    <div className="animate-fade-up">
      <div className="flex flex-col items-center text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-soft">
          <Check className="h-6 w-6 text-accent" />
        </div>
        <h1 className="mt-5 font-display text-[30px] font-semibold leading-tight text-ink">
          <span className="font-mono text-accent-ink">{count?.toLocaleString() ?? 0}</span>{' '}
          {role} {count === 1 ? 'job' : 'jobs'} found
        </h1>
        <p className="mt-2 max-w-sm text-[15px] text-slate">
          These are live roles from trusted sources. Create your account to save them and unlock
          AI-ranked matches based on your experience.
        </p>
      </div>

      <div className="mt-7 rounded-card border border-accent/20 bg-accent-soft/50 p-5">
        <div className="flex items-start gap-3">
          <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
          <div>
            <p className="font-medium text-ink">Want better matches?</p>
            <p className="mt-1 text-sm text-slate">
              Once you're in, upload your resume and Applyqik ranks every job against your real
              experience — so you only chase the ones worth chasing.
            </p>
          </div>
        </div>
      </div>

      <Button variant="accent" onClick={onContinue} className="mt-5 w-full">
        Save these & continue
        <ArrowRight className="h-4 w-4" />
      </Button>
    </div>
  );
}

// ─── Screen 4: the account (asked last, once value is proven) ────────
function AccountStep({ role, register, refreshProfile, onDone }) {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setFieldErrors({});
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      // Seed their first preference from the role they told us — so the
      // dashboard isn't empty and matching has something to work with.
      await prefsApi.create({ desired_title: role, work_preference: 'any', priority: 1 }).catch(() => null);
      await profileApi.update({ preferred_roles: [role] }).catch(() => null);
      await refreshProfile();
      onDone();
    } catch (err) {
      if (err.errors) setFieldErrors(err.errors);
      else setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="animate-fade-up">
      <h1 className="font-display text-[28px] font-semibold leading-tight text-ink">
        Almost there — save your progress
      </h1>
      <p className="mt-2 text-[15px] text-slate">
        Create your account so your {role} matches are waiting when you come back.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <Field label="Name" error={fieldErrors.name}>
          <input value={form.name} onChange={set('name')} className="input" placeholder="Your name" required />
        </Field>
        <Field label="Email" error={fieldErrors.email}>
          <input type="email" value={form.email} onChange={set('email')} className="input" placeholder="you@example.com" required />
        </Field>
        <Field label="Password" error={fieldErrors.password}>
          <input type="password" value={form.password} onChange={set('password')} className="input" placeholder="At least 8 characters" required minLength={8} />
        </Field>

        {error && <p className="rounded-lg bg-danger/8 px-3 py-2 text-sm text-danger">{error}</p>}

        <Button type="submit" variant="accent" loading={loading} className="w-full">
          Create account & see matches
          <ArrowRight className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}

function Field({ label, error, children }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-ink-soft">{label}</label>
      {children}
      {error && <p className="mt-1 text-xs text-danger">{Array.isArray(error) ? error[0] : error}</p>}
    </div>
  );
}
