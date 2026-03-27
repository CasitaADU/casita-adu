'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { FolderOpen, HardHat, FileText, Users, TrendingUp, MessageSquare } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ portfolio: 0, projects: 0, blogs: 0, clients: 0, leads: 0, messages: 0 });

  useEffect(() => {
    const load = async () => {
      const supabase = createClient();
      const [p, proj, b, c, l, m] = await Promise.all([
        supabase.from('portfolio_projects').select('id', { count: 'exact', head: true }),
        supabase.from('active_projects').select('id', { count: 'exact', head: true }),
        supabase.from('blog_posts').select('id', { count: 'exact', head: true }),
        supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('role', 'client'),
        supabase.from('contact_submissions').select('id', { count: 'exact', head: true }).eq('status', 'new'),
        supabase.from('client_messages').select('id', { count: 'exact', head: true }).eq('read', false),
      ]);
      setStats({ portfolio: p.count || 0, projects: proj.count || 0, blogs: b.count || 0, clients: c.count || 0, leads: l.count || 0, messages: m.count || 0 });
    };
    load();
  }, []);

  const cards = [
    { label: 'Portfolio Projects', value: stats.portfolio, icon: FolderOpen, href: '/admin/portfolio', color: 'bg-blue-50 text-blue-600' },
    { label: 'Active Projects', value: stats.projects, icon: HardHat, href: '/admin/projects', color: 'bg-amber-50 text-amber-600' },
    { label: 'Blog Posts', value: stats.blogs, icon: FileText, href: '/admin/blog', color: 'bg-purple-50 text-purple-600' },
    { label: 'Clients', value: stats.clients, icon: Users, href: '/admin/clients', color: 'bg-emerald-50 text-emerald-600' },
    { label: 'New Leads', value: stats.leads, icon: TrendingUp, href: '/admin/leads', color: 'bg-rose-50 text-rose-600' },
    { label: 'Unread Messages', value: stats.messages, icon: MessageSquare, href: '/admin/messages', color: 'bg-indigo-50 text-indigo-600' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl text-brand-dark-teal mb-2">Dashboard</h1>
        <p className="text-brand-slate/50">Welcome back. Here&apos;s an overview of your Casita ADU operations.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {cards.map(card => (
          <Link key={card.label} href={card.href} className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg hover:shadow-brand-dark-teal/5 transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl ${card.color} flex items-center justify-center`}><card.icon className="w-6 h-6" /></div>
              <span className="font-display text-3xl text-brand-dark-teal">{card.value}</span>
            </div>
            <p className="text-sm text-brand-slate/50 font-medium">{card.label}</p>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div className="bg-white rounded-2xl p-8 border border-gray-100">
        <h2 className="font-display text-xl text-brand-dark-teal mb-6">Quick Actions</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Add Portfolio Project', href: '/admin/portfolio?action=new', color: 'btn-primary' },
            { label: 'Create Blog Post', href: '/admin/blog?action=new', color: 'btn-secondary' },
            { label: 'Add Progress Update', href: '/admin/projects?action=update', color: 'btn-secondary' },
            { label: 'View New Leads', href: '/admin/leads', color: 'btn-ghost' },
          ].map(action => (
            <Link key={action.label} href={action.href} className={`${action.color} text-center !text-xs`}>{action.label}</Link>
          ))}
        </div>
      </div>
    </div>
  );
}
