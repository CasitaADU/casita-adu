'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Save, User, Building } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminSettings() {
  const [profile, setProfile] = useState({ full_name: '', email: '', phone: '' });

  useEffect(() => {
    const load = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
        if (data) setProfile({ full_name: data.full_name, email: data.email, phone: data.phone || '' });
      }
    };
    load();
  }, []);

  const save = async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from('profiles').update({ full_name: profile.full_name, phone: profile.phone }).eq('id', user.id);
      toast.success('Settings saved');
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl text-brand-dark-teal mb-1">Settings</h1>
        <p className="text-brand-slate/50 text-sm">Manage your admin profile and site settings.</p>
      </div>

      <div className="max-w-2xl space-y-8">
        <div className="bg-white rounded-2xl border border-gray-100 p-8">
          <div className="flex items-center gap-3 mb-6">
            <User className="w-5 h-5 text-brand-mid-teal" />
            <h2 className="font-display text-xl text-brand-dark-teal">Profile</h2>
          </div>
          <div className="space-y-4">
            <div><label className="label">Full Name</label><input className="input-field" value={profile.full_name} onChange={e => setProfile(p => ({ ...p, full_name: e.target.value }))} /></div>
            <div><label className="label">Email</label><input className="input-field bg-gray-50" value={profile.email} disabled /></div>
            <div><label className="label">Phone</label><input className="input-field" value={profile.phone} onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))} /></div>
            <button onClick={save} className="btn-primary flex items-center gap-2"><Save className="w-4 h-4" /> Save Changes</button>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-8">
          <div className="flex items-center gap-3 mb-6">
            <Building className="w-5 h-5 text-brand-mid-teal" />
            <h2 className="font-display text-xl text-brand-dark-teal">Company Info</h2>
          </div>
          <div className="text-sm text-brand-slate/50 space-y-2">
            <p><strong>Company:</strong> Casita</p>
            <p><strong>Phone:</strong> (619) 891-2065</p>
            <p><strong>Email:</strong> info@casitaadu.com</p>
            <p><strong>Hours:</strong> Mon–Fri 8AM–6PM · Sat 9AM–3PM · Sun Closed</p>
          </div>
        </div>
      </div>
    </div>
  );
}
