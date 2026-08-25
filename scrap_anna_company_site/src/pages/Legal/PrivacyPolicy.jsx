import React from 'react';
import { Shield, Lock, Eye, FileText, CheckCircle2 } from 'lucide-react';
import SEO from '../../components/common/SEO';
import PageHero from '../../components/common/PageHero';

export default function PrivacyPolicyPage() {
  return (
    <>
      <SEO
        title="Privacy Policy - Scrap Anna"
        description="Learn how Scrap Anna protects your personal information, doorstep location data, and transaction records."
      />

      <PageHero
        eyebrow="Data Protection & Privacy"
        badgeIcon={Shield}
        title="Privacy Policy"
        description="Your privacy and data security are core tenets of Scrap Anna. This policy details how we collect, handle, and safeguard your data."
        breadcrumbs={[{ label: 'Legal' }, { label: 'Privacy Policy' }]}
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

            <h3 style={{ fontSize: '1.4rem', color: 'var(--color-graphite-dark)', marginTop: '2rem', marginBottom: '1rem' }}>
              1. Introduction & Scope
            </h3>
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1.25rem' }}>
              Scrap Anna ("we", "us", or "our") operates the digital marketplace and marketing platform connecting scrap sellers (households, businesses, and industrial units) with verified independent scrap merchants and aggregators. This Privacy Policy governs the collection, processing, and protection of information obtained through our official website and coordination interfaces.
            </p>

            <h3 style={{ fontSize: '1.4rem', color: 'var(--color-graphite-dark)', marginTop: '2rem', marginBottom: '1rem' }}>
              2. Information We Collect
            </h3>
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1rem' }}>
              To facilitate authenticated scrap pickups and transparent transaction records, we collect the following categories of information:
            </p>
            <ul style={{ paddingLeft: '1.5rem', color: 'var(--color-text-secondary)', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li><strong>Contact Information:</strong> Full name, telephone number, and email address.</li>
              <li><strong>Location & Address Data:</strong> Street address, landmark, PIN code, and GPS coordinates provided for scheduling doorstep collections.</li>
              <li><strong>Scrap Lot Data:</strong> Material categories, estimated weight, photographs of scrap materials, and special handling instructions.</li>
              <li><strong>Business & Merchant KYC:</strong> Identity verification documents (Aadhaar, PAN), business registration, GSTIN, and trade license details for merchant partners.</li>
              <li><strong>Transaction Records:</strong> Digital bill line items, measured weights, timestamps, and OTP authorization records.</li>
            </ul>

            <h3 style={{ fontSize: '1.4rem', color: 'var(--color-graphite-dark)', marginTop: '2rem', marginBottom: '1rem' }}>
              3. Purpose of Processing
            </h3>
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1rem' }}>
              We use the collected information exclusively for lawful operational purposes, including:
            </p>
            <ul style={{ paddingLeft: '1.5rem', color: 'var(--color-text-secondary)', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li>Routing doorstep pickup requests to verified merchants within your geographical proximity.</li>
              <li>Generating digital e-receipts and transparent itemized invoices.</li>
              <li>Preventing fraudulent bookings and verifying user authentication via OTP handshakes.</li>
              <li>Providing dispute mediation and customer support services.</li>
              <li>Publishing aggregate recycling impact statistics without revealing personal identity.</li>
            </ul>

            <h3 style={{ fontSize: '1.4rem', color: 'var(--color-graphite-dark)', marginTop: '2rem', marginBottom: '1rem' }}>
              4. Data Sharing & Third Parties
            </h3>
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1.25rem' }}>
              We do <strong>not</strong> sell, rent, or trade your personal data to third-party marketing companies. Data is shared strictly on a need-to-know basis with:
            </p>
            <ul style={{ paddingLeft: '1.5rem', color: 'var(--color-text-secondary)', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li><strong>Assigned Verified Merchants:</strong> Contact name, pickup address, and scrap photos are shared only with the specific merchant assigned to fulfill your request.</li>
              <li><strong>Statutory Authorities:</strong> When required by Indian law, GST authorities, or court orders.</li>
            </ul>

            <h3 style={{ fontSize: '1.4rem', color: 'var(--color-graphite-dark)', marginTop: '2rem', marginBottom: '1rem' }}>
              5. Data Security & Retention
            </h3>
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1.25rem' }}>
              We implement industry-standard encryption, firewalls, and access control protocols to protect your personal information against unauthorized access, alteration, or disclosure. Transaction records are retained as required by Indian accounting and statutory standards.
            </p>

            <h3 style={{ fontSize: '1.4rem', color: 'var(--color-graphite-dark)', marginTop: '2rem', marginBottom: '1rem' }}>
              6. Your Rights
            </h3>
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1.25rem' }}>
              You may request review, correction, or deletion of your personal contact records by contacting our Privacy Officer at <strong>privacy@scrapanna.com</strong>.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
