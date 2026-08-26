import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Home, ArrowLeft } from 'lucide-react';
import SEO from '../../components/common/SEO';
import Button from '../../components/common/Button';

export default function NotFoundPage() {
  return (
    <>
      <SEO
        title="Page Not Found (404) - Scrap Anna"
        description="The page you are looking for does not exist on Scrap Anna. Return to home or explore our scrap recycling solutions."
        noindex={true}
        canonical="https://scrapanna.com/404"
      />

      <section className="section bg-white" style={{ minHeight: '65vh', display: 'flex', alignItems: 'center' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div style={{
            maxWidth: '560px',
            margin: '0 auto',
            padding: '3rem 2rem',
            backgroundColor: 'var(--color-offwhite)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--color-border)',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: 'var(--color-primary-yellow-light)',
              border: '1px solid var(--color-soft-yellow-border)',
              color: '#92400E',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem'
            }}>
              <AlertTriangle size={32} />
            </div>

            <h1 style={{
              fontSize: '4rem',
              fontWeight: 800,
              color: 'var(--color-graphite-dark)',
              lineHeight: 1,
              marginBottom: '0.5rem'
            }}>
              404
            </h1>

            <h2 style={{ fontSize: '1.5rem', color: 'var(--color-graphite-dark)', marginBottom: '1rem' }}>
              Page Not Found
            </h2>

            <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-body)', marginBottom: '2rem', lineHeight: 1.6 }}>
              The page you are looking for might have been moved, renamed, or is temporarily unavailable. Let's get you back on track!
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <Button to="/" variant="primary" size="md" icon={Home}>
                Return to Homepage
              </Button>
              <Button to="/contact" variant="secondary" size="md">
                Contact Support
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
