'use client';

import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CTABanner from '@/components/sections/CTABanner';
import { motion } from 'framer-motion';
import { Phone, Ruler, FileText, HardHat, CheckCircle2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const steps = [
  {
    number: '01',
    icon: Phone,
    title: 'Initial Consultation',
    duration: 'Week 1',
    description: 'We start with a phone call to understand your goals, then schedule a free site walk to assess your property.',
    details: ['Free phone consultation', 'Property assessment', 'Feasibility analysis', 'Budget discussion', 'Timeline overview'],
  },
  {
    number: '02',
    icon: Ruler,
    title: 'Design & Planning',
    duration: 'Weeks 2-4',
    description: 'Our design team creates your custom ADU plans while we begin preparing permit documentation.',
    details: ['Architectural design', 'Floor plan development', 'Material selection', '3D renderings', 'Engineering drawings'],
  },
  {
    number: '03',
    icon: FileText,
    title: 'Permitting',
    duration: 'Weeks 5-12',
    description: 'We handle all permit applications and city communications, keeping you informed at every step.',
    details: ['Permit application submission', 'Plan check responses', 'City communications', 'Required revisions', 'Final permit approval'],
  },
  {
    number: '04',
    icon: HardHat,
    title: 'Construction',
    duration: 'Weeks 13-24',
    description: 'Our expert crews build your ADU with regular progress updates and transparent communication.',
    details: ['Site preparation', 'Foundation & framing', 'Electrical & plumbing', 'Drywall & finishes', 'Final inspections'],
  },
  {
    number: '05',
    icon: CheckCircle2,
    title: 'Completion & Handover',
    duration: 'Week 25',
    description: 'Final walkthrough, all documentation, and keys to your beautiful new ADU.',
    details: ['Final city inspection', 'Punch list completion', 'Client walkthrough', 'Documentation handover', 'Warranty information'],
  },
];

export default function ProcessPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="pt-32 pb-20 px-6 bg-brand-beige">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl"
            >
              <span className="text-brand-gold font-medium mb-4 block">How It Works</span>
              <h1 className="font-display text-5xl lg:text-6xl font-bold text-brand-charcoal mb-6">
                Your Stress-Free ADU Journey
              </h1>
              <p className="text-xl text-brand-slate/60">
                We&apos;ve refined our process over 500+ projects to ensure a smooth, predictable experience from first call to final walkthrough.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Timeline Steps */}
        <section className="py-24 px-6">
          <div className="max-w-4xl mx-auto">
            {steps.map((step, i) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="relative"
              >
                {/* Connecting line */}
                {i < steps.length - 1 && (
                  <div className="absolute left-7 top-20 w-0.5 h-full bg-gray-200" />
                )}

                <div className="flex gap-8 pb-16">
                  {/* Icon circle */}
                  <div className="relative z-10 flex-shrink-0">
                    <div className="w-14 h-14 rounded-full bg-brand-gold flex items-center justify-center">
                      <step.icon className="w-6 h-6 text-white" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-3">
                      <span className="text-4xl font-display font-bold text-brand-gold/20">{step.number}</span>
                      <span className="px-3 py-1 bg-brand-gold/10 text-brand-gold rounded-full text-sm font-medium">
                        {step.duration}
                      </span>
                    </div>
                    <h3 className="text-2xl font-semibold text-brand-charcoal mb-3">{step.title}</h3>
                    <p className="text-lg text-brand-slate/60 mb-6">{step.description}</p>

                    {/* Details card */}
                    <div className="bg-brand-beige border-none rounded-2xl p-6">
                      <h4 className="font-medium mb-4 text-brand-charcoal">What happens in this phase:</h4>
                      <div className="grid sm:grid-cols-2 gap-3">
                        {step.details.map((detail) => (
                          <div key={detail} className="flex items-center gap-3">
                            <CheckCircle2 className="w-4 h-4 text-brand-gold flex-shrink-0" />
                            <span className="text-brand-slate/60 text-sm">{detail}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Timeline Summary */}
        <section className="py-16 px-6 bg-brand-beige">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="font-display text-3xl font-bold text-brand-charcoal mb-4">Typical Project Timeline</h2>
              <p className="text-brand-slate/60 max-w-2xl mx-auto">
                Most ADU projects complete in 6-8 months from initial consultation to move-in ready. Timelines vary based on city, complexity, and selections.
              </p>
            </motion.div>

            <div className="flex flex-wrap justify-center gap-4">
              <div className="px-6 py-4 bg-white rounded-xl shadow-sm text-center">
                <p className="text-3xl font-bold text-brand-gold">1-4</p>
                <p className="text-sm text-brand-slate/60">weeks design</p>
              </div>
              <div className="px-6 py-4 bg-white rounded-xl shadow-sm text-center">
                <p className="text-3xl font-bold text-brand-gold">6-10</p>
                <p className="text-sm text-brand-slate/60">weeks permitting</p>
              </div>
              <div className="px-6 py-4 bg-white rounded-xl shadow-sm text-center">
                <p className="text-3xl font-bold text-brand-gold">12-16</p>
                <p className="text-sm text-brand-slate/60">weeks construction</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 px-6 bg-brand-charcoal">
          <div className="max-w-7xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <h2 className="font-display text-4xl font-bold text-white mb-4">Ready to Start Your Journey?</h2>
              <p className="text-xl text-white/60 mb-8 max-w-2xl mx-auto">
                Schedule your free site walk today and take the first step toward your new ADU.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-brand-gold hover:bg-brand-gold-light text-white font-semibold h-12 px-8 rounded-lg transition-colors"
              >
                Request a Site Walk <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
