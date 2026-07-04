'use client';

import { useState } from 'react';
import { Check } from 'lucide-react';
import Link from 'next/link';

const YEARLY_DISCOUNT = 0.16;

const plans = [
  {
    id: 'free',
    name: 'Explorer',
    monthly: 0,
    checkColor: '#2563EB', // blue
    cta: 'Start free',
    features: [
      'Career profile',
      'Upload resume & auto-parsing',
      'Browse & save jobs',
      'AI matching — 5 matches / month',
      'ATS resume scan — 1 / month',
      '1 AI-generated cover letter',
      'Weekly email digest',
    ],
  },
  {
    id: 'pro',
    name: 'Career Accelerator',
    monthly: 19,
    checkColor: '#059669', // green
    includesLabel: 'Everything in Explorer, plus:',
    cta: 'Start 7-day trial',
    features: [
      'Hourly AI job agent — fetches, filters, matches & notifies automatically',
      'Unlimited AI job matching',
      'Resume Studio — unlimited ATS resumes, job-specific versions, keyword optimization',
      'Unlimited personalized cover letters',
      'Full application tracker — Saved, Preparing, Applied, Interview, Offer',
      'Daily email digest',
      'AI job insights — e.g. "your chances rise 22% with Docker"',
      'Priority support',
    ],
  },
  {
    id: 'premium',
    name: 'AI Career Agent',
    monthly: 49,
    checkColor: '#D97706', // amber
    includesLabel: 'Everything in Pro, plus:',
    cta: 'Start 7-day trial',
    features: [
      'Multiple career paths in one account',
      'Advanced AI agent — plain-language job requests',
      'Interview intelligence — research, questions & answers',
      'Application analytics dashboard',
      'Priority AI processing & higher limits',
    ],
  },
];

function formatPrice(monthly, cycle) {
  if (monthly === 0) return { big: 0, note: null };
  if (cycle === 'monthly') return { big: monthly, note: null };
  const yearlyMonthlyEquivalent = Math.round((monthly * 12 * (1 - YEARLY_DISCOUNT)) / 12);
  return { big: yearlyMonthlyEquivalent, note: `$${yearlyMonthlyEquivalent * 12} billed yearly` };
}

function PlanCard({ plan, cycle }) {
  const price = formatPrice(plan.monthly, cycle);

  return (
    <div className="flex flex-col h-full rounded-2xl border border-border bg-background p-7 sm:p-8">
      <h3 className="text-2xl font-bold text-foreground">{plan.name}</h3>

      <div className="mt-2 flex items-baseline gap-1">
        <span className="text-4xl font-bold text-foreground">${price.big}</span>
        <span className="text-base text-gray-500">/mo</span>
      </div>
      {price.note && <p className="mt-1 text-xs text-gray-500">{price.note}</p>}

      <div className="mt-6 flex-1">
        {plan.includesLabel && (
          <p className="mb-3 text-sm italic text-gray-500">{plan.includesLabel}</p>
        )}
        <ul className="space-y-3">
          {plan.features.map((feature) => (
            <li key={feature} className="flex items-start gap-2.5">
              <Check
                size={17}
                strokeWidth={2.5}
                className="mt-0.5 shrink-0"
                style={{ color: plan.checkColor }}
              />
              <span className="text-[14.5px] leading-snug text-gray-500">{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      <Link href="signup" className="mt-8 w-full rounded-xl text-center border border-gray-300 bg-white py-3 text-sm font-medium text-gray-900 hover:bg-gray-50 transition-colors">
        {plan.cta}
      </Link>
    </div>
  );
}

export default function PricingPage() {
  const [cycle, setCycle] = useState('monthly');

  return (
    <div className="min-h-screen w-full bg-background text-foreground">
      <div className="mx-auto max-w-6xl  px-4 sm:px-6 py-16 sm:py-20 lg:py-28">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground sm:leading-tight">
            Pricing
          </h1>
          <p className="mt-3 text-gray-500">Free to start. Upgrade when you're ready to move faster.</p>
        </div>

        {/* Billing toggle */}
        <div className="mt-8 flex items-center justify-center gap-3">
          <span className={`text-sm font-medium ${cycle === 'monthly' ? 'text-gray-900' : 'text-gray-400'}`}>
            Monthly
          </span>
          <button
            onClick={() => setCycle(cycle === 'monthly' ? 'yearly' : 'monthly')}
            className="relative w-11 h-6 rounded-full bg-gray-200 transition-colors"
            aria-label="Toggle billing cycle"
          >
            <span
              className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform"
              style={{ transform: cycle === 'yearly' ? 'translateX(20px)' : 'translateX(0)' }}
            />
          </button>
          <span className={`text-sm font-medium ${cycle === 'yearly' ? 'text-gray-900' : 'text-gray-400'}`}>
            Yearly
          </span>
          <span className="text-sm font-medium text-green-600">16% off</span>
        </div>

        {/* Cards */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6 items-stretch">
          {plans.map((plan) => (
            <PlanCard key={plan.id} plan={plan} cycle={cycle} />
          ))}
        </div>
      </div>
    </div>
  );
}