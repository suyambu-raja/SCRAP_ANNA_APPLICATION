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
  Minus,
  Navigation,
  Info,
  HelpCircle,
  Eye,
  Radio,
  Sparkles,
  Maximize2,
  X,
  UploadCloud,
  FileCheck,
  Scale,
  ShieldCheck,
  IndianRupee,
  Download,
  Star,
  ArrowRight,
  Receipt,
  FileText,
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

type OrderLifecycleStage = 'pending' | 'en_route' | 'arrived' | 'billing_review' | 'completed';

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
  merchantReviewsCount?: number;
  merchantPhone?: string;
  vehicleType?: string;
  vehicleRegNumber?: string;
  etaMinutes?: number;
  distanceKm?: number;
  merchantViewsCount?: number;
  nearbyBuyersCount?: number;
  items: OrderMediaItem[];
  estimatedTotal: number;
  finalSettledTotal?: number;
  billSlipNumber?: string;
}

const SAMPLE_ORDERS: HouseholdOrder[] = [
  {
    id: 'ord-1',
    orderNumber: 'SA12345678',
    bookedDate: '01 May 2025, 10:30 AM',
    pickupAddress: '12, Anna Nagar 3rd Street, Madurai, Tamil Nadu - 625020',
    preferredDate: '01 May 2025',
    preferredSlot: '10:00 AM - 12:00 PM',
    stage: 'en_route', // Stages: 'en_route' -> 'arrived' -> 'billing_review' -> 'completed'
    pickupOtp: '8492',
    billingOtp: '4190',
    billSlipNumber: 'SLP-2025-05-SA12345678',
    merchantName: 'Selvam Scrap Traders',
    merchantRating: 4.6,
    merchantReviewsCount: 120,
    merchantPhone: '+91 98765 43210',
    vehicleType: 'Tata 407 Flatbed Truck',
    vehicleRegNumber: 'TN 09 BX 4421',
    etaMinutes: 12,
    distanceKm: 2.4,
    items: [
      {
        id: 'it-1',
        title: 'Copper Wires & Armature',
        weight: '2.5 KG',
        rate: '₹720 / KG',
        actualWeighedKg: 2.8,
        ratePerKg: 720,
        subtotal: 2016.0,
        imageUrl: '/scrap-copper-wire.jpg',
      },
      {
        id: 'it-2',
        title: 'Steel & Construction Rods',
        weight: '8.4 KG',
        rate: '₹38.50 / KG',
        actualWeighedKg: 9.2,
        ratePerKg: 38.5,
        subtotal: 354.2,
        imageUrl: '/scrap-iron.jpg',
      },
      {
        id: 'it-3',
        title: 'Old Newspapers & Cartons',
        weight: '12.0 KG',
        rate: '₹14.50 / KG',
        actualWeighedKg: 14.5,
        ratePerKg: 14.5,
        subtotal: 210.25,
        imageUrl: '/scrap-cardboard.jpg',
      },
      {
        id: 'it-4',
        title: 'Complete Staged Bundle',
        weight: 'Total ~22.9 KG',
        rate: 'Combined',
        imageUrl: '/household-scrap-bundle.jpg',
      },
    ],
    estimatedTotal: 2297,
    finalSettledTotal: 2580.45,
  },
  {
    id: 'ord-2',
    orderNumber: 'SA12345679',
    bookedDate: 'Today, 01:15 PM',
    pickupAddress: 'No. 42, 2nd Avenue, Anna Nagar East, Chennai - 600040',
    preferredDate: 'Today, 16 May 2025',
    preferredSlot: '04:00 PM - 07:00 PM',
    stage: 'pending', // Before merchant acceptance: NO random name/phone, shows merchant views!
    pickupOtp: '6104',
    billingOtp: '7823',
    billSlipNumber: 'SLP-2025-05-SA12345679',
    merchantViewsCount: 6,
    nearbyBuyersCount: 3,
    items: [
      {
        id: 'it-5',
        title: 'Bright Copper Coils',
        weight: '1.5 KG',
        rate: '₹720 / KG',
        actualWeighedKg: 1.6,
        ratePerKg: 720,
        subtotal: 1152.0,
        imageUrl: '/scrap-copper.jpg',
      },
      {
        id: 'it-6',
        title: 'Plumbing Brass Taps & Valves',
        weight: '1.0 KG',
        rate: '₹460 / KG',
        actualWeighedKg: 1.1,
        ratePerKg: 460,
        subtotal: 506.0,
        imageUrl: '/scrap-brass.jpg',
      },
      {
        id: 'it-7',
        title: 'Corrugated Brown Packaging',
        weight: '3.0 KG',
        rate: '₹14.50 / KG',
        actualWeighedKg: 3.5,
        ratePerKg: 14.5,
        subtotal: 50.75,
        imageUrl: '/scrap-cardboard.jpg',
      },
      {
        id: 'it-8',
        title: 'Copper & Paper Recyclables Bundle',
        weight: 'Total ~5.5 KG',
        rate: 'Combined',
        imageUrl: '/copper-paper-scrap-bundle.jpg',
      },
    ],
    estimatedTotal: 1583,
    finalSettledTotal: 1708.75,
  },
];

export function HouseholdOrders() {
  const [ordersList, setOrdersList] = useState<HouseholdOrder[]>(SAMPLE_ORDERS);
  const [selectedOrderId, setSelectedOrderId] = useState<string>('ord-1');
  const [selectedPhoto, setSelectedPhoto] = useState<OrderMediaItem | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [showHelpModal, setShowHelpModal] = useState<boolean>(false);
  const [completedRating, setCompletedRating] = useState<number>(5);
  const [reviewSubmitted, setReviewSubmitted] = useState<boolean>(false);

  const activeOrder = ordersList.find((o) => o.id === selectedOrderId) || ordersList[0];

  // State Transition Helpers
  const setOrderStage = (orderId: string, newStage: OrderLifecycleStage) => {
    setOrdersList((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          return {
            ...ord,
            stage: newStage,
            ...(newStage !== 'pending' && !ord.merchantName
              ? {
                  merchantName: 'Selvam Scrap Traders',
                  merchantRating: 4.6,
                  merchantReviewsCount: 120,
                  merchantPhone: '+91 98765 43210',
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

  return (
    <div className={styles.pageContainer}>
      {/* 1. Header Banner */}
      <div className={styles.headerBanner}>
        <div className={styles.headerTitleGroup}>
          <h1 className={styles.mainTitle}>Orders</h1>
          <p className={styles.mainSubtitle}>Track your pickup in real-time.</p>
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
                  : ord.stage === 'pending'
                  ? styles.tabStatusPillYellow
                  : styles.tabStatusPillGreen
              }
            >
              {ord.stage === 'completed'
                ? '✓ Completed'
                : ord.stage === 'billing_review'
                ? '● Reviewing Bill'
                : ord.stage === 'arrived'
                ? '● Merchant Arrived'
                : ord.stage === 'en_route'
                ? '● Merchant On The Way'
                : '● Awaiting Merchant'}
            </span>
          </button>
        ))}
      </div>

      {/* =========================================================================
          STAGE 4: ORDER COMPLETED SCREEN (AFTER BILLING OTP IS VERIFIED)
         ========================================================================= */}
      {activeOrder.stage === 'completed' ? (
        <div className={styles.completedSuccessCard}>
          <div className={styles.successCelebrationCircle}>
            <CheckCircle2 size={40} />
          </div>

          <div>
            <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#059669', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Pickup Completed Successfully
            </span>
            <h2 className={styles.completedPayoutAmount}>
              ₹{activeOrder.finalSettledTotal?.toFixed(2)} Paid
            </h2>
            <p style={{ margin: '0.25rem 0 0', fontSize: '0.86rem', color: '#64748b' }}>
              Instant spot payment transferred to your UPI / Cash account.
            </p>
          </div>

          {/* Receipt Breakdown Details Box */}
          <div className={styles.receiptDetailsBox}>
            <div className={styles.receiptRow}>
              <span style={{ color: '#64748b' }}>Order Number:</span>
              <strong style={{ color: '#0f172a' }}>#{activeOrder.orderNumber}</strong>
            </div>
            <div className={styles.receiptRow}>
              <span style={{ color: '#64748b' }}>Bill Slip Ref:</span>
              <strong style={{ color: '#0f172a' }}>{activeOrder.billSlipNumber}</strong>
            </div>
            <div className={styles.receiptRow}>
              <span style={{ color: '#64748b' }}>Merchant:</span>
              <strong style={{ color: '#0f172a' }}>{activeOrder.merchantName}</strong>
            </div>
            <div className={styles.receiptRow}>
              <span style={{ color: '#64748b' }}>Completed Date:</span>
              <strong style={{ color: '#0f172a' }}>{activeOrder.preferredDate}, 11:15 AM</strong>
            </div>
            <div className={styles.receiptRow}>
              <span style={{ color: '#64748b' }}>Digital Weighing:</span>
              <strong style={{ color: '#059669' }}>Verified 100% Accurate</strong>
            </div>
          </div>

          {/* 5-Star Rating Section */}
          <div className={styles.completedRatingSection}>
            <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0f172a' }}>
              Rate your experience with {activeOrder.merchantName}
            </span>

            <div className={styles.starRatingWrap}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className={`${styles.starBtn} ${completedRating >= star ? styles.starActive : ''}`}
                  onClick={() => {
                    setCompletedRating(star);
                    setReviewSubmitted(true);
                  }}
                >
                  <Star size={24} fill={completedRating >= star ? '#f59e0b' : 'none'} stroke="currentColor" />
                </button>
              ))}
            </div>
            {reviewSubmitted && (
              <span style={{ fontSize: '0.78rem', color: '#059669', fontWeight: 700 }}>
                Thank you for your rating! ✨
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '0.85rem', width: '100%', marginTop: '0.5rem' }}>
            <Link
              to="/household"
              style={{
                flex: 1,
                textAlign: 'center',
                padding: '0.75rem',
                borderRadius: '10px',
                border: '1.5px solid #e2e8f0',
                color: '#334155',
                fontWeight: 800,
                fontSize: '0.86rem',
                textDecoration: 'none',
              }}
            >
              Dashboard
            </Link>

            <Link
              to="/household/history"
              style={{
                flex: 1,
                textAlign: 'center',
                padding: '0.75rem',
                borderRadius: '10px',
                background: '#0f172a',
                color: '#fbc21a',
                fontWeight: 900,
                fontSize: '0.86rem',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.35rem',
              }}
            >
              <span>View in History</span>
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      ) : activeOrder.stage === 'billing_review' ? (
        /* =========================================================================
           STAGE 3: DIGITAL BILLING REVIEW (BILL CREATED BY MERCHANT)
           ========================================================================= */
        <div className={styles.billingPageContainer}>
          {/* Left Column: Digital Weighed Bill Slip */}
          <div className={styles.billingSlipCard}>
            <div className={styles.billHeaderRow}>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 800 }}>
                  Merchant Digital Bill Slip
                </span>
                <h3 style={{ margin: '0.15rem 0 0', fontSize: '1.35rem', fontWeight: 900, color: '#0f172a' }}>
                  {activeOrder.billSlipNumber}
                </h3>
              </div>

              <span className={styles.scaleVerifiedBadge}>
                <Scale size={14} />
                <span>Digital Scale Certified</span>
              </span>
            </div>

            {/* Merchant Details Info */}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem', color: '#475569' }}>
              <div>
                <span style={{ display: 'block', color: '#94a3b8', fontSize: '0.72rem' }}>MERCHANT</span>
                <strong style={{ color: '#0f172a' }}>{activeOrder.merchantName}</strong>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ display: 'block', color: '#94a3b8', fontSize: '0.72rem' }}>PHONE / UPI</span>
                <strong style={{ color: '#0f172a' }}>{activeOrder.merchantPhone}</strong>
              </div>
            </div>

            {/* Weighed Items Breakdown Table */}
            <table className={styles.billItemsTable}>
              <thead>
                <tr>
                  <th>Material</th>
                  <th>Weighed Qty</th>
                  <th>Rate</th>
                  <th style={{ textAlign: 'right' }}>Subtotal</th>
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
                <span style={{ fontSize: '0.74rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 800 }}>
                  Total Payout Payable
                </span>
                <span style={{ display: 'block', fontSize: '0.78rem', color: '#cbd5e1' }}>
                  Instant Spot UPI / Cash on Hand
                </span>
              </div>
              <span style={{ fontSize: '1.75rem', fontWeight: 900, color: '#fbc21a' }}>
                ₹{activeOrder.finalSettledTotal?.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Right Column: Billing Confirmation & OTP #2 */}
          <div className={styles.billConfirmationCard}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 900, color: '#0f172a' }}>
                Confirm Bill & Receive Payment
              </h3>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>
                Please review the measured weights on the digital scale. If correct, share your Billing Confirmation OTP with the merchant.
              </p>
            </div>

            {/* Billing OTP Highlight */}
            <div className={styles.billingOtpHighlight}>
              <span style={{ fontSize: '0.74rem', color: '#b45309', fontWeight: 800, textTransform: 'uppercase' }}>
                Billing Confirmation OTP (Share with Merchant)
              </span>
              <span style={{ fontSize: '2rem', fontWeight: 900, letterSpacing: '0.25em', color: '#b45309' }}>
                {activeOrder.billingOtp}
              </span>
              <span style={{ fontSize: '0.74rem', color: '#64748b' }}>
                Merchant enters this OTP to trigger instant spot payment transfer
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
        /* =========================================================================
           STAGE 1 & 2: TRACKING, MAP & MERCHANT ARRIVAL / OTP #1
           ========================================================================= */
        <>
          {/* Top Status Notification Banner */}
          <div className={styles.topStatusCard}>
            <div className={styles.topStatusLeft}>
              <div className={styles.checkCircleIcon}>
                <CheckCircle2 size={20} />
              </div>
              <div className={styles.topStatusTitles}>
                <h2 className={styles.statusHeading}>
                  {activeOrder.stage === 'arrived'
                    ? 'Merchant Arrived at Doorstep!'
                    : activeOrder.stage === 'en_route'
                    ? 'Pickup Confirmed!'
                    : 'Broadcasting Scrap Request...'}
                </h2>
                <p className={styles.statusSubheading}>
                  {activeOrder.stage === 'arrived'
                    ? `Executive ${activeOrder.merchantName} is outside your address. Tell your Pickup OTP to start weighing.`
                    : activeOrder.stage === 'en_route'
                    ? "We've notified nearby merchants. One of them is on the way to your location."
                    : `Notifying nearby verified scrap buyers in your area. ${activeOrder.merchantViewsCount || 0} merchants viewed your listing.`}
                </p>
              </div>
            </div>

            <div className={styles.topStatusRight}>
              <span className={styles.orderIdText}>Order ID: #{activeOrder.orderNumber}</span>
              <span className={styles.bookedDateText}>Booked on: {activeOrder.bookedDate}</span>
            </div>
          </div>

          {/* STAGE 2: MERCHANT ARRIVED ALERT & PICKUP OTP #1 BANNER */}
          {activeOrder.stage === 'arrived' && (
            <div className={styles.arrivedAlertBanner}>
              <div className={styles.arrivedLeftCol}>
                <div className={styles.arrivedTruckIcon}>
                  <Truck size={24} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 900, color: '#065f46' }}>
                    Executive at Your Doorstep: {activeOrder.merchantName}
                  </h3>
                  <span style={{ fontSize: '0.8rem', color: '#047857' }}>
                    Vehicle: {activeOrder.vehicleType} ({activeOrder.vehicleRegNumber})
                  </span>
                </div>
              </div>

              {/* Pickup Verification OTP (OTP #1) */}
              <div className={styles.otpDisplayBox}>
                <span className={styles.otpInstructionLabel}>Tell this Pickup OTP to Merchant:</span>
                <span className={styles.otpCodeLarge}>{activeOrder.pickupOtp}</span>
                <button
                  type="button"
                  onClick={() => setOrderStage(activeOrder.id, 'billing_review')}
                  style={{
                    background: '#059669',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '0.35rem 0.85rem',
                    fontSize: '0.74rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    marginTop: '0.25rem',
                  }}
                >
                  Merchant Verified OTP → Open Billing
                </button>
              </div>
            </div>
          )}

          {/* Main 2-Column Content Grid */}
          <div className={styles.orderContentGrid}>
            {/* Left Column: Pickup Details & Merchant Details */}
            <div className={styles.leftColStack}>
              {/* Pickup Details Card */}
              <div className={styles.detailsCard}>
                <h3 className={styles.cardTitle}>Pickup Details</h3>

                <div className={styles.infoRowsList}>
                  {/* Pickup Address */}
                  <div className={styles.infoRowItem}>
                    <MapPin size={18} className={styles.infoRowIcon} />
                    <div className={styles.infoRowContent}>
                      <span className={styles.infoRowLabel}>Pickup Address</span>
                      <span className={styles.infoRowValue}>{activeOrder.pickupAddress}</span>
                    </div>
                  </div>

                  {/* Preferred Date */}
                  <div className={styles.infoRowItem}>
                    <Calendar size={18} className={styles.infoRowIcon} />
                    <div className={styles.infoRowContent}>
                      <span className={styles.infoRowLabel}>Preferred Date</span>
                      <span className={styles.infoRowValue}>{activeOrder.preferredDate}</span>
                    </div>
                  </div>

                  {/* Preferred Time Slot */}
                  <div className={styles.infoRowItem}>
                    <Clock size={18} className={styles.infoRowIcon} />
                    <div className={styles.infoRowContent}>
                      <span className={styles.infoRowLabel}>Preferred Time Slot</span>
                      <span className={styles.infoRowValue}>{activeOrder.preferredSlot}</span>
                    </div>
                  </div>

                  {/* Status */}
                  <div className={styles.infoRowItem}>
                    <CheckCircle2 size={18} className={styles.infoRowIcon} color="#059669" />
                    <div className={styles.infoRowContent}>
                      <span className={styles.infoRowLabel}>Status</span>
                      {activeOrder.stage !== 'pending' ? (
                        <span className={styles.statusPillOnWay}>
                          <span>
                            {activeOrder.stage === 'arrived'
                              ? 'Merchant Arrived'
                              : 'Merchant On The Way'}
                          </span>
                        </span>
                      ) : (
                        <span className={styles.statusPillSearching}>
                          <span>Searching for Nearby Merchants</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Merchant Details Card (ONLY SHOWN AFTER CONFIRMATION - NEVER BEFORE!) */}
              {activeOrder.stage !== 'pending' ? (
                <div className={styles.merchantDetailsCard}>
                  <h3 className={styles.cardTitle}>Merchant Details</h3>

                  <div className={styles.merchantProfileRow}>
                    <div className={styles.merchantAvatarWrap}>
                      <User size={26} />
                    </div>
                    <div className={styles.merchantNameCol}>
                      <h4 className={styles.merchantNameText}>{activeOrder.merchantName}</h4>
                      <span className={styles.merchantRatingText}>
                        ★ {activeOrder.merchantRating} ({activeOrder.merchantReviewsCount}+ ratings)
                      </span>
                      <span className={styles.merchantPhoneText}>{activeOrder.merchantPhone}</span>
                    </div>
                  </div>

                  {activeOrder.stage === 'en_route' && (
                    <>
                      <div className={styles.arrivingBox}>
                        <span className={styles.arrivingLabel}>Arriving in</span>
                        <h3 className={styles.arrivingTimeBig}>{activeOrder.etaMinutes} mins</h3>
                        <span className={styles.arrivingDistanceSub}>
                          ({activeOrder.distanceKm} km away from you)
                        </span>
                      </div>

                      {/* Demo Button to simulate arrival */}
                      <button
                        type="button"
                        onClick={() => setOrderStage(activeOrder.id, 'arrived')}
                        style={{
                          background: '#0f172a',
                          color: '#fbc21a',
                          border: 'none',
                          padding: '0.6rem 1rem',
                          borderRadius: '8px',
                          fontWeight: 800,
                          fontSize: '0.8rem',
                          cursor: 'pointer',
                          marginTop: '0.25rem',
                        }}
                      >
                        🚚 Simulate Merchant Arrived at Doorstep
                      </button>
                    </>
                  )}
                </div>
              ) : (
                /* PENDING STATE: Live Merchant Broadcast (NO random name or phone shown!) */
                <div className={styles.broadcastingCard}>
                  <h3 className={styles.cardTitle} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Radio size={18} color="#b45309" />
                    <span>Live Merchant Broadcast</span>
                  </h3>

                  <div className={styles.merchantCountBanner}>
                    <span className={styles.countNumberLarge}>{activeOrder.merchantViewsCount}</span>
                    <div className={styles.countTextCol}>
                      <span className={styles.countMainText}>Merchants Viewed This Post</span>
                      <span className={styles.countSubText}>
                        {activeOrder.nearbyBuyersCount} nearby buyers are evaluating your scrap list
                      </span>
                    </div>
                  </div>

                  <p style={{ margin: 0, fontSize: '0.78rem', color: '#64748b', lineHeight: 1.4 }}>
                    Once a verified scrap merchant accepts your order, their profile, phone number, and live GPS location will appear here automatically.
                  </p>

                  <button
                    type="button"
                    onClick={() => setOrderStage(activeOrder.id, 'en_route')}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.4rem',
                      background: '#0f172a',
                      color: '#fbc21a',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '0.6rem 1rem',
                      fontSize: '0.8rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      marginTop: '0.25rem',
                    }}
                  >
                    <Sparkles size={14} />
                    <span>Simulate Merchant Acceptance (Test Demo)</span>
                  </button>
                </div>
              )}
            </div>

            {/* Right Column: Live Map (When Confirmed) OR Single Box for Uploaded Images (When Pending) */}
            <div className={styles.rightColStack}>
              {activeOrder.stage !== 'pending' ? (
                /* LIVE GPS MAP (MATCHING ATTACHED SCREENSHOT) */
                <div className={styles.mapCard}>
                  <div className={styles.mapHeaderRow}>
                    <div className={styles.mapTitleGroup}>
                      <h3 className={styles.mapMainTitle}>
                        <span>Live Merchant Location</span>
                        <span className={styles.liveGreenPill}>● Live</span>
                      </h3>
                      <p className={styles.mapSubtitle}>The merchant is on the way to your location.</p>
                    </div>
                  </div>

                  {/* Vector Map Viewport */}
                  <div className={styles.mapViewportFrame}>
                    <svg
                      className={styles.vectorMapSvg}
                      viewBox="0 0 800 480"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      {/* Background terrain */}
                      <rect width="800" height="480" fill="#f8fafc" />

                      {/* Secondary Roads */}
                      <path
                        d="M 60 40 L 760 40 M 60 120 L 760 120 M 60 200 L 760 200 M 60 280 L 760 280 M 60 360 L 760 360 M 60 440 L 760 440"
                        stroke="#e2e8f0"
                        strokeWidth="4"
                        strokeDasharray="6 6"
                      />
                      <path
                        d="M 120 20 L 120 460 M 240 20 L 240 460 M 360 20 L 360 460 M 480 20 L 480 460 M 600 20 L 600 460 M 720 20 L 720 460"
                        stroke="#e2e8f0"
                        strokeWidth="4"
                        strokeDasharray="6 6"
                      />

                      {/* Main Arterials */}
                      <path d="M 0 160 Q 250 140 500 180 T 800 150" stroke="#cbd5e1" strokeWidth="12" />
                      <path d="M 160 0 Q 180 240 140 480" stroke="#cbd5e1" strokeWidth="10" />
                      <path d="M 520 0 L 520 480" stroke="#cbd5e1" strokeWidth="10" />
                      <path d="M 0 380 L 800 380" stroke="#cbd5e1" strokeWidth="10" />

                      {/* Labels */}
                      <text x="175" y="240" fill="#94a3b8" fontSize="10" fontWeight="600" transform="rotate(-65 175 240)">
                        80 Feet Road Main Rd
                      </text>
                      <text x="530" y="220" fill="#94a3b8" fontSize="10" fontWeight="600" transform="rotate(90 530 220)">
                        Main Rd
                      </text>
                      <text x="610" y="70" fill="#94a3b8" fontSize="10" fontWeight="600">
                        SIMMAKKAL
                      </text>
                      <text x="460" y="360" fill="#94a3b8" fontSize="10" fontWeight="600">
                        80 Feet Rd
                      </text>
                      <text x="690" y="260" fill="#94a3b8" fontSize="9" fontWeight="600">
                        P&T Nagar
                      </text>

                      {/* Landmarks */}
                      <circle cx="430" cy="115" r="4" fill="#3b82f6" />
                      <text x="442" y="118" fill="#64748b" fontSize="9">
                        Axis Bank
                      </text>
                      <circle cx="360" cy="80" r="4" fill="#ef4444" />
                      <text x="372" y="83" fill="#64748b" fontSize="9">
                        Vijaya Hospital
                      </text>

                      {/* Blue GPS Route */}
                      <path
                        d="M 330 255 L 430 255 Q 520 255 520 240 L 520 225 L 640 245"
                        stroke="#2563eb"
                        strokeWidth="5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>

                    {/* Live Moving Merchant Vehicle Marker */}
                    <div className={styles.mapTruckMarkerWrap}>
                      <div className={styles.truckPopupCard}>
                        <span className={styles.truckPopupName}>{activeOrder.merchantName}</span>
                        <span className={styles.truckPopupSub}>{activeOrder.distanceKm} km away</span>
                        <span className={styles.truckPopupEta}>Arriving in {activeOrder.etaMinutes} mins</span>
                      </div>
                      <div className={styles.truckPinIconBox}>
                        <Truck size={16} />
                      </div>
                    </div>

                    {/* Destination Location Pin */}
                    <div className={styles.mapDestMarkerWrap}>
                      <MapPin size={34} className={styles.destPinIcon} />
                      <div className={styles.destPopupCard}>
                        <span className={styles.destPopupTitle}>Your Location</span>
                        <span className={styles.destPopupSub}>Anna Nagar 3rd Street, Madurai</span>
                      </div>
                    </div>

                    {/* Controls */}
                    <div className={styles.mapControlsWrap}>
                      <button
                        type="button"
                        className={styles.mapControlBtn}
                        onClick={() => setZoomLevel((z) => Math.min(z + 0.2, 2))}
                        title="Zoom in"
                      >
                        <Plus size={16} />
                      </button>
                      <button
                        type="button"
                        className={styles.mapControlBtn}
                        onClick={() => setZoomLevel((z) => Math.max(z - 0.2, 0.8))}
                        title="Zoom out"
                      >
                        <Minus size={16} />
                      </button>
                      <button
                        type="button"
                        className={styles.mapControlBtn}
                        onClick={() => setZoomLevel(1)}
                        title="Center on my location"
                      >
                        <Navigation size={15} />
                      </button>
                    </div>
                  </div>

                  {/* Uploaded Scrap Photos in Confirmed View */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginTop: '0.25rem' }}>
                    <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0f172a' }}>
                      Uploaded Scrap Photos ({activeOrder.items.length})
                    </span>
                    <div className={styles.photoThumbGrid}>
                      {activeOrder.items.map((it) => (
                        <div
                          key={it.id}
                          className={styles.thumbCardSingle}
                          onClick={() => setSelectedPhoto(it)}
                          title={it.title}
                        >
                          <img src={it.imageUrl} alt={it.title} className={styles.thumbImgSingle} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                /* PENDING STATE: Single Box for Scrap Image Upload & Breakdown */
                <div className={styles.singleUploadBox}>
                  <div className={styles.singleBoxHeader}>
                    <h3 className={styles.cardTitle}>
                      Current Order Items & Uploaded Photos ({activeOrder.items.length})
                    </h3>
                    <span style={{ fontSize: '0.74rem', color: '#64748b' }}>Click photo to preview</span>
                  </div>

                  {/* Single Box Photo Grid */}
                  <div className={styles.photoThumbGrid}>
                    {activeOrder.items.map((it) => (
                      <div
                        key={it.id}
                        className={styles.thumbCardSingle}
                        onClick={() => setSelectedPhoto(it)}
                        title="Click for full photo"
                      >
                        <img src={it.imageUrl} alt={it.title} className={styles.thumbImgSingle} />
                      </div>
                    ))}
                  </div>

                  {/* Items Breakdown */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
                    <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0f172a' }}>
                      Itemized Rate Summary
                    </span>
                    {activeOrder.items.map((it) => (
                      <div
                        key={it.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '0.65rem 0.85rem',
                          borderRadius: '8px',
                          background: '#f8fafc',
                          border: '1px solid #f1f5f9',
                        }}
                      >
                        <div>
                          <span style={{ fontSize: '0.84rem', fontWeight: 700, color: '#0f172a', display: 'block' }}>
                            {it.title}
                          </span>
                          <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                            {it.weight} • {it.rate}
                          </span>
                        </div>
                        <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#059669' }}>Verified</span>
                      </div>
                    ))}
                  </div>

                  {/* Estimated Payout Box */}
                  <div
                    style={{
                      background: '#0f172a',
                      color: '#ffffff',
                      padding: '1rem 1.25rem',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div>
                      <span style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'block', textTransform: 'uppercase' }}>
                        Estimated Payout
                      </span>
                      <span style={{ fontSize: '0.74rem', color: '#cbd5e1' }}>Spot UPI / Cash upon Weighing</span>
                    </div>
                    <span style={{ fontSize: '1.45rem', fontWeight: 900, color: '#fbc21a' }}>
                      ₹{activeOrder.estimatedTotal.toLocaleString()}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Notice Bar */}
          <div className={styles.bottomNoticeBar}>
            <div className={styles.noticeLeftText}>
              <Info size={16} />
              <span>You will receive a call from the merchant upon arrival.</span>
            </div>

            <button
              type="button"
              className={styles.needHelpBtn}
              onClick={() => setShowHelpModal(true)}
            >
              Need Help?
            </button>
          </div>
        </>
      )}

      {/* DETAIL VISION LIGHTBOX MODAL */}
      {selectedPhoto && (
        <div className={styles.lightboxOverlay} onClick={() => setSelectedPhoto(null)}>
          <div className={styles.lightboxBox} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800 }}>
                  {selectedPhoto.title}
                </h3>
                <span style={{ fontSize: '0.78rem', color: '#fbc21a', fontWeight: 700 }}>
                  {selectedPhoto.weight} • {selectedPhoto.rate}
                </span>
              </div>

              <button
                type="button"
                onClick={() => setSelectedPhoto(null)}
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  border: 'none',
                  color: '#ffffff',
                  borderRadius: '8px',
                  padding: '0.35rem',
                  cursor: 'pointer',
                }}
              >
                <X size={18} />
              </button>
            </div>

            <div className={styles.lightboxStage}>
              <img src={selectedPhoto.imageUrl} alt={selectedPhoto.title} className={styles.lightboxImg} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => setSelectedPhoto(null)}
                style={{
                  background: '#fbc21a',
                  color: '#0f172a',
                  fontWeight: 800,
                  fontSize: '0.82rem',
                  padding: '0.5rem 1.25rem',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* NEED HELP MODAL */}
      {showHelpModal && (
        <div className={styles.lightboxOverlay} onClick={() => setShowHelpModal(false)}>
          <div className={styles.lightboxBox} style={{ maxWidth: '480px' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#ffffff' }}>
                Pickup Support & Help
              </h3>
              <button
                type="button"
                onClick={() => setShowHelpModal(false)}
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  border: 'none',
                  color: '#ffffff',
                  borderRadius: '8px',
                  padding: '0.35rem',
                  cursor: 'pointer',
                }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.85rem', color: '#cbd5e1' }}>
              <p style={{ margin: 0 }}>
                Need to reschedule your scrap pickup or change the pickup location?
              </p>
              <div style={{ background: '#1e293b', padding: '0.85rem', borderRadius: '8px' }}>
                <span style={{ fontWeight: 700, color: '#ffffff', display: 'block' }}>Scrap Anna Helpline:</span>
                <span style={{ color: '#fbc21a', fontWeight: 800, fontSize: '1rem' }}>+91 98400 12345</span>
                <span style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', marginTop: '2px' }}>
                  Available 08:00 AM – 08:00 PM (Mon–Sun)
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={() => setShowHelpModal(false)}
                style={{
                  background: '#fbc21a',
                  color: '#0f172a',
                  fontWeight: 800,
                  fontSize: '0.82rem',
                  padding: '0.5rem 1.25rem',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default HouseholdOrders;
