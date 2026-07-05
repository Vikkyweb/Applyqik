'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

/**
 * FAQSection — accordion list + CTA footer.
 *
 * Structurally mirrors the reference screenshot (single bordered list,
 * one row open at a time, +/- toggle, dividers between rows) but
 * restyled for Applyqik's light system: white background, thin
 * gray-200 borders, black/gray type, no dark card treatment.
 *
 * The "Still have questions?" bit in the reference screenshot is the
 * last accordion row; here it's pulled out into its own CTA block
 * below the list per the copy provided, since it isn't phrased as a
 * question and doesn't behave like the others (no expand/collapse —
 * just two links).
 */

const FAQS = [
  {
    question: 'How does Applyqik find jobs?',
    answer:
      "Applyqik continuously searches trusted job sources, company career pages, and remote job platforms to discover opportunities that match your skills, experience, and career preferences. Instead of searching manually, you'll receive personalized job recommendations in one place.",
  },
  {
    question: 'Does Applyqik apply for jobs automatically?',
    answer:
      "No. Applyqik prepares everything for you, but you're always in control. It finds relevant jobs, generates ATS-optimized application materials, and organizes everything for review. You decide which opportunities to apply for.",
  },
  {
    question: 'What makes Applyqik different from LinkedIn or Indeed?',
    answer:
      'LinkedIn and Indeed help you search for jobs. Applyqik works alongside them by continuously finding opportunities, explaining why they match your profile, generating tailored resumes and cover letters, and helping you manage your entire application journey from one intelligent workspace.',
  },
  {
    question: 'Is my resume and personal information secure?',
    answer:
      'Yes. Your career information is encrypted and securely stored. We never sell your personal data, and your resume is only used to personalize job matching and generate better application materials. Your data remains yours.',
  },
  {
    question: 'Can Applyqik help improve my chances of getting hired?',
    answer:
      "Applyqik can't guarantee a job offer, but it helps you apply smarter. By matching you with relevant opportunities and generating ATS-friendly resumes and personalized cover letters, you can submit stronger, more targeted applications with less effort.",
  },
  {
    question: 'Can I try Applyqik before subscribing?',
    answer:
      'Absolutely. You can start with our free plan to explore the platform, upload your resume, and experience AI-powered job matching before deciding if a paid plan is right for you.',
  },
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="bg-background py-18 sm:py-28">
      <div className="mx-auto max-w-3xl px-6">
        <h2 className="text-center text-4xl sm:text-5xl font-semibold tracking-tight text-foreground mb-8 sm:mb-10">
          FAQs
        </h2>

        <div className="rounded-2xl border border-border overflow-hidden">
          {FAQS.map((item, index) => (
            <FAQRow
              key={item.question}
              item={item}
              isOpen={openIndex === index}
              onToggle={() => setOpenIndex(openIndex === index ? null : index)}
              isLast={index === FAQS.length - 1}
            />
          ))}
        </div>

        {/* <FAQCallToAction /> */}
      </div>
    </section>
  );
}

function FAQRow({ item, isOpen, onToggle, isLast }) {
  return (
    <div className={isLast ? '' : 'border-b border-border'}>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="w-full flex items-center justify-between gap-6 text-left px-6 py-2 hover:bg-secondary/80 transition-colors"
      >
        <span className="text-base sm:text-lg font-medium text-foreground">{item.question}</span>
        <span className="shrink-0 flex h-6 w-6 items-center justify-center text-gray-400">
          {isOpen ? <Minus size={18} strokeWidth={1.75} /> : <Plus size={18} strokeWidth={1.75} />}
        </span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <p className="px-6 sm:px-8 pb-6 sm:pb-7 text-sm sm:text-base text-gray-500 leading-relaxed max-w-2xl">
              {item.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function FAQCallToAction() {
  return (
    <p className="mt-10 sm:mt-12 text-center text-sm sm:text-base text-gray-500">
      Still have questions? Visit our{' '}
      <a href="/help" className="font-medium text-gray-900 underline underline-offset-4 hover:text-gray-600">
        Help Center
      </a>{' '}
      or{' '}
      <a
        href="/contact"
        className="font-medium text-gray-900 underline underline-offset-4 hover:text-gray-600"
      >
        Contact Support
      </a>{' '}
      — we're here to help you make your next career move with confidence.
    </p>
  );
}