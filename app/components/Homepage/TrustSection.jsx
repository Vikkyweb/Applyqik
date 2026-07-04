import { ArrowRight, Play, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function TrustSection() {
  return (
    <section className="bg-background">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 py-16 sm:py-20 lg:py-28">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
            Why professionals trust <span className="font-extrabold">Applyqik</span>
          </h2>
          <p className="mt-4 text-lg text-gray-500">
            Your career. Your decisions. Your AI advantage.
          </p>
        </div>

        {/* Hero visual — swap this block for a real product video or screenshot */}
        <div className="relative aspect-video w-full rounded-2xl border border-border bg-background overflow-hidden flex flex-col items-center justify-center gap-3">
          <div className="w-14 h-14 rounded-full bg-background border border-border flex items-center justify-center">
            <Play size={20} className="text-foreground ml-0.5" fill="currentColor" />
          </div>
          <p className="text-sm text-foreground">Product video or screenshot goes here</p>
        </div>

        {/* Icon + text block */}
        <div className="mt-20 flex flex-col sm:flex-row gap-8 sm:gap-10">
          <div className="shrink-0">
            <div className="w-24 h-24 rounded-full border border-border bg-background flex items-center justify-center">
              <ShieldCheck size={32} className="text-foreground" strokeWidth={1.75} />
            </div>
          </div>

          <div className="flex-1">
            <h3 className="text-2xl font-bold text-foreground mb-1">
              Built to keep you in control
            </h3>
            <p className="text-sm text-gray-500 mb-6 text-muted-foreground">
              Applyqik is built to remove the repetitive work from job hunting — not remove you from the process.
            </p>

            <p className="text-[15px] leading-relaxed text-gray-500 mb-4">
              We don't believe in sending hundreds of low-quality applications. Applyqik helps
              you find relevant opportunities, understand why they match, and prepare
              applications worth submitting. You review. You approve. You apply.
            </p>
            <p className="text-[15px] leading-relaxed text-gray-500 mb-4">
              Your career experience represents years of work, growth, and achievements. We use
              your information only to personalize your job search, improve matching, and help
              create better application materials. You own your career story.
            </p>
            <p className="text-[15px] leading-relaxed text-gray-500 mb-8">
              AI can analyze opportunities, identify patterns, and help you discover relevant
              roles, understand your chances, and improve your applications — tracking your
              progress along the way. But the final decision, on which jobs to pursue and where
              your career goes next, always belongs to you.
            </p>

            <p className="text-[15px] font-semibold text-gray-500 mb-6">
              Spend less time managing the search. Spend more time preparing for the opportunity.
            </p>

            <Link
              href="/signin" className="inline-flex items-center gap-2 bg-primary hover:bg-secondary text-white px-8 py-3 rounded-xl font-semibold transition"
            >
              Start building your smarter job search
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}