import { useState, useEffect, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { LoadingSpinner } from '@/components/common';
import { HouseholdSidebar } from '@/components/navigation/HouseholdSidebar';
import { HouseholdTopHeader } from '@/components/navigation/HouseholdTopHeader';
import { HouseholdBottomNav } from '@/components/navigation/HouseholdBottomNav';
import styles from './HouseholdLayout.module.css';

export function HouseholdLayout() {
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

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleCollapse = () => {
    setIsCollapsed((prev) => !prev);
  };

  return (
    <div className={styles.householdLayoutRoot}>
      {/* 1. Left Fixed Collapsible Sidebar (Desktop) */}
      <HouseholdSidebar isCollapsed={isCollapsed} onToggle={toggleCollapse} />

      {/* 2. Right Main Content Area with Top Header */}
      <div
        className={`${styles.mainWrapper} ${
          isCollapsed ? styles.mainWrapperCollapsed : styles.mainWrapperExpanded
        }`}
      >
        <HouseholdTopHeader />
        <main className={styles.contentArea}>
          <Suspense fallback={<LoadingSpinner text="Loading Household Portal..." />}>
            <Outlet />
          </Suspense>
        </main>
      </div>

      {/* 3. Mobile Bottom Nav */}
      <HouseholdBottomNav />
    </div>
  );
}

export default HouseholdLayout;
