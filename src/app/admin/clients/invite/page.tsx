'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { Send, ArrowLeft, Mail, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import type { ActiveProject, ClientInvite } from '@/types';

const statusIcon: Record<string, React.ReactNode> = {
  pending: <Clock className="w-3.5 h-3.5 text-yellow-500" />,
  accepted: <CheckCircle className="w-3.5 h-3.5 text-green-500" />,
  expired: <AlertCircle className="w-3.5 h-3.5 text-gray-400" />,
};

const statusBadge: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  accepted: 'bg-green-100 text-green-700',
  expired: 'bg-gray-100 text-gray-500',
};

function formatDate(dateStr: string | undefined | null) {
  if (!dateStr) return '--';
  try { return format(new Date(dateStr), 'MMM d, yyyy h:mm a'); } catch { return dateStr; }
}

export default function ClientInvitePage() {
  const supabase = createClient();

  const [email, setEmail] = useState('');
  const [projectId, setProjectId] = useState('');
  const [projects, setProjects] = useState<ActiveProject[]>([]);
  const [invites, setInvites] = useState<(ClientInvite & { project_title?: string })[]>([]);
  const [sending, setSending] = useState(false);

  const load = async () => {
    const [projRes, inviteRes] = await Promise.all([
      supabase.from('active_projects').select('*').order('title'),
      supabase.from('client_invites').select('*').order('created_at', { ascending: false }).limit(20),
    ]);
    setProjects(projRes.data || []);

    // Enrich invites with project titles
    const inviteData = inviteRes.data || [];
    const projectMap = new Map((projRes.data || []).map(p => [p.id, p.title]));
    setInvites(inviteData.map(inv => ({ ...inv, project_title: projectMap.get(inv.project_id) || 'Unknown Project' })));
  };

  useEffect(() => { load(); }, []);

  const sendInvite = async () => {
    if (!email || !projectId) {
      toast.error('Please fill in email and select a project');
      return;
    }
    setSending(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { toast.error('Not authenticated'); setSending(false); return; }

    const res = await fetch('/api/admin/invite', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, project_id: projectId, invited_by: user.id }),
    });

    if (res.ok) {
      const data = await res.json().catch(() => ({}));
      if (data.email_sent) {
        toast.success('Invite sent successfully!');
      } else {
        toast.success(
          (t) => (
            <div>
              <p className="font-medium">Invite created! Email could not be sent.</p>
              <p className="text-xs mt-1 text-gray-500">Share this link manually:</p>
              <input className="text-xs mt-1 w-full bg-gray-100 p-1 rounded" readOnly value={data.invite_url || ''} onClick={(e) => { (e.target as HTMLInputElement).select(); navigator.clipboard.writeText(data.invite_url || ''); toast.dismiss(t.id); toast('Link copied!'); }} />
            </div>
          ),
          { duration: 15000 }
        );
      }
      setEmail('');
      setProjectId('');
      load();
    } else {
      const data = await res.json().catch(() => ({}));
      toast.error(data.error || 'Failed to send invite');
    }
    setSending(false);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/clients" className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
          <ArrowLeft className="w-5 h-5 text-brand-dark-teal" />
        </Link>
        <div>
          <h1 className="font-display text-3xl text-brand-dark-teal">Invite Client</h1>
          <p className="text-brand-slate/50 text-sm">Send a portal invite to a new client.</p>
        </div>
      </div>

      {/* Invite form */}
      <div className="bg-white rounded-2xl border border-gray-100 p-8 max-w-xl mb-10">
        <div className="space-y-5">
          <div>
            <label className="label">Client Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-slate/30" />
              <input
                type="email"
                className="input-field pl-10"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="client@example.com"
              />
            </div>
          </div>
          <div>
            <label className="label">Assign to Project</label>
            <select className="input-field" value={projectId} onChange={e => setProjectId(e.target.value)}>
              <option value="">Select a project...</option>
              {projects.map(p => (
                <option key={p.id} value={p.id}>{p.title} - {p.address}</option>
              ))}
            </select>
          </div>
          <button onClick={sendInvite} disabled={sending} className="btn-primary w-full flex items-center justify-center gap-2">
            <Send className="w-4 h-4" />{sending ? 'Sending...' : 'Send Invite'}
          </button>
        </div>
      </div>

      {/* Recent invites */}
      <div>
        <h2 className="font-display text-xl text-brand-dark-teal mb-4">Recent Invites</h2>
        {invites.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
            <p className="text-brand-slate/40">No invites sent yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {invites.map(inv => (
              <div key={inv.id} className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-9 h-9 rounded-full bg-brand-dark-teal/10 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-4 h-4 text-brand-dark-teal" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-brand-dark-teal truncate">{inv.email}</p>
                    <p className="text-xs text-brand-slate/40">{inv.project_title}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-brand-slate/40">{formatDate(inv.created_at)}</span>
                  <span className={`flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-lg capitalize ${statusBadge[inv.status] || 'bg-gray-100 text-gray-600'}`}>
                    {statusIcon[inv.status]}{inv.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
