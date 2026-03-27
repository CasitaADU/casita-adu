'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import toast from 'react-hot-toast';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const params = useSearchParams();
  const redirect = params.get('redirect') || '/portal/dashboard';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { toast.error(error.message); setLoading(false); return; }

    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
      router.push(profile?.role === 'admin' ? '/admin' : redirect);
      router.refresh();
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-brand-cream flex">
      {/* Left brand panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-brand-dark-teal relative items-center justify-center p-16">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        <div className="relative z-10 text-center">
          <div className="w-20 h-20 mx-auto mb-8 rounded-2xl bg-brand-gold flex items-center justify-center">
            <span className="text-brand-dark-teal font-display text-4xl font-bold">C</span>
          </div>
          <h1 className="font-display text-4xl text-white mb-4">Welcome Back</h1>
          <p className="text-white/50 text-lg max-w-md">Sign in to access your project dashboard and track your ADU journey in real time.</p>
        </div>
      </div>

      {/* Right form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-10 text-center">
            <Link href="/" className="inline-flex items-center gap-2">
              <div className="w-10 h-10 bg-brand-dark-teal rounded-xl flex items-center justify-center">
                <span className="text-brand-gold font-display text-lg font-bold">C</span>
              </div>
              <span className="font-display text-xl text-brand-dark-teal">CASITA <span className="text-brand-gold">ADU</span></span>
            </Link>
          </div>

          <h2 className="font-display text-3xl text-brand-dark-teal mb-2">Sign In</h2>
          <p className="text-brand-slate/50 mb-8">Enter your credentials to access your account.</p>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="label">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="email" required className="input-field !pl-11" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@email.com" />
              </div>
            </div>
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type={showPw ? 'text' : 'password'} required className="input-field !pl-11 !pr-11" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-sm text-brand-slate/50 mt-8">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-brand-mid-teal font-semibold hover:text-brand-dark-teal">Create Account</Link>
          </p>
          <p className="text-center mt-6">
            <Link href="/" className="text-sm text-brand-slate/40 hover:text-brand-slate/60">← Back to website</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-brand-cream" />}>
      <LoginForm />
    </Suspense>
  );
}
