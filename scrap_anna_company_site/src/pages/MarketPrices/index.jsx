import React, { useState } from 'react';
import { 
  TrendingUp, Search, Calculator, AlertCircle, 
  ArrowUpRight, ArrowDownRight, Minus, RefreshCw, 
  CheckCircle2, ArrowRight, DollarSign 
} from 'lucide-react';
import SEO from '../../components/common/SEO';
import PageHero from '../../components/common/PageHero';
import SectionHeader from '../../components/common/SectionHeader';
import CTASection from '../../components/common/CTASection';
import Button from '../../components/common/Button';
import { useJoinModal } from '../../components/layout/Layout';
import { marketPricesData } from '../../data/siteData';

export default function MarketPricesPage() {
  const { openJoinModal } = useJoinModal();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Calculator State
  const [calcMaterial, setCalcMaterial] = useState('Iron / Heavy Melting Scrap (HMS)');
  const [calcWeight, setCalcWeight] = useState(25);

  const categories = ['All', ...marketPricesData.map(c => c.category)];

  // Flatten items for filtering
  const allItems = marketPricesData.flatMap(cat => 
    cat.items.map(item => ({ ...item, category: cat.category }))
  );

  const filteredItems = allItems.filter(item => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = item.material.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Calculate estimated rate for the calculator widget
  const getAverageRate = (priceString) => {
    const numbers = priceString.match(/\d[\d,]*/g);
    if (!numbers || numbers.length === 0) return 30;
    const cleanNumbers = numbers.map(n => parseFloat(n.replace(/,/g, '')));
    const avg = cleanNumbers.reduce((a, b) => a + b, 0) / cleanNumbers.length;
    return avg;
  };

  const currentCalcItem = allItems.find(i => i.material === calcMaterial) || allItems[0];
  const ratePerUnit = getAverageRate(currentCalcItem.price);
  const estimatedTotal = Math.round(ratePerUnit * (parseFloat(calcWeight) || 0));

  const renderTrendIcon = (trend) => {
    if (trend === 'Up') {
      return (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem', color: '#16A34A', fontSize: '0.8rem', fontWeight: 700 }}>
          <ArrowUpRight size={14} /> Up
        </span>
      );
    }
    if (trend === 'Down') {
      return (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem', color: '#DC2626', fontSize: '0.8rem', fontWeight: 700 }}>
          <ArrowDownRight size={14} /> Down
        </span>
      );
    }
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem', color: 'var(--color-text-muted)', fontSize: '0.8rem', fontWeight: 600 }}>
        <Minus size={14} /> Stable
      </span>
    );
  };

  return (
    <>
      <SEO
        title="Market Prices - Reference Scrap Rates in Chennai & Tamil Nadu"
        description="Check real-time reference scrap prices for iron, copper, aluminium, cardboard, plastics, and e-waste. Use our instant scrap value calculator."
      />

      <PageHero
        eyebrow="Market Transparency"
        badgeIcon={TrendingUp}
        title="Know the Market. Make Better Decisions."
        highlightWord="Make Better Decisions"
        description="Scrap Anna provides daily updated reference price indices across metals, paper, polymers, and e-waste so you can sell and procure with complete clarity."
        breadcrumbs={[{ label: 'Market Prices' }]}
        primaryCta={{
          text: "Book Pickup at These Rates",
          onClick: () => openJoinModal('household')
        }}
        secondaryCta={{
          text: "Calculate Scrap Value",
          onClick: () => {
            const el = document.getElementById('calculator-section');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }
        }}
      />

      {/* SEARCH, FILTER & PRICE TABLE SECTION */}
      <section className="section bg-white">
        <div className="container">
          
          {/* Controls Bar: Search & Category Pills */}
          <div style={{
            backgroundColor: 'var(--color-offwhite)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.5rem',
            marginBottom: '2.5rem',
            boxShadow: 'var(--shadow-xs)'
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1.2fr 2fr',
              gap: '1.5rem',
              alignItems: 'center'
            }} className="prices-controls-grid">
              
              {/* Search Box */}
              <div style={{ position: 'relative' }}>
                <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                <input
                  type="text"
                  className="form-input"
                  style={{ paddingLeft: '2.75rem', backgroundColor: 'var(--color-white)' }}
                  placeholder="Search materials (e.g. Copper, Cardboard, Battery)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Category Pills */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {categories.map((cat) => {
                  const isSelected = selectedCategory === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      style={{
                        padding: '0.45rem 0.9rem',
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
                      {cat}
                    </button>
                  );
                })}
              </div>

            </div>
          </div>

          {/* Reference Rates Table */}
          <div style={{
            backgroundColor: 'var(--color-white)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--color-border)',
            boxShadow: 'var(--shadow-md)',
            overflow: 'hidden',
            marginBottom: '2rem'
          }}>
            <div style={{
              backgroundColor: 'var(--color-secondary-graphite)',
              color: 'var(--color-white)',
              padding: '1.25rem 1.5rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '0.75rem'
            }}>
              <div>
                <h3 style={{ color: 'var(--color-white)', fontSize: '1.15rem', margin: 0 }}>
                  Reference Scrap Rates Index (Indicative)
                </h3>
                <span style={{ fontSize: '0.75rem', color: '#D1D5DB' }}>
                  Showing {filteredItems.length} materials in {selectedCategory} category
                </span>
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                backgroundColor: 'rgba(255, 255, 255, 0.12)',
                padding: '0.35rem 0.75rem',
                borderRadius: 'var(--radius-pill)',
                fontSize: 'var(--text-xs)',
                color: 'var(--color-primary-yellow)'
              }}>
                <RefreshCw size={12} />
                <span>Updated Daily for South India Region</span>
              </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--color-offwhite)', borderBottom: '2px solid var(--color-border)' }}>
                    <th style={{ padding: '1rem 1.5rem', fontSize: '0.8rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Material Description</th>
                    <th style={{ padding: '1rem 1.5rem', fontSize: '0.8rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Category</th>
                    <th style={{ padding: '1rem 1.5rem', fontSize: '0.8rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Reference Rate</th>
                    <th style={{ padding: '1rem 1.5rem', fontSize: '0.8rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Unit</th>
                    <th style={{ padding: '1rem 1.5rem', fontSize: '0.8rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Market Trend</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.length > 0 ? (
                    filteredItems.map((item, idx) => (
                      <tr 
                        key={idx}
                        style={{ 
                          borderBottom: '1px solid #F3F4F6',
                          backgroundColor: idx % 2 === 0 ? 'var(--color-white)' : 'var(--color-offwhite)',
                          transition: 'background-color var(--transition-fast)'
                        }}
                      >
                        <td style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                          {item.material}
                        </td>
                        <td style={{ padding: '1rem 1.5rem' }}>
                          <span className="badge badge-graphite" style={{ fontSize: '0.75rem' }}>
                            {item.category}
                          </span>
                        </td>
                        <td style={{ padding: '1rem 1.5rem', fontWeight: 700, color: 'var(--color-graphite-dark)', fontSize: '1.05rem' }}>
                          {item.price}
                        </td>
                        <td style={{ padding: '1rem 1.5rem', color: 'var(--color-text-muted)', fontSize: 'var(--text-small)' }}>
                          per {item.unit}
                        </td>
                        <td style={{ padding: '1rem 1.5rem' }}>
                          {renderTrendIcon(item.trend)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} style={{ padding: '3rem 1.5rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                        No scrap materials matching "{searchQuery}". Try searching for 'Copper', 'Iron', 'Paper', or 'Batteries'.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pricing Disclaimer Alert */}
          <div style={{
            backgroundColor: 'var(--color-soft-yellow)',
            border: '1px solid var(--color-soft-yellow-border)',
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem 1.5rem',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '1rem'
          }}>
            <AlertCircle size={22} style={{ color: '#D97706', flexShrink: 0, marginTop: '2px' }} />
            <div>
              <h4 style={{ fontSize: '0.95rem', color: '#92400E', marginBottom: '0.25rem' }}>
                Pricing Policy & Market Notice
              </h4>
              <p style={{ fontSize: 'var(--text-small)', color: '#92400E', margin: 0, lineHeight: 1.6 }}>
                The rates published above are indicative reference market averages compiled from local recyclers and secondary commodity benchmarks in Chennai. Final actual realized payouts may vary based on exact grade cleanliness, foreign contamination, total lot quantity, merchant logistics distance, and daily market movements.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* INTERACTIVE SCRAP VALUE CALCULATOR WIDGET */}
      <section className="section bg-offwhite" id="calculator-section" style={{ borderTop: '1px solid var(--color-border)' }}>
        <div className="container">
          <SectionHeader
            eyebrow="Instant Estimation"
            title="Interactive Scrap Value Calculator"
            subtitle="Get an approximate estimate of how much your recyclables are worth before booking a pickup."
          />

          <div style={{
            maxWidth: '820px',
            margin: '0 auto',
            backgroundColor: 'var(--color-white)',
            borderRadius: 'var(--radius-lg)',
            border: '2px solid var(--color-primary-yellow)',
            boxShadow: 'var(--shadow-lg)',
            overflow: 'hidden'
          }}>
            <div style={{
              backgroundColor: 'var(--color-graphite-dark)',
              color: 'var(--color-white)',
              padding: '1.25rem 1.75rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem'
            }}>
              <Calculator size={22} style={{ color: 'var(--color-primary-yellow)' }} />
              <div>
                <h3 style={{ color: 'var(--color-white)', fontSize: '1.15rem', margin: 0 }}>
                  Estimate Your Scrap Payout
                </h3>
                <span style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>
                  Select material and quantity to calculate indicative value
                </span>
              </div>
            </div>

            <div style={{ padding: '2rem' }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1.2fr 1fr',
                gap: '2rem',
                alignItems: 'center'
              }} className="calc-grid">
                
                {/* Inputs */}
                <div>
                  <div className="form-group">
                    <label className="form-label">Select Scrap Material</label>
                    <select
                      className="form-select"
                      value={calcMaterial}
                      onChange={(e) => setCalcMaterial(e.target.value)}
                    >
                      {allItems.map((item, idx) => (
                        <option key={idx} value={item.material}>
                          {item.material} ({item.price}/{item.unit})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      Estimated Weight / Quantity ({currentCalcItem.unit})
                    </label>
                    <input
                      type="number"
                      min="1"
                      className="form-input"
                      value={calcWeight}
                      onChange={(e) => setCalcWeight(e.target.value)}
                    />
                  </div>

                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                    Selected benchmark: ~₹{ratePerUnit.toFixed(1)} / {currentCalcItem.unit}
                  </div>
                </div>

                {/* Calculation Output Card */}
                <div style={{
                  backgroundColor: 'var(--color-primary-yellow-light)',
                  border: '1px solid var(--color-soft-yellow-border)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1.75rem',
                  textAlign: 'center'
                }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#92400E', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Estimated Payout Value
                  </span>
                  
                  <div style={{
                    fontSize: '2.75rem',
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 800,
                    color: 'var(--color-graphite-dark)',
                    margin: '0.5rem 0'
                  }}>
                    ₹{estimatedTotal.toLocaleString('en-IN')}
                  </div>

                  <p style={{ fontSize: '0.8rem', color: '#92400E', marginBottom: '1.25rem' }}>
                    For {calcWeight || 0} {currentCalcItem.unit} of {currentCalcItem.material}
                  </p>

                  <Button
                    variant="primary"
                    size="md"
                    icon={ArrowRight}
                    onClick={() => openJoinModal('household')}
                    style={{ width: '100%', justifyContent: 'center' }}
                  >
                    Lock Rate & Request Pickup
                  </Button>
                </div>

              </div>
            </div>
          </div>

        </div>
      </section>

      <CTASection
        title="Ready to Monetize Your Scrap?"
        description="Book certified doorstep pickup and experience transparent, calibrated digital weighing today."
        primaryText="Schedule Pickup at Fair Rates"
        onJoinClick={() => openJoinModal('household')}
      />

      <style>{`
        @media (max-width: 768px) {
          .prices-controls-grid, .calc-grid {
            grid-template-columns: 1fr !important;
            gap: 1.5rem !important;
          }
        }
      `}</style>
    </>
  );
}
