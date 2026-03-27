'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { HardHat, FileText, MessageSquare, Clock, CheckCircle2, AlertCircle, ArrowRight, Calendar } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import type { ActiveProject, ProgressUpdate } from '@/types';

export default function ClientDashboard() {
  const [projects, setProjects] = useState<ActiveProject[]>([]);
  const [updates, setUpdates] = useState<ProgressUpdate[]>([]);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [docCount, setDocCount] = useState(0);

  useEffect(() => {
    const load = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: proj } = await supabase.from('active_projects').select('*').eq('client_id', user.id).order('created_at', { ascending: false });
      setProjects(proj || []);

      if (proj && proj.length > 0) {
        const projectIds = proj.map(p => p.id);
        const { data: upd } = await supabase.from('progress_updates').select('*').in('project_id', projectIds).order('created_at', { ascending: false }).limit(5);
        setUpdates(upd || []);
        const { count: mc } = await supabase.from('client_messages').select('id', { count: 'exact', head: true }).in('project_id', projectIds).eq('read', false).eq('sender_role', 'admin');
        setUnreadMessages(mc || 0);
        const { count: dc } = await supabase.from('client_documents').select('id', { count: 'exact', head: true }).in('project_id', projectIds);
        setDocCount(dc || 0);
      }
    };
    load();
  }, []);

  const statusIcon = (status: string) => {
    if (status === 'completed') return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
    if (['construction', 'inspection'].includes(status)) return <HardHat className="w-5 h-5 text-amber-500" />;
    return <Clock className="w-5 h-5 text-blue-500" />;
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl text-brand-dark-teal mb-2">Welcome to Your Dashboard</h1>
        <p className="text-brand-slate/50">Track your ADU project progress in real time, 24/7.</p>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Active Projects', value: projects.filter(p => p.status !== 'completed').length, icon: HardHat, color: 'bg-amber-50 text-amber-600' },
          { label: 'Documents', value: docCount, icon: FileText, color: 'bg-blue-50 text-blue-600' },
          { label: 'Unread Messages', value: unreadMessages, icon: MessageSquare, color: 'bg-purple-50 text-purple-600' },
          { label: 'Updates', value: updates.length, icon: AlertCircle, color: 'bg-emerald-50 text-emerald-600' },
        ].map(s => (
          <div key={s.label} className="portal-card flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl ${s.color} flex items-center justify-center`}><s.icon className="w-5 h-5" /></div>
            <div><p className="font-display text-2xl text-brand-dark-teal">{s.value}</p><p className="text-xs text-brand-slate/40">{s.label}</p></div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Projects */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl text-brand-dark-teal">Your Projects</h2>
            <Link href="/portal/project" className="text-sm text-brand-mid-teal hover:text-brand-dark-teal flex items-center gap-1">View All <ArrowRight className="w-3 h-3" /></Link>
          </div>
          {projects.length === 0 && (
            <div className="portal-card text-center py-12">
              <HardHat className="w-12 h-12 text-brand-slate/20 mx-auto mb-4" />
              <p className="text-brand-slate/40">No projects assigned yet. Your project will appear here once it begins.</p>
            </div>
          )}
          {projects.map(p => (
            <div key={p.id} className="portal-card">
              <div className="flex items-start gap-4">
                {statusIcon(p.status)}
                <div className="flex-1">
                  <h3 className="font-semibold text-brand-dark-teal">{p.title}</h3>
                  <p className="text-sm text-brand-slate/40 mb-3">{p.address}</p>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-brand-mid-teal to-brand-light-teal rounded-full transition-all duration-500" style={{ width: `${p.progress_percent}%` }} />
                    </div>
                    <span className="text-sm font-semibold text-brand-dark-teal">{p.progress_percent}%</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-brand-slate/40">
                    <span className={`px-2.5 py-1 rounded-lg border phase-${p.status} capitalize font-medium`}>{p.status}</span>
                    {p.estimated_completion && <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />Est. {format(new Date(p.estimated_completion), 'MMM yyyy')}</span>}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Updates */}
        <div>
          <h2 className="font-display text-xl text-brand-dark-teal mb-4">Recent Updates</h2>
          {updates.length === 0 && <div className="portal-card text-center py-8"><p className="text-brand-slate/30 text-sm">No updates yet.</p></div>}
          <div className="space-y-3">
            {updates.map(u => (
              <div key={u.id} className="portal-card !p-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`w-2 h-2 rounded-full ${u.phase === 'construction' ? 'bg-amber-400' : u.phase === 'completed' ? 'bg-emerald-400' : 'bg-blue-400'}`} />
                  <span className="text-xs text-brand-slate/40 capitalize">{u.phase}</span>
                  <span className="text-xs text-brand-slate/30 ml-auto">{format(new Date(u.created_at), 'MMM d')}</span>
                </div>
                <p className="font-semibold text-sm text-brand-dark-teal">{u.title}</p>
                <p className="text-xs text-brand-slate/40 mt-1 line-clamp-2">{u.description}</p>
                {u.images?.length > 0 && <div className="flex gap-1 mt-2">{u.images.slice(0, 3).map((img, i) => (
                  <div key={i} className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden"><img src={img} alt="" className="w-full h-full object-cover" /></div>
                ))}</div>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
