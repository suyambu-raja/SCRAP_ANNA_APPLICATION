import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { MerchantSidebar } from '@/components/navigation/MerchantSidebar';
import { MerchantTopHeader } from '@/components/navigation/MerchantTopHeader';
import { MerchantBottomNav } from '@/components/navigation/MerchantBottomNav';
import { useAuthStore } from '@/store/useAuthStore';
import {
  commissionReminderService,
  OPEN_COMMISSION_MODAL_EVENT,
  type OpenCommissionModalDetail,
} from '@/services/commissionReminderService';
import { MerchantCommissionModal } from '@/components/merchant/MerchantCommissionModal';
import styles from './MerchantLayout.module.css';

/**
 * MerchantLayout wraps all dedicated merchant product experience routes.
 *
 * Provides:
 * - Left collapsible sidebar (~240px expanded / ~72px collapsed)
 * - Slim top header with dynamic page title, language toggle, notifications, and profile menu
 * - Full remaining width main content area without modifying internal page layouts
 * - Mobile fixed bottom navigation bar (Home, Requests, Orders, Products, Profile)
 * - Persistent Commission Payment Modal Host & 5-minute reminder listener
 */
export function MerchantLayout() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeCommissionModal, setActiveCommissionModal] =
    useState<OpenCommissionModalDetail | null>(null);
  const currentUser = useAuthStore((s) => s.user);

  // Auto-collapse sidebar on smaller tablet/desktop widths (<= 1024px)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 1024) {
        setIsCollapsed(true);
      } else {
        setIsCollapsed(false);
      }
    };

    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Initialize reminder service and listen for commission reminder events
  useEffect(() => {
    const merchantId = currentUser?.id || 'merchant_default';
    commissionReminderService.initialize(merchantId);

    const handleOpenCommissionModal = (e: Event) => {
      const customEvent = e as CustomEvent<OpenCommissionModalDetail>;
      if (customEvent.detail) {
        setActiveCommissionModal(customEvent.detail);
      }
    };

    window.addEventListener(OPEN_COMMISSION_MODAL_EVENT, handleOpenCommissionModal);
    return () => {
      window.removeEventListener(OPEN_COMMISSION_MODAL_EVENT, handleOpenCommissionModal);
    };
  }, [currentUser?.id]);

  const toggleCollapse = () => {
    setIsCollapsed((prev) => !prev);
  };

  return (
    <div className={styles.merchantLayoutRoot}>
      {/* 1. Left Fixed Sidebar (Hidden on Mobile) */}
      <MerchantSidebar isCollapsed={isCollapsed} onToggle={toggleCollapse} />

      {/* 2. Right Main Wrapper (Offset by sidebar width on desktop) */}
      <div
        className={`${styles.mainWrapper} ${
          isCollapsed ? styles.mainWrapperCollapsed : styles.mainWrapperExpanded
        }`}
      >
        {/* Slim Top Header */}
        <MerchantTopHeader />

        {/* Nested Page Content (Dashboard, Requests, My Quotes, Orders, Ride, etc.) */}
        <main className={styles.contentArea}>
          <Outlet />
        </main>
      </div>

      {/* 3. Mobile Fixed Bottom Navigation (Mobile Only) */}
      <MerchantBottomNav />

      {/* 4. Global Merchant Commission Payment Modal */}
      {activeCommissionModal && (
        <MerchantCommissionModal
          isOpen={Boolean(activeCommissionModal)}
          orderId={activeCommissionModal.orderId}
          customerName={activeCommissionModal.customerName}
          finalAmount={activeCommissionModal.finalOrderAmount}
          billNumber={activeCommissionModal.billNumber}
          merchantId={currentUser?.id || activeCommissionModal.merchantId || 'merchant_default'}
          onClose={() => setActiveCommissionModal(null)}
          onContinueToOrders={() => setActiveCommissionModal(null)}
        />
      )}
    </div>
  );
}

export default MerchantLayout;
