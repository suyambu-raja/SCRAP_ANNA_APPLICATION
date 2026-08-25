import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, ShieldCheck, CheckCircle2, 
  Sparkles, Home, Store, Factory, Network, FilePlus2, Users, 
  CalendarClock, Scale, FileCheck, MapPin, Receipt, 
  FileText, ShieldAlert, Headphones, ChevronRight, HelpCircle,
  Smartphone, UserCheck, Truck, Languages, Mic, Phone,
  Tag, SlidersHorizontal, TrendingUp
} from 'lucide-react';
import SEO from '../../components/common/SEO';
import SectionHeader from '../../components/common/SectionHeader';
import Button from '../../components/common/Button';
import CTASection from '../../components/common/CTASection';
import { useJoinModal } from '../../components/layout/Layout';
import { 
  audienceCards, howItWorksSteps, trustFeatures 
} from '../../data/siteData';
import heroTruckImg from '../../assets/hero-truck.png';

export default function HomePage() {
  const { openJoinModal } = useJoinModal();

  const getAudienceIcon = (iconName) => {
    switch (iconName) {
      case 'Home': return Home;
      case 'Store': return Store;
      case 'Factory': return Factory;
      case 'Network': return Network;
      default: return Sparkles;
    }
  };

  const getStepIcon = (iconName) => {
    switch (iconName) {
      case 'FilePlus2': return FilePlus2;
      case 'Users': return Users;
      case 'CalendarClock': return CalendarClock;
      case 'Scale': return Scale;
      case 'FileCheck': return FileCheck;
      default: return Sparkles;
    }
  };

  const getTrustIcon = (iconName) => {
    switch (iconName) {
      case 'ShieldCheck': return ShieldCheck;
      case 'MapPin': return MapPin;
      case 'Receipt': return Receipt;
      case 'FileText': return FileText;
      case 'ShieldAlert': return ShieldAlert;
      case 'Headphones': return Headphones;
      default: return ShieldCheck;
    }
  };

  return (
    <>
      <SEO 
        title="Scrap Anna - Digital Scrap Connection Platform | Chennai, Tamil Nadu" 
        description="Scrap Anna connects households, merchants and industries in Chennai, Tamil Nadu on one digital platform for transparent transactions, fair reference prices and responsible recycling."
      />

      {/* HERO SECTION */}
      <section style={{ 
        backgroundColor: 'var(--color-white)',
        overflow: 'hidden',
        position: 'relative'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          alignItems: 'center',
          width: '100%'
        }} className="hero-grid">
          
          {/* Left Hero Content */}
          <div style={{ 
            paddingLeft: 'clamp(1.5rem, 3vw, 3rem)',
            paddingRight: '1rem',
            paddingTop: '3rem',
            paddingBottom: '3rem'
          }}>
            <div style={{ marginBottom: '0.75rem' }}>
              <span className="badge badge-yellow" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', fontWeight: 700 }}>
                <MapPin size={13} />
                Launching in Chennai, Tamil Nadu
              </span>
            </div>

            <h1 style={{
              color: 'var(--color-graphite-dark)',
              fontSize: 'clamp(2rem, 3.5vw, 3rem)',
              lineHeight: 1.12,
              marginBottom: '1rem',
              letterSpacing: '-0.02em',
              fontWeight: 800
            }}>
              Connecting Scrap.<br />
              Creating Value.<br />
              Building a{' '}
              <span style={{ color: 'var(--color-primary-yellow)' }}>
                Better Tomorrow.
              </span>
            </h1>

            <p style={{
              fontSize: '0.9375rem',
              color: 'var(--color-text-secondary)',
              lineHeight: 1.6,
              marginBottom: '1.5rem',
              maxWidth: '460px'
            }}>
              Scrap Anna is starting its journey in Chennai, connecting households, merchants and industries on one digital platform for transparent transactions, fair prices and a cleaner future.
            </p>

            {/* Trust Points — 4 icons in a horizontal row */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '0.5rem',
              marginBottom: '1.75rem',
              maxWidth: '460px'
            }} className="hero-trust-chips">
              {[
                { icon: ShieldCheck, label: "Verified & Trusted Network" },
                { icon: Receipt, label: "Digital Billing & Payments" },
                { icon: TrendingUp, label: "Fair Prices & Market Transparency" },
                { icon: Scale, label: "Secure & Safe Transactions" }
              ].map((item, idx) => {
                const TrustIcon = item.icon;
                return (
                  <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '0.3rem' }}>
                    <div style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '50%',
                      backgroundColor: '#F9FAFB',
                      border: '1.5px solid var(--color-border)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#374151'
                    }}>
                      <TrustIcon size={18} strokeWidth={1.6} />
                    </div>
                    <span style={{ fontSize: '0.65rem', fontWeight: 500, color: 'var(--color-text-secondary)', lineHeight: 1.3 }}>
                      {item.label}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* CTA Buttons */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
              <Button
                variant="primary"
                size="lg"
                icon={ArrowRight}
                onClick={() => openJoinModal('household')}
              >
                Join Scrap Anna
              </Button>
              <button
                onClick={() => window.location.href = '/how-it-works'}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.7rem 1.4rem',
                  backgroundColor: 'var(--color-white)',
                  border: '1.5px solid var(--color-border)',
                  borderRadius: 'var(--radius-lg)',
                  cursor: 'pointer',
                  fontSize: '0.9375rem',
                  fontWeight: 600,
                  color: 'var(--color-graphite-dark)',
                  transition: 'all 0.2s ease'
                }}
              >
                <span style={{
                  width: '22px',
                  height: '22px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-graphite-dark)',
                  color: 'var(--color-white)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.6rem'
                }}>▶</span>
                Watch How It Works
              </button>
            </div>
          </div>

          {/* Right Hero Image — flush to right edge */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'flex-end', 
            justifyContent: 'flex-end',
            alignSelf: 'end',
            overflow: 'hidden',
            height: '100%',
            padding: 0,
            margin: 0
          }}>
            <img
              src={heroTruckImg}
              alt="Scrap Anna branded truck loaded with scrap metal, city skyline and barrels"
              style={{
                width: '100%',
                height: 'auto',
                display: 'block',
                objectFit: 'contain',
                objectPosition: 'right bottom',
                padding: 0,
                margin: 0
              }}
              loading="eager"
            />
          </div>

        </div>
      </section>

      {/* WHO IS SCRAP ANNA FOR? AUDIENCE SECTION */}
      <section className="section bg-white" style={{ paddingTop: '3.5rem', paddingBottom: '3.5rem' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ 
              fontSize: 'clamp(1.75rem, 3vw, 2.25rem)', 
              fontWeight: 800, 
              color: '#1F242D', 
              letterSpacing: '-0.02em',
              marginBottom: '0.65rem'
            }}>
              Who is <span style={{ color: 'var(--color-primary-yellow)' }}>Scrap Anna</span> For?
            </h2>
            <div style={{ 
              width: '44px', 
              height: '3px', 
              backgroundColor: 'var(--color-primary-yellow)', 
              margin: '0 auto', 
              borderRadius: '2px' 
            }} />
          </div>

          <div className="grid-4" style={{ gap: '1.5rem' }}>
            {[
              {
                title: "For Households",
                description: "Sell your household scrap easily. We connect you with nearby verified merchants.",
                icon: Home,
                iconBg: "#FFF3C4",
                iconColor: "#1F242D",
                link: "/households"
              },
              {
                title: "For Merchants",
                description: "Get quality leads, respond to industry requests, and grow your scrap business.",
                icon: Store,
                iconBg: "#20242D",
                iconColor: "#FFFFFF",
                link: "/merchants"
              },
              {
                title: "For Industries",
                description: "Post scrap once, get multiple merchant offers, and choose based on price and time.",
                icon: Factory,
                iconBg: "#FFF3C4",
                iconColor: "#1F242D",
                link: "/industries"
              },
              {
                title: "For Aggregators",
                description: "Partner with us to expand your network and maximize opportunities.",
                icon: Users,
                iconBg: "#20242D",
                iconColor: "#FFFFFF",
                link: "/aggregators"
              }
            ].map((card, idx) => {
              const IconComponent = card.icon;
              return (
                <div
                  key={idx}
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E5E7EB',
                    borderRadius: '14px',
                    padding: '2.5rem 1.5rem 2rem',
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                    transition: 'all 0.25s ease'
                  }}
                  className="audience-feature-card"
                >
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{
                      width: '68px',
                      height: '68px',
                      borderRadius: '50%',
                      backgroundColor: card.iconBg,
                      color: card.iconColor,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '1.5rem',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.06)'
                    }}>
                      <IconComponent size={30} strokeWidth={2} />
                    </div>

                    <h3 style={{
                      fontSize: '1.25rem',
                      fontWeight: 800,
                      color: '#1F242D',
                      marginBottom: '0.85rem'
                    }}>
                      {card.title}
                    </h3>

                    <p style={{
                      fontSize: '0.875rem',
                      color: '#4B5563',
                      lineHeight: 1.6,
                      marginBottom: '1.75rem',
                      maxWidth: '240px'
                    }}>
                      {card.description}
                    </p>
                  </div>

                  <Link
                    to={card.link}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      fontSize: '0.875rem',
                      fontWeight: 700,
                      color: '#1F242D',
                      textDecoration: 'none',
                      transition: 'gap 0.15s ease'
                    }}
                    className="audience-card-link"
                  >
                    <span>Learn More</span>
                    <ArrowRight size={15} />
                  </Link>
                </div>
              );
            })}
          </div>

          {/* Industry Scrap Multiple Offers Highlight Banner */}
          <div style={{
            marginTop: '2.5rem',
            backgroundColor: '#FFF8DB',
            border: '1.5px solid #FDE68A',
            borderRadius: '14px',
            padding: '1.5rem 1.75rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1.25rem',
            boxShadow: '0 2px 10px rgba(249, 197, 28, 0.08)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: '1 1 480px' }}>
              <div style={{
                width: '46px',
                height: '46px',
                borderRadius: '10px',
                backgroundColor: 'var(--color-primary-yellow)',
                color: '#1F242D',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Factory size={24} />
              </div>
              <div>
                <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#1F242D', margin: '0 0 0.25rem 0' }}>
                  Industries. Multiple Offers. Your Choice.
                </h4>
                <p style={{ fontSize: '0.9rem', color: '#4B5563', margin: 0, lineHeight: 1.5 }}>
                  Post your scrap once and receive offers from nearby merchants. Compare prices and pickup timing, then choose what works best for you.
                </p>
              </div>
            </div>

            <Link
              to="/industries"
              style={{
                backgroundColor: '#1F242D',
                color: '#FFFFFF',
                fontWeight: 700,
                fontSize: '0.875rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                textDecoration: 'none',
                padding: '0.65rem 1.25rem',
                borderRadius: '8px',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#374151'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#1F242D'}
            >
              <span>Explore Industry Bidding</span>
              <ArrowRight size={15} style={{ color: 'var(--color-primary-yellow)' }} />
            </Link>
          </div>

          {/* Accessibility Highlight Strip */}
          <div style={{
            marginTop: '1.25rem',
            backgroundColor: '#F9FAFB',
            border: '1px solid #E5E7EB',
            borderRadius: '12px',
            padding: '1rem 1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.75rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '6px',
                backgroundColor: '#FFF3C4',
                color: '#92400E',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Languages size={18} />
              </div>
              <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151' }}>
                Designed for Easy Access: <strong>Tamil + English | Tamil Voice Assistance | Voice Call Support</strong>
              </span>
            </div>
            <Link
              to="/how-it-works"
              style={{
                fontSize: '0.8rem',
                fontWeight: 700,
                color: '#D97706',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem'
              }}
            >
              <span>See How It Works</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="section bg-white" id="how-it-works" style={{ paddingTop: '3.5rem', paddingBottom: '3.5rem' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <h2 style={{ 
              fontSize: 'clamp(1.75rem, 3vw, 2.25rem)', 
              fontWeight: 800, 
              color: '#1F242D', 
              letterSpacing: '-0.02em',
              marginBottom: '0.65rem'
            }}>
              How It Works
            </h2>
            <div style={{ 
              width: '44px', 
              height: '3px', 
              backgroundColor: 'var(--color-primary-yellow)', 
              margin: '0 auto', 
              borderRadius: '2px' 
            }} />
          </div>

          {/* 5 Steps in a Row with Arrows in between */}
          <div 
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              position: 'relative'
            }}
            className="how-it-works-timeline"
          >
            {[
              {
                num: "1.",
                title: "Post Scrap",
                desc: "Post your scrap with details, photos and location.",
                icon: Smartphone,
                iconBg: "#FFF3C4",
                iconColor: "#1F242D"
              },
              {
                num: "2.",
                title: "Get Connected",
                desc: "Nearby verified merchants show interest in your request.",
                icon: UserCheck,
                iconBg: "#F3F4F6",
                iconColor: "#1F242D"
              },
              {
                num: "3.",
                title: "Pickup Scheduled",
                desc: "Select a merchant and schedule the pickup conveniently.",
                icon: Truck,
                iconBg: "#FFF3C4",
                iconColor: "#1F242D"
              },
              {
                num: "4.",
                title: "Scrap Collected",
                desc: "Scrap is collected, weighed and verified at your location.",
                icon: Scale,
                iconBg: "#F3F4F6",
                iconColor: "#1F242D"
              },
              {
                num: "5.",
                title: "Digital Bill",
                desc: "Digital bill is generated and payment is completed transparently.",
                icon: Receipt,
                iconBg: "#FFF3C4",
                iconColor: "#1F242D"
              }
            ].map((step, idx) => {
              const StepIcon = step.icon;
              return (
                <React.Fragment key={idx}>
                  <div 
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      textAlign: 'center',
                      flex: '1 1 0',
                      maxWidth: '190px'
                    }}
                    className="timeline-step-item"
                  >
                    <div style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: '50%',
                      backgroundColor: step.iconBg,
                      color: step.iconColor,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '1.25rem',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.05)'
                    }}>
                      <StepIcon size={28} strokeWidth={1.8} />
                    </div>

                    <h3 style={{
                      fontSize: '0.95rem',
                      fontWeight: 800,
                      color: '#1F242D',
                      marginBottom: '0.45rem'
                    }}>
                      {step.num} {step.title}
                    </h3>

                    <p style={{
                      fontSize: '0.8rem',
                      color: '#4B5563',
                      lineHeight: 1.5,
                      margin: 0
                    }}>
                      {step.desc}
                    </p>
                  </div>

                  {/* Connecting Arrow between steps */}
                  {idx < 4 && (
                    <div 
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        paddingTop: '1.4rem',
                        color: '#6B7280',
                        flexShrink: 0
                      }}
                      className="timeline-arrow"
                    >
                      <ArrowRight size={20} strokeWidth={1.75} />
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </section>

      {/* TRUST & TRANSPARENCY SECTION */}
      <section className="section bg-graphite-dark text-white" style={{ borderTop: '1px solid #374151' }}>
        <div className="container">
          <SectionHeader
            eyebrow="Integrity First"
            title="Built for Trust. Designed for Transparency."
            subtitle="Every interaction is protected with digital records, verified credentials, and real-time oversight."
            dark={true}
          />

          <div className="grid-3" style={{ gap: '1.5rem' }}>
            {trustFeatures.map((feat, idx) => {
              const Icon = getTrustIcon(feat.iconName);
              return (
                <div 
                  key={idx}
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '2rem',
                    transition: 'all var(--transition-normal)'
                  }}
                >
                  <div style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'rgba(249, 197, 28, 0.15)',
                    border: '1px solid rgba(249, 197, 28, 0.3)',
                    color: 'var(--color-primary-yellow)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1.25rem'
                  }}>
                    <Icon size={24} />
                  </div>

                  <h3 style={{ color: 'var(--color-white)', fontSize: '1.25rem', marginBottom: '0.75rem' }}>
                    {feat.title}
                  </h3>

                  <p style={{ color: '#9CA3AF', fontSize: 'var(--text-small)', lineHeight: 1.6, margin: 0 }}>
                    {feat.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* STARTING IN CHENNAI INITIAL LAUNCH SECTION */}
      <section className="section bg-white" style={{ paddingTop: '3.5rem', paddingBottom: '3.5rem', borderTop: '1px solid #E5E7EB' }}>
        <div className="container" style={{ maxWidth: '960px' }}>
          <div style={{
            backgroundColor: '#FFF8DB',
            border: '1.5px solid #FDE68A',
            borderRadius: '16px',
            padding: '2.5rem 2.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '2rem',
            flexWrap: 'wrap',
            boxShadow: '0 4px 16px rgba(249, 197, 28, 0.08)'
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.25rem', flex: '1 1 480px' }}>
              <div style={{
                width: '54px',
                height: '54px',
                borderRadius: '12px',
                backgroundColor: '#FFFFFF',
                border: '1px solid #FDE68A',
                color: '#92400E',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <MapPin size={28} />
              </div>

              <div>
                <span style={{
                  display: 'inline-block',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  color: '#92400E',
                  marginBottom: '0.35rem'
                }}>
                  Starting in Chennai
                </span>
                <h3 style={{
                  fontSize: '1.45rem',
                  fontWeight: 800,
                  color: '#1F242D',
                  margin: '0 0 0.5rem 0',
                  lineHeight: 1.25
                }}>
                  Scrap Anna is launching in Chennai, Tamil Nadu.
                </h3>
                <p style={{
                  fontSize: '0.95rem',
                  color: '#4B5563',
                  lineHeight: 1.6,
                  margin: 0
                }}>
                  We're starting locally by connecting households, merchants and industries in Chennai through a simple and trusted digital scrap network.
                </p>
              </div>
            </div>

            <div>
              <button
                onClick={() => openJoinModal('household')}
                style={{
                  backgroundColor: '#1F242D',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  padding: '0.85rem 1.6rem',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                  transition: 'background-color 0.15s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#374151'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#1F242D'}
              >
                <span>Join Scrap Anna</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA SECTION */}
      <CTASection onJoinClick={() => openJoinModal('household')} />

      {/* Responsive CSS */}
      <style>{`
        .audience-feature-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08) !important;
          border-color: #D1D5DB !important;
        }
        .audience-feature-card:hover .audience-card-link {
          gap: 0.6rem !important;
          color: #D97706 !important;
        }
        @media (max-width: 1024px) {
          .hero-grid {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }
          .how-it-works-timeline {
            flex-wrap: wrap !important;
            gap: 2rem !important;
            justifyContent: center !important;
          }
          .timeline-arrow {
            display: none !important;
          }
          .hero-trust-chips {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 768px) {
          .how-it-works-timeline {
            flex-direction: column !important;
            align-items: stretch !important;
            gap: 1.25rem !important;
          }
          .timeline-step-item {
            max-width: 100% !important;
            width: 100% !important;
            background-color: #F9FAFB;
            border: 1px solid #E5E7EB;
            border-radius: 12px;
            padding: 1.5rem 1.25rem;
          }
        }
        @media (max-width: 640px) {
          .hero-trust-chips {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 0.75rem !important;
          }
        }
      `}</style>
    </>
  );
}
