"use client";

import { ArrowBigRight, ArrowBigRightDash, Menu, UserRound, X } from 'lucide-react'
import React from 'react'
import { useState } from 'react';

import { FaTwitter } from 'react-icons/fa'
import { LuArrowBigRight } from 'react-icons/lu';

function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
              ⚓
            </div>
            <span className="font-black text-lg tracking-tight">Applyqik</span>
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
              <LuArrowBigRight size={16} />
                SignUp for free
            </button>

            <button className="hidden md:flex items-center gap-2 px-5 py-2 border border-black rounded-xl text-sm font-semibold hover:bg-black hover:text-white transition-all duration-300">
              <UserRound size={16} />
             SignIn
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
            <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-black text-white rounded-xl font-semibold hover:bg-gray-900 transition mb-4">
              <UserRound size={18} />
              SignIn
            </button>

            <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-black text-white rounded-xl font-semibold hover:bg-gray-900 transition">
              <ArrowBigRightDash size={18} />
              SignUp for free
            </button>

          </div>
        </div>
      </header>
  )
}

export default Header
