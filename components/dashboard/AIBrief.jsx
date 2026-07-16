'use client';

import { Sparkles } from 'lucide-react';

// The signature element: Applyqik speaking like a recruiter, not a dashboard.
// Copy is generated from real data the caller passes in — never fabricated.
export default function AIBrief({ userName, newMatches, topMatch, jobsToday, hasResume }) {
  const greeting = getGreeting();

  // Build the brief from what's actually true right now.
  const lines = [];
  if (newMatches > 0) {
    lines.push(`I found ${newMatches} new ${newMatches === 1 ? 'match' : 'matches'} for you.`);
  } else {
    lines.push(`No new matches yet — run a fresh search anytime from the Jobs page.`);
  }
  if (topMatch) {
    lines.push(`Your strongest is ${topMatch.job?.title} at ${topMatch.job?.company_name}, a ${topMatch.match_score}% fit.`);
  }
  if (!hasResume) {
    lines.push(`Upload your resume and I'll rank everything against your real experience.`);
  } else if (jobsToday > 0) {
    lines.push(`${jobsToday} fresh ${jobsToday === 1 ? 'role' : 'roles'} landed in the last day.`);
  }

  return (
    <div className="relative overflow-hidden rounded-card bg-ink p-6 text-white">
      {/* ambient accent glow */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-accent/20 blur-3xl" />
      <div className="relative">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent/20">
            <Sparkles className="h-4 w-4 text-accent" />
          </div>
          <span className="text-sm font-medium text-white/70">Today's brief</span>
        </div>

        <h2 className="mt-4 font-display text-xl font-semibold">
          {greeting}, {userName?.split(' ')[0] ?? 'there'} 👋
        </h2>

        <div className="mt-3 space-y-1.5">
          {lines.map((line, i) => (
            <p key={i} className="text-[15px] leading-relaxed text-white/85">
              {line}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}
