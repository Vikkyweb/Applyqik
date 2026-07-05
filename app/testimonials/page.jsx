'use client';

import { Star } from 'lucide-react';
import Link from 'next/link';

/**
 * Testimonials.jsx
 * Next.js + Tailwind CSS testimonials section, responsive from mobile → desktop.
 *
 * Usage (Next.js App Router):
 *   import Testimonials from '@/components/Testimonials';
 *   ...
 *   <Testimonials />
 *
 * Notes:
 * - Rename to Testimonials.tsx and add types if your project uses TypeScript.
 * - Uses lucide-react for the star icon: npm install lucide-react
 * - Avatar images are placeholders (ui-avatars.com) — swap `avatar` for real photos.
 */

const featured = {
  quote:
    'This has been really helpful, in application and my mental peace…mainly with the tedium of submitting and following up job applications. Think of this as a contact manager, CRM, resume-builder, and job tracker all in one.',
  name: 'Aisha Bello',
  role: 'Program Manager',
  avatar: 'https://ui-avatars.com/api/?name=Aisha+Bello&background=0d3b33&color=fff',
};

const testimonials = [

  {
    quote:
      'Amazing resource for organizing your job search and doing both easy and advanced customization of your resume. It even drafts cover letters for you.',
    name: 'Meg Thomas',
    role: 'Business Strategy & Operations Leader',
    avatar: 'https://ui-avatars.com/api/?name=Meg+Thomas&background=3d5c3a&color=fff',
  },
  {
    quote:
      "Being able to build an incredibly relevant resume for every job has been a pipe dream until Teal. Its AI-enabled cover letters are excellent too (and that's coming a comms person).",
    name: 'Therese Sollars',
    role: 'Director, Internal Communications',
    avatar: 'https://ui-avatars.com/api/?name=Therese+Sollars&background=4a3b5c&color=fff',
  },
  {
    quote:
      "This has been a really valuable tool for job research and resume/cover letter writing! It's use of AI is really forward-thinking and speeds up the job application process.",
    name: 'Billy Lechert',
    role: 'Head of Workplace',
    avatar: 'https://ui-avatars.com/api/?name=Billy+Lechert&background=2b2b2b&color=fff',
  },
  {
    quote:
      'Teal is absolutely amazing! I can customize resumes and cover letters in no time that look highly professional and specific to the job. Teal is a must to install as a Chrome Extension.',
    name: 'Janice Simpson',
    role: 'Treatment Specialist',
    avatar: 'https://ui-avatars.com/api/?name=Janice+Simpson&background=5c2a3f&color=fff',
  },
    {
    quote:
      'Amazing resource for organizing your job search and doing both easy and advanced customization of your resume. It even drafts cover letters for you.',
    name: 'Meg Thomass',
    role: 'Business Strategy & Operations Leader',
    avatar: 'https://ui-avatars.com/api/?name=Meg+Thomas&background=3d5c3a&color=fff',
  },
  {
    quote:
      "Being able to build an incredibly relevant resume for every job has been a pipe dream until Teal. Its AI-enabled cover letters are excellent too (and that's coming a comms person).",
    name: 'Therese Sollarss',
    role: 'Director, Internal Communications',
    avatar: 'https://ui-avatars.com/api/?name=Therese+Sollars&background=4a3b5c&color=fff',
  },
  {
    quote:
      "This has been a really valuable tool for job research and resume/cover letter writing! It's use of AI is really forward-thinking and speeds up the job application process.",
    name: 'Billy Lecherts',
    role: 'Head of Workplace',
    avatar: 'https://ui-avatars.com/api/?name=Billy+Lechert&background=2b2b2b&color=fff',
  },
  {
    quote:
      'Teal is absolutely amazing! I can customize resumes and cover letters in no time that look highly professional and specific to the job. Teal is a must to install as a Chrome Extension.',
    name: 'Janice Simpsons',
    role: 'Treatment Specialist',
    avatar: 'https://ui-avatars.com/api/?name=Janice+Simpson&background=5c2a3f&color=fff',
  },
];

function Stars({ count = 5 }) {
  return (
    <div className="flex gap-0.5" aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
      ))}
    </div>
  );
}

function TestimonialCard({ quote, name, role, avatar }) {
  return (
    <div className="flex h-full flex-col justify-between rounded-2xl bg-neutral-50 p-6">
      <div>
        <Stars />
        <p className="mt-4 text-[15px] leading-relaxed text-neutral-800">{quote}</p>
      </div>
      <div className="mt-6 flex items-center gap-3">
        <img
          src={avatar}
          alt={name}
          className="h-10 w-10 flex-shrink-0 rounded-full object-cover"
        />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-neutral-900">{name}</p>
          <p className="truncate text-sm text-neutral-500">{role}</p>
        </div>
      </div>
    </div>
  );
}

export default function Testimonials() {
  return (
    <section className="w-full bg-background px-4 sm:px-6 py-16 sm:py-20 lg:py-28">
      <div className="mx-auto max-w-7xl">
        {/* Heading */}
        <div className="text-center">
          <h2 className="text-2xl font-extrabold text-foreground sm:text-3xl md:text-4xl">
            The most effective strategy for your job search
          </h2>
          <p className="mt-4 text-xl font-bold text-gray-500 sm:mt-6 sm:text-2xl md:text-3xl">
            Loved by over 3.2 million members
          </p>
          <p className="mt-3 flex items-center justify-center gap-2 text-sm font-semibold text-foreground sm:text-base">
            Rated over 4.4 on
            <span className="inline-flex items-center gap-1">
              <Star className="h-4 w-4 fill-foreground text-gray-500" />
              Trustpilot
            </span>
          </p>
        </div>

        {/* Testimonial grid */}
        <div className="mt-10 grid grid-cols-1 gap-4 sm:mt-12 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
          {testimonials.map((t) => (
            <TestimonialCard key={t.name} {...t} />
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 flex justify-center sm:mt-14">
          <Link
            href="#"
            className="rounded-xl bg-primary px-8 py-3.5 text-sm font-bold text-white shadow-sm transition-transform hover:scale-[1.02] hover:bg-secondary active:scale-[0.98] sm:text-base"
          >
            See all testimonials
          </Link>
        </div>
      </div>
    </section>
  );
}