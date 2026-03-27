'use client';

import { useEffect, useState, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Send, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';
import type { ClientMessage, ActiveProject } from '@/types';

export default function PortalMessages() {
  const [projects, setProjects] = useState<ActiveProject[]>([]);
  const [selectedProject, setSelectedProject] = useState<string>('');
  const [messages, setMessages] = useState<ClientMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [userId, setUserId] = useState('');
  const [userName, setUserName] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setUserId(user.id);
      const { data: profile } = await supabase.from('profiles').select('full_name').eq('id', user.id).single();
      setUserName(profile?.full_name || 'Client');
      const { data: proj } = await supabase.from('active_projects').select('*').eq('client_id', user.id);
      setProjects(proj || []);
      if (proj && proj.length > 0) setSelectedProject(proj[0].id);
    };
    load();
  }, []);

  useEffect(() => {
    if (!selectedProject) return;
    const loadMessages = async () => {
      const { data } = await supabase.from('client_messages').select('*').eq('project_id', selectedProject).order('created_at', { ascending: true });
      setMessages(data || []);
      // Mark admin messages as read
      await supabase.from('client_messages').update({ read: true }).eq('project_id', selectedProject).eq('sender_role', 'admin').eq('read', false);
    };
    loadMessages();

    // Real-time subscription
    const channel = supabase.channel(`messages-${selectedProject}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'client_messages', filter: `project_id=eq.${selectedProject}` },
        (payload) => { setMessages(prev => [...prev, payload.new as ClientMessage]); }
      ).subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [selectedProject]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedProject) return;
    await supabase.from('client_messages').insert({
      project_id: selectedProject, sender_id: userId, sender_name: userName,
      sender_role: 'client', content: newMessage.trim(), read: false, created_at: new Date().toISOString(),
    });
    setNewMessage('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } };

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-3xl text-brand-dark-teal mb-2">Messages</h1>
        <p className="text-brand-slate/50 text-sm">Communicate directly with the Casita team about your project.</p>
      </div>

      {projects.length === 0 ? (
        <div className="portal-card text-center py-16">
          <MessageSquare className="w-12 h-12 text-brand-slate/20 mx-auto mb-4" />
          <p className="text-brand-slate/40">No projects assigned yet. Messages will be available once your project begins.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden" style={{ height: 'calc(100vh - 280px)' }}>
          <div className="flex h-full">
            {/* Project selector sidebar */}
            {projects.length > 1 && (
              <div className="w-64 border-r border-gray-100 p-3 space-y-1 overflow-y-auto hidden md:block">
                <p className="text-xs font-semibold text-brand-slate/40 uppercase tracking-wider px-3 py-2">Projects</p>
                {projects.map(p => (
                  <button key={p.id} onClick={() => setSelectedProject(p.id)}
                    className={`w-full text-left px-3 py-3 rounded-xl text-sm transition-colors ${selectedProject === p.id ? 'bg-brand-dark-teal/5 text-brand-dark-teal font-medium' : 'text-brand-slate/50 hover:bg-gray-50'}`}>
                    <p className="font-medium truncate">{p.title}</p>
                    <p className="text-xs text-brand-slate/30 capitalize">{p.status}</p>
                  </button>
                ))}
              </div>
            )}

            {/* Chat area */}
            <div className="flex-1 flex flex-col">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.length === 0 && (
                  <div className="text-center py-16 text-brand-slate/30 text-sm">
                    No messages yet. Start a conversation with the Casita team!
                  </div>
                )}
                {messages.map(m => (
                  <div key={m.id} className={`flex ${m.sender_role === 'client' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] rounded-2xl px-5 py-3 ${
                      m.sender_role === 'client' ? 'bg-brand-dark-teal text-white' : 'bg-gray-100 text-brand-slate'
                    }`}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs font-medium ${m.sender_role === 'client' ? 'text-white/60' : 'text-brand-slate/40'}`}>{m.sender_name}</span>
                        <span className={`text-xs ${m.sender_role === 'client' ? 'text-white/30' : 'text-brand-slate/30'}`}>
                          {format(new Date(m.created_at), 'h:mm a')}
                        </span>
                      </div>
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{m.content}</p>
                    </div>
                  </div>
                ))}
                <div ref={bottomRef} />
              </div>

              {/* Input */}
              <div className="border-t border-gray-100 p-4">
                <div className="flex gap-3">
                  <textarea
                    rows={1}
                    className="input-field flex-1 !rounded-xl resize-none"
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={e => setNewMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                  <button onClick={sendMessage} disabled={!newMessage.trim()} className="btn-primary !px-5 !py-3 disabled:opacity-30">
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
