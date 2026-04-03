'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { User, Mail, Phone, Save, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import type { Profile } from '@/types';

export default function PortalSettings() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ full_name: '', email: '', phone: '' });

  useEffect(() => {
    const load = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      if (data) {
        setProfile(data);
        setForm({ full_name: data.full_name || '', email: data.email || '', phone: data.phone || '' });
      }
      setLoading(false);
    };
    load();
  }, []);

  const handleSave = async () => {
    if (!profile) return;
    setSaving(true);
    const supabase = createClient();
    const { error } = await supabase.from('profiles').update({
      full_name: form.full_name,
      phone: form.phone,
      updated_at: new Date().toISOString(),
    }).eq('id', profile.id);
    setSaving(false);
    if (error) {
      toast.error('Failed to save changes');
    } else {
      toast.success('Profile updated!');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-brand-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl text-brand-dark-teal mb-2">Account Settings</h1>
        <p className="text-brand-slate/50">Manage your contact information.</p>
      </div>

      <div className="max-w-2xl">
        <div className="bg-white rounded-2xl border border-gray-100 p-8">
          <div className="space-y-6">
            {/* Name */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-brand-dark-teal mb-2">
                <User className="w-4 h-4 text-brand-slate/40" /> Full Name
              </label>
              <input
                type="text"
                className="input-field"
                value={form.full_name}
                onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))}
              />
            </div>

            {/* Email (read-only) */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-brand-dark-teal mb-2">
                <Mail className="w-4 h-4 text-brand-slate/40" /> Email Address
              </label>
              <input
                type="email"
                className="input-field bg-gray-50 cursor-not-allowed"
                value={form.email}
                readOnly
              />
              <p className="text-xs text-brand-slate/30 mt-1">Email cannot be changed. Contact us if you need to update it.</p>
            </div>

            {/* Phone */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-brand-dark-teal mb-2">
                <Phone className="w-4 h-4 text-brand-slate/40" /> Phone Number
              </label>
              <input
                type="tel"
                className="input-field"
                value={form.phone}
                onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                placeholder="(555) 123-4567"
              />
            </div>

            <button
              onClick={handleSave}
              disabled={saving}
              className="btn-primary flex items-center justify-center gap-2 w-full"
            >
              {saving ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>

        {/* Account info */}
        <div className="mt-6 bg-white rounded-2xl border border-gray-100 p-8">
          <h3 className="font-display text-lg text-brand-dark-teal mb-4">Account Information</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-brand-slate/50">Account Type</span>
              <span className="font-medium text-brand-dark-teal capitalize">{profile?.role || 'Client'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-brand-slate/50">Member Since</span>
              <span className="font-medium text-brand-dark-teal">
                {profile?.created_at ? new Date(profile.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : '—'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
