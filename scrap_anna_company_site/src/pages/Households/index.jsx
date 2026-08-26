import React from 'react';
import { 
  Home, CheckCircle2, Scale, ShieldCheck, Receipt, 
  Clock, ArrowRight, Sparkles 
} from 'lucide-react';
import SEO from '../../components/common/SEO';
import PageHero from '../../components/common/PageHero';
import SectionHeader from '../../components/common/SectionHeader';
import CTASection from '../../components/common/CTASection';
import Button from '../../components/common/Button';
import { useJoinModal } from '../../components/layout/Layout';

export default function HouseholdsPage() {
  const { openJoinModal } = useJoinModal();

  const householdFlow = [
    { num: "01", title: "Add Scrap Items", desc: "Select scrap items from your house (paper, metals, electronics, plastics) and estimate weight." },
    { num: "02", title: "Upload Photos (Optional)", desc: "Take a picture of your scrap pile to help the merchant come with the right vehicle." },
    { num: "03", title: "Set Your Address", desc: "Pin your apartment/house location in Chennai for fast and accurate arrival." },
    { num: "04", title: "Select Verified Merchant", desc: "Get matched with high-rated, background-verified neighborhood scrap merchants." },
    { num: "05", title: "Schedule Pickup Slot", desc: "Choose a morning or evening time slot that fits your convenience." },
    { num: "06", title: "Get Paid & Digital Bill", desc: "Weigh on certified digital scales, share your OTP, and receive instant cash/UPI payment with a digital receipt." },
  ];

  const acceptedMaterials = [
    { title: "Paper & Cardboard", items: "Newspapers, Cartons, Old Books, Magazines, Office Records", icon: "📰" },
    { title: "Metals & Utensils", items: "Iron Grills, Aluminium Sections, Copper Wires, Brass Utensils, Steel", icon: "🔩" },
    { title: "Electronics & E-Waste", items: "Laptops, Broken TVs, CPU Towers, Mixers, Microwaves, Wiring", icon: "💻" },
    { title: "Household Appliances", items: "Old Refrigerators, Washing Machines, Air Conditioners, Geysers", icon: "❄️" },
    { title: "Plastics & Batteries", items: "Hard Plastic Buckets, Oil Cans, Inverter Batteries, Car Batteries", icon: "🔋" },
    { title: "Miscellaneous Scrap", items: "Bicycles, Metal Furniture, Vehicle Rims, Cable Scrap", icon: "🚲" },
  ];

  return (
    <>
      <SEO
        title="For Households - Doorstep Scrap Pickup at Fair Rates"
        description="Turn your household scrap into instant value. Schedule doorstep pickup with verified merchants, digital scales, and instant digital billing."
      />

      <PageHero
        eyebrow="Household Recycling"
        badgeIcon={Home}
        title="Turn Your Household Scrap Into Value"
        highlightWord="Scrap Into Value"
        description="Clear out home clutter with zero hassle. Connect with background-verified neighborhood merchants, enjoy doorstep digital weighing, and receive fair market payments."
        breadcrumbs={[{ label: 'For Households' }]}
        primaryCta={{
          text: "Start Selling Scrap",
          onClick: () => openJoinModal('household')
        }}
        secondaryCta={{
          text: "Check Reference Rates",
          to: "/market-prices"
        }}
      />

      {/* VALUE PROPOSITION GRID */}
      <section className="section bg-white">
        <div className="container">
          <SectionHeader
            eyebrow="Why Choose Scrap Anna"
            title="The Modern Way to Sell Household Scrap"
            subtitle="No more waiting around for wandering scrap collectors or worrying about rigged manual scales."
          />

          <div className="grid-3">
            {[
              {
                icon: Clock,
                title: "Convenient Doorstep Pickup",
                desc: "Choose a pickup slot that fits your schedule on weekdays or weekends without interrupting your day."
              },
              {
                icon: ShieldCheck,
                title: "Nearby Verified Merchants",
                desc: "Every merchant entering your premises is background-checked and identity-verified for safety."
              },
              {
                icon: Scale,
                title: "Certified Digital Scales",
                desc: "Scrap is weighed transparently in front of your eyes using certified digital hanging & platform scales."
              },
              {
                icon: Receipt,
                title: "Itemized Digital Invoices",
                desc: "Get an instant digital bill sent to your mobile with line-item weights, rates, and payout breakdown."
              },
              {
                icon: CheckCircle2,
                title: "Instant Payment",
                desc: "Receive payment immediately upon OTP confirmation via UPI, Google Pay, PhonePe, or cash."
              },
              {
                icon: Sparkles,
                title: "Positive Green Impact",
                desc: "Track how much scrap you diverted from Chennai's municipal landfills and contributed to recycling."
              }
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="card card-hover" style={{ backgroundColor: 'var(--color-offwhite)' }}>
                  <div style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'var(--color-primary-yellow-light)',
                    border: '1px solid var(--color-soft-yellow-border)',
                    color: '#92400E',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1.25rem'
                  }}>
                    <Icon size={22} />
                  </div>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--color-graphite-dark)' }}>
                    {item.title}
                  </h3>
                  <p style={{ fontSize: 'var(--text-small)', color: 'var(--color-text-secondary)', lineHeight: 1.6, margin: 0 }}>
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6-STEP HOUSEHOLD PICKUP FLOW */}
      <section className="section bg-offwhite" style={{ borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)' }}>
        <div className="container">
          <SectionHeader
            eyebrow="Simple 6-Step Journey"
            title="How Doorstep Pickup Works"
            subtitle="From listing to payment in just a few quick taps."
          />

          <div className="grid-3" style={{ gap: '1.5rem' }}>
            {householdFlow.map((step, idx) => (
              <div 
                key={idx}
                className="card"
                style={{
                  backgroundColor: 'var(--color-white)',
                  border: '1px solid var(--color-border)',
                  position: 'relative'
                }}
              >
                <div style={{
                  fontSize: '1.25rem',
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 800,
                  color: 'var(--color-primary-yellow)',
                  backgroundColor: 'var(--color-primary-yellow-light)',
                  padding: '0.2rem 0.65rem',
                  borderRadius: 'var(--radius-pill)',
                  display: 'inline-block',
                  marginBottom: '1rem',
                  border: '1px solid var(--color-soft-yellow-border)'
                }}>
                  {step.num}
                </div>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: 'var(--color-graphite-dark)' }}>
                  {step.title}
                </h3>
                <p style={{ fontSize: 'var(--text-small)', color: 'var(--color-text-secondary)', lineHeight: 1.6, margin: 0 }}>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <Button
              variant="primary"
              size="lg"
              icon={ArrowRight}
              onClick={() => openJoinModal('household')}
            >
              Request Doorstep Pickup Now
            </Button>
          </div>
        </div>
      </section>

      {/* MATERIALS ACCEPTED GUIDE */}
      <section className="section bg-white">
        <div className="container">
          <SectionHeader
            eyebrow="What We Recycle"
            title="Accepted Household Scrap Materials"
            subtitle="We help recycle almost all clean dry recyclable scrap items from your household."
          />

          <div className="grid-3">
            {acceptedMaterials.map((mat, idx) => (
              <div key={idx} className="card card-hover" style={{ backgroundColor: 'var(--color-white)' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>
                  {mat.icon}
                </div>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.4rem', color: 'var(--color-graphite-dark)' }}>
                  {mat.title}
                </h3>
                <p style={{ fontSize: 'var(--text-small)', color: 'var(--color-text-secondary)', lineHeight: 1.5, margin: 0 }}>
                  {mat.items}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTASection
        title="Ready to Clear Out Household Scrap?"
        description="Book a verified merchant pickup in minutes and get fair rates at your doorstep."
        primaryText="Schedule Household Pickup"
        onJoinClick={() => openJoinModal('household')}
      />
    </>
  );
}
