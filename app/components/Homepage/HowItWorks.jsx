'use client';

import { useState } from 'react';
import {
  Volume2,
  VolumeX,
  Captions,
  Settings,
  Link2,
  RotateCcw,
  Play,
  Maximize2,
} from 'lucide-react';

/**
 * HowItWorks.jsx
 * Next.js + Tailwind CSS "How it works" section with a styled video-player mockup.
 *
 * Usage (Next.js App Router):
 *   import HowItWorks from '@/components/HowItWorks';
 *   ...
 *   <HowItWorks />
 *
 * Notes:
 * - This is a *visual* mockup (not a functioning video player). Wire the
 *   thumbnail up to a real <video>/YouTube embed by swapping the inner
 *   content of `.aspect-video` for your player, and use `playing` state
 *   below to toggle between the poster and the embed.
 * - Uses lucide-react: npm install lucide-react
 */

const steps = [
  { n: 1, label: 'Sign in' },
  { n: 2, label: 'Connect socials' },
  { n: 3, label: 'Post on', icon: 'tiktok' },
];

function TikTokBadge() {
  return (
    <span className="ml-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-neutral-900 text-white">
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-3 w-3">
        <path d="M16.6 5.82c-.9-.62-1.55-1.6-1.75-2.72h-2.7v13.1c0 1.25-1.02 2.27-2.27 2.27a2.27 2.27 0 0 1 0-4.54c.23 0 .45.03.66.1V11.3a5 5 0 0 0-.66-.04 5.02 5.02 0 1 0 5.02 5.02V9.2a7.44 7.44 0 0 0 4.3 1.37V7.87c-.9 0-1.85-.3-2.6-.9a4.9 4.9 0 0 1-2-1.15Z" />
      </svg>
    </span>
  );
}

function PlatformDot({ label, color, className = '' }) {
  return (
    <span
      className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold text-white ${color} ${className}`}
      title={label}
    >
      {label[0]}
    </span>
  );
}

function PlatformPill({ label, color, active = true }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-[10px] font-medium sm:text-xs ${
        active
          ? 'border-white/20 bg-white/10 text-white'
          : 'border-white/10 bg-white/5 text-white/40'
      }`}
    >
      <PlatformDot label={label} color={color} className="h-3.5 w-3.5 text-[8px]" />
      {label}
    </span>
  );
}

export default function HowItWorks() {
  const [playing, setPlaying] = useState(false);

  return (
    <section className="w-full bg-white px-6 py-16 sm:px-10 sm:py-20 lg:px-12">
      <div className="mx-auto max-w-5xl">
        {/* Heading */}
        <div className="text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-neutral-900 sm:text-4xl md:text-5xl">
            How <span className="font-black">Ferryman</span> works
          </h2>

          {/* Steps pill */}
          <div className="mt-6 inline-flex max-w-full flex-wrap items-center justify-center gap-x-2 gap-y-2 rounded-full bg-neutral-100 px-3 py-2 text-xs font-medium text-neutral-700 sm:mt-8 sm:gap-x-3 sm:px-5 sm:py-3 sm:text-sm">
            {steps.map((s, i) => (
              <span key={s.n} className="flex items-center gap-1.5 sm:gap-2">
                <span className="flex items-center gap-1.5 whitespace-nowrap sm:gap-2">
                  <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-neutral-900 text-[11px] font-bold text-white sm:h-6 sm:w-6 sm:text-xs">
                    {s.n}
                  </span>
                  {s.label}
                  {s.icon === 'tiktok' && <TikTokBadge />}
                </span>
                {i < steps.length - 1 && (
                  <span className="hidden text-neutral-300 sm:inline">·</span>
                )}
              </span>
            ))}
          </div>
        </div>

        {/* Video mockup */}
        <div className="mt-10 sm:mt-12">
          <div className="rounded-2xl bg-gradient-to-br from-orange-300 via-sky-400 to-amber-200 p-1.5 shadow-xl sm:rounded-3xl sm:p-2">
            <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-neutral-950 sm:rounded-2xl">
              {/* ===== Top bar ===== */}
              <div className="absolute inset-x-0 top-0 z-20 flex items-center justify-between gap-2 bg-gradient-to-b from-black/70 to-transparent px-3 py-2.5 sm:px-6 sm:py-4">
                <div className="flex min-w-0 items-center gap-2 sm:gap-3">
                  <img
                    src="https://ui-avatars.com/api/?name=Kevin+N&background=1f2937&color=fff"
                    alt="Kevin Naughton Jr."
                    className="h-7 w-7 flex-shrink-0 rounded-full object-cover sm:h-9 sm:w-9"
                  />
                  <div className="min-w-0">
                    <p className="truncate text-[11px] font-bold text-white sm:text-sm md:text-base">
                      How to use Ferryman
                    </p>
                    <p className="truncate text-[10px] text-white/70 sm:text-xs">
                      Kevin Naughton Jr.
                    </p>
                  </div>
                </div>

                <div className="hidden flex-shrink-0 items-center gap-3 text-white/80 sm:flex">
                  <VolumeX className="h-4 w-4" />
                  <span className="rounded border border-white/50 px-1 text-[10px] font-semibold">
                    CC
                  </span>
                  <Settings className="h-4 w-4" />
                </div>
              </div>

              {/* ===== Body: app-UI mockup (hidden on very small screens, shown sm+) ===== */}
              <div className="hidden h-full flex-col justify-center gap-3 px-6 pt-16 pb-24 text-white sm:flex md:px-10">
                <div className="mx-auto w-full max-w-md space-y-3 text-[10px] leading-tight md:text-xs">
                  <div className="rounded-md bg-white/5 px-3 py-2 text-white/80">
                    @kevinnaughtonjr <span className="float-right text-white/40">Disconnect</span>
                  </div>
                  <div className="rounded-md bg-white/5 px-3 py-2 text-white/80">
                    @Kevin Naughton <span className="float-right text-white/40">Disconnect</span>
                  </div>

                  <div className="pt-2">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-white">Cross-Posting</p>
                      <span className="h-4 w-7 rounded-full bg-emerald-500" />
                    </div>
                    <p className="mt-0.5 text-white/50">New posts will be ferried to your targets.</p>
                  </div>

                  <div className="pt-2">
                    <p className="font-semibold text-white/90">Origin Platform</p>
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      <PlatformPill label="Twitter" color="bg-black" />
                      <PlatformPill label="Bluesky" color="bg-sky-500" active={false} />
                      <PlatformPill label="Threads" color="bg-neutral-700" active={false} />
                      <PlatformPill label="Mastodon" color="bg-indigo-500" active={false} />
                      <PlatformPill label="LinkedIn" color="bg-blue-600" active={false} />
                    </div>
                  </div>

                  <div className="pt-2">
                    <p className="font-semibold text-white/90">Target Platforms</p>
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      <PlatformPill label="Bluesky" color="bg-sky-500" />
                      <PlatformPill label="Threads" color="bg-neutral-700" />
                      <PlatformPill label="Mastodon" color="bg-indigo-500" />
                      <PlatformPill label="LinkedIn" color="bg-blue-600" />
                    </div>
                  </div>
                </div>
              </div>

              {/* ===== Mobile-only simplified poster ===== */}
              <div className="flex h-full flex-col items-center justify-center gap-3 px-6 text-center sm:hidden">
                <p className="text-sm font-semibold text-white/90">How to use Ferryman</p>
                <p className="text-xs text-white/50">Tap to watch the walkthrough</p>
              </div>

              {/* ===== Undo icon (mid-left, decorative — matches source) ===== */}
              <div className="pointer-events-none absolute left-1/2 top-1/2 z-10 hidden -translate-x-1/2 -translate-y-1/2 sm:block">
                <RotateCcw className="h-9 w-9 text-white/70" strokeWidth={1.5} />
              </div>

              {/* ===== Picture-in-picture facecam ===== */}
              <div className="absolute bottom-16 right-3 z-20 w-20 overflow-hidden rounded-xl shadow-lg sm:bottom-20 sm:right-6 sm:w-32 md:w-40">
                <div className="relative aspect-square bg-gradient-to-br from-neutral-700 to-neutral-900">
                  <img
                    src="https://ui-avatars.com/api/?name=Kevin&background=374151&color=fff&size=256"
                    alt="Presenter"
                    className="h-full w-full object-cover"
                  />
                  <button
                    type="button"
                    className="absolute right-1 top-1 hidden rounded-full bg-black/50 p-1 text-white sm:block"
                    aria-label="Expand"
                  >
                    <Maximize2 className="h-3 w-3" />
                  </button>
                  <span className="absolute bottom-1 left-1 flex items-center gap-1 rounded bg-red-600 px-1.5 py-0.5 text-[8px] font-bold text-white sm:text-[10px]">
                    <Play className="h-2 w-2 fill-white" />
                    YouTube
                  </span>
                </div>
              </div>

              {/* ===== Bottom controls ===== */}
              <div className="absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black/80 to-transparent pb-3 pt-8 sm:pb-4">
                <div className="flex items-center justify-between px-3 text-[10px] font-medium text-white sm:px-6 sm:text-xs">
                  <span>2:11 / 2:11</span>
                </div>

                {/* progress bar with platform markers */}
                <div className="relative mt-2 px-3 sm:mt-3 sm:px-6">
                  <div className="hidden items-center justify-between px-1 pb-1 sm:flex">
                    <PlatformDot label="Bluesky" color="bg-sky-500" />
                  </div>
                  <div className="relative h-[3px] w-full rounded-full bg-white/25">
                    <div className="absolute inset-y-0 left-0 w-full rounded-full bg-red-500" />
                    <span className="absolute -right-1.5 -top-[5px] h-3 w-3 rounded-full bg-red-500 shadow" />
                  </div>
                  <div className="mt-1 hidden items-center justify-between sm:flex">
                    <PlatformDot label="X" color="bg-black" />
                    <PlatformDot label="Threads" color="bg-neutral-700" />
                    <PlatformDot label="Mastodon" color="bg-indigo-500" />
                  </div>
                </div>

                <div className="mt-2 flex items-center justify-between px-3 sm:mt-3 sm:px-6">
                  <button
                    type="button"
                    className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-white sm:h-8 sm:w-8"
                    aria-label="Copy link"
                  >
                    <Link2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </button>
                </div>
              </div>

              {/* Play button overlay (click target) */}
              <button
                type="button"
                onClick={() => setPlaying((p) => !p)}
                className="absolute inset-0 z-30 flex items-center justify-center bg-black/0 transition-colors hover:bg-black/10"
                aria-label={playing ? 'Pause video' : 'Play video'}
              >
                {!playing && (
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-neutral-900 shadow-lg sm:hidden">
                    <Play className="ml-0.5 h-5 w-5 fill-current" />
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}