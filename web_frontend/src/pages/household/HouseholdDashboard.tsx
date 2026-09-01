import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  TrendingUp,
  Plus,
  ArrowRight,
  Calendar,
  CheckCircle2,
  IndianRupee,
  Truck,
  Star,
  Send,
  Clock,
  MapPin,
  ChevronRight,
  ChevronLeft,
  X,
  Eye,
  Maximize2,
  Layers,
} from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import styles from './HouseholdDashboard.module.css';

interface LiveScrapRateItem {
  id: string;
  name: string;
  price: string;
  unit: string;
  trend: string;
  trendType: 'positive' | 'negative' | 'neutral';
  type: 'iron' | 'copper' | 'aluminum' | 'plastic' | 'cardboard' | 'brass';
  iconBg: string;
}

const LIVE_SCRAP_RATES: LiveScrapRateItem[] = [
  {
    id: 'rate-1',
    name: 'Scrap Iron (Heavy Melting Steel)',
    price: '₹38.50',
    unit: '/ kg',
    trend: '+1.8%',
    trendType: 'positive',
    type: 'iron',
    iconBg: '#F1F5F9',
  },
  {
    id: 'rate-2',
    name: 'Copper Scrap (Bright Wire)',
    price: '₹720.00',
    unit: '/ kg',
    trend: '+1.5%',
    trendType: 'positive',
    type: 'copper',
    iconBg: '#FFF7ED',
  },
  {
    id: 'rate-3',
    name: 'Commercial Aluminium Scrap',
    price: '₹135.00',
    unit: '/ kg',
    trend: '-0.8%',
    trendType: 'negative',
    type: 'aluminum',
    iconBg: '#F8FAFC',
  },
  {
    id: 'rate-4',
    name: 'HDPE Blue Chemical Drums',
    price: '₹380.00',
    unit: '/ pc',
    trend: '+2.1%',
    trendType: 'positive',
    type: 'plastic',
    iconBg: '#EFF6FF',
  },
  {
    id: 'rate-5',
    name: 'Corrugated Packaging Cartons',
    price: '₹14.50',
    unit: '/ kg',
    trend: '0.0%',
    trendType: 'neutral',
    type: 'cardboard',
    iconBg: '#FEF3C7',
  },
  {
    id: 'rate-6',
    name: 'Brass Honey Scrap',
    price: '₹460.00',
    unit: '/ kg',
    trend: '+1.2%',
    trendType: 'positive',
    type: 'brass',
    iconBg: '#FEFCE8',
  },
];

interface GalleryPhoto {
  id: string;
  title: string;
  imageUrl: string;
  weight: string;
  rateInfo: string;
}

interface ActivePickup {
  id: string;
  orderNumber: string;
  title: string;
  materialsCount: number;
  scheduledTime: string;
  executiveInfo: string;
  estimatedAmount: number;
  status: 'dispatched' | 'scheduled';
  coverImage: string;
  photos: GalleryPhoto[];
}

const ACTIVE_PICKUPS: ActivePickup[] = [
  {
    id: 'pk-1',
    orderNumber: 'SA123455',
    title: 'Iron Rods (8.4 KG) + Brass Fittings (1.0 KG) + Cardboard Stack (3.0 KG)',
    materialsCount: 3,
    scheduledTime: 'Today, 04:15 PM',
    executiveInfo: 'Driver Murugan (Tata 407 • TN 09 BX 4421)',
    estimatedAmount: 780,
    status: 'dispatched',
    coverImage: '/household-scrap-bundle.jpg',
    photos: [
      {
        id: 'p1-1',
        title: 'Household Scrap Bundle Overview',
        imageUrl: '/household-scrap-bundle.jpg',
        weight: 'Total ~12.4 KG',
        rateInfo: 'Complete staged scrap ready for vehicle loading',
      },
      {
        id: 'p1-2',
        title: 'Iron Rods & Construction Cutoffs',
        imageUrl: '/scrap-iron.jpg',
        weight: '8.4 KG',
        rateInfo: 'Benchmark Rate: ₹38.50 / KG • Subtotal: ₹323.40',
      },
      {
        id: 'p1-3',
        title: 'Brass Plumbing Taps & Fittings',
        imageUrl: '/scrap-brass.jpg',
        weight: '1.0 KG',
        rateInfo: 'Benchmark Rate: ₹460.00 / KG • Subtotal: ₹460.00',
      },
      {
        id: 'p1-4',
        title: 'Folded Corrugated Cardboard Boxes',
        imageUrl: '/scrap-cardboard.jpg',
        weight: '3.0 KG',
        rateInfo: 'Benchmark Rate: ₹14.50 / KG • Subtotal: ₹43.50',
      },
    ],
  },
  {
    id: 'pk-2',
    orderNumber: 'SA123454',
    title: 'Copper Coils (1.5 KG) + Old Newspapers & Cartons (17.2 KG)',
    materialsCount: 2,
    scheduledTime: 'Tomorrow, 10:00 AM • Slot 1',
    executiveInfo: 'Assigned: Karthik Raja (Eco Van)',
    estimatedAmount: 1250,
    status: 'scheduled',
    coverImage: '/copper-paper-scrap-bundle.jpg',
    photos: [
      {
        id: 'p2-1',
        title: 'Copper & Paper Recyclables Bundle',
        imageUrl: '/copper-paper-scrap-bundle.jpg',
        weight: 'Total ~18.7 KG',
        rateInfo: 'Complete staged scrap bundle with tied paper & copper coils',
      },
      {
        id: 'p2-2',
        title: 'Bright Electrical Copper Wire Coils',
        imageUrl: '/scrap-copper-wire.jpg',
        weight: '1.5 KG',
        rateInfo: 'Benchmark Rate: ₹720.00 / KG • Subtotal: ₹1,080.00',
      },
      {
        id: 'p2-3',
        title: 'Tied Newspaper & Magazine Stacks',
        imageUrl: '/scrap-mixed-papers.jpg',
        weight: '10.2 KG',
        rateInfo: 'Benchmark Rate: ₹12.50 / KG • Subtotal: ₹127.50',
      },
      {
        id: 'p2-4',
        title: 'Old School Notebooks & Packaging Cartons',
        imageUrl: '/scrap-notebook.jpg',
        weight: '7.0 KG',
        rateInfo: 'Benchmark Rate: ₹14.00 / KG • Subtotal: ₹98.00',
      },
    ],
  },
];

export function HouseholdDashboard() {
  const user = useAuthStore((s) => s.user);
  const displayName = user?.name || 'Ramesh Kumar';

  // Detail Vision Lightbox Gallery State
  const [selectedGalleryPickup, setSelectedGalleryPickup] = useState<ActivePickup | null>(null);
  const [activePhotoIndex, setActivePhotoIndex] = useState<number>(0);

  // Review State
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [submittedReview, setSubmittedReview] = useState(false);

  // Post Scrap Modal State
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState('Scrap Iron (Heavy Melting Steel)');
  const [approxWeight, setApproxWeight] = useState('15');
  const [pickupDate, setPickupDate] = useState('2025-05-15');
  const [pickupSlot, setPickupSlot] = useState('Morning (09:00 AM - 12:00 PM)');
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Lightbox Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedGalleryPickup) return;
      if (e.key === 'Escape') {
        setSelectedGalleryPickup(null);
      } else if (e.key === 'ArrowRight') {
        setActivePhotoIndex((prev) =>
          prev < selectedGalleryPickup.photos.length - 1 ? prev + 1 : 0
        );
      } else if (e.key === 'ArrowLeft') {
        setActivePhotoIndex((prev) =>
          prev > 0 ? prev - 1 : selectedGalleryPickup.photos.length - 1
        );
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedGalleryPickup]);

  const openPhotoGallery = (pickup: ActivePickup) => {
    setSelectedGalleryPickup(pickup);
    setActivePhotoIndex(0);
  };

  const handleNextPhoto = () => {
    if (!selectedGalleryPickup) return;
    setActivePhotoIndex((prev) =>
      prev < selectedGalleryPickup.photos.length - 1 ? prev + 1 : 0
    );
  };

  const handlePrevPhoto = () => {
    if (!selectedGalleryPickup) return;
    setActivePhotoIndex((prev) =>
      prev > 0 ? prev - 1 : selectedGalleryPickup.photos.length - 1
    );
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewText.trim()) return;
    setSubmittedReview(true);
    setTimeout(() => {
      setSubmittedReview(false);
      setReviewText('');
    }, 3500);
  };

  const handleBookOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingSuccess(true);
    setTimeout(() => {
      setBookingSuccess(false);
      setIsBookModalOpen(false);
    }, 2000);
  };

  const renderRateThumb = (type: string) => {
    switch (type) {
      case 'copper':
        return (
          <img
            src="/scrap-copper.jpg"
            alt="Copper Scrap"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        );
      case 'aluminum':
        return (
          <img
            src="/scrap-household-aluminium.jpg"
            alt="Aluminium Scrap"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        );
      case 'brass':
        return (
          <img
            src="/scrap-brass.jpg"
            alt="Brass Scrap"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        );
      case 'iron':
        return (
          <img
            src="/scrap-iron.jpg"
            alt="Iron Scrap"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        );
      case 'plastic':
        return (
          <img
            src="/scrap-plastic-barrel.jpg"
            alt="Plastic Scrap"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        );
      case 'cardboard':
      default:
        return (
          <img
            src="/scrap-cardboard.jpg"
            alt="Cardboard Scrap"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        );
    }
  };

  return (
    <div className={styles.pageContainer}>
      {/* 1. HERO WELCOME SECTION (DARK GRAPHITE THEME MATCHING INDUSTRY SCREENSHOT) */}
      <section className={styles.heroSection}>
        <div className={styles.heroLeftContent}>
          <div className={styles.enterpriseBadgeRow}>
            <span className={styles.enterpriseBadge}>
              <ShieldCheck size={14} className={styles.shieldIcon} />
              <span>VERIFIED HOUSEHOLD ACCOUNT</span>
            </span>
            <span className={styles.gstinTag}>PIN: 600040 • ANNA NAGAR, CHENNAI</span>
          </div>

          <h1 className={styles.welcomeTitle}>Welcome back, {displayName}!</h1>

          <p className={styles.heroDescription}>
            Get verified doorstep scrap pickup, digital weigh-scale accuracy, and instant spot UPI/Cash payment right from your doorstep.
          </p>

          <div className={styles.heroActionRow}>
            <button
              type="button"
              onClick={() => setIsBookModalOpen(true)}
              className={styles.primaryPostBtn}
            >
              <Plus size={16} />
              <span>Post Scrap</span>
            </button>

            <Link to="/household/rates" className={styles.secondaryRatesBtn}>
              <TrendingUp size={16} />
              <span>Check Market Rates</span>
            </Link>
          </div>
        </div>

        {/* Right Metric Highlights Box */}
        <div className={styles.heroMetricsCard}>
          <div className={styles.metricItem}>
            <span className={styles.metricLabel}>SCHEDULED PICKUPS</span>
            <span className={styles.metricValueGold}>1 Pickup</span>
            <span className={styles.metricSubtext}>Executive arriving today at 04:15 PM</span>
          </div>

          <div className={styles.metricDivider} />

          <div className={styles.metricItem}>
            <span className={styles.metricLabel}>TOTAL SCRAP RECYCLED</span>
            <span className={styles.metricValueWhite}>118.6 KG</span>
            <span className={styles.metricSubtext}>Across 12 completed pickups</span>
          </div>
        </div>
      </section>

      {/* 2. 4 KPI STATS CARDS ROW */}
      <section className={styles.statsGrid}>
        {/* Card 1 */}
        <div className={styles.statCard}>
          <div className={styles.statLeft}>
            <span className={styles.statLabel}>Active Pickups</span>
            <span className={styles.statNumber}>1</span>
            <span className={styles.statCaption}>Scheduled for Today</span>
          </div>
          <div className={`${styles.statIconCircle} ${styles.iconCircleGold}`}>
            <Calendar size={22} />
          </div>
        </div>

        {/* Card 2 */}
        <div className={styles.statCard}>
          <div className={styles.statLeft}>
            <span className={styles.statLabel}>Completed Pickups</span>
            <span className={styles.statNumber}>10</span>
            <span className={styles.statCaption}>Successfully recycled</span>
          </div>
          <div className={`${styles.statIconCircle} ${styles.iconCircleGreen}`}>
            <CheckCircle2 size={22} />
          </div>
        </div>

        {/* Card 3 */}
        <div className={styles.statCard}>
          <div className={styles.statLeft}>
            <span className={styles.statLabel}>Total Earned</span>
            <span className={styles.statNumber}>₹3,450</span>
            <span className={styles.statCaption}>Instant spot payments</span>
          </div>
          <div className={`${styles.statIconCircle} ${styles.iconCirclePurple}`}>
            <IndianRupee size={22} />
          </div>
        </div>

        {/* Card 4 */}
        <div className={styles.statCard}>
          <div className={styles.statLeft}>
            <span className={styles.statLabel}>Total Weight</span>
            <span className={styles.statNumber}>118.6 KG</span>
            <span className={styles.statCaption}>Diverted from landfills</span>
          </div>
          <div className={`${styles.statIconCircle} ${styles.iconCircleBlue}`}>
            <Truck size={22} />
          </div>
        </div>
      </section>

      {/* 3. TWO-COLUMN MAIN CONTENT SECTION */}
      <section className={styles.mainContentGrid}>
        {/* Left Column: Active Pickups */}
        <div className={styles.leftSectionCol}>
          {/* Active Scrap Pickups Card */}
          <div className={styles.sectionCard}>
            <div className={styles.sectionHeaderRow}>
              <div className={styles.sectionTitleGroup}>
                <h3 className={styles.sectionTitle}>Active Scrap Pickups</h3>
                <p className={styles.sectionSub}>
                  Your open doorstep scrap pickups with live executive tracking. Click photo for detailed vision.
                </p>
              </div>

              <Link to="/household/orders" className={styles.viewAllLink}>
                <span>View All (2)</span>
                <ChevronRight size={15} />
              </Link>
            </div>

            <div className={styles.pickupCardsList}>
              {ACTIVE_PICKUPS.map((pickup) => (
                <div key={pickup.id} className={styles.pickupItemCard}>
                  <div className={styles.pickupCardTop}>
                    {/* Interactive Photorealistic Thumbnail with Lightbox trigger */}
                    <div
                      className={styles.pickupThumbFrame}
                      onClick={() => openPhotoGallery(pickup)}
                      title="Click to open Detail Vision of all scrap photos"
                      role="button"
                      tabIndex={0}
                    >
                      <img
                        src={pickup.coverImage}
                        alt={pickup.title}
                        className={styles.pickupThumbImg}
                      />
                      <div className={styles.thumbOverlayIcon}>
                        <Maximize2 size={16} />
                      </div>
                      <span className={styles.thumbCountBadge}>+{pickup.materialsCount}</span>
                    </div>

                    <div className={styles.pickupCardInfo}>
                      <h4 className={styles.pickupTitle}>{pickup.title}</h4>

                      <div className={styles.statusPillRow}>
                        {pickup.status === 'dispatched' ? (
                          <span className={styles.statusBadgeGreen}>
                            <Truck size={13} />
                            <span>Vehicle Dispatched</span>
                          </span>
                        ) : (
                          <span className={styles.statusBadgeBlue}>
                            <Clock size={13} />
                            <span>Scheduled</span>
                          </span>
                        )}
                        <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700 }}>
                          {pickup.orderNumber}
                        </span>
                      </div>

                      <p className={styles.pickupScheduleText}>
                        <Clock size={13} color="#f59e0b" />
                        <span>{pickup.scheduledTime} • {pickup.executiveInfo}</span>
                      </p>
                    </div>
                  </div>

                  <div className={styles.pickupCardBottom}>
                    <div className={styles.cardActionBtns} style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', gap: '0.65rem' }}>
                      <button
                        type="button"
                        onClick={() => openPhotoGallery(pickup)}
                        className={styles.detailsOutlineBtn}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                      >
                        <Eye size={14} color="#f59e0b" />
                        <span>View Photos ({pickup.photos.length})</span>
                      </button>

                      <Link to="/household/orders" className={styles.trackGoldBtn}>
                        <Truck size={14} />
                        <span>Track Executive</span>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Household Market Prices Widget FIRST, then Share Your Review */}
        <div className={styles.rightSectionCol} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* 1. Household Market Prices */}
          <div className={styles.ratesSectionCard}>
            <div className={styles.ratesHeaderRow}>
              <div className={styles.ratesTitleGroup}>
                <h3 className={styles.ratesMainTitle}>Household Market Prices</h3>
                <p className={styles.ratesSubtitle}>Chennai Doorstep Scrap Rates</p>
              </div>

              <Link to="/household/rates" className={styles.exploreAllLink}>
                <span>Explore All</span>
                <ChevronRight size={15} />
              </Link>
            </div>

            <div className={styles.rateRowsList}>
              {LIVE_SCRAP_RATES.map((item) => (
                <div
                  key={item.id}
                  className={styles.rateRowCard}
                  onClick={() => {
                    setSelectedMaterial(item.name);
                    setIsBookModalOpen(true);
                  }}
                  role="button"
                  tabIndex={0}
                  title={`Click to post scrap for ${item.name}`}
                >
                  <div className={styles.rateRowLeft}>
                    <div className={styles.rateRowThumb} style={{ background: item.iconBg }}>
                      {renderRateThumb(item.type)}
                    </div>

                    <div className={styles.rateRowMeta}>
                      <h4 className={styles.rateRowName}>{item.name}</h4>
                      <p className={styles.rateRowPrice}>
                        {item.price}{' '}
                        <span style={{ fontSize: '0.74rem', color: '#059669', fontWeight: 600 }}>
                          {item.unit}
                        </span>
                      </p>
                    </div>
                  </div>

                  <span
                    className={[
                      styles.rateTrendBadge,
                      item.trendType === 'positive'
                        ? styles.trendGreen
                        : item.trendType === 'negative'
                        ? styles.trendRed
                        : styles.trendNeutral,
                    ].join(' ')}
                  >
                    {item.trend}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 2. Share Your Review Card (After Market Rates) */}
          <div className={styles.reviewCard}>
            <div className={styles.reviewHeader}>
              <h3 className={styles.reviewTitle}>
                <Star size={18} fill="#f59e0b" color="#f59e0b" />
                <span>Share Your Review</span>
              </h3>
              <p className={styles.reviewSubtitle}>
                We value your feedback! Let us know about your doorstep scrap selling experience.
              </p>
            </div>

            {/* 5-Star Rating Selector */}
            <div className={styles.starRatingRow}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className={`${styles.starBtn} ${
                    (hoverRating || rating) >= star ? styles.starActive : ''
                  }`}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  title={`${star} Star`}
                >
                  <Star
                    size={22}
                    fill={(hoverRating || rating) >= star ? '#f59e0b' : 'none'}
                    stroke="currentColor"
                  />
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmitReview}>
              <textarea
                className={styles.reviewTextarea}
                placeholder="Write your review here..."
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                rows={3}
              />

              <div className={styles.reviewActionRow}>
                <button type="submit" className={styles.submitReviewBtn}>
                  <Send size={14} />
                  <span>{submittedReview ? 'Review Submitted! ✨' : 'Submit Review'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* DETAIL VISION IMAGE GALLERY / LIGHTBOX MODAL */}
      {selectedGalleryPickup && (
        <div className={styles.lightboxOverlay} onClick={() => setSelectedGalleryPickup(null)}>
          <div className={styles.lightboxBox} onClick={(e) => e.stopPropagation()}>
            {/* Lightbox Header */}
            <div className={styles.lightboxHeader}>
              <div className={styles.lightboxTitleGroup}>
                <h3 className={styles.lightboxTitle}>
                  <span>Detail Vision • Scrap Photos</span>
                  <span className={styles.orderPillBadge}>{selectedGalleryPickup.orderNumber}</span>
                </h3>
                <p className={styles.lightboxSubtitle}>
                  High resolution verified scrap item photos uploaded for doorstep pickup collection
                </p>
              </div>

              <button
                type="button"
                className={styles.lightboxCloseBtn}
                onClick={() => setSelectedGalleryPickup(null)}
                title="Close Photo Viewer (ESC)"
              >
                <X size={20} />
              </button>
            </div>

            {/* Main Active Photo Viewport */}
            <div className={styles.lightboxMainStage}>
              <img
                src={selectedGalleryPickup.photos[activePhotoIndex]?.imageUrl}
                alt={selectedGalleryPickup.photos[activePhotoIndex]?.title}
                className={styles.lightboxActiveImg}
              />

              {/* Navigation Chevrons */}
              {selectedGalleryPickup.photos.length > 1 && (
                <>
                  <button
                    type="button"
                    className={`${styles.lightboxNavBtn} ${styles.navPrev}`}
                    onClick={handlePrevPhoto}
                    title="Previous Photo (Left Arrow)"
                  >
                    <ChevronLeft size={22} />
                  </button>

                  <button
                    type="button"
                    className={`${styles.lightboxNavBtn} ${styles.navNext}`}
                    onClick={handleNextPhoto}
                    title="Next Photo (Right Arrow)"
                  >
                    <ChevronRight size={22} />
                  </button>
                </>
              )}

              {/* Photo Counter Badge */}
              <div className={styles.lightboxImgCount}>
                {activePhotoIndex + 1} / {selectedGalleryPickup.photos.length}
              </div>

              {/* Caption Overlay */}
              <div className={styles.lightboxCaptionBar}>
                <h4 className={styles.captionItemName}>
                  {selectedGalleryPickup.photos[activePhotoIndex]?.title} ({selectedGalleryPickup.photos[activePhotoIndex]?.weight})
                </h4>
                <p className={styles.captionItemDetail}>
                  {selectedGalleryPickup.photos[activePhotoIndex]?.rateInfo}
                </p>
              </div>
            </div>

            {/* Thumbnail Strip Selector */}
            <div className={styles.lightboxThumbStrip}>
              {selectedGalleryPickup.photos.map((photo, idx) => (
                <div
                  key={photo.id}
                  className={`${styles.lightboxThumbItem} ${
                    activePhotoIndex === idx ? styles.lightboxThumbItemActive : ''
                  }`}
                  onClick={() => setActivePhotoIndex(idx)}
                  title={photo.title}
                >
                  <img src={photo.imageUrl} alt={photo.title} className={styles.lightboxThumbImg} />
                </div>
              ))}
            </div>

            {/* Lightbox Footer Bar */}
            <div className={styles.lightboxBottomBar}>
              <div className={styles.lightboxMetaCol}>
                <div>
                  <span style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'block' }}>ESTIMATED PAYOUT</span>
                  <span className={styles.lightboxPayoutText}>₹{selectedGalleryPickup.estimatedAmount.toLocaleString()}</span>
                </div>
                <div style={{ borderLeft: '1px solid #334155', paddingLeft: '1rem' }}>
                  <span style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'block' }}>EXECUTIVE ASSIGNED</span>
                  <span style={{ fontWeight: 700, color: '#f8fafc' }}>{selectedGalleryPickup.executiveInfo}</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Link
                  to="/household/orders"
                  className={styles.primaryPostBtn}
                  style={{ padding: '0.55rem 1.15rem', fontSize: '0.8rem' }}
                >
                  <Truck size={15} />
                  <span>Track Vehicle Live</span>
                </Link>
                <button
                  type="button"
                  onClick={() => setSelectedGalleryPickup(null)}
                  className={styles.secondaryRatesBtn}
                  style={{ padding: '0.55rem 1rem', fontSize: '0.8rem' }}
                >
                  Close Viewer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* POST SCRAP MODAL */}
      {isBookModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsBookModalOpen(false)}>
          <div className={styles.modalBox} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Post Scrap for Doorstep Pickup</h3>
              <button
                type="button"
                className={styles.closeBtn}
                onClick={() => setIsBookModalOpen(false)}
              >
                <X size={20} />
              </button>
            </div>

            {bookingSuccess ? (
              <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
                <CheckCircle2 size={54} color="#10b981" style={{ margin: '0 auto 1rem' }} />
                <h4 style={{ margin: '0 0 0.5rem', fontSize: '1.2rem', fontWeight: 800 }}>
                  Scrap Requirement Posted!
                </h4>
                <p style={{ color: '#64748b', fontSize: '0.88rem' }}>
                  Our verified executive will arrive on {pickupDate} ({pickupSlot}).
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleBookOrder}
                style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
              >
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      color: '#334155',
                      marginBottom: '0.35rem',
                    }}
                  >
                    Primary Scrap Material
                  </label>
                  <input
                    type="text"
                    value={selectedMaterial}
                    onChange={(e) => setSelectedMaterial(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.65rem',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      boxSizing: 'border-box',
                      fontWeight: 700,
                    }}
                  />
                </div>

                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      color: '#334155',
                      marginBottom: '0.35rem',
                    }}
                  >
                    Approximate Weight (KG)
                  </label>
                  <input
                    type="number"
                    value={approxWeight}
                    onChange={(e) => setApproxWeight(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.65rem',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      boxSizing: 'border-box',
                    }}
                    min="1"
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label
                      style={{
                        display: 'block',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        color: '#334155',
                        marginBottom: '0.35rem',
                      }}
                    >
                      Pickup Date
                    </label>
                    <input
                      type="date"
                      value={pickupDate}
                      onChange={(e) => setPickupDate(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.65rem',
                        borderRadius: '8px',
                        border: '1px solid #cbd5e1',
                        boxSizing: 'border-box',
                      }}
                      required
                    />
                  </div>

                  <div>
                    <label
                      style={{
                        display: 'block',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        color: '#334155',
                        marginBottom: '0.35rem',
                      }}
                    >
                      Time Slot
                    </label>
                    <select
                      value={pickupSlot}
                      onChange={(e) => setPickupSlot(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.65rem',
                        borderRadius: '8px',
                        border: '1px solid #cbd5e1',
                      }}
                    >
                      <option>Morning (09:00 AM - 12:00 PM)</option>
                      <option>Afternoon (01:00 PM - 04:00 PM)</option>
                      <option>Evening (04:00 PM - 07:00 PM)</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className={styles.primaryPostBtn}
                  style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}
                >
                  Submit Post Scrap
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default HouseholdDashboard;
