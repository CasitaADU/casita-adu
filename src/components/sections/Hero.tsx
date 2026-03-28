'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Play, Shield, Clock, Award } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-brand-cream">
      {/* Subtle decorative elements */}
      <motion.div
        animate={{ y: [-10, 10, -10], rotate: [0, 5, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full bg-brand-gold/5 blur-3xl"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-20 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left content */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-gold/10 border border-brand-gold/20 mb-8"
            >
              <div className="w-2 h-2 rounded-full bg-brand-gold animate-pulse" />
              <span className="text-brand-gold text-sm font-medium">California&apos;s Premier Construction Management Agency</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="font-display text-5xl md:text-6xl lg:text-7xl text-brand-charcoal leading-[1.1] mb-6"
            >
              Full Service{' '}
              <span className="text-brand-gold italic">Construction Management</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-brand-slate/70 text-lg md:text-xl leading-relaxed mb-10 max-w-xl"
            >
              From permitting and design to construction and final walkthroughs —
              we handle every detail so you don&apos;t have to. Your Casita Concierge
              from start to finish.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap gap-4 mb-16"
            >
              <Link href="/contact" className="btn-primary flex items-center gap-2 !text-base !py-4 !px-10">
                Schedule Free Site Walk <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/portfolio" className="inline-flex items-center gap-3 px-6 py-4 text-brand-charcoal/70 hover:text-brand-charcoal transition-colors group">
                <div className="w-12 h-12 rounded-full border-2 border-brand-charcoal/20 flex items-center justify-center group-hover:border-brand-gold group-hover:bg-brand-gold/10 transition-all">
                  <Play className="w-4 h-4 ml-0.5" />
                </div>
                View Our Work
              </Link>
            </motion.div>

            {/* Trust indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="flex flex-wrap gap-8"
            >
              {[
                { icon: Shield, label: 'Licensed & Insured' },
                { icon: Clock, label: 'On-Time Delivery' },
                { icon: Award, label: 'Top Rated' },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2.5">
                  <Icon className="w-5 h-5 text-brand-gold" />
                  <span className="text-brand-slate/50 text-sm">{label}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="hidden lg:block relative"
          >
            <div className="relative">
              {/* Main image — completed 750 sqft ADU */}
              <div className="aspect-[4/5] rounded-3xl border border-brand-charcoal/10 overflow-hidden shadow-2xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://jahmbtbandibcvfqgnlf.supabase.co/storage/v1/object/public/images/portfolio/749%20SQFT%20DETACHED%20ADU%20COMPLETED%20AERIAL.jpg"
                  alt="Completed 749 sq ft detached ADU by Casita — aerial view"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Floating stat card */}
              <motion.div
                animate={{ y: [-5, 5, -5] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -left-8 top-1/3 bg-white rounded-2xl p-5 shadow-2xl border border-brand-charcoal/5"
              >
                <div className="text-brand-gold font-display text-3xl">50+</div>
                <div className="text-brand-slate/50 text-sm">Projects Completed</div>
              </motion.div>

              {/* Floating rating card */}
              <motion.div
                animate={{ y: [5, -5, 5] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -right-4 bottom-1/4 bg-white rounded-2xl p-5 shadow-2xl border border-brand-charcoal/5"
              >
                <div className="flex gap-1 mb-1">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-brand-gold text-lg">★</span>
                  ))}
                </div>
                <div className="text-brand-slate/50 text-sm">5-Star Rated</div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
