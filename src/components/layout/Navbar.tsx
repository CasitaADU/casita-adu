'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Phone } from 'lucide-react';

const navLinks = [
  { label: 'About', href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'Plans', href: '/pre-approved-plans' },
  { label: 'Blog', href: '/blog' },
  { label: 'Resources', href: '/resources' },
  { label: 'Financing', href: '/financing' },
  { label: 'Contact', href: '/contact' },
];

const mobileNavLinks = [
  { label: 'Home', href: '/' },
  ...navLinks.map(l => l.label === 'Plans' ? { label: 'Pre-Approved Plans', href: l.href } : l),
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
          ? 'bg-white/95 backdrop-blur-xl shadow-lg shadow-brand-dark-teal/5 py-2'
          : 'bg-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 lg:px-6 flex items-center justify-between">
        {/* Logo + Rotating Text */}
        <Link href="/" className="flex items-center gap-2 group shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/casita-logo.png"
            alt="Casita"
            className="h-9 md:h-10 w-auto object-contain transition-all duration-300"
          />
          <div className="flex items-baseline gap-1.5">
            <span className="font-display text-lg tracking-tight text-brand-charcoal">
              CASITA
            </span>
            <div className="relative h-5 overflow-hidden" style={{ minWidth: '11rem' }}>
              <AnimatePresence mode="wait">
                <motion.span
                  key={rotatingWords[wordIndex]}
                  initial={{ y: 18, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -18, opacity: 0 }}
                  transition={{ duration: 0.4, ease: 'easeInOut' }}
                  className="absolute left-0 font-display text-sm text-brand-gold whitespace-nowrap"
                >
                  {rotatingWords[wordIndex]}
                </motion.span>
              </AnimatePresence>
            </div>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="px-3 py-2 text-[13px] font-medium rounded-lg transition-colors text-brand-slate hover:text-brand-charcoal hover:bg-brand-charcoal/5"
            >
              {link.label}
            </Link>
          ))}
          <Link href="/contact" className="ml-2 btn-primary !py-2 !px-5 !text-xs">
            Free Site Walk
          </Link>
        </nav>

        {/* Mobile: Phone + Hamburger */}
        <div className="flex lg:hidden items-center gap-3">
          <a
            href="tel:6198912065"
            className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-brand-charcoal"
          >
            <Phone className="w-4 h-4" />
            (619) 891-2065
          </a>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-lg transition-colors text-brand-charcoal hover:bg-brand-charcoal/5"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Full-screen Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 top-0 z-40 bg-brand-dark-teal lg:hidden"
          >
            <div className="flex flex-col h-full">
              {/* Menu Header */}
              <div className="flex items-center justify-between px-6 py-4">
                <Link href="/" onClick={() => setIsOpen(false)} className="flex items-center gap-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/images/casita-logo.png" alt="Casita" className="h-10 w-auto object-contain brightness-0 invert" />
                  <span className="font-display text-xl text-white">CASITA</span>
                </Link>
                <button onClick={() => setIsOpen(false)} className="p-2 text-white/70 hover:text-white rounded-lg">
                  <X className="w-7 h-7" />
                </button>
              </div>

              {/* Nav Links */}
              <nav className="flex-1 flex flex-col justify-center px-10 md:px-20">
                {mobileNavLinks.map((link, i) => (
                  <motion.div
                    key={link.label}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 + i * 0.05 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className="block py-3 md:py-4 font-display text-2xl md:text-4xl text-white/80 hover:text-brand-gold transition-colors border-b border-white/5"
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>

              {/* Menu Footer */}
              <div className="px-10 md:px-20 pb-10">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <a href="tel:6198912065" className="flex items-center gap-2 text-white/60 hover:text-brand-gold transition-colors">
                    <Phone className="w-4 h-4" /> (619) 891-2065
                  </a>
                  <Link href="/contact" onClick={() => setIsOpen(false)} className="btn-primary bg-brand-gold text-brand-dark-teal hover:bg-brand-gold/90">
                    Schedule Free Site Walk
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
