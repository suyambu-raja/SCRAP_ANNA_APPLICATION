import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function CTASection({
  title,
  description = "Together, let's build a cleaner, efficient and sustainable future.",
  primaryText = "Join Scrap Anna",
  secondaryText = "Contact Us",
  onJoinClick,
  className = ""
}) {
  const renderTitle = () => {
    if (!title) {
      return (
        <>
          Be a part of India's<br />
          <span style={{ color: 'var(--color-primary-yellow)' }}>Smarter Scrap</span> Ecosystem.
        </>
      );
    }
    if (typeof title === 'string') {
      // If contains Smarter Scrap, highlight it
      if (title.includes("Smarter Scrap")) {
        const parts = title.split("Smarter Scrap");
        return (
          <>
            {parts[0]}
            <span style={{ color: 'var(--color-primary-yellow)' }}>Smarter Scrap</span>
            {parts[1]}
          </>
        );
      }
      return title;
    }
    return title;
  };

  return (
    <section 
      className={`section ${className}`} 
      style={{
        backgroundColor: 'var(--color-white)',
        paddingTop: '2.5rem',
        paddingBottom: '3.5rem',
        position: 'relative'
      }}
    >
      <div className="container">
        <div 
          style={{
            backgroundColor: '#20242D', /* True Graphite */
            borderRadius: '12px',
            padding: '2.25rem 2.75rem',
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '2rem',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
          }}
          className="cta-banner-card"
        >
          {/* Subtle Dot Pattern — Left Edge */}
          <div 
            style={{
              position: 'absolute',
              left: '12px',
              top: '12px',
              bottom: '12px',
              width: '64px',
              backgroundImage: 'radial-gradient(circle, rgba(255, 255, 255, 0.15) 1.5px, transparent 1.5px)',
              backgroundSize: '12px 12px',
              pointerEvents: 'none',
              opacity: 0.8
            }} 
          />

          {/* Subtle Dot Pattern — Right Edge */}
          <div 
            style={{
              position: 'absolute',
              right: '12px',
              top: '12px',
              bottom: '12px',
              width: '64px',
              backgroundImage: 'radial-gradient(circle, rgba(255, 255, 255, 0.15) 1.5px, transparent 1.5px)',
              backgroundSize: '12px 12px',
              pointerEvents: 'none',
              opacity: 0.8
            }} 
          />

          {/* Left Column: Heading + Description */}
          <div style={{ position: 'relative', zIndex: 2, maxWidth: '560px' }}>
            <h2 
              style={{
                color: '#FFFFFF',
                fontSize: 'clamp(1.5rem, 2.5vw, 1.85rem)',
                fontWeight: 800,
                lineHeight: 1.25,
                marginBottom: '0.6rem',
                letterSpacing: '-0.02em'
              }}
            >
              {renderTitle()}
            </h2>

            <p 
              style={{
                color: '#9CA3AF',
                fontSize: '0.9375rem',
                lineHeight: 1.55,
                margin: 0
              }}
            >
              {description}
            </p>
          </div>

          {/* Right Column: Buttons Row */}
          <div 
            style={{
              position: 'relative',
              zIndex: 2,
              display: 'flex',
              alignItems: 'center',
              gap: '0.85rem',
              flexShrink: 0,
              flexWrap: 'wrap'
            }}
            className="cta-btn-group"
          >
            <button
              onClick={onJoinClick ? onJoinClick : undefined}
              className="cta-primary-btn"
              style={{
                backgroundColor: 'var(--color-primary-yellow)',
                color: '#1F242D',
                fontWeight: 700,
                fontSize: '0.9375rem',
                padding: '0.8rem 1.6rem',
                borderRadius: '8px',
                border: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap',
                boxShadow: '0 2px 8px rgba(249, 197, 28, 0.2)'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#E5B214'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--color-primary-yellow)'}
            >
              <span>{primaryText}</span>
              <ArrowRight size={16} strokeWidth={2.5} className="cta-btn-arrow" />
            </button>

            <Link
              to="/contact"
              style={{
                backgroundColor: 'transparent',
                color: '#FFFFFF',
                fontWeight: 600,
                fontSize: '0.9375rem',
                padding: '0.78rem 1.6rem',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                textDecoration: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.25)';
              }}
            >
              {secondaryText}
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        .cta-primary-btn .cta-btn-arrow {
          transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .cta-primary-btn:hover .cta-btn-arrow {
          transform: translateX(4px);
        }
        @media (max-width: 860px) {
          .cta-banner-card {
            flex-direction: column !important;
            align-items: flex-start !important;
            padding: 2rem 1.5rem !important;
            gap: 1.5rem !important;
          }
          .cta-btn-group {
            width: 100% !important;
          }
          .cta-btn-group > * {
            flex: 1 1 auto;
            text-align: center;
            justifyContent: center;
          }
        }
      `}</style>
    </section>
  );
}
