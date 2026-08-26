import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Menu, X, ChevronRight, ChevronDown, ArrowRight,
  Home, Store, Factory, Network 
} from 'lucide-react';
import { navLinks } from '../../data/siteData';
import logoIcon from '../../assets/logo-icon.png';
import logoText from '../../assets/logo-text.png';

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
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          width: '100%',
          maxWidth: '100%',
          paddingLeft: 'clamp(1rem, 2vw, 2.5rem)',
          paddingRight: 'clamp(1rem, 2vw, 2.5rem)',
          position: 'relative'
        }}
      >
        {/* Brand Logo & Name */}
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
          <img 
            src={logoIcon} 
            alt="Scrap Anna Emblem" 
            style={{ 
              height: '46px', 
              width: 'auto', 
              objectFit: 'contain',
              display: 'block',
              flexShrink: 0
            }} 
          />
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <img 
              src={logoText} 
              alt="Scrap Anna" 
              style={{ 
                height: '21px', 
                width: 'auto', 
                objectFit: 'contain',
                display: 'block' 
              }} 
            />
            <div style={{
              fontSize: '0.58rem',
              fontWeight: 700,
              letterSpacing: '0.04em',
              color: '#6B7280',
              marginTop: '2px',
              whiteSpace: 'nowrap',
              textAlign: 'center',
              lineHeight: 1,
              width: '100%'
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

            {/* Dropdown Menu Box */}
            {usersDropdownOpen && (
              <div 
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  marginTop: '0.75rem',
                  backgroundColor: 'var(--color-white)',
                  borderRadius: '14px',
                  boxShadow: '0 12px 36px rgba(0, 0, 0, 0.12), 0 4px 12px rgba(0, 0, 0, 0.05)',
                  border: '1px solid #E5E7EB',
                  padding: '0.75rem',
                  width: '320px',
                  zIndex: 1050,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.35rem'
                }}
                className="nav-dropdown-menu"
              >
                {userDropdownLinks.map((item, idx) => {
                  const Icon = item.icon;
                  const itemActive = location.pathname === item.path;
                  return (
                    <Link
                      key={idx}
                      to={item.path}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '0.85rem',
                        padding: '0.65rem 0.75rem',
                        borderRadius: '10px',
                        textDecoration: 'none',
                        backgroundColor: itemActive ? '#FFFBEB' : 'transparent',
                        transition: 'background-color 0.15s ease'
                      }}
                      className="user-dropdown-item"
                    >
                      <div style={{
                        width: '34px',
                        height: '34px',
                        borderRadius: '8px',
                        backgroundColor: itemActive ? 'var(--color-primary-yellow)' : '#F3F4F6',
                        color: '#1F242D',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        marginTop: '2px'
                      }}>
                        <Icon size={18} strokeWidth={2} />
                      </div>
                      <div>
                        <div style={{
                          fontSize: '0.875rem',
                          fontWeight: 700,
                          color: itemActive ? '#1F242D' : '#1F242D',
                          lineHeight: 1.2
                        }}>
                          {item.title}
                        </div>
                        <div style={{
                          fontSize: '0.75rem',
                          color: '#6B7280',
                          marginTop: '2px',
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

          {/* 7. FAQ */}
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
            FAQ
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
            Contact
          </Link>
        </nav>

        {/* Right CTA Button & Mobile Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ display: 'none' }} className="desktop-cta-wrapper">
            <button
              onClick={() => onOpenJoinModal('household')}
              className="nav-get-started-btn"
            >
              <span>Get Started</span>
              <ArrowRight size={15} className="nav-btn-arrow" />
            </button>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="mobile-toggle-wrapper"
            style={{
              backgroundColor: '#F3F4F6',
              border: 'none',
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

              {/* Mobile Role Pages */}
              <div style={{ padding: '0.5rem 0.75rem 0.25rem 0.75rem', fontSize: '0.75rem', fontWeight: 800, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Solutions
              </div>

              {userDropdownLinks.map((subItem, sIdx) => {
                const isSubActive = location.pathname === subItem.path;
                const SubIcon = subItem.icon;
                return (
                  <Link
                    key={sIdx}
                    to={subItem.path}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.65rem',
                      padding: '0.65rem 0.75rem',
                      borderRadius: '8px',
                      backgroundColor: isSubActive ? '#FFFBEB' : 'transparent',
                      color: isSubActive ? '#1F242D' : '#4B5563',
                      fontWeight: isSubActive ? 700 : 500,
                      fontSize: '0.9375rem',
                      textDecoration: 'none'
                    }}
                  >
                    <SubIcon size={16} style={{ color: isSubActive ? 'var(--color-primary-yellow)' : '#6B7280' }} />
                    <span>{subItem.title}</span>
                  </Link>
                );
              })}

              <div style={{ borderTop: '1px solid #F3F4F6', margin: '0.5rem 0' }} />

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
                <span>FAQ</span>
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

            <div style={{ paddingTop: '0.5rem' }}>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenJoinModal('household');
                }}
                className="btn btn-primary"
                style={{
                  width: '100%',
                  padding: '0.85rem',
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  borderRadius: '8px',
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
          border-radius: 8px;
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
