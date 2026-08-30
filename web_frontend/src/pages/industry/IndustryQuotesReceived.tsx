import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Building2,
  ShieldCheck,
  Star,
  CheckCircle2,
  Play,
  Pause,
  Volume2,
  Calendar,
  Clock,
  Truck,
  Scale,
  MapPin,
  ChevronRight,
  ArrowRight,
  Phone,
  Layers,
  AlertCircle,
  FileCheck,
  Search,
  Filter,
  ArrowUpDown,
  CreditCard,
  Check,
  X,
  Eye,
  Info,
} from 'lucide-react';
import styles from './IndustryQuotesReceived.module.css';

interface ItemizedMaterialQuote {
  materialName: string;
  quantity: string;
  unit: string;
  offeredRate: number;
}

interface MultiItemMerchantQuote {
  id: string;
  requirementId: string;
  merchantName: string;
  shopName: string;
  merchantPhone: string;
  rating: number;
  reviewsCount: number;
  verifiedMerchant: boolean;
  receivedTime: string;
  itemsBreakdown: ItemizedMaterialQuote[];
  voiceNoteDuration: string;
  voiceNoteTranscript: string;
  vehicleOffered: string;
  weighingMethod: string;
  paymentTerm: string;
  preferredTiming: string;
  isBestValue?: boolean;
  isAccepted?: boolean;
}

const SAMPLE_QUOTES: MultiItemMerchantQuote[] = [
  {
    id: 'quote-1',
    requirementId: 'REQ-250513-00078',
    merchantName: 'Ramesh Traders & Metal Recyclers',
    shopName: 'SIDCO Industrial Scrap Yard #12, Guindy, Chennai',
    merchantPhone: '+91 98401 23456',
    rating: 4.9,
    reviewsCount: 84,
    verifiedMerchant: true,
    receivedTime: '12 min ago',
    itemsBreakdown: [
      {
        materialName: 'Heavy Steel Turnings & Iron Scrap',
        quantity: '650',
        unit: 'KG',
        offeredRate: 38,
      },
      {
        materialName: 'Copper Armature & Motor Scrap',
        quantity: '180',
        unit: 'KG',
        offeredRate: 680,
      },
      {
        materialName: 'Industrial HDPE Barrels & Drums',
        quantity: '10',
        unit: 'Units',
        offeredRate: 450,
      },
    ],
    voiceNoteDuration: '0:26',
    voiceNoteTranscript:
      'Vanakkam sir. We are ready with Tata 407 flatbed and calibrated hook scale. Can collect Friday morning 10 AM with spot NEFT settlement.',
    vehicleOffered: 'Tata 407 Flatbed • 3.0 Tons',
    weighingMethod: 'Calibrated Digital Scale',
    paymentTerm: 'Spot NEFT / RTGS (After final billing)',
    preferredTiming: 'Fri, 16 May • 10:00 AM – 12:00 PM',
    isBestValue: true,
  },
  {
    id: 'quote-2',
    requirementId: 'REQ-250513-00078',
    merchantName: 'Ambattur Heavy Foundry Scrap Buyers',
    shopName: 'Ambattur Industrial Estate Phase 2, Chennai',
    merchantPhone: '+91 94441 55678',
    rating: 4.8,
    reviewsCount: 62,
    verifiedMerchant: true,
    receivedTime: '35 min ago',
    itemsBreakdown: [
      {
        materialName: 'Heavy Steel Turnings & Iron Scrap',
        quantity: '650',
        unit: 'KG',
        offeredRate: 36.5,
      },
      {
        materialName: 'Copper Armature & Motor Scrap',
        quantity: '180',
        unit: 'KG',
        offeredRate: 670,
      },
      {
        materialName: 'Industrial HDPE Barrels & Drums',
        quantity: '10',
        unit: 'Units',
        offeredRate: 420,
      },
    ],
    voiceNoteDuration: '0:18',
    voiceNoteTranscript:
      'Sir we supply directly to foundry in Sriperumbudur. Our driver has valid factory gate passes. Can dispatch vehicle tomorrow itself.',
    vehicleOffered: 'Eicher 14ft Covered Truck • 4.5 Tons',
    weighingMethod: 'Factory Digital Measurement Clearance',
    paymentTerm: 'Immediate Bank Transfer on Gate Exit',
    preferredTiming: 'Sat, 17 May • 09:00 AM – 11:00 AM',
  },
  {
    id: 'quote-3',
    requirementId: 'REQ-250513-00078',
    merchantName: 'Madras Industrial Scrap Corporation',
    shopName: 'Chromepet Metal Yard, Chennai',
    merchantPhone: '+91 98840 99881',
    rating: 4.7,
    reviewsCount: 45,
    verifiedMerchant: true,
    receivedTime: '1 hour ago',
    itemsBreakdown: [
      {
        materialName: 'Heavy Steel Turnings & Iron Scrap',
        quantity: '650',
        unit: 'KG',
        offeredRate: 37,
      },
      {
        materialName: 'Copper Armature & Motor Scrap',
        quantity: '180',
        unit: 'KG',
        offeredRate: 660,
      },
      {
        materialName: 'Industrial HDPE Barrels & Drums',
        quantity: '10',
        unit: 'Units',
        offeredRate: 400,
      },
    ],
    voiceNoteDuration: '0:22',
    voiceNoteTranscript:
      'We have commercial pickup permit for Guindy SIDCO area. Loading team will bring digital crane scales.',
    vehicleOffered: 'Tata Ace Mega • 1.5 Tons',
    weighingMethod: 'Digital Crane Hook Scale',
    paymentTerm: 'Spot NEFT Payment on Measurement',
    preferredTiming: 'Mon, 19 May • 02:00 PM – 04:00 PM',
  },
];

interface IndustryRequestSummary {
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
}

const INDUSTRY_REQUESTS_LIST: IndustryRequestSummary[] = [
  {
    id: 'REQ-250513-00078',
    requestId: 'REQ-250513-00078',
    material: 'Steel Turnings & Lathe Chips (650 KG) + Armored Copper Cables (180 KG) + HDPE Drums (10 Units)',
    category: 'Multi-Material Truck Visit',
    quantity: '3 Materials (~840 KG + 10 Units)',
    condition: 'Mixed & Sorted',
    location: 'Gate 2, SIDCO Industrial Estate, Guindy, Chennai – 600032',
    postedDate: 'Today, 09:30 AM',
    preferredPickupDate: 'Friday, 16 May 2025',
    preferredTimeSlot: '10:00 AM – 12:00 PM',
    status: 'quotes_received',
    quotesCount: 3,
  },
  {
    id: 'REQ-250512-00065',
    requestId: 'REQ-250512-00065',
    material: 'Aluminium Architectural Extrusions & Profile Cutoffs (400 KG)',
    category: 'Aluminium Scrap',
    quantity: '400 KG Bundled',
    condition: 'Clean & Sorted',
    location: 'Phase 2, Ambattur Industrial Estate, Chennai – 600058',
    postedDate: 'Yesterday, 04:20 PM',
    preferredPickupDate: 'Sunday, 18 May 2025',
    preferredTimeSlot: '09:00 AM – 12:00 PM',
    status: 'awaiting_quotes',
    quotesCount: 0,
  },
  {
    id: 'REQ-250511-00049',
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
  },
];

export default function IndustryQuotesReceived() {
  const navigate = useNavigate();
  const [quotes, setQuotes] = useState<MultiItemMerchantQuote[]>(SAMPLE_QUOTES);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'highest' | 'recent'>('highest');
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);
  const [selectedQuoteId, setSelectedQuoteId] = useState<string | null>(null);

  // Mobile Unified Requests <-> Quotes View State
  const [mobileActiveRequestId, setMobileActiveRequestId] = useState<string | null>(null);
  const [mobileFilter, setMobileFilter] = useState<'all' | 'quotes_received' | 'awaiting_quotes' | 'closed'>('all');

  // Modals
  const [confirmingQuote, setConfirmingQuote] = useState<MultiItemMerchantQuote | null>(null);
  const [detailedQuoteModal, setDetailedQuoteModal] = useState<MultiItemMerchantQuote | null>(null);
  const [acceptedSuccessQuote, setAcceptedSuccessQuote] = useState<MultiItemMerchantQuote | null>(null);

  const togglePlayVoice = (id: string) => {
    setPlayingVoiceId((prev) => (prev === id ? null : id));
  };

  const handleOpenConfirmModal = (quote: MultiItemMerchantQuote) => {
    setConfirmingQuote(quote);
  };

  const handleFinalConfirm = () => {
    if (!confirmingQuote) return;
    setQuotes((prev) =>
      prev.map((q) => (q.id === confirmingQuote.id ? { ...q, isAccepted: true } : q))
    );
    setAcceptedSuccessQuote(confirmingQuote);
    setConfirmingQuote(null);
  };

  // Filter and sort quotes
  const sortedQuotes = [...quotes]
    .filter(
      (q) =>
        q.merchantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.shopName.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'recent') return b.id.localeCompare(a.id);
      return 0;
    });

  const verifiedCount = quotes.filter((q) => q.verifiedMerchant).length;

  const filteredMobileRequests = INDUSTRY_REQUESTS_LIST.filter((req) => {
    if (mobileFilter === 'all') return true;
    return req.status === mobileFilter;
  });

  const activeRequestObj = INDUSTRY_REQUESTS_LIST.find((r) => r.id === mobileActiveRequestId) || INDUSTRY_REQUESTS_LIST[0];

  return (
    <div className={styles.pageContainer}>
      {/* ==============================================================
          MOBILE-ONLY STEP 1: REQUESTS LIST (Shown when no request tapped on mobile)
          ============================================================== */}
      <div className={`${styles.mobileRequestsWrapper} ${mobileActiveRequestId ? styles.mobileHidden : ''}`}>
        <div className={styles.mobileHeaderBlock}>
          <div className={styles.mobileHeaderBadge}>
            <Sparkles size={13} />
            <span>PICKUP REQUESTS &amp; BIDS</span>
          </div>
          <h2 className={styles.mobileMainHeading}>Quotes</h2>
          <p className={styles.mobileSubHeading}>View your pickup requests and merchant offers</p>

          {/* Mobile Filter Tabs */}
          <div className={styles.mobileFilterPillsTrack}>
            <button
              type="button"
              className={`${styles.mobileFilterPill} ${mobileFilter === 'all' ? styles.mobileFilterPillActive : ''}`}
              onClick={() => setMobileFilter('all')}
            >
              All ({INDUSTRY_REQUESTS_LIST.length})
            </button>
            <button
              type="button"
              className={`${styles.mobileFilterPill} ${mobileFilter === 'quotes_received' ? styles.mobileFilterPillActive : ''}`}
              onClick={() => setMobileFilter('quotes_received')}
            >
              Quotes Received (1)
            </button>
            <button
              type="button"
              className={`${styles.mobileFilterPill} ${mobileFilter === 'awaiting_quotes' ? styles.mobileFilterPillActive : ''}`}
              onClick={() => setMobileFilter('awaiting_quotes')}
            >
              Awaiting Bids (1)
            </button>
            <button
              type="button"
              className={`${styles.mobileFilterPill} ${mobileFilter === 'closed' ? styles.mobileFilterPillActive : ''}`}
              onClick={() => setMobileFilter('closed')}
            >
              Closed (1)
            </button>
          </div>
        </div>

        {/* Mobile Request Cards */}
        <div className={styles.mobileRequestCardsList}>
          {filteredMobileRequests.map((req) => (
            <div
              key={req.id}
              className={styles.mobileRequestCard}
              onClick={() => {
                if (req.quotesCount > 0) {
                  setMobileActiveRequestId(req.id);
                } else {
                  alert(`Request ${req.requestId} is currently awaiting merchant quotes.`);
                }
              }}
            >
              <div className={styles.reqCardTopRow}>
                <span className={styles.reqIdBadge}>{req.requestId}</span>
                {req.status === 'quotes_received' && (
                  <span className={styles.quotesReceivedBadge}>
                    <Sparkles size={11} />
                    <span>{req.quotesCount} Quotes Received</span>
                  </span>
                )}
                {req.status === 'awaiting_quotes' && (
                  <span className={styles.awaitingBadge}>
                    <Clock size={11} />
                    <span>Awaiting Bids</span>
                  </span>
                )}
                {req.status === 'closed' && (
                  <span className={styles.closedBadge}>
                    <CheckCircle2 size={11} />
                    <span>Closed / Dispatched</span>
                  </span>
                )}
              </div>

              <h4 className={styles.reqMaterialTitle}>{req.material}</h4>

              <div className={styles.reqMetaStack}>
                <div className={styles.reqMetaItem}>
                  <Calendar size={13} className={styles.metaIcon} />
                  <span>{req.preferredPickupDate} • {req.preferredTimeSlot}</span>
                </div>
                <div className={styles.reqMetaItem}>
                  <MapPin size={13} className={styles.metaIcon} />
                  <span className={styles.reqLocationTruncate}>{req.location}</span>
                </div>
              </div>

              <div className={styles.reqCardBottomRow}>
                <span className={styles.reqPostedTime}>Posted {req.postedDate}</span>
                {req.quotesCount > 0 ? (
                  <button type="button" className={styles.viewQuotesMobileBtn}>
                    <span>View {req.quotesCount} Quotes</span>
                    <ChevronRight size={15} />
                  </button>
                ) : (
                  <span className={styles.reqAwaitingText}>Awaiting merchant offers...</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ==============================================================
          DESKTOP & MOBILE STEP 2: MERCHANT QUOTES VIEW
          ============================================================== */}
      <div className={`${styles.quotesViewSection} ${!mobileActiveRequestId ? styles.mobileOnlyHideQuotes : ''}`}>
        {/* Mobile Back Button & Summary */}
        <div className={styles.mobileQuotesHeaderRow}>
          <button
            type="button"
            className={styles.mobileBackToReqsBtn}
            onClick={() => setMobileActiveRequestId(null)}
          >
            <ChevronRight size={16} className={styles.backChevronRotate} />
            <span>Back to All Requests</span>
          </button>
        </div>

        {/* Selected Request Summary Bar for Mobile */}
        <div className={styles.mobileSelectedReqBanner}>
          <div className={styles.bannerTopLine}>
            <span className={styles.bannerReqId}>{activeRequestObj.requestId}</span>
            <span className={styles.bannerQuotesCount}>{activeRequestObj.quotesCount} Merchant Offers</span>
          </div>
          <p className={styles.bannerMatTitle}>{activeRequestObj.material}</p>
          <div className={styles.bannerScheduleRow}>
            <span>📅 {activeRequestObj.preferredPickupDate} ({activeRequestObj.preferredTimeSlot})</span>
            <span>📍 {activeRequestObj.location.split(',')[0]}</span>
          </div>
        </div>

        {/* 1. Desktop Page Header */}
        <div className={styles.headerSection}>
        <div className={styles.headerLeft}>
          <div className={styles.headerBadge}>
            <Sparkles size={13} className={styles.sparkleIcon} />
            <span>ENTERPRISE B2B QUOTATION PORTAL</span>
          </div>
          <h1 className={styles.pageTitle}>Quotes Received</h1>
          <p className={styles.pageSubtitle}>
            Compare verified merchant offers and choose the best quote for your scrap pickup.
          </p>
        </div>

        {/* Right Header Search, Filter & Sort Controls */}
        <div className={styles.headerControls}>
          <div className={styles.searchBox}>
            <Search size={14} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search merchant..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
          </div>

          <div className={styles.sortBox}>
            <ArrowUpDown size={13} className={styles.sortIcon} />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className={styles.sortSelect}
            >
              <option value="highest">Sort: Best Rates First</option>
              <option value="recent">Sort: Most Recent</option>
            </select>
          </div>
        </div>
      </div>

      {/* 2. Compact Summary Statistics Row (NO TOTAL AMOUNT) */}
      <div className={styles.statsSummaryStrip}>
        <div className={styles.statChip}>
          <span className={styles.statNumber}>{quotes.length}</span>
          <span className={styles.statLabel}>Quotes Received</span>
        </div>

        <div className={styles.statChip}>
          <span className={styles.statNumber}>{verifiedCount}</span>
          <span className={styles.statLabel}>Verified Merchants</span>
        </div>

        <div className={`${styles.statChip} ${styles.statChipBest}`}>
          <span className={styles.statLabel}>Status:</span>
          <strong className={styles.statHighlightText}>
            3 Material Rates Ready
          </strong>
        </div>

        <div className={styles.statChip}>
          <span className={styles.statLabel}>Pickup:</span>
          <strong className={styles.statText}>16 May 2025 (10 AM – 12 PM)</strong>
        </div>

        <div className={styles.statChip}>
          <span className={styles.statLabel}>Request:</span>
          <strong className={styles.statMono}>REQ-250513-00078</strong>
        </div>
      </div>

      {/* 3. Merchant Quotation Cards List */}
      <div className={styles.quotesListContainer}>
        {sortedQuotes.map((quote) => (
          <div
            key={quote.id}
            onClick={() => setSelectedQuoteId(quote.id)}
            className={`${styles.quoteCard} ${
              quote.isAccepted ? styles.quoteCardAccepted : ''
            } ${selectedQuoteId === quote.id ? styles.quoteCardSelected : ''}`}
          >
            {/* CARD TOP: Merchant Identity */}
            <div className={styles.cardHeader}>
              <div className={styles.merchantProfileWrap}>
                <div className={styles.merchantAvatar}>
                  <Building2 size={20} className={styles.avatarIcon} />
                </div>
                <div className={styles.merchantInfo}>
                  <div className={styles.merchantNameRow}>
                    <h3 className={styles.merchantName}>{quote.merchantName}</h3>
                    {quote.verifiedMerchant && (
                      <span className={styles.verifiedBadge}>
                        <ShieldCheck size={12} className={styles.shieldIcon} />
                        <span>✓ Verified Merchant</span>
                      </span>
                    )}
                    {quote.isBestValue && (
                      <span className={styles.bestValueBadge}>BEST RATES</span>
                    )}
                  </div>
                  <span className={styles.shopLocation}>{quote.shopName}</span>
                  <div className={styles.merchantMetaRow}>
                    <span className={styles.pickupsCount}>
                      {quote.reviewsCount} verified pickups
                    </span>
                    <span>•</span>
                    <span className={styles.timeAgo}>Submitted {quote.receivedTime}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* CARD BODY: Two-Column Procurement Split */}
            <div className={styles.cardBodySplit}>
              {/* LEFT COLUMN: Materials Breakdown & Logistics */}
              <div className={styles.leftCol}>
                {/* 1. Itemized Rates Table */}
                <div className={styles.itemizedSection}>
                  <div className={styles.sectionHeadingRow}>
                    <span className={styles.sectionHeadingTitle}>
                      {quote.itemsBreakdown.length} Scrap Materials
                    </span>
                    <span className={styles.sectionHelperNote}>
                      Final billing based on actual measured quantity
                    </span>
                  </div>

                  <div className={styles.itemizedTable}>
                    <div className={styles.tableHeadRow}>
                      <span className={styles.colMaterial}>Material</span>
                      <span className={styles.colQty}>Listed Qty</span>
                      <span className={styles.colRate}>Quoted Unit Rate</span>
                    </div>

                    {quote.itemsBreakdown.map((item, idx) => (
                      <div
                        key={idx}
                        className={`${styles.tableDataRow} ${
                          idx % 2 === 1 ? styles.tableDataRowAlt : ''
                        }`}
                      >
                        <span className={styles.rowMaterialName}>{item.materialName}</span>
                        <span className={styles.rowQty}>
                          {item.quantity} {item.unit}
                        </span>
                        <span className={styles.rowRate}>
                          <strong>₹{item.offeredRate}</strong> / {item.unit}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. Logistics Information (3 Compact Horizontal Blocks) */}
                <div className={styles.logisticsGrid}>
                  <div className={styles.logisticsBlock}>
                    <div className={styles.logisticsBlockHeader}>
                      <Truck size={14} className={styles.logisticsIcon} />
                      <span className={styles.logisticsBlockLabel}>VEHICLE</span>
                    </div>
                    <strong className={styles.logisticsMainVal}>{quote.vehicleOffered}</strong>
                  </div>

                  <div className={styles.logisticsBlock}>
                    <div className={styles.logisticsBlockHeader}>
                      <Scale size={14} className={styles.logisticsIcon} />
                      <span className={styles.logisticsBlockLabel}>WEIGHING</span>
                    </div>
                    <strong className={styles.logisticsMainVal}>{quote.weighingMethod}</strong>
                  </div>

                  <div className={styles.logisticsBlock}>
                    <div className={styles.logisticsBlockHeader}>
                      <CreditCard size={14} className={styles.logisticsIcon} />
                      <span className={styles.logisticsBlockLabel}>SETTLEMENT</span>
                    </div>
                    <strong className={styles.logisticsMainVal}>{quote.paymentTerm}</strong>
                  </div>

                  <div className={styles.logisticsBlock}>
                    <div className={styles.logisticsBlockHeader}>
                      <Clock size={14} className={styles.logisticsIcon} />
                      <span className={styles.logisticsBlockLabel}>TIMING</span>
                    </div>
                    <strong className={styles.logisticsMainVal}>{quote.preferredTiming}</strong>
                  </div>
                </div>

                {/* 3. Merchant Voice Request */}
                <div className={styles.compactVoiceSection}>
                  <div className={styles.voiceHeader}>
                    <div className={styles.voiceLabelRow}>
                      <Volume2 size={14} className={styles.voiceHeaderIcon} />
                      <span className={styles.voiceLabelText}>Merchant Voice Request</span>
                    </div>
                    <span className={styles.voiceDurationBadge}>{quote.voiceNoteDuration}</span>
                  </div>

                  <div className={styles.voicePlayerStrip}>
                    <button
                      type="button"
                      className={`${styles.miniPlayBtn} ${
                        playingVoiceId === quote.id ? styles.miniPlayBtnActive : ''
                      }`}
                      onClick={() => togglePlayVoice(quote.id)}
                      title={playingVoiceId === quote.id ? 'Pause voice note' : 'Play voice note'}
                    >
                      {playingVoiceId === quote.id ? (
                        <Pause size={12} />
                      ) : (
                        <Play size={12} />
                      )}
                    </button>

                    {/* Audio Frequency Waveform Bars */}
                    <div className={styles.waveformContainer}>
                      {Array.from({ length: 28 }).map((_, i) => (
                        <div
                          key={i}
                          className={`${styles.waveformBar} ${
                            playingVoiceId === quote.id ? styles.waveformBarPlaying : ''
                          }`}
                          style={{
                            height: `${Math.max(4, Math.sin(i * 0.7) * 12 + Math.cos(i * 1.3) * 8 + 14)}px`,
                            animationDelay: `${i * 0.05}s`,
                          }}
                        />
                      ))}
                    </div>

                    <span className={styles.voiceTimestamp}>
                      {playingVoiceId === quote.id ? '0:12' : '0:00'} / {quote.voiceNoteDuration}
                    </span>
                  </div>

                  <div className={styles.transcriptBox}>
                    <span className={styles.transcriptLabel}>Transcript:</span>
                    <span className={styles.transcriptSnippet}>
                      &ldquo;{quote.voiceNoteTranscript}&rdquo;
                    </span>
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: Quoted Rates Status & Actions (NO ESTIMATED TOTAL) */}
              <div className={styles.rightCol}>
                <div className={styles.quoteFinancialCard}>
                  <div className={styles.quoteFinancialTop}>
                    <span className={styles.estLabel}>MERCHANT OFFER STATUS</span>
                    <div className={styles.ratesCountBlock}>
                      <strong className={styles.ratesCountHeading}>
                        {quote.itemsBreakdown.length} Item Rates Quoted
                      </strong>
                    </div>
                    <span className={styles.weighbridgeNote}>
                      Final billing will be calculated based on actual measured quantity upon pickup
                    </span>
                  </div>

                  <div className={styles.itemsSummaryLine}>
                    <Check size={13} className={styles.checkIconGreen} />
                    <span>Itemized Unit Rates Locked</span>
                  </div>

                  {/* Actions */}
                  <div className={styles.actionButtonsCol}>
                    {quote.isAccepted ? (
                      <div className={styles.acceptedTag}>
                        <CheckCircle2 size={16} />
                        <span>✓ Quote Accepted (OTP #1: 8492)</span>
                      </div>
                    ) : (
                      <button
                        type="button"
                        className={styles.primaryAcceptBtn}
                        onClick={() => handleOpenConfirmModal(quote)}
                      >
                        <span>Accept Quote</span>
                        <ArrowRight size={15} />
                      </button>
                    )}

                    <button
                      type="button"
                      className={styles.secondaryViewBtn}
                      onClick={() => setDetailedQuoteModal(quote)}
                    >
                      <Eye size={13} />
                      <span>View Detailed Quote</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>

      {/* 4. Interactive "Accept Quote" Confirmation Modal */}
      {confirmingQuote && (
        <div className={styles.modalOverlay} onClick={() => setConfirmingQuote(null)}>
          <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalMainTitle}>Confirm Quote Acceptance</h3>
              <button
                type="button"
                className={styles.modalCloseBtn}
                onClick={() => setConfirmingQuote(null)}
              >
                <X size={18} />
              </button>
            </div>

            <div className={styles.modalBody}>
              <p className={styles.modalNotice}>
                You are selecting <strong>{confirmingQuote.merchantName}</strong> for this scrap pickup.
              </p>

              <div className={styles.modalReviewDetailsBox}>
                <div className={styles.reviewRow}>
                  <span className={styles.reviewLabel}>Merchant:</span>
                  <strong className={styles.reviewVal}>{confirmingQuote.merchantName}</strong>
                </div>
                <div className={styles.reviewRow}>
                  <span className={styles.reviewLabel}>Materials:</span>
                  <strong className={styles.reviewVal}>
                    3 Items (Steel Turnings, Copper Cables, HDPE Drums)
                  </strong>
                </div>
                <div className={styles.reviewRow}>
                  <span className={styles.reviewLabel}>Quoted Unit Rates:</span>
                  <strong className={styles.reviewValHighlight}>
                    3 Itemized Unit Rates Locked (₹/KG, ₹/Unit)
                  </strong>
                </div>
                <div className={styles.reviewRow}>
                  <span className={styles.reviewLabel}>Pickup Date:</span>
                  <strong className={styles.reviewVal}>Friday, 16 May 2025 (10:00 AM – 12:00 PM)</strong>
                </div>
                <div className={styles.reviewRow}>
                  <span className={styles.reviewLabel}>Factory Location:</span>
                  <strong className={styles.reviewVal}>Gate 2 (Loading Bay Access), SIDCO Guindy</strong>
                </div>
              </div>

              <div className={styles.securityWarningBox}>
                <Info size={15} className={styles.infoIconYellow} />
                <p>
                  Accepting generates your Gate Entry OTP #1 (8492) and locks the quoted unit rates. Final settlement will be calculated based on actual measured quantity.
                </p>
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button
                type="button"
                className={styles.cancelModalBtn}
                onClick={() => setConfirmingQuote(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className={styles.confirmMerchantBtn}
                onClick={handleFinalConfirm}
              >
                <span>Confirm Merchant &amp; Dispatch</span>
                <Check size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. "View Detailed Quote" Modal (NO ESTIMATED SUBTOTAL) */}
      {detailedQuoteModal && (
        <div className={styles.modalOverlay} onClick={() => setDetailedQuoteModal(null)}>
          <div className={styles.modalCardLarge} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div className={styles.detailedHeaderLeft}>
                <Building2 size={20} className={styles.detailedHeaderIcon} />
                <div>
                  <h3 className={styles.modalMainTitle}>{detailedQuoteModal.merchantName}</h3>
                  <span className={styles.detailedHeaderSub}>
                    Official B2B Commercial Quotation • {detailedQuoteModal.shopName}
                  </span>
                </div>
              </div>
              <button
                type="button"
                className={styles.modalCloseBtn}
                onClick={() => setDetailedQuoteModal(null)}
              >
                <X size={18} />
              </button>
            </div>

            <div className={styles.modalBody}>
              {/* Detailed Itemized Rates Table */}
              <div className={styles.detailedTableSection}>
                <h4 className={styles.detailedSectionTitle}>Itemized Material Unit Rate Schedule</h4>
                <div className={styles.detailedTable}>
                  <div className={styles.detailedHeadRow}>
                    <span>Material Name</span>
                    <span>Listed Qty</span>
                    <span>Quoted Unit Rate</span>
                  </div>
                  {detailedQuoteModal.itemsBreakdown.map((item, idx) => (
                    <div key={idx} className={styles.detailedDataRow}>
                      <span className={styles.detailedMatName}>{item.materialName}</span>
                      <span>
                        {item.quantity} {item.unit}
                      </span>
                      <strong className={styles.rateText}>
                        ₹{item.offeredRate} / {item.unit}
                      </strong>
                    </div>
                  ))}
                  <div className={styles.detailedNoticeRow}>
                    <Check size={14} className={styles.checkIconGreen} />
                    <span>Itemized unit rates locked. Final settlement calculated using actual measured quantity on pickup.</span>
                  </div>
                </div>
              </div>

              {/* Logistics & Compliance Grid */}
              <div className={styles.detailedLogisticsGrid}>
                <div className={styles.detailedLogItem}>
                  <span className={styles.detailedLogLabel}>Assigned Logistics Vehicle</span>
                  <strong className={styles.detailedLogVal}>{detailedQuoteModal.vehicleOffered}</strong>
                </div>
                <div className={styles.detailedLogItem}>
                  <span className={styles.detailedLogLabel}>Weighing Equipment</span>
                  <strong className={styles.detailedLogVal}>{detailedQuoteModal.weighingMethod}</strong>
                </div>
                <div className={styles.detailedLogItem}>
                  <span className={styles.detailedLogLabel}>Payment Settlement Term</span>
                  <strong className={styles.detailedLogVal}>{detailedQuoteModal.paymentTerm}</strong>
                </div>
                <div className={styles.detailedLogItem}>
                  <span className={styles.detailedLogLabel}>Direct Merchant Contact</span>
                  <strong className={styles.detailedLogVal}>{detailedQuoteModal.merchantPhone}</strong>
                </div>
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button
                type="button"
                className={styles.cancelModalBtn}
                onClick={() => setDetailedQuoteModal(null)}
              >
                Close Detailed View
              </button>
              <button
                type="button"
                className={styles.confirmMerchantBtn}
                onClick={() => {
                  const q = detailedQuoteModal;
                  setDetailedQuoteModal(null);
                  setConfirmingQuote(q);
                }}
              >
                <span>Proceed to Accept Quote →</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. Success Modal after Acceptance */}
      {acceptedSuccessQuote && (
        <div className={styles.modalOverlay} onClick={() => setAcceptedSuccessQuote(null)}>
          <div className={styles.successModalCard} onClick={(e) => e.stopPropagation()}>
            <div className={styles.successRing}>
              <CheckCircle2 size={44} className={styles.successCheckIcon} />
            </div>
            <h2 className={styles.successTitle}>Merchant Quote Accepted!</h2>
            <p className={styles.successDesc}>
              You have accepted the offer from <strong>{acceptedSuccessQuote.merchantName}</strong>. Your pickup order is now scheduled.
            </p>

            <div className={styles.nextOtpBox}>
              <span className={styles.nextOtpLabel}>GATE ENTRY OTP #1:</span>
              <strong className={styles.nextOtpVal}>8492</strong>
              <span className={styles.nextOtpSub}>Provide this to driver upon arrival at factory gate</span>
            </div>

            <div className={styles.successModalButtons}>
              <button
                type="button"
                className={styles.viewOrderPrimaryBtn}
                onClick={() => navigate('/industry/orders')}
              >
                <span>Track Pickup in Orders →</span>
              </button>
              <button
                type="button"
                className={styles.stayQuotesBtn}
                onClick={() => setAcceptedSuccessQuote(null)}
              >
                Stay on Quotes Page
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
