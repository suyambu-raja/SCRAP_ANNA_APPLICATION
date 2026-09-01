import { useEffect, useState, useRef, useCallback } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ArrowLeft,
  ArrowRight,
  MapPin,
  Info,
  Layers,
  Sparkles,
  Cpu,
  FileText,
  Tag,
} from 'lucide-react';
import { Button, SkeletonCard } from '@/components/common';
import { PriceCard } from '@/components/cards/PriceCard';
import { getMarketPrices, getScrapCategories } from '@/services';
import type { MarketPrice, ScrapCategory } from '@/types';
import styles from './HouseholdRates.module.css';

/**
 * Hook to smoothly auto-scroll category/sub-category tracks leftward.
 * Pauses for 10 seconds whenever the user clicks, swipes, or touches the row.
 */
function useAutoScrollTrack(speedPxPerSec = 22, pauseDurationMs = 10000) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const isPausedRef = useRef(false);
  const pauseTimeoutRef = useRef<number | null>(null);
  const isHoldingAtEndRef = useRef(false);
  const scrollDirectionRef = useRef<'forward' | 'backward'>('forward');

  const pauseForDuration = useCallback((duration = pauseDurationMs) => {
    isPausedRef.current = true;
    if (pauseTimeoutRef.current) {
      window.clearTimeout(pauseTimeoutRef.current);
    }
    pauseTimeoutRef.current = window.setTimeout(() => {
      isPausedRef.current = false;
    }, duration);
  }, [pauseDurationMs]);

  const onUserInteractionStart = useCallback(() => {
    isPausedRef.current = true;
    if (pauseTimeoutRef.current) {
      window.clearTimeout(pauseTimeoutRef.current);
    }
  }, []);

  const onUserInteractionEnd = useCallback(() => {
    pauseForDuration(pauseDurationMs);
  }, [pauseForDuration, pauseDurationMs]);

  useEffect(() => {
    let animId: number;
    let lastTime: number | null = null;

    const animate = (time: number) => {
      if (lastTime === null) {
        lastTime = time;
      }
      const delta = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      const el = trackRef.current;
      if (el && !isPausedRef.current && !isHoldingAtEndRef.current) {
        const maxScroll = el.scrollWidth - el.clientWidth;
        if (maxScroll > 10) {
          if (scrollDirectionRef.current === 'forward') {
            el.scrollLeft += speedPxPerSec * delta;
            if (el.scrollLeft >= maxScroll - 2) {
              isHoldingAtEndRef.current = true;
              window.setTimeout(() => {
                scrollDirectionRef.current = 'backward';
                isHoldingAtEndRef.current = false;
              }, 1200);
            }
          } else {
            el.scrollLeft -= speedPxPerSec * 1.8 * delta;
            if (el.scrollLeft <= 2) {
              isHoldingAtEndRef.current = true;
              window.setTimeout(() => {
                scrollDirectionRef.current = 'forward';
                isHoldingAtEndRef.current = false;
              }, 1200);
            }
          }
        }
      }

      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animId);
      if (pauseTimeoutRef.current) {
        window.clearTimeout(pauseTimeoutRef.current);
      }
    };
  }, [speedPxPerSec]);

  const interactionProps = {
    onTouchStart: onUserInteractionStart,
    onTouchEnd: onUserInteractionEnd,
    onTouchCancel: onUserInteractionEnd,
    onMouseDown: onUserInteractionStart,
    onMouseUp: onUserInteractionEnd,
    onWheel: () => pauseForDuration(pauseDurationMs),
    onClick: () => pauseForDuration(pauseDurationMs),
  };

  return { trackRef, pauseForDuration, interactionProps };
}

export function HouseholdRates() {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');
  const itemParam = searchParams.get('item');

  const [prices, setPrices] = useState<MarketPrice[]>([]);
  const [categories, setCategories] = useState<ScrapCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCatId, setSelectedCatId] = useState<string>('CAT_IRON');
  const [selectedMaterialId, setSelectedMaterialId] = useState<string>('IRON_001');

  // Auto-scroll hooks with 10s pause on user touch/click/swipe
  const categoryScroll = useAutoScrollTrack(24, 10000);
  const subCategoryScroll = useAutoScrollTrack(20, 10000);

  useEffect(() => {
    Promise.all([getMarketPrices(), getScrapCategories()]).then(([priceData, catData]) => {
      setPrices(priceData);
      setCategories(catData);
      if (priceData.length > 0) {
        const initialCat = categoryParam || priceData[0].categoryId;
        const initialItem = itemParam || priceData.find((p) => p.categoryId === initialCat)?.id || priceData[0].id;
        setSelectedCatId(initialCat);
        setSelectedMaterialId(initialItem);
      }
      setLoading(false);
    });
  }, [categoryParam, itemParam]);

  const isTamil = i18n.language === 'ta';

  // Filter materials based on selected category (or all)
  const categoryMaterials =
    selectedCatId === 'all'
      ? prices
      : prices.filter((p) => p.categoryId === selectedCatId);

  // Active material being inspected
  const activePrice: MarketPrice | undefined =
    prices.find((p) => p.id === selectedMaterialId) ||
    categoryMaterials[0] ||
    prices[0];

  // Active category object
  const activeCategory =
    categories.find((c) => c.id === (activePrice?.categoryId || selectedCatId)) ||
    categories[0];

  const minPrice = activePrice
    ? activePrice.priceMin ?? Math.round(activePrice.price * 0.9)
    : 0;
  const maxPrice = activePrice
    ? activePrice.priceMax ?? Math.round(activePrice.price * 1.1)
    : 0;

  return (
    <div className={styles.detailPageWrapper}>
      <main className={styles.detailMainContainer}>
        {/* Top Navigation Row: Back Link + Category Switcher */}
        <div className={styles.topNavRow}>
          <div className={styles.backLinkRow}>
            <Link to="/household" className={styles.backLink}>
              <ArrowLeft size={16} />
              <span>Back to Dashboard</span>
            </Link>
          </div>

          {/* Primary Categories Filter Pills (Auto-scrolling with 10s pause on interaction) */}
          <div
            ref={categoryScroll.trackRef}
            className={styles.categoryPillsTrack}
            {...categoryScroll.interactionProps}
          >
            <button
              type="button"
              className={[
                styles.materialPillBtn,
                selectedCatId === 'all' ? styles.materialPillActive : '',
              ].join(' ')}
              onClick={() => {
                categoryScroll.pauseForDuration(10000);
                setSelectedCatId('all');
                if (prices.length > 0) setSelectedMaterialId(prices[0].id);
              }}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                className={[
                  styles.materialPillBtn,
                  selectedCatId === cat.id ? styles.materialPillActive : '',
                ].join(' ')}
                onClick={() => {
                  categoryScroll.pauseForDuration(10000);
                  setSelectedCatId(cat.id);
                  const firstInCat = prices.find((p) => p.categoryId === cat.id);
                  if (firstInCat) setSelectedMaterialId(firstInCat.id);
                }}
              >
                {isTamil ? cat.name_ta : cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Sub-Material Selector Pills (Auto-scrolling with 10s pause on interaction) */}
        {categoryMaterials.length > 1 && (
          <div
            ref={subCategoryScroll.trackRef}
            className={styles.subMaterialTrack}
            {...subCategoryScroll.interactionProps}
          >
            <span className={styles.subMaterialLabel}>
              <Tag size={13} />
              <span>Select Material:</span>
            </span>
            {categoryMaterials.map((mat) => (
              <button
                key={mat.id}
                type="button"
                className={[
                  styles.subMaterialPill,
                  activePrice?.id === mat.id ? styles.subMaterialPillActive : '',
                ].join(' ')}
                onClick={() => {
                  subCategoryScroll.pauseForDuration(10000);
                  setSelectedMaterialId(mat.id);
                }}
              >
                {mat.name || mat.category}
              </button>
            ))}
          </div>
        )}

        {loading || !activePrice ? (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : (
          /* 2. Main Product/Price 2-Column Area */
          <div className={styles.detailGridDesktop}>
            {/* Left Column: Large Material Image Space */}
            <div className={styles.leftImageColumn}>
              <div className={styles.largeImageFrame}>
                {activePrice.imageUrl ? (
                  <img
                    src={activePrice.imageUrl}
                    alt={activePrice.name || activePrice.category}
                    className={styles.materialImage}
                    onError={(e) => {
                      (e.currentTarget as HTMLElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <div className={styles.imagePlaceholderBox}>
                    <div className={styles.placeholderIconWrap}>
                      {activePrice.categoryId === 'CAT_EWASTE' ? (
                        <Cpu size={36} />
                      ) : activePrice.categoryId === 'CAT_PAPER' ||
                        activePrice.categoryId === 'CAT_CARDBOARD' ? (
                        <FileText size={36} />
                      ) : activePrice.categoryId === 'CAT_PLASTIC' ? (
                        <Sparkles size={36} />
                      ) : (
                        <Layers size={36} />
                      )}
                    </div>
                    <span className={styles.placeholderText}>
                      {activePrice.name || activePrice.category} Photo
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Rate Information & Minimal Overview */}
            <div className={styles.rightDetailColumn}>
              {/* Category, Title & Descriptors */}
              <div className={styles.headerInfoGroup}>
                <div className={styles.categoryTagRow}>
                  <span className={styles.categoryLabel}>
                    {activeCategory?.name?.toUpperCase() || 'SCRAP MATERIAL'}
                  </span>
                </div>

                <h1 className={styles.materialHeading}>
                  {activePrice.name || activePrice.category}
                </h1>
                <p className={styles.materialDescriptors}>
                  {activePrice.descriptors ||
                    'Verified recyclable commodities and household scrap'}
                </p>
              </div>

              {/* Main Market Rate Card */}
              <div className={styles.marketRateCard}>
                <div className={styles.rateCardHeader}>
                  <span className={styles.rateCardTitle}>MARKET RATE</span>
                </div>

                {/* Prominent Price Element */}
                <div className={styles.priceDisplayRow}>
                  <span className={styles.largePriceRange}>
                    ₹{minPrice} – ₹{maxPrice}
                  </span>
                  <span className={styles.largePriceUnit}>/{activePrice.unit}</span>
                </div>

                {/* Footer: Location & Update Time */}
                <div className={styles.rateCardFooterRow}>
                  <div className={styles.locationPinGroup}>
                    <MapPin size={15} />
                    <span>{activePrice.location || 'Chennai'}, Tamil Nadu</span>
                  </div>
                  <div className={styles.lastUpdatedText}>
                    Updated today, 9:30 AM
                  </div>
                </div>
              </div>

              {/* Single Compact Price Note Box */}
              <div className={styles.priceNoticeBox}>
                <Info size={16} />
                <span>
                  <strong>Price Note:</strong> Rates are indicative and may vary based on
                  material quality, quantity, location and prevailing market conditions.
                </span>
              </div>

              {/* Bottom Action CTA Card */}
              <div className={styles.bottomActionCard}>
                <div className={styles.ctaTextGroup}>
                  <h3 className={styles.ctaHeading}>
                    Want to sell {activePrice.name || activePrice.category}?
                  </h3>
                  <p className={styles.ctaSubtext}>
                    Connect with verified scrap merchants and doorstep collectors with calibrated digital weighing.
                  </p>
                </div>
                <Button
                  size="md"
                  className={styles.ctaYellowBtn}
                  icon={<ArrowRight size={16} />}
                  onClick={() => navigate('/household/post-scrap')}
                >
                  Post Scrap →
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* 3. Browse More Items in this Category */}
        {categoryMaterials.length > 0 && (
          <section className={styles.relatedMaterialsSection}>
            <div className={styles.relatedSectionHeader}>
              <h3 className={styles.relatedSectionTitle}>
                All Materials in {activeCategory?.name || 'this category'} ({categoryMaterials.length})
              </h3>
              <p className={styles.relatedSectionSub}>
                Click any material card to view its indicative benchmark rate.
              </p>
            </div>

            <div className={styles.relatedGrid}>
              {categoryMaterials.map((mat) => (
                <div
                  key={mat.id}
                  onClick={() => setSelectedMaterialId(mat.id)}
                  className={[
                    styles.relatedCardWrapper,
                    activePrice?.id === mat.id ? styles.relatedCardActive : '',
                  ].join(' ')}
                >
                  <PriceCard price={mat} isActive={activePrice?.id === mat.id} />
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default HouseholdRates;
