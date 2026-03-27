'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { createClient } from '@/lib/supabase/client';
import { MapPin, Maximize2 } from 'lucide-react';
import { motion } from 'framer-motion';
import type { PortfolioProject } from '@/types';

export default function PortfolioPage() {
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const load = async () => {
      const supabase = createClient();
      const { data } = await supabase.from('portfolio_projects').select('*').order('featured', { ascending: false }).order('created_at', { ascending: false });
      setProjects(data || []);
    };
    load();
  }, []);

  const filtered = filter === 'all' ? projects : projects.filter(p => p.project_type === filter);

  return (
    <>
      <Navbar />
      <main>
        <section className="bg-brand-dark-teal pt-32 pb-20 px-6 text-center">
          <span className="text-brand-gold font-semibold text-sm uppercase tracking-widest">Our Work</span>
          <h1 className="font-display text-5xl md:text-6xl text-white mt-4 mb-6">Project <span className="text-brand-gold italic">Portfolio</span></h1>
          <p className="text-white/50 text-lg max-w-2xl mx-auto">Browse our completed ADU projects across Southern California.</p>
        </section>

        <section className="section-padding bg-brand-cream">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-wrap gap-2 mb-10 justify-center">
              {['all', 'detached', 'attached', 'conversion', 'junior'].map(f => (
                <button key={f} onClick={() => setFilter(f)}
                  className={`px-5 py-2 rounded-full text-sm font-medium capitalize transition-all ${filter === f ? 'bg-brand-dark-teal text-white' : 'bg-white text-brand-slate/50 hover:bg-gray-50 border border-gray-100'}`}>
                  {f === 'all' ? 'All Projects' : f}
                </button>
              ))}
            </div>

            {filtered.length === 0 && <div className="text-center py-20 text-brand-slate/30">No projects to show yet. Check back soon!</div>}

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered.map((project, i) => (
                <motion.div key={project.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                  className="card group cursor-pointer">
                  <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden">
                    {project.cover_image ? <img src={project.cover_image} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" /> : <div className="flex items-center justify-center h-full text-gray-300 text-sm">No image</div>}
                    <div className="absolute inset-0 bg-brand-dark-teal/0 group-hover:bg-brand-dark-teal/40 transition-all flex items-center justify-center">
                      <Maximize2 className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-display text-xl text-brand-dark-teal mb-2">{project.title}</h3>
                    <div className="flex items-center gap-2 text-sm text-brand-slate/50 mb-3"><MapPin className="w-3.5 h-3.5" />{project.location}</div>
                    <p className="text-sm text-brand-slate/40 line-clamp-2 mb-3">{project.description}</p>
                    <div className="flex gap-4 text-xs font-medium text-brand-slate/40">
                      <span>{project.sqft} sq ft</span><span>{project.bedrooms}bd/{project.bathrooms}ba</span><span className="text-brand-gold capitalize">{project.project_type}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
