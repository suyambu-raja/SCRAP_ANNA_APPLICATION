import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  ShieldCheck,
  MapPin,
  Phone,
  Mail,
  FileText,
  Clock,
  Truck,
  CheckCircle2,
  Edit3,
  Save,
  Sparkles,
  Camera,
  Layers,
  Settings,
  Bell,
  Scale,
  Receipt,
  ArrowRight,
} from 'lucide-react';
import styles from './IndustryProfile.module.css';

export default function IndustryProfile() {
  const [activeTab, setActiveTab] = useState<'overview' | 'business' | 'logistics' | 'preferences'>('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [saveSuccessToast, setSaveSuccessToast] = useState(false);

  // Profile Form State
  const [companyName, setCompanyName] = useState('Sri Venkatesh Industries Pvt Ltd');
  const [contactPerson, setContactPerson] = useState('Sri Venkatesh');
  const [mobileNumber, setMobileNumber] = useState('+91 98401 23456');
  const [emailAddress, setEmailAddress] = useState('contact@srivenkateshindustries.com');
  const [companyAddress, setCompanyAddress] = useState(
    '24, 5th Main Road, SIDCO Industrial Estate, Guindy, Chennai, Tamil Nadu – 600032'
  );
  const [cityArea, setCityArea] = useState('Guindy SIDCO, Chennai');
  const [industrySector, setIndustrySector] = useState('Automotive Components & Precision Machining');
  const [gstinNumber, setGstinNumber] = useState('33AAAAA0000A1Z5');
  const [weighbridgeAvailable, setWeighbridgeAvailable] = useState(true);
  const [weighbridgeCapacity, setWeighbridgeCapacity] = useState('60 Tons Electronic Platform');
  const [loadingCraneAvailable, setLoadingCraneAvailable] = useState(true);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditing(false);
    setSaveSuccessToast(true);
    setTimeout(() => setSaveSuccessToast(false), 3000);
  };

  return (
    <div className={styles.pageContainer}>
      {/* Save Success Toast */}
      {saveSuccessToast && (
        <div className={styles.toastBanner}>
          <CheckCircle2 size={18} color="#16a34a" />
          <span>✓ Industry profile updated successfully!</span>
        </div>
      )}

      {/* 1. Profile Hero Header */}
      <div className={styles.profileHeroCard}>
        <div className={styles.profileHeroLeft}>
          <div className={styles.avatarLarge}>
            <Building2 size={42} />
          </div>

          <div className={styles.profileHeroInfo}>
            <div className={styles.companyTitleRow}>
              <h1 className={styles.companyNameText}>{companyName}</h1>
              <span className={styles.verifiedEnterpriseBadge}>
                <ShieldCheck size={14} />
                <span>Verified Enterprise</span>
              </span>
            </div>

            <p className={styles.sectorText}>{industrySector}</p>

            <div className={styles.heroMetaRow}>
              <span className={styles.metaItem}>
                <MapPin size={13} className={styles.iconGold} />
                <span>{cityArea}</span>
              </span>
              <span>•</span>
              <span className={styles.metaItem}>
                <Phone size={13} className={styles.iconGold} />
                <span>{mobileNumber}</span>
              </span>
              <span>•</span>
              <span className={styles.metaItem}>
                <Mail size={13} className={styles.iconGold} />
                <span>{emailAddress}</span>
              </span>
            </div>
          </div>
        </div>

        <div className={styles.heroStatsBox}>
          <div className={styles.heroStat}>
            <span className={styles.statLabel}>Total Scrap Dispatched</span>
            <span className={styles.statVal}>42.6 Tons</span>
          </div>
          <div className={styles.heroStat}>
            <span className={styles.statLabel}>Completed Pickups</span>
            <span className={styles.statVal}>38 Dispatches</span>
          </div>
        </div>
      </div>

      {/* 2. Profile Tabs Strip */}
      <div className={styles.tabsStrip}>
        <button
          type="button"
          className={`${styles.tabBtn} ${activeTab === 'overview' ? styles.tabBtnActive : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <Building2 size={15} />
          <span>Company Overview</span>
        </button>

        <button
          type="button"
          className={`${styles.tabBtn} ${activeTab === 'business' ? styles.tabBtnActive : ''}`}
          onClick={() => setActiveTab('business')}
        >
          <FileText size={15} />
          <span>Business &amp; Registration</span>
        </button>

        <button
          type="button"
          className={`${styles.tabBtn} ${activeTab === 'logistics' ? styles.tabBtnActive : ''}`}
          onClick={() => setActiveTab('logistics')}
        >
          <Truck size={15} />
          <span>Factory Logistics &amp; Measurement</span>
        </button>

        <button
          type="button"
          className={`${styles.tabBtn} ${activeTab === 'preferences' ? styles.tabBtnActive : ''}`}
          onClick={() => setActiveTab('preferences')}
        >
          <Settings size={15} />
          <span>Account Preferences</span>
        </button>
      </div>

      {/* 3. Tab Content Area */}
      <div className={styles.tabContentCard}>
        {/* ================================================================
            TAB 1: OVERVIEW
           ================================================================ */}
        {activeTab === 'overview' && (
          <div className={styles.overviewGrid}>
            <div className={styles.overviewSection}>
              <div className={styles.sectionHeaderRow}>
                <h3 className={styles.sectionTitle}>Primary Contact Information</h3>
                <button
                  type="button"
                  className={styles.editOutlineBtn}
                  onClick={() => {
                    setActiveTab('business');
                    setIsEditing(true);
                  }}
                >
                  <Edit3 size={13} />
                  <span>Edit Details</span>
                </button>
              </div>

              <div className={styles.detailsGrid}>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Contact Person</span>
                  <strong className={styles.detailValue}>{contactPerson}</strong>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Designation</span>
                  <strong className={styles.detailValue}>Factory Operations &amp; Disposal Lead</strong>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Registered Mobile</span>
                  <strong className={styles.detailValue}>{mobileNumber}</strong>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Official Email</span>
                  <strong className={styles.detailValue}>{emailAddress}</strong>
                </div>
                <div className={styles.detailRowFull}>
                  <span className={styles.detailLabel}>Factory Address</span>
                  <strong className={styles.detailValue}>{companyAddress}</strong>
                </div>
              </div>
            </div>

            <div className={styles.overviewSection}>
              <h3 className={styles.sectionTitle}>Factory Scrap Infrastructure</h3>
              <div className={styles.infraCardsGrid}>
                <div className={styles.infraCard}>
                  <Scale size={20} className={styles.infraIcon} />
                  <div className={styles.infraText}>
                    <strong>On-Site Measurement Facility</strong>
                    <span>{weighbridgeAvailable ? '60-Ton Calibrated Digital Platform' : 'Off-site Measurement'}</span>
                  </div>
                </div>

                <div className={styles.infraCard}>
                  <Truck size={20} className={styles.infraIcon} />
                  <div className={styles.infraText}>
                    <strong>Commercial Gate Access</strong>
                    <span>Gate 2 (40-ft Container / Multi-Axle Compatible)</span>
                  </div>
                </div>

                <div className={styles.infraCard}>
                  <Layers size={20} className={styles.infraIcon} />
                  <div className={styles.infraText}>
                    <strong>Loading Assistance</strong>
                    <span>Overhead EOT Crane &amp; Forklift Available</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================
            TAB 2: BUSINESS & REGISTRATION
           ================================================================ */}
        {activeTab === 'business' && (
          <form onSubmit={handleSaveProfile} className={styles.profileForm}>
            <div className={styles.formHeader}>
              <div>
                <h3 className={styles.sectionTitle}>Business Registration Details</h3>
                <p className={styles.sectionSubtitle}>
                  Update official corporate and facility details for scrap invoices and GST compliance.
                </p>
              </div>

              {!isEditing ? (
                <button
                  type="button"
                  className={styles.editPrimaryBtn}
                  onClick={() => setIsEditing(true)}
                >
                  <Edit3 size={14} />
                  <span>Edit Profile</span>
                </button>
              ) : (
                <button type="submit" className={styles.savePrimaryBtn}>
                  <Save size={14} />
                  <span>Save Changes</span>
                </button>
              )}
            </div>

            <div className={styles.formFieldsGrid}>
              <div className={styles.inputGroupFull}>
                <label className={styles.fieldLabel}>Company Legal Name</label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className={styles.textInput}
                />
              </div>

              <div className={styles.formRowTwo}>
                <div className={styles.inputGroup}>
                  <label className={styles.fieldLabel}>Contact Person</label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={contactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
                    className={styles.textInput}
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.fieldLabel}>Industry Sector</label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={industrySector}
                    onChange={(e) => setIndustrySector(e.target.value)}
                    className={styles.textInput}
                  />
                </div>
              </div>

              <div className={styles.formRowTwo}>
                <div className={styles.inputGroup}>
                  <label className={styles.fieldLabel}>Mobile Number</label>
                  <input
                    type="tel"
                    disabled={!isEditing}
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    className={styles.textInput}
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.fieldLabel}>Official Email</label>
                  <input
                    type="email"
                    disabled={!isEditing}
                    value={emailAddress}
                    onChange={(e) => setEmailAddress(e.target.value)}
                    className={styles.textInput}
                  />
                </div>
              </div>

              <div className={styles.inputGroupFull}>
                <label className={styles.fieldLabel}>Registered Factory Address</label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={companyAddress}
                  onChange={(e) => setCompanyAddress(e.target.value)}
                  className={styles.textInput}
                />
              </div>

              <div className={styles.formRowTwo}>
                <div className={styles.inputGroup}>
                  <label className={styles.fieldLabel}>City / Industrial Zone</label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={cityArea}
                    onChange={(e) => setCityArea(e.target.value)}
                    className={styles.textInput}
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.fieldLabel}>
                    GSTIN Number <span className={styles.optionalTag}>(To be added later if pending)</span>
                  </label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={gstinNumber}
                    onChange={(e) => setGstinNumber(e.target.value)}
                    className={styles.textInput}
                  />
                </div>
              </div>
            </div>
          </form>
        )}

        {/* ================================================================
            TAB 3: FACTORY LOGISTICS & MEASUREMENT
           ================================================================ */}
        {activeTab === 'logistics' && (
          <div className={styles.logisticsTabContent}>
            <h3 className={styles.sectionTitle}>Factory Gate &amp; Measurement Specifications</h3>
            <p className={styles.sectionSubtitle}>
              Ensure merchants dispatch the appropriate vehicle type and scale equipment.
            </p>

            <div className={styles.logisticsCardsGrid}>
              <div className={styles.logisticsSettingCard}>
                <div className={styles.settingTextCol}>
                  <strong>In-House Measurement Platform</strong>
                  <p>Calibrated electronic measurement facility inside factory premises for spot tare and gross verification.</p>
                </div>
                <input
                  type="checkbox"
                  checked={weighbridgeAvailable}
                  onChange={(e) => setWeighbridgeAvailable(e.target.checked)}
                  className={styles.toggleCheckbox}
                />
              </div>

              <div className={styles.logisticsSettingCard}>
                <div className={styles.settingTextCol}>
                  <strong>Heavy Material Crane / Overhead EOT</strong>
                  <p>Overhead factory hoist capable of loading scrap motors, heavy machine frames, and iron structures up to 10 tons.</p>
                </div>
                <input
                  type="checkbox"
                  checked={loadingCraneAvailable}
                  onChange={(e) => setLoadingCraneAvailable(e.target.checked)}
                  className={styles.toggleCheckbox}
                />
              </div>

              <div className={styles.logisticsSettingCard}>
                <div className={styles.settingTextCol}>
                  <strong>Security Gate Pass Protocol</strong>
                  <p>Require driver photo, truck registration number, and digital OTP entry before entering factory loading dock.</p>
                </div>
                <input
                  type="checkbox"
                  defaultChecked={true}
                  className={styles.toggleCheckbox}
                />
              </div>
            </div>
          </div>
        )}

        {/* ================================================================
            TAB 4: PREFERENCES
           ================================================================ */}
        {activeTab === 'preferences' && (
          <div className={styles.preferencesTabContent}>
            <h3 className={styles.sectionTitle}>Communication &amp; Offer Preferences</h3>

            <div className={styles.prefList}>
              <div className={styles.prefItem}>
                <div>
                  <strong>Instant SMS &amp; WhatsApp Alerts for New Quotes</strong>
                  <p>Receive immediate notification whenever a verified merchant submits an offer.</p>
                </div>
                <input type="checkbox" defaultChecked={true} className={styles.toggleCheckbox} />
              </div>

              <div className={styles.prefItem}>
                <div>
                  <strong>Allow Voice Note Offers from Merchants</strong>
                  <p>Allow merchants to attach audio recordings explaining special logistics or crane services.</p>
                </div>
                <input type="checkbox" defaultChecked={true} className={styles.toggleCheckbox} />
              </div>

              <div className={styles.prefItem}>
                <div>
                  <strong>Direct NEFT Bank Account Settlement</strong>
                  <p>Automatically generate NEFT payment instructions upon digital bill slip confirmation.</p>
                </div>
                <input type="checkbox" defaultChecked={true} className={styles.toggleCheckbox} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
