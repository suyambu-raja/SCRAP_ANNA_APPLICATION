import { 
  ShieldCheck, MapPin, Scale, Calendar, CheckCircle2, 
  Truck, ArrowRight, FileText, IndianRupee, Sparkles, 
  Store, Factory, HelpCircle, Package, Layers
} from 'lucide-react';

export const materialCategories = [
  { id: 'all', name: 'All Materials', count: 18, color: '#F9C51C' },
  { id: 'iron', name: 'Iron', count: 3, color: '#4B5563', benchmarkPrice: '₹34 - ₹38/kg' },
  { id: 'steel', name: 'Steel', count: 3, color: '#374151', benchmarkPrice: '₹42 - ₹56/kg' },
  { id: 'aluminium', name: 'Aluminium', count: 2, color: '#6B7280', benchmarkPrice: '₹140 - ₹185/kg' },
  { id: 'copper', name: 'Copper', count: 2, color: '#B45309', benchmarkPrice: '₹680 - ₹740/kg' },
  { id: 'brass', name: 'Brass', count: 2, color: '#D97706', benchmarkPrice: '₹440 - ₹490/kg' },
  { id: 'paper', name: 'Paper', count: 2, color: '#2563EB', benchmarkPrice: '₹12 - ₹18/kg' },
  { id: 'plastic', name: 'Plastic', count: 2, color: '#059669', benchmarkPrice: '₹22 - ₹36/kg' },
  { id: 'e-waste', name: 'E-Waste', count: 1, color: '#7C3AED', benchmarkPrice: '₹95 - ₹350/kg' },
  { id: 'other', name: 'Other Scrap', count: 1, color: '#DB2777', benchmarkPrice: 'Varies by lot' }
];

export const marketplaceListings = [
  {
    id: 'LOT-TN-1048',
    title: 'Heavy Melting Steel (HMS 1/2) Scrap Lot',
    category: 'steel',
    categoryName: 'Steel',
    quantity: '25.0',
    unit: 'Metric Tons',
    pricePerUnit: 39.50,
    priceUnit: 'kg',
    totalValue: '₹9,87,500',
    location: 'Ambattur Industrial Estate, Chennai',
    city: 'Chennai',
    merchant: {
      name: 'Sri Krishna Steels & Metal Recyclers',
      verified: true,
      rating: 4.9,
      tradesCompleted: 48,
      kycStatus: 'GST Verified'
    },
    moq: '5 Metric Tons',
    grade: 'HMS 1/2 Clean Cut 80:20',
    readiness: 'Ready for Immediate Dispatch',
    postedDate: '2 hours ago',
    description: 'Uniform cut factory fabrication offcuts and structural beam ends. Zero contamination, non-alloy carbon steel with certified weighbridge pass.',
    badge: 'Hot Listing'
  },
  {
    id: 'LOT-TN-1049',
    title: 'Commercial Grade Bright Copper Wire Scrap (Millberry)',
    category: 'copper',
    categoryName: 'Copper',
    quantity: '1,850',
    unit: 'kg',
    pricePerUnit: 735.00,
    priceUnit: 'kg',
    totalValue: '₹13,59,750',
    location: 'Guindy Industrial Area, Chennai',
    city: 'Chennai',
    merchant: {
      name: 'Metals & Alloys Corporation',
      verified: true,
      rating: 5.0,
      tradesCompleted: 112,
      kycStatus: 'GST Verified'
    },
    moq: '250 kg',
    grade: '99.9% Pure Millberry Bare Wire',
    readiness: 'Ready for Immediate Dispatch',
    postedDate: '4 hours ago',
    description: 'High conductivity unalloyed bare copper wire, 1.2mm to 4.0mm diameter. Clean, untinned, free of burnt or brittle strands.',
    badge: 'High Value'
  },
  {
    id: 'LOT-TN-1050',
    title: 'Clean Baled Aluminium Extrusion 6063 Scrap',
    category: 'aluminium',
    categoryName: 'Aluminium',
    quantity: '8.5',
    unit: 'Metric Tons',
    pricePerUnit: 178.00,
    priceUnit: 'kg',
    totalValue: '₹15,13,000',
    location: 'Peelamedu, Coimbatore',
    city: 'Coimbatore',
    merchant: {
      name: 'Kongu Industrial Scrap Traders',
      verified: true,
      rating: 4.8,
      tradesCompleted: 64,
      kycStatus: 'GST Verified'
    },
    moq: '2 Metric Tons',
    grade: 'Al 6063 Architectural Offcuts',
    readiness: 'Ready for Immediate Dispatch',
    postedDate: '1 day ago',
    description: 'Anodized and mill-finish window/door profile cut pieces, compressed in 50kg hydraulic bales. Iron attachments < 0.2%.',
    badge: 'Verified Stock'
  },
  {
    id: 'LOT-TN-1051',
    title: 'Cast Iron Machinery Parts & Engine Blocks',
    category: 'iron',
    categoryName: 'Iron',
    quantity: '14.0',
    unit: 'Metric Tons',
    pricePerUnit: 35.80,
    priceUnit: 'kg',
    totalValue: '₹5,01,200',
    location: 'Ranipet Industrial Corridor',
    city: 'Ranipet',
    merchant: {
      name: 'Vellore District Metal Hub',
      verified: true,
      rating: 4.7,
      tradesCompleted: 29,
      kycStatus: 'GST Verified'
    },
    moq: '3 Metric Tons',
    grade: 'Grey Iron Grade 25/30',
    readiness: 'Available in 3 Days',
    postedDate: '1 day ago',
    description: 'Decommissioned factory machinery frames, clean cast housings and flywheels. Broken into foundry charge size (max 500mm).',
    badge: null
  },
  {
    id: 'LOT-TN-1052',
    title: 'Sorted Brass Honey & Domestic Utensil Scrap',
    category: 'brass',
    categoryName: 'Brass',
    quantity: '3,200',
    unit: 'kg',
    pricePerUnit: 468.00,
    priceUnit: 'kg',
    totalValue: '₹14,97,600',
    location: 'Kumbakonam Road, Thanjavur',
    city: 'Thanjavur',
    merchant: {
      name: 'Cauvery Brass & Metal Aggregators',
      verified: true,
      rating: 4.9,
      tradesCompleted: 83,
      kycStatus: 'GST Verified'
    },
    moq: '500 kg',
    grade: 'Yellow Brass / CuZn40',
    readiness: 'Ready for Immediate Dispatch',
    postedDate: '2 days ago',
    description: 'Cleaned household brass vessels, fittings, and yellow metal turnings with magnetic separation completed.',
    badge: 'Bulk Ready'
  },
  {
    id: 'LOT-TN-1053',
    title: 'Baled Old Corrugated Cardboard (OCC 11) Boxes',
    category: 'paper',
    categoryName: 'Paper',
    quantity: '32.0',
    unit: 'Metric Tons',
    pricePerUnit: 14.50,
    priceUnit: 'kg',
    totalValue: '₹4,64,000',
    location: 'Sriperumbudur Warehouse Hub, Kanchipuram',
    city: 'Chennai Outer',
    merchant: {
      name: 'GreenEarth Paper Recovery LLP',
      verified: true,
      rating: 4.8,
      tradesCompleted: 91,
      kycStatus: 'GST Verified'
    },
    moq: '10 Metric Tons',
    grade: 'OCC Grade 11 Kraft Corrugated',
    readiness: 'Ready for Immediate Dispatch',
    postedDate: '2 days ago',
    description: 'E-commerce and warehouse sorting waste, dry high-density 400kg bales. Moisture content strictly certified below 12%.',
    badge: 'Eco Lot'
  },
  {
    id: 'LOT-TN-1054',
    title: 'Crushed & Washed HDPE Drums & Container Regrind',
    category: 'plastic',
    categoryName: 'Plastic',
    quantity: '6.5',
    unit: 'Metric Tons',
    pricePerUnit: 34.00,
    priceUnit: 'kg',
    totalValue: '₹2,21,000',
    location: 'Manali Petrochemical Zone, Chennai',
    city: 'Chennai',
    merchant: {
      name: 'Manali Polymers Recycling',
      verified: true,
      rating: 4.6,
      tradesCompleted: 37,
      kycStatus: 'GST Verified'
    },
    moq: '1 Metric Ton',
    grade: 'High Density Polyethylene (Blow Moulding)',
    readiness: 'Ready for Immediate Dispatch',
    postedDate: '3 days ago',
    description: 'Industrial chemical drums washed, de-labeled, and shredded to 10mm flakes. Single origin blue and white colors.',
    badge: null
  },
  {
    id: 'LOT-TN-1055',
    title: 'Decommissioned Corporate Telecom & Server PCB Boards',
    category: 'e-waste',
    categoryName: 'E-Waste',
    quantity: '1,400',
    unit: 'kg',
    pricePerUnit: 240.00,
    priceUnit: 'kg',
    totalValue: '₹3,36,000',
    location: 'OMR Tech Corridor, Chennai',
    city: 'Chennai',
    merchant: {
      name: 'EcoSecure Asset Recovery Pvt Ltd',
      verified: true,
      rating: 5.0,
      tradesCompleted: 156,
      kycStatus: 'GST Verified'
    },
    moq: '200 kg',
    grade: 'High-Grade Gold Pin Telecom PCBs',
    readiness: 'Ready for Immediate Dispatch',
    postedDate: '3 days ago',
    description: 'Complete data-sanitized server motherboards, RAM modules, and telecom backplane cards with pollution board manifest.',
    badge: 'Certified E-Waste'
  },
  {
    id: 'LOT-TN-1056',
    title: 'Structural Steel Trusses & Heavy Angle Scrap',
    category: 'steel',
    categoryName: 'Steel',
    quantity: '40.0',
    unit: 'Metric Tons',
    pricePerUnit: 41.20,
    priceUnit: 'kg',
    totalValue: '₹16,48,000',
    location: 'Ennore Port Industrial Belt, Chennai',
    city: 'Chennai',
    merchant: {
      name: 'Coastal Steel & Demolition Traders',
      verified: true,
      rating: 4.8,
      tradesCompleted: 73,
      kycStatus: 'GST Verified'
    },
    moq: '10 Metric Tons',
    grade: 'IS 2062 Structural Heavy Scrap',
    readiness: 'Ready for Immediate Dispatch',
    postedDate: '4 days ago',
    description: 'Industrial shed dismantling structural beams, girders, and angles cut to transportable 6-meter lengths.',
    badge: 'Heavy Lot'
  },
  {
    id: 'LOT-TN-1057',
    title: 'Lead Battery Scrap (Wet & Drained Inverter Units)',
    category: 'other',
    categoryName: 'Other Scrap',
    quantity: '5.2',
    unit: 'Metric Tons',
    pricePerUnit: 98.00,
    priceUnit: 'kg',
    totalValue: '₹5,09,600',
    location: 'Madurai Ring Road Industrial Area',
    city: 'Madurai',
    merchant: {
      name: 'Southern Battery & Smelter Agents',
      verified: true,
      rating: 4.7,
      tradesCompleted: 42,
      kycStatus: 'GST Verified'
    },
    moq: '1 Metric Ton',
    grade: 'Automotive & Tubular Inverter Batteries',
    readiness: 'Available in 5 Days',
    postedDate: '4 days ago',
    description: 'Original plastic container lead-acid battery scrap ready for CPCB authorized lead smelting units.',
    badge: null
  }
];

export const marketplaceWorkflowSteps = [
  {
    step: '01',
    title: 'Merchant Verification',
    desc: 'Every seller undergoes business identity, GST registration, and yard location vetting before listing lots.'
  },
  {
    step: '02',
    title: 'Lot Discovery & Matchmaking',
    desc: 'Buyers browse verified material grades, inspect digital photo records, and verify certified weight specifications.'
  },
  {
    step: '03',
    title: 'Direct Rate Inquiries',
    desc: 'Connect directly with verified merchants, submit bulk counter-offers, or schedule lot physical inspections.'
  },
  {
    step: '04',
    title: 'Certified Weighbridge Dispatch',
    desc: 'Final weights are locked at calibrated digital weighbridges with GST billing and transit manifests.'
  }
];

export const marketplaceTrustFeatures = [
  {
    title: '100% Verified Sellers',
    desc: 'Only businesses with active GST, verified yards, and proven trade records can post scrap listings.',
    icon: 'ShieldCheck'
  },
  {
    title: 'Calibrated Weight Assurance',
    desc: 'All bulk lots are settled based on synchronized weighbridge slips with zero manual tampering.',
    icon: 'Scale'
  },
  {
    title: 'Digital Invoicing & GST',
    desc: 'Full tax compliance with digital e-way bill generation, audit-ready manifests, and statutory records.',
    icon: 'FileText'
  },
  {
    title: 'Transparent Reference Rates',
    desc: 'Benchmark your trades against live Scrap Anna daily market price indices for fair negotiations.',
    icon: 'IndianRupee'
  }
];
