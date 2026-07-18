'use client';

// app/onboarding/page.jsx
//
// Sleek, swift, resumable onboarding.
//
// GUARANTEES
//   1. Not authenticated            -> /signin
//   2. Already completed onboarding -> /overview (can't re-enter)
//   3. Authenticated + incomplete   -> resumes from profile.onboarding.step
//   4. Every advance is PUT to the server immediately, so a closed tab, a new
//      browser, or a new device all resume from the same point.

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search, ArrowRight, Sparkles, Check, Loader2,
  MapPin, Building2, Home, Briefcase, Radar,
} from 'lucide-react';
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

  const [step, setStep] = useState('checking');
  const [role, setRole] = useState('');
  const [jobCount, setJobCount] = useState(null);

  // -- Guard + resume --------------------------------------------------
  useEffect(() => {
    if (loading) return;

    if (!isAuthenticated) {
      router.replace('/signin');
      return;
    }
    if (onboardingComplete) {
      router.replace('/overview');
      return;
    }

    // 'searching' is transient -- resume interrupted searches at 'role'.
    const resumeStep = onboardingStep === 'searching' ? 'role' : onboardingStep;
    setRole(onboardingRole ?? '');
    setStep(STEP_ORDER.includes(resumeStep) ? resumeStep : 'role');
  }, [loading, isAuthenticated, onboardingComplete, onboardingStep, onboardingRole, router]);

  const goTo = useCallback(
    async (next, extra = {}) => {
      setStep(next);
      try {
        await saveOnboardingStep({ onboarding_step: next, ...extra });
      } catch {
        // Never block the flow on a progress write; next save re-syncs.
      }
    },
    [saveOnboardingStep]
  );

  if (loading || step === 'checking') {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center bg-canvas">
        <Loader2 className="h-6 w-6 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-canvas">
      {/* soft ambient wash */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute -bottom-32 -right-16 h-80 w-80 rounded-full bg-accent/5 blur-3xl" />
      </div>

      <div className="relative mx-auto flex min-h-[100dvh] w-full max-w-lg flex-col px-5 py-8 sm:py-12">
        <BrandProgress step={step} />

        <div className="flex flex-1 flex-col justify-center">
          <div className="rounded-[24px] border border-line bg-surface/90 p-6 shadow-card backdrop-blur-sm transition-[height] duration-300 sm:p-8">
            {/* key forces a fresh mount per step so the fade-up replays consistently */}
            <div key={step}>
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
                <ResultsStep role={role} count={jobCount} onContinue={() => goTo('refine')} />
              )}

              {step === 'refine' && (
                <RefineStep
                  role={role}
                  onFinish={async ({ work_preference, country }) => {
                    await prefsApi
                      .create({
                        desired_title: role,
                        work_preference: work_preference || 'any',
                        preferred_country: country || null,
                        priority: 1,
                      })
                      .catch(() => null);

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
        </div>
      </div>

      {/* Signature radar-scan keyframes + reduced-motion guard.
          Scoped to this page so no global tailwind.config changes are required. */}
      <style jsx global>{`
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes scale-in {
          from { opacity: 0; transform: scale(0.94); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes radar-spin {
          to { transform: rotate(360deg); }
        }
        @keyframes radar-pulse {
          0%   { opacity: .55; transform: scale(.7); }
          80%  { opacity: 0;   transform: scale(1.45); }
          100% { opacity: 0;   transform: scale(1.45); }
        }
        .animate-fade-up   { animation: fade-up .5s cubic-bezier(.22,1,.36,1) both; }
        .animate-fade-in   { animation: fade-in .4s ease both; }
        .animate-scale-in  { animation: scale-in .16s cubic-bezier(.22,1,.36,1) both; }
        .animate-radar-spin  { animation: radar-spin 2.4s linear infinite; }
        .animate-radar-pulse { animation: radar-pulse 2.4s cubic-bezier(.22,1,.36,1) infinite; }

        @media (prefers-reduced-motion: reduce) {
          .animate-fade-up, .animate-fade-in, .animate-scale-in,
          .animate-radar-spin, .animate-radar-pulse, .animate-spin, .animate-ping, .animate-pulse {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>
    </div>
  );
}

// -- Brand + progress ------------------------------------------------
function BrandProgress({ step }) {
  const visible = ['role', 'searching', 'results', 'refine'];
  const activeIndex = visible.indexOf(step === 'done' ? 'refine' : step);

  return (
    <div className="mb-6">
      <div className="mb-4 flex items-center gap-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-ink">
          <span className="font-display text-base font-bold text-accent">A</span>
        </div>
        <div>
          <p className="font-display text-[13px] font-semibold leading-none text-ink">Applyqik</p>
          <p className="mt-1 text-[11px] leading-none text-slate">Building your career agent</p>
        </div>
      </div>

      <div className="flex items-center gap-2.5">
        <div className="flex flex-1 gap-1.5">
          {visible.map((s, i) => (
            <div
              key={s}
              className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                i <= activeIndex ? 'bg-accent' : 'bg-line'
              }`}
            />
          ))}
        </div>
        <span className="shrink-0 font-mono text-[11px] tabular-nums text-slate">
          {activeIndex + 1} / {visible.length}
        </span>
      </div>
    </div>
  );
}

// -- Screen 1: the single question -----------------------------------
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
      <span className="inline-flex items-center gap-1.5 rounded-pill bg-accent-soft px-3 py-1 text-xs font-medium text-accent-ink">
        <span>&#128075;</span> Welcome to Applyqik
      </span>
      <h1 className="mt-4 font-display text-[26px] font-semibold leading-tight text-ink sm:text-[32px]">
        What role are you after?
      </h1>
      <p className="mt-2 text-[15px] leading-relaxed text-slate">
        Just the title. We'll do the searching &mdash; no forms, no resume yet.
      </p>

      <div className="relative mt-6">
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
            aria-label="Desired role"
            className="w-full rounded-2xl border border-line bg-surface py-3.5 pl-12 pr-4 text-base text-ink outline-none transition-all placeholder:text-slate-soft focus:border-accent focus:ring-4 focus:ring-accent/10"
          />
        </div>

        {focused && filtered.length > 0 && (
          <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-2xl border border-line bg-surface shadow-card-hover animate-scale-in">
            {!role && (
              <p className="border-b border-line px-4 py-2 text-[11px] font-medium uppercase tracking-wide text-slate-soft">
                Popular roles
              </p>
            )}
            {filtered.map((s) => (
              <button
                key={s}
                type="button"
                onMouseDown={() => setRole(s)}
                className="flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-left text-sm text-ink transition-colors hover:bg-accent-soft/60"
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
        className="mt-6 w-full justify-center rounded-2xl py-3.5 text-[15px] transition-transform active:scale-[0.99]"
      >
        Continue
        <ArrowRight className="h-4 w-4" />
      </Button>
    </div>
  );
}

// -- Screen 2: searching theater -- signature radar-scan moment ------
function SearchingStep({ role, onDone }) {
  const messages = [
    'Searching trusted sources...',
    'Scanning live roles...',
    `Matching ${role} openings...`,
  ];
  const [msgIndex, setMsgIndex] = useState(0);
  const [liveCount, setLiveCount] = useState(0);

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
    }, 700);

    // Live-looking counter ticks up toward a placeholder target while the
    // real request resolves in the background; final value is swapped in
    // via onDone(count) regardless of what this shows.
    const target = 40 + Math.floor(Math.random() * 140);
    const countTimer = setInterval(() => {
      setLiveCount((n) => Math.min(target, n + Math.ceil(target / 14)));
    }, 150);

    // Swift: ~2.2s of theater, then reveal.
    const doneTimer = setTimeout(() => {
      if (!cancelled) onDone(count ?? 0);
    }, 2200);

    return () => {
      cancelled = true;
      clearInterval(msgTimer);
      clearInterval(countTimer);
      clearTimeout(doneTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role]);

  return (
    <div className="flex flex-col items-center py-8 text-center animate-fade-in">
      <div className="relative flex h-32 w-32 items-center justify-center">
        <div className="absolute inset-0 rounded-full border border-line" />
        <div className="absolute inset-[18px] rounded-full border border-line" />
        <div
          className="absolute inset-0 rounded-full animate-radar-spin"
          style={{
            background:
              'conic-gradient(from 0deg, rgba(20,184,166,.5), transparent 32%)',
          }}
        />
        <div className="absolute inset-0 rounded-full border border-accent/60 animate-radar-pulse" />
        <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-accent-soft">
          <Radar className="h-7 w-7 text-accent" />
        </div>
      </div>

      <h2 className="mt-6 font-display text-xl font-semibold text-ink">On it...</h2>
      <p className="mt-1.5 h-5 text-[15px] text-slate transition-all" aria-live="polite">
        {messages[msgIndex]}
      </p>

      <div className="mt-4 flex items-center gap-2 text-[13px] text-slate">
        <span>Live matches</span>
        <span className="font-mono text-[15px] font-semibold tabular-nums text-accent-ink">
          {liveCount}
        </span>
      </div>
    </div>
  );
}

// -- Screen 3: proof -- jobs exist -----------------------------------
function ResultsStep({ role, count, onContinue }) {
  return (
    <div className="animate-fade-up">
      <div className="flex flex-col items-center text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-soft animate-scale-in">
          <Check className="h-7 w-7 text-accent" strokeWidth={2.5} />
        </div>
        <h1 className="mt-5 font-display text-[24px] font-semibold leading-tight text-ink sm:text-[30px]">
          <span className="font-mono text-accent-ink">{count?.toLocaleString() ?? 0}</span>{' '}
          {role} {count === 1 ? 'role' : 'roles'} found
        </h1>
        <p className="mt-2 max-w-xs text-[15px] leading-relaxed text-slate">
          Live openings from trusted sources. Two quick taps and your dashboard is ready.
        </p>
      </div>

      <div className="mt-6 flex items-start gap-3 rounded-2xl border border-accent/20 bg-accent-soft/50 p-4">
        <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
        <p className="text-[13px] leading-relaxed text-ink-soft">
          Tell us how you like to work and we'll sharpen the ranking. Upload a resume later for
          even tighter matches.
        </p>
      </div>

      <Button
        variant="accent"
        onClick={onContinue}
        className="mt-6 w-full justify-center rounded-2xl py-3.5 text-[15px] transition-transform active:scale-[0.99]"
      >
        Continue
        <ArrowRight className="h-4 w-4" />
      </Button>
    </div>
  );
}

// -- Screen 4: refinement ---------------------------------------------
function RefineStep({ role, onFinish }) {
  const [workPref, setWorkPref] = useState('');   // start empty so nothing looks pre-locked
  const [country, setCountry] = useState('');
  const [finishing, setFinishing] = useState(false);

  const WORK_PREFS = [
    { value: 'remote', label: 'Remote', icon: Home },
    { value: 'hybrid', label: 'Hybrid', icon: Building2 },
    { value: 'onsite', label: 'On-site', icon: Briefcase },
    { value: 'any', label: 'Any', icon: Sparkles },
  ];

  async function finish() {
    setFinishing(true);
    try {
      await onFinish({ work_preference: workPref || 'any', country: country.trim() || null });
    } finally {
      setFinishing(false);
    }
  }

  return (
    <div className="animate-fade-up">
      <h1 className="font-display text-[22px] font-semibold leading-tight text-ink sm:text-[26px]">
        Refine your {role} matches
      </h1>
      <p className="mt-2 text-[15px] leading-relaxed text-slate">
        Two quick questions &mdash; you can change these anytime.
      </p>

      <div className="mt-6 space-y-6">
        {/* Work preference -- an explicit, obviously-clickable selectable grid */}
        <div>
          <p className="mb-2.5 text-sm font-medium text-ink-soft">How do you want to work?</p>
          <div className="grid grid-cols-2 gap-2.5">
            {WORK_PREFS.map((w) => {
              const Icon = w.icon;
              const selected = workPref === w.value;
              return (
                <button
                  key={w.value}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => setWorkPref(w.value)}
                  className={`group relative flex cursor-pointer items-center gap-2.5 rounded-2xl border p-3.5 text-left transition-all duration-150 ${
                    selected
                      ? 'border-accent bg-accent-soft ring-2 ring-accent/20'
                      : 'border-line bg-surface hover:border-accent/40 hover:bg-accent-soft/30'
                  }`}
                >
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-colors ${
                      selected ? 'bg-accent text-white' : 'bg-line-soft text-slate group-hover:text-ink'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className={`text-sm font-medium ${selected ? 'text-accent-ink' : 'text-ink'}`}>
                    {w.label}
                  </span>
                  {selected && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-accent animate-scale-in">
                      <Check className="h-4 w-4" strokeWidth={3} />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Country -- optional */}
        <div>
          <label className="mb-2 flex items-center gap-1.5 text-sm font-medium text-ink-soft">
            <MapPin className="h-4 w-4 text-slate" />
            Preferred country
            <span className="font-normal text-slate-soft">&middot; optional</span>
          </label>
          <input
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            placeholder="e.g. Nigeria -- or leave blank for anywhere"
            className="w-full rounded-2xl border border-line bg-surface px-4 py-3 text-[15px] text-ink outline-none transition-all placeholder:text-slate-soft focus:border-accent focus:ring-4 focus:ring-accent/10"
          />
        </div>
      </div>

      <Button
        variant="accent"
        onClick={finish}
        loading={finishing}
        className="mt-7 w-full justify-center rounded-2xl py-3.5 text-[15px] transition-transform active:scale-[0.99]"
      >
        Finish & open dashboard
        <ArrowRight className="h-4 w-4" />
      </Button>

      <button
        type="button"
        onClick={finish}
        disabled={finishing}
        className="mt-2 w-full cursor-pointer py-1 text-center text-[13px] font-medium text-slate transition-colors hover:text-ink disabled:opacity-50"
      >
        Skip for now
      </button>
    </div>
  );
}