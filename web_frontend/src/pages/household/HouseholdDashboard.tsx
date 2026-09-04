import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  LuMegaphone,
  LuShieldCheck as ShieldCheck,
  LuTrendingUp as TrendingUp,
  LuPlus as Plus,
  LuCalendar as Calendar,
  LuCircleCheck as CheckCircle2,
  LuIndianRupee as IndianRupee,
  LuTruck as Truck,
  LuStar as Star,
  LuSend as Send,
  LuClock as Clock,
  LuChevronRight as ChevronRight,
  LuChevronLeft as ChevronLeft,
  LuChevronDown as ChevronDown,
  LuX as X,
  LuMapPin as MapPin,
  LuSearch as Search,
  LuNavigation as Navigation,
  LuHouse as HomeIcon,
  LuBriefcase as Briefcase,
  LuPhone as Phone,
  LuRecycle as Recycle,
  LuUser as UserIcon,
  LuCheck,
  LuCircleCheck as LuCheckCircle,
  LuEllipsisVertical as MoreVertical,
  LuMessageSquareQuote,
} from 'react-icons/lu';
import { useAuthStore } from '@/store/useAuthStore';
import { submitPrivateFeedback } from '@/services/feedbackService';
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock';
import styles from './HouseholdDashboard.module.css';

interface DeliveryAddress {
  id: string;
  tag: string;
  area: string;
  fullAddress: string;
  phone: string;
  isDefault: boolean;
  type: 'home' | 'office' | 'other';
}

const INITIAL_DELIVERY_ADDRESSES: DeliveryAddress[] = [
  {
    id: 'addr-1',
    tag: 'Home',
    area: 'Anna Nagar, Chennai',
    fullAddress: 'A-8, 4th Cross Street, Anna Nagar West, Chennai - 600040',
    phone: '93607 66001',
    isDefault: true,
    type: 'home',
  },
  {
    id: 'addr-2',
    tag: 'Office',
    area: 'Aminjikarai, Chennai',
    fullAddress: '2nd Floor, No.12, Nelson Manickam Road, Aminjikarai, Chennai - 600029',
    phone: '93607 66001',
    isDefault: false,
    type: 'office',
  },
];

interface LiveScrapRateItem {
  id: string;
  name: string;
  categoryId?: string;
  price: string;
  unit: string;
  trend: string;
  trendType: 'positive' | 'negative' | 'neutral';
  imageUrl: string;
  iconBg: string;
}

const LIVE_SCRAP_RATES: LiveScrapRateItem[] = [
  {
    id: 'COP_001',
    name: 'Copper Scrap',
    categoryId: 'CAT_MATERIAL',
    price: '₹720.00',
    unit: '/ kg',
    trend: '+1.8%',
    trendType: 'positive',
    imageUrl: '/scrap-copper.jpg',
    iconBg: '#FFF7ED',
  },
  {
    id: 'BRS_001',
    name: 'Brass Scrap',
    categoryId: 'CAT_MATERIAL',
    price: '₹490.00',
    unit: '/ kg',
    trend: '+1.5%',
    trendType: 'positive',
    imageUrl: '/scrap-brass.jpg',
    iconBg: '#FEFCE8',
  },
  {
    id: 'IRON_001',
    name: 'Scrap Iron',
    categoryId: 'CAT_IRON',
    price: '₹42.00',
    unit: '/ kg',
    trend: '+2.5%',
    trendType: 'positive',
    imageUrl: '/scrap-iron.png',
    iconBg: '#F1F5F9',
  },
  {
    id: 'ALU_001',
    name: 'household aluminium',
    categoryId: 'CAT_MATERIAL',
    price: '₹135.00',
    unit: '/ kg',
    trend: '+2.1%',
    trendType: 'positive',
    imageUrl: '/scrap-household-aluminium.png',
    iconBg: '#F8FAFC',
  },
  {
    id: 'PLS_007',
    name: 'Mixed plastic',
    categoryId: 'CAT_PLASTIC',
    price: '₹18.00',
    unit: '/ kg',
    trend: '+0.5%',
    trendType: 'positive',
    imageUrl: '/scrap-mixed-plastic.png',
    iconBg: '#EFF6FF',
  },
  {
    id: 'CRD_001',
    name: 'carboard',
    categoryId: 'CAT_PAPER_CARDBOARD',
    price: '₹13.00',
    unit: '/ kg',
    trend: '+1.0%',
    trendType: 'positive',
    imageUrl: '/scrap-cardboard.png',
    iconBg: '#FEF3C7',
  },
];

interface GalleryPhoto {
  id: string;
  title: string;
  imageUrl: string;
  weight: string;
  rateInfo: string;
}

interface ActivePickup {
  id: string;
  orderNumber: string;
  title: string;
  materialsCount: number;
  scheduledTime: string;
  executiveInfo: string;
  estimatedAmount: number;
  status: 'dispatched' | 'scheduled';
  coverImage: string;
  photos: GalleryPhoto[];
}

const ACTIVE_PICKUPS: ActivePickup[] = [
  {
    id: 'pk-1',
    orderNumber: 'SA123455',
    title: 'Iron Rods (8.4 KG) + Brass Fittings (1.0 KG) + Cardboard Stack (3.0 KG)',
    materialsCount: 3,
    scheduledTime: 'Today, 04:15 PM',
    executiveInfo: 'Driver Murugan (Tata 407 • TN 09 BX 4421)',
    estimatedAmount: 780,
    status: 'dispatched',
    coverImage: '/household-scrap-bundle.jpg',
    photos: [
      {
        id: 'p1-1',
        title: 'Household Scrap Bundle Overview',
        imageUrl: '/household-scrap-bundle.jpg',
        weight: 'Total ~12.4 KG',
        rateInfo: 'Complete staged scrap ready for vehicle loading',
      },
      {
        id: 'p1-2',
        title: 'Iron Rods & Construction Cutoffs',
        imageUrl: '/scrap-iron.jpg',
        weight: '8.4 KG',
        rateInfo: 'Benchmark Rate: ₹38.50 / KG • Subtotal: ₹323.40',
      },
      {
        id: 'p1-3',
        title: 'Brass Plumbing Taps & Fittings',
        imageUrl: '/scrap-brass.jpg',
        weight: '1.0 KG',
        rateInfo: 'Benchmark Rate: ₹460.00 / KG • Subtotal: ₹460.00',
      },
      {
        id: 'p1-4',
        title: 'Folded Corrugated Cardboard Boxes',
        imageUrl: '/scrap-cardboard.jpg',
        weight: '3.0 KG',
        rateInfo: 'Benchmark Rate: ₹14.50 / KG • Subtotal: ₹43.50',
      },
    ],
  },
  {
    id: 'pk-2',
    orderNumber: 'SA123454',
    title: 'Copper Coils (1.5 KG) + Old Newspapers & Cartons (17.2 KG)',
    materialsCount: 2,
    scheduledTime: 'Tomorrow, 10:00 AM • Slot 1',
    executiveInfo: 'Assigned: Karthik Raja (Eco Van)',
    estimatedAmount: 1250,
    status: 'scheduled',
    coverImage: '/copper-paper-scrap-bundle.jpg',
    photos: [
      {
        id: 'p2-1',
        title: 'Copper & Paper Recyclables Bundle',
        imageUrl: '/copper-paper-scrap-bundle.jpg',
        weight: 'Total ~18.7 KG',
        rateInfo: 'Complete staged scrap bundle with tied paper & copper coils',
      },
      {
        id: 'p2-2',
        title: 'Bright Electrical Copper Wire Coils',
        imageUrl: '/scrap-copper-wire.jpg',
        weight: '1.5 KG',
        rateInfo: 'Benchmark Rate: ₹720.00 / KG • Subtotal: ₹1,080.00',
      },
      {
        id: 'p2-3',
        title: 'Tied Newspaper & Magazine Stacks',
        imageUrl: '/scrap-mixed-papers.jpg',
        weight: '10.2 KG',
        rateInfo: 'Benchmark Rate: ₹12.50 / KG • Subtotal: ₹127.50',
      },
      {
        id: 'p2-4',
        title: 'Old School Notebooks & Packaging Cartons',
        imageUrl: '/scrap-notebook.jpg',
        weight: '7.0 KG',
        rateInfo: 'Benchmark Rate: ₹14.00 / KG • Subtotal: ₹98.00',
      },
    ],
  },
];

interface PromoSlide {
  id: string;
  type: 'image' | 'gold-banner';
  image?: string;
  title?: string;
  subtitle?: string;
  link: string;
  alt?: string;
  bgColor?: string;
}

const PROMO_SLIDES: PromoSlide[] = [
  {
    id: 'ayudha-puja',
    type: 'image',
    image: '/promo-ayudha-puja.png',
    link: '/household/post-scrap',
    alt: 'Ayudha Puja Special - Clean your space. Sell your scrap.',
    bgColor: '#FAF5E8',
  },
  {
    id: 'nearby-collectors',
    type: 'image',
    image: '/promo-nearby-collectors.png',
    link: '/household/post-scrap',
    alt: 'Nearby scrap collectors ready to pickup - Fast Pickup, Fair Pricing, Digital Payment',
    bgColor: '#111215',
  },
  {
    id: 'reusable-products',
    type: 'image',
    image: '/promo-reusable-products.png',
    link: '/household/products',
    alt: 'Reusable Products - Good for you. Great for the planet. Voice chat to connect.',
    bgColor: '#EBF1E8',
  },
  {
    id: 'market-rates',
    type: 'image',
    image: '/promo-market-rates.png',
    link: '/household/rates',
    alt: "Today's Market Rates - Stay updated, sell better - Aluminium, Copper, Iron",
    bgColor: '#F4F5F6',
  },
  {
    id: 'greener-tomorrow',
    type: 'image',
    image: '/promo-greener-tomorrow.png',
    link: '/household/post-scrap',
    alt: 'Building a cleaner, greener tomorrow - Trusted by Households & Businesses',
    bgColor: '#12200A',
  },
  {
    id: 'turn-scrap',
    type: 'gold-banner',
    title: 'Turn your scrap into value',
    subtitle: 'Doorstep pickup • Accurate weighing\nBest prices • Instant payment',
    link: '/household/post-scrap',
  },
];

interface PromoTickerMessage {
  id: string;
  badge?: string;
  text: string;
  link: string;
}

const PROMO_TICKER_MESSAGES: PromoTickerMessage[] = [
  {
    id: 'puja-special',
    text: 'Sell unused scrap before the festival and earn extra cash! ✨',
    link: '/household/post-scrap',
  },
  {
    id: 'market-rates',
    text: "Check today's verified scrap rates before you sell.",
    link: '/household/rates',
  },
  {
    id: 'doorstep-pickup',
    text: 'Got unused scrap at home? Book a doorstep pickup today.',
    link: '/household/post-scrap',
  },
  {
    id: 'clean-home',
    text: 'Clean your home • Turn old metal & appliances into instant cash.',
    link: '/household/post-scrap',
  },
];

interface HowItWorksStep {
  step: number;
  title: string;
  desc: string;
}

const HOW_IT_WORKS_STEPS: HowItWorksStep[] = [
  {
    step: 1,
    title: 'Post Scrap',
    desc: 'Tell us what you have',
  },
  {
    step: 2,
    title: 'We Pickup',
    desc: 'Executive picks it up',
  },
  {
    step: 3,
    title: 'Get Paid',
    desc: 'Instant payment at your doorstep',
  },
];

function useCountUp(target: number, duration: number = 1000, decimals: number = 0) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    let frameId: number;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setCount(easeOut * target);

      if (progress < 1) {
        frameId = requestAnimationFrame(step);
      }
    };

    frameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameId);
  }, [target, duration]);

  return count.toFixed(decimals);
}

export function HouseholdDashboard() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const displayName = user?.name || 'Arun Kumar';

  // Animated KPI Stats Numbers (Count up smoothly on load)
  const countUpcoming = useCountUp(1, 800, 0);
  const countRecycled = useCountUp(118.6, 1200, 1);
  const countEarned = useCountUp(2845, 1200, 0);

  // Stats Carousel Active Dot State for Mobile Scroll
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

  // Dynamic Initials (e.g. "Arun Kumar" -> "AK")
  const getInitials = (name: string) => {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase() || 'AK';
  };
  const userInitials = getInitials(displayName);

  // Dynamic Greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning!';
    if (hour < 17) return 'Good afternoon!';
    return 'Good evening!';
  };

  // ---------------------------------------------------------------------------
  // Top Hero Carousel State (Seamless Infinite Loop with Touch & Drag Support)
  // ---------------------------------------------------------------------------
  const carouselSlides = [
    PROMO_SLIDES[PROMO_SLIDES.length - 1],
    ...PROMO_SLIDES,
    PROMO_SLIDES[0],
  ];

  const [sliderIndex, setSliderIndex] = useState(1);
  const [isSliderTransitioning, setIsSliderTransitioning] = useState(true);
  const [sliderDragOffset, setSliderDragOffset] = useState(0);
  const [isSliderDragging, setIsSliderDragging] = useState(false);

  const sliderStartXRef = useRef(0);
  const sliderCurrentXRef = useRef(0);
  const sliderDragDistanceRef = useRef(0);
  const autoSlideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sliderContainerRef = useRef<HTMLDivElement | null>(null);
  const isInteractingRef = useRef(false);

  const startAutoSlide = useCallback(() => {
    if (autoSlideTimerRef.current) clearInterval(autoSlideTimerRef.current);
    autoSlideTimerRef.current = setInterval(() => {
      if (!isInteractingRef.current && !document.hidden) {
        setSliderIndex((prev) => {
          if (prev >= carouselSlides.length - 1) {
            return 1;
          }
          setIsSliderTransitioning(true);
          return prev + 1;
        });
      }
    }, 4500);
  }, [carouselSlides.length]);

  const stopAutoSlide = useCallback(() => {
    if (autoSlideTimerRef.current) {
      clearInterval(autoSlideTimerRef.current);
      autoSlideTimerRef.current = null;
    }
  }, []);

  const resetResumeTimer = useCallback(() => {
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = setTimeout(() => {
      isInteractingRef.current = false;
      startAutoSlide();
    }, 4000);
  }, [startAutoSlide]);

  useEffect(() => {
    startAutoSlide();
    return () => {
      stopAutoSlide();
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    };
  }, [startAutoSlide, stopAutoSlide]);

  // Handle visibility change (pause timer when app closed/minimized, safely reset when reopened)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopAutoSlide();
        if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
      } else {
        // App reopened / focused: ensure sliderIndex is strictly inside bounds
        setSliderIndex((prev) => {
          if (prev >= carouselSlides.length - 1 || prev <= 0) {
            setIsSliderTransitioning(false);
            return 1;
          }
          return prev;
        });
        startAutoSlide();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleVisibilityChange);
    window.addEventListener('blur', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleVisibilityChange);
      window.removeEventListener('blur', handleVisibilityChange);
    };
  }, [startAutoSlide, stopAutoSlide, carouselSlides.length]);

  // Watchdog timer: If transitionend doesn't fire (e.g. background tab or quick unlock), safely wrap
  useEffect(() => {
    if (sliderIndex >= carouselSlides.length - 1) {
      const timer = setTimeout(() => {
        setIsSliderTransitioning(false);
        setSliderIndex(1);
      }, 650);
      return () => clearTimeout(timer);
    } else if (sliderIndex <= 0) {
      const timer = setTimeout(() => {
        setIsSliderTransitioning(false);
        setSliderIndex(PROMO_SLIDES.length);
      }, 650);
      return () => clearTimeout(timer);
    }
  }, [sliderIndex, carouselSlides.length]);

  // Re-enable smooth transition after an instant wrap
  useEffect(() => {
    if (!isSliderTransitioning) {
      const raf = requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsSliderTransitioning(true);
        });
      });
      return () => cancelAnimationFrame(raf);
    }
  }, [isSliderTransitioning]);

  const handleSlideTransitionEnd = () => {
    if (sliderIndex >= carouselSlides.length - 1) {
      setIsSliderTransitioning(false);
      setSliderIndex(1);
    } else if (sliderIndex <= 0) {
      setIsSliderTransitioning(false);
      setSliderIndex(PROMO_SLIDES.length);
    }
  };

  const handleDragStart = (clientX: number) => {
    isInteractingRef.current = true;
    stopAutoSlide();
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);

    sliderStartXRef.current = clientX;
    sliderCurrentXRef.current = clientX;
    sliderDragDistanceRef.current = 0;
    setIsSliderDragging(true);
    setIsSliderTransitioning(false);
  };

  const handleDragMove = (clientX: number) => {
    if (!isSliderDragging) return;
    sliderCurrentXRef.current = clientX;
    const delta = clientX - sliderStartXRef.current;
    sliderDragDistanceRef.current = Math.abs(delta);
    setSliderDragOffset(delta);
  };

  const handleDragEnd = () => {
    if (!isSliderDragging) return;
    setIsSliderDragging(false);
    setIsSliderTransitioning(true);

    const delta = sliderCurrentXRef.current - sliderStartXRef.current;
    const containerWidth = sliderContainerRef.current?.offsetWidth || 400;
    const threshold = Math.min(60, containerWidth * 0.15);

    if (delta < -threshold) {
      setSliderIndex((prev) => prev + 1);
    } else if (delta > threshold) {
      setSliderIndex((prev) => prev - 1);
    }
    setSliderDragOffset(0);
    resetResumeTimer();
  };

  const handleLinkClickCapture = (e: React.MouseEvent) => {
    if (sliderDragDistanceRef.current > 8) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  const goToSlide = (dotIndex: number) => {
    isInteractingRef.current = true;
    stopAutoSlide();
    setIsSliderTransitioning(true);
    setSliderIndex(dotIndex + 1);
    resetResumeTimer();
  };

  const safeSliderIndex = Math.min(Math.max(sliderIndex, 0), carouselSlides.length - 1);
  const activeDotIndex = (safeSliderIndex - 1 + PROMO_SLIDES.length) % PROMO_SLIDES.length;

  // Address State & Bottom Sheet State
  const [savedAddresses, setSavedAddresses] = useState<DeliveryAddress[]>(INITIAL_DELIVERY_ADDRESSES);
  const [selectedAddress, setSelectedAddress] = useState<DeliveryAddress>(INITIAL_DELIVERY_ADDRESSES[0]);
  const [isAddressSheetOpen, setIsAddressSheetOpen] = useState(false);
  const [addressSearchQuery, setAddressSearchQuery] = useState('');
  const [locationEnabled, setLocationEnabled] = useState(false);

  // Detail Vision Lightbox Gallery State
  const [selectedGalleryPickup, setSelectedGalleryPickup] = useState<ActivePickup | null>(null);
  const [activePhotoIndex, setActivePhotoIndex] = useState<number>(0);

  // Private BillScrap Application Feedback State (100% Private, Not Public Reviews)
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [satisfactionRating, setSatisfactionRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedbackCategory, setFeedbackCategory] = useState('App experience');
  const [experienceRating, setExperienceRating] = useState('Helpful');
  const [selectedUsageCategories, setSelectedUsageCategories] = useState<string[]>([
    'Selling scrap',
    'Checking scrap rates',
  ]);
  const [likedFeatures, setLikedFeatures] = useState('');
  const [problemsFaced, setProblemsFaced] = useState('');
  const [improvementSuggestions, setImprovementSuggestions] = useState('');
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);

  // Prevent background scroll bleed when address bottom sheet, lightbox, or feedback modal is open
  useBodyScrollLock(isAddressSheetOpen || Boolean(selectedGalleryPickup) || isFeedbackModalOpen);

  // How it Works Single-Step Cross-Fade Loop
  const [howStepIndex, setHowStepIndex] = useState(0);
  const [isHowPaused, setIsHowPaused] = useState(false);
  const howStepTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const howResumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const resetHowStepTimer = useCallback(() => {
    if (howStepTimerRef.current) clearInterval(howStepTimerRef.current);
    howStepTimerRef.current = setInterval(() => {
      if (!document.hidden) {
        setHowStepIndex((prev) => (prev + 1) % HOW_IT_WORKS_STEPS.length);
      }
    }, 2500); // 2000ms display + 500ms fade
  }, []);

  useEffect(() => {
    if (!isHowPaused) {
      resetHowStepTimer();
    } else if (howStepTimerRef.current) {
      clearInterval(howStepTimerRef.current);
    }
    return () => {
      if (howStepTimerRef.current) clearInterval(howStepTimerRef.current);
      if (howResumeTimerRef.current) clearTimeout(howResumeTimerRef.current);
    };
  }, [isHowPaused, resetHowStepTimer]);

  const handleHowDotClick = (dotIdx: number) => {
    setHowStepIndex(dotIdx);
    if (!isHowPaused) {
      resetHowStepTimer();
    }
  };

  const handleHowMouseEnter = () => setIsHowPaused(true);
  const handleHowMouseLeave = () => setIsHowPaused(false);
  const handleHowTouchStart = () => {
    if (howResumeTimerRef.current) clearTimeout(howResumeTimerRef.current);
    setIsHowPaused(true);
  };
  const handleHowTouchEnd = () => {
    if (howResumeTimerRef.current) clearTimeout(howResumeTimerRef.current);
    howResumeTimerRef.current = setTimeout(() => {
      setIsHowPaused(false);
    }, 1500);
  };


  // Lightbox Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedGalleryPickup) return;
      if (e.key === 'Escape') {
        setSelectedGalleryPickup(null);
      } else if (e.key === 'ArrowRight') {
        setActivePhotoIndex((prev) =>
          prev < selectedGalleryPickup.photos.length - 1 ? prev + 1 : 0
        );
      } else if (e.key === 'ArrowLeft') {
        setActivePhotoIndex((prev) =>
          prev > 0 ? prev - 1 : selectedGalleryPickup.photos.length - 1
        );
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedGalleryPickup]);

  const openPhotoGallery = (pickup: ActivePickup) => {
    setSelectedGalleryPickup(pickup);
    setActivePhotoIndex(0);
  };

  const handleNextPhoto = () => {
    if (!selectedGalleryPickup) return;
    setActivePhotoIndex((prev) =>
      prev < selectedGalleryPickup.photos.length - 1 ? prev + 1 : 0
    );
  };

  const handlePrevPhoto = () => {
    if (!selectedGalleryPickup) return;
    setActivePhotoIndex((prev) =>
      prev > 0 ? prev - 1 : selectedGalleryPickup.photos.length - 1
    );
  };

  const handleSubmitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmittingFeedback) return;
    setIsSubmittingFeedback(true);

    try {
      await submitPrivateFeedback({
        userId: user?.id,
        userName: displayName,
        userPhone: user?.phone,
        satisfactionRating,
        feedbackCategory,
        experienceRating,
        primaryUses: selectedUsageCategories,
        likedAspects: likedFeatures,
        problemsFaced,
        improvements: improvementSuggestions,
        description: [likedFeatures, problemsFaced, improvementSuggestions].filter(Boolean).join('\n\n'),
      });

      setFeedbackSuccess(true);
    } catch (err) {
      console.error('Failed to submit feedback:', err);
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  const handleCloseFeedbackModal = () => {
    setIsFeedbackModalOpen(false);
    if (feedbackSuccess) {
      setTimeout(() => {
        setFeedbackSuccess(false);
        setLikedFeatures('');
        setProblemsFaced('');
        setImprovementSuggestions('');
      }, 300);
    }
  };

  const toggleUsageCategory = (item: string) => {
    setSelectedUsageCategories((prev) =>
      prev.includes(item) ? prev.filter((cat) => cat !== item) : [...prev, item]
    );
  };


  // Filter saved addresses by search
  const filteredAddresses = savedAddresses.filter(
    (addr) =>
      addr.tag.toLowerCase().includes(addressSearchQuery.toLowerCase()) ||
      addr.area.toLowerCase().includes(addressSearchQuery.toLowerCase()) ||
      addr.fullAddress.toLowerCase().includes(addressSearchQuery.toLowerCase())
  );

  const handleSelectAddress = (addr: DeliveryAddress) => {
    setSelectedAddress(addr);
    setIsAddressSheetOpen(false);
  };

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        () => {
          setLocationEnabled(true);
          setSelectedAddress({
            id: 'current-loc',
            tag: 'Current Location',
            area: 'Anna Nagar, Chennai',
            fullAddress: 'Current GPS Location • Anna Nagar, Chennai',
            phone: '93607 66001',
            isDefault: false,
            type: 'other',
          });
          setIsAddressSheetOpen(false);
        },
        () => {
          setLocationEnabled(true);
          setSelectedAddress({
            id: 'current-loc',
            tag: 'Current Location',
            area: 'Anna Nagar, Chennai',
            fullAddress: 'Current GPS Location • Anna Nagar, Chennai',
            phone: '93607 66001',
            isDefault: false,
            type: 'other',
          });
          setIsAddressSheetOpen(false);
        }
      );
    } else {
      setIsAddressSheetOpen(false);
    }
  };

  return (
    <div className={styles.pageContainer}>
      {/* =========================================================================
          1. GREETING & ADDRESS SELECTOR (STANDALONE SINGLE ROW, NO CONTAINER BOX)
          ========================================================================= */}
      <div className={styles.greetingAddressRow}>
        <div className={styles.greetingCol}>
          <h2 className={styles.greetingName}>
            Hi, {displayName}
          </h2>
          <span className={styles.greetingSubtext}>{getGreeting()}</span>
        </div>

        {/* Address Selector Pill */}
        <button
          type="button"
          className={styles.addressPillBtn}
          onClick={() => setIsAddressSheetOpen(true)}
        >
          <div className={styles.addressPillLeft}>
            <MapPin size={16} className={styles.addressPillIcon} />
            <div className={styles.addressPillTextGroup}>
              <span className={styles.addressPillArea}>{selectedAddress.area}</span>
              <span className={styles.addressPillChangeText}>Change Address</span>
            </div>
          </div>
          <ChevronDown size={14} className={styles.addressPillChevron} />
        </button>
      </div>

      {/* =========================================================================
          PROMOTIONAL NEWS TICKER (EXACT MATCH REFERENCE UI)
          ========================================================================= */}
      <Link
        to="/household/post-scrap"
        className={styles.promoTickerStrip}
        aria-label="Puja Special Offer: Sell unused scrap before the festival and earn extra cash"
      >
        <div className={styles.bannerLeftSection}>
          <LuMegaphone size={19} className={styles.bannerMegaphoneIcon} aria-hidden="true" />
          <span className={styles.bannerBadgePill}>PUJA SPECIAL</span>
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
                {PROMO_TICKER_MESSAGES.map((msg) => (
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
          2. TOP PROMOTIONAL HERO / IMAGE SLIDER (POLISHED PRODUCTION MOBILE CAROUSEL)
          ========================================================================= */}
      <section
        ref={sliderContainerRef}
        className={styles.heroSliderWrapper}
        onMouseEnter={() => {
          isInteractingRef.current = true;
          stopAutoSlide();
        }}
        onMouseLeave={() => {
          if (!isSliderDragging) {
            resetResumeTimer();
          }
        }}
        onTouchStart={(e) => handleDragStart(e.touches[0].clientX)}
        onTouchMove={(e) => handleDragMove(e.touches[0].clientX)}
        onTouchEnd={handleDragEnd}
        onMouseDown={(e) => {
          if (e.button === 0) {
            handleDragStart(e.clientX);
          }
        }}
        onMouseMove={(e) => handleDragMove(e.clientX)}
        onMouseUp={handleDragEnd}
      >
        <div
          className={styles.sliderTrack}
          onTransitionEnd={handleSlideTransitionEnd}
          style={{
            transform: isSliderDragging
              ? `translateX(calc(-${safeSliderIndex * 100}% + ${sliderDragOffset}px))`
              : `translateX(-${safeSliderIndex * 100}%)`,
            transition: isSliderTransitioning
              ? 'transform 600ms cubic-bezier(0.25, 1, 0.5, 1)'
              : 'none',
          }}
        >
          {carouselSlides.map((slide, idx) => (
            <div
              key={`${slide.id}-${idx}`}
              className={styles.slideItem}
              onClickCapture={handleLinkClickCapture}
            >
              {slide.type === 'image' ? (
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
                    <h1 className={styles.goldBannerTitle}>{slide.title}</h1>
                    <p className={styles.goldBannerSubtitle}>
                      {slide.subtitle?.split('\n').map((line, lIdx) => (
                        <span key={lIdx} style={{ display: 'block' }}>
                          {line}
                        </span>
                      ))}
                    </p>
                    <div className={styles.goldBannerBtnRow}>
                      <Link to="/household/post-scrap" className={styles.goldPostBtn}>
                        <Plus size={16} color="#fbc21a" />
                        <span>Post Scrap</span>
                      </Link>
                      <Link to="/household/rates" className={styles.goldRatesBtn}>
                        <TrendingUp size={16} color="#15171B" />
                        <span>Rates</span>
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Pagination Dots (Bottom Center of Slider) */}
        <div className={styles.sliderDotsContainer}>
          {PROMO_SLIDES.map((_, dotIdx) => (
            <button
              key={dotIdx}
              type="button"
              className={`${styles.sliderDot} ${activeDotIndex === dotIdx ? styles.sliderDotActive : ''}`}
              onClick={() => goToSlide(dotIdx)}
              aria-label={`Go to slide ${dotIdx + 1}`}
            />
          ))}
        </div>
      </section>

      {/* =========================================================================
          3. 3 KPI STATS CARDS CAROUSEL (SWIPEABLE MOBILE-FIRST INTERACTIVE CAROUSEL)
          ========================================================================= */}
      <section className={styles.statsSectionWrapper}>
        <div
          className={styles.statsCarouselTrack}
          ref={statsTrackRef}
          onScroll={handleStatsScroll}
        >
          {/* Card 1: Upcoming Pickup */}
          <div
            className={`${styles.statInteractiveCard} ${styles.statCard1}`}
            onClick={() => navigate('/household/orders')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && navigate('/household/orders')}
            aria-label="Upcoming Pickup: 1, Today 04:15 PM"
          >
            <div className={styles.statCardTopRow}>
              <div className={styles.statSquircleIcon}>
                <Calendar size={18} strokeWidth={2.4} />
              </div>
              <div className={styles.statTopRightBadge}>
                <Clock size={12} color="#1E3A20" strokeWidth={2.4} />
                <span>Today, 04:15 PM</span>
              </div>
            </div>

            <div className={styles.statCardValueGroup}>
              <span className={styles.statBigValue}>{countUpcoming}</span>
              <h3 className={styles.statCardTitle}>Upcoming Pickup</h3>
            </div>
          </div>

          {/* Card 2: Total Recycled */}
          <div
            className={`${styles.statInteractiveCard} ${styles.statCard2}`}
            onClick={() => navigate('/household/history')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && navigate('/household/history')}
            aria-label="Total Recycled: 118.6 kg, 12 Pickups"
          >
            <div className={styles.statCardTopRow}>
              <div className={styles.statSquircleIcon}>
                <Recycle size={18} strokeWidth={2.4} />
              </div>
              <div className={styles.statTopRightBadge}>
                <UserIcon size={12} color="#1E3A20" strokeWidth={2.4} />
                <span>12 Pickups</span>
              </div>
            </div>

            <div className={styles.statCardValueGroup}>
              <span className={styles.statBigValue}>
                {countRecycled} <span className={styles.statUnitText}>kg</span>
              </span>
              <h3 className={styles.statCardTitle}>Total Recycled</h3>
            </div>
          </div>

          {/* Card 3: Total Earned */}
          <div
            className={`${styles.statInteractiveCard} ${styles.statCard3}`}
            onClick={() => navigate('/household/history')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && navigate('/household/history')}
            aria-label="Total Earned: ₹2,845, This Month"
          >
            <div className={styles.statCardTopRow}>
              <div className={styles.statSquircleIcon}>
                <IndianRupee size={18} strokeWidth={2.6} />
              </div>
              <div className={styles.statTopRightBadge}>
                <Calendar size={12} color="#1E3A20" strokeWidth={2.4} />
                <span>This Month</span>
              </div>
            </div>

            <div className={styles.statCardValueGroup}>
              <span className={styles.statBigValue}>
                ₹{Number(countEarned).toLocaleString('en-IN')}
              </span>
              <h3 className={styles.statCardTitle}>Total Earned</h3>
            </div>
          </div>
        </div>

        {/* Carousel Indicator Dots for Mobile */}
        <div className={styles.statsIndicatorDotsRow}>
          {[0, 1, 2].map((idx) => (
            <button
              key={idx}
              type="button"
              className={`${styles.statIndicatorDot} ${activeStatDot === idx ? styles.statIndicatorDotActive : ''}`}
              onClick={() => scrollToStatCard(idx)}
              aria-label={`Go to statistic ${idx + 1}`}
            />
          ))}
        </div>
      </section>

      {/* =========================================================================
          4. TWO-COLUMN MAIN CONTENT SECTION
          ========================================================================= */}
      <section className={styles.mainContentGrid}>
        {/* Left Column: Active Pickups */}
        <div className={styles.leftSectionCol}>
          {/* Next Pickup Card (Single Unified Container matching reference image) */}
          <div className={styles.nextPickupUnifiedCard}>
            {/* Top Row: Title + Scheduled Badge */}
            <div className={styles.pickupUnifiedHeader}>
              <h3 className={styles.pickupUnifiedTitle}>Next Pickup</h3>
              <span className={styles.scheduledPillBadge}>Scheduled</span>
            </div>

            {/* Middle Content Row: Partner info on Left, ETA & Track button on Right */}
            <div className={styles.pickupUnifiedBody}>
              <div className={styles.pickupPartnerLeftCol}>
                <div className={styles.partnerAvatarCircle}>
                  <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.partnerAvatarSvg}>
                    <circle cx="22" cy="22" r="22" fill="#dbeafe" />
                    {/* Hair */}
                    <path d="M14 14C14 9.58 17.58 6 22 6C26.42 6 30 9.58 30 14C30 15 29.2 16.5 29.2 16.5C29.2 16.5 27.5 13.5 22 13.5C16.5 13.5 14.8 16.5 14.8 16.5C14.8 16.5 14 15 14 14Z" fill="#1e293b" />
                    {/* Face */}
                    <circle cx="22" cy="15.5" r="6" fill="#fcd34d" />
                    {/* Beard */}
                    <path d="M17.5 16.5C17.5 19 19.5 21 22 21C24.5 21 26.5 19 26.5 16.5C26.5 17.5 25.5 20 22 20C18.5 20 17.5 17.5 17.5 16.5Z" fill="#1e293b" />
                    {/* Eyes */}
                    <circle cx="19.5" cy="14.5" r="0.75" fill="#1e293b" />
                    <circle cx="24.5" cy="14.5" r="0.75" fill="#1e293b" />
                    {/* Smile */}
                    <path d="M20.5 17.2C21 17.8 23 17.8 23.5 17.2" stroke="#1e293b" strokeWidth="0.75" strokeLinecap="round" />
                    {/* Body / Shirt */}
                    <path d="M10 35C10 28.37 15.37 23 22 23C28.63 23 34 28.37 34 35V44H10V35Z" fill="#2563eb" />
                    {/* Collar */}
                    <path d="M19 23L22 27L25 23" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>

                <div className={styles.pickupCardInfo}>
                  <span className={styles.execArrivingLabel}>Executive arriving</span>
                  <h4 className={styles.pickupTitle}>Arun Metal Traders</h4>

                  <p className={styles.pickupScheduleText}>
                    <Clock size={13} color="#94a3b8" />
                    <span>Today, 04:15 PM</span>
                  </p>
                </div>
              </div>

              {/* Vertical Divider / Right Column with ETA and Track Pickup */}
              <div className={styles.pickupEtaRightCol}>
                <div className={styles.etaTextGroup}>
                  <span className={styles.etaLabel}>ETA</span>
                  <div className={styles.etaValueRow}>
                    <span className={styles.etaNumber}>20</span>
                    <span className={styles.etaMinsText}>mins</span>
                  </div>
                </div>

                <Link to="/household/orders" className={styles.trackPickupMiniBtn}>
                  Track Pickup
                </Link>
              </div>
            </div>

            {/* Bottom: 3-Step Process Chain Tracker */}
            <div className={styles.miniStageTracker}>
              <div className={`${styles.miniStep} ${styles.miniStepDone}`}>
                <div className={styles.miniCircle}>
                  <LuCheck size={11} strokeWidth={3} aria-hidden="true" />
                </div>
                <span>Confirmed</span>
              </div>
              <div className={`${styles.miniLine} ${styles.miniLineActive}`} />
              <div className={`${styles.miniStep} ${styles.miniStepActive}`}>
                <div className={styles.miniCircle}>
                  <Truck size={13} aria-hidden="true" />
                </div>
                <span>On the way</span>
              </div>
              <div className={styles.miniLine} />
              <div className={styles.miniStep}>
                <div className={styles.miniCircle}>
                  <HomeIcon size={13} aria-hidden="true" />
                </div>
                <span>Arrived</span>
              </div>
            </div>
          </div>

          {/* How It Works Card - Single Step Transition */}
          <div
            className={styles.howItWorksCard}
            onMouseEnter={handleHowMouseEnter}
            onMouseLeave={handleHowMouseLeave}
            onTouchStart={handleHowTouchStart}
            onTouchEnd={handleHowTouchEnd}
          >
            <div className={styles.howItWorksHeader}>
              <h3 className={styles.howItWorksTitle}>How it works</h3>
              <div className={styles.howStepDots}>
                {HOW_IT_WORKS_STEPS.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className={`${styles.howDot} ${
                      idx === howStepIndex ? styles.howDotActive : ''
                    }`}
                    onClick={() => handleHowDotClick(idx)}
                    aria-label={`Step ${idx + 1}`}
                  />
                ))}
              </div>
            </div>

            <div className={styles.howStepViewport}>
              {HOW_IT_WORKS_STEPS.map((item, idx) => (
                <div
                  key={item.step}
                  className={`${styles.howSingleStepSlide} ${
                    idx === howStepIndex ? styles.howSingleStepSlideActive : ''
                  }`}
                  aria-hidden={idx !== howStepIndex}
                >
                  <div className={styles.howNumCircle}>{item.step}</div>
                  <div className={styles.howTextCol}>
                    <strong>{item.title}</strong>
                    <span>{item.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Household Market Prices Widget FIRST, then Share Your Review */}
        <div className={styles.rightSectionCol}>
          {/* 1. Market Prices */}
          <div className={styles.ratesSectionCard}>
            <div className={styles.ratesHeaderRow}>
              <div className={styles.ratesTitleGroup}>
                <h3 className={styles.ratesMainTitle}>Market Prices</h3>
                <p className={styles.ratesSubtitle}>Chennai Doorstep Scrap Rates</p>
              </div>

              <Link to="/household/rates" className={styles.exploreAllLink}>
                <span>Explore All</span>
                <ChevronRight size={15} />
              </Link>
            </div>

            <div className={styles.rateRowsList}>
              {LIVE_SCRAP_RATES.map((item) => (
                <div
                  key={item.id}
                  className={styles.rateRowCard}
                  onClick={() => navigate(`/household/rates?item=${item.id}&category=${item.categoryId || ''}`)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      navigate(`/household/rates?item=${item.id}&category=${item.categoryId || ''}`);
                    }
                  }}
                  title={`View live market rate for ${item.name}`}
                  aria-label={`View live market rate for ${item.name}`}
                >
                  <div className={styles.rateRowLeft}>
                    <div className={styles.rateRowThumb} style={{ background: item.iconBg }}>
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/logo.png';
                        }}
                      />
                    </div>

                    <div className={styles.rateRowMeta}>
                      <h4 className={styles.rateRowName}>{item.name}</h4>
                      <p className={styles.rateRowPrice}>
                        {item.price}{' '}
                        <span style={{ fontSize: '0.74rem', color: '#059669', fontWeight: 600 }}>
                          {item.unit}
                        </span>
                      </p>
                    </div>
                  </div>

                  <span
                    className={[
                      styles.rateTrendBadge,
                      item.trendType === 'positive'
                        ? styles.trendGreen
                        : item.trendType === 'negative'
                        ? styles.trendRed
                        : styles.trendNeutral,
                    ].join(' ')}
                  >
                    {item.trend}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 2. Tell Us What You Think - Private Application Feedback Card */}
          <div className={styles.feedbackCard}>
            <div className={styles.feedbackHeader}>
              <div className={styles.feedbackTitleRow}>
                <LuMessageSquareQuote size={20} color="#F8BF1D" />
                <h3 className={styles.feedbackTitle}>Tell Us What You Think</h3>
              </div>
              <p className={styles.feedbackSubtitle}>
                Help us improve BillScrap with your feedback.
              </p>
            </div>

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
                      (hoverRating || satisfactionRating) >= star ? styles.starActive : ''
                    }`}
                    onClick={() => {
                      setSatisfactionRating(star);
                      setIsFeedbackModalOpen(true);
                    }}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    title={`Rate overall experience ${star} of 5 stars`}
                    aria-label={`Rate overall experience ${star} of 5 stars`}
                  >
                    <Star
                      size={24}
                      fill={(hoverRating || satisfactionRating) >= star ? '#f59e0b' : 'none'}
                      stroke="currentColor"
                    />
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              className={styles.giveFeedbackBtn}
              onClick={() => setIsFeedbackModalOpen(true)}
            >
              <LuMessageSquareQuote size={16} />
              <span>Give Feedback</span>
            </button>
          </div>
        </div>
      </section>

      {/* =========================================================================
          5. ADDRESS SELECTOR BOTTOM SHEET MODAL (MATCHING REFERENCE DESIGN)
          ========================================================================= */}
      {/* =========================================================================
          ADDRESS SELECTOR BOTTOM SHEET (MATCHING REFERENCE UI)
          ========================================================================= */}
      {isAddressSheetOpen && (
        <div
          className={styles.bottomSheetOverlay || styles.bottomSheetBackdrop}
          onClick={() => setIsAddressSheetOpen(false)}
        >
          <div
            className={styles.bottomSheetContainer}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Gray Drag Handle */}
            <div className={styles.sheetDragHandleWrap}>
              <div className={styles.sheetDragPill} />
            </div>

            {/* Header: Title + Close Icon */}
            <div className={styles.sheetHeader}>
              <h3 className={styles.sheetTitle}>Select pickup address</h3>
              <button
                type="button"
                className={styles.sheetCloseBtn}
                onClick={() => setIsAddressSheetOpen(false)}
                aria-label="Close address sheet"
              >
                <X size={20} />
              </button>
            </div>

            {/* Scrollable Sheet Body */}
            <div className={styles.sheetBody}>
              {/* Search Bar */}
              <div className={styles.sheetSearchWrap}>
                <Search size={18} className={styles.sheetSearchIcon} />
                <input
                  type="text"
                  className={styles.sheetSearchInput}
                  placeholder="Search area, street, pincode"
                  value={addressSearchQuery}
                  onChange={(e) => setAddressSearchQuery(e.target.value)}
                />
                {addressSearchQuery && (
                  <button
                    type="button"
                    className={styles.sheetSearchClearBtn}
                    onClick={() => setAddressSearchQuery('')}
                  >
                    <X size={15} />
                  </button>
                )}
              </div>

              {/* Action 1: Use my current location */}
              <div
                className={styles.sheetActionItem}
                onClick={handleUseCurrentLocation}
                role="button"
                tabIndex={0}
              >
                <MapPin size={22} color="#F8BF1D" className={styles.actionDirectIcon} />
                <div className={styles.actionTextCol}>
                  <span className={styles.actionTitleGold}>Use my current location</span>
                  <span className={styles.actionSubtext}>Allow access to location for faster pickups</span>
                </div>
                <ChevronRight size={18} className={styles.actionChevron} />
              </div>

              {/* Action 2: Add New Address */}
              <Link
                to="/household/post-scrap"
                className={`${styles.sheetActionItem} ${styles.sheetActionDashed}`}
                onClick={() => setIsAddressSheetOpen(false)}
              >
                <Plus size={22} color="#F8BF1D" className={styles.actionDirectIcon} />
                <div className={styles.actionTextCol}>
                  <span className={styles.actionTitleGold}>Add New Address</span>
                  <span className={styles.actionSubtext}>Add a new pickup address</span>
                </div>
                <ChevronRight size={18} className={styles.actionChevron} />
              </Link>

              {/* Saved Addresses Section */}
              <div className={styles.savedAddressesSection}>
                <span className={styles.savedSectionLabel}>Saved addresses</span>

                <div className={styles.savedAddressesList}>
                  {filteredAddresses.map((addr) => (
                    <div
                      key={addr.id}
                      className={`${styles.savedAddressCard} ${
                        selectedAddress.id === addr.id ? styles.savedAddressActive : ''
                      }`}
                      onClick={() => handleSelectAddress(addr)}
                      role="button"
                      tabIndex={0}
                    >
                      <div className={styles.savedAddressIconBox}>
                        {addr.type === 'home' ? (
                          <HomeIcon size={24} color="#F8BF1D" />
                        ) : (
                          <Briefcase size={24} color="#F8BF1D" />
                        )}
                      </div>

                      <div className={styles.savedAddressContent}>
                        <div className={styles.savedAddressTitleRow}>
                          <span className={styles.savedAddressTag}>{addr.tag}</span>
                          {addr.isDefault && (
                            <span className={styles.defaultBadgePill}>Default</span>
                          )}
                        </div>

                        <p className={styles.savedAddressFullText}>{addr.fullAddress}</p>
                        <div className={styles.savedAddressPhoneRow}>
                          <Phone size={13} color="#F8BF1D" />
                          <span className={styles.savedAddressPhone}>{addr.phone}</span>
                        </div>
                      </div>

                      <button
                        type="button"
                        className={styles.savedAddressMenuBtn}
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                        title="Address Options"
                      >
                        <MoreVertical size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Location Access Banner Card */}
              <div className={styles.locationAccessCard}>
                <div className={styles.locAccessLeft}>
                  <div className={styles.locAccessIconWrap}>
                    <Navigation size={20} color="#F8BF1D" />
                  </div>
                  <div className={styles.locAccessTextCol}>
                    <strong className={styles.locAccessTitle}>Location access</strong>
                    <p className={styles.locAccessDesc}>
                      Enable location to show nearby merchants and faster pickups.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  className={styles.enableLocationBtn}
                  onClick={handleUseCurrentLocation}
                >
                  {locationEnabled ? 'Location Enabled' : 'Enable Location'}
                </button>
              </div>

              {/* Security Footer Banner */}
              <div className={styles.addressSecurityBanner}>
                <ShieldCheck size={20} color="#F8BF1D" className={styles.securityShieldIcon} />
                <div className={styles.securityTextCol}>
                  <strong className={styles.securityTitle}>Your address is safe with us</strong>
                  <span className={styles.securitySubtitle}>We don't share your location with third parties.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DETAIL VISION IMAGE GALLERY / LIGHTBOX MODAL */}
      {selectedGalleryPickup && (
        <div className={styles.lightboxOverlay} onClick={() => setSelectedGalleryPickup(null)}>
          <div className={styles.lightboxBox} onClick={(e) => e.stopPropagation()}>
            {/* Lightbox Header */}
            <div className={styles.lightboxHeader}>
              <div className={styles.lightboxTitleGroup}>
                <h3 className={styles.lightboxTitle}>
                  <span>Detail Vision • Scrap Photos</span>
                  <span className={styles.orderPillBadge}>{selectedGalleryPickup.orderNumber}</span>
                </h3>
                <p className={styles.lightboxSubtitle}>
                  High resolution verified scrap item photos uploaded for doorstep pickup collection
                </p>
              </div>

              <button
                type="button"
                className={styles.lightboxCloseBtn}
                onClick={() => setSelectedGalleryPickup(null)}
                aria-label="Close Lightbox"
              >
                <X size={20} />
              </button>
            </div>

            {/* Main Active Image Viewport */}
            <div className={styles.lightboxViewer}>
              <div className={styles.lightboxImageStage}>
                <img
                  src={selectedGalleryPickup.photos[activePhotoIndex]?.imageUrl}
                  alt={selectedGalleryPickup.photos[activePhotoIndex]?.title}
                  className={styles.lightboxMainImg}
                />

                {/* Arrow Nav Buttons */}
                {selectedGalleryPickup.photos.length > 1 && (
                  <>
                    <button
                      type="button"
                      className={`${styles.lightboxNavArrow} ${styles.lightboxNavPrev}`}
                      onClick={handlePrevPhoto}
                      title="Previous Photo"
                    >
                      <ChevronLeft size={22} />
                    </button>

                    <button
                      type="button"
                      className={`${styles.lightboxNavArrow} ${styles.lightboxNavNext}`}
                      onClick={handleNextPhoto}
                      title="Next Photo"
                    >
                      <ChevronRight size={22} />
                    </button>
                  </>
                )}
              </div>

              {/* Photo Description Metadata Caption Box */}
              <div className={styles.photoCaptionBox}>
                <div className={styles.captionTopRow}>
                  <span className={styles.photoIndexTag}>
                    PHOTO {activePhotoIndex + 1} OF {selectedGalleryPickup.photos.length}
                  </span>
                  <span className={styles.photoWeightBadge}>
                    {selectedGalleryPickup.photos[activePhotoIndex]?.weight}
                  </span>
                </div>

                <h4 className={styles.photoCaptionTitle}>
                  {selectedGalleryPickup.photos[activePhotoIndex]?.title}
                </h4>

                <p className={styles.photoRateInfo}>
                  {selectedGalleryPickup.photos[activePhotoIndex]?.rateInfo}
                </p>
              </div>
            </div>

            {/* Thumbnail Strip */}
            <div className={styles.lightboxThumbStrip}>
              {selectedGalleryPickup.photos.map((photo, idx) => (
                <div
                  key={photo.id}
                  className={`${styles.stripThumbCard} ${
                    idx === activePhotoIndex ? styles.stripThumbActive : ''
                  }`}
                  onClick={() => setActivePhotoIndex(idx)}
                >
                  <img
                    src={photo.imageUrl}
                    alt={photo.title}
                    className={styles.stripThumbImg}
                  />
                  <div className={styles.stripThumbLabel}>
                    <span className={styles.stripThumbWeight}>{photo.weight}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* PRIVATE BILLSCRAP APPLICATION FEEDBACK MODAL (100% CONFIDENTIAL PRODUCT FEEDBACK) */}
      {isFeedbackModalOpen && (
        <div
          className={styles.feedbackModalOverlay}
          onClick={handleCloseFeedbackModal}
          role="dialog"
          aria-modal="true"
          aria-label="BillScrap Application Feedback"
        >
          <div
            className={styles.feedbackModalContainer}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className={styles.feedbackModalHeader}>
              <div className={styles.feedbackModalTitleGroup}>
                <h3 className={styles.feedbackModalTitle}>
                  <LuMessageSquareQuote size={20} color="#F8BF1D" />
                  <span>Tell Us What You Think</span>
                </h3>
                <span className={styles.feedbackModalSubtitle}>
                  Help us improve BillScrap with your private feedback
                </span>
              </div>
              <button
                type="button"
                className={styles.feedbackModalCloseBtn}
                onClick={handleCloseFeedbackModal}
                aria-label="Close Feedback Modal"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            {feedbackSuccess ? (
              <div className={styles.feedbackSuccessView}>
                <div className={styles.successIconWrap}>
                  <CheckCircle2 size={32} />
                </div>
                <h4 className={styles.successTitle}>Thanks for your feedback!</h4>
                <p className={styles.successDesc}>
                  Your feedback helps us make BillScrap better. Our product team reviews every submission privately.
                </p>
                <button
                  type="button"
                  className={styles.successDoneBtn}
                  onClick={handleCloseFeedbackModal}
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitFeedback} style={{ display: 'contents' }}>
                <div className={styles.feedbackModalBody}>
                  {/* Confidentiality Privacy Banner */}
                  <div className={styles.feedbackPrivateBanner}>
                    <ShieldCheck size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span>
                      <strong>100% Private Product Feedback.</strong> This is collected for internal product improvement only. It will never be shared publicly or with merchants.
                    </span>
                  </div>

                  {/* Rating Input: How satisfied are you with BillScrap? */}
                  <div className={styles.questionGroup}>
                    <label className={styles.questionLabel}>
                      Overall Satisfaction with BillScrap
                    </label>
                    <div className={styles.starRatingRow}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          className={`${styles.starBtn} ${
                            (hoverRating || satisfactionRating) >= star ? styles.starActive : ''
                          }`}
                          onClick={() => setSatisfactionRating(star)}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          title={`${star} of 5 stars`}
                        >
                          <Star
                            size={26}
                            fill={(hoverRating || satisfactionRating) >= star ? '#f59e0b' : 'none'}
                            stroke="currentColor"
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Feedback Category */}
                  <div className={styles.questionGroup}>
                    <label className={styles.questionLabel}>
                      Feedback Category
                    </label>
                    <div className={styles.optionsPillsWrap}>
                      {[
                        'App experience',
                        'Scrap selling',
                        'Pickup experience',
                        'Scrap rates',
                        'Reusable products',
                        'Payments',
                        'Other',
                      ].map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          className={`${styles.optionPillBtn} ${
                            feedbackCategory === cat ? styles.optionPillBtnActive : ''
                          }`}
                          onClick={() => setFeedbackCategory(cat)}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Question 1: How has BillScrap been for you? */}
                  <div className={styles.questionGroup}>
                    <label className={styles.questionLabel}>
                      1. How has BillScrap been for you?
                    </label>
                    <div className={styles.optionsPillsWrap}>
                      {['Very helpful', 'Helpful', 'Okay', 'Not very helpful', 'Not helpful'].map(
                        (opt) => (
                          <button
                            key={opt}
                            type="button"
                            className={`${styles.optionPillBtn} ${
                              experienceRating === opt ? styles.optionPillBtnActive : ''
                            }`}
                            onClick={() => setExperienceRating(opt)}
                          >
                            {opt}
                          </button>
                        )
                      )}
                    </div>
                  </div>

                  {/* Question 2: What do you mainly use BillScrap for? */}
                  <div className={styles.questionGroup}>
                    <label className={styles.questionLabel}>
                      2. What do you mainly use BillScrap for? <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 'normal' }}>(Select all that apply)</span>
                    </label>
                    <div className={styles.optionsPillsWrap}>
                      {[
                        'Selling scrap',
                        'Checking scrap rates',
                        'Booking pickups',
                        'Finding reusable products',
                        'Tracking orders',
                        'Other',
                      ].map((item) => {
                        const isSelected = selectedUsageCategories.includes(item);
                        return (
                          <button
                            key={item}
                            type="button"
                            className={`${styles.optionPillBtn} ${
                              isSelected ? styles.optionPillBtnActive : ''
                            }`}
                            onClick={() => toggleUsageCategory(item)}
                          >
                            {isSelected ? '✓ ' : ''}{item}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Question 3: What do you like about BillScrap? */}
                  <div className={styles.questionGroup}>
                    <label className={styles.questionLabel}>
                      3. What do you like about BillScrap?
                    </label>
                    <textarea
                      className={styles.questionTextarea}
                      rows={3}
                      placeholder="Tell us what works well for you..."
                      value={likedFeatures}
                      onChange={(e) => setLikedFeatures(e.target.value)}
                    />
                  </div>

                  {/* Question 4: Are you facing any problems? */}
                  <div className={styles.questionGroup}>
                    <label className={styles.questionLabel}>
                      4. Are you facing any problems?
                    </label>
                    <textarea
                      className={styles.questionTextarea}
                      rows={3}
                      placeholder="Tell us about any issue or difficulty you faced..."
                      value={problemsFaced}
                      onChange={(e) => setProblemsFaced(e.target.value)}
                    />
                  </div>

                  {/* Question 5: What should we improve? */}
                  <div className={styles.questionGroup}>
                    <label className={styles.questionLabel}>
                      5. What should we improve?
                    </label>
                    <textarea
                      className={styles.questionTextarea}
                      rows={3}
                      placeholder="Tell us what would make BillScrap better..."
                      value={improvementSuggestions}
                      onChange={(e) => setImprovementSuggestions(e.target.value)}
                    />
                  </div>
                </div>

                {/* Modal Footer Actions */}
                <div className={styles.feedbackModalFooter}>
                  <button
                    type="button"
                    className={styles.feedbackCancelBtn}
                    onClick={handleCloseFeedbackModal}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className={styles.feedbackSubmitBtn}
                    disabled={isSubmittingFeedback}
                  >
                    {isSubmittingFeedback ? (
                      <span>Submitting...</span>
                    ) : (
                      <>
                        <Send size={15} />
                        <span>Submit Feedback</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}

export default HouseholdDashboard;
