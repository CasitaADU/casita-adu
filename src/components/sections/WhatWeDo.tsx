'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

export default function WhatWeDo() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="section-padding bg-brand-cream">
      <div className="max-w-5xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <span className="text-brand-gold font-semibold text-sm uppercase tracking-widest">Complete ADU Services</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-brand-charcoal mt-4 mb-8 leading-tight">
            The Casita <span className="text-brand-gold italic">Way</span>
          </h2>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-brand-slate/70 text-lg md:text-xl leading-relaxed max-w-3xl mx-auto"
        >
          Every family deserves a home that grows with them — without the stress, surprises, or
          second-guessing. Our in-house team manages every detail, every phase, and every builder
          so you can focus on what matters most. That&apos;s The Casita Way.
        </motion.p>

        {/* Accent line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="w-24 h-1 bg-brand-gold mx-auto mt-10 rounded-full"
        />
      </div>
    </section>
  );
}
