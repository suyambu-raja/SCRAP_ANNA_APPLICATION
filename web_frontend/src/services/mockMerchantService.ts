import { getDb, simulateNetwork } from './mockDataService';
import type { ReusableProduct, MerchantTransaction, MerchantOffer, IndustryRequest } from '@/types';

export async function getNearbyIndustryRequests(_merchantId?: string): Promise<IndustryRequest[]> {
  return simulateNetwork(() => {
    // Return open/available industry requests in Chennai area
    return getDb().industry_requests.filter((r) => r.status === 'open' || r.status === 'offers_received');
  });
}

/**
 * Enforces business rule: Merchant can ONLY see their own submitted offers
 */
export async function getMerchantOffers(merchantId: string): Promise<MerchantOffer[]> {
  return simulateNetwork(() => {
    return getDb().merchant_offers.filter((o) => o.merchantId === merchantId);
  });
}

export async function submitMerchantOffer(data: {
  requestId: string;
  merchantId: string;
  pricePerUnit: number;
  unit: string;
  totalAmount: number;
  pickupDate: string;
  pickupTime: string;
  distanceKm?: number;
  message?: string;
}): Promise<MerchantOffer> {
  return simulateNetwork(() => {
    const db = getDb();
    const newOffer: MerchantOffer = {
      id: `OFFER${String(db.merchant_offers.length + 1).padStart(3, '0')}`,
      requestId: data.requestId,
      merchantId: data.merchantId,
      pricePerUnit: data.pricePerUnit,
      unit: data.unit,
      totalAmount: data.totalAmount,
      pickupDate: data.pickupDate,
      pickupTime: data.pickupTime,
      distanceKm: data.distanceKm || 5.0,
      message: data.message || '',
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    db.merchant_offers.unshift(newOffer);

    // Update request status to offers_received if open
    const req = db.industry_requests.find((r) => r.id === data.requestId);
    if (req && req.status === 'open') {
      req.status = 'offers_received';
    }

    return newOffer;
  });
}

export async function getReusableProducts(merchantId?: string): Promise<ReusableProduct[]> {
  return simulateNetwork(() => {
    const prods = getDb().reusable_products;
    if (merchantId) {
      return prods.filter((p) => p.merchantId === merchantId);
    }
    return prods;
  });
}

export async function createReusableProduct(data: {
  merchantId: string;
  title: string;
  category: string;
  description: string;
  condition: string;
  quantity: number;
  unit?: string;
  price: number;
  negotiable?: boolean;
  area: string;
  city: string;
  state: string;
}): Promise<ReusableProduct> {
  return simulateNetwork(() => {
    const db = getDb();
    const newProduct: ReusableProduct = {
      id: `PROD${String(db.reusable_products.length + 1).padStart(3, '0')}`,
      merchantId: data.merchantId,
      title: data.title,
      category: data.category,
      description: data.description,
      condition: data.condition,
      quantity: data.quantity,
      unit: data.unit || 'units',
      price: data.price,
      negotiable: data.negotiable ?? true,
      location: {
        area: data.area,
        city: data.city,
        state: data.state,
      },
      images: [],
      status: 'available',
      createdAt: new Date().toISOString(),
    };

    db.reusable_products.unshift(newProduct);
    return newProduct;
  });
}

export async function getMerchantTransactions(merchantId: string): Promise<MerchantTransaction[]> {
  return simulateNetwork(() => {
    return getDb().merchant_transactions.filter((t) => t.merchantId === merchantId);
  });
}
