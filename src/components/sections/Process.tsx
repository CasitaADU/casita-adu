'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { PhoneCall, Ruler, FileText, HardHat, CheckCircle2 } from 'lucide-react';

const steps = [
  { icon: PhoneCall, title: 'Free Consultation', desc: 'Schedule a free site walk. We assess your property and discuss your vision and goals.' },
  { icon: Ruler, title: 'Design & Planning', desc: 'Our team creates custom designs tailored to your property, lifestyle, and budget.' },
  { icon: FileText, title: 'Permitting', desc: 'We handle all permitting paperwork, city submissions, and approvals on your behalf.' },
  { icon: HardHat, title: 'Construction', desc: 'Our construction team builds your ADU with quality materials and constant oversight.' },
  { icon: CheckCircle2, title: 'Final Walkthrough', desc: 'We ensure everything meets your expectations before handing you the keys.' },
];

export default function Process() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="section-padding bg-brand-cream">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} className="text-center mb-16">
          <span className="text-brand-gold font-semibold text-sm uppercase tracking-widest">Our Process</span>
          <h2 className="font-display text-4xl md:text-5xl text-brand-dark-teal mt-4 mb-4">
            How It <span className="text-brand-gold italic">Works</span>
          </h2>
          <p className="text-brand-slate/60 text-lg max-w-2xl mx-auto">Five simple steps from dream to done.</p>
        </motion.div>

        <div className="relative">
          {/* Connecting line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-brand-dark-teal/10 via-brand-gold/30 to-brand-dark-teal/10 -translate-y-1/2" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.1 }}
                className="relative text-center group"
              >
                <div className="relative z-10 mx-auto w-20 h-20 rounded-2xl bg-white border-2 border-brand-dark-teal/10 flex items-center justify-center mb-5 group-hover:border-brand-gold group-hover:shadow-lg group-hover:shadow-brand-gold/10 transition-all duration-300">
                  <step.icon className="w-8 h-8 text-brand-mid-teal group-hover:text-brand-gold transition-colors" />
                  <div className="absolute -top-2 -right-2 w-7 h-7 rounded-lg bg-brand-gold text-brand-dark-teal text-xs font-bold flex items-center justify-center">
                    {i + 1}
                  </div>
                </div>
                <h3 className="font-display text-lg text-brand-dark-teal mb-2">{step.title}</h3>
                <p className="text-sm text-brand-slate/50 leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
