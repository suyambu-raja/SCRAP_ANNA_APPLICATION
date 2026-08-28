import { getDb, simulateNetwork } from './mockDataService';
import type { HouseholdOrder, Transaction } from '@/types';

export async function getHouseholdOrders(userId?: string): Promise<HouseholdOrder[]> {
  return simulateNetwork(() => {
    const orders = getDb().household_orders;
    if (userId) {
      return orders.filter((o) => o.userId === userId);
    }
    return orders;
  });
}

export async function createHouseholdOrder(orderData: {
  userId: string;
  categoryId: string;
  categoryName: string;
  quantity: number;
  unit: string;
  estimatedAmount: number;
  pickupDate: string;
  timeSlot: string;
  address: string;
}): Promise<HouseholdOrder> {
  return simulateNetwork(() => {
    const db = getDb();
    const newOrder: HouseholdOrder = {
      id: `ORD${String(db.household_orders.length + 1).padStart(3, '0')}`,
      userId: orderData.userId,
      type: 'scrap_sale',
      status: 'pickup_scheduled',
      items: [
        {
          categoryId: orderData.categoryId,
          name: orderData.categoryName,
          quantity: orderData.quantity,
          unit: orderData.unit,
          estimatedAmount: orderData.estimatedAmount,
        },
      ],
      merchantId: 'USR002', // Auto-assigned default nearby merchant for demo
      pickup: {
        date: orderData.pickupDate,
        timeSlot: orderData.timeSlot,
        address: orderData.address,
      },
      totalAmount: orderData.estimatedAmount,
      createdAt: new Date().toISOString(),
    };

    db.household_orders.unshift(newOrder);
    return newOrder;
  });
}

export async function getHouseholdTransactions(userId?: string): Promise<Transaction[]> {
  return simulateNetwork(() => {
    const txns = getDb().transactions;
    if (userId) {
      return txns.filter((t) => t.userId === userId);
    }
    return txns;
  });
}
