import React from 'react';
import { Link } from 'react-router-dom';
import { Recycle, MapPin, Mail, Phone, ArrowUpRight } from 'lucide-react';
import { siteConfig } from '../../data/siteData';

export default function Footer({ onOpenJoinModal }) {
  return (
    <footer 
      style={{
        backgroundColor: 'var(--color-graphite-dark)',
        borderTop: '1px solid #374151',
        position: 'relative'
      }}
    >
      {/* Main footer content — graphite bg */}
      <div style={{ paddingTop: '3.5rem', paddingBottom: '2.5rem' }}>
        <div className="container">
          <div 
            style={{
              display: 'grid',
              gridTemplateColumns: '1.4fr 0.9fr 0.9fr 0.9fr 1.1fr',
              gap: '2rem'
            }}
            className="footer-grid"
          >
            {/* Column 1: Brand & Bio */}
            <div>
              <Link 
                to="/" 
                style={{ 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  textDecoration: 'none',
                  marginBottom: '1rem'
                }}
                aria-label="Scrap Anna Home"
              >
                <span style={{
                  fontSize: '1.4rem',
                  fontWeight: 800,
                  color: 'var(--color-white)',
                  letterSpacing: '-0.02em'
                }}>
                  Scrap <span style={{ color: 'var(--color-primary-yellow)' }}>Anna</span>
                </span>
              </Link>
              
              <p style={{ color: '#9CA3AF', fontSize: 'var(--text-small)', lineHeight: 1.6, marginBottom: '1rem' }}>
                {siteConfig.shortDesc}
              </p>

              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontSize: '0.75rem',
                fontWeight: 600,
                color: 'var(--color-primary-yellow)',
                textTransform: 'uppercase',
                letterSpacing: '0.03em'
              }}>
                Connect • Collect • Recycle
              </div>
            </div>

            {/* Column 2: Quick Links */}
            <div>
              <h4 style={{ color: 'var(--color-white)', fontSize: 'var(--text-small)', fontWeight: 700, marginBottom: '1.15rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Quick Links
              </h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', padding: 0 }}>
                <li><Link to="/" className="footer-link">Home</Link></li>
                <li><Link to="/about" className="footer-link">About Us</Link></li>
                <li><Link to="/how-it-works" className="footer-link">How It Works</Link></li>
                <li><Link to="/market-prices" className="footer-link">Market Reference Rates</Link></li>
                <li><Link to="/faq" className="footer-link">Frequently Asked Questions</Link></li>
                <li><Link to="/contact" className="footer-link">Contact & Support</Link></li>
              </ul>
            </div>

            {/* Column 3: Platform Solutions */}
            <div>
              <h4 style={{ color: 'var(--color-white)', fontSize: 'var(--text-small)', fontWeight: 700, marginBottom: '1.15rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Platform Solutions
              </h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', padding: 0 }}>
                <li><Link to="/households" className="footer-link">For Households</Link></li>
                <li><Link to="/merchants" className="footer-link">For Merchants</Link></li>
                <li><Link to="/industries" className="footer-link">For Industries</Link></li>
                <li><Link to="/aggregators" className="footer-link">For Aggregators</Link></li>
                <li><Link to="/e-commerce" className="footer-link" style={{ color: 'var(--color-primary-yellow)', fontWeight: 600 }}>Sell & Buy Scrap</Link></li>
                <li>
                  <button 
                    onClick={onOpenJoinModal} 
                    className="footer-link"
                    style={{
                      background: 'none',
                      border: 'none',
                      padding: 0,
                      fontSize: 'var(--text-small)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.2rem',
                      fontWeight: 600,
                      textAlign: 'left'
                    }}
                  >
                    <span>Join Platform</span>
                    <ArrowUpRight size={13} />
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 4: Legal & Policies */}
            <div>
              <h4 style={{ color: 'var(--color-white)', fontSize: 'var(--text-small)', fontWeight: 700, marginBottom: '1.15rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Legal & Trust
              </h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', padding: 0 }}>
                <li><Link to="/privacy-policy" className="footer-link">Privacy Policy</Link></li>
                <li><Link to="/terms" className="footer-link">Terms of Service</Link></li>
                <li><Link to="/merchant-terms" className="footer-link">Merchant Terms</Link></li>
                <li><Link to="/industry-terms" className="footer-link">Industry Terms</Link></li>
                <li><Link to="/grievance" className="footer-link">Grievance Redressal</Link></li>
              </ul>
            </div>

            {/* Column 5: Contact & Location */}
            <div>
              <h4 style={{ color: 'var(--color-white)', fontSize: 'var(--text-small)', fontWeight: 700, marginBottom: '1.15rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Contact Scrap Anna
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: 'var(--text-small)', color: '#9CA3AF' }}>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <MapPin size={16} style={{ color: 'var(--color-primary-yellow)', flexShrink: 0, marginTop: '2px' }} />
                  <span>{siteConfig.contact.address}</span>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <Mail size={16} style={{ color: 'var(--color-primary-yellow)', flexShrink: 0 }} />
                  <a href={`mailto:${siteConfig.contact.email}`} className="footer-link" style={{ color: '#9CA3AF' }}>
                    {siteConfig.contact.email}
                  </a>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <Phone size={16} style={{ color: 'var(--color-primary-yellow)', flexShrink: 0 }} />
                  <a href={`tel:${siteConfig.contact.phone.replace(/[\s-]/g, '')}`} className="footer-link" style={{ color: '#9CA3AF' }}>
                    {siteConfig.contact.phone}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom copyright bar — deeper graphite */}
      <div 
        style={{
          backgroundColor: '#181B22',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          color: '#9CA3AF',
          fontSize: 'var(--text-xs)',
          padding: '1rem 0'
        }}
      >
        <div className="container" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.75rem'
        }}>
          <div>
            © 2026 Scrap Anna. All Rights Reserved.
          </div>
          <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
            <Link to="/privacy-policy" className="footer-sublink" style={{ color: '#9CA3AF', textDecoration: 'none' }}>Privacy Policy</Link>
            <span>•</span>
            <Link to="/terms" className="footer-sublink" style={{ color: '#9CA3AF', textDecoration: 'none' }}>Terms of Service</Link>
          </div>
        </div>
      </div>

      <style>{`
        .footer-link {
          color: #9CA3AF;
          font-size: var(--text-small);
          text-decoration: none;
          transition: color var(--transition-fast);
        }
        .footer-link:hover {
          color: var(--color-primary-yellow);
        }
        .footer-sublink {
          transition: color var(--transition-fast);
        }
        .footer-sublink:hover {
          color: var(--color-primary-yellow);
        }
        @media (max-width: 1024px) {
          .footer-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 1.75rem !important;
          }
        }
        @media (max-width: 640px) {
          .footer-grid {
            grid-template-columns: 1fr !important;
            gap: 1.75rem !important;
          }
        }
      `}</style>
    </footer>
  );
}
