'use client';

import { useEffect, useState, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Send, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';
import type { ClientMessage, ActiveProject } from '@/types';

export default function AdminMessages() {
  const [projects, setProjects] = useState<ActiveProject[]>([]);
  const [selectedProject, setSelectedProject] = useState('');
  const [messages, setMessages] = useState<ClientMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [userId, setUserId] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setUserId(user.id);
      const { data } = await supabase.from('active_projects').select('*').order('created_at', { ascending: false });
      setProjects(data || []);
      if (data && data.length > 0) setSelectedProject(data[0].id);
    };
    load();
  }, []);

  useEffect(() => {
    if (!selectedProject) return;
    const loadMessages = async () => {
      const { data } = await supabase.from('client_messages').select('*').eq('project_id', selectedProject).order('created_at', { ascending: true });
      setMessages(data || []);
      await supabase.from('client_messages').update({ read: true }).eq('project_id', selectedProject).eq('sender_role', 'client').eq('read', false);
    };
    loadMessages();
    const channel = supabase.channel(`admin-msgs-${selectedProject}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'client_messages', filter: `project_id=eq.${selectedProject}` },
        (payload) => { setMessages(prev => [...prev, payload.new as ClientMessage]); }
      ).subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [selectedProject]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedProject) return;
    await supabase.from('client_messages').insert({
      project_id: selectedProject, sender_id: userId, sender_name: 'Casita Team',
      sender_role: 'admin', content: newMessage.trim(), read: false, created_at: new Date().toISOString(),
    });
    setNewMessage('');
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-3xl text-brand-dark-teal mb-1">Messages</h1>
        <p className="text-brand-slate/50 text-sm">Respond to client messages for each project.</p>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-20 text-brand-slate/30">No projects with messaging yet.</div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden" style={{ height: 'calc(100vh - 260px)' }}>
          <div className="flex h-full">
            <div className="w-72 border-r border-gray-100 overflow-y-auto">
              <div className="p-3 space-y-1">
                <p className="text-xs font-semibold text-brand-slate/40 uppercase tracking-wider px-3 py-2">Projects</p>
                {projects.map(p => (
                  <button key={p.id} onClick={() => setSelectedProject(p.id)}
                    className={`w-full text-left px-3 py-3 rounded-xl text-sm transition-colors ${selectedProject === p.id ? 'bg-brand-dark-teal/5 text-brand-dark-teal font-medium' : 'text-brand-slate/50 hover:bg-gray-50'}`}>
                    <p className="font-medium truncate">{p.title}</p>
                    <p className="text-xs text-brand-slate/30">{p.client_name || 'Client'}</p>
                  </button>
                ))}
              </div>
            </div>
            <div className="flex-1 flex flex-col">
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.length === 0 && <div className="text-center py-16 text-brand-slate/30 text-sm">No messages for this project yet.</div>}
                {messages.map(m => (
                  <div key={m.id} className={`flex ${m.sender_role === 'admin' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] rounded-2xl px-5 py-3 ${m.sender_role === 'admin' ? 'bg-brand-dark-teal text-white' : 'bg-gray-100 text-brand-slate'}`}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs font-medium ${m.sender_role === 'admin' ? 'text-white/60' : 'text-brand-slate/40'}`}>{m.sender_name}</span>
                        <span className={`text-xs ${m.sender_role === 'admin' ? 'text-white/30' : 'text-brand-slate/30'}`}>{format(new Date(m.created_at), 'h:mm a')}</span>
                      </div>
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{m.content}</p>
                    </div>
                  </div>
                ))}
                <div ref={bottomRef} />
              </div>
              <div className="border-t border-gray-100 p-4 flex gap-3">
                <textarea rows={1} className="input-field flex-1 !rounded-xl resize-none" placeholder="Reply to client..." value={newMessage}
                  onChange={e => setNewMessage(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }} />
                <button onClick={sendMessage} disabled={!newMessage.trim()} className="btn-primary !px-5 !py-3 disabled:opacity-30"><Send className="w-4 h-4" /></button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
