'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { LayoutDashboard, FolderOpen, FileText, MessageSquare, Bell, LogOut, Menu, X, User, Settings } from 'lucide-react';

const navLinks = [
  { label: 'Dashboard', href: '/portal/dashboard', icon: LayoutDashboard },
  { label: 'My Projects', href: '/portal/project', icon: FolderOpen },
  { label: 'Documents', href: '/portal/documents', icon: FileText },
  { label: 'Messages', href: '/portal/messages', icon: MessageSquare },
  { label: 'Settings', href: '/portal/settings', icon: Settings },
];

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const load = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
        setProfile(data);
      }
    };
    load();
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top nav bar */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => setMobileOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-gray-100"><Menu className="w-5 h-5" /></button>
            <Link href="/portal/dashboard" className="flex items-center gap-2">
              <div className="w-9 h-9 bg-brand-dark-teal rounded-xl flex items-center justify-center"><span className="text-brand-gold font-display text-lg font-bold">C</span></div>
              <div className="hidden sm:block"><span className="font-display text-brand-dark-teal text-sm">CASITA</span><span className="text-brand-gold text-xs ml-1">CLIENT PORTAL</span></div>
            </Link>
          </div>

          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map(link => (
              <Link key={link.href} href={link.href}
                className={`flex items-center gap-2 px-4 py-2 text-sm rounded-lg transition-colors ${
                  pathname.startsWith(link.href) ? 'bg-brand-dark-teal/5 text-brand-dark-teal font-medium' : 'text-brand-slate/50 hover:text-brand-dark-teal hover:bg-gray-50'
                }`}>
                <link.icon className="w-4 h-4" />{link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-lg hover:bg-gray-100"><Bell className="w-5 h-5 text-brand-slate/50" /></button>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-50">
              <div className="w-7 h-7 rounded-full bg-brand-dark-teal/10 flex items-center justify-center"><User className="w-3.5 h-3.5 text-brand-mid-teal" /></div>
              <span className="hidden sm:block text-sm font-medium text-brand-slate">{profile?.full_name || 'Client'}</span>
            </div>
            <button onClick={handleLogout} className="p-2 rounded-lg hover:bg-red-50 text-brand-slate/40 hover:text-red-500"><LogOut className="w-4 h-4" /></button>
          </div>
        </div>
      </header>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <div className="relative w-72 h-full bg-white p-6">
            <button onClick={() => setMobileOpen(false)} className="absolute top-4 right-4"><X className="w-5 h-5" /></button>
            <div className="space-y-1 mt-10">
              {navLinks.map(link => (
                <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm ${pathname.startsWith(link.href) ? 'bg-brand-dark-teal/5 text-brand-dark-teal font-medium' : 'text-brand-slate/50'}`}>
                  <link.icon className="w-5 h-5" />{link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-6 py-8">{children}</main>
    </div>
  );
}
