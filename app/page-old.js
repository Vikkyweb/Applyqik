'use client';

import { useState } from 'react';
import { 
  FaTwitter, 
  FaFacebook, 
  FaInstagram, 
  FaLinkedin, 
  FaYoutube, 
  FaTiktok 
} from 'react-icons/fa';
import { Menu, X, Zap, MessageCircle, Music2, CheckCircle2, Send } from 'lucide-react';

export default function FerrymanLanding() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Platform data with proper icons and colors
  const platforms = [
    { id: 'twitter', Icon: FaTwitter, color: 'text-black', bg: 'bg-white', border: 'border-gray-200' },
    { id: 'bluesky', Icon: Zap, color: 'text-blue-500', bg: 'bg-white', border: 'border-blue-100' },
    { id: 'threads', Icon: MessageCircle, color: 'text-black', bg: 'bg-white', border: 'border-gray-200' },
    { id: 'mastodon', Icon: Send, color: 'text-purple-600', bg: 'bg-white', border: 'border-purple-100' },
    { id: 'linkedin', Icon: FaLinkedin, color: 'text-blue-700', bg: 'bg-white', border: 'border-blue-100' },
    { id: 'instagram', Icon: FaInstagram, color: 'text-pink-600', bg: 'bg-white', border: 'border-pink-100' },
    { id: 'facebook', Icon: FaFacebook, color: 'text-blue-600', bg: 'bg-white', border: 'border-blue-100' },
    { id: 'youtube', Icon: FaYoutube, color: 'text-red-600', bg: 'bg-white', border: 'border-red-100' },
    { id: 'tiktok', Icon: Music2, color: 'text-black', bg: 'bg-white', border: 'border-gray-200' },
  ];

  const outputPlatforms = [
    { Icon: FaYoutube, color: 'text-red-600', bg: 'bg-red-50', label: 'YouTube' },
    { Icon: Music2, color: 'text-black', bg: 'bg-gray-50', label: 'TikTok' },
    { Icon: Zap, color: 'text-blue-500', bg: 'bg-blue-50', label: 'Bluesky' },
    { Icon: Send, color: 'text-purple-600', bg: 'bg-purple-50', label: 'Mastodon' },
    { Icon: FaFacebook, color: 'text-blue-600', bg: 'bg-blue-50', label: 'FaFacebook' },
    { Icon: FaLinkedin, color: 'text-blue-700', bg: 'bg-blue-50', label: 'LinkedIn' },
    { Icon: FaTwitter, color: 'text-black', bg: 'bg-gray-50', label: 'X' },
    { Icon: FaInstagram, color: 'text-pink-600', bg: 'bg-pink-50', label: 'FaInstagram' },
  ];

  const inputPlatforms = [
    { Icon: Send, color: 'text-purple-600', bg: 'bg-purple-100' },
    { Icon: MessageCircle, color: 'text-black', bg: 'bg-gray-100' },
    { Icon: Zap, color: 'text-blue-500', bg: 'bg-blue-100' },
  ];

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
              ⚓
            </div>
            <span className="font-black text-lg tracking-tight">Ferryman</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-12">
            <a href="#demo" className="text-sm font-medium text-gray-600 hover:text-black transition relative group">
              Demo
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-black group-hover:w-full transition-all duration-300"></span>
            </a>
            <a href="#testimonials" className="text-sm font-medium text-gray-600 hover:text-black transition relative group">
              Testimonials
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-black group-hover:w-full transition-all duration-300"></span>
            </a>
            <a href="#pricing" className="text-sm font-medium text-gray-600 hover:text-black transition relative group">
              Pricing
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-black group-hover:w-full transition-all duration-300"></span>
            </a>
          </div>

          {/* CTA and Mobile Menu */}
          <div className="flex items-center gap-4">
            <button className="hidden md:flex items-center gap-2 px-5 py-2 border border-black rounded-xl text-sm font-semibold hover:bg-black hover:text-white transition-all duration-300">
              <FaTwitter size={16} />
              Start free trial
            </button>
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
          className={`fixed top-0 right-0 w-64 h-screen bg-white shadow-xl z-40 transform transition-transform duration-500 ease-out md:hidden flex flex-col ${
            mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {/* Close Button */}
          <div className="flex justify-end p-4 border-b border-gray-100">
            <button onClick={() => setMobileMenuOpen(false)} className="p-2 hover:bg-gray-100 rounded-lg">
              <X size={24} />
            </button>
          </div>

          {/* Mobile Nav Items */}
          <div className="flex-1 p-6 space-y-2">
            <a 
              href="#demo" 
              className="block px-4 py-3 text-base font-medium text-gray-900 hover:bg-gray-50 rounded-lg transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              Demo
            </a>
            <a 
              href="#testimonials" 
              className="block px-4 py-3 text-base font-medium text-gray-900 hover:bg-gray-50 rounded-lg transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              Testimonials
            </a>
            <a 
              href="#pricing" 
              className="block px-4 py-3 text-base font-medium text-gray-900 hover:bg-gray-50 rounded-lg transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              Pricing
            </a>
          </div>

          {/* Mobile CTA */}
          <div className="p-6 border-t border-gray-100">
            <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-black text-white rounded-xl font-semibold hover:bg-gray-900 transition">
              <FaTwitter size={18} />
              Start free trial
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        {/* Social Icons Row */}
        <div className="flex justify-center gap-3 mb-12 flex-wrap">
          {platforms.map(({ id, Icon, color }) => (
            <div key={id} className={`${color} transition-transform hover:scale-110`}>
              <Icon size={24} />
            </div>
          ))}
        </div>

        {/* Headline */}
        <div className="text-center mb-8">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-tight mb-4 tracking-tight">
            Ferry your content to
          </h1>
          <div className="flex items-center justify-center gap-3 mb-2">
            <FaInstagram className="text-pink-600" size={48} />
            <h2 className="text-5xl sm:text-6xl lg:text-7xl font-black italic text-pink-600">FaInstagram</h2>
          </div>
        </div>

        {/* Subheading */}
        <div className="text-center mb-8 max-w-2xl mx-auto">
          <p className="text-lg sm:text-xl text-gray-700 mb-6">
            Post everywhere by only creating on your favorite platform
          </p>
          
          {/* Badge */}
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-green-50 to-emerald-50 px-4 py-2 rounded-full text-xs font-semibold text-gray-700 border border-green-200 mb-8">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></span>
              NEW
            </span>
            <span className="text-gray-600">Post from OpenCode, Claude, Codex, Cursor</span>
            <span className="text-green-600">→</span>
          </div>
        </div>

        {/* Social Proof */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-6 mb-4">
            <div className="flex -space-x-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 border-2 border-white flex items-center justify-center text-xs text-white font-bold hover:scale-110 transition transform"
                >
                  {i + 1}
                </div>
              ))}
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-black">2,344,620+</p>
              <p className="text-xs sm:text-sm text-gray-600">additional followers reached</p>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <div className="flex justify-center mb-20">
          <button className="bg-black text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-900 transition transform hover:scale-105 flex items-center gap-2 shadow-lg">
            <FaTwitter size={20} />
            Start your 7-day free trial
          </button>
        </div>

        {/* Distribution Diagram - Modern Flow */}
        <div className="mb-24">
          <div className="grid grid-cols-3 gap-8 items-center min-h-96">
            {/* Input Platforms (Left) */}
            <div className="flex flex-col gap-6 justify-center items-end">
              {inputPlatforms.map(({ Icon, color, bg }, i) => (
                <div key={i} className={`relative group`}>
                  <div className={`w-20 h-20 ${bg} rounded-full flex items-center justify-center border-2 border-gray-200 shadow-md group-hover:shadow-lg transition`}>
                    <Icon className={`${color}`} size={40} />
                  </div>
                  {i === 1 && (
                    <CheckCircle2 className="absolute -top-2 -right-2 w-6 h-6 text-green-500 bg-white rounded-full border-2 border-white" />
                  )}
                </div>
              ))}
            </div>

            {/* Center Diagram with SVG */}
            <div className="relative h-96 flex items-center justify-center hidden sm:flex">
              <svg className="w-full h-full" viewBox="0 0 200 400" style={{ overflow: 'visible' }}>
                <defs>
                  <marker
                    id="arrowhead"
                    markerWidth="10"
                    markerHeight="10"
                    refX="9"
                    refY="3"
                    orient="auto"
                  >
                    <polygon points="0 0, 10 3, 0 6" fill="#d1d5db" />
                  </marker>
                </defs>
                
                {/* Main source point */}
                <circle cx="100" cy="120" r="8" fill="#0ea5e9" />
                
                {/* Output lines - curved dashed */}
                {[0, 60, 120, 180, 240, 300, 360].map((offset, i) => (
                  <path
                    key={i}
                    d={`M 100 120 Q 150 ${120 + offset / 3} 200 ${offset / 1.2}`}
                    stroke="#d1d5db"
                    strokeWidth="2"
                    fill="none"
                    strokeDasharray="8,4"
                    markerEnd="url(#arrowhead)"
                  />
                ))}
              </svg>
            </div>

            {/* Output Platforms (Right) */}
            <div className="flex flex-col gap-4 justify-center items-start">
              {outputPlatforms.map(({ Icon, color, bg, label }, i) => (
                <div key={i} className="flex items-center gap-3 group">
                  <div className={`w-16 h-16 ${bg} rounded-full flex items-center justify-center border-2 border-gray-200 shadow-md group-hover:shadow-lg transition transform group-hover:scale-110`}>
                    <Icon className={`${color}`} size={32} />
                  </div>
                  <CheckCircle2 className="w-6 h-6 text-green-500 -ml-3 bg-white rounded-full border-2 border-white flex-shrink-0" />
                </div>
              ))}
            </div>
          </div>
        </div>


        {/* Supported Platforms */}
        <div className="text-center mb-20 border-t border-gray-200 pt-16">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-8 letter-spacing">Supported platforms</p>
          <div className="flex justify-center gap-3 sm:gap-5 flex-wrap">
            {platforms.map(({ id, Icon, color, bg, border }) => (
              <div 
                key={id} 
                className={`w-14 h-14 ${bg} ${border} border-2 rounded-full flex items-center justify-center transition transform hover:scale-110 hover:shadow-md`}
              >
                <Icon className={`${color}`} size={24} />
              </div>
            ))}
          </div>
        </div>

        {/* Trust Section */}
        <div className="text-center border-t border-gray-200 pt-16">
          <div className="flex justify-center gap-2 mb-8 flex-wrap">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-300 via-pink-400 to-red-400 border-3 border-white flex items-center justify-center text-xs font-bold text-white hover:scale-110 transition transform shadow-md"
              >
                C{i + 1}
              </div>
            ))}
          </div>
          <p className="text-gray-600 text-sm font-semibold">
            Trusted by top creators to ferry their content everywhere
          </p>
        </div>
      </main>
    </div>
  );
}