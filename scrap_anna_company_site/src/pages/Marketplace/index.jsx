import React, { useState, useMemo, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { 
  Search, Filter, MapPin, Scale, ShieldCheck, 
  ArrowRight, CheckCircle2, Plus, Sparkles, 
  Store, Factory, Clock, AlertCircle, Phone, 
  ChevronRight, ArrowUpDown, X, Tag, IndianRupee, 
  Upload, Layers, Check, FileText
} from 'lucide-react';
import SEO from '../../components/common/SEO';
import SectionHeader from '../../components/common/SectionHeader';
import Button from '../../components/common/Button';
import { useJoinModal } from '../../components/layout/Layout';
import { 
  materialCategories, 
  marketplaceListings as initialListings,
  marketplaceWorkflowSteps,
  marketplaceTrustFeatures
} from '../../data/marketplaceData';

export default function MarketplacePage() {
  const { openJoinModal } = useJoinModal();
  const location = useLocation();

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCity, setSelectedCity] = useState('all');
  const [sortBy, setSortBy] = useState('newest'); // 'newest' | 'price-asc' | 'price-desc' | 'qty-desc'

  // Modals
  const [sellModalOpen, setSellModalOpen] = useState(false);
  const [inquireModalOpen, setInquireModalOpen] = useState(false);
  const [selectedLotForInquiry, setSelectedLotForInquiry] = useState(null);
  const [inquirySuccess, setInquirySuccess] = useState(false);

  // New Listing Form State (Sell Scrap)
  const [listingSuccess, setListingSuccess] = useState(false);
  const [newListingForm, setNewListingForm] = useState({
    title: '',
    category: 'steel',
    quantity: '',
    unit: 'Metric Tons',
    pricePerUnit: '',
    location: '',
    city: 'Chennai',
    grade: '',
    readiness: 'Ready for Immediate Dispatch',
    description: '',
    merchantName: '',
    merchantPhone: ''
  });

  // Handle URL query parameters (e.g. /marketplace?tab=sell or /marketplace?category=copper)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tabParam = params.get('tab');
    const catParam = params.get('category');
    
    if (tabParam === 'sell') {
      setSellModalOpen(true);
    }
    if (catParam && materialCategories.some(c => c.id === catParam)) {
      setSelectedCategory(catParam);
    }
  }, [location.search]);

  // Unique cities from listings
  const availableCities = useMemo(() => {
    const cities = new Set(initialListings.map(item => item.city));
    return ['all', ...Array.from(cities)];
  }, []);

  // Filtered & Sorted Listings
  const filteredListings = useMemo(() => {
    return initialListings
      .filter((lot) => {
        const matchesCategory = selectedCategory === 'all' || lot.category === selectedCategory;
        const matchesCity = selectedCity === 'all' || lot.city === selectedCity;
        const matchesSearch = 
          searchQuery.trim() === '' ||
          lot.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          lot.grade.toLowerCase().includes(searchQuery.toLowerCase()) ||
          lot.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
          lot.merchant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          lot.categoryName.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesCategory && matchesCity && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.pricePerUnit - b.pricePerUnit;
        if (sortBy === 'price-desc') return b.pricePerUnit - a.pricePerUnit;
        if (sortBy === 'qty-desc') return parseFloat(b.quantity.replace(/,/g, '')) - parseFloat(a.quantity.replace(/,/g, ''));
        return 0; // default newest order
      });
  }, [selectedCategory, selectedCity, searchQuery, sortBy]);

  const handleOpenInquiry = (lot) => {
    setSelectedLotForInquiry(lot);
    setInquirySuccess(false);
    setInquireModalOpen(true);
  };

  const handleInquirySubmit = (e) => {
    e.preventDefault();
    setInquirySuccess(true);
    setTimeout(() => {
      setInquireModalOpen(false);
      setInquirySuccess(false);
    }, 2400);
  };

  const handleCreateListingSubmit = (e) => {
    e.preventDefault();
    setListingSuccess(true);
    setTimeout(() => {
      setSellModalOpen(false);
      setListingSuccess(false);
    }, 2400);
  };

  return (
    <>
      <SEO
        title="Scrap Marketplace - Buy & Sell Scrap with Confidence | Scrap Anna"
        description="A verified B2B scrap marketplace connecting certified merchants, aggregators, and industrial buyers in Tamil Nadu. Buy and sell steel, copper, aluminium, brass, paper, plastic, and e-waste lots with calibrated weighbridge transparency."
      />

      {/* MARKETPLACE HERO SECTION */}
      <section 
        className="bg-graphite-dark text-white"
        style={{
          paddingTop: '4.5rem',
          paddingBottom: '4.5rem',
          position: 'relative',
          overflow: 'hidden',
          borderBottom: '3px solid var(--color-primary-yellow)'
        }}
      >
        {/* Subtle grid background */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.04,
          backgroundImage: 'radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)',
          backgroundSize: '24px 24px',
          pointerEvents: 'none'
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" style={{ marginBottom: '1.5rem' }}>
            <ol style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', listStyle: 'none', fontSize: 'var(--text-small)', color: '#9CA3AF', padding: 0 }}>
              <li>
                <Link to="/" style={{ color: '#D1D5DB', textDecoration: 'none' }}>Home</Link>
              </li>
              <li style={{ display: 'flex', alignItems: 'center' }}>
                <ChevronRight size={14} style={{ margin: '0 0.25rem', color: '#6B7280' }} />
                <span style={{ color: 'var(--color-primary-yellow)', fontWeight: 600 }}>Scrap Marketplace</span>
              </li>
            </ol>
          </nav>

          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.4rem 1rem',
            borderRadius: '9999px',
            backgroundColor: 'rgba(249, 197, 28, 0.12)',
            border: '1px solid rgba(249, 197, 28, 0.3)',
            color: 'var(--color-primary-yellow)',
            fontSize: '0.8rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: '1.25rem'
          }}>
            <Store size={14} />
            <span>Verified B2B & Merchant Trade</span>
          </div>

          <h1 style={{
            fontSize: 'var(--text-h1)',
            fontWeight: 900,
            color: 'var(--color-white)',
            lineHeight: 1.15,
            letterSpacing: '-0.025em',
            maxWidth: '900px',
            marginBottom: '1.25rem'
          }}>
            Buy & Sell Scrap with <span className="text-yellow-highlight">Confidence</span>
          </h1>

          <p style={{
            fontSize: 'var(--text-body-lg)',
            color: '#D1D5DB',
            maxWidth: '750px',
            lineHeight: 1.6,
            marginBottom: '2.5rem'
          }}>
            A digital marketplace where verified scrap merchants, bulk aggregators, and recycling enterprises list, discover, and trade certified scrap lots with weighbridge synchronization.
          </p>

          {/* Quick Actions & Live Search Bar */}
          <div style={{
            backgroundColor: 'var(--color-white)',
            borderRadius: '16px',
            padding: '1rem 1.25rem',
            boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.3)',
            maxWidth: '960px',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            flexWrap: 'wrap'
          }}>
            {/* Search Input */}
            <div style={{ flex: '1 1 280px', display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <Search size={20} style={{ color: '#9CA3AF', flexShrink: 0 }} />
              <input
                type="text"
                placeholder="Search material, grade, or location (e.g. Copper Wire, HMS, HDPE Flakes)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  border: 'none',
                  outline: 'none',
                  fontSize: '0.95rem',
                  color: '#1F242D',
                  fontWeight: 500
                }}
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF', padding: '0.2rem' }}
                  aria-label="Clear search"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* City Selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderLeft: '1px solid #E5E7EB', paddingLeft: '1rem' }} className="city-selector-wrapper">
              <MapPin size={18} style={{ color: 'var(--color-primary-yellow)', flexShrink: 0 }} />
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                style={{
                  border: 'none',
                  outline: 'none',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  color: '#374151',
                  backgroundColor: 'transparent',
                  cursor: 'pointer'
                }}
              >
                <option value="all">All Locations</option>
                {availableCities.filter(c => c !== 'all').map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            {/* Primary Action Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <button
                onClick={() => {
                  const el = document.getElementById('browse-listings');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                style={{
                  backgroundColor: '#1F242D',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  padding: '0.75rem 1.25rem',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  transition: 'background-color 0.15s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#374151'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#1F242D'}
              >
                <span>Browse Lots</span>
                <ArrowRight size={15} />
              </button>

              <button
                onClick={() => setSellModalOpen(true)}
                style={{
                  backgroundColor: 'var(--color-primary-yellow)',
                  color: '#1F242D',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  padding: '0.75rem 1.25rem',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  boxShadow: '0 2px 8px rgba(249, 197, 28, 0.25)',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#E5B214'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--color-primary-yellow)'}
              >
                <Plus size={16} strokeWidth={2.5} />
                <span>Sell Scrap</span>
              </button>
            </div>
          </div>

          {/* Highlights Ribbon */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '2.5rem',
            marginTop: '2.5rem',
            flexWrap: 'wrap',
            color: '#9CA3AF',
            fontSize: 'var(--text-small)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShieldCheck size={18} style={{ color: 'var(--color-primary-yellow)' }} />
              <span style={{ color: '#E5E7EB', fontWeight: 600 }}>100% GST & KYC Verified Sellers</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Scale size={18} style={{ color: 'var(--color-primary-yellow)' }} />
              <span style={{ color: '#E5E7EB', fontWeight: 600 }}>Calibrated Weighbridge Synchronized</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FileText size={18} style={{ color: 'var(--color-primary-yellow)' }} />
              <span style={{ color: '#E5E7EB', fontWeight: 600 }}>E-Way Bill & Compliance Ready</span>
            </div>
          </div>
        </div>
      </section>

      {/* MATERIAL CATEGORIES FILTER BAR */}
      <section style={{ backgroundColor: 'var(--color-offwhite)', borderBottom: '1px solid #E5E7EB', padding: '1.25rem 0' }}>
        <div className="container">
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            overflowX: 'auto',
            paddingBottom: '0.25rem',
            scrollbarWidth: 'none'
          }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.04em', marginRight: '0.5rem', whiteSpace: 'nowrap' }}>
              Categories:
            </span>

            {materialCategories.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  style={{
                    backgroundColor: isSelected ? 'var(--color-graphite-dark)' : 'var(--color-white)',
                    color: isSelected ? 'var(--color-white)' : '#374151',
                    border: `1px solid ${isSelected ? 'var(--color-graphite-dark)' : '#E5E7EB'}`,
                    borderRadius: '9999px',
                    padding: '0.5rem 1rem',
                    fontSize: '0.85rem',
                    fontWeight: isSelected ? 700 : 500,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    boxShadow: isSelected ? '0 2px 6px rgba(0,0,0,0.15)' : 'none',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <span>{cat.name}</span>
                  <span style={{
                    fontSize: '0.725rem',
                    backgroundColor: isSelected ? 'rgba(249, 197, 28, 0.3)' : '#F3F4F6',
                    color: isSelected ? 'var(--color-primary-yellow)' : '#6B7280',
                    padding: '0.1rem 0.45rem',
                    borderRadius: '9999px',
                    fontWeight: 700
                  }}>
                    {cat.id === 'all' ? initialListings.length : initialListings.filter(l => l.category === cat.id).length}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* BROWSE SCRAP LISTINGS SECTION */}
      <section id="browse-listings" className="section bg-white">
        <div className="container">
          {/* Header with Results Count & Sort Controls */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '2rem',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <div>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-graphite-dark)', margin: 0 }}>
                Available Scrap Lots
              </h2>
              <p style={{ fontSize: 'var(--text-small)', color: 'var(--color-text-muted)', margin: '0.25rem 0 0 0' }}>
                Showing <strong style={{ color: '#1F242D' }}>{filteredListings.length}</strong> verified commercial lot{filteredListings.length === 1 ? '' : 's'}
                {selectedCategory !== 'all' && ` in ${materialCategories.find(c => c.id === selectedCategory)?.name}`}
                {selectedCity !== 'all' && ` near ${selectedCity}`}
              </p>
            </div>

            {/* Sorting & Filter Actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: 'var(--text-small)', color: '#4B5563' }}>
                <ArrowUpDown size={15} style={{ color: '#6B7280' }} />
                <span>Sort By:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  style={{
                    border: '1px solid #D1D5DB',
                    borderRadius: '6px',
                    padding: '0.4rem 0.65rem',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    color: '#1F242D',
                    backgroundColor: '#FFFFFF',
                    cursor: 'pointer'
                  }}
                >
                  <option value="newest">Newest Listed</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="qty-desc">Quantity: High to Low</option>
                </select>
              </div>

              <button
                onClick={() => setSellModalOpen(true)}
                style={{
                  backgroundColor: 'rgba(249, 197, 28, 0.15)',
                  color: '#1F242D',
                  border: '1px solid var(--color-primary-yellow)',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  padding: '0.45rem 0.9rem',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem'
                }}
              >
                <Plus size={15} />
                <span>List a Lot</span>
              </button>
            </div>
          </div>

          {/* Listings Grid */}
          {filteredListings.length > 0 ? (
            <div 
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
                gap: '1.75rem'
              }}
            >
              {filteredListings.map((lot) => (
                <div
                  key={lot.id}
                  style={{
                    backgroundColor: 'var(--color-white)',
                    border: '1px solid #E5E7EB',
                    borderRadius: '14px',
                    padding: '1.5rem',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.04)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    position: 'relative',
                    transition: 'all 0.2s ease'
                  }}
                  className="marketplace-card"
                >
                  {/* Top Bar: Category badge & Lot ID */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                      <span style={{
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        padding: '0.25rem 0.65rem',
                        borderRadius: '6px',
                        backgroundColor: '#FFF8DB',
                        color: '#92400E',
                        border: '1px solid #FDE68A'
                      }}>
                        {lot.categoryName}
                      </span>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {lot.badge && (
                          <span style={{
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            padding: '0.2rem 0.5rem',
                            borderRadius: '4px',
                            backgroundColor: '#DCFCE7',
                            color: '#15803D'
                          }}>
                            {lot.badge}
                          </span>
                        )}
                        <span style={{ fontSize: '0.75rem', color: '#9CA3AF', fontFamily: 'monospace' }}>
                          {lot.id}
                        </span>
                      </div>
                    </div>

                    {/* Lot Title */}
                    <h3 style={{
                      fontSize: '1.15rem',
                      fontWeight: 700,
                      color: 'var(--color-graphite-dark)',
                      lineHeight: 1.35,
                      marginBottom: '0.65rem'
                    }}>
                      {lot.title}
                    </h3>

                    {/* Grade & Specs Tag */}
                    <div style={{
                      fontSize: '0.8rem',
                      color: '#4B5563',
                      backgroundColor: '#F9FAFB',
                      padding: '0.4rem 0.65rem',
                      borderRadius: '6px',
                      marginBottom: '1rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem'
                    }}>
                      <Layers size={14} style={{ color: '#6B7280', flexShrink: 0 }} />
                      <span style={{ fontWeight: 600 }}>Grade:</span>
                      <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                        {lot.grade}
                      </span>
                    </div>

                    {/* Description */}
                    <p style={{
                      fontSize: '0.85rem',
                      color: '#6B7280',
                      lineHeight: 1.5,
                      marginBottom: '1.25rem',
                      minHeight: '2.5rem'
                    }}>
                      {lot.description}
                    </p>

                    {/* Pricing & Quantity Box */}
                    <div style={{
                      backgroundColor: '#F8FAFC',
                      border: '1px solid #E2E8F0',
                      borderRadius: '10px',
                      padding: '1rem',
                      marginBottom: '1.25rem',
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '0.75rem'
                    }}>
                      <div>
                        <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>
                          Available Lot
                        </div>
                        <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-graphite-dark)' }}>
                          {lot.quantity} <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{lot.unit}</span>
                        </div>
                        <div style={{ fontSize: '0.7rem', color: '#94A3B8' }}>
                          MOQ: {lot.moq}
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>
                          Asking Rate
                        </div>
                        <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#16A34A' }}>
                          ₹{lot.pricePerUnit.toFixed(2)} <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>/{lot.priceUnit}</span>
                        </div>
                        <div style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 600 }}>
                          Est. Total: {lot.totalValue}
                        </div>
                      </div>
                    </div>

                    {/* Merchant & Location Info */}
                    <div style={{ fontSize: 'var(--text-xs)', color: '#6B7280', display: 'flex', flexDirection: 'column', gap: '0.35rem', marginBottom: '1.25rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#1F242D', fontWeight: 600 }}>
                        <Store size={14} style={{ color: 'var(--color-primary-yellow)' }} />
                        <span>{lot.merchant.name}</span>
                        {lot.merchant.verified && (
                          <ShieldCheck size={14} style={{ color: '#16A34A' }} title="Verified Merchant" />
                        )}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <MapPin size={13} style={{ color: '#9CA3AF' }} />
                        <span>{lot.location}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <Clock size={13} style={{ color: '#9CA3AF' }} />
                        <span>{lot.readiness} • Posted {lot.postedDate}</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Bottom CTA */}
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={() => handleOpenInquiry(lot)}
                      style={{
                        flex: 1,
                        backgroundColor: 'var(--color-primary-yellow)',
                        color: '#1F242D',
                        fontWeight: 700,
                        fontSize: '0.875rem',
                        padding: '0.65rem 1rem',
                        borderRadius: '8px',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.4rem',
                        transition: 'all 0.15s ease'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#E5B214'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--color-primary-yellow)'}
                    >
                      <span>Inquire Lot</span>
                      <ArrowRight size={15} />
                    </button>

                    <button
                      onClick={() => handleOpenInquiry(lot)}
                      style={{
                        backgroundColor: '#F3F4F6',
                        color: '#1F242D',
                        fontWeight: 600,
                        fontSize: '0.875rem',
                        padding: '0.65rem 0.9rem',
                        borderRadius: '8px',
                        border: '1px solid #E5E7EB',
                        cursor: 'pointer'
                      }}
                      title="Inspect Lot Specs"
                    >
                      Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{
              textAlign: 'center',
              padding: '4rem 1.5rem',
              backgroundColor: '#F9FAFB',
              borderRadius: '16px',
              border: '1px dashed #D1D5DB'
            }}>
              <AlertCircle size={40} style={{ color: '#9CA3AF', margin: '0 auto 1rem auto' }} />
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1F242D', marginBottom: '0.5rem' }}>
                No Scrap Lots Found Matching Your Filters
              </h3>
              <p style={{ color: '#6B7280', fontSize: '0.95rem', maxWidth: '480px', margin: '0 auto 1.5rem auto' }}>
                Try clearing your search query or switching categories to view all available verified scrap lots.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setSelectedCity('all');
                }}
                style={{
                  backgroundColor: 'var(--color-primary-yellow)',
                  color: '#1F242D',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  padding: '0.6rem 1.25rem',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* HOW MARKETPLACE WORKS */}
      <section className="section bg-offwhite" style={{ borderTop: '1px solid #E5E7EB', borderBottom: '1px solid #E5E7EB' }}>
        <div className="container">
          <SectionHeader
            eyebrow="Structured Trade Workflow"
            title="How Scrap Anna Marketplace Works"
            highlightWord="Marketplace Works"
            subtitle="A transparent, audit-ready trading cycle built specifically for verified scrap merchants, foundries, and industrial recyclers."
          />

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1.75rem'
          }}>
            {marketplaceWorkflowSteps.map((step, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E5E7EB',
                  borderRadius: '14px',
                  padding: '2rem 1.5rem',
                  position: 'relative'
                }}
              >
                <div style={{
                  fontSize: '2rem',
                  fontWeight: 900,
                  color: 'var(--color-primary-yellow)',
                  lineHeight: 1,
                  marginBottom: '1rem',
                  fontFamily: 'monospace'
                }}>
                  {step.step}
                </div>

                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--color-graphite-dark)', marginBottom: '0.65rem' }}>
                  {step.title}
                </h3>

                <p style={{ fontSize: 'var(--text-small)', color: '#6B7280', lineHeight: 1.6, margin: 0 }}>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TRUST & VERIFICATION ASSURANCE */}
      <section className="section bg-graphite-dark text-white">
        <div className="container">
          <SectionHeader
            eyebrow="Integrity Guaranteed"
            title="Why Trade on Scrap Anna Marketplace?"
            highlightWord="Trade on Scrap Anna"
            subtitle="We eliminate weight discrepancy, non-compliant transit, and unverified intermediaries with verified digital oversight."
            dark={true}
          />

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1.75rem'
          }}>
            {marketplaceTrustFeatures.map((feat, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '14px',
                  padding: '2rem 1.5rem'
                }}
              >
                <div style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(249, 197, 28, 0.15)',
                  border: '1px solid rgba(249, 197, 28, 0.3)',
                  color: 'var(--color-primary-yellow)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.25rem'
                }}>
                  <ShieldCheck size={24} />
                </div>

                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '0.65rem' }}>
                  {feat.title}
                </h3>

                <p style={{ fontSize: 'var(--text-small)', color: '#9CA3AF', lineHeight: 1.6, margin: 0 }}>
                  {feat.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CALL TO ACTION SECTION */}
      <section style={{ backgroundColor: 'var(--color-soft-yellow)', borderTop: '1px solid var(--color-soft-yellow-border)', padding: '5rem 0' }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: '820px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            fontSize: '0.85rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            color: '#92400E',
            letterSpacing: '0.05em',
            marginBottom: '1rem'
          }}>
            <Sparkles size={16} />
            <span>Join 350+ Verified Trade Partners</span>
          </div>

          <h2 style={{ fontSize: 'var(--text-h2)', fontWeight: 900, color: 'var(--color-graphite-dark)', lineHeight: 1.2, marginBottom: '1.25rem' }}>
            Ready to Buy or List Scrap on Scrap Anna?
          </h2>

          <p style={{ fontSize: 'var(--text-body-lg)', color: '#4B5563', lineHeight: 1.6, marginBottom: '2.5rem' }}>
            Whether you are a verified merchant looking to sell bulk inventory or a recycling mill sourcing industrial scrap, our platform provides guaranteed weight compliance, instant inquiries, and transparent settlements.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => setSellModalOpen(true)}
              style={{
                backgroundColor: 'var(--color-graphite-dark)',
                color: '#FFFFFF',
                fontWeight: 700,
                fontSize: '1rem',
                padding: '0.85rem 1.75rem',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
              }}
            >
              <Plus size={18} />
              <span>List Your Scrap Lot</span>
            </button>

            <button
              onClick={() => openJoinModal('merchant')}
              style={{
                backgroundColor: 'var(--color-primary-yellow)',
                color: '#1F242D',
                fontWeight: 700,
                fontSize: '1rem',
                padding: '0.85rem 1.75rem',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <span>Register as Verified Merchant</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* MODAL 1: SELL SCRAP (CREATE SCRAP LISTING) */}
      {/* ========================================================================= */}
      {sellModalOpen && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(17, 24, 39, 0.65)',
            backdropFilter: 'blur(4px)',
            zIndex: 2000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
            overflowY: 'auto'
          }}
          onClick={() => setSellModalOpen(false)}
        >
          <div 
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              maxWidth: '680px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '2.25rem',
              position: 'relative',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              animation: 'fadeIn 0.2s ease-out'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSellModalOpen(false)}
              style={{
                position: 'absolute',
                top: '1.25rem',
                right: '1.25rem',
                background: '#F3F4F6',
                border: 'none',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#6B7280'
              }}
              aria-label="Close modal"
            >
              <X size={18} />
            </button>

            {listingSuccess ? (
              <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  backgroundColor: '#DCFCE7',
                  color: '#16A34A',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.5rem auto'
                }}>
                  <CheckCircle2 size={36} />
                </div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1F242D', marginBottom: '0.75rem' }}>
                  Scrap Lot Submitted for Verification!
                </h3>
                <p style={{ color: '#6B7280', fontSize: '0.95rem', lineHeight: 1.6, maxWidth: '440px', margin: '0 auto' }}>
                  Our merchant operations desk in Chennai will verify your lot specs and publish it to the live marketplace within 2 hours.
                </p>
              </div>
            ) : (
              <div>
                <div style={{ marginBottom: '1.5rem' }}>
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    color: '#B45309',
                    backgroundColor: '#FFFBEB',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    padding: '0.25rem 0.6rem',
                    borderRadius: '4px',
                    textTransform: 'uppercase',
                    marginBottom: '0.5rem'
                  }}>
                    <Store size={13} />
                    <span>Merchant Lot Creation</span>
                  </div>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1F242D', margin: 0 }}>
                    List Your Scrap Material
                  </h3>
                  <p style={{ color: '#6B7280', fontSize: '0.875rem', marginTop: '0.35rem' }}>
                    Publish bulk scrap lots to thousands of verified recyclers, mills, and commercial buyers across Tamil Nadu.
                  </p>
                </div>

                <form onSubmit={handleCreateListingSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
                  {/* Category & Title */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#374151', marginBottom: '0.35rem' }}>
                        Material Type *
                      </label>
                      <select
                        value={newListingForm.category}
                        onChange={(e) => setNewListingForm({ ...newListingForm, category: e.target.value })}
                        required
                        style={{
                          width: '100%',
                          padding: '0.65rem 0.85rem',
                          borderRadius: '8px',
                          border: '1px solid #D1D5DB',
                          fontSize: '0.9rem',
                          backgroundColor: '#FFFFFF'
                        }}
                      >
                        <option value="iron">Iron</option>
                        <option value="steel">Steel</option>
                        <option value="aluminium">Aluminium</option>
                        <option value="copper">Copper</option>
                        <option value="brass">Brass</option>
                        <option value="paper">Paper</option>
                        <option value="plastic">Plastic</option>
                        <option value="e-waste">E-Waste</option>
                        <option value="other">Other Scrap</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#374151', marginBottom: '0.35rem' }}>
                        Lot Title / Material Name *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Clean Millberry Copper Wire / HMS 1/2"
                        value={newListingForm.title}
                        onChange={(e) => setNewListingForm({ ...newListingForm, title: e.target.value })}
                        required
                        style={{
                          width: '100%',
                          padding: '0.65rem 0.85rem',
                          borderRadius: '8px',
                          border: '1px solid #D1D5DB',
                          fontSize: '0.9rem'
                        }}
                      />
                    </div>
                  </div>

                  {/* Quantity & Unit & Asking Price */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1.2fr', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#374151', marginBottom: '0.35rem' }}>
                        Available Quantity *
                      </label>
                      <input
                        type="number"
                        placeholder="e.g. 15.5"
                        step="0.1"
                        value={newListingForm.quantity}
                        onChange={(e) => setNewListingForm({ ...newListingForm, quantity: e.target.value })}
                        required
                        style={{
                          width: '100%',
                          padding: '0.65rem 0.85rem',
                          borderRadius: '8px',
                          border: '1px solid #D1D5DB',
                          fontSize: '0.9rem'
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#374151', marginBottom: '0.35rem' }}>
                        Unit *
                      </label>
                      <select
                        value={newListingForm.unit}
                        onChange={(e) => setNewListingForm({ ...newListingForm, unit: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '0.65rem 0.85rem',
                          borderRadius: '8px',
                          border: '1px solid #D1D5DB',
                          fontSize: '0.9rem',
                          backgroundColor: '#FFFFFF'
                        }}
                      >
                        <option value="Metric Tons">Metric Tons</option>
                        <option value="kg">Kilograms (kg)</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#374151', marginBottom: '0.35rem' }}>
                        Asking Rate (₹/kg) *
                      </label>
                      <input
                        type="number"
                        placeholder="e.g. 42.50"
                        step="0.01"
                        value={newListingForm.pricePerUnit}
                        onChange={(e) => setNewListingForm({ ...newListingForm, pricePerUnit: e.target.value })}
                        required
                        style={{
                          width: '100%',
                          padding: '0.65rem 0.85rem',
                          borderRadius: '8px',
                          border: '1px solid #D1D5DB',
                          fontSize: '0.9rem'
                        }}
                      />
                    </div>
                  </div>

                  {/* Grade & Location */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#374151', marginBottom: '0.35rem' }}>
                        Quality Grade / Specs *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 99% Pure, Untinned, Cut Pieces"
                        value={newListingForm.grade}
                        onChange={(e) => setNewListingForm({ ...newListingForm, grade: e.target.value })}
                        required
                        style={{
                          width: '100%',
                          padding: '0.65rem 0.85rem',
                          borderRadius: '8px',
                          border: '1px solid #D1D5DB',
                          fontSize: '0.9rem'
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#374151', marginBottom: '0.35rem' }}>
                        Yard Location & City *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Guindy Industrial Estate, Chennai"
                        value={newListingForm.location}
                        onChange={(e) => setNewListingForm({ ...newListingForm, location: e.target.value })}
                        required
                        style={{
                          width: '100%',
                          padding: '0.65rem 0.85rem',
                          borderRadius: '8px',
                          border: '1px solid #D1D5DB',
                          fontSize: '0.9rem'
                        }}
                      />
                    </div>
                  </div>

                  {/* Merchant Details */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#374151', marginBottom: '0.35rem' }}>
                        Merchant / Company Name *
                      </label>
                      <input
                        type="text"
                        placeholder="Registered Business Name"
                        value={newListingForm.merchantName}
                        onChange={(e) => setNewListingForm({ ...newListingForm, merchantName: e.target.value })}
                        required
                        style={{
                          width: '100%',
                          padding: '0.65rem 0.85rem',
                          borderRadius: '8px',
                          border: '1px solid #D1D5DB',
                          fontSize: '0.9rem'
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#374151', marginBottom: '0.35rem' }}>
                        Contact Phone Number *
                      </label>
                      <input
                        type="tel"
                        placeholder="10-digit mobile number"
                        value={newListingForm.merchantPhone}
                        onChange={(e) => setNewListingForm({ ...newListingForm, merchantPhone: e.target.value })}
                        required
                        style={{
                          width: '100%',
                          padding: '0.65rem 0.85rem',
                          borderRadius: '8px',
                          border: '1px solid #D1D5DB',
                          fontSize: '0.9rem'
                        }}
                      />
                    </div>
                  </div>

                  {/* Photo Upload Area */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#374151', marginBottom: '0.35rem' }}>
                      Upload Lot Photos (Optional)
                    </label>
                    <div style={{
                      border: '2px dashed #D1D5DB',
                      borderRadius: '8px',
                      padding: '1.25rem',
                      textAlign: 'center',
                      backgroundColor: '#F9FAFB',
                      cursor: 'pointer'
                    }}>
                      <Upload size={22} style={{ color: '#9CA3AF', margin: '0 auto 0.4rem auto' }} />
                      <div style={{ fontSize: '0.85rem', color: '#4B5563', fontWeight: 500 }}>
                        Click to upload or drag scrap lot images here
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#9CA3AF', marginTop: '0.2rem' }}>
                        PNG, JPG, or WEBP up to 10MB
                      </div>
                    </div>
                  </div>

                  {/* Trust disclaimer */}
                  <div style={{
                    fontSize: '0.75rem',
                    color: '#6B7280',
                    backgroundColor: '#F3F4F6',
                    padding: '0.65rem 0.85rem',
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <ShieldCheck size={16} style={{ color: '#16A34A', flexShrink: 0 }} />
                    <span>Only GST-verified merchants are eligible to list lots on Scrap Anna Marketplace.</span>
                  </div>

                  <button
                    type="submit"
                    style={{
                      backgroundColor: 'var(--color-primary-yellow)',
                      color: '#1F242D',
                      fontWeight: 700,
                      fontSize: '0.95rem',
                      padding: '0.85rem',
                      borderRadius: '8px',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.4rem',
                      marginTop: '0.5rem'
                    }}
                  >
                    <span>Submit Scrap Listing</span>
                    <ArrowRight size={16} />
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: INQUIRE LOT (BUYER INQUIRY) */}
      {/* ========================================================================= */}
      {inquireModalOpen && selectedLotForInquiry && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(17, 24, 39, 0.65)',
            backdropFilter: 'blur(4px)',
            zIndex: 2000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem'
          }}
          onClick={() => setInquireModalOpen(false)}
        >
          <div 
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              maxWidth: '560px',
              width: '100%',
              padding: '2rem',
              position: 'relative',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              animation: 'fadeIn 0.2s ease-out'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setInquireModalOpen(false)}
              style={{
                position: 'absolute',
                top: '1.25rem',
                right: '1.25rem',
                background: '#F3F4F6',
                border: 'none',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#6B7280'
              }}
              aria-label="Close modal"
            >
              <X size={18} />
            </button>

            {inquirySuccess ? (
              <div style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  backgroundColor: '#DCFCE7',
                  color: '#16A34A',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.25rem auto'
                }}>
                  <CheckCircle2 size={32} />
                </div>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#1F242D', marginBottom: '0.5rem' }}>
                  Inquiry Sent Successfully!
                </h3>
                <p style={{ color: '#6B7280', fontSize: '0.9rem', lineHeight: 1.5 }}>
                  The merchant has received your trade request. Our marketplace coordinator will connect both parties with verified weighbridge and manifest details.
                </p>
              </div>
            ) : (
              <div>
                <div style={{ marginBottom: '1.25rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#B45309', textTransform: 'uppercase' }}>
                    Inquire Scrap Lot: {selectedLotForInquiry.id}
                  </span>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1F242D', margin: '0.25rem 0' }}>
                    {selectedLotForInquiry.title}
                  </h3>
                  <div style={{ fontSize: '0.85rem', color: '#6B7280' }}>
                    Listed by <strong style={{ color: '#1F242D' }}>{selectedLotForInquiry.merchant.name}</strong> • Asking: <span style={{ color: '#16A34A', fontWeight: 700 }}>₹{selectedLotForInquiry.pricePerUnit}/kg</span>
                  </div>
                </div>

                <form onSubmit={handleInquirySubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#374151', marginBottom: '0.35rem' }}>
                      Your Full Name / Company *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Rajesh Kumar (Foundry Recycler)"
                      required
                      style={{
                        width: '100%',
                        padding: '0.65rem 0.85rem',
                        borderRadius: '8px',
                        border: '1px solid #D1D5DB',
                        fontSize: '0.9rem'
                      }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#374151', marginBottom: '0.35rem' }}>
                        Mobile Phone *
                      </label>
                      <input
                        type="tel"
                        placeholder="10-digit number"
                        required
                        style={{
                          width: '100%',
                          padding: '0.65rem 0.85rem',
                          borderRadius: '8px',
                          border: '1px solid #D1D5DB',
                          fontSize: '0.9rem'
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#374151', marginBottom: '0.35rem' }}>
                        Required Quantity
                      </label>
                      <input
                        type="text"
                        placeholder={`e.g. Min ${selectedLotForInquiry.moq}`}
                        defaultValue={selectedLotForInquiry.quantity + ' ' + selectedLotForInquiry.unit}
                        style={{
                          width: '100%',
                          padding: '0.65rem 0.85rem',
                          borderRadius: '8px',
                          border: '1px solid #D1D5DB',
                          fontSize: '0.9rem'
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#374151', marginBottom: '0.35rem' }}>
                      Counter Offer or Trade Notes (Optional)
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Specify your target rate, physical lot inspection request, or delivery terms..."
                      style={{
                        width: '100%',
                        padding: '0.65rem 0.85rem',
                        borderRadius: '8px',
                        border: '1px solid #D1D5DB',
                        fontSize: '0.9rem',
                        resize: 'none'
                      }}
                    />
                  </div>

                  <button
                    type="submit"
                    style={{
                      backgroundColor: 'var(--color-primary-yellow)',
                      color: '#1F242D',
                      fontWeight: 700,
                      fontSize: '0.95rem',
                      padding: '0.8rem',
                      borderRadius: '8px',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.4rem',
                      marginTop: '0.25rem'
                    }}
                  >
                    <span>Send Official Trade Inquiry</span>
                    <ArrowRight size={16} />
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        .marketplace-card:hover {
          border-color: #D1D5DB !important;
          transform: translateY(-3px);
          box-shadow: 0 12px 24px -6px rgba(0, 0, 0, 0.08) !important;
        }
        @media (max-width: 640px) {
          .city-selector-wrapper {
            border-left: none !important;
            padding-left: 0 !important;
            width: 100%;
          }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.96); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </>
  );
}
