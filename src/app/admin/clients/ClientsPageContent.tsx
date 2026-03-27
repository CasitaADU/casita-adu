'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Users, Mail, Phone, Calendar } from 'lucide-react';
import type { Profile } from '@/types';
import { format } from 'date-fns';

export default function AdminClients() {
  const [clients, setClients] = useState<Profile[]>([]);
  const supabase = createClient();

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from('profiles').select('*').eq('role', 'client').order('created_at', { ascending: false });
      setClients(data || []);
    };
    load();
  }, []);

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl text-brand-dark-teal mb-1">Clients</h1>
        <p className="text-brand-slate/50 text-sm">View and manage registered client accounts.</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-6 py-4 text-xs font-semibold text-brand-slate/40 uppercase tracking-wider">Client</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-brand-slate/40 uppercase tracking-wider">Contact</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-brand-slate/40 uppercase tracking-wider">Joined</th>
              </tr>
            </thead>
            <tbody>
              {clients.map(c => (
                <tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-brand-dark-teal/5 flex items-center justify-center"><Users className="w-4 h-4 text-brand-mid-teal" /></div>
                      <div><p className="font-medium text-brand-dark-teal text-sm">{c.full_name}</p><p className="text-xs text-brand-slate/40">{c.id.slice(0, 8)}...</p></div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-sm text-brand-slate/60"><Mail className="w-3 h-3" />{c.email}</div>
                      {c.phone && <div className="flex items-center gap-1.5 text-sm text-brand-slate/40"><Phone className="w-3 h-3" />{c.phone}</div>}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-sm text-brand-slate/40">
                      <Calendar className="w-3 h-3" />{c.created_at ? format(new Date(c.created_at), 'MMM d, yyyy') : 'N/A'}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {clients.length === 0 && <div className="text-center py-16 text-brand-slate/30">No registered clients yet.</div>}
      </div>
    </div>
  );
}
