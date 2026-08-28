import rawMockData from '@/mock/mock-data.json';
import type { MockDatabase } from '@/types';

// In-memory clone of the JSON database for runtime mutations
let db: MockDatabase = JSON.parse(JSON.stringify(rawMockData));

// Development configuration
export const mockConfig = {
  simulateDelay: true,
  minDelayMs: 300,
  maxDelayMs: 600,
  simulateErrors: false,
  errorRate: 0.05, // 5% chance of error when simulateErrors is true
};

/**
 * Simulates network latency and potential API errors
 */
export async function simulateNetwork<T>(executor: () => T | Promise<T>): Promise<T> {
  if (mockConfig.simulateDelay) {
    const delay = Math.floor(
      Math.random() * (mockConfig.maxDelayMs - mockConfig.minDelayMs + 1) + mockConfig.minDelayMs
    );
    await new Promise((resolve) => setTimeout(resolve, delay));
  }

  if (mockConfig.simulateErrors && Math.random() < mockConfig.errorRate) {
    throw new Error('Simulated network/server error for testing');
  }

  return executor();
}

/**
 * Access the in-memory database
 */
export const getDb = (): MockDatabase => db;

/**
 * Reset in-memory database back to pristine mock-data.json
 */
export const resetDb = (): void => {
  db = JSON.parse(JSON.stringify(rawMockData));
};
