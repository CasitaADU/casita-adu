'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Phone, ChevronDown } from 'lucide-react';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'Portfolio', href: '/portfolio' },
  {
    label: 'Pre-Approved Plans',
    href: '/pre-approved-plans',
    children: [
      { label: 'Carlsbad Plans', href: '/pre-approved-plans?city=carlsbad' },
      { label: 'Vista Plans', href: '/pre-approved-plans?city=vista' },
    ],
  },
  { label: 'Blog', href: '/blog' },
  { label: 'Financing', href: '/financing' },
  { label: 'Contact', href: '/contact' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
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
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-brand-dark-teal rounded-xl flex items-center justify-center group-hover:bg-brand-mid-teal transition-colors duration-300">
            <span className="text-brand-gold font-display text-lg font-bold">C</span>
          </div>
          <div>
            <span className={`font-display text-xl tracking-tight ${scrolled ? 'text-brand-dark-teal' : 'text-white'}`}>
              CASITA
            </span>
            <span className={`font-display text-xl tracking-tight ${scrolled ? 'text-brand-gold' : 'text-brand-gold'}`}>
              {' '}ADU
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <div
              key={link.label}
              className="relative"
              onMouseEnter={() => link.children && setActiveDropdown(link.label)}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <Link
                href={link.href}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 flex items-center gap-1 ${
                  scrolled
                    ? 'text-brand-slate hover:text-brand-dark-teal hover:bg-brand-dark-teal/5'
                    : 'text-white/90 hover:text-white hover:bg-white/10'
                }`}
              >
                {link.label}
                {link.children && <ChevronDown className="w-3.5 h-3.5" />}
              </Link>
              {link.children && activeDropdown === link.label && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute top-full left-0 mt-1 bg-white rounded-xl shadow-xl border border-gray-100 py-2 min-w-[200px]"
                >
                  {link.children.map((child) => (
                    <Link
                      key={child.label}
                      href={child.href}
                      className="block px-4 py-2.5 text-sm text-brand-slate hover:bg-brand-cream hover:text-brand-dark-teal transition-colors"
                    >
                      {child.label}
                    </Link>
                  ))}
                </motion.div>
              )}
            </div>
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
