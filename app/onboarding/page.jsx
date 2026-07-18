'use client';

// app/onboarding/page.jsx
//
// Resumable, server-backed onboarding.
//
// GUARANTEES
//   1. Not authenticated            -> bounced to /signin
//   2. Already completed onboarding -> bounced to /overview (can't re-enter)
//   3. Authenticated + incomplete   -> resumes from profile.onboarding.step
//   4. Every step advance is PUT to the server immediately, so a closed tab,
//      a new browser, or a new device all resume from the exact same point.
//
// The user registers on the signup page and lands here already authenticated,
// so this page NEVER creates an account. Its job is purely: collect role ->
// run the real job sync -> refine -> mark complete -> go to dashboard.

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ArrowRight, Sparkles, Check, Loader2, MapPin, Globe } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { jobs as jobsApi, preferences as prefsApi, profile as profileApi } from '@/libs/api';
import Button from '@/components/ui/Button';

const STEP_ORDER = ['role', 'searching', 'results', 'refine', 'done'];

const ROLE_SUGGESTIONS = [
  'Backend Engineer', 'Laravel Developer', 'Frontend Developer',
  'Full Stack Developer', 'Product Designer', 'Data Analyst',
  'DevOps Engineer', 'Mobile Developer',
];

export default function OnboardingPage() {
  const router = useRouter();
  const {
    loading,
    isAuthenticated,
    onboardingComplete,
    onboardingStep,
    onboardingRole,
    saveOnboardingStep,
    refreshProfile,
  } = useAuth();

  // 'checking' until the guard has decided; prevents any flED flash of the flow.
  const [step, setStep] = useState('checking');
  const [role, setRole] = useState('');
  const [jobCount, setJobCount] = useState(null);

  // ── Guard + resume ──────────────────────────────────────────────────
  useEffect(() => {
    if (loading) return; // wait for session hydration

    if (!isAuthenticated) {
      router.replace('/signin');
      return;
    }
    if (onboardingComplete) {
      router.replace('/overview');
      return;
    }

    // Resume from the server's saved step. 'searching' is transient (it just
    // kicks a sync); if they died mid-search, resume them at 'role' so they
    // re-trigger it cleanly rather than staring at a spinner that never ends.
    const resumeStep = onboardingStep === 'searching' ? 'role' : onboardingStep;
    setRole(onboardingRole ?? '');
    setStep(STEP_ORDER.includes(resumeStep) ? resumeStep : 'role');
  }, [loading, isAuthenticated, onboardingComplete, onboardingStep, onboardingRole, router]);

  // Advance helper: update local step AND persist to the server. Persisting is
  // fire-and-forget for UX smoothness, but we await where correctness matters.
  const goTo = useCallback(
    async (next, extra = {}) => {
      setStep(next);
      try {
        await saveOnboardingStep({ onboarding_step: next, ...extra });
      } catch {
        // If the save fails, the user can still proceed; next successful save
        // will re-sync progress. We never block the flow on a progress write.
      }
    },
    [saveOnboardingStep]
  );

  // While the guard is deciding, render nothing but a calm loader.
  if (loading || step === 'checking') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-canvas">
        <Loader2 className="h-6 w-6 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-xl flex-col px-5 py-10">
      <StepHeader step={step} />

      <div className="flex flex-1 flex-col justify-center">
        {step === 'role' && (
          <RoleStep
            role={role}
            setRole={setRole}
            onContinue={() => goTo('searching', { onboarding_role: role.trim() })}
          />
        )}

        {step === 'searching' && (
          <SearchingStep
            role={role}
            onDone={(count) => {
              setJobCount(count);
              goTo('results');
            }}
          />
        )}

        {step === 'results' && (
          <ResultsStep
            role={role}
            count={jobCount}
            onContinue={() => goTo('refine')}
          />
        )}

        {step === 'refine' && (
          <RefineStep
            role={role}
            onFinish={async ({ work_preference, country }) => {
              // Seed a preference from the role + refinement answers so the
              // dashboard has something to match against and isn't empty.
              await prefsApi
                .create({
                  desired_title: role,
                  work_preference: work_preference || 'any',
                  preferred_country: country || null,
                  priority: 1,
                })
                .catch(() => null);

              // Mark complete on the server (server stamps the timestamp) and
              // persist the refinement onto the profile in the same call.
              await profileApi
                .completeOnboarding({
                  preferred_roles: [role],
                  work_preference: work_preference || 'any',
                  country: country || null,
                })
                .catch(() => null);

              await refreshProfile();
              router.replace('/overview');
            }}
          />
        )}
      </div>
    </div>
  );
}

// ─── Progress header ─────────────────────────────────────────────────
function StepHeader({ step }) {
  const visible = ['role', 'searching', 'results', 'refine'];
  const activeIndex = visible.indexOf(step === 'done' ? 'refine' : step);

  return (
    <div className="mb-8">
      <div className="mb-3 flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-ink">
          <span className="font-display text-sm font-bold text-accent">A</span>
        </div>
        <span className="font-display text-sm font-semibold text-ink">Build your career agent</span>
      </div>
      <div className="flex gap-1.5">
        {visible.map((s, i) => (
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
    ? ROLE_SUGGESTIONS.filter(
        (s) => s.toLowerCase().includes(role.toLowerCase()) && s.toLowerCase() !== role.toLowerCase()
      )
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

      <Button variant="accent" onClick={onContinue} disabled={!role.trim()} className="mt-5 w-full">
        Continue
        <ArrowRight className="h-4 w-4" />
      </Button>
    </div>
  );
}

// ─── Screen 2: searching theater (real sync underneath) ──────────────
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

    async function run() {
      try {
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
          These are live roles from trusted sources. A couple of quick questions and your
          dashboard is ready.
        </p>
      </div>

      <div className="mt-7 rounded-card border border-accent/20 bg-accent-soft/50 p-5">
        <div className="flex items-start gap-3">
          <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
          <div>
            <p className="font-medium text-ink">Want sharper matches?</p>
            <p className="mt-1 text-sm text-slate">
              Tell us a little about how you want to work and we'll rank these to fit — you can
              always upload your resume later for even better ranking.
            </p>
          </div>
        </div>
      </div>

      <Button variant="accent" onClick={onContinue} className="mt-5 w-full">
        Continue
        <ArrowRight className="h-4 w-4" />
      </Button>
    </div>
  );
}

// ─── Screen 4: light refinement, then finish ─────────────────────────
function RefineStep({ role, onFinish }) {
  const [workPref, setWorkPref] = useState('any');
  const [country, setCountry] = useState('');
  const [finishing, setFinishing] = useState(false);

  const WORK_PREFS = [
    { value: 'remote', label: 'Remote' },
    { value: 'hybrid', label: 'Hybrid' },
    { value: 'onsite', label: 'On-site' },
    { value: 'any', label: 'Any' },
  ];

  async function finish() {
    setFinishing(true);
    try {
      await onFinish({ work_preference: workPref, country: country.trim() || null });
    } finally {
      setFinishing(false);
    }
  }

  return (
    <div className="animate-fade-up">
      <h1 className="font-display text-[28px] font-semibold leading-tight text-ink">
        Help us refine your {role} matches
      </h1>
      <p className="mt-2 text-[15px] text-slate">Two quick questions. You can change these anytime.</p>

      <div className="mt-7 space-y-6">
        <div>
          <label className="mb-2 flex items-center gap-2 text-sm font-medium text-ink-soft">
            <Globe className="h-4 w-4 text-slate" />
            How do you want to work?
          </label>
          <div className="flex flex-wrap gap-2">
            {WORK_PREFS.map((w) => (
              <button
                key={w.value}
                type="button"
                onClick={() => setWorkPref(w.value)}
                className={`rounded-pill border px-4 py-2 text-sm font-medium transition-colors ${
                  workPref === w.value
                    ? 'border-ink bg-ink text-white'
                    : 'border-line bg-surface text-slate hover:text-ink'
                }`}
              >
                {w.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-2 flex items-center gap-2 text-sm font-medium text-ink-soft">
            <MapPin className="h-4 w-4 text-slate" />
            Preferred country{' '}
            <span className="font-normal text-slate-soft">(optional)</span>
          </label>
          <input
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            placeholder="e.g. Nigeria, or leave blank for anywhere"
            className="input"
          />
        </div>
      </div>

      <Button variant="accent" onClick={finish} loading={finishing} className="mt-8 w-full">
        Finish & open my dashboard
        <ArrowRight className="h-4 w-4" />
      </Button>
    </div>
  );
}