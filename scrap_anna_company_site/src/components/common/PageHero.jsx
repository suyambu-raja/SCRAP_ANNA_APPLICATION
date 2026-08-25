import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import Button from './Button';

export default function PageHero({
  eyebrow,
  title,
  highlightWord,
  description,
  breadcrumbs = [],
  primaryCta,
  secondaryCta,
  badgeIcon: BadgeIcon,
  children
}) {
  let renderedTitle = title;
  if (highlightWord && typeof title === 'string' && title.includes(highlightWord)) {
    const parts = title.split(highlightWord);
    renderedTitle = (
      <>
        {parts[0]}
        <span className="text-yellow-highlight">{highlightWord}</span>
        {parts.slice(1).join(highlightWord)}
      </>
    );
  }

  return (
    <section className="bg-graphite-dark text-white" style={{
      paddingTop: '4.5rem',
      paddingBottom: '4.5rem',
      position: 'relative',
      overflow: 'hidden',
      borderBottom: '3px solid var(--color-primary-yellow)'
    }}>
      {/* Background Graphic Grid */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        opacity: 0.05,
        backgroundImage: 'radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)',
        backgroundSize: '24px 24px',
        pointerEvents: 'none'
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        {/* Breadcrumbs */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav aria-label="Breadcrumb" style={{ marginBottom: '1.5rem' }}>
            <ol style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', listStyle: 'none', fontSize: 'var(--text-small)', color: '#9CA3AF' }}>
              <li>
                <Link to="/" style={{ color: '#D1D5DB', textDecoration: 'none' }}>Home</Link>
              </li>
              {breadcrumbs.map((crumb, idx) => (
                <React.Fragment key={idx}>
                  <li style={{ display: 'flex', alignItems: 'center' }}>
                    <ChevronRight size={14} style={{ color: '#6B7280' }} />
                  </li>
                  <li>
                    {crumb.path ? (
                      <Link to={crumb.path} style={{ color: '#D1D5DB', textDecoration: 'none' }}>{crumb.label}</Link>
                    ) : (
                      <span style={{ color: 'var(--color-primary-yellow)', fontWeight: 600 }}>{crumb.label}</span>
                    )}
                  </li>
                </React.Fragment>
              ))}
            </ol>
          </nav>
        )}

        <div style={{ maxWidth: '800px' }}>
          {eyebrow && (
            <div style={{ marginBottom: '1rem' }}>
              <span className="badge badge-dark" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                {BadgeIcon && <BadgeIcon size={14} />}
                {eyebrow}
              </span>
            </div>
          )}

          <h1 style={{ 
            color: 'var(--color-white)', 
            marginBottom: '1.25rem',
            lineHeight: 1.15
          }}>
            {renderedTitle}
          </h1>

          {description && (
            <p style={{ 
              color: '#D1D5DB', 
              fontSize: 'var(--text-body-lg)', 
              lineHeight: 1.7,
              marginBottom: (primaryCta || secondaryCta || children) ? '2rem' : 0 
            }}>
              {description}
            </p>
          )}

          {(primaryCta || secondaryCta) && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
              {primaryCta && (
                <Button
                  to={primaryCta.to}
                  onClick={primaryCta.onClick}
                  variant="primary"
                  size="lg"
                  icon={primaryCta.icon}
                >
                  {primaryCta.text}
                </Button>
              )}
              {secondaryCta && (
                <Button
                  to={secondaryCta.to}
                  onClick={secondaryCta.onClick}
                  variant="secondary-dark"
                  size="lg"
                  icon={secondaryCta.icon}
                >
                  {secondaryCta.text}
                </Button>
              )}
            </div>
          )}

          {children}
        </div>
      </div>
    </section>
  );
}
