import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  TrendingUp,
  Plus,
  Calendar,
  CheckCircle2,
  IndianRupee,
  Truck,
  Star,
  Send,
  Clock,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  X,
  Eye,
  Maximize2,
  MapPin,
  Search,
  Navigation,
  Home as HomeIcon,
  Briefcase,
  MoreVertical,
  Bell,
  Radio,
  Phone,
  Recycle,
  User as UserIcon,
} from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
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

  // Review State
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [submittedReview, setSubmittedReview] = useState(false);

  // How it Works Single-Step Carousel Loop
  const [howStepIndex, setHowStepIndex] = useState(0);
  const [isHowTransitioning, setIsHowTransitioning] = useState(true);
  const howStepTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const carouselSteps = [...HOW_IT_WORKS_STEPS, HOW_IT_WORKS_STEPS[0]];

  const startHowStepTimer = useCallback(() => {
    if (howStepTimerRef.current) clearInterval(howStepTimerRef.current);
    howStepTimerRef.current = setInterval(() => {
      if (!document.hidden) {
        setIsHowTransitioning(true);
        setHowStepIndex((prev) => {
          if (prev >= carouselSteps.length - 1) return 1;
          return prev + 1;
        });
      }
    }, 3500);
  }, [carouselSteps.length]);

  useEffect(() => {
    startHowStepTimer();
    return () => {
      if (howStepTimerRef.current) clearInterval(howStepTimerRef.current);
    };
  }, [startHowStepTimer]);

  const handleHowTransitionEnd = () => {
    if (howStepIndex >= carouselSteps.length - 1) {
      setIsHowTransitioning(false);
      setHowStepIndex(0);
    }
  };

  useEffect(() => {
    if (!isHowTransitioning) {
      const raf = requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsHowTransitioning(true);
        });
      });
      return () => cancelAnimationFrame(raf);
    }
  }, [isHowTransitioning]);

  const handleHowDotClick = (dotIdx: number) => {
    setIsHowTransitioning(true);
    setHowStepIndex(dotIdx);
    startHowStepTimer();
  };

  // Post Scrap Modal State
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState('Scrap Iron (Heavy Melting Steel)');
  const [approxWeight, setApproxWeight] = useState('15');
  const [pickupDate, setPickupDate] = useState('2025-05-15');
  const [pickupSlot, setPickupSlot] = useState('Morning (09:00 AM - 12:00 PM)');

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

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewText.trim()) return;
    setSubmittedReview(true);
    setTimeout(() => {
      setSubmittedReview(false);
      setReviewText('');
    }, 3500);
  };

  const handleBookOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setIsBookModalOpen(false);
    navigate('/household/post-scrap');
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
                <Calendar size={22} strokeWidth={2.4} />
              </div>
              <div className={styles.statTopRightBadge}>
                <Clock size={13} color="#1E3A20" strokeWidth={2.4} />
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
                <Recycle size={22} strokeWidth={2.4} />
              </div>
              <div className={styles.statTopRightBadge}>
                <UserIcon size={13} color="#1E3A20" strokeWidth={2.4} />
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
                <IndianRupee size={22} strokeWidth={2.6} />
              </div>
              <div className={styles.statTopRightBadge}>
                <Calendar size={13} color="#1E3A20" strokeWidth={2.4} />
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
                <div className={styles.miniCircle}>✓</div>
                <span>Confirmed</span>
              </div>
              <div className={`${styles.miniLine} ${styles.miniLineActive}`} />
              <div className={`${styles.miniStep} ${styles.miniStepActive}`}>
                <div className={styles.miniCircle}><Truck size={13} /></div>
                <span>On the way</span>
              </div>
              <div className={styles.miniLine} />
              <div className={styles.miniStep}>
                <div className={styles.miniCircle}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg>
                </div>
                <span>Arrived</span>
              </div>
            </div>
          </div>

          {/* How It Works Card - Single Step Transition */}
          <div className={styles.howItWorksCard}>
            <div className={styles.howItWorksHeader}>
              <h3 className={styles.howItWorksTitle}>How it works</h3>
              <div className={styles.howStepDots}>
                {HOW_IT_WORKS_STEPS.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className={`${styles.howDot} ${
                      idx === (howStepIndex % HOW_IT_WORKS_STEPS.length)
                        ? styles.howDotActive
                        : ''
                    }`}
                    onClick={() => handleHowDotClick(idx)}
                    aria-label={`Step ${idx + 1}`}
                  />
                ))}
              </div>
            </div>

            <div className={styles.howStepViewport}>
              <div
                className={styles.howStepTrack}
                onTransitionEnd={handleHowTransitionEnd}
                style={{
                  transform: `translateX(-${howStepIndex * 100}%)`,
                  transition: isHowTransitioning
                    ? 'transform 450ms cubic-bezier(0.25, 1, 0.5, 1)'
                    : 'none',
                }}
              >
                {carouselSteps.map((item, idx) => (
                  <div key={`${item.step}-${idx}`} className={styles.howSingleStepSlide}>
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
                  onClick={() => {
                    setSelectedMaterial(item.name);
                    setIsBookModalOpen(true);
                  }}
                  role="button"
                  tabIndex={0}
                  title={`Click to post scrap for ${item.name}`}
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

          {/* 2. Share Your Review Card */}
          <div className={styles.reviewCard}>
            <div className={styles.reviewHeader}>
              <h3 className={styles.reviewTitle}>
                <Star size={18} fill="#f59e0b" color="#f59e0b" />
                <span>Share Your Review</span>
              </h3>
              <p className={styles.reviewSubtitle}>
                We value your feedback! Let us know about your doorstep scrap selling experience.
              </p>
            </div>

            {/* 5-Star Rating Selector */}
            <div className={styles.starRatingRow}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className={`${styles.starBtn} ${
                    (hoverRating || rating) >= star ? styles.starActive : ''
                  }`}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  title={`${star} Star`}
                >
                  <Star
                    size={22}
                    fill={(hoverRating || rating) >= star ? '#f59e0b' : 'none'}
                    stroke="currentColor"
                  />
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmitReview}>
              <textarea
                className={styles.reviewTextarea}
                placeholder="Write your review here..."
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                rows={3}
              />

              <div className={styles.reviewActionRow}>
                <button type="submit" className={styles.submitReviewBtn}>
                  <Send size={14} />
                  <span>{submittedReview ? 'Review Submitted! ✨' : 'Submit Review'}</span>
                </button>
              </div>
            </form>
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
          className={styles.bottomSheetBackdrop}
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

      {/* QUICK POST SCRAP MODAL */}
      {isBookModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsBookModalOpen(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div>
                <h3 className={styles.modalTitle}>Post Doorstep Scrap</h3>
                <p className={styles.modalSubtitle}>
                  Schedule doorstep pickup with verified digital weighing
                </p>
              </div>
              <button
                type="button"
                className={styles.modalCloseBtn}
                onClick={() => setIsBookModalOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleBookOrder} className={styles.modalForm}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Selected Scrap Material</label>
                <input
                  type="text"
                  className={styles.formInput}
                  value={selectedMaterial}
                  onChange={(e) => setSelectedMaterial(e.target.value)}
                  required
                />
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Approx Weight (KG)</label>
                  <input
                    type="number"
                    className={styles.formInput}
                    value={approxWeight}
                    onChange={(e) => setApproxWeight(e.target.value)}
                    placeholder="e.g. 15"
                    min="1"
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Preferred Date</label>
                  <input
                    type="date"
                    className={styles.formInput}
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Time Slot</label>
                <select
                  className={styles.formSelect}
                  value={pickupSlot}
                  onChange={(e) => setPickupSlot(e.target.value)}
                >
                  <option value="Morning (09:00 AM - 12:00 PM)">
                    Morning (09:00 AM - 12:00 PM)
                  </option>
                  <option value="Afternoon (12:00 PM - 04:00 PM)">
                    Afternoon (12:00 PM - 04:00 PM)
                  </option>
                  <option value="Evening (04:00 PM - 07:00 PM)">
                    Evening (04:00 PM - 07:00 PM)
                  </option>
                </select>
              </div>

              <div className={styles.modalFooter}>
                <button
                  type="button"
                  className={styles.modalCancelBtn}
                  onClick={() => setIsBookModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className={styles.modalSubmitBtn}>
                  <span>Schedule Pickup</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default HouseholdDashboard;
