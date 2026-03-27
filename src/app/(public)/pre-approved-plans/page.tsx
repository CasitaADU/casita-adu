'use client';

import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import { MapPin, Home, ChevronDown, Bed, Bath, Ruler, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Plan {
  name: string;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  description: string;
}

interface City {
  name: string;
  slug: string;
  description: string;
  plans: Plan[];
}

const cities: City[] = [
  {
    name: 'Carlsbad',
    slug: 'carlsbad',
    description: 'The City of Carlsbad offers four pre-approved ADU plans ranging from a compact studio to a spacious 3-bedroom unit.',
    plans: [
      { name: 'Studio', bedrooms: 0, bathrooms: 1, sqft: 400, description: 'Efficient open-concept studio — perfect for a rental unit or guest house.' },
      { name: '1 Bed / 1 Bath', bedrooms: 1, bathrooms: 1, sqft: 680, description: 'A comfortable one-bedroom ADU with separate living and sleeping areas.' },
      { name: '2 Bed / 2 Bath', bedrooms: 2, bathrooms: 2, sqft: 800, description: 'Spacious two-bedroom layout ideal for small families or long-term tenants.' },
      { name: '3 Bed / 2 Bath', bedrooms: 3, bathrooms: 2, sqft: 1000, description: 'Our largest Carlsbad plan — a full 3-bedroom home with room for everyone.' },
    ],
  },
  {
    name: 'Vista',
    slug: 'vista',
    description: 'The City of Vista provides four pre-approved ADU options from studio to 3-bedroom configurations.',
    plans: [
      { name: 'Studio', bedrooms: 0, bathrooms: 1, sqft: 400, description: 'Compact studio ADU — move-in ready with streamlined Vista permitting.' },
      { name: '1 Bedroom', bedrooms: 1, bathrooms: 1, sqft: 600, description: 'One-bedroom plan with a dedicated living area and full kitchen.' },
      { name: '2 Bedroom', bedrooms: 2, bathrooms: 1, sqft: 750, description: 'Two-bedroom layout with an efficient floor plan for maximum livability.' },
      { name: '3 Bedroom', bedrooms: 3, bathrooms: 2, sqft: 1000, description: 'Full-size 3-bedroom ADU for families or premium rental income.' },
    ],
  },
  {
    name: 'San Marcos',
    slug: 'san-marcos',
    description: 'San Marcos offers three pre-approved ADU plans covering 1 to 3-bedroom options.',
    plans: [
      { name: '1 Bedroom', bedrooms: 1, bathrooms: 1, sqft: 600, description: 'A well-designed one-bedroom ADU approved for San Marcos properties.' },
      { name: '2 Bedroom', bedrooms: 2, bathrooms: 1, sqft: 750, description: 'Two-bedroom plan with open living and dining areas.' },
      { name: '3 Bedroom', bedrooms: 3, bathrooms: 2, sqft: 1000, description: 'Spacious three-bedroom ADU — the largest pre-approved plan in San Marcos.' },
    ],
  },
  {
    name: 'Escondido',
    slug: 'escondido',
    description: 'The City of Escondido has three pre-approved ADU designs from 1 to 3 bedrooms.',
    plans: [
      { name: '1 Bedroom', bedrooms: 1, bathrooms: 1, sqft: 600, description: 'Compact one-bedroom ADU designed for Escondido zoning requirements.' },
      { name: '2 Bedroom', bedrooms: 2, bathrooms: 1, sqft: 750, description: 'Two-bedroom layout offering comfortable living for tenants or family.' },
      { name: '3 Bedroom', bedrooms: 3, bathrooms: 2, sqft: 1000, description: 'Three-bedroom ADU plan pre-approved for fast-tracked Escondido permits.' },
    ],
  },
  {
    name: 'Unincorporated County',
    slug: 'county',
    description: 'San Diego County offers three pre-approved ADU plans for unincorporated areas.',
    plans: [
      { name: '1 Bedroom', bedrooms: 1, bathrooms: 1, sqft: 600, description: 'One-bedroom County-approved ADU plan for rural and suburban lots.' },
      { name: '2 Bedroom', bedrooms: 2, bathrooms: 1, sqft: 750, description: 'Two-bedroom plan approved for unincorporated San Diego County.' },
      { name: '3 Bedroom', bedrooms: 3, bathrooms: 2, sqft: 1000, description: 'Three-bedroom ADU — maximize your County property with a full-size unit.' },
    ],
  },
  {
    name: 'Encinitas',
    slug: 'encinitas',
    description: 'Encinitas offers four pre-approved ADU plans including a studio option for coastal living.',
    plans: [
      { name: 'Studio', bedrooms: 0, bathrooms: 1, sqft: 400, description: 'Coastal studio ADU — perfect for a beach rental or home office.' },
      { name: '1 Bedroom', bedrooms: 1, bathrooms: 1, sqft: 600, description: 'One-bedroom Encinitas plan with bright, open interior design.' },
      { name: '2 Bedroom', bedrooms: 2, bathrooms: 1, sqft: 750, description: 'Two-bedroom ADU ideal for Encinitas families or rental income.' },
      { name: '3 Bedroom', bedrooms: 3, bathrooms: 2, sqft: 1000, description: 'Full three-bedroom home pre-approved for Encinitas properties.' },
    ],
  },
];

export default function PreApprovedPlansPage() {
  const [selectedCity, setSelectedCity] = useState<string | null>(null);

  const activeCity = cities.find(c => c.slug === selectedCity);

  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="bg-brand-dark-teal pt-32 pb-20 px-6 text-center">
          <span className="text-brand-gold font-semibold text-sm uppercase tracking-widest">Faster Approvals</span>
          <h1 className="font-display text-5xl md:text-6xl text-white mt-4 mb-6">Pre-Approved <span className="text-brand-gold italic">Plans</span></h1>
          <p className="text-white/50 text-lg max-w-2xl mx-auto">
            Choose from city-approved ADU plans to streamline your permitting process and save weeks of review time.
          </p>
        </section>

        {/* How it works */}
        <section className="py-16 px-6 bg-white border-b border-gray-100">
          <div className="max-w-5xl mx-auto">
            <h2 className="font-display text-3xl text-brand-dark-teal text-center mb-4">How Pre-Approved Plans Work</h2>
            <p className="text-brand-slate/50 text-center max-w-2xl mx-auto mb-12">
              Pre-approved plans have already been reviewed and accepted by your city — meaning faster permits, fewer revisions, and lower design costs.
            </p>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { step: '01', title: 'Choose Your City', desc: 'Select your jurisdiction below to see available pre-approved plans.' },
                { step: '02', title: 'Pick a Plan', desc: 'Browse floor plans by size — from studios to 3-bedroom homes.' },
                { step: '03', title: 'We Handle the Rest', desc: 'We manage permitting, construction, and everything in between.' },
              ].map(item => (
                <div key={item.step} className="text-center">
                  <div className="w-14 h-14 rounded-2xl bg-brand-gold/10 flex items-center justify-center mx-auto mb-4">
                    <span className="font-display text-xl text-brand-gold">{item.step}</span>
                  </div>
                  <h3 className="font-display text-lg text-brand-dark-teal mb-2">{item.title}</h3>
                  <p className="text-sm text-brand-slate/50">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* City Selection */}
        <section className="section-padding bg-brand-cream">
          <div className="max-w-6xl mx-auto">
            <h2 className="font-display text-3xl text-brand-dark-teal text-center mb-3">Select Your City</h2>
            <p className="text-brand-slate/50 text-center mb-10">Click a city to view available pre-approved ADU plans.</p>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {cities.map((city) => (
                <motion.button
                  key={city.slug}
                  onClick={() => setSelectedCity(selectedCity === city.slug ? null : city.slug)}
                  whileHover={{ y: -4 }}
                  className={`card p-8 text-left transition-all duration-300 ${
                    selectedCity === city.slug
                      ? 'ring-2 ring-brand-gold bg-white shadow-lg'
                      : 'hover:shadow-md'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-brand-dark-teal/5 flex items-center justify-center">
                      <MapPin className={`w-6 h-6 ${selectedCity === city.slug ? 'text-brand-gold' : 'text-brand-mid-teal'}`} />
                    </div>
                    <ChevronDown className={`w-5 h-5 text-brand-slate/30 transition-transform ${selectedCity === city.slug ? 'rotate-180 text-brand-gold' : ''}`} />
                  </div>
                  <h3 className="font-display text-xl text-brand-dark-teal mb-2">{city.name}</h3>
                  <p className="text-sm text-brand-slate/40 mb-3">{city.plans.length} pre-approved plans available</p>
                  <div className="flex flex-wrap gap-2">
                    {city.plans.map(plan => (
                      <span key={plan.name} className="text-xs bg-brand-dark-teal/5 text-brand-slate/50 px-2.5 py-1 rounded-full">
                        {plan.name}
                      </span>
                    ))}
                  </div>
                </motion.button>
              ))}
            </div>

            {/* Plan Details */}
            <AnimatePresence mode="wait">
              {activeCity && (
                <motion.div
                  key={activeCity.slug}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  id="plans"
                >
                  <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3 mb-2">
                      <MapPin className="w-5 h-5 text-brand-gold" />
                      <span className="text-brand-gold font-semibold text-sm uppercase tracking-widest">{activeCity.name}</span>
                    </div>
                    <h3 className="font-display text-3xl text-brand-dark-teal mb-3">
                      Pre-Approved Plans for {activeCity.name}
                    </h3>
                    <p className="text-brand-slate/50 mb-10 max-w-2xl">{activeCity.description}</p>

                    <div className="grid md:grid-cols-2 gap-6">
                      {activeCity.plans.map((plan, i) => (
                        <motion.div
                          key={plan.name}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="border border-gray-100 rounded-2xl p-6 hover:border-brand-gold/30 hover:shadow-md transition-all group"
                        >
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="font-display text-xl text-brand-dark-teal">{plan.name}</h4>
                            <Home className="w-5 h-5 text-brand-gold" />
                          </div>

                          <div className="flex items-center gap-5 mb-4">
                            <span className="flex items-center gap-1.5 text-sm text-brand-slate/50">
                              <Ruler className="w-4 h-4" /> {plan.sqft} SF
                            </span>
                            {plan.bedrooms > 0 && (
                              <span className="flex items-center gap-1.5 text-sm text-brand-slate/50">
                                <Bed className="w-4 h-4" /> {plan.bedrooms} Bed
                              </span>
                            )}
                            <span className="flex items-center gap-1.5 text-sm text-brand-slate/50">
                              <Bath className="w-4 h-4" /> {plan.bathrooms} Bath
                            </span>
                          </div>

                          <p className="text-sm text-brand-slate/40 mb-5">{plan.description}</p>

                          <Link
                            href={`/contact?plan=${encodeURIComponent(`${activeCity.name} - ${plan.name} (${plan.sqft} SF)`)}`}
                            className="inline-flex items-center gap-2 text-sm font-semibold text-brand-mid-teal group-hover:text-brand-gold transition-colors"
                          >
                            Inquire About This Plan <ArrowRight className="w-4 h-4" />
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Custom plans note */}
            <div className="mt-16 text-center">
              <div className="bg-brand-dark-teal rounded-3xl p-10 md:p-14">
                <h3 className="font-display text-3xl text-white mb-4">Need a Custom Plan?</h3>
                <p className="text-white/50 mb-4 max-w-xl mx-auto">
                  Every city listed above also allows custom ADU designs. If none of the pre-approved plans fit your vision, we&apos;ll design one from scratch.
                </p>
                <p className="text-white/40 text-sm mb-8 max-w-xl mx-auto">
                  Don&apos;t see your city? We work across all of San Diego County — contact us to explore your options.
                </p>
                <Link href="/contact" className="btn-primary bg-brand-gold text-brand-dark-teal hover:bg-brand-gold/90">
                  Schedule Free Consultation
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
