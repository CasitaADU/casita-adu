'use client';

import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import { MapPin, Home, Bed, Bath, Ruler, ArrowRight, FileText, Image as ImageIcon, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Plan {
  name: string;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  description: string;
  floorPlanUrl: string;
  planSetUrl: string;
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
    description: 'Four pre-approved ADU plans ranging from a compact studio to a spacious 3-bedroom unit.',
    plans: [
      { name: 'Studio — 400 SF', bedrooms: 0, bathrooms: 1, sqft: 400, description: 'Efficient open-concept studio — perfect for a rental unit or guest house.', floorPlanUrl: 'https://drive.google.com/drive/folders/1PS73evSHU9SB-mHMcJ_V7E5Hxhrx3wCt', planSetUrl: 'https://drive.google.com/drive/folders/1PS73evSHU9SB-mHMcJ_V7E5Hxhrx3wCt' },
      { name: '1 Bed / 1 Bath — 680 SF', bedrooms: 1, bathrooms: 1, sqft: 680, description: 'Comfortable one-bedroom ADU with separate living and sleeping areas.', floorPlanUrl: 'https://drive.google.com/drive/folders/1uzNhuB6U6LOTYvG-P0PZmLDLPccS3Ftq', planSetUrl: 'https://drive.google.com/drive/folders/1uzNhuB6U6LOTYvG-P0PZmLDLPccS3Ftq' },
      { name: '2 Bed / 2 Bath — 800 SF', bedrooms: 2, bathrooms: 2, sqft: 800, description: 'Spacious two-bedroom layout ideal for small families or long-term tenants.', floorPlanUrl: 'https://drive.google.com/drive/folders/1pZ_n0GYq0_LcB7tczjs28nmT5ejieo66', planSetUrl: 'https://drive.google.com/drive/folders/1pZ_n0GYq0_LcB7tczjs28nmT5ejieo66' },
      { name: '3 Bed / 2 Bath — 1,000 SF', bedrooms: 3, bathrooms: 2, sqft: 1000, description: 'Our largest Carlsbad plan — a full 3-bedroom home with room for everyone.', floorPlanUrl: 'https://drive.google.com/drive/folders/1plO-cxofHus9enATdWzWd96ZtoRUKgAR', planSetUrl: 'https://drive.google.com/drive/folders/1plO-cxofHus9enATdWzWd96ZtoRUKgAR' },
    ],
  },
  {
    name: 'Vista',
    slug: 'vista',
    description: 'Four pre-approved ADU options from studio to 3-bedroom configurations.',
    plans: [
      { name: 'Studio — 400 SF', bedrooms: 0, bathrooms: 1, sqft: 400, description: 'Compact studio ADU — move-in ready with streamlined Vista permitting.', floorPlanUrl: 'https://drive.google.com/drive/folders/1WDxhB_6SQYTQeXTM7zZL_Bq5QQ4_rF90', planSetUrl: 'https://drive.google.com/drive/folders/1WDxhB_6SQYTQeXTM7zZL_Bq5QQ4_rF90' },
      { name: '1 Bedroom — 600 SF', bedrooms: 1, bathrooms: 1, sqft: 600, description: 'One-bedroom plan with a dedicated living area and full kitchen.', floorPlanUrl: 'https://drive.google.com/drive/folders/1vO4bXODzc66tZnl8VU4BpjvL2JRVeEuc', planSetUrl: 'https://drive.google.com/drive/folders/1vO4bXODzc66tZnl8VU4BpjvL2JRVeEuc' },
      { name: '2 Bedroom — 750 SF', bedrooms: 2, bathrooms: 1, sqft: 750, description: 'Two-bedroom layout with an efficient floor plan for maximum livability.', floorPlanUrl: 'https://drive.google.com/drive/folders/1zgf_sQCQht8b_5_rPYpBVSt6B3jAUglE', planSetUrl: 'https://drive.google.com/drive/folders/1zgf_sQCQht8b_5_rPYpBVSt6B3jAUglE' },
      { name: '3 Bedroom — 1,000 SF', bedrooms: 3, bathrooms: 2, sqft: 1000, description: 'Full-size 3-bedroom ADU for families or premium rental income.', floorPlanUrl: 'https://drive.google.com/drive/folders/1kNhrFa6qdf9Xc_oZ9tVG0OcTmPNOYlsm', planSetUrl: 'https://drive.google.com/drive/folders/1kNhrFa6qdf9Xc_oZ9tVG0OcTmPNOYlsm' },
    ],
  },
  {
    name: 'San Marcos',
    slug: 'san-marcos',
    description: 'Three pre-approved ADU plans covering 1 to 3-bedroom options.',
    plans: [
      { name: '1 Bedroom — 600 SF', bedrooms: 1, bathrooms: 1, sqft: 600, description: 'A well-designed one-bedroom ADU approved for San Marcos properties.', floorPlanUrl: 'https://drive.google.com/drive/folders/1LuNIsyVLOoH4u4db-FNTsrWFsWZiJmq8', planSetUrl: 'https://drive.google.com/drive/folders/1LuNIsyVLOoH4u4db-FNTsrWFsWZiJmq8' },
      { name: '2 Bedroom — 750 SF', bedrooms: 2, bathrooms: 1, sqft: 750, description: 'Two-bedroom plan with open living and dining areas.', floorPlanUrl: 'https://drive.google.com/drive/folders/1UXT4zDSPf-b2Hvspw77ogC1TaEhSycto', planSetUrl: 'https://drive.google.com/drive/folders/1UXT4zDSPf-b2Hvspw77ogC1TaEhSycto' },
      { name: '3 Bedroom — 1,000 SF', bedrooms: 3, bathrooms: 2, sqft: 1000, description: 'Spacious three-bedroom ADU — the largest pre-approved plan in San Marcos.', floorPlanUrl: 'https://drive.google.com/drive/folders/1zwc7nSgZnmhC7yyykruHLTo4-6C3DVaG', planSetUrl: 'https://drive.google.com/drive/folders/1zwc7nSgZnmhC7yyykruHLTo4-6C3DVaG' },
    ],
  },
  {
    name: 'Escondido',
    slug: 'escondido',
    description: 'Three pre-approved ADU designs from 1 to 3 bedrooms.',
    plans: [
      { name: '1 Bedroom — 600 SF', bedrooms: 1, bathrooms: 1, sqft: 600, description: 'Compact one-bedroom ADU designed for Escondido zoning requirements.', floorPlanUrl: 'https://drive.google.com/drive/folders/1J6l8zGN1sbFSn9OuHSZdGyVfVxYzq15K', planSetUrl: 'https://drive.google.com/drive/folders/1J6l8zGN1sbFSn9OuHSZdGyVfVxYzq15K' },
      { name: '2 Bedroom — 750 SF', bedrooms: 2, bathrooms: 1, sqft: 750, description: 'Two-bedroom layout offering comfortable living for tenants or family.', floorPlanUrl: 'https://drive.google.com/drive/folders/1952UmEOe1xTqGkHxj4lSO5wdrMpgNxqa', planSetUrl: 'https://drive.google.com/drive/folders/1952UmEOe1xTqGkHxj4lSO5wdrMpgNxqa' },
      { name: '3 Bedroom — 1,000 SF', bedrooms: 3, bathrooms: 2, sqft: 1000, description: 'Three-bedroom ADU plan pre-approved for fast-tracked Escondido permits.', floorPlanUrl: 'https://drive.google.com/drive/folders/17k42zkiie01pO8iqwX9GDYriAokryl2X', planSetUrl: 'https://drive.google.com/drive/folders/17k42zkiie01pO8iqwX9GDYriAokryl2X' },
    ],
  },
  {
    name: 'Unincorporated County',
    slug: 'county',
    description: 'Three pre-approved ADU plans for unincorporated San Diego County areas.',
    plans: [
      { name: '1 Bedroom — 600 SF', bedrooms: 1, bathrooms: 1, sqft: 600, description: 'One-bedroom County-approved ADU plan for rural and suburban lots.', floorPlanUrl: 'https://drive.google.com/drive/folders/15UUWaiMtCIB3QFBhrLQ--J6MimMzDLPz', planSetUrl: 'https://drive.google.com/drive/folders/15UUWaiMtCIB3QFBhrLQ--J6MimMzDLPz' },
      { name: '2 Bedroom — 750 SF', bedrooms: 2, bathrooms: 1, sqft: 750, description: 'Two-bedroom plan approved for unincorporated San Diego County.', floorPlanUrl: 'https://drive.google.com/drive/folders/17Th9F5wV_yfY6QjPRjyygtQ0s_5qU8cN', planSetUrl: 'https://drive.google.com/drive/folders/17Th9F5wV_yfY6QjPRjyygtQ0s_5qU8cN' },
      { name: '3 Bedroom — 1,000 SF', bedrooms: 3, bathrooms: 2, sqft: 1000, description: 'Three-bedroom ADU — maximize your County property with a full-size unit.', floorPlanUrl: 'https://drive.google.com/drive/folders/1wRzXCd625uTBVOnW_OrmwT-medCVqUzd', planSetUrl: 'https://drive.google.com/drive/folders/1wRzXCd625uTBVOnW_OrmwT-medCVqUzd' },
    ],
  },
  {
    name: 'Encinitas',
    slug: 'encinitas',
    description: 'Four pre-approved ADU plans including a studio option for coastal living.',
    plans: [
      { name: 'Studio — 400 SF', bedrooms: 0, bathrooms: 1, sqft: 400, description: 'Coastal studio ADU — perfect for a beach rental or home office.', floorPlanUrl: 'https://drive.google.com/drive/folders/1b9KePfRakXh7vSqZcwDKzSHnYU3k9Dcx', planSetUrl: 'https://drive.google.com/drive/folders/1b9KePfRakXh7vSqZcwDKzSHnYU3k9Dcx' },
      { name: '1 Bedroom — 600 SF', bedrooms: 1, bathrooms: 1, sqft: 600, description: 'One-bedroom Encinitas plan with bright, open interior design.', floorPlanUrl: 'https://drive.google.com/drive/folders/1elis66bEp_oM6nnKBw45V35N2hN2NFI5', planSetUrl: 'https://drive.google.com/drive/folders/1elis66bEp_oM6nnKBw45V35N2hN2NFI5' },
      { name: '2 Bedroom — 750 SF', bedrooms: 2, bathrooms: 1, sqft: 750, description: 'Two-bedroom ADU ideal for Encinitas families or rental income.', floorPlanUrl: 'https://drive.google.com/drive/folders/1eSksgKCE_KbZTTBbIWTWe9YCDOrSGxA-', planSetUrl: 'https://drive.google.com/drive/folders/1eSksgKCE_KbZTTBbIWTWe9YCDOrSGxA-' },
      { name: '3 Bedroom — 1,000 SF', bedrooms: 3, bathrooms: 2, sqft: 1000, description: 'Full three-bedroom home pre-approved for Encinitas properties.', floorPlanUrl: 'https://drive.google.com/drive/folders/1TPY0mE7LajC-uz14e_HWhFpAEcpr21lD', planSetUrl: 'https://drive.google.com/drive/folders/1TPY0mE7LajC-uz14e_HWhFpAEcpr21lD' },
    ],
  },
];

export default function PreApprovedPlansPage() {
  const [openCity, setOpenCity] = useState<string | null>(null);

  const toggleCity = (slug: string) => {
    setOpenCity(openCity === slug ? null : slug);
  };

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
                { step: '01', title: 'Find Your City', desc: 'Select your jurisdiction below to see available pre-approved plans.' },
                { step: '02', title: 'View Floor Plans & Plan Sets', desc: 'Click to view the floor plan rendering and full architectural plan set.' },
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

        {/* City Accordions */}
        <section className="section-padding bg-brand-cream">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-display text-3xl text-brand-dark-teal text-center mb-3">Select Your City</h2>
            <p className="text-brand-slate/50 text-center mb-10">Click a city to view its pre-approved ADU plans.</p>

            <div className="space-y-4">
              {cities.map((city) => (
                <div key={city.slug} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  {/* City Header — Clickable */}
                  <button
                    onClick={() => toggleCity(city.slug)}
                    className="w-full flex items-center justify-between p-6 md:p-8 text-left hover:bg-gray-50/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-brand-dark-teal/5 flex items-center justify-center flex-shrink-0">
                        <MapPin className={`w-6 h-6 transition-colors ${openCity === city.slug ? 'text-brand-gold' : 'text-brand-mid-teal'}`} />
                      </div>
                      <div>
                        <h3 className="font-display text-xl md:text-2xl text-brand-dark-teal">{city.name}</h3>
                        <p className="text-sm text-brand-slate/40 mt-0.5">{city.plans.length} plans available</p>
                      </div>
                    </div>
                    <ChevronDown className={`w-6 h-6 text-brand-slate/30 transition-transform duration-300 flex-shrink-0 ${openCity === city.slug ? 'rotate-180 text-brand-gold' : ''}`} />
                  </button>

                  {/* Plans — Expandable */}
                  <AnimatePresence>
                    {openCity === city.slug && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 md:px-8 pb-8 pt-2">
                          <p className="text-brand-slate/50 text-sm mb-6">{city.description}</p>

                          <div className="space-y-4">
                            {city.plans.map((plan) => (
                              <div
                                key={plan.name}
                                className="border border-gray-100 rounded-xl p-5 md:p-6 hover:border-brand-gold/30 hover:shadow-sm transition-all"
                              >
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                  {/* Plan Info */}
                                  <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                      <Home className="w-4 h-4 text-brand-gold flex-shrink-0" />
                                      <h4 className="font-display text-lg text-brand-dark-teal">{plan.name}</h4>
                                    </div>
                                    <p className="text-sm text-brand-slate/40 ml-7">{plan.description}</p>
                                  </div>

                                  {/* Action Buttons */}
                                  <div className="flex flex-wrap gap-2 ml-7 md:ml-0">
                                    <a
                                      href={plan.floorPlanUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-dark-teal/5 text-brand-dark-teal text-xs font-semibold hover:bg-brand-dark-teal hover:text-white transition-all whitespace-nowrap"
                                    >
                                      <ImageIcon className="w-3.5 h-3.5" /> Floor Plan
                                    </a>
                                    <a
                                      href={plan.planSetUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-gold/10 text-brand-gold text-xs font-semibold hover:bg-brand-gold hover:text-brand-dark-teal transition-all whitespace-nowrap"
                                    >
                                      <FileText className="w-3.5 h-3.5" /> Plan Set
                                    </a>
                                    <Link
                                      href={`/contact?plan=${encodeURIComponent(`${city.name} - ${plan.name}`)}`}
                                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-brand-mid-teal/20 text-brand-mid-teal text-xs font-semibold hover:bg-brand-mid-teal hover:text-white transition-all whitespace-nowrap"
                                    >
                                      <ArrowRight className="w-3.5 h-3.5" /> Inquire
                                    </Link>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>

            {/* Custom plans CTA */}
            <div className="mt-16 bg-brand-dark-teal rounded-3xl p-10 md:p-14 text-center">
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
        </section>
      </main>
      <Footer />
    </>
  );
}
