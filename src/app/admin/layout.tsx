'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import {
  LayoutDashboard, FolderOpen, HardHat, FileText, Users, MessageSquare, Settings, LogOut, Menu, X, ChevronRight, Image, UserPlus,
} from 'lucide-react';

const sidebarLinks = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Portfolio', href: '/admin/portfolio', icon: Image },
  { label: 'Active Projects', href: '/admin/projects', icon: HardHat },
  { label: 'Blog Posts', href: '/admin/blog', icon: FileText },
  { label: 'Clients', href: '/admin/clients', icon: Users },
  { label: 'Invite Client', href: '/admin/clients/invite', icon: UserPlus },
  { label: 'Messages', href: '/admin/messages', icon: MessageSquare },
  { label: 'Leads', href: '/admin/leads', icon: FolderOpen },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  const isActive = (href: string) => pathname === href || (href !== '/admin' && pathname.startsWith(href));

  const Sidebar = ({ mobile = false }: { mobile?: boolean }) => (
    <div className={`${mobile ? 'w-72' : collapsed ? 'w-20' : 'w-64'} bg-brand-dark-teal h-screen flex flex-col transition-all duration-300`}>
      {/* Header */}
      <div className="p-5 flex items-center justify-between border-b border-white/10">
        {!collapsed && (
          <Link href="/admin" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-brand-gold rounded-xl flex items-center justify-center"><span className="text-brand-dark-teal font-display text-lg font-bold">C</span></div>
            <div><span className="font-display text-white text-sm">CASITA</span><span className="text-brand-gold text-xs ml-1">ADMIN</span></div>
          </Link>
        )}
        {collapsed && <div className="w-9 h-9 bg-brand-gold rounded-xl flex items-center justify-center mx-auto"><span className="text-brand-dark-teal font-display text-lg font-bold">C</span></div>}
        {mobile && <button onClick={() => setMobileOpen(false)} className="text-white/50 hover:text-white"><X className="w-5 h-5" /></button>}
      </div>

      {/* Nav links */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {sidebarLinks.map(link => (
          <Link key={link.href} href={link.href} onClick={() => mobile && setMobileOpen(false)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
              isActive(link.href) ? 'bg-white/10 text-white font-medium' : 'text-white/50 hover:text-white hover:bg-white/5'
            } ${collapsed && !mobile ? 'justify-center' : ''}`}>
            <link.icon className="w-5 h-5 flex-shrink-0" />
            {(!collapsed || mobile) && <span>{link.label}</span>}
            {isActive(link.href) && (!collapsed || mobile) && <ChevronRight className="w-4 h-4 ml-auto" />}
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-white/10 space-y-1">
        <Link href="/admin/settings" className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/50 hover:text-white hover:bg-white/5 ${collapsed && !mobile ? 'justify-center' : ''}`}>
          <Settings className="w-5 h-5" />{(!collapsed || mobile) && 'Settings'}
        </Link>
        <button onClick={handleLogout} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-400/70 hover:text-red-400 hover:bg-red-400/10 ${collapsed && !mobile ? 'justify-center' : ''}`}>
          <LogOut className="w-5 h-5" />{(!collapsed || mobile) && 'Sign Out'}
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Desktop sidebar */}
      <div className="hidden lg:block fixed left-0 top-0 h-screen z-40">
        <Sidebar />
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <div className="relative z-10 h-full"><Sidebar mobile /></div>
        </div>
      )}

      {/* Main content */}
      <div className={`flex-1 ${collapsed ? 'lg:ml-20' : 'lg:ml-64'} transition-all duration-300`}>
        {/* Top bar */}
        <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-gray-100 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => setMobileOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-gray-100"><Menu className="w-5 h-5" /></button>
            <button onClick={() => setCollapsed(!collapsed)} className="hidden lg:block p-2 rounded-lg hover:bg-gray-100"><Menu className="w-5 h-5" /></button>
            <h1 className="font-semibold text-brand-dark-teal capitalize">{pathname.split('/').pop() || 'Dashboard'}</h1>
          </div>
          <Link href="/" target="_blank" className="text-sm text-brand-slate/40 hover:text-brand-slate/60">View Site →</Link>
        </div>

        {/* Page content */}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
