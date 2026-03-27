'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Plus, Pencil, Trash2, Eye, EyeOff, X } from 'lucide-react';
import toast from 'react-hot-toast';
import type { BlogPost } from '@/types';

export default function AdminBlog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [editing, setEditing] = useState<Partial<BlogPost> | null>(null);
  const supabase = createClient();

  const load = async () => {
    const { data } = await supabase.from('blog_posts').select('*').order('created_at', { ascending: false });
    setPosts(data || []);
  };

  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!editing) return;
    const slug = editing.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || '';
    const tags = typeof editing.tags === 'string' ? (editing.tags as string).split(',').map((t: string) => t.trim()) : editing.tags || [];
    const payload = { ...editing, slug, tags, updated_at: new Date().toISOString() };
    if (editing.id) {
      await supabase.from('blog_posts').update(payload).eq('id', editing.id);
      toast.success('Post updated');
    } else {
      await supabase.from('blog_posts').insert({ ...payload, created_at: new Date().toISOString() });
      toast.success('Post created');
    }
    setEditing(null); load();
  };

  const togglePublish = async (post: BlogPost) => {
    await supabase.from('blog_posts').update({
      published: !post.published,
      published_at: !post.published ? new Date().toISOString() : null,
    }).eq('id', post.id);
    toast.success(post.published ? 'Unpublished' : 'Published');
    load();
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this post?')) return;
    await supabase.from('blog_posts').delete().eq('id', id);
    toast.success('Deleted'); load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div><h1 className="font-display text-3xl text-brand-dark-teal mb-1">Blog Posts</h1><p className="text-brand-slate/50 text-sm">Create and manage blog content.</p></div>
        <button onClick={() => setEditing({ title: '', excerpt: '', content: '', cover_image: '', author: 'Casita', tags: [], published: false })} className="btn-primary flex items-center gap-2 !text-xs"><Plus className="w-4 h-4" />New Post</button>
      </div>

      <div className="space-y-4">
        {posts.map(p => (
          <div key={p.id} className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h3 className="font-semibold text-brand-dark-teal">{p.title}</h3>
                <span className={`text-xs px-2 py-0.5 rounded-full ${p.published ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-500'}`}>
                  {p.published ? 'Published' : 'Draft'}
                </span>
              </div>
              <p className="text-sm text-brand-slate/40 line-clamp-1">{p.excerpt}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => togglePublish(p)} className="px-3 py-2 text-xs rounded-lg bg-gray-50 hover:bg-gray-100 flex items-center gap-1.5">
                {p.published ? <><EyeOff className="w-3 h-3" />Unpublish</> : <><Eye className="w-3 h-3" />Publish</>}
              </button>
              <button onClick={() => setEditing(p)} className="px-3 py-2 text-xs rounded-lg bg-gray-50 hover:bg-gray-100 flex items-center gap-1.5"><Pencil className="w-3 h-3" />Edit</button>
              <button onClick={() => remove(p.id)} className="px-3 py-2 text-xs rounded-lg bg-red-50 text-red-500 hover:bg-red-100"><Trash2 className="w-3 h-3" /></button>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setEditing(null)} />
          <div className="relative bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-8">
            <button onClick={() => setEditing(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            <h2 className="font-display text-2xl text-brand-dark-teal mb-6">{editing.id ? 'Edit' : 'New'} Blog Post</h2>
            <div className="space-y-4">
              <div><label className="label">Title</label><input className="input-field" value={editing.title || ''} onChange={e => setEditing(p => p && ({ ...p, title: e.target.value }))} /></div>
              <div><label className="label">Excerpt</label><textarea rows={2} className="input-field resize-none" value={editing.excerpt || ''} onChange={e => setEditing(p => p && ({ ...p, excerpt: e.target.value }))} /></div>
              <div><label className="label">Content (Markdown supported)</label><textarea rows={12} className="input-field resize-none font-mono text-sm" value={editing.content || ''} onChange={e => setEditing(p => p && ({ ...p, content: e.target.value }))} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="label">Cover Image URL</label><input className="input-field" value={editing.cover_image || ''} onChange={e => setEditing(p => p && ({ ...p, cover_image: e.target.value }))} /></div>
                <div><label className="label">Author</label><input className="input-field" value={editing.author || ''} onChange={e => setEditing(p => p && ({ ...p, author: e.target.value }))} /></div>
              </div>
              <div><label className="label">Tags (comma separated)</label><input className="input-field" value={Array.isArray(editing.tags) ? editing.tags.join(', ') : editing.tags || ''} onChange={e => setEditing(p => p && ({ ...p, tags: e.target.value as any }))} /></div>
              <button onClick={save} className="btn-primary w-full">Save Post</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
