import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  ClipboardList,
  Plus,
  Search,
  Filter,
  MapPin,
  Calendar,
  Clock,
  FileText,
  ChevronRight,
  ChevronLeft,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Eye,
  X,
  Info,
  Camera,
  ImageOff,
  Layers,
} from 'lucide-react';
import styles from './IndustryMyRequests.module.css';

interface IndustryScrapRequest {
  id: string;
  requestId: string;
  material: string;
  category: string;
  quantity: string;
  condition: string;
  location: string;
  postedDate: string;
  preferredPickupDate: string;
  preferredTimeSlot: string;
  status: 'quotes_received' | 'awaiting_quotes' | 'closed';
  quotesCount: number;
  bestQuote?: number; // Only actual real bids received, NO speculative pre-billing estimates
  photos: string[]; // Genuine photos uploaded by the industry
}

const MY_REQUESTS_DATA: IndustryScrapRequest[] = [
  {
    id: 'req-1',
    requestId: 'REQ-250513-00078',
    material: 'Steel Turnings & Lathe Chips (650 KG) + Armored Copper Cables (180 KG)',
    category: 'Multi-Material Truck Visit',
    quantity: '2 Materials (~830 KG)',
    condition: 'Mixed & Clean',
    location: 'Gate 2, SIDCO Industrial Estate, Guindy, Chennai – 600032',
    postedDate: 'Today, 09:30 AM',
    preferredPickupDate: '16 May 2025 (Friday)',
    preferredTimeSlot: '10:00 AM – 12:00 PM',
    status: 'quotes_received',
    quotesCount: 3,
    bestQuote: 151600,
    photos: ['/industry-steel-scrap.jpg', '/industry-copper-scrap.jpg', '/industry-aluminium-scrap.jpg'],
  },
  {
    id: 'req-2',
    requestId: 'REQ-250512-00065',
    material: 'Aluminium Architectural Extrusions & Profile Cutoffs (400 KG)',
    category: 'Aluminium Scrap',
    quantity: '400 KG Bundled',
    condition: 'Clean & Sorted',
    location: 'Phase 2, Ambattur Industrial Estate, Chennai – 600058',
    postedDate: 'Yesterday, 04:20 PM',
    preferredPickupDate: '18 May 2025 (Sunday)',
    preferredTimeSlot: '09:00 AM – 12:00 PM',
    status: 'awaiting_quotes',
    quotesCount: 0,
    photos: ['/industry-aluminium-scrap.jpg', '/industry-steel-scrap.jpg'],
  },
  {
    id: 'req-3',
    requestId: 'REQ-250511-00049',
    material: 'Corrugated Packaging Boxes & Production Cardboard (850 KG)',
    category: 'Paper Scrap',
    quantity: '850 KG Baled',
    condition: 'Clean & Baled',
    location: 'Gate 1, SIDCO Industrial Estate, Guindy, Chennai – 600032',
    postedDate: '11 May 2025',
    preferredPickupDate: '11 May 2025 (Dispatched)',
    preferredTimeSlot: '09:00 AM – 11:00 AM',
    status: 'closed',
    quotesCount: 4,
    bestQuote: 12760,
    photos: [], // Industry listed without photos
  },
];

export default function IndustryMyRequests() {
  const [requests, setRequests] = useState<IndustryScrapRequest[]>(MY_REQUESTS_DATA);
  const [activeFilter, setActiveFilter] = useState<'All' | 'quotes_received' | 'awaiting_quotes' | 'closed'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Swipeable lightbox modal state
  const [floatingGallery, setFloatingGallery] = useState<{
    photos: string[];
    activeIndex: number;
    title: string;
    condition: string;
    quantity: string;
    location: string;
  } | null>(null);

  // Swipe gesture tracking
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // Keyboard arrow listener for swipe/gallery navigation
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
        // Swiped Left -> Next
        handleNextPhoto();
      } else if (diff < -45) {
        // Swiped Right -> Prev
        handlePrevPhoto();
      }
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  const filteredRequests = requests.filter((req) => {
    const matchesFilter = activeFilter === 'All' || req.status === activeFilter;
    const matchesSearch =
      req.material.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.requestId.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className={styles.pageContainer}>
      {/* 1. Top Header Banner */}
      <div className={styles.headerBanner}>
        <div className={styles.headerTitleGroup}>
          <div className={styles.headerBadge}>
            <Sparkles size={13} fill="#0f172a" />
            <span>POSTED REQUIREMENTS TRACKER</span>
          </div>
          <h1 className={styles.pageTitle}>My Scrap Requests</h1>
          <p className={styles.pageSubtitle}>
            Track all active factory scrap listings, review merchant quote response times, and manage open pickup requests.
          </p>
        </div>

        <Link to="/industry/post-requirement" className={styles.postMoreBtn}>
          <Plus size={16} />
          <span>Post New Scrap</span>
        </Link>
      </div>

      {/* 2. Filter Tabs & Search Bar */}
      <div className={styles.filterStrip}>
        <div className={styles.tabsRow}>
          <button
            type="button"
            className={`${styles.tabBtn} ${activeFilter === 'All' ? styles.tabBtnActive : ''}`}
            onClick={() => setActiveFilter('All')}
          >
            All Requests ({requests.length})
          </button>

          <button
            type="button"
            className={`${styles.tabBtn} ${activeFilter === 'quotes_received' ? styles.tabBtnActive : ''}`}
            onClick={() => setActiveFilter('quotes_received')}
          >
            🎉 Quotes Received ({requests.filter((r) => r.status === 'quotes_received').length})
          </button>

          <button
            type="button"
            className={`${styles.tabBtn} ${activeFilter === 'awaiting_quotes' ? styles.tabBtnActive : ''}`}
            onClick={() => setActiveFilter('awaiting_quotes')}
          >
            ⏳ Awaiting Offers ({requests.filter((r) => r.status === 'awaiting_quotes').length})
          </button>

          <button
            type="button"
            className={`${styles.tabBtn} ${activeFilter === 'closed' ? styles.tabBtnActive : ''}`}
            onClick={() => setActiveFilter('closed')}
          >
            ✓ Fulfilled / Closed ({requests.filter((r) => r.status === 'closed').length})
          </button>
        </div>

        <div className={styles.searchBox}>
          <Search size={15} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search material or request ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>
      </div>

      {/* 3. Requests Cards List */}
      <div className={styles.requestsGrid}>
        {filteredRequests.map((req) => {
          const hasPhotos = req.photos && req.photos.length > 0;
          const coverPhoto = hasPhotos ? req.photos[0] : null;

          return (
            <div
              key={req.id}
              className={`${styles.requestCard} ${
                req.status === 'quotes_received'
                  ? styles.cardQuotesReceived
                  : req.status === 'awaiting_quotes'
                  ? styles.cardAwaitingQuotes
                  : styles.cardFulfilled
              }`}
            >
              <div className={styles.cardHeader}>
                <div className={styles.reqIdCol}>
                  <strong className={styles.reqIdText}>{req.requestId}</strong>
                  <span className={styles.categoryBadge}>{req.category}</span>
                  <span className={styles.condBadge}>{req.condition}</span>
                </div>

                {/* Status Badge */}
                {req.status === 'quotes_received' ? (
                  <span className={styles.badgeQuotesReceived}>
                    🎉 {req.quotesCount} Merchant Quotes
                  </span>
                ) : req.status === 'awaiting_quotes' ? (
                  <span className={styles.badgeAwaiting}>
                    ⏳ Awaiting Merchant Offers
                  </span>
                ) : (
                  <span className={styles.badgeClosed}>
                    ✓ Order Dispatched &amp; Closed
                  </span>
                )}
              </div>

              <div className={styles.cardBodyRow}>
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
                        location: req.location,
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
                    <Camera size={22} className={styles.noPhotoIcon} />
                    <span className={styles.noPhotoTitle}>No Photo Attached</span>
                    <span className={styles.noPhotoSub}>Listed without photos</span>
                  </div>
                )}

                <div className={styles.reqInfoCol}>
                  <h3 className={styles.materialName}>{req.material}</h3>

                  <div className={styles.metaRow}>
                    <span>Quantity: <strong>{req.quantity}</strong></span>
                    <span>•</span>
                    <span>Posted: <strong>{req.postedDate}</strong></span>
                    {hasPhotos && (
                      <>
                        <span>•</span>
                        <span className={styles.photoCountTag}>
                          📸 {req.photos.length} Photo{req.photos.length > 1 ? 's Attached' : ' Attached'}
                        </span>
                      </>
                    )}
                  </div>

                  <div className={styles.scheduleRow}>
                    <Calendar size={13} className={styles.iconGold} />
                    <span>Preferred Slot: {req.preferredPickupDate} ({req.preferredTimeSlot})</span>
                  </div>

                  <div className={styles.locationRow}>
                    <MapPin size={13} className={styles.iconGold} />
                    <span>{req.location}</span>
                  </div>
                </div>

                {/* Right Action Column: ZERO PREMATURE TOTAL AMOUNTS */}
                <div className={styles.rightActionCol}>
                  {req.status === 'quotes_received' ? (
                    <>
                      <div className={styles.bestOfferBox}>
                        <span className={styles.bestOfferLabel}>Merchant Responses</span>
                        <span className={styles.quotesReceivedCountText}>
                          {req.quotesCount} Verified Quotes Ready
                        </span>
                      </div>

                      <Link to="/industry/quotes" className={styles.compareBidsBtn}>
                        <span>Review &amp; Compare Rates →</span>
                      </Link>
                    </>
                  ) : req.status === 'awaiting_quotes' ? (
                    <div className={styles.awaitingBox}>
                      <Clock size={16} className={styles.clockIcon} />
                      <div>
                        <strong className={styles.awaitingTitle}>Awaiting Merchant Offers</strong>
                        <p className={styles.awaitingSub}>
                          Itemized rates will be submitted by verified merchants once they review your listed items.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className={styles.closedActionBox}>
                      <div className={styles.settledAmountBox}>
                        <span className={styles.settledLabel}>Dispatched &amp; Measured</span>
                        <span className={styles.settledStatusTag}>✓ Measurement Verified</span>
                      </div>
                      <Link to="/industry/transactions" className={styles.viewOrderBtn}>
                        <span>View Settlement Ledger</span>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
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
