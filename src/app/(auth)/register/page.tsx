'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import toast from 'react-hot-toast';
import { User, Mail, Lock, Phone } from 'lucide-react';

export default function RegisterPage() {
  const [form, setForm] = useState({ full_name: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) { toast.error('Passwords do not match'); return; }
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setLoading(true);
    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: { data: { full_name: form.full_name, phone: form.phone, role: 'client' } },
    });
    if (error) { toast.error(error.message); setLoading(false); return; }
    if (data.user) {
      await supabase.from('profiles').upsert({
        id: data.user.id, email: form.email, full_name: form.full_name, phone: form.phone, role: 'client',
      });
      toast.success('Account created! Redirecting...');
      router.push('/portal/dashboard');
      router.refresh();
    }
    setLoading(false);
  };

  const update = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) => setForm(f => ({ ...f, [k]: e.target.value }));

  return (
    <div className="min-h-screen bg-brand-cream flex">
      <div className="hidden lg:flex lg:w-1/2 bg-brand-dark-teal relative items-center justify-center p-16">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        <div className="relative z-10 text-center">
          <div className="w-20 h-20 mx-auto mb-8 rounded-2xl bg-brand-gold flex items-center justify-center"><span className="text-brand-dark-teal font-display text-4xl font-bold">C</span></div>
          <h1 className="font-display text-4xl text-white mb-4">Client Portal</h1>
          <p className="text-white/50 text-lg max-w-md">Create your account to track your project 24/7, view progress updates, access documents, and communicate with our team.</p>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <h2 className="font-display text-3xl text-brand-dark-teal mb-2">Create Account</h2>
          <p className="text-brand-slate/50 mb-8">Set up your client portal access.</p>
          <form onSubmit={handleRegister} className="space-y-5">
            <div><label className="label">Full Name</label><div className="relative"><User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><input required className="input-field !pl-11" value={form.full_name} onChange={update('full_name')} placeholder="Your full name" /></div></div>
            <div><label className="label">Email</label><div className="relative"><Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><input type="email" required className="input-field !pl-11" value={form.email} onChange={update('email')} placeholder="you@email.com" /></div></div>
            <div><label className="label">Phone</label><div className="relative"><Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><input type="tel" className="input-field !pl-11" value={form.phone} onChange={update('phone')} placeholder="(619) 555-0123" /></div></div>
            <div><label className="label">Password</label><div className="relative"><Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><input type="password" required className="input-field !pl-11" value={form.password} onChange={update('password')} placeholder="Min 6 characters" /></div></div>
            <div><label className="label">Confirm Password</label><div className="relative"><Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><input type="password" required className="input-field !pl-11" value={form.confirmPassword} onChange={update('confirmPassword')} placeholder="Confirm password" /></div></div>
            <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">{loading ? 'Creating Account...' : 'Create Account'}</button>
          </form>
          <p className="text-center text-sm text-brand-slate/50 mt-8">Already have an account? <Link href="/login" className="text-brand-mid-teal font-semibold hover:text-brand-dark-teal">Sign In</Link></p>
          <p className="text-center mt-6"><Link href="/" className="text-sm text-brand-slate/40 hover:text-brand-slate/60">← Back to website</Link></p>
        </div>
      </div>
    </div>
  );
}
