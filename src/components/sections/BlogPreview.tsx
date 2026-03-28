'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, Calendar } from 'lucide-react';

const posts = [
  { title: 'The Benefits of Building an ADU for Your At-Home Office Setup', excerpt: 'Working from home has become permanent for many. A dedicated ADU office offers privacy, flexibility, and a professional environment.', date: 'Feb 4, 2025', slug: 'adu-home-office' },
  { title: 'Understanding the ADU Permitting Process in California', excerpt: 'Building an ADU in California is exciting, but first you need to navigate the permitting process. Here\'s your complete guide.', date: 'Jan 22, 2025', slug: 'adu-permitting-california' },
  { title: 'Family ADUs in San Diego: Building Space for Loved Ones', excerpt: 'More families are rethinking what "home" means. An ADU lets you keep loved ones close while maintaining independence.', date: 'Jan 21, 2025', slug: 'family-adus-san-diego' },
];

export default function BlogPreview() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="section-padding bg-brand-cream">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} className="flex flex-col md:flex-row md:items-end md:justify-between mb-16 gap-6">
          <div>
            <span className="text-brand-gold font-semibold text-sm uppercase tracking-widest">From the Blog</span>
            <h2 className="font-display text-4xl md:text-5xl text-brand-dark-teal mt-4">Latest <span className="text-brand-gold italic">Insights</span></h2>
          </div>
          <Link href="/blog" className="inline-flex items-center gap-2 text-brand-gold font-semibold hover:text-brand-charcoal transition-colors">
            All Articles <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {posts.map((post, i) => (
            <motion.article key={post.slug} initial={{ opacity: 0, y: 40 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: i * 0.15 }}>
              <Link href={`/blog/${post.slug}`} className="card group block">
                <div className="aspect-video bg-gradient-to-br from-brand-beige to-brand-cream flex items-center justify-center text-brand-slate/20 text-sm">Blog Image</div>
                <div className="p-6">
                  <div className="flex items-center gap-2 text-xs text-brand-slate/40 mb-3"><Calendar className="w-3.5 h-3.5" />{post.date}</div>
                  <h3 className="font-display text-lg text-brand-charcoal mb-2 group-hover:text-brand-gold transition-colors line-clamp-2">{post.title}</h3>
                  <p className="text-sm text-brand-slate/50 line-clamp-3">{post.excerpt}</p>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
