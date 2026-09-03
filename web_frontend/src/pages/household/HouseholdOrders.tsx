import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  LuCircleCheck as CheckCircle2,
  LuMapPin as MapPin,
  LuCalendar as Calendar,
  LuClock as Clock,
  LuUser as User,
  LuPhone as Phone,
  LuTruck as Truck,
  LuPlus as Plus,
  LuNavigation as Navigation,
  LuInfo as Info,
  LuScale as Scale,
  LuShieldCheck as ShieldCheck,
  LuIndianRupee as IndianRupee,
  LuStar as Star,
  LuArrowRight as ArrowRight,
  LuReceipt as Receipt,
  LuFileText as FileText,
  LuX as X,
  LuCircleAlert as AlertCircle,
  LuEye as Eye,
  LuMaximize2 as Maximize2,
  LuArrowLeft as ArrowLeft,
  LuHeadphones as Headphones,
  LuChevronRight as ChevronRight,
  LuCheck as Check,
} from 'react-icons/lu';
import styles from './HouseholdOrders.module.css';
import { useBodyScrollLock } from '../../hooks/useBodyScrollLock';

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
    orderNumber: 'SA12345',
    bookedDate: '23 May 2024, 09:30 AM',
    pickupAddress: 'No. 42, 2nd Main Road, Anna Nagar, Chennai - 600040',
    preferredDate: 'Today',
    preferredSlot: '10:00 AM - 12:00 PM',
    stage: 'arriving',
    pickupOtp: '8492',
    billingOtp: '4190',
    billSlipNumber: 'SLP-2024-05-SA12345',
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
        weight: '2.8 KG',
        rate: '₹720 / KG',
        actualWeighedKg: 2.8,
        ratePerKg: 720,
        subtotal: 2016.0,
        imageUrl: '/scrap-copper-wire.jpg',
      },
      {
        id: 'it-2',
        title: 'Scrap Iron Rods',
        weight: '9.2 KG',
        rate: '₹38.50 / KG',
        actualWeighedKg: 9.2,
        ratePerKg: 38.5,
        subtotal: 354.2,
        imageUrl: '/scrap-iron.png',
      },
      {
        id: 'it-3',
        title: 'Corrugated Cardboard',
        weight: '14.5 KG',
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
  {
    id: 'ord-past',
    orderNumber: 'SA12344',
    bookedDate: '22 May 2024, 11:30 AM',
    pickupAddress: 'No. 42, 2nd Main Road, Anna Nagar, Chennai - 600040',
    preferredDate: '22 May 2024',
    preferredSlot: '11:00 AM - 01:00 PM',
    stage: 'completed',
    pickupOtp: '5521',
    billingOtp: '8910',
    billSlipNumber: 'SLP-2024-05-SA12344',
    merchantName: 'Selvam Scrap Traders',
    merchantRating: 4.8,
    merchantPhone: '+91 98401 23456',
    vehicleType: 'Tata 407 Flatbed Truck',
    vehicleRegNumber: 'TN 09 BX 4421',
    items: [
      {
        id: 'it-p1',
        title: 'Mixed Metal Scrap',
        weight: '65.4 KG',
        rate: '₹32 / KG',
        actualWeighedKg: 65.4,
        ratePerKg: 32,
        subtotal: 2092.8,
        imageUrl: '/scrap-iron.png',
      },
      {
        id: 'it-p2',
        title: 'Old Books & Newspapers',
        weight: '53.2 KG',
        rate: '₹14.15 / KG',
        actualWeighedKg: 53.2,
        ratePerKg: 14.15,
        subtotal: 752.2,
        imageUrl: '/scrap-cardboard.png',
      },
    ],
    finalSettledTotal: 2845.0,
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

/* 5-Stage Mobile Progress Tracker (Request Posted removed per user instruction) */
const MOBILE_STAGE_STEPS = [
  { id: 'confirmed', label: 'merchant confirmed' },
  { id: 'arriving', label: 'arriving' },
  { id: 'pickup', label: 'pickup' },
  { id: 'bill_confirmation', label: 'bill' },
  { id: 'completed', label: 'completed' },
];

/* Custom Vector Illustrations matching design mockup */
function RequestPostedIllustration() {
  return (
    <svg width="68" height="68" viewBox="0 0 72 72" fill="none" aria-hidden="true">
      <rect x="14" y="10" width="44" height="54" rx="8" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="2.5" />
      <rect x="22" y="6" width="28" height="8" rx="4" fill="#0F172A" />
      <line x1="22" y1="28" x2="50" y2="28" stroke="#E2E8F0" strokeWidth="3" strokeLinecap="round" />
      <line x1="22" y1="36" x2="44" y2="36" stroke="#E2E8F0" strokeWidth="3" strokeLinecap="round" />
      <circle cx="36" cy="48" r="12" fill="#DCFCE7" />
      <path d="M30 48L34 52L42 44" stroke="#16A34A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MerchantConfirmedIllustration() {
  return (
    <svg width="68" height="68" viewBox="0 0 72 72" fill="none" aria-hidden="true">
      <circle cx="36" cy="36" r="32" fill="#FEF9C3" />
      <circle cx="36" cy="28" r="12" fill="#F59E0B" />
      <path d="M22 28C22 20 28 16 36 16C44 16 50 20 50 28H22Z" fill="#15803D" />
      <path d="M22 27H50C52 27 54 28 54 30H18C18 28 20 27 22 27Z" fill="#166534" />
      <path d="M18 56C18 46 26 42 36 42C46 42 54 46 54 56" fill="#15803D" />
      <circle cx="50" cy="48" r="10" fill="#16A34A" />
      <path d="M46 48L49 51L55 45" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MerchantArrivingIllustration() {
  return (
    <svg width="86" height="56" viewBox="0 0 90 60" fill="none" aria-hidden="true">
      <rect width="90" height="60" rx="12" fill="#F1F5F9" />
      <path d="M10 42Q35 20 55 35T80 24" stroke="#94A3B8" strokeWidth="4" strokeDasharray="4 4" />
      <path d="M10 42Q35 20 50 34" stroke="#16A34A" strokeWidth="4" />
      <circle cx="10" cy="42" r="5" fill="#16A34A" />
      <g transform="translate(42, 16)">
        <rect x="0" y="4" width="22" height="15" rx="2" fill="#FBC21A" />
        <rect x="16" y="8" width="10" height="11" rx="2" fill="#F59E0B" />
        <circle cx="6" cy="19" r="3.5" fill="#1E293B" />
        <circle cx="20" cy="19" r="3.5" fill="#1E293B" />
      </g>
      <circle cx="80" cy="24" r="6" fill="#EF4444" />
      <circle cx="80" cy="24" r="2.5" fill="#FFFFFF" />
    </svg>
  );
}

function DoorstepPickupIllustration() {
  return (
    <svg width="76" height="68" viewBox="0 0 80 68" fill="none" aria-hidden="true">
      <circle cx="28" cy="22" r="10" fill="#FDE047" />
      <path d="M16 22C16 15 21 11 28 11C35 11 40 15 40 22H16Z" fill="#15803D" />
      <path d="M14 46C14 38 20 34 28 34C36 34 42 38 42 46" fill="#15803D" />
      <circle cx="52" cy="24" r="9" fill="#FED7AA" />
      <path d="M42 46C42 39 47 36 52 36C57 36 62 39 62 46" fill="#0284C7" />
      <rect x="36" y="28" width="11" height="18" rx="2" fill="#0F172A" />
      <rect x="38" y="30" width="7" height="12" rx="1" fill="#22C55E" />
    </svg>
  );
}

function BillReadyIllustration() {
  return (
    <svg width="72" height="68" viewBox="0 0 76 68" fill="none" aria-hidden="true">
      <rect x="12" y="46" width="52" height="10" rx="3" fill="#334155" />
      <rect x="22" y="48" width="18" height="6" rx="2" fill="#0F172A" />
      <rect x="24" y="50" width="14" height="2" fill="#22C55E" />
      <rect x="8" y="38" width="60" height="8" rx="2" fill="#94A3B8" />
      <rect x="20" y="20" width="20" height="18" rx="2" fill="#D97706" />
      <line x1="30" y1="20" x2="30" y2="38" stroke="#B45309" strokeWidth="2" />
      <circle cx="54" cy="24" r="10" fill="#DCFCE7" stroke="#16A34A" strokeWidth="2" />
      <path d="M49 24L52 27L58 21" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function PickupCompletedIllustration() {
  return (
    <svg width="72" height="72" viewBox="0 0 76 76" fill="none" aria-hidden="true">
      <circle cx="38" cy="38" r="30" fill="#16A34A" />
      <path d="M26 38L34 46L50 30" stroke="#FFFFFF" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="16" cy="18" r="2.5" fill="#FBC21A" />
      <circle cx="60" cy="20" r="3" fill="#FBC21A" />
      <circle cx="58" cy="56" r="2" fill="#38BDF8" />
      <circle cx="18" cy="54" r="2.5" fill="#F43F5E" />
    </svg>
  );
}

const getStatusTitle = (stage: OrderLifecycleStage) => {
  switch (stage) {
    case 'posted':
      return 'Request Posted!';
    case 'confirmed':
      return 'Pickup Confirmed!';
    case 'arriving':
      return 'Merchant is Arriving';
    case 'pickup':
      return 'Merchant Reached';
    case 'bill_confirmation':
      return 'Bill Ready';
    case 'completed':
      return 'Pickup Completed!';
    case 'cancelled':
      return 'Order Cancelled';
    default:
      return 'Order Status';
  }
};

const getStatusMessage = (order: HouseholdOrder) => {
  switch (order.stage) {
    case 'posted':
      return 'We have received your request. We will notify you once a merchant confirms your pickup.';
    case 'confirmed':
      return `${order.merchantName || 'Selvam Scrap Traders'} has accepted your pickup request.`;
    case 'arriving':
      return 'Our partner is on the way to your location.';
    case 'pickup':
      return 'The merchant has reached your location. Share the OTP below to start weighing.';
    case 'bill_confirmation':
      return 'Please review the final weight and amount before confirming.';
    case 'completed':
      return 'Thank you for recycling with Bill Scrap.';
    case 'cancelled':
      return 'This doorstep pickup request has been cancelled.';
    default:
      return '';
  }
};

export function HouseholdOrders() {
  const [ordersList, setOrdersList] = useState<HouseholdOrder[]>(SAMPLE_ORDERS);
  const [selectedOrderId, setSelectedOrderId] = useState<string>('ord-1');
  const [selectedMobileOrderId, setSelectedMobileOrderId] = useState<string | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('Merchant delayed');
  const [completedRating, setCompletedRating] = useState<number>(5);
  const [reviewSubmitted, setReviewSubmitted] = useState<boolean>(false);
  const [mobileRating, setMobileRating] = useState<number>(5);
  const [mobileRated, setMobileRated] = useState<boolean>(false);
  const [previewPhoto, setPreviewPhoto] = useState<string | null>(null);

  // Lock background scrolling when modal or photo preview is open
  useBodyScrollLock(Boolean(showCancelModal || previewPhoto));

  const activeOrder = ordersList.find((o) => o.id === selectedOrderId) || ordersList[0];
  const currentMobileOrder =
    ordersList.find((o) => o.id === (selectedMobileOrderId || selectedOrderId)) || activeOrder;

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
  const mobileStageIdx = getStageIndex(currentMobileOrder.stage);

  const getMobileProgressIndex = (stage: OrderLifecycleStage) => {
    switch (stage) {
      case 'posted':
        return -1;
      case 'confirmed':
        return 0;
      case 'arriving':
        return 1;
      case 'pickup':
        return 2;
      case 'bill_confirmation':
        return 3;
      case 'completed':
        return 4;
      default:
        return -1;
    }
  };

  const mobileProgressIdx = getMobileProgressIndex(currentMobileOrder.stage);

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
      {/* ===================================================================
         DESKTOP ORDERS VIEW (UNTOUCHED, PRESERVED 100%)
         =================================================================== */}
      <div className={styles.desktopOrdersView}>
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
              {ord.stage === 'completed' ? (
                <>
                  <CheckCircle2 size={12} aria-hidden="true" style={{ marginRight: 4 }} />
                  Completed
                </>
              ) : ord.stage === 'cancelled' ? (
                <>
                  <X size={12} aria-hidden="true" style={{ marginRight: 4 }} />
                  Cancelled
                </>
              ) : ord.stage === 'bill_confirmation' ? (
                <>
                  <Receipt size={12} aria-hidden="true" style={{ marginRight: 4 }} />
                  Confirm Bill
                </>
              ) : ord.stage === 'pickup' ? (
                <>
                  <Scale size={12} aria-hidden="true" style={{ marginRight: 4 }} />
                  Weighing Scrap
                </>
              ) : ord.stage === 'arriving' ? (
                <>
                  <Truck size={12} aria-hidden="true" style={{ marginRight: 4 }} />
                  Merchant Arriving
                </>
              ) : ord.stage === 'confirmed' ? (
                <>
                  <Check size={12} aria-hidden="true" style={{ marginRight: 4 }} />
                  Confirmed
                </>
              ) : (
                <>
                  <Clock size={12} aria-hidden="true" style={{ marginRight: 4 }} />
                  Awaiting Quotes
                </>
              )}
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
                Thank you! Your private feedback helps Bill Scrap maintain top quality.
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
                  <span>Driver Arrived</span>
                  <ArrowRight size={13} aria-hidden="true" style={{ marginLeft: 6 }} />
                  <span>Start Weighing</span>
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
                <span>Merchant Submitted Bill</span>
                <ArrowRight size={13} aria-hidden="true" style={{ marginLeft: 6 }} />
                <span>Review Final Bill</span>
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
                <span>Driver Dispatched</span>
                <ArrowRight size={13} aria-hidden="true" style={{ marginLeft: 6 }} />
                <span>Track Arrival</span>
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
                        <Star size={12} fill="#F59E0B" color="#F59E0B" aria-hidden="true" style={{ marginRight: 3, verticalAlign: -1 }} /> {activeOrder.merchantRating} • Verified Doorstep Partner
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
      </div> {/* /.desktopOrdersView */}

      {/* ===================================================================
         MOBILE ORDERS VIEW (MOBILE-ONLY EXPERIENCE FOR <= 768px)
         =================================================================== */}
      <div className={styles.mobileOrdersView}>
        {selectedMobileOrderId === null ? (
          /* -----------------------------------------------------------------
             SCREEN 1: MOBILE ORDERS LIST
             ----------------------------------------------------------------- */
          <div className={styles.mobileListContainer}>
            {/* Header */}
            <div className={styles.mobileHeaderRow}>
              <div className={styles.mobileHeaderTitles}>
                <h1 className={styles.mobileHeaderMainTitle}>Orders</h1>
                <p className={styles.mobileHeaderSubtitle}>Track your doorstep scrap pickup</p>
              </div>
              <Link
                to="/household/support"
                className={styles.mobileSupportCircleBtn}
                aria-label="Customer Support"
              >
                <Headphones size={20} />
              </Link>
            </div>

            {/* Primary Action Button */}
            <Link to="/household/post-scrap" className={styles.mobilePrimaryPostBtn}>
              <Plus size={20} strokeWidth={2.6} />
              <span>Post Scrap</span>
            </Link>

            {/* Active Pickup Card */}
            {activeOrder && activeOrder.stage !== 'completed' && activeOrder.stage !== 'cancelled' && (
              <div className={styles.mobileSectionBlock}>
                <div className={styles.mobileSectionLabelRow}>
                  <h2 className={styles.mobileSectionLabelTitle}>Active Pickup</h2>
                  <span className={styles.mobileSectionOrderTag}>Order #{activeOrder.orderNumber}</span>
                </div>

                <div
                  className={styles.mobileActiveOrderCard}
                  onClick={() => setSelectedMobileOrderId(activeOrder.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && setSelectedMobileOrderId(activeOrder.id)}
                >
                  <div className={styles.activeCardTopRow}>
                    <div className={styles.activeCardMerchantGroup}>
                      <div className={styles.activeCardMerchantIcon}>
                        <User size={18} />
                      </div>
                      <div className={styles.activeCardMerchantDetails}>
                        <span className={styles.activeCardMerchantName}>
                          {activeOrder.merchantName || 'Bill Scrap Partner'}
                        </span>
                        <span
                          className={
                            activeOrder.stage === 'arriving' || activeOrder.stage === 'pickup'
                              ? styles.activeCardStagePill
                              : styles.activeCardStagePillYellow
                          }
                        >
                          {MOBILE_STAGE_STEPS.find((s) => s.id === activeOrder.stage)?.label || 'merchant confirmed'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className={styles.activeCardContentRow}>
                    <div className={styles.activeCardMetricsLeft}>
                      <span className={styles.activeCardEtaHighlight}>
                        {activeOrder.stage === 'arriving'
                          ? `ETA: ${activeOrder.etaMinutes || 12} mins`
                          : activeOrder.stage === 'pickup'
                          ? 'Driver at Doorstep'
                          : 'Pickup Scheduled'}
                      </span>
                      <span className={styles.activeCardSlotText}>
                        <Clock size={13} />
                        <span>
                          {activeOrder.preferredDate}, {activeOrder.preferredSlot}
                        </span>
                      </span>
                    </div>

                    <div className={styles.activeCardRightVisual}>
                      <img
                        src="/stat-van.png"
                        alt="Scrap pickup truck"
                        className={styles.activeCardVehicleImg}
                      />
                      <ChevronRight size={20} className={styles.activeCardChevron} />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Past Orders Section */}
            <div className={styles.mobileSectionBlock}>
              <div className={styles.mobileSectionLabelRow}>
                <h2 className={styles.mobileSectionLabelTitle}>Past Orders</h2>
              </div>

              <div className={styles.mobilePastOrdersList}>
                {ordersList
                  .filter((ord) => ord.stage === 'completed' || ord.stage === 'cancelled')
                  .map((pastOrd) => {
                    const totalWeighed = pastOrd.items.reduce(
                      (sum, it) => sum + (it.actualWeighedKg || 0),
                      0
                    );
                    return (
                      <div
                        key={pastOrd.id}
                        className={styles.mobilePastOrderCard}
                        onClick={() => setSelectedMobileOrderId(pastOrd.id)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => e.key === 'Enter' && setSelectedMobileOrderId(pastOrd.id)}
                      >
                        <div className={styles.pastOrderInfoLeft}>
                          <div className={styles.pastOrderTopRow}>
                            <span className={styles.pastOrderNumber}>Order #{pastOrd.orderNumber}</span>
                            <span
                              className={
                                pastOrd.stage === 'completed'
                                  ? styles.pastOrderCompletedPill
                                  : styles.pastOrderCancelledPill
                              }
                            >
                              {pastOrd.stage === 'completed' ? 'Completed' : 'Cancelled'}
                            </span>
                          </div>

                          <div className={styles.pastOrderMerchantRow}>
                            <User size={15} color="#64748b" />
                            <span>{pastOrd.merchantName || 'Verified Merchant'}</span>
                          </div>

                          <span className={styles.pastOrderMetricsText}>
                            {totalWeighed > 0 ? `${totalWeighed.toFixed(1)} kg` : '118.6 kg'} • ₹
                            {(pastOrd.finalSettledTotal || 2845).toLocaleString('en-IN')}
                          </span>

                          <span className={styles.pastOrderDateText}>{pastOrd.bookedDate}</span>
                        </div>

                        <ChevronRight size={20} color="#94a3b8" />
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        ) : (
          /* -----------------------------------------------------------------
             SCREEN 2: MOBILE ORDER DETAILS
             ----------------------------------------------------------------- */
          <div className={styles.mobileDetailsContainer}>
            {/* Top Navigation Bar */}
            <div className={styles.mobileDetailsTopBar}>
              <button
                type="button"
                className={styles.mobileBackCircleBtn}
                onClick={() => setSelectedMobileOrderId(null)}
                aria-label="Back to Orders list"
              >
                <ArrowLeft size={20} />
              </button>
              <h2 className={styles.mobileDetailsHeaderTitle}>Order Details</h2>
              <Link
                to="/household/support"
                className={styles.mobileSupportCircleBtn}
                aria-label="Customer Support"
              >
                <Headphones size={18} />
              </Link>
            </div>

            {/* Order Meta Summary */}
            <div className={styles.mobileOrderMetaSummary}>
              <div className={styles.metaSummaryLeft}>
                <strong className={styles.metaSummaryOrderNum}>
                  Order #{currentMobileOrder.orderNumber}
                </strong>
                <span className={styles.metaSummaryDate}>
                  Placed on {currentMobileOrder.bookedDate}
                </span>
              </div>
              <span
                className={
                  currentMobileOrder.stage === 'completed'
                    ? styles.pastOrderCompletedPill
                    : currentMobileOrder.stage === 'cancelled'
                    ? styles.pastOrderCancelledPill
                    : styles.metaSummaryActiveBadge
                }
              >
                {currentMobileOrder.stage === 'completed'
                  ? 'Completed'
                  : currentMobileOrder.stage === 'cancelled'
                  ? 'Cancelled'
                  : 'Active'}
              </span>
            </div>

            {/* 5-Stage Progress Indicator (Request Posted removed per user instruction) */}
            <div className={styles.mobileTrackerCard}>
              <div className={styles.mobileTrackerTrack}>
                <div className={styles.trackerConnectingLine}>
                  <div
                    className={styles.trackerConnectingFill}
                    style={{
                      width: `${Math.max(0, (mobileProgressIdx / 4)) * 100}%`,
                    }}
                  />
                </div>

                {MOBILE_STAGE_STEPS.map((step, idx) => {
                  const isPassed = mobileProgressIdx > idx;
                  const isCurrent = mobileProgressIdx === idx;
                  return (
                    <div
                      key={step.id}
                      className={styles.trackerStepNode}
                      onClick={() => setOrderStage(currentMobileOrder.id, step.id as OrderLifecycleStage)}
                    >
                      <div
                        className={`${styles.trackerNodeCircle} ${
                          isPassed
                            ? styles.trackerNodePassed
                            : isCurrent
                            ? styles.trackerNodeCurrent
                            : styles.trackerNodeUpcoming
                        }`}
                      >
                        {isPassed ? <Check size={14} strokeWidth={3} /> : idx + 1}
                      </div>
                      <span
                        className={`${styles.trackerNodeLabel} ${
                          isCurrent || isPassed ? styles.trackerNodeLabelActive : ''
                        }`}
                      >
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Dynamic Current Status Card */}
            <div className={styles.dynamicStatusCard}>
              <div className={styles.statusCardHeader}>
                <span className={styles.statusCardCurrentLabel}>Current Status</span>
                <h3 className={styles.statusCardMainTitle}>{getStatusTitle(currentMobileOrder.stage)}</h3>
                <p className={styles.statusCardMessage}>{getStatusMessage(currentMobileOrder)}</p>
              </div>

              {/* Stage Specific Content */}
              {currentMobileOrder.stage === 'posted' && (
                <>
                  <div className={styles.statusIllustrationBox}>
                    <RequestPostedIllustration />
                  </div>
                  <div className={styles.infoNotePill}>
                    <Info size={16} color="#d97706" />
                    <span>You can track your order status in real-time here.</span>
                  </div>
                  <button
                    type="button"
                    className={styles.cancelOrderLinkBtn}
                    onClick={() => setShowCancelModal(true)}
                  >
                    Cancel Pickup
                  </button>
                </>
              )}

              {currentMobileOrder.stage === 'confirmed' && (
                <>
                  <div className={styles.statusIllustrationBox}>
                    <MerchantConfirmedIllustration />
                  </div>
                  <div className={styles.merchantConfirmedCard}>
                    <div className={styles.merchantDetailsRow}>
                      <div className={styles.merchantAvatarSquircle}>
                        <User size={22} />
                      </div>
                      <div className={styles.merchantMetaCol}>
                        <span className={styles.merchantNameText}>
                          {currentMobileOrder.merchantName}
                        </span>
                        <span className={styles.merchantRatingText}>
                          <Star size={12} fill="#F59E0B" color="#F59E0B" aria-hidden="true" style={{ marginRight: 3, verticalAlign: -1 }} /> {currentMobileOrder.merchantRating || 4.8} (230+ pickups)
                        </span>
                      </div>
                    </div>
                    <div className={styles.merchantVehicleRow}>
                      <Truck size={15} />
                      <span>
                        {currentMobileOrder.vehicleType} ({currentMobileOrder.vehicleRegNumber})
                      </span>
                    </div>
                  </div>

                  <div className={styles.infoNotePill}>
                    <Clock size={16} color="#16a34a" />
                    <span>Merchant will reach your location within the selected time slot.</span>
                  </div>

                  <a
                    href={`tel:${currentMobileOrder.merchantPhone || '+919840123456'}`}
                    className={styles.merchantCallActionBtn}
                  >
                    <Phone size={16} />
                    <span>Call Merchant</span>
                  </a>
                </>
              )}

              {currentMobileOrder.stage === 'arriving' && (
                <>
                  <div className={styles.mapRouteBox}>
                    <MerchantArrivingIllustration />
                  </div>

                  <div className={styles.arrivingMetricsRow}>
                    <div className={styles.metricTile}>
                      <span className={styles.metricTileLabel}>ETA</span>
                      <span className={styles.metricTileVal}>
                        {currentMobileOrder.etaMinutes || 12} mins
                      </span>
                    </div>
                    <div className={styles.metricTile}>
                      <span className={styles.metricTileLabel}>Distance</span>
                      <span className={styles.metricTileVal}>
                        {currentMobileOrder.distanceKm || 2.4} km
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    className={styles.trackLiveBtn}
                    onClick={() => setOrderStage(currentMobileOrder.id, 'pickup')}
                  >
                    <Navigation size={18} />
                    <span>Track Live Location</span>
                  </button>

                  <div className={styles.infoNotePill}>
                    <Info size={16} color="#d97706" />
                    <span>Please be available at your location.</span>
                  </div>

                  <a
                    href={`tel:${currentMobileOrder.merchantPhone || '+919840123456'}`}
                    className={styles.merchantCallActionBtn}
                  >
                    <Phone size={16} />
                    <span>Call Merchant</span>
                  </a>
                </>
              )}

              {currentMobileOrder.stage === 'pickup' && (
                <>
                  <div className={styles.statusIllustrationBox}>
                    <DoorstepPickupIllustration />
                  </div>

                  {/* Doorstep OTP Highlight Box */}
                  <div className={styles.doorstepOtpBox}>
                    <span className={styles.doorstepOtpLabel}>DOORSTEP PICKUP OTP</span>
                    <span className={styles.doorstepOtpDigits}>{currentMobileOrder.pickupOtp}</span>
                    <span className={styles.doorstepOtpSubtext}>
                      Share with merchant ONLY when they arrive at your doorstep.
                    </span>
                  </div>

                  <div className={styles.doorstepSecurityWarning}>
                    <ShieldCheck size={16} />
                    <span>Do not share OTP over call or message.</span>
                  </div>

                  <button
                    type="button"
                    className={styles.mobilePrimaryPostBtn}
                    onClick={() => setOrderStage(currentMobileOrder.id, 'bill_confirmation')}
                  >
                    <Scale size={18} />
                    <span>Start Weighing</span>
                  </button>
                </>
              )}

              {currentMobileOrder.stage === 'bill_confirmation' && (
                <>
                  <div className={styles.statusIllustrationBox}>
                    <BillReadyIllustration />
                  </div>

                  <div className={styles.mobileBillSection}>
                    <div className={styles.billCardTopHeader}>
                      <div className={styles.scaleCertifiedPill}>
                        <Scale size={13} />
                        <span>Digital Scale Certified</span>
                      </div>
                      <span className={styles.billCardOrderTag}>#{currentMobileOrder.orderNumber}</span>
                    </div>

                    <table className={styles.billTableMobile}>
                      <thead>
                        <tr>
                          <th style={{ width: '36%', textAlign: 'left' }}>Material</th>
                          <th style={{ width: '18%', textAlign: 'center' }}>Weight</th>
                          <th style={{ width: '22%', textAlign: 'right' }}>Price</th>
                          <th style={{ width: '24%', textAlign: 'right' }}>Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentMobileOrder.items.map((it) => (
                          <tr key={it.id}>
                            <td className={styles.billItemTitleCell}>{it.title}</td>
                            <td className={styles.billItemWeightCell}>{it.actualWeighedKg} kg</td>
                            <td className={styles.billItemPriceCell}>
                              ₹{it.ratePerKg || (it.rate ? it.rate.replace(/[^0-9.]/g, '') : '')}
                            </td>
                            <td className={styles.billItemAmountCell}>
                              ₹{it.subtotal?.toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    <div className={styles.billTotalSummaryRow}>
                      <div className={styles.billTotalLeftCol}>
                        <span className={styles.billTotalLabel}>Total Amount</span>
                        <span className={styles.billTotalSubLabel}>Spot payout via UPI / Cash</span>
                      </div>
                      <span className={styles.billTotalValue}>
                        ₹{currentMobileOrder.finalSettledTotal?.toFixed(2) || '2,580.45'}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    className={styles.confirmPayBtn}
                    onClick={() => setOrderStage(currentMobileOrder.id, 'completed')}
                  >
                    <CheckCircle2 size={18} />
                    <span>Confirm &amp; Pay</span>
                  </button>

                  <div className={styles.infoNotePill}>
                    <Info size={16} color="#d97706" />
                    <span>You can review weight &amp; price before making the payment.</span>
                  </div>
                </>
              )}

              {currentMobileOrder.stage === 'completed' && (
                <>
                  <div className={styles.statusIllustrationBox}>
                    <PickupCompletedIllustration />
                  </div>

                  <div className={styles.completedMetricsCard}>
                    <div className={styles.completedMetricItem}>
                      <span className={styles.completedMetricLabel}>Total Weight</span>
                      <span className={styles.completedMetricValue}>118.6 kg</span>
                    </div>
                    <div className={styles.completedMetricItem}>
                      <span className={styles.completedMetricLabel}>Amount Paid</span>
                      <span className={styles.completedMetricValue}>
                        ₹{currentMobileOrder.finalSettledTotal?.toFixed(2) || '2,845'}
                      </span>
                    </div>
                  </div>

                  {/* 5-Star Private Rating Section */}
                  <div className={styles.mobileRatingBox}>
                    <span className={styles.ratingTitlePrompt}>Rate your experience</span>
                    <div className={styles.starRatingRow}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          className={`${styles.mobileStarBtn} ${
                            mobileRating >= star ? styles.mobileStarActive : ''
                          }`}
                          onClick={() => {
                            setMobileRating(star);
                            setMobileRated(true);
                          }}
                        >
                          <Star
                            size={26}
                            fill={mobileRating >= star ? '#f59e0b' : 'none'}
                            stroke="currentColor"
                          />
                        </button>
                      ))}
                    </div>
                    {mobileRated && (
                      <span style={{ fontSize: '0.72rem', color: '#16a34a', fontWeight: 700 }}>
                        Thank you! Reviews remain private for quality management.
                      </span>
                    )}
                  </div>

                  <div className={styles.mobileCompletedActionRow}>
                    <button
                      type="button"
                      className={styles.viewSummaryBtn}
                      onClick={() => setSelectedMobileOrderId(null)}
                    >
                      <FileText size={16} />
                      <span>Order Summary</span>
                    </button>
                    <Link to="/household" className={styles.goHomeBtn}>
                      <span>Go Home</span>
                    </Link>
                  </div>
                </>
              )}
            </div>

            {/* Supporting Section 1: Pickup Details */}
            <div className={styles.supportingCard}>
              <h4 className={styles.supportingCardTitle}>Pickup Details</h4>
              <div className={styles.supportingInfoRow}>
                <Calendar size={16} />
                <span>
                  {currentMobileOrder.preferredDate}, {currentMobileOrder.preferredSlot}
                </span>
              </div>
              <div className={styles.supportingInfoRow}>
                <MapPin size={16} />
                <span>{currentMobileOrder.pickupAddress}</span>
              </div>
            </div>

            {/* Supporting Section 2: Merchant Details (when assigned) */}
            {currentMobileOrder.merchantName && currentMobileOrder.stage !== 'posted' && (
              <div className={styles.supportingCard}>
                <h4 className={styles.supportingCardTitle}>
                  <span>Merchant Partner</span>
                  <span style={{ fontSize: '0.72rem', color: '#16a34a', fontWeight: 700, display: 'inline-flex', alignItems: 'center' }}>
                    <Check size={12} strokeWidth={3} aria-hidden="true" style={{ marginRight: 3 }} /> Verified
                  </span>
                </h4>
                <div className={styles.supportingInfoRow}>
                  <User size={16} />
                  <span>
                    {currentMobileOrder.merchantName} (<Star size={11} fill="#F59E0B" color="#F59E0B" aria-hidden="true" style={{ verticalAlign: -1 }} /> {currentMobileOrder.merchantRating || 4.8})
                  </span>
                </div>
                <div className={styles.supportingInfoRow}>
                  <Truck size={16} />
                  <span>
                    {currentMobileOrder.vehicleType} • {currentMobileOrder.vehicleRegNumber}
                  </span>
                </div>
              </div>
            )}

            {/* Supporting Section 3: Scrap Details & Photos */}
            <div className={styles.supportingCard}>
              <h4 className={styles.supportingCardTitle}>Scrap Photos &amp; Items</h4>
              <div className={styles.scrapThumbnailStrip}>
                {currentMobileOrder.items.map((it) => (
                  <div
                    key={it.id}
                    className={styles.scrapThumbItem}
                    onClick={() => setPreviewPhoto(it.imageUrl)}
                  >
                    <img src={it.imageUrl} alt={it.title} className={styles.scrapThumbImg} />
                  </div>
                ))}
              </div>
            </div>

            {/* Stage Simulator Tester Bar */}
            <div className={styles.stageSimulatorBar}>
              <span style={{ fontWeight: 800, color: '#0f172a' }}>Stages:</span>
              {STAGE_STEPS.map((step, idx) => (
                <button
                  key={step.id}
                  type="button"
                  className={`${styles.stageSimPill} ${
                    currentMobileOrder.stage === step.id ? styles.stageSimPillActive : ''
                  }`}
                  onClick={() => setOrderStage(currentMobileOrder.id, step.id as OrderLifecycleStage)}
                >
                  {idx + 1}. {step.label.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

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
