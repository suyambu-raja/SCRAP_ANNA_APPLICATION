import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  Clock,
  CheckCircle2,
  Truck,
  Building2,
  MapPin,
  Phone,
  ShieldCheck,
  Calendar,
  AlertTriangle,
  X,
  ChevronRight,
  Sparkles,
  FileText,
  KeyRound,
  Download,
  Eye,
  Info,
  Scale,
  ArrowRight,
  RotateCcw,
  Check,
  FileCheck,
  Layers,
  Star,
  ExternalLink,
} from 'lucide-react';
import styles from './IndustryOrders.module.css';

interface OrderScrapItem {
  name: string;
  estimatedQty: string;
  actualWeighedQty?: string;
  ratePerUnit: number;
  unit: string;
  lineTotal?: number;
}

interface IndustryOrder {
  id: string;
  orderNumber: string;
  requestId: string;
  merchantPhoto?: string;
  merchantName: string;
  shopName: string;
  merchantPhone: string;
  merchantRating: number;
  reviewsCount?: number;
  pickupDate: string;
  pickupTimeSlot: string;
  pickupAddress: string;
  factoryGate: string;
  vehicleType: string;
  vehicleRegNumber: string;
  vehicleCapacity: string;
  driverName: string;
  status: 'Scheduled' | 'Bill_Review' | 'Completed' | 'Cancelled';
  items: OrderScrapItem[];
  pickupOtp: string; // OTP #1: Confirm Pickup
  billingOtp: string; // OTP #2: Confirm Bill
  billSlipNumber?: string;
  finalSettledAmount?: number;
  cancellationReason?: string;
  cancelledAt?: string;
}

const INITIAL_ORDERS: IndustryOrder[] = [
  {
    id: 'ord-1',
    orderNumber: 'ORD-250513-00078',
    requestId: 'REQ-250513-00078',
    merchantPhoto: '/industrial-facility.jpg',
    merchantName: 'Ramesh Traders & Metal Recyclers',
    shopName: 'SIDCO Industrial Scrap Yard #12, Guindy, Chennai – 600032',
    merchantPhone: '+91 98401 23456',
    merchantRating: 4.9,
    reviewsCount: 126,
    pickupDate: 'Friday, 16 May 2025',
    pickupTimeSlot: '10:00 AM – 12:00 PM',
    pickupAddress: 'Sri Venkatesh Industries, 24, 5th Main Road, SIDCO Industrial Estate, Guindy, Chennai – 600032',
    factoryGate: 'Gate 2 (Loading Bay Access)',
    vehicleType: 'Tata 407 Flatbed Truck',
    vehicleRegNumber: 'TN 09 BX 4421',
    vehicleCapacity: '3.0 Tons',
    driverName: 'Murugan K. (Gate Pass Verified)',
    status: 'Scheduled', // Initial active stage: Merchant Arrives & Verify OTP #1
    items: [
      {
        name: 'Heavy Steel Turnings & Iron Scrap',
        estimatedQty: '650 KG',
        actualWeighedQty: '680 KG',
        ratePerUnit: 38,
        unit: 'KG',
        lineTotal: 25840,
      },
      {
        name: 'Copper Armature & Motor Scrap',
        estimatedQty: '180 KG',
        actualWeighedQty: '152 KG',
        ratePerUnit: 680,
        unit: 'KG',
        lineTotal: 103360,
      },
      {
        name: 'Industrial HDPE Barrels & Drums',
        estimatedQty: '10 Units',
        actualWeighedQty: '10 Units',
        ratePerUnit: 450,
        unit: 'Units',
        lineTotal: 4500,
      },
    ],
    pickupOtp: '8492',
    billingOtp: '4190',
    billSlipNumber: 'SLP-8812-GUINDY',
    finalSettledAmount: 133700,
  },
  {
    id: 'ord-2',
    orderNumber: 'ORD-250511-00049',
    requestId: 'REQ-250511-00049',
    merchantPhoto: '/industrial-facility.jpg',
    merchantName: 'Madras Paper & Carton Mill Buyers',
    shopName: 'Chromepet Recycling Yard #4, Chennai – 600044',
    merchantPhone: '+91 98840 99881',
    merchantRating: 4.8,
    reviewsCount: 89,
    pickupDate: '11 May 2025',
    pickupTimeSlot: '09:00 AM – 11:00 AM',
    pickupAddress: 'Sri Venkatesh Industries, SIDCO Industrial Estate, Guindy, Chennai – 600032',
    factoryGate: 'Main Gate 1',
    vehicleType: 'Eicher 14ft Covered Truck',
    vehicleRegNumber: 'TN 10 CA 9002',
    vehicleCapacity: '4.5 Tons',
    driverName: 'Dass S. (Gate Pass Verified)',
    status: 'Completed',
    items: [
      {
        name: 'Corrugated Packaging Boxes & Sheets',
        estimatedQty: '850 KG',
        actualWeighedQty: '880 KG',
        ratePerUnit: 14.5,
        unit: 'KG',
        lineTotal: 12760,
      },
    ],
    pickupOtp: '1092',
    billingOtp: '7721',
    billSlipNumber: 'SLP-7734-CHROMEPET',
    finalSettledAmount: 12760,
  },
  {
    id: 'ord-3',
    orderNumber: 'ORD-250508-00032',
    requestId: 'REQ-250508-00032',
    merchantPhoto: '/industrial-facility.jpg',
    merchantName: 'Guindy Polymer & Drum Recyclers',
    shopName: 'Guindy Industrial Area, Chennai – 600032',
    merchantPhone: '+91 98412 33445',
    merchantRating: 4.7,
    reviewsCount: 64,
    pickupDate: '08 May 2025',
    pickupTimeSlot: '11:00 AM – 01:00 PM',
    pickupAddress: 'Sri Venkatesh Industries, SIDCO Industrial Estate, Guindy, Chennai – 600032',
    factoryGate: 'Gate 2',
    vehicleType: 'Tata Ace Mega',
    vehicleRegNumber: 'TN 05 DF 3321',
    vehicleCapacity: '1.5 Tons',
    driverName: 'Rajendran M.',
    status: 'Cancelled',
    cancellationReason: 'Material changed / disposed internally in plant overhaul',
    cancelledAt: '08 May 2025, 10:15 AM',
    items: [
      {
        name: 'Industrial HDPE Chemical Barrels',
        estimatedQty: '1.2 Tons',
        ratePerUnit: 24,
        unit: 'KG',
      },
    ],
    pickupOtp: '6610',
    billingOtp: '9920',
  },
];

const CANCEL_REASONS = [
  'Material changed / disposed internally in plant overhaul',
  'Merchant delayed / missed time window',
  'Quantity significantly changed',
  'Price / Quantity disagreement on inspection',
  'Pickup facility / gate issue at factory',
  'Other administrative reasons',
];

export default function IndustryOrders() {
  const [orders, setOrders] = useState<IndustryOrder[]>(INITIAL_ORDERS);
  const [activeFilter, setActiveFilter] = useState<'Orders' | 'Completed' | 'Cancelled'>('Orders');
  const [cancelModalOrder, setCancelModalOrder] = useState<IndustryOrder | null>(null);
  const [cancelReason, setCancelReason] = useState<string>(CANCEL_REASONS[0]);
  const [activeCancelledViewOrder, setActiveCancelledViewOrder] = useState<IndustryOrder | null>(null);
  const [otpInputs, setOtpInputs] = useState<{ [orderId: string]: string }>({
    'ord-1': '4190',
  });

  // Simulation handlers for interactive verification
  const handleVerifyPickupOtp = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              status: 'Bill_Review',
              billSlipNumber: 'SLP-8812-GUINDY',
              finalSettledAmount: 133700,
              items: o.items.map((it) => ({
                ...it,
                actualWeighedQty:
                  it.unit === 'KG'
                    ? `${parseInt(it.estimatedQty || '500') + 30} KG`
                    : it.estimatedQty,
                lineTotal:
                  (parseInt(it.estimatedQty || '500') + (it.unit === 'KG' ? 30 : 0)) *
                  it.ratePerUnit,
              })),
            }
          : o
      )
    );
  };

  const handleVerifyBillingOtp = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              status: 'Completed',
            }
          : o
      )
    );
  };

  const handleConfirmCancel = () => {
    if (!cancelModalOrder) return;
    const cancelledOrder: IndustryOrder = {
      ...cancelModalOrder,
      status: 'Cancelled',
      cancellationReason: cancelReason,
      cancelledAt: `Today, ${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`,
    };
    setOrders((prev) =>
      prev.map((o) => (o.id === cancelModalOrder.id ? cancelledOrder : o))
    );
    setCancelModalOrder(null);
    setActiveCancelledViewOrder(cancelledOrder);
  };

  const [expandedInvoiceOrderIds, setExpandedInvoiceOrderIds] = useState<string[]>([]);

  const toggleInvoiceExpand = (orderId: string) => {
    setExpandedInvoiceOrderIds((prev) =>
      prev.includes(orderId) ? prev.filter((id) => id !== orderId) : [...prev, orderId]
    );
  };

  const filteredOrders = orders.filter((order) => {
    if (activeFilter === 'Orders') {
      return order.status === 'Scheduled' || order.status === 'Bill_Review';
    }
    if (activeFilter === 'Completed') {
      return order.status === 'Completed';
    }
    if (activeFilter === 'Cancelled') {
      return order.status === 'Cancelled';
    }
    return true;
  });

  return (
    <div className={styles.pageContainer}>
      {/* 1. Page Header */}
      <div className={styles.pageHeaderSection}>
        <div className={styles.pageHeaderLeft}>
          <h1 className={styles.pageMainTitle}>Pickup Orders</h1>
          <p className={styles.pageSubtitle}>
            Track scheduled merchant visits, pickup verification, billing and settlement.
          </p>
        </div>

        <Link to="/industry/post-requirement" className={styles.primaryPostBtn}>
          <span>+ Post New Pickup</span>
        </Link>
      </div>

      {/* 2. Status Filter Tabs (Orders: Ongoing Only, Completed, Cancelled) */}
      <div className={styles.tabsContainer}>
        {(
          [
            { id: 'Orders', label: 'Orders', icon: Package },
            { id: 'Completed', label: 'Completed', icon: CheckCircle2 },
            { id: 'Cancelled', label: 'Cancelled', icon: AlertTriangle },
          ] as const
        ).map((tab) => {
          const count =
            tab.id === 'Orders'
              ? orders.filter((o) => o.status === 'Scheduled' || o.status === 'Bill_Review').length
              : orders.filter((o) => o.status === tab.id).length;
          const IconComp = tab.icon;

          return (
            <button
              key={tab.id}
              type="button"
              className={`${styles.filterTabPill} ${
                activeFilter === tab.id ? styles.filterTabPillActive : ''
              }`}
              onClick={() => {
                setActiveFilter(tab.id as any);
                setActiveCancelledViewOrder(null);
              }}
            >
              <IconComp size={15} className={styles.tabIcon} />
              <span>{tab.label}</span>
              <span className={styles.tabCountPill}>{count}</span>
            </button>
          );
        })}
      </div>

      {/* 3. Main Orders List Grid */}
      <div className={styles.ordersListGrid}>
        {filteredOrders.map((order) => (
          <div
            key={order.id}
            className={`${styles.orderCard} ${
              order.status === 'Completed'
                ? styles.cardCompleted
                : order.status === 'Cancelled'
                ? styles.cardCancelled
                : styles.cardActive
            }`}
          >
            {/* Top Row: Order ID, Ref Request ID, Materials Count, Status */}
            <div className={styles.orderTopBar}>
              <div className={styles.orderTopLeft}>
                <span className={styles.orderIdBadge}>{order.orderNumber}</span>
                <span className={styles.refRequestText}>Ref: {order.requestId}</span>
                <span className={styles.materialsCountBadge}>
                  {order.items.length} Scrap Material{order.items.length > 1 ? 's' : ''}
                </span>
              </div>

              {/* Status Badge */}
              <div className={styles.orderTopRight}>
                {order.status === 'Scheduled' && (
                  <span className={styles.statusScheduledBadge}>
                    <Truck size={14} />
                    <span>Merchant Arriving – Verify OTP #1</span>
                  </span>
                )}
                {order.status === 'Bill_Review' && (
                  <span className={styles.statusBillReviewBadge}>
                    <FileCheck size={14} />
                    <span>Bill Generated – Verify OTP #2</span>
                  </span>
                )}
                {order.status === 'Completed' && (
                  <span className={styles.statusCompletedBadge}>
                    <CheckCircle2 size={14} />
                    <span>✓ Picked Up &amp; Settled</span>
                  </span>
                )}
                {order.status === 'Cancelled' && (
                  <span className={styles.statusCancelledBadge}>
                    <X size={14} />
                    <span>✕ Order Cancelled</span>
                  </span>
                )}
              </div>
            </div>

            {/* ==============================================================
                STAGE 2: BILL REVIEW (70% LEFT BILL DETAILS + 30% RIGHT OTP #2)
                ============================================================== */}
            {order.status === 'Bill_Review' && (
              <div className={styles.activeOrderSplitLayout}>
                {/* 70% Left: Digital Measurement Bill & Table */}
                <div className={styles.leftWeighbridgeCol}>
                  {/* Merchant Info Card: Photo, Name, Shop Name, Phone / Call Button */}
                  <div className={styles.merchantIdentityRow}>
                    <div className={styles.merchantAvatarBox}>
                      {order.merchantPhoto ? (
                        <img
                          src={order.merchantPhoto}
                          alt={order.merchantName}
                          className={styles.merchantPhotoImg}
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = '/industrial-facility.jpg';
                          }}
                        />
                      ) : (
                        <Building2 size={24} className={styles.merchantBuildingIcon} />
                      )}
                    </div>

                    <div className={styles.merchantInfoStack}>
                      <div className={styles.merchantTitleLine}>
                        <h4 className={styles.merchantName}>{order.merchantName}</h4>
                        <span className={styles.verifiedTag}>
                          <ShieldCheck size={12} /> Verified Merchant
                        </span>
                      </div>
                      <span className={styles.merchantShopText}>📍 {order.shopName}</span>
                    </div>

                    <div className={styles.merchantCallTopWrap}>
                      <a
                        href={`tel:${order.merchantPhone}`}
                        className={styles.merchantCallTopBtn}
                        title={`Call Driver ${order.merchantPhone}`}
                      >
                        <Phone size={14} />
                        <span>Call Driver ({order.merchantPhone})</span>
                      </a>
                    </div>
                  </div>

                  <div className={styles.weighbridgeCard}>
                    <div className={styles.weighbridgeHeader}>
                      <div className={styles.wbTitleBlock}>
                        <span className={styles.wbUppercaseTag}>
                          SCRAP MEASUREMENT BILL GENERATED
                        </span>
                        <h3 className={styles.wbTitle}>
                          Measurement Bill #{order.billSlipNumber}
                        </h3>
                      </div>

                      <button
                        type="button"
                        className={styles.downloadSlipOutlineBtn}
                        onClick={() =>
                          alert(`Downloading Measurement Slip ${order.billSlipNumber}...`)
                        }
                      >
                        <Download size={14} />
                        <span>Download Measurement Slip</span>
                      </button>
                    </div>

                    {/* Enterprise Measurement Table */}
                    <div className={styles.weighbridgeTableContainer}>
                      <table className={styles.weighbridgeTable}>
                        <thead>
                          <tr>
                            <th>SCRAP MATERIAL</th>
                            <th>ACTUAL MEASURED QTY</th>
                            <th>AGREED RATE</th>
                            <th className={styles.thAlignRight}>ITEM TOTAL</th>
                          </tr>
                        </thead>
                        <tbody>
                          {order.items.map((item, idx) => (
                            <tr key={idx}>
                              <td>
                                <strong className={styles.tableMatName}>{item.name}</strong>
                              </td>
                              <td>
                                <span className={styles.tableActualWeight}>
                                  {item.actualWeighedQty}
                                </span>
                                <span className={styles.tableEstWeight}>
                                  (Est: {item.estimatedQty})
                                </span>
                              </td>
                              <td>
                                <span className={styles.tableRate}>
                                  ₹{item.ratePerUnit}/{item.unit}
                                </span>
                              </td>
                              <td className={styles.tdAlignRight}>
                                <strong className={styles.tableItemTotal}>
                                  ₹{item.lineTotal?.toLocaleString('en-IN')}
                                </strong>
                              </td>
                            </tr>
                          ))}

                          {/* Final Payable Total Row (Highlighted in Light Yellow) */}
                          <tr className={styles.finalTotalRow}>
                            <td colSpan={3} className={styles.totalLabelCell}>
                              FINAL PAYABLE BILL TOTAL
                            </td>
                            <td className={styles.totalAmountCell}>
                              ₹{order.finalSettledAmount?.toLocaleString('en-IN')}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    {/* Information Box */}
                    <div className={styles.weighbridgeInfoBox}>
                      <Info size={18} className={styles.infoIconBlue} />
                      <span className={styles.infoText}>
                        Quantities verified at {order.factoryGate}. Merchant payout will be initiated upon OTP #2 confirmation.
                      </span>
                    </div>
                  </div>
                </div>

                {/* 30% Right: Action Required OTP #2 Card */}
                <div className={styles.rightActionCol}>
                  <div className={styles.actionRequiredCard}>
                    <div className={styles.actionCardHeader}>
                      <span className={styles.actionTagYellow}>OTP VERIFICATION #2</span>
                      <h4 className={styles.actionCardTitle}>Confirm Bill &amp; Approve Payout</h4>
                    </div>

                    <p className={styles.actionDescription}>
                      Confirm that you have reviewed the actual measured quantities and authorize the final settlement.
                    </p>

                    {/* Clean Interactive 4-Digit OTP Display / Input */}
                    <div className={styles.otpInputComponent}>
                      <div className={styles.otpDigitsRow}>
                        {order.billingOtp.split('').map((digit, i) => (
                          <div key={i} className={styles.otpBoxFilled}>
                            <span>{digit}</span>
                          </div>
                        ))}
                      </div>
                      <span className={styles.otpHintLabel}>
                        Authorization Code: <strong>{order.billingOtp}</strong>
                      </span>
                    </div>

                    {/* Primary CTA Button */}
                    <button
                      type="button"
                      className={styles.primaryYellowActionBtn}
                      onClick={() => handleVerifyBillingOtp(order.id)}
                    >
                      <Check size={16} />
                      <span>✓ Confirm Bill &amp; Finalize Settlement</span>
                    </button>

                    {/* Secondary Actions */}
                    <div className={styles.actionButtonsSecondaryRow}>
                      <a
                        href={`tel:${order.merchantPhone}`}
                        className={styles.secondaryNeutralBtn}
                      >
                        <Phone size={14} />
                        <span>Call Merchant</span>
                      </a>

                      <button
                        type="button"
                        className={styles.dangerOutlineBtn}
                        onClick={() => setCancelModalOrder(order)}
                      >
                        <AlertTriangle size={14} />
                        <span>Dispute / Cancel Bill</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ==============================================================
                STAGE 1: SCHEDULED / ARRIVING (70% LEFT DETAILS + 30% RIGHT OTP #1)
                ============================================================== */}
            {order.status === 'Scheduled' && (
              <div className={styles.activeOrderSplitLayout}>
                {/* 70% Left: Merchant & Truck Arrival Details */}
                <div className={styles.leftWeighbridgeCol}>
                  <div className={styles.scheduledDetailsCard}>
                    {/* Merchant Identity Row */}
                    <div className={styles.merchantIdentityRow}>
                      <div className={styles.merchantAvatarBox}>
                        {order.merchantPhoto ? (
                          <img
                            src={order.merchantPhoto}
                            alt={order.merchantName}
                            className={styles.merchantPhotoImg}
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).src = '/industrial-facility.jpg';
                            }}
                          />
                        ) : (
                          <Building2 size={24} className={styles.merchantBuildingIcon} />
                        )}
                      </div>
                      <div className={styles.merchantInfoStack}>
                        <div className={styles.merchantTitleLine}>
                          <h4 className={styles.merchantName}>{order.merchantName}</h4>
                          <span className={styles.verifiedTag}>
                            <ShieldCheck size={12} /> Verified Merchant
                          </span>
                        </div>
                        <span className={styles.merchantShopText}>📍 {order.shopName}</span>
                      </div>

                      <div className={styles.merchantCallTopWrap}>
                        <a
                          href={`tel:${order.merchantPhone}`}
                          className={styles.merchantCallTopBtn}
                          title={`Call Driver ${order.merchantPhone}`}
                        >
                          <Phone size={14} />
                          <span>Call Driver ({order.merchantPhone})</span>
                        </a>
                      </div>
                    </div>

                    {/* Live ETA & Tracking Progress Banner */}
                    <div className={styles.liveTrackingBanner}>
                      <div className={styles.liveTrackingHeader}>
                        <div className={styles.liveTrackingLeft}>
                          <span className={styles.pulseLiveDot} />
                          <strong className={styles.liveTrackingTitle}>
                            Merchant Dispatched &amp; En Route
                          </strong>
                        </div>
                        <span className={styles.liveEtaBadge}>
                          ETA: ~15 mins (Arrival {order.pickupTimeSlot?.split('–')[0] || '10:00 AM'})
                        </span>
                      </div>

                      <div className={styles.routeProgressBar}>
                        <div className={styles.routeStepPassed}>
                          <div className={styles.routeStepDot}>✓</div>
                          <span>Quote Accepted</span>
                        </div>
                        <div className={styles.routeConnectorPassed} />
                        <div className={styles.routeStepPassed}>
                          <div className={styles.routeStepDot}>✓</div>
                          <span>Truck Dispatched</span>
                        </div>
                        <div className={styles.routeConnectorActive} />
                        <div className={styles.routeStepActive}>
                          <div className={styles.routeStepDotActive}>🚚</div>
                          <span>Arriving Gate 2</span>
                        </div>
                        <div className={styles.routeConnectorPending} />
                        <div className={styles.routeStepPending}>
                          <div className={styles.routeStepDotPending}>⚖</div>
                          <span>Final Billing</span>
                        </div>
                      </div>
                    </div>

                    {/* Vehicle & Logistics Strip */}
                    <div className={styles.vehicleLogisticsStrip}>
                      <div className={styles.logisticsBlock}>
                        <span className={styles.logisticsLabel}>ASSIGNED TRUCK</span>
                        <strong className={styles.logisticsVal}>
                          {order.vehicleType} ({order.vehicleRegNumber})
                        </strong>
                      </div>
                      <div className={styles.logisticsBlock}>
                        <span className={styles.logisticsLabel}>CAPACITY &amp; DRIVER</span>
                        <strong className={styles.logisticsVal}>
                          {order.vehicleCapacity} • {order.driverName}
                        </strong>
                      </div>
                      <div className={styles.logisticsBlock}>
                        <span className={styles.logisticsLabel}>ACCESS GATE</span>
                        <strong className={styles.logisticsVal}>
                          {order.factoryGate}
                        </strong>
                      </div>
                    </div>

                    {/* Agreed Committed Rates Table (NO SPECULATIVE TOTALS) */}
                    <div className={styles.agreedRatesContainer}>
                      <div className={styles.agreedHeadingRow}>
                        <h4 className={styles.agreedRatesHeading}>
                          Accepted Scrap Materials &amp; Committed Rates:
                        </h4>
                        <span className={styles.lockedRatesBadge}>
                          ✓ Rates Locked for Dispatch
                        </span>
                      </div>

                      <div className={styles.agreedTableWrapper}>
                        <table className={styles.agreedTable}>
                          <thead>
                            <tr>
                              <th>Scrap Material</th>
                              <th>Listed Quantity</th>
                              <th className={styles.thAlignRight}>Committed Unit Rate</th>
                            </tr>
                          </thead>
                          <tbody>
                            {order.items.map((item, idx) => (
                              <tr key={idx}>
                                <td>
                                  <strong className={styles.agreedItemTitle}>{item.name}</strong>
                                </td>
                                <td>{item.estimatedQty}</td>
                                <td className={styles.tdAlignRight}>
                                  <strong className={styles.rateHighlight}>
                                    ₹{item.ratePerUnit} / {item.unit}
                                  </strong>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      <div className={styles.agreedRatesFooterNote}>
                        <Info size={13} className={styles.infoIconGrey} />
                        <span>
                          Unit rates are locked upon quote acceptance. Final payment will be computed using actual measured quantity on pickup day.
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 30% Right: Action Required OTP #1 Card */}
                <div className={styles.rightActionCol}>
                  <div className={styles.actionRequiredCard}>
                    <div className={styles.actionCardHeader}>
                      <span className={styles.actionTagYellow}>OTP VERIFICATION #1</span>
                      <h4 className={styles.actionCardTitle}>Gate Entry Confirmation</h4>
                    </div>

                    <p className={styles.actionDescription}>
                      Provide this OTP to the merchant driver on arrival at {order.factoryGate} to confirm authorization and begin scrap loading &amp; measurement.
                    </p>

                    {/* Clean 4-Digit OTP Box */}
                    <div className={styles.otpInputComponent}>
                      <div className={styles.otpDigitsRow}>
                        {order.pickupOtp.split('').map((digit, i) => (
                          <div key={i} className={styles.otpBoxFilled}>
                            <span>{digit}</span>
                          </div>
                        ))}
                      </div>
                      <span className={styles.otpHintLabel}>
                        Gate Entry Code: <strong>{order.pickupOtp}</strong>
                      </span>
                    </div>

                    {/* Primary Verification CTA */}
                    <button
                      type="button"
                      className={styles.primaryYellowActionBtn}
                      onClick={() => handleVerifyPickupOtp(order.id)}
                    >
                      <CheckCircle2 size={16} />
                      <span>Verify OTP #{order.pickupOtp} &amp; Start Pickup →</span>
                    </button>

                    {/* Secondary Actions */}
                    <div className={styles.actionButtonsSecondaryRow}>
                      <a
                        href={`tel:${order.merchantPhone}`}
                        className={styles.secondaryNeutralBtn}
                      >
                        <Phone size={14} />
                        <span>Call Driver</span>
                      </a>

                      <button
                        type="button"
                        className={styles.dangerOutlineBtn}
                        onClick={() => setCancelModalOrder(order)}
                      >
                        <AlertTriangle size={14} />
                        <span>Cancel Pickup</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ==============================================================
                STAGE 3: COMPLETED / SETTLED ORDER (COMPACT DEFAULT WITH EXPANDABLE TAX INVOICE)
                ============================================================== */}
            {order.status === 'Completed' && (
              <div className={styles.completedSectionContainer}>
                {/* 1. Low-Height Compact Summary Row */}
                <div className={styles.completedCompactCard}>
                  <div className={styles.completedCompactLeft}>
                    <div className={styles.completedStatusLine}>
                      <span className={styles.completedSuccessPill}>
                        <CheckCircle2 size={14} className={styles.greenCheckIcon} />
                        <span>ORDER SETTLED</span>
                      </span>
                      <strong className={styles.compactSettledAmount}>
                        ₹{order.finalSettledAmount?.toLocaleString('en-IN')}
                      </strong>
                      <span className={styles.compactSettledVia}>via Spot NEFT Transfer</span>
                    </div>

                    <div className={styles.completedCompactMetaRow}>
                      <span>Collected by: <strong>{order.merchantName}</strong></span>
                      <span>•</span>
                      <span>Date: <strong>{order.pickupDate}</strong></span>
                      <span>•</span>
                      <span>Bill Slip: <strong>#{order.billSlipNumber}</strong></span>
                    </div>
                  </div>

                  <div className={styles.completedCompactActions}>
                    <button
                      type="button"
                      className={styles.toggleInvoiceBtn}
                      onClick={() => toggleInvoiceExpand(order.id)}
                    >
                      <FileText size={14} />
                      <span>
                        {expandedInvoiceOrderIds.includes(order.id)
                          ? 'Hide Tax Invoice ▴'
                          : 'View Tax Invoice / Bill ▾'}
                      </span>
                    </button>

                    <button
                      type="button"
                      className={styles.quickWeighSlipBtn}
                      onClick={() =>
                        alert(
                          `Downloading Measurement Slip #${order.billSlipNumber}...`
                        )
                      }
                      title="Download Measurement Slip"
                    >
                      <Download size={14} />
                      <span>Bill Slip</span>
                    </button>
                  </div>
                </div>

                {/* 2. Expandable Centered Document-Style Tax Invoice */}
                {expandedInvoiceOrderIds.includes(order.id) && (
                  <div className={styles.invoiceDocumentWrapper}>
                    <div className={styles.taxInvoiceSheet}>
                      {/* Invoice Top Header */}
                      <div className={styles.invoiceHeaderTop}>
                        <div className={styles.brandCol}>
                          <div className={styles.invoiceBrandLogo}>
                            <span className={styles.brandNameBold}>BILL SCRAP</span>
                            <span className={styles.brandDot}>•</span>
                            <span className={styles.brandSubText}>Recycle • Reuse • Recover</span>
                          </div>
                          <p className={styles.marketplaceDesc}>
                            Scrap &amp; Recycling Marketplace • Chennai, Tamil Nadu
                          </p>
                          <span className={styles.gstinText}>GSTIN: 33AAACS1234F1Z8</span>
                        </div>

                        <div className={styles.invoiceMetaCol}>
                          <div className={styles.taxInvoiceHeadingBadge}>TAX INVOICE</div>
                          <div className={styles.metaRowItem}>
                            <span className={styles.metaRowLabel}>Invoice No:</span>
                            <strong className={styles.metaRowVal}>
                              INV-{order.orderNumber?.replace('ORD-', '') || '250511-00049'}
                            </strong>
                          </div>
                          <div className={styles.metaRowItem}>
                            <span className={styles.metaRowLabel}>Invoice Date:</span>
                            <strong className={styles.metaRowVal}>{order.pickupDate || '11 May 2025'}</strong>
                          </div>
                          <div className={styles.metaRowItem}>
                            <span className={styles.metaRowLabel}>Payment:</span>
                            <span className={styles.invoiceSettledBadge}>✓ SETTLED</span>
                          </div>
                        </div>
                      </div>

                      <div className={styles.invoiceDivider} />

                      {/* Bill To & Collected By Parties Grid */}
                      <div className={styles.partiesGrid}>
                        <div className={styles.partyBox}>
                          <span className={styles.partyTypeHeader}>BILL TO (INDUSTRY SELLER)</span>
                          <strong className={styles.partyName}>Sri Venkatesh Industries</strong>
                          <p className={styles.partyAddress}>
                            24, 5th Main Road, SIDCO Industrial Estate, Guindy<br />
                            Chennai, Tamil Nadu – 600032
                          </p>
                          <span className={styles.partyGst}>GSTIN: 33ABCDE1234F1Z5</span>
                        </div>

                        <div className={styles.partyBox}>
                          <span className={styles.partyTypeHeader}>COLLECTED BY (CERTIFIED BUYER)</span>
                          <strong className={styles.partyName}>{order.merchantName}</strong>
                          <p className={styles.partyAddress}>
                            {order.shopName || 'SIDCO Industrial Scrap Yard #12, Guindy'}<br />
                            Chennai, Tamil Nadu – 600032
                          </p>
                          <span className={styles.partyGst}>GSTIN: 33XYZAB9876C1Z2</span>
                        </div>
                      </div>

                      {/* Order Reference Strip */}
                      <div className={styles.referenceStrip}>
                        <div className={styles.refItem}>
                          <span className={styles.refLabel}>Order No:</span>
                          <strong>{order.orderNumber}</strong>
                        </div>
                        <div className={styles.refItem}>
                          <span className={styles.refLabel}>Request ID:</span>
                          <strong>{order.requestId}</strong>
                        </div>
                        <div className={styles.refItem}>
                          <span className={styles.refLabel}>Pickup Date:</span>
                          <strong>{order.pickupDate}</strong>
                        </div>
                        <div className={styles.refItem}>
                          <span className={styles.refLabel}>Bill Slip Ref:</span>
                          <strong>#{order.billSlipNumber}</strong>
                        </div>
                      </div>

                      {/* Itemized Line-Items Table */}
                      <div className={styles.invoiceTableWrapper}>
                        <table className={styles.invoiceTable}>
                          <thead>
                            <tr>
                              <th className={styles.thSNo}>S.NO</th>
                              <th className={styles.thDesc}>SCRAP MATERIAL DESCRIPTION</th>
                              <th className={styles.thQty}>ACTUAL MEASURED QTY</th>
                              <th className={styles.thRate}>AGREED RATE</th>
                              <th className={styles.thAmount}>AMOUNT (INR)</th>
                            </tr>
                          </thead>
                          <tbody>
                            {order.items.map((item, idx) => (
                              <tr key={idx} className={idx % 2 === 1 ? styles.altRow : ''}>
                                <td className={styles.tdSNo}>{String(idx + 1).padStart(2, '0')}</td>
                                <td className={styles.tdDesc}>
                                  <strong>{item.name}</strong>
                                </td>
                                <td className={styles.tdQty}>
                                  {item.actualWeighedQty || item.estimatedQty}
                                </td>
                                <td className={styles.tdRate}>
                                  ₹{item.ratePerUnit}/{item.unit}
                                </td>
                                <td className={styles.tdAmount}>
                                  ₹{item.lineTotal?.toLocaleString('en-IN')}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* Financial Totals & Verification Summary */}
                      <div className={styles.totalsAndVerificationRow}>
                        {/* Left: Payment & Verification Information */}
                        <div className={styles.verificationStack}>
                          <div className={styles.compactProofBox}>
                            <div className={styles.proofHeader}>
                              <CheckCircle2 size={13} className={styles.proofGreenIcon} />
                              <strong className={styles.proofTitle}>PAYMENT SETTLEMENT DETAILS</strong>
                            </div>
                            <div className={styles.proofDetailsList}>
                              <div><span>Status:</span> <strong className={styles.paidText}>✓ Paid / Settled</strong></div>
                              <div><span>Payment Method:</span> <strong>Spot NEFT / RTGS Transfer</strong></div>
                              <div><span>Settlement Date:</span> <strong>{order.pickupDate}</strong></div>
                              <div><span>Transaction Ref:</span> <strong className={styles.utrCode}>NEFT-N25051100984123</strong></div>
                            </div>
                          </div>

                          <div className={styles.compactProofBox}>
                            <div className={styles.proofHeader}>
                              <Scale size={13} className={styles.proofYellowIcon} />
                              <strong className={styles.proofTitle}>MEASUREMENT VERIFICATION</strong>
                            </div>
                            <div className={styles.proofDetailsList}>
                              <div><span>Slip No:</span> <strong>#{order.billSlipNumber}</strong></div>
                              <div><span>Verification:</span> <strong>Mutually Agreed Measurement</strong></div>
                              <div><span>Status:</span> <strong>✓ Verified &amp; Confirmed</strong></div>
                            </div>
                          </div>
                        </div>

                        {/* Right: Subtotal & Total Payable Block */}
                        <div className={styles.totalsCalculationBlock}>
                          <div className={styles.calcLine}>
                            <span className={styles.calcLabel}>Subtotal:</span>
                            <strong className={styles.calcVal}>₹{order.finalSettledAmount?.toLocaleString('en-IN')}</strong>
                          </div>
                          <div className={styles.calcLine}>
                            <span className={styles.calcLabel}>Adjustments:</span>
                            <span className={styles.calcVal}>₹0.00</span>
                          </div>
                          <div className={styles.finalPayableLine}>
                            <span className={styles.finalPayableLabel}>TOTAL PAYABLE:</span>
                            <strong className={styles.finalPayableAmount}>
                              ₹{order.finalSettledAmount?.toLocaleString('en-IN')}
                            </strong>
                          </div>
                          <span className={styles.wordsAmount}>
                            Amount in Words: Twelve Thousand Seven Hundred Sixty Rupees Only
                          </span>
                        </div>
                      </div>

                      {/* Invoice Compliance Footer Note */}
                      <div className={styles.invoiceComplianceFooter}>
                        <Info size={14} className={styles.complianceIcon} />
                        <span>
                          Verified measurement. Final amount calculated using actual measured quantity.
                        </span>
                      </div>

                      {/* Download Action Buttons */}
                      <div className={styles.invoiceActionButtonsRow}>
                        <button
                          type="button"
                          className={styles.downloadInvoicePrimaryBtn}
                          onClick={() => alert(`Downloading Certified GST Tax Invoice for ${order.orderNumber}...`)}
                        >
                          <Download size={14} />
                          <span>Download Tax Invoice</span>
                        </button>

                        <button
                          type="button"
                          className={styles.downloadWeighSlipSecondaryBtn}
                          onClick={() => alert(`Downloading Measurement Slip #${order.billSlipNumber}...`)}
                        >
                          <Download size={14} />
                          <span>Download Bill Slip</span>
                        </button>

                        <button
                          type="button"
                          className={styles.collapseInvoiceInlineBtn}
                          onClick={() => toggleInvoiceExpand(order.id)}
                        >
                          <span>Close Invoice View ▴</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ==============================================================
                STAGE 4: CANCELLED ORDER DESIGN (SUBTLE LIGHT RED CARD)
                ============================================================== */}
            {order.status === 'Cancelled' && (
              <div className={styles.cancelledCardContent}>
                <div className={styles.cancelledMainInfo}>
                  <div className={styles.cancelledBadgeRow}>
                    <span className={styles.cancelledPillBadge}>
                      <X size={13} />
                      <span>ORDER CANCELLED</span>
                    </span>
                  </div>

                  <h3 className={styles.cancelledTitle}>Pickup Order Cancelled</h3>
                  <p className={styles.cancelledReasonParagraph}>
                    <strong>Reason:</strong> {order.cancellationReason || 'Material changed / disposed internally in plant overhaul'}
                  </p>
                  <span className={styles.cancelledDateText}>
                    Cancelled on: {order.cancelledAt || '08 May 2025, 10:15 AM'}
                  </span>
                </div>

                <div className={styles.cancelledActionCol}>
                  <button
                    type="button"
                    className={styles.viewCancelledLogBtn}
                    onClick={() => setActiveCancelledViewOrder(order)}
                  >
                    <span>View Cancelled Order Log</span>
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 4. Cancellation Reason Workflow Modal */}
      {cancelModalOrder && (
        <div className={styles.modalOverlay} onClick={() => setCancelModalOrder(null)}>
          <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalAlertCircle}>
              <AlertTriangle size={28} className={styles.modalWarningIcon} />
            </div>

            <h3 className={styles.modalTitle}>Cancel Pickup Order?</h3>
            <p className={styles.modalDesc}>
              Are you sure you want to cancel order <strong>{cancelModalOrder.orderNumber}</strong> with{' '}
              <strong>{cancelModalOrder.merchantName}</strong>?
            </p>

            <div className={styles.cancelReasonField}>
              <label className={styles.fieldLabel}>Select Cancellation Reason:</label>
              <select
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className={styles.customSelect}
              >
                {CANCEL_REASONS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.modalActionButtons}>
              <button
                type="button"
                className={styles.modalKeepBtn}
                onClick={() => setCancelModalOrder(null)}
              >
                No, Keep Order
              </button>

              <button
                type="button"
                className={styles.modalConfirmCancelBtn}
                onClick={handleConfirmCancel}
              >
                Yes, Confirm Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Dedicated Cancelled Order Log View Modal */}
      {activeCancelledViewOrder && (
        <div className={styles.modalOverlay} onClick={() => setActiveCancelledViewOrder(null)}>
          <div className={styles.cancelledViewModalCard} onClick={(e) => e.stopPropagation()}>
            <div className={styles.cancelledModalHeader}>
              <div className={styles.cancelledHeaderTitle}>
                <span className={styles.cancelledBadgeTop}>CANCELLED ORDER RECORD</span>
                <h2 className={styles.cancelledModalHeading}>{activeCancelledViewOrder.orderNumber}</h2>
              </div>
              <button
                type="button"
                className={styles.modalCloseBtn}
                onClick={() => setActiveCancelledViewOrder(null)}
              >
                <X size={18} />
              </button>
            </div>

            <div className={styles.cancelledViewBody}>
              <div className={styles.cancelledReasonCallout}>
                <AlertTriangle size={18} className={styles.warningIconRed} />
                <div>
                  <span className={styles.calloutLabel}>CANCELLATION REASON</span>
                  <p className={styles.calloutReason}>{activeCancelledViewOrder.cancellationReason}</p>
                  <span className={styles.calloutTime}>Recorded: {activeCancelledViewOrder.cancelledAt}</span>
                </div>
              </div>

              <div className={styles.cancelledDetailsGrid}>
                <div className={styles.detailBlock}>
                  <span className={styles.detLabel}>MERCHANT / BUYER</span>
                  <strong className={styles.detVal}>{activeCancelledViewOrder.merchantName}</strong>
                </div>
                <div className={styles.detailBlock}>
                  <span className={styles.detLabel}>SCHEDULED SLOT</span>
                  <strong className={styles.detVal}>{activeCancelledViewOrder.pickupDate}</strong>
                </div>
                <div className={styles.detailBlockFull}>
                  <span className={styles.detLabel}>SCRAP MATERIALS INCLUDED</span>
                  <div className={styles.detItemsList}>
                    {activeCancelledViewOrder.items.map((it, idx) => (
                      <span key={idx} className={styles.detItemPill}>
                        {it.name} ({it.estimatedQty})
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.cancelledModalFooter}>
              <button
                type="button"
                className={styles.backToOrdersBtn}
                onClick={() => setActiveCancelledViewOrder(null)}
              >
                <span>← View All Active Orders</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
