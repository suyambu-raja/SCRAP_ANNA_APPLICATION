import React from 'react';
import { Factory, FileCheck, ShieldCheck } from 'lucide-react';
import SEO from '../../components/common/SEO';
import PageHero from '../../components/common/PageHero';

export default function IndustryTermsPage() {
  return (
    <>
      <SEO
        title="Industry Terms - Commercial Scrap Compliance & Gate Pass Norms"
        description="Terms governing industrial scrap procurement, lot posting, weighbridge verification, and GST invoicing on Scrap Anna."
      />

      <PageHero
        eyebrow="Enterprise Agreement"
        badgeIcon={Factory}
        title="Industry Commercial Terms"
        description="Statutory guidelines, weighbridge protocols, and environmental recycling compliance for factory and warehouse scrap partners."
        breadcrumbs={[{ label: 'Legal' }, { label: 'Industry Terms' }]}
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
              1. Commercial Lot Posting & Material Specifications
            </h3>
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1.25rem' }}>
              Industrial entities posting scrap lots agree to disclose accurate chemical classifications, physical dimensions, packaging formats, and gross tonnage estimates. Any radioactive or hazardous contaminants must be declared in compliance with Tamil Nadu Pollution Control Board (TNPCB) norms.
            </p>

            <h3 style={{ fontSize: '1.4rem', color: 'var(--color-graphite-dark)', marginTop: '2rem', marginBottom: '1rem' }}>
              2. Plant Gate-Pass & Safety Protocols
            </h3>
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1.25rem' }}>
              Commercial scrap buyers matched through the platform agree to adhere strictly to plant safety standards, personal protective equipment (PPE) requirements, designated vehicular speed limits, and loading bay protocols specified by the industrial facility.
            </p>

            <h3 style={{ fontSize: '1.4rem', color: 'var(--color-graphite-dark)', marginTop: '2rem', marginBottom: '1rem' }}>
              3. Weighbridge Verification & Tolerances
            </h3>
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1.25rem' }}>
              For bulk consignments exceeding 1 Metric Ton, certified gross and tare weighbridge receipts shall constitute the authoritative weight record. Standard moisture and foreign matter deductions shall follow agreed commercial purchase order terms.
            </p>

            <h3 style={{ fontSize: '1.4rem', color: 'var(--color-graphite-dark)', marginTop: '2rem', marginBottom: '1rem' }}>
              4. GST Invoicing & Statutory E-Way Bills
            </h3>
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1.25rem' }}>
              All industrial dispatches must be accompanied by valid tax invoices under applicable GST HSN codes (e.g. HSN 7204 for ferrous waste, HSN 7404 for copper scrap) and statutory E-Way bills generated prior to factory gate departure.
            </p>

            <h3 style={{ fontSize: '1.4rem', color: 'var(--color-graphite-dark)', marginTop: '2rem', marginBottom: '1rem' }}>
              5. Environmental Audit & Traceability Manifests
            </h3>
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1.25rem' }}>
              Recyclers procuring factory scrap undertake to process secondary raw materials through authorized recycling facilities and issue chain-of-custody certificates for annual environmental and CSR reporting.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
