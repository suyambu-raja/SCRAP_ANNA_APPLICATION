/**
 * Merchant Reusable Product Requests Service
 * Manages customer requests for reusable goods & machinery listed by the merchant.
 * Handles request status (PENDING, ACCEPTED, CANCELLED), voice messages, and localStorage persistence.
 */

export type RequestStatus = 'PENDING' | 'ACCEPTED' | 'CANCELLED';

export interface VoiceMessage {
  id: string;
  sender: 'customer' | 'merchant';
  senderName: string;
  durationSeconds: number;
  durationFormatted: string; // e.g. "0:18"
  timestamp: string; // e.g. "Today, 11:42 AM"
  audioUrl?: string;
}

export interface ProductRequestItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  productPrice: string; // Exact listed price from product data
  productCategory: string;
  productCondition?: string;
  customerId: string;
  customerName: string;
  customerPhone?: string;
  customerArea: string;
  status: RequestStatus;
  requestedAt: string; // e.g. "Today, 11:42 AM"
  requestedDate: string; // e.g. "Sep 5, 2026"
  notes?: string;
  voiceMessages: VoiceMessage[];
  cancellationReason?: string;
  acceptedAt?: string;
  cancelledAt?: string;
}

const STORAGE_KEY = 'billscrap_merchant_product_requests_v1';

// Seed initial realistic mock requests matching the BillScrap reusable marketplace products
const INITIAL_REQUESTS: ProductRequestItem[] = [
  {
    id: 'req-1',
    productId: 'prod-5',
    productName: '3 Seater Sofa',
    productImage: '/scrap-quality-steel.png',
    productPrice: '₹8,500',
    productCategory: 'Furniture & Fixtures',
    productCondition: 'Good',
    customerId: 'cust-101',
    customerName: 'Rahul Kumar',
    customerPhone: '+91 98401 23456',
    customerArea: 'Guindy Industrial Area, Chennai',
    status: 'PENDING',
    requestedAt: 'Today, 11:42 AM',
    requestedDate: 'Sep 5, 2026',
    notes: 'Interested in physical inspection before final transport.',
    voiceMessages: [
      {
        id: 'vm-101',
        sender: 'customer',
        senderName: 'Rahul Kumar',
        durationSeconds: 18,
        durationFormatted: '0:18',
        timestamp: 'Today, 11:42 AM',
      },
      {
        id: 'vm-102',
        sender: 'customer',
        senderName: 'Rahul Kumar',
        durationSeconds: 9,
        durationFormatted: '0:09',
        timestamp: 'Today, 11:45 AM',
      },
    ],
  },
  {
    id: 'req-2',
    productId: 'prod-2',
    productName: 'ABB Electric Motor',
    productImage: '/scrap-cpu.png',
    productPrice: '₹12,000',
    productCategory: 'Motors',
    productCondition: 'Tested & Working',
    customerId: 'cust-102',
    customerName: 'Arun',
    customerPhone: '+91 97910 88776',
    customerArea: 'Ambattur Industrial Estate, Chennai',
    status: 'PENDING',
    requestedAt: 'Today, 10:15 AM',
    requestedDate: 'Sep 5, 2026',
    notes: 'Need 3-phase induction motor for workshop pump installation.',
    voiceMessages: [
      {
        id: 'vm-201',
        sender: 'customer',
        senderName: 'Arun',
        durationSeconds: 14,
        durationFormatted: '0:14',
        timestamp: 'Today, 10:15 AM',
      },
    ],
  },
  {
    id: 'req-3',
    productId: 'prod-1',
    productName: 'Hero Sprint Cycle',
    productImage: '/scrap-battery.png',
    productPrice: '₹3,500',
    productCategory: 'Cycles',
    productCondition: 'Like New',
    customerId: 'cust-103',
    customerName: 'Karthik',
    customerPhone: '+91 94440 11223',
    customerArea: 'Saidapet, Chennai',
    status: 'PENDING',
    requestedAt: 'Today, 09:30 AM',
    requestedDate: 'Sep 5, 2026',
    notes: 'Inquiring if gear shifting is newly tuned and tires are in good condition.',
    voiceMessages: [
      {
        id: 'vm-301',
        sender: 'customer',
        senderName: 'Karthik',
        durationSeconds: 12,
        durationFormatted: '0:12',
        timestamp: 'Today, 09:30 AM',
      },
    ],
  },
  {
    id: 'req-4',
    productId: 'prod-7',
    productName: 'Voltas AC 1.5 Ton',
    productImage: '/scrap-ac.png',
    productPrice: '₹15,000',
    productCategory: 'AC & Cooling',
    productCondition: 'Refurbished',
    customerId: 'cust-104',
    customerName: 'Venkatesh',
    customerPhone: '+91 98840 55667',
    customerArea: 'Padi, Chennai',
    status: 'ACCEPTED',
    requestedAt: 'Yesterday, 06:40 PM',
    requestedDate: 'Sep 4, 2026',
    acceptedAt: 'Yesterday, 07:15 PM',
    notes: 'Buyer will come for yard pickup tomorrow morning.',
    voiceMessages: [
      {
        id: 'vm-401',
        sender: 'customer',
        senderName: 'Venkatesh',
        durationSeconds: 16,
        durationFormatted: '0:16',
        timestamp: 'Yesterday, 06:40 PM',
      },
      {
        id: 'vm-402',
        sender: 'merchant',
        senderName: 'You (Merchant)',
        durationSeconds: 11,
        durationFormatted: '0:11',
        timestamp: 'Yesterday, 07:12 PM',
      },
    ],
  },
  {
    id: 'req-5',
    productId: 'prod-8',
    productName: 'Brass Valves Set',
    productImage: '/scrap-brass.png',
    productPrice: '₹2,200',
    productCategory: 'Industrial Parts',
    productCondition: 'Good',
    customerId: 'cust-105',
    customerName: 'Dinesh',
    customerPhone: '+91 98412 99887',
    customerArea: 'Thirumullaivoyal, Chennai',
    status: 'CANCELLED',
    requestedAt: 'Yesterday, 03:15 PM',
    requestedDate: 'Sep 4, 2026',
    cancelledAt: 'Yesterday, 03:45 PM',
    cancellationReason: 'Item reserved by an existing yard walk-in client.',
    voiceMessages: [
      {
        id: 'vm-501',
        sender: 'customer',
        senderName: 'Dinesh',
        durationSeconds: 10,
        durationFormatted: '0:10',
        timestamp: 'Yesterday, 03:15 PM',
      },
    ],
  },
];

// In-memory cache + listeners
let cachedRequests: ProductRequestItem[] | null = null;
const listeners: Array<(requests: ProductRequestItem[]) => void> = [];

function notifyListeners() {
  if (!cachedRequests) return;
  const copy = [...cachedRequests];
  listeners.forEach((fn) => {
    try {
      fn(copy);
    } catch (e) {
      console.error('Error in request listener:', e);
    }
  });
}

/**
 * Load requests from localStorage or seed initial data
 */
export function getProductRequests(): ProductRequestItem[] {
  if (cachedRequests) {
    return [...cachedRequests];
  }

  if (typeof window === 'undefined') {
    cachedRequests = [...INITIAL_REQUESTS];
    return cachedRequests;
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_REQUESTS));
      cachedRequests = [...INITIAL_REQUESTS];
      return cachedRequests;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      cachedRequests = parsed;
      return cachedRequests;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_REQUESTS));
    cachedRequests = [...INITIAL_REQUESTS];
    return cachedRequests;
  } catch (e) {
    console.error('Failed to load product requests from storage:', e);
    cachedRequests = [...INITIAL_REQUESTS];
    return cachedRequests;
  }
}

/**
 * Save requests to localStorage
 */
function saveRequests(requests: ProductRequestItem[]): void {
  cachedRequests = [...requests];
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
    } catch (e) {
      console.error('Failed to save product requests to storage:', e);
    }
  }
  notifyListeners();
}

/**
 * Get single request by ID
 */
export function getProductRequestById(id: string): ProductRequestItem | undefined {
  const requests = getProductRequests();
  return requests.find((r) => r.id === id);
}

/**
 * Get count of PENDING requests (for the header icon badge)
 */
export function getPendingRequestsCount(): number {
  const requests = getProductRequests();
  return requests.filter((r) => r.status === 'PENDING').length;
}

/**
 * Merchant accepts a request
 */
export function acceptProductRequest(id: string): ProductRequestItem {
  const requests = getProductRequests();
  const index = requests.findIndex((r) => r.id === id);
  if (index === -1) {
    throw new Error(`Request not found: ${id}`);
  }

  const now = new Date();
  const timeFormatted = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const updated: ProductRequestItem = {
    ...requests[index],
    status: 'ACCEPTED',
    acceptedAt: `Today, ${timeFormatted}`,
  };

  requests[index] = updated;
  saveRequests(requests);
  return updated;
}

/**
 * Merchant cancels a request (with optional reason)
 */
export function cancelProductRequest(id: string, reason?: string): ProductRequestItem {
  const requests = getProductRequests();
  const index = requests.findIndex((r) => r.id === id);
  if (index === -1) {
    throw new Error(`Request not found: ${id}`);
  }

  const now = new Date();
  const timeFormatted = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const updated: ProductRequestItem = {
    ...requests[index],
    status: 'CANCELLED',
    cancelledAt: `Today, ${timeFormatted}`,
    cancellationReason: reason || 'Merchant cancelled this request.',
  };

  requests[index] = updated;
  saveRequests(requests);
  return updated;
}

/**
 * Merchant sends a voice message response for a product request
 */
export function sendMerchantVoiceReply(
  requestId: string,
  audioUrl: string | undefined,
  durationSeconds: number
): VoiceMessage {
  const requests = getProductRequests();
  const index = requests.findIndex((r) => r.id === requestId);
  if (index === -1) {
    throw new Error(`Request not found: ${requestId}`);
  }

  const minutes = Math.floor(durationSeconds / 60);
  const seconds = durationSeconds % 60;
  const durationFormatted = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

  const now = new Date();
  const timeFormatted = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const newVoiceMessage: VoiceMessage = {
    id: `vm-${Date.now()}`,
    sender: 'merchant',
    senderName: 'You (Merchant)',
    durationSeconds: Math.max(1, durationSeconds),
    durationFormatted,
    timestamp: `Today, ${timeFormatted}`,
    audioUrl,
  };

  const req = requests[index];
  const updatedReq: ProductRequestItem = {
    ...req,
    voiceMessages: [...req.voiceMessages, newVoiceMessage],
  };

  requests[index] = updatedReq;
  saveRequests(requests);
  return newVoiceMessage;
}

/**
 * Subscribe to requests updates
 */
export function subscribeProductRequests(
  callback: (requests: ProductRequestItem[]) => void
): () => void {
  listeners.push(callback);
  return () => {
    const idx = listeners.indexOf(callback);
    if (idx !== -1) {
      listeners.splice(idx, 1);
    }
  };
}
