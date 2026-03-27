'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Plus, Pencil, Trash2, Star, MapPin, X } from 'lucide-react';
import toast from 'react-hot-toast';
import type { PortfolioProject } from '@/types';

const emptyProject: Partial<PortfolioProject> = {
  title: '', description: '', location: '', sqft: 0, bedrooms: 1, bathrooms: 1,
  project_type: 'detached', status: 'completed', featured: false, cover_image: '', images: [],
};

export default function AdminPortfolio() {
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [editing, setEditing] = useState<Partial<PortfolioProject> | null>(null);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  const load = async () => {
    const { data } = await supabase.from('portfolio_projects').select('*').order('created_at', { ascending: false });
    setProjects(data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!editing) return;
    const slug = editing.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || '';
    const payload = { ...editing, slug, updated_at: new Date().toISOString() };

    if (editing.id) {
      const { error } = await supabase.from('portfolio_projects').update(payload).eq('id', editing.id);
      if (error) { toast.error(error.message); return; }
      toast.success('Project updated');
    } else {
      const { error } = await supabase.from('portfolio_projects').insert({ ...payload, created_at: new Date().toISOString() });
      if (error) { toast.error(error.message); return; }
      toast.success('Project added');
    }
    setEditing(null);
    load();
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this project?')) return;
    await supabase.from('portfolio_projects').delete().eq('id', id);
    toast.success('Deleted');
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl text-brand-dark-teal mb-1">Portfolio</h1>
          <p className="text-brand-slate/50 text-sm">Manage your completed and in-progress showcase projects.</p>
        </div>
        <button onClick={() => setEditing({ ...emptyProject })} className="btn-primary flex items-center gap-2 !text-xs"><Plus className="w-4 h-4" /> Add Project</button>
      </div>

      {/* Projects grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map(p => (
          <div key={p.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden group">
            <div className="aspect-video bg-gray-100 relative">
              {p.cover_image ? <img src={p.cover_image} alt={p.title} className="w-full h-full object-cover" /> : <div className="flex items-center justify-center h-full text-gray-300 text-sm">No image</div>}
              {p.featured && <div className="absolute top-3 left-3 bg-brand-gold text-brand-dark-teal text-xs font-bold px-2.5 py-1 rounded-lg flex items-center gap-1"><Star className="w-3 h-3" />Featured</div>}
            </div>
            <div className="p-5">
              <h3 className="font-semibold text-brand-dark-teal mb-1">{p.title}</h3>
              <div className="flex items-center gap-1.5 text-xs text-brand-slate/40 mb-3"><MapPin className="w-3 h-3" />{p.location}</div>
              <div className="flex items-center gap-3 text-xs text-brand-slate/40 mb-4">
                <span>{p.sqft} sqft</span><span>{p.bedrooms}bd/{p.bathrooms}ba</span><span className="capitalize">{p.project_type}</span>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setEditing(p)} className="flex-1 py-2 text-xs font-medium rounded-lg bg-gray-50 hover:bg-gray-100 flex items-center justify-center gap-1.5"><Pencil className="w-3 h-3" />Edit</button>
                <button onClick={() => remove(p.id)} className="py-2 px-3 text-xs rounded-lg bg-red-50 text-red-500 hover:bg-red-100"><Trash2 className="w-3 h-3" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {loading && <div className="text-center py-20 text-brand-slate/30">Loading...</div>}
      {!loading && projects.length === 0 && <div className="text-center py-20 text-brand-slate/30">No portfolio projects yet. Add your first one!</div>}

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setEditing(null)} />
          <div className="relative bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8">
            <button onClick={() => setEditing(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            <h2 className="font-display text-2xl text-brand-dark-teal mb-6">{editing.id ? 'Edit' : 'Add'} Project</h2>
            <div className="space-y-4">
              <div><label className="label">Title</label><input className="input-field" value={editing.title || ''} onChange={e => setEditing(p => p && ({ ...p, title: e.target.value }))} /></div>
              <div><label className="label">Description</label><textarea rows={3} className="input-field resize-none" value={editing.description || ''} onChange={e => setEditing(p => p && ({ ...p, description: e.target.value }))} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="label">Location</label><input className="input-field" value={editing.location || ''} onChange={e => setEditing(p => p && ({ ...p, location: e.target.value }))} /></div>
                <div><label className="label">Sq Ft</label><input type="number" className="input-field" value={editing.sqft || ''} onChange={e => setEditing(p => p && ({ ...p, sqft: +e.target.value }))} /></div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div><label className="label">Bedrooms</label><input type="number" className="input-field" value={editing.bedrooms || ''} onChange={e => setEditing(p => p && ({ ...p, bedrooms: +e.target.value }))} /></div>
                <div><label className="label">Bathrooms</label><input type="number" className="input-field" value={editing.bathrooms || ''} onChange={e => setEditing(p => p && ({ ...p, bathrooms: +e.target.value }))} /></div>
                <div><label className="label">Type</label>
                  <select className="input-field" value={editing.project_type || ''} onChange={e => setEditing(p => p && ({ ...p, project_type: e.target.value as any }))}>
                    <option value="detached">Detached</option><option value="attached">Attached</option><option value="conversion">Conversion</option><option value="junior">Junior ADU</option>
                  </select>
                </div>
              </div>
              <div><label className="label">Cover Image URL</label><input className="input-field" value={editing.cover_image || ''} onChange={e => setEditing(p => p && ({ ...p, cover_image: e.target.value }))} placeholder="https://..." /></div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={editing.featured || false} onChange={e => setEditing(p => p && ({ ...p, featured: e.target.checked }))} className="w-4 h-4 rounded border-gray-300 text-brand-mid-teal focus:ring-brand-mid-teal" />
                <span className="text-sm text-brand-slate">Featured Project</span>
              </label>
              <div className="flex gap-3 pt-4">
                <button onClick={save} className="btn-primary flex-1">Save Project</button>
                <button onClick={() => setEditing(null)} className="btn-ghost">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
