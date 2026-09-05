/**
 * BillScrap Merchant Order Payment Service
 *
 * Handles Stage 5: Payment inside the Merchant Order Workflow.
 * Direction: Customer / Industry pays Merchant for the finalized scrap bill.
 * (Completely separate from post-settlement BillScrap company commission payment).
 */

export type OrderPaymentMethod = 'UPI' | 'CASH';

export type OrderPaymentStatus =
  | 'PENDING'
  | 'INITIATED'
  | 'SUBMITTED'
  | 'CONFIRMED'
  | 'FAILED';

export interface OrderPaymentRecord {
  orderId: string;
  billNumber: string;
  amount: number; // Final actual bill amount
  currency: 'INR';
  method: OrderPaymentMethod;
  status: OrderPaymentStatus;
  payeeUpiId: string;
  payeeName: string;
  utr?: string;
  submittedAt?: string;
  confirmedAt?: string;
  updatedAt: string;
  notes?: string;
}

const STORAGE_KEY = 'billscrap_merchant_order_payments_v1';

export const DEFAULT_MERCHANT_UPI_ID = 'rameshtraders@upi';
export const DEFAULT_MERCHANT_PAYEE_NAME = 'Ramesh Traders';

function getStoredPayments(): Record<string, OrderPaymentRecord> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveStoredPayments(data: Record<string, OrderPaymentRecord>): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.error('Failed to save order payment record:', err);
  }
}

/**
 * Retrieve or initialize an order payment record.
 */
export function getOrCreateOrderPayment(
  orderId: string,
  billNumber: string,
  finalAmount: number,
  merchantName = DEFAULT_MERCHANT_PAYEE_NAME,
  merchantUpi = DEFAULT_MERCHANT_UPI_ID
): OrderPaymentRecord {
  const records = getStoredPayments();
  const existing = records[orderId];

  if (existing) {
    // If the bill amount was adjusted, update amount while preserving status
    if (existing.amount !== finalAmount) {
      existing.amount = finalAmount;
      existing.updatedAt = new Date().toISOString();
      records[orderId] = existing;
      saveStoredPayments(records);
    }
    return existing;
  }

  const newRecord: OrderPaymentRecord = {
    orderId,
    billNumber,
    amount: finalAmount,
    currency: 'INR',
    method: 'UPI',
    status: 'PENDING',
    payeeUpiId: merchantUpi,
    payeeName: merchantName,
    updatedAt: new Date().toISOString(),
  };

  records[orderId] = newRecord;
  saveStoredPayments(records);
  return newRecord;
}

/**
 * Update payment method (UPI or CASH)
 */
export function setOrderPaymentMethod(
  orderId: string,
  method: OrderPaymentMethod
): OrderPaymentRecord | null {
  const records = getStoredPayments();
  const existing = records[orderId];
  if (!existing) return null;

  existing.method = method;
  // If moving between methods while still unsubmitted/unconfirmed, keep PENDING
  if (existing.status === 'INITIATED') {
    existing.status = 'PENDING';
  }
  existing.updatedAt = new Date().toISOString();

  records[orderId] = existing;
  saveStoredPayments(records);
  return existing;
}

/**
 * Generates a generic UPI deep-link intent URI for customer paying merchant.
 * Format: upi://pay?pa=<UPI_ID>&pn=<NAME>&am=<AMOUNT>&cu=INR&tr=<ORDER_ID>&tn=<NOTE>
 */
export function createOrderUpiPaymentIntent(
  payeeUpi: string,
  payeeName: string,
  amount: number,
  orderId: string
): string {
  const cleanOrderId = orderId.replace(/[^a-zA-Z0-9]/g, '');
  const params = new URLSearchParams({
    pa: payeeUpi,
    pn: payeeName,
    am: amount.toString(),
    cu: 'INR',
    tr: cleanOrderId,
    tn: `BillScrap Order ${orderId}`,
  });
  return `upi://pay?${params.toString()}`;
}

/**
 * Mark UPI payment as initiated when merchant/customer triggers UPI app.
 */
export function markOrderPaymentInitiated(orderId: string): OrderPaymentRecord | null {
  const records = getStoredPayments();
  const existing = records[orderId];
  if (!existing) return null;

  if (existing.status === 'PENDING') {
    existing.status = 'INITIATED';
    existing.updatedAt = new Date().toISOString();
    records[orderId] = existing;
    saveStoredPayments(records);
  }
  return existing;
}

/**
 * Submits the customer's UTR / transaction reference for UPI payment.
 * Status becomes 'SUBMITTED' (awaiting bank settlement/confirmation).
 */
export function submitOrderPaymentUtr(
  orderId: string,
  utr: string
): OrderPaymentRecord | null {
  const records = getStoredPayments();
  const existing = records[orderId];
  if (!existing) return null;

  existing.method = 'UPI';
  existing.status = 'SUBMITTED';
  existing.utr = utr.trim();
  existing.submittedAt = new Date().toISOString();
  existing.updatedAt = new Date().toISOString();

  records[orderId] = existing;
  saveStoredPayments(records);
  return existing;
}

/**
 * Confirms cash payment receipt from the customer.
 * Status becomes 'CONFIRMED'.
 */
export function confirmOrderCashPayment(orderId: string): OrderPaymentRecord | null {
  const records = getStoredPayments();
  const existing = records[orderId];
  if (!existing) return null;

  existing.method = 'CASH';
  existing.status = 'CONFIRMED';
  existing.confirmedAt = new Date().toISOString();
  existing.updatedAt = new Date().toISOString();

  records[orderId] = existing;
  saveStoredPayments(records);
  return existing;
}
