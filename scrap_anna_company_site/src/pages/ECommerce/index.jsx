import React from 'react';
import { 
  Search, FileText, Handshake, ShoppingBag, 
  PackagePlus, Tag, Users, ShieldCheck, 
  ChevronRight, MapPin, Store, Sparkles, 
  Info, Zap, Cog, Wrench, Factory, Bike, DoorClosed
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
      description: "Discover available scrap materials from connected sellers.",
      icon: Search
    },
    {
      number: "02",
      title: "Check Details",
      description: "View the material, quantity, condition and location.",
      icon: FileText
    },
    {
      number: "03",
      title: "Connect",
      description: "Contact the seller and discuss the purchase and pickup.",
      icon: Handshake
    },
    {
      number: "04",
      title: "Buy",
      description: "Agree on the details and arrange the purchase.",
      icon: ShoppingBag
    }
  ];

  // Sell Reusable Items Workflow Steps
  const sellSteps = [
    {
      number: "01",
      title: "List Your Item",
      description: "Add photos, item details and condition.",
      icon: PackagePlus
    },
    {
      number: "02",
      title: "Set Your Price",
      description: "Tell interested buyers your asking price.",
      icon: Tag
    },
    {
      number: "03",
      title: "Get Connected",
      description: "Interested buyers can discover your item and contact you.",
      icon: Users
    },
    {
      number: "04",
      title: "Sell & Arrange Pickup",
      description: "Agree on the details and arrange the item handover.",
      icon: Handshake
    }
  ];

  // Reusable Items Examples Chips
  const reusableExamples = [
    { name: "Cycles", icon: Bike },
    { name: "Motors", icon: Zap },
    { name: "Engine Parts", icon: Cog },
    { name: "Gates", icon: DoorClosed },
    { name: "Industrial Parts", icon: Wrench },
    { name: "Machinery Components", icon: Factory }
  ];

  return (
    <>
      <SEO
        title="Buy & Sell Through Scrap Anna - Resale & Scrap Network | Chennai"
        description="Connect with opportunities to buy scrap and give reusable materials a second life. Merchants can list reusable items, set their price, and connect with buyers."
      />

      {/* HERO SECTION */}
      <PageHero
        eyebrow="Reuse & Resale Network"
        badgeIcon={Store}
        title="Buy & Sell Through Scrap Anna"
        highlightWord="Buy & Sell"
        description="Connect with opportunities to buy scrap and give reusable materials a second life."
        breadcrumbs={[{ label: 'Buy & Sell' }]}
        primaryCta={{
          text: "Join as a Merchant",
          onClick: () => openJoinModal('merchant')
        }}
        secondaryCta={{
          text: "View Workflow",
          to: "#workflow"
        }}
      />

      {/* DUAL WORKFLOW SECTION */}
      <section id="workflow" className="section bg-white" style={{ paddingTop: '4.5rem', paddingBottom: '4.5rem' }}>
        <div className="container" style={{ maxWidth: '1200px' }}>
          
          <SectionHeader
            eyebrow="How It Works"
            title="Buy & Sell Through Scrap Anna"
            subtitle="Connect with opportunities to buy scrap and give reusable materials a second life."
          />

          {/* KEY MESSAGE HIGHLIGHT BANNER */}
          <div style={{
            backgroundColor: '#FFFDF5',
            border: '1.5px solid #FDE68A',
            borderRadius: '16px',
            padding: '1.75rem 2rem',
            marginBottom: '3rem',
            boxShadow: '0 4px 16px rgba(249, 197, 28, 0.08)',
            display: 'flex',
            alignItems: 'center',
            gap: '1.25rem',
            flexWrap: 'wrap'
          }}>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              backgroundColor: 'var(--color-primary-yellow)',
              color: '#1F242D',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <Sparkles size={24} />
            </div>

            <div style={{ flex: '1 1 300px' }}>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: 800,
                color: '#1F242D',
                margin: '0 0 0.35rem 0'
              }}>
                Don't Let Reusable Materials Go to Waste.
              </h3>
              <p style={{
                fontSize: '0.925rem',
                color: '#4B5563',
                lineHeight: 1.5,
                margin: 0
              }}>
                Merchants can list reusable items recovered from scrap, set their own price and connect with interested buyers.
              </p>
            </div>
          </div>

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
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flexWrap: 'wrap' }}>
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
                  <Search size={14} />
                  BUY SCRAP
                </span>
                <span style={{ fontSize: '1.05rem', fontWeight: 700, color: '#111827' }}>
                  Find available scrap materials and connect with relevant sellers.
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
                        backgroundColor: '#F3F4F6',
                        border: '1px solid #E5E7EB',
                        color: '#1F242D',
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
                        color: '#4B5563',
                        backgroundColor: '#F3F4F6',
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

          {/* WORKFLOW 2: SELL REUSABLE ITEMS (YELLOW ACCENT) */}
          <div style={{
            backgroundColor: '#FFFCF0',
            border: '2px solid var(--color-primary-yellow)',
            borderRadius: '18px',
            padding: '2.5rem 2rem',
            marginBottom: '3rem',
            boxShadow: '0 6px 20px rgba(249, 197, 28, 0.1)'
          }}>
            {/* Header / Label */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem',
              marginBottom: '2.25rem',
              borderBottom: '1px solid rgba(249, 197, 28, 0.3)',
              paddingBottom: '1.25rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flexWrap: 'wrap' }}>
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
                  gap: '0.35rem',
                  boxShadow: '0 2px 6px rgba(249, 197, 28, 0.3)'
                }}>
                  <PackagePlus size={14} />
                  SELL REUSABLE ITEMS
                </span>
                <span style={{ fontSize: '1.05rem', fontWeight: 700, color: '#111827' }}>
                  Turn reusable scrap into additional value by listing items with your own price.
                </span>
              </div>

              <span style={{ fontSize: '0.8rem', color: '#92400E', fontWeight: 700 }}>
                Resale & Reuse Opportunity
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
                      border: '1.5px solid #FDE68A',
                      borderRadius: '14px',
                      padding: '24px',
                      display: 'flex',
                      flexDirection: 'column',
                      position: 'relative',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.02)',
                      transition: 'all 0.2s ease'
                    }}
                    className="workflow-step-card sell-card-hover"
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
                        color: '#92400E',
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
                          border: '1px solid #FDE68A',
                          borderRadius: '50%',
                          width: '24px',
                          height: '24px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#D97706',
                          boxShadow: '0 2px 4px rgba(249, 197, 28, 0.15)'
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

          {/* REUSABLE ITEM EXAMPLES (COMPACT VISUAL CHIPS) */}
          <div style={{
            backgroundColor: 'var(--color-offwhite)',
            border: '1px solid var(--color-border)',
            borderRadius: '16px',
            padding: '2rem 2.25rem',
            marginBottom: '3rem',
            boxShadow: 'var(--shadow-xs)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem',
              marginBottom: '1.5rem'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                  <span className="badge badge-yellow" style={{ fontSize: '0.75rem' }}>
                    Reuse Categories
                  </span>
                  <h4 style={{
                    fontSize: '1.25rem',
                    fontWeight: 800,
                    color: 'var(--color-graphite-dark)',
                    margin: 0
                  }}>
                    What Can Merchants List?
                  </h4>
                </div>
                <p style={{
                  fontSize: '0.9rem',
                  color: 'var(--color-text-secondary)',
                  margin: 0,
                  lineHeight: 1.5
                }}>
                  Reusable items recovered from scrap can be given a second life instead of being sold only as scrap by weight.
                </p>
              </div>
            </div>

            {/* Compact Chips Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
              gap: '0.85rem'
            }} className="examples-chips-grid">
              {reusableExamples.map((item, idx) => {
                const ItemIcon = item.icon;
                return (
                  <div
                    key={idx}
                    style={{
                      backgroundColor: 'var(--color-white)',
                      border: '1px solid var(--color-border)',
                      borderRadius: '10px',
                      padding: '0.85rem 1.15rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                      transition: 'all var(--transition-fast)'
                    }}
                    className="reusable-chip-item"
                  >
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      backgroundColor: 'var(--color-primary-yellow-light)',
                      color: '#92400E',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <ItemIcon size={17} />
                    </div>
                    <span style={{
                      fontSize: '0.9rem',
                      fontWeight: 700,
                      color: 'var(--color-graphite-dark)'
                    }}>
                      {item.name}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* TRUST NOTE & ACCURACY NOTICE */}
          <div style={{
            backgroundColor: '#FFF8DB',
            border: '1.5px solid #FDE68A',
            borderRadius: '12px',
            padding: '1.25rem 1.75rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            marginBottom: '2rem',
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
              Merchants set their own asking prices. Verified users and structured workflows help connect buyers and sellers directly for pickup and purchase.
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
                Scrap Anna provides the digital connection between merchants and relevant scrap sellers or buyers. This website explains the workflow; the actual listing, communication, and transaction coordination belong to the Scrap Anna application.
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
                Scrap Anna is starting its journey in Chennai, connecting households, merchants and industries through one digital platform.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <CTASection
        title="Ready to turn scrap & reusable materials into value?"
        description="Join Scrap Anna to connect with scrap sellers, buyers, and reuse opportunities across Chennai."
        primaryText="Join Scrap Anna"
        onJoinClick={() => openJoinModal('merchant')}
      />

      <style>{`
        @keyframes arrowSlidePulse {
          0% {
            transform: translateY(-50%) translateX(0);
            color: #9CA3AF;
            border-color: #D1D5DB;
          }
          50% {
            transform: translateY(-50%) translateX(3px);
            color: #D97706;
            border-color: #FDE68A;
            box-shadow: 0 0 10px rgba(249, 197, 28, 0.35);
          }
          100% {
            transform: translateY(-50%) translateX(0);
            color: #9CA3AF;
            border-color: #D1D5DB;
          }
        }
        .desktop-step-arrow {
          animation: arrowSlidePulse 2.2s ease-in-out infinite;
          transition: all 0.2s ease;
        }
        .workflow-step-card:hover {
          transform: translateY(-4px);
          border-color: #D1D5DB !important;
          box-shadow: 0 10px 24px rgba(0, 0, 0, 0.07) !important;
        }
        .sell-card-hover:hover {
          border-color: var(--color-primary-yellow) !important;
          box-shadow: 0 10px 24px rgba(249, 197, 28, 0.2) !important;
        }
        .reusable-chip-item:hover {
          transform: translateY(-2px);
          border-color: var(--color-primary-yellow) !important;
          box-shadow: 0 4px 12px rgba(249, 197, 28, 0.12) !important;
          background-color: #FFFDF5 !important;
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
          .examples-chips-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
      `}</style>
    </>
  );
}
