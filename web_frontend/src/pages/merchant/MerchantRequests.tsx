import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Zap,
  Tag,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  User,
  Building,
  MapPin,
  Calendar,
  Clock,
  Check,
  X,
  Eye,
  Filter,
  TrendingUp,
  FileText,
  DollarSign,
  Lock,
  Phone,
  Mail,
  AlertCircle,
  Mic,
  Square,
  Play,
  Pause,
  Trash2,
  CheckCircle2,
  Volume2,
  AlertTriangle,
  Truck,
  ArrowRight,
  Search,
  Plus,
  Layers,
} from 'lucide-react';
import { CardImageGallery } from '@/components/cards/CardImageGallery';
import { getPrivacyArea } from '@/utils/locationPrivacy';
import { MARKET_SCRAP_CATEGORIES, type MarketScrapSubItem } from './MerchantOrders';
import styles from './MerchantRequests.module.css';

export interface QuoteProductLine {
  id: string;
  name: string;
  quantity: string;
  unit: string;
  estimatedQtyNumber: number;
  ratePerUnit: number;
  marketRate?: number;
  categoryIcon?: string;
  categoryName?: string;
}

export interface QuotedItemRate {
  id?: string;
  name: string;
  ratePerUnit: number;
  unit: string;
}

export interface QuoteOfferItem {
  id: string;
  customerName: string;
  customerType: 'Industry' | 'Individual';
  materialName: string;
  materialCondition: string;
  image: string;
  images?: string[];
  quantity: string;
  address: string;
  quotedPrice?: number;
  itemsQuoted: QuotedItemRate[];
  pickupSlot: string;
  submittedAgo: string;
  status: 'Waiting' | 'Accepted' | 'Rejected' | 'Expired';
  statusType: 'waiting' | 'accepted' | 'rejected' | 'expired';
  statusBadgeText: string;
}

export interface RequestItem {
  id: string;
  posterName: string;
  requesterType: 'Industry' | 'Individual';
  materialName: string;
  materialCondition: 'Mixed' | 'Clean' | 'Segregated';
  image: string;
  images?: string[];
  quantity: string;
  address: string;
  pickupDate: string;
  pickupTime: string;
  respondTime: string;
  respondDate: string;
  requestedAgo: string;
  status: 'pending' | 'accepted' | 'denied';
  submittedQuote?: {
    price: number;
    pickupDate: string;
    pickupTime: string;
    hasVoiceNote: boolean;
    note?: string;
  };
}

const INITIAL_INDUSTRY_REQUESTS: RequestItem[] = [
  {
    id: 'REQ-250512-00078',
    posterName: 'Sri Venkatesh Heavy Industries',
    requesterType: 'Industry',
    materialName: 'Heavy Melting Steel Scrap',
    materialCondition: 'Mixed',
    image: '/industry-steel-scrap.jpg',
    images: ['/industry-steel-scrap.jpg', '/scrap-quality-steel.jpg', '/scrap-iron.jpg'],
    quantity: '500 – 800 KG',
    address: '24, 5th Main Road, SIDCO Industrial Estate, Guindy, Chennai – 600032',
    pickupDate: '13 May 2025',
    pickupTime: '10:00 AM – 12:00 PM',
    respondTime: '09:45',
    respondDate: '(13 May 2025, 09:15 AM)',
    requestedAgo: 'Requested 5 mins ago',
    status: 'pending',
  },
  {
    id: 'REQ-250512-00077',
    posterName: 'Ambattur Heavy Foundry Works',
    requesterType: 'Industry',
    materialName: 'Industrial Copper Armature & Cable Scrap',
    materialCondition: 'Clean',
    image: '/industry-copper-scrap.jpg',
    images: ['/industry-copper-scrap.jpg', '/scrap-copper-wire.jpg', '/scrap-burned-copper.jpg'],
    quantity: '100 – 200 KG',
    address: '12/1, Ambattur Industrial Estate, Ambattur, Chennai – 600058',
    pickupDate: '13 May 2025',
    pickupTime: '02:00 PM – 04:00 PM',
    respondTime: '12:30',
    respondDate: '(13 May 2025, 01:30 PM)',
    requestedAgo: 'Requested 8 mins ago',
    status: 'pending',
  },
  {
    id: 'REQ-250512-00075',
    posterName: 'Precision Tools & Castings Pvt Ltd',
    requesterType: 'Industry',
    materialName: 'Brass Honey & Alloy Turnings Scrap',
    materialCondition: 'Mixed',
    image: '/scrap-brass.jpg',
    images: ['/scrap-brass.jpg', '/scrap-tin.jpg', '/scrap-ma-solid-alloy.jpg'],
    quantity: '50 – 100 KG',
    address: '16, Porur Industrial Bypass, Porur, Chennai – 600116',
    pickupDate: '13 May 2025',
    pickupTime: '01:00 PM – 03:00 PM',
    respondTime: '21:15',
    respondDate: '(13 May 2025, 04:15 PM)',
    requestedAgo: 'Requested 15 mins ago',
    status: 'pending',
  },
  {
    id: 'REQ-250512-00074',
    posterName: 'Evergreen Packaging Aggregators',
    requesterType: 'Industry',
    materialName: 'Industrial Corrugated Box & Paper Scrap',
    materialCondition: 'Segregated',
    image: '/scrap-cardboard.jpg',
    images: ['/scrap-cardboard.jpg', '/scrap-mixed-papers.jpg', '/scrap-color-papers.jpg'],
    quantity: '300 – 600 KG',
    address: 'No. 45, Velachery Industrial Road, Velachery, Chennai – 600042',
    pickupDate: '14 May 2025',
    pickupTime: '04:00 PM – 06:00 PM',
    respondTime: '23:50',
    respondDate: '(14 May 2025, 11:50 AM)',
    requestedAgo: 'Requested 18 mins ago',
    status: 'pending',
  },
  {
    id: 'REQ-250512-00071',
    posterName: 'Madras Auto Components & Forgings',
    requesterType: 'Industry',
    materialName: 'Commercial Aluminium Profile & Sheet Scrap',
    materialCondition: 'Clean',
    image: '/industry-aluminium-scrap.jpg',
    images: ['/industry-aluminium-scrap.jpg', '/scrap-commercial-aluminium.jpg', '/scrap-household-aluminium.jpg'],
    quantity: '400 – 750 KG',
    address: 'Plot 88, Maraimalai Nagar Industrial Corridor, Chennai – 603209',
    pickupDate: '14 May 2025',
    pickupTime: '03:00 PM – 05:00 PM',
    respondTime: '15:20',
    respondDate: '(14 May 2025, 02:00 PM)',
    requestedAgo: 'Requested 25 mins ago',
    status: 'pending',
  },
];

const INITIAL_HOUSEHOLD_REQUESTS: RequestItem[] = [
  {
    id: 'REQ-250512-00076',
    posterName: 'Ramesh Kumar',
    requesterType: 'Individual',
    materialName: 'Steel Utensils & Structural Scrap',
    materialCondition: 'Mixed',
    image: '/scrap-quality-steel.png',
    images: ['/scrap-quality-steel.png', '/scrap-iron.jpg', '/scrap-low-quality-steel.jpg'],
    quantity: '80 – 150 KG',
    address: '8, Padi High Street, Anna Nagar West Extension, Chennai – 600050',
    pickupDate: '14 May 2025',
    pickupTime: '09:00 AM – 11:00 AM',
    respondTime: '18:20',
    respondDate: '(14 May 2025, 08:20 AM)',
    requestedAgo: 'Requested 12 mins ago',
    status: 'pending',
  },
  {
    id: 'REQ-250512-00073',
    posterName: 'Priya Sundaram',
    requesterType: 'Individual',
    materialName: 'Mixed E-Waste & Appliances',
    materialCondition: 'Mixed',
    image: '/scrap-iron.png',
    images: ['/scrap-cpu.jpg', '/scrap-monitor.jpg', '/scrap-chargers.jpg'],
    quantity: '40 – 70 KG',
    address: 'Flat 3B, Sunshine Apartments, T. Nagar, Chennai – 600017',
    pickupDate: '14 May 2025',
    pickupTime: '11:00 AM – 01:00 PM',
    respondTime: '25:00',
    respondDate: '(14 May 2025, 10:30 AM)',
    requestedAgo: 'Requested 22 mins ago',
    status: 'pending',
  },
  {
    id: 'REQ-250512-00072',
    posterName: 'Dr. S. K. Subramanian',
    requesterType: 'Individual',
    materialName: 'Newspapers & Textbook Paper',
    materialCondition: 'Clean',
    image: '/scrap-cardboard.png',
    images: ['/scrap-cardboard.png', '/scrap-white-paper.jpg', '/scrap-magazines.jpg'],
    quantity: '50 – 90 KG',
    address: '14, 2nd Avenue, Besant Nagar, Chennai – 600090',
    pickupDate: '15 May 2025',
    pickupTime: '08:00 AM – 10:00 AM',
    respondTime: '30:00',
    respondDate: '(15 May 2025, 07:30 AM)',
    requestedAgo: 'Requested 35 mins ago',
    status: 'pending',
  },
];

// Helper functions for concise, scannable cards
function getShortLocation(fullAddress: string, posterName?: string): string {
  return getPrivacyArea(fullAddress, posterName);
}

function formatPickupSlot(dateStr: string, timeStr: string): string {
  const shortDate = dateStr.replace(/\s*\d{4}/, '').trim();
  const shortTime = timeStr.replace(/:00/g, '').replace(/\s*–\s*/g, '–');
  return `${shortDate} · ${shortTime}`;
}

function formatRelativeTime(requestedAgo: string): string {
  return requestedAgo.replace(/requested\s*/i, '').replace(/mins/i, 'min');
}

function getShortSlot(slotStr: string): string {
  if (!slotStr) return '';
  return slotStr.replace(/\s*\d{4}/, '').replace(/:00/g, '').replace(/\s*–\s*/g, '–');
}

function CompactCardImageSlider({
  images,
  fallbackImage = '/logo-icon.png',
  alt,
}: {
  images?: string[];
  fallbackImage?: string;
  alt: string;
}) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const touchStartXRef = useRef<number | null>(null);
  const list = images && images.length > 0 ? images : [fallbackImage];
  const total = list.length;
  const currentSrc = list[currentIdx] || fallbackImage;

  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (typeof window !== 'undefined' && window.getSelection) {
      window.getSelection()?.removeAllRanges();
    }
    setCurrentIdx((prev) => (prev === 0 ? total - 1 : prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (typeof window !== 'undefined' && window.getSelection) {
      window.getSelection()?.removeAllRanges();
    }
    setCurrentIdx((prev) => (prev === total - 1 ? 0 : prev + 1));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const endX = e.changedTouches[0].clientX;
    const diff = touchStartXRef.current - endX;
    if (Math.abs(diff) > 30) {
      if (diff > 0) {
        setCurrentIdx((prev) => (prev === total - 1 ? 0 : prev + 1));
      } else {
        setCurrentIdx((prev) => (prev === 0 ? total - 1 : prev - 1));
      }
    }
    touchStartXRef.current = null;
  };

  return (
    <div
      className={styles.compactImageFrame}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <img
        src={currentSrc}
        alt={`${alt} (${currentIdx + 1} of ${total})`}
        className={styles.compactImage}
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).src = fallbackImage;
        }}
      />
      {total > 1 && (
        <>
          <button
            type="button"
            className={`${styles.compactImgNavBtn} ${styles.compactImgNavLeft}`}
            onClick={handlePrev}
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            onTouchStart={(e) => {
              e.stopPropagation();
            }}
            aria-label="Previous image"
            title="Previous image"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            className={`${styles.compactImgNavBtn} ${styles.compactImgNavRight}`}
            onClick={handleNext}
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            onTouchStart={(e) => {
              e.stopPropagation();
            }}
            aria-label="Next image"
            title="Next image"
          >
            <ChevronRight size={16} />
          </button>
          <span className={styles.compactImageCounter}>
            {currentIdx + 1}/{total}
          </span>
        </>
      )}
    </div>
  );
}

function OfferItemsList({
  offerId,
  items,
  fallbackName = 'Scrap Material',
  statusType = 'waiting',
}: {
  offerId: string;
  items?: QuotedItemRate[];
  fallbackName?: string;
  statusType?: 'accepted' | 'waiting' | 'rejected' | 'expired';
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  const resolvedItems: QuotedItemRate[] =
    items && items.length > 0
      ? items
      : [{ name: fallbackName, ratePerUnit: 0, unit: 'KG' }];

  const totalItems = resolvedItems.length;
  const VISIBLE_COUNT = 3;
  const hasMoreThan3 = totalItems > VISIBLE_COUNT;

  // Show only 3 items properly when collapsed, and all items when expanded
  const displayedItems = isExpanded ? resolvedItems : resolvedItems.slice(0, VISIBLE_COUNT);

  return (
    <div className={styles.offerRatesSection}>
      <div className={styles.offerRatesSectionHeader}>
        <span className={styles.offerRatesHeaderTitle}>
          Offered Prices ({totalItems} {totalItems === 1 ? 'item' : 'items'})
        </span>
        <span className={styles.offerRatesWeightNote}>Payable on scale weight</span>
      </div>

      <div className={styles.offerItemsListContainer}>
        {displayedItems.map((it, idx) => (
          <div key={`${offerId}-rate-${idx}`} className={styles.offerItemRow}>
            <div className={styles.offerItemLeft}>
              <span className={styles.offerItemDot}>•</span>
              <span className={styles.offerItemNameText} title={it.name}>
                {it.name}
              </span>
            </div>
            <div
              className={`${styles.offerItemPriceBadge} ${
                statusType === 'rejected' || statusType === 'expired'
                  ? styles.priceBadgeMuted
                  : ''
              }`}
            >
              <strong className={styles.offerItemRateText}>₹{it.ratePerUnit || 0}</strong>
              <span className={styles.offerItemUnitText}>/ {it.unit}</span>
            </div>
          </div>
        ))}
      </div>

      {hasMoreThan3 && (
        <button
          type="button"
          className={styles.viewMoreOfferItemsBtn}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsExpanded((prev) => !prev);
          }}
          aria-expanded={isExpanded}
        >
          <span>{isExpanded ? 'View Less' : `View More (+${totalItems - VISIBLE_COUNT} items)`}</span>
          {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
      )}
    </div>
  );
}

export default function MerchantRequests() {
  const [primaryTab, setPrimaryTab] = useState<'available' | 'offers'>('available');
  const [offerFilter, setOfferFilter] = useState<'all' | 'waiting' | 'accepted' | 'closed'>('all');
  const [activeTab, setActiveTab] = useState<'Industry' | 'Individual'>('Industry');
  const [industryRequests, setIndustryRequests] = useState<RequestItem[]>(INITIAL_INDUSTRY_REQUESTS);
  const [householdRequests, setHouseholdRequests] = useState<RequestItem[]>(INITIAL_HOUSEHOLD_REQUESTS);

  const [submittedOffers, setSubmittedOffers] = useState<QuoteOfferItem[]>([
    {
      id: 'QUO-250512-00075',
      customerName: 'Precision Tools & Castings Pvt Ltd',
      customerType: 'Industry',
      materialName: 'Brass Scrap',
      materialCondition: 'Mixed Condition',
      image: '/scrap-brass.jpg',
      quantity: '50 – 100 KG',
      address: '16, Porur Main Road, Porur, Chennai – 600116, Tamil Nadu',
      itemsQuoted: [
        { name: 'Brass Scrap', ratePerUnit: 390, unit: 'KG' },
        { name: 'MA - solid alloy', ratePerUnit: 340, unit: 'KG' },
      ],
      pickupSlot: '12 May 2025, 01:00 PM – 03:00 PM',
      submittedAgo: 'Submitted 2 hours ago',
      status: 'Accepted',
      statusType: 'accepted',
      statusBadgeText: 'Customer Accepted',
    },
    {
      id: 'QUO-250512-00078',
      customerName: 'Sri Venkatesh Heavy Industries',
      customerType: 'Industry',
      materialName: 'Scrap Iron',
      materialCondition: 'Clean Segregated',
      image: '/industry-steel-scrap.jpg',
      quantity: '500 – 800 KG',
      address: '24, 5th Main Road, SIDCO Industrial Estate, Guindy, Chennai',
      itemsQuoted: [
        { name: 'Scrap Iron', ratePerUnit: 42, unit: 'KG' },
      ],
      pickupSlot: '13 May 2025, 10:00 AM – 12:00 PM',
      submittedAgo: 'Submitted 35 mins ago',
      status: 'Waiting',
      statusType: 'waiting',
      statusBadgeText: 'Waiting for Response',
    },
    {
      id: 'QUO-250511-00062',
      customerName: 'Karthik Raja (Household)',
      customerType: 'Individual',
      materialName: 'Copper Scrap',
      materialCondition: 'Clean',
      image: '/industry-copper-scrap.jpg',
      quantity: '15 – 25 KG',
      address: '7th Avenue, Anna Nagar, Chennai – 600040',
      itemsQuoted: [
        { name: 'Copper Scrap', ratePerUnit: 720, unit: 'KG' },
      ],
      pickupSlot: '11 May 2025, 04:00 PM',
      submittedAgo: 'Submitted 1 day ago',
      status: 'Rejected',
      statusType: 'rejected',
      statusBadgeText: 'Higher Offer Chosen',
    },
    {
      id: 'QUO-250510-00054',
      customerName: 'Apex Precision Tools',
      customerType: 'Industry',
      materialName: 'commercial aluminium',
      materialCondition: 'Mixed',
      image: '/industry-aluminium-scrap.jpg',
      quantity: '200 – 350 KG',
      address: 'Industrial Estate, Ambattur, Chennai',
      itemsQuoted: [
        { name: 'commercial aluminium', ratePerUnit: 165, unit: 'KG' },
        { name: 'household aluminium', ratePerUnit: 135, unit: 'KG' },
        { name: 'MA - solid alloy', ratePerUnit: 185, unit: 'KG' },
        { name: 'bus body', ratePerUnit: 150, unit: 'KG' },
      ],
      pickupSlot: '10 May 2025, 11:00 AM',
      submittedAgo: 'Submitted 2 days ago',
      status: 'Expired',
      statusType: 'expired',
      statusBadgeText: 'Deadline Expired',
    },
  ]);

  const [selectedScrapFilter, setSelectedScrapFilter] = useState('All Types');
  const [selectedAmountFilter, setSelectedAmountFilter] = useState('All Amounts');
  const [selectedLocationFilter, setSelectedLocationFilter] = useState('All Locations');
  const [extensionTime, setExtensionTime] = useState('+ 15 minutes');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Quote Submission Modal State
  const [activeQuoteRequest, setActiveQuoteRequest] = useState<RequestItem | null>(null);
  const [quoteProductLines, setQuoteProductLines] = useState<QuoteProductLine[]>([]);
  const [quoteSearchQuery, setQuoteSearchQuery] = useState<string>('');
  const [selectedQuoteCatId, setSelectedQuoteCatId] = useState<string>('CAT_IRON');
  const [showCategoryExplorer, setShowCategoryExplorer] = useState<boolean>(false);
  const [quotePickupDate, setQuotePickupDate] = useState<string>('2025-05-13');
  const [quotePickupTime, setQuotePickupTime] = useState<string>('10:00 AM – 12:00 PM');
  const [quoteNote, setQuoteNote] = useState<string>('');
  
  // Voice Recording Simulator State
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [hasRecordedAudio, setHasRecordedAudio] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const recordingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Details Modal State
  const [detailsModalRequest, setDetailsModalRequest] = useState<RequestItem | null>(null);

  // Floating Image Preview Modal State
  const [floatingImage, setFloatingImage] = useState<{
    src: string;
    title: string;
    condition: string;
    quantity: string;
    posterName: string;
    images?: string[];
    currentIndex?: number;
  } | null>(null);

  // Voice recording timer
  useEffect(() => {
    if (isRecording) {
      recordingTimerRef.current = setInterval(() => {
        setRecordingSeconds((sec) => sec + 1);
      }, 1000);
    } else {
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    }
    return () => {
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    };
  }, [isRecording]);

  // Lock background screen scroll when modals are open
  useEffect(() => {
    const isModalOpen = !!(activeQuoteRequest || detailsModalRequest || floatingImage);
    if (isModalOpen) {
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
  }, [activeQuoteRequest, detailsModalRequest, floatingImage]);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Helper to parse estimated numeric quantity and unit
  const parseQtyInfo = (qStr: string): { num: number; unit: string } => {
    const unitMatch = qStr.match(/(KG|TONS?|PIECES?|CAN|UNITS?)/i);
    const unit = unitMatch ? unitMatch[0].toUpperCase() : 'KG';
    const numbers = qStr.match(/\d+/g);
    if (numbers && numbers.length > 0) {
      const avg = numbers.reduce((a, b) => a + Number(b), 0) / numbers.length;
      return { num: Math.round(avg), unit };
    }
    return { num: 100, unit: 'KG' };
  };

  // Helper to match best scrap catalog category for merchant convenience
  const findMatchingCategoryId = (name: string): string => {
    const lower = name.toLowerCase();
    for (const cat of MARKET_SCRAP_CATEGORIES) {
      for (const item of cat.items) {
        if (lower.includes(item.name.toLowerCase()) || item.name.toLowerCase().includes(lower)) {
          return cat.id;
        }
      }
    }
    if (lower.includes('steel') || lower.includes('iron')) return 'CAT_IRON';
    if (lower.includes('plastic') || lower.includes('bottle')) return 'CAT_PLASTIC';
    if (lower.includes('copper') || lower.includes('aluminium') || lower.includes('brass') || lower.includes('metal')) return 'CAT_MATERIAL';
    if (lower.includes('paper') || lower.includes('cardboard') || lower.includes('box')) return 'CAT_PAPER_CARDBOARD';
    if (lower.includes('battery')) return 'CAT_BATTERY';
    if (lower.includes('wire') || lower.includes('cable')) return 'CAT_WIRES';
    if (lower.includes('computer') || lower.includes('cpu') || lower.includes('ewaste')) return 'CAT_EWASTE';
    if (lower.includes('ac') || lower.includes('fridge') || lower.includes('appliance')) return 'CAT_HOME_APPLIANCES';
    return 'CAT_IRON';
  };

  const handleOpenQuoteModal = (req: RequestItem) => {
    setActiveQuoteRequest(req);
    const catId = findMatchingCategoryId(req.materialName);

    // No auto-populated metal price setup - merchant adds permanent catalog items themselves
    setQuoteProductLines([]);
    setQuoteSearchQuery('');
    setSelectedQuoteCatId(catId);
    setShowCategoryExplorer(true); // Open catalog directly for merchant to choose items
    setQuotePickupDate('2025-05-13');
    setQuotePickupTime(req.pickupTime || '10:00 AM – 12:00 PM');
    setQuoteNote('');
    setIsRecording(false);
    setRecordingSeconds(0);
    setHasRecordedAudio(false);
    setIsPlayingAudio(false);
  };

  const handleAddProductFromCatalog = (subItem: MarketScrapSubItem, catIcon?: string, catName?: string) => {
    const existing = quoteProductLines.find((p) => p.name.toLowerCase() === subItem.name.toLowerCase());
    if (existing) {
      triggerToast(`ℹ️ ${subItem.name} is already in your quote items list.`);
      return;
    }
    setQuoteProductLines((prev) => [
      ...prev,
      {
        id: `PROD-${Date.now()}-${prev.length + 1}`,
        name: subItem.name,
        quantity: `100 ${subItem.unit}`,
        unit: subItem.unit,
        estimatedQtyNumber: 100,
        ratePerUnit: subItem.defaultRate,
        marketRate: subItem.defaultRate,
        categoryIcon: catIcon || '📦',
        categoryName: catName || 'General Scrap',
      },
    ]);
    setQuoteSearchQuery('');
    triggerToast(`+ Added ${subItem.name} (₹${subItem.defaultRate}/${subItem.unit}) to quote!`);
  };

  const handleAddCustomQuoteProduct = () => {
    if (!quoteSearchQuery.trim()) return;
    const name = quoteSearchQuery.trim();
    setQuoteProductLines((prev) => [
      ...prev,
      {
        id: `PROD-${Date.now()}-${prev.length + 1}`,
        name,
        quantity: '100 KG',
        unit: 'KG',
        estimatedQtyNumber: 100,
        ratePerUnit: 50,
        marketRate: 50,
        categoryIcon: '✨',
        categoryName: 'Custom Scrap',
      },
    ]);
    setQuoteSearchQuery('');
    triggerToast(`+ Added custom item "${name}" to quote!`);
  };

  const handleUpdateProductRate = (id: string, newRate: number) => {
    setQuoteProductLines((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ratePerUnit: Math.max(0, newRate) } : p))
    );
  };

  const handleRemoveQuoteProduct = (id: string) => {
    if (quoteProductLines.length <= 1) {
      triggerToast('⚠️ At least one product rate must be quoted.');
      return;
    }
    setQuoteProductLines((prev) => prev.filter((p) => p.id !== id));
  };

  const totalQuoteEstAmount = quoteProductLines.reduce(
    (sum, p) => sum + p.estimatedQtyNumber * (p.ratePerUnit || 0),
    0
  );

  const handleCloseQuoteModal = () => {
    setActiveQuoteRequest(null);
    setIsRecording(false);
    setHasRecordedAudio(false);
    setIsPlayingAudio(false);
  };

  const handleStartVoiceRecording = () => {
    setIsRecording(true);
    setRecordingSeconds(0);
    setHasRecordedAudio(false);
  };

  const handleStopVoiceRecording = () => {
    setIsRecording(false);
    setHasRecordedAudio(true);
  };

  const handleDeleteVoiceRecording = () => {
    setIsRecording(false);
    setHasRecordedAudio(false);
    setRecordingSeconds(0);
    setIsPlayingAudio(false);
  };

  const handleSubmitQuote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeQuoteRequest) return;
    if (quoteProductLines.length === 0) {
      triggerToast('⚠️ Please add at least one scrap material from the catalog to submit your quote.');
      return;
    }
    if (quoteProductLines.some((p) => !p.ratePerUnit || p.ratePerUnit <= 0)) {
      triggerToast('⚠️ Please enter a valid buying rate for all quoted products.');
      return;
    }

    setIndustryRequests((prev) =>
      prev.map((r) =>
        r.id === activeQuoteRequest.id
          ? {
              ...r,
              status: 'accepted',
              submittedQuote: {
                price: totalQuoteEstAmount,
                pickupDate: quotePickupDate,
                pickupTime: quotePickupTime,
                hasVoiceNote: hasRecordedAudio,
                note: quoteNote,
              },
            }
          : r
      )
    );

    const summaryNames = quoteProductLines.map((p) => `${p.name} (₹${p.ratePerUnit}/${p.unit})`).join(', ');

    const newOffer: QuoteOfferItem = {
      id: `QUO-${Date.now().toString().slice(-6)}`,
      customerName: activeQuoteRequest.posterName,
      customerType: activeQuoteRequest.requesterType,
      materialName: summaryNames,
      materialCondition: activeQuoteRequest.materialCondition + ' Condition',
      image: activeQuoteRequest.image,
      quantity: activeQuoteRequest.quantity,
      address: activeQuoteRequest.address,
      quotedPrice: totalQuoteEstAmount,
      itemsQuoted: quoteProductLines.map((p) => ({
        name: p.name,
        ratePerUnit: p.ratePerUnit,
        unit: p.unit,
      })),
      pickupSlot: `${quotePickupDate}, ${quotePickupTime}`,
      submittedAgo: 'Just now',
      status: 'Waiting',
      statusType: 'waiting',
      statusBadgeText: 'Waiting for Response',
    };
    setSubmittedOffers((prev) => [newOffer, ...prev]);

    triggerToast(`✓ Quote with ${quoteProductLines.length} committed product rate(s) submitted to ${activeQuoteRequest.posterName}!`);
    handleCloseQuoteModal();
  };

  const handleAcceptRequest = (req: RequestItem) => {
    if (req.requesterType === 'Industry') {
      // B2B Industry requests require custom quote submission
      handleOpenQuoteModal(req);
    } else {
      // Household requests: Instant acceptance without price form - merchant moves directly to house!
      setHouseholdRequests((prev) =>
        prev.map((r) => (r.id === req.id ? { ...r, status: 'accepted' } : r))
      );
      triggerToast(`✓ Household pickup accepted for ${req.posterName}! Move to customer house for doorstep pickup.`);
    }
  };

  // Deny / Decline Verification Modal State
  const [confirmDenyTarget, setConfirmDenyTarget] = useState<{
    id: string;
    name: string;
    type: 'Industry' | 'Individual';
    material: string;
  } | null>(null);

  const handleInitiateDeny = (req: RequestItem) => {
    setConfirmDenyTarget({
      id: req.id,
      name: req.posterName,
      type: req.requesterType,
      material: req.materialName,
    });
  };

  const handleConfirmDeny = () => {
    if (!confirmDenyTarget) return;
    const { id, type, name } = confirmDenyTarget;
    const targetList = type === 'Industry' ? setIndustryRequests : setHouseholdRequests;
    targetList((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'denied' } : r))
    );
    triggerToast(`Request from ${name} (${id}) has been declined.`);
    setConfirmDenyTarget(null);
  };

  const handleDeny = (id: string, type: 'Industry' | 'Individual') => {
    const target = (type === 'Industry' ? industryRequests : householdRequests).find((r) => r.id === id);
    if (target) {
      handleInitiateDeny(target);
    } else {
      const targetList = type === 'Industry' ? setIndustryRequests : setHouseholdRequests;
      targetList((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: 'denied' } : r))
      );
      triggerToast(`Request ${id} declined.`);
    }
  };

  const handleRequestExtension = () => {
    triggerToast(`Extension requested for ${extensionTime}. Customer notified.`);
  };

  const handleClearFilters = () => {
    setSelectedScrapFilter('All Types');
    setSelectedAmountFilter('All Amounts');
    setSelectedLocationFilter('All Locations');
    triggerToast('Filters reset to default.');
  };

  // Active list based on activeTab
  const currentRequests = activeTab === 'Industry' ? industryRequests : householdRequests;

  const filteredRequests = currentRequests.filter((r) => {
    if (selectedScrapFilter !== 'All Types' && !r.materialName.toLowerCase().includes(selectedScrapFilter.toLowerCase())) {
      return false;
    }
    return true;
  });

  const pendingCount = filteredRequests.filter((r) => r.status === 'pending').length;

  const displayOffers = submittedOffers.filter((offer) => {
    if (offerFilter === 'waiting') return offer.statusType === 'waiting';
    if (offerFilter === 'accepted') return offer.statusType === 'accepted';
    if (offerFilter === 'closed') return offer.statusType === 'rejected' || offer.statusType === 'expired';
    return true;
  });

  return (
    <div className={styles.pageWrapper}>
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className={styles.toastBanner}>
          <CheckCircle2 size={18} className={styles.toastIcon} />
          <span className={styles.toastText}>{toastMessage.replace(/^✓\s*/, '')}</span>
        </div>
      )}

      <main className={styles.mainContainer}>
        <div className={styles.requestsLayoutGrid}>
          {/* ================================================================
              LEFT COLUMN: MAIN WORKFLOW (AVAILABLE REQUESTS / MY OFFERS)
             ================================================================ */}
          <section className={styles.mainCol}>
            {/* 1. Page Header */}
            <div className={styles.pageHeaderRow}>
              <div className={styles.headerTitleGroup}>
                <h1 className={styles.pageTitle}>
                  {primaryTab === 'available' ? 'New Scrap Requests' : 'My Offers'}
                </h1>
                <p className={styles.pageSubtitle}>
                  {primaryTab === 'available'
                    ? 'Review nearby requests and send your quote.'
                    : "Track quotes you've sent and start pickups."}
                </p>
              </div>
            </div>

            {/* 2. Primary Two-Mode Tabs: Available Requests vs My Offers */}
            <div className={styles.primaryTabsContainer}>
              <div className={styles.primaryTabsTrack}>
                <button
                  type="button"
                  className={`${styles.primaryTabBtn} ${
                    primaryTab === 'available' ? styles.primaryTabBtnActive : ''
                  }`}
                  onClick={() => setPrimaryTab('available')}
                >
                  <div className={styles.primaryTabContent}>
                    <span className={styles.primaryTabTitle}>AVAILABLE REQUESTS</span>
                    <span className={styles.primaryTabCountLarge}>
                      {industryRequests.filter((r) => r.status === 'pending').length +
                        householdRequests.filter((r) => r.status === 'pending').length}
                    </span>
                  </div>
                </button>

                <button
                  type="button"
                  className={`${styles.primaryTabBtn} ${
                    primaryTab === 'offers' ? styles.primaryTabBtnActive : ''
                  }`}
                  onClick={() => setPrimaryTab('offers')}
                >
                  <div className={styles.primaryTabContent}>
                    <span className={styles.primaryTabTitle}>MY OFFERS</span>
                    <span className={styles.primaryTabCountLarge}>
                      {submittedOffers.length}
                    </span>
                  </div>
                </button>
              </div>
            </div>

            {/* ============================================================
                MODE A: AVAILABLE REQUESTS FEED
               ============================================================ */}
            {primaryTab === 'available' && (
              <>
                {/* Category Sub-pills: Industry Requests vs Household */}
                <div className={styles.categorySubTrack}>
                  <button
                    type="button"
                    className={`${styles.categorySubBtn} ${
                      activeTab === 'Industry' ? styles.categorySubBtnActive : ''
                    }`}
                    onClick={() => setActiveTab('Industry')}
                  >
                    <Building size={15} />
                    <span>Industry</span>
                    <span
                      className={
                        activeTab === 'Industry'
                          ? styles.categorySubBadgeActive
                          : styles.categorySubBadge
                      }
                    >
                      {industryRequests.filter((r) => r.status === 'pending').length}
                    </span>
                  </button>

                  <button
                    type="button"
                    className={`${styles.categorySubBtn} ${
                      activeTab === 'Individual' ? styles.categorySubBtnActive : ''
                    }`}
                    onClick={() => setActiveTab('Individual')}
                  >
                    <User size={15} />
                    <span>Household</span>
                    <span
                      className={
                        activeTab === 'Individual'
                          ? styles.categorySubBadgeActive
                          : styles.categorySubBadge
                      }
                    >
                      {householdRequests.filter((r) => r.status === 'pending').length}
                    </span>
                  </button>
                </div>

                {/* Counter Bar */}
                <div className={styles.requestsBar}>
                  <div className={styles.countGroup}>
                    <h2 className={styles.countHeading}>
                      {pendingCount} {activeTab === 'Industry' ? 'Industry' : 'Household'} Requests
                    </h2>
                    <span className={styles.liveBadge}>Live</span>
                  </div>
                </div>

                {/* 5-Question Scannable Request Cards */}
                <div className={styles.compactRequestsList}>
                  {filteredRequests.map((item) => (
                    <article
                      key={item.id}
                      className={styles.compactRequestCard}
                      onClick={() => setDetailsModalRequest(item)}
                    >
                      {/* Card Header: Meta row (NEW + time) and Poster Name below */}
                      <div className={styles.compactCardHeader}>
                        <div className={styles.compactCardTopRow}>
                          <div className={styles.compactCardTopLeft}>
                            <span className={styles.newBadge}>NEW</span>
                            <span className={styles.compactTimeAgo}>
                              {formatRelativeTime(item.requestedAgo)}
                            </span>
                          </div>
                        </div>
                        <div className={styles.compactPosterRow}>
                          <span className={styles.compactPosterName}>{item.posterName}</span>
                          <span className={styles.compactRequesterTypePill}>
                            {item.requesterType === 'Individual' ? 'Household' : 'Industry'}
                          </span>
                        </div>
                      </div>

                      {/* Scrap Image Slider with Left/Right Navigation Arrows */}
                      <CompactCardImageSlider
                        images={item.images && item.images.length > 0 ? item.images : [item.image]}
                        fallbackImage={item.image || '/logo-icon.png'}
                        alt={item.materialName}
                      />

                      {/* What? & How much? */}
                      <div className={styles.compactMaterialBlock}>
                        <h3 className={styles.compactMaterialTitle}>{item.materialName}</h3>
                        <div className={styles.compactQuantity}>{item.quantity}</div>
                      </div>

                      {/* Where? & When? */}
                      <div className={styles.compactPickupBlock}>
                        <div className={styles.compactPickupRow}>
                          <MapPin size={14} className={styles.compactPickupIcon} />
                          <span>Pickup Area: {getPrivacyArea(item.address, item.posterName)}</span>
                        </div>
                        <div className={styles.compactPickupRow}>
                          <Clock size={14} className={styles.compactPickupIcon} />
                          <span>{formatPickupSlot(item.pickupDate, item.pickupTime)}</span>
                        </div>
                      </div>

                      {/* Trust indicator */}
                      <div className={styles.compactTrustRow}>
                        <ShieldCheck size={13} className={styles.compactTrustIcon} />
                        <span>Verified contact</span>
                      </div>

                      {/* Single Primary Action Button */}
                      <div className={styles.compactActionRow}>
                        {item.status === 'accepted' ? (
                          <div className={styles.compactAcceptedBadge}>
                            <CheckCircle2 size={15} />
                            <span>
                              {item.requesterType === 'Individual'
                                ? 'Pickup Accepted'
                                : 'Quote Submitted'}
                            </span>
                          </div>
                        ) : item.status === 'denied' ? (
                          <div className={styles.compactDeclinedBadge}>
                            <X size={14} />
                            <span>Declined</span>
                          </div>
                        ) : (
                          <button
                            type="button"
                            className={styles.compactPrimaryCtaBtn}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAcceptRequest(item);
                            }}
                          >
                            <span>
                              {item.requesterType === 'Industry'
                                ? 'Accept & Quote'
                                : 'Accept Pickup'}
                            </span>
                            <ArrowRight size={15} />
                          </button>
                        )}
                      </div>
                    </article>
                  ))}
                </div>
              </>
            )}

            {/* ============================================================
                MODE B: MY OFFERS (FILTER & STATUS CARDS)
               ============================================================ */}
            {primaryTab === 'offers' && (
              <div className={styles.offersSection}>
                {/* Status Sub-filter Bar */}
                <div className={styles.offersFilterTrack}>
                  <button
                    type="button"
                    className={`${styles.offersFilterBtn} ${
                      offerFilter === 'all' ? styles.offersFilterBtnActive : ''
                    }`}
                    onClick={() => setOfferFilter('all')}
                  >
                    All <span className={styles.offersFilterCount}>({submittedOffers.length})</span>
                  </button>
                  <button
                    type="button"
                    className={`${styles.offersFilterBtn} ${
                      offerFilter === 'waiting' ? styles.offersFilterBtnActive : ''
                    }`}
                    onClick={() => setOfferFilter('waiting')}
                  >
                    Waiting{' '}
                    <span className={styles.offersFilterCount}>
                      ({submittedOffers.filter((o) => o.statusType === 'waiting').length})
                    </span>
                  </button>
                  <button
                    type="button"
                    className={`${styles.offersFilterBtn} ${
                      offerFilter === 'accepted' ? styles.offersFilterBtnActive : ''
                    }`}
                    onClick={() => setOfferFilter('accepted')}
                  >
                    Accepted{' '}
                    <span className={styles.offersFilterCount}>
                      ({submittedOffers.filter((o) => o.statusType === 'accepted').length})
                    </span>
                  </button>
                  <button
                    type="button"
                    className={`${styles.offersFilterBtn} ${
                      offerFilter === 'closed' ? styles.offersFilterBtnActive : ''
                    }`}
                    onClick={() => setOfferFilter('closed')}
                  >
                    Closed{' '}
                    <span className={styles.offersFilterCount}>
                      (
                      {
                        submittedOffers.filter(
                          (o) => o.statusType === 'rejected' || o.statusType === 'expired'
                        ).length
                      }
                      )
                    </span>
                  </button>
                </div>

                {/* Filtered Offers List */}
                <div className={styles.offersList}>
                  {displayOffers.map((offer) => {
                    if (offer.statusType === 'accepted') {
                      return (
                        <article
                          key={offer.id}
                          className={`${styles.offerCard} ${styles.offerCardAccepted}`}
                        >
                          <div className={styles.offerStatusHeaderAccepted}>
                            <CheckCircle2 size={16} />
                            <span>✓ CUSTOMER ACCEPTED</span>
                          </div>

                          <div className={styles.offerCardBody}>
                            <div className={styles.offerCustomerBlock}>
                              <h3 className={styles.offerCustomerName}>{offer.customerName}</h3>
                              <div className={styles.offerMatQty}>
                                {offer.materialName} · {offer.quantity}
                              </div>
                            </div>

                            {/* List out item name and prices given by merchants (no estimate amount) */}
                            <OfferItemsList
                              offerId={offer.id}
                              items={offer.itemsQuoted}
                              fallbackName={offer.materialName}
                              statusType="accepted"
                            />

                            <div className={styles.offerPickupSlotRow}>
                              <Clock size={14} />
                              <span>Pickup: {getShortSlot(offer.pickupSlot)}</span>
                            </div>

                            <Link
                              to={`/orders?orderId=${offer.id.replace('QUO', 'ORD')}&customer=${encodeURIComponent(offer.customerName)}&action=pickup`}
                              className={styles.offerStartPickupBtn}
                            >
                              <Truck size={16} />
                              <span>View Order &amp; Start Pickup →</span>
                            </Link>
                          </div>
                        </article>
                      );
                    }

                    if (offer.statusType === 'waiting') {
                      return (
                        <article
                          key={offer.id}
                          className={`${styles.offerCard} ${styles.offerCardWaiting}`}
                        >
                          <div className={styles.offerStatusHeaderWaiting}>
                            <Clock size={15} />
                            <span>WAITING FOR RESPONSE</span>
                          </div>

                          <div className={styles.offerCardBody}>
                            <div className={styles.offerCustomerBlock}>
                              <h3 className={styles.offerCustomerName}>{offer.customerName}</h3>
                              <div className={styles.offerMatQty}>
                                {offer.materialName} · {offer.quantity}
                              </div>
                            </div>

                            {/* List out item name and prices given by merchants (no estimate amount) */}
                            <OfferItemsList
                              offerId={offer.id}
                              items={offer.itemsQuoted}
                              fallbackName={offer.materialName}
                              statusType="waiting"
                            />

                            <div className={styles.offerPickupSlotRow}>
                              <Clock size={14} />
                              <span>Pickup: {getShortSlot(offer.pickupSlot)}</span>
                            </div>

                            <div className={styles.offerStatusNoteWaiting}>
                              Waiting for customer response
                            </div>
                          </div>
                        </article>
                      );
                    }

                    if (offer.statusType === 'rejected') {
                      return (
                        <article
                          key={offer.id}
                          className={`${styles.offerCard} ${styles.offerCardNeutral}`}
                        >
                          <div className={styles.offerStatusHeaderNeutral}>
                            <AlertCircle size={15} />
                            <span>OFFER NOT SELECTED</span>
                          </div>

                          <div className={styles.offerCardBody}>
                            <div className={styles.offerCustomerBlock}>
                              <h3 className={styles.offerCustomerName}>{offer.customerName}</h3>
                              <div className={styles.offerMatQty}>
                                {offer.materialName} · {offer.quantity}
                              </div>
                            </div>

                            {/* List out item name and prices given by merchants (no estimate amount) */}
                            <OfferItemsList
                              offerId={offer.id}
                              items={offer.itemsQuoted}
                              fallbackName={offer.materialName}
                              statusType="rejected"
                            />

                            <div className={styles.offerStatusNoteNeutral}>
                              Another offer was selected.
                            </div>

                            <button
                              type="button"
                              className={styles.offerSecondaryBtn}
                              onClick={() =>
                                triggerToast(`Offer ${offer.id}: customer selected another quote.`)
                              }
                            >
                              View Request
                            </button>
                          </div>
                        </article>
                      );
                    }

                    // Expired status
                    return (
                      <article
                        key={offer.id}
                        className={`${styles.offerCard} ${styles.offerCardNeutral}`}
                      >
                        <div className={styles.offerStatusHeaderNeutral}>
                          <Clock size={15} />
                          <span>DEADLINE EXPIRED</span>
                        </div>

                        <div className={styles.offerCardBody}>
                          <div className={styles.offerCustomerBlock}>
                            <h3 className={styles.offerCustomerName}>{offer.customerName}</h3>
                            <div className={styles.offerMatQty}>
                              {offer.materialName} · {offer.quantity}
                            </div>
                          </div>

                          {/* List out item name and prices given by merchants (no estimate amount) */}
                          <OfferItemsList
                            offerId={offer.id}
                            items={offer.itemsQuoted}
                            fallbackName={offer.materialName}
                            statusType="expired"
                          />

                          <div className={styles.offerStatusNoteNeutral}>
                            Response window has ended.
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </div>
            )}
          </section>

          {/* ================================================================
              RIGHT SIDEBAR (30% ON DESKTOP)
             ================================================================ */}
          <aside className={styles.sidebarCol}>
            {primaryTab === 'available' ? (
              <>
                <div className={styles.sidebarCard}>
                  <h3 className={styles.sidebarCardTitle}>How Quoting Works</h3>
                  <ol className={styles.stepsList}>
                    <li className={styles.stepItem}>
                      <div className={styles.stepNumber}>1</div>
                      <div className={styles.stepText}>
                        <strong>Review request:</strong> Tap card to view photos, volume, and pickup area.
                      </div>
                    </li>
                    <li className={styles.stepItem}>
                      <div className={styles.stepNumber}>2</div>
                      <div className={styles.stepText}>
                        <strong>Accept &amp; Quote:</strong> Enter your buying rate and available pickup time.
                      </div>
                    </li>
                    <li className={styles.stepItem}>
                      <div className={styles.stepNumber}>3</div>
                      <div className={styles.stepText}>
                        <strong>Customer Accepts:</strong> Deal moves to Orders for instant spot weighing &amp; settlement.
                      </div>
                    </li>
                  </ol>
                </div>

                <div className={styles.sidebarCard}>
                  <h3 className={styles.sidebarCardTitle}>Merchant Benefits</h3>
                  <ul className={styles.benefitsList}>
                    <li className={styles.benefitItem}>
                      <Check size={16} className={styles.benefitCheckIcon} />
                      <span>No commission until pickup completion</span>
                    </li>
                    <li className={styles.benefitItem}>
                      <Check size={16} className={styles.benefitCheckIcon} />
                      <span>Direct gate navigation &amp; digital scale sync</span>
                    </li>
                    <li className={styles.benefitItem}>
                      <Check size={16} className={styles.benefitCheckIcon} />
                      <span>Priority lead access for top rated buyers</span>
                    </li>
                  </ul>
                </div>
              </>
            ) : (
              <div className={styles.sidebarCard}>
                <h3 className={styles.sidebarCardTitle}>Quote Status Guide</h3>
                <ul className={styles.benefitsList}>
                  <li className={styles.benefitItem}>
                    <CheckCircle2 size={16} style={{ color: '#16a34a' }} />
                    <span><strong>Customer Accepted:</strong> Tap Start Pickup to navigate and weigh scrap.</span>
                  </li>
                  <li className={styles.benefitItem}>
                    <Clock size={16} style={{ color: '#d97706' }} />
                    <span><strong>Waiting:</strong> Customer is reviewing your quote against others.</span>
                  </li>
                  <li className={styles.benefitItem}>
                    <AlertCircle size={16} style={{ color: '#64748b' }} />
                    <span><strong>Closed:</strong> Quoting window expired or another buyer was chosen.</span>
                  </li>
                </ul>
              </div>
            )}

            {/* Need Help Card */}
            <div className={styles.sidebarCard}>
              <h3 className={styles.sidebarCardTitle}>Need Help?</h3>
              <p className={styles.helpText}>
                Need assistance with an industrial weight assessment or vehicle dispatch? Contact our Chennai merchant support desk.
              </p>
              <a href="tel:+919876543210" className={styles.helpPhoneBtn}>
                <Phone size={15} />
                <span>+91 98765 43210</span>
              </a>
            </div>
          </aside>
        </div>
      </main>

      {/* ================================================================
          QUOTE SUBMISSION MODAL ('Submit Your Quote')
         ================================================================ */}
      {activeQuoteRequest && (
        <div className={styles.modalOverlay} onClick={handleCloseQuoteModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            {/* Top Drag Handle for Bottom Sheet */}
            <div className={styles.sheetDragHandleWrap}>
              <div className={styles.sheetDragPill} />
            </div>

            {/* Modal Header */}
            <div className={styles.modalHeader}>
              <div>
                <span className={styles.modalPretitle}>REQUEST ID: {activeQuoteRequest.id}</span>
                <h2 className={styles.modalTitle}>Submit Your Quote</h2>
              </div>
              <button
                type="button"
                className={styles.modalCloseBtn}
                onClick={handleCloseQuoteModal}
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmitQuote} className={styles.modalForm}>
              <div className={styles.modalFormBody}>
                {/* Scrap Images in Order */}
              {(() => {
                const quoteImages =
                  activeQuoteRequest.images && activeQuoteRequest.images.length > 0
                    ? activeQuoteRequest.images
                    : [activeQuoteRequest.image || '/logo-icon.png'];

                return (
                  <div className={styles.modalSummaryBox}>
                    <div className={styles.modalImagesTrack}>
                      {quoteImages.map((imgSrc, idx) => (
                        <div
                          key={idx}
                          className={styles.modalImageItem}
                          onClick={() =>
                            setFloatingImage({
                              src: imgSrc,
                              title: `${activeQuoteRequest.materialName} (Photo ${idx + 1} of ${quoteImages.length})`,
                              condition: activeQuoteRequest.materialCondition,
                              quantity: activeQuoteRequest.quantity,
                              posterName: activeQuoteRequest.posterName,
                              images: quoteImages,
                              currentIndex: idx,
                            })
                          }
                          title={`Scrap Photo ${idx + 1} of ${quoteImages.length} (Click to preview)`}
                        >
                          <img
                            src={imgSrc}
                            alt={`${activeQuoteRequest.materialName} - Photo ${idx + 1}`}
                            className={styles.modalOrderedImg}
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).src = '/logo-icon.png';
                            }}
                          />
                          <span className={styles.modalImageOrderBadge}>
                            {idx + 1}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}

              {/* 1. Offered Scrap Rates (Per-Product / Per-KG Pricing) */}
              <div className={styles.quoteProductsSection}>
                <div className={styles.sectionHeaderCol}>
                  <label className={styles.formLabelSingleRow}>
                    <span>1. Quoted Scrap Materials &amp; Offered Rates</span>
                    <span className={styles.requiredStar}>*</span>
                  </label>
                </div>

                {/* List of Product Lines being Quoted - Clean Minimal Row (Name, Price, Delete only) */}
                <div className={styles.quoteProductsList}>
                  {quoteProductLines.length === 0 ? (
                    <div className={styles.emptyQuoteProductsPrompt}>
                      <span>Select permanent scrap items from the catalog below to set your purchase rates.</span>
                    </div>
                  ) : (
                    quoteProductLines.map((prod) => (
                      <div key={prod.id} className={styles.cleanProductRow}>
                        <div className={styles.cleanProdInfo}>
                          <strong className={styles.cleanProdName}>{prod.name}</strong>
                        </div>

                        <div className={styles.cleanProdActions}>
                          <div className={styles.cleanPriceWrapper}>
                            <span className={styles.cleanCurrencyPrefix}>₹</span>
                            <input
                              type="number"
                              min="1"
                              step="any"
                              placeholder="0"
                              value={prod.ratePerUnit || ''}
                              onChange={(e) => handleUpdateProductRate(prod.id, parseFloat(e.target.value) || 0)}
                              className={styles.cleanPriceInput}
                              required
                            />
                            <span className={styles.cleanUnitSuffix}>/ {prod.unit}</span>
                          </div>

                          <button
                            type="button"
                            className={styles.cleanDeleteBtn}
                            onClick={() => handleRemoveQuoteProduct(prod.id)}
                            title={`Remove ${prod.name}`}
                            aria-label={`Remove ${prod.name}`}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Add from Catalog Button - Positioned under the price list for better UX */}
                <div className={styles.catalogBtnRow}>
                  <button
                    type="button"
                    className={styles.toggleCatalogBtn}
                    onClick={() => setShowCategoryExplorer(!showCategoryExplorer)}
                  >
                    {showCategoryExplorer ? <X size={13} /> : <Plus size={13} />}
                    <span>{showCategoryExplorer ? 'Hide Scrap Catalog' : 'Add from Catalog'}</span>
                  </button>
                </div>

                {/* Category Explorer & Universal Search (Same as Billing) */}
                {showCategoryExplorer && (
                  <div className={styles.quoteCategoryExplorerWrapper}>
                    {/* Top Universal Search Input */}
                    <div className={styles.scrapSearchInputWrapper}>
                      <input
                        type="text"
                        value={quoteSearchQuery}
                        onChange={(e) => setQuoteSearchQuery(e.target.value)}
                        placeholder="Search any scrap (e.g. Iron, Tin, Copper, Aluminium, Cardboard, Battery, Wires...)"
                        className={styles.scrapSearchInput}
                      />
                      {quoteSearchQuery && (
                        <button
                          type="button"
                          className={styles.clearSearchQueryBtn}
                          onClick={() => setQuoteSearchQuery('')}
                          title="Clear search"
                        >
                          <X size={14} />
                        </button>
                      )}
                    </div>

                    {/* Live Search Results OR Category Tabs Explorer */}
                    {quoteSearchQuery.trim() ? (
                      <div className={styles.searchResultsGrid}>
                        {MARKET_SCRAP_CATEGORIES.flatMap((c) =>
                          c.items
                            .filter((item) =>
                              item.name.toLowerCase().includes(quoteSearchQuery.toLowerCase()) ||
                              c.name.toLowerCase().includes(quoteSearchQuery.toLowerCase())
                            )
                            .map((item) => ({ ...item, categoryName: c.name }))
                        ).map((item) => (
                          <div
                            key={item.id}
                            className={styles.subCategoryCard}
                            onClick={() => handleAddProductFromCatalog(item, undefined, item.categoryName)}
                          >
                            <div className={styles.subCategoryCardTop}>
                              <strong className={styles.subCategoryName}>{item.name}</strong>
                              <span className={styles.subCategoryPriceBadge}>
                                ₹{item.defaultRate} / {item.unit}
                              </span>
                            </div>
                            <div className={styles.subCategoryCardBottom}>
                              <button type="button" className={styles.addSubItemBtn}>
                                <span>+ Add</span>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className={styles.categoryExplorerInner}>
                        {/* Horizontal Category Selector Tabs (Text Only, No Emojis) */}
                        <div className={styles.billingCategoryTabsTrack}>
                          {MARKET_SCRAP_CATEGORIES.map((cat) => (
                            <button
                              key={cat.id}
                              type="button"
                              className={`${styles.billingCategoryTabBtn} ${
                                selectedQuoteCatId === cat.id ? styles.billingCategoryTabActive : ''
                              }`}
                              onClick={() => setSelectedQuoteCatId(cat.id)}
                            >
                              <span className={styles.billingCategoryTabLabel}>{cat.name}</span>
                            </button>
                          ))}
                        </div>

                        {/* Subcategories Grid for Selected Category (Text Only, No Emojis or Duplicate Plus) */}
                        {(() => {
                          const activeCat =
                            MARKET_SCRAP_CATEGORIES.find((c) => c.id === selectedQuoteCatId) ||
                            MARKET_SCRAP_CATEGORIES[0];
                          return (
                            <div className={styles.subCategoryCardsGrid}>
                              {activeCat.items.map((subItem) => (
                                <div
                                  key={subItem.id}
                                  className={styles.subCategoryCard}
                                  onClick={() => handleAddProductFromCatalog(subItem, undefined, activeCat.name)}
                                >
                                  <div className={styles.subCategoryCardTop}>
                                    <strong className={styles.subCategoryName}>{subItem.name}</strong>
                                    <span className={styles.subCategoryPriceBadge}>
                                      ₹{subItem.defaultRate} / {subItem.unit}
                                    </span>
                                  </div>
                                  <div className={styles.subCategoryCardBottom}>
                                    <button type="button" className={styles.addSubItemBtn}>
                                      <span>+ Add</span>
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          );
                        })()}
                      </div>
                    )}
                  </div>
                )}

                {/* Committed Rates Summary Banner - Clean Aligned Price List (Shown once merchant adds items) */}
                {quoteProductLines.length > 0 && (
                  <div className={styles.quoteTotalSummaryStrip}>
                    <div className={styles.quoteTotalRatesPreview}>
                      <div className={styles.totalRatesHeader}>
                        <span className={styles.totalSummaryLabel}>COMMITTED PURCHASE RATES</span>
                      </div>
                      <div className={styles.committedRatesList}>
                        {quoteProductLines.map((p) => (
                          <div key={p.id} className={styles.committedRateRow}>
                            <span className={styles.committedRateName}>{p.name}</span>
                            <strong className={styles.committedRatePrice}>
                              ₹{p.ratePerUnit || 0} / {p.unit}
                            </strong>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 2. Required Field: Available Pickup Time */}
              <div className={styles.formGridTwo}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>
                    <span>Pickup Date</span>
                    <span className={styles.requiredStar}>*</span>
                  </label>
                  <input
                    type="date"
                    value={quotePickupDate}
                    onChange={(e) => setQuotePickupDate(e.target.value)}
                    className={styles.formInput}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>
                    <span>Available Time Slot</span>
                    <span className={styles.requiredStar}>*</span>
                  </label>
                  <select
                    value={quotePickupTime}
                    onChange={(e) => setQuotePickupTime(e.target.value)}
                    className={styles.formSelect}
                    required
                  >
                    <option value="09:00 AM – 11:00 AM">09:00 AM – 11:00 AM</option>
                    <option value="10:00 AM – 12:00 PM">10:00 AM – 12:00 PM</option>
                    <option value="01:00 PM – 03:00 PM">01:00 PM – 03:00 PM</option>
                    <option value="02:00 PM – 04:00 PM">02:00 PM – 04:00 PM</option>
                    <option value="04:00 PM – 06:00 PM">04:00 PM – 06:00 PM</option>
                  </select>
                </div>
              </div>

              {/* 3. Voice Message (Optional) for Tamil/English Audio Quotes */}
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Mic size={15} /> Voice Message (Optional)
                  </span>
                  <span className={styles.optionalBadge}>Optional</span>
                </label>

                <div className={styles.voiceRecordCard}>
                  {!hasRecordedAudio && !isRecording && (
                    <div className={styles.voicePromptRow}>
                      <button
                        type="button"
                        className={styles.recordAudioBtn}
                        onClick={handleStartVoiceRecording}
                      >
                        <Mic size={16} />
                        <span>Record Voice Note</span>
                      </button>
                      <span className={styles.voicePromptSub}>
                        Speak in Tamil or English to clarify weighing or loading instructions.
                      </span>
                    </div>
                  )}

                  {isRecording && (
                    <div className={styles.recordingActiveRow}>
                      <div className={styles.recordingIndicatorGroup}>
                        <span className={styles.recordingPulseDot} />
                        <span className={styles.recordingTimerText}>
                          00:{recordingSeconds < 10 ? `0${recordingSeconds}` : recordingSeconds} / 01:00
                        </span>
                        <span className={styles.recordingStatusLabel}>Recording your voice message...</span>
                      </div>

                      <button
                        type="button"
                        className={styles.stopRecordBtn}
                        onClick={handleStopVoiceRecording}
                      >
                        <Square size={14} />
                        <span>Done</span>
                      </button>
                    </div>
                  )}

                  {hasRecordedAudio && !isRecording && (
                    <div className={styles.recordedPlaybackRow}>
                      <div className={styles.audioPlaybackPill}>
                        <button
                          type="button"
                          className={styles.audioPlayToggleBtn}
                          onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                        >
                          {isPlayingAudio ? <Pause size={15} /> : <Play size={15} />}
                        </button>
                        <div className={styles.waveformSimulation}>
                          <span className={styles.waveBar} />
                          <span className={styles.waveBar} />
                          <span className={styles.waveBar} />
                          <span className={styles.waveBar} />
                          <span className={styles.waveBar} />
                          <span className={styles.waveBar} />
                          <span className={styles.waveBar} />
                          <span className={styles.waveBar} />
                        </div>
                        <span className={styles.audioDurationLabel}>00:{recordingSeconds < 10 ? `0${recordingSeconds}` : recordingSeconds}</span>
                      </div>

                      <button
                        type="button"
                        className={styles.deleteVoiceBtn}
                        onClick={handleDeleteVoiceRecording}
                        title="Delete and re-record"
                      >
                        <Trash2 size={14} />
                        <span>Re-record</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* 4. Optional Text Note */}
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  <span>Additional Note to Customer</span>
                  <span className={styles.optionalBadge}>Optional</span>
                </label>
                <textarea
                  rows={2}
                  value={quoteNote}
                  onChange={(e) => setQuoteNote(e.target.value)}
                  placeholder="Instructions"
                  className={styles.formTextarea}
                />
              </div>
            </div>

            {/* Modal Actions */}
              <div className={styles.modalActionsRow}>
                <button
                  type="button"
                  className={styles.modalCancelBtn}
                  onClick={handleCloseQuoteModal}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={styles.modalSubmitBtn}
                >
                  <span>Submit Quote</span>
                  <Check size={16} />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================================================================
          DETAILS MODAL ('View Details')
         ================================================================ */}
      {detailsModalRequest && (
        <div className={styles.modalOverlay} onClick={() => setDetailsModalRequest(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            {/* Top Drag Handle for Bottom Sheet */}
            <div className={styles.sheetDragHandleWrap}>
              <div className={styles.sheetDragPill} />
            </div>

            <div className={styles.modalHeader}>
              <div>
                <span className={styles.modalPretitle}>REQUEST ID: {detailsModalRequest.id}</span>
                <h2 className={styles.modalTitle}>{detailsModalRequest.materialName}</h2>
              </div>
              <button
                type="button"
                className={styles.modalCloseBtn}
                onClick={() => setDetailsModalRequest(null)}
              >
                <X size={20} />
              </button>
            </div>

            <div className={styles.detailsModalBody}>
              {/* Scrap Image Slider with Left/Right Navigation Arrows */}
              <CompactCardImageSlider
                images={
                  detailsModalRequest.images && detailsModalRequest.images.length > 0
                    ? detailsModalRequest.images
                    : [detailsModalRequest.image]
                }
                fallbackImage={detailsModalRequest.image || '/logo-icon.png'}
                alt={detailsModalRequest.materialName}
              />

              <div className={styles.specsGrid}>
                <div className={styles.specItem}>
                  <span className={styles.specLabel}>Poster</span>
                  <span className={styles.specValue}>{detailsModalRequest.posterName} ({detailsModalRequest.requesterType})</span>
                </div>
                <div className={styles.specItem}>
                  <span className={styles.specLabel}>Condition</span>
                  <span className={styles.specValue}>{detailsModalRequest.materialCondition}</span>
                </div>
                <div className={styles.specItem}>
                  <span className={styles.specLabel}>Quantity</span>
                  <span className={styles.specValue}>{detailsModalRequest.quantity} Approx.</span>
                </div>
                <div className={styles.specItem}>
                  <span className={styles.specLabel}>Pickup Window</span>
                  <span className={styles.specValue}>{detailsModalRequest.pickupDate} • {detailsModalRequest.pickupTime}</span>
                </div>
                <div className={styles.specItemFull}>
                  <span className={styles.specLabel}>Pickup Area</span>
                  <span className={styles.specValue}>{getPrivacyArea(detailsModalRequest.address, detailsModalRequest.posterName)}</span>
                </div>
              </div>
            </div>

            <div className={styles.modalActionsRow}>
                {detailsModalRequest.status === 'pending' ? (
                  <button
                    type="button"
                    className={styles.modalSubmitBtn}
                    onClick={() => {
                      const req = detailsModalRequest;
                      setDetailsModalRequest(null);
                      handleAcceptRequest(req);
                    }}
                  >
                    <span>
                      {detailsModalRequest.requesterType === 'Industry'
                        ? 'Accept & Quote'
                        : 'Accept Pickup'}
                    </span>
                  </button>
                ) : (
                  <button
                    type="button"
                    className={styles.modalSubmitBtn}
                    onClick={() => setDetailsModalRequest(null)}
                  >
                    Close
                  </button>
                )}
            </div>
          </div>
        </div>
      )}

      {/* ================================================================
          CONFIRM DENY / DECLINE VERIFICATION MODAL
         ================================================================ */}
      {confirmDenyTarget && (
        <div
          className={styles.confirmModalOverlay}
          onClick={() => setConfirmDenyTarget(null)}
        >
          <div
            className={styles.confirmModalCard}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.confirmModalIconBox}>
              <AlertTriangle size={30} className={styles.confirmModalIcon} />
            </div>

            <h3 className={styles.confirmModalTitle}>Decline Request?</h3>
            
            <p className={styles.confirmModalText}>
              Are you sure you want to decline the scrap pickup request from <strong>{confirmDenyTarget.name}</strong> for <strong>{confirmDenyTarget.material}</strong> ({confirmDenyTarget.id})?
            </p>

            <p className={styles.confirmModalSubtext}>
              This action cannot be undone. This request will be removed from your queue and you will not be able to quote or accept it.
            </p>

            <div className={styles.confirmModalActionsRow}>
              <button
                type="button"
                className={styles.confirmModalCancelBtn}
                onClick={() => setConfirmDenyTarget(null)}
              >
                No, Keep Request
              </button>
              <button
                type="button"
                className={styles.confirmModalDangerBtn}
                onClick={handleConfirmDeny}
              >
                Yes, Decline Request
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================
          FLOATING IMAGE LIGHTBOX MODAL
         ================================================================ */}
      {floatingImage && (
        <div
          className={styles.floatingImageOverlay}
          onClick={() => setFloatingImage(null)}
        >
          <div
            className={styles.floatingImageCard}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.floatingImageHeader}>
              <div className={styles.floatingImageTitleBlock}>
                <h3 className={styles.floatingImageTitle}>{floatingImage.title}</h3>
                <div className={styles.floatingImageTags}>
                  <span className={styles.floatingBadgeCondition}>{floatingImage.condition} Condition</span>
                  <span className={styles.floatingBadgeQty}>{floatingImage.quantity} Approx.</span>
                  <span className={styles.floatingPosterName}>• Posted by {floatingImage.posterName}</span>
                </div>
              </div>
              <button
                type="button"
                className={styles.floatingCloseBtn}
                onClick={() => setFloatingImage(null)}
                aria-label="Close image preview"
              >
                <X size={20} />
              </button>
            </div>

            <div className={styles.floatingImageBody}>
              <img
                src={floatingImage.src}
                alt={floatingImage.title}
                className={styles.floatingImg}
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = '/logo-icon.png';
                }}
              />
              {floatingImage.images && floatingImage.images.length > 1 && (
                <>
                  <button
                    type="button"
                    className={`${styles.floatingNavBtn} ${styles.floatingNavPrev}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      const list = floatingImage.images!;
                      const total = list.length;
                      const curr = floatingImage.currentIndex ?? 0;
                      const nextIdx = curr === 0 ? total - 1 : curr - 1;
                      setFloatingImage({
                        ...floatingImage,
                        src: list[nextIdx],
                        title: `${floatingImage.title.split(' (Photo')[0]} (Photo ${nextIdx + 1} of ${total})`,
                        currentIndex: nextIdx,
                      });
                    }}
                    aria-label="Previous photo"
                  >
                    <ChevronLeft size={22} />
                  </button>
                  <button
                    type="button"
                    className={`${styles.floatingNavBtn} ${styles.floatingNavNext}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      const list = floatingImage.images!;
                      const total = list.length;
                      const curr = floatingImage.currentIndex ?? 0;
                      const nextIdx = curr === total - 1 ? 0 : curr + 1;
                      setFloatingImage({
                        ...floatingImage,
                        src: list[nextIdx],
                        title: `${floatingImage.title.split(' (Photo')[0]} (Photo ${nextIdx + 1} of ${total})`,
                        currentIndex: nextIdx,
                      });
                    }}
                    aria-label="Next photo"
                  >
                    <ChevronRight size={22} />
                  </button>
                </>
              )}
            </div>

            <div className={styles.floatingImageFooter}>
              <span>Click anywhere outside or press ✕ to close</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
