import React from 'react';
import { 
  Factory, ShieldCheck, Scale, FileText, CheckCircle2, 
  ArrowRight, Sparkles, Building2, Truck, HelpCircle, Layers 
} from 'lucide-react';
import SEO from '../../components/common/SEO';
import PageHero from '../../components/common/PageHero';
import SectionHeader from '../../components/common/SectionHeader';
import CTASection from '../../components/common/CTASection';
import Button from '../../components/common/Button';
import { useJoinModal } from '../../components/layout/Layout';
import { faqData } from '../../data/siteData';
import industrialImg from '../../assets/industrial-facility.jpg';

export default function IndustriesPage() {
  const { openJoinModal } = useJoinModal();

  const industrialCapabilities = [
    {
      icon: Layers,
      title: "Bulk Scrap Lot Listings",
      desc: "Post large recurring or one-off scrap batches with chemical grade details, dimensions, and approximate tonnage."
    },
    {
      icon: Scale,
      title: "Weighbridge Synchronization",
      desc: "Gross and tare weight recordings with certified weighbridge receipts and tamper-proof digital logs."
    },
    {
      icon: FileText,
      title: "Audit-Ready GST Invoicing",
      desc: "Automated generation of GST-compliant commercial invoices, tax splits, and integrated e-way bill manifests."
    },
    {
      icon: ShieldCheck,
      title: "Certified Recycler Network",
      desc: "Connect strictly with authorized commercial recyclers and aggregators possessing required environmental clearances."
    },
    {
      icon: Truck,
      title: "Factory Gate Pass & Logistics",
      desc: "Structured driver and vehicle verification for seamless security clearance and compliance with plant safety protocols."
    },
    {
      icon: Sparkles,
      title: "ESG & Green Footprint Reports",
      desc: "Quantify your factory's environmental circularity metrics with verified certificates of responsible recycling."
    }
  ];

  const industrialMaterials = [
    { name: "Heavy Melting Steel & Turnings", desc: "HMS 1 & 2, CNC machine turnings, stamping scrap, punch skeletons." },
    { name: "Non-Ferrous Industrial Metals", desc: "Aluminium extrusion offcuts, copper busbars & armatures, brass turnings." },
    { name: "Packaging & Corrugated Waste", desc: "High-volume OCC carton bales, industrial paper rolls, kraft paper waste." },
    { name: "Industrial Polymers & Plastics", desc: "HDPE barrels, PP pallets & totes, purge lumps, LDPE stretch wrapping." },
    { name: "Decommissioned Plant & Machinery", desc: "Obsolete boilers, electric motors, transformers, manufacturing line teardowns." },
    { name: "Cables & Heavy Electricals", desc: "Armoured copper/aluminium cabling, high-voltage switchgear scrap." }
  ];

  return (
    <>
      <SEO
        title="For Industries - Commercial Scrap Disposal & Compliance"
        description="Streamline factory scrap disposal with Scrap Anna. Certified commercial recyclers, weighbridge synchronization, GST digital billing, and audit-ready records."
      />

      <PageHero
        eyebrow="Commercial & Enterprise Solutions"
        badgeIcon={Factory}
        title="Turn Industrial Scrap Into Corporate Opportunity"
        highlightWord="Corporate Opportunity"
        description="Dispose of manufacturing waste and factory scrap lots with verified commercial recyclers, authenticated weighbridge verification, and complete digital GST compliance."
        breadcrumbs={[{ label: 'For Industries' }]}
        primaryCta={{
          text: "Register Your Industry",
          onClick: () => openJoinModal('industry')
        }}
        secondaryCta={{
          text: "View Market Prices",
          to: "/market-prices"
        }}
      />

      {/* INDUSTRIAL CAPABILITIES OVERVIEW */}
      <section className="section bg-white">
        <div className="container">
          <SectionHeader
            eyebrow="Enterprise Features"
            title="Engineered for Manufacturing Plants & Industrial Corridors"
            subtitle="Transform your industrial scrap disposal from an operational headache into a structured, compliant revenue stream."
          />

          <div className="grid-3">
            {industrialCapabilities.map((cap, idx) => {
              const Icon = cap.icon;
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
                    {cap.title}
                  </h3>
                  <p style={{ fontSize: 'var(--text-small)', color: 'var(--color-text-secondary)', lineHeight: 1.6, margin: 0 }}>
                    {cap.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* INDUSTRIAL FACILITY SHOWCASE & WORKFLOW */}
      <section className="section bg-graphite-dark text-white" style={{ borderTop: '1px solid #374151', borderBottom: '1px solid #374151' }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '3.5rem',
            alignItems: 'center'
          }} className="industry-showcase-grid">
            
            <div>
              <span className="badge badge-dark" style={{ marginBottom: '1rem' }}>
                Operational Excellence
              </span>
              <h2 style={{ fontSize: 'var(--text-h2)', color: 'var(--color-white)', marginBottom: '1.25rem' }}>
                Standardized Logistics & Gate-Pass Compliance
              </h2>
              <p style={{ fontSize: 'var(--text-body)', color: '#D1D5DB', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                We understand the strict safety and administrative requirements of modern manufacturing plants, auto-ancillary factories, and logistics hubs.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {[
                  "Complete driver KYC & vehicle fitness documentation prior to plant entry",
                  "Support for customized weighbridge gross/tare ticketing formats",
                  "Automated generation of E-Way bills and GST tax invoices",
                  "Chain-of-custody recycling manifests for statutory environmental audits"
                ].map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                    <div style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--color-primary-yellow)',
                      color: 'var(--color-graphite-dark)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      marginTop: '2px'
                    }}>
                      <CheckCircle2 size={16} strokeWidth={3} />
                    </div>
                    <span style={{ fontSize: 'var(--text-small)', color: '#E5E7EB', lineHeight: 1.5 }}>
                      {item}
                    </span>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: '2rem' }}>
                <Button
                  variant="primary"
                  size="lg"
                  icon={ArrowRight}
                  onClick={() => openJoinModal('industry')}
                >
                  Onboard Your Factory
                </Button>
              </div>
            </div>

            {/* Industrial Scrap Management Facility Visual */}
            <div style={{ position: 'relative' }}>
              <div style={{
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-xl)',
                border: '2px solid #374151'
              }}>
                <img
                  src={industrialImg}
                  alt="Scrap Anna clean industrial scrap logistics and handling yard"
                  style={{
                    width: '100%',
                    height: 'auto',
                    objectFit: 'cover',
                    display: 'block'
                  }}
                  loading="lazy"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* INDUSTRIAL SCRAP CATEGORIES */}
      <section className="section bg-white">
        <div className="container">
          <SectionHeader
            eyebrow="Commercial Grades"
            title="Accepted Industrial Scrap Materials"
            subtitle="We handle large-scale recurring factory lots across standard industrial classifications."
          />

          <div className="grid-3">
            {industrialMaterials.map((mat, idx) => (
              <div key={idx} className="card card-hover" style={{ backgroundColor: 'var(--color-offwhite)' }}>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: 'var(--color-graphite-dark)' }}>
                  {mat.name}
                </h3>
                <p style={{ fontSize: 'var(--text-small)', color: 'var(--color-text-secondary)', lineHeight: 1.6, margin: 0 }}>
                  {mat.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* INDUSTRY FAQS */}
      <section className="section bg-offwhite" style={{ borderTop: '1px solid var(--color-border)' }}>
        <div className="container-narrow">
          <SectionHeader
            eyebrow="Corporate FAQ"
            title="Industrial Scrap Questions"
            subtitle="Common questions from plant managers, procurement officers, and environmental heads."
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {faqData.industry.map((item, idx) => (
              <div 
                key={idx}
                style={{
                  backgroundColor: 'var(--color-white)',
                  padding: '1.5rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border)'
                }}
              >
                <h3 style={{ fontSize: '1.1rem', color: 'var(--color-graphite-dark)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <HelpCircle size={18} style={{ color: 'var(--color-primary-yellow)' }} />
                  <span>{item.q}</span>
                </h3>
                <p style={{ fontSize: 'var(--text-small)', color: 'var(--color-text-secondary)', lineHeight: 1.6, margin: 0, paddingLeft: '1.65rem' }}>
                  {item.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTASection
        title="Ready to Digitize Your Factory Scrap Procurement?"
        description="Partner with Scrap Anna for transparent auction bidding, certified recyclers, and digital GST manifests."
        primaryText="Schedule Corporate Discussion"
        onJoinClick={() => openJoinModal('industry')}
      />

      <style>{`
        @media (max-width: 1024px) {
          .industry-showcase-grid {
            grid-template-columns: 1fr !important;
            gap: 2.5rem !important;
          }
        }
      `}</style>
    </>
  );
}
