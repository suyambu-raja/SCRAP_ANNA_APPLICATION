/**
 * BillScrap Commission Reminder Service
 *
 * Manages persistent 5-minute reminders when a merchant closes the commission payment
 * screen without submitting payment.
 *
 * Features:
 * - Persistent storage in localStorage
 * - Single-timer guarantees (clears old timers before scheduling)
 * - User isolation (tied to merchantId, cleared on logout)
 * - Automatic cancellation once payment is submitted/verified
 * - Non-intrusive re-prompting via custom event bus
 */

export interface CommissionReminder {
  orderId: string;
  merchantId: string;
  customerName: string;
  finalOrderAmount: number;
  commissionAmount: number;
  billNumber?: string;
  scheduledAt: number; // timestamp
  triggerAt: number; // timestamp (5 minutes later)
  active: boolean;
}

export const REMINDER_DURATION_MS = 5 * 60 * 1000; // 5 minutes
const STORAGE_KEY = 'billscrap_commission_reminders_v1';
export const OPEN_COMMISSION_MODAL_EVENT = 'billscrap:open-commission-modal';

export interface OpenCommissionModalDetail {
  orderId: string;
  customerName: string;
  finalOrderAmount: number;
  billNumber?: string;
  merchantId?: string;
}

/**
 * Dispatches an event to open the Merchant Commission Payment modal in the UI.
 */
export function openMerchantCommissionModal(detail: OpenCommissionModalDetail): void {
  window.dispatchEvent(
    new CustomEvent(OPEN_COMMISSION_MODAL_EVENT, {
      detail,
    })
  );
}

class CommissionReminderService {
  private activeTimeoutId: number | null = null;
  private currentMerchantId: string | null = null;

  /**
   * Initializes the reminder service for the authenticated merchant.
   * Checks if any pending reminder is due or needs to be scheduled.
   */
  public initialize(merchantId: string): void {
    this.currentMerchantId = merchantId;
    this.checkAndArmReminder();
  }

  /**
   * Schedules a 5-minute reminder for an unpaid commission.
   */
  public scheduleReminder(
    orderId: string,
    merchantId: string,
    meta: {
      customerName: string;
      finalOrderAmount: number;
      commissionAmount: number;
      billNumber?: string;
    }
  ): void {
    // Clear any previous in-memory timer
    this.clearTimer();

    const now = Date.now();
    const reminder: CommissionReminder = {
      orderId,
      merchantId,
      customerName: meta.customerName,
      finalOrderAmount: meta.finalOrderAmount,
      commissionAmount: meta.commissionAmount,
      billNumber: meta.billNumber,
      scheduledAt: now,
      triggerAt: now + REMINDER_DURATION_MS,
      active: true,
    };

    const reminders = this.getAllReminders();
    reminders[orderId] = reminder;
    this.saveAllReminders(reminders);

    this.armTimeout(orderId, REMINDER_DURATION_MS);
  }

  /**
   * Cancels any pending reminder for a specific order (e.g. once payment is submitted).
   */
  public cancelReminder(orderId: string): void {
    const reminders = this.getAllReminders();
    if (reminders[orderId]) {
      delete reminders[orderId];
      this.saveAllReminders(reminders);
    }
    this.clearTimer();
    this.checkAndArmReminder();
  }

  /**
   * Clears all reminders for a specific user (used during logout).
   */
  public clearAllForUser(merchantId: string): void {
    const reminders = this.getAllReminders();
    let modified = false;
    for (const key of Object.keys(reminders)) {
      if (reminders[key].merchantId === merchantId) {
        delete reminders[key];
        modified = true;
      }
    }
    if (modified) {
      this.saveAllReminders(reminders);
    }
    this.clearTimer();
    this.currentMerchantId = null;
  }

  /**
   * Gets any active pending reminder for the given merchant.
   */
  public getPendingReminder(merchantId: string): CommissionReminder | null {
    const reminders = this.getAllReminders();
    for (const key of Object.keys(reminders)) {
      const item = reminders[key];
      if (item.merchantId === merchantId && item.active) {
        return item;
      }
    }
    return null;
  }

  private armTimeout(orderId: string, delayMs: number): void {
    this.clearTimer();
    const effectiveDelay = Math.max(0, delayMs);

    this.activeTimeoutId = window.setTimeout(() => {
      this.triggerReminder(orderId);
    }, effectiveDelay);
  }

  private triggerReminder(orderId: string): void {
    const reminders = this.getAllReminders();
    const reminder = reminders[orderId];

    if (!reminder || !reminder.active) return;

    // Verify the reminder belongs to current merchant
    if (this.currentMerchantId && reminder.merchantId !== this.currentMerchantId) {
      return;
    }

    // Dispatch event to open the commission modal in UI
    window.dispatchEvent(
      new CustomEvent(OPEN_COMMISSION_MODAL_EVENT, {
        detail: reminder,
      })
    );
  }

  private checkAndArmReminder(): void {
    if (!this.currentMerchantId) return;

    const pending = this.getPendingReminder(this.currentMerchantId);
    if (!pending) {
      this.clearTimer();
      return;
    }

    const now = Date.now();
    const remainingMs = pending.triggerAt - now;

    if (remainingMs <= 0) {
      // Due immediately
      this.triggerReminder(pending.orderId);
    } else {
      this.armTimeout(pending.orderId, remainingMs);
    }
  }

  private clearTimer(): void {
    if (this.activeTimeoutId !== null) {
      window.clearTimeout(this.activeTimeoutId);
      this.activeTimeoutId = null;
    }
  }

  private getAllReminders(): Record<string, CommissionReminder> {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  }

  private saveAllReminders(reminders: Record<string, CommissionReminder>): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(reminders));
    } catch (err) {
      console.error('Failed to save commission reminders:', err);
    }
  }
}

export const commissionReminderService = new CommissionReminderService();
