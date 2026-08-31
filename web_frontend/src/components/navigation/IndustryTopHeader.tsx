import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Bell,
  Building2,
  CheckCircle2,
  ChevronDown,
  Phone,
  Plus,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import styles from './IndustryTopHeader.module.css';

export function IndustryTopHeader() {
  const location = useLocation();
  const [showNotifications, setShowNotifications] = useState(false);

  const [isVisible, setIsVisible] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);

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

  // Dynamic Page Title mapping
  const getPageMeta = () => {
    const path = location.pathname;
    if (path.includes('/industry/market-prices')) {
      return { title: 'Chennai Scrap Market Prices', subtitle: 'Indicative daily wholesale market trading benchmarks' };
    }
    if (path.includes('/industry/post-requirement')) {
      return { title: 'Post Scrap Requirement', subtitle: 'List bulk factory scrap and receive verified merchant bids' };
    }
    if (path.includes('/industry/requests')) {
      return { title: 'My Scrap Requests', subtitle: 'Track your posted requirements and quote progress' };
    }
    if (path.includes('/industry/quotes')) {
      return { title: 'Quotes Received', subtitle: 'Compare and accept quotes submitted by verified merchants' };
    }
    if (path.includes('/industry/orders')) {
      return { title: 'Pickup Orders', subtitle: 'Manage active, scheduled, and completed scrap dispatches' };
    }
    if (path.includes('/industry/transactions')) {
      return { title: 'Transactions & Invoices', subtitle: 'View verified weighbridge settlements and payment history' };
    }
    if (path.includes('/industry/profile')) {
      return { title: 'Enterprise Profile', subtitle: 'Manage company registration, pickup facilities, and contact details' };
    }
    return { title: 'Industry Dashboard', subtitle: 'Overview of bulk scrap sales, active bids, and scheduled pickups' };
  };

  const pageMeta = getPageMeta();

  return (
    <header
      className={`${styles.topHeader} ${!isVisible ? styles.topHeaderHidden : ''} ${
        isScrolled ? styles.topHeaderScrolled : ''
      }`}
    >
      {/* 1. Left: Mobile Brand Logo & Name / Desktop Page Meta */}
      <div className={styles.titleCol}>
        <Link to="/industry/dashboard" className={styles.mobileBrandLink}>
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
          <h1 className={styles.pageHeading}>{pageMeta.title}</h1>
          <p className={styles.pageSubheading}>{pageMeta.subtitle}</p>
        </div>
      </div>

      {/* 2. Right Action Strip */}
      <div className={styles.rightActions}>
        {/* Post Quick Button */}
        <Link to="/industry/post-requirement" className={styles.quickPostBtn}>
          <Plus size={16} />
          <span>Post Requirement</span>
        </Link>

        {/* Support Phone Help */}
        <a href="tel:+919840123456" className={styles.supportPill} title="Enterprise Support Hotline">
          <Phone size={14} className={styles.phoneIcon} />
          <span>+91 98401 23456</span>
        </a>

        {/* Notifications Icon */}
        <div className={styles.notifWrapper}>
          <button
            type="button"
            className={styles.notifBtn}
            onClick={() => setShowNotifications(!showNotifications)}
            aria-label="View notifications"
          >
            <Bell size={18} />
            <span className={styles.notifPulseDot} />
          </button>

          {showNotifications && (
            <div className={styles.notifDropdown}>
              <div className={styles.notifHeader}>
                <span className={styles.notifTitle}>Notifications</span>
                <span className={styles.notifCount}>2 New</span>
              </div>
              <div className={styles.notifList}>
                <div className={styles.notifItem}>
                  <div className={styles.notifDotGreen} />
                  <div className={styles.notifTextGroup}>
                    <p className={styles.notifMsg}>
                      <strong>Meenakshi Auto Castings</strong> submitted a quote of ₹18,500 for Metal Scrap.
                    </p>
                    <span className={styles.notifTime}>5 mins ago</span>
                  </div>
                </div>
                <div className={styles.notifItem}>
                  <div className={styles.notifDotBlue} />
                  <div className={styles.notifTextGroup}>
                    <p className={styles.notifMsg}>
                      Pickup scheduled for <strong>16 May 2025</strong> with Ramesh Traders.
                    </p>
                    <span className={styles.notifTime}>1 hour ago</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Industry Profile Block */}
        <Link to="/industry/profile" className={styles.profileBlock}>
          <div className={styles.avatarCircle}>
            <Building2 size={18} />
          </div>
          <div className={styles.profileText}>
            <div className={styles.profileNameRow}>
              <span className={styles.companyName}>Sri Venkatesh Industries</span>
              <CheckCircle2 size={13} fill="#16a34a" color="#ffffff" />
            </div>
            <span className={styles.companyLocation}>SIDCO Guindy, Chennai</span>
          </div>
        </Link>
      </div>
    </header>
  );
}
