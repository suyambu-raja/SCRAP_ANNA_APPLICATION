import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ArrowRight,
  MapPin,
  Info,
  Layers,
  Sparkles,
  Cpu,
  FileText,
  Tag,
  Plus,
  TrendingUp,
} from 'lucide-react';
import { SkeletonCard, Button } from '@/components/common';
import { PriceCard } from '@/components/cards/PriceCard';
import { getMarketPrices, getScrapCategories } from '@/services';
import type { MarketPrice, ScrapCategory } from '@/types';
import styles from './IndustryMarketPrices.module.css';

export default function IndustryMarketPrices() {
  const { i18n } = useTranslation();
  const navigate = useNavigate();

  const [prices, setPrices] = useState<MarketPrice[]>([]);
  const [categories, setCategories] = useState<ScrapCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCatId, setSelectedCatId] = useState<string>('CAT_IRON');
  const [selectedMaterialId, setSelectedMaterialId] = useState<string>('IRON_001');

  useEffect(() => {
    Promise.all([getMarketPrices(), getScrapCategories()]).then(([priceData, catData]) => {
      setPrices(priceData);
      setCategories(catData);
      if (priceData.length > 0) {
        setSelectedCatId(priceData[0].categoryId);
        setSelectedMaterialId(priceData[0].id);
      }
      setLoading(false);
    });
  }, []);

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
    <div className={styles.pageContainer}>
      {/* 1. Header Banner */}
      <div className={styles.headerBanner}>
        <div className={styles.headerTitleGroup}>
          <div className={styles.headerBadge}>
            <TrendingUp size={13} />
            <span>CHENNAI INDUSTRIAL BENCHMARK RATES</span>
          </div>
          <h1 className={styles.pageTitle}>Scrap Market Benchmark Prices</h1>
          <p className={styles.pageSubtitle}>
            Live indicative wholesale price benchmarks for industrial, commercial, and factory scrap materials across Chennai.
          </p>
        </div>

        <Link to="/industry/post-requirement" className={styles.postMoreBtn}>
          <Plus size={16} />
          <span>Post Scrap Listing</span>
        </Link>
      </div>

      <main className={styles.detailMainContainer}>
        {/* Top Navigation Row: Category Switcher */}
        <div className={styles.topNavRow}>
          <div className={styles.categoryPillsTrack}>
            <button
              type="button"
              className={[
                styles.materialPillBtn,
                selectedCatId === 'all' ? styles.materialPillActive : '',
              ].join(' ')}
              onClick={() => {
                setSelectedCatId('all');
                if (prices.length > 0) setSelectedMaterialId(prices[0].id);
              }}
            >
              All Categories
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

        {/* Sub-Material Selector Pills (Within Selected Category) */}
        {categoryMaterials.length > 1 && (
          <div className={styles.subMaterialTrack}>
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
                onClick={() => setSelectedMaterialId(mat.id)}
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
                    'Verified recyclable commodities and factory industrial scrap benchmark rates'}
                </p>
              </div>

              {/* Main Market Rate Card */}
              <div className={styles.marketRateCard}>
                <div className={styles.rateCardHeader}>
                  <span className={styles.rateCardTitle}>INDICATIVE BENCHMARK RATE</span>
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
                  <strong>Price Note:</strong> Rates are general market trading benchmarks and may vary based on
                  material quality, moisture/impurity, volume (&gt; 1 Ton), factory location, and merchant offers.
                </span>
              </div>

              {/* Bottom Action CTA Card */}
              <div className={styles.bottomActionCard}>
                <div className={styles.ctaTextGroup}>
                  <h3 className={styles.ctaHeading}>
                    Sell factory scrap of {activePrice.name || activePrice.category}?
                  </h3>
                  <p className={styles.ctaSubtext}>
                    Post your factory requirements to receive competitive offers from verified Chennai scrap buyers.
                  </p>
                </div>
                <Button
                  size="md"
                  className={styles.ctaYellowBtn}
                  icon={<ArrowRight size={16} />}
                  onClick={() => navigate('/industry/post-requirement')}
                >
                  Post Requirement →
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
                Click any material card below to inspect its benchmark rates and market details.
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
