'use client';

import { motion } from 'framer-motion';
import { Users, Award, Heart, Shield } from 'lucide-react';

const team = [
  { name: 'Winston Bodkin', title: 'Founder & COO', email: 'Winston@Casitaadu.com', desc: 'Oversees overall company vision, operations, and strategic direction.' },
  { name: 'Sondra Hooley', title: 'Co-Founder & CRO', email: 'Sondra@Casitaadu.com', desc: 'Sales Director leading client acquisition, relationship management, and sales strategy.' },
  { name: 'Jon Melicharek', title: 'CEO', email: 'Jon@Casitaadu.com', desc: 'Director of Strategic Growth driving new partnerships, market growth, and revenue opportunities.' },
  { name: 'Olivia Jarvis', title: 'Social Media Manager', email: 'Olivia@Casitaadu.com', desc: 'Overseeing content strategy, community engagement, and brand voice across platforms.' },
  { name: 'Samuel Duron', title: 'Project Manager & Designer', email: 'Samuel@Casitaadu.com', desc: 'Designer and Project Manager for measurements, design planning, and overall project management.' },
  { name: 'Francisco Herrera', title: 'Project Manager & Designer', email: 'Francisco@Casitaadu.com', desc: 'Designer and Project Manager for measurements, design planning, and overall project management.' },
];

export default function AboutContent() {
  return (
    <>
      {/* Hero */}
      <section className="bg-brand-dark-teal pt-32 pb-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        <div className="max-w-5xl mx-auto relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-brand-gold font-semibold text-sm uppercase tracking-widest">About Us</span>
            <h1 className="font-display text-5xl md:text-6xl text-white mt-4 mb-6">Built from <span className="text-brand-gold italic">Dedication</span></h1>
            <p className="text-white/50 text-lg max-w-2xl mx-auto">
              Our team is dedicated to going the extra mile on every project. We create a great work/life balance
              and pursue excellence — not just for our clients, but for our team members too.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding bg-brand-cream">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { icon: Heart, title: 'Client-First', desc: 'Every decision is made with your best interest at heart.' },
              { icon: Shield, title: 'Transparent', desc: 'Open communication and honest timelines, always.' },
              { icon: Award, title: 'Quality-Driven', desc: 'We build to the highest standards — no shortcuts.' },
              { icon: Users, title: 'Team-Oriented', desc: 'Our strength comes from collaboration and support.' },
            ].map((v, i) => (
              <motion.div key={v.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-brand-dark-teal/5 flex items-center justify-center mx-auto mb-4">
                  <v.icon className="w-7 h-7 text-brand-mid-teal" />
                </div>
                <h3 className="font-display text-xl text-brand-dark-teal mb-2">{v.title}</h3>
                <p className="text-sm text-brand-slate/50">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-brand-gold font-semibold text-sm uppercase tracking-widest">Our Team</span>
            <h2 className="font-display text-4xl text-brand-dark-teal mt-4">Meet the <span className="text-brand-gold italic">Casita</span> Team</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {team.map((member, i) => (
              <motion.div key={member.name} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="card p-8 text-center group">
                <div className="w-24 h-24 mx-auto mb-5 rounded-2xl bg-gradient-to-br from-brand-mid-teal/20 to-brand-dark-teal/10 flex items-center justify-center group-hover:from-brand-gold/20 group-hover:to-brand-gold/10 transition-all">
                  <Users className="w-10 h-10 text-brand-mid-teal/40 group-hover:text-brand-gold/60 transition-colors" />
                </div>
                <h3 className="font-display text-xl text-brand-dark-teal">{member.name}</h3>
                <p className="text-brand-gold text-sm font-semibold mb-3">{member.title}</p>
                <p className="text-sm text-brand-slate/50 leading-relaxed mb-4">{member.desc}</p>
                <a href={`mailto:${member.email}`} className="text-xs text-brand-mid-teal hover:text-brand-dark-teal transition-colors">{member.email}</a>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-12">
            <p className="text-brand-slate/50 mb-4">Interested in joining the team?</p>
            <a href="mailto:Info@casitaadu.com?subject=Career Interest" className="btn-secondary">Get In Touch</a>
          </div>
        </div>
      </section>
    </>
  );
}
