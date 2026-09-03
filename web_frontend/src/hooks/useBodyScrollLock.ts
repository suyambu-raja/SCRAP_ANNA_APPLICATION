import { useEffect } from 'react';

/**
 * Custom hook to lock background page scrolling when a modal, overlay,
 * or position-fixed sheet/drawer is open.
 * Prevents scroll bleed/chaining to the underlying background page.
 */
export function useBodyScrollLock(isLocked: boolean) {
  useEffect(() => {
    if (!isLocked) return;

    const originalOverflow = document.body.style.overflow;
    const originalOverscroll = document.body.style.overscrollBehavior;
    const originalTouchAction = document.body.style.touchAction;

    // Lock scrolling on background body
    document.body.style.overflow = 'hidden';
    document.body.style.overscrollBehavior = 'none';
    document.body.classList.add('modal-open');

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.overscrollBehavior = originalOverscroll;
      document.body.style.touchAction = originalTouchAction;
      document.body.classList.remove('modal-open');
    };
  }, [isLocked]);
}

export default useBodyScrollLock;
