'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Phone } from 'lucide-react';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'Pre-Approved Plans', href: '/pre-approved-plans' },
  { label: 'Blog', href: '/blog' },
  { label: 'Financing', href: '/financing' },
  { label: 'Contact', href: '/contact' },
];

const rotatingWords = ['ADU', 'Home', 'Construction Management'];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % rotatingWords.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-xl shadow-lg shadow-brand-dark-teal/5 py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/casita-logo.png"
            alt="Casita"
            className={`h-12 w-auto object-contain transition-all duration-300 ${scrolled ? '' : 'brightness-0 invert'}`}
          />
          <div className="flex items-baseline gap-2 overflow-hidden">
            <span className={`font-display text-xl tracking-tight transition-colors duration-300 ${scrolled ? 'text-brand-dark-teal' : 'text-white'}`}>
              CASITA
            </span>
            <div className="relative h-6 overflow-hidden" style={{ minWidth: '10rem' }}>
              <AnimatePresence mode="wait">
                <motion.span
                  key={rotatingWords[wordIndex]}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  transition={{ duration: 0.4, ease: 'easeInOut' }}
                  className="absolute left-0 font-display text-lg text-brand-gold whitespace-nowrap"
                >
                  {rotatingWords[wordIndex]}
                </motion.span>
              </AnimatePresence>
            </div>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                scrolled
                  ? 'text-brand-slate hover:text-brand-dark-teal hover:bg-brand-dark-teal/5'
                  : 'text-white/90 hover:text-white hover:bg-white/10'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* CTA + Phone */}
        <div className="hidden lg:flex items-center gap-4">
          <a
            href="tel:6198912065"
            className={`flex items-center gap-2 text-sm font-medium ${
              scrolled ? 'text-brand-dark-teal' : 'text-white'
            }`}
          >
            <Phone className="w-4 h-4" />
            (619) 891-2065
          </a>
          <Link href="/contact" className="btn-primary !py-2.5 !px-6 !text-xs">
            Free Site Walk
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`lg:hidden p-2 rounded-lg ${scrolled ? 'text-brand-dark-teal' : 'text-white'}`}
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-t border-gray-100 overflow-hidden"
          >
            <div className="px-6 py-4 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-3 text-sm font-medium text-brand-slate hover:bg-brand-cream rounded-lg"
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-4 border-t border-gray-100">
                <a href="tel:6198912065" className="flex items-center gap-2 px-4 py-3 text-sm font-semibold text-brand-dark-teal">
                  <Phone className="w-4 h-4" /> (619) 891-2065
                </a>
                <Link href="/contact" className="btn-primary w-full mt-2 text-center">
                  Schedule Free Site Walk
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
