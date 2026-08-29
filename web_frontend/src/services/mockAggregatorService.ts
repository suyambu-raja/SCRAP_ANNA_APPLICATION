import { getDb, simulateNetwork } from './mockDataService';
import type { AggregatorData } from '@/types';

export async function getAggregatorData(): Promise<AggregatorData> {
  return simulateNetwork(() => {
    return getDb().aggregator_data;
  });
}
