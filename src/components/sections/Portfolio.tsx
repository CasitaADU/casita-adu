'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, MapPin, Maximize2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import type { PortfolioProject } from '@/types';

export default function Portfolio() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [projects, setProjects] = useState<PortfolioProject[]>([]);

  useEffect(() => {
    const load = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from('portfolio_projects')
        .select('*')
        .eq('featured', true)
        .order('created_at', { ascending: false })
        .limit(3);
      setProjects(data || []);
    };
    load();
  }, []);

  return (
    <section ref={ref} className="section-padding bg-white">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} className="flex flex-col md:flex-row md:items-end md:justify-between mb-16 gap-6">
          <div>
            <span className="text-brand-gold font-semibold text-sm uppercase tracking-widest">Our Work</span>
            <h2 className="font-display text-4xl md:text-5xl text-brand-dark-teal mt-4">
              Featured <span className="text-brand-gold italic">Projects</span>
            </h2>
          </div>
          <Link href="/portfolio" className="inline-flex items-center gap-2 text-brand-gold font-semibold hover:text-brand-charcoal transition-colors">
            View All Projects <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        {projects.length === 0 && (
          <div className="text-center py-16 text-brand-slate/30">Loading projects...</div>
        )}

        <div className="grid md:grid-cols-3 gap-8">
          {projects.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.15 }}
            >
              <Link href={`/portfolio/${project.slug}`} className="card group cursor-pointer block">
                <div className="aspect-[4/3] bg-gradient-to-br from-brand-beige to-brand-cream relative overflow-hidden">
                  {project.cover_image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={project.cover_image} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-brand-slate/20 text-sm">Project Image</div>
                  )}
                  <div className="absolute inset-0 bg-brand-dark-teal/0 group-hover:bg-brand-dark-teal/40 transition-all duration-500 flex items-center justify-center">
                    <Maximize2 className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-display text-xl text-brand-dark-teal mb-2">{project.title}</h3>
                  <div className="flex items-center gap-2 text-sm text-brand-slate/50 mb-4">
                    <MapPin className="w-3.5 h-3.5" /> {project.location}
                  </div>
                  <div className="flex gap-4 text-xs font-medium text-brand-slate/40">
                    <span>{project.sqft} sq ft</span>
                    <span>{project.bedrooms} Bed</span>
                    <span>{project.bathrooms} Bath</span>
                    <span className="text-brand-gold capitalize">{project.project_type}</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
