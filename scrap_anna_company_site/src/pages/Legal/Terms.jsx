import React from 'react';
import { FileText, ShieldCheck } from 'lucide-react';
import SEO from '../../components/common/SEO';
import PageHero from '../../components/common/PageHero';

export default function TermsPage() {
  return (
    <>
      <SEO
        title="Terms & Conditions - Scrap Anna"
        description="General terms of service governing usage of the Scrap Anna platform, scrap pickup requests, reference pricing, and digital transactions."
      />

      <PageHero
        eyebrow="Legal Agreement"
        badgeIcon={FileText}
        title="Terms & Conditions"
        description="Please read these Terms of Service carefully before utilizing the Scrap Anna platform, website, or coordination services."
        breadcrumbs={[{ label: 'Legal' }, { label: 'Terms & Conditions' }]}
      />

      <section className="section bg-white">
        <div className="container-narrow">
          <div style={{
            backgroundColor: 'var(--color-white)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--color-border)',
            padding: '2.5rem',
            boxShadow: 'var(--shadow-sm)',
            lineHeight: 1.8
          }}>
            <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-small)', marginBottom: '2rem' }}>
              <strong>Last Updated:</strong> August 25, 2026 | Effective Date: August 25, 2026
            </p>

            <h3 style={{ fontSize: '1.4rem', color: 'var(--color-graphite-dark)', marginTop: '1.5rem', marginBottom: '1rem' }}>
              1. Platform Nature & Scope
            </h3>
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1.25rem' }}>
              Scrap Anna is an intermediary technology platform that facilitates discovery, scheduling, and digital invoicing between scrap sellers (households, offices, factories) and independent third-party scrap merchants and aggregators. Scrap Anna is not a physical scrap dealer and does not take title to the scrap materials unless explicitly contracted under specialized enterprise mandates.
            </p>

            <h3 style={{ fontSize: '1.4rem', color: 'var(--color-graphite-dark)', marginTop: '2rem', marginBottom: '1rem' }}>
              2. User Obligations & Scrap Integrity
            </h3>
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1rem' }}>
              When posting scrap for collection, users agree to:
            </p>
            <ul style={{ paddingLeft: '1.5rem', color: 'var(--color-text-secondary)', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li>Provide accurate descriptions, scrap photographs, and accessible address coordinates.</li>
              <li>Ensure scrap materials do not contain hazardous chemical waste, unexploded pressure canisters, bio-medical waste, or stolen property.</li>
              <li>Allow safe access to merchant partners during the confirmed pickup window.</li>
              <li>Verify weights on the merchant's digital scale and share the completion OTP only after agreeing to the line-item bill.</li>
            </ul>

            <h3 style={{ fontSize: '1.4rem', color: 'var(--color-graphite-dark)', marginTop: '2rem', marginBottom: '1rem' }}>
              3. Reference Pricing & Variations
            </h3>
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1.25rem' }}>
              Prices published on the website are indicative reference market benchmarks. Final settled pricing is subject to mutual inspection of material quality, foreign contamination, actual measured weights, and location logistics.
            </p>

            <h3 style={{ fontSize: '1.4rem', color: 'var(--color-graphite-dark)', marginTop: '2rem', marginBottom: '1rem' }}>
              4. OTP Handshake & Transaction Finality
            </h3>
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1.25rem' }}>
              A doorstep scrap transaction is deemed irrevocably completed once the seller provides the 4-digit OTP to the merchant and confirms payment receipt. Any subsequent discrepancies must be reported to the Grievance Officer within 24 hours of transaction completion.
            </p>

            <h3 style={{ fontSize: '1.4rem', color: 'var(--color-graphite-dark)', marginTop: '2rem', marginBottom: '1rem' }}>
              5. Limitation of Liability
            </h3>
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1.25rem' }}>
              To the maximum extent permitted under applicable law, Scrap Anna shall not be liable for indirect, incidental, or consequential damages resulting from user interactions or delays caused by traffic, weather, or force majeure events.
            </p>

            <h3 style={{ fontSize: '1.4rem', color: 'var(--color-graphite-dark)', marginTop: '2rem', marginBottom: '1rem' }}>
              6. Governing Law & Jurisdiction
            </h3>
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1.25rem' }}>
              These Terms shall be governed by and construed in accordance with the laws of India. Any disputes arising hereunder shall be subject to the exclusive jurisdiction of the competent courts in Chennai, Tamil Nadu.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
