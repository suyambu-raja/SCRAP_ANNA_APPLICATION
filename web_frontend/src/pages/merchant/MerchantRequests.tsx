import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Zap,
  Tag,
  ShieldCheck,
  RotateCw,
  ChevronDown,
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
} from 'lucide-react';
import { CardImageGallery } from '@/components/cards/CardImageGallery';
import styles from './MerchantRequests.module.css';

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
  quotedPrice: number;
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

export default function MerchantRequests() {
  const [activeTab, setActiveTab] = useState<'Industry' | 'Individual'>('Industry');
  const [industryRequests, setIndustryRequests] = useState<RequestItem[]>(INITIAL_INDUSTRY_REQUESTS);
  const [householdRequests, setHouseholdRequests] = useState<RequestItem[]>(INITIAL_HOUSEHOLD_REQUESTS);

  // Mobile Top Tab Switcher (Available Requests vs My Offers)
  const [mobileActiveTab, setMobileActiveTab] = useState<'available' | 'offers'>('available');

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
      quotedPrice: 31200,
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
      materialName: 'Heavy Melting Steel Scrap',
      materialCondition: 'Clean Segregated',
      image: '/industry-steel-scrap.jpg',
      quantity: '500 – 800 KG',
      address: '24, 5th Main Road, SIDCO Industrial Estate, Guindy, Chennai',
      quotedPrice: 18500,
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
      quotedPrice: 14200,
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
      materialName: 'Aluminium Profile Scrap',
      materialCondition: 'Mixed',
      image: '/industry-aluminium-scrap.jpg',
      quantity: '200 – 350 KG',
      address: 'Industrial Estate, Ambattur, Chennai',
      quotedPrice: 38000,
      pickupSlot: '10 May 2025, 11:00 AM',
      submittedAgo: 'Submitted 2 days ago',
      status: 'Expired',
      statusType: 'expired',
      statusBadgeText: 'Deadline Expired',
    },
  ]);

  const [countdown, setCountdown] = useState(25);
  const [selectedScrapFilter, setSelectedScrapFilter] = useState('All Types');
  const [selectedAmountFilter, setSelectedAmountFilter] = useState('All Amounts');
  const [selectedLocationFilter, setSelectedLocationFilter] = useState('All Locations');
  const [extensionTime, setExtensionTime] = useState('+ 15 minutes');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Quote Submission Modal State
  const [activeQuoteRequest, setActiveQuoteRequest] = useState<RequestItem | null>(null);
  const [quotePrice, setQuotePrice] = useState<string>('');
  const [quotePickupDate, setQuotePickupDate] = useState<string>('2025-05-13');
  const [quotePickupTime, setQuotePickupTime] = useState<string>('10:00 AM – 12:00 PM');
  const [quoteNote, setQuoteNote] = useState<string>('');
  
  // Voice Recording Simulator State
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [hasRecordedAudio, setHasRecordedAudio] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Details Modal State
  const [detailsModalRequest, setDetailsModalRequest] = useState<RequestItem | null>(null);

  // Floating Image Preview Modal State
  const [floatingImage, setFloatingImage] = useState<{
    src: string;
    title: string;
    condition: string;
    quantity: string;
    posterName: string;
  } | null>(null);

  // Auto refresh timer simulation
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((c) => (c > 1 ? c - 1 : 30));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

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

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleOpenQuoteModal = (req: RequestItem) => {
    setActiveQuoteRequest(req);
    // Pre-populate with reasonable default based on material
    setQuotePrice('');
    setQuotePickupDate('2025-05-13');
    setQuotePickupTime(req.pickupTime || '10:00 AM – 12:00 PM');
    setQuoteNote('We bring calibrated digital scales and provide instant spot UPI payment.');
    setIsRecording(false);
    setRecordingSeconds(0);
    setHasRecordedAudio(false);
    setIsPlayingAudio(false);
  };

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
    if (!quotePrice || Number(quotePrice) <= 0) {
      triggerToast('⚠️ Please enter a valid quote price.');
      return;
    }

    setIndustryRequests((prev) =>
      prev.map((r) =>
        r.id === activeQuoteRequest.id
          ? {
              ...r,
              status: 'accepted',
              submittedQuote: {
                price: Number(quotePrice),
                pickupDate: quotePickupDate,
                pickupTime: quotePickupTime,
                hasVoiceNote: hasRecordedAudio,
                note: quoteNote,
              },
            }
          : r
      )
    );

    const newOffer: QuoteOfferItem = {
      id: `QUO-${Date.now().toString().slice(-6)}`,
      customerName: activeQuoteRequest.posterName,
      customerType: activeQuoteRequest.requesterType,
      materialName: activeQuoteRequest.materialName,
      materialCondition: activeQuoteRequest.materialCondition + ' Condition',
      image: activeQuoteRequest.image,
      quantity: activeQuoteRequest.quantity,
      address: activeQuoteRequest.address,
      quotedPrice: Number(quotePrice),
      pickupSlot: `${quotePickupDate}, ${quotePickupTime}`,
      submittedAgo: 'Just now',
      status: 'Waiting',
      statusType: 'waiting',
      statusBadgeText: 'Waiting for Response',
    };
    setSubmittedOffers((prev) => [newOffer, ...prev]);

    triggerToast(`✓ Quote of ₹${Number(quotePrice).toLocaleString('en-IN')} submitted to ${activeQuoteRequest.posterName}!`);
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

  return (
    <div className={styles.pageWrapper}>
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className={styles.toastBanner}>
          <CheckCircle2 size={18} />
          <span>{toastMessage}</span>
        </div>
      )}

      <main className={styles.mainContainer}>
        <div className={styles.requestsLayoutGrid}>
          {/* ================================================================
              LEFT COLUMN: MAIN REQUESTS LIST (70%)
             ================================================================ */}
          <section className={styles.mainCol}>
            {/* 1. Page Header */}
            <div className={styles.pageHeaderRow}>
              <div className={styles.headerTitleGroup}>
                <h1 className={styles.pageTitle}>New Scrap Requests</h1>
                <p className={styles.pageSubtitle}>
                  Review live scrap inquiries, submit competitive quotes, and lock in direct pickups.
                </p>
              </div>

              <div className={styles.autoRefreshTag}>
                <RotateCw size={13} />
                <span>Auto refresh in {countdown}s</span>
              </div>
            </div>

            {/* 2. 4-Column Highlights Strip */}
            <div className={styles.highlightsGrid}>
              <div className={styles.highlightCard}>
                <div className={styles.highlightIconCircle}>
                  <Zap size={16} />
                </div>
                <div className={styles.highlightTextCol}>
                  <span className={styles.highlightTitle}>Direct Leads</span>
                  <span className={styles.highlightSub}>100% verified inquiries</span>
                </div>
              </div>

              <div className={styles.highlightCard}>
                <div className={styles.highlightIconCircle}>
                  <Tag size={15} />
                </div>
                <div className={styles.highlightTextCol}>
                  <span className={styles.highlightTitle}>Custom Quotes</span>
                  <span className={styles.highlightSub}>Set your own buying price</span>
                </div>
              </div>

              <div className={styles.highlightCard}>
                <div className={styles.highlightIconCircle}>
                  <Volume2 size={16} />
                </div>
                <div className={styles.highlightTextCol}>
                  <span className={styles.highlightTitle}>Voice Quotes</span>
                  <span className={styles.highlightSub}>Record audio instructions</span>
                </div>
              </div>

              <div className={styles.highlightCard}>
                <div className={styles.highlightIconCircle}>
                  <ShieldCheck size={16} />
                </div>
                <div className={styles.highlightTextCol}>
                  <span className={styles.highlightTitle}>Lead Priority</span>
                  <span className={styles.highlightSub}>On-time commission boost</span>
                </div>
              </div>
            </div>

            {/* MOBILE TOP TAB SWITCHER (Available Requests vs My Offers) */}
            <div className={styles.mobileTopTabTrack}>
              <button
                type="button"
                className={`${styles.mobileTabBtn} ${
                  mobileActiveTab === 'available' ? styles.mobileTabBtnActive : ''
                }`}
                onClick={() => setMobileActiveTab('available')}
              >
                <span>Available Requests</span>
                <span className={styles.mobileTabCount}>{industryRequests.length + householdRequests.length}</span>
              </button>
              <button
                type="button"
                className={`${styles.mobileTabBtn} ${
                  mobileActiveTab === 'offers' ? styles.mobileTabBtnActive : ''
                }`}
                onClick={() => setMobileActiveTab('offers')}
              >
                <span>My Offers</span>
                <span className={styles.mobileTabCountOffers}>{submittedOffers.length}</span>
              </button>
            </div>

            {/* 3. Tab Switcher: Industry Requests vs Household Requests (Desktop & Mobile Available Tab) */}
            <div className={`${styles.tabContainer} ${mobileActiveTab === 'offers' ? styles.tabContainerMobileHidden : ''}`}>
              <div className={styles.tabTrack}>
                <button
                  type="button"
                  className={[
                    styles.tabButton,
                    activeTab === 'Industry' ? styles.tabButtonActive : '',
                  ].join(' ')}
                  onClick={() => setActiveTab('Industry')}
                >
                  <Building size={17} />
                  <span>Industry Requests</span>
                  <span className={activeTab === 'Industry' ? styles.tabCountBadgeActive : styles.tabCountBadge}>
                    {industryRequests.filter((r) => r.status === 'pending').length}
                  </span>
                </button>

                <button
                  type="button"
                  className={[
                    styles.tabButton,
                    activeTab === 'Individual' ? styles.tabButtonActive : '',
                  ].join(' ')}
                  onClick={() => setActiveTab('Individual')}
                >
                  <User size={17} />
                  <span>Household Requests</span>
                  <span className={activeTab === 'Individual' ? styles.tabCountBadgeActive : styles.tabCountBadge}>
                    {householdRequests.filter((r) => r.status === 'pending').length}
                  </span>
                </button>
              </div>
            </div>

            {/* MOBILE MY OFFERS FEED (Visible on mobile when My Offers tab is selected) */}
            {mobileActiveTab === 'offers' && (
              <div className={styles.mobileOffersSection}>
                <div className={styles.mobileOffersHeaderRow}>
                  <h2 className={styles.mobileOffersTitle}>My Submitted Offers ({submittedOffers.length})</h2>
                  <span className={styles.mobileOffersSub}>Track live response &amp; accepted pickups</span>
                </div>

                <div className={styles.mobileOffersList}>
                  {submittedOffers.map((offer) => (
                    <article
                      key={offer.id}
                      className={`${styles.mobileOfferCard} ${
                        offer.statusType === 'accepted' ? styles.mobileOfferCardAccepted : ''
                      }`}
                    >
                      <div className={styles.mobileOfferHeader}>
                        <span
                          className={`${styles.mobileOfferStatusBadge} ${
                            styles[`statusBadge_${offer.statusType}`]
                          }`}
                        >
                          {offer.statusType === 'accepted' && '✓ '}
                          {offer.statusBadgeText}
                        </span>
                        <span className={styles.mobileOfferId}>ID: {offer.id}</span>
                      </div>

                      <div className={styles.mobileOfferCustomerRow}>
                        <span className={styles.mobileCustomerLabel}>Customer:</span>
                        <strong className={styles.mobileCustomerName}>{offer.customerName}</strong>
                        <span className={styles.mobileCustomerTypePill}>{offer.customerType}</span>
                      </div>

                      <div className={styles.mobileOfferBodyGrid}>
                        <img src={offer.image} alt={offer.materialName} className={styles.mobileOfferThumb} />
                        <div className={styles.mobileOfferInfoCol}>
                          <h3 className={styles.mobileOfferMat}>{offer.materialName}</h3>
                          <span className={styles.mobileOfferCondition}>{offer.materialCondition}</span>
                          <span className={styles.mobileOfferQty}>
                            Quantity: <strong>{offer.quantity}</strong>
                          </span>
                        </div>
                      </div>

                      <div className={styles.mobileOfferQuoteBox}>
                        <div className={styles.mobileQuoteLeft}>
                          <span className={styles.mobileQuoteLabel}>Your Submitted Offer</span>
                          <strong className={styles.mobileQuotePrice}>
                            ₹{offer.quotedPrice.toLocaleString('en-IN')} <small>Total</small>
                          </strong>
                        </div>
                        <div className={styles.mobileQuoteRight}>
                          <span className={styles.mobileSlotLabel}>Offered Slot:</span>
                          <span className={styles.mobileSlotText}>{offer.pickupSlot}</span>
                        </div>
                      </div>

                      <div className={styles.mobileOfferLocRow}>
                        <MapPin size={13} className={styles.locIconMuted} />
                        <span>{offer.address}</span>
                      </div>

                      {offer.statusType === 'accepted' ? (
                        <div className={styles.mobileAcceptedActionBox}>
                          <div className={styles.mobileAcceptedNotice}>
                            🎉 Customer agreed to ₹{offer.quotedPrice.toLocaleString('en-IN')} offer!
                          </div>
                          <Link
                            to={`/orders?orderId=${offer.id.replace('QUO', 'ORD')}&customer=${encodeURIComponent(offer.customerName)}&rate=${offer.quotedPrice}&action=pickup`}
                            className={styles.mobileGoToOrderBtn}
                          >
                            <Truck size={15} />
                            <span>Go to Order Details &amp; Start Pickup →</span>
                          </Link>
                        </div>
                      ) : (
                        <div className={styles.mobileOfferFooterRow}>
                          <span className={styles.mobileSubmittedTime}>{offer.submittedAgo}</span>
                          <span className={styles.mobileOfferStatusSub}>
                            {offer.statusType === 'waiting' && '⏳ Waiting for customer review'}
                            {offer.statusType === 'rejected' && '❌ Offer not selected'}
                            {offer.statusType === 'expired' && '⏰ Request time limit passed'}
                          </span>
                        </div>
                      )}
                    </article>
                  ))}
                </div>
              </div>
            )}

            {/* 4. Requests Counter Bar & Sorting */}
            <div className={`${styles.requestsBar} ${mobileActiveTab === 'offers' ? styles.requestsBarMobileHidden : ''}`}>
              <div className={styles.countGroup}>
                <h2 className={styles.countHeading}>
                  {pendingCount} {activeTab === 'Industry' ? 'Industry' : 'Household'} Requests
                </h2>
                <span className={styles.liveBadge}>Live</span>
              </div>

              <div className={styles.sortSelector}>
                <span>Sort by: Newest First</span>
                <ChevronDown size={14} />
              </div>
            </div>

            {/* 5. Requests List (Redesigned Image-First Cards) */}
            <div className={`${styles.requestsList} ${mobileActiveTab === 'offers' ? styles.requestsListMobileHidden : ''}`}>
              {filteredRequests.map((item) => (
                <article key={item.id} className={styles.requestCard}>
                  {/* Top Poster & Request ID Strip */}
                  <div className={styles.cardHeaderRow}>
                    <div className={styles.cardHeaderLeft}>
                      <span className={styles.newBadge}>NEW</span>
                      <div className={styles.posterGroup}>
                        <span className={styles.posterLabel}>Posted by:</span>
                        <span className={styles.posterName}>{item.posterName}</span>
                      </div>
                      <div className={styles.requesterTypeBadge}>
                        {item.requesterType === 'Individual' ? <User size={12} /> : <Building size={12} />}
                        <span>{item.requesterType}</span>
                      </div>
                    </div>

                    <span className={styles.requestIdMuted}>ID: {item.id}</span>
                  </div>

                  {/* Redesigned Card Body: Prominent Top/Left Image + Clear Scrap Specs */}
                  <div className={styles.cardBodyGrid}>
                    {/* 1. Large Image Showcase Column with Multi-Image Swipe */}
                    <div className={styles.imageShowcaseCol}>
                      <CardImageGallery
                        images={item.images || [item.image]}
                        fallbackImage={item.image || '/logo-icon.png'}
                        materialName={item.materialName}
                        materialCondition={item.materialCondition}
                        onOpenPreview={(src) =>
                          setFloatingImage({
                            src,
                            title: item.materialName,
                            condition: item.materialCondition,
                            quantity: item.quantity,
                            posterName: item.posterName,
                          })
                        }
                      />

                      <div className={styles.materialTitleBlock}>
                        <h3 className={styles.materialTitle}>{item.materialName}</h3>
                        <div className={styles.quantityTag}>
                          <span className={styles.quantityHighlight}>{item.quantity}</span>
                          <span className={styles.approxText}>(Approx.)</span>
                        </div>
                      </div>
                    </div>

                    {/* 2. Middle Column: Address & Pickup Schedule */}
                    <div className={styles.detailsCol}>
                      <div className={styles.detailRow}>
                        <MapPin size={16} className={styles.detailIcon} />
                        <div className={styles.addressCol}>
                          <span className={styles.detailLabel}>PICKUP ADDRESS</span>
                          <span className={styles.addressValue}>{item.address}</span>
                        </div>
                      </div>

                      <div className={styles.detailRow}>
                        <Calendar size={16} className={styles.detailIcon} />
                        <div className={styles.pickupTimeRow}>
                          <span className={styles.detailLabel}>PICKUP BY</span>
                          <span className={styles.pickupTimeValue}>
                            {item.pickupDate} &nbsp;•&nbsp; {item.pickupTime}
                          </span>
                        </div>
                      </div>

                      {/* If Quote is already submitted (Industry) or Pickup accepted (Household) */}
                      {item.status === 'accepted' && (
                        item.requesterType === 'Industry' && item.submittedQuote ? (
                          <div className={styles.submittedQuoteBanner}>
                            <CheckCircle2 size={15} />
                            <span>
                              Quote Sent: <strong>₹{item.submittedQuote.price.toLocaleString('en-IN')}</strong> for {item.submittedQuote.pickupTime}
                              {item.submittedQuote.hasVoiceNote && ' • 🎙️ Audio Included'}
                            </span>
                          </div>
                        ) : (
                          <div className={styles.submittedQuoteBanner}>
                            <CheckCircle2 size={15} />
                            <span>
                              ✓ Doorstep Pickup Accepted • Ready to move to house for weighing &amp; spot payment
                            </span>
                          </div>
                        )
                      )}
                    </div>

                    {/* 3. Right Column: Response Deadline & Action Buttons */}
                    <div className={styles.actionsCol}>
                      <div className={styles.respondBeforeGroup}>
                        <span className={styles.respondBeforeLabel}>Respond before</span>
                        <span className={styles.respondBeforeTime}>{item.respondTime}</span>
                        <span className={styles.respondBeforeDate}>{item.respondDate}</span>
                      </div>

                      <div className={styles.buttonsStack}>
                        {item.status === 'accepted' ? (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', width: '100%' }}>
                            <div className={styles.acceptedTagBadge}>
                              <Check size={14} />
                              <span>{item.requesterType === 'Individual' ? 'Pickup Accepted' : 'Quote Submitted'}</span>
                            </div>
                            {item.requesterType === 'Individual' && (
                              <Link
                                to="/ride"
                                className={styles.navigateHouseBtn}
                                title="Move to customer house for pickup"
                              >
                                <Truck size={13} />
                                <span>Go to House →</span>
                              </Link>
                            )}
                          </div>
                        ) : item.status === 'denied' ? (
                          <div className={styles.declinedTagBadge}>
                            <X size={14} />
                            <span>Declined</span>
                          </div>
                        ) : (
                          <>
                            <button
                              type="button"
                              className={styles.acceptBtn}
                              onClick={() => handleAcceptRequest(item)}
                              title={
                                item.requesterType === 'Industry'
                                  ? 'Submit your custom price quote and pickup slot'
                                  : "Directly accept and move to customer's house"
                              }
                            >
                              {item.requesterType === 'Industry' ? 'Accept & Quote' : 'Accept Pickup'}
                            </button>
                            <button
                              type="button"
                              className={styles.denyBtn}
                              onClick={() => handleDeny(item.id, item.requesterType)}
                            >
                              Deny
                            </button>
                            <button
                              type="button"
                              className={styles.viewDetailsBtn}
                              onClick={() => setDetailsModalRequest(item)}
                            >
                              View Details
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className={styles.cardFooter}>
                    <span>{item.requestedAgo}</span>
                    <span className={styles.verifiedFooterText}>
                      <ShieldCheck size={13} /> Verified Contact
                    </span>
                  </div>
                </article>
              ))}

              {/* Extension Strip */}
              <div className={styles.extensionStrip}>
                <div className={styles.extensionLeft}>
                  <div className={styles.extensionIconCircle}>
                    <Clock size={18} />
                  </div>
                  <div className={styles.extensionTextCol}>
                    <div className={styles.extensionTitle}>Need more time to calculate?</div>
                    <div className={styles.extensionSub}>
                      Request an extension once to keep your priority slot active.
                    </div>
                  </div>
                </div>

                <div className={styles.extensionRight}>
                  <div className={styles.extensionControls}>
                    <select
                      value={extensionTime}
                      onChange={(e) => setExtensionTime(e.target.value)}
                      className={styles.extensionSelect}
                      aria-label="Extend Response Time"
                    >
                      <option value="+ 15 minutes">+ 15 minutes</option>
                      <option value="+ 30 minutes">+ 30 minutes</option>
                      <option value="+ 1 hour">+ 1 hour</option>
                    </select>

                    <button
                      type="button"
                      className={styles.extensionBtn}
                      onClick={handleRequestExtension}
                    >
                      Request Extension
                    </button>
                  </div>
                  <span className={styles.extensionNote}>
                    Customer will be notified of your extended review window.
                  </span>
                </div>
              </div>

              {/* Bottom Banner */}
              <div className={styles.bottomBanner}>
                <div className={styles.bannerLeft}>
                  <div className={styles.bannerIconCircle}>
                    <TrendingUp size={22} />
                  </div>
                  <div className={styles.bannerTextCol}>
                    <div className={styles.bannerTitle}>Respond within 15 minutes to win 3x more deals</div>
                    <div className={styles.bannerSub}>
                      Merchants who quote first with realistic market pricing close 82% of all assigned scrap pickups.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ================================================================
              RIGHT SIDEBAR (30%)
             ================================================================ */}
          <aside className={styles.sidebarCol}>
            {/* Card 1: How It Works */}
            <div className={styles.sidebarCard}>
              <h3 className={styles.sidebarCardTitle}>How Quoting Works</h3>
              <ol className={styles.stepsList}>
                <li className={styles.stepItem}>
                  <div className={styles.stepNumber}>1</div>
                  <div className={styles.stepText}>
                    <strong>Review specifications:</strong> Inspect photo, volume, and location.
                  </div>
                </li>
                <li className={styles.stepItem}>
                  <div className={styles.stepNumber}>2</div>
                  <div className={styles.stepText}>
                    <strong>Click Accept & Submit Quote:</strong> Set your total price, available slot, and optional voice note.
                  </div>
                </li>
                <li className={styles.stepItem}>
                  <div className={styles.stepNumber}>3</div>
                  <div className={styles.stepText}>
                    <strong>Customer Confirms:</strong> Once accepted, deal moves to Orders with calibrated digital weighing.
                  </div>
                </li>
              </ol>
            </div>

            {/* Card 3: Merchant Benefits */}
            <div className={styles.sidebarCard}>
              <h3 className={styles.sidebarCardTitle}>Merchant Benefits</h3>
              <ul className={styles.benefitsList}>
                <li className={styles.benefitItem}>
                  <Check size={16} className={styles.benefitCheckIcon} />
                  <span>No commission until pickup completion</span>
                </li>
                <li className={styles.benefitItem}>
                  <Check size={16} className={styles.benefitCheckIcon} />
                  <span>Direct GPS navigation to pickup gates</span>
                </li>
                <li className={styles.benefitItem}>
                  <Check size={16} className={styles.benefitCheckIcon} />
                  <span>Priority lead distribution for on-time payers</span>
                </li>
              </ul>
            </div>

            {/* Card 4: Need Help? */}
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
              {/* Request Summary Box */}
              <div className={styles.modalSummaryBox}>
                <img
                  src={activeQuoteRequest.image}
                  alt={activeQuoteRequest.materialName}
                  className={styles.modalSummaryImg}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = '/logo-icon.png';
                  }}
                />
                <div className={styles.modalSummaryInfo}>
                  <div className={styles.modalSummaryTitle}>
                    {activeQuoteRequest.materialName} ({activeQuoteRequest.quantity})
                  </div>
                  <div className={styles.modalSummarySub}>
                    Posted by: <strong>{activeQuoteRequest.posterName}</strong> ({activeQuoteRequest.requesterType})
                  </div>
                  <div className={styles.modalSummaryLocation}>
                    📍 {activeQuoteRequest.address}
                  </div>
                </div>
              </div>

              {/* 1. Required Field: Your Price (₹) */}
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  <span>Your Price (Total Offer in ₹)</span>
                  <span className={styles.requiredStar}>*</span>
                </label>
                <div className={styles.priceInputWrapper}>
                  <span className={styles.currencyPrefix}>₹</span>
                  <input
                    type="number"
                    min="1"
                    step="any"
                    placeholder="Enter total offer amount (e.g. 12500)"
                    value={quotePrice}
                    onChange={(e) => setQuotePrice(e.target.value)}
                    className={styles.formInputPrice}
                    required
                    autoFocus
                  />
                </div>
                <span className={styles.formHelperText}>
                  Enter the total purchase amount you are offering for this entire batch.
                </span>
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
                  placeholder="e.g. We bring calibrated digital weighing scale and offer spot UPI transfer."
                  className={styles.formTextarea}
                />
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
              <div className={styles.detailsModalImgBox}>
                <img
                  src={detailsModalRequest.image}
                  alt={detailsModalRequest.materialName}
                  className={styles.detailsModalImg}
                />
              </div>

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
                  <span className={styles.specLabel}>Pickup Address</span>
                  <span className={styles.specValue}>{detailsModalRequest.address}</span>
                </div>
              </div>

              <div className={styles.modalActionsRow}>
                <button
                  type="button"
                  className={styles.modalCancelBtn}
                  onClick={() => setDetailsModalRequest(null)}
                >
                  Close
                </button>
                {detailsModalRequest.status === 'pending' && (
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
                )}
              </div>
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
