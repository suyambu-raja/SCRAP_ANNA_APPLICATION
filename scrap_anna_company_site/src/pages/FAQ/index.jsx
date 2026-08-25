import React, { useState } from 'react';
import { 
  HelpCircle, Search, ChevronDown, ChevronUp, 
  MessageSquare, Sparkles, PhoneCall, ArrowRight 
} from 'lucide-react';
import SEO from '../../components/common/SEO';
import PageHero from '../../components/common/PageHero';
import SectionHeader from '../../components/common/SectionHeader';
import CTASection from '../../components/common/CTASection';
import Button from '../../components/common/Button';
import { useJoinModal } from '../../components/layout/Layout';
import { faqData } from '../../data/siteData';

export default function FAQPage() {
  const { openJoinModal } = useJoinModal();
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [openItems, setOpenItems] = useState({});

  const categories = [
    { id: 'all', label: 'All Questions' },
    { id: 'general', label: 'General & Platform' },
    { id: 'household', label: 'For Households' },
    { id: 'merchant', label: 'For Merchants' },
    { id: 'industry', label: 'For Industries' },
    { id: 'trust', label: 'Trust & Verification' },
  ];

  // Flatten FAQ list
  const allFaqs = Object.entries(faqData).flatMap(([catKey, items]) => 
    items.map((item, idx) => ({ ...item, categoryKey: catKey, id: `${catKey}-${idx}` }))
  );

  const filteredFaqs = allFaqs.filter(item => {
    const matchesCat = activeCategory === 'all' || item.categoryKey === activeCategory;
    const matchesSearch = item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.a.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const toggleItem = (id) => {
    setOpenItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <>
      <SEO
        title="Frequently Asked Questions (FAQ) - Scrap Anna"
        description="Find answers to common questions about Scrap Anna scrap pickups, verified merchants, reference pricing, and industrial recycling manifests."
      />

      <PageHero
        eyebrow="Help Center & Knowledge"
        badgeIcon={HelpCircle}
        title="Frequently Asked Questions"
        highlightWord="Asked Questions"
        description="Everything you need to know about the Scrap Anna platform, doorstep pickup workflows, digital scale verification, and merchant partnerships."
        breadcrumbs={[{ label: 'FAQ' }]}
        primaryCta={{
          text: "Contact Support Desk",
          to: "/contact"
        }}
        secondaryCta={{
          text: "Get Started Now",
          onClick: () => openJoinModal('household')
        }}
      />

      <section className="section bg-white">
        <div className="container-narrow">
          
          {/* Search Box */}
          <div style={{
            position: 'relative',
            marginBottom: '2rem'
          }}>
            <Search size={20} style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
            <input
              type="text"
              className="form-input"
              style={{
                paddingLeft: '3.25rem',
                paddingTop: '1rem',
                paddingBottom: '1rem',
                fontSize: 'var(--text-body)',
                borderRadius: 'var(--radius-pill)',
                boxShadow: 'var(--shadow-sm)'
              }}
              placeholder="Type your question (e.g. How does pickup work? Commission? Digital bill?)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Category Filter Pills */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.5rem',
            justifyContent: 'center',
            marginBottom: '3rem'
          }}>
            {categories.map((cat) => {
              const isSelected = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  style={{
                    padding: '0.5rem 1.1rem',
                    borderRadius: 'var(--radius-pill)',
                    fontSize: 'var(--text-small)',
                    fontWeight: isSelected ? 700 : 500,
                    border: isSelected ? '1px solid var(--color-primary-yellow)' : '1px solid var(--color-border)',
                    backgroundColor: isSelected ? 'var(--color-primary-yellow)' : 'var(--color-white)',
                    color: isSelected ? 'var(--color-graphite-dark)' : 'var(--color-secondary-graphite)',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)'
                  }}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* FAQ Accordion List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq) => {
                const isOpen = openItems[faq.id] ?? (activeCategory !== 'all' || searchQuery.length > 0);
                return (
                  <div
                    key={faq.id}
                    style={{
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: isOpen ? 'var(--color-white)' : 'var(--color-offwhite)',
                      boxShadow: isOpen ? 'var(--shadow-sm)' : 'none',
                      transition: 'all var(--transition-fast)',
                      overflow: 'hidden'
                    }}
                  >
                    <button
                      onClick={() => toggleItem(faq.id)}
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        padding: '1.25rem 1.5rem',
                        background: 'none',
                        border: 'none',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '1rem',
                        cursor: 'pointer'
                      }}
                      aria-expanded={isOpen}
                    >
                      <span style={{
                        fontSize: '1.05rem',
                        fontWeight: 700,
                        color: isOpen ? 'var(--color-graphite-dark)' : 'var(--color-text-primary)'
                      }}>
                        {faq.q}
                      </span>
                      <div style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        backgroundColor: isOpen ? 'var(--color-primary-yellow)' : 'var(--color-surface-subtle)',
                        color: 'var(--color-graphite-dark)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </div>
                    </button>

                    {isOpen && (
                      <div style={{
                        padding: '0 1.5rem 1.25rem 1.5rem',
                        color: 'var(--color-text-secondary)',
                        fontSize: 'var(--text-small)',
                        lineHeight: 1.7,
                        borderTop: '1px dashed var(--color-border)',
                        paddingTop: '1rem',
                        animation: 'fadeIn 0.2s ease-out'
                      }}>
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div style={{
                textAlign: 'center',
                padding: '3.5rem 1.5rem',
                backgroundColor: 'var(--color-offwhite)',
                borderRadius: 'var(--radius-lg)',
                border: '1px dashed var(--color-border)'
              }}>
                <HelpCircle size={40} style={{ color: 'var(--color-text-muted)', marginBottom: '1rem' }} />
                <h3 style={{ fontSize: '1.25rem', color: 'var(--color-graphite-dark)', marginBottom: '0.5rem' }}>
                  No matching questions found
                </h3>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-small)', marginBottom: '1.5rem' }}>
                  Can't find what you're looking for? Reach out to our Chennai customer support team directly.
                </p>
                <Button to="/contact" variant="primary" size="md">
                  Submit a Query
                </Button>
              </div>
            )}
          </div>

        </div>
      </section>

      <CTASection
        title="Still Have Questions About Scrap Anna?"
        description="Our team is readily available to assist households, scrap dealers, and factories across Chennai."
        primaryText="Contact Support Desk"
        onJoinClick={() => openJoinModal('household')}
      />
    </>
  );
}
