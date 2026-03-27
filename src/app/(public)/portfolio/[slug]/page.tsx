'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { createClient } from '@/lib/supabase/client';
import { MapPin, Bed, Bath, Ruler, ArrowLeft, ChevronLeft, ChevronRight, X, Tag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { PortfolioProject } from '@/types';
import Link from 'next/link';

export default function ProjectDetailPage() {
  const { slug } = useParams();
  const router = useRouter();
  const [project, setProject] = useState<PortfolioProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    const load = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from('portfolio_projects')
        .select('*')
        .eq('slug', slug)
        .single();
      setProject(data);
      setLoading(false);
    };
    load();
  }, [slug]);

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-brand-cream pt-32 flex items-center justify-center">
          <div className="animate-pulse text-brand-slate/30">Loading project...</div>
        </main>
        <Footer />
      </>
    );
  }

  if (!project) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-brand-cream pt-32 text-center px-6">
          <h1 className="font-display text-4xl text-brand-dark-teal mb-4">Project Not Found</h1>
          <p className="text-brand-slate/50 mb-8">This project doesn&apos;t exist or has been removed.</p>
          <Link href="/portfolio" className="btn-primary">Back to Portfolio</Link>
        </main>
        <Footer />
      </>
    );
  }

  const allImages = [project.cover_image, ...(project.images || [])].filter(Boolean);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = '';
  };

  const prevImage = () => setLightboxIndex((i) => (i - 1 + allImages.length) % allImages.length);
  const nextImage = () => setLightboxIndex((i) => (i + 1) % allImages.length);

  return (
    <>
      <Navbar />
      <main>
        {/* Hero with cover image */}
        <section className="relative h-[50vh] md:h-[60vh] overflow-hidden">
          <img
            src={project.cover_image}
            alt={project.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-dark-teal/80 via-brand-dark-teal/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16">
            <div className="max-w-7xl mx-auto">
              <button
                onClick={() => router.push('/portfolio')}
                className="flex items-center gap-2 text-white/70 hover:text-white text-sm mb-4 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Back to Portfolio
              </button>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-white mb-4">
                {project.title}
              </h1>
              <div className="flex flex-wrap items-center gap-6 text-white/70">
                <span className="flex items-center gap-2"><MapPin className="w-4 h-4" />{project.location}</span>
                <span className="flex items-center gap-2"><Ruler className="w-4 h-4" />{project.sqft} sq ft</span>
                <span className="flex items-center gap-2"><Bed className="w-4 h-4" />{project.bedrooms} Bed</span>
                <span className="flex items-center gap-2"><Bath className="w-4 h-4" />{project.bathrooms} Bath</span>
                <span className="flex items-center gap-2"><Tag className="w-4 h-4 rotate-90" /><span className="capitalize">{project.project_type}</span></span>
              </div>
            </div>
          </div>
        </section>

        {/* Project Details */}
        <section className="section-padding bg-brand-cream">
          <div className="max-w-7xl mx-auto">
            {/* Status Badge & Description */}
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-4">
                <span className={`px-4 py-1.5 rounded-full text-sm font-semibold ${
                  project.status === 'completed'
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'bg-amber-50 text-amber-700'
                }`}>
                  {project.status === 'completed' ? 'Completed' : 'In Progress'}
                </span>
                {project.featured && (
                  <span className="px-4 py-1.5 rounded-full text-sm font-semibold bg-brand-gold/20 text-brand-gold">
                    Featured Project
                  </span>
                )}
              </div>
              {project.description && (
                <p className="text-lg text-brand-slate/60 max-w-3xl leading-relaxed">
                  {project.description}
                </p>
              )}
            </div>

            {/* Photo Gallery */}
            <h2 className="font-display text-2xl text-brand-dark-teal mb-6">
              Project Photos <span className="text-brand-slate/30 text-base font-normal">({allImages.length})</span>
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {allImages.map((img, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.03 }}
                  onClick={() => openLightbox(i)}
                  className="aspect-square bg-gray-100 rounded-xl overflow-hidden cursor-pointer group relative"
                >
                  <img
                    src={img}
                    alt={`${project.title} - Photo ${i + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-brand-dark-teal/0 group-hover:bg-brand-dark-teal/30 transition-all" />
                </motion.div>
              ))}
            </div>

            {/* CTA */}
            <div className="mt-16 bg-brand-dark-teal rounded-3xl p-10 md:p-14 text-center">
              <h3 className="font-display text-3xl text-white mb-4">
                Want Something Like This?
              </h3>
              <p className="text-white/50 mb-8 max-w-xl mx-auto">
                Schedule a free site walk and let&apos;s discuss building your dream ADU.
              </p>
              <Link href="/contact" className="btn-primary bg-brand-gold text-brand-dark-teal hover:bg-brand-gold/90">
                Schedule Free Site Walk
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
            onClick={closeLightbox}
          >
            {/* Close button */}
            <button
              onClick={closeLightbox}
              className="absolute top-6 right-6 text-white/70 hover:text-white z-10"
            >
              <X className="w-8 h-8" />
            </button>

            {/* Counter */}
            <div className="absolute top-6 left-6 text-white/50 text-sm">
              {lightboxIndex + 1} / {allImages.length}
            </div>

            {/* Previous */}
            <button
              onClick={(e) => { e.stopPropagation(); prevImage(); }}
              className="absolute left-4 md:left-8 text-white/50 hover:text-white z-10"
            >
              <ChevronLeft className="w-10 h-10" />
            </button>

            {/* Image */}
            <motion.img
              key={lightboxIndex}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              src={allImages[lightboxIndex]}
              alt={`${project.title} - Photo ${lightboxIndex + 1}`}
              className="max-h-[85vh] max-w-[90vw] object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />

            {/* Next */}
            <button
              onClick={(e) => { e.stopPropagation(); nextImage(); }}
              className="absolute right-4 md:right-8 text-white/50 hover:text-white z-10"
            >
              <ChevronRight className="w-10 h-10" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </>
  );
}
