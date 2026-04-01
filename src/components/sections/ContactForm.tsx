'use client';

import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Send, MapPin, Phone, Mail, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ContactForm() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ first_name: '', last_name: '', email: '', phone: '', message: '', source: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      if (res.ok) { toast.success('Message sent! We\'ll be in touch soon.'); setForm({ first_name: '', last_name: '', email: '', phone: '', message: '', source: '' }); }
      else toast.error('Something went wrong. Please try again.');
    } catch { toast.error('Network error. Please try again.'); }
    setLoading(false);
  };

  return (
    <section ref={ref} id="contact" className="section-padding bg-brand-cream">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-5 gap-16">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={isInView ? { opacity: 1, x: 0 } : {}} className="lg:col-span-2">
            <span className="text-brand-gold font-semibold text-sm uppercase tracking-widest">Get In Touch</span>
            <h2 className="font-display text-4xl font-bold text-brand-charcoal mt-4 mb-6">Let&apos;s Talk About Your <span className="text-brand-gold italic">Project</span></h2>
            <p className="text-brand-slate/60 leading-relaxed mb-10">Ready to get started? Fill out the form and our team will reach out shortly.</p>
            <div className="space-y-6">
              {[
                { icon: Phone, label: '(619) 891-2065', href: 'tel:6198912065' },
                { icon: Mail, label: 'info@casitaadu.com', href: 'mailto:info@casitaadu.com' },
                { icon: MapPin, label: 'San Diego, California' },
                { icon: Clock, label: 'Mon–Fri 8–6 · Sat 9–3' },
              ].map(({ icon: Icon, label, href }) => (
                <div key={label} className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-brand-dark-teal/5 flex items-center justify-center"><Icon className="w-5 h-5 text-brand-mid-teal" /></div>
                  {href ? <a href={href} className="text-brand-slate/70 hover:text-brand-dark-teal transition-colors">{label}</a> : <span className="text-brand-slate/70">{label}</span>}
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} animate={isInView ? { opacity: 1, x: 0 } : {}} transition={{ delay: 0.2 }} className="lg:col-span-3">
            <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-8 md:p-10 shadow-sm border border-gray-100">
              <div className="grid sm:grid-cols-2 gap-5 mb-5">
                <div><label className="label">First Name *</label><input required className="input-field" value={form.first_name} onChange={e => setForm(f => ({ ...f, first_name: e.target.value }))} /></div>
                <div><label className="label">Last Name *</label><input required className="input-field" value={form.last_name} onChange={e => setForm(f => ({ ...f, last_name: e.target.value }))} /></div>
              </div>
              <div className="grid sm:grid-cols-2 gap-5 mb-5">
                <div><label className="label">Email *</label><input required type="email" className="input-field" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} /></div>
                <div><label className="label">Phone</label><input type="tel" className="input-field" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} /></div>
              </div>
              <div className="mb-5">
                <label className="label">How did you hear about us?</label>
                <select className="input-field" value={form.source} onChange={e => setForm(f => ({ ...f, source: e.target.value }))}>
                  <option value="">Select...</option>
                  <option>Google Search</option><option>Instagram</option><option>Facebook</option><option>Referral</option><option>Real Estate Agent</option><option>Other</option>
                </select>
              </div>
              <div className="mb-6">
                <label className="label">Message *</label>
                <textarea required rows={5} className="input-field resize-none" value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} placeholder="Tell us about your project goals..." />
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50">
                {loading ? 'Sending...' : <><Send className="w-4 h-4" /> Send Message</>}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
