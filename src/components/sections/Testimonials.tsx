'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  { name: 'Maria & Carlos R.', location: 'Encinitas, CA', text: 'Casita made what seemed like an overwhelming process feel completely manageable. From the first site walk to the final walkthrough, they were transparent, responsive, and truly cared about our vision.', rating: 5 },
  { name: 'David T.', location: 'Carlsbad, CA', text: 'I was nervous about permits and timelines, but the Casita team handled everything. My ADU was completed on schedule and the quality exceeded my expectations. Highly recommend!', rating: 5 },
  { name: 'Sarah & Mike L.', location: 'San Diego, CA', text: 'We wanted a guest house for my parents and Casita delivered exactly what we envisioned. Their design team was creative, and the construction management was seamless.', rating: 5 },
];

export default function Testimonials() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="section-padding bg-brand-dark-teal relative overflow-hidden">
      <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} className="text-center mb-16">
          <span className="text-brand-gold font-semibold text-sm uppercase tracking-widest">Testimonials</span>
          <h2 className="font-display text-4xl md:text-5xl text-white mt-4">What Our <span className="text-brand-gold italic">Clients</span> Say</h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <motion.div key={t.name} initial={{ opacity: 0, y: 40 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: i * 0.15 }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 relative">
              <Quote className="w-10 h-10 text-brand-gold/20 absolute top-6 right-6" />
              <div className="flex gap-1 mb-4">{[...Array(t.rating)].map((_, j) => <Star key={j} className="w-4 h-4 fill-brand-gold text-brand-gold" />)}</div>
              <p className="text-white/70 leading-relaxed mb-6">{t.text}</p>
              <div>
                <p className="text-white font-semibold">{t.name}</p>
                <p className="text-white/40 text-sm">{t.location}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
