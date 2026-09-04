import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Package,
  CheckCircle2,
  Truck,
  Clock,
  XCircle,
  ChevronDown,
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
} from 'lucide-react';
import { CardImageGallery } from '@/components/cards/CardImageGallery';
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
  stage: 'navigation' | 'pickup_otp' | 'weighing' | 'bill_generated' | 'billing_otp' | 'settled';
  pickupOtpInput: string;
  items: BillLineItem[];
  gstPercent: number;
  deductions: number;
  billingOtpInput: string;
  billNumber: string;
  agreedRate?: number | string;
  actualWeight?: number | string;
}

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
  address: string;
  orderConfirmed: string;
  pickupDate: string;
  pickupTime: string;
  statusText: OrderStatus;
  statusType: 'pending' | 'scheduled' | 'completed' | 'cancelled';
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
    address: '24, 5th Main Road, SIDCO Industrial Estate, Guindy, Chennai – 600032, Tamil Nadu',
    orderConfirmed: '13 May 2025, 10:15 AM',
    pickupDate: '16 May 2025',
    pickupTime: '10:00 AM – 12:00 PM',
    statusText: 'Scheduled',
    statusType: 'scheduled',
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
    address: '12/1, Ambattur Industrial Estate, Ambattur, Chennai – 600058, Tamil Nadu',
    orderConfirmed: '13 May 2025, 02:05 PM',
    pickupDate: '13 May 2025',
    pickupTime: '02:00 PM – 04:00 PM',
    statusText: 'Pending',
    statusType: 'pending',
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
    materialName: 'Brass Honey & Alloy Turnings Scrap',
    materialCondition: 'Mixed',
    image: '/scrap-brass.jpg',
    images: ['/scrap-brass.jpg', '/scrap-ma-solid-alloy.jpg', '/scrap-tin.jpg'],
    quantity: '90 KG',
    address: '16, Porur Industrial Bypass, Porur, Chennai – 600116, Tamil Nadu',
    orderConfirmed: '12 May 2025, 01:10 PM',
    pickupDate: 'Today',
    pickupTime: '01:00 PM – 03:00 PM',
    statusText: 'Pending',
    statusType: 'pending',
    statusMeta: {
      heading: 'Pickup Ready • Offer Accepted',
      sub: 'Today, 01:00 PM',
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

  // Interactive Order Operational Lifecycle Modal State
  const [workflowState, setWorkflowState] = useState<OrderWorkflow | null>(null);
  const [mapZoom, setMapZoom] = useState<number>(1);

  const [selectedScrapType, setSelectedScrapType] = useState('All Types');
  const [selectedOrderStatus, setSelectedOrderStatus] = useState('All Statuses');
  const [selectedLocation, setSelectedLocation] = useState('All Locations');
  const [selectedDateRange, setSelectedDateRange] = useState('This Month');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

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
          billNumber: `BILL-${targetOrder.id.split('-').pop() || '00075'}`,
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
    else if (order.badge === 'Pending') initialStage = 'weighing';
    else if (order.badge === 'Scheduled') initialStage = 'navigation';

    const defaultRate = '42';
    const initialAmount = 0;

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
      billNumber: `BILL-${order.id.split('-').pop() || '00075'}`,
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
    setWorkflowState({
      ...workflowState,
      stage: 'billing_otp',
    });
    triggerToast('📄 Bill submitted to customer. Waiting for industry Billing OTP confirmation.');
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
            <div className={styles.pageHeaderRow}>
              <div className={styles.headerTitleGroup}>
                <h1 className={styles.pageTitle}>Scrap Pickup Orders</h1>
                <p className={styles.pageSubtitle}>
                  Track pickup schedules, manage pending doorstep collections, and view completed orders.
                </p>
              </div>
            </div>

            {/* 2. 5-Column Stats Strip (4 Standardized Statuses + Total) */}
            <div className={styles.statsStripGrid}>
              <div className={styles.statCard}>
                <div className={`${styles.statIconCircle} ${styles.iconYellow}`}>
                  <Package size={18} />
                </div>
                <div className={styles.statContent}>
                  <span className={styles.statLabel}>Total Orders</span>
                  <span className={styles.statValue}>{orders.length}</span>
                  <span className={styles.statTrend}>
                    This Month <strong className={styles.trendGreen}>↑ 18%</strong>
                  </span>
                </div>
              </div>

              <div className={styles.statCard}>
                <div className={`${styles.statIconCircle} ${styles.iconBlue}`}>
                  <Clock size={18} />
                </div>
                <div className={styles.statContent}>
                  <span className={styles.statLabel}>Pending</span>
                  <span className={styles.statValue}>{orders.filter((o) => o.statusType === 'pending').length}</span>
                  <span className={styles.statTrend}>
                    Active pickups
                  </span>
                </div>
              </div>

              <div className={styles.statCard}>
                <div className={`${styles.statIconCircle} ${styles.iconOrange}`}>
                  <Calendar size={18} />
                </div>
                <div className={styles.statContent}>
                  <span className={styles.statLabel}>Scheduled</span>
                  <span className={styles.statValue}>{orders.filter((o) => o.statusType === 'scheduled').length}</span>
                  <span className={styles.statTrend}>
                    Upcoming bookings
                  </span>
                </div>
              </div>

              <div className={styles.statCard}>
                <div className={`${styles.statIconCircle} ${styles.iconGreen}`}>
                  <CheckCircle2 size={18} />
                </div>
                <div className={styles.statContent}>
                  <span className={styles.statLabel}>Completed</span>
                  <span className={styles.statValue}>{orders.filter((o) => o.statusType === 'completed').length}</span>
                  <span className={styles.statTrend}>
                    This Month <strong className={styles.trendGreen}>↑ 12%</strong>
                  </span>
                </div>
              </div>

              <div className={styles.statCard}>
                <div className={`${styles.statIconCircle} ${styles.iconRed}`}>
                  <XCircle size={18} />
                </div>
                <div className={styles.statContent}>
                  <span className={styles.statLabel}>Cancelled</span>
                  <span className={styles.statValue}>{orders.filter((o) => o.statusType === 'cancelled').length}</span>
                  <span className={styles.statTrend}>
                    This Month <strong className={styles.trendRed}>↓ 5%</strong>
                  </span>
                </div>
              </div>
            </div>

            {/* MOBILE 4-TAB ORDER SELECTOR (Upcoming, Active, Completed, Cancelled) */}
            <div className={styles.mobileOrderTopTabs}>
              <button
                type="button"
                className={`${styles.mobileOrderTabBtn} ${
                  activeFilterTab === 'scheduled' ? styles.mobileOrderTabBtnActive : ''
                }`}
                onClick={() => setActiveFilterTab('scheduled')}
              >
                <span>Upcoming ({orders.filter((o) => o.statusType === 'scheduled').length})</span>
              </button>
              <button
                type="button"
                className={`${styles.mobileOrderTabBtn} ${
                  activeFilterTab === 'pending' || activeFilterTab === 'all' ? styles.mobileOrderTabBtnActive : ''
                }`}
                onClick={() => setActiveFilterTab('pending')}
              >
                <span>Active ({orders.filter((o) => o.statusType === 'pending').length})</span>
              </button>
              <button
                type="button"
                className={`${styles.mobileOrderTabBtn} ${
                  activeFilterTab === 'completed' ? styles.mobileOrderTabBtnActive : ''
                }`}
                onClick={() => setActiveFilterTab('completed')}
              >
                <span>Completed ({orders.filter((o) => o.statusType === 'completed').length})</span>
              </button>
              <button
                type="button"
                className={`${styles.mobileOrderTabBtn} ${
                  activeFilterTab === 'cancelled' ? styles.mobileOrderTabBtnActive : ''
                }`}
                onClick={() => setActiveFilterTab('cancelled')}
              >
                <span>Cancelled ({orders.filter((o) => o.statusType === 'cancelled').length})</span>
              </button>
            </div>

            {/* 3. Standardized 4-Status Tabs & Sort Bar (Desktop Only) */}
            <div className={styles.tabsBar}>
              <div className={styles.tabsList}>
                <button
                  type="button"
                  className={`${styles.tabItem} ${activeFilterTab === 'all' ? styles.tabActive : ''}`}
                  onClick={() => setActiveFilterTab('all')}
                >
                  <span>All Orders</span>
                  <span className={styles.tabBadge}>{orders.length}</span>
                </button>
                <button
                  type="button"
                  className={`${styles.tabItem} ${activeFilterTab === 'pending' ? styles.tabActive : ''}`}
                  onClick={() => setActiveFilterTab('pending')}
                >
                  <span>Pending</span>
                  <span className={styles.tabBadge}>{orders.filter((o) => o.statusType === 'pending').length}</span>
                </button>
                <button
                  type="button"
                  className={`${styles.tabItem} ${activeFilterTab === 'scheduled' ? styles.tabActive : ''}`}
                  onClick={() => setActiveFilterTab('scheduled')}
                >
                  <span>Scheduled</span>
                  <span className={styles.tabBadge}>{orders.filter((o) => o.statusType === 'scheduled').length}</span>
                </button>
                <button
                  type="button"
                  className={`${styles.tabItem} ${activeFilterTab === 'completed' ? styles.tabActive : ''}`}
                  onClick={() => setActiveFilterTab('completed')}
                >
                  <span>Completed</span>
                  <span className={styles.tabBadge}>{orders.filter((o) => o.statusType === 'completed').length}</span>
                </button>
                <button
                  type="button"
                  className={`${styles.tabItem} ${activeFilterTab === 'cancelled' ? styles.tabActive : ''}`}
                  onClick={() => setActiveFilterTab('cancelled')}
                >
                  <span>Cancelled</span>
                  <span className={styles.tabBadge}>{orders.filter((o) => o.statusType === 'cancelled').length}</span>
                </button>
              </div>

              <div className={styles.sortSelector}>
                <span>Sort by: Newest First</span>
                <ChevronDown size={14} />
              </div>
            </div>

            {/* 4. Orders Cards List (Standardized to 4 Flags: Pending, Scheduled, Completed, Cancelled) */}
            <div className={styles.ordersList}>
              {filteredOrders.map((order) => (
                <article key={order.id} className={styles.orderCard}>
                  {/* Top Customer & Order ID Strip */}
                  <div className={styles.cardHeaderRow}>
                    <div className={styles.cardHeaderLeft}>
                      {/* Standardized 4 Status Badges */}
                      <span
                        className={
                          order.badge === 'Completed'
                            ? styles.statusPillGreen
                            : order.badge === 'Pending'
                            ? styles.statusPillBlue
                            : order.badge === 'Scheduled'
                            ? styles.statusPillYellow
                            : styles.statusPillRed
                        }
                      >
                        {order.badge.toUpperCase()}
                      </span>

                      <div className={styles.customerGroup}>
                        <span className={styles.customerLabel}>Customer:</span>
                        <span className={styles.customerName}>{order.customerName}</span>
                      </div>

                      <div className={styles.customerTypeBadge}>
                        {order.customerType === 'Individual' ? <User size={12} /> : <Building size={12} />}
                        <span>{order.customerType}</span>
                      </div>
                    </div>

                    <span className={styles.orderIdMuted}>Order ID: {order.id}</span>
                  </div>

                  {/* 3-Column Core Card Body (Exact same image showcase as Requests page) */}
                  <div className={styles.cardBodyGrid}>
                    {/* 1. Left Column: Scrap Photo Preview with Multi-Image Swipe */}
                    <div className={styles.imageShowcaseCol}>
                      <CardImageGallery
                        images={order.images || [order.image]}
                        fallbackImage={order.image || '/logo-icon.png'}
                        materialName={order.materialName}
                        materialCondition={order.materialCondition}
                        onOpenPreview={(src) =>
                          setFloatingImage({
                            src,
                            title: order.materialName,
                            condition: order.materialCondition,
                            quantity: order.quantity,
                            customerName: order.customerName,
                          })
                        }
                      />

                      <div className={styles.materialTitleBlock}>
                        <h3 className={styles.materialTitle}>{order.materialName}</h3>
                        <div className={styles.quantityTag}>
                          <span className={styles.quantityHighlight}>{order.quantity}</span>
                          <span className={styles.confirmedDateTag}>• Confirmed {order.pickupDate}</span>
                        </div>
                      </div>
                    </div>

                    {/* 2. Middle Column: Pickup Address & Order Details */}
                    <div className={styles.detailsCol}>
                      <div className={styles.detailRow}>
                        <MapPin size={16} className={styles.detailIcon} />
                        <div className={styles.addressCol}>
                          <span className={styles.detailLabel}>PICKUP ADDRESS</span>
                          <span className={styles.addressValue}>{order.address}</span>
                        </div>
                      </div>

                      <div className={styles.detailRow}>
                        <Calendar size={16} className={styles.detailIcon} />
                        <div className={styles.pickupTimeRow}>
                          <span className={styles.detailLabel}>SCHEDULED PICKUP</span>
                          <span className={styles.pickupTimeValue}>
                            {order.pickupDate} &nbsp;•&nbsp; {order.pickupTime}
                          </span>
                        </div>
                      </div>

                      <div className={styles.detailRow}>
                        <Clock size={16} className={styles.detailIcon} />
                        <div className={styles.pickupTimeRow}>
                          <span className={styles.detailLabel}>ORDER CONFIRMED</span>
                          <span className={styles.confirmedSubtext}>{order.orderConfirmed}</span>
                        </div>
                      </div>
                    </div>

                    {/* 3. Right Column: Standardized Status & Action Buttons */}
                    <div className={styles.statusActionCol}>
                      <div className={styles.statusGroup}>
                        <span className={styles.statusHeader}>STATUS</span>
                        <span
                          className={`${styles.statePill} ${
                            order.statusType === 'completed'
                              ? styles.stateCompleted
                              : order.statusType === 'pending'
                              ? styles.statePending
                              : order.statusType === 'scheduled'
                              ? styles.stateScheduled
                              : styles.stateCancelled
                          }`}
                        >
                          {order.statusText}
                        </span>

                        <div className={styles.stateSubtext}>
                          <span>{order.statusMeta.heading}</span>
                          <strong>{order.statusMeta.sub}</strong>
                        </div>
                      </div>

                      <div className={styles.buttonsStack}>
                        <button
                          type="button"
                          className={
                            order.badge === 'Completed'
                              ? styles.completedActionBtn
                              : styles.primaryActionBtn
                          }
                          onClick={() => handleOpenWorkflow(order)}
                        >
                          <Truck size={14} />
                          <span>{order.badge === 'Completed' ? 'View Bill & Settlement' : 'Open Order & Start Pickup →'}</span>
                        </button>

                        {order.actions.includes('download-bill') && (
                          <button
                            type="button"
                            className={styles.outlineDarkBtn}
                            onClick={() => triggerToast(`Downloading digital weighing bill for ${order.id}`)}
                          >
                            <Download size={14} />
                            <span>Download Bill</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Card Footer Note */}
                  {order.bottomNote && (
                    <div className={styles.cardFooterNote}>
                      <span>{order.bottomNote}</span>
                    </div>
                  )}
                </article>
              ))}
            </div>
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

            {/* Stage Progress Stepper */}
            <div className={styles.workflowStepper}>
              <div
                className={`${styles.stepItem} ${
                  ['navigation', 'pickup_otp', 'weighing', 'bill_generated', 'billing_otp', 'settled'].includes(
                    workflowState.stage
                  )
                    ? styles.stepItemActive
                    : ''
                }`}
              >
                <div className={styles.stepNumber}>1</div>
                <span className={styles.stepLabel}>En Route</span>
              </div>
              <div className={styles.stepConnector} />
              <div
                className={`${styles.stepItem} ${
                  ['pickup_otp', 'weighing', 'bill_generated', 'billing_otp', 'settled'].includes(
                    workflowState.stage
                  )
                    ? styles.stepItemActive
                    : ''
                }`}
              >
                <div className={styles.stepNumber}>2</div>
                <span className={styles.stepLabel}>Pickup OTP</span>
              </div>
              <div className={styles.stepConnector} />
              <div
                className={`${styles.stepItem} ${
                  ['weighing', 'bill_generated', 'billing_otp', 'settled'].includes(
                    workflowState.stage
                  )
                    ? styles.stepItemActive
                    : ''
                }`}
              >
                <div className={styles.stepNumber}>3</div>
                <span className={styles.stepLabel}>Weighing</span>
              </div>
              <div className={styles.stepConnector} />
              <div
                className={`${styles.stepItem} ${
                  ['bill_generated', 'billing_otp', 'settled'].includes(workflowState.stage)
                    ? styles.stepItemActive
                    : ''
                }`}
              >
                <div className={styles.stepNumber}>4</div>
                <span className={styles.stepLabel}>Bill</span>
              </div>
              <div className={styles.stepConnector} />
              <div
                className={`${styles.stepItem} ${
                  ['settled'].includes(workflowState.stage) ? styles.stepItemActive : ''
                }`}
              >
                <div className={styles.stepNumber}>5</div>
                <span className={styles.stepLabel}>Settled</span>
              </div>
            </div>

            {/* Modal Body Based on Stage */}
            <div className={styles.workflowModalBody}>
              {/* STAGE 1: NAVIGATION & EN ROUTE */}
              {workflowState.stage === 'navigation' && (
                <div className={styles.stageContentBox}>
                  <div className={styles.stageHeroBadge}>
                    <Compass size={18} />
                    <span>Stage 1: Live Pickup GPS Map &amp; Navigation</span>
                  </div>

                  {/* EMBEDDED LIVE MAP VIEWPORT */}
                  <div className={styles.embeddedMapViewport}>
                    {/* Live Turn-by-Turn Instruction Header */}
                    <div className={styles.liveNavTurnHeader}>
                      <div className={styles.turnIconCircle}>
                        <Navigation size={18} />
                      </div>
                      <div className={styles.turnTextCol}>
                        <strong className={styles.turnTitle}>In 400m, turn left onto Porur Industrial Bypass</strong>
                        <span className={styles.turnSub}>4.2 KM remaining • Estimated arrival in 14 mins</span>
                      </div>
                      <span className={styles.liveGpsDotPulse}>GPS LIVE</span>
                    </div>

                    {/* Live Map Graphic Canvas */}
                    <div className={styles.liveMapGraphicBox}>
                      <svg
                        viewBox="0 0 800 480"
                        className={styles.embeddedMapSvg}
                        style={{
                          transform: `scale(${mapZoom})`,
                          transformOrigin: 'center center',
                          transition: 'transform 0.2s ease',
                        }}
                      >
                        <defs>
                          <linearGradient id="mapCoastGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#dbeafe" stopOpacity="0.4" />
                            <stop offset="100%" stopColor="#93c5fd" stopOpacity="0.8" />
                          </linearGradient>

                          <linearGradient id="liveActiveRouteGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#16a34a" />
                            <stop offset="60%" stopColor="#22c55e" />
                            <stop offset="100%" stopColor="#f59e0b" />
                          </linearGradient>

                          <filter id="embeddedPinShadow" x="-20%" y="-20%" width="140%" height="140%">
                            <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#0f172a" floodOpacity="0.4" />
                          </filter>
                        </defs>

                        {/* Background Base */}
                        <rect width="800" height="480" fill="#f1f5f9" />

                        {/* Chennai Bay Coastline */}
                        <path
                          d="M 680 0 C 700 120, 715 240, 675 360 C 650 420, 665 460, 660 480 L 800 480 L 800 0 Z"
                          fill="url(#mapCoastGradient)"
                        />
                        <text x="730" y="240" fill="#3b82f6" fontSize="13" fontWeight="800" opacity="0.6" transform="rotate(90 730 240)">
                          BAY OF BENGAL
                        </text>

                        {/* City Arterial Road Grid */}
                        <g stroke="#cbd5e1" strokeWidth="2.5" fill="none">
                          {/* NH-45 GST Road */}
                          <line x1="420" y1="0" x2="420" y2="480" strokeWidth="5" stroke="#94a3b8" />
                          {/* Inner Ring Road */}
                          <line x1="0" y1="260" x2="680" y2="260" strokeWidth="4.5" stroke="#94a3b8" />
                          {/* Secondary avenues */}
                          <line x1="180" y1="0" x2="180" y2="480" strokeWidth="2" stroke="#e2e8f0" />
                          <line x1="0" y1="130" x2="700" y2="130" strokeWidth="2" stroke="#e2e8f0" />
                          <line x1="0" y1="390" x2="660" y2="390" strokeWidth="2" stroke="#e2e8f0" />
                          {/* Bypass highway */}
                          <path d="M 120 480 Q 280 280 420 180 T 640 40" strokeWidth="3" stroke="#e2e8f0" />
                        </g>

                        {/* Highway Badges */}
                        <g fill="#64748b" fontSize="10" fontWeight="700">
                          <text x="430" y="40">GST ROAD (NH-45)</text>
                          <text x="50" y="250">INNER RING ROAD</text>
                          <text x="140" y="380">PORUR INDUSTRIAL BYPASS</text>
                        </g>

                        {/* Active Dynamic Route Polyline */}
                        <path
                          d="M 420 310 L 340 310 L 260 260 L 200 170 L 170 120"
                          stroke="url(#liveActiveRouteGlow)"
                          strokeWidth="6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          fill="none"
                        />
                        <path
                          d="M 420 310 L 340 310 L 260 260 L 200 170 L 170 120"
                          stroke="#ffffff"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeDasharray="6 6"
                          fill="none"
                        />

                        {/* Origin Depot Pin: Bill Scrap Guindy Depot (420, 310) */}
                        <g transform="translate(420, 310)">
                          <circle r="18" fill="#22c55e" opacity="0.25" />
                          <circle r="10" fill="#16a34a" filter="url(#embeddedPinShadow)" />
                          <circle r="4" fill="#ffffff" />
                          {/* Label */}
                          <g transform="translate(16, -14)">
                            <rect x="0" y="0" width="130" height="22" rx="4" fill="#0f172a" opacity="0.9" />
                            <text x="8" y="15" fill="#22c55e" fontSize="10" fontWeight="800">
                              DEPOT (SIDCO Guindy)
                            </text>
                          </g>
                        </g>

                        {/* Moving Pickup Truck Icon (On Route at 280, 275) */}
                        <g transform="translate(280, 275)">
                          <circle r="16" fill="#fbc21a" opacity="0.3" />
                          <circle r="12" fill="#0f172a" filter="url(#embeddedPinShadow)" />
                          <text x="-7" y="5" fontSize="13">🚚</text>
                          <g transform="translate(-30, -18)">
                            <rect x="0" y="0" width="60" height="15" rx="3" fill="#fbc21a" />
                            <text x="6" y="11" fill="#0f172a" fontSize="9" fontWeight="900">EN ROUTE</text>
                          </g>
                        </g>

                        {/* Destination Factory Pin: (170, 120) */}
                        <g transform="translate(170, 120)">
                          <circle r="22" fill="#ef4444" opacity="0.2" />
                          <circle r="14" fill="#dc2626" filter="url(#embeddedPinShadow)" />
                          <circle r="6" fill="#ffffff" />
                          {/* Company Name Badge */}
                          <g transform="translate(-70, -32)">
                            <rect x="0" y="0" width="140" height="26" rx="6" fill="#0f172a" filter="url(#embeddedPinShadow)" />
                            <text x="10" y="17" fill="#ffffff" fontSize="10" fontWeight="800">
                              {workflowState.order.customerName.length > 18
                                ? `${workflowState.order.customerName.substring(0, 18)}...`
                                : workflowState.order.customerName}
                            </text>
                          </g>
                        </g>
                      </svg>

                      {/* Map Floating Controls (+ / - / Recenter) */}
                      <div className={styles.mapFloatingControls}>
                        <button
                          type="button"
                          className={styles.mapCtrlBtn}
                          onClick={() => setMapZoom((prev) => Math.min(prev + 0.25, 2))}
                          title="Zoom In"
                        >
                          +
                        </button>
                        <button
                          type="button"
                          className={styles.mapCtrlBtn}
                          onClick={() => setMapZoom((prev) => Math.max(prev - 0.25, 0.75))}
                          title="Zoom Out"
                        >
                          −
                        </button>
                        <button
                          type="button"
                          className={styles.mapCtrlBtn}
                          onClick={() => setMapZoom(1)}
                          title="Recenter Map"
                        >
                          📍
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Interactive Visual Route Info Card */}
                  <div className={styles.mapFlowCard}>
                    <div className={styles.mapFlowHeader}>
                      <div className={styles.mapFlowHeaderLeft}>
                        <span className={styles.mapFlowTag}>DESTINATION DISPATCH</span>
                        <strong className={styles.mapFlowTitle}>{workflowState.order.customerName}</strong>
                      </div>
                      <span className={styles.mapLiveBadge}>Live Map</span>
                    </div>

                    <div className={styles.routeTimeline}>
                      {/* Point A */}
                      <div className={styles.routePoint}>
                        <span className={styles.routeDotGreen} />
                        <div className={styles.routeTextCol}>
                          <span className={styles.routePointLabel}>ORIGIN DEPOT</span>
                          <span className={styles.routePointAddress}>Bill Scrap Merchant Depot, SIDCO Guindy, Chennai</span>
                        </div>
                      </div>

                      <div className={styles.routeLine} />

                      {/* Point B */}
                      <div className={styles.routePoint}>
                        <span className={styles.routeDotRed} />
                        <div className={styles.routeTextCol}>
                          <span className={styles.routePointLabel}>INDUSTRY DESTINATION</span>
                          <span className={styles.routePointAddress}>{workflowState.order.address}</span>
                        </div>
                      </div>
                    </div>

                    <div className={styles.mapMetricsRow}>
                      <div className={styles.mapMetricItem}>
                        <span className={styles.mapMetricLabel}>Est. Distance</span>
                        <strong className={styles.mapMetricVal}>4.2 KM</strong>
                      </div>
                      <div className={styles.mapMetricDivider} />
                      <div className={styles.mapMetricItem}>
                        <span className={styles.mapMetricLabel}>Travel ETA</span>
                        <strong className={styles.mapMetricVal}>14 Mins</strong>
                      </div>
                      <div className={styles.mapMetricDivider} />
                      <div className={styles.mapMetricItem}>
                        <span className={styles.mapMetricLabel}>Live Traffic</span>
                        <strong className={styles.mapTrafficGreen}>Smooth Route</strong>
                      </div>
                    </div>
                  </div>

                  {/* Commercial Agreed Rate Box */}
                  <div className={styles.agreedRateBanner}>
                    <div className={styles.agreedRateLeft}>
                      <span className={styles.agreedRateLabel}>AGREED COMMERCIAL RATE</span>
                      <strong className={styles.agreedRatePrice}>
                        ₹{workflowState.agreedRate} <small>/ KG</small>
                      </strong>
                      <span className={styles.agreedRateMaterial}>
                        {workflowState.order.materialName} ({workflowState.order.quantity})
                      </span>
                    </div>
                    <div className={styles.agreedRateRight}>
                      <span className={styles.agreedRateEstLabel}>Projected Value</span>
                      <strong className={styles.agreedRateTotal}>
                        ₹{(Number(workflowState.actualWeight || 90) * Number(workflowState.agreedRate || 416)).toLocaleString('en-IN')}
                      </strong>
                    </div>
                  </div>

                  <div className={styles.navigationActionsRow}>
                    <a
                      href={`https://maps.google.com/?q=${encodeURIComponent(workflowState.order.address)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.mapLinkBtn}
                    >
                      <Navigation size={15} />
                      <span>Start Navigation (Google Maps)</span>
                    </a>
                    <a href="tel:+919876543210" className={styles.callCustomerBtn}>
                      <Phone size={15} />
                      <span>Call Factory Desk</span>
                    </a>
                  </div>

                  <button
                    type="button"
                    className={styles.primaryActionCta}
                    onClick={handleMarkArrived}
                  >
                    <span>I Have Arrived at Factory Location 📍</span>
                    <ArrowRight size={16} />
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
                    📝 Search scrap catalog to quickly add items or record digital scale weights and unit prices. System automatically computes individual amounts and the final tax invoice.
                  </p>

                  {/* UNIVERSAL TOP SCRAP SEARCH & CATEGORY/SUBCATEGORY EXPLORER */}
                  <div className={styles.universalScrapSearchBox}>
                    <div className={styles.scrapSearchHeaderRow}>
                      <label className={styles.scrapSearchHeaderLabel}>
                        <Search size={15} />
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
                              .map((item) => ({ ...item, categoryName: c.name, categoryIcon: c.icon }))
                          ).map((item) => (
                            <div
                              key={item.id}
                              className={styles.subCategoryCard}
                              onClick={() => handleAddMarketSubItem(item)}
                            >
                              <div className={styles.subCategoryCardTop}>
                                <span className={styles.subCategoryCategoryTag}>
                                  {item.categoryIcon} {item.categoryName}
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
                                <Plus size={13} />
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
                              <Plus size={13} />
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
                              <span className={styles.billingCategoryTabIcon}>{cat.icon}</span>
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
                                  <span>{activeCat.icon}</span>
                                  <strong>{activeCat.name} Subcategories:</strong>
                                </div>
                                <span className={styles.clickToAddNotice}>
                                  💡 Click any scrap item to instantly add to bill
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
                                        <Plus size={13} />
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
                      <span>Submit Bill to Customer for Instant Approval (₹{calculateGrandTotal().toLocaleString('en-IN')})</span>
                    </button>
                  </div>
                </div>
              )}

              {/* STAGE 5: INDUSTRY REVIEW & BILLING OTP */}
              {workflowState.stage === 'billing_otp' && (
                <form onSubmit={handleVerifyBillingOtp} className={styles.stageContentBox}>
                  <div className={styles.stageHeroBadge}>
                    <ShieldCheck size={18} />
                    <span>Stage 5: Industry Billing Confirmation</span>
                  </div>

                  <p className={styles.stageInstructionText}>
                    The customer representative has reviewed the digital bill on their portal. Ask them for the <strong>4-Digit Settlement Confirmation OTP</strong> to finalize payment of <strong>₹{calculateGrandTotal().toLocaleString('en-IN')}</strong>.
                  </p>

                  <div className={styles.otpInputGroup}>
                    <label className={styles.otpLabel}>Enter 4-Digit Billing OTP</label>
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
                      Sample Demo Billing OTP: <strong>7104</strong> (Auto-filled for instant verification)
                    </span>
                  </div>

                  <div className={styles.billActionRow}>
                    <button
                      type="button"
                      className={styles.editBillBackBtn}
                      onClick={() => setWorkflowState({ ...workflowState, stage: 'weighing' })}
                    >
                      <span>← Back to Edit Weights &amp; Items</span>
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
                      onClick={() => setWorkflowState(null)}
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
