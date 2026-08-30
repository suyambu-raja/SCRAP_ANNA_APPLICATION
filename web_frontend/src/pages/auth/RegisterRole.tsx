import { useState, type FormEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Home as HomeIcon,
  Store,
  Factory,
  Network,
  ArrowRight,
  ArrowLeft,
  Check,
  CheckCircle2,
  Upload,
  Info,
  MapPin,
} from 'lucide-react';
import { Button } from '@/components/common';
import { useAuthStore } from '@/store/useAuthStore';
import { registerRoleUser } from '@/services';
import type { UserRole } from '@/types';
import styles from './RegisterRole.module.css';

interface RoleOption {
  id: UserRole;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const ROLE_OPTIONS: RoleOption[] = [
  {
    id: 'household',
    title: 'Household',
    description: 'Sell household scrap and book convenient scrap collection.',
    icon: <HomeIcon size={24} />,
  },
  {
    id: 'merchant',
    title: 'Merchant',
    description: 'Sell scrap and connect with industries and buyers.',
    icon: <Store size={24} />,
  },
  {
    id: 'industry',
    title: 'Industry',
    description: 'Post scrap requirements and find suitable merchants.',
    icon: <Factory size={24} />,
  },
  {
    id: 'aggregator',
    title: 'Aggregator',
    description: 'Collect, manage and trade scrap across your service area.',
    icon: <Network size={24} />,
  },
];

const CHENNAI_AREAS = [
  'Guindy',
  'Ambattur',
  'Koyambedu',
  'T. Nagar',
  'Velachery',
  'Anna Nagar',
  'Tambaram',
  'Porur',
  'Royapuram',
  'Perambur',
  'Sriperumbudur',
];

const SCRAP_CHECKBOXES = [
  'Iron / Steel',
  'Tin',
  'Copper',
  'Aluminium',
  'Brass',
  'Plastic',
  'Paper',
  'Cardboard',
  'E-Waste',
  'Other',
];

export default function RegisterRole() {
  const navigate = useNavigate();
  const location = useLocation();
  const login = useAuthStore((s) => s.login);

  const phone =
    (location.state as { phone?: string })?.phone ||
    localStorage.getItem('sa_unregistered_phone') ||
    '9876543210';

  const formattedPhone =
    phone.length === 10
      ? `+91 ${phone.slice(0, 5)} ${phone.slice(5)}`
      : phone.startsWith('+91')
      ? phone
      : `+91 ${phone}`;

  // Main Stepper: 1 = Role Selection, 2 = Role Form
  const [roleStep, setRoleStep] = useState<1 | 2>(1);
  const [selectedRole, setSelectedRole] = useState<UserRole>('household');

  // Merchant 5-step sub-stepper (1 to 5)
  const [merchantStep, setMerchantStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Common Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [cityArea, setCityArea] = useState('Guindy, Chennai');
  const [pincode, setPincode] = useState('600032');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Industry & Aggregator Fields
  const [companyName, setCompanyName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [dailyCapacity, setDailyCapacity] = useState('5–10 Tons / Day');

  // Merchant Specific Fields
  const [shopName, setShopName] = useState('');
  const [yearsInBusiness, setYearsInBusiness] = useState('');
  const [locationPinned, setLocationPinned] = useState(true);

  // Merchant Step 3: Verification Upload Simulation
  const [panUploaded, setPanUploaded] = useState(false);
  const [aadhaarUploaded, setAadhaarUploaded] = useState(false);
  const [shopProofUploaded, setShopProofUploaded] = useState(false);
  const [ownerPhotoUploaded, setOwnerPhotoUploaded] = useState(false);
  const [gstinUploaded, setGstinUploaded] = useState(false);
  const [tradeLicenseUploaded, setTradeLicenseUploaded] = useState(false);

  // Merchant Step 4: Collection Details
  const [directIndustry, setDirectIndustry] = useState<boolean>(true);
  const [hasVehicle, setHasVehicle] = useState<boolean>(true);
  const [vehicleCount, setVehicleCount] = useState<number>(1);
  const [vehicleType, setVehicleType] = useState<string>('Auto');
  const [vehicleCapacity, setVehicleCapacity] = useState<string>('500 kg');
  const [preferredAreas, setPreferredAreas] = useState<string[]>([
    'Guindy',
    'Ambattur',
    'Koyambedu',
  ]);
  const [selectedScrapTypes, setSelectedScrapTypes] = useState<string[]>([
    'Iron / Steel',
    'Tin',
    'Copper',
    'Plastic',
    'Cardboard',
  ]);

  // Merchant Step 5: Payment Details
  const [upiId, setUpiId] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [ifsc, setIfsc] = useState('');
  const [bankName, setBankName] = useState('');

  const togglePreferredArea = (area: string) => {
    setPreferredAreas((prev) =>
      prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area]
    );
  };

  const toggleScrapType = (type: string) => {
    setSelectedScrapTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handleRoleContinue = () => {
    setRoleStep(2);
    setMerchantStep(1);
    setError('');
  };

  const handleFinalSubmit = async (e?: FormEvent) => {
    if (e) e.preventDefault();
    setError('');

    // Role-specific validation
    if (selectedRole === 'household') {
      if (!name.trim()) {
        setError('Please enter your full name.');
        return;
      }
      if (!address.trim()) {
        setError('Please enter your house address.');
        return;
      }
    } else if (selectedRole === 'industry') {
      if (!companyName.trim()) {
        setError('Please enter your company or factory name.');
        return;
      }
      if (!contactPerson.trim()) {
        setError('Please enter the authorized contact person name.');
        return;
      }
      if (!address.trim()) {
        setError('Please enter the company / plant address.');
        return;
      }
    } else if (selectedRole === 'merchant') {
      if (!name.trim()) {
        setError('Please enter owner name.');
        return;
      }
      if (!shopName.trim()) {
        setError('Please enter shop / business name.');
        return;
      }
    } else if (selectedRole === 'aggregator') {
      if (!companyName.trim()) {
        setError('Please enter aggregator organization name.');
        return;
      }
      if (!contactPerson.trim()) {
        setError('Please enter authorized representative name.');
        return;
      }
    }

    setLoading(true);

    try {
      const res = await registerRoleUser({
        phone,
        role: selectedRole,
        name:
          selectedRole === 'industry'
            ? contactPerson
            : selectedRole === 'aggregator'
            ? contactPerson
            : name,
        email: email.trim(),
        address: address.trim(),
        area: cityArea.trim() || 'Guindy',
        city: 'Chennai',
        state: 'Tamil Nadu',
        pincode: pincode.trim() || '600032',
        businessName: shopName.trim(),
        companyName: companyName.trim(),
        contactPerson: contactPerson.trim(),
        organizationName: companyName.trim(),
        yearsInBusiness: yearsInBusiness.trim(),
        locationPin: locationPinned ? 'Chennai, Tamil Nadu (GPS Active)' : '',
        panUploaded,
        aadhaarUploaded,
        shopProofUploaded,
        ownerPhotoUploaded,
        gstinUploaded,
        tradeLicenseUploaded,
        directIndustryConnection: directIndustry,
        hasVehicle,
        vehicleCount: hasVehicle ? vehicleCount : 0,
        vehicleType: hasVehicle ? vehicleType : undefined,
        vehicleCapacity: hasVehicle ? vehicleCapacity : undefined,
        preferredAreas,
        categoriesHandled: selectedScrapTypes,
        upiId: upiId.trim(),
        bankAccount: bankAccount.trim(),
        ifsc: ifsc.trim(),
        dailyCapacityTons: dailyCapacity,
      });

      // Clear temp phone storage
      localStorage.removeItem('sa_unregistered_phone');

      // Login user into global auth state
      login(res.user, res.token);

      // Navigate to role-specific dashboard
      if (res.user.role === 'industry') {
        navigate('/industry/dashboard', { replace: true });
      } else {
        navigate('/dashboard/merchant', { replace: true });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div
        className={[
          styles.card,
          roleStep === 2 && selectedRole === 'merchant' ? styles.cardWide : '',
        ].join(' ')}
      >
        {/* Persistent Verified Mobile Badge */}
        <div className={styles.verifiedMobileBanner}>
          <CheckCircle2 size={15} />
          <span>Mobile number verified: {formattedPhone}</span>
        </div>

        {/* ========================================================================= */}
        {/* STEP 1: USER TYPE SELECTION */}
        {/* ========================================================================= */}
        {roleStep === 1 && (
          <div>
            <div className={styles.headerCentered}>
              <img src="/logo-icon.png" alt="Scrap Anna" className={styles.logoImg} />
              <h1 className={styles.title}>How will you use Scrap Anna?</h1>
              <p className={styles.subtitle}>Choose the option that best describes you.</p>
            </div>

            <div className={styles.roleGrid}>
              {ROLE_OPTIONS.map((role) => {
                const isActive = selectedRole === role.id;
                return (
                  <div
                    key={role.id}
                    className={[styles.roleCard, isActive ? styles.roleCardActive : ''].join(' ')}
                    onClick={() => setSelectedRole(role.id)}
                    role="button"
                    tabIndex={0}
                  >
                    {isActive && (
                      <div className={styles.roleCheckIcon}>
                        <Check size={13} strokeWidth={3} />
                      </div>
                    )}
                    <div className={styles.roleIconWrap}>{role.icon}</div>
                    <div className={styles.roleText}>
                      <h3 className={styles.roleTitle}>{role.title}</h3>
                      <p className={styles.roleDesc}>{role.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <Button
              fullWidth
              size="lg"
              onClick={handleRoleContinue}
              icon={<ArrowRight size={18} />}
            >
              Continue
            </Button>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 2: ROLE-SPECIFIC REGISTRATION */}
        {/* ========================================================================= */}
        {roleStep === 2 && (
          <div>
            <button
              type="button"
              className={styles.backBtn}
              onClick={() => {
                setRoleStep(1);
                setError('');
              }}
            >
              <ArrowLeft size={16} /> Change User Type
            </button>

            {/* --------------------------------------------------------------------- */}
            {/* A. HOUSEHOLD REGISTRATION */}
            {/* --------------------------------------------------------------------- */}
            {selectedRole === 'household' && (
              <div>
                <div className={styles.headerLeft}>
                  <h1 className={styles.title}>Create your Household Account</h1>
                  <p className={styles.subtitle}>
                    Fast registration to book doorstep pickups and sell scrap.
                  </p>
                </div>

                <form onSubmit={handleFinalSubmit} className={styles.form}>
                  <div className={styles.fieldGroup}>
                    <label className={styles.fieldLabel}>Full Name *</label>
                    <input
                      type="text"
                      className={styles.textInput}
                      placeholder="e.g. Priya Sundaram"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      autoFocus
                    />
                  </div>

                  <div className={styles.fieldGroup}>
                    <label className={styles.fieldLabel}>Mobile Number</label>
                    <div className={styles.readOnlyInput}>
                      <span>{formattedPhone}</span>
                      <span className={styles.verifiedPill}>
                        <Check size={12} strokeWidth={3} /> Verified
                      </span>
                    </div>
                  </div>

                  <div className={styles.fieldGroup}>
                    <label className={styles.fieldLabel}>Email Address (Optional)</label>
                    <input
                      type="email"
                      className={styles.textInput}
                      placeholder="e.g. priya@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <div className={styles.fieldGroup}>
                    <label className={styles.fieldLabel}>House / Apartment Address *</label>
                    <input
                      type="text"
                      className={styles.textInput}
                      placeholder="e.g. Flat 302, Green Meadows Apt, Gandhi Road"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      required
                    />
                  </div>

                  <div className={styles.twoColRow}>
                    <div className={styles.fieldGroup}>
                      <label className={styles.fieldLabel}>City / Area *</label>
                      <input
                        type="text"
                        className={styles.textInput}
                        placeholder="e.g. Guindy / Velachery"
                        value={cityArea}
                        onChange={(e) => setCityArea(e.target.value)}
                        required
                      />
                    </div>
                    <div className={styles.fieldGroup}>
                      <label className={styles.fieldLabel}>PIN Code</label>
                      <input
                        type="text"
                        maxLength={6}
                        className={styles.textInput}
                        placeholder="600032"
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                      />
                    </div>
                  </div>

                  {error && <div className={styles.errorBanner}>{error}</div>}

                  <Button
                    type="submit"
                    fullWidth
                    size="lg"
                    loading={loading}
                    icon={<ArrowRight size={18} />}
                  >
                    {loading ? 'Creating Account...' : 'Create Account'}
                  </Button>
                </form>
              </div>
            )}

            {/* --------------------------------------------------------------------- */}
            {/* B. INDUSTRY REGISTRATION */}
            {/* --------------------------------------------------------------------- */}
            {selectedRole === 'industry' && (
              <div>
                <div className={styles.headerLeft}>
                  <h1 className={styles.title}>Register Your Industry</h1>
                  <p className={styles.subtitle}>
                    Connect with scrap aggregators and post industrial scrap requirements.
                  </p>
                </div>

                <form onSubmit={handleFinalSubmit} className={styles.form}>
                  <div className={styles.fieldGroup}>
                    <label className={styles.fieldLabel}>Company / Factory Name *</label>
                    <input
                      type="text"
                      className={styles.textInput}
                      placeholder="e.g. Chennai Precision Engineering Ltd."
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      required
                      autoFocus
                    />
                  </div>

                  <div className={styles.fieldGroup}>
                    <label className={styles.fieldLabel}>Authorized Contact Person Name *</label>
                    <input
                      type="text"
                      className={styles.textInput}
                      placeholder="e.g. S. Ramachandran (Procurement Manager)"
                      value={contactPerson}
                      onChange={(e) => setContactPerson(e.target.value)}
                      required
                    />
                  </div>

                  <div className={styles.fieldGroup}>
                    <label className={styles.fieldLabel}>Mobile Number</label>
                    <div className={styles.readOnlyInput}>
                      <span>{formattedPhone}</span>
                      <span className={styles.verifiedPill}>
                        <Check size={12} strokeWidth={3} /> Verified
                      </span>
                    </div>
                  </div>

                  <div className={styles.fieldGroup}>
                    <label className={styles.fieldLabel}>Official Business Email *</label>
                    <input
                      type="email"
                      className={styles.textInput}
                      placeholder="e.g. procurement@chennaieng.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className={styles.fieldGroup}>
                    <label className={styles.fieldLabel}>Company / Plant Address *</label>
                    <input
                      type="text"
                      className={styles.textInput}
                      placeholder="e.g. Plot 45, Phase II, Industrial Estate"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      required
                    />
                  </div>

                  <div className={styles.twoColRow}>
                    <div className={styles.fieldGroup}>
                      <label className={styles.fieldLabel}>Industrial Area / City *</label>
                      <input
                        type="text"
                        className={styles.textInput}
                        placeholder="e.g. Ambattur IE / Sriperumbudur"
                        value={cityArea}
                        onChange={(e) => setCityArea(e.target.value)}
                        required
                      />
                    </div>
                    <div className={styles.fieldGroup}>
                      <label className={styles.fieldLabel}>PIN Code</label>
                      <input
                        type="text"
                        maxLength={6}
                        className={styles.textInput}
                        placeholder="600058"
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                      />
                    </div>
                  </div>

                  {/* GSTIN Notice */}
                  <div className={styles.noticeBox}>
                    <Info size={18} />
                    <span>
                      <strong>GSTIN Note:</strong> GSTIN verification may be required later for
                      industry transactions.
                    </span>
                  </div>

                  {error && <div className={styles.errorBanner}>{error}</div>}

                  <Button
                    type="submit"
                    fullWidth
                    size="lg"
                    loading={loading}
                    icon={<ArrowRight size={18} />}
                  >
                    {loading ? 'Registering Industry...' : 'Create Industry Account'}
                  </Button>
                </form>
              </div>
            )}

            {/* --------------------------------------------------------------------- */}
            {/* C. MERCHANT REGISTRATION (5 PROGRESSIVE STEPS) */}
            {/* --------------------------------------------------------------------- */}
            {selectedRole === 'merchant' && (
              <div>
                {/* 5-Step Stepper Bar */}
                <div className={styles.stepperTrack}>
                  <div
                    className={[
                      styles.stepItem,
                      merchantStep === 1 ? styles.stepActive : merchantStep > 1 ? styles.stepDone : '',
                    ].join(' ')}
                  >
                    <span className={styles.stepBadge}>{merchantStep > 1 ? '✓' : '1'}</span>
                    <span>Basic</span>
                  </div>
                  <div className={[styles.stepConnector, merchantStep > 1 ? styles.stepConnectorDone : ''].join(' ')} />

                  <div
                    className={[
                      styles.stepItem,
                      merchantStep === 2 ? styles.stepActive : merchantStep > 2 ? styles.stepDone : '',
                    ].join(' ')}
                  >
                    <span className={styles.stepBadge}>{merchantStep > 2 ? '✓' : '2'}</span>
                    <span>Business</span>
                  </div>
                  <div className={[styles.stepConnector, merchantStep > 2 ? styles.stepConnectorDone : ''].join(' ')} />

                  <div
                    className={[
                      styles.stepItem,
                      merchantStep === 3 ? styles.stepActive : merchantStep > 3 ? styles.stepDone : '',
                    ].join(' ')}
                  >
                    <span className={styles.stepBadge}>{merchantStep > 3 ? '✓' : '3'}</span>
                    <span>Verification</span>
                  </div>
                  <div className={[styles.stepConnector, merchantStep > 3 ? styles.stepConnectorDone : ''].join(' ')} />

                  <div
                    className={[
                      styles.stepItem,
                      merchantStep === 4 ? styles.stepActive : merchantStep > 4 ? styles.stepDone : '',
                    ].join(' ')}
                  >
                    <span className={styles.stepBadge}>{merchantStep > 4 ? '✓' : '4'}</span>
                    <span>Collection</span>
                  </div>
                  <div className={[styles.stepConnector, merchantStep > 4 ? styles.stepConnectorDone : ''].join(' ')} />

                  <div
                    className={[
                      styles.stepItem,
                      merchantStep === 5 ? styles.stepActive : '',
                    ].join(' ')}
                  >
                    <span className={styles.stepBadge}>5</span>
                    <span>Payment</span>
                  </div>
                </div>

                {/* Merchant Step 1: Basic Details */}
                {merchantStep === 1 && (
                  <div className={styles.form}>
                    <div className={styles.headerLeft}>
                      <h1 className={styles.title}>Basic Details</h1>
                      <p className={styles.subtitle}>Enter owner and shop identification.</p>
                    </div>

                    <div className={styles.fieldGroup}>
                      <label className={styles.fieldLabel}>Owner Name *</label>
                      <input
                        type="text"
                        className={styles.textInput}
                        placeholder="e.g. Ramesh Kumar"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        autoFocus
                      />
                    </div>

                    <div className={styles.fieldGroup}>
                      <label className={styles.fieldLabel}>Mobile Number</label>
                      <div className={styles.readOnlyInput}>
                        <span>{formattedPhone}</span>
                        <span className={styles.verifiedPill}>
                          <Check size={12} strokeWidth={3} /> Verified
                        </span>
                      </div>
                    </div>

                    <div className={styles.fieldGroup}>
                      <label className={styles.fieldLabel}>Email Address (Optional)</label>
                      <input
                        type="email"
                        className={styles.textInput}
                        placeholder="e.g. rameshmetals@gmail.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>

                    <div className={styles.fieldGroup}>
                      <label className={styles.fieldLabel}>Shop / Business Name *</label>
                      <input
                        type="text"
                        className={styles.textInput}
                        placeholder="e.g. Sri Balaji Metals & Scrap"
                        value={shopName}
                        onChange={(e) => setShopName(e.target.value)}
                        required
                      />
                    </div>

                    {error && <div className={styles.errorBanner}>{error}</div>}

                    <Button
                      fullWidth
                      size="lg"
                      onClick={() => {
                        if (!name.trim()) {
                          setError('Please enter owner name.');
                          return;
                        }
                        if (!shopName.trim()) {
                          setError('Please enter shop / business name.');
                          return;
                        }
                        setError('');
                        setMerchantStep(2);
                      }}
                      icon={<ArrowRight size={18} />}
                    >
                      Continue
                    </Button>
                  </div>
                )}

                {/* Merchant Step 2: Business Details */}
                {merchantStep === 2 && (
                  <div className={styles.form}>
                    <div className={styles.headerLeft}>
                      <h1 className={styles.title}>Business Details</h1>
                      <p className={styles.subtitle}>Provide your shop address and operational area.</p>
                    </div>

                    <div className={styles.fieldGroup}>
                      <label className={styles.fieldLabel}>Business / Shop Address *</label>
                      <input
                        type="text"
                        className={styles.textInput}
                        placeholder="e.g. No. 12, GST Road, Guindy"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        required
                        autoFocus
                      />
                    </div>

                    <div className={styles.fieldGroup}>
                      <label className={styles.fieldLabel}>Location Pin</label>
                      <div
                        className={styles.readOnlyInput}
                        style={{ cursor: 'pointer' }}
                        onClick={() => setLocationPinned(!locationPinned)}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <MapPin size={16} color="#D97706" />
                          <span>
                            {locationPinned
                              ? 'Location Pinned (Chennai, Tamil Nadu)'
                              : 'Click to Pin Current Location'}
                          </span>
                        </div>
                        <span className={styles.verifiedPill}>
                          {locationPinned ? 'GPS Active' : 'Tap to Pin'}
                        </span>
                      </div>
                    </div>

                    <div className={styles.twoColRow}>
                      <div className={styles.fieldGroup}>
                        <label className={styles.fieldLabel}>City / Area *</label>
                        <input
                          type="text"
                          className={styles.textInput}
                          placeholder="e.g. Guindy / Broadway"
                          value={cityArea}
                          onChange={(e) => setCityArea(e.target.value)}
                          required
                        />
                      </div>
                      <div className={styles.fieldGroup}>
                        <label className={styles.fieldLabel}>PIN Code *</label>
                        <input
                          type="text"
                          maxLength={6}
                          className={styles.textInput}
                          placeholder="600032"
                          value={pincode}
                          onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                          required
                        />
                      </div>
                    </div>

                    <div className={styles.fieldGroup}>
                      <label className={styles.fieldLabel}>Years in Business (Optional)</label>
                      <input
                        type="text"
                        className={styles.textInput}
                        placeholder="e.g. 8 years"
                        value={yearsInBusiness}
                        onChange={(e) => setYearsInBusiness(e.target.value)}
                      />
                    </div>

                    {error && <div className={styles.errorBanner}>{error}</div>}

                    <div className={styles.actionsRow}>
                      <button
                        type="button"
                        className={styles.secondaryBackBtn}
                        onClick={() => {
                          setError('');
                          setMerchantStep(1);
                        }}
                      >
                        Back
                      </button>
                      <Button
                        size="lg"
                        style={{ flex: 1 }}
                        onClick={() => {
                          if (!address.trim()) {
                            setError('Please enter business address.');
                            return;
                          }
                          if (!cityArea.trim()) {
                            setError('Please enter city / area.');
                            return;
                          }
                          setError('');
                          setMerchantStep(3);
                        }}
                        icon={<ArrowRight size={18} />}
                      >
                        Continue
                      </Button>
                    </div>
                  </div>
                )}

                {/* Merchant Step 3: Business Verification */}
                {merchantStep === 3 && (
                  <div className={styles.form}>
                    <div className={styles.headerLeft}>
                      <h1 className={styles.title}>Business Verification</h1>
                      <p className={styles.subtitle}>Upload identification and proof documents.</p>
                    </div>

                    <div className={styles.uploadCardsGrid}>
                      {/* PAN - Required */}
                      <div className={styles.uploadCard}>
                        <div className={styles.uploadCardHeader}>
                          <span className={styles.docTitle}>PAN Card</span>
                          <span className={styles.requiredBadge}>Required</span>
                        </div>
                        {panUploaded ? (
                          <div className={styles.uploadedStatus}>
                            <Check size={14} /> <span>PAN_Card_Verified.pdf</span>
                          </div>
                        ) : (
                          <button
                            type="button"
                            className={styles.uploadTriggerBtn}
                            onClick={() => setPanUploaded(true)}
                          >
                            <Upload size={14} /> <span>Upload Document</span>
                          </button>
                        )}
                      </div>

                      {/* Aadhaar - Required */}
                      <div className={styles.uploadCard}>
                        <div className={styles.uploadCardHeader}>
                          <span className={styles.docTitle}>Aadhaar / ID Proof</span>
                          <span className={styles.requiredBadge}>Required</span>
                        </div>
                        {aadhaarUploaded ? (
                          <div className={styles.uploadedStatus}>
                            <Check size={14} /> <span>Aadhaar_Verified.pdf</span>
                          </div>
                        ) : (
                          <button
                            type="button"
                            className={styles.uploadTriggerBtn}
                            onClick={() => setAadhaarUploaded(true)}
                          >
                            <Upload size={14} /> <span>Upload Document</span>
                          </button>
                        )}
                      </div>

                      {/* Shop Proof / Photo - Required */}
                      <div className={styles.uploadCard}>
                        <div className={styles.uploadCardHeader}>
                          <span className={styles.docTitle}>Shop Proof / Photo</span>
                          <span className={styles.requiredBadge}>Required</span>
                        </div>
                        {shopProofUploaded ? (
                          <div className={styles.uploadedStatus}>
                            <Check size={14} /> <span>Shop_Front_Photo.jpg</span>
                          </div>
                        ) : (
                          <button
                            type="button"
                            className={styles.uploadTriggerBtn}
                            onClick={() => setShopProofUploaded(true)}
                          >
                            <Upload size={14} /> <span>Upload Photo</span>
                          </button>
                        )}
                      </div>

                      {/* Owner Photo - Required */}
                      <div className={styles.uploadCard}>
                        <div className={styles.uploadCardHeader}>
                          <span className={styles.docTitle}>Owner Photo</span>
                          <span className={styles.requiredBadge}>Required</span>
                        </div>
                        {ownerPhotoUploaded ? (
                          <div className={styles.uploadedStatus}>
                            <Check size={14} /> <span>Owner_Photo.jpg</span>
                          </div>
                        ) : (
                          <button
                            type="button"
                            className={styles.uploadTriggerBtn}
                            onClick={() => setOwnerPhotoUploaded(true)}
                          >
                            <Upload size={14} /> <span>Upload Photo</span>
                          </button>
                        )}
                      </div>

                      {/* GSTIN - Optional */}
                      <div className={styles.uploadCard}>
                        <div className={styles.uploadCardHeader}>
                          <span className={styles.docTitle}>GSTIN</span>
                          <span className={styles.optionalBadge}>Optional</span>
                        </div>
                        {gstinUploaded ? (
                          <div className={styles.uploadedStatus}>
                            <Check size={14} /> <span>GST_Certificate.pdf</span>
                          </div>
                        ) : (
                          <button
                            type="button"
                            className={styles.uploadTriggerBtn}
                            onClick={() => setGstinUploaded(true)}
                          >
                            <Upload size={14} /> <span>Upload Document</span>
                          </button>
                        )}
                      </div>

                      {/* Trade / Business License - Optional */}
                      <div className={styles.uploadCard}>
                        <div className={styles.uploadCardHeader}>
                          <span className={styles.docTitle}>Trade License</span>
                          <span className={styles.optionalBadge}>Optional</span>
                        </div>
                        {tradeLicenseUploaded ? (
                          <div className={styles.uploadedStatus}>
                            <Check size={14} /> <span>Trade_License.pdf</span>
                          </div>
                        ) : (
                          <button
                            type="button"
                            className={styles.uploadTriggerBtn}
                            onClick={() => setTradeLicenseUploaded(true)}
                          >
                            <Upload size={14} /> <span>Upload Document</span>
                          </button>
                        )}
                      </div>
                    </div>

                    <div className={styles.actionsRow}>
                      <button
                        type="button"
                        className={styles.secondaryBackBtn}
                        onClick={() => setMerchantStep(2)}
                      >
                        Back
                      </button>
                      <Button
                        size="lg"
                        style={{ flex: 1 }}
                        onClick={() => {
                          // Allow progressive flow without blocking demo testers
                          setMerchantStep(4);
                        }}
                        icon={<ArrowRight size={18} />}
                      >
                        Continue
                      </Button>
                    </div>
                  </div>
                )}

                {/* Merchant Step 4: Collection Details */}
                {merchantStep === 4 && (
                  <div className={styles.form}>
                    <div className={styles.headerLeft}>
                      <h1 className={styles.title}>Collection Details</h1>
                      <p className={styles.subtitle}>Specify scrap handling and collection capabilities.</p>
                    </div>

                    {/* Question 1: Direct industry connection */}
                    <div className={styles.fieldGroup}>
                      <label className={styles.fieldLabel}>
                        Do you directly connect with recycling industries?
                      </label>
                      <div className={styles.segmentedGroup}>
                        <button
                          type="button"
                          className={[
                            styles.segmentBtn,
                            directIndustry ? styles.segmentBtnActive : '',
                          ].join(' ')}
                          onClick={() => setDirectIndustry(true)}
                        >
                          Yes
                        </button>
                        <button
                          type="button"
                          className={[
                            styles.segmentBtn,
                            !directIndustry ? styles.segmentBtnActive : '',
                          ].join(' ')}
                          onClick={() => setDirectIndustry(false)}
                        >
                          No
                        </button>
                      </div>
                    </div>

                    {/* Question 2: Vehicle Available */}
                    <div className={styles.fieldGroup}>
                      <label className={styles.fieldLabel}>Do you have a vehicle?</label>
                      <div className={styles.segmentedGroup}>
                        <button
                          type="button"
                          className={[
                            styles.segmentBtn,
                            hasVehicle ? styles.segmentBtnActive : '',
                          ].join(' ')}
                          onClick={() => setHasVehicle(true)}
                        >
                          Yes
                        </button>
                        <button
                          type="button"
                          className={[
                            styles.segmentBtn,
                            !hasVehicle ? styles.segmentBtnActive : '',
                          ].join(' ')}
                          onClick={() => setHasVehicle(false)}
                        >
                          No
                        </button>
                      </div>
                    </div>

                    {/* Conditional Vehicle Fields (Only if hasVehicle === true) */}
                    {hasVehicle && (
                      <>
                        <div className={styles.fieldGroup}>
                          <label className={styles.fieldLabel}>Vehicle Count</label>
                          <div className={styles.pillsWrap}>
                            {[1, 2, 3, 4].map((count) => (
                              <button
                                key={count}
                                type="button"
                                className={[
                                  styles.selectPill,
                                  vehicleCount === count ? styles.selectPillActive : '',
                                ].join(' ')}
                                onClick={() => setVehicleCount(count)}
                              >
                                {count === 4 ? '4+ Vehicles' : `${count} Vehicle`}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className={styles.fieldGroup}>
                          <label className={styles.fieldLabel}>Vehicle Type</label>
                          <div className={styles.pillsWrap}>
                            {['Tricycle', 'Auto', 'Van', 'Truck'].map((t) => (
                              <button
                                key={t}
                                type="button"
                                className={[
                                  styles.selectPill,
                                  vehicleType === t ? styles.selectPillActive : '',
                                ].join(' ')}
                                onClick={() => setVehicleType(t)}
                              >
                                {t}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className={styles.fieldGroup}>
                          <label className={styles.fieldLabel}>Vehicle Capacity</label>
                          <div className={styles.pillsWrap}>
                            {['200 kg', '500 kg', '1 Ton', '3 Ton', 'More'].map((cap) => (
                              <button
                                key={cap}
                                type="button"
                                className={[
                                  styles.selectPill,
                                  vehicleCapacity === cap ? styles.selectPillActive : '',
                                ].join(' ')}
                                onClick={() => setVehicleCapacity(cap)}
                              >
                                {cap}
                              </button>
                            ))}
                          </div>
                        </div>
                      </>
                    )}

                    {/* Service Area / Preferred Areas */}
                    <div className={styles.fieldGroup}>
                      <label className={styles.fieldLabel}>
                        Service Area / Preferred Areas in Chennai
                      </label>
                      <div className={styles.pillsWrap}>
                        {CHENNAI_AREAS.map((area) => (
                          <button
                            key={area}
                            type="button"
                            className={[
                              styles.selectPill,
                              preferredAreas.includes(area) ? styles.selectPillActive : '',
                            ].join(' ')}
                            onClick={() => togglePreferredArea(area)}
                          >
                            {preferredAreas.includes(area) && <Check size={12} />} {area}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Types of Scrap Handled */}
                    <div className={styles.fieldGroup}>
                      <label className={styles.fieldLabel}>Types of Scrap Handled</label>
                      <div className={styles.checkboxesGrid}>
                        {SCRAP_CHECKBOXES.map((type) => {
                          const isChecked = selectedScrapTypes.includes(type);
                          return (
                            <div
                              key={type}
                              className={[
                                styles.checkItem,
                                isChecked ? styles.checkItemActive : '',
                              ].join(' ')}
                              onClick={() => toggleScrapType(type)}
                            >
                              <div className={styles.customCheckbox}>
                                <Check size={12} strokeWidth={3} />
                              </div>
                              <span>{type}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className={styles.actionsRow}>
                      <button
                        type="button"
                        className={styles.secondaryBackBtn}
                        onClick={() => setMerchantStep(3)}
                      >
                        Back
                      </button>
                      <Button
                        size="lg"
                        style={{ flex: 1 }}
                        onClick={() => setMerchantStep(5)}
                        icon={<ArrowRight size={18} />}
                      >
                        Continue
                      </Button>
                    </div>
                  </div>
                )}

                {/* Merchant Step 5: Payment Details */}
                {merchantStep === 5 && (
                  <form onSubmit={handleFinalSubmit} className={styles.form}>
                    <div className={styles.headerLeft}>
                      <h1 className={styles.title}>Payment Details</h1>
                      <p className={styles.subtitle}>Set up direct digital payouts for scrap trades.</p>
                    </div>

                    <div className={styles.fieldGroup}>
                      <label className={styles.fieldLabel}>UPI ID (for Instant Payouts)</label>
                      <input
                        type="text"
                        className={styles.textInput}
                        placeholder="e.g. ramesh@okhdfcbank"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        autoFocus
                      />
                    </div>

                    <div className={styles.noticeBox}>
                      <Info size={18} />
                      <span>
                        <strong>Bank Account:</strong> Optional / Can be added later anytime from
                        your Merchant Dashboard settings.
                      </span>
                    </div>

                    <div className={styles.fieldGroup}>
                      <label className={styles.fieldLabel}>Bank Account Number (Optional)</label>
                      <input
                        type="text"
                        className={styles.textInput}
                        placeholder="e.g. 50100234567890"
                        value={bankAccount}
                        onChange={(e) => setBankAccount(e.target.value)}
                      />
                    </div>

                    <div className={styles.twoColRow}>
                      <div className={styles.fieldGroup}>
                        <label className={styles.fieldLabel}>IFSC Code (Optional)</label>
                        <input
                          type="text"
                          className={styles.textInput}
                          placeholder="HDFC0001234"
                          value={ifsc}
                          onChange={(e) => setIfsc(e.target.value.toUpperCase())}
                        />
                      </div>
                      <div className={styles.fieldGroup}>
                        <label className={styles.fieldLabel}>Bank Name (Optional)</label>
                        <input
                          type="text"
                          className={styles.textInput}
                          placeholder="HDFC Bank"
                          value={bankName}
                          onChange={(e) => setBankName(e.target.value)}
                        />
                      </div>
                    </div>

                    {error && <div className={styles.errorBanner}>{error}</div>}

                    <div className={styles.actionsRow}>
                      <button
                        type="button"
                        className={styles.secondaryBackBtn}
                        onClick={() => setMerchantStep(4)}
                      >
                        Back
                      </button>
                      <Button
                        type="submit"
                        size="lg"
                        style={{ flex: 1 }}
                        loading={loading}
                        icon={<CheckCircle2 size={18} />}
                      >
                        {loading ? 'Completing Registration...' : 'Complete Registration'}
                      </Button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* --------------------------------------------------------------------- */}
            {/* D. AGGREGATOR REGISTRATION */}
            {/* --------------------------------------------------------------------- */}
            {selectedRole === 'aggregator' && (
              <div>
                <div className={styles.headerLeft}>
                  <h1 className={styles.title}>Register as Scrap Aggregator</h1>
                  <p className={styles.subtitle}>
                    Collect, manage and trade bulk scrap across your operational hubs.
                  </p>
                </div>

                <form onSubmit={handleFinalSubmit} className={styles.form}>
                  <div className={styles.fieldGroup}>
                    <label className={styles.fieldLabel}>Aggregator / Organization Name *</label>
                    <input
                      type="text"
                      className={styles.textInput}
                      placeholder="e.g. Greater Chennai Recycling Aggregators"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      required
                      autoFocus
                    />
                  </div>

                  <div className={styles.fieldGroup}>
                    <label className={styles.fieldLabel}>Authorized Representative Name *</label>
                    <input
                      type="text"
                      className={styles.textInput}
                      placeholder="e.g. K. Murugesan"
                      value={contactPerson}
                      onChange={(e) => setContactPerson(e.target.value)}
                      required
                    />
                  </div>

                  <div className={styles.fieldGroup}>
                    <label className={styles.fieldLabel}>Mobile Number</label>
                    <div className={styles.readOnlyInput}>
                      <span>{formattedPhone}</span>
                      <span className={styles.verifiedPill}>
                        <Check size={12} strokeWidth={3} /> Verified
                      </span>
                    </div>
                  </div>

                  <div className={styles.fieldGroup}>
                    <label className={styles.fieldLabel}>Official Email Address (Optional)</label>
                    <input
                      type="email"
                      className={styles.textInput}
                      placeholder="e.g. operations@chennairecycle.in"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <div className={styles.fieldGroup}>
                    <label className={styles.fieldLabel}>
                      Primary Processing Facility / Hubs in Chennai *
                    </label>
                    <input
                      type="text"
                      className={styles.textInput}
                      placeholder="e.g. Manali Recycling Yard / Madhavaram Logistics Hub"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      required
                    />
                  </div>

                  <div className={styles.fieldGroup}>
                    <label className={styles.fieldLabel}>Estimated Daily Processing Capacity</label>
                    <div className={styles.pillsWrap}>
                      {['1–3 Tons', '5–10 Tons', '15–30 Tons', '50+ Tons / Day'].map((cap) => (
                        <button
                          key={cap}
                          type="button"
                          className={[
                            styles.selectPill,
                            dailyCapacity === cap ? styles.selectPillActive : '',
                          ].join(' ')}
                          onClick={() => setDailyCapacity(cap)}
                        >
                          {cap}
                        </button>
                      ))}
                    </div>
                  </div>

                  {error && <div className={styles.errorBanner}>{error}</div>}

                  <Button
                    type="submit"
                    fullWidth
                    size="lg"
                    loading={loading}
                    icon={<ArrowRight size={18} />}
                  >
                    {loading ? 'Setting up Network...' : 'Complete Aggregator Registration'}
                  </Button>
                </form>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
