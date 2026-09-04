export type UserRole = 'household' | 'merchant' | 'industry';
export type UserStatus = 'active' | 'inactive' | 'suspended';

export interface UserLocation {
  address?: string;
  area: string;
  city: string;
  state: string;
  pincode: string;
}

export interface User {
  id: string;
  role: UserRole;
  name: string;
  email: string;
  phone: string;
  language: 'en' | 'ta';
  location: UserLocation;
  avatar: string | null;
  verified: boolean;
  status: UserStatus;
}

export interface DemoAccount {
  userId: string;
  login: string;
  password: string;
}

export interface ScrapCategory {
  id: string;
  name: string;
  name_ta: string;
  unit: string;
  icon: string;
  description?: string;
}

export interface MarketPrice {
  id: string;
  name: string;
  category: string;
  categoryId: string;
  subcategory?: string;
  price: number;
  priceMin?: number;
  priceMax?: number;
  unit: string;
  change: number;
  trend: 'up' | 'down' | 'stable';
  location: string;
  updatedAt: string;
  imageUrl?: string;
  quality?: string;
  measurement?: string;
  demandStatus?: string;
  descriptors?: string;
}

export interface OrderItem {
  categoryId: string;
  name: string;
  quantity: number;
  unit: string;
  estimatedAmount: number;
}

export interface OrderPickup {
  date: string;
  timeSlot: string;
  address: string;
}

export interface HouseholdOrder {
  id: string;
  userId: string;
  type: string;
  status: 'pending' | 'pickup_scheduled' | 'in_progress' | 'completed' | 'cancelled';
  items: OrderItem[];
  merchantId?: string;
  pickup: OrderPickup;
  totalAmount: number;
  createdAt: string;
}

export interface IndustryRequest {
  id: string;
  industryId: string;
  title: string;
  categoryId: string;
  description: string;
  quantity: number;
  unit: string;
  location: {
    area: string;
    city: string;
    pincode: string;
  };
  preferredPickupDate: string;
  status: 'open' | 'offers_received' | 'merchant_selected' | 'in_progress' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface MerchantOffer {
  id: string;
  requestId: string;
  merchantId: string;
  pricePerUnit: number;
  unit: string;
  totalAmount: number;
  pickupDate: string;
  pickupTime: string;
  distanceKm: number;
  message: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

export interface ReusableProduct {
  id: string;
  merchantId: string;
  title: string;
  category: string;
  description: string;
  condition: string;
  quantity: number;
  unit: string;
  price: number;
  negotiable: boolean;
  location: {
    area: string;
    city: string;
    state: string;
  };
  images: string[];
  status: 'available' | 'reserved' | 'sold';
  createdAt: string;
}

export interface MerchantTransaction {
  id: string;
  merchantId: string;
  type: 'scrap_purchase' | 'reusable_product_sale' | 'other';
  category?: string;
  productId?: string;
  quantity?: number;
  unit?: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  date: string;
}

export interface AggregatorOpportunity {
  id: string;
  type: 'industry_request' | 'reusable_product' | 'bulk_auction';
  title: string;
  location: string;
  quantity: number;
  unit: string;
  status: string;
}

export interface AggregatorData {
  network_statistics: {
    activeHouseholds: number;
    activeMerchants: number;
    connectedIndustries: number;
    recycledTons: number;
  };
  opportunities: AggregatorOpportunity[];
}

export interface Notification {
  id: string;
  userId: string;
  type: 'order' | 'industry_request' | 'merchant_offer' | 'opportunity' | 'system';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  receiverId: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export interface Transaction {
  id: string;
  userId: string;
  orderId: string;
  type: string;
  category: string;
  quantity: number;
  unit: string;
  amount: number;
  status: 'completed' | 'pending' | 'failed';
  date: string;
}

export interface AppSettings {
  supportedLanguages: Array<{
    code: string;
    label: string;
    nativeLabel: string;
  }>;
  defaultLanguage: string;
  notificationTypes: string[];
}

export interface MockDatabase {
  mock_environment: {
    mode: string;
    description: string;
    location: {
      city: string;
      state: string;
      country: string;
    };
    currency: string;
    languages: string[];
  };
  users: User[];
  demo_accounts: {
    purpose: string;
    accounts: DemoAccount[];
  };
  scrap_categories: ScrapCategory[];
  market_prices: MarketPrice[];
  household_orders: HouseholdOrder[];
  industry_requests: IndustryRequest[];
  merchant_offers: MerchantOffer[];
  reusable_products: ReusableProduct[];
  merchant_transactions: MerchantTransaction[];
  aggregator_data: AggregatorData;
  notifications: Notification[];
  messages: Message[];
  transactions: Transaction[];
  settings: AppSettings;
}
