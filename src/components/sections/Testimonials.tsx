'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Jamie Gilman',
    text: 'Casita was amazing, thank you Winston! Constant communication and coordination with the General Contractor, the engineer, county planners and so much more. Winston stepped in to push my plans through. Thank you Winston, Sondra (you rock!) and your Team. I highly recommend Casita, super satisfied, happy client.',
    rating: 5,
    source: 'Google Review',
  },
  {
    name: 'Jennifer Oliveros',
    text: 'Thank you so much to Casita! They rescued our ADU project. They were prompt, professional and have great follow through. Would highly recommend them.',
    rating: 5,
    source: 'Google Review',
  },
  {
    name: 'Melanie M.',
    text: 'Sondra is very personable, knowledgeable, and helpful. She has a good rapport with not only her clients, but other agents and sellers. Thank you for finding the right place at the right price.',
    rating: 5,
    source: 'Google Review',
  },
  {
    name: 'Mei Duong',
    text: 'I started working on a plan to build four 2-bed, 2-bath units in San Diego. The project was passed to Winston Bodkin, who was helpful, responsive, and thorough throughout the entire process. Highly recommend their team.',
    rating: 5,
    source: 'Google Review',
  },
];

export default function Testimonials() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="section-padding bg-white" id="testimonials">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <span className="text-brand-gold font-semibold text-sm uppercase tracking-widest">Testimonials</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-brand-charcoal mt-4 mb-4">
            What Our <span className="text-brand-gold italic">Clients Say</span>
          </h2>
          <div className="flex items-center justify-center gap-2 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-brand-gold text-brand-gold" />
            ))}
          </div>
          <p className="text-brand-slate/50 text-sm">5.0 stars on Google · 18 reviews</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1 }}
              className="card p-8 relative"
            >
              <Quote className="w-10 h-10 text-brand-gold/20 absolute top-6 right-6" />
              <div className="flex gap-1 mb-4">
                {[...Array(t.rating)].map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-brand-gold text-brand-gold" />
                ))}
              </div>
              <p className="text-brand-slate/70 leading-relaxed mb-6 italic">
                &ldquo;{t.text}&rdquo;
              </p>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-brand-charcoal">{t.name}</div>
                  <div className="text-xs text-brand-slate/40">{t.source}</div>
                </div>
                {/* Google icon */}
                <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center">
                  <span className="text-xs font-bold text-brand-slate/30">G</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Google reviews link */}
        <div className="text-center mt-10">
          <a
            href="https://reviews.birdeye.com/casita-adu-171754398335143"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-brand-gold hover:text-brand-charcoal font-semibold transition-colors"
          >
            View All 18 Reviews →
          </a>
        </div>
      </div>
    </section>
  );
}
