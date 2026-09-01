import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  TrendingUp,
  Plus,
  Calendar,
  CheckCircle2,
  IndianRupee,
  Truck,
  Star,
  Send,
  Clock,
  ChevronRight,
  ChevronLeft,
  X,
  Eye,
  Maximize2,
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
  imageUrl: string;
  iconBg: string;
}

const LIVE_SCRAP_RATES: LiveScrapRateItem[] = [
  {
    id: 'COP_001',
    name: 'Copper Scrap',
    price: '₹720.00',
    unit: '/ kg',
    trend: '+1.8%',
    trendType: 'positive',
    imageUrl: '/scrap-copper.jpg',
    iconBg: '#FFF7ED',
  },
  {
    id: 'BRS_001',
    name: 'Brass Scrap',
    price: '₹490.00',
    unit: '/ kg',
    trend: '+1.5%',
    trendType: 'positive',
    imageUrl: '/scrap-brass.jpg',
    iconBg: '#FEFCE8',
  },
  {
    id: 'IRON_001',
    name: 'Scrap Iron',
    price: '₹42.00',
    unit: '/ kg',
    trend: '+2.5%',
    trendType: 'positive',
    imageUrl: '/scrap-iron.png',
    iconBg: '#F1F5F9',
  },
  {
    id: 'ALU_001',
    name: 'household aluminium',
    price: '₹135.00',
    unit: '/ kg',
    trend: '+2.1%',
    trendType: 'positive',
    imageUrl: '/scrap-household-aluminium.png',
    iconBg: '#F8FAFC',
  },
  {
    id: 'PLS_007',
    name: 'Mixed plastic',
    price: '₹18.00',
    unit: '/ kg',
    trend: '+0.5%',
    trendType: 'positive',
    imageUrl: '/scrap-mixed-plastic.png',
    iconBg: '#EFF6FF',
  },
  {
    id: 'CRD_001',
    name: 'carboard',
    price: '₹13.00',
    unit: '/ kg',
    trend: '+1.0%',
    trendType: 'positive',
    imageUrl: '/scrap-cardboard.png',
    iconBg: '#FEF3C7',
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
  const navigate = useNavigate();
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
    setIsBookModalOpen(false);
    navigate('/household/post-scrap');
  };

  return (
    <div className={styles.pageContainer}>
      {/* 1. HERO WELCOME SECTION (DARK GRAPHITE THEME) */}
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
            <Link to="/household/post-scrap" className={styles.primaryPostBtn}>
              <Plus size={16} />
              <span>Post Scrap</span>
            </Link>

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
        <div className={styles.rightSectionCol}>
          {/* 1. Market Prices */}
          <div className={styles.ratesSectionCard}>
            <div className={styles.ratesHeaderRow}>
              <div className={styles.ratesTitleGroup}>
                <h3 className={styles.ratesMainTitle}>Market Prices</h3>
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
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/logo.png';
                        }}
                      />
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

          {/* 2. Share Your Review Card */}
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
                aria-label="Close Lightbox"
              >
                <X size={20} />
              </button>
            </div>

            {/* Main Active Image Viewport */}
            <div className={styles.lightboxViewer}>
              <div className={styles.lightboxImageStage}>
                <img
                  src={selectedGalleryPickup.photos[activePhotoIndex]?.imageUrl}
                  alt={selectedGalleryPickup.photos[activePhotoIndex]?.title}
                  className={styles.lightboxMainImg}
                />

                {/* Arrow Nav Buttons */}
                {selectedGalleryPickup.photos.length > 1 && (
                  <>
                    <button
                      type="button"
                      className={`${styles.lightboxNavArrow} ${styles.lightboxNavPrev}`}
                      onClick={handlePrevPhoto}
                      title="Previous Photo"
                    >
                      <ChevronLeft size={22} />
                    </button>

                    <button
                      type="button"
                      className={`${styles.lightboxNavArrow} ${styles.lightboxNavNext}`}
                      onClick={handleNextPhoto}
                      title="Next Photo"
                    >
                      <ChevronRight size={22} />
                    </button>
                  </>
                )}
              </div>

              {/* Photo Description Metadata Caption Box */}
              <div className={styles.photoCaptionBox}>
                <div className={styles.captionTopRow}>
                  <span className={styles.photoIndexTag}>
                    PHOTO {activePhotoIndex + 1} OF {selectedGalleryPickup.photos.length}
                  </span>
                  <span className={styles.photoWeightBadge}>
                    {selectedGalleryPickup.photos[activePhotoIndex]?.weight}
                  </span>
                </div>

                <h4 className={styles.photoCaptionTitle}>
                  {selectedGalleryPickup.photos[activePhotoIndex]?.title}
                </h4>

                <p className={styles.photoRateInfo}>
                  {selectedGalleryPickup.photos[activePhotoIndex]?.rateInfo}
                </p>
              </div>
            </div>

            {/* Thumbnail Strip */}
            <div className={styles.lightboxThumbStrip}>
              {selectedGalleryPickup.photos.map((photo, idx) => (
                <div
                  key={photo.id}
                  className={`${styles.stripThumbCard} ${
                    idx === activePhotoIndex ? styles.stripThumbActive : ''
                  }`}
                  onClick={() => setActivePhotoIndex(idx)}
                >
                  <img
                    src={photo.imageUrl}
                    alt={photo.title}
                    className={styles.stripThumbImg}
                  />
                  <div className={styles.stripThumbLabel}>
                    <span className={styles.stripThumbWeight}>{photo.weight}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* QUICK POST SCRAP MODAL */}
      {isBookModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsBookModalOpen(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div>
                <h3 className={styles.modalTitle}>Post Doorstep Scrap</h3>
                <p className={styles.modalSubtitle}>
                  Schedule doorstep pickup with verified digital weighing
                </p>
              </div>
              <button
                type="button"
                className={styles.modalCloseBtn}
                onClick={() => setIsBookModalOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            {bookingSuccess ? (
              <div className={styles.bookingSuccessState}>
                <CheckCircle2 size={44} color="#10b981" />
                <h4 className={styles.successTitle}>Scrap Posted Successfully!</h4>
                <p className={styles.successDesc}>
                  Nearby verified scrap executives have been notified. You can track this in Orders.
                </p>
              </div>
            ) : (
              <form onSubmit={handleBookOrder} className={styles.modalForm}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Selected Scrap Material</label>
                  <input
                    type="text"
                    className={styles.formInput}
                    value={selectedMaterial}
                    onChange={(e) => setSelectedMaterial(e.target.value)}
                    required
                  />
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Approx Weight (KG)</label>
                    <input
                      type="number"
                      className={styles.formInput}
                      value={approxWeight}
                      onChange={(e) => setApproxWeight(e.target.value)}
                      placeholder="e.g. 15"
                      min="1"
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Preferred Date</label>
                    <input
                      type="date"
                      className={styles.formInput}
                      value={pickupDate}
                      onChange={(e) => setPickupDate(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Time Slot</label>
                  <select
                    className={styles.formSelect}
                    value={pickupSlot}
                    onChange={(e) => setPickupSlot(e.target.value)}
                  >
                    <option value="Morning (09:00 AM - 12:00 PM)">
                      Morning (09:00 AM - 12:00 PM)
                    </option>
                    <option value="Afternoon (12:00 PM - 04:00 PM)">
                      Afternoon (12:00 PM - 04:00 PM)
                    </option>
                    <option value="Evening (04:00 PM - 07:00 PM)">
                      Evening (04:00 PM - 07:00 PM)
                    </option>
                  </select>
                </div>

                <div className={styles.modalFooter}>
                  <button
                    type="button"
                    className={styles.modalCancelBtn}
                    onClick={() => setIsBookModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className={styles.modalSubmitBtn}>
                    <span>Schedule Pickup</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default HouseholdDashboard;
