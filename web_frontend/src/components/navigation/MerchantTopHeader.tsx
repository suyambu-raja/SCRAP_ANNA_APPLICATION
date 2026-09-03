import { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import {
  Bell,
  Store,
  ChevronDown,
  User,
  Settings,
  LogOut,
  Plus,
  HelpCircle,
  Gift,
  CreditCard,
  Receipt,
} from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import styles from './MerchantTopHeader.module.css';

export function MerchantTopHeader() {
  const location = useLocation();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const [isVisible, setIsVisible] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const lastScrollYRef = useRef(0);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Smart Hide on Scroll Down, Immediate Reveal on Scroll Up (Backward)
  useEffect(() => {
    let lastScrollY = window.scrollY || document.documentElement.scrollTop;

    const handleScroll = () => {
      const currentScrollY = window.scrollY || document.documentElement.scrollTop;
      const delta = currentScrollY - lastScrollY;

      // Always visible when near the top
      if (currentScrollY <= 30) {
        setIsVisible(true);
        setIsScrolled(false);
      } else {
        setIsScrolled(true);
        // Scrolling UP (Backward) -> Immediately show
        if (delta < -1) {
          setIsVisible(true);
        }
        // Scrolling DOWN -> Slide navbar up out of view
        else if (delta > 4 && currentScrollY > 50) {
          setIsVisible(false);
          setDropdownOpen(false);
        }
      }

      lastScrollY = currentScrollY <= 0 ? 0 : currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Determine dynamic page title from pathname
  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('/requests')) return 'New Scrap Requests';
    if (path.includes('/quotes') || path.includes('/merchant-offers')) return 'My Quotes';
    if (path.includes('/orders')) return 'My Orders';
    if (path.includes('/ride')) return "Today's Ride";
    if (path.includes('/transactions') || (path.includes('/profile') && location.search.includes('transactions'))) return 'Transactions';
    if (path.includes('/reusable-products') || path.includes('/marketplace')) return 'Reusable Marketplace';
    if (path.includes('/profile')) return 'Merchant Profile';
    if (path.includes('/support')) return 'Support Desk';
    if (path.includes('/settings')) return 'Settings';
    return 'Dashboard';
  };

  return (
    <header
      className={`${styles.topHeader} ${!isVisible ? styles.topHeaderHidden : ''} ${
        isScrolled ? styles.topHeaderScrolled : ''
      }`}
    >
      {/* Left: Mobile Brand Logo & Name / Desktop Dynamic Page Title */}
      <div className={styles.leftCol}>
        <Link to="/dashboard/merchant" className={styles.mobileBrandLink}>
          <img src="/logo-icon.png" alt="Bill Scrap" className={styles.mobileLogoImg} />
          <div className={styles.mobileBrandTextWrap}>
            <div className={styles.mobileBrandRow}>
              <span className={styles.mobileBrandTitle}>
                <span className={styles.brandTitleScrap}>Bill </span>
                <span className={styles.brandTitleAnna}>Scrap</span>
              </span>
            </div>
            <span className={styles.mobileShopName}>CONNECT • COLLECT • RECYCLE</span>
          </div>
        </Link>
        <h1 className={styles.pageTitle}>{getPageTitle()}</h1>
      </div>

      {/* Right: Add Product (on marketplace), Notification Bell, Language Globe, User Profile Dropdown */}
      <div className={styles.rightActions}>
        {location.pathname.includes('/reusable-products') && (
          <button type="button" className={styles.addProductBtn}>
            <Plus size={15} />
            <span>Add New Product</span>
          </button>
        )}

        {/* Notification Bell */}
        <button
          type="button"
          className={styles.iconBtn}
          title="3 New Notifications"
          aria-label="3 new notifications"
          onClick={() => { }}
        >
          <Bell size={18} />
          <span className={styles.badgeCount}>3</span>
        </button>

        {/* User Account Dropdown */}
        <div className={styles.userMenuWrapper} ref={dropdownRef}>
          <button
            type="button"
            className={styles.userMenuBtn}
            onClick={() => setDropdownOpen(!dropdownOpen)}
            aria-expanded={dropdownOpen}
          >
            <div className={styles.userAvatar}>
              <Store size={18} />
            </div>
            <div className={styles.userInfo}>
              <span className={styles.userName}>{user?.name || 'Ramesh Traders'}</span>
              <span className={styles.userRole}>Merchant</span>
            </div>
            <ChevronDown
              size={14}
              className={dropdownOpen ? `${styles.chevron} ${styles.chevronOpen}` : styles.chevron}
            />
          </button>

          {dropdownOpen && (
            <div className={styles.dropdownMenu}>
              <div className={styles.dropdownHeader}>
                <div className={styles.dropdownHeaderTitle}>{user?.name || 'Ramesh Traders'}</div>
                <div className={styles.dropdownHeaderSub}>{user?.email || 'ramesh@traders.in'}</div>
              </div>
              <Link
                to="/profile"
                className={styles.dropdownItem}
                onClick={() => setDropdownOpen(false)}
              >
                <User size={15} />
                <span>Profile</span>
              </Link>
              <Link
                to="/transactions"
                className={styles.dropdownItem}
                onClick={() => setDropdownOpen(false)}
              >
                <CreditCard size={15} />
                <span>Transactions &amp; Ledger</span>
              </Link>
              <Link
                to="/support"
                className={styles.dropdownItem}
                onClick={() => setDropdownOpen(false)}
              >
                <HelpCircle size={15} />
                <span>Support</span>
              </Link>
              <Link
                to="/profile"
                className={styles.dropdownItem}
                onClick={() => setDropdownOpen(false)}
              >
                <Gift size={15} />
                <span>Refer &amp; Earn</span>
              </Link>
              <Link
                to="/settings"
                className={styles.dropdownItem}
                onClick={() => setDropdownOpen(false)}
              >
                <Settings size={15} />
                <span>Settings</span>
              </Link>
              <div style={{ height: 1, backgroundColor: '#f1f5f9', margin: '4px 0' }} />
              <button
                type="button"
                className={`${styles.dropdownItem} ${styles.dropdownItemDanger}`}
                onClick={handleLogout}
              >
                <LogOut size={15} />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
