import { useState, useEffect, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { LoadingSpinner } from '@/components/common';
import { IndustrySidebar } from '@/components/navigation/IndustrySidebar';
import { IndustryTopHeader } from '@/components/navigation/IndustryTopHeader';
import { IndustryBottomNav } from '@/components/navigation/IndustryBottomNav';
import styles from './IndustryLayout.module.css';

/**
 * IndustryLayout wraps all dedicated B2B Industry portal routes.
 *
 * Provides:
 * - Left collapsible sidebar (~250px expanded / ~74px collapsed) for Desktop
 * - Slim top header with dynamic page title, support phone, notifications, and company profile
 * - Fixed 5-item bottom navigation for Mobile
 * - Full remaining width main content area matching Scrap Anna's White/Yellow/Graphite aesthetic
 */
export function IndustryLayout() {
  const [isCollapsed, setIsCollapsed] = useState(false);

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

  const toggleCollapse = () => {
    setIsCollapsed((prev) => !prev);
  };

  return (
    <div className={styles.industryLayoutRoot}>
      {/* 1. Left Fixed Sidebar (Desktop only) */}
      <IndustrySidebar isCollapsed={isCollapsed} onToggle={toggleCollapse} />

      {/* 2. Right Main Wrapper (Offset by sidebar width on Desktop, 100% on Mobile) */}
      <div
        className={`${styles.mainWrapper} ${
          isCollapsed ? styles.mainWrapperCollapsed : styles.mainWrapperExpanded
        }`}
      >
        {/* Slim Top Header */}
        <IndustryTopHeader />

        {/* Nested Page Content (Dashboard, Post Requirement, Quotes Received, Orders, etc.) */}
        <main className={styles.contentArea}>
          <Suspense fallback={<LoadingSpinner text="Loading Industry Portal..." />}>
            <Outlet />
          </Suspense>
        </main>
      </div>

      {/* 3. Mobile Bottom Navigation (Mobile <= 768px only) */}
      <IndustryBottomNav />
    </div>
  );
}

export default IndustryLayout;
