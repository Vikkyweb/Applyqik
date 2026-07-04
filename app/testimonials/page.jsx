'use client';

import { Star } from 'lucide-react';

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
      'Incredible tool. For everyone who wants to keep everything in one place, this is a HUGE HELP to stay organized and land a job faster.',
    name: 'Alin Florea',
    role: 'Director of Operations',
    avatar: 'https://ui-avatars.com/api/?name=Alin+Florea&background=2b2b2b&color=fff',
  },
  {
    quote:
      'This tool makes it so easy for me to track my applications, write cover letters, and align all of my resumes to the specific keywords in the job descriptions. A must-have for the job hunt!',
    name: 'Brittany Archard',
    role: 'Manager II, Enablement',
    avatar: 'https://ui-avatars.com/api/?name=Brittany+Archard&background=6b3f2a&color=fff',
  },
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
      'Very helpful to be able to save jobs across different job board sites! It makes it so much easier to tailor a resume to a job when you can see both side by side.',
    name: 'Allie Jacobs',
    role: 'Senior Product Designer',
    avatar: 'https://ui-avatars.com/api/?name=Allie+Jacobs&background=8c2d6b&color=fff',
  },
  {
    quote:
      'A great tool for creating targeted resumes that align well with the job posting. The app within job search sites works great. I can quickly save, capture key information, and rate a job.',
    name: 'Roger McClung',
    role: 'Director, Global Operations',
    avatar: 'https://ui-avatars.com/api/?name=Roger+McClung&background=2b2b2b&color=fff',
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
    <section className="w-full bg-white px-6 py-16 sm:px-10 sm:py-20 lg:px-12">
      <div className="mx-auto max-w-7xl">
        {/* Heading */}
        <div className="text-center">
          <h2 className="text-2xl font-extrabold text-[#0d3b33] sm:text-3xl md:text-4xl">
            The most effective strategy for your job search
          </h2>
          <p className="mt-4 text-xl font-bold text-[#0d3b33] sm:mt-6 sm:text-2xl md:text-3xl">
            Loved by over 3.2 million members
          </p>
          <p className="mt-3 flex items-center justify-center gap-2 text-sm font-semibold text-[#0d3b33] sm:text-base">
            Rated over 4.4 on
            <span className="inline-flex items-center gap-1">
              <Star className="h-4 w-4 fill-[#0d3b33] text-[#0d3b33]" />
              Trustpilot
            </span>
          </p>
        </div>

        {/* Featured testimonial */}
        <div className="mt-10 overflow-hidden rounded-2xl bg-[#0d3b33] sm:mt-12">
          <div className="flex flex-col items-start gap-6 p-6 sm:flex-row sm:items-center sm:gap-8 sm:p-10 md:p-12">
            <img
              src={featured.avatar}
              alt={featured.name}
              className="h-16 w-16 flex-shrink-0 rounded-full object-cover order-1 sm:order-2 sm:h-20 sm:w-20"
            />
            <div className="order-2 sm:order-1 sm:flex-1">
              <Stars />
              <p className="mt-4 text-base leading-relaxed text-white sm:text-lg md:text-xl">
                {featured.quote}
              </p>
              <p className="mt-4 text-sm font-semibold text-white/90 sm:text-base">
                {featured.name}
                <span className="font-normal text-white/70"> · {featured.role}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Testimonial grid */}
        <div className="mt-10 grid grid-cols-1 gap-4 sm:mt-12 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
          {testimonials.map((t) => (
            <TestimonialCard key={t.name} {...t} />
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 flex justify-center sm:mt-14">
          <a
            href="#"
            className="rounded-full bg-amber-400 px-8 py-3.5 text-sm font-bold text-neutral-900 shadow-sm transition-transform hover:scale-[1.02] hover:bg-amber-300 active:scale-[0.98] sm:text-base"
          >
            Upload Your Resume Now
          </a>
        </div>
      </div>
    </section>
  );
}