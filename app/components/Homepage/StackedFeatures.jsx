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
 * StackedFeatures
 * "How it works" section — up to 5 static rows that stack on scroll.
 *
 * How the stack works:
 * - Each row is wrapped in a tall spacer (`STEP_HEIGHT`) so there's scroll
 *   distance to travel per card.
 * - Inside, the card is `sticky` with an increasing `top` offset per index,
 *   so as you scroll, each new card pins a little lower than the last —
 *   the previous card's edge keeps peeking out above it (the paper-stack look).
 * - z-index increases with index so later cards sit visually on top.
 * - Scroll progress per card (via useScroll) drives a gentle scale/opacity
 *   dip as the NEXT card slides over it, reinforcing depth.
 *
 * Screenshots: set `screenshot` per step to a real path under /public
 * (e.g. '/screenshots/step-01-import.png'). Until that file exists, the
 * frame renders a labeled placeholder so it's obvious what's missing —
 * nothing breaks if the image 404s.
 *
 * Drop the array below to 3–4 items and everything (offsets, z-index,
 * scroll ranges) still works — it's fully data-driven.
 */

const STEPS = [
  {
    id: '01',
    label: 'Import',
    title: 'Drop in your URL',
    description:
      'Point Woxelo at your live site and we pull in your pages, navigation, and content automatically — nothing to rebuild from scratch, and nothing to migrate by hand.',
    bullets: [
      'Pages, navigation, and content pulled in automatically',
      'Works with any site — no rebuild required',
      'SSL and custom domains carried over',
    ],
    icon: Link2,
    accent: '#6C5CE7', // indigo
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
      'Web layout remapped to native navigation patterns',
      'Light and dark variants generated automatically',
    ],
    icon: Palette,
    accent: '#39C6A8', // mint
    screenshot: '/screenshots/step-02-design.png',
  },
  {
    id: '03',
    label: 'Extend',
    title: 'Add native features',
    description:
      'Go beyond what a browser can do. Turn on device capabilities your users expect from a real app, without writing a line of native code.',
    bullets: [
      'Push notifications with one toggle',
      'Offline caching for core pages',
      'Camera, biometrics, and device APIs on request',
    ],
    icon: Zap,
    accent: '#E8A33D', // amber
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
    accent: '#E85D75', // coral
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
    accent: '#4FA3E3', // sky
    screenshot: '/screenshots/step-05-publish.png',
  },
];

const STEP_HEIGHT = 'h-[150vh] sm:h-[170vh] last:h-screen';
const BASE_TOP = 'top-[3rem] sm:top-[3.5rem]';

export default function StackedFeatures() {
  return (
    <section className="relative bg-gray-100 py-20 sm:py-32">
      <div className="mx-auto max-w-2xl px-6 text-center mb-16 sm:mb-24">
        <span className="inline-block text-xs font-medium tracking-[0.2em] uppercase text-[#8B90A0] mb-4">
          How it works
        </span>
        <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight text-black leading-[1.1]">
          From website to app store,
          <br className="hidden sm:block" /> in five steps
        </h2>
        <p className="mt-5 text-base sm:text-lg text-[#8B90A0] leading-relaxed">
          Each stage builds on the last. Scroll to see the whole pipeline stack up.
        </p>
      </div>

      <div className="relative">
        {STEPS.map((step, i) => (
          <StackRow key={step.id} step={step} index={i} total={STEPS.length} />
        ))}
      </div>
    </section>
  );
}

function StackRow({ step, index, total }) {
  const ref = useRef(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.94]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0.55]);
  const y = useTransform(scrollYProgress, [0, 1], [0, -24]);

  // Alternating micro-tilt — the one signature flourish, kept subtle.
  const tilt = index % 2 === 0 ? -0.6 : 0.6;

  const Icon = step.icon;

  return (
    <div ref={ref} className={STEP_HEIGHT}>
      <div
        className={`sticky ${BASE_TOP} flex justify-center px-4 sm:px-6`}
        style={{ top: `${3 + index * 1.5}rem`, zIndex: index + 1 }}
      >
        <motion.div
          style={
            prefersReducedMotion
              ? undefined
              : { scale, opacity, y, rotate: tilt }
          }
          className="w-full max-w-6xl rounded-2xl sm:rounded-[2rem] border border-white/10 bg-[#12141B] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.65)] overflow-hidden"
        >
          <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-10 lg:gap-16 items-center p-6 sm:p-12 lg:p-16">
            {/* Screenshot side */}
            <div
              className="order-1 lg:order-none flex items-center justify-center py-4 lg:py-0 rounded-2xl"
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

            {/* Write-up side */}
            <div className="order-2 lg:order-none">
              <div className="flex items-center gap-3 mb-5">
                <span
                  className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full shrink-0"
                  style={{ backgroundColor: `${step.accent}1A`, color: step.accent }}
                >
                  <Icon size={20} strokeWidth={2} />
                </span>
                <span className="text-xs font-medium tracking-[0.15em] uppercase text-[#8B90A0]">
                  Step {step.id} · {step.label}
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-[#F5F3EF] mb-4 leading-[1.15] tracking-tight">
                {step.title}
              </h3>
              <p className="text-sm sm:text-base lg:text-lg text-[#9096A5] leading-relaxed max-w-xl mb-6 sm:mb-8">
                {step.description}
              </p>

              <ul className="space-y-3">
                {step.bullets.map((bullet) => (
                  <li key={bullet} className="flex items-start gap-2.5">
                    <CheckCircle2
                      size={18}
                      strokeWidth={2}
                      className="shrink-0 mt-0.5"
                      style={{ color: step.accent }}
                    />
                    <span className="text-sm sm:text-base text-[#C7CAD4] leading-snug">
                      {bullet}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function ScreenshotFrame({ src, alt, accent, label }) {
  const [failed, setFailed] = useState(false);
  const showPlaceholder = !src || failed;

  return (
    <div className="relative w-full max-w-[280px]">
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
            sizes="280px"
            className="object-cover"
            onError={() => setFailed(true)}
          />
        ) : (
          <div className="absolute inset-2 flex flex-col items-center justify-center gap-2 rounded-[1.75rem] border-2 border-dashed border-white/10 px-4 text-center">
            <ImageOff size={20} className="text-white/25" />
            <span className="text-[10px] leading-relaxed text-white/35">
              Add screenshot at
              <br />
              <code className="text-white/45">{src}</code>
            </span>
          </div>
        )}

        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-4 w-20 bg-[#1B1E27] rounded-b-xl z-10" />
      </div>
    </div>
  );
}