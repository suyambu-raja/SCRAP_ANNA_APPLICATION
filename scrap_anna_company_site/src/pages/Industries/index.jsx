import React from 'react';
import { 
  Factory, CheckCircle2, ArrowRight, 
  Package, Users, Tag, Clock, SlidersHorizontal, Check
} from 'lucide-react';
import SEO from '../../components/common/SEO';
import PageHero from '../../components/common/PageHero';
import SectionHeader from '../../components/common/SectionHeader';
import CTASection from '../../components/common/CTASection';
import Button from '../../components/common/Button';
import { useJoinModal } from '../../components/layout/Layout';
import industrialImg from '../../assets/industrial-facility.jpg';

export default function IndustriesPage() {
  const { openJoinModal } = useJoinModal();

  const industryWorkflowSteps = [
    {
      num: "01",
      icon: Package,
      title: "Post Your Scrap",
      desc: "Add the scrap material, quantity, photos and pickup details."
    },
    {
      num: "02",
      icon: Users,
      title: "Nearby Merchants Respond",
      desc: "Relevant nearby merchants can view your request and submit their offered price."
    },
    {
      num: "03",
      icon: Tag,
      title: "Compare Offers",
      desc: "Review the prices and available pickup timing from interested merchants."
    },
    {
      num: "04",
      icon: SlidersHorizontal,
      title: "Choose Your Merchant",
      desc: "Select the offer that best matches your price and time requirements."
    },
    {
      num: "05",
      icon: Clock,
      title: "Schedule Pickup",
      desc: "Connect with the selected merchant and proceed with the pickup."
    }
  ];

  const keyBenefits = [
    "Multiple merchant offers",
    "Compare prices",
    "Choose based on price and timing",
    "Nearby merchant connections",
    "More transparency",
    "Less manual searching"
  ];

  return (
    <>
      <SEO
        title="For Industries - Commercial Scrap Disposal & Multiple Merchant Offers"
        description="Post factory scrap once and receive competitive price offers from nearby verified merchants. Compare prices and timing, choose your preferred merchant, with full GST compliance."
      />

      <PageHero
        eyebrow="Commercial & Enterprise Solutions"
        badgeIcon={Factory}
        title="Industries Get Multiple Offers. You Choose."
        highlightWord="You Choose."
        description="Instead of contacting merchants one by one, post your scrap on Scrap Anna and receive offers from nearby verified merchants. Compare available offers and choose what works best for your price and timing."
        breadcrumbs={[{ label: 'For Industries' }]}
        primaryCta={{
          text: "Post Scrap & Get Offers",
          onClick: () => openJoinModal('industry')
        }}
        secondaryCta={{
          text: "View Market Prices",
          to: "/market-prices"
        }}
      />

      {/* CORE FEATURE: INDUSTRY SCRAP PRICE REQUESTS & WORKFLOW */}
      <section className="section bg-white">
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 3rem auto' }}>
            <span className="badge badge-yellow" style={{ marginBottom: '0.75rem' }}>
              Industry Scrap Price Requests
            </span>
            <h2 style={{
              fontSize: 'clamp(1.75rem, 3vw, 2.35rem)',
              fontWeight: 800,
              color: 'var(--color-graphite-dark)',
              letterSpacing: '-0.02em',
              marginBottom: '0.85rem'
            }}>
              Let Merchants Compete for Your Scrap
            </h2>
            <p style={{
              fontSize: 'var(--text-body)',
              color: 'var(--color-text-secondary)',
              lineHeight: 1.7,
              margin: 0
            }}>
              Instead of contacting merchants one by one, post your scrap once on Scrap Anna and let nearby verified merchants respond with their price. Compare offers and choose the option that works best for your price and pickup requirements.
            </p>
          </div>

          {/* Simple Message Banner */}
          <div style={{
            backgroundColor: '#FFF8DB',
            border: '1.5px solid #FDE68A',
            borderRadius: '14px',
            padding: '1.25rem 1.75rem',
            marginBottom: '3rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-primary-yellow)',
                color: '#1F242D',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                fontWeight: 800
              }}>
                ✓
              </div>
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#1F242D', margin: '0 0 0.15rem 0' }}>
                  Post once. Get multiple offers. Compare. Choose.
                </h4>
                <p style={{ fontSize: '0.85rem', color: '#6B7280', margin: 0 }}>
                  You are not locked into any fixed price or single merchant — you decide based on price and pickup timing.
                </p>
              </div>
            </div>

            <Button
              variant="primary"
              size="sm"
              icon={ArrowRight}
              onClick={() => openJoinModal('industry')}
            >
              Post Industry Scrap
            </Button>
          </div>

          {/* 5-Step Workflow Cards */}
          <div style={{ marginBottom: '3.5rem' }}>
            <h3 style={{
              fontSize: '1.35rem',
              fontWeight: 800,
              color: 'var(--color-graphite-dark)',
              textAlign: 'center',
              marginBottom: '2rem'
            }}>
              How Industries Sell Scrap
            </h3>

            <div 
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(5, 1fr)',
                gap: '1.25rem'
              }}
              className="industry-workflow-grid"
            >
              {industryWorkflowSteps.map((step, idx) => {
                const Icon = step.icon;
                return (
                  <div
                    key={idx}
                    style={{
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #E5E7EB',
                      borderRadius: '14px',
                      padding: '1.5rem 1.25rem',
                      display: 'flex',
                      flexDirection: 'column',
                      position: 'relative',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)',
                      transition: 'all 0.2s ease'
                    }}
                    className="industry-step-card"
                  >
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '1.25rem'
                    }}>
                      <div style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '10px',
                        backgroundColor: '#FFF8DB',
                        border: '1px solid #FDE68A',
                        color: '#1F242D',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        <Icon size={22} strokeWidth={2} />
                      </div>

                      <span style={{
                        fontSize: '0.8rem',
                        fontWeight: 800,
                        color: '#92400E',
                        backgroundColor: '#FEF3C7',
                        padding: '0.2rem 0.55rem',
                        borderRadius: '6px',
                        fontFamily: 'monospace'
                      }}>
                        {step.num}
                      </span>
                    </div>

                    <h4 style={{
                      fontSize: '1.05rem',
                      fontWeight: 800,
                      color: '#1F242D',
                      marginBottom: '0.45rem',
                      lineHeight: 1.3
                    }}>
                      {step.title}
                    </h4>

                    <p style={{
                      fontSize: '0.85rem',
                      color: '#6B7280',
                      lineHeight: 1.55,
                      margin: 0
                    }}>
                      {step.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Key Benefits Pills Grid */}
          <div style={{
            backgroundColor: '#F9FAFB',
            border: '1px solid #E5E7EB',
            borderRadius: '14px',
            padding: '2rem',
            textAlign: 'center'
          }}>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1F242D', marginBottom: '1.25rem' }}>
              Why Industries Prefer Scrap Anna's Price Request Model
            </h4>
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.75rem',
              justifyContent: 'center'
            }}>
              {keyBenefits.map((benefit, idx) => (
                <div
                  key={idx}
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #D1D5DB',
                    borderRadius: '9999px',
                    padding: '0.5rem 1.15rem',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: '#1F242D',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)'
                  }}
                >
                  <Check size={16} style={{ color: '#16A34A' }} strokeWidth={2.5} />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* INDUSTRIAL FACILITY SHOWCASE & GATE-PASS LOGISTICS WORKFLOW */}
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

      <CTASection
        title="Ready to Digitize Your Factory Scrap Procurement?"
        description="Partner with Scrap Anna for transparent auction bidding, certified recyclers, and digital GST manifests."
        primaryText="Schedule Corporate Discussion"
        onJoinClick={() => openJoinModal('industry')}
      />

      <style>{`
        .industry-step-card:hover {
          transform: translateY(-3px);
          border-color: #D1D5DB !important;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.06) !important;
        }
        @media (max-width: 1024px) {
          .industry-showcase-grid {
            grid-template-columns: 1fr !important;
            gap: 2.5rem !important;
          }
          .industry-workflow-grid {
            grid-template-columns: repeat(3, 1fr) !important;
            gap: 1.25rem !important;
          }
        }
        @media (max-width: 768px) {
          .industry-workflow-grid {
            grid-template-columns: 1fr !important;
            gap: 1rem !important;
          }
        }
      `}</style>
    </>
  );
}
