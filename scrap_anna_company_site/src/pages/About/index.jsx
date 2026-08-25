import React from 'react';
import { 
  Target, Compass, ShieldCheck, Users, AlertCircle, 
  CheckCircle2, Sparkles, Building2, Leaf, HeartHandshake, ArrowRight 
} from 'lucide-react';
import SEO from '../../components/common/SEO';
import PageHero from '../../components/common/PageHero';
import SectionHeader from '../../components/common/SectionHeader';
import CTASection from '../../components/common/CTASection';
import { useJoinModal } from '../../components/layout/Layout';
import { teamMembers } from '../../data/siteData';

export default function AboutPage() {
  const { openJoinModal } = useJoinModal();

  const problemPoints = [
    {
      title: "Fragmented Scrap Collection",
      desc: "Disorganized local collection networks lead to irregular pickups, unserviced neighborhoods, and recyclable waste ending up in municipal landfills."
    },
    {
      title: "Difficulty Finding Reliable Merchants",
      desc: "Households and small businesses struggle to locate trustworthy, punctual scrap dealers with verified credentials and fair rates."
    },
    {
      title: "Limited Digital Records & Receipts",
      desc: "Transactions traditionally happen without physical or digital receipts, creating trust deficits and hindering GST / commercial record-keeping."
    },
    {
      title: "Lack of Structured Industry Connections",
      desc: "Industrial manufacturing plants generate recurring scrap lots but lack efficient digital avenues to discover verified bulk aggregators."
    },
    {
      title: "Pricing Uncertainty & Discrepancies",
      desc: "Sellers are rarely aware of true market values, and uncalibrated manual scales cause significant weighing disputes."
    }
  ];

  const coreValues = [
    {
      icon: ShieldCheck,
      title: "Integrity & Transparency",
      desc: "Open reference market pricing, certified digital weighing, and complete traceability at every step."
    },
    {
      icon: HeartHandshake,
      title: "Local Partner Empowerment",
      desc: "Uplifting neighborhood scrap merchants (kabadiwalas) with digital access, steady demand, and fair earnings."
    },
    {
      icon: Leaf,
      title: "Environmental Circularity",
      desc: "Diverting valuable recyclable materials from landfills and directly feeding secondary manufacturing supply chains."
    },
    {
      icon: Building2,
      title: "Enterprise Compliance",
      desc: "Audit-ready digital receipts, GST compliant documentation, and authenticated disposal manifests for commercial plants."
    }
  ];

  return (
    <>
      <SEO 
        title="About Us - Our Story, Mission & Vision"
        description="Learn about Scrap Anna's mission to make scrap collection accessible, transparent, and digitally connected across India."
      />

      <PageHero
        eyebrow="Who We Are"
        title="Building India's Smarter Scrap Ecosystem"
        highlightWord="Smarter Scrap Ecosystem"
        description="Scrap Anna is transforming the circular economy by digitally bridging households, local merchants, and industrial enterprises with trust, transparency, and technology."
        breadcrumbs={[{ label: 'About Us' }]}
        primaryCta={{
          text: "Join Our Platform",
          onClick: () => openJoinModal('household')
        }}
        secondaryCta={{
          text: "Explore How It Works",
          to: "/how-it-works"
        }}
      />

      {/* OUR STORY SECTION */}
      <section className="section bg-white">
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '3.5rem',
            alignItems: 'center'
          }} className="about-story-grid">
            <div>
              <span className="badge badge-yellow" style={{ marginBottom: '1rem' }}>
                Our Genesis
              </span>
              <h2 style={{ fontSize: 'var(--text-h2)', color: 'var(--color-graphite-dark)', marginBottom: '1.25rem' }}>
                Reimagining India's Scrap Economy with Tech
              </h2>
              <p style={{ fontSize: 'var(--text-body)', color: 'var(--color-text-secondary)', lineHeight: 1.7, marginBottom: '1.25rem' }}>
                For generations, scrap collection in India has been driven by hardworking local merchants and informal collectors. While this grassroots network prevented millions of tons of waste from entering landfills, it remained hindered by manual processes, pricing ambiguities, and zero digital accountability.
              </p>
              <p style={{ fontSize: 'var(--text-body)', color: 'var(--color-text-secondary)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                <strong>Scrap Anna</strong> was born out of a clear realization: technology shouldn't replace local scrap entrepreneurs; it should empower them. By building a trusted digital connection platform, we enable residents, factories, and merchants to transact seamlessly with calibrated weights, itemized digital receipts, and fair market discovery.
              </p>

              <div style={{
                display: 'flex',
                gap: '1.5rem',
                borderLeft: '4px solid var(--color-primary-yellow)',
                paddingLeft: '1.25rem'
              }}>
                <div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-graphite-dark)' }}>100%</div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>Digital Records</div>
                </div>
                <div style={{ borderLeft: '1px solid var(--color-border)', paddingLeft: '1.5rem' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-graphite-dark)' }}>Verified</div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>Merchant Network</div>
                </div>
                <div style={{ borderLeft: '1px solid var(--color-border)', paddingLeft: '1.5rem' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-graphite-dark)' }}>Fair</div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>Market Rates</div>
                </div>
              </div>
            </div>

            {/* Story Card Box */}
            <div style={{
              backgroundColor: 'var(--color-graphite-dark)',
              color: 'var(--color-white)',
              borderRadius: 'var(--radius-lg)',
              padding: '2.5rem',
              border: '2px solid #374151',
              position: 'relative',
              boxShadow: 'var(--shadow-xl)'
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
                marginBottom: '1.5rem'
              }}>
                <Sparkles size={24} />
              </div>

              <h3 style={{ color: 'var(--color-white)', fontSize: '1.5rem', marginBottom: '1rem' }}>
                "Connect • Collect • Recycle"
              </h3>
              <p style={{ color: '#D1D5DB', fontSize: 'var(--text-body)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                Our tagline encapsulates our entire journey. We connect disparate participants, facilitate efficient and authenticated doorstep collection, and channel clean raw scrap directly back into productive recycling cycles.
              </p>

              <div style={{
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                borderRadius: 'var(--radius-sm)',
                padding: '1rem',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                fontSize: 'var(--text-small)',
                color: 'var(--color-primary-yellow)'
              }}>
                Headquartered in Chennai, Tamil Nadu • Building for nationwide circular impact.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MISSION & VISION */}
      <section className="section bg-offwhite" style={{ borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)' }}>
        <div className="container">
          <div className="grid-2" style={{ gap: '2rem' }}>
            
            {/* Mission Card */}
            <div className="card" style={{ borderTop: '4px solid var(--color-primary-yellow)' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--color-primary-yellow-light)',
                color: '#92400E',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem'
              }}>
                <Target size={24} />
              </div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '0.75rem', color: 'var(--color-graphite-dark)' }}>
                Our Mission
              </h3>
              <p style={{ fontSize: 'var(--text-body)', color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>
                Make scrap collection more accessible, transparent and digitally connected for every citizen, enterprise, and recycling merchant across India.
              </p>
            </div>

            {/* Vision Card */}
            <div className="card" style={{ borderTop: '4px solid var(--color-secondary-graphite)' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: '#F3F4F6',
                color: 'var(--color-secondary-graphite)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem'
              }}>
                <Compass size={24} />
              </div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '0.75rem', color: 'var(--color-graphite-dark)' }}>
                Our Vision
              </h3>
              <p style={{ fontSize: 'var(--text-body)', color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>
                Build a smarter, technology-driven, and highly efficient scrap-recycling ecosystem that accelerates India's transition to a zero-waste future.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* THE PROBLEM WE ARE SOLVING */}
      <section className="section bg-white">
        <div className="container">
          <SectionHeader
            eyebrow="Market Inefficiencies"
            title="The Problem in Traditional Scrap Management"
            subtitle="The legacy scrap ecosystem in India faces structural bottlenecks that result in value leakage and lost recycling potential."
          />

          <div className="grid-3" style={{ gap: '1.5rem' }}>
            {problemPoints.map((item, idx) => (
              <div 
                key={idx}
                className="card"
                style={{
                  backgroundColor: '#FFFBFB',
                  border: '1px solid #FEE2E2',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    backgroundColor: '#FEE2E2',
                    color: '#DC2626',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1rem'
                  }}>
                    <AlertCircle size={18} />
                  </div>
                  <h3 style={{ fontSize: '1.15rem', color: '#991B1B', marginBottom: '0.5rem' }}>
                    {item.title}
                  </h3>
                  <p style={{ fontSize: 'var(--text-small)', color: 'var(--color-text-secondary)', lineHeight: 1.6, margin: 0 }}>
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}

            {/* Scrap Anna Solution Highlight Box */}
            <div 
              className="card"
              style={{
                backgroundColor: 'var(--color-primary-yellow-light)',
                border: '2px solid var(--color-primary-yellow)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}
            >
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-primary-yellow)',
                color: 'var(--color-graphite-dark)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem'
              }}>
                <CheckCircle2 size={20} strokeWidth={2.5} />
              </div>
              <h3 style={{ fontSize: '1.2rem', color: 'var(--color-graphite-dark)', marginBottom: '0.5rem' }}>
                The Scrap Anna Solution
              </h3>
              <p style={{ fontSize: 'var(--text-small)', color: 'var(--color-graphite-dark)', lineHeight: 1.6, margin: 0 }}>
                A single digital platform that matches demand, verifies merchants, ensures calibrated digital weighing, provides reference pricing, and logs audit-ready digital receipts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CORE VALUES */}
      <section className="section bg-offwhite" style={{ borderTop: '1px solid var(--color-border)' }}>
        <div className="container">
          <SectionHeader
            eyebrow="Our Guiding Principles"
            title="Values That Drive Us Forward"
            subtitle="Built on the foundations of trust, technological rigor, and sustainable community empowerment."
          />

          <div className="grid-4">
            {coreValues.map((val, idx) => {
              const Icon = val.icon;
              return (
                <div key={idx} className="card card-hover" style={{ backgroundColor: 'var(--color-white)' }}>
                  <div style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'var(--color-secondary-graphite)',
                    color: 'var(--color-primary-yellow)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1rem'
                  }}>
                    <Icon size={22} />
                  </div>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: 'var(--color-graphite-dark)' }}>
                    {val.title}
                  </h3>
                  <p style={{ fontSize: 'var(--text-small)', color: 'var(--color-text-secondary)', lineHeight: 1.6, margin: 0 }}>
                    {val.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* TEAM OVERVIEW */}
      <section className="section bg-white" style={{ borderTop: '1px solid var(--color-border)' }}>
        <div className="container">
          <SectionHeader
            eyebrow="Our Team"
            title="The Minds Behind Scrap Anna"
            subtitle="An experienced team of technologists, operations specialists, and circular economy advocates dedicated to India's recycling transformation."
          />

          <div className="grid-3" style={{ maxWidth: '960px', margin: '0 auto' }}>
            {teamMembers.map((member, idx) => (
              <div 
                key={idx}
                className="card"
                style={{ textAlign: 'center', backgroundColor: 'var(--color-offwhite)' }}
              >
                <div style={{
                  width: '72px',
                  height: '72px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-primary-yellow)',
                  color: 'var(--color-graphite-dark)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.25rem',
                  fontSize: '1.75rem',
                  fontWeight: 800
                }}>
                  {member.name.charAt(0)}
                </div>

                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.25rem', color: 'var(--color-graphite-dark)' }}>
                  {member.name}
                </h3>
                <div style={{ fontSize: 'var(--text-small)', color: '#D97706', fontWeight: 600, marginBottom: '0.75rem' }}>
                  {member.role}
                </div>
                <p style={{ fontSize: 'var(--text-small)', color: 'var(--color-text-secondary)', lineHeight: 1.6, margin: 0 }}>
                  {member.bio}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTASection onJoinClick={() => openJoinModal('household')} />

      <style>{`
        @media (max-width: 1024px) {
          .about-story-grid {
            grid-template-columns: 1fr !important;
            gap: 2.5rem !important;
          }
        }
      `}</style>
    </>
  );
}
