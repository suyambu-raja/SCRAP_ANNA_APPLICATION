import React, { useState } from 'react';
import { 
  Home, Store, Factory, Network, CheckCircle2, 
  ArrowRight, ShieldCheck, FileCheck, Scale, Receipt, 
  MapPin, Clock, Camera, Key, RefreshCw 
} from 'lucide-react';
import SEO from '../../components/common/SEO';
import PageHero from '../../components/common/PageHero';
import SectionHeader from '../../components/common/SectionHeader';
import CTASection from '../../components/common/CTASection';
import Button from '../../components/common/Button';
import { useJoinModal } from '../../components/layout/Layout';

export default function HowItWorksPage() {
  const [activeTab, setActiveTab] = useState('household');
  const { openJoinModal } = useJoinModal();

  const flowData = {
    household: {
      title: "Household Scrap Recycling Journey",
      subtitle: "Simple, safe, and scheduled right from your living room.",
      badge: "Residential Flow",
      steps: [
        {
          num: "01",
          icon: Camera,
          title: "Post Scrap Details",
          desc: "Select your scrap types (paper, iron, copper, old electronics), estimate approximate quantity, and snap a quick photo."
        },
        {
          num: "02",
          icon: MapPin,
          title: "Pin Your Location",
          desc: "Provide your apartment/residence address and landmark in Chennai for accurate merchant routing."
        },
        {
          num: "03",
          icon: Clock,
          title: "Select Convenient Time Slot",
          desc: "Choose a morning or evening pickup slot that fits your personal schedule."
        },
        {
          num: "04",
          icon: Store,
          title: "Merchant Assigned",
          desc: "A verified local merchant partner accepts your request and confirms arrival via GPS check-in."
        },
        {
          num: "05",
          icon: Scale,
          title: "Digital Weighing at Doorstep",
          desc: "Merchant weighs each scrap category in front of you using calibrated digital hanging / platform scales."
        },
        {
          num: "06",
          icon: Receipt,
          title: "OTP Verification & Digital Bill",
          desc: "Verify itemized line-items, share the 4-digit completion OTP, and receive instant digital receipt and payment."
        }
      ]
    },
    merchant: {
      title: "Merchant Collection & Growth Workflow",
      subtitle: "Streamline your daily scrap routes with verified customer demand and digital accounting.",
      badge: "Merchant Flow",
      steps: [
        {
          num: "01",
          icon: ShieldCheck,
          title: "Quick KYC Onboarding",
          desc: "Complete basic identity verification, submit your service radius, and verify your digital weighing equipment."
        },
        {
          num: "02",
          icon: RefreshCw,
          title: "Receive Geotagged Leads",
          desc: "Receive pre-verified household and small business scrap pickup requests in your immediate operating area."
        },
        {
          num: "03",
          icon: Clock,
          title: "Accept & Plan Pickup Route",
          desc: "Accept leads that match your vehicle capacity and optimize your travel route for maximum efficiency."
        },
        {
          num: "04",
          icon: MapPin,
          title: "Arrive & Check-In",
          desc: "Arrive at customer doorstep and confirm arrival via location verification on the platform."
        },
        {
          num: "05",
          icon: Scale,
          title: "Digital Weighing & Ledger Entry",
          desc: "Input measured weights into the digital invoice generator with automated rate calculations."
        },
        {
          num: "06",
          icon: FileCheck,
          title: "Complete with OTP & Grow Ledger",
          desc: "Collect customer OTP to close the pickup, update your daily transaction ledger, and maintain a 5-star merchant rating."
        }
      ]
    },
    industry: {
      title: "Industrial Commercial Scrap Management",
      subtitle: "Full digital compliance, audit trails, and structured bulk scrap sales for manufacturing units.",
      badge: "Industry Flow",
      steps: [
        {
          num: "01",
          icon: Factory,
          title: "Post Industrial Lot",
          desc: "List manufacturing offcuts, turning scrap, obsolete machinery, or packaging waste with grade specifications and lot tonnage."
        },
        {
          num: "02",
          icon: FileCheck,
          title: "Compliance & Safety Specifications",
          desc: "Specify plant gate-pass norms, lifting equipment requirements, and environmental handling parameters."
        },
        {
          num: "03",
          icon: RefreshCw,
          title: "Commercial Matchmaking",
          desc: "Match lot with certified bulk merchants and recycling aggregators licensed for industrial procurement."
        },
        {
          num: "04",
          icon: Scale,
          title: "Weighbridge & Gate Verification",
          desc: "Weighbridge gross and tare weight synchronization with photo logs and security pass authentication."
        },
        {
          num: "05",
          icon: Receipt,
          title: "Digital GST Invoicing",
          desc: "Instant automated generation of tax-compliant commercial invoice, e-way bill references, and payment settlement."
        },
        {
          num: "06",
          icon: ShieldCheck,
          title: "Certified Recycling Manifest",
          desc: "Receive chain-of-custody certificates verifying responsible processing and audit-ready environmental documentation."
        }
      ]
    },
    aggregator: {
      title: "Aggregator Hub & Supply Consolidation",
      subtitle: "Aggregate local merchant volumes and supply directly to large recyclers and smelting plants.",
      badge: "Aggregator Flow",
      steps: [
        {
          num: "01",
          icon: Network,
          title: "Yard Registration",
          desc: "Register your aggregation yard capacity, storage infrastructure, and sorting/baling capabilities."
        },
        {
          num: "02",
          icon: RefreshCw,
          title: "Channel Local Merchant Supply",
          desc: "Receive consolidated sorted scrap batches from neighborhood collection merchants."
        },
        {
          num: "03",
          icon: Scale,
          title: "Grading & Processing",
          desc: "Process scrap lots into high-density bales, shredded bundles, or sorted metal grades."
        },
        {
          num: "04",
          icon: Factory,
          title: "Fulfill Industrial Contracts",
          desc: "Connect bulk consolidated volumes with verified steel rolling mills, paper mills, and plastic recyclers."
        },
        {
          num: "05",
          icon: Receipt,
          title: "Bulk Settlement",
          desc: "Seamless digital payment clearing with itemized consignment manifests and volume bonuses."
        },
        {
          num: "06",
          icon: FileCheck,
          title: "Traceability Reports",
          desc: "Access end-to-end provenance reports showcasing material origin and carbon offset credits."
        }
      ]
    }
  };

  const activeFlow = flowData[activeTab];

  return (
    <>
      <SEO
        title="How It Works - Step-by-Step Platform Guide"
        description="Discover how Scrap Anna works for households, scrap merchants, industrial plants, and bulk aggregators with digital weighing, OTP security, and instant digital bills."
      />

      <PageHero
        eyebrow="Platform Workflow"
        title="How Scrap Anna Works For Everyone"
        highlightWord="Works For Everyone"
        description="Whether you are a resident selling old newspapers or an industrial manager dispatching 20 tons of factory steel, our digital workflows ensure safety, fair pricing, and transparency."
        breadcrumbs={[{ label: 'How It Works' }]}
        primaryCta={{
          text: "Start Today",
          onClick: () => openJoinModal(activeTab)
        }}
        secondaryCta={{
          text: "View Market Prices",
          to: "/market-prices"
        }}
      />

      {/* INTERACTIVE ROLE SWITCHER SECTION */}
      <section className="section bg-white">
        <div className="container">
          
          {/* Tab Navigation Buttons */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: '0.75rem',
            marginBottom: '3rem'
          }}>
            {[
              { id: 'household', label: 'For Households', icon: Home },
              { id: 'merchant', label: 'For Merchants', icon: Store },
              { id: 'industry', label: 'For Industries', icon: Factory },
              { id: 'aggregator', label: 'For Aggregators', icon: Network },
            ].map((tab) => {
              const Icon = tab.icon;
              const isCurrent = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.75rem 1.5rem',
                    borderRadius: 'var(--radius-pill)',
                    fontWeight: 700,
                    fontSize: 'var(--text-small)',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)',
                    border: isCurrent ? '2px solid var(--color-primary-yellow)' : '1px solid var(--color-border)',
                    backgroundColor: isCurrent ? 'var(--color-primary-yellow-light)' : 'var(--color-white)',
                    color: isCurrent ? '#92400E' : 'var(--color-secondary-graphite)',
                    boxShadow: isCurrent ? 'var(--shadow-sm)' : 'none'
                  }}
                >
                  <Icon size={18} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Active Flow Header */}
          <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 3rem' }}>
            <span className="badge badge-yellow" style={{ marginBottom: '0.75rem' }}>
              {activeFlow.badge}
            </span>
            <h2 style={{ fontSize: 'var(--text-h2)', color: 'var(--color-graphite-dark)', marginBottom: '0.5rem' }}>
              {activeFlow.title}
            </h2>
            <p style={{ fontSize: 'var(--text-body)', color: 'var(--color-text-secondary)' }}>
              {activeFlow.subtitle}
            </p>
          </div>

          {/* Flow Steps Grid */}
          <div className="grid-3" style={{ gap: '1.75rem', marginBottom: '3.5rem' }}>
            {activeFlow.steps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div
                  key={idx}
                  className="card card-hover"
                  style={{
                    backgroundColor: 'var(--color-offwhite)',
                    border: '1px solid var(--color-border)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                      <div style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: 'var(--color-secondary-graphite)',
                        color: 'var(--color-primary-yellow)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <Icon size={20} />
                      </div>
                      <span style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: '1.25rem',
                        fontWeight: 800,
                        color: 'var(--color-primary-yellow)',
                        backgroundColor: 'var(--color-primary-yellow-light)',
                        padding: '0.2rem 0.6rem',
                        borderRadius: 'var(--radius-pill)',
                        border: '1px solid var(--color-soft-yellow-border)'
                      }}>
                        {step.num}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: 'var(--color-graphite-dark)' }}>
                      {step.title}
                    </h3>
                    <p style={{ fontSize: 'var(--text-small)', color: 'var(--color-text-secondary)', lineHeight: 1.6, margin: 0 }}>
                      {step.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Flow Specific Call to Action */}
          <div style={{
            backgroundColor: 'var(--color-primary-yellow-light)',
            border: '2px solid var(--color-primary-yellow)',
            borderRadius: 'var(--radius-lg)',
            padding: '2rem',
            textAlign: 'center',
            maxWidth: '800px',
            margin: '0 auto'
          }}>
            <h3 style={{ fontSize: '1.35rem', color: 'var(--color-graphite-dark)', marginBottom: '0.5rem' }}>
              Ready to experience this frictionless workflow?
            </h3>
            <p style={{ color: '#92400E', fontSize: 'var(--text-small)', marginBottom: '1.25rem' }}>
              Join hundreds of happy users across Chennai who rely on Scrap Anna for transparent scrap pickup.
            </p>
            <Button
              variant="primary"
              size="md"
              icon={ArrowRight}
              onClick={() => openJoinModal(activeTab)}
            >
              Get Started as a {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </Button>
          </div>

        </div>
      </section>

      {/* SAMPLE DIGITAL BILL & VERIFICATION PREVIEW */}
      <section className="section bg-offwhite" style={{ borderTop: '1px solid var(--color-border)' }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1.1fr 0.9fr',
            gap: '3.5rem',
            alignItems: 'center'
          }} className="bill-preview-grid">
            
            {/* Left: Security Checkpoints Info */}
            <div>
              <span className="badge badge-yellow" style={{ marginBottom: '1rem' }}>
                Zero Ambiguity
              </span>
              <h2 style={{ fontSize: 'var(--text-h2)', color: 'var(--color-graphite-dark)', marginBottom: '1.25rem' }}>
                Every Pickup Protected by 4-Layer Verification
              </h2>
              <p style={{ fontSize: 'var(--text-body)', color: 'var(--color-text-secondary)', lineHeight: 1.7, marginBottom: '2rem' }}>
                Scrap Anna eliminates age-old discrepancies in scrap trading with automated digital checkpoints.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {[
                  {
                    title: "1. Verified Partner KYC",
                    desc: "All merchants are identity-checked and assigned a verified platform badge."
                  },
                  {
                    title: "2. Geotagged Check-In",
                    desc: "Merchants confirm their presence at your address with GPS timestamping."
                  },
                  {
                    title: "3. Calibrated Digital Scales",
                    desc: "Weighing happens on digital equipment with real-time tare zeroing."
                  },
                  {
                    title: "4. OTP Handshake & Instant Digital Invoice",
                    desc: "You receive an SMS/WhatsApp invoice link; the transaction only completes when you share the OTP."
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
                      <div style={{ fontWeight: 700, color: 'var(--color-text-primary)', fontSize: '0.95rem' }}>
                        {item.title}
                      </div>
                      <div style={{ fontSize: 'var(--text-small)', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
                        {item.desc}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Mock Digital Receipt Card */}
            <div style={{
              backgroundColor: 'var(--color-white)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--color-border)',
              boxShadow: 'var(--shadow-xl)',
              overflow: 'hidden'
            }}>
              {/* Receipt Header */}
              <div style={{
                backgroundColor: 'var(--color-secondary-graphite)',
                color: 'var(--color-white)',
                padding: '1.25rem 1.5rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-primary-yellow)', fontWeight: 700, textTransform: 'uppercase' }}>
                    Digital Manifest & Bill
                  </div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800 }}>
                    Scrap Anna e-Receipt
                  </div>
                </div>
                <div style={{
                  backgroundColor: '#16A34A',
                  color: 'white',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  padding: '0.25rem 0.6rem',
                  borderRadius: 'var(--radius-pill)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem'
                }}>
                  <CheckCircle2 size={12} />
                  <span>OTP Verified</span>
                </div>
              </div>

              {/* Receipt Meta */}
              <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px dashed var(--color-border)', fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <div>
                  <strong>Receipt ID:</strong> SA-2026-88421<br />
                  <strong>Date:</strong> 25 Aug 2026, 10:30 AM
                </div>
                <div style={{ textAlign: 'right' }}>
                  <strong>Merchant:</strong> Velan Scrap Enterprise (ID: #4092)<br />
                  <strong>Location:</strong> Guindy, Chennai
                </div>
              </div>

              {/* Receipt Line Items Table */}
              <div style={{ padding: '1.25rem 1.5rem' }}>
                <table style={{ width: '100%', fontSize: 'var(--text-small)', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--color-border)', color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>
                      <th style={{ textAlign: 'left', paddingBottom: '0.5rem' }}>Item</th>
                      <th style={{ textAlign: 'center', paddingBottom: '0.5rem' }}>Weight</th>
                      <th style={{ textAlign: 'center', paddingBottom: '0.5rem' }}>Rate</th>
                      <th style={{ textAlign: 'right', paddingBottom: '0.5rem' }}>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid #F3F4F6' }}>
                      <td style={{ padding: '0.6rem 0', fontWeight: 600 }}>Old Newspapers (ONP)</td>
                      <td style={{ textAlign: 'center', padding: '0.6rem 0' }}>15.5 kg</td>
                      <td style={{ textAlign: 'center', padding: '0.6rem 0' }}>₹16.00/kg</td>
                      <td style={{ textAlign: 'right', padding: '0.6rem 0', fontWeight: 600 }}>₹248.00</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #F3F4F6' }}>
                      <td style={{ padding: '0.6rem 0', fontWeight: 600 }}>Aluminium Section Scrap</td>
                      <td style={{ textAlign: 'center', padding: '0.6rem 0' }}>8.0 kg</td>
                      <td style={{ textAlign: 'center', padding: '0.6rem 0' }}>₹150.00/kg</td>
                      <td style={{ textAlign: 'right', padding: '0.6rem 0', fontWeight: 600 }}>₹1,200.00</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #F3F4F6' }}>
                      <td style={{ padding: '0.6rem 0', fontWeight: 600 }}>Heavy Iron Scrap</td>
                      <td style={{ textAlign: 'center', padding: '0.6rem 0' }}>22.0 kg</td>
                      <td style={{ textAlign: 'center', padding: '0.6rem 0' }}>₹32.00/kg</td>
                      <td style={{ textAlign: 'right', padding: '0.6rem 0', fontWeight: 600 }}>₹704.00</td>
                    </tr>
                  </tbody>
                </table>

                {/* Total Bar */}
                <div style={{
                  marginTop: '1.25rem',
                  paddingTop: '1rem',
                  borderTop: '2px solid var(--color-border)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Net Total Payout</div>
                    <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-graphite-dark)' }}>
                      ₹2,152.00
                    </div>
                  </div>
                  <div style={{
                    backgroundColor: 'var(--color-soft-yellow)',
                    border: '1px solid var(--color-soft-yellow-border)',
                    padding: '0.4rem 0.8rem',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.8rem',
                    color: '#92400E',
                    fontWeight: 600
                  }}>
                    Paid via UPI / Instant Cash
                  </div>
                </div>
              </div>

              <div style={{ backgroundColor: '#F9FAFB', padding: '0.75rem 1.5rem', borderTop: '1px solid var(--color-border)', fontSize: '0.75rem', color: 'var(--color-text-muted)', textAlign: 'center' }}>
                Digital receipt generated instantly by Scrap Anna platform engine.
              </div>
            </div>

          </div>
        </div>
      </section>

      <CTASection onJoinClick={() => openJoinModal(activeTab)} />

      <style>{`
        @media (max-width: 1024px) {
          .bill-preview-grid {
            grid-template-columns: 1fr !important;
            gap: 2.5rem !important;
          }
        }
      `}</style>
    </>
  );
}
