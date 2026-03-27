'use client';

import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Phone, Mail, Instagram, Facebook, ArrowUpRight } from 'lucide-react';

const footerLinks = {
  company: [
    { label: 'About Us', href: '/about' },
    { label: 'Our Services', href: '/services' },
    { label: 'Portfolio', href: '/portfolio' },
    { label: 'Blog', href: '/blog' },
    { label: 'Contact', href: '/contact' },
  ],
  services: [
    { label: 'Full Permitting', href: '/services#permitting' },
    { label: 'Design & Plans', href: '/services#design' },
    { label: 'Construction Mgmt', href: '/services#construction' },
    { label: 'Pre-Approved Plans', href: '/pre-approved-plans' },
    { label: 'Financing Options', href: '/financing' },
  ],
  portals: [
    { label: 'Client Portal Login', href: '/login' },
    { label: 'Track Your Project', href: '/portal/dashboard' },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-brand-dark-teal text-white">
      {/* CTA Band */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-16 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h3 className="font-display text-3xl md:text-4xl mb-2">
              Ready to Build Your <span className="text-brand-gold">Casita</span>?
            </h3>
            <p className="text-white/60 text-lg">
              Schedule a free site walk and let&apos;s talk about your vision.
            </p>
          </div>
          <Link href="/contact" className="btn-primary whitespace-nowrap !text-sm flex items-center gap-2">
            Get Started <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <div className="mb-6">
              <Image
                src="/images/casita-logo.png"
                alt="Casita ADU"
                width={140}
                height={60}
                className="h-14 w-auto brightness-0 invert"
              />
            </div>
            <p className="text-white/50 text-sm leading-relaxed mb-6">
              California&apos;s only full-service ADU company. From permitting to construction, we handle every detail.
            </p>
            <div className="space-y-3">
              <a href="tel:6198912065" className="flex items-center gap-3 text-sm text-white/70 hover:text-brand-gold transition-colors">
                <Phone className="w-4 h-4" /> (619) 891-2065
              </a>
              <a href="mailto:info@casitaadu.com" className="flex items-center gap-3 text-sm text-white/70 hover:text-brand-gold transition-colors">
                <Mail className="w-4 h-4" /> info@casitaadu.com
              </a>
              <div className="flex items-center gap-3 text-sm text-white/70">
                <MapPin className="w-4 h-4 flex-shrink-0" /> San Diego, California
              </div>
            </div>
          </div>

          {/* Link Columns */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider text-brand-gold mb-5">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-white/50 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider text-brand-gold mb-5">Services</h4>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-white/50 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider text-brand-gold mb-5">Client Access</h4>
            <ul className="space-y-3">
              {footerLinks.portals.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-white/50 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <h4 className="font-semibold text-sm uppercase tracking-wider text-brand-gold mb-4">Follow Us</h4>
              <div className="flex gap-3">
                <a href="https://instagram.com/casita_adu" target="_blank" rel="noopener noreferrer"
                   className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center hover:bg-brand-gold hover:text-brand-dark-teal transition-all">
                  <Instagram className="w-4 h-4" />
                </a>
                <a href="#" className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center hover:bg-brand-gold hover:text-brand-dark-teal transition-all">
                  <Facebook className="w-4 h-4" />
                </a>
              </div>
            </div>
            <div className="mt-6 text-xs text-white/30">
              <p>Mon–Fri 8AM–6PM</p>
              <p>Sat 9AM–3PM</p>
              <p>Sun Closed</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/30">
            &copy; {new Date().getFullYear()} Casita ADU. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="/privacy" className="text-xs text-white/30 hover:text-white/60 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="text-xs text-white/30 hover:text-white/60 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
