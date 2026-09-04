import { getDb, simulateNetwork } from './mockDataService';
import type { ScrapCategory, MarketPrice } from '@/types';

export async function getScrapCategories(): Promise<ScrapCategory[]> {
  return simulateNetwork(() => {
    return getDb().scrap_categories;
  });
}

export async function getMarketPrices(categoryId?: string): Promise<MarketPrice[]> {
  return simulateNetwork(() => {
    const prices = getDb().market_prices;
    if (categoryId) {
      return prices.filter((p) => p.categoryId === categoryId);
    }
    return prices;
  });
}

export async function getMarketPriceById(priceId: string): Promise<MarketPrice | null> {
  return simulateNetwork(() => {
    return getDb().market_prices.find((p) => p.id === priceId) || null;
  });
}
