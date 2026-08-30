import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  TrendingUp,
  ClipboardList,
  CheckCircle2,
  Clock,
  Truck,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  ChevronLeft,
  Calendar,
  DollarSign,
  AlertCircle,
  Sparkles,
  BarChart2,
  FileText,
  MapPin,
  Eye,
  X,
  Info,
  Layers,
  Scale,
  Camera,
} from 'lucide-react';
import styles from './IndustryDashboard.module.css';

interface RequirementSummary {
  id: string;
  requestId: string;
  material: string;
  materialsCount: number;
  category: string;
  quantity: string;
  condition: string;
  postedDate: string;
  status: 'awaiting_quotes' | 'quotes_received' | 'merchant_selected';
  quotesCount: number;
  photos: string[];
}

const ACTIVE_REQUIREMENTS: RequirementSummary[] = [
  {
    id: 'req-1',
    requestId: 'REQ-250513-00078',
    material: 'Steel Turnings (650 KG) + Copper (180 KG) + HDPE Drums (10 Pcs)',
    materialsCount: 3,
    category: 'Multi-Material Truck Visit',
    quantity: '3 Materials (~840 KG)',
    condition: 'Mixed & Clean',
    postedDate: 'Today, 09:30 AM',
    status: 'quotes_received',
    quotesCount: 3,
    photos: ['/industry-steel-scrap.jpg', '/industry-copper-scrap.jpg', '/industry-aluminium-scrap.jpg'],
  },
  {
    id: 'req-2',
    requestId: 'REQ-250512-00065',
    material: 'Aluminium Extrusions (400 KG) + Brass Rod Scrap (150 KG)',
    materialsCount: 2,
    category: 'Multi-Material Truck Visit',
    quantity: '2 Materials (550 KG)',
    condition: 'Clean & Sorted',
    postedDate: 'Yesterday, 04:20 PM',
    status: 'awaiting_quotes',
    quotesCount: 0,
    photos: ['/industry-aluminium-scrap.jpg', '/industry-steel-scrap.jpg'],
  },
  {
    id: 'req-3',
    requestId: 'REQ-250511-00049',
    material: 'Corrugated Packaging Boxes & Sheets',
    materialsCount: 1,
    category: 'Paper Scrap',
    quantity: '850 KG',
    condition: 'Clean & Baled',
    postedDate: '11 May 2025',
    status: 'merchant_selected',
    quotesCount: 4,
    photos: [], // Listed without photos
  },
];

const RECENT_ACTIVITIES = [
  {
    id: 'act-1',
    type: 'quote',
    title: 'New quote received from Ramesh Traders',
    desc: 'Offered rate quotes for Steel Turnings, Copper, & HDPE Drums • Pickup 16 May, 10:00 AM',
    time: '8 mins ago',
    link: '/industry/quotes',
    iconColor: 'green',
  },
  {
    id: 'act-2',
    type: 'pickup',
    title: 'Truck Dispatched for SIDCO Yard Pickup',
    desc: 'Tata 407 (TN 09 BX 4421) Driver Murugan arriving at Gate 2',
    time: '1 hour ago',
    link: '/industry/orders',
    iconColor: 'blue',
  },
  {
    id: 'act-3',
    type: 'payment',
    title: 'Payment Credited: ₹1,51,600',
    desc: 'NEFT Transfer (UTR: NEFT202505139901) for REQ-250513-00078',
    time: 'Yesterday',
    link: '/industry/transactions',
    iconColor: 'gold',
  },
  {
    id: 'act-4',
    type: 'request',
    title: 'New Requirement Posted: REQ-250513-00078',
    desc: 'Multi-material pickup request submitted for 3 items (~840 KG)',
    time: 'Today, 09:30 AM',
    link: '/industry/requests',
    iconColor: 'yellow',
  },
];

const TODAY_MARKET_TRENDS = [
  {
    id: 'IRON_001',
    name: 'Scrap Iron (Heavy HMS 1&2)',
    category: 'Iron & Steel',
    price: '₹38.50 / kg',
    trend: '+1.8%',
    isUp: true,
    image: '/scrap-iron.png',
  },
  {
    id: 'COP_001',
    name: 'Copper Scrap (Bright Wire 99%)',
    category: 'Copper Metal',
    price: '₹720.00 / kg',
    trend: '+1.5%',
    isUp: true,
    image: '/scrap-copper.png',
  },
  {
    id: 'ALU_001',
    name: 'Commercial Aluminium Cutoffs',
    category: 'Aluminium Metal',
    price: '₹135.00 / kg',
    trend: '-0.8%',
    isUp: false,
    image: '/scrap-commercial-aluminium.png',
  },
  {
    id: 'PLS_004',
    name: 'HDPE Blue Chemical Drums (200L)',
    category: 'Industrial Polymer',
    price: '₹380.00 / pc',
    trend: '+2.1%',
    isUp: true,
    image: '/scrap-plastic-barrel.png',
  },
  {
    id: 'PPR_001',
    name: 'Corrugated Packaging Cartons',
    category: 'Paper & Board',
    price: '₹14.50 / kg',
    trend: '0.0%',
    isUp: true,
    image: '/scrap-cardboard.png',
  },
  {
    id: 'BRS_001',
    name: 'Brass Honey Scrap',
    category: 'Brass Metal',
    price: '₹460.00 / kg',
    trend: '+1.2%',
    isUp: true,
    image: '/scrap-brass.png',
  },
];

export default function IndustryDashboard() {
  const [floatingGallery, setFloatingGallery] = useState<{
    photos: string[];
    activeIndex: number;
    title: string;
    condition: string;
    quantity: string;
    location: string;
  } | null>(null);

  // Touch Swipe tracking
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!floatingGallery) return;
      if (e.key === 'ArrowRight') {
        handleNextPhoto();
      } else if (e.key === 'ArrowLeft') {
        handlePrevPhoto();
      } else if (e.key === 'Escape') {
        setFloatingGallery(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [floatingGallery]);

  const handleNextPhoto = () => {
    setFloatingGallery((prev) => {
      if (!prev || prev.photos.length <= 1) return prev;
      return {
        ...prev,
        activeIndex: (prev.activeIndex + 1) % prev.photos.length,
      };
    });
  };

  const handlePrevPhoto = () => {
    setFloatingGallery((prev) => {
      if (!prev || prev.photos.length <= 1) return prev;
      return {
        ...prev,
        activeIndex: (prev.activeIndex - 1 + prev.photos.length) % prev.photos.length,
      };
    });
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current !== null && touchEndX.current !== null) {
      const diff = touchStartX.current - touchEndX.current;
      if (diff > 45) {
        handleNextPhoto();
      } else if (diff < -45) {
        handlePrevPhoto();
      }
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <div className={styles.pageContainer}>
      {/* 1. Hero Welcome & Quick Action Card */}
      <section className={styles.heroSection}>
        <div className={styles.heroLeftContent}>
          <div className={styles.enterpriseBadgeRow}>
            <span className={styles.enterpriseBadge}>
              <ShieldCheck size={14} className={styles.shieldIcon} />
              <span>VERIFIED ENTERPRISE ACCOUNT</span>
            </span>
            <span className={styles.gstinTag}>GSTIN: 33AAAAA0000A1Z5</span>
          </div>

          <h1 className={styles.welcomeTitle}>Welcome back, Sri Venkatesh Industries!</h1>
          <p className={styles.heroDescription}>
            Get verified merchant offers for factory scrap, schedule pickups, and streamline industrial scrap disposal.
          </p>

          <div className={styles.heroActionRow}>
            <Link to="/industry/post-requirement" className={styles.primaryPostBtn}>
              <Plus size={18} />
              <span>Post New Requirement</span>
            </Link>

            <Link to="/industry/market-prices" className={styles.secondaryExploreBtn}>
              <TrendingUp size={16} />
              <span>Check Market Rates</span>
            </Link>
          </div>
        </div>

        <div className={styles.heroRightCard}>
          <div className={styles.quickStatBox}>
            <span className={styles.quickStatLabel}>Active Listings</span>
            <span className={styles.quickStatValue}>3 Requests</span>
            <span className={styles.quickStatSub}>Open for merchant quotes</span>
          </div>
          <div className={styles.quickStatDivider} />
          <div className={styles.quickStatBox}>
            <span className={styles.quickStatLabel}>Avg. Quote Response</span>
            <span className={styles.quickStatValue}>24 Mins</span>
            <span className={styles.quickStatSub}>By top verified merchants</span>
          </div>
        </div>
      </section>

      {/* 2. Top 5 Key Stats Strip */}
      <section className={styles.statsBar}>
        <div className={styles.statCard}>
          <div className={`${styles.statIconWrap} ${styles.iconYellow}`}>
            <ClipboardList size={22} />
          </div>
          <div className={styles.statContent}>
            <span className={styles.statLabel}>Active Requirements</span>
            <strong className={styles.statValue}>4</strong>
            <span className={styles.statSub}>Across 2 Factory Sites</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={`${styles.statIconWrap} ${styles.iconGreen}`}>
            <Sparkles size={22} />
          </div>
          <div className={styles.statContent}>
            <span className={styles.statLabel}>Quotes Received</span>
            <strong className={styles.statValue}>7</strong>
            <span className={styles.statSub}>From 5 Verified Buyers</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={`${styles.statIconWrap} ${styles.iconBlue}`}>
            <Truck size={22} />
          </div>
          <div className={styles.statContent}>
            <span className={styles.statLabel}>Scheduled Pickups</span>
            <strong className={styles.statValue}>1</strong>
            <span className={styles.statSub}>Tata 407 (Gate 2)</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={`${styles.statIconWrap} ${styles.iconGold}`}>
            <CheckCircle2 size={22} />
          </div>
          <div className={styles.statContent}>
            <span className={styles.statLabel}>Fulfilled Pickups</span>
            <strong className={styles.statValue}>28</strong>
            <span className={styles.statSub}>Lifetime Dispatched</span>
          </div>
        </div>
      </section>

      {/* 3. Main Dashboard Layout (70% Left Main + 30% Right Sidebar) */}
      <div className={styles.dashboardGrid}>
        {/* Left Column */}
        <div className={styles.leftCol}>
          {/* Card 1: Active Scrap Requirements */}
          <section className={styles.contentCard}>
            <div className={styles.cardHeaderRow}>
              <div>
                <h2 className={styles.cardTitle}>Active Scrap Requirements</h2>
                <p className={styles.cardSubtitle}>
                  Your open factory scrap listings currently receiving price offers from merchants.
                </p>
              </div>
              <Link to="/industry/requests" className={styles.viewAllLink}>
                <span>View All ({ACTIVE_REQUIREMENTS.length})</span>
                <ChevronRight size={14} />
              </Link>
            </div>

            <div className={styles.requirementsList}>
              {ACTIVE_REQUIREMENTS.map((req) => {
                const hasPhotos = req.photos && req.photos.length > 0;
                const coverPhoto = hasPhotos ? req.photos[0] : null;

                return (
                  <div key={req.id} className={styles.requirementRowCard}>
                    {/* PHOTO FRAME: ONLY GENUINE PHOTOS UPLOADED BY INDUSTRY */}
                    {hasPhotos && coverPhoto ? (
                      <div
                        className={styles.largeImgFrame}
                        onClick={() =>
                          setFloatingGallery({
                            photos: req.photos,
                            activeIndex: 0,
                            title: req.material,
                            condition: req.condition,
                            quantity: req.quantity,
                            location: '24, 5th Main Road, SIDCO Industrial Estate, Guindy, Chennai – 600032',
                          })
                        }
                        title="Click to view full photo gallery"
                      >
                        <img
                          src={coverPhoto}
                          alt={req.material}
                          className={styles.largeMaterialImg}
                        />
                        <div className={styles.photoCountPill}>
                          <Camera size={11} />
                          <span>{req.photos.length}</span>
                        </div>
                      </div>
                    ) : (
                      /* Clean Fallback for items listed WITHOUT photos */
                      <div className={styles.noPhotoFrame}>
                        <Camera size={20} className={styles.noPhotoIcon} />
                        <span className={styles.noPhotoTitle}>No Photo Attached</span>
                        <span className={styles.noPhotoSub}>Listed without photos</span>
                      </div>
                    )}

                    <div className={styles.reqDetailsCol}>
                      <div className={styles.reqTitleRow}>
                        <h3 className={styles.reqMaterialName}>{req.material}</h3>
                        {req.status === 'quotes_received' ? (
                          <span className={styles.badgeQuotesReceived}>
                            🎉 {req.quotesCount} Quotes Received
                          </span>
                        ) : req.status === 'awaiting_quotes' ? (
                          <span className={styles.badgeAwaiting}>
                            ⏳ Awaiting Offers
                          </span>
                        ) : (
                          <span className={styles.badgeSelected}>
                            ✓ Merchant Selected
                          </span>
                        )}
                      </div>

                      <div className={styles.reqMetaRow}>
                        <span><strong>Qty:</strong> {req.quantity}</span>
                        <span>•</span>
                        <span><strong>Posted:</strong> {req.postedDate}</span>
                        <span>•</span>
                        <span className={styles.locationSpan}>
                          <MapPin size={12} /> SIDCO Guindy, Chennai
                        </span>
                      </div>
                    </div>

                    <div className={styles.reqActionCol}>
                      {req.status === 'quotes_received' ? (
                        <>
                          <div className={styles.bestQuoteLabel}>
                            <span>Status:</span>
                            <strong>{req.quotesCount} Quotes Received</strong>
                          </div>
                          <Link to="/industry/quotes" className={styles.viewQuotesBtn}>
                            <span>Review Quotes ({req.quotesCount}) →</span>
                          </Link>
                        </>
                      ) : (
                        <Link to="/industry/requests" className={styles.trackRequestBtn}>
                          <span>View Details</span>
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Card 2: Recent Activity Timeline */}
          <section className={styles.contentCard}>
            <div className={styles.cardHeaderRow}>
              <div>
                <h2 className={styles.cardTitle}>Recent Activity</h2>
                <p className={styles.cardSubtitle}>
                  Real-time updates on offers, pickup schedules, and verified settlements.
                </p>
              </div>
            </div>

            <div className={styles.activityTimeline}>
              {RECENT_ACTIVITIES.map((act) => (
                <div key={act.id} className={styles.activityItem}>
                  <div
                    className={`${styles.activityDot} ${
                      act.iconColor === 'green'
                        ? styles.dotGreen
                        : act.iconColor === 'blue'
                        ? styles.dotBlue
                        : act.iconColor === 'gold'
                        ? styles.dotGold
                        : styles.dotYellow
                    }`}
                  />
                  <div className={styles.activityContent}>
                    <div className={styles.activityHeader}>
                      <strong className={styles.activityTitle}>{act.title}</strong>
                      <span className={styles.activityTime}>{act.time}</span>
                    </div>
                    <p className={styles.activityDesc}>{act.desc}</p>
                    <Link to={act.link} className={styles.activityLink}>
                      <span>View details</span>
                      <ArrowRight size={12} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column: Sidebar Panels */}
        <div className={styles.rightCol}>
          {/* Card 3: Live Market Price Benchmarks */}
          <section className={styles.contentCard}>
            <div className={styles.cardHeaderRow}>
              <div>
                <h3 className={styles.sidebarSectionTitle}>Live Industrial Scrap Rates</h3>
                <span className={styles.sidebarSectionSub}>Chennai Metal Trading Index</span>
              </div>
              <Link to="/industry/market-prices" className={styles.viewPricesLink}>
                <span>Explore All</span>
                <ChevronRight size={13} />
              </Link>
            </div>

            <div className={styles.marketTrendsList}>
              {TODAY_MARKET_TRENDS.map((item) => (
                <Link
                  key={item.id}
                  to="/industry/market-prices"
                  className={styles.trendRow}
                >
                  <div className={styles.trendImageWrapper}>
                    <img
                      src={item.image}
                      alt={item.name}
                      className={styles.trendScrapImg}
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = '/logo-icon.png';
                      }}
                    />
                  </div>

                  <div className={styles.trendLeft}>
                    <span className={styles.trendMaterialName}>{item.name}</span>
                    <div className={styles.trendPriceRow}>
                      <strong className={styles.trendPrice}>{item.price}</strong>
                    </div>
                  </div>

                  <div className={styles.trendRight}>
                    <span
                      className={`${styles.trendPill} ${
                        item.isUp ? styles.trendUp : styles.trendDown
                      }`}
                    >
                      {item.trend}
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            <div className={styles.marketPriceCtaBox}>
              <p className={styles.ctaBoxText}>
                Need customized enterprise pickup contracts for large continuous production turnover?
              </p>
              <Link to="/industry/post-requirement" className={styles.scheduleConsultBtn}>
                <span>Post Bulk Factory Lot</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </section>

          {/* Card 4: Factory Plant Compliance & Gate Rules */}
          <section className={styles.complianceCard}>
            <div className={styles.complianceHeader}>
              <Scale size={20} className={styles.complianceIcon} />
              <div>
                <h3 className={styles.complianceTitle}>Measurement Protocol</h3>
                <span className={styles.complianceSub}>Guindy Plant Security Gate 2</span>
              </div>
            </div>
            <ul className={styles.complianceList}>
              <li>✓ Calibration certified digital gross-tare weighing</li>
              <li>✓ Drivers must present valid Gate Pass OTP at security</li>
              <li>✓ Itemized digital slip uploaded instantly upon loading</li>
              <li>✓ Direct enterprise GST e-invoice settlement</li>
            </ul>
          </section>
        </div>
      </div>

      {/* 4. Multi-Photo Swipeable Modal for Industry-Uploaded Photos */}
      {floatingGallery && (
        <div
          className={styles.floatingImageOverlay}
          onClick={() => setFloatingGallery(null)}
        >
          <div
            className={styles.floatingImageCard}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className={styles.floatingImageHeader}>
              <div className={styles.floatingImageTitleBlock}>
                <h3 className={styles.floatingImageTitle}>{floatingGallery.title}</h3>
                <div className={styles.floatingImageTags}>
                  <span className={styles.floatingBadgeCondition}>{floatingGallery.condition} Condition</span>
                  <span className={styles.floatingBadgeQty}>{floatingGallery.quantity}</span>
                  <span className={styles.floatingBadgeSource}>Industry Uploaded Photos</span>
                </div>
              </div>

              <button
                type="button"
                className={styles.floatingCloseBtn}
                onClick={() => setFloatingGallery(null)}
                aria-label="Close Preview"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Gallery Body with Swipe Container & Navigation Arrows */}
            <div
              className={styles.floatingImageBody}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              {/* Previous Photo Button */}
              {floatingGallery.photos.length > 1 && (
                <button
                  type="button"
                  className={styles.carouselNavBtnPrev}
                  onClick={handlePrevPhoto}
                  title="Previous Photo (or Swipe Right / Left Arrow)"
                >
                  <ChevronLeft size={22} />
                </button>
              )}

              {/* Main Active Photo */}
              <div className={styles.mainPhotoWrapper}>
                <img
                  src={floatingGallery.photos[floatingGallery.activeIndex]}
                  alt={`${floatingGallery.title} - Photo ${floatingGallery.activeIndex + 1}`}
                  className={styles.floatingPreviewImg}
                />

                {/* Floating Counter Badge */}
                {floatingGallery.photos.length > 1 && (
                  <div className={styles.photoIndexBadge}>
                    <span>{floatingGallery.activeIndex + 1} / {floatingGallery.photos.length}</span>
                  </div>
                )}
              </div>

              {/* Next Photo Button */}
              {floatingGallery.photos.length > 1 && (
                <button
                  type="button"
                  className={styles.carouselNavBtnNext}
                  onClick={handleNextPhoto}
                  title="Next Photo (or Swipe Left / Right Arrow)"
                >
                  <ChevronRight size={22} />
                </button>
              )}
            </div>

            {/* Dot Indicator Track & Thumbnail Strip */}
            {floatingGallery.photos.length > 1 && (
              <div className={styles.carouselControlsRow}>
                {/* Dots */}
                <div className={styles.carouselDotsTrack}>
                  {floatingGallery.photos.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className={`${styles.carouselDot} ${
                        idx === floatingGallery.activeIndex ? styles.carouselDotActive : ''
                      }`}
                      onClick={() =>
                        setFloatingGallery((prev) =>
                          prev ? { ...prev, activeIndex: idx } : null
                        )
                      }
                      title={`Go to photo ${idx + 1}`}
                    />
                  ))}
                </div>

                {/* Thumbnail Strip */}
                <div className={styles.modalThumbStrip}>
                  {floatingGallery.photos.map((p, idx) => (
                    <div
                      key={idx}
                      className={`${styles.modalThumbWrap} ${
                        idx === floatingGallery.activeIndex ? styles.modalThumbActive : ''
                      }`}
                      onClick={() =>
                        setFloatingGallery((prev) =>
                          prev ? { ...prev, activeIndex: idx } : null
                        )
                      }
                    >
                      <img src={p} alt={`Thumbnail ${idx + 1}`} className={styles.modalThumbImg} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Modal Footer */}
            <div className={styles.floatingImageFooter}>
              <div className={styles.floatingDetailsGrid}>
                <div className={styles.floatingDetailItem}>
                  <span className={styles.floatingDetailLabel}>Factory Location</span>
                  <span className={styles.floatingDetailVal}>{floatingGallery.location}</span>
                </div>
                <div className={styles.floatingDetailItem}>
                  <span className={styles.floatingDetailLabel}>Inspection Rule</span>
                  <span className={styles.floatingDetailVal}>Measured on calibrated factory equipment</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
