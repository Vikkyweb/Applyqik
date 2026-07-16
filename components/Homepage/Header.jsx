"use client";

import {
  ArrowBigRight,
  ArrowBigRightDash,
  BarChart3,
  Briefcase,
  Calendar,
  ChevronDown,
  FileText,
  Menu,
  PencilLine,
  Puzzle,
  Search,
  UserPlus,
  UserRound,
  Wand2,
  X,
} from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'

import { LuArrowBigRight } from 'react-icons/lu';
import { AnimatePresence, motion } from 'framer-motion';
import ThemeSwitcher from './ThemeSwitcher';
import Link from 'next/link';

// Mega-menu content for the "Features" nav item.
// Two link columns + a live preview card, mirroring how the product actually helps.
const FEATURE_COLUMNS = [
  {
    title: 'Apply faster',
    items: [
      { label: 'AI Resume Tailor', description: 'Match your resume to any job', icon: Wand2 },
      { label: 'Cover Letter Generator', description: 'Draft one in under a minute', icon: FileText },
      { label: 'Application Autofill', description: 'Skip the repetitive forms', icon: PencilLine },
      { label: 'Resume Keyword Scanner', description: 'Find what you\u2019re missing', icon: Search },
    ],
  },
  {
    title: 'Stay organized',
    items: [
      { label: 'Job Tracker', description: 'Every application in one board', icon: Briefcase },
      { label: 'Contact Tracker', description: 'Keep recruiters and referrals close', icon: UserPlus },
      { label: 'Interview Tracker', description: 'Never miss a follow-up', icon: Calendar },
      { label: 'Job Search Metrics', description: 'See what\u2019s actually working', icon: BarChart3 },
    ],
  },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileFeaturesOpen, setMobileFeaturesOpen] = useState(false);
  const [featuresOpen, setFeaturesOpen] = useState(false);

  const featuresRef = useRef(null);
  const closeTimer = useRef(null);

  const openFeatures = () => {
    clearTimeout(closeTimer.current);
    setFeaturesOpen(true);
  };

  const closeFeaturesDelayed = () => {
    closeTimer.current = setTimeout(() => setFeaturesOpen(false), 150);
  };

  // Close on outside click and on Escape, so the dropdown behaves like a real menu.
  useEffect(() => {
    function handlePointerDown(event) {
      if (featuresRef.current && !featuresRef.current.contains(event.target)) {
        setFeaturesOpen(false);
      }
    }
    function handleKeyDown(event) {
      if (event.key === 'Escape') setFeaturesOpen(false);
    }
    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Collapse the mobile accordion whenever the mobile menu itself closes.
  useEffect(() => {
    if (!mobileMenuOpen) setMobileFeaturesOpen(false);
  }, [mobileMenuOpen]);

  return (
      <header className="sticky top-0 z-50 bg-background border-b border-border">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition">
            <div className="w-8 h-8 bg-linear-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
              ⚓
            </div>
            <span className="font-black text-lg tracking-tight">Applyqik</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-12">
            {/* Features — hover or click to open the mega menu */}
            <div
              ref={featuresRef}
              className="relative"
              onMouseEnter={openFeatures}
              onMouseLeave={closeFeaturesDelayed}
            >
              <button
                type="button"
                onClick={() => setFeaturesOpen((open) => !open)}
                aria-haspopup="true"
                aria-expanded={featuresOpen}
                className="flex items-center gap-1 text-sm font-medium text-foreground hover:text-black transition relative group"
              >
                Features
                <ChevronDown
                  size={16}
                  className={`transition-transform duration-200 ${featuresOpen ? 'rotate-180' : ''}`}
                />
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-black group-hover:w-full transition-all duration-300"></span>
              </button>

              <AnimatePresence>
                {featuresOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.98 }}
                    transition={{ duration: 0.18, ease: 'easeOut' }}
                    role="menu"
                    className="absolute left-1/2 -translate-x-1/2 top-full mt-3 w-[min(92vw,720px)] origin-top rounded-2xl border border-gray-100 bg-white shadow-2xl shadow-gray-900/10 overflow-hidden"
                  >
                    <div className="grid grid-cols-2 lg:grid-cols-[1fr_1fr_1.1fr]">
                      {FEATURE_COLUMNS.map((column) => (
                        <div key={column.title} className="p-6 border-r border-gray-50 last:border-r-0">
                          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-4">
                            {column.title}
                          </p>
                          <ul className="space-y-1">
                            {column.items.map(({ label, description, icon: Icon }) => (
                              <li key={label}>
                                <Link
                                  href="#"
                                  role="menuitem"
                                  onClick={() => setFeaturesOpen(false)}
                                  className="flex items-start gap-3 rounded-xl px-2 py-2 -mx-2 hover:bg-gray-50 transition-colors"
                                >
                                  <Icon size={18} className="mt-0.5 shrink-0 text-gray-500" />
                                  <span>
                                    <span className="block text-sm font-semibold text-gray-900">{label}</span>
                                    <span className="block text-xs text-gray-500">{description}</span>
                                  </span>
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}

                      {/* Preview panel — hidden on narrow desktop widths, shown from lg up */}
                      <div className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-emerald-50 to-emerald-100/60 p-6">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700 mb-3">
                            AI Resume Tailor
                          </p>
                          <div className="rounded-xl bg-white border border-emerald-100 p-4 shadow-sm">
                            <p className="text-xs font-medium text-gray-500 mb-2">
                              8 of 12 keywords matched
                            </p>
                            <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden flex">
                              <div className="h-full bg-emerald-500" style={{ width: '67%' }} />
                              <div className="h-full bg-rose-300" style={{ width: '33%' }} />
                            </div>
                            <div className="flex items-center justify-between mt-2 text-[11px] font-medium">
                              <span className="text-emerald-600">8 Matched</span>
                              <span className="text-rose-500">4 Missing</span>
                            </div>
                          </div>
                        </div>
                        <p className="text-xs text-gray-600 leading-relaxed mt-4">
                          Applyqik compares your resume against the job description and shows
                          exactly which keywords are missing, before you hit apply.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link href="#demo" className="text-sm font-medium text-foreground hover:text-black transition relative group">
              Demo
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-black group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link href="#testimonials" className="text-sm font-medium text-foreground hover:text-black transition relative group">
              Testimonials
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-black group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link href="#pricing" className="text-sm font-medium text-foreground hover:text-black transition relative group">
              Pricing
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-black group-hover:w-full transition-all duration-300"></span>
            </Link>
          </div>

          <ThemeSwitcher/>

          {/* CTA and Mobile Menu */}
          <div className="flex items-center gap-4">
            <Link href="/sign-up" className="hidden md:flex items-center gap-2 px-5 py-2 border border-border rounded-xl text-sm font-semibold hover:bg-black hover:text-white transition-all duration-300">
              <LuArrowBigRight size={16} />
              SignUp for free
            </Link>

            <Link href="/sign-in" className="hidden md:flex items-center gap-2 px-5 py-2 border border-border rounded-xl text-sm font-semibold hover:bg-black hover:text-white transition-all duration-300">
              <UserRound size={16} />
              SignIn
            </Link>

            <button 
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

        </nav>

        {/* Mobile Menu - Slides from Right */}
        <div
          className={`fixed inset-0 z-40 md:hidden transition-opacity duration-300 ${
            mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
          onClick={() => setMobileMenuOpen(false)}
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        />
        <div
          className={`fixed top-0 right-0 w-64 h-screen bg-background shadow-xl z-40 transform transition-transform duration-500 ease-out md:hidden flex flex-col ${
            mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
          >
          {/* Close Button */}
          <div className="flex justify-between p-4 border-b border-border">
            <Link href="/" className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition">
              <div className="w-8 h-8 bg-linear-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                ⚓
              </div>
              <span className="font-black text-lg tracking-tight">Applyqik</span>
            </Link>

            <button onClick={() => setMobileMenuOpen(false)} className="p-2 hover:bg-gray-100 rounded-lg">
              <X size={24} />
            </button>
          </div>

          {/* Mobile Nav Items */}
          <div className="flex-1 p-6 space-y-2 overflow-y-auto">
            {/* Features accordion */}
            <div>
              <button
                type="button"
                onClick={() => setMobileFeaturesOpen((open) => !open)}
                aria-expanded={mobileFeaturesOpen}
                className="w-full flex items-center justify-between px-4 py-3 text-base font-medium text-foreground hover:bg-gray-50 rounded-lg transition"
              >
                Features
                <ChevronDown
                  size={18}
                  className={`transition-transform duration-200 ${mobileFeaturesOpen ? 'rotate-180' : ''}`}
                />
              </button>
              <AnimatePresence initial={false}>
                {mobileFeaturesOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className="pl-2 py-1 space-y-1">
                      {FEATURE_COLUMNS.flatMap((column) => column.items).map(({ label, icon: Icon }) => (
                        <Link
                          key={label}
                          href="#"
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-gray-50 hover:text-black rounded-lg transition"
                        >
                          <Icon size={16} className="text-gray-400" />
                          {label}
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link 
              href="#demo" 
              className="block px-4 py-3 text-base font-medium text-foreground hover:bg-gray-50 rounded-lg transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              Demo
            </Link>
            <Link 
              href="#testimonials" 
              className="block px-4 py-3 text-base font-medium text-foreground hover:bg-gray-50 rounded-lg transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              Testimonials
            </Link>
            <Link 
              href="#pricing" 
              className="block px-4 py-3 text-base font-medium text-foreground hover:bg-gray-50 rounded-lg transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              Pricing
            </Link>
          </div>

          {/* Mobile CTA */}
          <div className="p-6 border-t border-border">
            <Link href="/sign-in" className="w-full flex items-center justify-center gap-2 px-5 py-2 border border-border rounded-xl text-sm font-semibold hover:bg-black hover:text-white transition-all duration-300 mb-4">
              <UserRound size={18} />
              SignIn
            </Link>

            <Link href="/sign-up" className="w-full flex items-center justify-center gap-2 px-5 py-2 border border-border rounded-xl text-sm font-semibold hover:bg-black hover:text-white transition-all duration-300">
              <ArrowBigRightDash size={18} />
              SignUp for free
            </Link>
          </div>
        </div>
      </header>
  )
}

