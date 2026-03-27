import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';

export const metadata = { title: 'Pre-Approved ADU Plans' };

export default function PreApprovedPlansPage() {
  return (
    <>
      <Navbar />
      <main>
        <section className="bg-brand-dark-teal pt-32 pb-20 px-6 text-center">
          <span className="text-brand-gold font-semibold text-sm uppercase tracking-widest">Faster Approvals</span>
          <h1 className="font-display text-5xl md:text-6xl text-white mt-4 mb-6">Pre-Approved <span className="text-brand-gold italic">Plans</span></h1>
          <p className="text-white/50 text-lg max-w-2xl mx-auto">Choose from city-approved ADU plans to streamline your permitting process and reduce delays.</p>
        </section>

        <section className="section-padding bg-brand-cream">
          <div className="max-w-5xl mx-auto text-center">
            <p className="text-brand-slate/60 text-lg mb-10 max-w-2xl mx-auto">
              Pre-approved options vary by city. We manage the entire permitting process from start to finish — choosing a pre-approved plan simply helps streamline approvals.
            </p>
            <div className="grid sm:grid-cols-2 gap-8 max-w-2xl mx-auto">
              {[
                { city: 'Carlsbad', desc: 'View pre-approved ADU plans for the City of Carlsbad.' },
                { city: 'Vista', desc: 'View pre-approved ADU plans for the City of Vista.' },
              ].map(item => (
                <div key={item.city} className="card p-8 text-center">
                  <h3 className="font-display text-2xl text-brand-dark-teal mb-3">{item.city}</h3>
                  <p className="text-sm text-brand-slate/50 mb-6">{item.desc}</p>
                  <Link href={`/pre-approved-plans?city=${item.city.toLowerCase()}`} className="btn-secondary !text-xs">View Plans</Link>
                </div>
              ))}
            </div>
            <p className="text-sm text-brand-slate/40 mt-10">
              Don&apos;t see your city? <Link href="/contact" className="text-brand-mid-teal font-semibold hover:text-brand-dark-teal">Contact us</Link> to learn about options in your jurisdiction.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
