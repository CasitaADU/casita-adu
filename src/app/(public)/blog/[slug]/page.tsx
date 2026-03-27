'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { createClient } from '@/lib/supabase/client';
import { Calendar, User, ArrowLeft, Tag } from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';
import type { BlogPost } from '@/types';

export default function BlogPostPage() {
  const { slug } = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .single();
      setPost(data);
      setLoading(false);
    };
    load();
  }, [slug]);

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-brand-cream pt-32 flex items-center justify-center">
          <div className="animate-pulse text-brand-slate/30">Loading...</div>
        </main>
        <Footer />
      </>
    );
  }

  if (!post) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-brand-cream pt-32 text-center px-6">
          <h1 className="font-display text-4xl text-brand-dark-teal mb-4">Post Not Found</h1>
          <p className="text-brand-slate/50 mb-8">This blog post doesn&apos;t exist or has been removed.</p>
          <Link href="/blog" className="btn-primary">Back to Blog</Link>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="relative bg-brand-dark-teal pt-32 pb-16 px-6">
          <div className="max-w-3xl mx-auto">
            <Link href="/blog" className="inline-flex items-center gap-2 text-white/50 hover:text-white text-sm mb-6 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to Blog
            </Link>
            <div className="flex flex-wrap items-center gap-3 text-sm text-white/40 mb-4">
              {post.published_at && (
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  {format(new Date(post.published_at), 'MMMM d, yyyy')}
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" />
                {post.author}
              </span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl text-white leading-tight mb-6">
              {post.title}
            </h1>
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {post.tags.map(tag => (
                  <span key={tag} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/10 text-white/60 text-xs">
                    <Tag className="w-3 h-3" /> {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Cover Image */}
        {post.cover_image && (
          <div className="max-w-4xl mx-auto -mt-2 px-6">
            <div className="rounded-2xl overflow-hidden shadow-xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={post.cover_image} alt={post.title} className="w-full aspect-video object-cover" />
            </div>
          </div>
        )}

        {/* Content */}
        <section className="py-16 px-6 bg-brand-cream">
          <article className="max-w-3xl mx-auto">
            {post.excerpt && (
              <p className="text-xl text-brand-slate/70 leading-relaxed mb-8 font-medium italic border-l-4 border-brand-gold pl-6">
                {post.excerpt}
              </p>
            )}
            <div className="prose prose-lg max-w-none text-brand-slate/70 leading-relaxed space-y-6">
              {post.content.split('\n').map((paragraph, i) => (
                paragraph.trim() ? <p key={i}>{paragraph}</p> : null
              ))}
            </div>
          </article>
        </section>

        {/* CTA */}
        <section className="py-16 px-6 bg-white">
          <div className="max-w-3xl mx-auto bg-brand-dark-teal rounded-3xl p-10 md:p-14 text-center">
            <h3 className="font-display text-3xl text-white mb-4">Ready to Start Your ADU Project?</h3>
            <p className="text-white/50 mb-8 max-w-xl mx-auto">
              Schedule a free site walk and let&apos;s discuss how we can help build your dream ADU.
            </p>
            <Link href="/contact" className="btn-primary bg-brand-gold text-brand-dark-teal hover:bg-brand-gold/90">
              Schedule Free Site Walk
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
