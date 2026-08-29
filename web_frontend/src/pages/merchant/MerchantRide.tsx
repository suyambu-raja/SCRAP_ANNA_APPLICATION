import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  Clock,
  Flag,
  Calendar,
  Sparkles,
  Maximize2,
  Home,
  ShieldCheck,
  ChevronDown,
  Navigation,
  Compass,
  Check,
  CheckCircle2,
  Truck,
  Building,
  User,
  X,
  Play,
  ArrowRight,
  KeyRound,
  Scale,
  Package,
  AlertCircle,
  CheckSquare,
} from 'lucide-react';
import styles from './MerchantRide.module.css';

export interface ConfirmedRideOrder {
  id: string;
  orderId: string;
  customerName: string;
  customerType: 'Industry' | 'Individual';
  materialName: string;
  materialCondition: string;
  quantity: string;
  weightNum: number;
  image: string;
  address: string;
  pickupDate: string;
  pickupTime: string;
  area: string;
  cx: number;
  cy: number;
  status: 'upcoming' | 'en-route' | 'completed';
  // Industry specific operational tags
  vehicleRequired?: string;
  weighbridgeType?: string;
  gateEntry?: string;
}

// Master pool of scheduled orders
const MASTER_SCHEDULED_ORDERS: ConfirmedRideOrder[] = [
  // 16 May 2025 - Industry Pickups
  {
    id: 'IND-16-1',
    orderId: 'ORD-250513-00078',
    customerName: 'Sri Venkatesh Industries',
    customerType: 'Industry',
    materialName: 'Metal & Steel Turnings',
    materialCondition: 'Heavy Mixed',
    quantity: '650 KG',
    weightNum: 650,
    image: '/scrap-iron.png',
    address: '24, 5th Main Road, SIDCO Industrial Estate, Guindy, Chennai – 600032',
    pickupDate: '16 May 2025',
    pickupTime: '10:00 AM – 12:00 PM',
    area: 'Guindy / SIDCO',
    cx: 695,
    cy: 420,
    status: 'upcoming',
    vehicleRequired: '14ft Open Body Commercial Truck',
    weighbridgeType: 'On-site 5-Ton Platform Scale',
    gateEntry: 'Gate 3 (South Loading Yard)',
  },
  {
    id: 'IND-16-2',
    orderId: 'ORD-250513-00081',
    customerName: 'Meenakshi Auto Castings Pvt Ltd',
    customerType: 'Industry',
    materialName: 'Cast Iron & Engine Blocks',
    materialCondition: 'Clean Segregated',
    quantity: '800 KG',
    weightNum: 800,
    image: '/scrap-quality-steel.png',
    address: 'Plot 45, Phase 2, Ambattur Industrial Estate, Chennai – 600058',
    pickupDate: '16 May 2025',
    pickupTime: '02:00 PM – 04:30 PM',
    area: 'Ambattur Industrial',
    cx: 550,
    cy: 240,
    status: 'upcoming',
    vehicleRequired: '20ft Heavy Flatbed with Crane',
    weighbridgeType: 'Public Weighbridge (Ambattur OT Checkpost)',
    gateEntry: 'Main Dispatch Gate 1',
  },

  // 16 May 2025 - Household Pickups
  {
    id: 'HH-16-1',
    orderId: 'ORD-250513-00091',
    customerName: 'Dr. S. K. Subramanian',
    customerType: 'Individual',
    materialName: 'Textbook Paper & Books',
    materialCondition: 'Clean',
    quantity: '90 KG',
    weightNum: 90,
    image: '/scrap-cardboard.png',
    address: '14, 2nd Avenue, Besant Nagar, Chennai – 600090',
    pickupDate: '16 May 2025',
    pickupTime: '08:30 AM – 10:00 AM',
    area: 'Besant Nagar',
    cx: 820,
    cy: 490,
    status: 'upcoming',
  },
  {
    id: 'HH-16-2',
    orderId: 'ORD-250513-00092',
    customerName: 'Anand Narayanan',
    customerType: 'Individual',
    materialName: 'Old Appliances & Mixed Metal',
    materialCondition: 'Mixed',
    quantity: '140 KG',
    weightNum: 140,
    image: '/scrap-iron.png',
    address: 'Flat 4B, Riverview Apts, Gandhinagar, Adyar, Chennai – 600020',
    pickupDate: '16 May 2025',
    pickupTime: '10:15 AM – 11:30 AM',
    area: 'Adyar',
    cx: 790,
    cy: 440,
    status: 'upcoming',
  },
  {
    id: 'HH-16-3',
    orderId: 'ORD-250513-00093',
    customerName: 'Geetha Raman',
    customerType: 'Individual',
    materialName: 'Plastic Bottles & Corrugated Boxes',
    materialCondition: 'Clean',
    quantity: '75 KG',
    weightNum: 75,
    image: '/scrap-plastic.png',
    address: '22, 100 Feet Bypass Road, Velachery, Chennai – 600042',
    pickupDate: '16 May 2025',
    pickupTime: '12:00 PM – 01:30 PM',
    area: 'Velachery',
    cx: 725,
    cy: 510,
    status: 'upcoming',
  },

  // 13 May 2025 - Industry
  {
    id: 'IND-13-1',
    orderId: 'ORD-250513-00077',
    customerName: 'Ambattur Heavy Foundry Works',
    customerType: 'Industry',
    materialName: 'Copper Scrap & Armature Wire',
    materialCondition: 'Clean Strip',
    quantity: '180 KG',
    weightNum: 180,
    image: '/scrap-copper.png',
    address: '12/1, Ambattur Industrial Estate, Ambattur, Chennai – 600058',
    pickupDate: '13 May 2025',
    pickupTime: '02:00 PM – 04:00 PM',
    area: 'Ambattur North',
    cx: 550,
    cy: 240,
    status: 'upcoming',
    vehicleRequired: 'Light Commercial Vehicle (Tata Ace)',
    weighbridgeType: 'Calibrated Digital Platform Scale',
    gateEntry: 'Foundry Entry Bay B',
  },
  {
    id: 'IND-13-2',
    orderId: 'ORD-250513-00079',
    customerName: 'Kaveri Polymers Ltd',
    customerType: 'Industry',
    materialName: 'HDPE Drums & Industrial Plastic',
    materialCondition: 'Mixed',
    quantity: '320 KG',
    weightNum: 320,
    image: '/scrap-plastic.png',
    address: '18, Mount-Poonamallee High Road, Porur, Chennai – 600116',
    pickupDate: '13 May 2025',
    pickupTime: '04:30 PM – 06:00 PM',
    area: 'Porur',
    cx: 600,
    cy: 480,
    status: 'upcoming',
    vehicleRequired: '14ft High-Side Container Truck',
    weighbridgeType: 'Porur Toll Weighbridge',
    gateEntry: 'Warehouse Bay 4',
  },

  // 13 May 2025 - Household
  {
    id: 'HH-13-1',
    orderId: 'ORD-250513-00076',
    customerName: 'Ramesh Kumar (Household)',
    customerType: 'Individual',
    materialName: 'Steel Scrap & Iron Grills',
    materialCondition: 'Mixed',
    quantity: '120 KG',
    weightNum: 120,
    image: '/scrap-quality-steel.png',
    address: '8, Padi High Street, Padi, Chennai – 600050',
    pickupDate: '13 May 2025',
    pickupTime: '09:00 AM – 11:00 AM',
    area: 'Padi Junction',
    cx: 700,
    cy: 215,
    status: 'upcoming',
  },
  {
    id: 'HH-13-2',
    orderId: 'ORD-250513-00085',
    customerName: 'Lakshmi Sundar',
    customerType: 'Individual',
    materialName: 'Newspapers & Cardboard',
    materialCondition: 'Clean',
    quantity: '45 KG',
    weightNum: 45,
    image: '/scrap-cardboard.png',
    address: '12, 4th Main Road, Anna Nagar West, Chennai – 600040',
    pickupDate: '13 May 2025',
    pickupTime: '11:30 AM – 01:00 PM',
    area: 'Anna Nagar West',
    cx: 805,
    cy: 295,
    status: 'upcoming',
  },

  // 14 May 2025
  {
    id: 'IND-14-1',
    orderId: 'ORD-250512-00082',
    customerName: 'Apex Machinery & Tools Corp',
    customerType: 'Industry',
    materialName: 'Machined Steel Offcuts',
    materialCondition: 'Clean',
    quantity: '500 KG',
    weightNum: 500,
    image: '/scrap-quality-steel.png',
    address: '8, Padi High Street, Padi, Chennai – 600050',
    pickupDate: '14 May 2025',
    pickupTime: '09:00 AM – 11:30 AM',
    area: 'Padi',
    cx: 700,
    cy: 215,
    status: 'upcoming',
    vehicleRequired: '14ft Open Body Truck',
    weighbridgeType: 'Padi Commercial Weighbridge',
    gateEntry: 'Gate 2 Machinery Bay',
  },
  {
    id: 'HH-14-1',
    orderId: 'ORD-250512-00080',
    customerName: 'Priya Sundaram',
    customerType: 'Individual',
    materialName: 'Newspapers & Textbook Paper',
    materialCondition: 'Clean',
    quantity: '85 KG',
    weightNum: 85,
    image: '/scrap-cardboard.png',
    address: 'Flat 3B, Sunshine Apartments, T. Nagar, Chennai – 600017',
    pickupDate: '14 May 2025',
    pickupTime: '11:00 AM – 01:00 PM',
    area: 'T. Nagar',
    cx: 750,
    cy: 380,
    status: 'upcoming',
  },
];

const AVAILABLE_DATES = [
  '16 May 2025',
  '13 May 2025',
  '14 May 2025',
  '15 May 2025',
  '17 May 2025',
];

export default function MerchantRide() {
  const [activeTab, setActiveTab] = useState<'Household' | 'Industry'>('Industry');
  const [selectedDate, setSelectedDate] = useState('16 May 2025');
  const [allOrders, setAllOrders] = useState<ConfirmedRideOrder[]>(MASTER_SCHEDULED_ORDERS);

  // Household Route State
  const [isHouseholdRideActive, setIsHouseholdRideActive] = useState(false);
  const [selectedHouseholdStop, setSelectedHouseholdStop] = useState<ConfirmedRideOrder | null>(null);
  const [householdOptimized, setHouseholdOptimized] = useState(false);

  // Industry Single-Trip Selection State
  const [selectedIndustryOrder, setSelectedIndustryOrder] = useState<ConfirmedRideOrder | null>(null);

  // Map Controls & Modal
  const [zoomLevel, setZoomLevel] = useState(1);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [completingStop, setCompletingStop] = useState<ConfirmedRideOrder | null>(null);
  const [otpInput, setOtpInput] = useState('');
  const [measuredWeight, setMeasuredWeight] = useState('');

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  // Filter orders by date & active tab
  const activeDayOrders = useMemo(() => {
    return allOrders.filter(
      (o) =>
        o.pickupDate === selectedDate &&
        (activeTab === 'Household' ? o.customerType === 'Individual' : o.customerType === 'Industry')
    );
  }, [allOrders, selectedDate, activeTab]);

  // Counts
  const totalCount = activeDayOrders.length;
  const completedCount = activeDayOrders.filter((o) => o.status === 'completed').length;
  const totalWeight = activeDayOrders.reduce((sum, o) => sum + o.weightNum, 0);
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Household estimated distance
  const householdEstKm = (totalCount * 9.5 + (householdOptimized ? -3.2 : 0)).toFixed(1);

  // Active industry destination fallback to first if none selected
  const activeIndustryDestination = useMemo(() => {
    if (activeTab !== 'Industry') return null;
    if (selectedIndustryOrder && activeDayOrders.some((o) => o.id === selectedIndustryOrder.id)) {
      return activeDayOrders.find((o) => o.id === selectedIndustryOrder.id) || null;
    }
    return activeDayOrders[0] || null;
  }, [activeTab, selectedIndustryOrder, activeDayOrders]);

  // 1. Household: Start Multi-stop Ride
  const handleStartHouseholdRide = () => {
    if (activeDayOrders.length === 0) return;
    setIsHouseholdRideActive(true);

    // Make first uncompleted stop en-route
    setAllOrders((prev) => {
      let markedFirst = false;
      return prev.map((o) => {
        if (o.pickupDate === selectedDate && o.customerType === 'Individual' && o.status !== 'completed' && !markedFirst) {
          markedFirst = true;
          return { ...o, status: 'en-route' };
        }
        return o;
      });
    });

    triggerToast(`🚀 Household Route Started! Heading to Stop #1 (${activeDayOrders[0].area})`);
  };

  // 2. Household: Optimize Multi-stop Route
  const handleOptimizeHouseholdRoute = () => {
    if (activeDayOrders.length === 0) return;
    setHouseholdOptimized(true);

    setAllOrders((prev) => {
      const nonMatching = prev.filter(
        (o) => !(o.pickupDate === selectedDate && o.customerType === 'Individual')
      );
      const matching = prev.filter(
        (o) => o.pickupDate === selectedDate && o.customerType === 'Individual'
      );
      const sorted = [...matching].sort((a, b) => a.cx - b.cx);
      return [...nonMatching, ...sorted];
    });

    triggerToast('✨ Household route optimized for shortest transit time and fuel efficiency!');
  };

  // 3. Industry: Select Single Trip Destination
  const handleSelectIndustryDestination = (order: ConfirmedRideOrder) => {
    setSelectedIndustryOrder(order);
    setAllOrders((prev) =>
      prev.map((o) => {
        if (o.pickupDate === selectedDate && o.customerType === 'Industry') {
          if (o.id === order.id && o.status !== 'completed') {
            return { ...o, status: 'en-route' };
          }
          if (o.status === 'en-route') {
            return { ...o, status: 'upcoming' };
          }
        }
        return o;
      })
    );
    triggerToast(`🚚 Set destination to: ${order.customerName} (${order.area})`);
  };

  // 4. Open OTP / Complete Modal
  const handleOpenCompleteModal = (order: ConfirmedRideOrder) => {
    setCompletingStop(order);
    setMeasuredWeight(order.weightNum.toString());
    setOtpInput('');
  };

  // 5. Confirm OTP and Finalize
  const handleConfirmCompletion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!completingStop) return;
    if (otpInput.length < 4) {
      triggerToast('⚠️ Please enter the 4-digit customer pickup OTP.');
      return;
    }

    const currentCompletedId = completingStop.id;

    setAllOrders((prev) => {
      let setNextEnRoute = false;
      return prev.map((o) => {
        if (o.id === currentCompletedId) {
          return { ...o, status: 'completed' };
        }
        // If household route active, advance next stop
        if (
          activeTab === 'Household' &&
          o.pickupDate === selectedDate &&
          o.customerType === 'Individual' &&
          o.status === 'upcoming' &&
          !setNextEnRoute
        ) {
          setNextEnRoute = true;
          return { ...o, status: 'en-route' };
        }
        return o;
      });
    });

    triggerToast(`✓ Pickup complete for ${completingStop.customerName}! Verified weight: ${measuredWeight} KG.`);
    setCompletingStop(null);
    setSelectedHouseholdStop(null);
  };

  return (
    <div className={styles.pageWrapper}>
      {/* Toast Banner */}
      {toastMessage && (
        <div className={styles.toastBanner}>
          <CheckCircle2 size={18} />
          <span>{toastMessage}</span>
        </div>
      )}

      <main className={styles.mainContainer}>
        {/* ================================================================
            TOP TABS: Industry Pickups vs Household Route
           ================================================================ */}
        <div className={styles.categoryTabsBar}>
          <button
            type="button"
            className={`${styles.categoryTabBtn} ${activeTab === 'Industry' ? styles.categoryTabActive : ''}`}
            onClick={() => {
              setActiveTab('Industry');
              setSelectedHouseholdStop(null);
            }}
          >
            <Building size={16} />
            <span>Industry Pickups</span>
            <span className={styles.tabCounterBadge}>
              {allOrders.filter((o) => o.pickupDate === selectedDate && o.customerType === 'Industry').length}
            </span>
          </button>

          <button
            type="button"
            className={`${styles.categoryTabBtn} ${activeTab === 'Household' ? styles.categoryTabActive : ''}`}
            onClick={() => {
              setActiveTab('Household');
              setSelectedHouseholdStop(null);
            }}
          >
            <Home size={16} />
            <span>Household Route</span>
            <span className={styles.tabCounterBadge}>
              {allOrders.filter((o) => o.pickupDate === selectedDate && o.customerType === 'Individual').length}
            </span>
          </button>
        </div>

        {/* 2-Column Layout: Main Pickups Area (Left) + Today's Pickup Data Sidebar (Right) */}
        <div className={styles.rideLayoutGrid}>
          {/* ================================================================
              LEFT COLUMN: MAIN CONTENT (Pickups List / Route Map)
             ================================================================ */}
          <section className={styles.mainContentCol}>
            {/* ============================================================
                TAB 1: INDUSTRY PICKUPS (DEFAULT)
               ============================================================ */}
            {activeTab === 'Industry' && (
              <>
                <div className={styles.mapHeaderRow}>
                  <div className={styles.mapTitleGroup}>
                    <h1 className={styles.mapTitle}>Industry Scheduled Pickups</h1>
                    <p className={styles.mapSubtitle}>
                      Dedicated factory dispatches for <strong>{selectedDate}</strong>. Select an order to navigate.
                    </p>
                  </div>
                </div>

                {/* Empty State vs Industry Pickups List & Single Map */}
                {totalCount === 0 ? (
                  <div className={styles.emptyScheduleCard}>
                    <div className={styles.emptyIconCircle}>
                      <Building size={36} className={styles.emptyIcon} />
                    </div>
                    <h2 className={styles.emptyTitle}>No industry pickups scheduled for {selectedDate}</h2>
                    <p className={styles.emptySubtext}>
                      You have zero confirmed industrial scrap bookings on this date. Check active quotes or respond to B2B bulk requests.
                    </p>
                    <div className={styles.emptyActionRow}>
                      <Link to="/requests" className={styles.emptyCtaPrimary}>
                        <span>View Industry Requests</span>
                        <ArrowRight size={15} />
                      </Link>
                      <Link to="/orders" className={styles.emptyCtaSecondary}>
                        <span>View All Orders</span>
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className={styles.industryViewLayout}>
                    {/* List of Industry Orders for this date */}
                    <div className={styles.industryCardsList}>
                      {activeDayOrders.map((order) => {
                        const isSelected = activeIndustryDestination?.id === order.id;
                        const isDone = order.status === 'completed';

                        return (
                          <div
                            key={order.id}
                            className={`${styles.industryCardItem} ${isSelected ? styles.industryCardSelected : ''} ${
                              isDone ? styles.industryCardCompleted : ''
                            }`}
                          >
                            <div className={styles.industryCardTopRow}>
                              <div className={styles.industryCustomerGroup}>
                                <span className={styles.industryTag}>Industry Pickup</span>
                                <h3 className={styles.industryCustomerTitle}>{order.customerName}</h3>
                                <span className={styles.industryOrderId}>{order.orderId}</span>
                              </div>
                              <span
                                className={`${styles.stopStatusTag} ${
                                  isDone
                                    ? styles.tagGreen
                                    : order.status === 'en-route'
                                    ? styles.tagBlue
                                    : styles.tagMuted
                                }`}
                              >
                                {isDone ? 'Completed' : order.status === 'en-route' ? 'En Route' : 'Upcoming'}
                              </span>
                            </div>

                            <div className={styles.industrySpecsRow}>
                              <div className={styles.industrySpecCol}>
                                <span className={styles.industrySpecLabel}>MATERIAL &amp; VOLUME</span>
                                <span className={styles.industrySpecValue}>
                                  {order.materialName} • {order.quantity} ({order.materialCondition})
                                </span>
                              </div>
                              <div className={styles.industrySpecCol}>
                                <span className={styles.industrySpecLabel}>SCHEDULED TIME</span>
                                <span className={styles.industrySpecValue}>
                                  {order.pickupDate} • {order.pickupTime}
                                </span>
                              </div>
                            </div>

                            <div className={styles.industryAddressRow}>
                              <MapPin size={15} className={styles.industryAddressIcon} />
                              <span>{order.address}</span>
                            </div>

                            {/* Logistics Badges */}
                            <div className={styles.logisticsTagsRow}>
                              {order.vehicleRequired && (
                                <span className={styles.logisticsTag}>
                                  <Truck size={12} /> {order.vehicleRequired}
                                </span>
                              )}
                              {order.weighbridgeType && (
                                <span className={styles.logisticsTag}>
                                  <Scale size={12} /> {order.weighbridgeType}
                                </span>
                              )}
                              {order.gateEntry && (
                                <span className={styles.logisticsTag}>
                                  🚪 {order.gateEntry}
                                </span>
                              )}
                            </div>

                            <div className={styles.industryCardActionRow}>
                              {isDone ? (
                                <div className={styles.completedTagRow}>
                                  <CheckCircle2 size={16} />
                                  <span>Pickup &amp; Weighing Finished</span>
                                </div>
                              ) : isSelected ? (
                                <button
                                  type="button"
                                  className={styles.activeDestinationBtn}
                                  onClick={() => handleOpenCompleteModal(order)}
                                >
                                  <CheckSquare size={15} />
                                  <span>Mark as Arrived &amp; Complete OTP</span>
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  className={styles.selectDestinationBtn}
                                  onClick={() => handleSelectIndustryDestination(order)}
                                >
                                  <Navigation size={14} />
                                  <span>Select as Current Destination</span>
                                </button>
                              )}

                              <Link to="/orders" className={styles.industryViewOrderLink}>
                                <span>View Full Order →</span>
                              </Link>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Single Destination Focused Map */}
                    {activeIndustryDestination && (
                      <div className={styles.singleDestinationMapSection}>
                        <div className={styles.singleMapHeader}>
                          <div className={styles.singleMapTitle}>
                            <span>Focused Trip: </span>
                            <strong>{activeIndustryDestination.customerName}</strong>
                            <span className={styles.singleMapAreaBadge}>({activeIndustryDestination.area})</span>
                          </div>
                          <span className={styles.singleMapDistance}>Direct Route: ~18.4 KM (35 mins)</span>
                        </div>

                        <div className={styles.mapContainer}>
                          <svg
                            viewBox="0 0 1000 700"
                            className={styles.mapSvg}
                            style={{
                              transform: `scale(${zoomLevel})`,
                              transformOrigin: 'center center',
                              transition: 'transform 0.2s ease',
                            }}
                          >
                            <defs>
                              <linearGradient id="bayGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#dbeafe" stopOpacity="0.4" />
                                <stop offset="100%" stopColor="#bfdbfe" stopOpacity="0.9" />
                              </linearGradient>

                              <linearGradient id="industryRouteGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#ea580c" />
                                <stop offset="100%" stopColor="#f59e0b" />
                              </linearGradient>

                              <filter id="markerShadow" x="-20%" y="-20%" width="140%" height="140%">
                                <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#0f172a" floodOpacity="0.3" />
                              </filter>
                            </defs>

                            <rect width="1000" height="700" fill="#f8fafc" />
                            <path
                              d="M 860 0 C 880 150, 895 300, 850 450 C 820 540, 840 620, 830 700 L 1000 700 L 1000 0 Z"
                              fill="url(#bayGradient)"
                            />

                            {/* Arterial Road Grid */}
                            <g stroke="#e2e8f0" strokeWidth="2" fill="none">
                              <line x1="550" y1="0" x2="550" y2="700" strokeWidth="3" />
                              <line x1="0" y1="360" x2="860" y2="360" strokeWidth="3" />
                              <circle cx="695" cy="420" r="160" stroke="#cbd5e1" strokeWidth="1.5" />
                              <circle cx="550" cy="240" r="120" stroke="#cbd5e1" strokeWidth="1.5" />
                            </g>

                            {/* Direct Line to Single Factory */}
                            <path
                              d={`M 550 190 L ${activeIndustryDestination.cx} ${activeIndustryDestination.cy}`}
                              stroke="url(#industryRouteGradient)"
                              strokeWidth="5"
                              strokeLinecap="round"
                              fill="none"
                              strokeDasharray="6 6"
                            />

                            {/* Single Destination Marker */}
                            <g
                              transform={`translate(${activeIndustryDestination.cx}, ${activeIndustryDestination.cy})`}
                              filter="url(#markerShadow)"
                            >
                              <circle
                                r="28"
                                fill="none"
                                stroke="#ea580c"
                                strokeWidth="3"
                                opacity="0.8"
                                className={styles.svgPulseRing}
                              />
                              <circle r="18" fill="#ea580c" stroke="#ffffff" strokeWidth="3" />
                              <text y="5" fontSize="11" fontWeight="bold" fill="#ffffff" textAnchor="middle">
                                🏭
                              </text>
                              <rect x="-60" y="24" width="120" height="22" rx="6" fill="#0f172a" opacity="0.95" />
                              <text y="39" fontSize="10" fontWeight="bold" fill="#ffffff" textAnchor="middle">
                                {activeIndustryDestination.customerName.split(' ')[0]}
                              </text>
                            </g>

                            {/* Base Hub */}
                            <g filter="url(#markerShadow)" transform="translate(550, 190)">
                              <circle r="16" fill="#2563eb" stroke="#ffffff" strokeWidth="3" />
                              <path d="M -6 3 L 0 -5 L 6 3 L 4 3 L 4 7 L -4 7 L -4 3 Z" fill="#ffffff" />
                              <rect x="20" y="-12" width="80" height="24" rx="12" fill="#0f172a" opacity="0.95" />
                              <text x="60" y="4" fontSize="10" fontWeight="bold" fill="#ffffff" textAnchor="middle">
                                Base Hub
                              </text>
                            </g>
                          </svg>

                          <div className={styles.mapControls}>
                            <button
                              type="button"
                              className={styles.locateBtn}
                              onClick={() => setZoomLevel(1)}
                              title="Center"
                            >
                              <Compass size={17} />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}

            {/* ============================================================
                TAB 2: HOUSEHOLD MULTI-STOP ROUTE
               ============================================================ */}
            {activeTab === 'Household' && (
              <>
                <div className={styles.mapHeaderRow}>
                  <div className={styles.mapTitleGroup}>
                    <h1 className={styles.mapTitle}>Household Multi-Stop Loop</h1>
                    <p className={styles.mapSubtitle}>
                      Auto-routed doorstep collections for <strong>{selectedDate}</strong>.
                    </p>
                  </div>

                  <div className={styles.mapActions}>
                    <button
                      type="button"
                      className={`${styles.startRideBtn} ${totalCount === 0 ? styles.btnDisabled : ''}`}
                      disabled={totalCount === 0}
                      onClick={handleStartHouseholdRide}
                      title="Start live navigation and sequential progress"
                    >
                      <Play size={15} fill="#0f172a" />
                      <span>{isHouseholdRideActive ? 'Loop Active' : 'Start Ride'}</span>
                    </button>

                    <button
                      type="button"
                      className={`${styles.optimizeBtn} ${totalCount === 0 ? styles.btnDisabled : ''}`}
                      disabled={totalCount === 0}
                      onClick={handleOptimizeHouseholdRoute}
                      title="Shuffle and optimize stops by shortest distance"
                    >
                      <Sparkles size={15} color="#f59e0b" />
                      <span>{householdOptimized ? 'Route Optimized ✓' : 'Optimize Route'}</span>
                    </button>

                    <button
                      type="button"
                      className={styles.fullscreenBtn}
                      onClick={() => setZoomLevel(1)}
                      title="Reset Zoom"
                    >
                      <Maximize2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Empty State vs Multi-Stop Map */}
                {totalCount === 0 ? (
                  <div className={styles.emptyScheduleCard}>
                    <div className={styles.emptyIconCircle}>
                      <Home size={36} className={styles.emptyIcon} />
                    </div>
                    <h2 className={styles.emptyTitle}>No household pickups scheduled for {selectedDate}</h2>
                    <p className={styles.emptySubtext}>
                      You have zero confirmed household pickups on this date. Review incoming home scrap leads to build an optimized pickup loop.
                    </p>
                    <div className={styles.emptyActionRow}>
                      <Link to="/requests" className={styles.emptyCtaPrimary}>
                        <span>View New Requests</span>
                        <ArrowRight size={15} />
                      </Link>
                      <Link to="/orders" className={styles.emptyCtaSecondary}>
                        <span>View All Orders</span>
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className={styles.mapContainer}>
                    <svg
                      viewBox="0 0 1000 700"
                      className={styles.mapSvg}
                      style={{
                        transform: `scale(${zoomLevel})`,
                        transformOrigin: 'center center',
                        transition: 'transform 0.2s ease',
                      }}
                    >
                      <defs>
                        <linearGradient id="bayGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#dbeafe" stopOpacity="0.4" />
                          <stop offset="100%" stopColor="#bfdbfe" stopOpacity="0.9" />
                        </linearGradient>

                        <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#2563eb" />
                          <stop offset="100%" stopColor="#1d4ed8" />
                        </linearGradient>

                        <filter id="markerShadow" x="-20%" y="-20%" width="140%" height="140%">
                          <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#0f172a" floodOpacity="0.3" />
                        </filter>
                      </defs>

                      <rect width="1000" height="700" fill="#f8fafc" />
                      <path
                        d="M 860 0 C 880 150, 895 300, 850 450 C 820 540, 840 620, 830 700 L 1000 700 L 1000 0 Z"
                        fill="url(#bayGradient)"
                      />
                      <text x="910" y="320" fontSize="13" fontWeight="800" fill="#60a5fa" opacity="0.8" letterSpacing="0.1em">
                        BAY OF BENGAL
                      </text>

                      {/* Road Grid */}
                      <g stroke="#e2e8f0" strokeWidth="2" fill="none">
                        <line x1="550" y1="0" x2="550" y2="700" strokeWidth="3" />
                        <line x1="0" y1="360" x2="860" y2="360" strokeWidth="3" />
                        <circle cx="695" cy="420" r="160" stroke="#cbd5e1" strokeWidth="1.5" />
                        <circle cx="550" cy="240" r="120" stroke="#cbd5e1" strokeWidth="1.5" />
                      </g>

                      {/* Multi-Stop Planned Route */}
                      {activeDayOrders.length > 0 && (
                        <path
                          d={`M 550 190 ${activeDayOrders.map((s) => `L ${s.cx} ${s.cy}`).join(' ')}`}
                          stroke="url(#routeGradient)"
                          strokeWidth="4.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          fill="none"
                        />
                      )}

                      {/* Numbered Household Pins */}
                      {activeDayOrders.map((stop, idx) => {
                        const isSelected = selectedHouseholdStop?.id === stop.id;
                        const isEnRoute = stop.status === 'en-route';
                        const isDone = stop.status === 'completed';

                        return (
                          <g
                            key={stop.id}
                            transform={`translate(${stop.cx}, ${stop.cy})`}
                            onClick={() => setSelectedHouseholdStop(stop)}
                            style={{ cursor: 'pointer' }}
                            filter="url(#markerShadow)"
                          >
                            {isEnRoute && (
                              <circle
                                r="24"
                                fill="none"
                                stroke="#2563eb"
                                strokeWidth="3"
                                opacity="0.8"
                                className={styles.svgPulseRing}
                              />
                            )}

                            <circle
                              r={isSelected ? '18' : '15'}
                              fill={isDone ? '#16a34a' : isEnRoute ? '#2563eb' : '#0f172a'}
                              stroke={isSelected ? '#fbc21a' : '#ffffff'}
                              strokeWidth={isSelected ? '3.5' : '2.5'}
                            />

                            <text
                              y="4"
                              fontSize={isDone ? '12' : '11'}
                              fontWeight="bold"
                              fill="#ffffff"
                              textAnchor="middle"
                            >
                              {isDone ? '✓' : idx + 1}
                            </text>

                            <rect
                              x="-45"
                              y="20"
                              width="90"
                              height="20"
                              rx="5"
                              fill="#0f172a"
                              opacity="0.9"
                            />
                            <text
                              y="34"
                              fontSize="9"
                              fontWeight="700"
                              fill="#ffffff"
                              textAnchor="middle"
                            >
                              {stop.area}
                            </text>
                          </g>
                        );
                      })}

                      {/* Base Hub */}
                      <g filter="url(#markerShadow)" transform="translate(550, 190)">
                        <circle r="16" fill="#2563eb" stroke="#ffffff" strokeWidth="3" />
                        <path d="M -6 3 L 0 -5 L 6 3 L 4 3 L 4 7 L -4 7 L -4 3 Z" fill="#ffffff" />
                        <rect x="20" y="-12" width="80" height="24" rx="12" fill="#0f172a" opacity="0.95" />
                        <text x="60" y="4" fontSize="10" fontWeight="bold" fill="#ffffff" textAnchor="middle">
                          Base Hub
                        </text>
                      </g>
                    </svg>

                    {/* Map Controls */}
                    <div className={styles.mapControls}>
                      <div className={styles.zoomButtonGroup}>
                        <button
                          type="button"
                          className={styles.zoomBtn}
                          onClick={() => setZoomLevel((z) => Math.min(z + 0.15, 1.6))}
                          title="Zoom in"
                        >
                          +
                        </button>
                        <button
                          type="button"
                          className={styles.zoomBtn}
                          onClick={() => setZoomLevel((z) => Math.max(z - 0.15, 0.8))}
                          title="Zoom out"
                        >
                          −
                        </button>
                      </div>
                      <button
                        type="button"
                        className={styles.locateBtn}
                        onClick={() => setZoomLevel(1)}
                        title="Center view"
                      >
                        <Compass size={17} />
                      </button>
                    </div>
                  </div>
                )}

                {/* Selected Household Stop Popover */}
                {selectedHouseholdStop && (
                  <div className={styles.stopDetailCard}>
                    <div className={styles.stopDetailHeader}>
                      <div className={styles.stopDetailTitleGroup}>
                        <span className={styles.stopDetailBadge}>
                          {selectedHouseholdStop.status === 'completed'
                            ? '✓ DOORSTEP PICKUP COMPLETED'
                            : selectedHouseholdStop.status === 'en-route'
                            ? '📍 CURRENT EN ROUTE STOP'
                            : 'UPCOMING STOP'}
                        </span>
                        <h3 className={styles.stopDetailCustomer}>{selectedHouseholdStop.customerName}</h3>
                        <span className={styles.stopDetailOrderId}>Order ID: {selectedHouseholdStop.orderId}</span>
                      </div>
                      <button
                        type="button"
                        className={styles.stopDetailCloseBtn}
                        onClick={() => setSelectedHouseholdStop(null)}
                        aria-label="Close"
                      >
                        <X size={18} />
                      </button>
                    </div>

                    <div className={styles.stopDetailGrid}>
                      <div className={styles.stopDetailItem}>
                        <span className={styles.stopDetailLabel}>Material &amp; Quantity</span>
                        <span className={styles.stopDetailValue}>
                          {selectedHouseholdStop.materialName} ({selectedHouseholdStop.quantity}) • {selectedHouseholdStop.materialCondition}
                        </span>
                      </div>

                      <div className={styles.stopDetailItem}>
                        <span className={styles.stopDetailLabel}>Pickup Window</span>
                        <span className={styles.stopDetailValue}>
                          {selectedHouseholdStop.pickupDate} • {selectedHouseholdStop.pickupTime}
                        </span>
                      </div>

                      <div className={styles.stopDetailItemFull}>
                        <span className={styles.stopDetailLabel}>Address</span>
                        <span className={styles.stopDetailValue}>📍 {selectedHouseholdStop.address}</span>
                      </div>
                    </div>

                    <div className={styles.stopDetailActionsRow}>
                      <Link to="/orders" className={styles.viewOrderLinkBtn}>
                        <span>View Full Order →</span>
                      </Link>

                      {selectedHouseholdStop.status !== 'completed' && (
                        <button
                          type="button"
                          className={styles.completePickupBtn}
                          onClick={() => handleOpenCompleteModal(selectedHouseholdStop)}
                        >
                          <CheckCircle2 size={15} />
                          <span>Mark as Arrived &amp; Complete</span>
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Below Map: Two Summary Cards */}
            <div className={styles.bottomCardsGrid}>
              <div className={styles.summaryCard}>
                <h3 className={styles.cardTitle}>
                  {activeTab === 'Household' ? 'Household Progress' : 'Industry Completion'}
                </h3>
                <div className={styles.progressSection}>
                  <div className={styles.progressHeader}>
                    <span className={styles.progressLabel}>
                      {activeTab === 'Household' ? 'Route Loop Progress' : 'Confirmed Pickups Finished'}
                    </span>
                    <span className={styles.progressValue}>
                      {completedCount} of {totalCount} Completed ({progressPercent}%)
                    </span>
                  </div>
                  <div className={styles.progressBarTrack}>
                    <div className={styles.progressBarFill} style={{ width: `${progressPercent}%` }} />
                  </div>
                </div>
              </div>

              <div className={styles.summaryCard}>
                <h3 className={styles.cardTitle}>Dispatcher Verification Protocol</h3>
                <div className={styles.overviewList}>
                  <div className={styles.overviewRow}>
                    <div className={styles.overviewLeft}>
                      <Scale size={16} color="#16a34a" />
                      <span>Digital Calibrated Scale Record</span>
                    </div>
                    <span className={styles.overviewTag}>Required</span>
                  </div>
                  <div className={styles.overviewRow}>
                    <div className={styles.overviewLeft}>
                      <KeyRound size={16} color="#2563eb" />
                      <span>Customer 4-Digit Security OTP</span>
                    </div>
                    <span className={styles.overviewTag}>Required</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Banner */}
            <div className={styles.bottomBanner}>
              <div className={styles.bannerIconCircle}>
                <Navigation size={22} />
              </div>
              <div className={styles.bannerTextCol}>
                <div className={styles.bannerTitle}>
                  {activeTab === 'Household'
                    ? 'Optimized Multi-Stop Loop'
                    : 'Dedicated Point-to-Point Industrial Dispatches'}
                </div>
                <div className={styles.bannerSub}>
                  {activeTab === 'Household'
                    ? 'Doorstep pickups are automatically grouped and sequenced for maximum fuel efficiency.'
                    : 'Commercial factory pickups are treated as separate single runs with weighbridge checkpoints.'}
                </div>
              </div>
            </div>

            {/* Trust Footer */}
            <footer className={styles.trustFooter}>
              <ShieldCheck size={16} className={styles.trustIcon} />
              <span>Protected by Scrap Anna verified digital weighing and real-time OTP confirmation.</span>
            </footer>
          </section>

          {/* ================================================================
              RIGHT COLUMN: TODAY'S PICKUP DATA SIDEBAR (~310px)
             ================================================================ */}
          <aside className={styles.sidebarCard}>
            <div className={styles.sidebarHeaderRow}>
              <h2 className={styles.sidebarTitle}>
                {activeTab === 'Household' ? "Today's Route" : "Today's Industry Pickups"}
              </h2>
              <span className={isHouseholdRideActive ? styles.activeBadge : styles.plannedBadge}>
                {activeTab === 'Household'
                  ? isHouseholdRideActive
                    ? 'Route Active'
                    : 'Planned Loop'
                  : 'Point-to-Point'}
              </span>
            </div>

            {/* Date Selector */}
            <div className={styles.dateSelectorWrap}>
              <label className={styles.dateLabel}>Schedule Date</label>
              <div className={styles.selectWrapper}>
                <Calendar size={15} className={styles.calendarIcon} />
                <select
                  value={selectedDate}
                  onChange={(e) => {
                    setSelectedDate(e.target.value);
                    setSelectedHouseholdStop(null);
                    setSelectedIndustryOrder(null);
                    setHouseholdOptimized(false);
                  }}
                  className={styles.dateSelect}
                >
                  {AVAILABLE_DATES.map((date) => (
                    <option key={date} value={date}>
                      {date}
                    </option>
                  ))}
                </select>
                <ChevronDown size={14} className={styles.selectChevron} />
              </div>
            </div>

            {/* Dynamic Metric Rows */}
            <div className={styles.statRowsList}>
              <div className={styles.statRowItem}>
                <div className={`${styles.statIconCircle} ${styles.iconBlue}`}>
                  <MapPin size={17} />
                </div>
                <div className={styles.statRowContent}>
                  <span className={styles.statRowLabel}>
                    {activeTab === 'Household' ? 'Total Stops' : 'Total Industry Pickups'}
                  </span>
                  <span className={styles.statRowValue}>{totalCount}</span>
                </div>
              </div>

              <div className={styles.statRowItem}>
                <div className={`${styles.statIconCircle} ${styles.iconGreen}`}>
                  <Navigation size={16} />
                </div>
                <div className={styles.statRowContent}>
                  <span className={styles.statRowLabel}>
                    {activeTab === 'Household' ? 'Loop Distance' : 'Direct Distance'}
                  </span>
                  <span className={styles.statRowValue}>
                    {totalCount > 0 ? (activeTab === 'Household' ? `${householdEstKm} KM` : '18.4 KM / trip') : '0 KM'}
                  </span>
                </div>
              </div>

              <div className={styles.statRowItem}>
                <div className={`${styles.statIconCircle} ${styles.iconOrange}`}>
                  <Package size={16} />
                </div>
                <div className={styles.statRowContent}>
                  <span className={styles.statRowLabel}>Expected Volume</span>
                  <span className={styles.statRowValue}>{totalWeight} KG</span>
                </div>
              </div>

              <div className={styles.statRowItem}>
                <div className={`${styles.statIconCircle} ${styles.iconPurple}`}>
                  <Flag size={16} />
                </div>
                <div className={styles.statRowContent}>
                  <span className={styles.statRowLabel}>Completed</span>
                  <span className={styles.statRowValue}>
                    {completedCount} / {totalCount}
                  </span>
                </div>
              </div>
            </div>

            <div className={styles.divider} />

            {/* Tab Specific Sidebar Sequence */}
            {activeTab === 'Household' ? (
              <div className={styles.stopsSidebarSection}>
                <h3 className={styles.stopsSidebarTitle}>Household Stops Sequence</h3>
                {activeDayOrders.length === 0 ? (
                  <p className={styles.noStopsText}>No household pickups for this date.</p>
                ) : (
                  <div className={styles.stopPillsList}>
                    {activeDayOrders.map((stop, idx) => (
                      <div
                        key={stop.id}
                        className={`${styles.stopPillItem} ${
                          selectedHouseholdStop?.id === stop.id ? styles.stopPillActive : ''
                        } ${stop.status === 'en-route' ? styles.stopPillEnRoute : ''} ${
                          stop.status === 'completed' ? styles.stopPillDone : ''
                        }`}
                        onClick={() => setSelectedHouseholdStop(stop)}
                      >
                        <div className={styles.stopPillNum}>
                          {stop.status === 'completed' ? '✓' : idx + 1}
                        </div>
                        <div className={styles.stopPillText}>
                          <strong className={styles.stopPillName}>{stop.customerName}</strong>
                          <span className={styles.stopPillArea}>{stop.area} • {stop.quantity}</span>
                        </div>
                        <span
                          className={`${styles.stopStatusTag} ${
                            stop.status === 'completed'
                              ? styles.tagGreen
                              : stop.status === 'en-route'
                              ? styles.tagBlue
                              : styles.tagMuted
                          }`}
                        >
                          {stop.status === 'en-route'
                            ? 'En Route'
                            : stop.status === 'completed'
                            ? 'Done'
                            : 'Upcoming'}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className={styles.stopsSidebarSection}>
                <h3 className={styles.stopsSidebarTitle}>Operational Notes</h3>
                <div className={styles.industrySidebarNote}>
                  <AlertCircle size={15} color="#ea580c" />
                  <span>
                    Industry pickups are direct dedicated runs requiring weighbridge slips and specific vehicles. Pick one destination at a time.
                  </span>
                </div>
              </div>
            )}

            <div className={styles.divider} />

            {/* Legend Box */}
            <div className={styles.legendBox}>
              <div className={styles.legendItem}>
                <div className={styles.legendDotBlue} />
                <span>Merchant Base Hub (Guindy)</span>
              </div>
              <div className={styles.legendItem}>
                <div className={styles.legendDotGreen} />
                <span>{activeTab === 'Household' ? 'Household Doorstep' : 'Industrial Factory'}</span>
              </div>
              <div className={styles.legendItem}>
                <div className={styles.legendDotPulsing} />
                <span>Current Destination (En Route)</span>
              </div>
              <div className={styles.legendItem}>
                <div className={styles.legendDotDone} />
                <span>Completed Pickup</span>
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* ================================================================
          OTP & DIGITAL WEIGHING VERIFICATION MODAL
         ================================================================ */}
      {completingStop && (
        <div
          className={styles.modalOverlay}
          onClick={() => setCompletingStop(null)}
        >
          <div
            className={styles.modalCard}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <div className={styles.modalHeaderTitleGroup}>
                <span className={styles.modalPretitle}>
                  {completingStop.customerType === 'Industry' ? 'INDUSTRIAL PICKUP' : 'HOUSEHOLD DOORSTEP'} • {completingStop.orderId}
                </span>
                <h2 className={styles.modalTitle}>Confirm Weight &amp; OTP</h2>
              </div>
              <button
                type="button"
                className={styles.modalCloseBtn}
                onClick={() => setCompletingStop(null)}
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleConfirmCompletion} className={styles.modalForm}>
              <div className={styles.modalCustomerBox}>
                <div className={styles.modalCustomerName}>{completingStop.customerName}</div>
                <div className={styles.modalCustomerSub}>
                  {completingStop.materialName} • {completingStop.quantity}
                </div>
                <div className={styles.modalCustomerAddress}>📍 {completingStop.address}</div>
              </div>

              {/* 1. Measured Weight Input */}
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  <Scale size={15} />
                  <span>Confirmed Scale / Weighbridge Reading (KG)</span>
                </label>
                <input
                  type="number"
                  min="1"
                  step="any"
                  value={measuredWeight}
                  onChange={(e) => setMeasuredWeight(e.target.value)}
                  className={styles.formInput}
                  required
                />
                <span className={styles.formHelperText}>
                  Enter the verified digital reading shown on your scale or weighbridge slip.
                </span>
              </div>

              {/* 2. Customer OTP */}
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  <KeyRound size={15} />
                  <span>Customer 4-Digit Pickup OTP</span>
                </label>
                <input
                  type="text"
                  maxLength={4}
                  placeholder="e.g. 4821"
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value)}
                  className={styles.formInputOtp}
                  required
                  autoFocus
                />
                <span className={styles.formHelperText}>
                  Ask the customer for the OTP sent to their registered mobile number.
                </span>
              </div>

              <div className={styles.modalActionsRow}>
                <button
                  type="button"
                  className={styles.modalCancelBtn}
                  onClick={() => setCompletingStop(null)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={styles.modalSubmitBtn}
                >
                  <CheckCircle2 size={16} />
                  <span>Verify OTP &amp; Complete Pickup</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
