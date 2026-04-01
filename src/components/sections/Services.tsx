'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { FileCheck, Compass, HardHat, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const services = [
  {
    icon: FileCheck,
    title: 'Full Permitting Packages',
    description: 'We handle every step of the permitting process, ensuring your project complies with local building codes and zoning regulations. From initial submittals to final approvals.',
    color: 'from-brand-gold/5 to-brand-gold/10',
    iconBg: 'bg-brand-charcoal/5 text-brand-charcoal',
  },
  {
    icon: Compass,
    title: 'Design & Structural Plans',
    description: 'Our team creates functional, beautiful designs tailored to your property and lifestyle. We maximize space, enhance aesthetics, and meet budget goals.',
    color: 'from-brand-gold/5 to-brand-gold/10',
    iconBg: 'bg-brand-gold/10 text-brand-gold',
  },
  {
    icon: HardHat,
    title: 'Construction Management',
    description: 'We oversee your build from start to finish, coordinating contractors, schedules, and quality control. On time, on budget, built to the highest standard.',
    color: 'from-brand-gold/5 to-brand-gold/10',
    iconBg: 'bg-brand-charcoal/5 text-brand-charcoal',
  },
];

export default function Services() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="section-padding bg-white" id="services">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <span className="text-brand-gold font-semibold text-sm uppercase tracking-widest">Our Services</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-brand-charcoal mt-4 mb-4">
            Everything Under <span className="text-brand-gold italic">One Roof</span>
          </h2>
          <p className="text-brand-slate/60 text-lg max-w-2xl mx-auto">
            No need to juggle multiple contractors. We manage the entire process so you can enjoy the journey.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.15 }}
              className="card group p-8 relative overflow-hidden"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              <div className="relative z-10">
                <div className={`w-14 h-14 rounded-2xl ${service.iconBg} flex items-center justify-center mb-6`}>
                  <service.icon className="w-6 h-6" />
                </div>
                <h3 className="font-display text-2xl font-bold text-brand-charcoal mb-4">{service.title}</h3>
                <p className="text-brand-slate/60 leading-relaxed mb-6">{service.description}</p>
                <Link href="/services" className="inline-flex items-center gap-2 text-sm font-semibold text-brand-gold group-hover:text-brand-charcoal transition-colors">
                  Learn More <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
