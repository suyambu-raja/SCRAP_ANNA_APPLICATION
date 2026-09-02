import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ArrowLeft,
  MapPin,
  Info,
  Layers,
  Sparkles,
  Cpu,
  FileText,
  Tag,
  CheckCircle2,
  TrendingUp,
  TrendingDown,
  Plus,
  Minus,
  Save,
  RotateCcw,
  ShieldCheck,
  Clock,
  Search,
} from 'lucide-react';
import { SkeletonCard } from '@/components/common';
import { PriceCard } from '@/components/cards/PriceCard';
import { getMarketPrices, getScrapCategories } from '@/services';
import type { MarketPrice, ScrapCategory } from '@/types';
import styles from './MerchantMarketPrices.module.css';

export default function MerchantMarketPrices() {
  const { i18n } = useTranslation();
  const [searchParams] = useSearchParams();

  const [prices, setPrices] = useState<MarketPrice[]>([]);
  const [categories, setCategories] = useState<ScrapCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCatId, setSelectedCatId] = useState<string>('CAT_IRON');
  const [selectedMaterialId, setSelectedMaterialId] = useState<string>('IRON_001');
  const [searchQuery, setSearchQuery] = useState('');

  // Merchant Custom Rates State (allows string for fluid backspacing/typing)
  const [merchantRates, setMerchantRates] = useState<Record<string, number | string>>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([getMarketPrices(), getScrapCategories()]).then(([priceData, catData]) => {
      setPrices(priceData);
      setCategories(catData);

      const targetMaterial =
        searchParams.get('material')?.toLowerCase() ||
        searchParams.get('id')?.toLowerCase() ||
        searchParams.get('name')?.toLowerCase();

      let initialCat = 'CAT_IRON';
      let initialMat = 'IRON_001';

      if (targetMaterial && priceData.length > 0) {
        const found = priceData.find((p) => {
          const mId = p.id.toLowerCase();
          const mCatId = p.categoryId.toLowerCase();
          const mName = (p.name || '').toLowerCase();
          const mCat = (p.category || '').toLowerCase();

          return (
            mId === targetMaterial ||
            mCatId.includes(targetMaterial) ||
            mName.includes(targetMaterial) ||
            mCat.includes(targetMaterial) ||
            (targetMaterial === 'iron' && (mCatId.includes('iron') || mName.includes('iron'))) ||
            (targetMaterial === 'copper' && (mCatId.includes('copper') || mName.includes('copper'))) ||
            (targetMaterial === 'aluminium' && (mCatId.includes('aluminium') || mName.includes('aluminium'))) ||
            (targetMaterial === 'brass' && (mCatId.includes('brass') || mName.includes('brass'))) ||
            (targetMaterial === 'steel' && (mCatId.includes('steel') || mName.includes('steel'))) ||
            (targetMaterial === 'plastic' && (mCatId.includes('plastic') || mName.includes('plastic'))) ||
            (targetMaterial === 'paper' && (mCatId.includes('paper') || mCatId.includes('cardboard') || mName.includes('paper'))) ||
            (targetMaterial === 'ewaste' && (mCatId.includes('ewaste') || mName.includes('cpu') || mName.includes('electronic')))
          );
        });

        if (found) {
          initialCat = found.categoryId;
          initialMat = found.id;
        }
      }

      setSelectedCatId(initialCat);
      setSelectedMaterialId(initialMat);

      // Initialize default merchant custom rates to 0
      const initialRates: Record<string, number | string> = {};
      priceData.forEach((p) => {
        initialRates[p.id] = 0;
      });
      setMerchantRates(initialRates);
      setLoading(false);
    });
  }, [searchParams]);

  // Sync selected material if search parameters change dynamically
  useEffect(() => {
    const targetMaterial =
      searchParams.get('material')?.toLowerCase() ||
      searchParams.get('id')?.toLowerCase() ||
      searchParams.get('name')?.toLowerCase();

    if (targetMaterial && prices.length > 0) {
      const found = prices.find((p) => {
        const mId = p.id.toLowerCase();
        const mCatId = p.categoryId.toLowerCase();
        const mName = (p.name || '').toLowerCase();
        const mCat = (p.category || '').toLowerCase();

        return (
          mId === targetMaterial ||
          mCatId.includes(targetMaterial) ||
          mName.includes(targetMaterial) ||
          mCat.includes(targetMaterial) ||
          (targetMaterial === 'iron' && (mCatId.includes('iron') || mName.includes('iron'))) ||
          (targetMaterial === 'copper' && (mCatId.includes('copper') || mName.includes('copper'))) ||
          (targetMaterial === 'aluminium' && (mCatId.includes('aluminium') || mName.includes('aluminium'))) ||
          (targetMaterial === 'brass' && (mCatId.includes('brass') || mName.includes('brass'))) ||
          (targetMaterial === 'steel' && (mCatId.includes('steel') || mName.includes('steel'))) ||
          (targetMaterial === 'plastic' && (mCatId.includes('plastic') || mName.includes('plastic'))) ||
          (targetMaterial === 'paper' && (mCatId.includes('paper') || mCatId.includes('cardboard') || mName.includes('paper'))) ||
          (targetMaterial === 'ewaste' && (mCatId.includes('ewaste') || mName.includes('cpu') || mName.includes('electronic')))
        );
      });

      if (found) {
        setSelectedCatId(found.categoryId);
        setSelectedMaterialId(found.id);
        window.scrollTo({
          top: 0,
          behavior: 'smooth',
        });
      }
    }
  }, [searchParams, prices]);

  const handleSelectMaterial = (matId: string, scrollToTop = true) => {
    setSelectedMaterialId(matId);
    if (scrollToTop) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const isTamil = i18n.language === 'ta';

  // Filter materials based on selected category & search query
  const categoryMaterials = prices.filter((p) => {
    const matchesCategory = selectedCatId === 'all' || p.categoryId === selectedCatId;
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch =
      q === '' ||
      (p.name && p.name.toLowerCase().includes(q)) ||
      (p.category && p.category.toLowerCase().includes(q)) ||
      (p.descriptors && p.descriptors.toLowerCase().includes(q));
    return matchesCategory && matchesSearch;
  });

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

  const currentMerchantRate =
    activePrice && merchantRates[activePrice.id] !== undefined
      ? merchantRates[activePrice.id]
      : 0;

  // Rate change handlers (supports fluid typing & complete deletion of 0)
  const handleRateChange = (materialId: string, val: string) => {
    if (val === '') {
      setMerchantRates((prev) => ({
        ...prev,
        [materialId]: '',
      }));
      return;
    }
    const num = Math.max(0, Math.min(10000, Number(val)));
    setMerchantRates((prev) => ({
      ...prev,
      [materialId]: isNaN(num) ? '' : num,
    }));
  };

  const handleStepRate = (materialId: string, step: number) => {
    const raw = merchantRates[materialId];
    const current = raw === '' || raw === undefined ? 0 : Number(raw);
    const nextVal = Math.min(10000, Math.max(0, current + step));
    setMerchantRates((prev) => ({
      ...prev,
      [materialId]: nextVal,
    }));
  };

  const handleSaveActiveRate = () => {
    if (!activePrice) return;
    const savedRate = Number(merchantRates[activePrice.id]) || 0;
    showToast(`✓ Saved YOUR Price for ${activePrice.name || activePrice.category}: ₹${savedRate}/${activePrice.unit}`);
  };

  const handleResetToBenchmark = () => {
    if (!activePrice) return;
    setMerchantRates((prev) => ({
      ...prev,
      [activePrice.id]: 0,
    }));
    showToast(`Reset YOUR Price for ${activePrice.name || activePrice.category} to ₹0/${activePrice.unit}`);
  };

  return (
    <div className={styles.detailPageWrapper}>
      {/* Toast Notification */}
      {toastMessage && (
        <div className={styles.toastBanner}>
          <CheckCircle2 size={18} />
          <span>{toastMessage}</span>
        </div>
      )}

      <main className={styles.detailMainContainer}>
        {/* Top Navigation Row: Back Link, Search Bar, and Category Switcher */}
        <div className={styles.topNavRow}>
          <Link to="/dashboard/merchant" className={styles.backLink}>
            <ArrowLeft size={16} />
            <span>← Back to Dashboard</span>
          </Link>

          {/* Search Bar */}
          <div className={styles.searchBox}>
            <Search size={16} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search scrap material (e.g. Copper, Iron, Steel)..."
              value={searchQuery}
              onChange={(e) => {
                const q = e.target.value;
                setSearchQuery(q);
                if (q.trim() !== '') {
                  const match = prices.find(
                    (p) =>
                      (p.name && p.name.toLowerCase().includes(q.toLowerCase())) ||
                      (p.category && p.category.toLowerCase().includes(q.toLowerCase()))
                  );
                  if (match) {
                    handleSelectMaterial(match.id, true);
                  }
                }
              }}
              className={styles.searchInput}
            />
            {searchQuery && (
              <button
                type="button"
                className={styles.clearSearchBtn}
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
              >
                ×
              </button>
            )}
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className={styles.categoryPillsRow}>
          <div className={styles.categoryPillsTrack}>
            <button
              type="button"
              className={[
                styles.materialPillBtn,
                selectedCatId === 'all' ? styles.materialPillActive : '',
              ].join(' ')}
              onClick={() => {
                setSelectedCatId('all');
                if (prices.length > 0) handleSelectMaterial(prices[0].id, true);
              }}
            >
              All Categories ({prices.length})
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
                  if (firstInCat) handleSelectMaterial(firstInCat.id, true);
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
                onClick={() => handleSelectMaterial(mat.id, true)}
              >
                {mat.name || mat.category}
              </button>
            ))}
          </div>
        )}

        {loading || !activePrice ? (
          <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: '2rem' }}>
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : (
          /* 2. Main Product/Price 2-Column Area with Big Image */
          <div className={styles.detailGridDesktop}>
            {/* Left Column: Big Material Image Space */}
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
                        <Cpu size={56} />
                      ) : activePrice.categoryId === 'CAT_PAPER' ||
                        activePrice.categoryId === 'CAT_CARDBOARD' ? (
                        <FileText size={56} />
                      ) : activePrice.categoryId === 'CAT_PLASTIC' ? (
                        <Sparkles size={56} />
                      ) : (
                        <Layers size={56} />
                      )}
                    </div>
                    <span className={styles.placeholderText}>
                      {activePrice.name || activePrice.category} Photo
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Rate Information & Merchant Price Updating Feature */}
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
                    'Verified recyclable commodities and industrial scrap'}
                </p>
              </div>

              {/* 1. Indicative Market Rate Benchmark Card */}
              <div className={styles.marketRateCard}>
                <div className={styles.rateCardHeader}>
                  <span className={styles.rateCardTitle}>CHENNAI MARKET BENCHMARK</span>
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

              {/* 2. Merchant Custom Buying Rate Updater Box */}
              <div className={styles.merchantRateUpdaterCard}>
                <div className={styles.updaterHeaderRow}>
                  <div>
                    <span className={styles.updaterLabel}>YOUR PRICE</span>
                    <h3 className={styles.updaterSub}>Set YOUR Price to win more customer pickup orders</h3>
                  </div>
                  <span
                    className={
                      Number(currentMerchantRate) >= Math.round((minPrice + maxPrice) / 2) && Number(currentMerchantRate) > 0
                        ? styles.rateCompetitiveTag
                        : styles.rateStandardTag
                    }
                  >
                    {Number(currentMerchantRate) >= Math.round((minPrice + maxPrice) / 2) && Number(currentMerchantRate) > 0
                      ? '🔥 Competitive Rate'
                      : 'Standard Rate'}
                  </span>
                </div>

                <div className={styles.stepperControlRow}>
                  <button
                    type="button"
                    className={styles.stepperBtn}
                    onClick={() =>
                      handleStepRate(
                        activePrice.id,
                        activePrice.unit.toLowerCase().includes('piece') ? -50 : -1
                      )
                    }
                    aria-label="Decrease price"
                  >
                    <Minus size={18} />
                  </button>

                  <div className={styles.inputPriceWrap}>
                    <span className={styles.inputCurrency}>₹</span>
                    <input
                      type="number"
                      min="0"
                      max="10000"
                      value={currentMerchantRate}
                      placeholder="0"
                      onChange={(e) =>
                        handleRateChange(activePrice.id, e.target.value)
                      }
                      className={styles.priceNumberInput}
                    />
                    <span className={styles.inputUnit}>/{activePrice.unit}</span>
                  </div>

                  <button
                    type="button"
                    className={styles.stepperBtn}
                    onClick={() =>
                      handleStepRate(
                        activePrice.id,
                        activePrice.unit.toLowerCase().includes('piece') ? 50 : 1
                      )
                    }
                    aria-label="Increase price"
                  >
                    <Plus size={18} />
                  </button>
                </div>

                <div className={styles.updaterActionsRow}>
                  <button
                    type="button"
                    className={styles.resetBenchmarkBtn}
                    onClick={handleResetToBenchmark}
                  >
                    <RotateCcw size={14} />
                    <span>Reset to Benchmark</span>
                  </button>

                  <button
                    type="button"
                    className={styles.saveRateBtn}
                    onClick={handleSaveActiveRate}
                  >
                    <Save size={15} />
                    <span>Save YOUR Price</span>
                  </button>
                </div>
              </div>

              {/* Price Notice Box */}
              <div className={styles.priceNoticeBox}>
                <Info size={16} />
                <span>
                  <strong>Merchant Tip:</strong> YOUR Price is displayed on search results to customers in your service area. Updating daily keeps your quotes competitive.
                </span>
              </div>
            </div>
          </div>
        )}

        {/* 3. Browse More Items in this Category Grid */}
        {categoryMaterials.length > 0 && (
          <section className={styles.relatedMaterialsSection}>
            <div className={styles.relatedSectionHeader}>
              <h3 className={styles.relatedSectionTitle}>
                All Materials in {activeCategory?.name || 'this category'} ({categoryMaterials.length})
              </h3>
              <p className={styles.relatedSectionSub}>
                Click any material card below to inspect its large image and adjust YOUR Price.
              </p>
            </div>

            <div className={styles.relatedGrid}>
              {categoryMaterials.map((mat) => {
                const matMin = mat.priceMin ?? Math.round(mat.price * 0.9);
                const matMax = mat.priceMax ?? Math.round(mat.price * 1.1);
                const rawMatRate = merchantRates[mat.id];
                const matRate = rawMatRate === '' || rawMatRate === undefined ? 0 : Number(rawMatRate);
                return (
                  <div
                    key={mat.id}
                    onClick={() => handleSelectMaterial(mat.id, true)}
                    className={[
                      styles.relatedCardWrapper,
                      activePrice?.id === mat.id ? styles.relatedCardActive : '',
                    ].join(' ')}
                  >
                    <PriceCard
                      price={mat}
                      yourPrice={matRate}
                      isActive={activePrice?.id === mat.id}
                      onClick={() => handleSelectMaterial(mat.id, true)}
                    />
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
