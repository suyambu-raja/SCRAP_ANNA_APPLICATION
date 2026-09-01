import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Store,
  CheckCircle2,
  MapPin,
  Edit,
  Star,
  Calendar,
  ShoppingBag,
  Truck,
  ExternalLink,
  FileText,
  CreditCard,
  Lock,
  Phone,
  Mail,
  ArrowRight,
  Circle,
  Receipt,
  HelpCircle,
  Settings,
  ShieldCheck,
  Plus,
  LogOut,
} from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { RequestAdditionalRoleModal } from '@/components/common';
import styles from './MerchantProfile.module.css';

export default function MerchantProfile() {
  const [activeTab, setActiveTab] = useState<'overview' | 'documents' | 'business' | 'bank' | 'preferences'>('overview');
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const logout = useAuthStore((s) => s.logout);

  const scrapTypes = [
    'Iron',
    'Copper',
    'Aluminium',
    'Brass',
    'Steel',
    'Plastic',
    'E-Waste',
    'Paper',
    'Cardboard',
  ];

  return (
    <div className={styles.pageContainer}>
      {/* Page Header */}
      <div className={styles.headerRow}>
        <h1 className={styles.pageTitle}>Merchant Profile</h1>
        <p className={styles.pageSubtitle}>
          Manage your business profile, documents, bank details, and transactions ledger.
        </p>
      </div>

      {/* Navigation Tabs Bar */}
      <div className={styles.tabsBar}>
        <button
          type="button"
          className={`${styles.tabItem} ${activeTab === 'overview' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          type="button"
          className={`${styles.tabItem} ${activeTab === 'documents' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('documents')}
        >
          Documents
        </button>
        <button
          type="button"
          className={`${styles.tabItem} ${activeTab === 'business' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('business')}
        >
          Business Details
        </button>
        <button
          type="button"
          className={`${styles.tabItem} ${activeTab === 'bank' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('bank')}
        >
          Bank &amp; Payments
        </button>
        <Link
          to="/transactions"
          className={styles.tabItem}
        >
          Transactions Ledger
        </Link>
        <button
          type="button"
          className={`${styles.tabItem} ${activeTab === 'preferences' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('preferences')}
        >
          Preferences
        </button>
      </div>

      {/* Two-Column Layout (Main 70% + Right Sidebar 30%) */}
      <div className={styles.profileLayoutGrid}>
        {/* ================================================================
            MAIN COLUMN
           ================================================================ */}
        <section className={styles.mainCol}>
          {/* Card 1: Profile Summary Card */}
          <article className={styles.profileSummaryCard}>
            <div className={styles.profileTopRow}>
              <div className={styles.profileIdentityGroup}>
                {/* Shop Avatar / Illustration */}
                <div className={styles.shopAvatarBox}>
                  <img
                    src="/logo.png"
                    alt="Ramesh Traders Shop"
                    className={styles.shopAvatarImg}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/logo-icon.png';
                    }}
                  />
                </div>

                <div className={styles.shopTextCol}>
                  <div className={styles.shopNameBadgeRow}>
                    <h2 className={styles.shopName}>Ramesh Traders</h2>
                    <span className={styles.verifiedMerchantBadge}>
                      <CheckCircle2 size={13} />
                      <span>Verified Merchant</span>
                    </span>
                  </div>
                  <span className={styles.shopSubtitle}>Scrap Merchant</span>
                  <div className={styles.shopLocation}>
                    <MapPin size={13} color="#2563eb" />
                    <span>Guindy Industrial Estate, Chennai, Tamil Nadu</span>
                  </div>
                </div>
              </div>

              <button type="button" className={styles.editProfileBtn}>
                <Edit size={14} />
                <span>Edit Profile</span>
              </button>
            </div>

            {/* 4 Metric Items Strip */}
            <div className={styles.metricsStrip}>
              <div className={styles.metricItem}>
                <div className={styles.metricIconCircle}>
                  <Star size={18} color="#f59e0b" fill="#f59e0b" />
                </div>
                <div className={styles.metricTextCol}>
                  <span className={styles.metricLabel}>Rating</span>
                  <span className={styles.metricValue}>4.8/5</span>
                  <span className={styles.metricSubtext}>(126 reviews)</span>
                </div>
              </div>

              <div className={styles.metricItem}>
                <div className={styles.metricIconCircle}>
                  <Calendar size={18} color="#2563eb" />
                </div>
                <div className={styles.metricTextCol}>
                  <span className={styles.metricLabel}>Member Since</span>
                  <span className={styles.metricValue}>12 May 2023</span>
                </div>
              </div>

              <div className={styles.metricItem}>
                <div className={styles.metricIconCircle}>
                  <ShoppingBag size={18} color="#9333ea" />
                </div>
                <div className={styles.metricTextCol}>
                  <span className={styles.metricLabel}>Total Orders</span>
                  <span className={styles.metricValue}>358</span>
                </div>
              </div>

              <div className={styles.metricItem}>
                <div className={styles.metricIconCircle}>
                  <Truck size={18} color="#16a34a" />
                </div>
                <div className={styles.metricTextCol}>
                  <span className={styles.metricLabel}>Successful Pickups</span>
                  <span className={styles.metricValue}>312</span>
                </div>
              </div>
            </div>
          </article>

          {/* Card 2: Business Information Card */}
          <article className={styles.contentCard}>
            <h3 className={styles.cardSectionTitle}>Business Information</h3>

            <div className={styles.businessInfoGrid}>
              {/* Column 1 */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className={styles.infoField}>
                  <span className={styles.infoLabel}>Owner Name</span>
                  <span className={styles.infoValue}>Ramesh Kumar</span>
                </div>
                <div className={styles.infoField}>
                  <span className={styles.infoLabel}>Shop Name</span>
                  <span className={styles.infoValue}>Ramesh Traders</span>
                </div>
                <div className={styles.infoField}>
                  <span className={styles.infoLabel}>Business Type</span>
                  <span className={styles.infoValue}>Scrap Merchant</span>
                </div>
                <div className={styles.infoField}>
                  <span className={styles.infoLabel}>Years in Business</span>
                  <span className={styles.infoValue}>5 Years</span>
                </div>
              </div>

              {/* Column 2 */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className={styles.infoField}>
                  <span className={styles.infoLabel}>Mobile Number</span>
                  <div className={styles.infoValue}>
                    <span>+91 98765 43210</span>
                    <span className={styles.verifiedPillSmall}>Verified</span>
                  </div>
                </div>
                <div className={styles.infoField}>
                  <span className={styles.infoLabel}>Email</span>
                  <div className={styles.infoValue}>
                    <span>rameshtraders@gmail.com</span>
                    <span className={styles.verifiedPillSmall}>Verified</span>
                  </div>
                </div>
                <div className={styles.infoField}>
                  <span className={styles.infoLabel}>GSTIN</span>
                  <span className={styles.infoValue}>33ABCDE1234F1Z5</span>
                </div>
                <div className={styles.infoField}>
                  <span className={styles.infoLabel}>Trade License</span>
                  <span className={styles.infoValue}>TN-CHN-2023-58741</span>
                </div>
              </div>

              {/* Column 3: Business Address & Location */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div className={styles.infoField}>
                  <span className={styles.infoLabel}>Business Address</span>
                  <p className={styles.addressBlock}>
                    No. 24, 5th Main Road, SIDCO Industrial Estate, Guindy, Chennai – 600032, Tamil Nadu, India
                  </p>
                </div>
                <div className={styles.infoField}>
                  <span className={styles.infoLabel}>Location</span>
                  <div className={styles.infoValue}>
                    <MapPin size={13} color="#2563eb" />
                    <span>13.0078° N, 80.2264° E</span>
                  </div>
                  <a href="#map" className={styles.mapLink} onClick={(e) => e.preventDefault()}>
                    <span>View on Map</span>
                    <ExternalLink size={12} />
                  </a>
                </div>
              </div>
            </div>
          </article>

          {/* Card 3: Service & Vehicles Card */}
          <article className={styles.contentCard}>
            <h3 className={styles.cardSectionTitle}>Service &amp; Vehicles</h3>

            <div className={styles.serviceVehiclesGrid}>
              {/* Left Column: Direct connect, areas, scrap types */}
              <div className={styles.serviceCol}>
                <div className={styles.infoField}>
                  <span className={styles.infoLabel}>Direct connect with industry</span>
                  <span className={styles.infoValue}>Yes</span>
                </div>

                <div className={styles.infoField}>
                  <span className={styles.infoLabel}>Service Areas</span>
                  <span className={styles.infoValue}>
                    Guindy, Saidapet, Velachery, Tambaram, Chromepet
                  </span>
                </div>

                <div className={styles.infoField}>
                  <span className={styles.infoLabel}>Types of Scrap Handled</span>
                  <div className={styles.scrapTagsList}>
                    {scrapTypes.map((type) => (
                      <span key={type} className={styles.scrapTag}>
                        {type}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Vehicles */}
              <div className={styles.serviceCol}>
                <div className={styles.infoField}>
                  <span className={styles.infoLabel}>Vehicle Available</span>
                  <span className={styles.infoValue}>Yes</span>
                </div>

                <div className={styles.infoField}>
                  <span className={styles.infoLabel}>Total Vehicles</span>
                  <span className={styles.infoValue}>3</span>
                </div>

                <div className={styles.infoField}>
                  <span className={styles.infoLabel}>Vehicles</span>
                  <table className={styles.vehiclesTable}>
                    <tbody>
                      <tr>
                        <td>
                          <div className={styles.vehicleIconName}>
                            <span>🛺</span>
                            <span>Auto</span>
                          </div>
                        </td>
                        <td>1</td>
                        <td>500 kg</td>
                      </tr>
                      <tr>
                        <td>
                          <div className={styles.vehicleIconName}>
                            <span>🚐</span>
                            <span>Van</span>
                          </div>
                        </td>
                        <td>1</td>
                        <td>1 Ton</td>
                      </tr>
                      <tr>
                        <td>
                          <div className={styles.vehicleIconName}>
                            <span>🚚</span>
                            <span>Truck</span>
                          </div>
                        </td>
                        <td>1</td>
                        <td>3 Ton</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </article>

          {/* Card 4: Direct Transactions & Settlement Access */}
          <article className={styles.contentCard}>
            <div className={styles.transactionsCardHeader}>
              <div>
                <h3 className={styles.cardSectionTitle}>Transactions &amp; Settlement Ledger</h3>
                <p className={styles.transactionsSubtext}>
                  Access your full digital payouts history, bank settlements, and GST tax invoice slips.
                </p>
              </div>
              <Link to="/transactions" className={styles.viewTransactionsBtn}>
                <CreditCard size={15} />
                <span>View Full Ledger →</span>
              </Link>
            </div>
          </article>
        </section>

        {/* ================================================================
            RIGHT SIDEBAR
           ================================================================ */}
        <aside className={styles.sidebarCol}>
          {/* Card 1: Profile Completion */}
          <div className={styles.sidebarCard}>
            <div className={styles.completionHeader}>
              <div className={styles.progressRingBox}>
                <svg viewBox="0 0 60 60" width="100%" height="100%">
                  <circle cx="30" cy="30" r="24" fill="none" stroke="#e2e8f0" strokeWidth="5" />
                  <circle
                    cx="30"
                    cy="30"
                    r="24"
                    fill="none"
                    stroke="#16a34a"
                    strokeWidth="5"
                    strokeDasharray="150.8"
                    strokeDashoffset="22.6"
                    strokeLinecap="round"
                    transform="rotate(-90 30 30)"
                  />
                </svg>
                <div className={styles.progressRingText}>
                  85%
                  <span className={styles.progressRingSub}>Complete</span>
                </div>
              </div>

              <p className={styles.completionText}>
                Great job! Your profile is almost complete.
              </p>
            </div>

            <div className={styles.checklist}>
              <div className={styles.checkItem}>
                <CheckCircle2 size={15} className={styles.checkIconGreen} />
                <span>Business Details</span>
              </div>
              <div className={styles.checkItem}>
                <CheckCircle2 size={15} className={styles.checkIconGreen} />
                <span>Documents</span>
              </div>
              <div className={styles.checkItem}>
                <CheckCircle2 size={15} className={styles.checkIconGreen} />
                <span>Bank Details</span>
              </div>
              <div className={styles.checkItem}>
                <CheckCircle2 size={15} className={styles.checkIconGreen} />
                <span>Service Areas</span>
              </div>
              <div className={styles.checkItem}>
                <CheckCircle2 size={15} className={styles.checkIconGreen} />
                <span>Profile Photo</span>
              </div>
              <div className={styles.checkItem}>
                <Circle size={15} className={styles.checkIconGray} />
                <span style={{ color: '#64748b' }}>Shop Photos</span>
              </div>
            </div>
          </div>

          {/* Card 2: Business Photo */}
          <div className={styles.sidebarCard}>
            <h3 className={styles.sidebarCardTitle}>Business Photo</h3>
            <div className={styles.shopPhotoWrapper}>
              <img
                src="/industrial-facility.jpg"
                alt="Ramesh Traders Storefront"
                className={styles.shopPhotoImg}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/logo.png';
                }}
              />
              <button
                type="button"
                className={styles.editPhotoOverlayBtn}
                title="Edit Photo"
                aria-label="Edit Photo"
              >
                <Edit size={13} />
              </button>
            </div>
            <a href="#photos" className={styles.viewPhotosLink} onClick={(e) => e.preventDefault()}>
              <span>View All Photos (6)</span>
              <ArrowRight size={13} />
            </a>
          </div>

          {/* Card 3: Quick Actions */}
          <div className={styles.sidebarCard}>
            <h3 className={styles.sidebarCardTitle}>Quick Actions</h3>
            <div className={styles.quickActionsList}>
              <Link to="/transactions" className={styles.quickActionItem}>
                <Receipt size={15} color="#16a34a" />
                <span>Transactions &amp; Settlement Ledger</span>
              </Link>
              <a href="#edit" className={styles.quickActionItem} onClick={(e) => e.preventDefault()}>
                <Edit size={15} color="#d97706" />
                <span>Edit Profile</span>
              </a>
              <a href="#docs" className={styles.quickActionItem} onClick={(e) => e.preventDefault()}>
                <FileText size={15} color="#2563eb" />
                <span>Update Documents</span>
              </a>
              <a href="#bank" className={styles.quickActionItem} onClick={(e) => e.preventDefault()}>
                <CreditCard size={15} color="#16a34a" />
                <span>Bank Details &amp; Payouts</span>
              </a>
              <a href="#vehicles" className={styles.quickActionItem} onClick={(e) => e.preventDefault()}>
                <Truck size={15} color="#9333ea" />
                <span>Manage Vehicles</span>
              </a>
              <a href="#password" className={styles.quickActionItem} onClick={(e) => e.preventDefault()}>
                <Lock size={15} color="#ea580c" />
                <span>Change Password</span>
              </a>
            </div>
          </div>

          {/* Card: Account Role & Multi-Profile */}
          <div className={styles.sidebarCard}>
            <h3 className={styles.sidebarCardTitle}>Account Role & Verification</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.65rem 0.85rem', background: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 750, color: '#0F172A' }}>Merchant Profile</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', background: '#DCFCE7', color: '#15803D', padding: '0.2rem 0.5rem', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 750 }}>
                  <ShieldCheck size={12} /> VERIFIED
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsRoleModalOpen(true)}
                style={{
                  background: '#0F172A',
                  color: '#FBC21A',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '0.6rem 0.85rem',
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem',
                }}
              >
                <span>Request Additional Role</span>
                <Plus size={14} />
              </button>
              <button
                type="button"
                onClick={logout}
                style={{
                  background: '#FEE2E2',
                  border: '1px solid #FECACA',
                  color: '#DC2626',
                  borderRadius: '8px',
                  padding: '0.5rem 0.85rem',
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem',
                }}
              >
                <LogOut size={14} />
                <span>Logout</span>
              </button>
            </div>
          </div>

          {/* Card 4: Need Help? */}
          <div className={styles.helpCard}>
            <h3 className={styles.sidebarCardTitle}>Need Help?</h3>
            <p className={styles.helpSub}>Our support team is here for you.</p>

            <div className={styles.helpContactList}>
              <div className={styles.helpContactItem}>
                <Phone size={15} color="#2563eb" />
                <a href="tel:+919876543210">+91 98765 43210</a>
              </div>
              <div className={styles.helpContactItem}>
                <Mail size={15} color="#2563eb" />
                <a href="mailto:support@scrapanna.com">support@scrapanna.com</a>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Request Additional Role Modal */}
      <RequestAdditionalRoleModal
        isOpen={isRoleModalOpen}
        onClose={() => setIsRoleModalOpen(false)}
      />
    </div>
  );
}
