import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  LuSearch,
  LuX,
  LuMapPin,
  LuLayoutGrid,
  LuArmchair,
  LuWashingMachine,
  LuBike,
  LuCpu,
  LuHouse,
  LuEllipsis,
  LuHeart,
  LuInfo,
  LuPackage,
} from 'react-icons/lu';
import {
  getActiveHouseholdProducts,
  type HouseholdProductItem,
} from '@/services/reusableProductService';
import styles from './HouseholdReusableProducts.module.css';

const CATEGORY_TABS = [
  { id: 'All', label: 'All', icon: LuLayoutGrid },
  { id: 'Furniture', label: 'Furniture', icon: LuArmchair },
  { id: 'Appliances', label: 'Appliances', icon: LuWashingMachine },
  { id: 'Cycles', label: 'Cycles', icon: LuBike },
  { id: 'Motors', label: 'Motors', icon: LuCpu },
  { id: 'Home Items', label: 'Home', icon: LuHouse },
  { id: 'Other', label: 'More', icon: LuEllipsis },
];

export function HouseholdReusableProducts() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showHowItWorks, setShowHowItWorks] = useState(false);

  // Filter products based on search and category
  const filteredProducts = useMemo(() => {
    return getActiveHouseholdProducts({
      searchQuery,
      category: selectedCategory,
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className={styles.pageWrapper}>
      {/* 1. Compact Page Header */}
      <header className={styles.headerRow}>
        <h1 className={styles.pageTitle}>Reusable Products</h1>
        <button
          type="button"
          className={styles.infoToggleBtn}
          onClick={() => setShowHowItWorks((prev) => !prev)}
          aria-expanded={showHowItWorks}
          aria-label="Toggle How it works information"
        >
          <LuInfo size={14} />
          <span>How It Works</span>
        </button>
      </header>

      {/* Optional Compact How It Works Collapsible (Unobtrusive) */}
      {showHowItWorks && (
        <div className={styles.howItWorksDrawer} role="region" aria-label="How it works guide">
          <div className={styles.howStepsGrid}>
            <div className={styles.howStepCol}>
              <span className={styles.howStepNum}>01</span>
              <h4 className={styles.howStepTitle}>Find Quality Items</h4>
              <p className={styles.howStepDesc}>Browse reusable items from verified local scrap yards.</p>
            </div>
            <div className={styles.howStepCol}>
              <span className={styles.howStepNum}>02</span>
              <h4 className={styles.howStepTitle}>Check Details</h4>
              <p className={styles.howStepDesc}>Inspect tested condition, transparent price, and distance.</p>
            </div>
            <div className={styles.howStepCol}>
              <span className={styles.howStepNum}>03</span>
              <h4 className={styles.howStepTitle}>Voice Negotiate</h4>
              <p className={styles.howStepDesc}>Send voice notes directly to discuss condition and best price.</p>
            </div>
          </div>
        </div>
      )}

      {/* 2. Compact Search Field */}
      <section className={styles.searchSection} aria-label="Search reusable products">
        <LuSearch className={styles.searchIcon} aria-hidden="true" />
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Search products"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          aria-label="Search products"
        />
        {searchQuery && (
          <button
            type="button"
            className={styles.clearBtn}
            onClick={() => setSearchQuery('')}
            aria-label="Clear search input"
          >
            <LuX size={15} />
          </button>
        )}
      </section>

      {/* 3. Horizontal Category Navigation (Squircle Icons + Short Labels) */}
      <nav className={styles.categoryTrack} aria-label="Product categories">
        {CATEGORY_TABS.map((cat) => {
          const Icon = cat.icon;
          const isActive = selectedCategory === cat.id;

          return (
            <button
              key={cat.id}
              type="button"
              className={`${styles.categoryItem} ${isActive ? styles.categoryItemActive : ''}`}
              onClick={() => setSelectedCategory(cat.id)}
              aria-pressed={isActive}
            >
              <div className={styles.categoryIconBox}>
                <Icon />
              </div>
              <span className={styles.categoryLabel}>{cat.label}</span>
            </button>
          );
        })}
      </nav>

      {/* 4. Section Heading */}
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>
          <span>Popular Near You</span>
          <span className={styles.countBadge}>{filteredProducts.length}</span>
        </h2>
      </div>

      {/* 5. Compact 2-Column Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className={styles.emptyContainer} role="status">
          <div className={styles.emptyIcon}>
            <LuPackage size={26} />
          </div>
          <h3 className={styles.emptyTitle}>No products found</h3>
          <p className={styles.emptyDesc}>
            {searchQuery || selectedCategory !== 'All'
              ? 'Try adjusting your search terms or picking another category.'
              : 'New reusable items from local merchants will appear here soon.'}
          </p>
          {(searchQuery || selectedCategory !== 'All') && (
            <button
              type="button"
              className={styles.resetBtn}
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
            >
              Reset Filters
            </button>
          )}
        </div>
      ) : (
        <div className={styles.productGrid} role="region" aria-label="Reusable products list">
          {filteredProducts.map((product: HouseholdProductItem) => (
            <Link
              key={product.id}
              to={`/household/products/${product.id}`}
              className={styles.productTile}
            >
              {/* Product Photography */}
              <div className={styles.tileImageWrap}>
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className={styles.tileImage}
                    loading="lazy"
                  />
                ) : (
                  <div className={styles.fallbackTileIcon}>
                    <LuPackage size={36} />
                  </div>
                )}

                {/* Condition Badge */}
                <span className={styles.conditionBadge}>{product.condition}</span>

                {/* Subtle Favorite Heart Icon */}
                <span className={styles.heartIconWrap} aria-hidden="true">
                  <LuHeart />
                </span>
              </div>

              {/* Product Information */}
              <div className={styles.tileBody}>
                <h3 className={styles.tileName}>{product.name}</h3>

                <div className={styles.priceRow}>
                  <span className={styles.priceText}>{product.priceFormatted}</span>
                  {product.negotiable && (
                    <span className={styles.negotiablePill}>Neg</span>
                  )}
                </div>

                <div className={styles.locationRow}>
                  <LuMapPin size={11} className={styles.locationIcon} aria-hidden="true" />
                  <span className={styles.locationText}>
                    {product.area.split(',')[0]} · {product.distanceText.replace(' away', '')}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default HouseholdReusableProducts;
