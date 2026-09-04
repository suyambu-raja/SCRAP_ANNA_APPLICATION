import { useEffect } from 'react';

/**
 * Bulletproof Body Scroll Lock for Modals, Sheets, and Drawers.
 * - Freezes background scrolling on iOS Safari, Android Chrome, and Desktop.
 * - Prevents touch dragging, bounce, and scroll-chaining from overlays to the underlying page.
 * - Uses reference counting to support multiple/nested overlays seamlessly.
 * - Restores exact window scroll position upon closing without jumping.
 */

let activeLocksCount = 0;
let savedScrollY = 0;

let originalBodyStyles: {
  overflow: string;
  position: string;
  top: string;
  left: string;
  right: string;
  width: string;
  height: string;
  touchAction: string;
  overscrollBehavior: string;
} | null = null;

let originalHtmlStyles: {
  overflow: string;
  height: string;
  overscrollBehavior: string;
} | null = null;

// Touchmove event blocker for touches on backdrop/overlay
function preventBackdropTouchMove(e: TouchEvent) {
  const target = e.target as HTMLElement | null;
  if (!target) return;

  // If the user touched directly on an overlay/backdrop, prevent default to stop window drag
  const isOverlay =
    target.classList &&
    Array.from(target.classList).some(
      (cls) => typeof cls === 'string' && cls.toLowerCase().includes('overlay')
    );

  if (isOverlay && e.cancelable) {
    e.preventDefault();
  }
}

export function lockBodyScroll() {
  if (typeof document === 'undefined') return;

  if (activeLocksCount === 0) {
    savedScrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;

    originalBodyStyles = {
      overflow: document.body.style.overflow,
      position: document.body.style.position,
      top: document.body.style.top,
      left: document.body.style.left,
      right: document.body.style.right,
      width: document.body.style.width,
      height: document.body.style.height,
      touchAction: document.body.style.touchAction,
      overscrollBehavior: document.body.style.overscrollBehavior,
    };

    originalHtmlStyles = {
      overflow: document.documentElement.style.overflow,
      height: document.documentElement.style.height,
      overscrollBehavior: document.documentElement.style.overscrollBehavior,
    };

    // 1. Lock documentElement (html)
    document.documentElement.style.overflow = 'hidden';
    document.documentElement.style.height = '100%';
    document.documentElement.style.overscrollBehavior = 'none';
    document.documentElement.classList.add('modal-open');

    // 2. Lock body with position: fixed at exact scroll position to freeze mobile & desktop
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${savedScrollY}px`;
    document.body.style.left = '0px';
    document.body.style.right = '0px';
    document.body.style.width = '100%';
    document.body.style.height = '100%';
    document.body.style.overscrollBehavior = 'none';
    document.body.classList.add('modal-open');

    // 3. Attach passive: false touchmove listener to block dragging on backdrops
    document.addEventListener('touchmove', preventBackdropTouchMove, { passive: false });
  }

  activeLocksCount++;
}

export function unlockBodyScroll() {
  if (typeof document === 'undefined') return;

  activeLocksCount = Math.max(0, activeLocksCount - 1);

  if (activeLocksCount === 0 && originalBodyStyles && originalHtmlStyles) {
    // 1. Remove touchmove blocker
    document.removeEventListener('touchmove', preventBackdropTouchMove);

    // 2. Restore documentElement
    document.documentElement.style.overflow = originalHtmlStyles.overflow;
    document.documentElement.style.height = originalHtmlStyles.height;
    document.documentElement.style.overscrollBehavior = originalHtmlStyles.overscrollBehavior;
    document.documentElement.classList.remove('modal-open');

    // 3. Restore body
    document.body.style.overflow = originalBodyStyles.overflow;
    document.body.style.position = originalBodyStyles.position;
    document.body.style.top = originalBodyStyles.top;
    document.body.style.left = originalBodyStyles.left;
    document.body.style.right = originalBodyStyles.right;
    document.body.style.width = originalBodyStyles.width;
    document.body.style.height = originalBodyStyles.height;
    document.body.style.touchAction = originalBodyStyles.touchAction;
    document.body.style.overscrollBehavior = originalBodyStyles.overscrollBehavior;
    document.body.classList.remove('modal-open');

    // 4. Restore scroll position smoothly
    window.scrollTo(0, savedScrollY);

    originalBodyStyles = null;
    originalHtmlStyles = null;
  }
}

/**
 * React hook to automatically lock body scroll when `isLocked` is true
 * and unlock when `isLocked` becomes false or when the component unmounts.
 */
export function useBodyScrollLock(isLocked: boolean) {
  useEffect(() => {
    if (!isLocked) return;

    lockBodyScroll();

    return () => {
      unlockBodyScroll();
    };
  }, [isLocked]);
}

export default useBodyScrollLock;
