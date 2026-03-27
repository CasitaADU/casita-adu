'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { HardHat, Calendar, MapPin, Clock, CheckCircle2, Circle, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import type { ActiveProject, ProgressUpdate } from '@/types';

export default function PortalProject() {
  const [projects, setProjects] = useState<ActiveProject[]>([]);
  const [selectedId, setSelectedId] = useState('');
  const [updates, setUpdates] = useState<ProgressUpdate[]>([]);
  const supabase = createClient();

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase.from('active_projects').select('*').eq('client_id', user.id).order('created_at', { ascending: false });
      setProjects(data || []);
      if (data && data.length > 0) setSelectedId(data[0].id);
    };
    load();
  }, []);

  useEffect(() => {
    if (!selectedId) return;
    const loadUpdates = async () => {
      const { data } = await supabase.from('progress_updates').select('*').eq('project_id', selectedId).order('created_at', { ascending: false });
      setUpdates(data || []);
    };
    loadUpdates();

    // Real-time updates
    const channel = supabase.channel(`updates-${selectedId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'progress_updates', filter: `project_id=eq.${selectedId}` },
        (payload) => { setUpdates(prev => [payload.new as ProgressUpdate, ...prev]); }
      ).subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [selectedId]);

  const project = projects.find(p => p.id === selectedId);
  const phases = ['planning', 'permitting', 'design', 'construction', 'inspection', 'completed'];
  const currentPhaseIdx = project ? phases.indexOf(project.status) : 0;

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl text-brand-dark-teal mb-2">My Projects</h1>
        <p className="text-brand-slate/50 text-sm">View detailed project progress, timeline, and photo updates.</p>
      </div>

      {projects.length === 0 ? (
        <div className="portal-card text-center py-16">
          <HardHat className="w-12 h-12 text-brand-slate/20 mx-auto mb-4" />
          <p className="text-brand-slate/40">No projects assigned yet.</p>
        </div>
      ) : (
        <>
          {/* Project tabs */}
          {projects.length > 1 && (
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
              {projects.map(p => (
                <button key={p.id} onClick={() => setSelectedId(p.id)}
                  className={`px-5 py-2.5 rounded-xl text-sm whitespace-nowrap transition-all ${selectedId === p.id ? 'bg-brand-dark-teal text-white font-medium' : 'bg-white text-brand-slate/50 border border-gray-100 hover:bg-gray-50'}`}>
                  {p.title}
                </button>
              ))}
            </div>
          )}

          {project && (
            <div className="space-y-8">
              {/* Project overview card */}
              <div className="portal-card">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                  <div>
                    <h2 className="font-display text-2xl text-brand-dark-teal">{project.title}</h2>
                    <div className="flex items-center gap-4 text-sm text-brand-slate/40 mt-1">
                      <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" />{project.address}</span>
                      {project.estimated_completion && <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" />Est. {format(new Date(project.estimated_completion), 'MMMM yyyy')}</span>}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-display text-4xl text-brand-dark-teal">{project.progress_percent}%</p>
                    <p className="text-xs text-brand-slate/40">Complete</p>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden mb-8">
                  <div className="h-full bg-gradient-to-r from-brand-dark-teal via-brand-mid-teal to-brand-gold rounded-full transition-all duration-1000"
                    style={{ width: `${project.progress_percent}%` }} />
                </div>

                {/* Phase timeline */}
                <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
                  {phases.map((phase, i) => (
                    <div key={phase} className={`text-center p-3 rounded-xl border transition-all ${
                      i < currentPhaseIdx ? 'bg-emerald-50 border-emerald-200' :
                      i === currentPhaseIdx ? 'bg-brand-gold/10 border-brand-gold ring-2 ring-brand-gold/20' :
                      'bg-gray-50 border-gray-100'
                    }`}>
                      <div className="flex justify-center mb-2">
                        {i < currentPhaseIdx ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> :
                         i === currentPhaseIdx ? <Clock className="w-5 h-5 text-brand-gold" /> :
                         <Circle className="w-5 h-5 text-gray-300" />}
                      </div>
                      <p className={`text-xs font-medium capitalize ${
                        i <= currentPhaseIdx ? 'text-brand-dark-teal' : 'text-brand-slate/30'
                      }`}>{phase}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Progress Updates Timeline */}
              <div>
                <h3 className="font-display text-xl text-brand-dark-teal mb-4">Progress Updates</h3>
                {updates.length === 0 ? (
                  <div className="portal-card text-center py-12 text-brand-slate/30 text-sm">No updates posted yet. Check back soon!</div>
                ) : (
                  <div className="space-y-1">
                    {updates.map((u, i) => (
                      <div key={u.id} className="flex gap-4">
                        {/* Timeline line */}
                        <div className="flex flex-col items-center">
                          <div className={`w-3 h-3 rounded-full mt-1.5 ${i === 0 ? 'bg-brand-gold ring-4 ring-brand-gold/20' : 'bg-brand-mid-teal'}`} />
                          {i < updates.length - 1 && <div className="w-0.5 flex-1 bg-gray-200 my-1" />}
                        </div>
                        <div className="portal-card flex-1 mb-4">
                          <div className="flex items-center gap-3 mb-2">
                            <span className={`text-xs font-medium px-2.5 py-1 rounded-lg border phase-${u.phase} capitalize`}>{u.phase}</span>
                            <span className="text-xs text-brand-slate/30">{format(new Date(u.created_at), 'MMM d, yyyy · h:mm a')}</span>
                          </div>
                          <h4 className="font-semibold text-brand-dark-teal mb-1">{u.title}</h4>
                          <p className="text-sm text-brand-slate/50 leading-relaxed">{u.description}</p>
                          {u.images?.length > 0 && (
                            <div className="flex gap-2 mt-3 overflow-x-auto">
                              {u.images.map((img, j) => (
                                <div key={j} className="w-24 h-24 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0">
                                  <img src={img} alt={`Update ${j + 1}`} className="w-full h-full object-cover" />
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
