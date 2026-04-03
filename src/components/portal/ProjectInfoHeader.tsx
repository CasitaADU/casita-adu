'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import {
  MapPin, BedDouble, Bath, Ruler, Home, Pencil, Save, X,
  User, Building2, Mail, Phone,
} from 'lucide-react';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import type { ActiveProject, TeamMember, Profile } from '@/types';

interface ProjectInfoHeaderProps {
  projectId: string;
}

export default function ProjectInfoHeader({ projectId }: ProjectInfoHeaderProps) {
  const [project, setProject] = useState<ActiveProject | null>(null);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [editing, setEditing] = useState(false);
  const [editPhone, setEditPhone] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const [projectRes, teamRes, profileRes] = await Promise.all([
        supabase.from('active_projects').select('*').eq('id', projectId).single(),
        supabase.from('team_members').select('*').eq('project_id', projectId),
        supabase.from('profiles').select('*').eq('id', user.id).single(),
      ]);

      setProject(projectRes.data);
      setTeam(teamRes.data || []);
      if (profileRes.data) {
        setProfile(profileRes.data);
        setEditPhone(profileRes.data.phone || '');
        setEditEmail(profileRes.data.email || '');
      }
      setLoading(false);
    };
    load();
  }, [projectId]);

  const handleSave = async () => {
    if (!profile) return;
    setSaving(true);
    const supabase = createClient();
    const { error } = await supabase
      .from('profiles')
      .update({ phone: editPhone, email: editEmail, updated_at: new Date().toISOString() })
      .eq('id', profile.id);

    if (!error) {
      setProfile({ ...profile, phone: editPhone, email: editEmail });
      setEditing(false);
    }
    setSaving(false);
  };

  const handleCancel = () => {
    setEditPhone(profile?.phone || '');
    setEditEmail(profile?.email || '');
    setEditing(false);
  };

  const contractor = team.find(t => t.role === 'contractor');
  const pm = team.find(t => t.role === 'project_manager');

  if (loading) {
    return (
      <div className="animate-pulse rounded-2xl bg-white border border-gray-100 p-8">
        <div className="h-6 bg-gray-100 rounded w-1/3 mb-4" />
        <div className="h-4 bg-gray-100 rounded w-1/2" />
      </div>
    );
  }

  if (!project) return null;

  const statusColors: Record<string, string> = {
    planning: 'bg-blue-50 text-blue-700 border-blue-200',
    permitting: 'bg-purple-50 text-purple-700 border-purple-200',
    design: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    construction: 'bg-amber-50 text-amber-700 border-amber-200',
    inspection: 'bg-orange-50 text-orange-700 border-orange-200',
    completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden"
    >
      {/* Top accent bar */}
      <div className="h-1 bg-gradient-to-r from-brand-dark-teal via-brand-mid-teal to-brand-gold" />

      <div className="p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Project Details */}
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h2 className="font-display text-2xl text-brand-dark-teal">{project.title}</h2>
                <span className={`px-2.5 py-0.5 rounded-lg border text-xs font-medium capitalize ${statusColors[project.status] || 'bg-gray-50 text-gray-600'}`}>
                  {project.status}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-brand-slate/50 text-sm">
                <MapPin className="w-3.5 h-3.5" />
                <span>{project.address}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {project.sqft && (
                <div className="flex items-center gap-2 text-sm text-brand-charcoal">
                  <div className="w-8 h-8 rounded-lg bg-brand-cream flex items-center justify-center">
                    <Ruler className="w-4 h-4 text-brand-mid-teal" />
                  </div>
                  <div>
                    <p className="font-semibold">{project.sqft.toLocaleString()}</p>
                    <p className="text-xs text-brand-slate/40">sq ft</p>
                  </div>
                </div>
              )}
              {project.bedrooms != null && (
                <div className="flex items-center gap-2 text-sm text-brand-charcoal">
                  <div className="w-8 h-8 rounded-lg bg-brand-cream flex items-center justify-center">
                    <BedDouble className="w-4 h-4 text-brand-mid-teal" />
                  </div>
                  <div>
                    <p className="font-semibold">{project.bedrooms}</p>
                    <p className="text-xs text-brand-slate/40">bed</p>
                  </div>
                </div>
              )}
              {project.bathrooms != null && (
                <div className="flex items-center gap-2 text-sm text-brand-charcoal">
                  <div className="w-8 h-8 rounded-lg bg-brand-cream flex items-center justify-center">
                    <Bath className="w-4 h-4 text-brand-mid-teal" />
                  </div>
                  <div>
                    <p className="font-semibold">{project.bathrooms}</p>
                    <p className="text-xs text-brand-slate/40">bath</p>
                  </div>
                </div>
              )}
              {project.build_type && (
                <div className="flex items-center gap-2 text-sm text-brand-charcoal">
                  <div className="w-8 h-8 rounded-lg bg-brand-cream flex items-center justify-center">
                    <Home className="w-4 h-4 text-brand-mid-teal" />
                  </div>
                  <div>
                    <p className="font-semibold capitalize">{project.build_type}</p>
                    <p className="text-xs text-brand-slate/40">type</p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-6 text-xs text-brand-slate/40 pt-2 border-t border-gray-50">
              {project.start_date && (
                <span>Started {format(new Date(project.start_date), 'MMM d, yyyy')}</span>
              )}
              {project.estimated_completion && (
                <span>Est. completion {format(new Date(project.estimated_completion), 'MMM yyyy')}</span>
              )}
            </div>
          </div>

          {/* Middle: Team Info */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-brand-slate/40">Project Team</h3>

            {contractor && (
              <div className="rounded-xl border border-gray-100 p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-brand-gold/10 flex items-center justify-center">
                    <Building2 className="w-4 h-4 text-brand-gold" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-brand-dark-teal">{contractor.full_name}</p>
                    <p className="text-xs text-brand-slate/40">Contractor</p>
                  </div>
                </div>
                {contractor.company && (
                  <p className="text-xs text-brand-slate/50 pl-10">{contractor.company}</p>
                )}
                <div className="pl-10 space-y-1">
                  {contractor.email && (
                    <p className="text-xs text-brand-slate/50 flex items-center gap-1.5">
                      <Mail className="w-3 h-3" /> {contractor.email}
                    </p>
                  )}
                  {contractor.phone && (
                    <p className="text-xs text-brand-slate/50 flex items-center gap-1.5">
                      <Phone className="w-3 h-3" /> {contractor.phone}
                    </p>
                  )}
                </div>
              </div>
            )}

            {pm && (
              <div className="rounded-xl border border-gray-100 p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-brand-mid-teal/10 flex items-center justify-center">
                    <User className="w-4 h-4 text-brand-mid-teal" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-brand-dark-teal">{pm.full_name}</p>
                    <p className="text-xs text-brand-slate/40">Project Manager</p>
                  </div>
                </div>
                {pm.company && (
                  <p className="text-xs text-brand-slate/50 pl-10">{pm.company}</p>
                )}
                <div className="pl-10 space-y-1">
                  {pm.email && (
                    <p className="text-xs text-brand-slate/50 flex items-center gap-1.5">
                      <Mail className="w-3 h-3" /> {pm.email}
                    </p>
                  )}
                  {pm.phone && (
                    <p className="text-xs text-brand-slate/50 flex items-center gap-1.5">
                      <Phone className="w-3 h-3" /> {pm.phone}
                    </p>
                  )}
                </div>
              </div>
            )}

            {!contractor && !pm && (
              <div className="rounded-xl border border-dashed border-gray-200 p-6 text-center">
                <User className="w-8 h-8 text-brand-slate/20 mx-auto mb-2" />
                <p className="text-xs text-brand-slate/40">Team members will appear here once assigned.</p>
              </div>
            )}
          </div>

          {/* Right: Client Info */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-brand-slate/40">Your Contact Info</h3>
              {!editing && (
                <button
                  onClick={() => setEditing(true)}
                  className="flex items-center gap-1 text-xs text-brand-mid-teal hover:text-brand-dark-teal transition-colors"
                >
                  <Pencil className="w-3 h-3" /> Edit
                </button>
              )}
            </div>

            <div className="rounded-xl border border-gray-100 p-4">
              {profile && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-brand-dark-teal/10 flex items-center justify-center">
                      <User className="w-5 h-5 text-brand-dark-teal" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-brand-dark-teal">{profile.full_name}</p>
                      <p className="text-xs text-brand-slate/40 capitalize">{profile.role}</p>
                    </div>
                  </div>

                  <AnimatePresence mode="wait">
                    {editing ? (
                      <motion.div
                        key="edit"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-3"
                      >
                        <div>
                          <label className="text-xs text-brand-slate/40 mb-1 block">Email</label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-brand-slate/30" />
                            <input
                              type="email"
                              value={editEmail}
                              onChange={(e) => setEditEmail(e.target.value)}
                              className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-200 focus:border-brand-mid-teal focus:ring-1 focus:ring-brand-mid-teal/20 outline-none transition-all"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="text-xs text-brand-slate/40 mb-1 block">Phone</label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-brand-slate/30" />
                            <input
                              type="tel"
                              value={editPhone}
                              onChange={(e) => setEditPhone(e.target.value)}
                              className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-200 focus:border-brand-mid-teal focus:ring-1 focus:ring-brand-mid-teal/20 outline-none transition-all"
                            />
                          </div>
                        </div>
                        <div className="flex items-center gap-2 pt-1">
                          <button
                            onClick={handleSave}
                            disabled={saving}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-dark-teal text-white text-xs font-medium rounded-lg hover:bg-brand-dark-teal/90 transition-colors disabled:opacity-50"
                          >
                            <Save className="w-3 h-3" />
                            {saving ? 'Saving...' : 'Save'}
                          </button>
                          <button
                            onClick={handleCancel}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-brand-slate/50 text-xs font-medium rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            <X className="w-3 h-3" /> Cancel
                          </button>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="display"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-2"
                      >
                        <p className="text-sm text-brand-charcoal flex items-center gap-2">
                          <Mail className="w-3.5 h-3.5 text-brand-slate/30" />
                          {profile.email}
                        </p>
                        <p className="text-sm text-brand-charcoal flex items-center gap-2">
                          <Phone className="w-3.5 h-3.5 text-brand-slate/30" />
                          {profile.phone || 'Not set'}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
