'use client';

import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { motion } from 'framer-motion';
import { Compass, Warehouse, FileText, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const services = [
  {
    id: 'design-build',
    icon: Compass,
    title: 'ADU Design, Bid & Build',
    subtitle: 'Full Service Construction Management',
    description:
      'From initial concept to final walkthrough, we handle every aspect of your ADU project. Our integrated design-build approach ensures seamless communication, faster timelines, and a cohesive final product.',
    features: [
      'Custom architectural design',
      'Full construction management',
      'Interior design consultation',
      'Landscaping integration',
      'Utility connections',
      'Final inspections & permits',
    ],
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80',
  },
  {
    id: 'garage',
    icon: Warehouse,
    title: 'Garage Conversions',
    subtitle: 'Transform Unused Space',
    description:
      'Convert your existing garage into a fully functional living space. Garage conversions are often faster and more affordable than new construction, making them an excellent option for many homeowners.',
    features: [
      'Structural assessment',
      'Foundation upgrades',
      'Full insulation',
      'New electrical & plumbing',
      'HVAC installation',
      'Exterior updates',
    ],
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80',
  },
  {
    id: 'permitting',
    icon: FileText,
    title: 'Permitting & Planning',
    subtitle: 'Navigate Red Tape with Ease',
    description:
      "California's ADU regulations can be complex. Our permitting experts handle all documentation, submissions, and follow-ups, ensuring a smooth approval process for your project.",
    features: [
      'Feasibility analysis',
      'Zoning verification',
      'Plan preparation',
      'Permit applications',
      'City liaison services',
      'Inspection coordination',
    ],
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&q=80',
  },
  {
    id: 'custom',
    icon: Sparkles,
    title: 'Custom Backyard Solutions',
    subtitle: 'Beyond the Standard ADU',
    description:
      "Looking for something unique? We specialize in custom solutions that maximize your property's potential, from multi-unit developments to luxury guest houses with premium finishes.",
    features: [
      'Custom floor plans',
      'Premium finishes',
      'Smart home integration',
      'Outdoor living spaces',
      'Pool houses & cabanas',
      'Multi-unit developments',
    ],
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&q=80',
  },
];

export default function ServicesPage() {
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
              <span className="text-brand-gold font-medium mb-4 block">What We Do</span>
              <h1 className="font-display text-5xl lg:text-6xl font-bold text-brand-charcoal mb-6">
                The Casita Way
              </h1>
              <p className="text-xl text-brand-slate/60">
                Every family deserves a home that grows with them — without the stress, surprises, or second-guessing. Our in-house team manages every detail, every phase, and every builder so you can focus on what matters most. That&apos;s The Casita Way.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Service Sections */}
        <section className="py-24 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="space-y-24">
              {services.map((service, i) => (
                <motion.div
                  key={service.id}
                  id={service.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="grid lg:grid-cols-2 gap-12 items-center"
                >
                  {/* Text side */}
                  <div className={i % 2 === 1 ? 'lg:order-2' : ''}>
                    <div className="w-14 h-14 rounded-xl bg-brand-gold/10 flex items-center justify-center mb-6">
                      <service.icon className="w-7 h-7 text-brand-gold" />
                    </div>
                    <h2 className="font-display text-3xl lg:text-4xl font-bold text-brand-charcoal mb-2">
                      {service.title}
                    </h2>
                    <p className="text-brand-gold font-medium mb-4">{service.subtitle}</p>
                    <p className="text-lg text-brand-slate/60 mb-8">{service.description}</p>

                    <div className="grid sm:grid-cols-2 gap-3 mb-8">
                      {service.features.map((feature) => (
                        <div key={feature} className="flex items-center gap-3">
                          <CheckCircle2 className="w-5 h-5 text-brand-gold flex-shrink-0" />
                          <span className="text-brand-slate/60">{feature}</span>
                        </div>
                      ))}
                    </div>

                    <Link
                      href="/contact"
                      className="inline-flex items-center gap-2 bg-brand-gold hover:bg-brand-gold-light text-white font-semibold px-6 py-3 rounded-lg transition-colors"
                    >
                      Get Started <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>

                  {/* Image side */}
                  <div className={i % 2 === 1 ? 'lg:order-1' : ''}>
                    <div className="relative rounded-2xl overflow-hidden shadow-xl">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={service.image}
                        alt={service.title}
                        className="w-full h-[400px] object-cover"
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
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
              <h2 className="font-display text-4xl font-bold text-white mb-4">
                Not Sure Which Service You Need?
              </h2>
              <p className="text-xl text-white/60 mb-8 max-w-2xl mx-auto">
                Schedule a free consultation and we&apos;ll assess your property, understand your goals, and recommend the best approach for your situation.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-brand-gold hover:bg-brand-gold-light text-white font-semibold h-12 px-8 rounded-lg transition-colors"
              >
                Schedule Free Consultation <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
