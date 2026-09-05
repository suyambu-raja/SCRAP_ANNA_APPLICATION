import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Megaphone,
  TrendingUp,
  TrendingDown,
  Clock,
  Calendar,
  Truck,
  IndianRupee,
  MapPin,
  ArrowRight,
  ChevronDown,
  Zap,
  Navigation,
  Plus,
  Check,
  Edit3,
  Info,
  MessageSquareQuote,
  Star,
  Mic,
  Square,
  Play,
  Pause,
  Trash2,
  Send,
  CheckCircle2,
  Volume2,
  AlertCircle,
} from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { submitPrivateFeedback } from '@/services/feedbackService';
import styles from './MerchantDashboard.module.css';

interface ScrapPriceItem {
  id: string;
  name: string;
  priceRange: string;
  change: string;
  trend: 'up' | 'down';
  img: string;
}

const STORAGE_KEY = 'billscrap_merchant_custom_prices';

const DEFAULT_MERCHANT_RATES: Record<string, { rate: number; lastUpdated: string }> = {
  iron: { rate: 27, lastUpdated: 'Today, 9:30 AM' },
  copper: { rate: 700, lastUpdated: 'Today, 9:30 AM' },
  aluminium: { rate: 155, lastUpdated: 'Today, 9:30 AM' },
  brass: { rate: 480, lastUpdated: 'Yesterday' },
  steel: { rate: 30, lastUpdated: 'Today, 9:30 AM' },
  plastic: { rate: 22, lastUpdated: 'Today, 9:30 AM' },
  paper: { rate: 14, lastUpdated: '2 days ago' },
  ewaste: { rate: 40, lastUpdated: 'Today, 9:30 AM' },
};

const SCRAP_PRICES: ScrapPriceItem[] = [
  { id: 'iron', name: 'Iron', priceRange: '₹ 25 - 28 / KG', change: '2%', trend: 'up', img: '/scrap-iron.png' },
  { id: 'copper', name: 'Copper', priceRange: '₹ 680 - 720 / KG', change: '1.5%', trend: 'up', img: '/scrap-copper.png' },
  { id: 'aluminium', name: 'Aluminium', priceRange: '₹ 145 - 160 / KG', change: '1%', trend: 'down', img: '/scrap-commercial-aluminium.png' },
  { id: 'brass', name: 'Brass', priceRange: '₹ 460 - 500 / KG', change: '1%', trend: 'up', img: '/scrap-brass.png' },
  { id: 'steel', name: 'Steel', priceRange: '₹ 28 - 32 / KG', change: '1.8%', trend: 'up', img: '/scrap-quality-steel.png' },
  { id: 'plastic', name: 'Plastic', priceRange: '₹ 20 - 25 / KG', change: '0.5%', trend: 'up', img: '/scrap-grade-plastic.png' },
  { id: 'paper', name: 'Paper', priceRange: '₹ 12 - 15 / KG', change: '0.8%', trend: 'up', img: '/scrap-cardboard.png' },
  { id: 'ewaste', name: 'E-Waste', priceRange: '₹ 35 - 45 / KG', change: '1.2%', trend: 'up', img: '/scrap-cpu.png' },
];

const MERCHANT_TICKER_MESSAGES = [
  { id: 'msg-1', text: 'Puja Special · More scrap is expected before the festival. Stay active and earn more.' },
  { id: 'msg-2', text: 'New Requests · Nearby households are looking for scrap buyers.' },
  { id: 'msg-3', text: 'Respond Faster · Quick quotes can help you win more requests.' },
  { id: 'msg-4', text: 'Keep Rates Updated · Show competitive prices to attract more sellers.' },
  { id: 'msg-5', text: 'Grow Your Business · Complete more pickups and build your BillScrap presence.' },
];

interface HeroSlide {
  id: string;
  type: 'image' | 'gold-banner';
  image?: string;
  title?: string;
  subtitle?: string;
  link: string;
  alt?: string;
  bgColor?: string;
}

const HERO_SLIDES: HeroSlide[] = [
  {
    id: 'ayudha-puja',
    type: 'image',
    image: '/promo-ayudha-puja.png',
    link: '/dashboard/merchant/requests',
    alt: 'Ayudha Puja Special - Clean your space. Sell your scrap.',
    bgColor: '#FAF5E8',
  },
  {
    id: 'nearby-collectors',
    type: 'image',
    image: '/promo-nearby-collectors.png',
    link: '/dashboard/merchant/requests',
    alt: 'Nearby scrap collectors ready to pickup - Fast Pickup, Fair Pricing, Digital Payment',
    bgColor: '#111215',
  },
  {
    id: 'market-rates',
    type: 'image',
    image: '/promo-market-rates.png',
    link: '/merchant/market-prices',
    alt: "Today's Market Rates - Stay updated, quote better",
    bgColor: '#F4F5F6',
  },
  {
    id: 'merchant-value',
    type: 'gold-banner',
    title: 'Grow your scrap business',
    subtitle: 'Show full bills • Accurate quotes\nFast response • Direct digital payouts',
    link: '/dashboard/merchant/requests',
  },
  {
    id: 'greener-tomorrow',
    type: 'image',
    image: '/promo-greener-tomorrow.png',
    link: '/dashboard/merchant/requests',
    alt: 'Building a cleaner, greener tomorrow - Trusted by Households & Businesses',
    bgColor: '#12200A',
  },
];

export default function MerchantDashboard() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);

  // Status & Service Area State
  const [isAcceptingRequests, setIsAcceptingRequests] = useState(true);

  // In-Card Merchant Feedback State (Simple Description + Voice Recorder)
  const [merchantFeedbackRating, setMerchantFeedbackRating] = useState<number>(5);
  const [hoverFeedbackRating, setHoverFeedbackRating] = useState<number>(0);
  const [feedbackText, setFeedbackText] = useState<string>('');
  const [isRecordingFeedback, setIsRecordingFeedback] = useState<boolean>(false);
  const [feedbackRecordDuration, setFeedbackRecordDuration] = useState<number>(0);
  const [feedbackAudioUrl, setFeedbackAudioUrl] = useState<string | null>(null);
  const [isPlayingFeedbackAudio, setIsPlayingFeedbackAudio] = useState<boolean>(false);
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState<boolean>(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState<boolean>(false);
  const [feedbackInputError, setFeedbackInputError] = useState<string | null>(null);

  // Audio refs
  const feedbackMediaRecorderRef = useRef<MediaRecorder | null>(null);
  const feedbackAudioChunksRef = useRef<Blob[]>([]);
  const feedbackTimerRef = useRef<number | null>(null);
  const feedbackAudioPlayerRef = useRef<HTMLAudioElement | null>(null);
  const feedbackTextareaRef = useRef<HTMLTextAreaElement | null>(null);

  const resetFeedbackRecording = () => {
    if (feedbackTimerRef.current) {
      clearInterval(feedbackTimerRef.current);
      feedbackTimerRef.current = null;
    }
    if (feedbackMediaRecorderRef.current && feedbackMediaRecorderRef.current.state === 'recording') {
      try {
        feedbackMediaRecorderRef.current.stop();
      } catch (e) {
        // ignore
      }
    }
    feedbackMediaRecorderRef.current = null;
    feedbackAudioChunksRef.current = [];
    setIsRecordingFeedback(false);
    setFeedbackRecordDuration(0);
    setFeedbackAudioUrl(null);
    setIsPlayingFeedbackAudio(false);
  };

  const handleStartFeedbackRecording = async () => {
    resetFeedbackRecording();
    setFeedbackInputError(null);
    setIsRecordingFeedback(true);
    setFeedbackRecordDuration(0);

    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        feedbackMediaRecorderRef.current = mediaRecorder;
        feedbackAudioChunksRef.current = [];

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            feedbackAudioChunksRef.current.push(event.data);
          }
        };

        mediaRecorder.onstop = () => {
          stream.getTracks().forEach((track) => track.stop());
          const audioBlob = new Blob(feedbackAudioChunksRef.current, { type: 'audio/webm' });
          const audioUrl = URL.createObjectURL(audioBlob);
          setFeedbackAudioUrl(audioUrl);
        };

        mediaRecorder.start(200);

        feedbackTimerRef.current = window.setInterval(() => {
          setFeedbackRecordDuration((prev) => {
            if (prev >= 120) {
              handleStopFeedbackRecording();
              return 120;
            }
            return prev + 1;
          });
        }, 1000);
      } else {
        // Fallback for environments without mic support
        setFeedbackAudioUrl('simulated-voice-note');
        setFeedbackRecordDuration(12);
        setIsRecordingFeedback(false);
      }
    } catch (err) {
      console.warn('Microphone access denied or unavailable, using simulated voice capture', err);
      setFeedbackAudioUrl('simulated-voice-note');
      setFeedbackRecordDuration(10);
      setIsRecordingFeedback(false);
    }
  };

  const handleStopFeedbackRecording = () => {
    if (feedbackTimerRef.current) {
      clearInterval(feedbackTimerRef.current);
      feedbackTimerRef.current = null;
    }
    setIsRecordingFeedback(false);

    if (feedbackMediaRecorderRef.current && feedbackMediaRecorderRef.current.state === 'recording') {
      try {
        feedbackMediaRecorderRef.current.stop();
      } catch (err) {
        setFeedbackAudioUrl('simulated-voice-note');
      }
    } else {
      setFeedbackAudioUrl('simulated-voice-note');
    }
  };

  const handleToggleFeedbackAudio = () => {
    if (!feedbackAudioPlayerRef.current) return;
    if (isPlayingFeedbackAudio) {
      feedbackAudioPlayerRef.current.pause();
      setIsPlayingFeedbackAudio(false);
    } else {
      feedbackAudioPlayerRef.current.currentTime = 0;
      feedbackAudioPlayerRef.current
        .play()
        .then(() => setIsPlayingFeedbackAudio(true))
        .catch(() => setIsPlayingFeedbackAudio(false));
    }
  };

  const handleDeleteFeedbackAudio = () => {
    if (feedbackAudioPlayerRef.current) {
      feedbackAudioPlayerRef.current.pause();
    }
    setIsPlayingFeedbackAudio(false);
    setFeedbackAudioUrl(null);
    setFeedbackRecordDuration(0);
  };

  const formatAudioTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  const handleSubmitInlineFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmittingFeedback) return;

    if (!feedbackText.trim() && !feedbackAudioUrl) {
      setFeedbackInputError('Please enter your feedback or record a voice note.');
      feedbackTextareaRef.current?.focus();
      return;
    }

    setFeedbackInputError(null);
    setIsSubmittingFeedback(true);
    try {
      await submitPrivateFeedback({
        userType: 'merchant',
        satisfactionRating: merchantFeedbackRating || 5,
        description: feedbackText.trim() || undefined,
        voiceNoteUrl: feedbackAudioUrl || undefined,
        voiceDurationSeconds: feedbackRecordDuration || undefined,
      });

      setFeedbackSubmitted(true);
    } catch (err) {
      console.error('Failed to submit feedback:', err);
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  // Custom Saved Buying Prices from localStorage
  const [customBuyingRates, setCustomBuyingRates] = useState<Record<string, number>>({});
  const [merchantRates] = useState<Record<string, { rate: number; lastUpdated: string }>>(() => {
    try {
      const saved = localStorage.getItem('merchant_buying_rates');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_MERCHANT_RATES;
  });

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        const ratesMap: Record<string, number> = {};
        Object.keys(parsed).forEach((k) => {
          const lowerKey = k.toLowerCase();
          ratesMap[lowerKey] = parsed[k].rate;
          if (lowerKey.includes('iron')) ratesMap['iron'] = parsed[k].rate;
          if (lowerKey.includes('copper')) ratesMap['copper'] = parsed[k].rate;
          if (lowerKey.includes('aluminium')) ratesMap['aluminium'] = parsed[k].rate;
          if (lowerKey.includes('brass')) ratesMap['brass'] = parsed[k].rate;
          if (lowerKey.includes('steel')) ratesMap['steel'] = parsed[k].rate;
          if (lowerKey.includes('plastic')) ratesMap['plastic'] = parsed[k].rate;
          if (lowerKey.includes('paper') || lowerKey.includes('cardboard')) ratesMap['paper'] = parsed[k].rate;
          if (lowerKey.includes('ewaste') || lowerKey.includes('cpu')) ratesMap['ewaste'] = parsed[k].rate;
        });
        setCustomBuyingRates(ratesMap);
      }
    } catch (e) {
      console.warn('Failed to load merchant custom prices', e);
    }
  }, []);

  // -------------------------------------------------------------------------
  // HERO CAROUSEL INTERACTION STATE
  // -------------------------------------------------------------------------
  const [heroSlideIndex, setHeroSlideIndex] = useState(0);
  const heroTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const heroDragStartX = useRef(0);
  const heroIsDragging = useRef(false);

  const startHeroAutoSlide = useCallback(() => {
    if (heroTimerRef.current) clearInterval(heroTimerRef.current);
    heroTimerRef.current = setInterval(() => {
      setHeroSlideIndex((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000);
  }, []);

  useEffect(() => {
    startHeroAutoSlide();
    return () => {
      if (heroTimerRef.current) clearInterval(heroTimerRef.current);
    };
  }, [startHeroAutoSlide]);

  const handleHeroTouchStart = (clientX: number) => {
    heroDragStartX.current = clientX;
    heroIsDragging.current = true;
    if (heroTimerRef.current) clearInterval(heroTimerRef.current);
  };

  const handleHeroTouchEnd = (clientX: number) => {
    if (!heroIsDragging.current) return;
    heroIsDragging.current = false;
    const diff = clientX - heroDragStartX.current;
    if (diff > 45) {
      setHeroSlideIndex((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
    } else if (diff < -45) {
      setHeroSlideIndex((prev) => (prev + 1) % HERO_SLIDES.length);
    }
    startHeroAutoSlide();
  };

  // -------------------------------------------------------------------------
  // MOBILE STATS CAROUSEL SCROLL DOTS
  // -------------------------------------------------------------------------
  const [activeStatDot, setActiveStatDot] = useState(0);
  const statsTrackRef = useRef<HTMLDivElement>(null);

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

  // Clean displayName to prevent duplicate "Traders Traders"
  const rawShopName =
    (user as unknown as { shopName?: string; companyName?: string })?.shopName ||
    (user as unknown as { shopName?: string; companyName?: string })?.companyName ||
    user?.name ||
    'Ramesh Traders';

  const merchantDisplayName = rawShopName.toLowerCase().endsWith('traders')
    ? rawShopName
    : `${rawShopName} Traders`;

  return (
    <div className={styles.pageContainer}>
      {/* =========================================================================
          1. GREETING & SERVICE AREA ROW (EXACT MATCH HOUSEHOLD HEADER)
          ========================================================================= */}
      <div className={styles.greetingAddressRow}>
        <div className={styles.greetingCol}>
          <h2 className={styles.greetingName}>
            {merchantDisplayName}
          </h2>
          <span className={styles.greetingSubtext}>Manage requests, quotes &amp; pickups</span>
        </div>

        {/* Combined Service Area & Status Pill Button */}
        <button
          type="button"
          className={styles.addressPillBtn}
          onClick={() => setIsAcceptingRequests((prev) => !prev)}
          title="Click to toggle availability status / operating area"
        >
          <div className={styles.addressPillLeft}>
            <MapPin size={13} className={styles.addressPillIcon} />
            <div className={styles.addressPillTextGroup}>
              <span className={styles.addressPillArea}>Chennai · 15km</span>
              <span className={isAcceptingRequests ? styles.addressPillStatus : styles.addressPillStatusPaused}>
                {isAcceptingRequests ? '● Accepting' : '○ Paused'}
              </span>
            </div>
          </div>
          <ChevronDown size={13} className={styles.addressPillChevron} />
        </button>
      </div>

      {/* =========================================================================
          2. MOVING NEWS TICKER
          ========================================================================= */}
      <Link
        to="/dashboard/merchant/requests"
        className={styles.promoTickerStrip}
        aria-label="Merchant News Ticker"
      >
        <div className={styles.bannerLeftSection}>
          <Megaphone size={16} className={styles.bannerMegaphoneIcon} aria-hidden="true" />
          <span className={styles.bannerBadgePill}>NEWS TICKER</span>
          <span className={styles.bannerVerticalDivider} aria-hidden="true" />
        </div>

        <div className={styles.bannerMarqueeWindow}>
          <div className={styles.bannerMarqueeTrack}>
            {[0, 1].map((copyIdx) => (
              <div
                key={copyIdx}
                className={styles.bannerItemsGroup}
                aria-hidden={copyIdx === 1 ? 'true' : undefined}
              >
                {MERCHANT_TICKER_MESSAGES.map((msg) => (
                  <span key={`${copyIdx}-${msg.id}`} className={styles.bannerMessageItem}>
                    <span className={styles.bannerMessageText}>{msg.text}</span>
                    <span className={styles.bannerItemDivider} aria-hidden="true">
                      •
                    </span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </Link>

      {/* =========================================================================
          3. HERO PROMOTIONAL SLIDER (ADAPTS PROPERLY TO IMAGE HEIGHT)
          ========================================================================= */}
      <section
        className={styles.heroSliderWrapper}
        onTouchStart={(e) => handleHeroTouchStart(e.touches[0].clientX)}
        onTouchEnd={(e) => handleHeroTouchEnd(e.changedTouches[0].clientX)}
        onMouseDown={(e) => handleHeroTouchStart(e.clientX)}
        onMouseUp={(e) => handleHeroTouchEnd(e.clientX)}
      >
        <div
          className={styles.sliderTrack}
          style={{
            transform: `translateX(-${heroSlideIndex * 100}%)`,
            transition: 'transform 500ms cubic-bezier(0.25, 1, 0.5, 1)',
          }}
        >
          {HERO_SLIDES.map((slide) => (
            <div key={slide.id} className={styles.slideItem}>
              {slide.type === 'image' && slide.image ? (
                <div
                  className={styles.imagePromoSlide}
                  style={slide.bgColor ? { backgroundColor: slide.bgColor } : undefined}
                >
                  <img
                    src={slide.image}
                    alt={slide.alt || 'Promotional Banner'}
                    className={styles.promoImageFull}
                    draggable={false}
                    loading="eager"
                  />
                  <Link
                    to={slide.link}
                    className={styles.imageSlideClickOverlay}
                    aria-label={slide.alt}
                  />
                </div>
              ) : (
                <div className={styles.goldValueBannerSlide}>
                  <div className={styles.goldBannerLeft}>
                    <span className={styles.goldBannerTag}>MERCHANT SUCCESS</span>
                    <h1 className={styles.goldBannerTitle}>{slide.title}</h1>
                    <p className={styles.goldBannerSubtitle}>
                      {slide.subtitle?.split('\n').map((line, lIdx) => (
                        <span key={lIdx} style={{ display: 'block' }}>
                          {line}
                        </span>
                      ))}
                    </p>
                    <div className={styles.goldBannerBtnRow}>
                      <Link to="/dashboard/merchant/requests" className={styles.goldPostBtn}>
                        <Plus size={16} color="#F8BF1D" />
                        <span>Browse Requests</span>
                      </Link>
                      <Link to="/merchant/market-prices" className={styles.goldRatesBtn}>
                        <TrendingUp size={16} color="#15171B" />
                        <span>Update Rates</span>
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Pagination Dots */}
        <div className={styles.sliderDotsContainer}>
          {HERO_SLIDES.map((_, dotIdx) => (
            <button
              key={dotIdx}
              type="button"
              className={`${styles.sliderDot} ${heroSlideIndex === dotIdx ? styles.sliderDotActive : ''}`}
              onClick={() => setHeroSlideIndex(dotIdx)}
              aria-label={`Go to slide ${dotIdx + 1}`}
            />
          ))}
        </div>
      </section>

      {/* =========================================================================
          4. KPI STATS CARDS CAROUSEL (ALL USE THE SAME WARM YELLOW/CREAM COLOR)
          ========================================================================= */}
      <section className={styles.statsSectionWrapper}>
        <div
          className={styles.statsCarouselTrack}
          ref={statsTrackRef}
          onScroll={handleStatsScroll}
        >
          {/* Card 1: Today's Pickup */}
          <div
            className={styles.statInteractiveCard}
            onClick={() => navigate('/dashboard/merchant/orders')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && navigate('/dashboard/merchant/orders')}
            aria-label="Upcoming Pickup: 1, Today 10:00 AM"
          >
            <div className={styles.statCardTopRow}>
              <div className={styles.statSquircleIcon}>
                <Calendar size={18} strokeWidth={2.4} />
              </div>
              <div className={styles.statTopRightBadge}>
                <Clock size={12} strokeWidth={2.4} />
                <span>Today, 10:00 AM</span>
              </div>
            </div>

            <div className={styles.statCardValueGroup}>
              <span className={styles.statBigValue}>1</span>
              <h3 className={styles.statCardTitle}>Today's Pickup (Sri Venkatesh Ind.)</h3>
            </div>
          </div>

          {/* Card 2: This Month's Earnings (same warm yellow color) */}
          <div
            className={styles.statInteractiveCard}
            onClick={() => navigate('/dashboard/merchant/profile')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && navigate('/dashboard/merchant/profile')}
            aria-label="This Month Earnings: ₹3,65,780, +24% vs Last Month"
          >
            <div className={styles.statCardTopRow}>
              <div className={styles.statSquircleIcon}>
                <IndianRupee size={18} strokeWidth={2.4} />
              </div>
              <div className={styles.statTopRightBadge}>
                <TrendingUp size={12} strokeWidth={2.4} />
                <span>+24% vs Last Mo</span>
              </div>
            </div>

            <div className={styles.statCardValueGroup}>
              <span className={styles.statBigValue}>₹3,65,780</span>
              <h3 className={styles.statCardTitle}>This Month Earnings</h3>
            </div>
          </div>

          {/* Card 3: Orders Won (same warm yellow color) */}
          <div
            className={styles.statInteractiveCard}
            onClick={() => navigate('/dashboard/merchant/orders')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && navigate('/dashboard/merchant/orders')}
            aria-label="Orders Won: 22, 18 Pickups Completed"
          >
            <div className={styles.statCardTopRow}>
              <div className={styles.statSquircleIcon}>
                <Truck size={18} strokeWidth={2.4} />
              </div>
              <div className={styles.statTopRightBadge}>
                <Clock size={12} strokeWidth={2.4} />
                <span>4 Active</span>
              </div>
            </div>

            <div className={styles.statCardValueGroup}>
              <span className={styles.statBigValue}>22</span>
              <h3 className={styles.statCardTitle}>Orders Won (18 Pickups)</h3>
            </div>
          </div>

          {/* Card 4: Response Rate & On-Time (same warm yellow color) */}
          <div
            className={styles.statInteractiveCard}
            onClick={() => navigate('/dashboard/merchant/profile')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && navigate('/dashboard/merchant/profile')}
            aria-label="Response Rate: 94%, 100% On-Time Pickup"
          >
            <div className={styles.statCardTopRow}>
              <div className={styles.statSquircleIcon}>
                <Zap size={18} strokeWidth={2.4} />
              </div>
              <div className={styles.statTopRightBadge}>
                <span>⭐ Top 5%</span>
              </div>
            </div>

            <div className={styles.statCardValueGroup}>
              <span className={styles.statBigValue}>
                94% <span className={styles.statUnitText}>(100% On-Time)</span>
              </span>
              <h3 className={styles.statCardTitle}>Merchant Response Rate</h3>
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

      {/* =========================================================================
          5. TODAY'S PICKUP CARD (PROPERLY ALIGNED CONTENT & FLOW)
          ========================================================================= */}
      <div className={styles.nextPickupUnifiedCard}>
        {/* Top Header */}
        <div className={styles.pickupUnifiedHeader}>
          <h3 className={styles.pickupUnifiedTitle}>Today's Pickup</h3>
          <div className={styles.pickupHeaderRightCol}>
            <span className={styles.scheduledPillBadge}>SCHEDULED</span>
            <div className={styles.pickupTimeSlotPill}>
              <Clock size={11} className={styles.pickupClockIcon} />
              <span>10:00 AM – 12:00 PM</span>
            </div>
          </div>
        </div>

        {/* Middle Body: Customer Details on Left, ETA & Navigation on Right */}
        <div className={styles.pickupUnifiedBody}>
          <div className={styles.pickupPartnerLeftCol}>
            <div className={styles.pickupCustomerHeaderRow}>
              <div className={styles.partnerAvatarCircle}>
                <Truck size={24} />
              </div>
              <div className={styles.pickupCardInfo}>
                <span className={styles.execArrivingLabel}>Pickup Customer</span>
                <h4 className={styles.pickupTitle}>Sri Venkatesh Industries</h4>
              </div>
            </div>

            <div className={styles.pickupDetailsPill}>
              <span className={styles.pickupMaterialName}>Metal Scrap</span>
              <span className={styles.pickupPillDot}>•</span>
              <span className={styles.pickupWeightText}>650 kg</span>
            </div>
          </div>

          <div className={styles.pickupEtaRightCol}>
            <div className={styles.etaTextGroup}>
              <span className={styles.etaLabel}>ETA</span>
              <div className={styles.etaValueRow}>
                <span className={styles.etaNumber}>28</span>
                <span className={styles.etaMinsText}>mins</span>
              </div>
            </div>
            <Link to="/dashboard/merchant/orders" className={styles.trackPickupMiniBtn}>
              <Navigation size={13} />
              <span>Start Navigation →</span>
            </Link>
          </div>
        </div>

        {/* Bottom 3-Step Pickup Stage Tracker */}
        <div className={styles.miniStageTracker}>
          <div className={`${styles.miniStep} ${styles.miniStepDone}`}>
            <div className={styles.miniCircle}>
              <Check size={11} strokeWidth={3} />
            </div>
            <span>Accepted</span>
          </div>
          <div className={`${styles.miniLine} ${styles.miniLineActive}`} />
          <div className={`${styles.miniStep} ${styles.miniStepActive}`}>
            <div className={styles.miniCircle}>
              <Truck size={13} />
            </div>
            <span>En Route</span>
          </div>
          <div className={styles.miniLine} />
          <div className={styles.miniStep}>
            <div className={styles.miniCircle}>
              <MapPin size={13} />
            </div>
            <span>Arrived</span>
          </div>
        </div>
      </div>

      {/* =========================================================================
          6. NEW SCRAP REQUESTS (ACTIONABLE HIGHLIGHT BANNER)
          ========================================================================= */}
      <div className={styles.newRequestsCard}>
        <div className={styles.newRequestsLeft}>
          <div className={styles.newRequestsHeaderRow}>
            <span className={styles.newRequestsTag}>OPPORTUNITY</span>
            <span className={styles.newRequestsLivePulse}>
              <span className={styles.pulseDot} />
              <span>Chennai · Updated just now</span>
            </span>
          </div>

          <h3 className={styles.newRequestsTitle}>18 New Requests</h3>
          <p className={styles.newRequestsDesc}>
            Nearby industries are looking for scrap buyers. Submit your quotes to win pickups.
          </p>
        </div>

        <Link to="/dashboard/merchant/requests" className={styles.newRequestsCtaBtn}>
          <span>Browse &amp; Quote Requests (18)</span>
          <ArrowRight size={15} />
        </Link>
      </div>

      {/* =========================================================================
          7. LIVE SCRAP MARKET PRICES (RESTORED ORIGINAL SECTION)
          ========================================================================= */}
      <section className={styles.scrapPricesSection}>
        <div className={styles.mobileMarketHeaderRow}>
          <div className={styles.mobileMarketTitleWrap}>
            <TrendingUp size={18} className={styles.marketIconYellow} />
            <div>
              <h4 className={styles.mobileMarketTitle}>Live Scrap Market Prices</h4>
              <span className={styles.mobileMarketSub}>Chennai Mandi &amp; Your Buying Rates</span>
            </div>
          </div>

          <div className={styles.headerActionBtnsRow}>
            <Link
              to="/merchant/market-prices"
              className={styles.mobileEditRatesBtn}
              title="Open Market Prices page to update your custom rates"
            >
              <Edit3 size={13} />
              <span>Update Price</span>
            </Link>
            <Link to="/merchant/market-prices" className={styles.viewAllLink}>
              <span>View All</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>

        {/* Desktop View: 4-Column Card Grid with Photo on top */}
        <div className={styles.desktopPriceGrid}>
          {SCRAP_PRICES.map((item) => {
            const userRate =
              merchantRates[item.id]?.rate ||
              customBuyingRates[item.id] ||
              DEFAULT_MERCHANT_RATES[item.id]?.rate;
            return (
              <Link
                key={item.id}
                to={`/merchant/market-prices?material=${encodeURIComponent(item.id)}&name=${encodeURIComponent(item.name)}`}
                className={styles.priceCardItem}
                title={`Click to view and edit market price for ${item.name}`}
              >
                <div className={styles.priceCardImgWrapper}>
                  <img
                    src={item.img}
                    alt={item.name}
                    className={styles.priceItemImg}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = '/logo-icon.png';
                    }}
                  />
                </div>
                <div className={styles.priceItemDetails}>
                  <div className={styles.priceItemHeaderRow}>
                    <span className={styles.priceItemName}>{item.name}</span>
                    <span className={item.trend === 'up' ? styles.trendGreenBadge : styles.trendRedBadge}>
                      {item.trend === 'up' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                      {item.change}
                    </span>
                  </div>
                  <span className={styles.priceItemMarketRate}>Market: {item.priceRange}</span>
                  <div className={styles.priceItemYourRate}>
                    <span className={styles.yourRateDot} />
                    <span>Your rate: ₹ {userRate || item.priceRange.split('-')[0].replace(/[^0-9]/g, '')} / KG</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Mobile View: Vertical List of Row Cards */}
        <div className={styles.mobileMarketPricesList}>
          {SCRAP_PRICES.map((item) => {
            const userRate =
              merchantRates[item.id]?.rate ||
              customBuyingRates[item.id] ||
              DEFAULT_MERCHANT_RATES[item.id]?.rate;
            return (
              <Link
                key={item.id}
                to={`/merchant/market-prices?material=${encodeURIComponent(item.id)}&name=${encodeURIComponent(item.name)}`}
                className={styles.mobilePriceRowCard}
                title="Click to view and edit market price on Market Prices page"
              >
                <img
                  src={item.img}
                  alt={item.name}
                  className={styles.mobilePriceThumb}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = '/logo-icon.png';
                  }}
                />
                <div className={styles.mobilePriceInfoCol}>
                  <div className={styles.mobilePriceNameRow}>
                    <strong className={styles.mobilePriceName}>{item.name}</strong>
                    <span
                      className={
                        item.trend === 'up'
                          ? styles.mobileTrendUp
                          : styles.mobileTrendDown
                      }
                    >
                      {item.trend === 'up' ? '↑' : '↓'} {item.change}
                    </span>
                  </div>
                  <span className={styles.mobileMandiRange}>Mandi Range: {item.priceRange}</span>
                </div>

                <div className={styles.mobileMyRateCol}>
                  <span className={styles.mobileMyRateLabel}>YOUR Price</span>
                  <strong className={styles.mobileMyRateVal}>
                    ₹{userRate || item.priceRange.split('-')[0].replace(/[^0-9]/g, '')}<small>/kg</small>
                  </strong>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* =========================================================================
          8. IN-CARD MERCHANT FEEDBACK (DESCRIPTION FIELD + VOICE RECORDER RIGHT HERE)
          ========================================================================= */}
      <section className={styles.feedbackSectionWrapper} aria-label="Merchant Feedback">
        <div className={styles.feedbackCard}>
          {/* Audio element for playback */}
          {feedbackAudioUrl && (
            <audio
              ref={feedbackAudioPlayerRef}
              src={feedbackAudioUrl !== 'simulated-voice-note' ? feedbackAudioUrl : undefined}
              onEnded={() => setIsPlayingFeedbackAudio(false)}
            />
          )}

          <div className={styles.feedbackHeader}>
            <div className={styles.feedbackTitleRow}>
              <div className={styles.feedbackIconBadge}>
                <MessageSquareQuote size={20} />
              </div>
              <div className={styles.feedbackTitleCol}>
                <h3 className={styles.feedbackTitle}>Tell Us What You Think</h3>
                <p className={styles.feedbackSubtitle}>
                  Help us improve BillScrap for merchants with your private feedback.
                </p>
              </div>
            </div>
          </div>

          {feedbackSubmitted ? (
            <div className={styles.feedbackInlineSuccess}>
              <div className={styles.successCheckWrap}>
                <CheckCircle2 size={32} />
              </div>
              <h4 className={styles.inlineSuccessTitle}>Thank you for your feedback!</h4>
              <p className={styles.inlineSuccessText}>
                Your feedback helps our team improve scrap rates, pickups, and merchant tools.
              </p>
              <button
                type="button"
                className={styles.resetFeedbackBtn}
                onClick={() => {
                  setFeedbackSubmitted(false);
                  setFeedbackText('');
                  handleDeleteFeedbackAudio();
                }}
              >
                Send Another Feedback
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmitInlineFeedback} className={styles.feedbackFormInline}>
              {/* Quick Satisfaction Rating */}
              <div className={styles.feedbackRatingSection}>
                <span className={styles.feedbackRatingLabel}>
                  How satisfied are you with BillScrap?
                </span>
                <div className={styles.starRatingRow}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className={`${styles.starBtn} ${
                        (hoverFeedbackRating || merchantFeedbackRating) >= star ? styles.starActive : ''
                      }`}
                      onClick={() => setMerchantFeedbackRating(star)}
                      onMouseEnter={() => setHoverFeedbackRating(star)}
                      onMouseLeave={() => setHoverFeedbackRating(0)}
                      title={`Rate overall experience ${star} of 5 stars`}
                      aria-label={`Rate overall experience ${star} of 5 stars`}
                    >
                      <Star
                        size={24}
                        fill={(hoverFeedbackRating || merchantFeedbackRating) >= star ? '#fbc21a' : 'none'}
                        stroke={(hoverFeedbackRating || merchantFeedbackRating) >= star ? '#fbc21a' : '#cbd5e1'}
                      />
                    </button>
                  ))}
                  <span className={styles.ratingTextTag}>
                    {merchantFeedbackRating === 5 && 'Excellent'}
                    {merchantFeedbackRating === 4 && 'Good'}
                    {merchantFeedbackRating === 3 && 'Average'}
                    {merchantFeedbackRating === 2 && 'Needs Work'}
                    {merchantFeedbackRating === 1 && 'Poor'}
                  </span>
                </div>
              </div>

              {/* Description Field */}
              <div className={styles.feedbackInputGroup}>
                <label className={styles.feedbackInputLabel}>
                  Description / Feedback
                </label>
                <textarea
                  ref={feedbackTextareaRef}
                  className={`${styles.feedbackInlineTextarea} ${
                    feedbackInputError ? styles.feedbackInlineTextareaError : ''
                  }`}
                  rows={3}
                  placeholder="Share your thoughts, suggestions, or issues here..."
                  value={feedbackText}
                  onChange={(e) => {
                    setFeedbackText(e.target.value);
                    if (feedbackInputError) setFeedbackInputError(null);
                  }}
                />
                {feedbackInputError && (
                  <div className={styles.feedbackFieldError}>
                    <AlertCircle size={14} />
                    <span>{feedbackInputError}</span>
                  </div>
                )}
              </div>

              {/* Voice Recorder Right Here */}
              <div className={styles.inlineVoiceSection}>
                {/* State A: Idle (not recording, no audio) */}
                {!isRecordingFeedback && !feedbackAudioUrl && (
                  <button
                    type="button"
                    className={styles.inlineRecordBtn}
                    onClick={handleStartFeedbackRecording}
                  >
                    <div className={styles.inlineMicCircle}>
                      <Mic size={15} />
                    </div>
                    <span>Record Voice Feedback</span>
                  </button>
                )}

                {/* State B: Recording Active */}
                {isRecordingFeedback && (
                  <div className={styles.inlineRecordingActive}>
                    <div className={styles.recordingStatusWrap}>
                      <span className={styles.redPulseDot} />
                      <span className={styles.recordingTime}>
                        Recording: {formatAudioTime(feedbackRecordDuration)} / 02:00
                      </span>
                    </div>
                    <button
                      type="button"
                      className={styles.stopRecordMiniBtn}
                      onClick={handleStopFeedbackRecording}
                    >
                      <Square size={12} fill="#ffffff" />
                      <span>Stop</span>
                    </button>
                  </div>
                )}

                {/* State C: Audio Recorded */}
                {!isRecordingFeedback && feedbackAudioUrl && (
                  <div className={styles.inlineAudioCard}>
                    <div className={styles.audioPreviewControls}>
                      <button
                        type="button"
                        className={styles.audioPlayBtn}
                        onClick={handleToggleFeedbackAudio}
                        title={isPlayingFeedbackAudio ? 'Pause' : 'Play'}
                      >
                        {isPlayingFeedbackAudio ? <Pause size={14} /> : <Play size={14} />}
                      </button>
                      <div className={styles.audioDetailsCol}>
                        <span className={styles.audioBadgeText}>
                          <Volume2 size={13} color="#fbc21a" />
                          <span>Voice note attached</span>
                        </span>
                        <span className={styles.audioTimeSub}>
                          {formatAudioTime(feedbackRecordDuration || 12)}
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      className={styles.audioDeleteBtn}
                      onClick={handleDeleteFeedbackAudio}
                      title="Discard audio and record again"
                    >
                      <Trash2 size={13} />
                      <span>Delete</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className={styles.submitInlineBtn}
                disabled={isSubmittingFeedback}
              >
                {isSubmittingFeedback ? (
                  <span>Submitting...</span>
                ) : (
                  <>
                    <span>Submit Feedback</span>
                    <Send size={14} />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
