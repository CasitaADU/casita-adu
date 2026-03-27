'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Plus, Pencil, Send, X, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';
import type { ActiveProject, ProgressUpdate } from '@/types';

const phases = ['planning', 'permitting', 'design', 'construction', 'inspection', 'completed'] as const;

export default function AdminProjects() {
  const [projects, setProjects] = useState<ActiveProject[]>([]);
  const [editing, setEditing] = useState<Partial<ActiveProject> | null>(null);
  const [updateModal, setUpdateModal] = useState<{ projectId: string; projectTitle: string } | null>(null);
  const [update, setUpdate] = useState({ title: '', description: '', phase: '', images: '' });
  const [clients, setClients] = useState<{ id: string; full_name: string }[]>([]);
  const supabase = createClient();

  const load = async () => {
    const { data } = await supabase.from('active_projects').select('*').order('created_at', { ascending: false });
    setProjects(data || []);
    const { data: c } = await supabase.from('profiles').select('id, full_name').eq('role', 'client');
    setClients(c || []);
  };

  useEffect(() => { load(); }, []);

  const saveProject = async () => {
    if (!editing) return;
    const payload = { ...editing, updated_at: new Date().toISOString() };
    if (editing.id) {
      await supabase.from('active_projects').update(payload).eq('id', editing.id);
      toast.success('Project updated');
    } else {
      await supabase.from('active_projects').insert({ ...payload, created_at: new Date().toISOString() });
      toast.success('Project created');
    }
    setEditing(null); load();
  };

  const sendUpdate = async () => {
    if (!updateModal) return;
    const images = update.images.split(',').map(s => s.trim()).filter(Boolean);
    const { data: { user } } = await supabase.auth.getUser();
    await supabase.from('progress_updates').insert({
      project_id: updateModal.projectId, title: update.title, description: update.description,
      phase: update.phase, images, created_by: user?.id, created_at: new Date().toISOString(),
    });
    toast.success('Progress update sent! Client can now see it.');
    setUpdateModal(null);
    setUpdate({ title: '', description: '', phase: '', images: '' });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div><h1 className="font-display text-3xl text-brand-dark-teal mb-1">Active Projects</h1><p className="text-brand-slate/50 text-sm">Manage client projects and send progress updates.</p></div>
        <button onClick={() => setEditing({ title: '', address: '', project_type: 'detached', status: 'planning', progress_percent: 0, start_date: '', estimated_completion: '' })} className="btn-primary flex items-center gap-2 !text-xs"><Plus className="w-4 h-4" />New Project</button>
      </div>

      <div className="space-y-4">
        {projects.map(p => (
          <div key={p.id} className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-semibold text-brand-dark-teal text-lg">{p.title}</h3>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-lg border phase-${p.status} capitalize`}>{p.status}</span>
                </div>
                <p className="text-sm text-brand-slate/50">{p.address}</p>
                <div className="mt-3 flex items-center gap-2">
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden max-w-xs">
                    <div className="h-full bg-brand-mid-teal rounded-full transition-all" style={{ width: `${p.progress_percent}%` }} />
                  </div>
                  <span className="text-xs font-medium text-brand-slate/50">{p.progress_percent}%</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setUpdateModal({ projectId: p.id, projectTitle: p.title })} className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded-lg bg-brand-gold/10 text-brand-gold hover:bg-brand-gold/20 transition-colors">
                  <Send className="w-3 h-3" />Send Update
                </button>
                <button onClick={() => setEditing(p)} className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded-lg bg-gray-50 hover:bg-gray-100">
                  <Pencil className="w-3 h-3" />Edit
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Project Modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setEditing(null)} />
          <div className="relative bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8">
            <button onClick={() => setEditing(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            <h2 className="font-display text-2xl text-brand-dark-teal mb-6">{editing.id ? 'Edit' : 'Create'} Project</h2>
            <div className="space-y-4">
              <div><label className="label">Project Title</label><input className="input-field" value={editing.title || ''} onChange={e => setEditing(p => p && ({ ...p, title: e.target.value }))} /></div>
              <div><label className="label">Assign Client</label>
                <select className="input-field" value={editing.client_id || ''} onChange={e => setEditing(p => p && ({ ...p, client_id: e.target.value }))}>
                  <option value="">Select client...</option>
                  {clients.map(c => <option key={c.id} value={c.id}>{c.full_name}</option>)}
                </select>
              </div>
              <div><label className="label">Address</label><input className="input-field" value={editing.address || ''} onChange={e => setEditing(p => p && ({ ...p, address: e.target.value }))} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="label">Status</label>
                  <select className="input-field" value={editing.status || 'planning'} onChange={e => setEditing(p => p && ({ ...p, status: e.target.value as any }))}>
                    {phases.map(ph => <option key={ph} value={ph} className="capitalize">{ph}</option>)}
                  </select>
                </div>
                <div><label className="label">Progress %</label><input type="number" min={0} max={100} className="input-field" value={editing.progress_percent || 0} onChange={e => setEditing(p => p && ({ ...p, progress_percent: +e.target.value }))} /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="label">Start Date</label><input type="date" className="input-field" value={editing.start_date || ''} onChange={e => setEditing(p => p && ({ ...p, start_date: e.target.value }))} /></div>
                <div><label className="label">Est. Completion</label><input type="date" className="input-field" value={editing.estimated_completion || ''} onChange={e => setEditing(p => p && ({ ...p, estimated_completion: e.target.value }))} /></div>
              </div>
              <div><label className="label">Notes</label><textarea rows={3} className="input-field resize-none" value={editing.notes || ''} onChange={e => setEditing(p => p && ({ ...p, notes: e.target.value }))} /></div>
              <button onClick={saveProject} className="btn-primary w-full">Save Project</button>
            </div>
          </div>
        </div>
      )}

      {/* Send Update Modal */}
      {updateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setUpdateModal(null)} />
          <div className="relative bg-white rounded-2xl w-full max-w-lg p-8">
            <button onClick={() => setUpdateModal(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            <h2 className="font-display text-2xl text-brand-dark-teal mb-2">Send Progress Update</h2>
            <p className="text-sm text-brand-slate/50 mb-6">For: {updateModal.projectTitle}</p>
            <div className="space-y-4">
              <div><label className="label">Update Title</label><input className="input-field" value={update.title} onChange={e => setUpdate(u => ({ ...u, title: e.target.value }))} placeholder="e.g., Foundation Complete" /></div>
              <div><label className="label">Description</label><textarea rows={4} className="input-field resize-none" value={update.description} onChange={e => setUpdate(u => ({ ...u, description: e.target.value }))} placeholder="Describe what was accomplished..." /></div>
              <div><label className="label">Phase</label>
                <select className="input-field" value={update.phase} onChange={e => setUpdate(u => ({ ...u, phase: e.target.value }))}>
                  <option value="">Select phase...</option>{phases.map(ph => <option key={ph} value={ph} className="capitalize">{ph}</option>)}
                </select>
              </div>
              <div><label className="label">Image URLs (comma separated)</label><input className="input-field" value={update.images} onChange={e => setUpdate(u => ({ ...u, images: e.target.value }))} placeholder="https://..., https://..." /></div>
              <button onClick={sendUpdate} className="btn-primary w-full flex items-center justify-center gap-2"><Send className="w-4 h-4" />Send Update to Client</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
