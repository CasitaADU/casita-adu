'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, Phone } from 'lucide-react';

export default function CTABanner() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="py-20 px-6 bg-white">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={isInView ? { opacity: 1, scale: 1 } : {}}
        className="max-w-5xl mx-auto rounded-3xl bg-gradient-to-br from-brand-dark-teal via-brand-dark-teal to-brand-mid-teal p-12 md:p-16 text-center relative overflow-hidden"
      >
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '30px 30px' }} />
        <div className="relative z-10">
          <h2 className="font-display text-3xl md:text-5xl font-bold text-white mb-4">
            Ready to Build Your <span className="text-brand-gold italic">Dream ADU</span>?
          </h2>
          <p className="text-white/60 text-lg mb-10 max-w-2xl mx-auto">
            Schedule a free site walk and let our team show you what&apos;s possible for your property.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/contact" className="btn-primary !text-base !py-4 !px-10 flex items-center gap-2">
              Schedule Free Site Walk <ArrowRight className="w-4 h-4" />
            </Link>
            <a href="tel:6198912065" className="inline-flex items-center gap-3 px-8 py-4 rounded-lg border-2 border-white/20 text-white font-semibold hover:bg-white/10 transition-all">
              <Phone className="w-4 h-4" /> (619) 891-2065
            </a>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
