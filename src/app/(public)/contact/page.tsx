import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ContactForm from '@/components/sections/ContactForm';

export const metadata = { title: 'Contact Us' };

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main>
        <section className="bg-brand-dark-teal pt-32 pb-20 px-6 text-center">
          <span className="text-brand-gold font-semibold text-sm uppercase tracking-widest">Get In Touch</span>
          <h1 className="font-display text-5xl md:text-6xl text-white mt-4 mb-6">Contact <span className="text-brand-gold italic">Us</span></h1>
          <p className="text-white/50 text-lg max-w-2xl mx-auto">Ready to get started? Reach out and schedule your free site walk today.</p>
        </section>
        <ContactForm />
      </main>
      <Footer />
    </>
  );
}
