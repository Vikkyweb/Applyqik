'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import {
  Search,
  Target,
  FileCheck2,
  Mail,
  KanbanSquare,
  CheckCircle2,
  ImageOff,
} from 'lucide-react';

/**
 * StackedFeatures — "How Applyqik works" pinned pipeline.
 *
 * Same single-sticky-viewport architecture as the Woxelo version (one
 * `h-dvh` sticky box, scroll-linked opacity/y/scale per card — card
 * content height never has to fight a per-card spacer). Restyled for
 * Applyqik's visual language: plain white background, black/gray type,
 * thin borders, no gradients or colored accent chips. The right-hand
 * side is a real dashboard screenshot per feature (via ScreenshotFrame,
 * same fallback pattern as Woxelo's) — drop the actual PNGs in at the
 * paths below.
 */

const HEADER_HEIGHT_REM = 4; // must match Header's h-16

const STEPS = [
  {
    id: '01',
    label: 'Discovery',
    title: 'Find opportunities without endless searching',
    description:
      'Applyqik continuously searches trusted job sources and brings relevant opportunities directly to you.',
    bullets: [
      'Matched to your skills',
      'Matched to your experience',
      'Matched to your location',
      'Matched to your career goals',
    ],
    icon: Search,
    screenshot: '/screenshots/one.png',
  },
  {
    id: '02',
    label: 'Matching',
    title: 'Know why a job fits you',
    description:
      'Not every job deserves your time. Applyqik analyzes each opportunity against your profile and explains why you match, where you\u2019re strong, and what\u2019s missing.',
    bullets: ['Why you match', 'Your strengths', 'Missing requirements'],
    icon: Target,
    screenshot: '/screenshots/two.png',
  },
  {
    id: '03',
    label: 'Resume',
    title: 'Stop sending resumes that get ignored',
    description:
      'Every job is different. Applyqik helps create ATS-friendly resume versions tailored for specific opportunities.',
    bullets: [
      'Tailored to each job posting',
      'Optimized for applicant tracking systems',
      'Keyword gaps identified automatically',
    ],
    icon: FileCheck2,
    screenshot: '/screenshots/one.png',
  },
  {
    id: '04',
    label: 'Cover Letters',
    title: 'Personalized applications, not generic templates',
    description:
      'Generate cover letters built around your experience, the company, and the role you\u2019re applying to.',
    bullets: ['Based on your experience', 'Based on the company', 'Based on the role'],
    icon: Mail,
    screenshot: '/screenshots/one.png',
  },
  {
    id: '05',
    label: 'Tracking',
    title: 'Keep your entire search organized',
    description:
      'Never lose track of where you applied. Manage every stage in one place, from saved to offer.',
    bullets: ['Saved', 'Preparing', 'Applied', 'Interview', 'Offer'],
    icon: KanbanSquare,
    screenshot: '/screenshots/one.png',
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
    <section className="relative bg-background">
      <div className="mx-auto max-w-2xl text-center px-4 sm:px-6 py-16 sm:py-20 lg:py-28">
        <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight text-foreground leading-[1.1]">
          From job search to offer,
          <br className="hidden sm:block" /> in five steps
        </h2>
        <p className="mt-5 text-base sm:text-lg text-gray-500 leading-relaxed">
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
      <div className="w-full max-w-7xl max-h-full overflow-y-auto rounded-2xl sm:rounded-[2rem] border border-border bg-background shadow-[0_20px_60px_-25px_rgba(0,0,0,0.15)]">
        <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-6 lg:gap-16 items-center p-5 sm:p-10 lg:p-16">
          <div className="order-1 lg:order-none flex items-center justify-center py-2 lg:py-0">
            <ScreenshotFrame src={step.screenshot} alt={`${step.title}  Applyqik dashboard`} />
          </div>

          <div className="order-2 lg:order-none">
            <div className="flex items-center gap-3 mb-4 sm:mb-5">
              <span className="flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-full shrink-0 border border-border bg-background text-foreground">
                <Icon size={18} strokeWidth={1.75} />
              </span>
              <span className="font-mono text-xs font-medium tracking-[0.15em] uppercase text-foreground">
                {step.id} / {String(total).padStart(2, '0')} \ {step.label}
              </span>
            </div>

            <h3 className="text-xl sm:text-3xl lg:text-4xl font-semibold text-foreground mb-3 sm:mb-4 leading-[1.15] tracking-tight">
              {step.title}
            </h3>
            <p className="text-sm sm:text-base lg:text-lg text-gray-500 leading-relaxed max-w-xl mb-4 sm:mb-8">
              {step.description}
            </p>

            <ul className="space-y-2 sm:space-y-3">
              {step.bullets.map((bullet) => (
                <li key={bullet} className="flex items-start gap-2.5">
                  <CheckCircle2
                    size={16}
                    strokeWidth={1.75}
                    className="shrink-0 mt-0.5 text-gray-900"
                  />
                  <span className="text-sm sm:text-base text-gray-600 leading-snug">{bullet}</span>
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
 * Monochrome to match the rest of the section; the filled segment
 * is the only piece of state on screen at any moment.
 */
function ProgressRail({ progress, total, steps }) {
  return (
    <div className="absolute bottom-5 sm:bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 sm:gap-2.5">
      {steps.map((step, i) => (
        <RailSegment key={step.id} index={i} total={total} progress={progress} />
      ))}
    </div>
  );
}

function RailSegment({ index, total, progress }) {
  const start = index / total;
  const end = (index + 1) / total;
  const fill = useTransform(progress, [start, end], ['0%', '100%']);

  return (
    <div className="relative h-[3px] w-8 sm:w-10 rounded-full bg-gray-200 overflow-hidden">
      <motion.div
        className="absolute inset-y-0 left-0 rounded-full bg-gray-900"
        style={{ width: fill }}
      />
    </div>
  );
}

/**
 * Screenshot frame — plain bordered panel for a real dashboard image.
 * Falls back to a dashed placeholder (with the expected path) if the
 * image is missing or fails to load, same pattern as Woxelo's version,
 * just restyled light instead of dark.
 */
function ScreenshotFrame({ src, alt }) {
  const [failed, setFailed] = useState(false);
  const showPlaceholder = !src || failed;

  return (
    <div className="relative aspect-[4/3] w-full max-w-[420px] rounded-xl border border-border bg-background overflow-hidden">
      {!showPlaceholder ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes="420px"
          className="object-cover"
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="absolute inset-3 flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border px-4 text-center">
          <ImageOff size={18} className="text-foreground" />
          <span className="text-[11px] leading-relaxed text-foreground">
            Add screenshot at
            <br />
            <code className="text-foreground">{src}</code>
          </span>
        </div>
      )}
    </div>
  );
}