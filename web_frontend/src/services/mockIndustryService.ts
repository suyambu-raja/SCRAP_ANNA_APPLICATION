import { getDb, simulateNetwork } from './mockDataService';
import type { IndustryRequest, MerchantOffer } from '@/types';

export async function getIndustryRequests(industryId?: string): Promise<IndustryRequest[]> {
  return simulateNetwork(() => {
    const requests = getDb().industry_requests;
    if (industryId) {
      return requests.filter((r) => r.industryId === industryId);
    }
    return requests;
  });
}

export async function getIndustryRequestById(requestId: string): Promise<IndustryRequest | null> {
  return simulateNetwork(() => {
    return getDb().industry_requests.find((r) => r.id === requestId) || null;
  });
}

export async function createIndustryRequest(data: {
  industryId: string;
  title: string;
  categoryId: string;
  description: string;
  quantity: number;
  unit: string;
  area: string;
  city: string;
  pincode: string;
  preferredPickupDate: string;
}): Promise<IndustryRequest> {
  return simulateNetwork(() => {
    const db = getDb();
    const newReq: IndustryRequest = {
      id: `REQ${String(db.industry_requests.length + 1).padStart(3, '0')}`,
      industryId: data.industryId,
      title: data.title,
      categoryId: data.categoryId,
      description: data.description,
      quantity: data.quantity,
      unit: data.unit,
      location: {
        area: data.area,
        city: data.city,
        pincode: data.pincode,
      },
      preferredPickupDate: data.preferredPickupDate,
      status: 'open',
      createdAt: new Date().toISOString(),
    };

    db.industry_requests.unshift(newReq);
    return newReq;
  });
}

/**
 * Enforces business rule: Offers are strictly private between requesting industry and submitting merchant
 */
export async function getOffersForRequest(requestId: string): Promise<MerchantOffer[]> {
  return simulateNetwork(() => {
    return getDb().merchant_offers.filter((o) => o.requestId === requestId);
  });
}

export async function acceptOffer(offerId: string, requestId: string): Promise<MerchantOffer> {
  return simulateNetwork(() => {
    const db = getDb();
    const offer = db.merchant_offers.find((o) => o.id === offerId);
    if (!offer) throw new Error('Offer not found');

    offer.status = 'accepted';

    // Mark other offers for this request as rejected
    db.merchant_offers
      .filter((o) => o.requestId === requestId && o.id !== offerId)
      .forEach((o) => {
        o.status = 'rejected';
      });

    // Update request status to merchant_selected
    const req = db.industry_requests.find((r) => r.id === requestId);
    if (req) {
      req.status = 'merchant_selected';
    }

    return offer;
  });
}

export async function rejectOffer(offerId: string): Promise<MerchantOffer> {
  return simulateNetwork(() => {
    const offer = getDb().merchant_offers.find((o) => o.id === offerId);
    if (!offer) throw new Error('Offer not found');
    offer.status = 'rejected';
    return offer;
  });
}
