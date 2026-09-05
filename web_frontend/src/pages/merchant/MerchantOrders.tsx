import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Package,
  CheckCircle2,
  Truck,
  Clock,
  XCircle,
  ChevronDown,
  ChevronRight,
  MapPin,
  Calendar,
  Filter,
  FileText,
  Phone,
  Mail,
  ShieldCheck,
  ArrowRight,
  TrendingUp,
  Download,
  Building,
  Building2,
  User,
  Eye,
  X,
  Compass,
  Scale,
  Receipt,
  Check,
  AlertCircle,
  QrCode,
  Shield,
  FileCheck,
  Navigation,
  Plus,
  Trash2,
  Layers,
  Calculator,
  Percent,
  Printer,
  Search,
  PlayCircle,
  CornerUpLeft,
  Crosshair,
  ExternalLink,
  Car,
  Minus,
} from 'lucide-react';
import { CardImageGallery } from '@/components/cards/CardImageGallery';
import { openMerchantCommissionModal } from '@/services/commissionReminderService';
import { FiClock, FiCheckCircle, FiAlertCircle, FiCopy, FiCheck } from 'react-icons/fi';
import { MdOutlinePayment } from 'react-icons/md';
import { LuIndianRupee, LuWallet, LuShieldCheck } from 'react-icons/lu';
import {
  getOrCreateOrderPayment,
  setOrderPaymentMethod,
  createOrderUpiPaymentIntent,
  markOrderPaymentInitiated,
  submitOrderPaymentUtr,
  confirmOrderCashPayment,
  DEFAULT_MERCHANT_PAYEE_NAME,
  DEFAULT_MERCHANT_UPI_ID,
  type OrderPaymentRecord,
} from '@/services/merchantOrderPaymentService';
import styles from './MerchantOrders.module.css';

export type OrderStatus = 'Pending' | 'Scheduled' | 'Completed' | 'Cancelled';

export interface MarketScrapSubItem {
  id: string;
  name: string;
  defaultRate: number;
  unit: string;
  quality?: string;
}

export interface MarketScrapCategory {
  id: string;
  name: string;
  icon: string;
  items: MarketScrapSubItem[];
}

export const MARKET_SCRAP_CATEGORIES: MarketScrapCategory[] = [
  {
    id: 'CAT_IRON',
    name: 'Iron & Tin',
    icon: '🧲',
    items: [
      { id: 'IRON_001', name: 'Scrap Iron', defaultRate: 42, unit: 'KG', quality: 'HMS 1 & 2 Standard' },
      { id: 'TIN_001', name: 'Tin (Thagram)', defaultRate: 22, unit: 'KG', quality: 'Clean Sorted Sheet' },
    ],
  },
  {
    id: 'CAT_MATERIAL',
    name: 'Metals & Alloys',
    icon: '⚡',
    items: [
      { id: 'COP_001', name: 'Copper Scrap', defaultRate: 720, unit: 'KG', quality: '99.9% Bright Wire & Pipe' },
      { id: 'COP_002', name: 'Burned Copper', defaultRate: 640, unit: 'KG', quality: 'Stripped & Burned Wire' },
      { id: 'ALU_003', name: 'Commercial Aluminium', defaultRate: 165, unit: 'KG', quality: '6063 Extrusions & Profiles' },
      { id: 'ALU_001', name: 'Household Aluminium', defaultRate: 135, unit: 'KG', quality: 'Utensils & Cooking Vessels' },
      { id: 'ALU_002', name: 'MA - Solid Alloy', defaultRate: 185, unit: 'KG', quality: 'Machined Alloy Billets' },
      { id: 'ALU_004', name: 'Bus Body Aluminium', defaultRate: 150, unit: 'KG', quality: 'Chequered Tread Plates' },
      { id: 'BRS_001', name: 'Brass Scrap (Honey)', defaultRate: 490, unit: 'KG', quality: 'Sanitary Valves & Turned Parts' },
      { id: 'STL_001', name: 'Low Quality Steel (MS)', defaultRate: 36, unit: 'KG', quality: 'Angle & Channel Offcuts' },
      { id: 'STL_002', name: 'Quality Steel (SS 304)', defaultRate: 78, unit: 'KG', quality: 'Stainless Steel Sinks & Pipes' },
    ],
  },
  {
    id: 'CAT_PAPER_CARDBOARD',
    name: 'Cardboard & Paper',
    icon: '📦',
    items: [
      { id: 'CRD_001', name: 'Cardboard (Corrugated Box)', defaultRate: 13, unit: 'KG', quality: 'Kraft Packaging Cartons' },
      { id: 'PPR_003', name: 'White Paper (Office A4)', defaultRate: 18, unit: 'KG', quality: 'Clean Document Records' },
      { id: 'PPR_004', name: 'Notebook & Textbooks', defaultRate: 16, unit: 'KG', quality: 'Spiral & Exercise Books' },
      { id: 'PPR_001', name: 'Color Papers & Craft', defaultRate: 14, unit: 'KG', quality: 'Sorted Printing Scrap' },
      { id: 'PPR_002', name: 'Magazines (Glossy)', defaultRate: 15, unit: 'KG', quality: 'Periodicals & Catalogs' },
      { id: 'PPR_005', name: 'Mixed Papers', defaultRate: 12, unit: 'KG', quality: 'Assorted Household Paper' },
    ],
  },
  {
    id: 'CAT_PLASTIC',
    name: 'Plastics',
    icon: '🧴',
    items: [
      { id: 'PLS_001', name: 'Grade Plastic (Crates/PP)', defaultRate: 32, unit: 'KG', quality: 'Heavy Molded Polymers' },
      { id: 'PLS_002', name: 'PET Bottles (Baled)', defaultRate: 25, unit: 'KG', quality: 'Sorted Clear Bottles' },
      { id: 'PLS_005', name: 'PP Sheets (Sunpack)', defaultRate: 28, unit: 'KG', quality: 'Flute Packaging Sheets' },
      { id: 'PLS_007', name: 'Mixed Plastic Scrap', defaultRate: 18, unit: 'KG', quality: 'Containers & Tubs' },
      { id: 'PLS_008', name: 'HPVC Pipes & Fittings', defaultRate: 38, unit: 'KG', quality: 'High Impact Piping' },
      { id: 'PLS_003', name: 'Water Can (20L Jar)', defaultRate: 18, unit: 'CAN', quality: 'Polycarbonate Bubble Cans' },
      { id: 'PLS_004', name: 'Plastic Barrel (200L)', defaultRate: 380, unit: 'PIECE', quality: 'HDPE Chemical Drums' },
      { id: 'PLS_006', name: 'Plastic Pallet (HDPE)', defaultRate: 450, unit: 'PIECE', quality: 'Warehouse Forklift Skids' },
    ],
  },
  {
    id: 'CAT_BATTERY',
    name: 'Batteries',
    icon: '🔋',
    items: [
      { id: 'BAT_001', name: 'Lead Acid Battery', defaultRate: 100, unit: 'KG', quality: 'Automotive & Commercial' },
      { id: 'BAT_002', name: 'Inverter Battery (UPS)', defaultRate: 95, unit: 'KG', quality: 'Heavy Tubular Batteries' },
    ],
  },
  {
    id: 'CAT_WIRES',
    name: 'Wires & Cables',
    icon: '🔌',
    items: [
      { id: 'WIR_001', name: 'Copper Insulated Wire', defaultRate: 250, unit: 'KG', quality: 'Electrical & Harness Wire' },
      { id: 'WIR_002', name: 'Aluminium Cable Wire', defaultRate: 85, unit: 'KG', quality: 'Overhead & Power Cable' },
      { id: 'WIR_003', name: 'Mixed Electrical Wire', defaultRate: 110, unit: 'KG', quality: 'Building Wiring Scrap' },
    ],
  },
  {
    id: 'CAT_EWASTE',
    name: 'E-Waste',
    icon: '💻',
    items: [
      { id: 'EWS_001', name: 'Computer CPU Tower', defaultRate: 320, unit: 'UNIT', quality: 'Complete Desktop CPU' },
      { id: 'EWS_002', name: 'Monitor (LCD / CRT)', defaultRate: 180, unit: 'UNIT', quality: 'Computer Displays' },
      { id: 'EWS_003', name: 'Chargers & Power Adapters', defaultRate: 45, unit: 'KG', quality: 'Mobile & Laptop Adapters' },
      { id: 'EWS_004', name: 'Keyboards & Peripherals', defaultRate: 25, unit: 'PIECE', quality: 'Assorted Keyboards' },
    ],
  },
  {
    id: 'CAT_HOME_APPLIANCES',
    name: 'Home Appliances',
    icon: '❄️',
    items: [
      { id: 'APP_001', name: 'Split AC (Indoor + Outdoor)', defaultRate: 2200, unit: 'UNIT', quality: 'Complete AC with Copper Coil' },
      { id: 'APP_002', name: 'Window AC Scrap', defaultRate: 1800, unit: 'UNIT', quality: '1.5 / 2 Ton Unit' },
      { id: 'APP_003', name: 'Refrigerator / Fridge', defaultRate: 1200, unit: 'UNIT', quality: 'Compressor & Metal Body' },
      { id: 'APP_004', name: 'Washing Machine', defaultRate: 850, unit: 'UNIT', quality: 'Top / Front Load Body' },
    ],
  },
];

export interface BillLineItem {
  id: string;
  materialName: string;
  materialCondition?: string;
  weightKg: string;
  unitRate: string;
  unit: string;
  amount: number;
}

export interface OrderWorkflow {
  order: OrderItem;
  stage: 'navigation' | 'pickup_otp' | 'weighing' | 'bill_generated' | 'payment' | 'billing_otp' | 'settled';
  pickupOtpInput: string;
  items: BillLineItem[];
  gstPercent: number;
  deductions: number;
  billingOtpInput: string;
  billNumber: string;
  agreedRate?: number | string;
  actualWeight?: number | string;
  paymentRecord?: OrderPaymentRecord;
}

export const getStageNumber = (stage: OrderWorkflow['stage']): number => {
  switch (stage) {
    case 'navigation': return 1;
    case 'pickup_otp': return 2;
    case 'weighing': return 3;
    case 'bill_generated': return 4;
    case 'payment': return 5;
    case 'billing_otp': return 6;
    case 'settled': return 7;
    default: return 1;
  }
};

interface OrderItem {
  id: string;
  customerName: string;
  customerType: 'Industry' | 'Individual';
  badge: OrderStatus;
  materialName: string;
  materialCondition: string;
  image: string;
  images?: string[];
  quantity: string;
  quantityRange?: string;
  dayTag?: string;
  tagType?: 'today' | 'tomorrow' | 'date' | 'on_the_way';
  pickupDate: string;
  pickupTime: string;
  statusLabel?: string;
  statusText: OrderStatus;
  statusType: 'pending' | 'scheduled' | 'completed' | 'cancelled';
  section?: 'upcoming' | 'active' | 'completed' | 'cancelled';
  buttonLabel?: string;
  hasNavIcon?: boolean;
  address: string;
  addressShort?: string;
  orderConfirmed: string;
  statusMeta: {
    heading: string;
    sub: string;
  };
  actions: ('view-details' | 'view-summary' | 'download-bill')[];
  bottomNote?: string;
}

const ORDERS_DATA: OrderItem[] = [
  {
    id: 'ORD-250513-00078',
    customerName: 'Sri Venkatesh Heavy Industries',
    customerType: 'Industry',
    badge: 'Scheduled',
    materialName: 'Heavy Melting Steel Scrap',
    materialCondition: 'Mixed',
    image: '/industry-steel-scrap.jpg',
    images: ['/industry-steel-scrap.jpg', '/scrap-quality-steel.jpg', '/scrap-iron.jpg'],
    quantity: '650 KG',
    quantityRange: '500 – 800 KG (Approx.)',
    dayTag: 'Today',
    tagType: 'today',
    pickupDate: 'Today',
    pickupTime: '10:00 AM – 12:00 PM',
    statusLabel: 'Order Confirmed',
    statusText: 'Scheduled',
    statusType: 'scheduled',
    section: 'upcoming',
    buttonLabel: 'View Order →',
    hasNavIcon: false,
    address: '24, 5th Main Road, SIDCO Industrial Estate, Guindy, Chennai – 600032, Tamil Nadu',
    addressShort: 'SIDCO Industrial Estate, Guindy, Chennai',
    orderConfirmed: '13 May 2025, 10:15 AM',
    statusMeta: {
      heading: 'Pickup in 2 Days',
      sub: '16 May 2025',
    },
    actions: ['view-details'],
  },
  {
    id: 'ORD-250513-00077',
    customerName: 'Ambattur Heavy Foundry Works',
    customerType: 'Industry',
    badge: 'Pending',
    materialName: 'Industrial Copper Armature & Cable Scrap',
    materialCondition: 'Clean',
    image: '/industry-copper-scrap.jpg',
    images: ['/industry-copper-scrap.jpg', '/scrap-copper-wire.jpg', '/scrap-copper.jpg'],
    quantity: '180 KG',
    quantityRange: '100 – 200 KG (Approx.)',
    dayTag: 'Tomorrow',
    tagType: 'tomorrow',
    pickupDate: 'Tomorrow',
    pickupTime: '02:00 PM – 04:00 PM',
    statusLabel: 'Order Confirmed',
    statusText: 'Pending',
    statusType: 'pending',
    section: 'upcoming',
    buttonLabel: 'View Order →',
    hasNavIcon: false,
    address: '12/1, Ambattur Industrial Estate, Ambattur, Chennai – 600058, Tamil Nadu',
    addressShort: 'Ambattur Industrial Estate, Ambattur, Chennai',
    orderConfirmed: '13 May 2025, 02:05 PM',
    statusMeta: {
      heading: 'Driver on the way to factory',
      sub: '13 May 2025, 01:45 PM',
    },
    actions: ['view-details'],
  },
  {
    id: 'ORD-250512-00075',
    customerName: 'Precision Tools & Castings Pvt Ltd',
    customerType: 'Industry',
    badge: 'Pending',
    materialName: 'Brass Scrap',
    materialCondition: 'Mixed',
    image: '/scrap-brass.jpg',
    images: ['/scrap-brass.jpg', '/scrap-ma-solid-alloy.jpg', '/scrap-tin.jpg'],
    quantity: '120 KG',
    quantityRange: '90 – 150 KG (Approx.)',
    dayTag: '15 May 2025',
    tagType: 'date',
    pickupDate: '15 May 2025',
    pickupTime: '10:00 AM – 01:00 PM',
    statusLabel: 'Order Confirmed',
    statusText: 'Pending',
    statusType: 'pending',
    section: 'upcoming',
    buttonLabel: 'Continue Pickup →',
    hasNavIcon: true,
    address: '16, Porur Industrial Bypass, Porur, Chennai – 600116, Tamil Nadu',
    addressShort: 'Porur Main Road, Porur, Chennai',
    orderConfirmed: '12 May 2025, 01:10 PM',
    statusMeta: {
      heading: 'Pickup Ready • Offer Accepted',
      sub: 'Today, 01:00 PM',
    },
    actions: ['view-details'],
  },
  {
    id: 'ORD-250513-00080',
    customerName: 'Chennai Metal Industries',
    customerType: 'Industry',
    badge: 'Pending',
    materialName: 'Mixed Metal Scrap',
    materialCondition: 'Mixed',
    image: '/industry-steel-scrap.jpg',
    images: ['/industry-steel-scrap.jpg', '/scrap-quality-steel.jpg'],
    quantity: '400 KG',
    quantityRange: '300 – 500 KG (Approx.)',
    dayTag: 'On the way',
    tagType: 'on_the_way',
    pickupDate: 'Today',
    pickupTime: 'Expected arrival: 11:45 AM',
    statusLabel: 'Pickup In Progress',
    statusText: 'Pending',
    statusType: 'pending',
    section: 'active',
    buttonLabel: 'Continue Pickup →',
    hasNavIcon: true,
    address: 'Plot 18, SIDCO Industrial Estate, Guindy, Chennai – 600032',
    addressShort: 'SIDCO Industrial Estate, Guindy, Chennai',
    orderConfirmed: '13 May 2025, 09:30 AM',
    statusMeta: {
      heading: 'En Route to Factory Bay',
      sub: 'Arrival in 15 mins',
    },
    actions: ['view-details'],
  },
  {
    id: 'ORD-250512-00076',
    customerName: 'Ramesh Kumar (Household)',
    customerType: 'Individual',
    badge: 'Pending',
    materialName: 'Steel Scrap',
    materialCondition: 'Mixed',
    image: '/scrap-quality-steel.png',
    images: ['/scrap-quality-steel.png', '/scrap-iron.png', '/scrap-low-quality-steel.jpg'],
    quantity: '420 KG',
    address: '8, Padi High Street, Padi, Chennai – 600050, Tamil Nadu',
    orderConfirmed: '12 May 2025, 09:10 AM',
    pickupDate: '12 May 2025',
    pickupTime: '09:00 AM – 11:00 AM',
    statusText: 'Pending',
    statusType: 'pending',
    statusMeta: {
      heading: 'At Customer Location • Weighing',
      sub: '12 May 2025, 09:35 AM',
    },
    actions: ['view-details'],
  },
  {
    id: 'ORD-250511-00074',
    customerName: 'Evergreen Packaging Aggregators',
    customerType: 'Industry',
    badge: 'Completed',
    materialName: 'Industrial Corrugated Box & Paper Scrap',
    materialCondition: 'Segregated',
    image: '/scrap-cardboard.jpg',
    images: ['/scrap-cardboard.jpg', '/scrap-mixed-papers.jpg', '/scrap-white-paper.jpg'],
    quantity: '300 KG',
    address: 'No. 45, Velachery 100 Feet Road, Velachery, Chennai – 600042, Tamil Nadu',
    orderConfirmed: '11 May 2025, 04:00 PM',
    pickupDate: '11 May 2025',
    pickupTime: '11:00 PM – 03:00 PM',
    statusText: 'Completed',
    statusType: 'completed',
    statusMeta: {
      heading: 'Completed on',
      sub: '11 May 2025, 05:20 PM',
    },
    actions: ['view-summary', 'download-bill'],
  },
  {
    id: 'ORD-250510-00071',
    customerName: 'Madras Auto Components & Forgings',
    customerType: 'Industry',
    badge: 'Completed',
    materialName: 'Commercial Aluminium Profile Scrap',
    materialCondition: 'Clean',
    image: '/industry-aluminium-scrap.jpg',
    images: ['/industry-aluminium-scrap.jpg', '/scrap-commercial-aluminium.jpg', '/scrap-household-aluminium.jpg'],
    quantity: '450 KG',
    address: 'Plot 88, Maraimalai Nagar Industrial Corridor, Chennai – 603209',
    orderConfirmed: '10 May 2025, 02:30 PM',
    pickupDate: '10 May 2025',
    pickupTime: '03:00 PM – 05:00 PM',
    statusText: 'Completed',
    statusType: 'completed',
    statusMeta: {
      heading: 'Settled & Completed',
      sub: '10 May 2025, 04:45 PM',
    },
    actions: ['view-summary', 'download-bill'],
  },
  {
    id: 'ORD-250510-00072',
    customerName: 'Dr. S. K. Subramanian',
    customerType: 'Individual',
    badge: 'Cancelled',
    materialName: 'Plastic & Mixed Scrap',
    materialCondition: 'Mixed',
    image: '/scrap-plastic-barrel.jpg',
    images: ['/scrap-plastic-barrel.jpg', '/scrap-plastic-pallet.jpg', '/scrap-pet-bottles.jpg'],
    quantity: '70 KG',
    address: '101, Thiru Vi Ka Street, Perambur, Chennai – 600011, Tamil Nadu',
    orderConfirmed: '10 May 2025, 03:15 PM',
    pickupDate: '10 May 2025',
    pickupTime: '01:00 PM – 03:00 PM',
    statusText: 'Cancelled',
    statusType: 'cancelled',
    statusMeta: {
      heading: 'Cancelled by Customer',
      sub: '10 May 2025, 10:30 AM',
    },
    actions: ['view-details'],
    bottomNote: 'Reason: Customer postponed demolition and scrap clearance to next month.',
  },
  {
    id: 'ORD-250509-00068',
    customerName: 'Kaveri Metal Fabrication Works',
    customerType: 'Industry',
    badge: 'Cancelled',
    materialName: 'Heavy Melting Steel & Lathe Waste',
    materialCondition: 'Mixed',
    image: '/industry-steel-scrap.jpg',
    images: ['/industry-steel-scrap.jpg', '/scrap-quality-steel.png', '/scrap-iron.jpg'],
    quantity: '850 KG',
    address: 'Plot 42, SIDCO Industrial Complex, Thirumazhisai, Chennai – 600124',
    orderConfirmed: '09 May 2025, 11:30 AM',
    pickupDate: '09 May 2025',
    pickupTime: '02:00 PM – 04:00 PM',
    statusText: 'Cancelled',
    statusType: 'cancelled',
    statusMeta: {
      heading: 'Cancelled by Merchant Dispatch',
      sub: '09 May 2025, 01:15 PM',
    },
    actions: ['view-details'],
    bottomNote: 'Reason: Factory overhead crane undergoing emergency maintenance; rebooked for next week.',
  },
  {
    id: 'ORD-250508-00065',
    customerName: 'TechPark Electronic Recyclers',
    customerType: 'Industry',
    badge: 'Cancelled',
    materialName: 'Decommissioned Server Racks & Cable Scrap',
    materialCondition: 'Segregated',
    image: '/scrap-cpu.jpg',
    images: ['/scrap-cpu.jpg', '/scrap-copper-wire.jpg', '/scrap-monitor.jpg'],
    quantity: '220 KG',
    address: 'Phase 2, OMR IT Corridor, Sholinganallur, Chennai – 600119',
    orderConfirmed: '08 May 2025, 10:00 AM',
    pickupDate: '08 May 2025',
    pickupTime: '11:00 AM – 01:00 PM',
    statusText: 'Cancelled',
    statusType: 'cancelled',
    statusMeta: {
      heading: 'Cancelled by Industry IT Dept',
      sub: '08 May 2025, 09:45 AM',
    },
    actions: ['view-details'],
    bottomNote: 'Reason: Data sanitization compliance certificate pending for server storage drives.',
  },
];

export default function MerchantOrders() {
  const [searchParams] = useSearchParams();
  const [orders, setOrders] = useState<OrderItem[]>(ORDERS_DATA);
  const [activeFilterTab, setActiveFilterTab] = useState<'all' | 'pending' | 'scheduled' | 'completed' | 'cancelled'>('all');
  const [mainActiveTab, setMainActiveTab] = useState<'upcoming' | 'active'>('active');

  // Interactive Order Operational Lifecycle Modal State
  const [workflowState, setWorkflowState] = useState<OrderWorkflow | null>(null);
  const [mapZoom, setMapZoom] = useState<number>(1);

  const [selectedScrapType, setSelectedScrapType] = useState('All Types');
  const [selectedOrderStatus, setSelectedOrderStatus] = useState('All Statuses');
  const [selectedLocation, setSelectedLocation] = useState('All Locations');
  const [selectedDateRange, setSelectedDateRange] = useState('This Month');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Payment State for Stage 5
  const [utrInputValue, setUtrInputValue] = useState('');
  const [utrInputError, setUtrInputError] = useState('');
  const [copiedPayeeUpi, setCopiedPayeeUpi] = useState(false);

  // Category + Subcategory Explorer & Universal Search State for Billing
  const [scrapSearchQuery, setScrapSearchQuery] = useState('');
  const [selectedBillingCatId, setSelectedBillingCatId] = useState<string>('CAT_IRON');

  // Auto-open order pickup workflow when redirected with orderId or customer param
  useEffect(() => {
    const orderId = searchParams.get('orderId');
    const customer = searchParams.get('customer');
    const rateParam = searchParams.get('rate');

    if (orderId || customer) {
      const targetOrder = orders.find(
        (o) =>
          (orderId && o.id.toLowerCase() === orderId.toLowerCase()) ||
          (customer && o.customerName.toLowerCase().includes(customer.toLowerCase()))
      ) || orders[2]; // Defaults to Precision Tools & Castings (the accepted offer)

      if (targetOrder) {
        if (targetOrder.statusType === 'scheduled') setActiveFilterTab('scheduled');
        else if (targetOrder.statusType === 'pending') setActiveFilterTab('pending');
        else if (targetOrder.statusType === 'completed') setActiveFilterTab('completed');
        else if (targetOrder.statusType === 'cancelled') setActiveFilterTab('cancelled');

        const targetRate = rateParam || '42';
        const initialAmount = 0;
        const initialBillNum = `BILL-${targetOrder.id.split('-').pop() || '00075'}`;
        const initialPayment = getOrCreateOrderPayment(targetOrder.id, initialBillNum, initialAmount);

        setWorkflowState({
          order: targetOrder,
          stage: 'weighing',
          pickupOtpInput: '4829',
          items: [
            {
              id: `item-${Date.now()}-1`,
              materialName: targetOrder.materialName,
              materialCondition: targetOrder.materialCondition,
              weightKg: '0',
              unitRate: targetRate,
              unit: 'KG',
              amount: initialAmount,
            },
          ],
          gstPercent: 0,
          deductions: 0,
          billingOtpInput: '7104',
          billNumber: initialBillNum,
          paymentRecord: initialPayment,
        });

        triggerToast(`📍 Bill preparation opened for ${targetOrder.customerName}!`);
      }
    }
  }, [searchParams]);

  // Floating Image Preview Lightbox State
  const [floatingImage, setFloatingImage] = useState<{
    src: string;
    title: string;
    condition: string;
    quantity: string;
    customerName: string;
  } | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Start / Open Order Lifecycle Workflow Full Screen Drawer
  const handleOpenWorkflow = (order: OrderItem) => {
    let initialStage: OrderWorkflow['stage'] = 'navigation';
    if (order.badge === 'Completed') initialStage = 'settled';
    else initialStage = 'navigation';

    const defaultRate = '42';
    const initialAmount = 0;
    const billNum = `BILL-${order.id.split('-').pop() || '00075'}`;
    const initialPayment = getOrCreateOrderPayment(order.id, billNum, initialAmount);

    setWorkflowState({
      order,
      stage: initialStage,
      pickupOtpInput: '4829',
      items: [
        {
          id: `item-${Date.now()}-1`,
          materialName: order.materialName,
          materialCondition: order.materialCondition,
          weightKg: '0',
          unitRate: defaultRate,
          unit: 'KG',
          amount: initialAmount,
        },
      ],
      gstPercent: 0,
      deductions: 0,
      billingOtpInput: '7104',
      billNumber: billNum,
      paymentRecord: initialPayment,
    });
  };

  // Bill Preparation Handlers
  const handleAddBillItem = () => {
    if (!workflowState) return;
    const newItem: BillLineItem = {
      id: `item-${Date.now()}-${workflowState.items.length + 1}`,
      materialName: '',
      materialCondition: 'Standard',
      weightKg: '0',
      unitRate: '',
      unit: 'KG',
      amount: 0,
    };
    setWorkflowState({
      ...workflowState,
      items: [...workflowState.items, newItem],
    });
    triggerToast('➕ Added blank product line item to bill.');
  };

  // Add Product directly from Market Price Category/Subcategory Card or Search
  const handleAddMarketSubItem = (subItem: MarketScrapSubItem) => {
    if (!workflowState) return;
    const newItem: BillLineItem = {
      id: `item-${Date.now()}-${workflowState.items.length + 1}`,
      materialName: subItem.name,
      materialCondition: subItem.quality || 'Standard',
      weightKg: '0',
      unitRate: subItem.defaultRate.toString(),
      unit: subItem.unit,
      amount: 0,
    };
    setWorkflowState({
      ...workflowState,
      items: [...workflowState.items, newItem],
    });
    setScrapSearchQuery('');
    triggerToast(`✓ Added "${subItem.name}" (₹${subItem.defaultRate}/${subItem.unit}) to bill!`);
  };

  const handleAddCustomSearchItem = () => {
    if (!workflowState || !scrapSearchQuery.trim()) return;
    const newItem: BillLineItem = {
      id: `item-${Date.now()}-${workflowState.items.length + 1}`,
      materialName: scrapSearchQuery.trim(),
      materialCondition: 'Standard',
      weightKg: '0',
      unitRate: '100',
      unit: 'KG',
      amount: 0,
    };
    setWorkflowState({
      ...workflowState,
      items: [...workflowState.items, newItem],
    });
    setScrapSearchQuery('');
    triggerToast(`✓ Added custom item "${newItem.materialName}" to bill!`);
  };

  const handleUpdateBillItem = (
    id: string,
    field: keyof BillLineItem,
    value: string | number
  ) => {
    if (!workflowState) return;
    setWorkflowState({
      ...workflowState,
      items: workflowState.items.map((item) => {
        if (item.id !== id) return item;
        const updated = { ...item, [field]: value };
        const weight = Number(field === 'weightKg' ? value : updated.weightKg) || 0;
        const rate = Number(field === 'unitRate' ? value : updated.unitRate) || 0;
        updated.amount = Math.round(weight * rate);
        return updated;
      }),
    });
  };

  const handleRemoveBillItem = (id: string) => {
    if (!workflowState || workflowState.items.length <= 1) {
      triggerToast('⚠️ At least one product is required on the bill.');
      return;
    }
    setWorkflowState({
      ...workflowState,
      items: workflowState.items.filter((item) => item.id !== id),
    });
    triggerToast('🗑️ Material line item removed from bill.');
  };

  const calculateSubtotal = () => {
    if (!workflowState) return 0;
    return workflowState.items.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
  };

  const calculateTotalWeight = () => {
    if (!workflowState) return 0;
    return workflowState.items.reduce((acc, curr) => acc + (Number(curr.weightKg) || 0), 0);
  };

  const calculateGstAmount = (subtotal: number) => {
    if (!workflowState) return 0;
    return Math.round((subtotal * (workflowState.gstPercent || 0)) / 100);
  };

  const calculateGrandTotal = () => {
    const subtotal = calculateSubtotal();
    const deductions = Number(workflowState?.deductions || 0);
    const gst = calculateGstAmount(subtotal);
    return Math.max(0, Math.round(subtotal - deductions + gst));
  };

  const handleMarkArrived = () => {
    if (!workflowState) return;
    setWorkflowState({
      ...workflowState,
      stage: 'pickup_otp',
    });
    triggerToast('📍 Arrived at factory/customer location. Enter Pickup OTP.');
  };

  const handleVerifyPickupOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!workflowState) return;
    if (workflowState.pickupOtpInput.length < 4) {
      triggerToast('⚠️ Please enter a 4-digit Pickup OTP.');
      return;
    }
    setWorkflowState({
      ...workflowState,
      stage: 'weighing',
    });
    triggerToast('✓ Pickup OTP verified! Proceed to weighing & measurement.');
  };

  const handleConfirmWeighing = (e: React.FormEvent) => {
    e.preventDefault();
    if (!workflowState) return;
    
    // Validate all items
    const hasInvalidItem = workflowState.items.some(
      (it) => !it.materialName.trim() || Number(it.weightKg) <= 0 || Number(it.unitRate) <= 0
    );
    if (hasInvalidItem) {
      triggerToast('⚠️ Please ensure all product names, weights, and unit rates are positive.');
      return;
    }

    setWorkflowState({
      ...workflowState,
      stage: 'bill_generated',
    });
    triggerToast('⚖️ All products recorded. Tax invoice bill generated!');
  };

  const handleSubmitBill = () => {
    if (!workflowState) return;
    const finalAmount = calculateGrandTotal();
    const payment = getOrCreateOrderPayment(
      workflowState.order.id,
      workflowState.billNumber,
      finalAmount
    );
    setWorkflowState({
      ...workflowState,
      stage: 'payment',
      paymentRecord: payment,
    });
    triggerToast('📄 Bill submitted to customer. Proceed to Stage 5: Payment.');
  };

  const handleSelectPaymentMethod = (method: 'UPI' | 'CASH') => {
    if (!workflowState) return;
    const updated = setOrderPaymentMethod(workflowState.order.id, method);
    if (updated) {
      setWorkflowState({
        ...workflowState,
        paymentRecord: updated,
      });
    }
  };

  const handlePayByAnyUpi = () => {
    if (!workflowState) return;
    const finalAmount = calculateGrandTotal();
    const payeeUpi = workflowState.paymentRecord?.payeeUpiId || DEFAULT_MERCHANT_UPI_ID;
    const payeeName = workflowState.paymentRecord?.payeeName || DEFAULT_MERCHANT_PAYEE_NAME;
    const intentUrl = createOrderUpiPaymentIntent(
      payeeUpi,
      payeeName,
      finalAmount,
      workflowState.order.id
    );

    // Trigger generic UPI intent deep link
    window.location.href = intentUrl;

    const updated = markOrderPaymentInitiated(workflowState.order.id);
    if (updated) {
      setWorkflowState({
        ...workflowState,
        paymentRecord: updated,
      });
    }
    triggerToast('📱 Opening UPI app... Complete payment and enter UTR below.');
  };

  const handleCopyPayeeUpi = () => {
    const upiId = workflowState?.paymentRecord?.payeeUpiId || DEFAULT_MERCHANT_UPI_ID;
    navigator.clipboard.writeText(upiId);
    setCopiedPayeeUpi(true);
    triggerToast('📋 Merchant UPI ID copied to clipboard!');
    setTimeout(() => setCopiedPayeeUpi(false), 2000);
  };

  const handleSubmitPaymentUtr = (e: React.FormEvent) => {
    e.preventDefault();
    if (!workflowState) return;
    if (!utrInputValue.trim() || utrInputValue.trim().length < 6) {
      setUtrInputError('Please enter a valid UTR / Transaction ID (min 6 characters).');
      return;
    }

    const updated = submitOrderPaymentUtr(workflowState.order.id, utrInputValue.trim());
    if (updated) {
      setWorkflowState({
        ...workflowState,
        paymentRecord: updated,
      });
      setUtrInputValue('');
      setUtrInputError('');
      triggerToast('💳 Payment reference submitted! You can now continue to Settlement.');
    }
  };

  const handleConfirmCashPayment = () => {
    if (!workflowState) return;
    const updated = confirmOrderCashPayment(workflowState.order.id);
    if (updated) {
      setWorkflowState({
        ...workflowState,
        paymentRecord: updated,
      });
      triggerToast('💵 Cash payment confirmed! You can now continue to Settlement.');
    }
  };

  const handleProceedToSettlement = () => {
    if (!workflowState) return;
    const paymentStatus = workflowState.paymentRecord?.status;
    if (paymentStatus !== 'SUBMITTED' && paymentStatus !== 'CONFIRMED') {
      triggerToast('⚠️ Please complete or record payment before proceeding to Settlement.');
      return;
    }

    setWorkflowState({
      ...workflowState,
      stage: 'billing_otp',
    });
    triggerToast('🔐 Payment recorded. Please confirm Settlement OTP with customer.');
  };

  const handleVerifyBillingOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!workflowState) return;
    if (workflowState.billingOtpInput.length < 4) {
      triggerToast('⚠️ Please enter a valid 4-digit Billing Settlement OTP.');
      return;
    }

    // Update order to Completed in the list
    setOrders((prev) =>
      prev.map((o) =>
        o.id === workflowState.order.id
          ? {
              ...o,
              badge: 'Completed',
              statusText: 'Completed',
              statusType: 'completed',
              statusMeta: {
                heading: 'Settled & Completed',
                sub: 'Just now',
              },
            }
          : o
      )
    );

    setWorkflowState({
      ...workflowState,
      stage: 'settled',
    });
    triggerToast('🎉 Order successfully settled! Payment confirmed.');
  };

  const handleCloseSettledDetails = () => {
    if (!workflowState) return;

    const currentOrder = workflowState.order;
    const finalAmount = calculateGrandTotal();
    const billNumber = workflowState.billNumber;

    // Close the operational settlement workflow modal
    setWorkflowState(null);

    // Open the new Merchant Commission Payment workflow
    openMerchantCommissionModal({
      orderId: currentOrder.id,
      customerName: currentOrder.customerName,
      finalOrderAmount: finalAmount,
      billNumber,
    });
  };

  const handleClearFilters = () => {
    setSelectedScrapType('All Types');
    setSelectedOrderStatus('All Statuses');
    setSelectedLocation('All Locations');
    setSelectedDateRange('This Month');
    triggerToast('Filters reset to default.');
  };

  // Filter orders based on active tab & sidebar selections
  const filteredOrders = orders.filter((order) => {
    // Tab filter (works for both Desktop & Mobile Tabs)
    if (activeFilterTab !== 'all' && order.statusType !== activeFilterTab) return false;

    // Filter selects
    if (selectedOrderStatus !== 'All Statuses' && order.badge !== selectedOrderStatus) {
      return false;
    }
    if (selectedScrapType !== 'All Types' && !order.materialName.toLowerCase().includes(selectedScrapType.toLowerCase())) {
      return false;
    }
    return true;
  });

  return (
    <div className={styles.pageWrapper}>
      {/* Toast Banner */}
      {toastMessage && (
        <div
          className={`${styles.toastBanner} ${
            toastMessage.includes('⚠️')
              ? styles.toastWarning
              : toastMessage.includes('🗑️')
              ? styles.toastDanger
              : styles.toastSuccess
          }`}
        >
          {toastMessage.includes('⚠️') ? (
            <AlertCircle size={18} className={styles.toastIconWarning} />
          ) : toastMessage.includes('🗑️') ? (
            <Trash2 size={18} className={styles.toastIconDanger} />
          ) : (
            <CheckCircle2 size={18} className={styles.toastIconSuccess} />
          )}
          <span className={styles.toastText}>
            {toastMessage.replace(/^[⚠️🗑️✓➕📍🎉]\s*/, '')}
          </span>
        </div>
      )}

      <main className={styles.mainContainer}>
        <div className={styles.ordersLayoutGrid}>
          {/* ================================================================
              LEFT COLUMN: MAIN ORDERS LIST (70%)
             ================================================================ */}
          <section className={styles.mainCol}>
            {/* 1. Page Header */}
            <div className={styles.ordersHeaderSection}>
              <h1 className={styles.pageMainHeading}>Orders</h1>
              <p className={styles.pageSubHeading}>
                Manage your accepted orders and pickups.
              </p>
            </div>

            {/* 2. 2-Tab Segmented Control: Upcoming (3) | Active (1) */}
            <div className={styles.segmentedTabsContainer}>
              <button
                type="button"
                className={`${styles.segmentedTab} ${
                  mainActiveTab === 'upcoming' ? styles.segmentedTabActive : ''
                }`}
                onClick={() => setMainActiveTab('upcoming')}
              >
                <Calendar size={18} />
                <span>Upcoming ({orders.filter((o) => o.section === 'upcoming' || o.badge === 'Scheduled' || (o.badge === 'Pending' && o.section !== 'active')).length})</span>
              </button>

              <button
                type="button"
                className={`${styles.segmentedTab} ${
                  mainActiveTab === 'active' ? styles.segmentedTabActive : ''
                }`}
                onClick={() => setMainActiveTab('active')}
              >
                <PlayCircle size={18} />
                <span>Active ({orders.filter((o) => o.section === 'active' || o.dayTag === 'On the way').length})</span>
              </button>
            </div>

            {/* 3. UPCOMING ORDERS SECTION */}
            {mainActiveTab === 'upcoming' && (
              <div className={styles.sectionBlock}>
                <div className={styles.sectionHeaderRow}>
                  <div className={styles.sectionHeaderLeft}>
                    <h2 className={styles.sectionTitle}>Upcoming Orders</h2>
                  </div>
                </div>

                <div className={styles.cleanCardsStack}>
                  {orders
                    .filter((o) => o.section === 'upcoming' || o.badge === 'Scheduled' || (o.badge === 'Pending' && o.section !== 'active'))
                    .map((order) => (
                      <article
                        key={order.id}
                        className={styles.cleanOrderCard}
                        onClick={() => handleOpenWorkflow(order)}
                        title={`Click to view pickup workflow for ${order.customerName}`}
                      >
                        {/* Top Meta Row */}
                        <div className={styles.cleanCardTopRow}>
                          <div className={styles.cleanCardTopLeft}>
                            <span className={styles.tagYellowPill}>
                              {order.dayTag || order.pickupDate}
                            </span>
                            <span className={styles.cleanTimeSlotText}>{order.pickupTime}</span>
                          </div>

                          <div className={styles.statusPillConfirmed}>
                            <span className={styles.dotYellow}>●</span>
                            <span>{order.statusLabel || 'Order Confirmed'}</span>
                          </div>
                        </div>

                        {/* Middle Body */}
                        <div className={styles.cleanCardBody}>
                          <img
                            src={order.image}
                            alt={order.materialName}
                            className={styles.cleanCardImg}
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).src = '/industry-steel-scrap.jpg';
                            }}
                          />

                          <div className={styles.cleanCardDetails}>
                            <div className={styles.cleanCustomerRow}>
                              <h3 className={styles.cleanCustomerName}>{order.customerName}</h3>
                              <ChevronRight size={18} className={styles.cleanChevron} />
                            </div>

                            <div className={styles.cleanMetaRow}>
                              <Building2 size={13} className={styles.cleanMetaIcon} />
                              <span>{order.customerType}</span>
                            </div>

                            <div className={styles.cleanMetaRow}>
                              <Package size={13} className={styles.cleanMetaIcon} />
                              <span className={styles.cleanMaterialName}>{order.materialName}</span>
                              <span className={styles.cleanQuantityText}>
                                {order.quantityRange || `${order.quantity} (Approx.)`}
                              </span>
                            </div>

                            <div className={styles.cleanMetaRow}>
                              <MapPin size={13} className={styles.cleanMetaIcon} />
                              <span className={styles.cleanLocationText}>
                                {order.addressShort || order.address}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Bottom Action Row */}
                        <div className={styles.cleanCardActionRow}>
                          <button
                            type="button"
                            className={styles.cleanYellowActionBtn}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenWorkflow(order);
                            }}
                          >
                            {order.hasNavIcon && (
                              <Navigation size={13} style={{ transform: 'rotate(45deg)' }} />
                            )}
                            <span>{order.buttonLabel || 'View Order →'}</span>
                          </button>
                        </div>
                      </article>
                    ))}
                </div>
              </div>
            )}

            {/* 4. ACTIVE ORDERS SECTION */}
            {mainActiveTab === 'active' && (
              <div className={styles.sectionBlock}>
                <div className={styles.sectionHeaderRow}>
                  <div className={styles.sectionHeaderLeft}>
                    <h2 className={styles.sectionTitle}>Active Orders</h2>
                  </div>
                </div>

                <div className={styles.cleanCardsStack}>
                  {orders
                    .filter((o) => o.section === 'active' || o.dayTag === 'On the way')
                    .map((order) => (
                      <article
                        key={order.id}
                        className={styles.cleanOrderCard}
                        onClick={() => handleOpenWorkflow(order)}
                        title={`Click to continue pickup for ${order.customerName}`}
                      >
                        {/* Top Meta Row: [On the way] Expected arrival ... 🟢 Pickup In Progress */}
                        <div className={styles.cleanCardTopRow}>
                          <div className={styles.cleanCardTopLeft}>
                            <span className={styles.tagOnTheWay}>
                              {order.dayTag || 'On the way'}
                            </span>
                            <span className={styles.cleanTimeSlotText}>{order.pickupTime}</span>
                          </div>

                          <div className={styles.statusPillGreen}>
                            <span className={styles.dotGreen}>●</span>
                            <span>{order.statusLabel || 'Pickup In Progress'}</span>
                          </div>
                        </div>

                        {/* Middle Body */}
                        <div className={styles.cleanCardBody}>
                          <img
                            src={order.image}
                            alt={order.materialName}
                            className={styles.cleanCardImg}
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).src = '/industry-steel-scrap.jpg';
                            }}
                          />

                          <div className={styles.cleanCardDetails}>
                            <div className={styles.cleanCustomerRow}>
                              <h3 className={styles.cleanCustomerName}>{order.customerName}</h3>
                              <ChevronRight size={18} className={styles.cleanChevron} />
                            </div>

                            <div className={styles.cleanMetaRow}>
                              <Building2 size={13} className={styles.cleanMetaIcon} />
                              <span>{order.customerType}</span>
                            </div>

                            <div className={styles.cleanMetaRow}>
                              <Package size={13} className={styles.cleanMetaIcon} />
                              <span className={styles.cleanMaterialName}>{order.materialName}</span>
                              <span className={styles.cleanQuantityText}>
                                {order.quantityRange || `${order.quantity} (Approx.)`}
                              </span>
                            </div>

                            <div className={styles.cleanMetaRow}>
                              <MapPin size={13} className={styles.cleanMetaIcon} />
                              <span className={styles.cleanLocationText}>
                                {order.addressShort || order.address}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Bottom Action Row */}
                        <div className={styles.cleanCardActionRow}>
                          <button
                            type="button"
                            className={styles.cleanYellowActionBtn}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenWorkflow(order);
                            }}
                          >
                            <Navigation size={13} style={{ transform: 'rotate(45deg)' }} />
                            <span>{order.buttonLabel || 'Continue Pickup →'}</span>
                          </button>
                        </div>
                      </article>
                    ))}
                </div>
              </div>
            )}
          </section>

          {/* ================================================================
              RIGHT SIDEBAR (30%)
             ================================================================ */}
          <aside className={styles.sidebarCol}>
            {/* Card 1: Filters */}
            <div className={styles.sidebarCard}>
              <div className={styles.sidebarHeaderRow}>
                <h3 className={styles.sidebarCardTitle}>
                  <Filter size={16} />
                  <span>Filters</span>
                </h3>
                <button type="button" className={styles.clearAllBtn} onClick={handleClearFilters}>
                  Clear All
                </button>
              </div>

              <div className={styles.filterField}>
                <label className={styles.filterLabel}>Scrap Type</label>
                <div className={styles.selectWrapper}>
                  <select
                    value={selectedScrapType}
                    onChange={(e) => setSelectedScrapType(e.target.value)}
                    className={styles.filterSelect}
                  >
                    <option value="All Types">All Types</option>
                    <option value="Metal">Metal / Iron Scrap</option>
                    <option value="Copper">Copper Scrap</option>
                    <option value="Steel">Steel Scrap</option>
                    <option value="Brass">Brass Scrap</option>
                    <option value="Paper">Paper Scrap</option>
                    <option value="Plastic">Plastic Scrap</option>
                  </select>
                  <ChevronDown size={14} className={styles.selectChevron} />
                </div>
              </div>

              <div className={styles.filterField}>
                <label className={styles.filterLabel}>Order Status</label>
                <div className={styles.selectWrapper}>
                  <select
                    value={selectedOrderStatus}
                    onChange={(e) => setSelectedOrderStatus(e.target.value)}
                    className={styles.filterSelect}
                  >
                    <option value="All Statuses">All Statuses</option>
                    <option value="Pending">Pending</option>
                    <option value="Scheduled">Scheduled</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                  <ChevronDown size={14} className={styles.selectChevron} />
                </div>
              </div>

              <div className={styles.filterField}>
                <label className={styles.filterLabel}>Location</label>
                <div className={styles.selectWrapper}>
                  <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className={styles.filterSelect}
                  >
                    <option value="All Locations">All Locations</option>
                    <option value="Guindy">Guindy / SIDCO</option>
                    <option value="Ambattur">Ambattur Industrial</option>
                    <option value="Porur">Porur / Sriperumbudur</option>
                    <option value="Velachery">Velachery</option>
                  </select>
                  <ChevronDown size={14} className={styles.selectChevron} />
                </div>
              </div>

              <div className={styles.filterField}>
                <label className={styles.filterLabel}>Date Range</label>
                <div className={styles.selectWrapper}>
                  <select
                    value={selectedDateRange}
                    onChange={(e) => setSelectedDateRange(e.target.value)}
                    className={styles.filterSelect}
                  >
                    <option value="Today">Today</option>
                    <option value="This Week">This Week</option>
                    <option value="This Month">This Month</option>
                    <option value="Last 3 Months">Last 3 Months</option>
                  </select>
                  <ChevronDown size={14} className={styles.selectChevron} />
                </div>
              </div>
            </div>

            {/* Card 2: Standardized Order Flow */}
            <div className={styles.sidebarCard}>
              <h3 className={styles.sidebarCardTitle}>Order Flow</h3>
              <ol className={styles.stepsList}>
                <li className={styles.stepItem}>
                  <div className={styles.stepNumber}>1</div>
                  <div className={styles.stepText}>
                    <strong>Pending:</strong> Active unfinished order — driver departs or digital weighing is underway.
                  </div>
                </li>
                <li className={styles.stepItem}>
                  <div className={styles.stepNumber}>2</div>
                  <div className={styles.stepText}>
                    <strong>Scheduled:</strong> Advance pickup booked for a specific future date and time window.
                  </div>
                </li>
                <li className={styles.stepItem}>
                  <div className={styles.stepNumber}>3</div>
                  <div className={styles.stepText}>
                    <strong>Completed:</strong> Weight verified digitally, spot payment confirmed, and bill issued.
                  </div>
                </li>
                <li className={styles.stepItem}>
                  <div className={styles.stepNumber}>4</div>
                  <div className={styles.stepText}>
                    <strong>Cancelled:</strong> Order terminated prior to pickup with reason documented.
                  </div>
                </li>
              </ol>
            </div>

            {/* Card 3: Performance */}
            <div className={styles.sidebarCard}>
              <h3 className={styles.sidebarCardTitle}>Monthly Performance</h3>
              <div className={styles.perfGrid}>
                <div className={styles.perfItem}>
                  <span className={styles.perfLabel}>Completion Rate</span>
                  <span className={styles.perfValueGreen}>96.4%</span>
                </div>
                <div className={styles.perfItem}>
                  <span className={styles.perfLabel}>Avg. Pickup Time</span>
                  <span className={styles.perfValue}>45 Mins</span>
                </div>
                <div className={styles.perfItem}>
                  <span className={styles.perfLabel}>Customer Rating</span>
                  <span className={styles.perfValueYellow}>★ 4.9 / 5</span>
                </div>
                <div className={styles.perfItem}>
                  <span className={styles.perfLabel}>On-Time Commission</span>
                  <span className={styles.perfValueGreen}>100%</span>
                </div>
              </div>
            </div>

            {/* Card 4: Need Help */}
            <div className={styles.sidebarCard}>
              <h3 className={styles.sidebarCardTitle}>Need Help with an Order?</h3>
              <p className={styles.helpText}>
                Need to reschedule a pickup or request weight re-calibration? Contact merchant dispatch desk.
              </p>
              <a href="tel:+919876543210" className={styles.helpPhoneBtn}>
                <Phone size={15} />
                <span>+91 98765 43210</span>
              </a>
            </div>
          </aside>
        </div>
      </main>

      {/* Floating Image Lightbox Modal */}
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
                  <span className={styles.floatingBadgeQty}>{floatingImage.quantity}</span>
                  <span className={styles.floatingPosterName}>• Customer: {floatingImage.customerName}</span>
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

      {/* 5. INTERACTIVE ORDER OPERATIONAL LIFECYCLE WORKFLOW DRAWER / MODAL */}
      {workflowState && (
        <div
          className={styles.workflowModalOverlay}
          onClick={() => setWorkflowState(null)}
        >
          <div
            className={styles.workflowModalCard}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Top Header */}
            <div className={styles.workflowModalHeader}>
              <div className={styles.workflowHeaderLeft}>
                <span className={styles.workflowHeaderTag}>ORDER WORKFLOW</span>
                <h3 className={styles.workflowHeaderTitle}>{workflowState.order.id}</h3>
                <span className={styles.workflowHeaderCustomer}>
                  {workflowState.order.customerName} ({workflowState.order.customerType})
                </span>
              </div>
              <button
                type="button"
                className={styles.workflowCloseBtn}
                onClick={() => setWorkflowState(null)}
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            {/* Stage Progress Stepper — 6 Stages */}
            {(() => {
              const currStageNum = getStageNumber(workflowState.stage);
              return (
                <div className={styles.workflowStepper}>
                  {/* Step 1: En Route */}
                  <button
                    type="button"
                    className={`${styles.stepItem} ${currStageNum >= 1 ? styles.stepItemActive : ''}`}
                    onClick={() => setWorkflowState({ ...workflowState, stage: 'navigation' })}
                  >
                    <div className={`${styles.stepNumber} ${currStageNum > 1 ? styles.stepNumberDone : ''}`}>
                      {currStageNum > 1 ? <FiCheck size={11} strokeWidth={3} /> : '1'}
                    </div>
                    <span className={styles.stepLabel}>En Route</span>
                  </button>
                  <div className={`${styles.stepConnector} ${currStageNum > 1 ? styles.stepConnectorActive : ''}`} />

                  {/* Step 2: Pickup OTP */}
                  <button
                    type="button"
                    className={`${styles.stepItem} ${currStageNum >= 2 ? styles.stepItemActive : ''}`}
                    onClick={() => currStageNum >= 2 && setWorkflowState({ ...workflowState, stage: 'pickup_otp' })}
                  >
                    <div className={`${styles.stepNumber} ${currStageNum > 2 ? styles.stepNumberDone : ''}`}>
                      {currStageNum > 2 ? <FiCheck size={11} strokeWidth={3} /> : '2'}
                    </div>
                    <span className={styles.stepLabel}>Pickup OTP</span>
                  </button>
                  <div className={`${styles.stepConnector} ${currStageNum > 2 ? styles.stepConnectorActive : ''}`} />

                  {/* Step 3: Weighing */}
                  <button
                    type="button"
                    className={`${styles.stepItem} ${currStageNum >= 3 ? styles.stepItemActive : ''}`}
                    onClick={() => currStageNum >= 3 && setWorkflowState({ ...workflowState, stage: 'weighing' })}
                  >
                    <div className={`${styles.stepNumber} ${currStageNum > 3 ? styles.stepNumberDone : ''}`}>
                      {currStageNum > 3 ? <FiCheck size={11} strokeWidth={3} /> : '3'}
                    </div>
                    <span className={styles.stepLabel}>Weighing</span>
                  </button>
                  <div className={`${styles.stepConnector} ${currStageNum > 3 ? styles.stepConnectorActive : ''}`} />

                  {/* Step 4: Bill */}
                  <button
                    type="button"
                    className={`${styles.stepItem} ${currStageNum >= 4 ? styles.stepItemActive : ''}`}
                    onClick={() => currStageNum >= 4 && setWorkflowState({ ...workflowState, stage: 'bill_generated' })}
                  >
                    <div className={`${styles.stepNumber} ${currStageNum > 4 ? styles.stepNumberDone : ''}`}>
                      {currStageNum > 4 ? <FiCheck size={11} strokeWidth={3} /> : '4'}
                    </div>
                    <span className={styles.stepLabel}>Bill</span>
                  </button>
                  <div className={`${styles.stepConnector} ${currStageNum > 4 ? styles.stepConnectorActive : ''}`} />

                  {/* Step 5: Payment */}
                  <button
                    type="button"
                    className={`${styles.stepItem} ${currStageNum >= 5 ? styles.stepItemActive : ''}`}
                    onClick={() => currStageNum >= 5 && setWorkflowState({ ...workflowState, stage: 'payment' })}
                  >
                    <div className={`${styles.stepNumber} ${currStageNum > 5 ? styles.stepNumberDone : ''}`}>
                      {currStageNum > 5 ? <FiCheck size={11} strokeWidth={3} /> : '5'}
                    </div>
                    <span className={styles.stepLabel}>Payment</span>
                  </button>
                  <div className={`${styles.stepConnector} ${currStageNum > 5 ? styles.stepConnectorActive : ''}`} />

                  {/* Step 6: Settlement */}
                  <button
                    type="button"
                    className={`${styles.stepItem} ${currStageNum >= 6 ? styles.stepItemActive : ''}`}
                    onClick={() => {
                      const isPaymentReady =
                        workflowState.paymentRecord?.status === 'SUBMITTED' ||
                        workflowState.paymentRecord?.status === 'CONFIRMED' ||
                        currStageNum >= 6;
                      if (isPaymentReady) {
                        setWorkflowState({ ...workflowState, stage: 'billing_otp' });
                      } else {
                        triggerToast('⚠️ Please complete Stage 5 Payment before proceeding.');
                      }
                    }}
                  >
                    <div className={`${styles.stepNumber} ${currStageNum > 6 ? styles.stepNumberDone : ''}`}>
                      {currStageNum > 6 ? <FiCheck size={11} strokeWidth={3} /> : '6'}
                    </div>
                    <span className={styles.stepLabel}>Settlement</span>
                  </button>
                </div>
              );
            })()}

            {/* Modal Body Based on Stage */}
            <div className={styles.workflowModalBody}>
              {/* STAGE 1: NAVIGATION & EN ROUTE */}
              {workflowState.stage === 'navigation' && (
                <div className={styles.stageContentBox}>
                  {/* Yellow Alert Banner */}
                  <div className={styles.stage1AlertBanner}>
                    <div className={styles.stage1AlertIconWrap}>
                      <Compass size={20} />
                    </div>
                    <div className={styles.stage1AlertTextCol}>
                      <strong className={styles.stage1AlertTitle}>
                        Stage 1: Live Pickup GPS Map &amp; Navigation
                      </strong>
                      <span className={styles.stage1AlertSubtitle}>
                        Reach the customer location using the map.
                      </span>
                    </div>
                  </div>

                  {/* UNIFIED NAVIGATION MAP CARD */}
                  <div className={styles.unifiedNavCard}>
                    {/* Top Navigation Turn Header */}
                    <div className={styles.navTurnHeader}>
                      <div className={styles.turnIconSquare}>
                        <CornerUpLeft size={22} />
                      </div>
                      <div className={styles.turnInfoCol}>
                        <div className={styles.turnTopMetaRow}>
                          <span className={styles.turnDistanceBig}>400 m</span>
                          <div className={styles.gpsLiveBadge}>
                            <span className={styles.gpsDotGreen}>●</span>
                            <span>GPS Live</span>
                          </div>
                        </div>
                        <div className={styles.turnInstruction}>
                          Turn left onto Porur Industrial Bypass
                        </div>
                        <div className={styles.turnSubMeta}>
                          <span>4.2 km remaining</span>
                          <span className={styles.metaDot}>•</span>
                          <span>14 min</span>
                          <span className={styles.metaDot}>•</span>
                          <span className={styles.metaGreenTraffic}>Light traffic</span>
                        </div>
                      </div>
                    </div>

                    {/* Google-Maps Styled Viewport */}
                    <div className={styles.googleMapViewBox}>
                      <svg
                        viewBox="0 0 500 280"
                        className={styles.googleMapSvg}
                        style={{
                          transform: `scale(${mapZoom})`,
                          transformOrigin: 'center center',
                          transition: 'transform 0.25s ease',
                        }}
                      >
                        <defs>
                          <filter id="pinShadow" x="-30%" y="-30%" width="160%" height="160%">
                            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#0f172a" floodOpacity="0.3" />
                          </filter>
                          <filter id="calloutShadow" x="-20%" y="-30%" width="140%" height="170%">
                            <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#0f172a" floodOpacity="0.2" />
                          </filter>
                          <radialGradient id="puckPulse" cx="50%" cy="50%" r="50%">
                            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.5" />
                            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                          </radialGradient>
                        </defs>

                        {/* Map Base Canvas */}
                        <rect width="500" height="280" fill="#f4f3f0" />

                        {/* Light Green Parks / Terrain */}
                        <path d="M 0 0 L 110 0 L 95 60 L 50 85 L 0 55 Z" fill="#e8f5e9" />
                        <path d="M 170 120 C 190 110, 220 115, 230 140 C 240 165, 210 185, 180 180 C 160 175, 155 140, 170 120 Z" fill="#e8f5e9" />
                        <path d="M 390 0 L 480 0 L 450 70 L 370 60 Z" fill="#e8f5e9" />
                        <path d="M 400 170 C 430 160, 470 170, 500 190 L 500 270 L 450 270 C 420 250, 390 200, 400 170 Z" fill="#e8f5e9" />

                        {/* Secondary Grid Streets */}
                        <g stroke="#ffffff" strokeWidth="6" strokeLinecap="round" fill="none">
                          <line x1="0" y1="80" x2="500" y2="80" />
                          <line x1="80" y1="0" x2="80" y2="280" />
                          <line x1="260" y1="0" x2="260" y2="280" />
                          <line x1="360" y1="0" x2="360" y2="280" />
                          <line x1="0" y1="140" x2="500" y2="140" />
                          <line x1="0" y1="200" x2="500" y2="200" />
                          <line x1="300" y1="110" x2="480" y2="110" />
                        </g>

                        {/* Major Highway Outer Ring / Bypass */}
                        <path d="M 0 230 Q 90 210 180 135 T 350 35 L 500 10" fill="none" stroke="#ffffff" strokeWidth="11" strokeLinecap="round" />
                        <path d="M 0 230 Q 90 210 180 135 T 350 35 L 500 10" fill="none" stroke="#fed7aa" strokeWidth="7" strokeLinecap="round" />

                        {/* Mount Poonamallee Road */}
                        <path d="M 110 0 L 250 140 L 390 280" fill="none" stroke="#ffffff" strokeWidth="9" />
                        <path d="M 110 0 L 250 140 L 390 280" fill="none" stroke="#fef08a" strokeWidth="5" />

                        {/* Railway line */}
                        <g stroke="#94a3b8" strokeWidth="2" strokeDasharray="6 4" fill="none">
                          <path d="M 230 280 L 310 170 L 420 100 L 500 60" />
                        </g>

                        {/* Map Labels */}
                        {/* Guindy */}
                        <text x="35" y="42" fill="#475569" fontSize="13" fontWeight="800" fontFamily="sans-serif">
                          Guindy
                        </text>
                        {/* Mount Poonamallee Rd */}
                        <text
                          x="115"
                          y="85"
                          fill="#64748b"
                          fontSize="9.5"
                          fontWeight="700"
                          fontFamily="sans-serif"
                          transform="rotate(45 115 85)"
                        >
                          Mount Poonamallee Rd
                        </text>
                        {/* Porur */}
                        <text x="35" y="195" fill="#475569" fontSize="11" fontWeight="700" fontFamily="sans-serif">
                          Porur
                        </text>
                        {/* Mount Bypass Rd */}
                        <text
                          x="80"
                          y="190"
                          fill="#64748b"
                          fontSize="9"
                          fontWeight="700"
                          fontFamily="sans-serif"
                          transform="rotate(-15 80 190)"
                        >
                          Mount Bypass Rd
                        </text>
                        {/* Road 32 Badge */}
                        <g transform="translate(65, 202)">
                          <rect x="0" y="0" width="20" height="14" rx="3" fill="#eab308" stroke="#ca8a04" strokeWidth="1" />
                          <text x="4" y="10.5" fill="#0f172a" fontSize="8.5" fontWeight="900" fontFamily="sans-serif">
                            32
                          </text>
                        </g>

                        {/* Guindy Railway Station */}
                        <g transform="translate(260, 218)">
                          <circle cx="6" cy="6" r="4.5" fill="#3b82f6" />
                          <text x="3" y="9" fill="#ffffff" fontSize="6.5" fontWeight="900">
                            🚆
                          </text>
                          <text x="14" y="9" fill="#1e40af" fontSize="9" fontWeight="700" fontFamily="sans-serif">
                            Guindy Railway Station
                          </text>
                        </g>

                        {/* SIDCO Industrial Estate area label */}
                        <text x="318" y="115" fill="#475569" fontSize="9.5" fontWeight="700" fontFamily="sans-serif">
                          SIDCO
                        </text>
                        <text x="295" y="127" fill="#475569" fontSize="9.5" fontWeight="700" fontFamily="sans-serif">
                          Industrial Estate
                        </text>

                        {/* ACTIVE NAVIGATION ROUTE LINE (Vibrant Blue with highlight) */}
                        <path
                          d="M 225 235 L 225 190 Q 230 170 270 165 L 280 165 L 280 108"
                          fill="none"
                          stroke="#1e3a8a"
                          strokeWidth="7"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          opacity="0.3"
                        />
                        <path
                          d="M 225 235 L 225 190 Q 230 170 270 165 L 280 165 L 280 108"
                          fill="none"
                          stroke="#2563eb"
                          strokeWidth="6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M 225 235 L 225 190 Q 230 170 270 165 L 280 165 L 280 108"
                          fill="none"
                          stroke="#60a5fa"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />

                        {/* CURRENT LOCATION NAVIGATION PUCK (at 225, 235) */}
                        <g transform="translate(225, 235)">
                          <circle r="18" fill="url(#puckPulse)" />
                          <circle r="11" fill="#2563eb" stroke="#ffffff" strokeWidth="2.5" filter="url(#pinShadow)" />
                          <polygon points="0,-6 5,5 0,3 -5,5" fill="#ffffff" />
                        </g>

                        {/* DESTINATION PIN & SPEECH BUBBLE CALLOUT (at 280, 108) */}
                        <g transform="translate(280, 108)">
                          <ellipse cx="0" cy="0" rx="4" ry="2" fill="#0f172a" opacity="0.3" />
                          <path
                            d="M 0 -22 C -6 -22 -10 -17 -10 -11 C -10 -4 0 0 0 0 C 0 0 10 -4 10 -11 C 10 -17 6 -22 0 -22 Z"
                            fill="#ef4444"
                            stroke="#dc2626"
                            strokeWidth="1"
                            filter="url(#pinShadow)"
                          />
                          <circle cx="0" cy="-11" r="3.5" fill="#ffffff" />

                          {/* Floating Speech Bubble Callout */}
                          <g transform="translate(-20, -54)" filter="url(#calloutShadow)">
                            <rect
                              x="0"
                              y="0"
                              width={Math.max(160, (workflowState.order.customerName.length * 8) + 20)}
                              height="26"
                              rx="6"
                              fill="#ffffff"
                              stroke="#FFDE7A"
                              strokeWidth="1.5"
                            />
                            <polygon points="16,26 24,26 20,31" fill="#ffffff" />
                            <text
                              x="10"
                              y="17"
                              fill="#0f172a"
                              fontSize="9.5"
                              fontWeight="800"
                              fontFamily="sans-serif"
                            >
                              {workflowState.order.customerName}
                            </text>
                          </g>
                        </g>

                        {/* Google Logo at Bottom Left */}
                        <g transform="translate(14, 268)">
                          <text fontSize="14" fontWeight="800" fontFamily="'Product Sans', sans-serif">
                            <tspan fill="#4285F4">G</tspan>
                            <tspan fill="#EA4335">o</tspan>
                            <tspan fill="#FBBC05">o</tspan>
                            <tspan fill="#4285F4">g</tspan>
                            <tspan fill="#34A853">l</tspan>
                            <tspan fill="#EA4335">e</tspan>
                          </text>
                        </g>
                      </svg>

                      {/* Map Controls Floating on Right */}
                      <div className={styles.mapControlsColumn}>
                        <button
                          type="button"
                          className={styles.mapCompassBtn}
                          onClick={() => setMapZoom(1)}
                          title="Recenter / My Location"
                        >
                          <Crosshair size={18} />
                        </button>
                        <div className={styles.mapZoomStack}>
                          <button
                            type="button"
                            className={styles.mapZoomBtn}
                            onClick={() => setMapZoom((prev) => Math.min(prev + 0.25, 2))}
                            title="Zoom In"
                          >
                            <Plus size={16} />
                          </button>
                          <div className={styles.zoomDivider} />
                          <button
                            type="button"
                            className={styles.mapZoomBtn}
                            onClick={() => setMapZoom((prev) => Math.max(prev - 0.25, 0.75))}
                            title="Zoom Out"
                          >
                            <Minus size={16} />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Destination & Trip Metrics Panel */}
                    <div className={styles.mapBottomPanel}>
                      {/* Destination Row */}
                      <div className={styles.destHeaderRow}>
                        <div className={styles.destLeftCol}>
                          <div className={styles.destTagRow}>
                            <MapPin size={14} className={styles.destPinIcon} />
                            <span className={styles.destTagText}>DESTINATION</span>
                          </div>
                          <h4 className={styles.destCustomerName}>
                            {workflowState.order.customerName}
                          </h4>
                          <p className={styles.destAddressText}>
                            {workflowState.order.address}
                          </p>
                        </div>
                        <a
                          href={`https://maps.google.com/?q=${encodeURIComponent(workflowState.order.address)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.destViewDetailsBtn}
                        >
                          <Navigation size={13} style={{ transform: 'rotate(45deg)' }} />
                          <span>View Details</span>
                        </a>
                      </div>

                      <div className={styles.panelDivider} />

                      {/* 3 Metrics Row */}
                      <div className={styles.destMetricsGrid}>
                        <div className={styles.destMetricBox}>
                          <div className={styles.destMetricIconCircle}>
                            <Navigation size={14} style={{ transform: 'rotate(45deg)' }} />
                          </div>
                          <strong className={styles.destMetricVal}>4.2 km</strong>
                          <span className={styles.destMetricLabel}>Distance</span>
                        </div>

                        <div className={styles.destMetricBox}>
                          <div className={styles.destMetricIconCircle}>
                            <Clock size={14} />
                          </div>
                          <strong className={styles.destMetricVal}>14 min</strong>
                          <span className={styles.destMetricLabel}>Est. Arrival</span>
                        </div>

                        <div className={styles.destMetricBox}>
                          <div className={styles.destMetricIconCircle}>
                            <Car size={14} />
                          </div>
                          <strong className={styles.destMetricValGreen}>Light Traffic</strong>
                          <span className={styles.destMetricLabel}>Route Status</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* AGREED BUYING RATE CARD */}
                  <div className={styles.agreedRateCard}>
                    <div className={styles.agreedRateLeft}>
                      <div className={styles.agreedRateIconWrap}>
                        <FileText size={18} />
                      </div>
                      <div className={styles.agreedRateTextCol}>
                        <span className={styles.agreedRateTag}>AGREED BUYING RATE</span>
                        <strong className={styles.agreedRateMaterial}>
                          {workflowState.order.materialName}
                        </strong>
                      </div>
                    </div>
                    <div className={styles.agreedRatePriceBig}>
                      ₹{workflowState.agreedRate || 42} / KG
                    </div>
                  </div>

                  {/* DUAL ACTION BUTTONS */}
                  <div className={styles.navDualActionsGrid}>
                    <a
                      href={`https://maps.google.com/?q=${encodeURIComponent(workflowState.order.address)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.btnOpenGoogleMaps}
                    >
                      <ExternalLink size={16} />
                      <span>Open in Google Maps</span>
                    </a>
                    <a href="tel:+919876543210" className={styles.btnCallFactory}>
                      <Phone size={16} />
                      <span>Call Factory Desk</span>
                    </a>
                  </div>

                  {/* BIG YELLOW PRIMARY CTA */}
                  <button
                    type="button"
                    className={styles.btnArrivedAtFactory}
                    onClick={handleMarkArrived}
                  >
                    <CheckCircle2 size={18} />
                    <span>I Have Arrived at Factory Location</span>
                    <ArrowRight size={18} />
                  </button>
                </div>
              )}

              {/* STAGE 2: PICKUP OTP VERIFICATION */}
              {workflowState.stage === 'pickup_otp' && (
                <form onSubmit={handleVerifyPickupOtp} className={styles.stageContentBox}>
                  <div className={styles.stageHeroBadge}>
                    <ShieldCheck size={18} />
                    <span>Stage 2: Customer Pickup OTP Verification</span>
                  </div>

                  <p className={styles.stageInstructionText}>
                    Ask the industry representative or gate executive for the <strong>4-Digit Pickup OTP</strong> to verify physical loading.
                  </p>

                  <div className={styles.otpInputGroup}>
                    <label className={styles.otpLabel}>Enter 4-Digit Pickup OTP</label>
                    <input
                      type="text"
                      maxLength={4}
                      value={workflowState.pickupOtpInput}
                      onChange={(e) =>
                        setWorkflowState({ ...workflowState, pickupOtpInput: e.target.value })
                      }
                      className={styles.otpLargeInput}
                      placeholder="• • • •"
                      autoFocus
                    />
                    <span className={styles.otpHelperText}>
                      Sample Demo OTP: <strong>4829</strong> (Auto-filled for testing)
                    </span>
                  </div>

                  <button type="submit" className={styles.primaryActionCta}>
                    <CheckCircle2 size={16} />
                    <span>Verify Pickup OTP &amp; Proceed to Weighing</span>
                  </button>
                </form>
              )}

              {/* STAGE 3: WEIGHING & MULTI-PRODUCT BILL PREPARATION */}
              {workflowState.stage === 'weighing' && (
                <form onSubmit={handleConfirmWeighing} className={styles.stageContentBox}>
                  <div className={styles.billPrepHeaderRow}>
                    <div className={styles.stageHeroBadge}>
                      <Scale size={18} />
                      <span>Stage 3: Calibrated Digital Weighing &amp; Bill Preparation</span>
                    </div>

                    <button
                      type="button"
                      className={styles.addBillProductBtn}
                      onClick={handleAddBillItem}
                    >
                      <Plus size={16} />
                      <span>+ Add Blank Product</span>
                    </button>
                  </div>

                  <p className={styles.billInstructionNotice}>
                    Search scrap catalog to quickly add items or record digital scale weights and unit prices. System automatically computes individual amounts and the final tax invoice.
                  </p>

                  {/* UNIVERSAL TOP SCRAP SEARCH & CATEGORY/SUBCATEGORY EXPLORER */}
                  <div className={styles.universalScrapSearchBox}>
                    <div className={styles.scrapSearchHeaderRow}>
                      <label className={styles.scrapSearchHeaderLabel}>
                        <span>SCRAP PRICE CATALOG &amp; QUICK ADD</span>
                      </label>
                      <span className={styles.scrapSearchHelpText}>
                        Select category or search to instantly add products with market rates
                      </span>
                    </div>

                    {/* Universal Top Search Input */}
                    <div className={styles.scrapSearchInputWrapper}>
                      <Search size={18} className={styles.scrapSearchIcon} />
                      <input
                        type="text"
                        value={scrapSearchQuery}
                        onChange={(e) => setScrapSearchQuery(e.target.value)}
                        placeholder="Search any scrap (e.g. Iron, Tin, Copper, Aluminium, Cardboard, Plastic, Battery, Wires...)"
                        className={styles.scrapSearchInput}
                      />
                      {scrapSearchQuery && (
                        <button
                          type="button"
                          className={styles.clearSearchQueryBtn}
                          onClick={() => setScrapSearchQuery('')}
                          title="Clear search"
                        >
                          <X size={14} />
                        </button>
                      )}
                    </div>

                    {/* Search Mode OR Category Explorer Mode */}
                    {scrapSearchQuery.trim() ? (
                      <div className={styles.searchLiveResultsBox}>
                        <div className={styles.searchLiveResultsHeader}>
                          <span>Search Results for "{scrapSearchQuery.trim()}"</span>
                        </div>
                        <div className={styles.subCategoryCardsGrid}>
                          {MARKET_SCRAP_CATEGORIES.flatMap((c) =>
                            c.items
                              .filter((item) =>
                                item.name.toLowerCase().includes(scrapSearchQuery.toLowerCase()) ||
                                c.name.toLowerCase().includes(scrapSearchQuery.toLowerCase()) ||
                                (item.quality && item.quality.toLowerCase().includes(scrapSearchQuery.toLowerCase()))
                              )
                              .map((item) => ({ ...item, categoryName: c.name }))
                          ).map((item) => (
                            <div
                              key={item.id}
                              className={styles.subCategoryCard}
                              onClick={() => handleAddMarketSubItem(item)}
                            >
                              <div className={styles.subCategoryCardTop}>
                                <span className={styles.subCategoryCategoryTag}>
                                  {item.categoryName}
                                </span>
                                <span className={styles.subCategoryPriceBadge}>
                                  ₹{item.defaultRate} / {item.unit}
                                </span>
                              </div>
                              <strong className={styles.subCategoryName}>{item.name}</strong>
                              {item.quality && (
                                <span className={styles.subCategoryQuality}>{item.quality}</span>
                              )}
                              <button type="button" className={styles.addSubItemBtn}>
                                <span>+ Add to Bill</span>
                              </button>
                            </div>
                          ))}

                          <div
                            className={styles.customAddSubCard}
                            onClick={handleAddCustomSearchItem}
                          >
                            <span className={styles.customAddTag}>Custom Material</span>
                            <strong className={styles.customAddTitle}>+ Add "{scrapSearchQuery.trim()}"</strong>
                            <span className={styles.customAddHint}>Custom rate &amp; weight can be adjusted in bill</span>
                            <button type="button" className={styles.addSubItemBtn}>
                              <span>+ Add Custom</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className={styles.categoryExplorerContainer}>
                        {/* Category Selector Tabs (Market Price Order) */}
                        <div className={styles.billingCategoryTabsTrack}>
                          {MARKET_SCRAP_CATEGORIES.map((cat) => (
                            <button
                              key={cat.id}
                              type="button"
                              className={`${styles.billingCategoryTabBtn} ${
                                selectedBillingCatId === cat.id ? styles.billingCategoryTabActive : ''
                              }`}
                              onClick={() => setSelectedBillingCatId(cat.id)}
                            >
                              <span className={styles.billingCategoryTabLabel}>{cat.name}</span>
                              <span className={styles.billingCategoryCount}>({cat.items.length})</span>
                            </button>
                          ))}
                        </div>

                        {/* Subcategories Grid for Selected Category */}
                        {(() => {
                          const activeCat =
                            MARKET_SCRAP_CATEGORIES.find((c) => c.id === selectedBillingCatId) ||
                            MARKET_SCRAP_CATEGORIES[0];
                          return (
                            <div className={styles.subCategoryExplorerSection}>
                              <div className={styles.subCategoryHeaderRow}>
                                <div className={styles.activeCatBadge}>
                                  <strong>{activeCat.name} Subcategories:</strong>
                                </div>
                                <span className={styles.clickToAddNotice}>
                                  Click any scrap item to instantly add to bill
                                </span>
                              </div>

                              <div className={styles.subCategoryCardsGrid}>
                                {activeCat.items.map((subItem) => (
                                  <div
                                    key={subItem.id}
                                    className={styles.subCategoryCard}
                                    onClick={() => handleAddMarketSubItem(subItem)}
                                  >
                                    <div className={styles.subCategoryCardTop}>
                                      <strong className={styles.subCategoryName}>{subItem.name}</strong>
                                      <span className={styles.subCategoryPriceBadge}>
                                        ₹{subItem.defaultRate} / {subItem.unit}
                                      </span>
                                    </div>
                                    {subItem.quality && (
                                      <span className={styles.subCategoryQuality}>{subItem.quality}</span>
                                    )}
                                    <div className={styles.subCategoryCardBottom}>
                                      <span className={styles.marketStandardTag}>Market Rate</span>
                                      <button type="button" className={styles.addSubItemBtn}>
                                        <span>+ Add</span>
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    )}
                  </div>

                  {/* Multi-Item Form List */}
                  <div className={styles.billItemsStack}>
                    {workflowState.items.map((item, index) => (
                      <div key={item.id} className={styles.billItemCard}>
                        {/* 1. Card Top Bar: Product Index + Material Name + Delete */}
                        <div className={styles.billItemCardHeader}>
                          <div className={styles.productHeaderLeft}>
                            <div className={styles.itemIndexPill}>
                              <Layers size={13} />
                              <span>Product #{index + 1}</span>
                            </div>
                            <input
                              type="text"
                              value={item.materialName}
                              onChange={(e) => handleUpdateBillItem(item.id, 'materialName', e.target.value)}
                              placeholder="Scrap Material Name (e.g. Scrap Iron, Copper Scrap, Tin...)"
                              className={styles.billMaterialTitleInput}
                              required
                            />
                          </div>

                          {workflowState.items.length > 1 && (
                            <button
                              type="button"
                              className={styles.deleteLineItemBtn}
                              onClick={() => handleRemoveBillItem(item.id)}
                              title="Delete this product"
                            >
                              <Trash2 size={15} />
                            </button>
                          )}
                        </div>

                        {/* 2. Unified Calculation Layout: Weight × Rate in 1 row, Amount next row on mobile */}
                        <div className={styles.singleCalculationRow}>
                          {/* Inputs Row: Weight × Rate */}
                          <div className={styles.calcInputsGroup}>
                            {/* Weight */}
                            <div className={styles.calcFieldCol}>
                              <label className={styles.calcFieldLabel}>Weighed Weight</label>
                              <div className={styles.unitInputWrapper}>
                                <input
                                  type="number"
                                  step="any"
                                  min="0"
                                  value={item.weightKg}
                                  onChange={(e) => handleUpdateBillItem(item.id, 'weightKg', e.target.value)}
                                  placeholder="0.0"
                                  className={styles.billNumberInput}
                                  required
                                />
                                <span className={styles.unitSuffix}>{item.unit || 'KG'}</span>
                              </div>
                            </div>

                            <div className={styles.calcOperator}>×</div>

                            {/* Rate */}
                            <div className={styles.calcFieldCol}>
                              <label className={styles.calcFieldLabel}>Rate (₹ / {item.unit || 'KG'})</label>
                              <div className={styles.unitInputWrapper}>
                                <span className={styles.currencyPrefix}>₹</span>
                                <input
                                  type="number"
                                  step="any"
                                  min="0"
                                  value={item.unitRate}
                                  onChange={(e) => handleUpdateBillItem(item.id, 'unitRate', e.target.value)}
                                  placeholder="0"
                                  className={styles.billNumberInput}
                                  required
                                />
                              </div>
                            </div>
                          </div>

                          <div className={`${styles.calcOperator} ${styles.calcEqualsDesktop}`}>=</div>

                          {/* Amount */}
                          <div className={styles.calcAmountCol}>
                            <label className={styles.calcFieldLabel}>Item Amount</label>
                            <div className={styles.calcAmountDisplayBox}>
                              <span className={styles.calcCurrencySymbol}>₹</span>
                              <strong className={styles.calcAmountValue}>
                                {item.amount.toLocaleString('en-IN')}
                              </strong>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Add Product Button Secondary */}
                  <button
                    type="button"
                    className={styles.addAnotherProductDashedBtn}
                    onClick={handleAddBillItem}
                  >
                    <Plus size={18} />
                    <span>+ Add Another Scrap Material to Bill</span>
                  </button>

                  {/* Deductions & GST Settings */}
                  <div className={styles.billAdjustmentsGrid}>
                    <div className={styles.adjustmentCard}>
                      <label className={styles.billFieldLabel}>Handling / Loading Deductions (₹)</label>
                      <div className={styles.unitInputWrapper}>
                        <span className={styles.currencyPrefix}>₹</span>
                        <input
                          type="number"
                          min="0"
                          value={workflowState.deductions}
                          onChange={(e) =>
                            setWorkflowState({ ...workflowState, deductions: Number(e.target.value) || 0 })
                          }
                          className={styles.billNumberInput}
                          placeholder="0"
                        />
                      </div>
                      <span className={styles.fieldHint}>Optional discount or transport deduction</span>
                    </div>

                    <div className={styles.adjustmentCard}>
                      <label className={styles.billFieldLabel}>GST &amp; Tax Treatment</label>
                      <select
                        value={workflowState.gstPercent}
                        onChange={(e) =>
                          setWorkflowState({ ...workflowState, gstPercent: Number(e.target.value) || 0 })
                        }
                        className={styles.billSelectInput}
                      >
                        <option value={0}>B2B Reverse Charge RCM (0% Tax)</option>
                        <option value={5}>Standard Metal Scrap (5% GST)</option>
                        <option value={18}>Fabricated / Special Alloys (18% GST)</option>
                      </select>
                      <span className={styles.fieldHint}>Auto-generates official tax invoice compliant with GST</span>
                    </div>
                  </div>

                  {/* Live Final Calculation Summary Card */}
                  <div className={styles.liveBillSummaryCard}>
                    <div className={styles.summaryTopRow}>
                      <div className={styles.summaryMetric}>
                        <span className={styles.summaryMetricLabel}>Total Products</span>
                        <strong className={styles.summaryMetricVal}>{workflowState.items.length} Items</strong>
                      </div>
                      <div className={styles.summaryMetricDivider} />
                      <div className={styles.summaryMetric}>
                        <span className={styles.summaryMetricLabel}>Total Net Weight</span>
                        <strong className={styles.summaryMetricVal}>{calculateTotalWeight().toLocaleString('en-IN')} KG</strong>
                      </div>
                      <div className={styles.summaryMetricDivider} />
                      <div className={styles.summaryMetric}>
                        <span className={styles.summaryMetricLabel}>Items Subtotal</span>
                        <strong className={styles.summaryMetricVal}>₹{calculateSubtotal().toLocaleString('en-IN')}</strong>
                      </div>
                    </div>

                    <div className={styles.summaryBreakdownTable}>
                      <div className={styles.summaryLineRow}>
                        <span>Gross Materials Subtotal:</span>
                        <span>₹{calculateSubtotal().toLocaleString('en-IN')}</span>
                      </div>
                      {workflowState.deductions > 0 && (
                        <div className={styles.summaryLineRow}>
                          <span>Less Deductions:</span>
                          <span className={styles.deductionRed}>- ₹{workflowState.deductions.toLocaleString('en-IN')}</span>
                        </div>
                      )}
                      {workflowState.gstPercent > 0 && (
                        <div className={styles.summaryLineRow}>
                          <span>GST ({workflowState.gstPercent}%):</span>
                          <span>+ ₹{calculateGstAmount(calculateSubtotal()).toLocaleString('en-IN')}</span>
                        </div>
                      )}
                      <div className={styles.summaryGrandTotalRow}>
                        <div className={styles.grandTotalTextCol}>
                          <span className={styles.grandTotalLabel}>FINAL PAYABLE INVOICE AMOUNT</span>
                          <span className={styles.grandTotalSub}>Spot Settlement to Customer</span>
                        </div>
                        <strong className={styles.grandTotalAmountHighlight}>
                          ₹{calculateGrandTotal().toLocaleString('en-IN')}
                        </strong>
                      </div>
                    </div>
                  </div>

                  <button type="submit" className={styles.primaryActionCta}>
                    <FileText size={18} />
                    <span>Confirm Weights &amp; Generate Tax Invoice Bill (₹{calculateGrandTotal().toLocaleString('en-IN')})</span>
                  </button>
                </form>
              )}

              {/* STAGE 4: TAX INVOICE BILL GENERATION */}
              {workflowState.stage === 'bill_generated' && (
                <div className={styles.stageContentBox}>
                  <div className={styles.stageHeroBadge}>
                    <Receipt size={18} />
                    <span>Stage 4: Official Tax Invoice &amp; Bill Breakdown</span>
                  </div>

                  {/* Professional Invoice Slip Card */}
                  <div className={styles.invoiceSlipCard}>
                    <div className={styles.invoiceSlipHeader}>
                      <div className={styles.invoiceShopInfo}>
                        <span className={styles.billNumberTag}>{workflowState.billNumber}</span>
                        <h4 className={styles.invoiceShopTitle}>Ramesh Traders</h4>
                        <span className={styles.invoiceShopTagline}>Certified Scrap Merchant &amp; Recycler</span>
                        <span className={styles.invoiceCustomerSubtitle}>
                          Customer: <strong>{workflowState.order.customerName}</strong> ({workflowState.order.customerType})
                        </span>
                      </div>
                      <div className={styles.invoiceMetaRight}>
                        <span className={styles.invoiceDateText}>
                          Date: {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                        <span className={styles.invoiceRcmBadge}>GST RCM Compliant</span>
                      </div>
                    </div>

                    {/* Desktop Invoice Table View */}
                    <div className={styles.invoiceTableDesktop}>
                      <div className={styles.invoiceRowHeader}>
                        <span>#</span>
                        <span>Item Description</span>
                        <span>Weighed Qty</span>
                        <span>Unit Rate</span>
                        <span className={styles.textRight}>Amount</span>
                      </div>
                      {workflowState.items.map((item, idx) => (
                        <div key={item.id} className={styles.invoiceRowData}>
                          <span>{idx + 1}</span>
                          <strong>{item.materialName}</strong>
                          <span>{item.weightKg} {item.unit}</span>
                          <span>₹{item.unitRate} / {item.unit}</span>
                          <strong className={styles.textRight}>₹{item.amount.toLocaleString('en-IN')}</strong>
                        </div>
                      ))}
                    </div>

                    {/* Mobile Invoice Cards View */}
                    <div className={styles.invoiceTableMobile}>
                      {workflowState.items.map((item, idx) => (
                        <div key={item.id} className={styles.invoiceMobileItemCard}>
                          <div className={styles.invoiceMobileItemTop}>
                            <div className={styles.invoiceMobileItemNameGroup}>
                              <span className={styles.itemIndexPillSmall}>#{idx + 1}</span>
                              <strong className={styles.invoiceMobileItemName}>{item.materialName}</strong>
                            </div>
                            <strong className={styles.invoiceMobileItemTotal}>
                              ₹{item.amount.toLocaleString('en-IN')}
                            </strong>
                          </div>
                          <div className={styles.invoiceMobileItemDetails}>
                            <span>Qty: <strong>{item.weightKg} {item.unit}</strong></span>
                            <span className={styles.dotSeparator}>•</span>
                            <span>Rate: <strong>₹{item.unitRate} / {item.unit}</strong></span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className={styles.invoiceTotalsBlock}>
                      <div className={styles.invoiceTotalRow}>
                        <span>Total Items:</span>
                        <span>{workflowState.items.length} Products</span>
                      </div>
                      <div className={styles.invoiceTotalRow}>
                        <span>Total Net Weight:</span>
                        <span>{calculateTotalWeight().toLocaleString('en-IN')} KG</span>
                      </div>
                      <div className={styles.invoiceTotalRow}>
                        <span>Gross Subtotal:</span>
                        <span>₹{calculateSubtotal().toLocaleString('en-IN')}</span>
                      </div>
                      {workflowState.deductions > 0 && (
                        <div className={styles.invoiceTotalRow}>
                          <span>Less Deductions:</span>
                          <span className={styles.deductionRed}>- ₹{workflowState.deductions.toLocaleString('en-IN')}</span>
                        </div>
                      )}
                      <div className={styles.invoiceTotalRow}>
                        <span>GST / B2B RCM ({workflowState.gstPercent}%):</span>
                        <span>
                          {workflowState.gstPercent === 0
                            ? '₹0.00 (Reverse Charge Applicable)'
                            : `+ ₹${calculateGstAmount(calculateSubtotal()).toLocaleString('en-IN')}`}
                        </span>
                      </div>
                      <div className={styles.invoiceFinalTotalRow}>
                        <strong>Final Payable Total:</strong>
                        <strong className={styles.finalTotalGreen}>
                          ₹{calculateGrandTotal().toLocaleString('en-IN')}
                        </strong>
                      </div>
                    </div>

                    {/* QR Verification Stamp */}
                    <div className={styles.invoiceStampFooter}>
                      <div className={styles.stampLeft}>
                        <QrCode size={34} className={styles.stampQr} />
                        <div className={styles.stampTextCol}>
                          <strong>DIGITALLY VERIFIED B2B INVOICE</strong>
                          <span>Ramesh Traders Scale Weighbridge &amp; Settlement</span>
                        </div>
                      </div>
                      <span className={styles.stampStatusPill}>✓ READY FOR SETTLEMENT</span>
                    </div>
                  </div>

                  <div className={styles.billActionRow}>
                    <button
                      type="button"
                      className={styles.editBillBackBtn}
                      onClick={() => setWorkflowState({ ...workflowState, stage: 'weighing' })}
                    >
                      <span>← Edit Weights &amp; Items</span>
                    </button>

                    <button
                      type="button"
                      className={styles.primaryActionCta}
                      onClick={handleSubmitBill}
                    >
                      <FileCheck size={16} />
                      <span>Submit Bill to Customer (₹{calculateGrandTotal().toLocaleString('en-IN')})</span>
                    </button>
                  </div>
                </div>
              )}

              {/* STAGE 5: PAYMENT (CUSTOMER -> MERCHANT) */}
              {workflowState.stage === 'payment' && (
                <div className={styles.stageContentBox}>
                  <div className={styles.stageHeroBadge}>
                    <MdOutlinePayment size={18} />
                    <span>Stage 5: Payment</span>
                  </div>

                  <p className={styles.stageSubtitleText}>
                    Complete payment for the finalized bill.
                  </p>

                  {/* Compact Final Bill Summary Card */}
                  <div className={styles.paymentSummaryCard}>
                    <div className={styles.paymentSummaryTop}>
                      <div className={styles.billNumberBlock}>
                        <span className={styles.summarySmallLabel}>BILL NUMBER</span>
                        <strong className={styles.summaryBillNum}>{workflowState.billNumber}</strong>
                      </div>

                      {/* Payment Status Badge */}
                      {(!workflowState.paymentRecord || workflowState.paymentRecord.status === 'PENDING') && (
                        <span className={styles.paymentStatusPillPending}>
                          <FiClock size={11} />
                          <span>Payment Pending</span>
                        </span>
                      )}
                      {workflowState.paymentRecord?.status === 'INITIATED' && (
                        <span className={styles.paymentStatusPillInitiated}>
                          <FiClock size={11} />
                          <span>Payment Initiated</span>
                        </span>
                      )}
                      {workflowState.paymentRecord?.status === 'SUBMITTED' && (
                        <span className={styles.paymentStatusPillSubmitted}>
                          <FiClock size={11} />
                          <span>Payment Submitted</span>
                        </span>
                      )}
                      {workflowState.paymentRecord?.status === 'CONFIRMED' && (
                        <span className={styles.paymentStatusPillConfirmed}>
                          <FiCheckCircle size={11} />
                          <span>Payment Confirmed</span>
                        </span>
                      )}
                    </div>

                    <div className={styles.summaryAmountRow}>
                      <div className={styles.summaryAmountCol}>
                        <span className={styles.summarySmallLabel}>FINAL PAYABLE AMOUNT</span>
                        <div className={styles.summaryAmountValGroup}>
                          <LuIndianRupee className={styles.summaryRupeeIcon} />
                          <strong className={styles.summaryAmountVal}>
                            {calculateGrandTotal().toLocaleString('en-IN')}
                          </strong>
                        </div>
                      </div>
                      <div className={styles.summaryWeightCol}>
                        <span className={styles.summarySmallLabel}>ACTUAL WEIGHT</span>
                        <strong className={styles.summaryWeightVal}>
                          {calculateTotalWeight().toLocaleString('en-IN')} KG
                        </strong>
                      </div>
                    </div>
                  </div>

                  {/* Payment Method Selector */}
                  <div className={styles.methodSelectorWrap}>
                    <span className={styles.methodSelectLabel}>Payment Method</span>
                    <div className={styles.methodSegmentedControl}>
                      <button
                        type="button"
                        className={`${styles.segmentBtn} ${
                          (!workflowState.paymentRecord || workflowState.paymentRecord.method === 'UPI')
                            ? styles.segmentBtnActive
                            : ''
                        }`}
                        onClick={() => handleSelectPaymentMethod('UPI')}
                      >
                        <MdOutlinePayment size={16} />
                        <span>UPI</span>
                      </button>
                      <button
                        type="button"
                        className={`${styles.segmentBtn} ${
                          workflowState.paymentRecord?.method === 'CASH' ? styles.segmentBtnActive : ''
                        }`}
                        onClick={() => handleSelectPaymentMethod('CASH')}
                      >
                        <LuWallet size={16} />
                        <span>Cash</span>
                      </button>
                    </div>
                  </div>

                  {/* VIEW A: UPI METHOD */}
                  {(!workflowState.paymentRecord || workflowState.paymentRecord.method === 'UPI') && (
                    <div className={styles.upiContainerCard}>
                      <div className={styles.payeeInfoRow}>
                        <div className={styles.payeeCol}>
                          <span className={styles.payeeLabel}>Payee Merchant</span>
                          <strong className={styles.payeeNameText}>
                            {workflowState.paymentRecord?.payeeName || DEFAULT_MERCHANT_PAYEE_NAME}
                          </strong>
                        </div>
                        <div className={styles.payeeUpiBox}>
                          <span className={styles.payeeUpiText}>
                            {workflowState.paymentRecord?.payeeUpiId || DEFAULT_MERCHANT_UPI_ID}
                          </span>
                          <button
                            type="button"
                            className={`${styles.miniCopyBtn} ${copiedPayeeUpi ? styles.miniCopyBtnCopied : ''}`}
                            onClick={handleCopyPayeeUpi}
                            title="Copy Merchant UPI ID"
                          >
                            <FiCopy size={12} />
                            <span>{copiedPayeeUpi ? 'Copied' : 'Copy'}</span>
                          </button>
                        </div>
                      </div>

                      {/* Primary Pay by any UPI app CTA */}
                      <button
                        type="button"
                        className={styles.btnPayByUpiApp}
                        onClick={handlePayByAnyUpi}
                      >
                        <MdOutlinePayment size={18} />
                        <span>Pay by any UPI app (₹{calculateGrandTotal().toLocaleString('en-IN')})</span>
                      </button>

                      <p className={styles.paymentFlowHint}>
                        Pay using your preferred UPI app. Return to BillScrap and enter the UTR below.
                      </p>

                      {/* UTR Input Form */}
                      <form onSubmit={handleSubmitPaymentUtr} className={styles.utrFormCard}>
                        <label htmlFor="orderUtrInput" className={styles.utrFormLabel}>
                          UTR / Transaction ID
                        </label>
                        <div className={styles.utrInputRow}>
                          <input
                            id="orderUtrInput"
                            type="text"
                            value={utrInputValue}
                            onChange={(e) => {
                              setUtrInputValue(e.target.value);
                              if (utrInputError) setUtrInputError('');
                            }}
                            placeholder={
                              workflowState.paymentRecord?.utr
                                ? `Recorded: ${workflowState.paymentRecord.utr}`
                                : 'Enter UTR / Transaction ID'
                            }
                            className={`${styles.utrInputBox} ${utrInputError ? styles.utrInputError : ''}`}
                            maxLength={32}
                          />
                          <button
                            type="submit"
                            className={styles.btnRecordUtr}
                          >
                            <LuShieldCheck size={16} />
                            <span>I've Made the Payment</span>
                          </button>
                        </div>
                        {utrInputError && (
                          <span className={styles.utrErrorMsg}>
                            <FiAlertCircle size={12} />
                            <span>{utrInputError}</span>
                          </span>
                        )}

                        {workflowState.paymentRecord?.status === 'SUBMITTED' && workflowState.paymentRecord.utr && (
                          <div className={styles.submittedNoticeBanner}>
                            <FiCheckCircle size={14} className={styles.submittedCheckIcon} />
                            <div className={styles.submittedNoticeText}>
                              <strong>Payment Submitted</strong>
                              <span>Reference: {workflowState.paymentRecord.utr}</span>
                            </div>
                          </div>
                        )}
                      </form>
                    </div>
                  )}

                  {/* VIEW B: CASH METHOD */}
                  {workflowState.paymentRecord?.method === 'CASH' && (
                    <div className={styles.cashContainerCard}>
                      <div className={styles.cashNoticeBox}>
                        <div className={styles.cashIconWrap}>
                          <LuWallet size={24} />
                        </div>
                        <div className={styles.cashTextGroup}>
                          <h4 className={styles.cashTitle}>Cash Payment</h4>
                          <p className={styles.cashSub}>
                            Confirm that the customer has paid the final bill amount in cash.
                          </p>
                        </div>
                      </div>

                      <div className={styles.cashAmountHighlightCard}>
                        <span className={styles.cashAmountLabel}>Final Amount</span>
                        <div className={styles.cashAmountValRow}>
                          <LuIndianRupee size={22} className={styles.cashRupeeIcon} />
                          <strong className={styles.cashAmountVal}>
                            {calculateGrandTotal().toLocaleString('en-IN')}
                          </strong>
                        </div>
                      </div>

                      {workflowState.paymentRecord?.status !== 'CONFIRMED' ? (
                        <button
                          type="button"
                          className={styles.btnConfirmCash}
                          onClick={handleConfirmCashPayment}
                        >
                          <FiCheckCircle size={16} />
                          <span>Confirm Cash Payment</span>
                        </button>
                      ) : (
                        <div className={styles.cashConfirmedBanner}>
                          <FiCheckCircle size={16} className={styles.cashConfirmedIcon} />
                          <span>Cash payment confirmed (₹{calculateGrandTotal().toLocaleString('en-IN')})</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Bottom Navigation Actions */}
                  <div className={styles.paymentActionRow}>
                    <button
                      type="button"
                      className={styles.editBillBackBtn}
                      onClick={() => setWorkflowState({ ...workflowState, stage: 'bill_generated' })}
                    >
                      <span>← Back to Bill</span>
                    </button>

                    <button
                      type="button"
                      className={`${styles.primaryActionCta} ${
                        workflowState.paymentRecord?.status !== 'SUBMITTED' &&
                        workflowState.paymentRecord?.status !== 'CONFIRMED'
                          ? styles.primaryActionCtaDisabled
                          : ''
                      }`}
                      onClick={handleProceedToSettlement}
                      disabled={
                        workflowState.paymentRecord?.status !== 'SUBMITTED' &&
                        workflowState.paymentRecord?.status !== 'CONFIRMED'
                      }
                    >
                      <ShieldCheck size={16} />
                      <span>Continue to Settlement →</span>
                    </button>
                  </div>

                  {workflowState.paymentRecord?.status !== 'SUBMITTED' &&
                    workflowState.paymentRecord?.status !== 'CONFIRMED' && (
                      <p className={styles.settlementPendingNotice}>
                        <FiAlertCircle size={13} />
                        <span>Payment must be submitted or confirmed before continuing to Settlement.</span>
                      </p>
                    )}
                </div>
              )}

              {/* STAGE 6: SETTLEMENT CONFIRMATION OTP */}
              {workflowState.stage === 'billing_otp' && (
                <form onSubmit={handleVerifyBillingOtp} className={styles.stageContentBox}>
                  <div className={styles.stageHeroBadge}>
                    <ShieldCheck size={18} />
                    <span>Stage 6: Settlement Confirmation</span>
                  </div>

                  <p className={styles.stageInstructionText}>
                    The customer representative has reviewed the digital bill and payment details. Ask them for the <strong>4-Digit Settlement Confirmation OTP</strong> to complete settlement of <strong>₹{calculateGrandTotal().toLocaleString('en-IN')}</strong>.
                  </p>

                  <div className={styles.otpInputGroup}>
                    <label className={styles.otpLabel}>Enter 4-Digit Settlement OTP</label>
                    <input
                      type="text"
                      maxLength={4}
                      value={workflowState.billingOtpInput}
                      onChange={(e) =>
                        setWorkflowState({ ...workflowState, billingOtpInput: e.target.value })
                      }
                      className={styles.otpLargeInput}
                      placeholder="• • • •"
                      autoFocus
                    />
                    <span className={styles.otpHelperText}>
                      Sample Demo Settlement OTP: <strong>7104</strong> (Auto-filled for instant verification)
                    </span>
                  </div>

                  <div className={styles.billActionRow}>
                    <button
                      type="button"
                      className={styles.editBillBackBtn}
                      onClick={() => setWorkflowState({ ...workflowState, stage: 'payment' })}
                    >
                      <span>← Back to Payment</span>
                    </button>

                    <button type="submit" className={styles.primaryActionCta}>
                      <CheckCircle2 size={16} />
                      <span>Confirm Settlement &amp; Complete Order</span>
                    </button>
                  </div>
                </form>
              )}

              {/* STAGE 6: SETTLED & COMPLETED */}
              {workflowState.stage === 'settled' && (
                <div className={styles.stageContentBox}>
                  <div className={styles.settledSuccessCard}>
                    <div className={styles.settledCheckIcon}>✓</div>
                    <h4 className={styles.settledTitle}>Order Successfully Settled!</h4>
                    <p className={styles.settledSub}>
                      Digital weight slip and tax invoice have been generated and archived for <strong>{workflowState.items.length} items</strong>. Payment credited to your registered account.
                    </p>
                    <div className={styles.settledSummaryRow}>
                      <span>Bill #: <strong>{workflowState.billNumber}</strong></span>
                      <span>Total Amount: <strong className={styles.settledAmountGreen}>₹{calculateGrandTotal().toLocaleString('en-IN')}</strong></span>
                    </div>
                  </div>

                  <div className={styles.settledActionsStack}>
                    <button
                      type="button"
                      className={styles.downloadInvoiceBtn}
                      onClick={() => triggerToast(`Downloading PDF Tax Invoice for ${workflowState.billNumber}`)}
                    >
                      <Download size={16} />
                      <span>Download Tax Invoice &amp; Slip (PDF)</span>
                    </button>
                    <button
                      type="button"
                      className={styles.closeWorkflowBtn}
                      onClick={handleCloseSettledDetails}
                    >
                      <span>Close Order Details</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
