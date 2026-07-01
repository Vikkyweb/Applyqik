'use client';

import { useState } from 'react';
import {
  Youtube,
  Linkedin,
  Instagram,
  ChevronDown,
} from 'lucide-react';
import { 
  FaFacebook, 
  FaInstagram, 
  FaLinkedin, 
  FaYoutube, 
  FaTiktok ,
  FaBuilding,
  FaBriefcase,
} from 'react-icons/fa';

/**
 * Footer.jsx
 * Next.js + Tailwind CSS footer, responsive from mobile → desktop.
 *
 * Usage (Next.js App Router):
 *   import Footer from '@/components/Footer';
 *   ...
 *   <Footer />
 *
 * Notes:
 * - Rename to Footer.tsx and add types if your project uses TypeScript.
 * - Uses lucide-react for icons (already available in most Next.js/Tailwind starters).
 *   npm install lucide-react
 * - TikTok isn't in lucide-react's icon set, so it's inlined as a small SVG below.
 */

const columns = [
  {
    title: 'Tools',
    links: [
      'AI Resume Builder',
      'Job Application Tracker',
      'ATS Resume Checker',
      'Resume Summary Generator',
      'Resume Job Description Match',
      'Resume Bullet Point Generator',
      'Free AI Resume Builder',
    ],
  },
  {
    title: 'Templates & Examples',
    links: [
      'Resume Examples',
      'Best Resume Format',
      'Resume Templates',
      'Cover Letter Examples',
      'Cover Letter Templates',
      'CV Examples',
    ],
  },
  {
    title: 'Resources',
    links: ['Career Hub', 'Resume Synonyms', 'Job Search', 'Browse Jobs', 'Career Paths'],
  },
  {
    title: 'Comparisons',
    links: [
      'Teal vs Jobscan',
      'Teal vs Rezi',
      'Teal vs Novoresume',
      'Teal vs Zety',
      'Teal vs Kickresume',
      'Teal vs Resumenerd',
      'Teal vs Resume Genius',
    ],
  },
  {
    title: 'Company',
    links: ['Sign Up', 'Log In', 'Teal+ Pricing', 'About Us', 'Open Positions', 'Affiliate Program'],
  },
];

function TikTokIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M16.6 5.82c-.9-.62-1.55-1.6-1.75-2.72h-2.7v13.1c0 1.25-1.02 2.27-2.27 2.27a2.27 2.27 0 0 1 0-4.54c.23 0 .45.03.66.1V11.3a5 5 0 0 0-.66-.04 5.02 5.02 0 1 0 5.02 5.02V9.2a7.44 7.44 0 0 0 4.3 1.37V7.87c-.9 0-1.85-.3-2.6-.9a4.9 4.9 0 0 1-2-1.15Z" />
    </svg>
  );
}

function FooterColumn({ title, links }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-white/10 py-4 sm:border-none sm:py-0">
      {/* Mobile: tap to expand. Desktop: static heading. */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between text-left sm:pointer-events-none sm:cursor-default"
        aria-expanded={open}
      >
        <span className="font-serif text-lg font-semibold text-white/60 sm:text-base">
          {title}
        </span>
        <ChevronDown
          className={`h-4 w-4 text-white/60 transition-transform sm:hidden ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>

      <ul
        className={`mt-3 flex-col gap-3 sm:mt-4 sm:flex ${
          open ? 'flex' : 'hidden'
        }`}
      >
        {links.map((link) => (
          <li key={link}>
            <a
              href="#"
              className="text-[15px] leading-snug text-white/90 transition-colors hover:text-white hover:underline underline-offset-2"
            >
              {link}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="w-full">
      {/* Main footer body */}
      <div className="relative rounded-t-[2rem] bg-[#5b1f39] sm:rounded-t-[3rem]">
        <div className="mx-auto max-w-7xl px-6 pb-10 pt-10 sm:px-10 sm:pt-14 lg:px-12">
          {/* Link columns */}
          <div className="grid grid-cols-1 gap-x-8 sm:grid-cols-2 sm:gap-y-10 md:grid-cols-3 lg:grid-cols-5">
            {columns.map((col) => (
              <FooterColumn key={col.title} title={col.title} links={col.links} />
            ))}
          </div>

          {/* Brand / trust row */}
          <div className="mt-10 flex flex-col items-start gap-6 border-t border-white/10 pt-8 sm:mt-12 sm:flex-row sm:items-center sm:justify-between sm:pt-10">
            <div className="flex items-start gap-3 sm:items-center">
              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-md border-2 border-white text-white">
                <span className="text-lg font-bold leading-none">t</span>
              </div>
              <div>
                <p className="text-base font-semibold text-white sm:text-lg">
                  Over 4 Million Users
                </p>
                <p className="text-sm text-white/70 sm:text-[15px]">
                  Free AI tools and resources to help you land your next job, faster
                </p>
              </div>
            </div>

            {/* Trustpilot badge (replace with real widget/embed as needed) */}
            <div className="flex items-center gap-2 self-start rounded-md bg-white/5 px-3 py-2 sm:self-auto">
              <span className="text-sm font-semibold text-white">★ Trustpilot</span>
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span
                    key={i}
                    className="ml-0.5 flex h-5 w-5 items-center justify-center bg-[#00b67a] text-xs text-white"
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="bg-neutral-100">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-6 py-6 text-sm text-neutral-600 sm:flex-row sm:justify-between sm:px-10 lg:px-12">
          <div className="flex flex-col items-center gap-2 sm:flex-row sm:gap-6">
            <span>© 2026 Teal Labs, Inc</span>
            <a href="#" className="hover:text-neutral-900 hover:underline">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-neutral-900 hover:underline">
              Terms of Service
            </a>
          </div>

          <div className="flex items-center gap-4 text-neutral-900">
            <a href="#" aria-label="YouTube" className="hover:opacity-70">
              <FaYoutube className="h-5 w-5" />
            </a>
            <a href="#" aria-label="LinkedIn" className="hover:opacity-70">
              <FaLinkedin className="h-5 w-5" />
            </a>
            <a href="#" aria-label="TikTok" className="hover:opacity-70">
              <FaTiktok className="h-5 w-5" />
            </a>
            <a href="#" aria-label="Instagram" className="hover:opacity-70">
              <FaInstagram className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}