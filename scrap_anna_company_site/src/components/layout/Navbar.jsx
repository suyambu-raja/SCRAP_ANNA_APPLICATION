import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Menu, X, ChevronRight, ChevronDown, ArrowRight,
  Home, Store, Factory, Network 
} from 'lucide-react';
import { navLinks } from '../../data/siteData';

// Custom 3-segment Scrap Anna Recycle Icon matching reference
function ScrapAnnaLogoMark({ size = 36 }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      style={{ flexShrink: 0 }}
    >
      {/* Top-Right Arrow (Yellow) */}
      <path 
        d="M36 20 L50 6 L64 20 H52 C52 27 55 33 60 37 L52 44 C45 38 41 29 41 20 H36 Z" 
        fill="#F9C51C" 
      />
      {/* Right-Bottom Arrow (Yellow) */}
      <path 
        d="M74 42 L88 56 L74 70 V58 C67 58 61 61 57 66 L50 58 C56 51 65 47 74 47 V42 Z" 
        fill="#F9C51C" 
      />
      {/* Bottom-Left Arrow (Dark Graphite) */}
      <path 
        d="M26 68 L12 54 L26 40 V50 C33 50 39 47 43 42 L50 50 C44 57 35 61 26 61 V68 Z" 
        fill="#20242D" 
      />
    </svg>
  );
}

// "For Users" Dropdown Items
const userDropdownLinks = [
  {
    title: "For Households",
    desc: "Doorstep scrap pickup at fair market rates",
    path: "/households",
    icon: Home
  },
  {
    title: "For Merchants",
    desc: "Get verified leads & grow your scrap route",
    path: "/merchants",
    icon: Store
  },
  {
    title: "For Industries",
    desc: "Commercial scrap disposal & GST billing",
    path: "/industries",
    icon: Factory
  },
  {
    title: "For Aggregators",
    desc: "Consolidate supply & connect with recyclers",
    path: "/aggregators",
    icon: Network
  }
];

export default function Navbar({ onOpenJoinModal }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [usersDropdownOpen, setUsersDropdownOpen] = useState(false);
  const location = useLocation();
  const usersTimerRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setUsersDropdownOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [mobileMenuOpen]);

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const isUserActive = ['/households', '/merchants', '/industries', '/aggregators'].some(p => location.pathname === p);

  const handleUsersEnter = () => {
    if (usersTimerRef.current) clearTimeout(usersTimerRef.current);
    setUsersDropdownOpen(true);
  };

  const handleUsersLeave = () => {
    usersTimerRef.current = setTimeout(() => {
      setUsersDropdownOpen(false);
    }, 120);
  };

  return (
    <header 
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        backgroundColor: 'var(--color-white)',
        borderBottom: '1px solid #F3F4F6',
        boxShadow: isScrolled ? '0 4px 20px rgba(0, 0, 0, 0.05)' : 'none',
        transition: 'all 0.2s ease',
        height: '74px',
        display: 'flex',
        alignItems: 'center'
      }}
    >
      <div 
        className="container"
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          width: '100%',
          position: 'relative'
        }}
      >
        {/* Brand Logo & Tagline */}
        <Link 
          to="/" 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.65rem',
            textDecoration: 'none',
            flexShrink: 0
          }}
          aria-label="Scrap Anna Home"
        >
          <ScrapAnnaLogoMark size={36} />

          <div>
            <div style={{
              fontSize: '1.25rem',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              lineHeight: 1,
              color: '#1F242D'
            }}>
              Scrap <span style={{ color: 'var(--color-primary-yellow)' }}>Anna</span>
            </div>
            <div style={{
              fontSize: '0.6rem',
              fontWeight: 600,
              letterSpacing: '0.04em',
              color: '#6B7280',
              marginTop: '3px'
            }}>
              Connect • Collect • Recycle
            </div>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav 
          style={{
            display: 'none',
            alignItems: 'center',
            gap: '1.75rem'
          }}
          className="desktop-nav"
        >
          {/* 1. Home */}
          <Link
            to="/"
            style={{
              fontSize: '0.9rem',
              fontWeight: isActive('/') ? 700 : 500,
              color: isActive('/') ? '#1F242D' : '#4B5563',
              textDecoration: 'none',
              padding: '0.35rem 0',
              whiteSpace: 'nowrap'
            }}
            className={`nav-item-link ${isActive('/') ? 'active' : ''}`}
          >
            Home
          </Link>

          {/* 2. About Us */}
          <Link
            to="/about"
            style={{
              fontSize: '0.9rem',
              fontWeight: isActive('/about') ? 700 : 500,
              color: isActive('/about') ? '#1F242D' : '#4B5563',
              textDecoration: 'none',
              padding: '0.35rem 0',
              whiteSpace: 'nowrap'
            }}
            className={`nav-item-link ${isActive('/about') ? 'active' : ''}`}
          >
            About Us
          </Link>

          {/* 3. How It Works */}
          <Link
            to="/how-it-works"
            style={{
              fontSize: '0.9rem',
              fontWeight: isActive('/how-it-works') ? 700 : 500,
              color: isActive('/how-it-works') ? '#1F242D' : '#4B5563',
              textDecoration: 'none',
              padding: '0.35rem 0',
              whiteSpace: 'nowrap'
            }}
            className={`nav-item-link ${isActive('/how-it-works') ? 'active' : ''}`}
          >
            How It Works
          </Link>

          {/* 4. For Users Dropdown */}
          <div 
            style={{ position: 'relative' }}
            onMouseEnter={handleUsersEnter}
            onMouseLeave={handleUsersLeave}
          >
            <button
              style={{
                fontSize: '0.9rem',
                fontWeight: isUserActive || usersDropdownOpen ? 700 : 500,
                color: isUserActive || usersDropdownOpen ? '#1F242D' : '#4B5563',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
                padding: '0.35rem 0',
                whiteSpace: 'nowrap'
              }}
              onClick={() => setUsersDropdownOpen(!usersDropdownOpen)}
              className={`nav-item-link ${isUserActive || usersDropdownOpen ? 'active' : ''}`}
            >
              <span>For Users</span>
              <ChevronDown 
                size={14} 
                style={{ 
                  transform: usersDropdownOpen ? 'rotate(180deg)' : 'rotate(0)', 
                  transition: 'transform 0.2s ease',
                  color: '#6B7280'
                }} 
              />
            </button>

            {usersDropdownOpen && (
              <div 
                className="nav-dropdown-menu"
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 8px)',
                  left: 0,
                  backgroundColor: 'var(--color-white)',
                  border: '1px solid #E5E7EB',
                  borderRadius: '12px',
                  boxShadow: '0 12px 28px -4px rgba(0, 0, 0, 0.1), 0 4px 8px -2px rgba(0, 0, 0, 0.04)',
                  padding: '0.5rem',
                  minWidth: '240px',
                  zIndex: 1100
                }}
              >
                {userDropdownLinks.map((item) => {
                  const Icon = item.icon;
                  const active = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '0.65rem 0.85rem',
                        borderRadius: '8px',
                        backgroundColor: active ? '#FFFBEB' : 'transparent',
                        textDecoration: 'none',
                        transition: 'all 0.15s ease'
                      }}
                      className="user-dropdown-item"
                    >
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '6px',
                        backgroundColor: '#FFF8DB',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#1F242D',
                        flexShrink: 0
                      }}>
                        <Icon size={16} />
                      </div>
                      <div>
                        <div style={{
                          fontSize: '0.875rem',
                          fontWeight: 600,
                          color: '#1F242D'
                        }}>
                          {item.title}
                        </div>
                        <div style={{
                          fontSize: '0.75rem',
                          color: '#6B7280',
                          lineHeight: 1.3
                        }}>
                          {item.desc}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* 5. Sell & Buy Scrap */}
          <Link
            to="/e-commerce"
            style={{
              fontSize: '0.9rem',
              fontWeight: isActive('/e-commerce') ? 700 : 500,
              color: isActive('/e-commerce') ? '#1F242D' : '#4B5563',
              textDecoration: 'none',
              padding: '0.35rem 0',
              whiteSpace: 'nowrap'
            }}
            className={`nav-item-link ${isActive('/e-commerce') ? 'active' : ''}`}
          >
            Sell & Buy Scrap
          </Link>

          {/* 6. Market Prices */}
          <Link
            to="/market-prices"
            style={{
              fontSize: '0.9rem',
              fontWeight: isActive('/market-prices') ? 700 : 500,
              color: isActive('/market-prices') ? '#1F242D' : '#4B5563',
              textDecoration: 'none',
              padding: '0.35rem 0',
              whiteSpace: 'nowrap'
            }}
            className={`nav-item-link ${isActive('/market-prices') ? 'active' : ''}`}
          >
            Market Prices
          </Link>

          {/* 7. FAQs */}
          <Link
            to="/faq"
            style={{
              fontSize: '0.9rem',
              fontWeight: isActive('/faq') ? 700 : 500,
              color: isActive('/faq') ? '#1F242D' : '#4B5563',
              textDecoration: 'none',
              padding: '0.35rem 0',
              whiteSpace: 'nowrap'
            }}
            className={`nav-item-link ${isActive('/faq') ? 'active' : ''}`}
          >
            FAQs
          </Link>

          {/* 8. Contact Us */}
          <Link
            to="/contact"
            style={{
              fontSize: '0.9rem',
              fontWeight: isActive('/contact') ? 700 : 500,
              color: isActive('/contact') ? '#1F242D' : '#4B5563',
              textDecoration: 'none',
              padding: '0.35rem 0',
              whiteSpace: 'nowrap'
            }}
            className={`nav-item-link ${isActive('/contact') ? 'active' : ''}`}
          >
            Contact Us
          </Link>
        </nav>

                {/* 8. Get Started Button on Desktop */}
        <div style={{ display: 'none', alignItems: 'center' }} className="desktop-cta-wrapper">
          <button
            onClick={() => onOpenJoinModal('household')}
            className="nav-get-started-btn"
          >
            <span>Get Started</span>
            <ArrowRight size={16} strokeWidth={2.2} className="nav-btn-arrow" />
          </button>
        </div>

        {/* Mobile Hamburger Toggle */}
        <div style={{ display: 'flex', alignItems: 'center' }} className="mobile-toggle-wrapper">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              backgroundColor: '#F3F4F6',
              border: '1px solid #E5E7EB',
              borderRadius: '8px',
              padding: '0.45rem',
              color: '#1F242D',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div 
          style={{
            position: 'fixed',
            top: '74px',
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(31, 36, 45, 0.5)',
            backdropFilter: 'blur(4px)',
            zIndex: 999
          }}
          onClick={() => setMobileMenuOpen(false)}
        >
          <div 
            style={{
              backgroundColor: 'var(--color-white)',
              width: '100%',
              maxHeight: 'calc(100vh - 74px)',
              overflowY: 'auto',
              padding: '1.25rem',
              borderBottom: '3px solid var(--color-primary-yellow)',
              boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
              animation: 'fadeIn 0.2s ease-out'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', marginBottom: '1.25rem' }}>
              <Link
                to="/"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.65rem 0.75rem',
                  borderRadius: '8px',
                  backgroundColor: isActive('/') ? '#FFFBEB' : 'transparent',
                  color: isActive('/') ? '#1F242D' : '#4B5563',
                  fontWeight: isActive('/') ? 700 : 500,
                  fontSize: '0.9375rem',
                  textDecoration: 'none'
                }}
              >
                <span>Home</span>
                <ChevronRight size={15} style={{ color: isActive('/') ? 'var(--color-primary-yellow)' : '#9CA3AF' }} />
              </Link>
              
              <Link
                to="/about"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.65rem 0.75rem',
                  borderRadius: '8px',
                  backgroundColor: isActive('/about') ? '#FFFBEB' : 'transparent',
                  color: isActive('/about') ? '#1F242D' : '#4B5563',
                  fontWeight: isActive('/about') ? 700 : 500,
                  fontSize: '0.9375rem',
                  textDecoration: 'none'
                }}
              >
                <span>About Us</span>
                <ChevronRight size={15} style={{ color: isActive('/about') ? 'var(--color-primary-yellow)' : '#9CA3AF' }} />
              </Link>

              <Link
                to="/how-it-works"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.65rem 0.75rem',
                  borderRadius: '8px',
                  backgroundColor: isActive('/how-it-works') ? '#FFFBEB' : 'transparent',
                  color: isActive('/how-it-works') ? '#1F242D' : '#4B5563',
                  fontWeight: isActive('/how-it-works') ? 700 : 500,
                  fontSize: '0.9375rem',
                  textDecoration: 'none'
                }}
              >
                <span>How It Works</span>
                <ChevronRight size={15} style={{ color: isActive('/how-it-works') ? 'var(--color-primary-yellow)' : '#9CA3AF' }} />
              </Link>

              {/* Mobile For Users Group */}
              <div style={{ marginTop: '0.5rem', marginBottom: '0.5rem', borderTop: '1px solid #F3F4F6', paddingTop: '0.5rem' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', padding: '0.25rem 0.75rem' }}>
                  For Users
                </div>
                {userDropdownLinks.map(link => (
                  <Link
                    key={link.path}
                    to={link.path}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.55rem 0.75rem',
                      borderRadius: '8px',
                      backgroundColor: isActive(link.path) ? '#FFFBEB' : 'transparent',
                      color: isActive(link.path) ? '#1F242D' : '#4B5563',
                      fontWeight: isActive(link.path) ? 700 : 500,
                      fontSize: '0.9rem',
                      textDecoration: 'none'
                    }}
                  >
                    <span>{link.title}</span>
                    <ChevronRight size={14} style={{ color: '#9CA3AF' }} />
                  </Link>
                ))}
              </div>

              <Link
                to="/e-commerce"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.65rem 0.75rem',
                  borderRadius: '8px',
                  backgroundColor: isActive('/e-commerce') ? '#FFFBEB' : 'transparent',
                  color: isActive('/e-commerce') ? '#1F242D' : '#4B5563',
                  fontWeight: isActive('/e-commerce') ? 700 : 500,
                  fontSize: '0.9375rem',
                  textDecoration: 'none'
                }}
              >
                <span>Sell & Buy Scrap</span>
                <ChevronRight size={15} style={{ color: isActive('/e-commerce') ? 'var(--color-primary-yellow)' : '#9CA3AF' }} />
              </Link>

              <Link
                to="/market-prices"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.65rem 0.75rem',
                  borderRadius: '8px',
                  backgroundColor: isActive('/market-prices') ? '#FFFBEB' : 'transparent',
                  color: isActive('/market-prices') ? '#1F242D' : '#4B5563',
                  fontWeight: isActive('/market-prices') ? 700 : 500,
                  fontSize: '0.9375rem',
                  textDecoration: 'none'
                }}
              >
                <span>Market Prices</span>
                <ChevronRight size={15} style={{ color: isActive('/market-prices') ? 'var(--color-primary-yellow)' : '#9CA3AF' }} />
              </Link>

              <Link
                to="/faq"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.65rem 0.75rem',
                  borderRadius: '8px',
                  backgroundColor: isActive('/faq') ? '#FFFBEB' : 'transparent',
                  color: isActive('/faq') ? '#1F242D' : '#4B5563',
                  fontWeight: isActive('/faq') ? 700 : 500,
                  fontSize: '0.9375rem',
                  textDecoration: 'none'
                }}
              >
                <span>FAQs</span>
                <ChevronRight size={15} style={{ color: isActive('/faq') ? 'var(--color-primary-yellow)' : '#9CA3AF' }} />
              </Link>

              <Link
                to="/contact"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.65rem 0.75rem',
                  borderRadius: '8px',
                  backgroundColor: isActive('/contact') ? '#FFFBEB' : 'transparent',
                  color: isActive('/contact') ? '#1F242D' : '#4B5563',
                  fontWeight: isActive('/contact') ? 700 : 500,
                  fontSize: '0.9375rem',
                  textDecoration: 'none'
                }}
              >
                <span>Contact Us</span>
                <ChevronRight size={15} style={{ color: isActive('/contact') ? 'var(--color-primary-yellow)' : '#9CA3AF' }} />
              </Link>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', borderTop: '1px solid #E5E7EB', paddingTop: '1rem' }}>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenJoinModal('household');
                }}
                style={{
                  backgroundColor: 'var(--color-primary-yellow)',
                  color: '#1F242D',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  padding: '0.85rem',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem'
                }}
              >
                <span>Get Started</span>
                <ArrowRight size={16} strokeWidth={2.2} />
              </button>
            </div>
          </div>
        </div>
      )}
      <style>{`
        /* Desktop Navigation Links — Smooth expanding underline */
        .nav-item-link {
          position: relative;
          transition: color 0.2s ease;
        }
        .nav-item-link::after {
          content: '';
          position: absolute;
          bottom: -4px;
          left: 0;
          width: 100%;
          height: 2.5px;
          background-color: var(--color-primary-yellow);
          border-radius: 2px;
          transform: scaleX(0);
          transform-origin: center;
          transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.25s ease;
          opacity: 0;
        }
        .nav-item-link:hover {
          color: #1F242D !important;
        }
        .nav-item-link:hover::after {
          transform: scaleX(0.45);
          opacity: 0.5;
        }
        .nav-item-link.active::after {
          transform: scaleX(1);
          opacity: 1;
        }

        /* Dropdown fade and slide down */
        .nav-dropdown-menu {
          animation: dropdownSlideDown 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes dropdownSlideDown {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .user-dropdown-item:hover {
          background-color: #F9FAFB !important;
        }

        /* Get Started Button Subtle Hover Effect */
        .nav-get-started-btn {
          background-color: var(--color-primary-yellow);
          color: #1F242D;
          font-weight: 700;
          font-size: 0.9rem;
          padding: 0.65rem 1.3rem;
          borderRadius: 8px;
          border: none;
          cursor: pointer;
          white-space: nowrap;
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          box-shadow: 0 2px 8px rgba(249, 197, 28, 0.22);
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .nav-get-started-btn:hover {
          background-color: #E5B214;
          transform: translateY(-1px);
          box-shadow: 0 4px 14px rgba(249, 197, 28, 0.35);
        }
        .nav-get-started-btn:active {
          transform: translateY(0);
        }
        .nav-get-started-btn .nav-btn-arrow {
          transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .nav-get-started-btn:hover .nav-btn-arrow {
          transform: translateX(3px);
        }

        @media (min-width: 1080px) {
          .desktop-nav {
            display: flex !important;
          }
          .desktop-cta-wrapper {
            display: flex !important;
          }
          .mobile-toggle-wrapper {
            display: none !important;
          }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </header>
  );
}
