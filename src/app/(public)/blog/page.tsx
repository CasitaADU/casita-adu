'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { Calendar, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import type { BlogPost } from '@/types';

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  useEffect(() => {
    const load = async () => {
      const supabase = createClient();
      const { data } = await supabase.from('blog_posts').select('*').eq('published', true).order('published_at', { ascending: false });
      setPosts(data || []);
    };
    load();
  }, []);

  return (
    <>
      <Navbar />
      <main>
        <section className="bg-brand-dark-teal pt-32 pb-20 px-6 text-center">
          <span className="text-brand-gold font-semibold text-sm uppercase tracking-widest">Insights & Tips</span>
          <h1 className="font-display text-5xl md:text-6xl text-white mt-4 mb-6">Our <span className="text-brand-gold italic">Blog</span></h1>
          <p className="text-white/50 text-lg max-w-2xl mx-auto">Expert advice and insights on ADU development in California.</p>
        </section>
        <section className="section-padding bg-brand-cream">
          <div className="max-w-5xl mx-auto">
            {posts.length === 0 && <div className="text-center py-20 text-brand-slate/30">Blog posts coming soon!</div>}
            <div className="space-y-8">
              {posts.map((post, i) => (
                <motion.article key={post.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
                  <Link href={`/blog/${post.slug}`} className="card flex flex-col md:flex-row group">
                    <div className="md:w-72 aspect-video md:aspect-auto bg-gray-100 flex-shrink-0 overflow-hidden">
                      {post.cover_image ? <img src={post.cover_image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" /> : <div className="flex items-center justify-center h-full text-gray-300 text-sm">Image</div>}
                    </div>
                    <div className="p-6 md:p-8 flex flex-col justify-center">
                      <div className="flex items-center gap-3 text-xs text-brand-slate/40 mb-3">
                        <Calendar className="w-3.5 h-3.5" />{post.published_at ? format(new Date(post.published_at), 'MMM d, yyyy') : ''}
                        {post.tags?.slice(0, 2).map(t => <span key={t} className="px-2 py-0.5 rounded-full bg-brand-dark-teal/5 text-brand-mid-teal">{t}</span>)}
                      </div>
                      <h2 className="font-display text-2xl text-brand-dark-teal mb-2 group-hover:text-brand-mid-teal transition-colors">{post.title}</h2>
                      <p className="text-brand-slate/50 text-sm line-clamp-2 mb-4">{post.excerpt}</p>
                      <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-mid-teal">Read More <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" /></span>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
