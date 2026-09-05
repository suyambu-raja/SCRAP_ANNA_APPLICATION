/**
 * BillScrap Merchant Commission Service
 *
 * Handles company commission calculation, company UPI configuration,
 * generic UPI payment intent generation, and UTR reference submission.
 * Designed as a modular service so it can later be cleanly connected to Django backend APIs.
 */

export type CommissionStatus =
  | 'DUE'
  | 'PAYMENT_INITIATED'
  | 'SUBMITTED'
  | 'VERIFIED'
  | 'FAILED'
  | 'WAIVED';

export interface CommissionRecord {
  orderId: string;
  merchantId: string;
  customerName: string;
  orderNumber?: string;
  finalOrderAmount: number;
  amount: number; // Commission amount in INR
  currency: 'INR';
  status: CommissionStatus;
  companyUpiId: string;
  companyPayeeName: string;
  paymentMethod: 'UPI';
  utr?: string;
  submittedAt?: string;
  verifiedAt?: string;
  dueAt: string;
  notes?: string;
}

// Configurable Business Rules (Replaceable by Backend)
export const DEFAULT_COMMISSION_PERCENT = 2.5; // 2.5% of finalized scrap transaction
export const MINIMUM_COMMISSION_INR = 50; // Minimum commission per completed order
export const BILLSCRAP_COMPANY_UPI_ID =
  (import.meta.env.VITE_BILLSCRAP_UPI_ID as string) || 'billscrap@upi';
export const BILLSCRAP_PAYEE_NAME = 'BillScrap Technologies';

// In-memory / persistent cache for development demo
const STORAGE_KEY = 'billscrap_merchant_commissions_v1';

function getStoredCommissions(): Record<string, CommissionRecord> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveStoredCommissions(data: Record<string, CommissionRecord>): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.error('Failed to save commission record:', err);
  }
}

/**
 * Calculates the exact commission for a finalized transaction.
 * Based strictly on actual final settlement value, never on projected estimates.
 */
export function calculateCommissionAmount(finalAmount: number): number {
  if (!finalAmount || finalAmount <= 0) return MINIMUM_COMMISSION_INR;
  const calculated = Math.round((finalAmount * DEFAULT_COMMISSION_PERCENT) / 100);
  return Math.max(calculated, MINIMUM_COMMISSION_INR);
}

/**
 * Returns public company UPI payment details.
 */
export function getCompanyUpiDetails(): {
  upiId: string;
  payeeName: string;
  isDevMock: boolean;
} {
  const isProduction = Boolean(import.meta.env.PROD && import.meta.env.VITE_BILLSCRAP_UPI_ID);
  return {
    upiId: BILLSCRAP_COMPANY_UPI_ID,
    payeeName: BILLSCRAP_PAYEE_NAME,
    isDevMock: !isProduction,
  };
}

/**
 * Retrieves an existing commission record for an order, or creates an initial 'DUE' record.
 */
export function getCommission(
  orderId: string,
  merchantId = 'merchant_default',
  customerName = 'Customer',
  finalAmount = 0
): CommissionRecord {
  const records = getStoredCommissions();
  if (records[orderId]) {
    return records[orderId];
  }

  const amount = calculateCommissionAmount(finalAmount);
  const upiInfo = getCompanyUpiDetails();

  const newRecord: CommissionRecord = {
    orderId,
    merchantId,
    customerName,
    orderNumber: orderId,
    finalOrderAmount: finalAmount,
    amount,
    currency: 'INR',
    status: 'DUE',
    companyUpiId: upiInfo.upiId,
    companyPayeeName: upiInfo.payeeName,
    paymentMethod: 'UPI',
    dueAt: new Date().toISOString(),
  };

  records[orderId] = newRecord;
  saveStoredCommissions(records);
  return newRecord;
}

/**
 * Generates a standard UPI deep link intent URI.
 * Format: upi://pay?pa=<UPI_ID>&pn=<NAME>&am=<AMOUNT>&cu=INR&tr=<ORDER_ID>
 */
export function createUpiPaymentIntent(commission: CommissionRecord): string {
  const params = new URLSearchParams({
    pa: commission.companyUpiId,
    pn: commission.companyPayeeName,
    am: commission.amount.toString(),
    cu: 'INR',
    tr: `${commission.orderId.replace(/[^a-zA-Z0-9]/g, '')}`,
    tn: `BillScrap Commission ${commission.orderId}`,
  });
  return `upi://pay?${params.toString()}`;
}

/**
 * Submits the merchant's UTR / Transaction Reference for backend verification.
 * Does NOT mark payment as verified; marks as 'SUBMITTED' (Awaiting Verification).
 */
export async function submitCommissionPaymentReference(
  orderId: string,
  utr: string
): Promise<CommissionRecord> {
  const records = getStoredCommissions();
  const existing = records[orderId];

  if (!existing) {
    throw new Error(`No commission record found for order ${orderId}`);
  }

  const updated: CommissionRecord = {
    ...existing,
    status: 'SUBMITTED',
    utr: utr.trim(),
    submittedAt: new Date().toISOString(),
  };

  records[orderId] = updated;
  saveStoredCommissions(records);

  return updated;
}

/**
 * Gets the current payment status for a commission.
 */
export function getCommissionPaymentStatus(orderId: string): CommissionStatus {
  const records = getStoredCommissions();
  return records[orderId]?.status || 'DUE';
}
