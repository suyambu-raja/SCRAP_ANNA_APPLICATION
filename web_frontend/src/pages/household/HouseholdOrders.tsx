import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CheckCircle2,
  MapPin,
  Calendar,
  Clock,
  User,
  Phone,
  Truck,
  Plus,
  Navigation,
  Info,
  Scale,
  ShieldCheck,
  IndianRupee,
  Star,
  ArrowRight,
  Receipt,
  FileText,
  X,
  AlertCircle,
  Eye,
  Maximize2,
} from 'lucide-react';
import styles from './HouseholdOrders.module.css';

interface OrderMediaItem {
  id: string;
  title: string;
  weight: string;
  rate: string;
  imageUrl: string;
  actualWeighedKg?: number;
  ratePerKg?: number;
  subtotal?: number;
}

// 6 Simple Stages
export type OrderLifecycleStage =
  | 'posted'
  | 'confirmed'
  | 'arriving'
  | 'pickup'
  | 'bill_confirmation'
  | 'completed'
  | 'cancelled';

interface HouseholdOrder {
  id: string;
  orderNumber: string;
  bookedDate: string;
  pickupAddress: string;
  preferredDate: string;
  preferredSlot: string;
  stage: OrderLifecycleStage;
  pickupOtp: string;
  billingOtp: string;
  merchantName?: string;
  merchantRating?: number;
  merchantPhone?: string;
  vehicleType?: string;
  vehicleRegNumber?: string;
  etaMinutes?: number;
  distanceKm?: number;
  items: OrderMediaItem[];
  finalSettledTotal?: number;
  billSlipNumber?: string;
  cancellationReason?: string;
}

const SAMPLE_ORDERS: HouseholdOrder[] = [
  {
    id: 'ord-1',
    orderNumber: 'SA12345678',
    bookedDate: '01 May 2025, 10:30 AM',
    pickupAddress: 'No. 42, 2nd Main Road, Anna Nagar, Chennai - 600040',
    preferredDate: 'Today',
    preferredSlot: '10:00 AM - 12:00 PM',
    stage: 'arriving',
    pickupOtp: '8492',
    billingOtp: '4190',
    billSlipNumber: 'SLP-2025-05-SA12345678',
    merchantName: 'Selvam Scrap Traders',
    merchantRating: 4.8,
    merchantPhone: '+91 98401 23456',
    vehicleType: 'Tata 407 Flatbed Truck',
    vehicleRegNumber: 'TN 09 BX 4421',
    etaMinutes: 12,
    distanceKm: 2.4,
    items: [
      {
        id: 'it-1',
        title: 'Copper Wires & Windings',
        weight: '2.5 KG',
        rate: '₹720 / KG',
        actualWeighedKg: 2.8,
        ratePerKg: 720,
        subtotal: 2016.0,
        imageUrl: '/scrap-copper-wire.jpg',
      },
      {
        id: 'it-2',
        title: 'Scrap Iron Rods',
        weight: '8.4 KG',
        rate: '₹38.50 / KG',
        actualWeighedKg: 9.2,
        ratePerKg: 38.5,
        subtotal: 354.2,
        imageUrl: '/scrap-iron.png',
      },
      {
        id: 'it-3',
        title: 'Corrugated Cardboard',
        weight: '12.0 KG',
        rate: '₹14.50 / KG',
        actualWeighedKg: 14.5,
        ratePerKg: 14.5,
        subtotal: 210.25,
        imageUrl: '/scrap-cardboard.png',
      },
    ],
    finalSettledTotal: 2580.45,
  },
  {
    id: 'ord-2',
    orderNumber: 'SA12345679',
    bookedDate: 'Today, 01:15 PM',
    pickupAddress: 'No. 18, 5th Cross, Anna Nagar West, Chennai - 600040',
    preferredDate: 'Tomorrow',
    preferredSlot: '04:00 PM - 07:00 PM',
    stage: 'posted',
    pickupOtp: '6104',
    billingOtp: '7823',
    billSlipNumber: 'SLP-2025-05-SA12345679',
    items: [
      {
        id: 'it-5',
        title: 'Brass Scrap & Plumbing Taps',
        weight: '1.5 KG',
        rate: '₹490 / KG',
        actualWeighedKg: 1.6,
        ratePerKg: 490,
        subtotal: 784.0,
        imageUrl: '/scrap-brass.jpg',
      },
      {
        id: 'it-6',
        title: 'Mixed Plastic Bottles & Cans',
        weight: '4.0 KG',
        rate: '₹18 / KG',
        actualWeighedKg: 4.2,
        ratePerKg: 18,
        subtotal: 75.6,
        imageUrl: '/scrap-mixed-plastic.png',
      },
    ],
    finalSettledTotal: 859.6,
  },
];

const STAGE_STEPS = [
  { id: 'posted', label: 'Request Posted' },
  { id: 'confirmed', label: 'Merchant Confirmed' },
  { id: 'arriving', label: 'Merchant Arriving' },
  { id: 'pickup', label: 'Doorstep Pickup' },
  { id: 'bill_confirmation', label: 'Bill Confirmation' },
  { id: 'completed', label: 'Completed' },
];

export function HouseholdOrders() {
  const [ordersList, setOrdersList] = useState<HouseholdOrder[]>(SAMPLE_ORDERS);
  const [selectedOrderId, setSelectedOrderId] = useState<string>('ord-1');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('Merchant delayed');
  const [completedRating, setCompletedRating] = useState<number>(5);
  const [reviewSubmitted, setReviewSubmitted] = useState<boolean>(false);
  const [previewPhoto, setPreviewPhoto] = useState<string | null>(null);

  const activeOrder = ordersList.find((o) => o.id === selectedOrderId) || ordersList[0];

  const getStageIndex = (stage: OrderLifecycleStage) => {
    switch (stage) {
      case 'posted':
        return 0;
      case 'confirmed':
        return 1;
      case 'arriving':
        return 2;
      case 'pickup':
        return 3;
      case 'bill_confirmation':
        return 4;
      case 'completed':
        return 5;
      default:
        return 0;
    }
  };

  const currentStageIdx = getStageIndex(activeOrder.stage);

  const setOrderStage = (orderId: string, newStage: OrderLifecycleStage) => {
    setOrdersList((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          return {
            ...ord,
            stage: newStage,
            ...(newStage !== 'posted' && !ord.merchantName
              ? {
                  merchantName: 'Selvam Scrap Traders',
                  merchantRating: 4.8,
                  merchantPhone: '+91 98401 23456',
                  vehicleType: 'Tata 407 Flatbed Truck',
                  vehicleRegNumber: 'TN 09 BX 4421',
                  etaMinutes: 12,
                  distanceKm: 2.4,
                }
              : {}),
          };
        }
        return ord;
      })
    );
  };

  const handleCancelOrder = () => {
    setOrdersList((prev) =>
      prev.map((ord) =>
        ord.id === activeOrder.id
          ? {
              ...ord,
              stage: 'cancelled',
              cancellationReason: cancelReason,
            }
          : ord
      )
    );
    setShowCancelModal(false);
  };

  return (
    <div className={styles.pageContainer}>
      {/* 1. Header Banner */}
      <div className={styles.headerBanner}>
        <div className={styles.headerTitleGroup}>
          <h1 className={styles.mainTitle}>Orders</h1>
          <p className={styles.mainSubtitle}>
            Track your doorstep scrap pickup and verify digital scale weighing.
          </p>
        </div>

        <Link to="/household/post-scrap" className={styles.postScrapBtn}>
          <Plus size={16} />
          <span>Post Scrap</span>
        </Link>
      </div>

      {/* 2. Order Selector Tabs Track */}
      <div className={styles.orderTabsTrack}>
        {ordersList.map((ord) => (
          <button
            key={ord.id}
            type="button"
            className={[
              styles.orderTabBtn,
              selectedOrderId === ord.id ? styles.orderTabActive : '',
            ].join(' ')}
            onClick={() => setSelectedOrderId(ord.id)}
          >
            <span className={styles.tabOrderNumber}>Order #{ord.orderNumber}</span>
            <span
              className={
                ord.stage === 'completed'
                  ? styles.tabStatusPillGreen
                  : ord.stage === 'cancelled'
                  ? styles.tabStatusPillRed
                  : styles.tabStatusPillYellow
              }
            >
              {ord.stage === 'completed'
                ? '✓ Completed'
                : ord.stage === 'cancelled'
                ? '✕ Cancelled'
                : ord.stage === 'bill_confirmation'
                ? '● Confirm Bill'
                : ord.stage === 'pickup'
                ? '● Weighing Scrap'
                : ord.stage === 'arriving'
                ? '● Merchant Arriving'
                : ord.stage === 'confirmed'
                ? '● Confirmed'
                : '● Awaiting Quotes'}
            </span>
          </button>
        ))}
      </div>

      {/* 3. ORDER CANCELLED VIEW */}
      {activeOrder.stage === 'cancelled' ? (
        <div className={styles.cancelledCard}>
          <div className={styles.cancelledIconCircle}>
            <X size={36} color="#DC2626" />
          </div>
          <h2 className={styles.cancelledTitle}>Order Cancelled</h2>
          <span className={styles.orderIdBadge}>Order #{activeOrder.orderNumber}</span>
          <p className={styles.cancelledReasonText}>
            Reason: <strong>{activeOrder.cancellationReason || 'Cancelled by user'}</strong>
          </p>
          <p className={styles.cancelledSubtext}>
            This doorstep pickup request has been cancelled. You can post a new scrap pickup whenever you are ready.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
            <Link to="/household/post-scrap" className={styles.postScrapBtn}>
              <Plus size={16} />
              <span>Post New Scrap</span>
            </Link>
            <Link to="/household" className={styles.secondaryBtn}>
              Back to Home
            </Link>
          </div>
        </div>
      ) : activeOrder.stage === 'completed' ? (
        /* 4. COMPLETED SCREEN */
        <div className={styles.completedSuccessCard}>
          <div className={styles.successCelebrationCircle}>
            <CheckCircle2 size={40} color="#059669" />
          </div>

          <div>
            <span className={styles.successTopLabel}>Pickup Completed Successfully</span>
            <h2 className={styles.completedPayoutAmount}>
              ₹{activeOrder.finalSettledTotal?.toFixed(2)} Paid
            </h2>
            <p className={styles.completedPayoutDesc}>
              Instant spot payment transferred to your UPI / Cash on Hand.
            </p>
          </div>

          {/* Receipt Breakdown Details Box */}
          <div className={styles.receiptDetailsBox}>
            <div className={styles.receiptRow}>
              <span>Order Number:</span>
              <strong>#{activeOrder.orderNumber}</strong>
            </div>
            <div className={styles.receiptRow}>
              <span>Bill Slip Ref:</span>
              <strong>{activeOrder.billSlipNumber}</strong>
            </div>
            <div className={styles.receiptRow}>
              <span>Merchant:</span>
              <strong>{activeOrder.merchantName}</strong>
            </div>
            <div className={styles.receiptRow}>
              <span>Digital Weighing:</span>
              <strong style={{ color: '#059669' }}>Verified 100% Calibrated Scale</strong>
            </div>
          </div>

          {/* 5-Star Private Rating Section */}
          <div className={styles.completedRatingSection}>
            <span className={styles.ratingPromptText}>
              How was your doorstep experience with {activeOrder.merchantName}?
            </span>

            <div className={styles.starRatingWrap}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className={`${styles.starBtn} ${
                    completedRating >= star ? styles.starActive : ''
                  }`}
                  onClick={() => {
                    setCompletedRating(star);
                    setReviewSubmitted(true);
                  }}
                >
                  <Star
                    size={24}
                    fill={completedRating >= star ? '#f59e0b' : 'none'}
                    stroke="currentColor"
                  />
                </button>
              ))}
            </div>
            {reviewSubmitted && (
              <span className={styles.ratingThanksText}>
                Thank you! Your private feedback helps Scrap Anna maintain top quality. ✨
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className={styles.completedActionRow}>
            <Link to="/household" className={styles.secondaryBtn}>
              Home
            </Link>
            <Link to="/household/history" className={styles.primaryHistoryBtn}>
              <span>View in History</span>
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      ) : activeOrder.stage === 'bill_confirmation' ? (
        /* 5. FINAL BILL CONFIRMATION SCREEN */
        <div className={styles.billingPageContainer}>
          {/* Left Column: Weighed Bill Slip */}
          <div className={styles.billingSlipCard}>
            <div className={styles.billHeaderRow}>
              <div>
                <span className={styles.billSlipTag}>Your Final Bill</span>
                <h3 className={styles.billSlipTitle}>Is everything correct?</h3>
              </div>

              <span className={styles.scaleVerifiedBadge}>
                <Scale size={14} />
                <span>Digital Scale Certified</span>
              </span>
            </div>

            {/* Merchant Details Info */}
            <div className={styles.billMerchantRow}>
              <div>
                <span className={styles.metaLabel}>MERCHANT</span>
                <strong className={styles.metaValue}>{activeOrder.merchantName}</strong>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span className={styles.metaLabel}>PHONE</span>
                <strong className={styles.metaValue}>{activeOrder.merchantPhone}</strong>
              </div>
            </div>

            {/* Weighed Items Breakdown Table */}
            <table className={styles.billItemsTable}>
              <thead>
                <tr>
                  <th>Material</th>
                  <th>Weighed Qty</th>
                  <th>Agreed Rate</th>
                  <th style={{ textAlign: 'right' }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {activeOrder.items
                  .filter((it) => it.actualWeighedKg)
                  .map((it) => (
                    <tr key={it.id}>
                      <td style={{ fontWeight: 700 }}>{it.title}</td>
                      <td>{it.actualWeighedKg} KG</td>
                      <td>₹{it.ratePerKg}/KG</td>
                      <td style={{ textAlign: 'right', fontWeight: 800, color: '#059669' }}>
                        ₹{it.subtotal?.toFixed(2)}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>

            {/* Bill Total Amount Box */}
            <div className={styles.billTotalBox}>
              <div>
                <span className={styles.billTotalLabel}>Total Amount Payable to You</span>
                <span className={styles.billTotalSubtext}>Instant spot payment via UPI / Cash</span>
              </div>
              <span className={styles.billTotalValue}>
                ₹{activeOrder.finalSettledTotal?.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Right Column: Bill Confirmation & Bill OTP */}
          <div className={styles.billConfirmationCard}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <h3 className={styles.confirmBillTitle}>Confirm Final Bill</h3>
              <p className={styles.confirmBillSubtitle}>
                Check the scale readings above. If everything is accurate, share your Bill Confirmation OTP with the driver.
              </p>
            </div>

            {/* Billing OTP Highlight */}
            <div className={styles.billingOtpHighlight}>
              <span className={styles.otpLabel}>Bill Confirmation OTP</span>
              <span className={styles.otpValueLarge}>{activeOrder.billingOtp}</span>
              <span className={styles.otpExplainer}>
                Share this OTP with driver to finalize digital weight acceptance & receive instant payment
              </span>
            </div>

            {/* Confirm Bill Action Button */}
            <button
              type="button"
              className={styles.confirmBillBtn}
              onClick={() => setOrderStage(activeOrder.id, 'completed')}
            >
              <CheckCircle2 size={18} />
              <span>Confirm Bill & Complete Order</span>
            </button>
          </div>
        </div>
      ) : (
        /* 6. ACTIVE TRACKING & PROGRESS STAGES */
        <div className={styles.activeTrackingLayout}>
          {/* Progress Tracker (6 Simple Stages) */}
          <div className={styles.trackerCard}>
            <div className={styles.trackerStagesRow}>
              {STAGE_STEPS.map((step, idx) => {
                const isPassed = idx < currentStageIdx;
                const isCurrent = idx === currentStageIdx;
                return (
                  <div
                    key={step.id}
                    className={`${styles.stageStepItem} ${
                      isPassed ? styles.stagePassed : isCurrent ? styles.stageCurrent : ''
                    }`}
                  >
                    <div className={styles.stageCircle}>
                      {isPassed ? <CheckCircle2 size={16} /> : <span>{idx + 1}</span>}
                    </div>
                    <span className={styles.stageLabelText}>{step.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* STAGE ACTION HERO */}
          {activeOrder.stage === 'arriving' ? (
            <div className={styles.merchantArrivingBanner}>
              <div className={styles.arrivingLeft}>
                <div className={styles.arrivingTruckIcon}>
                  <Truck size={24} />
                </div>
                <div>
                  <h3 className={styles.arrivingTitle}>
                    {activeOrder.merchantName} is arriving at your doorstep
                  </h3>
                  <span className={styles.arrivingSubtext}>
                    Vehicle: {activeOrder.vehicleType} ({activeOrder.vehicleRegNumber}) • {activeOrder.etaMinutes} mins away ({activeOrder.distanceKm} km)
                  </span>
                </div>
              </div>

              <div className={styles.pickupOtpBox}>
                <span className={styles.pickupOtpLabel}>Doorstep Pickup OTP:</span>
                <span className={styles.pickupOtpCode}>{activeOrder.pickupOtp}</span>
                <span className={styles.pickupOtpHint}>
                  Share with merchant ONLY when they arrive at your door
                </span>
                <button
                  type="button"
                  className={styles.simulateNextBtn}
                  onClick={() => setOrderStage(activeOrder.id, 'pickup')}
                >
                  Driver Arrived → Start Weighing
                </button>
              </div>
            </div>
          ) : activeOrder.stage === 'pickup' ? (
            <div className={styles.weighingBanner}>
              <div className={styles.weighingLeft}>
                <Scale size={24} color="#059669" />
                <div>
                  <h3 className={styles.weighingTitle}>Doorstep Digital Weighing in Progress</h3>
                  <p className={styles.weighingSubtext}>
                    Executive {activeOrder.merchantName} is measuring your scrap items using calibrated scales.
                  </p>
                </div>
              </div>

              <button
                type="button"
                className={styles.simulateNextBtn}
                onClick={() => setOrderStage(activeOrder.id, 'bill_confirmation')}
              >
                Merchant Submitted Bill → Review Final Bill
              </button>
            </div>
          ) : activeOrder.stage === 'confirmed' ? (
            <div className={styles.confirmedBanner}>
              <CheckCircle2 size={24} color="#D97706" />
              <div>
                <h3 className={styles.confirmedTitle}>Merchant Accepted Your Request</h3>
                <p className={styles.confirmedSubtext}>
                  {activeOrder.merchantName} will arrive during your preferred slot ({activeOrder.preferredSlot}).
                </p>
              </div>
              <button
                type="button"
                className={styles.simulateNextBtn}
                onClick={() => setOrderStage(activeOrder.id, 'arriving')}
              >
                Driver Dispatched → Track Arrival
              </button>
            </div>
          ) : (
            <div className={styles.searchingBanner}>
              <Clock size={24} color="#2563EB" />
              <div>
                <h3 className={styles.searchingTitle}>Scrap Request Posted</h3>
                <p className={styles.searchingSubtext}>
                  Verified merchants in Anna Nagar & Chennai are reviewing your scrap bundle and preparing competitive quotes.
                </p>
              </div>
              <button
                type="button"
                className={styles.simulateNextBtn}
                onClick={() => setOrderStage(activeOrder.id, 'confirmed')}
              >
                Simulate Merchant Acceptance
              </button>
            </div>
          )}

          {/* 2-Column Details: Left = Items & Address, Right = Merchant & Actions */}
          <div className={styles.detailsTwoColGrid}>
            {/* Left Col: Scrap Items & Pickup Location */}
            <div className={styles.detailsLeftCol}>
              {/* Scrap Items Card */}
              <div className={styles.sectionDetailsCard}>
                <h3 className={styles.cardSectionTitle}>
                  Scrap Materials ({activeOrder.items.length})
                </h3>

                <div className={styles.itemsList}>
                  {activeOrder.items.map((item) => (
                    <div key={item.id} className={styles.itemRow}>
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className={styles.itemThumb}
                        onClick={() => setPreviewPhoto(item.imageUrl)}
                        title="Click to zoom"
                      />
                      <div className={styles.itemMeta}>
                        <h4 className={styles.itemTitle}>{item.title}</h4>
                        <span className={styles.itemWeightText}>Estimated: {item.weight}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pickup Address Card */}
              <div className={styles.sectionDetailsCard}>
                <h3 className={styles.cardSectionTitle}>Pickup Details</h3>
                <div className={styles.pickupAddressBox}>
                  <div className={styles.addressRow}>
                    <MapPin size={16} color="#D97706" />
                    <span>{activeOrder.pickupAddress}</span>
                  </div>
                  <div className={styles.addressRow}>
                    <Calendar size={16} color="#D97706" />
                    <span>{activeOrder.preferredDate} • {activeOrder.preferredSlot}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Col: Merchant Info & Actions */}
            <div className={styles.detailsRightCol}>
              {activeOrder.merchantName ? (
                <div className={styles.merchantCard}>
                  <h3 className={styles.cardSectionTitle}>Assigned Merchant</h3>

                  <div className={styles.merchantProfileWrap}>
                    <div className={styles.merchantAvatarBox}>
                      <User size={22} color="#0F172A" />
                    </div>
                    <div className={styles.merchantNameCol}>
                      <h4 className={styles.merchantName}>{activeOrder.merchantName}</h4>
                      <span className={styles.ratingBadge}>
                        ★ {activeOrder.merchantRating} • Verified Doorstep Partner
                      </span>
                    </div>
                  </div>

                  <div className={styles.merchantVehicleInfo}>
                    <Truck size={15} color="#64748B" />
                    <span>{activeOrder.vehicleType} ({activeOrder.vehicleRegNumber})</span>
                  </div>

                  <a
                    href={`tel:${activeOrder.merchantPhone}`}
                    className={styles.callMerchantBtn}
                  >
                    <Phone size={15} />
                    <span>Call Merchant ({activeOrder.merchantPhone})</span>
                  </a>
                </div>
              ) : (
                <div className={styles.waitingMerchantCard}>
                  <Clock size={24} color="#64748B" />
                  <h4 className={styles.waitingTitle}>Awaiting Merchant Confirmation</h4>
                  <p className={styles.waitingSubtext}>
                    Nearby buyers are currently reviewing your request. You will receive an instant alert once confirmed.
                  </p>
                </div>
              )}

              {/* Cancel Order Action */}
              <button
                type="button"
                className={styles.cancelOrderLinkBtn}
                onClick={() => setShowCancelModal(true)}
              >
                Cancel this Pickup Request
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CANCEL ORDER MODAL */}
      {showCancelModal && (
        <div className={styles.modalOverlay} onClick={() => setShowCancelModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Cancel Pickup Request</h3>
              <button
                type="button"
                className={styles.modalCloseBtn}
                onClick={() => setShowCancelModal(false)}
              >
                <X size={18} />
              </button>
            </div>

            <div className={styles.modalBody}>
              <p className={styles.cancelPrompt}>
                Please tell us the reason for cancelling Order #{activeOrder.orderNumber}:
              </p>

              <div className={styles.cancelReasonsList}>
                {[
                  'Merchant delayed / Not arriving on time',
                  'Scrap material changed / already sold',
                  'Quantity changed',
                  'Price issue',
                  'Other reason',
                ].map((reason) => (
                  <label key={reason} className={styles.reasonRadioItem}>
                    <input
                      type="radio"
                      name="cancelReason"
                      value={reason}
                      checked={cancelReason === reason}
                      onChange={(e) => setCancelReason(e.target.value)}
                    />
                    <span>{reason}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button
                type="button"
                className={styles.modalKeepBtn}
                onClick={() => setShowCancelModal(false)}
              >
                Keep Order Active
              </button>
              <button
                type="button"
                className={styles.modalConfirmCancelBtn}
                onClick={handleCancelOrder}
              >
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PHOTO PREVIEW LIGHTBOX */}
      {previewPhoto && (
        <div className={styles.modalOverlay} onClick={() => setPreviewPhoto(null)}>
          <div className={styles.photoLightbox} onClick={(e) => e.stopPropagation()}>
            <img src={previewPhoto} alt="Preview" className={styles.lightboxImg} />
            <button
              type="button"
              className={styles.lightboxCloseBtn}
              onClick={() => setPreviewPhoto(null)}
            >
              <X size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default HouseholdOrders;
