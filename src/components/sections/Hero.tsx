'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Shield, Clock, Award } from 'lucide-react';

const trustItems = [
  { icon: Shield, title: 'Licensed & Insured', description: 'Full protection and peace of mind' },
  { icon: Clock, title: 'On-Time Delivery', description: 'We honor our timelines' },
  { icon: Award, title: '5-Year Warranty', description: 'Quality guaranteed' },
];

export default function Hero() {
  return (
    <>
      <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-brand-cream">
        {/* Decorative blurs */}
        <div className="absolute top-20 right-0 w-[600px] h-[600px] bg-brand-gold/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-brand-beige rounded-full blur-3xl" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 lg:px-8 py-20 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block px-4 py-2 bg-brand-gold/10 text-brand-gold rounded-full text-sm font-medium mb-6">
                California&apos;s Premier Construction Management Agency
              </span>

              <h1 className="font-display text-5xl lg:text-6xl xl:text-7xl font-bold text-brand-charcoal leading-tight mb-6">
                Your Stress-Free
                <span className="block text-brand-gold">ADU Journey</span>
                Starts Here
              </h1>

              <p className="text-xl text-brand-slate/60 mb-8 max-w-lg">
                From permits to keys, we handle every detail. Transform your backyard into a beautiful, income-generating space.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 bg-brand-gold hover:bg-brand-gold-light text-white font-semibold h-14 px-8 text-lg rounded-lg transition-colors"
                >
                  Request a Site Walk <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/pre-approved-plans"
                  className="inline-flex items-center justify-center h-14 px-8 text-lg font-semibold border-2 border-brand-charcoal/20 text-brand-charcoal rounded-lg hover:bg-brand-charcoal/5 transition-colors"
                >
                  View Pre-Approved Plans
                </Link>
              </div>

            </motion.div>

            {/* Right image */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://jahmbtbandibcvfqgnlf.supabase.co/storage/v1/object/public/images/portfolio/749%20SQFT%20DETACHED%20ADU%20COMPLETED%20AERIAL.jpg"
                  alt="Completed 749 sq ft detached ADU by Casita — aerial view"
                  className="w-full h-[600px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-charcoal/60 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="bg-white/95 backdrop-blur-sm rounded-xl p-4">
                    <p className="text-sm text-brand-slate/60 mb-1">Featured Project</p>
                    <p className="font-semibold text-brand-charcoal">749 Sq Ft Detached ADU — San Diego</p>
                    <p className="text-sm text-brand-gold font-medium">Completed 2024</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <section className="bg-brand-charcoal py-8">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {trustItems.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="flex items-center gap-4"
              >
                <div className="w-12 h-12 rounded-full bg-brand-gold/20 flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-6 h-6 text-brand-gold" />
                </div>
                <div>
                  <p className="font-semibold text-white">{item.title}</p>
                  <p className="text-sm text-white/50">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
