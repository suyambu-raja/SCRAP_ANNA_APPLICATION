import { useState } from 'react';
import {
  User,
  Phone,
  MapPin,
  Mail,
  ShieldCheck,
  Check,
  Save,
  Plus,
  Trash2,
  Edit2,
  CreditCard,
  QrCode,
  Bell,
  Lock,
  LogOut,
  IndianRupee,
  Truck,
  Sparkles,
  CheckCircle2,
  X,
  Store,
} from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { RequestAdditionalRoleModal } from '@/components/common';
import styles from './HouseholdProfile.module.css';

interface SavedAddress {
  id: string;
  tag: string;
  fullAddress: string;
  landmark: string;
  pincode: string;
  isDefault: boolean;
}

const INITIAL_SAVED_ADDRESSES: SavedAddress[] = [
  {
    id: 'addr-1',
    tag: 'Home (Primary)',
    fullAddress: 'No. 42, 2nd Avenue, Anna Nagar East, Chennai, Tamil Nadu',
    landmark: 'Near Roundtana & Metro Station',
    pincode: '600040',
    isDefault: true,
  },
  {
    id: 'addr-2',
    tag: "Parent's House",
    fullAddress: 'Plot 18, 5th Cross Street, Shenoy Nagar, Chennai, Tamil Nadu',
    landmark: 'Opposite Shenoy Park',
    pincode: '600030',
    isDefault: false,
  },
];

export function HouseholdProfile() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  // Tab State
  const [activeTab, setActiveTab] = useState<'personal' | 'addresses' | 'payment' | 'notifications'>('personal');
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);

  // Personal Info Form State
  const [fullName, setFullName] = useState(user?.name || 'Ramesh Kumar');
  const [phone, setPhone] = useState(user?.phone || '+91 98401 23456');
  const [email, setEmail] = useState(user?.email || 'ramesh.kumar@example.com');
  const [alternatePhone, setAlternatePhone] = useState('+91 94440 98765');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Saved Addresses State
  const [addressList, setAddressList] = useState<SavedAddress[]>(INITIAL_SAVED_ADDRESSES);
  const [isAddAddressOpen, setIsAddAddressOpen] = useState(false);
  const [newTag, setNewTag] = useState('Home');
  const [newFullAddress, setNewFullAddress] = useState('');
  const [newLandmark, setNewLandmark] = useState('');
  const [newPincode, setNewPincode] = useState('600040');

  // Payment Preferences State
  const [upiId, setUpiId] = useState('ramesh.kumar@okaxis');
  const [isUpiVerified, setIsUpiVerified] = useState(true);
  const [bankAccount, setBankAccount] = useState('50100234981245');
  const [ifscCode, setIfscCode] = useState('HDFC0001234');
  const [preferredPayoutMode, setPreferredPayoutMode] = useState<'upi' | 'bank' | 'cash'>('upi');

  // Notification Preferences State
  const [whatsappUpdates, setWhatsappUpdates] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [rateSurgeAlerts, setRateSurgeAlerts] = useState(true);
  const [driverEnRouteCalls, setDriverEnRouteCalls] = useState(true);

  const handleSavePersonal = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleAddNewAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFullAddress.trim()) return;

    const newAddr: SavedAddress = {
      id: `addr-${Date.now()}`,
      tag: newTag,
      fullAddress: newFullAddress,
      landmark: newLandmark,
      pincode: newPincode,
      isDefault: addressList.length === 0,
    };

    setAddressList((prev) => [...prev, newAddr]);
    setIsAddAddressOpen(false);
    setNewFullAddress('');
    setNewLandmark('');
  };

  const handleSetDefaultAddress = (id: string) => {
    setAddressList((prev) =>
      prev.map((addr) => ({
        ...addr,
        isDefault: addr.id === id,
      }))
    );
  };

  const handleDeleteAddress = (id: string) => {
    setAddressList((prev) => prev.filter((addr) => addr.id !== id));
  };

  return (
    <div className={styles.pageContainer}>
      {/* 1. HERO PROFILE CARD */}
      <section className={styles.profileHeroCard}>
        <div className={styles.profileUserGroup}>
          <div className={styles.avatarLarge}>
            {fullName.charAt(0).toUpperCase()}
          </div>

          <div className={styles.userMetaCol}>
            <div className={styles.badgeRow}>
              <span className={styles.verifiedBadge}>
                <ShieldCheck size={14} />
                <span>VERIFIED HOUSEHOLD ACCOUNT</span>
              </span>
              <span className={styles.locationTag}>PIN: 600040 • ANNA NAGAR, CHENNAI</span>
            </div>

            <h1 className={styles.userNameTitle}>{fullName}</h1>
            <p className={styles.userEmailPhone}>
              {phone} • {email}
            </p>
          </div>
        </div>

        {/* Right Metric Highlights */}
        <div className={styles.heroStatsStrip}>
          <div className={styles.statCol}>
            <span className={styles.statLabel}>Total Recycled</span>
            <span className={styles.statValGold}>118.6 KG</span>
          </div>

          <div className={styles.statDivider} />

          <div className={styles.statCol}>
            <span className={styles.statLabel}>Completed Pickups</span>
            <span className={styles.statValGreen}>12 Pickups</span>
          </div>

          <div className={styles.statDivider} />

          <div className={styles.statCol}>
            <span className={styles.statLabel}>Total Earned</span>
            <span className={styles.statValGold}>₹3,450</span>
          </div>
        </div>
      </section>

      {/* 2. NAVIGATION TABS */}
      <div className={styles.tabsContainer}>
        <button
          type="button"
          className={`${styles.tabBtn} ${activeTab === 'personal' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('personal')}
        >
          <User size={16} />
          <span>Personal Details</span>
        </button>

        <button
          type="button"
          className={`${styles.tabBtn} ${activeTab === 'addresses' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('addresses')}
        >
          <MapPin size={16} />
          <span>Saved Addresses ({addressList.length})</span>
        </button>

        <button
          type="button"
          className={`${styles.tabBtn} ${activeTab === 'payment' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('payment')}
        >
          <CreditCard size={16} />
          <span>Payout & UPI Accounts</span>
        </button>

        <button
          type="button"
          className={`${styles.tabBtn} ${activeTab === 'notifications' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('notifications')}
        >
          <Bell size={16} />
          <span>Preferences & Alerts</span>
        </button>
      </div>

      {/* 3. TAB CONTENT */}

      {/* TAB 1: PERSONAL DETAILS */}
      {activeTab === 'personal' && (
        <div className={styles.tabContentGrid}>
          <div className={styles.contentCard}>
            <div className={styles.cardHeaderGroup}>
              <div>
                <h3 className={styles.cardTitle}>Account & Contact Information</h3>
                <p className={styles.cardSubtitle}>
                  Update your contact details for doorstep pickup verification and SMS alerts.
                </p>
              </div>
            </div>

            <form onSubmit={handleSavePersonal} className={styles.formGrid}>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>Full Name</label>
                <div className={styles.inputWrap}>
                  <User size={16} className={styles.inputIcon} />
                  <input
                    type="text"
                    className={styles.textInput}
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>Primary Phone Number (Verified)</label>
                <div className={styles.inputWrap}>
                  <Phone size={16} className={styles.inputIcon} />
                  <input
                    type="text"
                    className={styles.textInput}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>Email Address</label>
                <div className={styles.inputWrap}>
                  <Mail size={16} className={styles.inputIcon} />
                  <input
                    type="email"
                    className={styles.textInput}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>Alternate Phone / WhatsApp Number</label>
                <div className={styles.inputWrap}>
                  <Phone size={16} className={styles.inputIcon} />
                  <input
                    type="text"
                    className={styles.textInput}
                    value={alternatePhone}
                    onChange={(e) => setAlternatePhone(e.target.value)}
                  />
                </div>
              </div>

              <div className={styles.formFieldFull} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.5rem' }}>
                <button type="submit" className={styles.saveBtn}>
                  <Save size={16} />
                  <span>{savedSuccess ? 'Changes Saved! ✨' : 'Save Changes'}</span>
                </button>

                <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                  🔒 Your contact information is encrypted and protected.
                </span>
              </div>
            </form>
          </div>

          {/* Right Side: Account Security & Roles Card */}
          <div className={styles.contentCard}>
            <div className={styles.cardHeaderGroup}>
              <h3 className={styles.cardTitle}>Role & Account Security</h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {/* Current Active Role & Verification Status */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.85rem', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <ShieldCheck size={18} color="#059669" />
                  <div>
                    <span style={{ fontSize: '0.84rem', fontWeight: 700, color: '#0f172a', display: 'block' }}>
                      Current Role: Household Profile
                    </span>
                    <span style={{ fontSize: '0.74rem', color: '#059669', fontWeight: 600 }}>✓ Verified & Active</span>
                  </div>
                </div>
              </div>

              {/* Request Additional Role button */}
              <div style={{ padding: '0.85rem', background: 'linear-gradient(180deg, #FFF8DC 0%, #FFEEBA 100%)', borderRadius: '12px', border: '1.5px solid #FFDE7A', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <Store size={16} color="#1E3A20" />
                  <span style={{ fontSize: '0.84rem', fontWeight: 800, color: '#1A381C' }}>
                    Need Merchant or Industry Profile?
                  </span>
                </div>
                <p style={{ fontSize: '0.75rem', color: '#234A28', margin: 0, lineHeight: 1.4 }}>
                  Apply for a verified Merchant or Industry account under your mobile number.
                </p>
                <button
                  type="button"
                  onClick={() => setIsRoleModalOpen(true)}
                  style={{
                    background: '#0F172A',
                    color: '#FBC21A',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '0.5rem',
                    fontSize: '0.78rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.35rem',
                    marginTop: '0.25rem',
                  }}
                >
                  <span>Request Additional Role</span>
                  <Plus size={14} />
                </button>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.85rem', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Lock size={18} color="#0f172a" />
                  <div>
                    <span style={{ fontSize: '0.84rem', fontWeight: 700, color: '#0f172a', display: 'block' }}>
                      Mobile OTP Login
                    </span>
                    <span style={{ fontSize: '0.74rem', color: '#64748b' }}>Password-free secure auth</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={logout}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.45rem',
                  background: '#fee2e2',
                  border: '1px solid #fecaca',
                  color: '#dc2626',
                  padding: '0.65rem',
                  borderRadius: '8px',
                  fontWeight: 800,
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  marginTop: '0.5rem',
                }}
              >
                <LogOut size={16} />
                <span>Logout of Account</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SAVED ADDRESSES */}
      {activeTab === 'addresses' && (
        <div className={styles.tabContentGrid}>
          <div className={styles.contentCard}>
            <div className={styles.cardHeaderGroup}>
              <div>
                <h3 className={styles.cardTitle}>Doorstep Pickup Addresses</h3>
                <p className={styles.cardSubtitle}>
                  Manage saved locations for fast 1-click doorstep scrap pickup booking.
                </p>
              </div>

              <button
                type="button"
                className={styles.saveBtn}
                onClick={() => setIsAddAddressOpen(true)}
                style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}
              >
                <Plus size={15} />
                <span>+ Add Address</span>
              </button>
            </div>

            <div className={styles.addressCardList}>
              {addressList.map((addr) => (
                <div
                  key={addr.id}
                  className={`${styles.addressItemCard} ${addr.isDefault ? styles.addressItemActive : ''}`}
                >
                  <div className={styles.addressLeftCol}>
                    <div className={styles.addressTagRow}>
                      <span className={styles.addressTagPill}>{addr.tag}</span>
                      {addr.isDefault && <span className={styles.defaultBadge}>Default Address</span>}
                    </div>

                    <p className={styles.addressText}>{addr.fullAddress}</p>
                    <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                      Landmark: {addr.landmark} • Pincode: <strong>{addr.pincode}</strong>
                    </span>
                  </div>

                  <div className={styles.addressActions}>
                    {!addr.isDefault && (
                      <button
                        type="button"
                        className={styles.addressActionBtn}
                        onClick={() => handleSetDefaultAddress(addr.id)}
                        title="Set as Default Address"
                      >
                        <Check size={15} />
                      </button>
                    )}
                    {addressList.length > 1 && (
                      <button
                        type="button"
                        className={`${styles.addressActionBtn} ${styles.deleteBtn}`}
                        onClick={() => handleDeleteAddress(addr.id)}
                        title="Delete Address"
                      >
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side: Quick Info Card */}
          <div className={styles.contentCard}>
            <div className={styles.cardHeaderGroup}>
              <h3 className={styles.cardTitle}>Pickup Coverage</h3>
            </div>
            <p style={{ margin: 0, fontSize: '0.84rem', color: '#64748b', lineHeight: 1.45 }}>
              Scrap Anna provides certified doorstep pickup across all major areas in <strong>Chennai</strong> including Anna Nagar, Kilpauk, Shenoy Nagar, Guindy, T. Nagar, Adyar, Velachery, and OMR.
            </p>
            <div style={{ background: '#ecfdf5', padding: '0.85rem', borderRadius: '10px', border: '1px solid #a7f3d0', fontSize: '0.8rem', color: '#065f46' }}>
              ⚡ <strong>Instant Weighing:</strong> Our verified drivers bring calibrated digital weigh scales to every doorstep address.
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PAYMENT & UPI PREFERENCES */}
      {activeTab === 'payment' && (
        <div className={styles.tabContentGrid}>
          <div className={styles.contentCard}>
            <div className={styles.cardHeaderGroup}>
              <div>
                <h3 className={styles.cardTitle}>Instant Payout Accounts</h3>
                <p className={styles.cardSubtitle}>
                  Receive your scrap earnings instantly upon doorstep weighing via UPI or Direct Bank Transfer.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Option 1: UPI ID */}
              <div className={`${styles.payoutMethodCard} ${preferredPayoutMode === 'upi' ? styles.payoutMethodActive : ''}`}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                  <QrCode size={24} color="#059669" />
                  <div>
                    <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0f172a', display: 'block' }}>
                      UPI ID (Instant Spot Transfer)
                    </span>
                    <span style={{ fontSize: '0.8rem', color: '#059669', fontWeight: 700 }}>
                      {upiId} {isUpiVerified && '✓ Verified'}
                    </span>
                  </div>
                </div>

                <input
                  type="radio"
                  name="payoutMode"
                  checked={preferredPayoutMode === 'upi'}
                  onChange={() => setPreferredPayoutMode('upi')}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
              </div>

              {/* Option 2: Bank Account */}
              <div className={`${styles.payoutMethodCard} ${preferredPayoutMode === 'bank' ? styles.payoutMethodActive : ''}`}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                  <CreditCard size={24} color="#2563eb" />
                  <div>
                    <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0f172a', display: 'block' }}>
                      Bank Account Transfer
                    </span>
                    <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                      HDFC Bank • A/C: ••••{bankAccount.slice(-4)} • IFSC: {ifscCode}
                    </span>
                  </div>
                </div>

                <input
                  type="radio"
                  name="payoutMode"
                  checked={preferredPayoutMode === 'bank'}
                  onChange={() => setPreferredPayoutMode('bank')}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
              </div>

              {/* Option 3: Spot Cash */}
              <div className={`${styles.payoutMethodCard} ${preferredPayoutMode === 'cash' ? styles.payoutMethodActive : ''}`}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                  <IndianRupee size={24} color="#f59e0b" />
                  <div>
                    <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0f172a', display: 'block' }}>
                      Cash on Doorstep
                    </span>
                    <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                      Physical cash paid by executive right after weighing
                    </span>
                  </div>
                </div>

                <input
                  type="radio"
                  name="payoutMode"
                  checked={preferredPayoutMode === 'cash'}
                  onChange={() => setPreferredPayoutMode('cash')}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
              </div>
            </div>
          </div>

          {/* Right Side: UPI Update Form */}
          <div className={styles.contentCard}>
            <div className={styles.cardHeaderGroup}>
              <h3 className={styles.cardTitle}>Update UPI ID</h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>Enter VPA / UPI ID</label>
                <div className={styles.inputWrap}>
                  <QrCode size={16} className={styles.inputIcon} />
                  <input
                    type="text"
                    className={styles.textInput}
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="e.g. mobile@upi or name@okaxis"
                  />
                </div>
              </div>

              <button
                type="button"
                className={styles.saveBtn}
                onClick={() => {
                  setIsUpiVerified(true);
                  alert('UPI ID verified successfully with bank switchboard!');
                }}
              >
                Verify & Save UPI
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: PREFERENCES & ALERTS */}
      {activeTab === 'notifications' && (
        <div className={styles.tabContentGrid}>
          <div className={styles.contentCard}>
            <div className={styles.cardHeaderGroup}>
              <div>
                <h3 className={styles.cardTitle}>Notification Channels</h3>
                <p className={styles.cardSubtitle}>Choose how you wish to receive pickup updates and scrap price alerts.</p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.85rem', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0', cursor: 'pointer' }}>
                <div>
                  <span style={{ fontSize: '0.86rem', fontWeight: 800, color: '#0f172a', display: 'block' }}>
                    WhatsApp Updates
                  </span>
                  <span style={{ fontSize: '0.74rem', color: '#64748b' }}>
                    Receive live driver ETA, digital weigh slips, and payment receipts on WhatsApp
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={whatsappUpdates}
                  onChange={(e) => setWhatsappUpdates(e.target.checked)}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
              </label>

              <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.85rem', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0', cursor: 'pointer' }}>
                <div>
                  <span style={{ fontSize: '0.86rem', fontWeight: 800, color: '#0f172a', display: 'block' }}>
                    SMS & OTP Alerts
                  </span>
                  <span style={{ fontSize: '0.74rem', color: '#64748b' }}>
                    Receive security pickup OTPs and transaction receipts
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={smsAlerts}
                  onChange={(e) => setSmsAlerts(e.target.checked)}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
              </label>

              <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.85rem', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0', cursor: 'pointer' }}>
                <div>
                  <span style={{ fontSize: '0.86rem', fontWeight: 800, color: '#0f172a', display: 'block' }}>
                    Market Scrap Rate Surge Alerts
                  </span>
                  <span style={{ fontSize: '0.74rem', color: '#64748b' }}>
                    Get notified when Chennai Copper, Iron, or Brass prices surge by more than 2%
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={rateSurgeAlerts}
                  onChange={(e) => setRateSurgeAlerts(e.target.checked)}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
              </label>
            </div>
          </div>

          <div className={styles.contentCard}>
            <div className={styles.cardHeaderGroup}>
              <h3 className={styles.cardTitle}>Recycling Impact</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', padding: '0.5rem 0', borderBottom: '1px solid #f1f5f9' }}>
                <span style={{ color: '#64748b' }}>CO₂ Emissions Saved:</span>
                <strong style={{ color: '#059669' }}>~284.5 KG</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', padding: '0.5rem 0', borderBottom: '1px solid #f1f5f9' }}>
                <span style={{ color: '#64748b' }}>Landfill Diverted:</span>
                <strong style={{ color: '#0f172a' }}>118.6 KG</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', padding: '0.5rem 0' }}>
                <span style={{ color: '#64748b' }}>Eco Tier:</span>
                <strong style={{ color: '#f59e0b' }}>Gold Household Eco Recycler</strong>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ADD ADDRESS MODAL */}
      {isAddAddressOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsAddAddressOpen(false)}>
          <div className={styles.contentCard} style={{ maxWidth: '520px', width: '100%', margin: 'auto', position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 10000 }} onClick={(e) => e.stopPropagation()}>
            <div className={styles.cardHeaderGroup}>
              <h3 className={styles.cardTitle}>Add New Pickup Address</h3>
              <button type="button" onClick={() => setIsAddAddressOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddNewAddress} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label className={styles.fieldLabel}>Address Label</label>
                <select
                  className={styles.selectInput}
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                >
                  <option>Home</option>
                  <option>Office</option>
                  <option>Apartment</option>
                  <option>Shop</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label className={styles.fieldLabel}>Complete Street Address</label>
                <textarea
                  className={styles.textareaInput}
                  placeholder="Door No, Street Name, Area..."
                  value={newFullAddress}
                  onChange={(e) => setNewFullAddress(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
                <div>
                  <label className={styles.fieldLabel}>Landmark</label>
                  <input
                    type="text"
                    className={styles.textInput}
                    placeholder="Near school, park..."
                    value={newLandmark}
                    onChange={(e) => setNewLandmark(e.target.value)}
                  />
                </div>
                <div>
                  <label className={styles.fieldLabel}>Pincode</label>
                  <input
                    type="text"
                    className={styles.textInput}
                    value={newPincode}
                    onChange={(e) => setNewPincode(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button type="submit" className={styles.saveBtn} style={{ width: '100%', justifyContent: 'center' }}>
                Save Address
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Request Additional Role Verification Modal */}
      <RequestAdditionalRoleModal
        isOpen={isRoleModalOpen}
        onClose={() => setIsRoleModalOpen(false)}
      />
    </div>
  );
}

export default HouseholdProfile;
