'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import {
  ArrowLeft, Save, Plus, Pencil, Trash2, Send, Download, Upload,
  X, User, Building2, Mail, Phone, FileText, DollarSign,
  Calendar, MapPin, Home, CheckCircle, Clock, AlertCircle,
} from 'lucide-react';
import type {
  ActiveProject, Profile, TeamMember, PaymentMilestone,
  ProgressUpdate, ClientDocument,
} from '@/types';

const phases = ['planning', 'permitting', 'design', 'construction', 'inspection', 'completed'] as const;
const docCategories = ['permit', 'invoice', 'receipt', 'contract', 'plan', 'other'] as const;
const teamRoles = ['contractor', 'project_manager'] as const;
const milestoneStatuses = ['upcoming', 'due', 'paid', 'overdue'] as const;

type Tab = 'overview' | 'team' | 'updates' | 'payments' | 'documents';

const statusBadge = (status: string) => {
  const colors: Record<string, string> = {
    upcoming: 'bg-gray-100 text-gray-600',
    due: 'bg-yellow-100 text-yellow-700',
    paid: 'bg-green-100 text-green-700',
    overdue: 'bg-red-100 text-red-700',
    pending: 'bg-yellow-100 text-yellow-700',
    accepted: 'bg-green-100 text-green-700',
    expired: 'bg-gray-100 text-gray-500',
  };
  return colors[status] || 'bg-gray-100 text-gray-600';
};

const categoryBadge = (cat: string) => {
  const colors: Record<string, string> = {
    permit: 'bg-blue-100 text-blue-700',
    invoice: 'bg-yellow-100 text-yellow-700',
    receipt: 'bg-green-100 text-green-700',
    contract: 'bg-purple-100 text-purple-700',
    plan: 'bg-indigo-100 text-indigo-700',
    other: 'bg-gray-100 text-gray-600',
  };
  return colors[cat] || 'bg-gray-100 text-gray-600';
};

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(amount);
}

function formatDate(dateStr: string | undefined | null) {
  if (!dateStr) return '--';
  try { return format(new Date(dateStr), 'MMM d, yyyy'); } catch { return dateStr; }
}

// --- Modal wrapper ---
function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-8">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
        <h2 className="font-display text-2xl text-brand-dark-teal mb-6">{title}</h2>
        {children}
      </div>
    </div>
  );
}

export default function AdminProjectDetail() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;
  const supabase = createClient();

  const [tab, setTab] = useState<Tab>('overview');
  const [loading, setLoading] = useState(true);

  // Data
  const [project, setProject] = useState<ActiveProject | null>(null);
  const [editProject, setEditProject] = useState<Partial<ActiveProject>>({});
  const [client, setClient] = useState<Profile | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [updates, setUpdates] = useState<ProgressUpdate[]>([]);
  const [milestones, setMilestones] = useState<PaymentMilestone[]>([]);
  const [documents, setDocuments] = useState<ClientDocument[]>([]);

  // Modals
  const [teamModal, setTeamModal] = useState<Partial<TeamMember> | null>(null);
  const [updateModal, setUpdateModal] = useState(false);
  const [milestoneModal, setMilestoneModal] = useState<Partial<PaymentMilestone> | null>(null);
  const [docModal, setDocModal] = useState(false);

  // Forms
  const [newUpdate, setNewUpdate] = useState({ title: '', description: '', phase: '', images: '', notify: true });
  const [docForm, setDocForm] = useState({ name: '', category: 'other' as string, file: null as File | null });
  const [saving, setSaving] = useState(false);

  const loadAll = useCallback(async () => {
    setLoading(true);
    const [projRes, teamRes, updatesRes, milestonesRes, docsRes] = await Promise.all([
      supabase.from('active_projects').select('*').eq('id', projectId).single(),
      supabase.from('team_members').select('*').eq('project_id', projectId).order('created_at'),
      supabase.from('progress_updates').select('*').eq('project_id', projectId).order('created_at', { ascending: false }),
      supabase.from('payment_milestones').select('*').eq('project_id', projectId).order('sort_order'),
      supabase.from('client_documents').select('*').eq('project_id', projectId).order('created_at', { ascending: false }),
    ]);

    if (projRes.data) {
      setProject(projRes.data);
      setEditProject(projRes.data);
      if (projRes.data.client_id) {
        const { data: profileData } = await supabase.from('profiles').select('*').eq('id', projRes.data.client_id).single();
        setClient(profileData);
      }
    }
    setTeamMembers(teamRes.data || []);
    setUpdates(updatesRes.data || []);
    setMilestones(milestonesRes.data || []);
    setDocuments(docsRes.data || []);
    setLoading(false);
  }, [projectId]);

  useEffect(() => { loadAll(); }, [loadAll]);

  // --- Overview Save ---
  const saveOverview = async () => {
    setSaving(true);
    const { error } = await supabase.from('active_projects').update({
      ...editProject,
      updated_at: new Date().toISOString(),
    }).eq('id', projectId);
    if (error) toast.error('Failed to save');
    else { toast.success('Project saved'); loadAll(); }
    setSaving(false);
  };

  // --- Team ---
  const saveTeamMember = async () => {
    if (!teamModal) return;
    const payload = { ...teamModal, project_id: projectId };
    if (teamModal.id) {
      const { error } = await supabase.from('team_members').update(payload).eq('id', teamModal.id);
      if (error) toast.error('Failed to update'); else toast.success('Team member updated');
    } else {
      const { error } = await supabase.from('team_members').insert({ ...payload, created_at: new Date().toISOString() });
      if (error) toast.error('Failed to add'); else toast.success('Team member added');
    }
    setTeamModal(null); loadAll();
  };
  const deleteTeamMember = async (id: string) => {
    if (!confirm('Remove this team member?')) return;
    await supabase.from('team_members').delete().eq('id', id);
    toast.success('Team member removed'); loadAll();
  };

  // --- Updates ---
  const sendProgressUpdate = async () => {
    const images = newUpdate.images.split(',').map(s => s.trim()).filter(Boolean);
    if (newUpdate.notify) {
      const res = await fetch('/api/admin/updates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ project_id: projectId, title: newUpdate.title, description: newUpdate.description, phase: newUpdate.phase || undefined, images }),
      });
      if (!res.ok) { toast.error('Failed to send update'); return; }
      toast.success('Update sent with email notification');
    } else {
      const { data: { user } } = await supabase.auth.getUser();
      const { error } = await supabase.from('progress_updates').insert({
        project_id: projectId, title: newUpdate.title, description: newUpdate.description,
        phase: newUpdate.phase || null, images, created_by: user?.id, created_at: new Date().toISOString(),
      });
      if (error) { toast.error('Failed to send update'); return; }
      toast.success('Update saved (no notification)');
    }
    setNewUpdate({ title: '', description: '', phase: '', images: '', notify: true });
    setUpdateModal(false); loadAll();
  };

  // --- Milestones ---
  const saveMilestone = async () => {
    if (!milestoneModal) return;
    const payload = { ...milestoneModal, project_id: projectId, updated_at: new Date().toISOString() };
    if (milestoneModal.id) {
      const { error } = await supabase.from('payment_milestones').update(payload).eq('id', milestoneModal.id);
      if (error) toast.error('Failed to update'); else toast.success('Milestone updated');
    } else {
      const { error } = await supabase.from('payment_milestones').insert({
        ...payload, sort_order: milestones.length, created_at: new Date().toISOString(),
      });
      if (error) toast.error('Failed to add'); else toast.success('Milestone added');
    }
    setMilestoneModal(null); loadAll();
  };
  const deleteMilestone = async (id: string) => {
    if (!confirm('Delete this milestone?')) return;
    await supabase.from('payment_milestones').delete().eq('id', id);
    toast.success('Milestone deleted'); loadAll();
  };

  // --- Documents ---
  const uploadDocument = async () => {
    if (!docForm.file) { toast.error('Please select a file'); return; }
    setSaving(true);
    const filePath = `${projectId}/${docForm.file.name}`;
    const { error: uploadError } = await supabase.storage.from('client-documents').upload(filePath, docForm.file, { upsert: true });
    if (uploadError) { toast.error('Upload failed'); setSaving(false); return; }
    const { data: urlData } = supabase.storage.from('client-documents').getPublicUrl(filePath);
    const { data: { user } } = await supabase.auth.getUser();
    await supabase.from('client_documents').insert({
      project_id: projectId,
      name: docForm.name || docForm.file.name,
      file_url: urlData.publicUrl,
      file_type: docForm.file.type || docForm.file.name.split('.').pop() || 'unknown',
      uploaded_by: user?.id,
      uploaded_by_role: 'admin',
      category: docForm.category,
      created_at: new Date().toISOString(),
    });
    toast.success('Document uploaded');
    setDocForm({ name: '', category: 'other', file: null }); setDocModal(false); setSaving(false); loadAll();
  };
  const deleteDocument = async (doc: ClientDocument) => {
    if (!confirm('Delete this document?')) return;
    const filePath = `${projectId}/${doc.name}`;
    await supabase.storage.from('client-documents').remove([filePath]);
    await supabase.from('client_documents').delete().eq('id', doc.id);
    toast.success('Document deleted'); loadAll();
  };

  // --- Tabs config ---
  const tabs: { key: Tab; label: string }[] = [
    { key: 'overview', label: 'Overview' },
    { key: 'team', label: 'Team' },
    { key: 'updates', label: 'Updates' },
    { key: 'payments', label: 'Payments' },
    { key: 'documents', label: 'Documents' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-brand-mid-teal border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-20">
        <p className="text-brand-slate/50 mb-4">Project not found.</p>
        <button onClick={() => router.push('/admin/projects')} className="btn-primary">Back to Projects</button>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => router.push('/admin/projects')} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
          <ArrowLeft className="w-5 h-5 text-brand-dark-teal" />
        </button>
        <div className="flex-1">
          <h1 className="font-display text-3xl text-brand-dark-teal">{project.title}</h1>
          <p className="text-sm text-brand-slate/50 flex items-center gap-1 mt-1"><MapPin className="w-3.5 h-3.5" />{project.address}</p>
        </div>
        <span className={`text-xs font-medium px-3 py-1.5 rounded-lg border capitalize phase-${project.status}`}>{project.status}</span>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-gray-200 mb-8">
        {tabs.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
              tab === t.key ? 'border-brand-dark-teal text-brand-dark-teal' : 'border-transparent text-brand-slate/40 hover:text-brand-slate/60'
            }`}>{t.label}</button>
        ))}
      </div>

      {/* ==================== OVERVIEW TAB ==================== */}
      {tab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main form */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
            <h3 className="font-display text-lg text-brand-dark-teal">Project Details</h3>
            <div>
              <label className="label">Title</label>
              <input className="input-field" value={editProject.title || ''} onChange={e => setEditProject(p => ({ ...p, title: e.target.value }))} />
            </div>
            <div>
              <label className="label">Address</label>
              <input className="input-field" value={editProject.address || ''} onChange={e => setEditProject(p => ({ ...p, address: e.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Status</label>
                <select className="input-field" value={editProject.status || 'planning'} onChange={e => setEditProject(p => ({ ...p, status: e.target.value as ActiveProject['status'] }))}>
                  {phases.map(ph => <option key={ph} value={ph}>{ph}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Project Type</label>
                <input className="input-field" value={editProject.project_type || ''} onChange={e => setEditProject(p => ({ ...p, project_type: e.target.value }))} />
              </div>
            </div>

            {/* Progress slider */}
            <div>
              <label className="label">Progress: {editProject.progress_percent || 0}%</label>
              <input type="range" min={0} max={100} value={editProject.progress_percent || 0}
                onChange={e => setEditProject(p => ({ ...p, progress_percent: +e.target.value }))}
                className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-brand-mid-teal" />
              <div className="mt-2 h-3 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-brand-mid-teal rounded-full transition-all" style={{ width: `${editProject.progress_percent || 0}%` }} />
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Start Date</label>
                <input type="date" className="input-field" value={editProject.start_date || ''} onChange={e => setEditProject(p => ({ ...p, start_date: e.target.value }))} />
              </div>
              <div>
                <label className="label">Est. Completion</label>
                <input type="date" className="input-field" value={editProject.estimated_completion || ''} onChange={e => setEditProject(p => ({ ...p, estimated_completion: e.target.value }))} />
              </div>
            </div>

            {/* Build specs */}
            <h3 className="font-display text-lg text-brand-dark-teal pt-2">Build Specs</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="label">Sq Ft</label>
                <input type="number" className="input-field" value={editProject.sqft || ''} onChange={e => setEditProject(p => ({ ...p, sqft: +e.target.value }))} />
              </div>
              <div>
                <label className="label">Bedrooms</label>
                <input type="number" className="input-field" value={editProject.bedrooms || ''} onChange={e => setEditProject(p => ({ ...p, bedrooms: +e.target.value }))} />
              </div>
              <div>
                <label className="label">Bathrooms</label>
                <input type="number" className="input-field" value={editProject.bathrooms || ''} onChange={e => setEditProject(p => ({ ...p, bathrooms: +e.target.value }))} />
              </div>
              <div>
                <label className="label">Total Contract</label>
                <input type="number" className="input-field" value={editProject.total_contract || ''} onChange={e => setEditProject(p => ({ ...p, total_contract: +e.target.value }))} />
              </div>
            </div>

            <div>
              <label className="label">Notes</label>
              <textarea rows={3} className="input-field resize-none" value={editProject.notes || ''} onChange={e => setEditProject(p => ({ ...p, notes: e.target.value }))} />
            </div>

            <button onClick={saveOverview} disabled={saving} className="btn-primary flex items-center gap-2">
              <Save className="w-4 h-4" />{saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>

          {/* Client card */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h3 className="font-display text-lg text-brand-dark-teal mb-4 flex items-center gap-2"><User className="w-5 h-5" />Assigned Client</h3>
              {client ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-brand-dark-teal/10 flex items-center justify-center text-brand-dark-teal font-semibold text-sm">
                      {client.full_name?.charAt(0) || '?'}
                    </div>
                    <div>
                      <p className="font-medium text-brand-dark-teal">{client.full_name}</p>
                      <p className="text-xs text-brand-slate/50">{client.email}</p>
                    </div>
                  </div>
                  {client.phone && (
                    <p className="text-sm text-brand-slate/50 flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" />{client.phone}</p>
                  )}
                </div>
              ) : (
                <p className="text-sm text-brand-slate/40">No client assigned.</p>
              )}
            </div>

            {/* Quick stats */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h3 className="font-display text-lg text-brand-dark-teal mb-4">Quick Stats</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-brand-slate/50">Updates</span><span className="font-medium">{updates.length}</span></div>
                <div className="flex justify-between"><span className="text-brand-slate/50">Team Members</span><span className="font-medium">{teamMembers.length}</span></div>
                <div className="flex justify-between"><span className="text-brand-slate/50">Documents</span><span className="font-medium">{documents.length}</span></div>
                <div className="flex justify-between"><span className="text-brand-slate/50">Milestones</span><span className="font-medium">{milestones.length}</span></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== TEAM TAB ==================== */}
      {tab === 'team' && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-display text-lg text-brand-dark-teal">Team Members</h3>
            <button onClick={() => setTeamModal({ full_name: '', role: 'contractor', company: '', email: '', phone: '' })} className="btn-primary flex items-center gap-2 !text-xs">
              <Plus className="w-4 h-4" />Add Team Member
            </button>
          </div>

          {teamMembers.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
              <p className="text-brand-slate/40">No team members yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {teamMembers.map(m => (
                <div key={m.id} className="bg-white rounded-2xl border border-gray-100 p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-brand-gold/10 flex items-center justify-center text-brand-gold font-semibold text-sm">
                        {m.full_name?.charAt(0) || '?'}
                      </div>
                      <div>
                        <p className="font-medium text-brand-dark-teal">{m.full_name}</p>
                        <span className="text-xs font-medium px-2 py-0.5 rounded bg-brand-dark-teal/10 text-brand-dark-teal capitalize">{m.role.replace('_', ' ')}</span>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => setTeamModal(m)} className="p-1.5 rounded-lg hover:bg-gray-100"><Pencil className="w-3.5 h-3.5 text-gray-400" /></button>
                      <button onClick={() => deleteTeamMember(m.id)} className="p-1.5 rounded-lg hover:bg-red-50"><Trash2 className="w-3.5 h-3.5 text-red-400" /></button>
                    </div>
                  </div>
                  {m.company && <p className="text-sm text-brand-slate/50 flex items-center gap-1.5 mb-1"><Building2 className="w-3.5 h-3.5" />{m.company}</p>}
                  {m.email && <p className="text-sm text-brand-slate/50 flex items-center gap-1.5 mb-1"><Mail className="w-3.5 h-3.5" />{m.email}</p>}
                  {m.phone && <p className="text-sm text-brand-slate/50 flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" />{m.phone}</p>}
                </div>
              ))}
            </div>
          )}

          {/* Team member modal */}
          <Modal open={!!teamModal} onClose={() => setTeamModal(null)} title={teamModal?.id ? 'Edit Team Member' : 'Add Team Member'}>
            <div className="space-y-4">
              <div>
                <label className="label">Role</label>
                <select className="input-field" value={teamModal?.role || 'contractor'} onChange={e => setTeamModal(t => t && ({ ...t, role: e.target.value as TeamMember['role'] }))}>
                  {teamRoles.map(r => <option key={r} value={r} className="capitalize">{r.replace('_', ' ')}</option>)}
                </select>
              </div>
              <div><label className="label">Full Name</label><input className="input-field" value={teamModal?.full_name || ''} onChange={e => setTeamModal(t => t && ({ ...t, full_name: e.target.value }))} /></div>
              <div><label className="label">Company</label><input className="input-field" value={teamModal?.company || ''} onChange={e => setTeamModal(t => t && ({ ...t, company: e.target.value }))} /></div>
              <div><label className="label">Email</label><input type="email" className="input-field" value={teamModal?.email || ''} onChange={e => setTeamModal(t => t && ({ ...t, email: e.target.value }))} /></div>
              <div><label className="label">Phone</label><input className="input-field" value={teamModal?.phone || ''} onChange={e => setTeamModal(t => t && ({ ...t, phone: e.target.value }))} /></div>
              <button onClick={saveTeamMember} className="btn-primary w-full">Save</button>
            </div>
          </Modal>
        </div>
      )}

      {/* ==================== UPDATES TAB ==================== */}
      {tab === 'updates' && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-display text-lg text-brand-dark-teal">Progress Updates</h3>
            <button onClick={() => setUpdateModal(true)} className="btn-primary flex items-center gap-2 !text-xs">
              <Send className="w-4 h-4" />Send New Update
            </button>
          </div>

          {updates.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
              <p className="text-brand-slate/40">No updates yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {updates.map(u => (
                <div key={u.id} className="bg-white rounded-2xl border border-gray-100 p-6">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-brand-dark-teal">{u.title}</h4>
                      {u.phase && <span className="text-xs font-medium px-2 py-0.5 rounded bg-brand-mid-teal/10 text-brand-mid-teal capitalize">{u.phase}</span>}
                    </div>
                    <span className="text-xs text-brand-slate/40 flex items-center gap-1"><Calendar className="w-3 h-3" />{formatDate(u.created_at)}</span>
                  </div>
                  <p className="text-sm text-brand-slate/60 whitespace-pre-wrap">{u.description}</p>
                  {u.images && u.images.length > 0 && (
                    <div className="flex gap-2 mt-3 flex-wrap">
                      {u.images.map((img, i) => (
                        <a key={i} href={img} target="_blank" rel="noreferrer" className="block w-20 h-20 rounded-lg overflow-hidden bg-gray-100">
                          <img src={img} alt="" className="w-full h-full object-cover" />
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Send update modal */}
          <Modal open={updateModal} onClose={() => setUpdateModal(false)} title="Send Progress Update">
            <div className="space-y-4">
              <div><label className="label">Title</label><input className="input-field" value={newUpdate.title} onChange={e => setNewUpdate(u => ({ ...u, title: e.target.value }))} placeholder="e.g., Foundation Complete" /></div>
              <div><label className="label">Description</label><textarea rows={4} className="input-field resize-none" value={newUpdate.description} onChange={e => setNewUpdate(u => ({ ...u, description: e.target.value }))} placeholder="Describe what was accomplished..." /></div>
              <div>
                <label className="label">Phase</label>
                <select className="input-field" value={newUpdate.phase} onChange={e => setNewUpdate(u => ({ ...u, phase: e.target.value }))}>
                  <option value="">Select phase...</option>
                  {phases.map(ph => <option key={ph} value={ph}>{ph}</option>)}
                </select>
              </div>
              <div><label className="label">Image URLs (comma separated)</label><input className="input-field" value={newUpdate.images} onChange={e => setNewUpdate(u => ({ ...u, images: e.target.value }))} placeholder="https://..., https://..." /></div>
              <label className="flex items-center gap-2 text-sm text-brand-slate/70 cursor-pointer">
                <input type="checkbox" checked={newUpdate.notify} onChange={e => setNewUpdate(u => ({ ...u, notify: e.target.checked }))} className="rounded border-gray-300 text-brand-dark-teal focus:ring-brand-dark-teal" />
                Notify client via email
              </label>
              <button onClick={sendProgressUpdate} className="btn-primary w-full flex items-center justify-center gap-2"><Send className="w-4 h-4" />Send Update</button>
            </div>
          </Modal>
        </div>
      )}

      {/* ==================== PAYMENTS TAB ==================== */}
      {tab === 'payments' && (
        <div>
          {/* Summary cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {(() => {
              const totalContract = project.total_contract || 0;
              const totalPaid = milestones.filter(m => m.status === 'paid').reduce((s, m) => s + m.amount, 0);
              const remaining = totalContract - totalPaid;
              return (
                <>
                  <div className="bg-white rounded-2xl border border-gray-100 p-6">
                    <p className="text-xs text-brand-slate/40 mb-1">Total Contract</p>
                    <p className="text-2xl font-display text-brand-dark-teal">{formatCurrency(totalContract)}</p>
                  </div>
                  <div className="bg-white rounded-2xl border border-gray-100 p-6">
                    <p className="text-xs text-brand-slate/40 mb-1">Total Paid</p>
                    <p className="text-2xl font-display text-green-600">{formatCurrency(totalPaid)}</p>
                  </div>
                  <div className="bg-white rounded-2xl border border-gray-100 p-6">
                    <p className="text-xs text-brand-slate/40 mb-1">Remaining</p>
                    <p className="text-2xl font-display text-brand-gold">{formatCurrency(remaining)}</p>
                  </div>
                </>
              );
            })()}
          </div>

          <div className="flex items-center justify-between mb-6">
            <h3 className="font-display text-lg text-brand-dark-teal">Payment Milestones</h3>
            <button onClick={() => setMilestoneModal({ title: '', description: '', amount: 0, due_date: '', status: 'upcoming' })} className="btn-primary flex items-center gap-2 !text-xs">
              <Plus className="w-4 h-4" />Add Milestone
            </button>
          </div>

          {milestones.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
              <p className="text-brand-slate/40">No payment milestones yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {milestones.map(m => (
                <div key={m.id} className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h4 className="font-semibold text-brand-dark-teal">{m.title}</h4>
                      <span className={`text-xs font-medium px-2.5 py-0.5 rounded-lg capitalize ${statusBadge(m.status)}`}>{m.status}</span>
                    </div>
                    {m.description && <p className="text-sm text-brand-slate/50">{m.description}</p>}
                    <div className="flex gap-4 mt-2 text-xs text-brand-slate/40">
                      {m.due_date && <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />Due: {formatDate(m.due_date)}</span>}
                      {m.paid_date && <span className="flex items-center gap-1"><CheckCircle className="w-3 h-3 text-green-500" />Paid: {formatDate(m.paid_date)}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="text-lg font-display text-brand-dark-teal">{formatCurrency(m.amount)}</p>
                    <div className="flex gap-1">
                      <button onClick={() => setMilestoneModal(m)} className="p-1.5 rounded-lg hover:bg-gray-100"><Pencil className="w-3.5 h-3.5 text-gray-400" /></button>
                      <button onClick={() => deleteMilestone(m.id)} className="p-1.5 rounded-lg hover:bg-red-50"><Trash2 className="w-3.5 h-3.5 text-red-400" /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Milestone modal */}
          <Modal open={!!milestoneModal} onClose={() => setMilestoneModal(null)} title={milestoneModal?.id ? 'Edit Milestone' : 'Add Milestone'}>
            <div className="space-y-4">
              <div><label className="label">Title</label><input className="input-field" value={milestoneModal?.title || ''} onChange={e => setMilestoneModal(m => m && ({ ...m, title: e.target.value }))} /></div>
              <div><label className="label">Description</label><textarea rows={2} className="input-field resize-none" value={milestoneModal?.description || ''} onChange={e => setMilestoneModal(m => m && ({ ...m, description: e.target.value }))} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="label">Amount</label><input type="number" className="input-field" value={milestoneModal?.amount || ''} onChange={e => setMilestoneModal(m => m && ({ ...m, amount: +e.target.value }))} /></div>
                <div><label className="label">Due Date</label><input type="date" className="input-field" value={milestoneModal?.due_date || ''} onChange={e => setMilestoneModal(m => m && ({ ...m, due_date: e.target.value }))} /></div>
              </div>
              {milestoneModal?.id && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">Status</label>
                    <select className="input-field" value={milestoneModal?.status || 'upcoming'} onChange={e => setMilestoneModal(m => m && ({ ...m, status: e.target.value as PaymentMilestone['status'] }))}>
                      {milestoneStatuses.map(s => <option key={s} value={s} className="capitalize">{s}</option>)}
                    </select>
                  </div>
                  <div><label className="label">Paid Date</label><input type="date" className="input-field" value={milestoneModal?.paid_date || ''} onChange={e => setMilestoneModal(m => m && ({ ...m, paid_date: e.target.value }))} /></div>
                </div>
              )}
              <button onClick={saveMilestone} className="btn-primary w-full">Save Milestone</button>
            </div>
          </Modal>
        </div>
      )}

      {/* ==================== DOCUMENTS TAB ==================== */}
      {tab === 'documents' && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-display text-lg text-brand-dark-teal">Documents</h3>
            <button onClick={() => setDocModal(true)} className="btn-primary flex items-center gap-2 !text-xs">
              <Upload className="w-4 h-4" />Upload Document
            </button>
          </div>

          {documents.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
              <p className="text-brand-slate/40">No documents yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {documents.map(d => (
                <div key={d.id} className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0">
                      <FileText className="w-5 h-5 text-brand-slate/40" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-brand-dark-teal truncate">{d.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        {d.category && <span className={`text-xs font-medium px-2 py-0.5 rounded capitalize ${categoryBadge(d.category)}`}>{d.category}</span>}
                        <span className="text-xs text-brand-slate/40">{d.file_type}</span>
                        <span className="text-xs text-brand-slate/40">{formatDate(d.created_at)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <a href={d.file_url} target="_blank" rel="noreferrer" className="p-2 rounded-lg hover:bg-gray-100"><Download className="w-4 h-4 text-gray-400" /></a>
                    <button onClick={() => deleteDocument(d)} className="p-2 rounded-lg hover:bg-red-50"><Trash2 className="w-4 h-4 text-red-400" /></button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Upload modal */}
          <Modal open={docModal} onClose={() => setDocModal(false)} title="Upload Document">
            <div className="space-y-4">
              <div>
                <label className="label">File</label>
                <input type="file" className="input-field" onChange={e => setDocForm(f => ({ ...f, file: e.target.files?.[0] || null }))} />
              </div>
              <div><label className="label">Document Name</label><input className="input-field" value={docForm.name} onChange={e => setDocForm(f => ({ ...f, name: e.target.value }))} placeholder="Leave blank to use filename" /></div>
              <div>
                <label className="label">Category</label>
                <select className="input-field" value={docForm.category} onChange={e => setDocForm(f => ({ ...f, category: e.target.value }))}>
                  {docCategories.map(c => <option key={c} value={c} className="capitalize">{c}</option>)}
                </select>
              </div>
              <button onClick={uploadDocument} disabled={saving} className="btn-primary w-full flex items-center justify-center gap-2">
                <Upload className="w-4 h-4" />{saving ? 'Uploading...' : 'Upload'}
              </button>
            </div>
          </Modal>
        </div>
      )}
    </div>
  );
}
