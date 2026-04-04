'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Full-bleed hero photo */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/hero.jpg"
        alt="Completed 1200 sq ft two-story attached ADU by Casita in San Diego, CA"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Gradient overlay: opaque cream on the left behind text, fully transparent on the right */}
      <div className="absolute inset-0 bg-gradient-to-r from-brand-cream via-brand-cream/90 via-40% to-transparent to-65%" />

      {/* Mobile fallback overlay (so text stays readable on small screens where photo fills everything) */}
      <div className="absolute inset-0 bg-brand-cream/70 lg:hidden" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 lg:px-8 py-20 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-2 bg-brand-gold/10 text-brand-gold rounded-full text-sm font-medium mb-6">
              California&apos;s Premier Construction Management Agency
            </span>

            <h1 className="font-display text-5xl lg:text-6xl xl:text-7xl font-bold text-brand-charcoal leading-tight mb-6">
              Your Stress-Free
              <span className="block text-brand-gold">ADU Journey</span>
              Starts Here
            </h1>

            <p className="text-xl text-brand-slate/70 mb-8 max-w-lg">
              From permits to keys, we handle every detail. Transform your backyard into a beautiful, income-generating space.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 bg-brand-gold hover:bg-brand-gold-light text-white font-semibold h-14 px-8 text-lg rounded-lg transition-colors"
              >
                Request a Site Walk <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/pre-approved-plans"
                className="inline-flex items-center justify-center h-14 px-8 text-lg font-semibold border-2 border-brand-charcoal/20 text-brand-charcoal rounded-lg hover:bg-brand-charcoal/5 transition-colors"
              >
                View Pre-Approved Plans
              </Link>
            </div>
          </motion.div>

          {/* Right column: spacer so text stays left-aligned on lg+ */}
          <div className="hidden lg:block" />
        </div>
      </div>
    </section>
  );
}
