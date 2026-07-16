'use client';

import { useState } from 'react';
import {
  ChevronDown,
} from 'lucide-react';
import { 
  FaFacebook, 
  FaInstagram, 
  FaLinkedin, 
  FaYoutube, 
} from 'react-icons/fa';
import Link from 'next/link';

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
    title: 'Features',
    links: [
      'AI Job Discovery',
      'AI Matching',
      'ATS Resume Generator',
      'Cover Letters',
      'Tracking & Analytics',
    ],
  },

  {
    title: 'Sources',
    links: ['RemoteOk', 'Lever', 'Ashbyhq', 'Wellfound', 'YCombinator'],
  },
  {
    title: 'Quick Links',
    links: [
      'Pricing',
      'Who-is-it-for',
      'Security',
      'Blog',
      'Contact',
      'FAQ & Help',
    ],
  },
  {
    title: 'Company',
    links: ['Sign Up', 'Sign In','About Us','Testimonials', 'Privacy Policy', 'Terms of Service'],
  },
];


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
        <span className="font-serif text-lg font-semibold text-foreground sm:text-base">
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
            <Link
              href={`/${link.toLowerCase().replace(/\s+/g, '-')}`}
              className="text-[15px] leading-snug text-foreground/90 transition-colors hover:text-foreground/80 hover:underline underline-offset-2"
            >
              {link}
            </Link>
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
      <div className="relative rounded-t-[2rem] border border-border bg-background sm:rounded-t-[3rem]">
        <div className="mx-auto max-w-7xl px-6 pb-10 pt-10 sm:px-10 sm:pt-14 lg:px-12">
          {/* Link columns */}
          <div className="grid grid-cols-1 gap-x-10 sm:grid-cols-2 sm:gap-y-10 md:grid-cols-3 lg:grid-cols-4">
            {columns.map((col) => (
              <FooterColumn key={col.title} title={col.title} links={col.links} />
            ))}
          </div>

          {/* Brand / trust row */}
          <div className="mt-10 flex flex-col items-start gap-6 border-t border-white/10 pt-8 sm:mt-12 sm:flex-row sm:items-center sm:justify-between sm:pt-10">
            <div className="flex items-start gap-3 sm:items-center">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border-2 border-border text-white">
                <span className="text-lg font-bold leading-none">t</span>
              </div>
              <div>
                <p className="text-base font-semibold text-foreground sm:text-lg">
                  Over 1 Thousand Users
                </p>
                <p className="text-sm text-gray-500 sm:text-[15px]">
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
      <div className="bg-background/50">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-6 py-6 text-sm text-foreground/90 sm:flex-row sm:justify-between sm:px-10 lg:px-12">
          <div className="flex flex-col items-center gap-2 sm:flex-row sm:gap-6">
            <span>© 2026 Applyqik Labs, Inc</span>
            <Link href="/privacy-policy" className="hover:text-foreground/80 hover:underline">
              Privacy Policy
            </Link>
            <Link href="/terms-of-service" className="hover:text-foreground/80 hover:underline">
              Terms of Service
            </Link>
          </div>

          <div className="flex items-center gap-4 text-foreground/90 sm:gap-6">
            <Link href="#" aria-label="YouTube" className="hover:opacity-70">
              <FaYoutube className="h-5 w-5" />
            </Link>
            <Link href="#" aria-label="LinkedIn" className="hover:opacity-70">
              <FaLinkedin className="h-5 w-5" />
            </Link>
            <Link href="#" aria-label="TikTok" className="hover:opacity-70">
              <FaFacebook className="h-5 w-5" />
            </Link>
            <Link href="#" aria-label="Instagram" className="hover:opacity-70">
              <FaInstagram className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}