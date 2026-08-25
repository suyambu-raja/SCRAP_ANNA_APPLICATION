import React from 'react';
import { 
  Network, Factory, Scale, ShieldCheck, CheckCircle2, 
  ArrowRight, Layers, Truck, FileCheck
} from 'lucide-react';
import SEO from '../../components/common/SEO';
import PageHero from '../../components/common/PageHero';
import SectionHeader from '../../components/common/SectionHeader';
import CTASection from '../../components/common/CTASection';
import Button from '../../components/common/Button';
import { useJoinModal } from '../../components/layout/Layout';

export default function AggregatorsPage() {
  const { openJoinModal } = useJoinModal();

  const keyBenefits = [
    {
      icon: Network,
      title: "Consolidated Merchant Supply",
      desc: "Tap into an aggregated pipeline of sorted scrap batches from verified neighborhood merchants across Tamil Nadu."
    },
    {
      icon: Factory,
      title: "Direct Mill & Smelter Offtake",
      desc: "Connect bulk consolidated quantities directly with secondary steel plants, paper rolling mills, and polymer recyclers."
    },
    {
      icon: FileCheck,
      title: "Digital Supply & Fast Settlement",
      desc: "Standardized digital manifests, verified weights, e-way bills, and transparent payment clearing for large lots."
    }
  ];

  const simpleWorkflow = [
    {
      num: "01",
      title: "Consolidate Supply",
      desc: "Aggregate sorted scrap batches from local neighborhood collection merchants."
    },
    {
      num: "02",
      title: "Grade & Bale",
      desc: "Process scrap lots into high-density bales, shredded bundles, or classified metal grades."
    },
    {
      num: "03",
      title: "Fulfill Mill Contracts",
      desc: "Supply bulk volumes directly to verified secondary manufacturers with complete digital records."
    }
  ];

  return (
    <>
      <SEO
        title="For Aggregators - Connect with a Larger Scrap Network"
        description="Partner with Scrap Anna to consolidate scrap supply from local merchants, fulfill bulk recycling contracts, and optimize your scrap yard operations."
      />

      <PageHero
        eyebrow="Consolidated Supply Network"
        badgeIcon={Network}
        title="Connect With a Larger Scrap Network"
        highlightWord="Larger Scrap Network"
        description="Aggregators can consolidate scrap from multiple merchants and connect bulk quantities with recycling companies, steel rolling mills, and industrial buyers."
        breadcrumbs={[{ label: 'For Aggregators' }]}
        primaryCta={{
          text: "Become an Aggregator Partner",
          onClick: () => openJoinModal('aggregator')
        }}
        secondaryCta={{
          text: "Explore How It Works",
          to: "/how-it-works"
        }}
      />

      {/* 3 KEY BENEFITS */}
      <section className="section bg-white">
        <div className="container">
          <SectionHeader
            eyebrow="Aggregator Advantages"
            title="Scale Your Bulk Scrap Operations"
            subtitle="Bridging the gap between grassroots collection networks and large industrial recyclers."
          />

          <div className="grid-3">
            {keyBenefits.map((item, idx) => {
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

      {/* SIMPLE WORKFLOW */}
      <section className="section bg-offwhite" style={{ borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)' }}>
        <div className="container">
          <SectionHeader
            eyebrow="Simple Workflow"
            title="How Aggregation Hubs Work"
            subtitle="From merchant intake to high-volume industrial dispatch."
          />

          <div className="grid-3" style={{ gap: '1.5rem', maxWidth: '1000px', margin: '0 auto 2.5rem auto' }}>
            {simpleWorkflow.map((step, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E5E7EB',
                  borderRadius: '14px',
                  padding: '1.75rem 1.5rem',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)'
                }}
              >
                <span style={{
                  fontSize: '0.8rem',
                  fontWeight: 800,
                  color: '#92400E',
                  backgroundColor: '#FEF3C7',
                  padding: '0.2rem 0.55rem',
                  borderRadius: '6px',
                  display: 'inline-block',
                  marginBottom: '1rem',
                  fontFamily: 'monospace'
                }}>
                  {step.num}
                </span>
                <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#1F242D', marginBottom: '0.45rem' }}>
                  {step.title}
                </h4>
                <p style={{ fontSize: '0.875rem', color: '#6B7280', lineHeight: 1.6, margin: 0 }}>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center' }}>
            <Button
              variant="primary"
              size="lg"
              icon={ArrowRight}
              onClick={() => openJoinModal('aggregator')}
            >
              Join as Aggregator Partner
            </Button>
          </div>
        </div>
      </section>

      {/* PARTNER VERIFICATION DETAILS */}
      <section className="section bg-white">
        <div className="container" style={{ maxWidth: '920px' }}>
          <div style={{
            backgroundColor: '#FFF8DB',
            border: '1.5px solid #FDE68A',
            borderRadius: '16px',
            padding: '2.5rem',
            boxShadow: '0 4px 16px rgba(249, 197, 28, 0.08)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                backgroundColor: 'var(--color-primary-yellow)',
                color: '#1F242D',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <ShieldCheck size={24} />
              </div>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#1F242D', margin: 0 }}>
                Partner Verification & Quality Standards
              </h3>
            </div>

            <p style={{ fontSize: '0.95rem', color: '#4B5563', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              To maintain integrity across the supply chain, aggregator partners undergo swift verification for infrastructure, weighing accuracy, and statutory compliance:
            </p>

            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '1rem'
            }} className="verification-grid">
              {[
                "Weighbridge and platform scale calibration certification",
                "Storage yard capacity and material segregation facilities",
                "GST registration and commercial tax compliance",
                "Environmental clearances for statutory audit manifests"
              ].map((item, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
                  <CheckCircle2 size={18} style={{ color: '#16A34A', flexShrink: 0, marginTop: '2px' }} strokeWidth={2.5} />
                  <span style={{ fontSize: '0.875rem', color: '#374151', lineHeight: 1.5 }}>
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <CTASection
        title="Looking to Scale Your Yard Volumes?"
        description="Connect with our enterprise aggregation desk to explore regional procurement and mill supply partnerships."
        primaryText="Connect with Partner Desk"
        onJoinClick={() => openJoinModal('aggregator')}
      />

      <style>{`
        @media (max-width: 768px) {
          .verification-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </>
  );
}
