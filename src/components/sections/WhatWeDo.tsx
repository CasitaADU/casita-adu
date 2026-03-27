'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

export default function WhatWeDo() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="section-padding bg-brand-cream">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            <span className="text-brand-gold font-semibold text-sm uppercase tracking-widest">What We Do</span>
            <h2 className="font-display text-4xl md:text-5xl text-brand-dark-teal mt-4 mb-6 leading-tight">
              Your Complete <span className="text-brand-gold italic">Casita Concierge</span>
            </h2>
            <p className="text-brand-slate/70 text-lg leading-relaxed mb-6">
              At Casita ADU, we make your entire ADU journey simple, stress-free, and seamless.
              From permitting and design to construction and final walkthroughs, our team handles
              every detail so you don&apos;t have to.
            </p>
            <p className="text-brand-slate/70 text-lg leading-relaxed">
              Think of us as your Casita Concierge — here to guide you, advocate for you, and
              keep everything transparent from start to finish.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative"
          >
            <div className="aspect-[4/3] rounded-3xl bg-gradient-to-br from-brand-mid-teal/20 to-brand-dark-teal/10 border border-brand-mid-teal/20 overflow-hidden flex items-center justify-center">
              <div className="text-center text-brand-slate/30">
                <p className="text-sm">Consultation Image</p>
                <p className="text-xs mt-1">Replace with team photo</p>
              </div>
            </div>
            {/* Accent decoration */}
            <div className="absolute -bottom-4 -right-4 w-32 h-32 rounded-2xl border-2 border-brand-gold/20 -z-10" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
