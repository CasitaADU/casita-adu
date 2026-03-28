'use client';

import { useState, useRef } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import {
  BookOpen, Scale, DollarSign, Ruler, FileText,
  ChevronDown, ArrowRight, Download, Mail, User,
  ExternalLink, CheckCircle2,
} from 'lucide-react';

/* ── Resource categories ── */
const categories = [
  {
    icon: Scale,
    title: 'California ADU Laws',
    description: 'Understand state regulations, setback requirements, and recent legislative changes.',
    articles: [
      { name: 'AB 68 & SB 13 Explained', href: 'https://www.hcd.ca.gov/policy-and-research/accessory-dwelling-units' },
      { name: 'ADU Size Limits by City', href: 'https://www.hcd.ca.gov/policy-and-research/accessory-dwelling-units' },
      { name: 'Setback Requirements', href: 'https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?sectionNum=65852.2.&lawCode=GOV' },
    ],
  },
  {
    icon: DollarSign,
    title: 'Financing Your ADU',
    description: 'Explore financing options from construction loans to HELOCs and ADU-specific programs.',
    articles: [
      { name: 'ADU Financing Options', href: 'https://www.bankrate.com/home-equity/heloc/how-to-finance-an-adu/' },
      { name: 'ROI Calculator Guide', href: 'https://www.buildinganadu.com/adu-return-on-investment' },
      { name: 'Tax Benefits of ADUs', href: 'https://www.nolo.com/legal-encyclopedia/tax-deductions-building-adu.html' },
    ],
  },
  {
    icon: Ruler,
    title: 'Design Considerations',
    description: 'Learn about layout options, accessibility requirements, and maximizing your space.',
    articles: [
      { name: 'ADU Layout Best Practices', href: 'https://www.buildinganadu.com/adu-blog/adu-floor-plans' },
      { name: 'Accessibility Requirements', href: 'https://www.ada.gov/law-and-regs/design-standards/' },
      { name: 'Maximizing Small Spaces', href: 'https://www.architecturaldigest.com/gallery/small-space-design-tips' },
    ],
  },
  {
    icon: FileText,
    title: 'Permitting Process',
    description: 'Navigate the permit process with confidence using our step-by-step guides.',
    articles: [
      { name: 'Permit Timeline Guide', href: 'https://www.hcd.ca.gov/policy-and-research/accessory-dwelling-units' },
      { name: 'Common Permit Delays', href: 'https://www.buildinganadu.com/adu-blog/adu-permitting-guide' },
      { name: 'Working with Cities', href: 'https://www.sandiego.gov/development-services/permits/adu' },
    ],
  },
];

/* ── FAQ data ── */
const faqs = [
  {
    question: 'How much does an ADU cost to build?',
    answer: 'ADU costs in California typically range from $150,000 to $350,000 depending on size, finishes, and local conditions. Garage conversions are often on the lower end, while larger detached ADUs with premium finishes can exceed $300,000. We provide detailed pricing during your free consultation.',
  },
  {
    question: 'How long does it take to build an ADU?',
    answer: 'A typical ADU project takes 6-8 months from initial consultation to move-in ready. This includes 3-4 weeks for design, 6-10 weeks for permitting (varies by city), and 12-16 weeks for construction. Pre-approved plans can significantly reduce the design and permitting timeline.',
  },
  {
    question: 'Do I need to live on the property?',
    answer: 'California law requires that either the primary residence or the ADU be owner-occupied. However, some cities have relaxed these requirements, and there are exceptions for certain property types. We can advise based on your specific situation and location.',
  },
  {
    question: 'Can I rent out my ADU?',
    answer: 'Yes! ADUs can be rented out for long-term housing. Short-term rentals (like Airbnb) are subject to local regulations which vary by city. Many homeowners use ADU rental income to offset their mortgage or generate supplemental income.',
  },
  {
    question: 'What size ADU can I build?',
    answer: 'California state law allows ADUs up to 1,200 square feet, but your specific limit depends on your property size, zoning, and local regulations. Junior ADUs (JADUs) within existing space are limited to 500 square feet. We assess your property\'s maximum ADU potential during the site walk.',
  },
  {
    question: 'Do I need a separate utility meter?',
    answer: 'Not always. California law prohibits cities from requiring separate utility connections as a condition of approval for ADUs. However, some homeowners choose to install separate meters for easier billing when renting. We discuss the pros and cons during planning.',
  },
];

/* ── FAQ Accordion Item ── */
function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-100 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-brand-cream/50 transition-colors"
      >
        <span className="font-semibold text-brand-charcoal pr-4">{q}</span>
        <ChevronDown className={`w-5 h-5 text-brand-gold shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="px-6 pb-5 text-brand-slate/70 leading-relaxed">
          {a}
        </div>
      )}
    </div>
  );
}

/* ── Lender Guide Email Capture ── */
function LenderGuideCapture() {
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await fetch('/api/lender-guide', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ first_name: firstName, email }),
      });
      const data = await res.json();
      if (data.success) {
        setStatus('success');
        // Trigger download
        const link = document.createElement('a');
        link.href = data.downloadUrl;
        link.download = 'CASITA-Lender-Partnership-Directory.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="text-center py-8">
        <CheckCircle2 className="w-12 h-12 text-brand-gold mx-auto mb-4" />
        <h4 className="font-display text-2xl text-brand-charcoal mb-2">Check Your Download!</h4>
        <p className="text-brand-slate/60 mb-4">Your Lender Partnership Directory is downloading now.</p>
        <a
          href="/casita-lender-directory.pdf"
          download="CASITA-Lender-Partnership-Directory.pdf"
          className="text-brand-gold font-semibold hover:underline inline-flex items-center gap-2"
        >
          <Download className="w-4 h-4" /> Download Again
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="label">First Name</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-slate/30" />
            <input
              type="text"
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Your first name"
              className="input-field !pl-10"
            />
          </div>
        </div>
        <div>
          <label className="label">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-slate/30" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              className="input-field !pl-10"
            />
          </div>
        </div>
      </div>
      <button
        type="submit"
        disabled={status === 'loading'}
        className="btn-primary w-full flex items-center justify-center gap-2"
      >
        {status === 'loading' ? 'Sending...' : (
          <>
            <Download className="w-4 h-4" /> Get Free Lender Directory
          </>
        )}
      </button>
      {status === 'error' && (
        <p className="text-red-500 text-sm text-center">Something went wrong. Please try again.</p>
      )}
      <p className="text-xs text-brand-slate/40 text-center">
        We&apos;ll send you the PDF and occasional ADU insights. No spam, ever.
      </p>
    </form>
  );
}

/* ── Main Page ── */
export default function ResourcesPage() {
  const faqRef = useRef(null);
  const faqInView = useInView(faqRef, { once: true, margin: '-100px' });

  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="bg-brand-cream pt-32 pb-20 px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto"
          >
            <span className="text-brand-gold font-semibold text-sm uppercase tracking-widest">Knowledge Center</span>
            <h1 className="font-display text-5xl md:text-6xl text-brand-charcoal mt-4 mb-6">
              ADU <span className="text-brand-gold italic">Resources</span>
            </h1>
            <p className="text-brand-slate/60 text-lg max-w-2xl mx-auto">
              Everything you need to know about building an ADU in California — from laws and financing to design and permitting.
            </p>
          </motion.div>
        </section>

        {/* Resource Categories */}
        <section className="section-padding bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <span className="text-brand-gold font-semibold text-sm uppercase tracking-widest">Guides & Articles</span>
              <h2 className="font-display text-4xl md:text-5xl text-brand-charcoal mt-4">
                Learn About <span className="text-brand-gold italic">ADUs</span>
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {categories.map((cat, i) => (
                <motion.div
                  key={cat.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="card p-8"
                >
                  <div className="w-12 h-12 rounded-xl bg-brand-gold/10 flex items-center justify-center mb-5">
                    <cat.icon className="w-6 h-6 text-brand-gold" />
                  </div>
                  <h3 className="font-display text-2xl text-brand-charcoal mb-3">{cat.title}</h3>
                  <p className="text-brand-slate/60 mb-6">{cat.description}</p>
                  <ul className="space-y-3">
                    {cat.articles.map((article) => (
                      <li key={article.name}>
                        <a
                          href={article.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-sm font-medium text-brand-charcoal hover:text-brand-gold transition-colors group"
                        >
                          <ExternalLink className="w-3.5 h-3.5 text-brand-gold" />
                          {article.name}
                          <ArrowRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                        </a>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Lender Guide Email Capture */}
        <section className="section-padding bg-brand-cream">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Left: Description */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <div className="w-14 h-14 rounded-2xl bg-brand-gold/10 flex items-center justify-center mb-6">
                  <DollarSign className="w-7 h-7 text-brand-gold" />
                </div>
                <h2 className="font-display text-3xl md:text-4xl text-brand-charcoal mb-4">
                  Preferred <span className="text-brand-gold italic">Lender Directory</span>
                </h2>
                <p className="text-brand-slate/60 leading-relaxed mb-6">
                  Get instant access to our curated list of preferred lending partners who specialize in ADU construction financing. These lenders understand ADU projects and offer competitive rates.
                </p>
                <ul className="space-y-3 text-sm text-brand-slate/70">
                  {[
                    'ADU construction loan specialists',
                    'Competitive rates and terms',
                    'VA/military lending options',
                    'Personalized service from trusted partners',
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-brand-gold shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Right: Email Capture Form */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="card p-8"
              >
                <div className="flex items-center gap-3 mb-6">
                  <Download className="w-5 h-5 text-brand-gold" />
                  <h3 className="font-display text-xl text-brand-charcoal">Free Download</h3>
                </div>
                <LenderGuideCapture />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Quick Links */}
        <section className="section-padding bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <span className="text-brand-gold font-semibold text-sm uppercase tracking-widest">Quick Access</span>
              <h2 className="font-display text-4xl text-brand-charcoal mt-4">
                Helpful <span className="text-brand-gold italic">Links</span>
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: 'ADU 101 Guide', href: '/blog', icon: BookOpen, desc: 'Start here if you\'re new to ADUs' },
                { label: 'Pre-Approved Plans', href: '/pre-approved-plans', icon: FileText, desc: 'Browse city-approved ADU plans' },
                { label: 'Our Process', href: '/services', icon: Ruler, desc: 'How we build your ADU' },
                { label: 'Get a Quote', href: '/contact', icon: DollarSign, desc: 'Schedule a free site walk' },
              ].map((link, i) => (
                <motion.div
                  key={link.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link
                    href={link.href}
                    className="card p-6 block group hover:border-brand-gold/30 transition-all text-center"
                  >
                    <div className="w-12 h-12 rounded-xl bg-brand-charcoal/5 group-hover:bg-brand-gold/10 flex items-center justify-center mx-auto mb-4 transition-colors">
                      <link.icon className="w-5 h-5 text-brand-charcoal group-hover:text-brand-gold transition-colors" />
                    </div>
                    <h3 className="font-display text-lg text-brand-charcoal mb-1">{link.label}</h3>
                    <p className="text-sm text-brand-slate/50">{link.desc}</p>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section ref={faqRef} id="faq" className="section-padding bg-brand-cream">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={faqInView ? { opacity: 1, y: 0 } : {}}
              className="text-center mb-12"
            >
              <span className="text-brand-gold font-semibold text-sm uppercase tracking-widest">FAQ</span>
              <h2 className="font-display text-4xl md:text-5xl text-brand-charcoal mt-4">
                Common <span className="text-brand-gold italic">Questions</span>
              </h2>
            </motion.div>

            <div className="space-y-4">
              {faqs.map((faq) => (
                <FAQItem key={faq.question} q={faq.question} a={faq.answer} />
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 px-6 bg-white">
          <div className="max-w-5xl mx-auto rounded-3xl bg-brand-charcoal p-12 md:p-16 text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '30px 30px' }} />
            <div className="relative z-10">
              <h2 className="font-display text-3xl md:text-5xl text-white mb-4">
                Ready to Start Your <span className="text-brand-gold italic">ADU Journey</span>?
              </h2>
              <p className="text-white/60 text-lg mb-10 max-w-2xl mx-auto">
                Schedule a free site walk and let our team show you what&apos;s possible for your property.
              </p>
              <Link href="/contact" className="btn-primary !text-base !py-4 !px-10 flex items-center gap-2 w-fit mx-auto">
                Schedule Free Site Walk <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
