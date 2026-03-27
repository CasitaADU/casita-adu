import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';

export const metadata = { title: 'Financing' };

const lenders = [
  { name: 'Carl Spiteri', company: 'Finance Partner', specialty: 'ADU Construction Loans' },
  { name: 'Scott Evans', company: 'Finance Partner', specialty: 'Home Equity & ADU Financing' },
  { name: 'Eric Mitchell', company: 'Finance Partner', specialty: 'Renovation Loans' },
  { name: 'Phana Par', company: 'Finance Partner', specialty: 'Construction-to-Perm Loans' },
  { name: 'Derrick Evens', company: 'Finance Partner', specialty: 'ADU Lending Specialist' },
  { name: 'Derek Barksdale', company: 'Finance Partner', specialty: 'Investment Property Loans' },
  { name: 'Anda Pop', company: 'Finance Partner', specialty: 'ADU Financing Solutions' },
];

export default function FinancingPage() {
  return (
    <>
      <Navbar />
      <main>
        <section className="bg-brand-dark-teal pt-32 pb-20 px-6 text-center">
          <span className="text-brand-gold font-semibold text-sm uppercase tracking-widest">Financing</span>
          <h1 className="font-display text-5xl md:text-6xl text-white mt-4 mb-6">Funding Your <span className="text-brand-gold italic">ADU</span></h1>
          <p className="text-white/50 text-lg max-w-2xl mx-auto">We work with trusted lending partners to help make your ADU financially accessible.</p>
        </section>

        <section className="section-padding bg-brand-cream">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-display text-3xl text-brand-dark-teal mb-4">Our Lending Partners</h2>
              <p className="text-brand-slate/50 max-w-2xl mx-auto">We&apos;ve vetted these financing professionals who specialize in ADU construction loans. Contact them directly or ask us for a warm introduction.</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {lenders.map(lender => (
                <div key={lender.name} className="card p-6 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-brand-gold/10 flex items-center justify-center">
                    <span className="font-display text-2xl text-brand-gold">{lender.name[0]}</span>
                  </div>
                  <h3 className="font-semibold text-brand-dark-teal">{lender.name}</h3>
                  <p className="text-xs text-brand-slate/40 mt-1">{lender.specialty}</p>
                </div>
              ))}
            </div>
            <div className="text-center mt-12">
              <p className="text-brand-slate/50 mb-4">Need help choosing the right financing option?</p>
              <Link href="/contact" className="btn-primary">Talk to Our Team</Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
