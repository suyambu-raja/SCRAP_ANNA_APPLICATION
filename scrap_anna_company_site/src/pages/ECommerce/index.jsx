import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, FileText, Handshake, ShoppingBag, 
  PackagePlus, Users, BadgeCheck, ShieldCheck, 
  ArrowRight, ChevronRight, MapPin, Store, 
  Sparkles, Info, CheckCircle2
} from 'lucide-react';
import SEO from '../../components/common/SEO';
import PageHero from '../../components/common/PageHero';
import SectionHeader from '../../components/common/SectionHeader';
import CTASection from '../../components/common/CTASection';
import { useJoinModal } from '../../components/layout/Layout';

export default function ECommercePage() {
  const { openJoinModal } = useJoinModal();

  // Buy Scrap Workflow Steps
  const buySteps = [
    {
      number: "01",
      title: "Find Scrap",
      description: "Discover available scrap from connected sellers.",
      icon: Search
    },
    {
      number: "02",
      title: "Check Details",
      description: "View material, quantity, location and available information.",
      icon: FileText
    },
    {
      number: "03",
      title: "Connect",
      description: "Connect with the seller and discuss the pickup or transaction.",
      icon: Handshake
    },
    {
      number: "04",
      title: "Buy Scrap",
      description: "Complete the purchase directly between the relevant parties.",
      icon: ShoppingBag
    }
  ];

  // Sell Scrap Workflow Steps
  const sellSteps = [
    {
      number: "01",
      title: "List Scrap",
      description: "Add the material, quantity, photos and location.",
      icon: PackagePlus
    },
    {
      number: "02",
      title: "Get Connected",
      description: "Relevant buyers can discover your available scrap.",
      icon: Users
    },
    {
      number: "03",
      title: "Connect",
      description: "Discuss the material, quantity and transaction details.",
      icon: Handshake
    },
    {
      number: "04",
      title: "Sell Scrap",
      description: "Complete the sale with the connected buyer.",
      icon: BadgeCheck
    }
  ];

  return (
    <>
      <SEO
        title="Buy & Sell Scrap - Simple Merchant Workflow | Scrap Anna Chennai"
        description="A simple way for merchants to find scrap, connect with buyers and sellers, and grow their business through the Scrap Anna network. Launching first in Chennai, Tamil Nadu."
      />

      {/* HERO SECTION */}
      <PageHero
        eyebrow="Merchant Network"
        badgeIcon={Store}
        title="Buy & Sell Scrap Through Scrap Anna"
        highlightWord="Buy & Sell Scrap"
        description="A simple way for merchants to find scrap, connect with buyers and sellers, and grow their business through the Scrap Anna network."
        breadcrumbs={[{ label: 'Sell & Buy Scrap' }]}
        primaryCta={{
          text: "Join as a Merchant",
          onClick: () => openJoinModal('merchant')
        }}
        secondaryCta={{
          text: "View Workflow",
          to: "#workflow"
        }}
      />

      {/* DUAL HORIZONTAL WORKFLOW SECTION */}
      <section id="workflow" className="section bg-white" style={{ paddingTop: '4.5rem', paddingBottom: '4.5rem' }}>
        <div className="container" style={{ maxWidth: '1200px' }}>
          
          <SectionHeader
            eyebrow="How It Works"
            title="Buy & Sell Scrap"
            subtitle="A simple way for merchants to find scrap, connect with buyers and sellers, and grow their business through the Scrap Anna network."
          />

          {/* WORKFLOW 1: BUY SCRAP */}
          <div style={{
            backgroundColor: '#FFFFFF',
            border: '1.5px solid #E5E7EB',
            borderRadius: '18px',
            padding: '2.5rem 2rem',
            marginBottom: '3rem',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.03)'
          }}>
            {/* Header / Label */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem',
              marginBottom: '2.25rem',
              borderBottom: '1px solid #F3F4F6',
              paddingBottom: '1.25rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <span style={{
                  backgroundColor: 'var(--color-primary-yellow)',
                  color: '#111827',
                  fontSize: '0.8rem',
                  fontWeight: 800,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  padding: '0.35rem 0.85rem',
                  borderRadius: '9999px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem'
                }}>
                  <ShoppingBag size={14} />
                  BUY SCRAP
                </span>
                <span style={{ fontSize: '1.05rem', fontWeight: 700, color: '#111827' }}>
                  Find available scrap and connect with the seller.
                </span>
              </div>

              <span style={{ fontSize: '0.8rem', color: '#6B7280', fontWeight: 600 }}>
                4 Simple Steps
              </span>
            </div>

            {/* 4 Cards in a Row with Desktop Arrows */}
            <div 
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '1.25rem',
                position: 'relative'
              }}
              className="workflow-grid"
            >
              {buySteps.map((step, idx) => {
                const IconComp = step.icon;
                return (
                  <div
                    key={idx}
                    style={{
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #E5E7EB',
                      borderRadius: '14px',
                      padding: '24px',
                      display: 'flex',
                      flexDirection: 'column',
                      position: 'relative',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.02)',
                      transition: 'all 0.2s ease'
                    }}
                    className="workflow-step-card"
                  >
                    {/* Top Row: Icon and Step Number */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '1.25rem'
                    }}>
                      <div style={{
                        width: '46px',
                        height: '46px',
                        borderRadius: '10px',
                        backgroundColor: '#FFF8DB',
                        border: '1px solid #FDE68A',
                        color: '#111827',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        <IconComp size={22} strokeWidth={2} />
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
                        {step.number}
                      </span>
                    </div>

                    <h4 style={{
                      fontSize: '1.15rem',
                      fontWeight: 800,
                      color: '#111827',
                      marginBottom: '0.45rem',
                      lineHeight: 1.3
                    }}>
                      {step.title}
                    </h4>

                    <p style={{
                      fontSize: '0.9rem',
                      color: '#6B7280',
                      lineHeight: 1.55,
                      margin: 0
                    }}>
                      {step.description}
                    </p>

                    {/* Arrow indicator for non-last items */}
                    {idx < 3 && (
                      <div 
                        style={{
                          position: 'absolute',
                          right: '-14px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          zIndex: 2,
                          backgroundColor: '#FFFFFF',
                          border: '1px solid #D1D5DB',
                          borderRadius: '50%',
                          width: '24px',
                          height: '24px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#9CA3AF',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                        }}
                        className="desktop-step-arrow"
                      >
                        <ChevronRight size={14} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* WORKFLOW 2: SELL SCRAP */}
          <div style={{
            backgroundColor: '#F8F9FA',
            border: '1.5px solid #E5E7EB',
            borderRadius: '18px',
            padding: '2.5rem 2rem',
            marginBottom: '3rem',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.03)'
          }}>
            {/* Header / Label */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem',
              marginBottom: '2.25rem',
              borderBottom: '1px solid #E5E7EB',
              paddingBottom: '1.25rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <span style={{
                  backgroundColor: '#374151',
                  color: '#FFFFFF',
                  fontSize: '0.8rem',
                  fontWeight: 800,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  padding: '0.35rem 0.85rem',
                  borderRadius: '9999px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem'
                }}>
                  <PackagePlus size={14} />
                  SELL SCRAP
                </span>
                <span style={{ fontSize: '1.05rem', fontWeight: 700, color: '#111827' }}>
                  List your available scrap and connect with relevant buyers.
                </span>
              </div>

              <span style={{ fontSize: '0.8rem', color: '#6B7280', fontWeight: 600 }}>
                4 Simple Steps
              </span>
            </div>

            {/* 4 Cards in a Row with Desktop Arrows */}
            <div 
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '1.25rem',
                position: 'relative'
              }}
              className="workflow-grid"
            >
              {sellSteps.map((step, idx) => {
                const IconComp = step.icon;
                return (
                  <div
                    key={idx}
                    style={{
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #E5E7EB',
                      borderRadius: '14px',
                      padding: '24px',
                      display: 'flex',
                      flexDirection: 'column',
                      position: 'relative',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.02)',
                      transition: 'all 0.2s ease'
                    }}
                    className="workflow-step-card"
                  >
                    {/* Top Row: Icon and Step Number */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '1.25rem'
                    }}>
                      <div style={{
                        width: '46px',
                        height: '46px',
                        borderRadius: '10px',
                        backgroundColor: '#FFF8DB',
                        border: '1px solid #FDE68A',
                        color: '#111827',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        <IconComp size={22} strokeWidth={2} />
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
                        {step.number}
                      </span>
                    </div>

                    <h4 style={{
                      fontSize: '1.15rem',
                      fontWeight: 800,
                      color: '#111827',
                      marginBottom: '0.45rem',
                      lineHeight: 1.3
                    }}>
                      {step.title}
                    </h4>

                    <p style={{
                      fontSize: '0.9rem',
                      color: '#6B7280',
                      lineHeight: 1.55,
                      margin: 0
                    }}>
                      {step.description}
                    </p>

                    {/* Arrow indicator for non-last items */}
                    {idx < 3 && (
                      <div 
                        style={{
                          position: 'absolute',
                          right: '-14px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          zIndex: 2,
                          backgroundColor: '#FFFFFF',
                          border: '1px solid #D1D5DB',
                          borderRadius: '50%',
                          width: '24px',
                          height: '24px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#9CA3AF',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                        }}
                        className="desktop-step-arrow"
                      >
                        <ChevronRight size={14} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* TRUST NOTE HIGHLIGHT BOX */}
          <div style={{
            backgroundColor: '#FFF8DB',
            border: '1.5px solid #FDE68A',
            borderRadius: '12px',
            padding: '1.25rem 1.75rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            marginBottom: '2.5rem',
            boxShadow: '0 2px 8px rgba(249, 197, 28, 0.08)'
          }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              backgroundColor: '#FFFFFF',
              border: '1px solid #FDE68A',
              color: '#92400E',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <ShieldCheck size={20} />
            </div>

            <p style={{
              fontSize: '0.925rem',
              fontWeight: 600,
              color: '#111827',
              margin: 0,
              lineHeight: 1.5
            }}>
              Verified users and structured transaction workflows help create a more reliable scrap-trading network.
            </p>
          </div>

          {/* IMPORTANT NETWORK EXPLANATION CALLOUT */}
          <div style={{
            backgroundColor: '#F9FAFB',
            border: '1px solid #E5E7EB',
            borderRadius: '14px',
            padding: '1.5rem 1.75rem',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '1rem'
          }}>
            <Info size={22} style={{ color: '#6B7280', flexShrink: 0, marginTop: '2px' }} />
            <div>
              <h5 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#111827', margin: '0 0 0.35rem 0' }}>
                How the Scrap Anna network works
              </h5>
              <p style={{ fontSize: '0.875rem', color: '#6B7280', lineHeight: 1.6, margin: 0 }}>
                Scrap Anna provides the digital connection between merchants and relevant scrap sellers or buyers. The website is only explaining this workflow; the actual buying, selling, listing, communication and transaction functionality will exist in the Scrap Anna application.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* CHENNAI INITIAL LAUNCH CALLOUT */}
      <section className="section bg-offwhite" style={{ padding: '3.5rem 0', borderTop: '1px solid #E5E7EB', borderBottom: '1px solid #E5E7EB' }}>
        <div className="container" style={{ maxWidth: '840px' }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            border: '1.5px solid #E5E7EB',
            borderRadius: '16px',
            padding: '2rem 2.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1.5rem',
            flexWrap: 'wrap',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.03)'
          }}>
            <div style={{
              width: '54px',
              height: '54px',
              borderRadius: '12px',
              backgroundColor: '#FFF8DB',
              border: '1px solid #FDE68A',
              color: '#92400E',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <MapPin size={28} />
            </div>

            <div style={{ flex: '1 1 360px' }}>
              <div style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: '#92400E',
                marginBottom: '0.25rem'
              }}>
                Initial Launch
              </div>
              <h4 style={{
                fontSize: '1.25rem',
                fontWeight: 800,
                color: '#111827',
                margin: '0 0 0.35rem 0'
              }}>
                Launching First in Chennai, Tamil Nadu
              </h4>
              <p style={{
                fontSize: '0.9rem',
                color: '#4B5563',
                lineHeight: 1.5,
                margin: 0
              }}>
                Scrap Anna is starting its journey in Chennai, Tamil Nadu, connecting households, merchants and industries through one digital platform.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <CTASection
        title="Ready to grow your scrap business?"
        description="Join Scrap Anna to connect with scrap sellers, buyers, and verified partners across Chennai."
        primaryText="Join Scrap Anna"
        onJoinClick={() => openJoinModal('merchant')}
      />

      <style>{`
        .workflow-step-card:hover {
          transform: translateY(-3px);
          border-color: #D1D5DB !important;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.06) !important;
        }
        @media (max-width: 1024px) {
          .workflow-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 1.5rem !important;
          }
          .desktop-step-arrow {
            display: none !important;
          }
        }
        @media (max-width: 640px) {
          .workflow-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </>
  );
}
