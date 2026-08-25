import React from 'react';
import { 
  Store, TrendingUp, ShieldCheck, MapPin, Receipt, 
  Smartphone, Award, CheckCircle2, ArrowRight, HelpCircle, Users,
  ShoppingBag, Package
} from 'lucide-react';
import SEO from '../../components/common/SEO';
import PageHero from '../../components/common/PageHero';
import SectionHeader from '../../components/common/SectionHeader';
import CTASection from '../../components/common/CTASection';
import Button from '../../components/common/Button';
import { useJoinModal } from '../../components/layout/Layout';
import { faqData } from '../../data/siteData';

export default function MerchantsPage() {
  const { openJoinModal } = useJoinModal();

  const merchantBenefits = [
    {
      icon: MapPin,
      title: "Geotagged Customer Leads",
      desc: "Receive genuine, high-intent scrap pickup requests from residential households and commercial shops in your vicinity."
    },
    {
      icon: TrendingUp,
      title: "Consistent Business Volume",
      desc: "No more wandering door-to-door without guarantees. Build a predictable, high-margin daily collection schedule."
    },
    {
      icon: Smartphone,
      title: "Smart Route & Pickup App",
      desc: "Manage customer appointments, accept jobs that fit your truck capacity, and eliminate wasted travel time."
    },
    {
      icon: Receipt,
      title: "Digital Billing & Ledger",
      desc: "Automatically generate transparent itemized digital receipts with verified weights for instant customer trust."
    },
    {
      icon: Award,
      title: "Verified Merchant Badge",
      desc: "Build a stellar local reputation with 5-star customer ratings, verified platform badges, and priority job routing."
    },
    {
      icon: Users,
      title: "Access to Bulk Aggregators",
      desc: "Sell your aggregated scrap lots directly to verified large-scale recycling yards and smelting aggregators at wholesale rates."
    }
  ];

  const onboardingSteps = [
    { num: "01", title: "Apply Online", desc: "Submit your business details, operating locality, and contact number through our simple partner form." },
    { num: "02", title: "KYC & Verification", desc: "Our local Chennai operations team conducts swift ID verification and checks digital scale calibration." },
    { num: "03", title: "App Setup & Orientation", desc: "Get access to the Scrap Anna Merchant tool with training on accepting leads and generating digital receipts." },
    { num: "04", title: "Start Receiving Pickups", desc: "Go live in your designated territory and start completing doorstep pickups from day one." }
  ];

  return (
    <>
      <SEO
        title="For Merchants - Grow Your Scrap Business with Scrap Anna"
        description="Partner with Scrap Anna to receive verified household and commercial scrap leads, optimize pickup routes, and access digital billing."
      />

      <PageHero
        eyebrow="Merchant Partner Network"
        badgeIcon={Store}
        title="Grow Your Scrap Business with Scrap Anna"
        highlightWord="Grow Your Scrap Business"
        description="Get verified, high-quality scrap pickup leads from households and businesses in your area while managing pickups and digital bills with ease."
        breadcrumbs={[{ label: 'For Merchants' }]}
        primaryCta={{
          text: "Become a Merchant Partner",
          onClick: () => openJoinModal('merchant')
        }}
        secondaryCta={{
          text: "How Leads Work",
          to: "/how-it-works"
        }}
      />

      {/* VALUE PROPOSITION FOR MERCHANTS */}
      <section className="section bg-white">
        <div className="container">
          <SectionHeader
            eyebrow="Why Partner with Scrap Anna"
            title="A Powerful Growth Engine for Local Scrap Entrepreneurs"
            subtitle="We empower independent scrap merchants with modern digital tools to double their daily collection volumes."
          />

          <div className="grid-3">
            {merchantBenefits.map((item, idx) => {
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

      {/* FIND MORE SCRAP OPPORTUNITIES: INDUSTRY SCRAP RESPONSES */}
      <section className="section bg-white" style={{ borderTop: '1px solid #E5E7EB', padding: '4.5rem 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '760px', margin: '0 auto 3rem auto' }}>
            <span style={{
              display: 'inline-block',
              fontSize: '0.8rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: '#92400E',
              backgroundColor: '#FFF8DB',
              border: '1px solid #FDE68A',
              padding: '0.25rem 0.75rem',
              borderRadius: '9999px',
              marginBottom: '0.75rem'
            }}>
              Industry Scrap Opportunities
            </span>
            <h2 style={{
              fontSize: 'clamp(1.75rem, 3vw, 2.25rem)',
              fontWeight: 800,
              color: '#1F242D',
              lineHeight: 1.25,
              marginBottom: '0.75rem'
            }}>
              Find More Scrap Opportunities
            </h2>
            <p style={{
              fontSize: 'var(--text-body)',
              color: '#6B7280',
              lineHeight: 1.6,
              margin: 0
            }}>
              Discover nearby industry scrap requests and submit your price when the opportunity matches your business. When industries post their available scrap, nearby verified merchants can respond with their competitive price and schedule.
            </p>
          </div>

          {/* 5-Step Industry Response Workflow */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: '1.25rem',
            marginBottom: '3rem'
          }} className="merchant-industry-flow-grid">
            {[
              {
                step: "01",
                title: "View Nearby Requests",
                desc: "Discover available industry scrap requests posted in your operating territory."
              },
              {
                step: "02",
                title: "Check Scrap Details",
                desc: "Review material type, grade, estimated volume, and pickup location."
              },
              {
                step: "03",
                title: "Submit Offered Price",
                desc: "Submit your competitive price per kg/ton and your available pickup timing."
              },
              {
                step: "04",
                title: "Industry Selection",
                desc: "The industry compares available merchant offers and selects the best fit."
              },
              {
                step: "05",
                title: "Proceed with Pickup",
                desc: "Once selected, connect with the facility and execute the scheduled pickup."
              }
            ].map((item, idx) => (
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
                className="merchant-step-card"
              >
                <span style={{
                  fontSize: '0.8rem',
                  fontWeight: 800,
                  color: '#92400E',
                  backgroundColor: '#FEF3C7',
                  padding: '0.2rem 0.55rem',
                  borderRadius: '6px',
                  alignSelf: 'flex-start',
                  marginBottom: '1rem',
                  fontFamily: 'monospace'
                }}>
                  {item.step}
                </span>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#1F242D', marginBottom: '0.45rem', lineHeight: 1.3 }}>
                  {item.title}
                </h4>
                <p style={{ fontSize: '0.85rem', color: '#6B7280', lineHeight: 1.55, margin: 0 }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Accessibility Voice Call Support Highlight for Merchants */}
          <div style={{
            backgroundColor: '#FFF8DB',
            border: '1.5px solid #FDE68A',
            borderRadius: '16px',
            padding: '1.75rem 2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1.5rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.25rem', flex: '1 1 480px' }}>
              <div style={{
                width: '52px',
                height: '52px',
                borderRadius: '12px',
                backgroundColor: 'var(--color-primary-yellow)',
                color: '#1F242D',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Smartphone size={26} strokeWidth={2} />
              </div>
              <div>
                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  color: '#92400E',
                  display: 'block',
                  marginBottom: '0.25rem'
                }}>
                  Accessibility Support
                </span>
                <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1F242D', margin: '0 0 0.35rem 0' }}>
                  Merchant Voice Calls & Tamil Assistance
                </h4>
                <p style={{ fontSize: '0.9rem', color: '#4B5563', lineHeight: 1.5, margin: 0 }}>
                  Not comfortable using smartphone applications? Voice-call support and Tamil voice assistance help local merchants participate, receive notifications, and submit price responses easily.
                </p>
              </div>
            </div>

            <Button
              variant="primary"
              size="md"
              icon={ArrowRight}
              onClick={() => openJoinModal('merchant')}
            >
              Join as Merchant
            </Button>
          </div>

        </div>
      </section>

      {/* HOW THE COMMISSION & REVENUE MODEL WORKS */}
      <section className="section bg-graphite-dark text-white" style={{ borderTop: '1px solid #374151', borderBottom: '1px solid #374151' }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '3.5rem',
            alignItems: 'center'
          }} className="merchant-commission-grid">
            
            <div>
              <span className="badge badge-dark" style={{ marginBottom: '1rem' }}>
                Transparent Economics
              </span>
              <h2 style={{ fontSize: 'var(--text-h2)', color: 'var(--color-white)', marginBottom: '1.25rem' }}>
                Clear, Fair & Growth-Oriented Partner Model
              </h2>
              <p style={{ fontSize: 'var(--text-body)', color: '#D1D5DB', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                At Scrap Anna, we believe our success is tied to yours. We operate with complete commercial clarity so you always keep the lion's share of your hard-earned profits.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {[
                  {
                    title: "No Exorbitant Upfront Fees",
                    desc: "Join our platform without hefty subscription barriers. We only succeed when you successfully complete pickups."
                  },
                  {
                    title: "Pay-As-You-Grow Convenience Fee",
                    desc: "A nominal, transparent platform fee is applied strictly on fulfilled customer transactions to maintain high-intent lead routing."
                  },
                  {
                    title: "Direct Customer Payout Retention",
                    desc: "You retain full control over your material margins and direct customer settlement."
                  }
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
                    <div>
                      <div style={{ fontWeight: 700, color: 'var(--color-white)', fontSize: '0.95rem' }}>
                        {item.title}
                      </div>
                      <div style={{ fontSize: 'var(--text-small)', color: '#9CA3AF', lineHeight: 1.5 }}>
                        {item.desc}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Merchant Guarantee Box */}
            <div style={{
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: 'var(--radius-lg)',
              padding: '2.5rem',
              position: 'relative'
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--color-primary-yellow)',
                color: 'var(--color-graphite-dark)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem'
              }}>
                <ShieldCheck size={26} />
              </div>

              <h3 style={{ color: 'var(--color-white)', fontSize: '1.35rem', marginBottom: '0.75rem' }}>
                Our Promise to Merchant Partners
              </h3>
              <p style={{ color: '#D1D5DB', fontSize: 'var(--text-body)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                We do not undercut your local relationships. Instead, we expand your market reach, protect you against fraudulent cancellations, and provide digital receipts that elevate customer trust.
              </p>

              <Button
                variant="primary"
                size="md"
                onClick={() => openJoinModal('merchant')}
                icon={ArrowRight}
                style={{ width: '100%', justifyContent: 'center' }}
              >
                Register as Merchant Partner
              </Button>
            </div>

          </div>
        </div>
      </section>

      {/* 4-STEP ONBOARDING ROADMAP */}
      <section className="section bg-white">
        <div className="container">
          <SectionHeader
            eyebrow="Fast Track Setup"
            title="How to Become a Scrap Anna Merchant"
            subtitle="Get verified and ready to accept your first pickup in less than 24 hours."
          />

          <div className="grid-4">
            {onboardingSteps.map((step, idx) => (
              <div key={idx} className="card" style={{ backgroundColor: 'var(--color-offwhite)', border: '1px solid var(--color-border)' }}>
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
        </div>
      </section>

      {/* MERCHANT FAQS */}
      <section className="section bg-offwhite" style={{ borderTop: '1px solid var(--color-border)' }}>
        <div className="container-narrow">
          <SectionHeader
            eyebrow="Partner Clarifications"
            title="Merchant Partner FAQs"
            subtitle="Answers to common queries regarding lead allocation, verification, and payment."
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {faqData.merchant.map((item, idx) => (
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
        title="Ready to Expand Your Scrap Collection Business?"
        description="Partner with Scrap Anna and start receiving high-intent doorstep pickup leads in your neighborhood."
        primaryText="Join as Merchant Partner"
        onJoinClick={() => openJoinModal('merchant')}
      />

      <style>{`
        .merchant-step-card:hover {
          transform: translateY(-3px);
          border-color: #D1D5DB !important;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.06) !important;
        }
        @media (max-width: 1024px) {
          .merchant-commission-grid {
            grid-template-columns: 1fr !important;
            gap: 2.5rem !important;
          }
          .merchant-industry-flow-grid {
            grid-template-columns: repeat(3, 1fr) !important;
            gap: 1.25rem !important;
          }
        }
        @media (max-width: 768px) {
          .merchant-industry-flow-grid {
            grid-template-columns: 1fr !important;
            gap: 1rem !important;
          }
        }
      `}</style>
    </>
  );
}
