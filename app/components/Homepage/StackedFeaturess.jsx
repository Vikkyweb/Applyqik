'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import {
  Link2,
  Palette,
  Zap,
  Smartphone,
  Rocket,
  CheckCircle2,
  ImageOff,
} from 'lucide-react';

/**
 * StackedFeatures — "How it works" pinned pipeline.
 *
 * Architecture note (rebuilt from scratch to fix mobile):
 * The old version gave every card its own `position: sticky` inside a
 * per-card spacer sized in `vh`. On mobile that broke two ways: (1) `vh`
 * shifts as the address bar shows/hides, throwing off scroll math, and
 * (2) on narrow screens the card content (image stacked above text)
 * frequently grew taller than its own spacer, leaving no room for the
 * element to actually pin.
 *
 * This version uses exactly ONE sticky element for the whole section —
 * a fixed `h-dvh` viewport box — and cross-fades/slides the cards inside
 * it via scroll-linked transforms. The card's own content height is now
 * irrelevant to whether the effect works, because the pinned box is a
 * fixed size we control directly, not something that has to out-grow
 * variable content. There's nothing left for mobile to break.
 */

const HEADER_HEIGHT_REM = 4; // must match Header's h-16

const STEPS = [
  {
    id: '01',
    label: 'Import',
    title: 'Drop in your URL',
    description:
      'Point Woxelo at your live site and we pull in your pages, navigation, and content automatically — nothing to rebuild, nothing to migrate by hand.',
    bullets: [
      'Pages, navigation, and content pulled in automatically',
      'Works with any site — no rebuild required',
      'SSL and custom domains carried over',
    ],
    icon: Link2,
    accent: '#6C5CE7',
    screenshot: '/screenshots/step-01-import.png',
  },
  {
    id: '02',
    label: 'Design',
    title: 'Make it feel native',
    description:
      'Set your icon, splash screen, and color theme once. Your existing web layout gets remapped to native tab bars, drawers, and transitions automatically.',
    bullets: [
      'Icon, splash screen, and theme in one place',
      'Web layout remapped to native navigation',
      'Light and dark variants generated automatically',
    ],
    icon: Palette,
    accent: '#39C6A8',
    screenshot: '/screenshots/step-02-design.png',
  },
  {
    id: '03',
    label: 'Extend',
    title: 'Add native features',
    description:
      'Go beyond what a browser can do. Turn on the device capabilities your users expect from a real app, without writing a line of native code.',
    bullets: [
      'Push notifications with one toggle',
      'Offline caching for core pages',
      'Camera, biometrics, and device APIs on request',
    ],
    icon: Zap,
    accent: '#E8A33D',
    screenshot: '/screenshots/step-03-extend.png',
  },
  {
    id: '04',
    label: 'Preview',
    title: 'Test on a real device',
    description:
      'Scan a QR code to open a live build on your own phone. Every change you save hot-reloads instantly, so you catch issues before you ship them.',
    bullets: [
      'Scan a QR code to open on your own phone',
      'Every save hot-reloads instantly',
      'Share a preview link with your team',
    ],
    icon: Smartphone,
    accent: '#E85D75',
    screenshot: '/screenshots/step-04-preview.png',
  },
  {
    id: '05',
    label: 'Publish',
    title: 'Ship to both stores',
    description:
      'Submit to the Apple App Store and Google Play together from one dashboard, or skip the review queues entirely with a Woxelo-hosted link.',
    bullets: [
      'Submit to App Store and Google Play together',
      'Or go live instantly on a Woxelo-hosted link',
      'Version history if you need to roll back',
    ],
    icon: Rocket,
    accent: '#4FA3E3',
    screenshot: '/screenshots/step-05-publish.png',
  },
];

export default function StackedFeatures() {
  const containerRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  return (
    <section className="relative bg-[#0B0D12]">
      <div className="mx-auto max-w-2xl px-6 text-center pt-20 sm:pt-32 pb-14 sm:pb-20">
        <span className="inline-block text-xs font-medium tracking-[0.2em] uppercase text-[#8B90A0] mb-4">
          How it works
        </span>
        <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight text-[#F5F3EF] leading-[1.1]">
          From website to app store,
          <br className="hidden sm:block" /> in five steps
        </h2>
        <p className="mt-5 text-base sm:text-lg text-[#8B90A0] leading-relaxed">
          One pipeline, five stages. Scroll to move through it.
        </p>
      </div>

      {/* The only tall element — this is what creates scroll distance.
          Its height is independent of card content on purpose. */}
      <div ref={containerRef} className="relative" style={{ height: `${STEPS.length * 100}dvh` }}>
        <div
          className="sticky overflow-hidden flex items-center justify-center px-4 sm:px-6"
          style={{
            top: `${HEADER_HEIGHT_REM}rem`,
            height: `calc(100dvh - ${HEADER_HEIGHT_REM}rem)`,
          }}
        >
          {STEPS.map((step, i) => (
            <StackCard
              key={step.id}
              step={step}
              index={i}
              total={STEPS.length}
              progress={scrollYProgress}
              reducedMotion={prefersReducedMotion}
            />
          ))}

          <ProgressRail progress={scrollYProgress} total={STEPS.length} steps={STEPS} />
        </div>
      </div>
    </section>
  );
}

function StackCard({ step, index, total, progress, reducedMotion }) {
  const overlap = 0.5 / total;
  const start = index / total;
  const end = (index + 1) / total;

  const opacity = useTransform(
    progress,
    [start - overlap, start, end - overlap, end],
    [0, 1, 1, index === total - 1 ? 1 : 0.5]
  );
  const y = useTransform(progress, [start - overlap, start, end - overlap, end], [32, 0, 0, -16]);
  const scale = useTransform(
    progress,
    [start - overlap, start, end - overlap, end],
    [0.97, 1, 1, index === total - 1 ? 1 : 0.95]
  );

  const Icon = step.icon;

  return (
    <motion.div
      style={
        reducedMotion
          ? { opacity, zIndex: index + 1 }
          : { opacity, y, scale, zIndex: index + 1 }
      }
      className="absolute inset-0 flex items-center justify-center"
    >
      <div className="w-full max-w-6xl max-h-full overflow-y-auto rounded-2xl sm:rounded-[2rem] border border-white/10 bg-[#12141B] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.65)]">
        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6 lg:gap-16 items-center p-5 sm:p-10 lg:p-16">
          <div
            className="order-1 lg:order-none flex items-center justify-center py-2 lg:py-0 rounded-2xl"
            style={{
              background: `radial-gradient(circle at 30% 20%, ${step.accent}1F 0%, transparent 65%)`,
            }}
          >
            <ScreenshotFrame
              src={step.screenshot}
              alt={`${step.title} — Woxelo screenshot`}
              accent={step.accent}
              label={step.label}
            />
          </div>

          <div className="order-2 lg:order-none">
            <div className="flex items-center gap-3 mb-4 sm:mb-5">
              <span
                className="flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-full shrink-0"
                style={{ backgroundColor: `${step.accent}1A`, color: step.accent }}
              >
                <Icon size={18} strokeWidth={2} />
              </span>
              <span className="font-mono text-xs font-medium tracking-[0.15em] uppercase text-[#8B90A0]">
                {step.id} / {String(total).padStart(2, '0')} · {step.label}
              </span>
            </div>

            <h3 className="text-xl sm:text-3xl lg:text-4xl font-semibold text-[#F5F3EF] mb-3 sm:mb-4 leading-[1.15] tracking-tight">
              {step.title}
            </h3>
            <p className="text-sm sm:text-base lg:text-lg text-[#9096A5] leading-relaxed max-w-xl mb-4 sm:mb-8">
              {step.description}
            </p>

            <ul className="space-y-2 sm:space-y-3">
              {step.bullets.map((bullet) => (
                <li key={bullet} className="flex items-start gap-2.5">
                  <CheckCircle2
                    size={16}
                    strokeWidth={2}
                    className="shrink-0 mt-0.5"
                    style={{ color: step.accent }}
                  />
                  <span className="text-sm sm:text-base text-[#C7CAD4] leading-snug">{bullet}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/**
 * Slim progress rail — a mono step counter plus a segmented bar.
 * Reinforces that this is a literal build pipeline, not decoration:
 * the filled segment tells you exactly which stage is active.
 */
function ProgressRail({ progress, total, steps }) {
  return (
    <div className="absolute bottom-5 sm:bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 sm:gap-2.5">
      {steps.map((step, i) => (
        <RailSegment key={step.id} index={i} total={total} progress={progress} accent={step.accent} />
      ))}
    </div>
  );
}

function RailSegment({ index, total, progress, accent }) {
  const start = index / total;
  const end = (index + 1) / total;
  const fill = useTransform(progress, [start, end], ['0%', '100%']);

  return (
    <div className="relative h-[3px] w-8 sm:w-10 rounded-full bg-white/10 overflow-hidden">
      <motion.div
        className="absolute inset-y-0 left-0 rounded-full"
        style={{ width: fill, backgroundColor: accent }}
      />
    </div>
  );
}

function ScreenshotFrame({ src, alt, accent, label }) {
  const [failed, setFailed] = useState(false);
  const showPlaceholder = !src || failed;

  return (
    <div className="relative w-full max-w-[200px] sm:max-w-[240px]">
      <span
        className="absolute -top-3 left-5 z-10 text-[10px] font-semibold tracking-[0.1em] uppercase px-2.5 py-1 rounded-full"
        style={{ backgroundColor: accent, color: '#0B0D12' }}
      >
        {label}
      </span>

      <div className="relative aspect-[9/19.5] rounded-[2.25rem] border-[6px] border-[#1B1E27] bg-[#0B0D12] overflow-hidden">
        {!showPlaceholder ? (
          <Image
            src={src}
            alt={alt}
            fill
            sizes="240px"
            className="object-cover"
            onError={() => setFailed(true)}
          />
        ) : (
          <div className="absolute inset-2 flex flex-col items-center justify-center gap-2 rounded-[1.75rem] border-2 border-dashed border-white/10 px-4 text-center">
            <ImageOff size={18} className="text-white/25" />
            <span className="text-[10px] leading-relaxed text-white/35">
              Add screenshot at
              <br />
              <code className="text-white/45">{src}</code>
            </span>
          </div>
        )}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-4 w-20 bg-[#1B1E27] rounded-b-xl z-10" />
      </div>
    </div>
  );
}