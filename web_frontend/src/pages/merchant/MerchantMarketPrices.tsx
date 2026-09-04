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
  Edit3,
  X,
} from 'lucide-react';
import { SkeletonCard } from '@/components/common';
import { PriceCard } from '@/components/cards/PriceCard';
import { getMarketPrices, getScrapCategories } from '@/services';
import type { MarketPrice, ScrapCategory } from '@/types';
import styles from './MerchantMarketPrices.module.css';

interface MerchantCustomPriceRecord {
  rate: number;
  updatedAt: string;
}

const STORAGE_KEY = 'billscrap_merchant_custom_prices';

function formatUpdatedTime(dateInput: string | Date | undefined): string {
  if (!dateInput) return 'Today, 9:30 AM';
  const d = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  if (isNaN(d.getTime())) {
    return String(dateInput);
  }
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);

  if (diffSec < 60) {
    return 'Just now';
  }
  if (diffMin < 60) {
    return `${diffMin}m ago`;
  }

  const isToday =
    d.getDate() === now.getDate() &&
    d.getMonth() === now.getMonth() &&
    d.getFullYear() === now.getFullYear();

  const timeStr = d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
  if (isToday) {
    return `Today, ${timeStr}`;
  }
  return `${d.toLocaleDateString([], { month: 'short', day: 'numeric' })}, ${timeStr}`;
}

export default function MerchantMarketPrices() {
  const { i18n } = useTranslation();
  const [searchParams] = useSearchParams();

  const [prices, setPrices] = useState<MarketPrice[]>([]);
  const [categories, setCategories] = useState<ScrapCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCatId, setSelectedCatId] = useState<string>('CAT_IRON');
  const [selectedMaterialId, setSelectedMaterialId] = useState<string>('IRON_001');
  const [searchQuery, setSearchQuery] = useState('');

  // Merchant Custom Rates State (persisted with rate and updatedAt timestamp)
  const [merchantRates, setMerchantRates] = useState<Record<string, MerchantCustomPriceRecord>>({});
  const [inputRate, setInputRate] = useState<string>('0');
  const [mobileRates, setMobileRates] = useState<Record<string, string>>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [openUpdaterId, setOpenUpdaterId] = useState<string | null>(null);

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

      // Initialize merchant custom rates from localStorage or default to market benchmark
      let storedRates: Record<string, MerchantCustomPriceRecord> = {};
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          storedRates = JSON.parse(saved);
        }
      } catch (e) {
        console.warn('Failed to parse saved merchant custom prices', e);
      }

      const initialRates: Record<string, MerchantCustomPriceRecord> = {};
      priceData.forEach((p) => {
        if (storedRates[p.id]) {
          initialRates[p.id] = storedRates[p.id];
        } else {
          initialRates[p.id] = {
            rate: p.price,
            updatedAt: 'Today, 9:30 AM',
          };
        }
      });
      setMerchantRates(initialRates);

      // Set input rate for initial active material
      const initialActive = initialRates[initialMat];
      if (initialActive) {
        setInputRate(String(initialActive.rate));
      }

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
      }
    }
  }, [searchParams, prices]);

  // Sync inputRate when switching selected material
  useEffect(() => {
    if (selectedMaterialId && merchantRates[selectedMaterialId] !== undefined) {
      setInputRate(String(merchantRates[selectedMaterialId].rate));
    }
  }, [selectedMaterialId, merchantRates]);

  const handleSelectMaterial = (matId: string) => {
    setSelectedMaterialId(matId);
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

  const activeRecord = activePrice ? merchantRates[activePrice.id] : undefined;
  const savedRate = activeRecord !== undefined ? activeRecord.rate : (activePrice?.price ?? 0);
  const savedUpdatedAt = activeRecord !== undefined ? activeRecord.updatedAt : 'Today, 9:30 AM';
  const formattedTime = formatUpdatedTime(savedUpdatedAt);
  const benchmarkAvg = Math.round((minPrice + maxPrice) / 2);

  const diffVsAvg = savedRate - benchmarkAvg;
  let comparisonText = 'Matches Chennai average';
  if (diffVsAvg > 0) {
    comparisonText = `+₹${diffVsAvg}/${activePrice?.unit || 'kg'} above market avg`;
  } else if (diffVsAvg < 0) {
    comparisonText = `₹${Math.abs(diffVsAvg)}/${activePrice?.unit || 'kg'} below market avg`;
  }

  // Rate change handlers (supports fluid typing & complete deletion of 0)
  const handleInputRateChange = (val: string) => {
    if (val === '') {
      setInputRate('');
      return;
    }
    const num = Math.max(0, Math.min(10000, Number(val)));
    setInputRate(isNaN(num) ? '' : String(Math.round(num)));
  };

  const handleStepRate = (step: number) => {
    const current = inputRate === '' ? 0 : Number(inputRate);
    const nextVal = Math.min(10000, Math.max(0, Math.round(current + step)));
    setInputRate(String(nextVal));
  };

  const handleQuickPreset = (preset: number | 'match-avg') => {
    if (!activePrice) return;
    if (preset === 'match-avg') {
      setInputRate(String(benchmarkAvg));
      return;
    }
    const current = inputRate === '' ? 0 : Number(inputRate);
    const nextVal = Math.min(10000, Math.max(0, Math.round(current + preset)));
    setInputRate(String(nextVal));
  };

  const handleSaveActiveRate = () => {
    if (!activePrice) return;
    const newRate = Math.max(0, Math.round(Number(inputRate) || 0));
    const nowIso = new Date().toISOString();
    const updatedRecord: MerchantCustomPriceRecord = {
      rate: newRate,
      updatedAt: nowIso,
    };
    const nextRates = {
      ...merchantRates,
      [activePrice.id]: updatedRecord,
    };
    setMerchantRates(nextRates);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextRates));
    } catch (e) {
      console.warn('Failed to save merchant custom price', e);
    }
    showToast(
      `✓ Published YOUR Price for ${activePrice.name || activePrice.category}: ₹${newRate}/${activePrice.unit} (Updated just now)`
    );
  };

  const handleResetToBenchmark = () => {
    if (!activePrice) return;
    const benchmarkRate = activePrice.price;
    setInputRate(String(benchmarkRate));
    const nowIso = new Date().toISOString();
    const updatedRecord: MerchantCustomPriceRecord = {
      rate: benchmarkRate,
      updatedAt: nowIso,
    };
    const nextRates = {
      ...merchantRates,
      [activePrice.id]: updatedRecord,
    };
    setMerchantRates(nextRates);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextRates));
    } catch (e) {
      console.warn('Failed to save merchant custom price', e);
    }
    showToast(
      `Reset YOUR Price for ${activePrice.name || activePrice.category} to benchmark ₹${benchmarkRate}/${activePrice.unit}`
    );
  };

  // Mobile in-card rate change handlers (for mobile screens only)
  const handleMobileRateChange = (matId: string, val: string) => {
    if (val === '') {
      setMobileRates((prev) => ({ ...prev, [matId]: '' }));
      return;
    }
    const num = Math.max(0, Math.min(10000, Number(val)));
    setMobileRates((prev) => ({
      ...prev,
      [matId]: isNaN(num) ? '' : String(Math.round(num)),
    }));
  };

  const handleMobileStepRate = (mat: MarketPrice, step: number) => {
    const raw =
      mobileRates[mat.id] !== undefined
        ? mobileRates[mat.id]
        : String(merchantRates[mat.id]?.rate ?? mat.price);
    const current = raw === '' ? 0 : Number(raw);
    const nextVal = Math.max(0, Math.min(10000, Math.round(current + step)));
    setMobileRates((prev) => ({ ...prev, [mat.id]: String(nextVal) }));
  };

  const handleMobileQuickPreset = (mat: MarketPrice, delta: number | 'match-avg') => {
    const matMin = mat.priceMin ?? Math.round(mat.price * 0.9);
    const matMax = mat.priceMax ?? Math.round(mat.price * 1.1);
    const avg = Math.round((matMin + matMax) / 2);
    if (delta === 'match-avg') {
      setMobileRates((prev) => ({ ...prev, [mat.id]: String(avg) }));
      return;
    }
    const raw =
      mobileRates[mat.id] !== undefined
        ? mobileRates[mat.id]
        : String(merchantRates[mat.id]?.rate ?? mat.price);
    const current = raw === '' ? 0 : Number(raw);
    const nextVal = Math.max(0, Math.min(10000, Math.round(current + delta)));
    setMobileRates((prev) => ({ ...prev, [mat.id]: String(nextVal) }));
  };

  const handleMobileSaveRate = (mat: MarketPrice) => {
    const raw =
      mobileRates[mat.id] !== undefined
        ? mobileRates[mat.id]
        : String(merchantRates[mat.id]?.rate ?? mat.price);
    const newRate = Math.max(0, Math.round(Number(raw) || 0));
    const nowIso = new Date().toISOString();
    const updatedRecord: MerchantCustomPriceRecord = {
      rate: newRate,
      updatedAt: nowIso,
    };
    const nextRates = {
      ...merchantRates,
      [mat.id]: updatedRecord,
    };
    setMerchantRates(nextRates);
    setMobileRates((prev) => ({ ...prev, [mat.id]: String(newRate) }));
    if (activePrice?.id === mat.id) {
      setInputRate(String(newRate));
    }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextRates));
    } catch (e) {
      console.warn('Failed to save merchant custom price', e);
    }
    showToast(
      `✓ Saved YOUR Price for ${mat.name || mat.category}: ₹${newRate}/${mat.unit} (Updated just now)`
    );
  };

  const handleMobileResetRate = (mat: MarketPrice) => {
    const benchmarkRate = mat.price;
    const nowIso = new Date().toISOString();
    const updatedRecord: MerchantCustomPriceRecord = {
      rate: benchmarkRate,
      updatedAt: nowIso,
    };
    const nextRates = {
      ...merchantRates,
      [mat.id]: updatedRecord,
    };
    setMerchantRates(nextRates);
    setMobileRates((prev) => ({ ...prev, [mat.id]: String(benchmarkRate) }));
    if (activePrice?.id === mat.id) {
      setInputRate(String(benchmarkRate));
    }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextRates));
    } catch (e) {
      console.warn('Failed to save merchant custom price', e);
    }
    showToast(
      `Reset YOUR Price for ${mat.name || mat.category} to benchmark ₹${benchmarkRate}/${mat.unit}`
    );
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
                    handleSelectMaterial(match.id);
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
                if (prices.length > 0) handleSelectMaterial(prices[0].id);
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
                  if (firstInCat) handleSelectMaterial(firstInCat.id);
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
                onClick={() => handleSelectMaterial(mat.id)}
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
                    <span className={styles.updaterLabel}>YOUR PRICE CONTROL</span>
                    <h3 className={styles.updaterSub}>Set & publish YOUR buying price to customers</h3>
                  </div>
                  <span
                    className={
                      savedRate >= benchmarkAvg && savedRate > 0
                        ? styles.rateCompetitiveTag
                        : styles.rateStandardTag
                    }
                  >
                    {savedRate >= benchmarkAvg && savedRate > 0
                      ? '🔥 Competitive Rate'
                      : 'Standard Rate'}
                  </span>
                </div>

                {/* Prominent Active Published Price Display Card */}
                <div className={styles.activePriceDisplayCard}>
                  <div className={styles.activePriceTopRow}>
                    <div className={styles.activePriceAmountBlock}>
                      <span className={styles.activePriceLabel}>Current Published Rate</span>
                      <div className={styles.activePriceNumberRow}>
                        <span className={styles.activePriceValue}>₹{savedRate.toLocaleString('en-IN')}</span>
                        <span className={styles.activePriceUnit}>/{activePrice.unit}</span>
                      </div>
                    </div>
                    <div className={styles.activePriceStatusPill}>
                      <span className={styles.pulseLiveDot} />
                      <span>Live for Customers</span>
                    </div>
                  </div>

                  <div className={styles.activePriceUpdatedRow}>
                    <Clock size={14} className={styles.activePriceClockIcon} />
                    <span className={styles.activePriceUpdatedText}>
                      Updated: <strong>{formattedTime}</strong>
                    </span>
                    <span className={styles.activePriceComparisonText}>
                      {comparisonText}
                    </span>
                  </div>
                </div>

                {/* Price Editor Controls */}
                <div className={styles.priceEditorWrap}>
                  <div className={styles.editorLabelRow}>
                    <span className={styles.editorSectionLabel}>Adjust Buying Price</span>
                    <span className={styles.editorTip}>Whole ₹ integers only</span>
                  </div>

                  <div className={styles.stepperControlRow}>
                    <button
                      type="button"
                      className={styles.stepperBtn}
                      onClick={() =>
                        handleStepRate(
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
                        value={inputRate}
                        placeholder="0"
                        onChange={(e) => handleInputRateChange(e.target.value)}
                        className={styles.priceNumberInput}
                      />
                      <span className={styles.inputUnit}>/{activePrice.unit}</span>
                    </div>

                    <button
                      type="button"
                      className={styles.stepperBtn}
                      onClick={() =>
                        handleStepRate(
                          activePrice.unit.toLowerCase().includes('piece') ? 50 : 1
                        )
                      }
                      aria-label="Increase price"
                    >
                      <Plus size={18} />
                    </button>
                  </div>

                  {/* Quick Preset Buttons */}
                  <div className={styles.quickPresetsRow}>
                    <span className={styles.quickPresetLabel}>Quick Adjust:</span>
                    <button
                      type="button"
                      className={styles.quickPresetBtn}
                      onClick={() => handleQuickPreset(2)}
                    >
                      +₹2
                    </button>
                    <button
                      type="button"
                      className={styles.quickPresetBtn}
                      onClick={() => handleQuickPreset(5)}
                    >
                      +₹5
                    </button>
                    <button
                      type="button"
                      className={styles.quickPresetBtn}
                      onClick={() => handleQuickPreset(10)}
                    >
                      +₹10
                    </button>
                    <button
                      type="button"
                      className={styles.quickPresetBtn}
                      onClick={() => handleQuickPreset(-2)}
                    >
                      -₹2
                    </button>
                    <button
                      type="button"
                      className={styles.quickPresetBtn}
                      onClick={() => handleQuickPreset('match-avg')}
                    >
                      Match Avg (₹{benchmarkAvg})
                    </button>
                  </div>
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
                    <span>Save & Publish YOUR Price</span>
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
                const matRecord = merchantRates[mat.id];
                const matRate = matRecord !== undefined ? matRecord.rate : mat.price;
                const matUpdatedAt = matRecord !== undefined ? matRecord.updatedAt : 'Today, 9:30 AM';
                const matMin = mat.priceMin ?? Math.round(mat.price * 0.9);
                const matMax = mat.priceMax ?? Math.round(mat.price * 1.1);
                const matAvg = Math.round((matMin + matMax) / 2);

                const currentMobileInput =
                  mobileRates[mat.id] !== undefined
                    ? mobileRates[mat.id]
                    : String(matRate);

                return (
                  <div
                    key={mat.id}
                    onClick={() => handleSelectMaterial(mat.id)}
                    className={[
                      styles.relatedCardWrapper,
                      activePrice?.id === mat.id ? styles.relatedCardActive : '',
                    ].join(' ')}
                  >
                    <PriceCard
                      price={mat}
                      yourPrice={matRate}
                      yourPriceUpdatedAt={formatUpdatedTime(matUpdatedAt)}
                      isActive={activePrice?.id === mat.id}
                      onClick={() => handleSelectMaterial(mat.id)}
                    >
                      {openUpdaterId === mat.id ? (
                        /* In-Card Price Updater - Signature Note Theme (Warm Butter Yellow) */
                        <div
                          className={styles.mobileCardUpdater}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className={styles.mobileUpdaterHeader}>
                            <span className={styles.mobileUpdaterLabel}>UPDATE YOUR PRICE</span>
                            <div className={styles.mobileUpdaterHeaderRight}>
                              <span className={styles.mobileBenchmarkHint}>
                                Avg: ₹{matAvg}/{mat.unit}
                              </span>
                              <button
                                type="button"
                                className={styles.mobileCloseUpdaterBtn}
                                onClick={() => setOpenUpdaterId(null)}
                                aria-label="Close updater"
                              >
                                <X size={15} />
                              </button>
                            </div>
                          </div>

                          <div className={styles.mobileStepperRow}>
                            <button
                              type="button"
                              className={styles.mobileStepperBtn}
                              onClick={() =>
                                handleMobileStepRate(
                                  mat,
                                  mat.unit.toLowerCase().includes('piece') ? -50 : -1
                                )
                              }
                              aria-label="Decrease price"
                            >
                              <Minus size={16} />
                            </button>

                            <div className={styles.mobileInputWrap}>
                              <span className={styles.mobileInputCurrency}>₹</span>
                              <input
                                type="number"
                                min="0"
                                max="10000"
                                value={currentMobileInput}
                                placeholder="0"
                                onChange={(e) =>
                                  handleMobileRateChange(mat.id, e.target.value)
                                }
                                className={styles.mobilePriceInput}
                              />
                              <span className={styles.mobileInputUnit}>/{mat.unit}</span>
                            </div>

                            <button
                              type="button"
                              className={styles.mobileStepperBtn}
                              onClick={() =>
                                handleMobileStepRate(
                                  mat,
                                  mat.unit.toLowerCase().includes('piece') ? 50 : 1
                                )
                              }
                              aria-label="Increase price"
                            >
                              <Plus size={16} />
                            </button>
                          </div>

                          {/* Actions: Reset, Cancel & Save */}
                          <div className={styles.mobileUpdaterActions}>
                            <button
                              type="button"
                              className={styles.mobileResetBtn}
                              onClick={() => handleMobileResetRate(mat)}
                              title="Reset to market benchmark"
                            >
                              <RotateCcw size={13} />
                              <span>Reset</span>
                            </button>

                            <button
                              type="button"
                              className={styles.mobileCancelBtn}
                              onClick={() => setOpenUpdaterId(null)}
                            >
                              <span>Cancel</span>
                            </button>

                            <button
                              type="button"
                              className={styles.mobileSaveBtn}
                              onClick={() => {
                                handleMobileSaveRate(mat);
                                setOpenUpdaterId(null);
                              }}
                            >
                              <Save size={14} />
                              <span>Save</span>
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          type="button"
                          className={styles.openUpdaterBtn}
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenUpdaterId(mat.id);
                          }}
                        >
                          <Edit3 size={13} />
                          <span>Update your price</span>
                        </button>
                      )}
                    </PriceCard>
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
