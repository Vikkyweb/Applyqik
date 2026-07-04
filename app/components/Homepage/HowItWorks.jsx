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
  { n: 1, label: 'Sign up' },
  { n: 2, label: 'Update profile' },
  { n: 3, label: 'Upload resume', },
  { n: 4, label: 'AI hunts jobs' },
  { n: 5, label: 'AI matches jobs' },
  { n: 6, label: 'Review & Apply' },
];


export default function HowItWorks() {
  const [playing, setPlaying] = useState(false);

  return (
    <section className="w-full bg-background px-4 sm:px-6 py-16 sm:py-20 lg:py-28">
      <div className="mx-auto max-w-5xl">
        {/* Heading */}
        <div className="text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl md:text-5xl">
            How <span className="font-black">Applyqik</span> works
          </h2>

          {/* Steps pill */}
          <div className="mt-6 inline-flex max-w-full flex-wrap items-center justify-center gap-x-2 gap-y-2 rounded-full bg-neutral-200 px-3 py-2 text-xs font-medium text-neutral-700 sm:mt-8 sm:gap-x-3 sm:px-5 sm:py-3 sm:text-sm">
            {steps.map((s, i) => (
              <span key={s.n} className="flex items-center gap-1.5 sm:gap-2">
                <span className="flex items-center gap-1.5 whitespace-nowrap sm:gap-2">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-neutral-900 text-[11px] font-bold text-white sm:h-6 sm:w-6 sm:text-xs">
                    {s.n}
                  </span>
                  {s.label}
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
          <div className="rounded-2xl bg-linear-to-br from-primary via-indigo-300 to-secondary p-1.5 shadow-xl sm:rounded-3xl sm:p-2">
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
                      How to use Applyqik
                    </p>
                    <p className="truncate text-[10px] text-white/70 sm:text-xs">
                      Kevin Naughton Jr.
                    </p>
                  </div>
                </div>

                <div className="hidden shrink-0 items-center gap-3 text-white/80 sm:flex">
                  <VolumeX className="h-4 w-4" />
                  <span className="rounded border border-white/50 px-1 text-[10px] font-semibold">
                    CC
                  </span>
                  <Settings className="h-4 w-4" />
                </div>
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