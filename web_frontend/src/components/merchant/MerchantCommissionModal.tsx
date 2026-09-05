import React, { useState, useEffect } from 'react';
import {
  FiArrowLeft,
  FiX,
  FiClock,
  FiCheckCircle,
  FiAlertCircle,
} from 'react-icons/fi';
import { MdContentCopy, MdOutlinePayment } from 'react-icons/md';
import { LuIndianRupee, LuReceipt, LuShieldCheck } from 'react-icons/lu';
import {
  getCommission,
  getCompanyUpiDetails,
  createUpiPaymentIntent,
  submitCommissionPaymentReference,
  type CommissionRecord,
} from '@/services/merchantCommissionService';
import { commissionReminderService } from '@/services/commissionReminderService';
import styles from './MerchantCommissionModal.module.css';

export interface MerchantCommissionModalProps {
  orderId: string;
  customerName: string;
  finalAmount: number;
  billNumber?: string;
  merchantId?: string;
  isOpen: boolean;
  onClose: () => void;
  onContinueToOrders?: () => void;
}

export const MerchantCommissionModal: React.FC<MerchantCommissionModalProps> = ({
  orderId,
  customerName,
  finalAmount,
  billNumber,
  merchantId = 'merchant_default',
  isOpen,
  onClose,
  onContinueToOrders,
}) => {
  const [commission, setCommission] = useState<CommissionRecord | null>(null);
  const [utrInput, setUtrInput] = useState('');
  const [utrError, setUtrError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Initialize or fetch commission record
  useEffect(() => {
    if (!isOpen || !orderId) return;

    const record = getCommission(orderId, merchantId, customerName, finalAmount);
    setCommission(record);
    if (record.utr) {
      setUtrInput(record.utr);
    }
  }, [isOpen, orderId, merchantId, customerName, finalAmount]);

  if (!isOpen || !commission) return null;

  const upiDetails = getCompanyUpiDetails();

  const showToast = (msg: string) => {
    setToastMessage(msg);
    window.setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  const handleCopyUpi = async () => {
    try {
      await navigator.clipboard.writeText(upiDetails.upiId);
      setCopiedUpi(true);
      showToast('UPI ID copied to clipboard');
      window.setTimeout(() => setCopiedUpi(false), 2000);
    } catch {
      showToast('Failed to copy UPI ID');
    }
  };

  const handlePayByUpiApp = () => {
    const upiUri = createUpiPaymentIntent(commission);
    // Trigger generic mobile UPI intent deep link
    window.location.href = upiUri;
  };

  const handleSubmitUtr = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUtr = utrInput.trim();

    if (!cleanUtr) {
      setUtrError('Please enter the 12-digit UTR or Transaction Reference number.');
      return;
    }

    if (cleanUtr.length < 6) {
      setUtrError('UTR / Transaction ID must be at least 6 characters.');
      return;
    }

    setUtrError('');
    setIsSubmitting(true);

    try {
      const updated = await submitCommissionPaymentReference(orderId, cleanUtr);
      setCommission(updated);
      // Cancel 5-minute reminder since payment details have been submitted
      commissionReminderService.cancelReminder(orderId);
      showToast('Payment submitted for company verification');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to submit payment reference';
      setUtrError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePayLater = () => {
    // Schedule 5-minute reminder
    commissionReminderService.scheduleReminder(orderId, merchantId, {
      customerName,
      finalOrderAmount: finalAmount,
      commissionAmount: commission.amount,
      billNumber,
    });
    showToast('Reminder set. You will be reminded in 5 minutes.');
    onClose();
  };

  const handleClose = () => {
    if (commission.status === 'DUE') {
      handlePayLater();
    } else {
      onClose();
    }
  };

  const handleContinue = () => {
    if (onContinueToOrders) {
      onContinueToOrders();
    } else {
      onClose();
    }
  };

  return (
    <div
      className={styles.modalBackdrop}
      role="dialog"
      aria-modal="true"
      aria-labelledby="commissionModalHeading"
    >
      <div className={styles.modalCard}>
        {/* Header */}
        <div className={styles.modalHeader}>
          <div className={styles.headerLeft}>
            <button
              type="button"
              className={styles.backBtn}
              onClick={handleClose}
              aria-label="Close Commission Modal"
            >
              {commission.status === 'DUE' ? <FiArrowLeft size={16} /> : <FiX size={16} />}
            </button>
            <h2 id="commissionModalHeading" className={styles.headerTitle}>
              BillScrap Commission
            </h2>
          </div>

          {commission.status === 'DUE' && (
            <span className={styles.statusPillDue}>
              <FiClock size={11} />
              <span>Commission Due</span>
            </span>
          )}

          {commission.status === 'SUBMITTED' && (
            <span className={styles.statusPillSubmitted}>
              <FiClock size={11} />
              <span>Payment Submitted</span>
            </span>
          )}

          {commission.status === 'VERIFIED' && (
            <span className={styles.statusPillSubmitted}>
              <FiCheckCircle size={11} />
              <span>Commission Paid</span>
            </span>
          )}
        </div>

        {/* Modal Body */}
        <div className={styles.modalBody}>
          {/* STATE A: COMMISSION DUE */}
          {commission.status === 'DUE' && (
            <>
              {/* Branded Introductory Note Card */}
              <div className={styles.introNoteCard}>
                <div className={styles.introNoticePill}>
                  <FiClock size={12} />
                  <span>Commission Settlement</span>
                </div>
                <h3 className={styles.mainHeading}>Send Your Commission to BillScrap</h3>
                <p className={styles.supportingText}>
                  Your order has been successfully settled. Please pay the applicable BillScrap commission to complete this transaction.
                </p>
              </div>

              {/* Settlement Reference */}
              <div className={styles.settlementRefCard}>
                <div className={styles.refRow}>
                  <span className={styles.refLabel}>Order ID</span>
                  <span className={styles.refOrderId}>{orderId}</span>
                </div>
                <div className={styles.refRow}>
                  <span className={styles.refLabel}>Customer / Business</span>
                  <span className={styles.refCustomer}>{customerName}</span>
                </div>
                <div className={styles.refRow}>
                  <span className={styles.refLabel}>Settlement Status</span>
                  <span className={styles.settledTag}>
                    <FiCheckCircle size={13} />
                    <span>Settled</span>
                  </span>
                </div>
                {billNumber && (
                  <div className={styles.refRow}>
                    <span className={styles.refLabel}>Bill Number</span>
                    <span className={styles.refBillNumber}>{billNumber}</span>
                  </div>
                )}
              </div>

              {/* Prominent Commission Amount */}
              <div className={styles.commissionAmountBox}>
                <span className={styles.commissionAmountLabel}>BillScrap Commission</span>
                <div className={styles.commissionAmountValue}>
                  <LuIndianRupee className={styles.commissionCurrencySymbol} />
                  <span>{commission.amount.toLocaleString('en-IN')}</span>
                </div>
                <span className={styles.commissionSubtitle}>
                  Applicable company fee on settled value of <strong>₹{finalAmount.toLocaleString('en-IN')}</strong>
                </span>
              </div>

              {/* Company UPI Details */}
              <div className={styles.upiDetailsCard}>
                <div className={styles.upiDetailsHeader}>
                  <span className={styles.upiDetailsLabel}>Pay via UPI</span>
                  <span className={styles.payeeName}>{upiDetails.payeeName}</span>
                </div>

                <div className={styles.upiIdRow}>
                  <span className={styles.upiIdText}>{upiDetails.upiId}</span>
                  <button
                    type="button"
                    className={`${styles.copyBtn} ${copiedUpi ? styles.copyBtnCopied : ''}`}
                    onClick={handleCopyUpi}
                  >
                    <MdContentCopy size={13} />
                    <span>{copiedUpi ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>

                {/* Primary CTA */}
                <button
                  type="button"
                  className={styles.btnPayByUpi}
                  onClick={handlePayByUpiApp}
                >
                  <MdOutlinePayment size={18} />
                  <span>Pay by any UPI app</span>
                </button>

                <p className={styles.fallbackNote}>
                  Copy the UPI ID and pay using your preferred UPI app.
                </p>
              </div>

              {/* Payment Instructions */}
              <div className={styles.instructionSection}>
                <h4 className={styles.instructionTitle}>Payment Steps</h4>
                <ul className={styles.instructionList}>
                  <li className={styles.instructionRow}>
                    <span className={styles.stepNumber}>1</span>
                    <span>Tap "Pay by any UPI app"</span>
                  </li>
                  <li className={styles.instructionRow}>
                    <span className={styles.stepNumber}>2</span>
                    <span>Complete the payment in your UPI app</span>
                  </li>
                  <li className={styles.instructionRow}>
                    <span className={styles.stepNumber}>3</span>
                    <span>Return to BillScrap</span>
                  </li>
                  <li className={styles.instructionRow}>
                    <span className={styles.stepNumber}>4</span>
                    <span>Enter the UTR / transaction reference below</span>
                  </li>
                </ul>
              </div>

              {/* UTR Input Form */}
              <form onSubmit={handleSubmitUtr} className={styles.utrSection}>
                <label htmlFor="utrInputRef" className={styles.utrLabel}>
                  Payment Reference
                </label>
                <div className={styles.utrInputWrap}>
                  <input
                    id="utrInputRef"
                    type="text"
                    className={`${styles.utrInput} ${utrError ? styles.utrInputError : ''}`}
                    placeholder="Enter UTR / Transaction ID"
                    value={utrInput}
                    onChange={(e) => {
                      setUtrInput(e.target.value);
                      if (utrError) setUtrError('');
                    }}
                    maxLength={32}
                  />
                  {utrError && (
                    <span className={styles.errorText}>
                      <FiAlertCircle size={12} />
                      <span>{utrError}</span>
                    </span>
                  )}
                </div>

                <button
                  type="submit"
                  className={styles.btnSubmitUtr}
                  disabled={isSubmitting}
                >
                  <LuShieldCheck size={16} />
                  <span>{isSubmitting ? 'Submitting...' : "I've Made the Payment"}</span>
                </button>
              </form>

              {/* Secondary Close / Pay Later Action */}
              <button
                type="button"
                className={styles.payLaterBtn}
                onClick={handlePayLater}
              >
                <FiClock size={13} />
                <span>Pay Later (Remind in 5 mins)</span>
              </button>
            </>
          )}

          {/* STATE B: PAYMENT SUBMITTED */}
          {commission.status === 'SUBMITTED' && (
            <div className={styles.stateCardSubmitted}>
              <div className={styles.stateIconWrapSubmitted}>
                <FiClock size={22} />
              </div>

              <h3 className={styles.stateTitle}>Payment Submitted</h3>
              <p className={styles.stateMessage}>
                Your commission payment details have been submitted for verification.
              </p>

              <div className={styles.submittedDetailsGrid}>
                <div className={styles.detailRow}>
                  <span className={styles.detailRowLabel}>Order Reference</span>
                  <span className={styles.detailRowValue}>{commission.orderId}</span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailRowLabel}>Commission</span>
                  <span className={styles.detailRowValue}>
                    ₹{commission.amount.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailRowLabel}>UTR / Reference</span>
                  <span className={styles.detailRowValue}>{commission.utr}</span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailRowLabel}>Status</span>
                  <span className={styles.statusPendingBadge}>Awaiting Verification</span>
                </div>
              </div>

              <button
                type="button"
                className={styles.btnContinueOrders}
                onClick={handleContinue}
              >
                <LuReceipt size={15} />
                <span>Continue to Orders</span>
              </button>
            </div>
          )}

          {/* STATE C: PAYMENT VERIFIED */}
          {commission.status === 'VERIFIED' && (
            <div className={styles.stateCardSubmitted}>
              <div className={styles.stateIconWrapSubmitted}>
                <FiCheckCircle size={22} />
              </div>

              <h3 className={styles.stateTitle}>Commission Paid</h3>
              <p className={styles.stateMessage}>
                Your BillScrap commission has been verified.
              </p>

              <div className={styles.submittedDetailsGrid}>
                <div className={styles.detailRow}>
                  <span className={styles.detailRowLabel}>Order</span>
                  <span className={styles.detailRowValue}>{commission.orderId}</span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailRowLabel}>Commission</span>
                  <span className={styles.detailRowValue}>
                    ₹{commission.amount.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailRowLabel}>Status</span>
                  <span className={styles.settledTag}>
                    <FiCheckCircle size={12} />
                    <span>Verified</span>
                  </span>
                </div>
              </div>

              <button
                type="button"
                className={styles.btnContinueOrders}
                onClick={handleContinue}
              >
                <LuReceipt size={15} />
                <span>Continue to Orders</span>
              </button>
            </div>
          )}
        </div>

        {/* Non-intrusive Toast */}
        {toastMessage && (
          <div className={styles.toastNotice} role="status">
            <FiCheckCircle size={13} />
            <span>{toastMessage}</span>
          </div>
        )}
      </div>
    </div>
  );
};
