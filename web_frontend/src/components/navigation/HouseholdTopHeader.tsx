import { useState, useRef, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import {
  Bell,
  Phone,
  Plus,
  ChevronDown,
  User,
  LogOut,
  Clock,
  Settings,
  ShieldCheck,
  Gift,
  Headphones,
} from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import styles from './HouseholdTopHeader.module.css';

export function HouseholdTopHeader() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Scroll Auto-Hide State: Disappears when scrolling down, reappears when scrolling up
  const [isVisible, setIsVisible] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
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
        }
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const getPageMeta = () => {
    const path = location.pathname;
    if (path.includes('/household/rates') || path.includes('/household/market-prices')) {
      return {
        title: 'Chennai Scrap Market Prices',
        subtitle: 'Live verified doorstep pickup rates across Chennai',
      };
    }
    if (path.includes('/household/history')) {
      return {
        title: 'Order History',
        subtitle: 'View all your past scrap orders, payouts, and receipts',
      };
    }
    if (path.includes('/household/orders')) {
      return {
        title: 'Active Scrap Orders',
        subtitle: 'Track your scheduled doorstep pickups with live updates',
      };
    }
    if (path.includes('/household/notifications')) {
      return {
        title: 'Notifications & Alerts',
        subtitle: 'Stay updated on pickup statuses, rate surges, and payments',
      };
    }
    if (path.includes('/household/post-scrap')) {
      return {
        title: 'Schedule a New Pickup',
        subtitle: "Fill in the details and we'll pick up your scrap with verified digital weighing",
      };
    }
    if (path.includes('/household/profile')) {
      return {
        title: 'Household Profile',
        subtitle: 'Manage your doorstep pickup addresses and contact info',
      };
    }
    return {
      title: 'Household Dashboard',
      subtitle: 'Overview of doorstep scrap pickups, live market rates, and earnings',
    };
  };

  const meta = getPageMeta();
  const displayName = user?.name || 'Ramesh Kumar';
  const initial = displayName.charAt(0).toUpperCase() || 'R';

  const handleLogout = () => {
    setProfileDropdownOpen(false);
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <header
      className={`${styles.topHeader} ${!isVisible ? styles.topHeaderHidden : ''} ${
        isScrolled ? styles.topHeaderScrolled : ''
      }`}
    >
      {/* 1. Left: Mobile Brand Logo & Name / Desktop Page Meta */}
      <div className={styles.titleCol}>
        <Link to="/household" className={styles.mobileBrandLink}>
          <img src="/logo-icon.png" alt="Scrap Anna" className={styles.mobileLogoImg} />
          <div className={styles.mobileBrandTextWrap}>
            <div className={styles.mobileBrandRow}>
              <span className={styles.mobileBrandTitle}>
                <span className={styles.brandTitleScrap}>Scrap </span>
                <span className={styles.brandTitleAnna}>Anna</span>
              </span>
            </div>
            <span className={styles.mobileShopName}>CONNECT • COLLECT • RECYCLE</span>
          </div>
        </Link>

        <div className={styles.desktopPageMeta}>
          <h1 className={styles.pageHeading}>{meta.title}</h1>
          <p className={styles.pageSubheading}>{meta.subtitle}</p>
        </div>
      </div>

      {/* 2. Right Actions */}
      <div className={styles.rightActions}>
        <Link to="/household/post-scrap" className={styles.quickPostBtn}>
          <Plus size={16} />
          <span>Post Scrap</span>
        </Link>

        <a href="tel:+919840123456" className={styles.supportPill} title="Doorstep Support Helpline">
          <Phone size={14} className={styles.phoneIcon} />
          <span>+91 98401 23456</span>
        </a>

        <Link
          to="/household/notifications"
          className={styles.notifBtn}
          title="Notifications & Alerts"
        >
          <Bell size={18} />
          <span className={styles.notifDot} />
        </Link>

        {/* User Profile Dropdown */}
        <div className={styles.profileDropdownWrap} ref={dropdownRef}>
          <div
            className={styles.profileBadge}
            onClick={() => setProfileDropdownOpen((prev) => !prev)}
            role="button"
            tabIndex={0}
          >
            <div className={styles.avatarIconBox}>{initial}</div>
            <div className={styles.profileInfoCol}>
              <span className={styles.companyName}>{displayName}</span>
              <span className={styles.companyLocation}>Anna Nagar, Chennai</span>
            </div>
            <ChevronDown size={14} color="#64748b" className={styles.chevronIcon} />
          </div>

          {profileDropdownOpen && (
            <div className={styles.dropdownMenu}>
              <Link
                to="/household/profile"
                className={styles.dropdownItem}
                onClick={() => setProfileDropdownOpen(false)}
              >
                <User size={16} />
                <span>My Profile</span>
              </Link>

              <Link
                to="/household/refer-earn"
                className={styles.dropdownItem}
                onClick={() => setProfileDropdownOpen(false)}
              >
                <Gift size={16} color="#d97706" />
                <span>Refer & Earn</span>
              </Link>

              <Link
                to="/household/support"
                className={styles.dropdownItem}
                onClick={() => setProfileDropdownOpen(false)}
              >
                <Headphones size={16} color="#2563eb" />
                <span>Support</span>
              </Link>

              <button
                type="button"
                className={`${styles.dropdownItem} ${styles.logoutItem}`}
                onClick={handleLogout}
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default HouseholdTopHeader;
