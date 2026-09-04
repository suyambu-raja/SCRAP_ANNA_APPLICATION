import { getDb } from './mockDataService';

export interface MerchantInfo {
  id: string;
  name: string;
  businessName: string;
  mobile: string;
  area: string;
  city: string;
  verificationStatus: 'verified' | 'pending';
  rating: number;
  completedDeals: number;
  distanceKm: number;
}

export interface HouseholdProductItem {
  id: string;
  name: string;
  category: string;
  description: string;
  condition: 'Like New' | 'Good' | 'Fair' | 'Refurbished';
  price: number;
  priceFormatted: string;
  negotiable: boolean;
  status: 'available' | 'reserved' | 'sold' | 'removed';
  image: string;
  area: string;
  distanceText: string;
  postedTime: string;
  merchant: MerchantInfo;
}

export interface VoiceMessageItem {
  id: string;
  productId: string;
  sender: 'household' | 'merchant';
  senderName: string;
  audioUrl?: string; // Blob or synthetic data URL
  durationSeconds: number;
  durationFormatted: string;
  timestamp: string;
}

// Initial seed products combining active merchant offerings
const INITIAL_PRODUCTS: HouseholdProductItem[] = [
  {
    id: 'prod-1',
    name: 'Hero Sprint Cycle',
    category: 'Cycles',
    description: 'Hero Sprint 26T 18-speed geared cycle in excellent riding condition. Recently serviced with new brake pads and lubricated chain. Ideal for daily commuting or fitness.',
    condition: 'Good',
    price: 3500,
    priceFormatted: '₹3,500',
    negotiable: true,
    status: 'available',
    image: '/scrap-battery.png',
    area: 'Guindy, Chennai',
    distanceText: '3.2 km away',
    postedTime: '2 hours ago',
    merchant: {
      id: 'MERCHANT001',
      name: 'Ramesh Traders',
      businessName: 'Ramesh Scrap & Reusable Hub',
      mobile: '+91 98765 43211',
      area: 'Guindy Industrial Estate',
      city: 'Chennai',
      verificationStatus: 'verified',
      rating: 4.8,
      completedDeals: 142,
      distanceKm: 3.2,
    },
  },
  {
    id: 'prod-2',
    name: 'ABB Electric Motor (2 HP)',
    category: 'Motors',
    description: 'Genuine 3-phase induction motor by ABB. Tested on load, smooth bearings, copper coil intact. Perfect for workshops, water pumps, or small machinery.',
    condition: 'Good',
    price: 12000,
    priceFormatted: '₹12,000',
    negotiable: true,
    status: 'available',
    image: '/scrap-cpu.png',
    area: 'Ambattur, Chennai',
    distanceText: '5.8 km away',
    postedTime: 'Yesterday',
    merchant: {
      id: 'MERCHANT002',
      name: 'Chennai Metal Exchange',
      businessName: 'Ambattur Scrap & Recovery Corp',
      mobile: '+91 98401 23456',
      area: 'Ambattur Industrial Estate',
      city: 'Chennai',
      verificationStatus: 'verified',
      rating: 4.9,
      completedDeals: 310,
      distanceKm: 5.8,
    },
  },
  {
    id: 'prod-3',
    name: 'Heavy Iron Gate (6ft x 4ft)',
    category: 'Home Items',
    description: 'Solid wrought-iron gate with decorative scrollwork and double latch lock. Coated with anti-rust primer. Ready for residential or compound installation.',
    condition: 'Good',
    price: 8500,
    priceFormatted: '₹8,500',
    negotiable: true,
    status: 'available',
    image: '/scrap-iron.png',
    area: 'Padi, Chennai',
    distanceText: '6.4 km away',
    postedTime: '1 day ago',
    merchant: {
      id: 'MERCHANT003',
      name: 'Selvam Recyclers',
      businessName: 'Selvam Metal Yards',
      mobile: '+91 97910 88776',
      area: 'Padi Junction',
      city: 'Chennai',
      verificationStatus: 'verified',
      rating: 4.7,
      completedDeals: 98,
      distanceKm: 6.4,
    },
  },
  {
    id: 'prod-4',
    name: 'Industrial Heavy Duty Metal Rack',
    category: 'Furniture',
    description: '4-tier galvanized steel storage rack. Each shelf load capacity rated for 150 kg. Bolt-free slotted design for easy assembly and home garage or shop use.',
    condition: 'Like New',
    price: 6500,
    priceFormatted: '₹6,500',
    negotiable: true,
    status: 'available',
    image: '/scrap-quality-steel.png',
    area: 'Guindy, Chennai',
    distanceText: '3.5 km away',
    postedTime: '3 days ago',
    merchant: {
      id: 'MERCHANT001',
      name: 'Ramesh Traders',
      businessName: 'Ramesh Scrap & Reusable Hub',
      mobile: '+91 98765 43211',
      area: 'Guindy Industrial Estate',
      city: 'Chennai',
      verificationStatus: 'verified',
      rating: 4.8,
      completedDeals: 142,
      distanceKm: 3.5,
    },
  },
  {
    id: 'prod-5',
    name: 'Voltas Split AC (1.5 Ton, 3 Star)',
    category: 'Appliances',
    description: 'Refurbished 1.5 ton split AC outdoor + indoor unit with original copper condenser. Gas pressure tested, newly cleaned filter, cooling tested in shop.',
    condition: 'Refurbished',
    price: 15000,
    priceFormatted: '₹15,000',
    negotiable: true,
    status: 'available',
    image: '/scrap-ac.png',
    area: 'Padi, Chennai',
    distanceText: '6.4 km away',
    postedTime: '3 days ago',
    merchant: {
      id: 'MERCHANT003',
      name: 'Selvam Recyclers',
      businessName: 'Selvam Metal Yards',
      mobile: '+91 97910 88776',
      area: 'Padi Junction',
      city: 'Chennai',
      verificationStatus: 'verified',
      rating: 4.7,
      completedDeals: 98,
      distanceKm: 6.4,
    },
  },
  {
    id: 'prod-6',
    name: 'Solid Wood Pallets (Lot of 4)',
    category: 'Furniture',
    description: 'Pine wood heavy pallets, treated against moisture and pests. Excellent for DIY garden planters, low bed frame, or balcony seating.',
    condition: 'Good',
    price: 1800,
    priceFormatted: '₹1,800',
    negotiable: false,
    status: 'available',
    image: '/scrap-plastic-pallet.png',
    area: 'Ambattur, Chennai',
    distanceText: '5.2 km away',
    postedTime: '4 days ago',
    merchant: {
      id: 'MERCHANT002',
      name: 'Chennai Metal Exchange',
      businessName: 'Ambattur Scrap & Recovery Corp',
      mobile: '+91 98401 23456',
      area: 'Ambattur Industrial Estate',
      city: 'Chennai',
      verificationStatus: 'verified',
      rating: 4.9,
      completedDeals: 310,
      distanceKm: 5.2,
    },
  },
  {
    id: 'prod-7',
    name: 'Brass Plumbing & Gate Valves Set',
    category: 'Other',
    description: 'Pack of 6 heavy cast brass 1-inch and 1.5-inch control valves. High pressure rated, cleaned and checked for zero leaks.',
    condition: 'Fair',
    price: 2200,
    priceFormatted: '₹2,200',
    negotiable: true,
    status: 'available',
    image: '/scrap-brass.png',
    area: 'Thirumullaivoyal, Chennai',
    distanceText: '8.1 km away',
    postedTime: '5 days ago',
    merchant: {
      id: 'MERCHANT004',
      name: 'Karthik Metal Depot',
      businessName: 'Karthik Metal Depot',
      mobile: '+91 94440 11223',
      area: 'Thirumullaivoyal',
      city: 'Chennai',
      verificationStatus: 'verified',
      rating: 4.6,
      completedDeals: 64,
      distanceKm: 8.1,
    },
  },
];

// Initial preloaded voice message threads
const INITIAL_VOICE_MESSAGES: Record<string, VoiceMessageItem[]> = {
  'prod-1': [
    {
      id: 'vm-seed-1',
      productId: 'prod-1',
      sender: 'merchant',
      senderName: 'Ramesh Traders',
      durationSeconds: 14,
      durationFormatted: '0:14',
      timestamp: 'Today, 11:20 AM',
    },
  ],
  'prod-2': [
    {
      id: 'vm-seed-2',
      productId: 'prod-2',
      sender: 'merchant',
      senderName: 'Chennai Metal Exchange',
      durationSeconds: 18,
      durationFormatted: '0:18',
      timestamp: 'Yesterday, 4:15 PM',
    },
  ],
};

// Runtime in-memory storage (preserved during session)
let productsState: HouseholdProductItem[] = [...INITIAL_PRODUCTS];
let voiceMessagesState: Record<string, VoiceMessageItem[]> = { ...INITIAL_VOICE_MESSAGES };

/**
 * Synchronize with global DB to filter out merchant-removed or sold items
 */
export function getActiveHouseholdProducts(filters?: {
  searchQuery?: string;
  category?: string;
}): HouseholdProductItem[] {
  // Sync with DB if available
  const db = getDb();
  if (db && db.reusable_products) {
    // If a DB product is marked sold or removed, honor it
    db.reusable_products.forEach((dbProd) => {
      const match = productsState.find((p) => p.id === dbProd.id);
      if (match && dbProd.status !== 'available') {
        match.status = dbProd.status;
      }
    });
  }

  // Only return available products
  let results = productsState.filter((p) => p.status === 'available');

  if (filters?.searchQuery && filters.searchQuery.trim()) {
    const q = filters.searchQuery.toLowerCase().trim();
    results = results.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.merchant.name.toLowerCase().includes(q) ||
        p.area.toLowerCase().includes(q)
    );
  }

  if (filters?.category && filters.category !== 'All') {
    results = results.filter((p) => p.category.toLowerCase() === filters.category!.toLowerCase());
  }

  return results;
}

/**
 * Get product detail by ID
 */
export function getHouseholdProductById(id: string): HouseholdProductItem | null {
  const prod = productsState.find((p) => p.id === id);
  return prod || null;
}

/**
 * Get voice message history for a product
 */
export function getProductVoiceMessages(productId: string): VoiceMessageItem[] {
  return voiceMessagesState[productId] || [];
}

/**
 * Post a newly recorded household voice message
 */
export function sendHouseholdVoiceMessage(
  productId: string,
  audioUrl: string,
  durationSeconds: number
): VoiceMessageItem {
  const minutes = Math.floor(durationSeconds / 60);
  const seconds = durationSeconds % 60;
  const durationFormatted = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

  const now = new Date();
  const timeFormatted = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const newMessage: VoiceMessageItem = {
    id: `vm-${Date.now()}`,
    productId,
    sender: 'household',
    senderName: 'You',
    audioUrl,
    durationSeconds: Math.max(1, durationSeconds),
    durationFormatted,
    timestamp: `Today, ${timeFormatted}`,
  };

  if (!voiceMessagesState[productId]) {
    voiceMessagesState[productId] = [];
  }
  voiceMessagesState[productId].push(newMessage);

  return newMessage;
}

/**
 * Remove or mark product unavailable (e.g. When merchant sells or deletes it)
 */
export function markProductUnavailable(productId: string): void {
  const prod = productsState.find((p) => p.id === productId);
  if (prod) {
    prod.status = 'removed';
  }
}

/* ==========================================================================
   REUSABLE CART & MERCHANT CONFIRMATION / REJECTION TRACKING
   ========================================================================== */

export type MerchantConfirmationStatus = 'confirmed' | 'rejected' | 'pending';

export interface ReusableCartItem {
  id: string;
  productId: string;
  productName: string;
  category: string;
  priceFormatted: string;
  image: string;
  merchantName: string;
  merchantBusinessName: string;
  merchantArea: string;
  merchantMobile: string;
  requestedAt: string;
  status: MerchantConfirmationStatus;
  statusReason: string;
}

const CART_STORAGE_KEY = 'billscrap_reusable_cart_v1';

const INITIAL_CART_ITEMS: ReusableCartItem[] = [
  {
    id: 'cart-1',
    productId: 'prod-1',
    productName: 'Hero Sprint Cycle',
    category: 'Cycles',
    priceFormatted: '₹3,500',
    image: '/scrap-battery.png',
    merchantName: 'Ramesh Traders',
    merchantBusinessName: 'Ramesh Scrap & Reusable Hub',
    merchantArea: 'Guindy, Chennai',
    merchantMobile: '+91 98765 43211',
    requestedAt: 'Today, 10:30 AM',
    status: 'confirmed',
    statusReason: 'Merchant confirmed item is reserved and ready at the yard. You can visit Guindy to inspect and collect it.',
  },
  {
    id: 'cart-2',
    productId: 'prod-5',
    productName: 'Voltas Split AC (1.5 Ton, 3 Star)',
    category: 'Appliances',
    priceFormatted: '₹15,000',
    image: '/scrap-ac.png',
    merchantName: 'Selvam Recyclers',
    merchantBusinessName: 'Selvam Metal Yards',
    merchantArea: 'Padi, Chennai',
    merchantMobile: '+91 97910 88776',
    requestedAt: 'Yesterday, 4:15 PM',
    status: 'rejected',
    statusReason: 'Item sold to a walk-in buyer at the yard. DO NOT visit Padi for this item.',
  },
  {
    id: 'cart-3',
    productId: 'prod-4',
    productName: 'Industrial Heavy Duty Metal Rack',
    category: 'Furniture',
    priceFormatted: '₹6,500',
    image: '/scrap-quality-steel.png',
    merchantName: 'Ramesh Traders',
    merchantBusinessName: 'Ramesh Scrap & Reusable Hub',
    merchantArea: 'Guindy, Chennai',
    merchantMobile: '+91 98765 43211',
    requestedAt: 'Today, 1:45 PM',
    status: 'pending',
    statusReason: 'Waiting for Ramesh Traders to confirm stock availability. Please do not visit Guindy until confirmed.',
  },
];

function loadCartFromStorage(): ReusableCartItem[] {
  if (typeof window === 'undefined') return INITIAL_CART_ITEMS;
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(INITIAL_CART_ITEMS));
      return INITIAL_CART_ITEMS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading reusable cart from storage:', e);
    return INITIAL_CART_ITEMS;
  }
}

function saveCartToStorage(items: ReusableCartItem[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch (e) {
    console.error('Error saving reusable cart to storage:', e);
  }
}

/**
 * Get all reusable cart items
 */
export function getReusableCart(): ReusableCartItem[] {
  return loadCartFromStorage();
}

/**
 * Check if a product is in cart
 */
export function isProductInCart(productId: string): boolean {
  const items = loadCartFromStorage();
  return items.some((i) => i.productId === productId);
}

/**
 * Get cart item for product ID
 */
export function getCartItemByProductId(productId: string): ReusableCartItem | undefined {
  const items = loadCartFromStorage();
  return items.find((i) => i.productId === productId);
}

/**
 * Add a product to the cart (defaults to 'pending' confirmation)
 */
export function addToReusableCart(product: HouseholdProductItem): ReusableCartItem {
  const items = loadCartFromStorage();
  const existing = items.find((i) => i.productId === product.id);
  if (existing) {
    return existing;
  }

  const now = new Date();
  const timeFormatted = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const newItem: ReusableCartItem = {
    id: `cart-${Date.now()}`,
    productId: product.id,
    productName: product.name,
    category: product.category,
    priceFormatted: product.priceFormatted,
    image: product.image,
    merchantName: product.merchant.name,
    merchantBusinessName: product.merchant.businessName,
    merchantArea: product.area,
    merchantMobile: product.merchant.mobile,
    requestedAt: `Today, ${timeFormatted}`,
    status: 'pending',
    statusReason: `Awaiting ${product.merchant.name} confirmation. Please do not visit ${product.area} until confirmed.`,
  };

  const updated = [newItem, ...items];
  saveCartToStorage(updated);
  return newItem;
}

/**
 * Remove an item from the cart
 */
export function removeFromReusableCart(cartItemId: string): ReusableCartItem[] {
  const items = loadCartFromStorage();
  const updated = items.filter((i) => i.id !== cartItemId);
  saveCartToStorage(updated);
  return updated;
}

