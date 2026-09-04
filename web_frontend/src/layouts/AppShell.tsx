import { Outlet } from 'react-router-dom';
import { useDisplayMode } from '@/hooks/useDisplayMode';
import { useAuthStore } from '@/store/useAuthStore';
import { AppBottomTabBar } from '@/components/app-shell/AppBottomTabBar';
import { AppBrowserHeader } from '@/components/app-shell/AppBrowserHeader';
import styles from './AppShell.module.css';

/**
 * AppShell wraps all logged-in product experience routes (/app/*).
 *
 * It dynamically detects whether the app is running in:
 * - Standalone Mode (installed PWA / iOS home screen):
 *   Renders no top navbar and provides a fixed bottom 4-tab bar (Home, Post Scrap, Track, Profile).
 * - Browser Mode (regular browser tab):
 *   Renders a slim top header with horizontal navigation and an install prompt, with no bottom bar.
 *
 * Contains NO marketing heroes, NO public navbar, and NO public marketing footer.
 */
export function AppShell() {
  const { shouldUseBottomBar } = useDisplayMode();
  const user = useAuthStore((s) => s.user);
  const isMerchant = user?.role === 'merchant';

  return (
    <div className={styles.appShellContainer}>
      {/* 1. In Desktop Browser Mode, render slim top header with horizontal navigation for non-merchants */}
      {!shouldUseBottomBar && !isMerchant && <AppBrowserHeader />}

      {/* 2. Main functional view content */}
      <main
        className={
          shouldUseBottomBar
            ? styles.standaloneMainContent
            : isMerchant
            ? styles.merchantMainContent
            : styles.browserMainContent
        }
      >
        <Outlet />
      </main>

      {/* 3. In Standalone PWA mode OR on mobile screens, render fixed bottom tab bar */}
      {shouldUseBottomBar && !isMerchant && <AppBottomTabBar />}
    </div>
  );
}
