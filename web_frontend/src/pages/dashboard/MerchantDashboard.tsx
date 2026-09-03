import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Tag,
  Package,
  ArrowRight,
  FileText,
  MessageSquare,
  ClipboardCheck,
  Truck,
  Building2,
  Trophy,
  TrendingUp,
  TrendingDown,
  Info,
  Award,
  Flame,
  CreditCard,
  Gift,
  CheckCircle2,
  Star,
  Bell,
  Check,
  Store,
  Clock,
  Edit3,
  X,
  Zap,
  AlertTriangle,
  MapPin,
  Calendar,
  Phone,
  Plus,
} from 'lucide-react';
import { MerchantNavbar } from '@/components/navigation/MerchantNavbar';
import { useAuthStore } from '@/store/useAuthStore';
import styles from './MerchantDashboard.module.css';

interface ScrapPriceItem {
  id: string;
  name: string;
  priceRange: string;
  change: string;
  trend: 'up' | 'down';
  img: string;
}

export interface MerchantDashboardProps {
  merchantTrustStatus?: 'priority' | 'standard';
}

interface MerchantRateInfo {
  rate: number;
  lastUpdated: string;
}

const DEFAULT_MERCHANT_RATES: Record<string, MerchantRateInfo> = {
  iron: { rate: 27, lastUpdated: 'Today, 9:30 AM' },
  copper: { rate: 700, lastUpdated: 'Today, 9:30 AM' },
  aluminium: { rate: 155, lastUpdated: 'Today, 9:30 AM' },
  brass: { rate: 480, lastUpdated: 'Yesterday' },
  steel: { rate: 30, lastUpdated: 'Today, 9:30 AM' },
  plastic: { rate: 22, lastUpdated: 'Today, 9:30 AM' },
  paper: { rate: 14, lastUpdated: '2 days ago' },
  ewaste: { rate: 40, lastUpdated: 'Today, 9:30 AM' },
};

const SCRAP_PRICES: ScrapPriceItem[] = [
  {
    id: 'iron',
    name: 'Iron',
    priceRange: '₹ 25 - 28 / KG',
    change: '2%',
    trend: 'up',
    img: '/scrap-iron.png',
  },
  {
    id: 'copper',
    name: 'Copper',
    priceRange: '₹ 680 - 720 / KG',
    change: '1.5%',
    trend: 'up',
    img: '/scrap-copper.png',
  },
  {
    id: 'aluminium',
    name: 'Aluminium',
    priceRange: '₹ 145 - 160 / KG',
    change: '1%',
    trend: 'down',
    img: '/scrap-commercial-aluminium.png',
  },
  {
    id: 'brass',
    name: 'Brass',
    priceRange: '₹ 460 - 500 / KG',
    change: '1%',
    trend: 'up',
    img: '/scrap-brass.png',
  },
  {
    id: 'steel',
    name: 'Steel',
    priceRange: '₹ 28 - 32 / KG',
    change: '1.8%',
    trend: 'up',
    img: '/scrap-quality-steel.png',
  },
  {
    id: 'plastic',
    name: 'Plastic',
    priceRange: '₹ 20 - 25 / KG',
    change: '0.5%',
    trend: 'up',
    img: '/scrap-grade-plastic.png',
  },
  {
    id: 'paper',
    name: 'Paper',
    priceRange: '₹ 12 - 15 / KG',
    change: '0.8%',
    trend: 'up',
    img: '/scrap-cardboard.png',
  },
  {
    id: 'ewaste',
    name: 'E-Waste',
    priceRange: '₹ 35 - 45 / KG',
    change: '1.2%',
    trend: 'up',
    img: '/scrap-cpu.png',
  },
];

export default function MerchantDashboard({ merchantTrustStatus = 'priority' }: MerchantDashboardProps) {
  const user = useAuthStore((s) => s.user);
  const [timeframe, setTimeframe] = useState<'month' | 'week' | 'today'>('month');
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [phoneReqAccepted, setPhoneReqAccepted] = useState<boolean | null>(null);
  const [heroRecentReqState, setHeroRecentReqState] = useState<'pending' | 'accepted' | 'denied'>('pending');

  // Urgent Actions / Top Accepted Quote Banner State
  const [showAcceptedQuoteBanner, setShowAcceptedQuoteBanner] = useState(true);

  // Custom Merchant Buying Rates State
  const [merchantRates, setMerchantRates] = useState<Record<string, MerchantRateInfo>>(DEFAULT_MERCHANT_RATES);
  const [isUpdateRatesModalOpen, setIsUpdateRatesModalOpen] = useState(false);
  const [draftRates, setDraftRates] = useState<Record<string, number | string>>({});

  const handleOpenModal = () => {
    const initialDraft: Record<string, number | string> = {};
    Object.keys(merchantRates).forEach((k) => {
      initialDraft[k] = merchantRates[k].rate;
    });
    setDraftRates(initialDraft);
    setIsUpdateRatesModalOpen(true);
  };

  const handleSaveRates = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = { ...merchantRates };
    Object.keys(draftRates).forEach((k) => {
      const num = Number(draftRates[k]);
      if (!isNaN(num) && num > 0) {
        updated[k] = {
          rate: num,
          lastUpdated: 'Just now',
        };
      }
    });
    setMerchantRates(updated);
    setIsUpdateRatesModalOpen(false);
  };

  const merchantName = user?.name || 'Ramesh Traders';

  // Metrics based on timeframe
  const perfData = {
    month: {
      quotes: '32',
      quotesTrend: '15%',
      orders: '22',
      ordersTrend: '22%',
      rate: '56%',
      rateTrend: '10%',
      earnings: '₹ 3,65,780',
      earningsTrend: '24%',
    },
    week: {
      quotes: '12',
      quotesTrend: '18%',
      orders: '8',
      ordersTrend: '25%',
      rate: '66%',
      rateTrend: '12%',
      earnings: '₹ 1,12,400',
      earningsTrend: '20%',
    },
    today: {
      quotes: '4',
      quotesTrend: '20%',
      orders: '3',
      ordersTrend: '33%',
      rate: '75%',
      rateTrend: '15%',
      earnings: '₹ 46,250',
      earningsTrend: '28%',
    },
  }[timeframe];

  return (
    <div className={styles.pageWrapper}>
      <main className={styles.mainContainer}>
        {/* 1. Top Urgent Action / Celebration Banner */}
        {showAcceptedQuoteBanner && (
          <div className={styles.topAcceptedBanner}>
            <div className={styles.topBannerLeft}>
              <div className={styles.celebrationIconBox}>🎉</div>
              <div className={styles.topBannerTextGroup}>
                <div className={styles.topBannerHeading}>
                  <strong>Sri Venkatesh Industries</strong> accepted your offer of <strong>₹18,500</strong>!
                </div>
                <div className={styles.topBannerSubtext}>
                  Metal Scrap (650 KG) • Pickup scheduled for <strong>16 May 2025 • 10:00 AM</strong>
                </div>
              </div>
            </div>

            <div className={styles.topBannerActionGroup}>
              <Link to="/orders" className={styles.topBannerBtnPrimary}>
                <span>View Order</span>
                <ArrowRight size={14} />
              </Link>
              <Link to="/ride" className={styles.topBannerBtnSecondary}>
                <Truck size={14} />
                <span>Prepare Route</span>
              </Link>
              <button
                type="button"
                className={styles.topBannerCloseBtn}
                onClick={() => setShowAcceptedQuoteBanner(false)}
                aria-label="Dismiss banner"
                title="Dismiss"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        )}

        {/* MOBILE OPERATIONS FEED (Rendered on Mobile Screens Only) */}
        <section className={styles.mobileOperationsSection}>
          {/* Welcome Header with View New Requests Action */}
          <div className={styles.mobileWelcomeCard}>
            <div className={styles.mobileWelcomeHeaderRow}>
              <div className={styles.enterpriseBadgeRow}>
                <span className={styles.enterpriseBadge}>
                  <ShieldCheck size={13} className={styles.shieldIcon} />
                  <span>VERIFIED MERCHANT ACCOUNT</span>
                </span>
                <span className={styles.gstinTag}>GSTIN: 33AAAAA0000A1Z5</span>
              </div>
              <span className={styles.mobileGreeting}>Vanakkam,</span>
              <h2 className={styles.mobileMerchantName}>{merchantName}</h2>
              <p className={styles.mobileMerchantSub}>
                Manage active factory leads, submit quotes, and track pickup weighing.
              </p>

              <div className={styles.mobileHeroActionRow}>
                <Link to="/requests" className={styles.mobileViewNewReqBtn}>
                  <Plus size={16} />
                  <span>View New Requests</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>

          {/* Key Performance Stats Grid directly below the username box */}
          <div className={styles.mobileStatsGrid}>
            {/* Stat 1: New Requests */}
            <div className={styles.mobileStatCard}>
              <div className={styles.mobileStatIconCircle}>
                <FileText size={18} />
              </div>
              <div className={styles.mobileStatInfoCol}>
                <span className={styles.mobileStatLabel}>New Requests</span>
                <strong className={styles.mobileStatVal}>18</strong>
                <div className={styles.mobileStatTrendRow}>
                  <span className={styles.mobileStatPeriod}>Today</span>
                  <span className={styles.mobileStatTrendUp}>
                    <TrendingUp size={11} /> 20%
                  </span>
                </div>
              </div>
            </div>

            {/* Stat 2: Quotes Sent */}
            <div className={styles.mobileStatCard}>
              <div className={styles.mobileStatIconCircle}>
                <MessageSquare size={18} />
              </div>
              <div className={styles.mobileStatInfoCol}>
                <span className={styles.mobileStatLabel}>Quotes Sent</span>
                <strong className={styles.mobileStatVal}>32</strong>
                <div className={styles.mobileStatTrendRow}>
                  <span className={styles.mobileStatPeriod}>Today</span>
                  <span className={styles.mobileStatTrendUp}>
                    <TrendingUp size={11} /> 15%
                  </span>
                </div>
              </div>
            </div>

            {/* Stat 3: Orders Won */}
            <div className={styles.mobileStatCard}>
              <div className={styles.mobileStatIconCircle}>
                <ClipboardCheck size={18} />
              </div>
              <div className={styles.mobileStatInfoCol}>
                <span className={styles.mobileStatLabel}>Orders Won</span>
                <strong className={styles.mobileStatVal}>22</strong>
                <div className={styles.mobileStatTrendRow}>
                  <span className={styles.mobileStatPeriod}>This Month</span>
                  <span className={styles.mobileStatTrendUp}>
                    <TrendingUp size={11} /> 22%
                  </span>
                </div>
              </div>
            </div>

            {/* Stat 4: Total Pickups */}
            <div className={styles.mobileStatCard}>
              <div className={styles.mobileStatIconCircle}>
                <Truck size={18} />
              </div>
              <div className={styles.mobileStatInfoCol}>
                <span className={styles.mobileStatLabel}>Total Pickups</span>
                <strong className={styles.mobileStatVal}>158</strong>
                <div className={styles.mobileStatTrendRow}>
                  <span className={styles.mobileStatPeriod}>This Month</span>
                  <span className={styles.mobileStatTrendUp}>
                    <TrendingUp size={11} /> 18%
                  </span>
                </div>
              </div>
            </div>

            {/* Stat 5: Total Earnings (Full-Width Highlight Card) */}
            <div className={`${styles.mobileStatCard} ${styles.mobileStatCardHighlight}`}>
              <div className={`${styles.mobileStatIconCircle} ${styles.mobileStatIconGold}`}>
                <span style={{ fontSize: '1.1rem', fontWeight: 900 }}>₹</span>
              </div>
              <div className={styles.mobileStatInfoCol}>
                <span className={styles.mobileStatLabel}>Total Earnings</span>
                <strong className={styles.mobileStatValGold}>₹ 3,65,780</strong>
                <div className={styles.mobileStatTrendRow}>
                  <span className={styles.mobileStatPeriod}>This Month</span>
                  <span className={styles.mobileStatTrendUp}>
                    <TrendingUp size={11} /> 24%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 1. Urgent Action: Today's Scheduled Pickup Card */}
          <div className={styles.mobileActionCardPrimary}>
            <div className={styles.mobileCardHeader}>
              <span className={styles.mobileCardTagPickup}>🚚 TODAY'S PICKUP</span>
              <span className={styles.mobilePickupTime}>10:00 AM – 12:00 PM</span>
            </div>
            <div className={styles.mobileCardBody}>
              <h3 className={styles.mobileOrderCompany}>Sri Venkatesh Industries</h3>
              <p className={styles.mobileOrderLoc}>📍 24, SIDCO Industrial Estate, Guindy, Chennai</p>
              <div className={styles.mobileOrderDetailsPill}>
                <span>Metal Scrap</span> • <strong>650 KG</strong> • <span className={styles.mobilePriceText}>₹18,500</span>
              </div>
            </div>
            <div className={styles.mobileCardActions}>
              <Link to="/orders" className={styles.mobileCtaPrimary}>
                <Truck size={15} />
                <span>Start Navigation / Order Details</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          {/* 2. Urgent Available Requests Alert Card */}
          <div className={styles.mobileActionCardRequests}>
            <div className={styles.mobileCardHeader}>
              <span className={styles.mobileCardTagRequests}>⚡ 18 NEW REQUESTS</span>
              <span className={styles.mobilePulseTag}>Live in Chennai</span>
            </div>
            <p className={styles.mobileCardDesc}>
              Bulk scrap requests available nearby in Guindy, Ambattur &amp; Porur. Submit quotes before deadlines expire.
            </p>
            <Link to="/requests" className={styles.mobileCtaSecondaryYellow}>
              <span>Browse &amp; Quote Requests (18)</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          {/* 3. Recently Accepted Quotes Alert */}
          <div className={styles.mobileActionCardAccepted}>
            <div className={styles.mobileCardHeader}>
              <span className={styles.mobileCardTagAccepted}>🎉 OFFER ACCEPTED</span>
              <span className={styles.mobileTimeAgo}>15m ago</span>
            </div>
            <div className={styles.mobileAcceptedBody}>
              <strong>Precision Tools &amp; Castings</strong> accepted your quote of <strong>₹31,200</strong> (Brass Scrap, 75 KG).
            </div>
            <Link
              to="/orders?orderId=ORD-250512-00075&customer=Precision+Tools+%26+Castings+Pvt+Ltd&rate=31200&action=pickup"
              className={styles.mobileCtaOutlineGreen}
            >
              <CheckCircle2 size={14} />
              <span>View Accepted Order Details &amp; Start Pickup</span>
            </Link>
          </div>

          {/* 4. Trust & Priority Score Widget (Mobile Yellow + Graphite Theme) */}
          <div className={styles.mobileTrustScoreCard}>
            <div className={styles.mobileTrustHeader}>
              <div className={styles.mobileTrustTitleWrap}>
                <h4 className={styles.mobileTrustTitle}>Trust &amp; Priority Score</h4>
              </div>
              <span className={styles.mobileTrustBadgePriority}>
                <ShieldCheck size={13} />
                <span>Priority Tier</span>
              </span>
            </div>

            <div className={styles.mobileTrustBody}>
              <div className={styles.mobileTrustRingWrap}>
                <svg viewBox="0 0 54 54" width="56" height="56">
                  <circle cx="27" cy="27" r="22" fill="none" stroke="#334155" strokeWidth="4.5" />
                  <circle
                    cx="27"
                    cy="27"
                    r="22"
                    fill="none"
                    stroke="#fbc21a"
                    strokeWidth="4.5"
                    strokeDasharray="138.2"
                    strokeDashoffset="5.5"
                    strokeLinecap="round"
                    transform="rotate(-90 27 27)"
                  />
                </svg>
                <span className={styles.mobileTrustRingNumber}>96%</span>
              </div>

              <div className={styles.mobileTrustFactorsGrid}>
                <div className={styles.mobileTrustFactorItem}>
                  <span className={styles.mobileTrustFactorLabel}>On-Time Comm.</span>
                  <strong className={styles.mobileTrustFactorVal}>100%</strong>
                </div>
                <div className={styles.mobileTrustFactorItem}>
                  <span className={styles.mobileTrustFactorLabel}>Response Rate</span>
                  <strong className={styles.mobileTrustFactorVal}>94%</strong>
                </div>
                <div className={styles.mobileTrustFactorItem}>
                  <span className={styles.mobileTrustFactorLabel}>Completion</span>
                  <strong className={styles.mobileTrustFactorVal}>98%</strong>
                </div>
              </div>
            </div>

            <p className={styles.mobileTrustExplanation}>
              Merchants who pay commissions on time and complete accepted orders get more new requests.
            </p>

            <Link to="/profile" className={styles.mobileTrustLearnMoreLink}>
              <span>Learn More About Priority Tier</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          {/* 6. Full Scrap Market Prices & Buying Rates Board */}
          <div className={styles.mobileMarketBoardCard}>
            <div className={styles.mobileMarketHeaderRow}>
              <div className={styles.mobileMarketTitleWrap}>
                <TrendingUp size={18} className={styles.marketIconYellow} />
                <div>
                  <h4 className={styles.mobileMarketTitle}>Live Scrap Market Prices</h4>
                  <span className={styles.mobileMarketSub}>Chennai Mandi &amp; Your Buying Rates</span>
                </div>
              </div>
              <Link
                to="/merchant/market-prices"
                className={styles.mobileEditRatesBtn}
                title="Open Market Prices page to update your custom rates"
              >
                <Edit3 size={13} />
                <span>Update Price</span>
              </Link>
            </div>

            <div className={styles.mobileMarketPricesList}>
              {SCRAP_PRICES.map((item) => {
                const userRate = merchantRates[item.id]?.rate;
                return (
                  <Link
                    key={item.id}
                    to={`/merchant/market-prices?material=${encodeURIComponent(item.id)}&name=${encodeURIComponent(item.name)}`}
                    className={styles.mobilePriceRowCard}
                    title="Click to view and edit market price on Market Prices page"
                  >
                    <img
                      src={item.img}
                      alt={item.name}
                      className={styles.mobilePriceThumb}
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = '/logo-icon.png';
                      }}
                    />
                    <div className={styles.mobilePriceInfoCol}>
                      <div className={styles.mobilePriceNameRow}>
                        <strong className={styles.mobilePriceName}>{item.name}</strong>
                        <span
                          className={
                            item.trend === 'up'
                              ? styles.mobileTrendUp
                              : styles.mobileTrendDown
                          }
                        >
                          {item.trend === 'up' ? '↑' : '↓'} {item.change}
                        </span>
                      </div>
                      <span className={styles.mobileMandiRange}>Mandi Range: {item.priceRange}</span>
                    </div>

                    <div className={styles.mobileMyRateCol}>
                      <span className={styles.mobileMyRateLabel}>YOUR Price</span>
                      <strong className={styles.mobileMyRateVal}>
                        ₹{userRate || item.priceRange.split('-')[0].replace(/[^0-9]/g, '')}<small>/kg</small>
                      </strong>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* 2. Hero Welcome Section */}
        <section className={styles.heroSection}>
          <div className={styles.heroLeft}>
            <div>
              <p className={styles.welcomeSubtitle}>Welcome back,</p>
              <h1 className={styles.welcomeTitle}>{merchantName}!</h1>
            </div>

            <p className={styles.heroDescription}>
              Get more pickups. Give the best price.<br />
              Grow your business with Bill Scrap.
            </p>

            <div className={styles.heroFeaturesRow}>
              {/* Feature 1 */}
              <div className={styles.heroFeatureItem}>
                <div className={styles.featureIconCircle}>
                  <ShieldCheck size={16} />
                </div>
                <div className={styles.featureTextCol}>
                  <span className={styles.featureTextTitle}>Verified Leads</span>
                  <span className={styles.featureTextSub}>100% genuine requests</span>
                </div>
              </div>

              {/* Feature 2 */}
              <div className={styles.heroFeatureItem}>
                <div className={styles.featureIconCircle}>
                  <Tag size={15} />
                </div>
                <div className={styles.featureTextCol}>
                  <span className={styles.featureTextTitle}>Best Price Deals</span>
                  <span className={styles.featureTextSub}>Competitive edge</span>
                </div>
              </div>

              {/* Feature 3 */}
              <div className={styles.heroFeatureItem}>
                <div className={styles.featureIconCircle}>
                  <Package size={15} />
                </div>
                <div className={styles.featureTextCol}>
                  <span className={styles.featureTextTitle}>More Orders</span>
                  <span className={styles.featureTextSub}>More pickups, more profits</span>
                </div>
              </div>
            </div>

            <Link to="/requests" className={styles.heroCtaBtn}>
              <span>View New Requests</span>
              <ArrowRight size={18} />
            </Link>

            {/* Compact Recent Request Card */}
            <div className={styles.heroRecentCard}>
              {heroRecentReqState === 'pending' ? (
                <>
                  <div className={styles.recentHeaderRow}>
                    <div className={styles.recentTitleGroup}>
                      <span className={styles.livePulseDot} />
                      <span className={styles.recentHeaderTitle}>Latest Request</span>
                      <span className={styles.recentBadge}>NEW</span>
                    </div>
                    <span className={styles.recentTimestamp}>
                      <Clock size={11} /> 5 mins ago
                    </span>
                  </div>

                  <Link to="/requests" className={styles.recentDetailsRow} style={{ textDecoration: 'none', cursor: 'pointer' }}>
                    <div className={styles.recentMaterialInfo}>
                      <img
                        src="/scrap-iron.png"
                        alt="Metal Scrap"
                        className={styles.recentMaterialImg}
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = '/logo-icon.png';
                        }}
                      />
                      <div className={styles.recentMaterialText}>
                        <span className={styles.recentMaterialName}>Metal Scrap • 500 - 800 KG</span>
                        <span className={styles.recentMaterialLocation}>📍 Guindy, Chennai • Posted by Sri Venkatesh</span>
                      </div>
                    </div>

                    <div className={styles.recentDeadlineContainer}>
                      <span className={styles.recentDeadlineLabel}>Respond by</span>
                      <span className={styles.recentDeadlineTime}>09:45 AM</span>
                    </div>
                  </Link>

                  <div className={styles.recentActionsRow}>
                    <Link
                      to="/requests"
                      className={styles.recentAcceptBtn}
                      title="Open Requests page to review and submit quote"
                    >
                      <Check size={14} />
                      <span>Accept &amp; Quote</span>
                    </Link>
                    <button
                      type="button"
                      className={styles.recentDenyBtn}
                      onClick={() => setHeroRecentReqState('denied')}
                      title="Dismiss request"
                    >
                      <X size={14} />
                      <span>Dismiss</span>
                    </button>
                  </div>

                  <Link to="/requests" className={styles.recentFooterLink}>
                    <span>View All Requests</span>
                    <ArrowRight size={12} />
                  </Link>
                </>
              ) : heroRecentReqState === 'accepted' ? (
                <div className={styles.recentAcceptedState}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: '#16a34a', fontWeight: 700, fontSize: '0.85rem' }}>
                    <CheckCircle2 size={16} />
                    <span>✓ Request Accepted! Added to My Quotes</span>
                  </div>
                  <Link to="/quotes" className={styles.recentFooterLink}>
                    <span>View in My Quotes →</span>
                  </Link>
                </div>
              ) : (
                <div className={styles.recentCalmState}>
                  <CheckCircle2 size={16} color="#16a34a" />
                  <span>No new requests right now — you're all caught up!</span>
                </div>
              )}
            </div>
          </div>

          <div className={styles.heroRight}>
            <img
              src="/hero-truck.png"
              alt="Bill Scrap Commercial Truck"
              width="640"
              height="480"
              className={styles.heroTruckImg}
              loading="eager"
            />
          </div>
        </section>

        {/* 3. Key Stats Cards (5 in a row) */}
        <section className={styles.statsGrid} aria-label="Key Performance Indicators">
          {/* 1: New Requests */}
          <div className={styles.statCard}>
            <div className={`${styles.statIconWrap} ${styles.statIconOrange}`}>
              <FileText size={22} />
            </div>
            <div className={styles.statContent}>
              <span className={styles.statLabel}>New Requests</span>
              <span className={styles.statValue}>18</span>
              <div className={styles.statFooter}>
                <span>Today</span>
                <span className={styles.trendGreen}>
                  <TrendingUp size={12} /> 20%
                </span>
              </div>
            </div>
          </div>

          {/* 2: Quotes Sent */}
          <div className={styles.statCard}>
            <div className={`${styles.statIconWrap} ${styles.statIconGreen}`}>
              <MessageSquare size={22} />
            </div>
            <div className={styles.statContent}>
              <span className={styles.statLabel}>Quotes Sent</span>
              <span className={styles.statValue}>32</span>
              <div className={styles.statFooter}>
                <span>Today</span>
                <span className={styles.trendGreen}>
                  <TrendingUp size={12} /> 15%
                </span>
              </div>
            </div>
          </div>

          {/* 3: Orders Won */}
          <div className={styles.statCard}>
            <div className={`${styles.statIconWrap} ${styles.statIconBlue}`}>
              <ClipboardCheck size={22} />
            </div>
            <div className={styles.statContent}>
              <span className={styles.statLabel}>Orders Won</span>
              <span className={styles.statValue}>22</span>
              <div className={styles.statFooter}>
                <span>This Month</span>
                <span className={styles.trendGreen}>
                  <TrendingUp size={12} /> 22%
                </span>
              </div>
            </div>
          </div>

          {/* 4: Total Pickups */}
          <div className={styles.statCard}>
            <div className={`${styles.statIconWrap} ${styles.statIconPurple}`}>
              <Truck size={22} />
            </div>
            <div className={styles.statContent}>
              <span className={styles.statLabel}>Total Pickups</span>
              <span className={styles.statValue}>158</span>
              <div className={styles.statFooter}>
                <span>This Month</span>
                <span className={styles.trendGreen}>
                  <TrendingUp size={12} /> 18%
                </span>
              </div>
            </div>
          </div>

          {/* 5: Total Earnings */}
          <div className={styles.statCard}>
            <div className={`${styles.statIconWrap} ${styles.statIconGreen}`}>
              <span style={{ fontSize: '1.4rem', fontWeight: 800 }}>₹</span>
            </div>
            <div className={styles.statContent}>
              <span className={styles.statLabel}>Total Earnings</span>
              <span className={styles.statValue}>₹ 3,65,780</span>
              <div className={styles.statFooter}>
                <span>This Month</span>
                <span className={styles.trendGreen}>
                  <TrendingUp size={12} /> 24%
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Main Two-Column Layout */}
        <div className={styles.twoColGrid}>
          {/* ================================================================
              LEFT COLUMN (~65% width)
             ================================================================ */}
          <div className={styles.leftColumn}>
            {/* Widget 1: Today's Scrap Prices (Market Trend) */}
            <section className={styles.scrapPricesSection}>
              <div className={styles.cardHeaderRow}>
                <h2 className={styles.cardHeaderTitle}>
                  Today's Scrap Prices <span style={{ fontWeight: 500, color: '#64748b', fontSize: '0.9rem' }}>(Market Trend)</span>
                </h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Link
                    to="/merchant/market-prices"
                    className={styles.updateRatesBtn}
                    title="Update your custom buying rates on the Market Prices page"
                  >
                    <Edit3 size={13} />
                    <span>Update My Rates</span>
                  </Link>
                  <Link to="/merchant/market-prices" className={`${styles.viewAllLink} ${styles.viewAllLinkBlue}`}>
                    <span>View All Prices</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>

              <div className={styles.priceGrid}>
                {SCRAP_PRICES.map((item) => (
                  <div key={item.id} className={styles.priceCardItem}>
                    <div className={styles.priceCardImgWrapper}>
                      <img
                        src={item.img}
                        alt={item.name}
                        className={styles.priceItemImg}
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = '/logo-icon.png';
                        }}
                      />
                    </div>
                    <div className={styles.priceItemDetails}>
                      <div className={styles.priceItemHeaderRow}>
                        <span className={styles.priceItemName}>{item.name}</span>
                        <span className={item.trend === 'up' ? styles.trendGreenBadge : styles.trendRedBadge}>
                          {item.trend === 'up' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                          {item.change}
                        </span>
                      </div>
                      <span className={styles.priceItemMarketRate}>Market: {item.priceRange}</span>
                      {merchantRates[item.id] && (
                        <div className={styles.priceItemYourRate}>
                          <span className={styles.yourRateDot} />
                          <span>Your rate: ₹ {merchantRates[item.id].rate} / KG</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <p className={styles.footnoteText}>
                <Info size={13} /> Prices may vary based on quality, quantity and market conditions.
              </p>
            </section>

            {/* Widget 3: Accept more. Earn more. Promo Banner */}
            <div className={styles.promoCard}>
              <div className={styles.promoLeft}>
                <h2 className={styles.promoTitle}>Accept more. Earn more.</h2>
                <p className={styles.promoSub}>
                  Respond fast to new requests and increase your order success rate.
                </p>
                <p className={styles.promoIncentiveNote}>
                  Merchants with consistent on-time payments get new requests first.
                </p>
                <Link to="/requests" className={styles.promoBtn}>
                  <span>View New Requests</span>
                  <ArrowRight size={15} />
                </Link>
              </div>

              {/* Center Phone Mockup */}
              <div className={styles.phoneMockup}>
                <div className={styles.phoneHeader}>
                  <span className={styles.phoneHeaderTitle}>New Request</span>
                  <span className={styles.phoneBadge}>1</span>
                </div>

                <div className={styles.phoneRequestCard}>
                  <div className={styles.phoneReqRow}>
                    <img src="/scrap-iron.png" alt="Metal Scrap" className={styles.phoneReqImg} />
                    <div className={styles.phoneReqText}>
                      <span className={styles.phoneReqItemName}>Metal Scrap</span>
                      <span className={styles.phoneReqItemQty}>500 - 800 KG</span>
                      <span className={styles.phoneReqPickup}>Pickup Today</span>
                    </div>
                  </div>

                  {/* Priority / Trust Status Badge */}
                  <div className={styles.reqTrustLine}>
                    {merchantTrustStatus === 'priority' ? (
                      <span className={styles.trustPriorityBadge}>
                        <ShieldCheck size={11} /> Priority Merchant
                      </span>
                    ) : (
                      <span className={styles.trustStandardBadge}>
                        <Clock size={11} /> Stay active to unlock priority leads
                      </span>
                    )}
                  </div>

                  <div className={styles.phoneBtnRow}>
                    {phoneReqAccepted === null ? (
                      <>
                        <button
                          type="button"
                          className={styles.phoneAcceptBtn}
                          onClick={() => setPhoneReqAccepted(true)}
                        >
                          Accept
                        </button>
                        <button
                          type="button"
                          className={styles.phoneIgnoreBtn}
                          onClick={() => setPhoneReqAccepted(false)}
                        >
                          Ignore
                        </button>
                      </>
                    ) : phoneReqAccepted ? (
                      <span style={{ gridColumn: 'span 2', textAlign: 'center', fontSize: '0.65rem', color: '#16a34a', fontWeight: 700 }}>
                        ✓ Quote Accepted!
                      </span>
                    ) : (
                      <span style={{ gridColumn: 'span 2', textAlign: 'center', fontSize: '0.65rem', color: '#94a3b8' }}>
                        Dismissed
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Money Bag Asset */}
              <div className={styles.promoRightMoney}>
                <img
                  src="/money_bag_clean.jpg"
                  alt="Earnings Growth"
                  className={styles.moneyBagImg}
                />
              </div>
            </div>

            {/* Widget 4: Top Achievements */}
            <section className={styles.achievementsSection}>
              <h2 className={styles.achievementsTitle}>Top Achievements</h2>
              <div className={styles.achievementsGrid}>
                {/* 1: Highest Order */}
                <div className={styles.achievementCard}>
                  <div className={`${styles.achieveIconCircle} ${styles.achieveIconOrange}`}>
                    <Trophy size={24} />
                  </div>
                  <span className={styles.achieveLabel}>Highest Order This Month</span>
                  <span className={styles.achieveValue}>₹ 46,250</span>
                  <span className={styles.achieveSub}>Sai Industries<br />10 May 2025</span>
                </div>

                {/* 2: Most Orders Won */}
                <div className={styles.achievementCard}>
                  <div className={`${styles.achieveIconCircle} ${styles.achieveIconGreen}`}>
                    <Award size={24} />
                  </div>
                  <span className={styles.achieveLabel}>Most Orders Won</span>
                  <span className={styles.achieveValue}>22</span>
                  <span className={styles.achieveSub}>This Month</span>
                </div>

                {/* 3: Total Earnings */}
                <div className={styles.achievementCard}>
                  <div className={`${styles.achieveIconCircle} ${styles.achieveIconBlue}`}>
                    <span style={{ fontSize: '1.4rem', fontWeight: 800 }}>₹</span>
                  </div>
                  <span className={styles.achieveLabel}>Total Earnings</span>
                  <span className={styles.achieveValue}>₹ 3,65,780</span>
                  <span className={styles.achieveSub}>This Month</span>
                </div>

                {/* 4: Consistency Streak */}
                <div className={styles.achievementCard}>
                  <div className={`${styles.achieveIconCircle} ${styles.achieveIconPurple}`}>
                    <Flame size={24} />
                  </div>
                  <span className={styles.achieveLabel}>Consistency Streak</span>
                  <span className={styles.achieveValue}>12 Days</span>
                  <span className={styles.achieveSub}>🔥 Keep it going!</span>
                </div>
              </div>
            </section>
          </div>

          {/* ================================================================
              RIGHT COLUMN (~35% width)
             ================================================================ */}
          <aside className={styles.rightColumn}>
            {/* Widget 1: Merchant Profile */}
            <div className={styles.rightWidgetCard}>
              <div className={styles.cardHeaderRow}>
                <h3 className={styles.cardHeaderTitle}>Merchant Profile</h3>
                <Link to="/profile" className={`${styles.viewAllLink} ${styles.viewAllLinkBlue}`}>
                  <span>View Profile</span>
                  <ArrowRight size={13} />
                </Link>
              </div>

              <div className={styles.profileHero}>
                <div className={styles.profileAvatarLarge}>
                  <Store size={26} />
                </div>
                <div className={styles.profileHeroText}>
                  <span className={styles.profileHeroName}>{merchantName}</span>
                  <div className={styles.verifiedBadgeRow}>
                    <CheckCircle2 size={13} fill="#16a34a" color="#ffffff" />
                    <span>Verified Merchant</span>
                  </div>
                </div>
              </div>

              <div className={styles.profileStatsGrid}>
                <div className={styles.profileStatCol}>
                  <span className={styles.profileStatLabel}>Rating</span>
                  <div className={styles.profileRatingRow}>
                    <span className={styles.starRating}>★★★★★</span>
                    <span>4.8/5</span>
                  </div>
                  <span className={styles.reviewsCountText}>(126 reviews)</span>
                </div>

                <div className={styles.profileStatCol}>
                  <span className={styles.profileStatLabel}>Completed Orders</span>
                  <span className={styles.profileStatValueNum}>358</span>
                </div>
              </div>

              <Link to="/profile" className={styles.profileSettingsBtn}>
                Profile & Settings
              </Link>
            </div>

            {/* Widget 2: Trust & Priority Score */}
            <div className={styles.trustScoreCard}>
              <div className={styles.trustScoreHeader}>
                <h3 className={styles.cardHeaderTitle}>Trust &amp; Priority Score</h3>
                <span
                  className={
                    merchantTrustStatus === 'priority'
                      ? styles.trustTierBadgePriority
                      : styles.trustTierBadgeStandard
                  }
                >
                  <ShieldCheck size={13} />
                  <span>{merchantTrustStatus === 'priority' ? 'Priority Tier' : 'Standard Tier'}</span>
                </span>
              </div>

              <div className={styles.trustScoreBody}>
                <div className={styles.trustProgressRingBox}>
                  <svg viewBox="0 0 54 54" width="100%" height="100%">
                    <circle cx="27" cy="27" r="22" fill="none" stroke="#e2e8f0" strokeWidth="4.5" />
                    <circle
                      cx="27"
                      cy="27"
                      r="22"
                      fill="none"
                      stroke={merchantTrustStatus === 'priority' ? '#16a34a' : '#f59e0b'}
                      strokeWidth="4.5"
                      strokeDasharray="138.2"
                      strokeDashoffset={merchantTrustStatus === 'priority' ? '5.5' : '41.5'}
                      strokeLinecap="round"
                      transform="rotate(-90 27 27)"
                    />
                  </svg>
                  <span className={styles.trustScoreNumber}>
                    {merchantTrustStatus === 'priority' ? '96%' : '70%'}
                  </span>
                </div>

                <div className={styles.trustScoreFactorGrid}>
                  <div className={styles.trustFactorItem}>
                    <span className={styles.trustFactorLabel}>On-Time Comm.</span>
                    <span className={styles.trustFactorValue}>100%</span>
                  </div>
                  <div className={styles.trustFactorItem}>
                    <span className={styles.trustFactorLabel}>Response Rate</span>
                    <span className={styles.trustFactorValue}>94%</span>
                  </div>
                  <div className={styles.trustFactorItem}>
                    <span className={styles.trustFactorLabel}>Completion</span>
                    <span className={styles.trustFactorValue}>98%</span>
                  </div>
                </div>
              </div>

              <p className={styles.trustExplanationText}>
                Merchants who pay commissions on time and complete accepted orders get more new requests.
              </p>

              <Link to="/profile" className={styles.trustLearnMoreLink}>
                <span>Learn More About Priority Tier</span>
                <ArrowRight size={13} />
              </Link>
            </div>

            {/* Widget 3: Performance Overview */}
            <div className={styles.rightWidgetCard}>
              <div className={styles.cardHeaderRow}>
                <h3 className={styles.cardHeaderTitle}>Performance Overview</h3>
                <select
                  className={styles.selectDropdown}
                  value={timeframe}
                  onChange={(e) => setTimeframe(e.target.value as 'month' | 'week' | 'today')}
                  aria-label="Select timeframe"
                >
                  <option value="month">This Month</option>
                  <option value="week">This Week</option>
                  <option value="today">Today</option>
                </select>
              </div>

              <div className={styles.perfMetricsList}>
                <div className={styles.perfMetricRow}>
                  <span className={styles.perfLabel}>Quotes Sent</span>
                  <div className={styles.perfRight}>
                    <span className={styles.perfValue}>{perfData.quotes}</span>
                    <span className={styles.trendGreen}>
                      <TrendingUp size={11} /> {perfData.quotesTrend}
                    </span>
                  </div>
                </div>

                <div className={styles.perfMetricRow}>
                  <span className={styles.perfLabel}>Orders Won</span>
                  <div className={styles.perfRight}>
                    <span className={styles.perfValue}>{perfData.orders}</span>
                    <span className={styles.trendGreen}>
                      <TrendingUp size={11} /> {perfData.ordersTrend}
                    </span>
                  </div>
                </div>

                <div className={styles.perfMetricRow}>
                  <span className={styles.perfLabel}>Conversion Rate</span>
                  <div className={styles.perfRight}>
                    <span className={styles.perfValue}>{perfData.rate}</span>
                    <span className={styles.trendGreen}>
                      <TrendingUp size={11} /> {perfData.rateTrend}
                    </span>
                  </div>
                </div>

                <div className={styles.perfMetricRow}>
                  <span className={styles.perfLabel}>Total Earnings</span>
                  <div className={styles.perfRight}>
                    <span className={styles.perfValue}>{perfData.earnings}</span>
                    <span className={styles.trendGreen}>
                      <TrendingUp size={11} /> {perfData.earningsTrend}
                    </span>
                  </div>
                </div>
              </div>

              <Link to="/orders" className={styles.centeredLink}>
                <span>View Detailed Analytics</span>
                <ArrowRight size={13} />
              </Link>
            </div>

            {/* Widget 4: Quick Actions */}
            <div className={styles.rightWidgetCard}>
              <h3 className={styles.cardHeaderTitle}>Quick Actions</h3>
              <div className={styles.quickActionsGrid}>
                <Link to="/quotes" className={styles.quickActionTile}>
                  <div className={styles.qaIconCircle} style={{ background: '#f0fdf4', color: '#16a34a' }}>
                    <MessageSquare size={18} />
                  </div>
                  <div className={styles.qaTileText}>
                    <span className={styles.qaTileTitle}>My Quotes</span>
                    <span className={styles.qaTileSub}>View all quotes</span>
                  </div>
                </Link>

                <Link to="/orders" className={styles.quickActionTile}>
                  <div className={styles.qaIconCircle} style={{ background: '#eff6ff', color: '#2563eb' }}>
                    <Truck size={18} />
                  </div>
                  <div className={styles.qaTileText}>
                    <span className={styles.qaTileTitle}>My Orders</span>
                    <span className={styles.qaTileSub}>Track orders</span>
                  </div>
                </Link>

                <Link to="/transactions" className={styles.quickActionTile}>
                  <div className={styles.qaIconCircle} style={{ background: '#faf5ff', color: '#9333ea' }}>
                    <CreditCard size={18} />
                  </div>
                  <div className={styles.qaTileText}>
                    <span className={styles.qaTileTitle}>Transactions</span>
                    <span className={styles.qaTileSub}>Payment history</span>
                  </div>
                </Link>

                <Link to="#refer" className={styles.quickActionTile} onClick={(e) => e.preventDefault()}>
                  <div className={styles.qaIconCircle} style={{ background: '#fff8eb', color: '#ea580c' }}>
                    <Gift size={18} />
                  </div>
                  <div className={styles.qaTileText}>
                    <span className={styles.qaTileTitle}>Refer &amp; Earn</span>
                    <span className={styles.qaTileSub}>Invite merchants</span>
                  </div>
                </Link>
              </div>
            </div>
          </aside>
        </div>

        {/* 5. Bottom Alert Notification Banner */}
        <section className={styles.alertBanner}>
          <div className={styles.alertLeft}>
            <div className={styles.alertBellCircle}>
              <Bell size={22} />
            </div>
            <div className={styles.alertTextCol}>
              <div className={styles.alertTitle}>Never miss a request!</div>
              <div className={styles.alertSub}>
                Enable notifications and get instant alerts for new scrap requests.
              </div>
            </div>
          </div>

          <button
            type="button"
            className={styles.alertEnableBtn}
            onClick={() => setNotificationsEnabled(!notificationsEnabled)}
          >
            {notificationsEnabled ? (
              <>
                <Check size={16} />
                <span>Notifications Enabled</span>
              </>
            ) : (
              <>
                <Bell size={16} />
                <span>Enable Notifications</span>
              </>
            )}
          </button>
        </section>

        {/* 6. Trust Footer */}
        <footer className={styles.trustFooter}>
          <ShieldCheck size={16} className={styles.trustIcon} />
          <span>Trusted by 1000+ merchants across Chennai and Tamil Nadu.</span>
        </footer>
      </main>

      {/* Update My Buying Rates Modal */}
      {isUpdateRatesModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsUpdateRatesModalOpen(false)}>
          <div className={styles.modalContainer} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div className={styles.modalHeaderTop}>
                <h3 className={styles.modalTitle}>Update My Buying Rates</h3>
                <button
                  type="button"
                  className={styles.modalCloseBtn}
                  onClick={() => setIsUpdateRatesModalOpen(false)}
                  aria-label="Close modal"
                >
                  <X size={20} />
                </button>
              </div>
              <p className={styles.modalSubtitleNote}>
                These are your own buying rates, shown to customers alongside the market reference price. Update daily to stay competitive.
              </p>
            </div>

            <form onSubmit={handleSaveRates} className={styles.modalForm}>
              <div className={styles.modalBody}>
                {SCRAP_PRICES.map((item) => (
                  <div key={item.id} className={styles.rateEditRow}>
                    <div className={styles.rateEditLeft}>
                      <img
                        src={item.img}
                        alt={item.name}
                        className={styles.rateEditImg}
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = '/logo-icon.png';
                        }}
                      />
                      <div className={styles.rateEditTextCol}>
                        <span className={styles.rateEditName}>{item.name}</span>
                        <span className={styles.rateEditMarketRef}>Market: {item.priceRange}</span>
                        <span className={styles.rateEditLastUpdated}>
                          Last updated: {merchantRates[item.id]?.lastUpdated || 'Not set'}
                        </span>
                      </div>
                    </div>

                    <div className={styles.rateInputGroup}>
                      <span className={styles.rateInputCurrency}>₹</span>
                      <input
                        type="number"
                        min="1"
                        step="1"
                        placeholder={String(merchantRates[item.id]?.rate || '')}
                        value={draftRates[item.id] !== undefined ? draftRates[item.id] : ''}
                        onChange={(e) =>
                          setDraftRates({ ...draftRates, [item.id]: e.target.value })
                        }
                        className={styles.rateInputField}
                        required
                      />
                      <span className={styles.rateInputUnit}>/ KG</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className={styles.modalFooter}>
                <button
                  type="button"
                  className={styles.modalCancelBtn}
                  onClick={() => setIsUpdateRatesModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className={styles.modalSaveBtn}>
                  <Check size={16} />
                  <span>Save Rates</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
