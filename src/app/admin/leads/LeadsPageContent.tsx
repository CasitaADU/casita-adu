'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Mail, Phone, Calendar, CheckCircle2, MessageSquare, User2, ChevronDown } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import type { ContactSubmission } from '@/types';

const statusColors: Record<string, string> = {
  new: 'bg-blue-50 text-blue-600 border-blue-200',
  contacted: 'bg-amber-50 text-amber-600 border-amber-200',
  qualified: 'bg-emerald-50 text-emerald-600 border-emerald-200',
  closed: 'bg-gray-100 text-gray-500 border-gray-200',
};

export default function AdminLeads() {
  const [leads, setLeads] = useState<ContactSubmission[]>([]);
  const supabase = createClient();

  const load = async () => {
    const { data } = await supabase.from('contact_submissions').select('*').order('created_at', { ascending: false });
    setLeads(data || []);
  };

  useEffect(() => { load(); }, []);

  const updateStatus = async (id: string, status: string) => {
    await supabase.from('contact_submissions').update({ status }).eq('id', id);
    toast.success(`Status updated to ${status}`);
    load();
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl text-brand-dark-teal mb-1">Leads</h1>
        <p className="text-brand-slate/50 text-sm">Contact form submissions from the website.</p>
      </div>

      <div className="space-y-4">
        {leads.map(lead => (
          <div key={lead.id} className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-brand-dark-teal/5 flex items-center justify-center"><User2 className="w-4 h-4 text-brand-mid-teal" /></div>
                  <div>
                    <h3 className="font-semibold text-brand-dark-teal">{lead.first_name} {lead.last_name}</h3>
                    <div className="flex items-center gap-3 text-xs text-brand-slate/40">
                      <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{lead.email}</span>
                      {lead.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{lead.phone}</span>}
                    </div>
                  </div>
                </div>
                <p className="text-sm text-brand-slate/50 mt-3 bg-gray-50 rounded-xl p-4">{lead.message}</p>
                <div className="flex items-center gap-4 mt-3 text-xs text-brand-slate/30">
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{format(new Date(lead.created_at), 'MMM d, yyyy h:mm a')}</span>
                  {lead.source && <span>Source: {lead.source}</span>}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-medium px-2.5 py-1 rounded-lg border capitalize ${statusColors[lead.status]}`}>{lead.status}</span>
                <select className="input-field !py-1.5 !px-3 !text-xs !w-auto" value={lead.status} onChange={e => updateStatus(lead.id, e.target.value)}>
                  <option value="new">New</option><option value="contacted">Contacted</option><option value="qualified">Qualified</option><option value="closed">Closed</option>
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>
      {leads.length === 0 && <div className="text-center py-20 text-brand-slate/30">No leads yet.</div>}
    </div>
  );
}
