import React from 'react';
import { ShieldAlert, Mail, Phone, MapPin, Clock, CheckCircle2 } from 'lucide-react';
import SEO from '../../components/common/SEO';
import PageHero from '../../components/common/PageHero';
import { siteConfig } from '../../data/siteData';

export default function GrievancePage() {
  return (
    <>
      <SEO
        title="Grievance Redressal Policy - Scrap Anna"
        description="Grievance redressal mechanism and contact details for the designated Grievance Officer at Scrap Anna."
      />

      <PageHero
        eyebrow="Trust & Dispute Redressal"
        badgeIcon={ShieldAlert}
        title="Grievance Redressal Policy"
        description="Scrap Anna is committed to providing a transparent, fair, and prompt dispute resolution mechanism for all users, merchants, and enterprise partners."
        breadcrumbs={[{ label: 'Legal' }, { label: 'Grievance Policy' }]}
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
              <strong>Published Under:</strong> Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021
            </p>

            <h3 style={{ fontSize: '1.4rem', color: 'var(--color-graphite-dark)', marginTop: '1.5rem', marginBottom: '1rem' }}>
              1. Grievance Redressal Mechanism
            </h3>
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1.25rem' }}>
              If you experience any issue regarding doorstep pickup punctuality, weighing discrepancies, merchant conduct, digital invoice errors, or unauthorized data processing, you can file a formal grievance with our dedicated nodal officer.
            </p>

            {/* Officer Contact Box */}
            <div style={{
              backgroundColor: 'var(--color-offwhite)',
              border: '2px solid var(--color-primary-yellow)',
              borderRadius: 'var(--radius-md)',
              padding: '2rem',
              margin: '2rem 0'
            }}>
              <h4 style={{ fontSize: '1.2rem', color: 'var(--color-graphite-dark)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShieldAlert size={22} style={{ color: '#D97706' }} />
                <span>Designated Grievance & Nodal Officer</span>
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: 'var(--text-small)', color: 'var(--color-text-secondary)' }}>
                <div><strong>Officer Name:</strong> Grievance Redressal Officer, Scrap Anna</div>
                <div><strong>Email:</strong> <a href="mailto:grievance@scrapanna.com" style={{ color: 'var(--color-graphite-dark)', fontWeight: 600 }}>grievance@scrapanna.com</a></div>
                <div><strong>Desk Telephone:</strong> {siteConfig.contact.phone}</div>
                <div><strong>Postal Address:</strong> Scrap Anna Grievance Desk, {siteConfig.contact.address}</div>
                <div><strong>Working Hours:</strong> Monday through Saturday: 9:30 AM – 6:00 PM IST</div>
              </div>
            </div>

            <h3 style={{ fontSize: '1.4rem', color: 'var(--color-graphite-dark)', marginTop: '2rem', marginBottom: '1rem' }}>
              2. Resolution Timelines
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <CheckCircle2 size={18} style={{ color: '#16A34A', flexShrink: 0, marginTop: '3px' }} />
                <div>
                  <strong>Acknowledgment:</strong> Every formal ticket receives an automated tracking acknowledgment within <strong>24 hours</strong>.
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <CheckCircle2 size={18} style={{ color: '#16A34A', flexShrink: 0, marginTop: '3px' }} />
                <div>
                  <strong>Investigation & Redressal:</strong> Grievances are thoroughly audited against GPS timestamps, weighing logs, and photographic manifests, with a final resolution provided within <strong>15 business days</strong>.
                </div>
              </div>
            </div>

            <h3 style={{ fontSize: '1.4rem', color: 'var(--color-graphite-dark)', marginTop: '2rem', marginBottom: '1rem' }}>
              3. Filing Guidelines
            </h3>
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1rem' }}>
              To expedite your resolution, please include:
            </p>
            <ul style={{ paddingLeft: '1.5rem', color: 'var(--color-text-secondary)', margin: 0, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <li>Your registered phone number and name.</li>
              <li>The Digital Receipt ID or Pickup Booking ID (e.g. SA-2026-XXXXX).</li>
              <li>A brief description of the issue along with scale photos or invoice screenshots if applicable.</li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
