import { useState } from 'react';
import {
  X,
  ShieldCheck,
  Building2,
  Store,
  Home as HomeIcon,
  CheckCircle2,
  ArrowRight,
  Clock,
  FileText,
} from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import type { UserRole } from '@/types';
import styles from './RequestAdditionalRoleModal.module.css';
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock';

interface RequestAdditionalRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function RequestAdditionalRoleModal({ isOpen, onClose }: RequestAdditionalRoleModalProps) {
  useBodyScrollLock(isOpen);
  const user = useAuthStore((s) => s.user);
  const currentRole = user?.role || 'household';

  // Target Role Selection
  const defaultTargetRole: UserRole =
    currentRole === 'household' ? 'merchant' : currentRole === 'merchant' ? 'industry' : 'household';
  const [targetRole, setTargetRole] = useState<UserRole>(defaultTargetRole);

  // Form Fields State
  const [businessName, setBusinessName] = useState('');
  const [address, setAddress] = useState('');
  const [area, setArea] = useState('Guindy, Chennai');
  const [vehicleNumber, setVehicleNumber] = useState('TN 09 AB 1234');
  const [gstin, setGstin] = useState('33AAAAA0000A1Z5');
  const [docUploaded, setDocUploaded] = useState(false);

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
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
    }, 500);
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
              <ShieldCheck size={20} />
            </div>
            <div>
              <h2 className={styles.modalTitle}>Request Role</h2>
              <p className={styles.modalSubtitle}>Apply for Merchant or Industry account</p>
            </div>
          </div>
          <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        {isSubmitted ? (
          <div className={styles.successState}>
            <div className={styles.successIcon}>
              <CheckCircle2 size={32} />
            </div>
            <span className={styles.underReviewPill}>
              <Clock size={13} /> Under Review
            </span>
            <h3 className={styles.successTitle}>Request Submitted</h3>
            <p className={styles.successDesc}>
              Your request for <strong>{targetRole.toUpperCase()}</strong> has been received. Our team will verify your details within 24 hours.
            </p>
            <button type="button" className={styles.submitBtn} onClick={handleDone}>
              Understood
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className={styles.formContent}>
            <div className={styles.modalBody}>
              {/* Choose Role */}
              <div className={styles.fieldSection}>
                <span className={styles.sectionTitle}>Select Role</span>
                <div className={styles.roleSelectGrid}>
                  {currentRole !== 'merchant' && (
                    <div
                      className={[styles.roleOptionCard, targetRole === 'merchant' ? styles.roleOptionActive : ''].join(' ')}
                      onClick={() => setTargetRole('merchant')}
                      role="button"
                      tabIndex={0}
                    >
                      <div className={styles.roleOptionIcon}>
                        <Store size={18} />
                      </div>
                      <span className={styles.roleOptionTitle}>Merchant</span>
                      <span className={styles.roleOptionDesc}>Collect scrap &amp; bid</span>
                    </div>
                  )}

                  {currentRole !== 'industry' && (
                    <div
                      className={[styles.roleOptionCard, targetRole === 'industry' ? styles.roleOptionActive : ''].join(' ')}
                      onClick={() => setTargetRole('industry')}
                      role="button"
                      tabIndex={0}
                    >
                      <div className={styles.roleOptionIcon}>
                        <Building2 size={18} />
                      </div>
                      <span className={styles.roleOptionTitle}>Industry</span>
                      <span className={styles.roleOptionDesc}>Bulk scrap buyer</span>
                    </div>
                  )}

                  {currentRole !== 'household' && (
                    <div
                      className={[styles.roleOptionCard, targetRole === 'household' ? styles.roleOptionActive : ''].join(' ')}
                      onClick={() => setTargetRole('household')}
                      role="button"
                      tabIndex={0}
                    >
                      <div className={styles.roleOptionIcon}>
                        <HomeIcon size={18} />
                      </div>
                      <span className={styles.roleOptionTitle}>Household</span>
                      <span className={styles.roleOptionDesc}>Sell home scrap</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Form Fields based on role */}
              <div className={styles.formFields}>
                {targetRole === 'merchant' && (
                  <>
                    <div className={styles.fieldGroup}>
                      <label className={styles.fieldLabel}>Shop / Business Name</label>
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
                      <label className={styles.fieldLabel}>Shop Address</label>
                      <input
                        type="text"
                        className={styles.inputField}
                        placeholder="Street, Area, Chennai"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        required
                      />
                    </div>
                    <div className={styles.fieldGroup}>
                      <label className={styles.fieldLabel}>Vehicle Number</label>
                      <input
                        type="text"
                        className={styles.inputField}
                        placeholder="e.g. TN 09 AB 1234"
                        value={vehicleNumber}
                        onChange={(e) => setVehicleNumber(e.target.value)}
                      />
                    </div>
                  </>
                )}

                {targetRole === 'industry' && (
                  <>
                    <div className={styles.fieldGroup}>
                      <label className={styles.fieldLabel}>Company Name</label>
                      <input
                        type="text"
                        className={styles.inputField}
                        placeholder="e.g. Precision Engineering Works"
                        value={businessName}
                        onChange={(e) => setBusinessName(e.target.value)}
                        required
                      />
                    </div>
                    <div className={styles.fieldGroup}>
                      <label className={styles.fieldLabel}>Factory Address</label>
                      <input
                        type="text"
                        className={styles.inputField}
                        placeholder="Estate / Area, Chennai"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        required
                      />
                    </div>
                    <div className={styles.fieldGroup}>
                      <label className={styles.fieldLabel}>GSTIN</label>
                      <input
                        type="text"
                        className={styles.inputField}
                        placeholder="15-digit GST number"
                        value={gstin}
                        onChange={(e) => setGstin(e.target.value)}
                        required
                      />
                    </div>
                  </>
                )}

                {targetRole === 'household' && (
                  <>
                    <div className={styles.fieldGroup}>
                      <label className={styles.fieldLabel}>Home Address</label>
                      <input
                        type="text"
                        className={styles.inputField}
                        placeholder="Door No, Street, Apartment"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        required
                      />
                    </div>
                    <div className={styles.fieldGroup}>
                      <label className={styles.fieldLabel}>Area &amp; Pincode</label>
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

                {/* Simple Document Proof */}
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>Proof Document</label>
                  <div className={[styles.uploadRow, docUploaded ? styles.uploadRowActive : ''].join(' ')}>
                    <div className={styles.uploadInfo}>
                      <FileText size={16} className={styles.uploadIcon} />
                      <span className={styles.uploadFileName}>
                        {docUploaded ? 'license_proof.pdf' : 'Upload ID or Trade License'}
                      </span>
                    </div>
                    <button
                      type="button"
                      className={styles.uploadBtn}
                      onClick={() => setDocUploaded(!docUploaded)}
                    >
                      {docUploaded ? 'Change' : 'Upload'}
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
                {isSubmitting ? 'Submitting...' : 'Submit Request'}
                <ArrowRight size={15} />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
