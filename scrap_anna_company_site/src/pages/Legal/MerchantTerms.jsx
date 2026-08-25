import React from 'react';
import { Store, ShieldCheck, FileCheck } from 'lucide-react';
import SEO from '../../components/common/SEO';
import PageHero from '../../components/common/PageHero';

export default function MerchantTermsPage() {
  return (
    <>
      <SEO
        title="Merchant Partner Terms - Scrap Anna"
        description="Terms and conditions governing independent scrap merchants, collection standards, KYC, and lead acceptance on Scrap Anna."
      />

      <PageHero
        eyebrow="Merchant Agreement"
        badgeIcon={Store}
        title="Merchant Partner Terms"
        description="Operating guidelines, service level standards, and commission terms for verified merchant partners on Scrap Anna."
        breadcrumbs={[{ label: 'Legal' }, { label: 'Merchant Terms' }]}
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
              1. Merchant Eligibility & KYC
            </h3>
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1.25rem' }}>
              To operate as a verified Merchant on Scrap Anna, applicants must provide valid government identification (Aadhaar, PAN), proof of commercial presence or vehicle registration, and demonstrate compliance with local municipal trade regulations in Chennai/Tamil Nadu.
            </p>

            <h3 style={{ fontSize: '1.4rem', color: 'var(--color-graphite-dark)', marginTop: '2rem', marginBottom: '1rem' }}>
              2. Digital Scale Calibration Mandate
            </h3>
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1.25rem' }}>
              All merchants agree to utilize strictly certified, battery-operated digital weighing equipment (hanging or platform scales) during customer collections. The use of uncalibrated manual mechanical spring scales is strictly prohibited and constitutes grounds for immediate platform deactivation.
            </p>

            <h3 style={{ fontSize: '1.4rem', color: 'var(--color-graphite-dark)', marginTop: '2rem', marginBottom: '1rem' }}>
              3. Service Standards & Lead Acceptance
            </h3>
            <ul style={{ paddingLeft: '1.5rem', color: 'var(--color-text-secondary)', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li>Merchants must honor accepted pickup time slots and maintain professional, courteous conduct on customer premises.</li>
              <li>Merchants must not solicit customers outside the platform for leads acquired through Scrap Anna.</li>
              <li>Location check-in and OTP input must be performed in the physical presence of the customer.</li>
            </ul>

            <h3 style={{ fontSize: '1.4rem', color: 'var(--color-graphite-dark)', marginTop: '2rem', marginBottom: '1rem' }}>
              4. Platform Fees & Commission Structure
            </h3>
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1.25rem' }}>
              Platform convenience fees are charged per completed transaction as outlined during onboarding. Fee schedules are communicated with 15 days prior notice and automatically reconciled in your merchant wallet ledger.
            </p>

            <h3 style={{ fontSize: '1.4rem', color: 'var(--color-graphite-dark)', marginTop: '2rem', marginBottom: '1rem' }}>
              5. Dispute Redressal & Quality Audits
            </h3>
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1.25rem' }}>
              Customer ratings and transaction logs are reviewed continuously. In the event of confirmed customer weighing fraud or unpunctuality, Scrap Anna reserves the right to withhold platform access and initiate corrective reviews.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
