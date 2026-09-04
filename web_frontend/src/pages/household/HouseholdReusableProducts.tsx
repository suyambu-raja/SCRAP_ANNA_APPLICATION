import { useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
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
  LuShoppingCart,
  LuCheck,
  LuShieldAlert,
  LuCircleCheck as LuCheckCircle,
  LuCircleX as LuXCircle,
  LuClock,
  LuPhone,
  LuTrash2,
  LuExternalLink,
  LuTriangleAlert,
} from 'react-icons/lu';
import {
  getActiveHouseholdProducts,
  getReusableCart,
  addToReusableCart,
  removeFromReusableCart,
  type HouseholdProductItem,
  type ReusableCartItem,
  type MerchantConfirmationStatus,
} from '@/services/reusableProductService';
import styles from './HouseholdReusableProducts.module.css';
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock';

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
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(searchParams.get('openCart') === 'true');
  const [cartItems, setCartItems] = useState<ReusableCartItem[]>(() => getReusableCart());
  const [cartFilterStatus, setCartFilterStatus] = useState<'all' | MerchantConfirmationStatus>('all');
  const [cartToast, setCartToast] = useState<{ message: string; type: 'success' | 'info' } | null>(null);

  // Prevent background scroll bleed when cart drawer or modal is open
  useBodyScrollLock(isCartOpen || showHowItWorks);

  useEffect(() => {
    setCartItems(getReusableCart());
  }, []);

  const handleToggleCart = (product: HouseholdProductItem) => {
    const exists = cartItems.some((i) => i.productId === product.id);
    if (exists) {
      setIsCartOpen(true);
    } else {
      addToReusableCart(product);
      setCartItems(getReusableCart());
      setCartToast({
        message: `${product.name} added to Cart. Check status before visiting!`,
        type: 'success',
      });
      setTimeout(() => setCartToast(null), 3500);
    }
  };

  const handleRemoveFromCart = (cartItemId: string) => {
    const updated = removeFromReusableCart(cartItemId);
    setCartItems(updated);
  };

  const confirmedCount = useMemo(
    () => cartItems.filter((i) => i.status === 'confirmed').length,
    [cartItems]
  );
  const pendingCount = useMemo(
    () => cartItems.filter((i) => i.status === 'pending').length,
    [cartItems]
  );
  const rejectedCount = useMemo(
    () => cartItems.filter((i) => i.status === 'rejected').length,
    [cartItems]
  );

  const filteredCartItems = useMemo(() => {
    if (cartFilterStatus === 'all') return cartItems;
    return cartItems.filter((i) => i.status === cartFilterStatus);
  }, [cartItems, cartFilterStatus]);

  // Filter products based on search and category
  const filteredProducts = useMemo(() => {
    return getActiveHouseholdProducts({
      searchQuery,
      category: selectedCategory,
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className={styles.pageWrapper}>
      {/* 1. Compact Page Header with Title and Opposite Cart Button */}
      <header className={styles.headerRow}>
        <h1 className={styles.pageTitle}>Reusable Products</h1>
        <div className={styles.headerActions}>
          <button
            type="button"
            className={styles.cartHeaderBtn}
            onClick={() => setIsCartOpen(true)}
            aria-label={`View Selected Products Cart (${cartItems.length} items)`}
          >
            <LuShoppingCart size={16} />
            <span>Cart</span>
            {cartItems.length > 0 && (
              <span className={styles.cartBadge}>{cartItems.length}</span>
            )}
          </button>
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
        </div>
      </header>

      {/* Optional Compact How It Works Collapsible (Unobtrusive) */}
      {showHowItWorks && (
        <div className={styles.howItWorksDrawer} role="region" aria-label="How it works guide">
          <div className={styles.howStepsGrid}>
            <div className={styles.howStepCol}>
              <span className={styles.howStepNum}>01</span>
              <div className={styles.howStepContent}>
                <h4 className={styles.howStepTitle}>Find Quality Items</h4>
                <p className={styles.howStepDesc}>Browse reusable items from verified local scrap yards.</p>
              </div>
            </div>
            <div className={styles.howStepCol}>
              <span className={styles.howStepNum}>02</span>
              <div className={styles.howStepContent}>
                <h4 className={styles.howStepTitle}>Check Details</h4>
                <p className={styles.howStepDesc}>Inspect tested condition, transparent price, and distance.</p>
              </div>
            </div>
            <div className={styles.howStepCol}>
              <span className={styles.howStepNum}>03</span>
              <div className={styles.howStepContent}>
                <h4 className={styles.howStepTitle}>Voice Connect</h4>
                <p className={styles.howStepDesc}>Send voice notes directly to discuss condition and product details.</p>
              </div>
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
              <div
                className={`${styles.categoryIconBox} ${
                  isActive ? styles.categoryIconBoxActive : ''
                }`}
              >
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
                </div>

                <div className={styles.locationRow}>
                  <LuMapPin size={11} className={styles.locationIcon} aria-hidden="true" />
                  <span className={styles.locationText}>
                    {product.area.split(',')[0]} · {product.distanceText.replace(' away', '')}
                  </span>
                </div>

                {/* Quick Select / Cart Button */}
                <div className={styles.tileActionRow}>
                  <button
                    type="button"
                    className={
                      cartItems.some((i) => i.productId === product.id)
                        ? styles.tileInCartBtn
                        : styles.tileSelectBtn
                    }
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleToggleCart(product);
                    }}
                    aria-label={
                      cartItems.some((i) => i.productId === product.id)
                        ? `View ${product.name} in cart`
                        : `Select ${product.name}`
                    }
                  >
                    {cartItems.some((i) => i.productId === product.id) ? (
                      <>
                        <LuCheck size={12} />
                        <span>In Cart</span>
                      </>
                    ) : (
                      <>
                        <LuShoppingCart size={12} />
                        <span>Select</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* 6. Selected Products / Cart Drawer Modal */}
      {isCartOpen && (
        <div
          className={styles.cartModalOverlay}
          onClick={() => setIsCartOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="cart-modal-title"
        >
          <div
            className={styles.cartModalContainer}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className={styles.cartModalHeader}>
              <div className={styles.cartHeaderTitleWrap}>
                <div className={styles.cartHeaderIconBox}>
                  <LuShoppingCart />
                </div>
                <div>
                  <h2 id="cart-modal-title" className={styles.cartModalTitle}>
                    Selected Products
                  </h2>
                  <p className={styles.cartModalSub}>
                    {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in pickup list
                  </p>
                </div>
              </div>
              <button
                type="button"
                className={styles.cartCloseBtn}
                onClick={() => setIsCartOpen(false)}
                aria-label="Close cart"
              >
                <LuX size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className={styles.cartModalBody}>
              {/* Important Confirmation Warning Banner */}
              <div className={styles.cartNoticeBanner}>
                <LuShieldAlert size={20} className={styles.cartNoticeIcon} />
                <div>
                  <h4 className={styles.cartNoticeTitle}>
                    Check Merchant Status Before Visiting Yard
                  </h4>
                  <p className={styles.cartNoticeText}>
                    Merchants may confirm or reject orders if items sell to walk-ins.
                    <strong> Only visit the yard if status is &quot;Confirmed&quot;</strong> to save your trip and avoid traveling unnecessarily.
                  </p>
                </div>
              </div>

              {/* Status Filter Tabs */}
              <div className={styles.cartStatusTabs} role="tablist">
                <button
                  type="button"
                  className={`${styles.cartStatusTabBtn} ${cartFilterStatus === 'all' ? styles.cartStatusTabBtnActive : ''}`}
                  onClick={() => setCartFilterStatus('all')}
                >
                  <span>All</span>
                  <span className={styles.cartStatusTabCount}>{cartItems.length}</span>
                </button>
                <button
                  type="button"
                  className={`${styles.cartStatusTabBtn} ${cartFilterStatus === 'confirmed' ? styles.cartStatusTabBtnActive : ''}`}
                  onClick={() => setCartFilterStatus('confirmed')}
                >
                  <span style={{ color: '#16a34a' }}>●</span>
                  <span>Confirmed</span>
                  <span className={styles.cartStatusTabCount}>{confirmedCount}</span>
                </button>
                <button
                  type="button"
                  className={`${styles.cartStatusTabBtn} ${cartFilterStatus === 'pending' ? styles.cartStatusTabBtnActive : ''}`}
                  onClick={() => setCartFilterStatus('pending')}
                >
                  <span style={{ color: '#d97706' }}>●</span>
                  <span>Pending</span>
                  <span className={styles.cartStatusTabCount}>{pendingCount}</span>
                </button>
                <button
                  type="button"
                  className={`${styles.cartStatusTabBtn} ${cartFilterStatus === 'rejected' ? styles.cartStatusTabBtnActive : ''}`}
                  onClick={() => setCartFilterStatus('rejected')}
                >
                  <span style={{ color: '#dc2626' }}>●</span>
                  <span>Rejected</span>
                  <span className={styles.cartStatusTabCount}>{rejectedCount}</span>
                </button>
              </div>

              {/* Items List */}
              {filteredCartItems.length === 0 ? (
                <div className={styles.cartEmptyState}>
                  <div className={styles.cartEmptyIconBox}>
                    <LuShoppingCart />
                  </div>
                  <h3 className={styles.cartEmptyTitle}>
                    {cartItems.length === 0
                      ? 'No selected products yet'
                      : `No ${cartFilterStatus} products`}
                  </h3>
                  <p className={styles.cartEmptyDesc}>
                    {cartItems.length === 0
                      ? 'Select products from the marketplace to check merchant availability before traveling.'
                      : `You have no products currently with status "${cartFilterStatus}".`}
                  </p>
                </div>
              ) : (
                <div className={styles.cartList}>
                  {filteredCartItems.map((item) => (
                    <div key={item.id} className={styles.cartItemCard}>
                      <div className={styles.cartItemCardHeader}>
                        <img
                          src={item.image}
                          alt={item.productName}
                          className={styles.cartItemThumb}
                        />
                        <div className={styles.cartItemInfo}>
                          <span className={styles.cartItemCategory}>{item.category}</span>
                          <h4 className={styles.cartItemTitle}>{item.productName}</h4>
                          <div className={styles.cartItemPriceRow}>
                            <span className={styles.cartItemPrice}>{item.priceFormatted}</span>
                            <button
                              type="button"
                              className={styles.cartItemDeleteBtn}
                              onClick={() => handleRemoveFromCart(item.id)}
                              title="Remove from cart"
                              aria-label={`Remove ${item.productName} from cart`}
                            >
                              <LuTrash2 size={15} />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* 1. Confirmed Status */}
                      {item.status === 'confirmed' && (
                        <div className={`${styles.statusBlock} ${styles.statusBlockConfirmed}`}>
                          <div className={styles.statusHeaderConfirmed}>
                            <LuCheckCircle size={16} />
                            <span>Merchant Confirmed — Ready for Pickup</span>
                          </div>
                          <div className={styles.statusYardBox}>
                            <LuMapPin size={13} style={{ flexShrink: 0 }} />
                            <span>
                              Pickup Yard: <strong>{item.merchantBusinessName}</strong> · {item.merchantArea}
                            </span>
                          </div>
                          <div className={styles.cartActionRowConfirmed}>
                            <a
                              href={`tel:${item.merchantMobile}`}
                              className={styles.cartCallMerchantBtn}
                            >
                              <LuPhone size={13} />
                              <span>Call Merchant</span>
                            </a>
                            <Link
                              to={`/household/products/${item.productId}`}
                              className={styles.cartViewDetailsBtn}
                              onClick={() => setIsCartOpen(false)}
                            >
                              <LuExternalLink size={13} />
                              <span>View Product</span>
                            </Link>
                          </div>
                        </div>
                      )}

                      {/* 2. Rejected Status - Highlights "DO NOT VISIT YARD" */}
                      {item.status === 'rejected' && (
                        <div className={`${styles.statusBlock} ${styles.statusBlockRejected}`}>
                          <div className={styles.statusHeaderRejected}>
                            <LuXCircle size={16} />
                            <span>Merchant Rejected — Order Cancelled</span>
                          </div>
                          <div className={styles.statusTripSavedBox}>
                            <LuTriangleAlert size={13} style={{ flexShrink: 0 }} />
                            <span>Trip Saved: Do not visit {item.merchantArea}</span>
                          </div>
                          <div className={styles.cartActionRowRejected}>
                            <button
                              type="button"
                              className={styles.cartRemoveRejectedBtn}
                              onClick={() => handleRemoveFromCart(item.id)}
                            >
                              <LuTrash2 size={13} />
                              <span>Remove from List</span>
                            </button>
                          </div>
                        </div>
                      )}

                      {/* 3. Pending Status */}
                      {item.status === 'pending' && (
                        <div className={`${styles.statusBlock} ${styles.statusBlockPending}`}>
                          <div className={styles.statusHeaderPending}>
                            <LuClock size={16} />
                            <span>Awaiting Merchant Confirmation</span>
                          </div>
                          <div className={styles.statusPendingWaitBox}>
                            <LuClock size={13} style={{ flexShrink: 0 }} />
                            <span>Awaiting confirmation · Do not visit {item.merchantArea}</span>
                          </div>
                          <button
                            type="button"
                            className={styles.cartCancelPendingBtn}
                            onClick={() => handleRemoveFromCart(item.id)}
                          >
                            <LuX size={13} />
                            <span>Cancel Request</span>
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Floating Cart Toast */}
      {cartToast && (
        <div className={styles.cartToast} role="alert">
          <LuShoppingCart size={15} color="#F8BF1D" />
          <span>{cartToast.message}</span>
        </div>
      )}
    </div>
  );
}

export default HouseholdReusableProducts;
