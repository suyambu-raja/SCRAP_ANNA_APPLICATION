import { useState, useEffect } from 'react';

export type DisplayMode = 'standalone' | 'browser';

export interface DisplayModeInfo {
  mode: DisplayMode;
  isStandalone: boolean;
  isBrowser: boolean;
  isMobile: boolean;
  shouldUseBottomBar: boolean;
}

/**
 * Custom hook to detect whether the application is running in standalone mode (installed PWA),
 * mobile viewport, or desktop browser tab.
 *
 * Accounts for:
 * - W3C standard: window.matchMedia('(display-mode: standalone)')
 * - iOS Safari: window.navigator.standalone
 * - Android TWA: document.referrer containing android-app://
 * - Mobile viewport testing: (max-width: 768px)
 * - URL query override for quick developer testing: ?mode=standalone or ?mode=browser
 */
export function useDisplayMode(): DisplayModeInfo {
  const checkIsStandalone = (): boolean => {
    if (typeof window === 'undefined') return false;

    // Check URL query override for instant testing (?pwa=true or ?mode=standalone)
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('mode') === 'standalone' || urlParams.get('pwa') === 'true') {
      return true;
    }
    if (urlParams.get('mode') === 'browser') {
      return false;
    }

    // 1. Standard display-mode media query (Android, Chrome, Edge, Desktop PWA)
    const isMediaQueryStandalone = window.matchMedia('(display-mode: standalone)').matches;

    // 2. iOS Safari standalone property
    const isIosStandalone = (window.navigator as unknown as { standalone?: boolean }).standalone === true;

    // 3. Android Trusted Web Activity (TWA)
    const isAndroidApp = typeof document !== 'undefined' && document.referrer.includes('android-app://');

    return isMediaQueryStandalone || isIosStandalone || isAndroidApp;
  };

  const checkIsMobile = (): boolean => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(max-width: 768px)').matches;
  };

  const [isStandalone, setIsStandalone] = useState<boolean>(checkIsStandalone);
  const [isMobile, setIsMobile] = useState<boolean>(checkIsMobile);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const standaloneQuery = window.matchMedia('(display-mode: standalone)');
    const mobileQuery = window.matchMedia('(max-width: 768px)');

    const handleStandaloneChange = (e: MediaQueryListEvent | MediaQueryList) => {
      const isNowStandalone = e.matches || (window.navigator as unknown as { standalone?: boolean }).standalone === true;
      setIsStandalone(Boolean(isNowStandalone));
    };

    const handleMobileChange = (e: MediaQueryListEvent | MediaQueryList) => {
      setIsMobile(Boolean(e.matches));
    };

    try {
      standaloneQuery.addEventListener('change', handleStandaloneChange);
      mobileQuery.addEventListener('change', handleMobileChange);
    } catch {
      standaloneQuery.addListener(handleStandaloneChange);
      mobileQuery.addListener(handleMobileChange);
    }

    const handleVisibility = () => {
      setIsStandalone(checkIsStandalone());
      setIsMobile(checkIsMobile());
    };

    window.addEventListener('resize', handleVisibility);
    window.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('appinstalled', handleVisibility);

    return () => {
      try {
        standaloneQuery.removeEventListener('change', handleStandaloneChange);
        mobileQuery.removeEventListener('change', handleMobileChange);
      } catch {
        standaloneQuery.removeListener(handleStandaloneChange);
        mobileQuery.removeListener(handleMobileChange);
      }
      window.removeEventListener('resize', handleVisibility);
      window.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('appinstalled', handleVisibility);
    };
  }, []);

  const mode: DisplayMode = isStandalone ? 'standalone' : 'browser';

  // Bottom tab bar is shown in installed standalone PWA mode OR on mobile viewport screens
  const shouldUseBottomBar = isStandalone || isMobile;

  return {
    mode,
    isStandalone,
    isBrowser: !isStandalone,
    isMobile,
    shouldUseBottomBar,
  };
}

