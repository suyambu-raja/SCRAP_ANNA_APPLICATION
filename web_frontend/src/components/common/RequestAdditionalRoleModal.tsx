import { useState } from 'react';
import {
  X,
  ShieldCheck,
  Building2,
  Store,
  Home as HomeIcon,
  Upload,
  CheckCircle2,
  Info,
  ArrowRight,
  Clock,
  FileText,
} from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import type { UserRole } from '@/types';
import styles from './RequestAdditionalRoleModal.module.css';

interface RequestAdditionalRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function RequestAdditionalRoleModal({ isOpen, onClose }: RequestAdditionalRoleModalProps) {
  const user = useAuthStore((s) => s.user);
  const currentRole = user?.role || 'household';

  // Target Role Selection (default to an alternative role)
  const defaultTargetRole: UserRole =
    currentRole === 'household' ? 'merchant' : currentRole === 'merchant' ? 'industry' : 'household';
  const [targetRole, setTargetRole] = useState<UserRole>(defaultTargetRole);

  // Form Fields State
  const [businessName, setBusinessName] = useState('');
  const [address, setAddress] = useState('');
  const [area, setArea] = useState('Guindy, Chennai');
  const [vehicleType, setVehicleType] = useState('Auto / 3-Wheeler');
  const [vehicleNumber, setVehicleNumber] = useState('TN 09 AB 1234');
  const [gstin, setGstin] = useState('33AAAAA0000A1Z5');
  const [weighbridgeCapacity, setWeighbridgeCapacity] = useState('60 Tons Electronic Platform');
  const [docUploaded, setDocUploaded] = useState(false);

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      // Record verification request locally
      const existingReqs = JSON.parse(localStorage.getItem('sa_additional_role_requests') || '[]');
      const newReq = {
        id: `REQ-${Date.now()}`,
        userId: user?.id,
        userPhone: user?.phone,
        currentRole,
        requestedRole: targetRole,
        businessName: businessName || (targetRole === 'merchant' ? 'Chennai Scrap Depot' : 'Industrial Facility'),
        address,
        area,
        submittedAt: new Date().toISOString(),
        status: 'under_verification',
      };
      localStorage.setItem('sa_additional_role_requests', JSON.stringify([...existingReqs, newReq]));

      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 600);
  };

  const handleDone = () => {
    setIsSubmitted(false);
    onClose();
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.modalHeader}>
          <div className={styles.modalHeaderLeft}>
            <div className={styles.modalHeaderIcon}>
              <ShieldCheck size={22} />
            </div>
            <div>
              <h2 className={styles.modalTitle}>Request Additional Role</h2>
              <p className={styles.modalSubtitle}>Apply for multi-profile verification on Bill Scrap</p>
            </div>
          </div>
          <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        {isSubmitted ? (
          <div className={styles.successState}>
            <div className={styles.successIcon}>
              <CheckCircle2 size={36} />
            </div>
            <span className={styles.underReviewPill}>
              <Clock size={14} /> Verification Under Review
            </span>
            <h3 className={styles.successTitle}>Request Submitted Successfully!</h3>
            <p className={styles.successDesc}>
              Your application to activate the <strong>{targetRole.toUpperCase()}</strong> profile for{' '}
              <strong>{user?.phone}</strong> has been received. Our Chennai operations team will review your business &amp; identity documents within 24 hours.
            </p>
            <button type="button" className={styles.submitBtn} onClick={handleDone}>
              Understood
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className={styles.modalBody}>
              {/* Current Active Role */}
              <div className={styles.currentRoleBanner}>
                <div className={styles.currentRoleLeft}>
                  <span className={styles.currentRoleLabel}>Current Active Account</span>
                  <span className={styles.currentRoleValue}>{currentRole.toUpperCase()} PROFILE</span>
                </div>
                <span className={styles.verifiedBadge}>
                  <ShieldCheck size={13} />
                  <span>VERIFIED</span>
                </span>
              </div>

              {/* Requirement Notice */}
              <div className={styles.infoNotice}>
                <Info size={16} className={styles.infoIcon} />
                <span>
                  Each role requires separate identity, address, and license verifications. Role changes cannot be done instantly via dropdown.
                </span>
              </div>

              {/* Choose Role */}
              <div>
                <div className={styles.sectionTitle}>1. Select New Role to Request</div>
                <div className={styles.roleSelectGrid}>
                  {currentRole !== 'household' && (
                    <div
                      className={[styles.roleOptionCard, targetRole === 'household' ? styles.roleOptionActive : ''].join(
                        ' '
                      )}
                      onClick={() => setTargetRole('household')}
                    >
                      <div className={styles.roleOptionIcon}>
                        <HomeIcon size={20} />
                      </div>
                      <span className={styles.roleOptionTitle}>Household</span>
                      <span className={styles.roleOptionDesc}>Sell residential scrap from home</span>
                    </div>
                  )}

                  {currentRole !== 'merchant' && (
                    <div
                      className={[styles.roleOptionCard, targetRole === 'merchant' ? styles.roleOptionActive : ''].join(
                        ' '
                      )}
                      onClick={() => setTargetRole('merchant')}
                    >
                      <div className={styles.roleOptionIcon}>
                        <Store size={20} />
                      </div>
                      <span className={styles.roleOptionTitle}>Merchant</span>
                      <span className={styles.roleOptionDesc}>Collect doorstep pickups &amp; bid</span>
                    </div>
                  )}

                  {currentRole !== 'industry' && (
                    <div
                      className={[styles.roleOptionCard, targetRole === 'industry' ? styles.roleOptionActive : ''].join(
                        ' '
                      )}
                      onClick={() => setTargetRole('industry')}
                    >
                      <div className={styles.roleOptionIcon}>
                        <Building2 size={20} />
                      </div>
                      <span className={styles.roleOptionTitle}>Industry</span>
                      <span className={styles.roleOptionDesc}>Post bulk factory requisitions</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Required Details based on Selected Role */}
              <div className={styles.formFields}>
                <div className={styles.sectionTitle}>2. Verification Information</div>

                {targetRole === 'merchant' && (
                  <>
                    <div className={styles.fieldGroup}>
                      <label className={styles.fieldLabel}>Shop / Trading Name</label>
                      <input
                        type="text"
                        className={styles.inputField}
                        placeholder="e.g. Ramesh Scrap Traders"
                        value={businessName}
                        onChange={(e) => setBusinessName(e.target.value)}
                        required
                      />
                    </div>
                    <div className={styles.fieldGroup}>
                      <label className={styles.fieldLabel}>Shop / Yard Address in Chennai</label>
                      <input
                        type="text"
                        className={styles.inputField}
                        placeholder="Plot No., Street, Area, Chennai"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        required
                      />
                    </div>
                    <div className={styles.fieldGroup}>
                      <label className={styles.fieldLabel}>Pickup Vehicle Type &amp; Reg. Number</label>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                        <input
                          type="text"
                          className={styles.inputField}
                          value={vehicleType}
                          onChange={(e) => setVehicleType(e.target.value)}
                          placeholder="Auto / Tata Ace"
                        />
                        <input
                          type="text"
                          className={styles.inputField}
                          value={vehicleNumber}
                          onChange={(e) => setVehicleNumber(e.target.value)}
                          placeholder="TN 09 AB 1234"
                        />
                      </div>
                    </div>
                  </>
                )}

                {targetRole === 'industry' && (
                  <>
                    <div className={styles.fieldGroup}>
                      <label className={styles.fieldLabel}>Company / Factory Registered Name</label>
                      <input
                        type="text"
                        className={styles.inputField}
                        placeholder="e.g. Precision Engineering Works Pvt Ltd"
                        value={businessName}
                        onChange={(e) => setBusinessName(e.target.value)}
                        required
                      />
                    </div>
                    <div className={styles.fieldGroup}>
                      <label className={styles.fieldLabel}>Factory / Plant Address (SIDCO/SIPCOT)</label>
                      <input
                        type="text"
                        className={styles.inputField}
                        placeholder="Industrial Estate, Area, Chennai"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        required
                      />
                    </div>
                    <div className={styles.fieldGroup}>
                      <label className={styles.fieldLabel}>GSTIN Number</label>
                      <input
                        type="text"
                        className={styles.inputField}
                        value={gstin}
                        onChange={(e) => setGstin(e.target.value)}
                        required
                      />
                    </div>
                    <div className={styles.fieldGroup}>
                      <label className={styles.fieldLabel}>Weighbridge Platform Capacity</label>
                      <input
                        type="text"
                        className={styles.inputField}
                        value={weighbridgeCapacity}
                        onChange={(e) => setWeighbridgeCapacity(e.target.value)}
                      />
                    </div>
                  </>
                )}

                {targetRole === 'household' && (
                  <>
                    <div className={styles.fieldGroup}>
                      <label className={styles.fieldLabel}>Residential Address</label>
                      <input
                        type="text"
                        className={styles.inputField}
                        placeholder="Door No, Street, Apartment Name"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        required
                      />
                    </div>
                    <div className={styles.fieldGroup}>
                      <label className={styles.fieldLabel}>Chennai Area &amp; Pincode</label>
                      <input
                        type="text"
                        className={styles.inputField}
                        value={area}
                        onChange={(e) => setArea(e.target.value)}
                        required
                      />
                    </div>
                  </>
                )}

                {/* Upload Verification Document Simulation */}
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>Identity / Business Document Proof</label>
                  <div className={[styles.uploadRow, docUploaded ? styles.uploadRowActive : ''].join(' ')}>
                    <div className={styles.uploadInfo}>
                      <FileText size={18} />
                      <span>{docUploaded ? '✓ Document Uploaded (trade_license_chennai.pdf)' : 'Upload Aadhaar / PAN / Trade License (PDF/JPG)'}</span>
                    </div>
                    <button
                      type="button"
                      className={styles.uploadBtn}
                      onClick={() => setDocUploaded(!docUploaded)}
                    >
                      {docUploaded ? 'Change' : 'Browse File'}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className={styles.modalFooter}>
              <button type="button" className={styles.cancelBtn} onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Submit for Verification'}
                <ArrowRight size={16} />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
