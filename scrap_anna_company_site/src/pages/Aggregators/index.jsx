import React from 'react';
import { 
  Network, Layers, TrendingUp, ShieldCheck, CheckCircle2, 
  ArrowRight, Factory, Scale, FileCheck, Share2 
} from 'lucide-react';
import SEO from '../../components/common/SEO';
import PageHero from '../../components/common/PageHero';
import SectionHeader from '../../components/common/SectionHeader';
import CTASection from '../../components/common/CTASection';
import Button from '../../components/common/Button';
import { useJoinModal } from '../../components/layout/Layout';

export default function AggregatorsPage() {
  const { openJoinModal } = useJoinModal();

  const aggregatorBenefits = [
    {
      icon: Network,
      title: "Consolidated Merchant Supply",
      desc: "Tap into an aggregated pipeline of sorted scrap batches from hundreds of verified local merchants across Tamil Nadu."
    },
    {
      icon: Factory,
      title: "Direct Mill & Smelter Offtake",
      desc: "Connect bulk consolidated quantities directly with secondary steel plants, paper rolling mills, and polymer recycling units."
    },
    {
      icon: Layers,
      title: "High-Volume Consignment Lots",
      desc: "Access exclusive multi-ton industrial auction lots and commercial plant disposals directly via our digital platform."
    },
    {
      icon: Scale,
      title: "Quality Grading & Baling Efficiency",
      desc: "Improve sorting turnaround with pre-classified material streams and verified merchant quality scores."
    },
    {
      icon: FileCheck,
      title: "Digital Supply Chain Visibility",
      desc: "Track multi-truck dispatches, digital e-way bills, and consignment weighing records in real-time."
    },
    {
      icon: TrendingUp,
      title: "Competitive Wholesale Arbitrage",
      desc: "Unlock superior economies of scale with predictable material inflow and transparent reference market pricing."
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

      {/* STRATEGIC ADVANTAGES */}
      <section className="section bg-white">
        <div className="container">
          <SectionHeader
            eyebrow="Scale & Consolidation"
            title="Empowering Bulk Scrap Yards & Processing Hubs"
            subtitle="Bridging the critical gap between grassroots collection networks and large industrial recyclers."
          />

          <div className="grid-3">
            {aggregatorBenefits.map((item, idx) => {
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

      {/* STRATEGIC PARTNERSHIP VALUE */}
      <section className="section bg-graphite-dark text-white" style={{ borderTop: '1px solid #374151' }}>
        <div className="container">
          <div style={{
            maxWidth: '860px',
            margin: '0 auto',
            textAlign: 'center'
          }}>
            <span className="badge badge-dark" style={{ marginBottom: '1.25rem' }}>
              B2B Scrap Distribution
            </span>
            <h2 style={{ fontSize: 'var(--text-h2)', color: 'var(--color-white)', marginBottom: '1.25rem' }}>
              Why Scrap Anna is the Preferred Partner for Aggregators
            </h2>
            <p style={{ fontSize: 'var(--text-body-lg)', color: '#D1D5DB', lineHeight: 1.7, marginBottom: '2.5rem' }}>
              Instead of relying on unstable informal supply chains with volatile grading, Scrap Anna gives you structured volume, standardized digital paperwork, and direct linkages to verified secondary manufacturers.
            </p>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '1.5rem',
              textAlign: 'left',
              marginBottom: '2.5rem'
            }} className="aggregator-stats-grid">
              <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-primary-yellow)', marginBottom: '0.25rem' }}>
                  100%
                </div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.25rem' }}>Digital Provenance</div>
                <div style={{ fontSize: '0.8rem', color: '#9CA3AF' }}>Complete traceability of scrap origin for recycling certifications.</div>
              </div>

              <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-primary-yellow)', marginBottom: '0.25rem' }}>
                  Multi-Category
                </div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.25rem' }}>Ferrous & Non-Ferrous</div>
                <div style={{ fontSize: '0.8rem', color: '#9CA3AF' }}>Access segregated metals, polymers, OCC paper, and e-waste.</div>
              </div>

              <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-primary-yellow)', marginBottom: '0.25rem' }}>
                  Verified
                </div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.25rem' }}>Fast Settlements</div>
                <div style={{ fontSize: '0.8rem', color: '#9CA3AF' }}>Automated invoice generation and transparent payment clearing.</div>
              </div>
            </div>

            <Button
              variant="primary"
              size="lg"
              icon={ArrowRight}
              onClick={() => openJoinModal('aggregator')}
            >
              Partner as an Aggregator
            </Button>
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
          .aggregator-stats-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </>
  );
}
