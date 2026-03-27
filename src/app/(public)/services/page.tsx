import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Services from '@/components/sections/Services';
import Process from '@/components/sections/Process';
import CTABanner from '@/components/sections/CTABanner';

export const metadata = { title: 'Our Services' };

export default function ServicesPage() {
  return (
    <>
      <Navbar />
      <main>
        <section className="bg-brand-dark-teal pt-32 pb-20 px-6 text-center">
          <span className="text-brand-gold font-semibold text-sm uppercase tracking-widest">What We Offer</span>
          <h1 className="font-display text-5xl md:text-6xl text-white mt-4 mb-6">Our <span className="text-brand-gold italic">Services</span></h1>
          <p className="text-white/50 text-lg max-w-2xl mx-auto">Full-service ADU development from permitting to completion.</p>
        </section>
        <Services />
        <Process />
        <CTABanner />
      </main>
      <Footer />
    </>
  );
}
