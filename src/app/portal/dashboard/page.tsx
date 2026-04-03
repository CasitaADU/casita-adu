'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { FileText, MessageSquare, HardHat, ChevronDown, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import type { ActiveProject } from '@/types';
import ProjectInfoHeader from '@/components/portal/ProjectInfoHeader';
import ProgressHouse from '@/components/portal/ProgressHouse';
import UpdatesFeed from '@/components/portal/UpdatesFeed';
import PaymentTracker from '@/components/portal/PaymentTracker';

export default function ClientDashboard() {
  const [projects, setProjects] = useState<ActiveProject[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [docCount, setDocCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const load = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get user profile name
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', user.id)
        .single();
      if (profile?.full_name) setUserName(profile.full_name.split(' ')[0]);

      // Fetch projects
      const { data: proj } = await supabase
        .from('active_projects')
        .select('*')
        .eq('client_id', user.id)
        .order('created_at', { ascending: false });

      setProjects(proj || []);
      if (proj && proj.length > 0) {
        setSelectedProjectId(proj[0].id);

        const projectIds = proj.map(p => p.id);

        // Fetch counts in parallel
        const [msgResult, docResult] = await Promise.all([
          supabase
            .from('client_messages')
            .select('id', { count: 'exact', head: true })
            .in('project_id', projectIds)
            .eq('read', false)
            .eq('sender_role', 'admin'),
          supabase
            .from('client_documents')
            .select('id', { count: 'exact', head: true })
            .in('project_id', projectIds),
        ]);

        setUnreadMessages(msgResult.count || 0);
        setDocCount(docResult.count || 0);
      }

      setLoading(false);
    };
    load();
  }, []);

  const selectedProject = projects.find(p => p.id === selectedProjectId) || null;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-8 h-8 border-2 border-brand-dark-teal/20 border-t-brand-dark-teal rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      {/* Welcome heading */}
      <div className="mb-8">
        <h1 className="font-display text-3xl text-brand-dark-teal mb-2">
          Welcome back{userName ? `, ${userName}` : ''}
        </h1>
        <p className="text-brand-slate/50">
          Track your ADU project progress in real time, 24/7.
        </p>
      </div>

      {/* Multi-project selector */}
      {projects.length > 1 && (
        <div className="mb-6">
          <label className="block text-xs font-medium text-brand-slate/40 mb-1.5">
            Select Project
          </label>
          <div className="relative w-full max-w-xs">
            <select
              value={selectedProjectId || ''}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="w-full appearance-none bg-white border border-gray-200 rounded-xl px-4 py-2.5 pr-10 text-sm font-medium text-brand-dark-teal focus:outline-none focus:ring-2 focus:ring-brand-mid-teal/30 focus:border-brand-mid-teal"
            >
              {projects.map(p => (
                <option key={p.id} value={p.id}>
                  {p.title} &mdash; {p.address}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-brand-slate/40 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      )}

      {/* Empty state */}
      {projects.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="portal-card text-center py-16 px-8"
        >
          <div className="w-16 h-16 rounded-2xl bg-brand-dark-teal/5 flex items-center justify-center mx-auto mb-5">
            <HardHat className="w-8 h-8 text-brand-slate/25" />
          </div>
          <h2 className="font-display text-xl text-brand-dark-teal mb-2">
            No projects yet
          </h2>
          <p className="text-brand-slate/40 max-w-md mx-auto">
            Your ADU project will appear here once it begins. In the meantime,
            feel free to explore the portal or reach out to our team with any questions.
          </p>
        </motion.div>
      )}

      {/* Single / selected project view */}
      {selectedProject && (
        <>
          {/* Project Info Header */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.05 }}
          >
            <ProjectInfoHeader projectId={selectedProject.id} />
          </motion.div>

          {/* Two-column grid */}
          <div className="grid lg:grid-cols-5 gap-8 mt-8">
            {/* Left column (~60%) */}
            <motion.div
              className="lg:col-span-3 space-y-8"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.1 }}
            >
              <ProgressHouse progressPercent={selectedProject.progress_percent} />
              <UpdatesFeed projectId={selectedProject.id} />
            </motion.div>

            {/* Right column (~40%) */}
            <motion.div
              className="lg:col-span-2 space-y-8"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.15 }}
            >
              <PaymentTracker projectId={selectedProject.id} />

              {/* Quick Links card */}
              <div className="portal-card">
                <h3 className="font-display text-lg text-brand-dark-teal mb-4">
                  Quick Links
                </h3>
                <div className="space-y-3">
                  <Link
                    href="/portal/documents"
                    className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-brand-dark-teal/5 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
                        <FileText className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-brand-dark-teal">Documents</p>
                        <p className="text-xs text-brand-slate/40">
                          {docCount} {docCount === 1 ? 'file' : 'files'} available
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-brand-slate/30 group-hover:text-brand-mid-teal transition-colors" />
                  </Link>

                  <Link
                    href="/portal/messages"
                    className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-brand-dark-teal/5 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-purple-50 flex items-center justify-center">
                        <MessageSquare className="w-4 h-4 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-brand-dark-teal">Messages</p>
                        <p className="text-xs text-brand-slate/40">
                          {unreadMessages > 0
                            ? `${unreadMessages} unread ${unreadMessages === 1 ? 'message' : 'messages'}`
                            : 'No unread messages'}
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-brand-slate/30 group-hover:text-brand-mid-teal transition-colors" />
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </motion.div>
  );
}
