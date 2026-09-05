import { useState, useEffect, useRef, useCallback } from 'react';
import {
  ShieldCheck,
  Eye,
  MessageCircle,
  ShoppingBag,
  Search,
  MapPin,
  Heart,
  Info,
  ChevronLeft,
  ChevronRight,
  Camera,
  FileEdit,
  Tag,
  Plus,
  CheckCircle2,
  Sparkles,
  RefreshCw,
  X,
  Phone,
  MessageSquare,
  TrendingUp,
  ClipboardList,
} from 'lucide-react';
import AddProductModal from './AddProductModal';
import ProductRequestsModal from './ProductRequestsModal';
import {
  getPendingRequestsCount,
  getProductRequests,
  subscribeProductRequests,
} from '@/services/merchantProductRequestsService';
import styles from './MerchantReusableProducts.module.css';

export interface ProductItem {
  id: string;
  name: string;
  category: string;
  categoryIcon: string;
  location: string;
  price: string;
  stockText: string;
  isLowStock?: boolean;
  status: 'Active' | 'Low Stock';
  image: string;
  description?: string;
  address?: string;
  contactNumber?: string;
  allowMessages?: boolean;
  quantity?: number;
}

const PRODUCTS_DATA: ProductItem[] = [
  {
    id: 'prod-1',
    name: 'Hero Sprint Cycle',
    category: 'Cycles',
    categoryIcon: '🚲',
    location: 'Guindy, Chennai',
    price: '₹3,500',
    stockText: 'In Stock',
    status: 'Active',
    image: '/scrap-battery.png',
  },
  {
    id: 'prod-2',
    name: 'ABB Electric Motor',
    category: 'Motors',
    categoryIcon: '⚙️',
    location: 'Ambattur, Chennai',
    price: '₹12,000',
    stockText: 'In Stock',
    status: 'Active',
    image: '/scrap-cpu.png',
  },
  {
    id: 'prod-3',
    name: 'Iron Gate (6ft x 4ft)',
    category: 'Gates',
    categoryIcon: '🚪',
    location: 'Padi, Chennai',
    price: '₹8,500',
    stockText: 'Only 2 left',
    isLowStock: true,
    status: 'Low Stock',
    image: '/scrap-iron.png',
  },
  {
    id: 'prod-4',
    name: 'Diesel Engine 5HP',
    category: 'Engines',
    categoryIcon: '🔧',
    location: 'Thirumullaivoyal, Chennai',
    price: '₹18,000',
    stockText: 'In Stock',
    status: 'Active',
    image: '/scrap-burned-copper.png',
  },
  {
    id: 'prod-5',
    name: 'Heavy Duty Rack',
    category: 'Furniture & Fixtures',
    categoryIcon: '📦',
    location: 'Guindy, Chennai',
    price: '₹6,500',
    stockText: 'In Stock',
    status: 'Active',
    image: '/scrap-quality-steel.png',
  },
  {
    id: 'prod-6',
    name: 'Wooden Pallets',
    category: 'Pallets',
    categoryIcon: '🪵',
    location: 'Ambattur, Chennai',
    price: '₹450 / Piece',
    stockText: 'In Stock',
    status: 'Active',
    image: '/scrap-plastic-pallet.png',
  },
  {
    id: 'prod-7',
    name: 'Voltas AC 1.5 Ton',
    category: 'AC & Cooling',
    categoryIcon: '❄️',
    location: 'Padi, Chennai',
    price: '₹15,000',
    stockText: 'Only 1 left',
    isLowStock: true,
    status: 'Low Stock',
    image: '/scrap-ac.png',
  },
  {
    id: 'prod-8',
    name: 'Brass Valves Set',
    category: 'Industrial Parts',
    categoryIcon: '🔩',
    location: 'Thirumullaivoyal, Chennai',
    price: '₹2,200',
    stockText: 'In Stock',
    status: 'Active',
    image: '/scrap-brass.png',
  },
];

const CATEGORIES_DATA = [
  { name: 'All Categories', count: 32 },
  { name: 'Cycles', count: 5 },
  { name: 'Motors', count: 6 },
  { name: 'Gates', count: 3 },
  { name: 'Engines', count: 4 },
  { name: 'AC & Cooling', count: 2 },
  { name: 'Industrial Parts', count: 7 },
  { name: 'Furniture & Fixtures', count: 3 },
  { name: 'Pallets', count: 2 },
];

export default function MerchantReusableProducts() {
  const [products, setProducts] = useState<ProductItem[]>(PRODUCTS_DATA);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [availabilityFilter, setAvailabilityFilter] = useState<'All' | 'In Stock' | 'Low Stock'>('All');
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [activePage, setActivePage] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [detailsProduct, setDetailsProduct] = useState<ProductItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showHowItWorks, setShowHowItWorks] = useState(true);
  const [activeStatDot, setActiveStatDot] = useState(0);
  const [isRequestsOpen, setIsRequestsOpen] = useState(false);
  const [selectedRequestIdForModal, setSelectedRequestIdForModal] = useState<string | null>(null);
  const [pendingRequestsCount, setPendingRequestsCount] = useState<number>(() =>
    getPendingRequestsCount()
  );
  const statsTrackRef = useRef<HTMLDivElement>(null);
  const performanceSectionRef = useRef<HTMLElement>(null);
  const isScrollingToTopRef = useRef(false);

  useEffect(() => {
    const unsub = subscribeProductRequests(() => {
      setPendingRequestsCount(getPendingRequestsCount());
    });
    return () => unsub();
  }, []);

  // Auto-close "How It Works" box with a smooth transition when the merchant scrolls past the performance box
  useEffect(() => {
    if (!showHowItWorks) return;

    let ticking = false;

    const handleScroll = () => {
      if (isScrollingToTopRef.current) return;

      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (performanceSectionRef.current) {
            const rect = performanceSectionRef.current.getBoundingClientRect();
            // When the user scrolls down past the performance section (rect.top <= 100 with scrollY > 80)
            if (rect.top <= 100 && window.scrollY > 80) {
              setShowHowItWorks(false);
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [showHowItWorks]);

  const handleToggleHowItWorks = () => {
    setShowHowItWorks((prev) => {
      const next = !prev;
      // If opening and user is scrolled down, smoothly scroll to top so the drawer is visible
      if (next && window.scrollY > 120) {
        isScrollingToTopRef.current = true;
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setTimeout(() => {
          isScrollingToTopRef.current = false;
        }, 650);
      }
      return next;
    });
  };

  const handleStatsScroll = useCallback(() => {
    if (!statsTrackRef.current) return;
    const track = statsTrackRef.current;
    const { scrollLeft } = track;
    const cards = track.children;
    if (cards.length > 0) {
      let closestIdx = 0;
      let minDiff = Infinity;
      for (let i = 0; i < cards.length; i++) {
        const card = cards[i] as HTMLElement;
        const diff = Math.abs(card.offsetLeft - track.offsetLeft - scrollLeft);
        if (diff < minDiff) {
          minDiff = diff;
          closestIdx = i;
        }
      }
      setActiveStatDot(Math.min(Math.max(closestIdx, 0), cards.length - 1));
    }
  }, []);

  const scrollToStatCard = (index: number) => {
    if (!statsTrackRef.current) return;
    const track = statsTrackRef.current;
    const cards = track.children;
    if (cards[index]) {
      const targetCard = cards[index] as HTMLElement;
      track.scrollTo({
        left: targetCard.offsetLeft - track.offsetLeft,
        behavior: 'smooth',
      });
      setActiveStatDot(index);
    }
  };

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handlePublishNewProduct = (newProduct: ProductItem) => {
    setProducts((prev) => [newProduct, ...prev]);
    triggerToast('✓ Product listed successfully! Visible to interested buyers.');
  };

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === 'All Categories' || product.category.includes(selectedCategory);
    const matchesAvailability =
      availabilityFilter === 'All' ||
      (availabilityFilter === 'In Stock' && product.status === 'Active') ||
      (availabilityFilter === 'Low Stock' && product.status === 'Low Stock');

    return matchesSearch && matchesCategory && matchesAvailability;
  });

  // Lock background screen scroll when modal is open
  useEffect(() => {
    if (detailsProduct || isAddModalOpen) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [detailsProduct, isAddModalOpen]);

  return (
    <div className={styles.pageContainer}>
      {/* Success Toast Banner */}
      {toastMessage && (
        <div className={styles.toastBanner}>
          <CheckCircle2 size={18} className={styles.toastIcon} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. Page Header: Compact headline on left, How It Works button on top right */}
      <div className={styles.headerRow}>
        <div className={styles.headerLeft}>
          <div className={styles.animatedHeaderBadge} title="Reusable Circular Marketplace">
            <div className={styles.pulseRing} />
            <RefreshCw size={18} className={styles.spinIcon} />
          </div>
          <div className={styles.titleGroup}>
            <h1 className={styles.pageTitle}>Reusable Products</h1>
            <p className={styles.pageSubtitle}>
              Direct marketplace for reusable goods &amp; machinery.
            </p>
          </div>
        </div>

        <button
          type="button"
          className={styles.infoToggleBtn}
          onClick={handleToggleHowItWorks}
          aria-expanded={showHowItWorks}
          aria-label="Toggle How it works information"
        >
          <Info size={14} />
          <span>How It Works</span>
        </button>
      </div>

      {/* 2. How It Works Drawer (Shown ABOVE the Add New Product button with smooth collapse) */}
      <div
        className={`${styles.howItWorksWrapper} ${
          !showHowItWorks ? styles.howItWorksWrapperCollapsed : ''
        }`}
        aria-hidden={!showHowItWorks}
      >
        <div className={styles.howItWorksInner}>
          <div className={styles.howItWorksDrawer} role="region" aria-label="How it works guide">
            <div className={styles.howStepsGrid}>
              <div className={styles.howStepCol}>
                <span className={styles.howStepNum}>01</span>
                <div className={styles.howStepContent}>
                  <h4 className={styles.howStepTitle}>List Your Items</h4>
                  <p className={styles.howStepDesc}>
                    Upload photos, price, and condition for reusable machinery, motors, parts, or scrap metal fixtures.
                  </p>
                </div>
              </div>
              <div className={styles.howStepCol}>
                <span className={styles.howStepNum}>02</span>
                <div className={styles.howStepContent}>
                  <h4 className={styles.howStepTitle}>Direct Buyer Inquiries</h4>
                  <p className={styles.howStepDesc}>
                    Receive calls, direct inquiries, and voice notes from verified local buyers and workshops.
                  </p>
                </div>
              </div>
              <div className={styles.howStepCol}>
                <span className={styles.howStepNum}>03</span>
                <div className={styles.howStepContent}>
                  <h4 className={styles.howStepTitle}>Close & Earn More</h4>
                  <p className={styles.howStepDesc}>
                    Sell at high reusable market margins instead of basic melting scrap metal rates.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Action Buttons Section: + Add New Product & Product Requests Button Below */}
      <div className={styles.actionButtonsCol}>
        <div className={styles.actionRow}>
          <button
            type="button"
            className={styles.headerAddBtn}
            onClick={() => setIsAddModalOpen(true)}
          >
            <Plus size={16} />
            <span>Add New Product</span>
          </button>
        </div>

        {/* Dedicated Product Requests Button Below Add New Product */}
        <button
          type="button"
          className={styles.productRequestsBannerBtn}
          onClick={() => {
            setSelectedRequestIdForModal(null);
            setIsRequestsOpen(true);
          }}
          aria-label={`Product Requests (${pendingRequestsCount} pending)`}
        >
          <div className={styles.requestsBtnLeft}>
            <div className={styles.requestsBtnIcon}>
              <ClipboardList size={18} />
            </div>
            <span className={styles.requestsBtnTitle}>Product Requests</span>
          </div>

          <div className={styles.requestsBtnRight}>
            {pendingRequestsCount > 0 ? (
              <span className={styles.requestsBtnBadge}>
                <span className={styles.requestsBadgePulse} />
                {pendingRequestsCount} Pending
              </span>
            ) : (
              <span className={styles.requestsBtnBadgeZero}>
                View Requests
              </span>
            )}
            <ChevronRight size={16} className={styles.requestsBtnChevron} />
          </div>
        </button>
      </div>

      {/* 4. Horizontal Scrollable Performance Cards (Swipeable Carousel on mobile, 4-col grid on desktop) */}
      <section
        ref={performanceSectionRef}
        className={styles.statsSectionWrapper}
        aria-label="Performance metrics"
      >
        <div
          className={styles.statsCarouselTrack}
          ref={statsTrackRef}
          onScroll={handleStatsScroll}
        >
          <div className={styles.statCard}>
            <div className={styles.statCardTopRow}>
              <div className={styles.statSquircleIcon}>
                <ShieldCheck size={18} strokeWidth={2.4} />
              </div>
              <div className={styles.statTopRightBadge}>
                <CheckCircle2 size={12} strokeWidth={2.4} />
                <span>Active</span>
              </div>
            </div>
            <div className={styles.statCardValueGroup}>
              <span className={styles.statBigValue}>32</span>
              <h3 className={styles.statCardTitle}>Total Products</h3>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statCardTopRow}>
              <div className={styles.statSquircleIcon}>
                <Eye size={18} strokeWidth={2.4} />
              </div>
              <div className={styles.statTopRightBadge}>
                <TrendingUp size={12} strokeWidth={2.4} />
                <span>+18% Views</span>
              </div>
            </div>
            <div className={styles.statCardValueGroup}>
              <span className={styles.statBigValue}>1,245</span>
              <h3 className={styles.statCardTitle}>Total Views</h3>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statCardTopRow}>
              <div className={styles.statSquircleIcon}>
                <MessageCircle size={18} strokeWidth={2.4} />
              </div>
              <div className={styles.statTopRightBadge}>
                <span>This Month</span>
              </div>
            </div>
            <div className={styles.statCardValueGroup}>
              <span className={styles.statBigValue}>86</span>
              <h3 className={styles.statCardTitle}>Total Inquiries</h3>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statCardTopRow}>
              <div className={styles.statSquircleIcon}>
                <ShoppingBag size={18} strokeWidth={2.4} />
              </div>
              <div className={styles.statTopRightBadge}>
                <CheckCircle2 size={12} strokeWidth={2.4} />
                <span>18 Sold</span>
              </div>
            </div>
            <div className={styles.statCardValueGroup}>
              <span className={styles.statBigValue}>18</span>
              <h3 className={styles.statCardTitle}>Total Sales</h3>
            </div>
          </div>
        </div>

        {/* Mobile Stats Dots Indicator */}
        <div className={styles.statsIndicatorDotsRow}>
          {[0, 1, 2, 3].map((dotIdx) => (
            <button
              key={dotIdx}
              type="button"
              className={`${styles.statIndicatorDot} ${activeStatDot === dotIdx ? styles.statIndicatorDotActive : ''}`}
              onClick={() => scrollToStatCard(dotIdx)}
              aria-label={`Go to stat card ${dotIdx + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Two-Column Layout (Main Product Grid 72% + Right Sidebar 28%) */}
      <div className={styles.reusableLayoutGrid}>
        {/* Main Column */}
        <section className={styles.mainCol}>
          {/* Filters Bar */}
          <div className={styles.filterCard}>
            <div className={styles.searchBox}>
              <Search size={16} color="#94a3b8" />
              <input
                type="text"
                placeholder="Search by product name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={styles.searchInput}
              />
            </div>

            <div className={styles.filterTabsRow}>
              <button
                type="button"
                className={`${styles.filterTabBtn} ${availabilityFilter === 'All' ? styles.filterTabBtnActive : ''}`}
                onClick={() => setAvailabilityFilter('All')}
              >
                <span>All</span>
                <span className={styles.filterCountBadge}>{products.length}</span>
              </button>

              <button
                type="button"
                className={`${styles.filterTabBtn} ${availabilityFilter === 'In Stock' ? styles.filterTabBtnActive : ''}`}
                onClick={() => setAvailabilityFilter('In Stock')}
              >
                <span>In Stock</span>
                <span className={styles.filterCountBadge}>
                  {products.filter((p) => p.status === 'Active').length}
                </span>
              </button>

              <button
                type="button"
                className={`${styles.filterTabBtn} ${availabilityFilter === 'Low Stock' ? styles.filterTabBtnActive : ''}`}
                onClick={() => setAvailabilityFilter('Low Stock')}
              >
                <span>Low Stock</span>
                <span className={styles.filterCountBadge}>
                  {products.filter((p) => p.status === 'Low Stock').length}
                </span>
              </button>
            </div>
          </div>

          {/* Product Grid (4 columns × 2 rows = 8 products) */}
          <div className={styles.productsGrid}>
            {filteredProducts.map((product) => (
              <article key={product.id} className={styles.productCard}>
                <div className={styles.cardImageWrapper}>
                  <img
                    src={product.image}
                    alt={product.name}
                    className={styles.productImg}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/logo.png';
                    }}
                  />

                  {/* Status Badge Top-Left */}
                  <span
                    className={
                      product.status === 'Active' ? styles.badgeActive : styles.badgeLowStock
                    }
                  >
                    {product.status}
                  </span>

                  {/* Favorite Button Top-Right */}
                  <button
                    type="button"
                    className={`${styles.favoriteBtn} ${
                      favorites[product.id] ? styles.favoriteActive : ''
                    }`}
                    onClick={() => toggleFavorite(product.id)}
                    aria-label="Add to favorites"
                  >
                    <Heart size={14} fill={favorites[product.id] ? '#dc2626' : 'none'} />
                  </button>
                </div>

                <div className={styles.cardBody}>
                  <h3 className={styles.productName} title={product.name}>
                    {product.name}
                  </h3>

                  <div className={styles.categoryRow}>
                    <span>{product.categoryIcon}</span>
                    <span>{product.category}</span>
                  </div>

                  <div className={styles.locationRow}>
                    <MapPin size={12} color="#64748b" />
                    <span>{product.location}</span>
                  </div>

                  <div className={styles.priceStockRow}>
                    <span className={styles.priceText}>{product.price}</span>
                    <span className={product.isLowStock ? styles.stockLow : styles.stockInStock}>
                      {product.stockText}
                    </span>
                  </div>

                  <div className={styles.cardActionsRow}>
                    <button
                      type="button"
                      className={styles.viewDetailsBtn}
                      onClick={() => setDetailsProduct(product)}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Pagination */}
          <div className={styles.paginationRow}>
            <button type="button" className={styles.pageBtn}>
              <ChevronLeft size={14} />
            </button>
            <button
              type="button"
              className={`${styles.pageBtn} ${activePage === 1 ? styles.pageBtnActive : ''}`}
              onClick={() => setActivePage(1)}
            >
              1
            </button>
            <button
              type="button"
              className={`${styles.pageBtn} ${activePage === 2 ? styles.pageBtnActive : ''}`}
              onClick={() => setActivePage(2)}
            >
              2
            </button>
            <button
              type="button"
              className={`${styles.pageBtn} ${activePage === 3 ? styles.pageBtnActive : ''}`}
              onClick={() => setActivePage(3)}
            >
              3
            </button>
            <span className={styles.pageEllipsis}>...</span>
            <button
              type="button"
              className={`${styles.pageBtn} ${activePage === 8 ? styles.pageBtnActive : ''}`}
              onClick={() => setActivePage(8)}
            >
              8
            </button>
            <button type="button" className={styles.pageBtn}>
              <ChevronRight size={14} />
            </button>
          </div>

          {/* Bottom Note Banner */}
          <div className={styles.bottomNoteBanner}>
            <Info size={16} className={styles.infoIcon} />
            <span>Note: Buyers can contact you directly for price negotiation and product details.</span>
          </div>
        </section>

        {/* Right Sidebar */}
        <aside className={styles.sidebarCol}>
          {/* Card 1: Add New Product */}
          <div className={styles.sidebarCard}>
            <h3 className={styles.sidebarCardTitle}>Add New Product</h3>
            <p className={styles.sidebarCardText}>
              List your reusable product and reach interested buyers.
            </p>
            <button
              type="button"
              className={styles.addOutlineBtn}
              onClick={() => setIsAddModalOpen(true)}
            >
              + Add Product
            </button>
          </div>

          {/* Card 2: Categories */}
          <div className={styles.sidebarCard}>
            <h3 className={styles.sidebarCardTitle}>Categories</h3>
            <div className={styles.categoriesList}>
              {CATEGORIES_DATA.map((cat) => {
                const isActive = selectedCategory === cat.name;
                return (
                  <div
                    key={cat.name}
                    className={`${styles.categoryItem} ${
                      isActive ? styles.categoryItemActive : ''
                    }`}
                    onClick={() => setSelectedCategory(cat.name)}
                  >
                    <span>{cat.name}</span>
                    <span className={styles.categoryCountBadge}>{cat.count}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Card 3: Location Filter */}
          <div className={styles.sidebarCard}>
            <h3 className={styles.sidebarCardTitle}>Location Filter</h3>
            <div className={styles.locationInputBox}>
              <input
                type="text"
                placeholder="Search location..."
                defaultValue="Guindy, Chennai"
                className={styles.locationInput}
              />
            </div>

            {/* Embedded Mini Radar Map */}
            <div className={styles.mapPreviewBox}>
              <svg viewBox="0 0 260 120" width="100%" height="100%">
                {/* Background Map Grid / Roads */}
                <rect width="260" height="120" fill="#e2e8f0" />
                <path d="M0,40 Q90,30 180,50 T260,35" stroke="#ffffff" strokeWidth="6" fill="none" />
                <path d="M40,0 Q60,60 70,120" stroke="#ffffff" strokeWidth="5" fill="none" />
                <path d="M190,0 Q180,60 200,120" stroke="#ffffff" strokeWidth="5" fill="none" />
                <path d="M0,85 Q130,75 260,95" stroke="#ffffff" strokeWidth="4" fill="none" />

                {/* Radar Radius Circle */}
                <circle cx="130" cy="60" r="38" fill="rgba(37, 99, 235, 0.12)" stroke="#2563eb" strokeWidth="1.5" strokeDasharray="3 3" />
                <circle cx="130" cy="60" r="18" fill="rgba(37, 99, 235, 0.2)" />
                <circle cx="130" cy="60" r="5" fill="#2563eb" stroke="#ffffff" strokeWidth="2" />
              </svg>
            </div>

            <p className={styles.locationMetaText}>
              Showing products near <strong>Guindy, Chennai</strong> (within 15 km)
              <a href="#change" className={styles.changeLink} onClick={(e) => e.preventDefault()}>
                Change
              </a>
            </p>
          </div>

          {/* Card 4: Tips */}
          <div className={styles.sidebarCard}>
            <h3 className={styles.sidebarCardTitle}>Tips</h3>
            <div className={styles.tipsList}>
              <div className={styles.tipItem}>
                <Camera size={15} className={styles.tipIcon} />
                <span>Use real photos for better response</span>
              </div>
              <div className={styles.tipItem}>
                <FileEdit size={15} className={styles.tipIcon} />
                <span>Add clear product description</span>
              </div>
              <div className={styles.tipItem}>
                <Tag size={15} className={styles.tipIcon} />
                <span>Set competitive price</span>
              </div>
              <div className={styles.tipItem}>
                <MapPin size={15} className={styles.tipIcon} />
                <span>Keep your location updated</span>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Product Details Modal */}
      {detailsProduct && (
        <div className={styles.modalOverlay} onClick={() => setDetailsProduct(null)}>
          <div
            className={styles.detailsModalCard}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className={styles.detailsModalHeader}>
              <div className={styles.detailsHeaderLeft}>
                <span className={styles.detailsCategoryPill}>
                  {detailsProduct.categoryIcon} {detailsProduct.category}
                </span>
                <span
                  className={
                    detailsProduct.status === 'Active'
                      ? styles.badgeActive
                      : styles.badgeLowStock
                  }
                >
                  {detailsProduct.status}
                </span>
              </div>
              <button
                type="button"
                className={styles.modalCloseBtn}
                onClick={() => setDetailsProduct(null)}
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className={styles.detailsModalBody}>
              {/* Product Image Preview */}
              <div className={styles.detailsImgFrame}>
                <img
                  src={detailsProduct.image}
                  alt={detailsProduct.name}
                  className={styles.detailsModalImg}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/logo.png';
                  }}
                />
              </div>

              {/* Product Name & Price */}
              <div className={styles.detailsTitleSection}>
                <h2 className={styles.detailsProductTitle}>{detailsProduct.name}</h2>
                <div className={styles.detailsPriceTag}>{detailsProduct.price}</div>
              </div>

              {/* Specs Grid */}
              <div className={styles.detailsSpecsGrid}>
                <div className={styles.specBox}>
                  <span className={styles.specLabel}>Stock Status</span>
                  <strong className={styles.specValue}>{detailsProduct.stockText}</strong>
                </div>
                <div className={styles.specBox}>
                  <span className={styles.specLabel}>Location</span>
                  <strong className={styles.specValue}>📍 {detailsProduct.location}</strong>
                </div>
                <div className={styles.specBox}>
                  <span className={styles.specLabel}>Listing Type</span>
                  <strong className={styles.specValue}>Verified Reusable</strong>
                </div>
                <div className={styles.specBox}>
                  <span className={styles.specLabel}>Direct Inquiries</span>
                  <strong className={styles.specValueGreen}>✓ Enabled</strong>
                </div>
              </div>

              {/* Description */}
              <div className={styles.detailsDescSection}>
                <h4 className={styles.descHeading}>Product Description</h4>
                <p className={styles.descText}>
                  {detailsProduct.description ||
                    'High quality refurbished industrial reusable product inspected and certified for direct commercial reuse. Available for immediate pickup or dispatch.'}
                </p>
              </div>

              {/* Contact / Pickup Info */}
              <div className={styles.detailsContactBox}>
                <div className={styles.contactRow}>
                  <MapPin size={16} className={styles.contactIcon} />
                  <div>
                    <span className={styles.contactLabel}>Pickup Address</span>
                    <p className={styles.contactText}>
                      {detailsProduct.address ||
                        '24, 5th Main Road, SIDCO Industrial Estate, Guindy, Chennai – 600032'}
                    </p>
                  </div>
                </div>
                <div className={styles.contactRow}>
                  <Phone size={16} className={styles.contactIcon} />
                  <div>
                    <span className={styles.contactLabel}>Contact Helpline</span>
                    <p className={styles.contactText}>
                      {detailsProduct.contactNumber || '+91 98401 23456'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className={styles.detailsModalFooter}>
              <button
                type="button"
                className={styles.modalSecondaryBtn}
                onClick={() => setDetailsProduct(null)}
              >
                Close
              </button>
              <button
                type="button"
                className={styles.modalPrimaryBtn}
                onClick={() => {
                  const allReqs = getProductRequests();
                  const matched = allReqs.find(
                    (r) =>
                      r.productId === detailsProduct.id ||
                      r.productName.toLowerCase() === detailsProduct.name.toLowerCase()
                  );
                  setDetailsProduct(null);
                  setSelectedRequestIdForModal(matched ? matched.id : null);
                  setIsRequestsOpen(true);
                }}
              >
                <MessageSquare size={16} />
                <span>Manage Inquiries</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add New Product Modal */}
      <AddProductModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onPublish={handlePublishNewProduct}
      />

      {/* Product Requests Modal */}
      <ProductRequestsModal
        isOpen={isRequestsOpen}
        onClose={() => {
          setIsRequestsOpen(false);
          setSelectedRequestIdForModal(null);
        }}
        initialRequestId={selectedRequestIdForModal}
      />
    </div>
  );
}
