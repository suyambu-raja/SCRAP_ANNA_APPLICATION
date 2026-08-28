import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  CheckCircle2,
  Truck,
  Clock,
  XCircle,
  ChevronDown,
  MapPin,
  Calendar,
  Filter,
  FileText,
  Phone,
  Mail,
  ShieldCheck,
  ArrowRight,
  TrendingUp,
  Download,
  Building,
  User,
  Eye,
  X,
} from 'lucide-react';
import styles from './MerchantOrders.module.css';

export type OrderStatus = 'Pending' | 'Scheduled' | 'Completed' | 'Cancelled';

interface OrderItem {
  id: string;
  customerName: string;
  customerType: 'Industry' | 'Individual';
  badge: OrderStatus;
  materialName: string;
  materialCondition: string;
  image: string;
  quantity: string;
  address: string;
  orderConfirmed: string;
  pickupDate: string;
  pickupTime: string;
  statusText: OrderStatus;
  statusType: 'pending' | 'scheduled' | 'completed' | 'cancelled';
  statusMeta: {
    heading: string;
    sub: string;
  };
  actions: ('view-details' | 'view-summary' | 'download-bill')[];
  bottomNote?: string;
}

const ORDERS_DATA: OrderItem[] = [
  {
    id: 'ORD-250513-00078',
    customerName: 'Sri Venkatesh Industries',
    customerType: 'Industry',
    badge: 'Scheduled',
    materialName: 'Metal Scrap',
    materialCondition: 'Mixed',
    image: '/scrap-iron.png',
    quantity: '650 KG',
    address: '24, 5th Main Road, SIDCO Industrial Estate, Guindy, Chennai – 600032, Tamil Nadu',
    orderConfirmed: '13 May 2025, 10:15 AM',
    pickupDate: '16 May 2025',
    pickupTime: '10:00 AM – 12:00 PM',
    statusText: 'Scheduled',
    statusType: 'scheduled',
    statusMeta: {
      heading: 'Pickup in 2 Days',
      sub: '16 May 2025',
    },
    actions: ['view-details'],
  },
  {
    id: 'ORD-250513-00077',
    customerName: 'Ambattur Heavy Foundry Works',
    customerType: 'Industry',
    badge: 'Pending',
    materialName: 'Copper Scrap',
    materialCondition: 'Clean',
    image: '/scrap-copper.png',
    quantity: '180 KG',
    address: '12/1, Ambattur Industrial Estate, Ambattur, Chennai – 600058, Tamil Nadu',
    orderConfirmed: '13 May 2025, 02:05 PM',
    pickupDate: '13 May 2025',
    pickupTime: '02:00 PM – 04:00 PM',
    statusText: 'Pending',
    statusType: 'pending',
    statusMeta: {
      heading: 'Driver on the way to location',
      sub: '13 May 2025, 01:45 PM',
    },
    actions: ['view-details'],
  },
  {
    id: 'ORD-250512-00076',
    customerName: 'Ramesh Kumar (Household)',
    customerType: 'Individual',
    badge: 'Pending',
    materialName: 'Steel Scrap',
    materialCondition: 'Mixed',
    image: '/scrap-quality-steel.png',
    quantity: '420 KG',
    address: '8, Padi High Street, Padi, Chennai – 600050, Tamil Nadu',
    orderConfirmed: '12 May 2025, 09:10 AM',
    pickupDate: '12 May 2025',
    pickupTime: '09:00 AM – 11:00 AM',
    statusText: 'Pending',
    statusType: 'pending',
    statusMeta: {
      heading: 'At Customer Location • Weighing',
      sub: '12 May 2025, 09:35 AM',
    },
    actions: ['view-details'],
  },
  {
    id: 'ORD-250512-00075',
    customerName: 'Precision Tools & Castings Pvt Ltd',
    customerType: 'Industry',
    badge: 'Completed',
    materialName: 'Brass Scrap',
    materialCondition: 'Mixed',
    image: '/scrap-brass.png',
    quantity: '90 KG',
    address: '16, Porur Main Road, Porur, Chennai – 600116, Tamil Nadu',
    orderConfirmed: '11 May 2025, 01:10 PM',
    pickupDate: '12 May 2025',
    pickupTime: '00:00 PM – 01:00 PM',
    statusText: 'Completed',
    statusType: 'completed',
    statusMeta: {
      heading: 'Completed on',
      sub: '11 May 2025, 02:45 PM',
    },
    actions: ['view-summary', 'download-bill'],
  },
  {
    id: 'ORD-250511-00074',
    customerName: 'Evergreen Packaging Aggregators',
    customerType: 'Industry',
    badge: 'Completed',
    materialName: 'Paper Scrap',
    materialCondition: 'Mixed',
    image: '/scrap-cardboard.png',
    quantity: '300 KG',
    address: 'No. 45, Velachery 100 Feet Road, Velachery, Chennai – 600042, Tamil Nadu',
    orderConfirmed: '11 May 2025, 04:00 PM',
    pickupDate: '11 May 2025',
    pickupTime: '11:00 PM – 03:00 PM',
    statusText: 'Completed',
    statusType: 'completed',
    statusMeta: {
      heading: 'Completed on',
      sub: '11 May 2025, 05:20 PM',
    },
    actions: ['view-summary', 'download-bill'],
  },
  {
    id: 'ORD-250510-00072',
    customerName: 'Dr. S. K. Subramanian',
    customerType: 'Individual',
    badge: 'Cancelled',
    materialName: 'Plastic Scrap',
    materialCondition: 'Mixed',
    image: '/scrap-plastic.png',
    quantity: '70 KG',
    address: '101, Thiru Vi Ka Street, Perambur, Chennai – 600011, Tamil Nadu',
    orderConfirmed: '10 May 2025, 03:15 PM',
    pickupDate: '10 May 2025',
    pickupTime: '13:00 PM – 05:00 PM',
    statusText: 'Cancelled',
    statusType: 'cancelled',
    statusMeta: {
      heading: 'Cancelled on',
      sub: '10 May 2025, 10:30 AM',
    },
    actions: ['view-details'],
    bottomNote: 'Cancelled by customer',
  },
];

export default function MerchantOrders() {
  const [orders, setOrders] = useState<OrderItem[]>(ORDERS_DATA);
  const [activeFilterTab, setActiveFilterTab] = useState<'all' | 'pending' | 'scheduled' | 'completed' | 'cancelled'>('all');
  const [selectedScrapType, setSelectedScrapType] = useState('All Types');
  const [selectedOrderStatus, setSelectedOrderStatus] = useState('All Statuses');
  const [selectedLocation, setSelectedLocation] = useState('All Locations');
  const [selectedDateRange, setSelectedDateRange] = useState('This Month');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Floating Image Preview Lightbox State
  const [floatingImage, setFloatingImage] = useState<{
    src: string;
    title: string;
    condition: string;
    quantity: string;
    customerName: string;
  } | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleClearFilters = () => {
    setSelectedScrapType('All Types');
    setSelectedOrderStatus('All Statuses');
    setSelectedLocation('All Locations');
    setSelectedDateRange('This Month');
    triggerToast('Filters reset to default.');
  };

  // Filter orders based on active tab & sidebar selections
  const filteredOrders = orders.filter((order) => {
    if (activeFilterTab === 'pending' && order.statusType !== 'pending') return false;
    if (activeFilterTab === 'scheduled' && order.statusType !== 'scheduled') return false;
    if (activeFilterTab === 'completed' && order.statusType !== 'completed') return false;
    if (activeFilterTab === 'cancelled' && order.statusType !== 'cancelled') return false;

    // Filter selects
    if (selectedOrderStatus !== 'All Statuses' && order.badge !== selectedOrderStatus) {
      return false;
    }
    if (selectedScrapType !== 'All Types' && !order.materialName.toLowerCase().includes(selectedScrapType.toLowerCase())) {
      return false;
    }
    return true;
  });

  return (
    <div className={styles.pageWrapper}>
      {/* Toast Banner */}
      {toastMessage && (
        <div className={styles.toastBanner}>
          <CheckCircle2 size={18} />
          <span>{toastMessage}</span>
        </div>
      )}

      <main className={styles.mainContainer}>
        <div className={styles.ordersLayoutGrid}>
          {/* ================================================================
              LEFT COLUMN: MAIN ORDERS LIST (70%)
             ================================================================ */}
          <section className={styles.mainCol}>
            {/* 1. Page Header */}
            <div className={styles.pageHeaderRow}>
              <div className={styles.headerTitleGroup}>
                <h1 className={styles.pageTitle}>Scrap Pickup Orders</h1>
                <p className={styles.pageSubtitle}>
                  Track pickup schedules, manage pending doorstep collections, and view completed orders.
                </p>
              </div>
            </div>

            {/* 2. 5-Column Stats Strip (4 Standardized Statuses + Total) */}
            <div className={styles.statsStripGrid}>
              <div className={styles.statCard}>
                <div className={`${styles.statIconCircle} ${styles.iconYellow}`}>
                  <Package size={18} />
                </div>
                <div className={styles.statContent}>
                  <span className={styles.statLabel}>Total Orders</span>
                  <span className={styles.statValue}>56</span>
                  <span className={styles.statTrend}>
                    This Month <strong className={styles.trendGreen}>↑ 18%</strong>
                  </span>
                </div>
              </div>

              <div className={styles.statCard}>
                <div className={`${styles.statIconCircle} ${styles.iconBlue}`}>
                  <Clock size={18} />
                </div>
                <div className={styles.statContent}>
                  <span className={styles.statLabel}>Pending</span>
                  <span className={styles.statValue}>16</span>
                  <span className={styles.statTrend}>
                    Active pickups
                  </span>
                </div>
              </div>

              <div className={styles.statCard}>
                <div className={`${styles.statIconCircle} ${styles.iconOrange}`}>
                  <Calendar size={18} />
                </div>
                <div className={styles.statContent}>
                  <span className={styles.statLabel}>Scheduled</span>
                  <span className={styles.statValue}>7</span>
                  <span className={styles.statTrend}>
                    Upcoming bookings
                  </span>
                </div>
              </div>

              <div className={styles.statCard}>
                <div className={`${styles.statIconCircle} ${styles.iconGreen}`}>
                  <CheckCircle2 size={18} />
                </div>
                <div className={styles.statContent}>
                  <span className={styles.statLabel}>Completed</span>
                  <span className={styles.statValue}>28</span>
                  <span className={styles.statTrend}>
                    This Month <strong className={styles.trendGreen}>↑ 12%</strong>
                  </span>
                </div>
              </div>

              <div className={styles.statCard}>
                <div className={`${styles.statIconCircle} ${styles.iconRed}`}>
                  <XCircle size={18} />
                </div>
                <div className={styles.statContent}>
                  <span className={styles.statLabel}>Cancelled</span>
                  <span className={styles.statValue}>5</span>
                  <span className={styles.statTrend}>
                    This Month <strong className={styles.trendRed}>↓ 5%</strong>
                  </span>
                </div>
              </div>
            </div>

            {/* 3. Standardized 4-Status Tabs & Sort Bar */}
            <div className={styles.tabsBar}>
              <div className={styles.tabsList}>
                <button
                  type="button"
                  className={`${styles.tabItem} ${activeFilterTab === 'all' ? styles.tabActive : ''}`}
                  onClick={() => setActiveFilterTab('all')}
                >
                  <span>All Orders</span>
                  <span className={styles.tabBadge}>56</span>
                </button>
                <button
                  type="button"
                  className={`${styles.tabItem} ${activeFilterTab === 'pending' ? styles.tabActive : ''}`}
                  onClick={() => setActiveFilterTab('pending')}
                >
                  <span>Pending</span>
                  <span className={styles.tabBadge}>16</span>
                </button>
                <button
                  type="button"
                  className={`${styles.tabItem} ${activeFilterTab === 'scheduled' ? styles.tabActive : ''}`}
                  onClick={() => setActiveFilterTab('scheduled')}
                >
                  <span>Scheduled</span>
                  <span className={styles.tabBadge}>7</span>
                </button>
                <button
                  type="button"
                  className={`${styles.tabItem} ${activeFilterTab === 'completed' ? styles.tabActive : ''}`}
                  onClick={() => setActiveFilterTab('completed')}
                >
                  <span>Completed</span>
                  <span className={styles.tabBadge}>28</span>
                </button>
                <button
                  type="button"
                  className={`${styles.tabItem} ${activeFilterTab === 'cancelled' ? styles.tabActive : ''}`}
                  onClick={() => setActiveFilterTab('cancelled')}
                >
                  <span>Cancelled</span>
                  <span className={styles.tabBadge}>5</span>
                </button>
              </div>

              <div className={styles.sortSelector}>
                <span>Sort by: Newest First</span>
                <ChevronDown size={14} />
              </div>
            </div>

            {/* 4. Orders Cards List (Standardized to 4 Flags: Pending, Scheduled, Completed, Cancelled) */}
            <div className={styles.ordersList}>
              {filteredOrders.map((order) => (
                <article key={order.id} className={styles.orderCard}>
                  {/* Top Customer & Order ID Strip */}
                  <div className={styles.cardHeaderRow}>
                    <div className={styles.cardHeaderLeft}>
                      {/* Standardized 4 Status Badges */}
                      <span
                        className={
                          order.badge === 'Completed'
                            ? styles.statusPillGreen
                            : order.badge === 'Pending'
                            ? styles.statusPillBlue
                            : order.badge === 'Scheduled'
                            ? styles.statusPillYellow
                            : styles.statusPillRed
                        }
                      >
                        {order.badge}
                      </span>
                      <div className={styles.customerGroup}>
                        <span className={styles.customerLabel}>Customer:</span>
                        <span className={styles.customerName}>{order.customerName}</span>
                      </div>
                      <div className={styles.customerTypeBadge}>
                        {order.customerType === 'Individual' ? <User size={12} /> : <Building size={12} />}
                        <span>{order.customerType}</span>
                      </div>
                    </div>

                    <span className={styles.orderIdMuted}>Order ID: {order.id}</span>
                  </div>

                  {/* Redesigned Card Body: Prominent Image Showcase + Address + Details + Status Actions */}
                  <div className={styles.orderBodyGrid}>
                    {/* 1. Large Image Showcase Column */}
                    <div className={styles.imageShowcaseCol}>
                      <div
                        className={styles.largeImgFrame}
                        onClick={() =>
                          setFloatingImage({
                            src: order.image,
                            title: order.materialName,
                            condition: order.materialCondition,
                            quantity: order.quantity,
                            customerName: order.customerName,
                          })
                        }
                        title="Click to view floating photo preview"
                      >
                        <img
                          src={order.image}
                          alt={order.materialName}
                          className={styles.largeMaterialImg}
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = '/logo-icon.png';
                          }}
                        />
                        <div className={styles.zoomHoverBadge}>
                          <Eye size={13} />
                          <span>View Photo</span>
                        </div>
                        <span className={styles.conditionOverlayBadge}>
                          {order.materialCondition} Condition
                        </span>
                      </div>

                      <div className={styles.materialTitleBlock}>
                        <h3 className={styles.materialTitle}>{order.materialName}</h3>
                        <div className={styles.quantityTag}>
                          <span className={styles.quantityHighlight}>{order.quantity}</span>
                          <span className={styles.confirmedDateTag}>• Confirmed {order.pickupDate}</span>
                        </div>
                      </div>
                    </div>

                    {/* 2. Middle Column: Pickup Address & Order Details */}
                    <div className={styles.detailsCol}>
                      <div className={styles.detailRow}>
                        <MapPin size={16} className={styles.detailIcon} />
                        <div className={styles.addressCol}>
                          <span className={styles.detailLabel}>PICKUP ADDRESS</span>
                          <span className={styles.addressValue}>{order.address}</span>
                        </div>
                      </div>

                      <div className={styles.detailRow}>
                        <Calendar size={16} className={styles.detailIcon} />
                        <div className={styles.pickupTimeRow}>
                          <span className={styles.detailLabel}>SCHEDULED PICKUP</span>
                          <span className={styles.pickupTimeValue}>
                            {order.pickupDate} &nbsp;•&nbsp; {order.pickupTime}
                          </span>
                        </div>
                      </div>

                      <div className={styles.detailRow}>
                        <Clock size={16} className={styles.detailIcon} />
                        <div className={styles.pickupTimeRow}>
                          <span className={styles.detailLabel}>ORDER CONFIRMED</span>
                          <span className={styles.confirmedSubtext}>{order.orderConfirmed}</span>
                        </div>
                      </div>
                    </div>

                    {/* 3. Right Column: Standardized Status & Action Buttons */}
                    <div className={styles.statusActionCol}>
                      <div className={styles.statusGroup}>
                        <span className={styles.statusHeader}>STATUS</span>
                        <span
                          className={`${styles.statePill} ${
                            order.statusType === 'completed'
                              ? styles.stateCompleted
                              : order.statusType === 'pending'
                              ? styles.statePending
                              : order.statusType === 'scheduled'
                              ? styles.stateScheduled
                              : styles.stateCancelled
                          }`}
                        >
                          {order.statusText}
                        </span>

                        <div className={styles.stateSubtext}>
                          <span>{order.statusMeta.heading}</span>
                          <strong>{order.statusMeta.sub}</strong>
                        </div>
                      </div>

                      <div className={styles.buttonsStack}>
                        {order.actions.includes('view-details') && (
                          <button
                            type="button"
                            className={styles.outlineYellowBtn}
                            onClick={() => triggerToast(`Viewing details for ${order.id}`)}
                          >
                            View Details
                          </button>
                        )}

                        {order.actions.includes('view-summary') && (
                          <button
                            type="button"
                            className={styles.outlineYellowBtn}
                            onClick={() => triggerToast(`Viewing summary for ${order.id}`)}
                          >
                            View Summary
                          </button>
                        )}

                        {order.actions.includes('download-bill') && (
                          <button
                            type="button"
                            className={styles.outlineDarkBtn}
                            onClick={() => triggerToast(`Downloading digital weighing bill for ${order.id}`)}
                          >
                            <Download size={14} />
                            <span>Download Bill</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Card Footer Note */}
                  {order.bottomNote && (
                    <div className={styles.cardFooterNote}>
                      <span>{order.bottomNote}</span>
                    </div>
                  )}
                </article>
              ))}
            </div>
          </section>

          {/* ================================================================
              RIGHT SIDEBAR (30%)
             ================================================================ */}
          <aside className={styles.sidebarCol}>
            {/* Card 1: Filters */}
            <div className={styles.sidebarCard}>
              <div className={styles.sidebarHeaderRow}>
                <h3 className={styles.sidebarCardTitle}>
                  <Filter size={16} />
                  <span>Filters</span>
                </h3>
                <button type="button" className={styles.clearAllBtn} onClick={handleClearFilters}>
                  Clear All
                </button>
              </div>

              <div className={styles.filterField}>
                <label className={styles.filterLabel}>Scrap Type</label>
                <div className={styles.selectWrapper}>
                  <select
                    value={selectedScrapType}
                    onChange={(e) => setSelectedScrapType(e.target.value)}
                    className={styles.filterSelect}
                  >
                    <option value="All Types">All Types</option>
                    <option value="Metal">Metal / Iron Scrap</option>
                    <option value="Copper">Copper Scrap</option>
                    <option value="Steel">Steel Scrap</option>
                    <option value="Brass">Brass Scrap</option>
                    <option value="Paper">Paper Scrap</option>
                    <option value="Plastic">Plastic Scrap</option>
                  </select>
                  <ChevronDown size={14} className={styles.selectChevron} />
                </div>
              </div>

              <div className={styles.filterField}>
                <label className={styles.filterLabel}>Order Status</label>
                <div className={styles.selectWrapper}>
                  <select
                    value={selectedOrderStatus}
                    onChange={(e) => setSelectedOrderStatus(e.target.value)}
                    className={styles.filterSelect}
                  >
                    <option value="All Statuses">All Statuses</option>
                    <option value="Pending">Pending</option>
                    <option value="Scheduled">Scheduled</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                  <ChevronDown size={14} className={styles.selectChevron} />
                </div>
              </div>

              <div className={styles.filterField}>
                <label className={styles.filterLabel}>Location</label>
                <div className={styles.selectWrapper}>
                  <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className={styles.filterSelect}
                  >
                    <option value="All Locations">All Locations</option>
                    <option value="Guindy">Guindy / SIDCO</option>
                    <option value="Ambattur">Ambattur Industrial</option>
                    <option value="Porur">Porur / Sriperumbudur</option>
                    <option value="Velachery">Velachery</option>
                  </select>
                  <ChevronDown size={14} className={styles.selectChevron} />
                </div>
              </div>

              <div className={styles.filterField}>
                <label className={styles.filterLabel}>Date Range</label>
                <div className={styles.selectWrapper}>
                  <select
                    value={selectedDateRange}
                    onChange={(e) => setSelectedDateRange(e.target.value)}
                    className={styles.filterSelect}
                  >
                    <option value="Today">Today</option>
                    <option value="This Week">This Week</option>
                    <option value="This Month">This Month</option>
                    <option value="Last 3 Months">Last 3 Months</option>
                  </select>
                  <ChevronDown size={14} className={styles.selectChevron} />
                </div>
              </div>
            </div>

            {/* Card 2: Standardized Order Flow */}
            <div className={styles.sidebarCard}>
              <h3 className={styles.sidebarCardTitle}>Order Flow</h3>
              <ol className={styles.stepsList}>
                <li className={styles.stepItem}>
                  <div className={styles.stepNumber}>1</div>
                  <div className={styles.stepText}>
                    <strong>Pending:</strong> Active unfinished order — driver departs or digital weighing is underway.
                  </div>
                </li>
                <li className={styles.stepItem}>
                  <div className={styles.stepNumber}>2</div>
                  <div className={styles.stepText}>
                    <strong>Scheduled:</strong> Advance pickup booked for a specific future date and time window.
                  </div>
                </li>
                <li className={styles.stepItem}>
                  <div className={styles.stepNumber}>3</div>
                  <div className={styles.stepText}>
                    <strong>Completed:</strong> Weight verified digitally, spot payment confirmed, and bill issued.
                  </div>
                </li>
                <li className={styles.stepItem}>
                  <div className={styles.stepNumber}>4</div>
                  <div className={styles.stepText}>
                    <strong>Cancelled:</strong> Order terminated prior to pickup with reason documented.
                  </div>
                </li>
              </ol>
            </div>

            {/* Card 3: Performance */}
            <div className={styles.sidebarCard}>
              <h3 className={styles.sidebarCardTitle}>Monthly Performance</h3>
              <div className={styles.perfGrid}>
                <div className={styles.perfItem}>
                  <span className={styles.perfLabel}>Completion Rate</span>
                  <span className={styles.perfValueGreen}>96.4%</span>
                </div>
                <div className={styles.perfItem}>
                  <span className={styles.perfLabel}>Avg. Pickup Time</span>
                  <span className={styles.perfValue}>45 Mins</span>
                </div>
                <div className={styles.perfItem}>
                  <span className={styles.perfLabel}>Customer Rating</span>
                  <span className={styles.perfValueYellow}>★ 4.9 / 5</span>
                </div>
                <div className={styles.perfItem}>
                  <span className={styles.perfLabel}>On-Time Commission</span>
                  <span className={styles.perfValueGreen}>100%</span>
                </div>
              </div>
            </div>

            {/* Card 4: Need Help */}
            <div className={styles.sidebarCard}>
              <h3 className={styles.sidebarCardTitle}>Need Help with an Order?</h3>
              <p className={styles.helpText}>
                Need to reschedule a pickup or request weight re-calibration? Contact merchant dispatch desk.
              </p>
              <a href="tel:+919876543210" className={styles.helpPhoneBtn}>
                <Phone size={15} />
                <span>+91 98765 43210</span>
              </a>
            </div>
          </aside>
        </div>
      </main>

      {/* Floating Image Lightbox Modal */}
      {floatingImage && (
        <div
          className={styles.floatingImageOverlay}
          onClick={() => setFloatingImage(null)}
        >
          <div
            className={styles.floatingImageCard}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.floatingImageHeader}>
              <div className={styles.floatingImageTitleBlock}>
                <h3 className={styles.floatingImageTitle}>{floatingImage.title}</h3>
                <div className={styles.floatingImageTags}>
                  <span className={styles.floatingBadgeCondition}>{floatingImage.condition} Condition</span>
                  <span className={styles.floatingBadgeQty}>{floatingImage.quantity}</span>
                  <span className={styles.floatingPosterName}>• Customer: {floatingImage.customerName}</span>
                </div>
              </div>
              <button
                type="button"
                className={styles.floatingCloseBtn}
                onClick={() => setFloatingImage(null)}
                aria-label="Close image preview"
              >
                <X size={20} />
              </button>
            </div>

            <div className={styles.floatingImageBody}>
              <img
                src={floatingImage.src}
                alt={floatingImage.title}
                className={styles.floatingImg}
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = '/logo-icon.png';
                }}
              />
            </div>

            <div className={styles.floatingImageFooter}>
              <span>Click anywhere outside or press ✕ to close</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
