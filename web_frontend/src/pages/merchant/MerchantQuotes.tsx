import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  MessageSquare,
  Send,
  CheckCircle2,
  XCircle,
  RotateCw,
  ChevronDown,
  MapPin,
  Clock,
  Filter,
  ShieldCheck,
  Phone,
  Mail,
  ArrowRight,
  HelpCircle,
  Lock,
  Building,
  User,
  Eye,
  X,
  Calendar,
  Mic,
  Tag,
  AlertTriangle,
  Truck,
} from 'lucide-react';
import { getPrivacyArea } from '@/utils/locationPrivacy';
import styles from './MerchantQuotes.module.css';

interface QuoteItem {
  id: string;
  customerName: string;
  customerType: 'Industry' | 'Individual';
  materialName: string;
  materialCondition: string;
  quantity: string;
  quotedPrice: number;
  pickupSlot: string;
  hasVoiceNote?: boolean;
  quoteNote?: string;
  badgeType: 'new' | 'expired' | 'rejected' | 'none';
  image: string;
  address: string;
  timeEst: string;
  timeEstNote: string;
  statusText: string;
  statusType: 'pending' | 'accepted' | 'expired' | 'rejected';
  statusMeta: {
    label: string;
    date: string;
  };
  actions: ('view-details' | 'view-order' | 'cancel-quote')[];
  requestedAgo: string;
}

const QUOTES_DATA: QuoteItem[] = [
  {
    id: 'REQ-250513-00078',
    customerName: 'Sri Venkatesh Industries',
    customerType: 'Industry',
    materialName: 'Metal Scrap',
    materialCondition: 'Mixed',
    quantity: '500 – 800 KG',
    quotedPrice: 18500,
    pickupSlot: '16 May 2025, 10:00 AM – 12:00 PM',
    hasVoiceNote: true,
    quoteNote: 'We bring calibrated digital platform scales and offer spot UPI/NEFT transfer upon weight confirmation.',
    badgeType: 'new',
    image: '/scrap-iron.png',
    address: '24, 5th Main Road, SIDCO Industrial Estate, Guindy, Chennai – 600032, Tamil Nadu',
    timeEst: '2 – 3 Hours',
    timeEstNote: 'Customer reviewing offers.',
    statusText: 'Pending Response',
    statusType: 'pending',
    statusMeta: {
      label: 'Quote sent',
      date: '13 May 2025, 10:00 AM',
    },
    actions: ['view-details', 'cancel-quote'],
    requestedAgo: 'Requested 5 mins ago',
  },
  {
    id: 'REQ-250513-00077',
    customerName: 'Ambattur Heavy Foundry Works',
    customerType: 'Industry',
    materialName: 'Copper Scrap',
    materialCondition: 'Clean',
    quantity: '100 – 200 KG',
    quotedPrice: 42000,
    pickupSlot: '13 May 2025, 02:00 PM – 04:00 PM',
    hasVoiceNote: false,
    quoteNote: 'Direct commercial vehicle dispatch with instant digital payment receipt.',
    badgeType: 'new',
    image: '/scrap-copper.png',
    address: '12/1, Ambattur Industrial Estate, Ambattur, Chennai – 600058, Tamil Nadu',
    timeEst: '3 – 4 Hours',
    timeEstNote: 'Customer reviewing offers.',
    statusText: 'Pending Response',
    statusType: 'pending',
    statusMeta: {
      label: 'Quote sent',
      date: '13 May 2025, 02:00 PM',
    },
    actions: ['view-details', 'cancel-quote'],
    requestedAgo: 'Requested 8 mins ago',
  },
  {
    id: 'REQ-250512-00076',
    customerName: 'Apex Machinery & Tools Corp',
    customerType: 'Industry',
    materialName: 'Steel Scrap',
    materialCondition: 'Mixed',
    quantity: '300 – 500 KG',
    quotedPrice: 24500,
    pickupSlot: '14 May 2025, 09:00 AM – 11:00 AM',
    hasVoiceNote: true,
    quoteNote: 'Equipped for heavy industrial scrap clearance and calibrated weighing.',
    badgeType: 'new',
    image: '/scrap-quality-steel.png',
    address: '8, Padi High Street, Padi, Chennai – 600050, Tamil Nadu',
    timeEst: '1 – 2 Hours',
    timeEstNote: 'Customer reviewing offers.',
    statusText: 'Pending Response',
    statusType: 'pending',
    statusMeta: {
      label: 'Quote sent',
      date: '14 May 2025, 09:00 AM',
    },
    actions: ['view-details', 'cancel-quote'],
    requestedAgo: 'Requested 12 mins ago',
  },
  {
    id: 'REQ-250512-00075',
    customerName: 'Precision Tools & Castings Pvt Ltd',
    customerType: 'Industry',
    materialName: 'Brass Scrap',
    materialCondition: 'Mixed',
    quantity: '50 – 100 KG',
    quotedPrice: 31200,
    pickupSlot: '12 May 2025, 01:00 PM – 03:00 PM',
    hasVoiceNote: false,
    quoteNote: 'Accepted! Scheduled for doorstep weighing and pickup.',
    badgeType: 'new',
    image: '/scrap-brass.png',
    address: '16, Porur Main Road, Porur, Chennai – 600116, Tamil Nadu',
    timeEst: '2 – 3 Hours',
    timeEstNote: 'Customer accepted your quote!',
    statusText: 'Accepted',
    statusType: 'accepted',
    statusMeta: {
      label: 'Customer accepted',
      date: '13 May 2025, 02:15 PM',
    },
    actions: ['view-details', 'view-order'],
    requestedAgo: 'Accepted 15 mins ago',
  },
  {
    id: 'REQ-250512-00074',
    customerName: 'Evergreen Packaging Aggregators',
    customerType: 'Industry',
    materialName: 'Paper Scrap',
    materialCondition: 'Mixed',
    quantity: '200 – 400 KG',
    quotedPrice: 5800,
    pickupSlot: '14 May 2025, 10:00 AM – 12:00 PM',
    hasVoiceNote: false,
    quoteNote: 'Quote validity expired.',
    badgeType: 'expired',
    image: '/scrap-cardboard.png',
    address: 'No. 45, Velachery 100 Feet Road, Velachery, Chennai – 600042, Tamil Nadu',
    timeEst: '2 – 4 Hours',
    timeEstNote: 'Response time expired.',
    statusText: 'Expired',
    statusType: 'expired',
    statusMeta: {
      label: 'Expired on',
      date: '14 May 2025, 11:50 AM',
    },
    actions: ['view-details'],
    requestedAgo: 'Expired 18 mins ago',
  },
  {
    id: 'REQ-250512-00073',
    customerName: 'Kaveri Electro-Mechanicals',
    customerType: 'Industry',
    materialName: 'Aluminium Scrap',
    materialCondition: 'Mixed',
    quantity: '40 – 70 KG',
    quotedPrice: 8900,
    pickupSlot: '12 May 2025, 11:00 AM – 01:00 PM',
    hasVoiceNote: false,
    quoteNote: 'Customer chose another offer.',
    badgeType: 'rejected',
    image: '/scrap-aluminium.png',
    address: '101, Thiru Vi Ka Street, Perambur, Chennai – 600011, Tamil Nadu',
    timeEst: '2 – 3 Hours',
    timeEstNote: 'Customer chose another offer.',
    statusText: 'Rejected',
    statusType: 'rejected',
    statusMeta: {
      label: 'Rejected on',
      date: '12 May 2025, 01:10 PM',
    },
    actions: ['view-details'],
    requestedAgo: 'Rejected 20 mins ago',
  },
];

export default function MerchantQuotes() {
  const [quotes, setQuotes] = useState<QuoteItem[]>(QUOTES_DATA);
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'accepted' | 'rejected'>('all');
  const [countdown, setCountdown] = useState(30);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Quote Details Modal State
  const [detailsModalQuote, setDetailsModalQuote] = useState<QuoteItem | null>(null);

  // Floating Image Preview Lightbox State
  const [floatingImage, setFloatingImage] = useState<{
    src: string;
    title: string;
    condition: string;
    quantity: string;
    customerName: string;
  } | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((c) => (c > 1 ? c - 1 : 30));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Cancel Quote Verification Modal State
  const [confirmCancelTarget, setConfirmCancelTarget] = useState<{
    id: string;
    customerName: string;
    materialName: string;
    price: number;
  } | null>(null);

  const handleInitiateCancelQuote = (quote: QuoteItem) => {
    setConfirmCancelTarget({
      id: quote.id,
      customerName: quote.customerName,
      materialName: quote.materialName,
      price: quote.quotedPrice,
    });
  };

  const handleConfirmCancelQuote = () => {
    if (!confirmCancelTarget) return;
    const { id, customerName } = confirmCancelTarget;
    setQuotes((prev) => prev.filter((q) => q.id !== id));
    if (detailsModalQuote?.id === id) {
      setDetailsModalQuote(null);
    }
    triggerToast(`✓ Quote for ${customerName} (${id}) has been withdrawn.`);
    setConfirmCancelTarget(null);
  };

  const handleCancelQuote = (id: string) => {
    const target = quotes.find((q) => q.id === id);
    if (target) {
      handleInitiateCancelQuote(target);
    } else {
      setQuotes((prev) => prev.filter((q) => q.id !== id));
      triggerToast(`Quote for ${id} has been cancelled.`);
    }
  };

  // Filter & prioritize quotes (Accepted quotes sort to the top of "All Quotes")
  const filteredQuotes = React.useMemo(() => {
    const list = quotes.filter((q) => {
      if (activeTab === 'pending' && q.statusType !== 'pending') return false;
      if (activeTab === 'accepted' && q.statusType !== 'accepted') return false;
      if (activeTab === 'rejected' && q.statusType !== 'rejected' && q.statusType !== 'expired') return false;
      return true;
    });

    if (activeTab === 'all') {
      return [...list].sort((a, b) => {
        if (a.statusType === 'accepted' && b.statusType !== 'accepted') return -1;
        if (b.statusType === 'accepted' && a.statusType !== 'accepted') return 1;
        return 0;
      });
    }
    return list;
  }, [quotes, activeTab]);

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
        <div className={styles.quotesLayoutGrid}>
          {/* ================================================================
              LEFT COLUMN: MAIN QUOTES LIST (70%)
             ================================================================ */}
          <section className={styles.mainCol}>
            {/* 1. Page Header */}
            <div className={styles.pageHeaderRow}>
              <div className={styles.headerTitleGroup}>
                <h1 className={styles.pageTitle}>Submitted Scrap Quotes</h1>
                <p className={styles.pageSubtitle}>
                  Track customer responses, accepted bulk offers, and pending industry bids.
                </p>
              </div>
            </div>

            {/* 2. 4-Column Stats Strip */}
            <div className={styles.statsStripGrid}>
              <div className={styles.statCard}>
                <div className={`${styles.statIconCircle} ${styles.iconYellow}`}>
                  <Send size={18} />
                </div>
                <div className={styles.statContent}>
                  <span className={styles.statLabel}>Total Quotes</span>
                  <span className={styles.statValue}>32</span>
                  <span className={styles.statTrend}>
                    This Month <strong className={styles.trendGreen}>↑ 24%</strong>
                  </span>
                </div>
              </div>

              <div className={styles.statCard}>
                <div className={`${styles.statIconCircle} ${styles.iconBlue}`}>
                  <Clock size={18} />
                </div>
                <div className={styles.statContent}>
                  <span className={styles.statLabel}>Pending Response</span>
                  <span className={styles.statValue}>14</span>
                  <span className={styles.statTrend}>
                    Awaiting customer
                  </span>
                </div>
              </div>

              <div className={styles.statCard}>
                <div className={`${styles.statIconCircle} ${styles.iconGreen}`}>
                  <CheckCircle2 size={18} />
                </div>
                <div className={styles.statContent}>
                  <span className={styles.statLabel}>Accepted (Won)</span>
                  <span className={styles.statValue}>10</span>
                  <span className={styles.statTrend}>
                    Win Rate <strong className={styles.trendGreen}>71.4%</strong>
                  </span>
                </div>
              </div>

              <div className={styles.statCard}>
                <div className={`${styles.statIconCircle} ${styles.iconRed}`}>
                  <XCircle size={18} />
                </div>
                <div className={styles.statContent}>
                  <span className={styles.statLabel}>Rejected / Expired</span>
                  <span className={styles.statValue}>8</span>
                  <span className={styles.statTrend}>
                    This Month <strong className={styles.trendRed}>↓ 4%</strong>
                  </span>
                </div>
              </div>
            </div>

            {/* 3. Tabs & Sort Row */}
            <div className={styles.tabsBar}>
              <div className={styles.tabsList}>
                <button
                  type="button"
                  className={`${styles.tabItem} ${activeTab === 'all' ? styles.tabActive : ''}`}
                  onClick={() => setActiveTab('all')}
                >
                  <span>All Quotes</span>
                  <span className={styles.tabBadge}>32</span>
                </button>
                <button
                  type="button"
                  className={`${styles.tabItem} ${activeTab === 'pending' ? styles.tabActive : ''}`}
                  onClick={() => setActiveTab('pending')}
                >
                  <span>Pending</span>
                  <span className={styles.tabBadge}>14</span>
                </button>
                <button
                  type="button"
                  className={`${styles.tabItem} ${activeTab === 'accepted' ? styles.tabActive : ''}`}
                  onClick={() => setActiveTab('accepted')}
                >
                  <span>Accepted</span>
                  <span className={styles.tabBadge}>10</span>
                </button>
                <button
                  type="button"
                  className={`${styles.tabItem} ${activeTab === 'rejected' ? styles.tabActive : ''}`}
                  onClick={() => setActiveTab('rejected')}
                >
                  <span>Rejected / Expired</span>
                  <span className={styles.tabBadge}>8</span>
                </button>
              </div>

              <div className={styles.sortSelector}>
                <span>Sort by: Urgency &amp; Status</span>
                <ChevronDown size={14} />
              </div>
            </div>

            {/* 4. Quotes Cards List */}
            <div className={styles.quotesList}>
              {filteredQuotes.map((quote) => (
                <article
                  key={quote.id}
                  className={`${styles.quoteCard} ${
                    quote.statusType === 'accepted' ? styles.quoteCardAccepted : ''
                  }`}
                >
                  {/* Accepted Priority Alert Banner */}
                  {quote.statusType === 'accepted' && (
                    <div className={styles.acceptedPriorityBanner}>
                      <div className={styles.acceptedPriorityLeft}>
                        <span className={styles.acceptedPriorityTag}>🎉 QUOTE ACCEPTED — PREPARE FOR PICKUP</span>
                        <span className={styles.acceptedPrioritySub}>
                          Customer agreed to ₹{quote.quotedPrice.toLocaleString('en-IN')} offer. Pickup booked for {quote.pickupSlot}.
                        </span>
                      </div>
                      <Link to="/ride" className={styles.acceptedRouteLink}>
                        <Truck size={13} />
                        <span>Go to Ride →</span>
                      </Link>
                    </div>
                  )}

                  {/* Top Customer & Request ID Strip */}
                  <div className={styles.cardHeaderRow}>
                    <div className={styles.cardHeaderLeft}>
                      {quote.statusType === 'accepted' ? (
                        <span className={styles.badgeAcceptedTag}>✓ ACCEPTED</span>
                      ) : (
                        <>
                          {quote.badgeType === 'new' && <span className={styles.badgeNew}>NEW</span>}
                          {quote.badgeType === 'expired' && <span className={styles.badgeExpired}>EXPIRED</span>}
                          {quote.badgeType === 'rejected' && <span className={styles.badgeRejected}>REJECTED</span>}
                        </>
                      )}

                      <div className={styles.customerGroup}>
                        <span className={styles.customerLabel}>Customer:</span>
                        <span className={styles.customerName}>{quote.customerName}</span>
                      </div>
                      <div className={styles.customerTypeBadge}>
                        {quote.customerType === 'Individual' ? <User size={12} /> : <Building size={12} />}
                        <span>{quote.customerType}</span>
                      </div>
                    </div>

                    <span className={styles.requestIdMuted}>Request ID: {quote.id}</span>
                  </div>

                  {/* Redesigned Card Body: Image Showcase + Quoted Details + Status Actions */}
                  <div className={styles.quoteBodyGrid}>
                    {/* 1. Large Image Showcase Column */}
                    <div className={styles.imageShowcaseCol}>
                      <div
                        className={styles.largeImgFrame}
                        onClick={() =>
                          setFloatingImage({
                            src: quote.image,
                            title: quote.materialName,
                            condition: quote.materialCondition,
                            quantity: quote.quantity,
                            customerName: quote.customerName,
                          })
                        }
                        title="Click to view floating photo preview"
                      >
                        <img
                          src={quote.image}
                          alt={quote.materialName}
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
                          {quote.materialCondition} Condition
                        </span>
                      </div>

                      <div className={styles.materialTitleBlock}>
                        <h3 className={styles.materialTitle}>{quote.materialName}</h3>
                        <div className={styles.quantityTag}>
                          <span className={styles.quantityHighlight}>{quote.quantity}</span>
                          <span className={styles.approxTag}>(Approx.)</span>
                        </div>
                      </div>
                    </div>

                    {/* 2. Middle Column: Submitted Quote Offer, Pickup Slot & Address */}
                    <div className={styles.detailsCol}>
                      {/* Your Quoted Price Showcase */}
                      <div className={styles.quotedPriceBox}>
                        <div className={styles.quotedPriceHeader}>
                          <Tag size={13} />
                          <span>YOUR SUBMITTED OFFER</span>
                        </div>
                        <div className={styles.quotedPriceValueRow}>
                          <span className={styles.quotedPriceAmount}>₹{quote.quotedPrice.toLocaleString('en-IN')}</span>
                          <span className={styles.quotedPriceLabel}>Total Offer</span>
                          {quote.hasVoiceNote && (
                            <span className={styles.voiceNotePill}>
                              <Mic size={11} /> Voice Note Attached
                            </span>
                          )}
                        </div>
                      </div>

                      <div className={styles.detailRow}>
                        <Calendar size={16} className={styles.detailIcon} />
                        <div className={styles.pickupTimeRow}>
                          <span className={styles.detailLabel}>OFFERED PICKUP SLOT</span>
                          <span className={styles.pickupTimeValue}>{quote.pickupSlot}</span>
                        </div>
                      </div>

                      <div className={styles.detailRow}>
                        <MapPin size={16} className={styles.detailIcon} />
                        <div className={styles.addressCol}>
                          <span className={styles.detailLabel}>PICKUP AREA</span>
                          <span className={styles.addressValue}>{getPrivacyArea(quote.address, quote.customerName)}</span>
                        </div>
                      </div>
                    </div>

                    {/* 3. Right Column: Status & Actions */}
                    <div className={styles.statusActionCol}>
                      <div className={styles.statusGroup}>
                        <span className={styles.statusHeader}>STATUS</span>
                        <span
                          className={`${styles.statePill} ${
                            quote.statusType === 'pending'
                              ? styles.statePending
                              : quote.statusType === 'accepted'
                              ? styles.stateAccepted
                              : quote.statusType === 'expired'
                              ? styles.stateExpired
                              : styles.stateRejected
                          }`}
                        >
                          {quote.statusText}
                        </span>

                        <div className={styles.statusMetaText}>
                          <span>{quote.statusMeta.label}</span>
                          <strong>{quote.statusMeta.date}</strong>
                        </div>
                      </div>

                      <div className={styles.buttonsStack}>
                        {quote.actions.includes('view-details') && (
                          <button
                            type="button"
                            className={styles.viewDetailsBtn}
                            onClick={() => setDetailsModalQuote(quote)}
                          >
                            View Details
                          </button>
                        )}

                        {quote.actions.includes('view-order') && (
                          <Link to="/orders" className={styles.viewOrderBtn}>
                            View Order →
                          </Link>
                        )}

                        {quote.actions.includes('cancel-quote') && (
                          <button
                            type="button"
                            className={styles.cancelQuoteLink}
                            onClick={() => handleCancelQuote(quote.id)}
                          >
                            Cancel Quote
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className={styles.cardFooter}>
                    <span>{quote.requestedAgo}</span>
                    <span className={styles.verifiedFooterText}>
                      <ShieldCheck size={13} /> Verified Request
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* ================================================================
              RIGHT SIDEBAR (30%) - Unchanged
             ================================================================ */}
          <aside className={styles.sidebarCol}>
            {/* Card 1: Filters */}
            <div className={styles.sidebarCard}>
              <div className={styles.sidebarHeaderRow}>
                <h3 className={styles.sidebarCardTitle}>
                  <Filter size={16} />
                  <span>Filters</span>
                </h3>
              </div>

              <div className={styles.filterField}>
                <label className={styles.filterLabel}>Quote Status</label>
                <div className={styles.selectWrapper}>
                  <select className={styles.filterSelect}>
                    <option value="all">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="accepted">Accepted</option>
                    <option value="expired">Expired</option>
                  </select>
                  <ChevronDown size={14} className={styles.selectChevron} />
                </div>
              </div>

              <div className={styles.filterField}>
                <label className={styles.filterLabel}>Time Window</label>
                <div className={styles.selectWrapper}>
                  <select className={styles.filterSelect}>
                    <option value="all">All Time</option>
                    <option value="today">Today</option>
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                  </select>
                  <ChevronDown size={14} className={styles.selectChevron} />
                </div>
              </div>
            </div>

            {/* Card 2: How Quotes Work */}
            <div className={styles.sidebarCard}>
              <h3 className={styles.sidebarCardTitle}>How Quotes Work</h3>
              <ol className={styles.stepsList}>
                <li className={styles.stepItem}>
                  <div className={styles.stepNumber}>1</div>
                  <div className={styles.stepText}>
                    <strong>Submit your offer:</strong> Quotes sent to customers remain valid for the response duration.
                  </div>
                </li>
                <li className={styles.stepItem}>
                  <div className={styles.stepNumber}>2</div>
                  <div className={styles.stepText}>
                    <strong>Customer Acceptance:</strong> Once approved, the deal locks in and moves to your active Orders tab.
                  </div>
                </li>
                <li className={styles.stepItem}>
                  <div className={styles.stepNumber}>3</div>
                  <div className={styles.stepText}>
                    <strong>Direct Pickup:</strong> Dispatch your vehicle with digital scales for spot verification.
                  </div>
                </li>
              </ol>
            </div>

            {/* Card 3: Quote Tips */}
            <div className={styles.sidebarCard}>
              <h3 className={styles.sidebarCardTitle}>Winning Quote Tips</h3>
              <ul className={styles.benefitsList}>
                <li className={styles.benefitItem}>
                  <CheckCircle2 size={16} className={styles.benefitCheckIcon} />
                  <span>Include clear pickup time slots</span>
                </li>
                <li className={styles.benefitItem}>
                  <CheckCircle2 size={16} className={styles.benefitCheckIcon} />
                  <span>Attach voice note for faster trust</span>
                </li>
                <li className={styles.benefitItem}>
                  <CheckCircle2 size={16} className={styles.benefitCheckIcon} />
                  <span>Quote within 15 mins for 3x wins</span>
                </li>
              </ul>
            </div>

            {/* Card 4: Need Help */}
            <div className={styles.sidebarCard}>
              <h3 className={styles.sidebarCardTitle}>Need Help?</h3>
              <p className={styles.helpText}>
                Need to adjust a submitted quote price or check customer acceptance? Contact our merchant support line.
              </p>
              <a href="tel:+919876543210" className={styles.helpPhoneBtn}>
                <Phone size={15} />
                <span>+91 98765 43210</span>
              </a>
            </div>
          </aside>
        </div>
      </main>

      {/* ================================================================
          QUOTE DETAILS MODAL
         ================================================================ */}
      {detailsModalQuote && (
        <div
          className={styles.modalOverlay}
          onClick={() => setDetailsModalQuote(null)}
        >
          <div
            className={styles.modalCard}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <div>
                <span className={styles.modalPretitle}>REQUEST ID: {detailsModalQuote.id}</span>
                <h2 className={styles.modalTitle}>{detailsModalQuote.materialName}</h2>
              </div>
              <button
                type="button"
                className={styles.modalCloseBtn}
                onClick={() => setDetailsModalQuote(null)}
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            <div className={styles.detailsModalBody}>
              <div className={styles.detailsModalImgBox}>
                <img
                  src={detailsModalQuote.image}
                  alt={detailsModalQuote.materialName}
                  className={styles.detailsModalImg}
                />
              </div>

              {/* Quoted Price Highlight Banner */}
              <div className={styles.modalQuotePriceBanner}>
                <span className={styles.modalQuotePriceLabel}>Your Submitted Price</span>
                <span className={styles.modalQuotePriceAmount}>₹{detailsModalQuote.quotedPrice.toLocaleString('en-IN')}</span>
                <span className={styles.modalQuotePriceSub}>Total offer for {detailsModalQuote.quantity}</span>
              </div>

              <div className={styles.specsGrid}>
                <div className={styles.specItem}>
                  <span className={styles.specLabel}>Customer</span>
                  <span className={styles.specValue}>{detailsModalQuote.customerName} ({detailsModalQuote.customerType})</span>
                </div>
                <div className={styles.specItem}>
                  <span className={styles.specLabel}>Condition</span>
                  <span className={styles.specValue}>{detailsModalQuote.materialCondition}</span>
                </div>
                <div className={styles.specItem}>
                  <span className={styles.specLabel}>Quantity</span>
                  <span className={styles.specValue}>{detailsModalQuote.quantity} Approx.</span>
                </div>
                <div className={styles.specItem}>
                  <span className={styles.specLabel}>Offered Pickup Slot</span>
                  <span className={styles.specValue}>{detailsModalQuote.pickupSlot}</span>
                </div>
                <div className={styles.specItemFull}>
                  <span className={styles.specLabel}>Pickup Area</span>
                  <span className={styles.specValue}>{getPrivacyArea(detailsModalQuote.address, detailsModalQuote.customerName)}</span>
                </div>
                {detailsModalQuote.quoteNote && (
                  <div className={styles.specItemFull}>
                    <span className={styles.specLabel}>Merchant Note Attached</span>
                    <span className={styles.specValue}>{detailsModalQuote.quoteNote}</span>
                  </div>
                )}
              </div>

              <div className={styles.modalActionsRow}>
                <button
                  type="button"
                  className={styles.modalCancelBtn}
                  onClick={() => setDetailsModalQuote(null)}
                >
                  Close
                </button>
                {detailsModalQuote.statusType === 'accepted' ? (
                  <Link
                    to="/orders"
                    className={styles.modalSubmitBtn}
                    onClick={() => setDetailsModalQuote(null)}
                  >
                    <span>View Order →</span>
                  </Link>
                ) : detailsModalQuote.statusType === 'pending' ? (
                  <button
                    type="button"
                    className={styles.modalDangerBtn}
                    onClick={() => handleCancelQuote(detailsModalQuote.id)}
                  >
                    <span>Cancel Quote</span>
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================
          CONFIRM CANCEL QUOTE VERIFICATION MODAL
         ================================================================ */}
      {confirmCancelTarget && (
        <div
          className={styles.confirmModalOverlay}
          onClick={() => setConfirmCancelTarget(null)}
        >
          <div
            className={styles.confirmModalCard}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.confirmModalIconBox}>
              <AlertTriangle size={30} className={styles.confirmModalIcon} />
            </div>

            <h3 className={styles.confirmModalTitle}>Cancel &amp; Withdraw Quote?</h3>
            
            <p className={styles.confirmModalText}>
              Are you sure you want to withdraw your offer of <strong>₹{confirmCancelTarget.price.toLocaleString('en-IN')}</strong> submitted to <strong>{confirmCancelTarget.customerName}</strong> ({confirmCancelTarget.id})?
            </p>

            <p className={styles.confirmModalSubtext}>
              The customer will be notified that your quote has been withdrawn.
            </p>

            <div className={styles.confirmModalActionsRow}>
              <button
                type="button"
                className={styles.confirmModalCancelBtn}
                onClick={() => setConfirmCancelTarget(null)}
              >
                No, Keep Quote
              </button>
              <button
                type="button"
                className={styles.confirmModalDangerBtn}
                onClick={handleConfirmCancelQuote}
              >
                Yes, Withdraw Quote
              </button>
            </div>
          </div>
        </div>
      )}

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
